import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createHash } from "crypto";

// =============================================================================
// LEAD MAGNET FORM HANDLER — Netlify Function
// =============================================================================
// Accepts name + email, deduplicates by email, stores subscriber in Netlify
// Blobs, and delivers a PDF link via Resend (raw fetch). Idempotent: repeat
// submissions for the same email return success without re-sending.
//
// Env vars required: RESEND_API_KEY, FROM_EMAIL, LEAD_MAGNET_PDF_URL, SITE_URL
// =============================================================================

const SITE_URL = process.env.SITE_URL;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": SITE_URL || "",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "X-Content-Type-Options": "nosniff",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Subscriber {
  id: string;
  source: "subscriber";
  name: string;
  email: string;
  submittedAt: string;
}

interface SubscriberIndexEntry {
  id: string;
  email: string;
  name: string;
  submittedAt: string;
  source: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** One-way hash of IP for rate-limit key. SHA-256 truncated to 16 hex chars. */
function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c] ?? c)
  );
}

function err(status: number, message: string) {
  return {
    statusCode: status,
    headers: CORS_HEADERS,
    body: JSON.stringify({ success: false, error: message }),
  };
}

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const store = getStore({ name: "rate-limits", consistency: "strong" });
    const bucket = Math.floor(Date.now() / 3_600_000);
    const key = `sub-${hashIP(ip)}-${bucket}`;
    const raw = await store.get(key);
    const count = raw ? parseInt(raw, 10) : 0;
    if (count >= 3) return false;
    await store.set(key, String(count + 1));
    return true;
  } catch (e) {
    console.error("[lead-magnet] rate-limit store error:", e);
    return true; // Allow on error
  }
}

// ---------------------------------------------------------------------------
// Subscriber store
// ---------------------------------------------------------------------------

async function isExistingSubscriber(email: string): Promise<boolean> {
  try {
    const store = getStore({ name: "subscribers", consistency: "strong" });
    const raw = await store.get("_subscribers_index");
    if (!raw) return false;
    const index: SubscriberIndexEntry[] = JSON.parse(raw);
    return index.some((e) => e.email.toLowerCase() === email.toLowerCase());
  } catch (e) {
    console.error("[lead-magnet] failed to read subscribers index:", e);
    return false; // Treat as new on error so we don't silently drop leads
  }
}

async function storeSubscriber(subscriber: Subscriber): Promise<void> {
  const store = getStore({ name: "subscribers", consistency: "strong" });
  await store.set(subscriber.id, JSON.stringify(subscriber));

  const raw = await store.get("_subscribers_index");
  const index: SubscriberIndexEntry[] = raw ? JSON.parse(raw) : [];
  index.unshift({
    id: subscriber.id,
    email: subscriber.email,
    name: subscriber.name,
    submittedAt: subscriber.submittedAt,
    source: subscriber.source,
  });
  await store.set("_subscribers_index", JSON.stringify(index));
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL || "noreply@notifications.example.com",
      to,
      subject,
      html,
      text,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body}`);
  }
}

function deliveryHtml(firstName: string, pdfUrl: string): string {
  const safeFirstName = escapeHtml(firstName);
  const safePdfUrl = escapeHtml(pdfUrl);

  return `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:sans-serif;background:#0a0a0a;color:#fff">
<table width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0a">
  <tr><td align="center" style="padding:40px 20px">
    <table width="600" cellspacing="0" cellpadding="0" style="background:#111;border-radius:12px;border:1px solid rgba(255,255,255,0.1);max-width:600px">
      <tr><td style="padding:28px 36px;background:linear-gradient(135deg,#0d3d56,#0a2a3d);border-radius:12px 12px 0 0;text-align:center">
        <h1 style="margin:0;font-size:22px;color:#fff">Vas material je pripraveny ke stazeni</h1>
      </td></tr>
      <tr><td style="padding:28px 36px">
        <p style="margin:0 0 16px;font-size:16px;color:#fff">Dobry den, ${safeFirstName},</p>
        <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6">
          Dekujeme za zajem. Zde je Vas slibeny material — stahujte bez omezeni, odkaz je platny bez omezeni.
        </p>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr><td align="center" style="padding:20px 0">
            <a href="${safePdfUrl}" target="_blank"
               style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#D40074,#9F0057);color:#fff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:700;box-shadow:0 4px 14px rgba(212,0,116,0.4)">
              Stahnout PDF
            </a>
          </td></tr>
        </table>
        <p style="margin:24px 0 0;font-size:13px;color:rgba(255,255,255,0.45);text-align:center">
          Odkaz je platny bez omezeni &bull; Stahujte kdykoli
        </p>
      </td></tr>
      <tr><td style="padding:16px 36px 28px;text-align:center;border-top:1px solid rgba(255,255,255,0.06)">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3)">
          Tato zprava byla odeslana automaticky. Neodpovidejte na ni.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function deliveryText(firstName: string, pdfUrl: string): string {
  return [
    `Dobry den, ${firstName},`,
    ``,
    `Dekujeme za zajem. Zde je odkaz na Vas material:`,
    ``,
    pdfUrl,
    ``,
    `Odkaz je platny bez omezeni.`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (!SITE_URL) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Server configuration error' }) };
  }

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return err(405, "Method not allowed");
  }

  // Body size guard (15 KB)
  if ((event.body?.length ?? 0) > 15_360) {
    return err(400, "Request too large");
  }

  // Parse body
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(event.body || "{}");
  } catch {
    return err(400, "Invalid JSON");
  }

  // Honeypot
  if (raw._honeypot !== "" && raw._honeypot != null) {
    return err(400, "Invalid request");
  }

  // Extract and sanitize
  const name = typeof raw.name === "string" ? sanitize(raw.name) : "";
  const email = typeof raw.email === "string" ? sanitize(raw.email) : "";

  // Validate
  if (!name || name.length > 200) {
    return err(400, "Jmeno je povinne (max 200 znaku)");
  }
  if (!email || !isValidEmail(email)) {
    return err(400, "Zadejte platny e-mail");
  }

  // Rate limiting
  const ip =
    event.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    event.headers["client-ip"] ||
    "unknown";

  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return err(429, "Prilis mnoho pokusu. Zkuste to za hodinu.");
  }

  // Idempotency: check for existing subscriber
  const alreadySubscribed = await isExistingSubscriber(email);
  if (alreadySubscribed) {
    // Return success without storing duplicate or sending another email
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true, message: "Dekujeme! Material byl odeslan." }),
    };
  }

  // Build subscriber record
  const subscriber: Subscriber = {
    id: `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    source: "subscriber",
    name,
    email,
    submittedAt: new Date().toISOString(),
  };

  // Store subscriber (must succeed)
  try {
    await storeSubscriber(subscriber);
  } catch (e) {
    console.error("[lead-magnet] blob storage failed:", e);
    return err(500, "Ulozeni selhalo. Zkuste to znovu.");
  }

  // Send delivery email
  const pdfUrl = process.env.LEAD_MAGNET_PDF_URL || "#";
  const firstName = name.split(" ")[0];

  try {
    await sendEmail(
      email,
      "Vas material je pripraveny ke stazeni",
      deliveryHtml(firstName, pdfUrl),
      deliveryText(firstName, pdfUrl)
    );
  } catch (e) {
    console.error("[lead-magnet] delivery email failed:", e);
    // Non-fatal: subscriber is stored, user can be contacted manually
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ success: true, message: "Dekujeme! Material byl odeslan." }),
  };
};

export { handler };
