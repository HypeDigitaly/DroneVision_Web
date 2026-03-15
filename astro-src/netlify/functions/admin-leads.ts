import type { Handler, HandlerEvent } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "crypto";

// =============================================================================
// ADMIN LEADS API — Netlify Function
// =============================================================================
// GET-only endpoint that returns ALL leads from quiz-leads, contact-leads,
// and subscribers Blob stores merged into a single sorted response.
// Protected by HTTP Basic Auth (admin:ADMIN_PASSWORD).
//
// Query params:
//   source  — filter by "quiz" | "contact" | "subscriber"
//   limit   — items per page (1-500, default 200)
//   offset  — pagination offset (default 0)
//
// Env vars required: ADMIN_PASSWORD, SITE_URL
// =============================================================================

const SITE_URL = process.env.SITE_URL;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": SITE_URL || "",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
  "Pragma": "no-cache",
};

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/** Constant-time comparison using Node.js native crypto.timingSafeEqual.
 *  Both values are SHA-256 hashed first so the comparison always operates
 *  on equal-length buffers regardless of input length. */
function constantTimeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
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
// Rate limiting
// ---------------------------------------------------------------------------

async function checkAdminRateLimit(ip: string): Promise<boolean> {
  try {
    const store = getStore({ name: "rate-limits", consistency: "strong" });
    const bucket = Math.floor(Date.now() / 3_600_000);
    const hashedIp = createHash("sha256").update(ip).digest("hex").slice(0, 16);
    const key = `admin-${hashedIp}-${bucket}`;
    const raw = await store.get(key);
    const count = raw ? parseInt(raw, 10) : 0;
    if (count >= 10) return false;
    await store.set(key, String(count + 1));
    return true;
  } catch (e) {
    // Fail closed for admin endpoint — deny request when rate-limit store is unavailable
    console.error("[admin-leads] rate-limit store error:", e);
    return false;
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

async function readIndex(storeName: string, source: string, indexKey?: string): Promise<IndexEntry[]> {
  try {
    const store = getStore({ name: storeName, consistency: "strong" });
    const key = indexKey ?? (storeName === "subscribers" ? "_subscribers_index" : "_leads_index");
    const raw = await store.get(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.error(`[admin-leads] Index in ${storeName} is not an array`);
      return [];
    }
    return (parsed as IndexEntry[]).map((e) => ({ ...e, source: e.source || source }));
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

function storeNameForSource(source: string): string {
  if (source === "quiz") return "quiz-leads";
  if (source === "subscriber") return "subscribers";
  return "contact-leads";
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const handler: Handler = async (event: HandlerEvent) => {
  if (!SITE_URL) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: "Server configuration error" }),
    };
  }

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return err(405, "Method not allowed");
  }

  const ip =
    event.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    event.headers["client-ip"] ||
    "unknown";

  const allowed = await checkAdminRateLimit(ip);
  if (!allowed) {
    return err(429, "Too many requests", { "Retry-After": "3600" });
  }

  if (!authenticate(event.headers["authorization"])) {
    return err(401, "Unauthorized", { "WWW-Authenticate": 'Basic realm="Admin"' });
  }

  // Query params
  const params = event.queryStringParameters || {};
  const sourceFilter = params.source as string | undefined;
  const limit = clampInt(params.limit ?? null, 1, 500, 200);
  const offset = clampInt(params.offset ?? null, 0, Number.MAX_SAFE_INTEGER, 0);

  if (sourceFilter && sourceFilter !== "quiz" && sourceFilter !== "contact" && sourceFilter !== "subscriber") {
    return err(400, "source must be 'quiz', 'contact', or 'subscriber'");
  }

  // Read ALL indexes in parallel
  const [quizIndex, contactIndex, subscriberIndex] = await Promise.all([
    readIndex("quiz-leads", "quiz", "_quiz_leads_index"),
    readIndex("contact-leads", "contact"),
    readIndex("subscribers", "subscriber"),
  ]);

  // Counts per source (before filtering)
  const counts = {
    quiz: quizIndex.length,
    contact: contactIndex.length,
    subscriber: subscriberIndex.length,
    total: quizIndex.length + contactIndex.length + subscriberIndex.length,
  };

  // Merge all leads
  let merged: IndexEntry[] = [...quizIndex, ...contactIndex, ...subscriberIndex];

  // Filter by source if requested
  if (sourceFilter) {
    merged = merged.filter((e) => e.source === sourceFilter);
  }

  // Sort by submittedAt descending (NaN-safe)
  const safeTs = (s: string): number => {
    const ms = new Date(s).getTime();
    return isNaN(ms) ? 0 : ms;
  };
  merged.sort((a, b) => safeTs(b.submittedAt) - safeTs(a.submittedAt));

  const total = merged.length;
  const page = merged.slice(offset, offset + limit);

  // Fetch full records for the current page
  const fullLeads = await Promise.all(
    page.map(async (entry) => {
      const storeName = storeNameForSource(entry.source);
      const full = await fetchFullLead(storeName, entry.id);
      if (!full) {
        return { ...entry, source: entry.source } as FullLead;
      }
      // Ensure source is set
      full.source = full.source || entry.source;
      // Truncate message
      if (typeof full.message === "string" && full.message.length > 200) {
        full.message = full.message.slice(0, 200) + "\u2026";
      }
      // Truncate aiAnalysis.content for quiz leads
      const ai = full.aiAnalysis;
      if (
        ai !== null &&
        typeof ai === "object" &&
        !Array.isArray(ai) &&
        typeof (ai as Record<string, unknown>).content === "string"
      ) {
        const aiRecord = ai as Record<string, unknown>;
        const content = aiRecord.content as string;
        if (content.length > 800) {
          full.aiAnalysis = { ...aiRecord, content: content.slice(0, 800) + "\u2026" };
        }
      }
      return full;
    })
  );

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      leads: fullLeads,
      counts,
      total,
      offset,
      limit,
    }),
  };
};

export { handler };
