import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createHash } from "crypto";

// =============================================================================
// ADMIN LEADS API — Netlify Function
// =============================================================================
// GET-only endpoint that returns paginated leads from both contact-leads and
// subscribers Blob stores. Protected by HTTP Basic Auth (admin:ADMIN_PASSWORD).
//
// Env vars required: ADMIN_PASSWORD, SITE_URL
// =============================================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.SITE_URL || "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
  "X-Content-Type-Options": "nosniff",
};

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/** Prevent timing attacks when comparing passwords.
 *  Both values are SHA-256 hashed before comparison so the XOR loop always
 *  operates on equal-length 64-char hex strings, regardless of input length. */
function constantTimeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest("hex");
  const hb = createHash("sha256").update(b).digest("hex");
  let result = 0;
  for (let i = 0; i < ha.length; i++) {
    result |= ha.charCodeAt(i) ^ hb.charCodeAt(i);
  }
  return result === 0;
}

function authenticate(authHeader: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error("[admin-leads] ADMIN_PASSWORD env var is not set");
    return false;
  }
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;

  let decoded: string;
  try {
    decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
  } catch {
    return false;
  }

  // Format: admin:<password>
  const colonIdx = decoded.indexOf(":");
  if (colonIdx === -1) return false;
  const suppliedUsername = decoded.slice(0, colonIdx);
  const suppliedPassword = decoded.slice(colonIdx + 1);
  if (suppliedUsername !== "admin") return false;
  return constantTimeEqual(suppliedPassword, password);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface IndexEntry {
  id: string;
  email: string;
  name: string;
  submittedAt: string;
  source: string;
}

interface FullLead extends IndexEntry {
  phone?: string;
  company?: string;
  message?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Rate limiting (admin brute-force protection)
// ---------------------------------------------------------------------------

async function checkAdminRateLimit(ip: string): Promise<boolean> {
  try {
    const store = getStore({ name: "rate-limits", consistency: "strong" });
    const bucket = Math.floor(Date.now() / 3_600_000); // 1-hour bucket
    const hashedIp = createHash("sha256").update(ip).digest("hex").slice(0, 16);
    const key = `admin-${hashedIp}-${bucket}`;
    const raw = await store.get(key);
    const count = raw ? parseInt(raw, 10) : 0;
    if (count >= 10) return false;
    await store.set(key, String(count + 1));
    return true;
  } catch (e) {
    // If the rate-limit store is unavailable, allow the request through
    console.error("[admin-leads] rate-limit store error:", e);
    return true;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function err(status: number, message: string, extraHeaders?: Record<string, string>) {
  return {
    statusCode: status,
    headers: { ...CORS_HEADERS, ...extraHeaders },
    body: JSON.stringify({ success: false, error: message }),
  };
}

function clampInt(value: string | null, min: number, max: number, fallback: number): number {
  if (value == null) return fallback;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function readIndex(storeName: string, source: string): Promise<IndexEntry[]> {
  try {
    const store = getStore({ name: storeName, consistency: "strong" });
    const indexKey = storeName === "subscribers" ? "_subscribers_index" : "_leads_index";
    const raw = await store.get(indexKey);
    if (!raw) return [];
    const parsed: IndexEntry[] = JSON.parse(raw);
    // Ensure each entry carries the correct source label
    return parsed.map((e) => ({ ...e, source: e.source || source }));
  } catch (e) {
    console.error(`[admin-leads] Failed to read index from ${storeName}:`, e);
    return [];
  }
}

async function fetchFullLead(storeName: string, id: string): Promise<FullLead | null> {
  try {
    const store = getStore({ name: storeName, consistency: "strong" });
    const raw = await store.get(id);
    if (!raw) return null;
    return JSON.parse(raw) as FullLead;
  } catch (e) {
    console.error(`[admin-leads] Failed to fetch lead ${id} from ${storeName}:`, e);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return err(405, "Method not allowed");
  }

  // Rate limiting — must run before auth to prevent brute-force
  const ip =
    event.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    event.headers["client-ip"] ||
    "unknown";

  const allowed = await checkAdminRateLimit(ip);
  if (!allowed) {
    return err(429, "Too many requests", {
      "Retry-After": "3600",
    });
  }

  // Authentication
  if (!authenticate(event.headers["authorization"])) {
    return err(401, "Unauthorized", {
      "WWW-Authenticate": 'Basic realm="Admin"',
    });
  }

  // Query params
  const params = event.queryStringParameters || {};
  const sourceFilter = params.source as string | undefined;
  const limit = clampInt(params.limit ?? null, 1, 200, 50);
  const offset = clampInt(params.offset ?? null, 0, Number.MAX_SAFE_INTEGER, 0);

  // Validate source filter
  if (sourceFilter && sourceFilter !== "contact" && sourceFilter !== "subscriber") {
    return err(400, "source must be 'contact' or 'subscriber'");
  }

  // Read both indexes in parallel
  const [contactIndex, subscriberIndex] = await Promise.all([
    readIndex("contact-leads", "contact"),
    readIndex("subscribers", "subscriber"),
  ]);

  // Merge and sort by submittedAt descending
  const merged: IndexEntry[] = [...contactIndex, ...subscriberIndex].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  // Filter by source
  const filtered = sourceFilter ? merged.filter((e) => e.source === sourceFilter) : merged;

  const total = filtered.length;

  // Paginate index entries
  const page = filtered.slice(offset, offset + limit);

  // Fetch full records for the current page
  const fullLeads = await Promise.all(
    page.map(async (entry) => {
      const storeName = entry.source === "subscriber" ? "subscribers" : "contact-leads";
      const full = await fetchFullLead(storeName, entry.id);
      if (!full) {
        // Fall back to index data if full record is unavailable
        return entry as FullLead;
      }
      // Truncate message to 200 chars in API response
      if (typeof full.message === "string" && full.message.length > 200) {
        full.message = full.message.slice(0, 200) + "…";
      }
      return full;
    })
  );

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      leads: fullLeads,
      total,
      offset,
      limit,
    }),
  };
};

export { handler };
