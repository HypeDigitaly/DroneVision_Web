import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createHash } from "crypto";

// =============================================================================
// CONTACT FORM HANDLER — Netlify Function
// =============================================================================
// Receives JSON form submissions, validates input, rate-limits by IP,
// stores the lead in Netlify Blobs, and sends emails via Resend (raw fetch).
// Env vars required: RESEND_API_KEY, FROM_EMAIL, SITE_URL
// Optional:         CONTACT_NOTIFICATION_EMAILS (comma-separated)
// =============================================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.SITE_URL || "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "X-Content-Type-Options": "nosniff",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContactLead {
  id: string;
  source: "contact";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  submittedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** One-way hash of IP for rate-limit key. SHA-256 truncated to 16 hex chars. */
function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

/** Strip HTML tags and trim whitespace. */
function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

/** RFC-5321 email length + basic format check. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Constant-time compare to prevent timing attacks (used by admin-leads; included here for parity). */
function ok(msg: string, extra?: Record<string, unknown>) {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ success: true, ...extra, message: msg }),
  };
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
    const bucket = Math.floor(Date.now() / 3_600_000); // 1-hour bucket
    const key = `contact-${hashIP(ip)}-${bucket}`;
    const raw = await store.get(key);
    const count = raw ? parseInt(raw, 10) : 0;
    if (count >= 5) return false;
    await store.set(key, String(count + 1));
    return true;
  } catch (e) {
    // If rate-limit store is unavailable, allow the request through
    console.error("[rate-limit] store error:", e);
    return true;
  }
}

// ---------------------------------------------------------------------------
// Blob storage
// ---------------------------------------------------------------------------

async function storeLead(lead: ContactLead): Promise<void> {
  const store = getStore({ name: "contact-leads", consistency: "strong" });
  await store.set(lead.id, JSON.stringify(lead));

  const indexRaw = await store.get("_leads_index");
  const index: Array<{ id: string; email: string; name: string; submittedAt: string; source: string }> =
    indexRaw ? JSON.parse(indexRaw) : [];
  index.unshift({ id: lead.id, email: lead.email, name: lead.name, submittedAt: lead.submittedAt, source: lead.source });
  await store.set("_leads_index", JSON.stringify(index));
}

// ---------------------------------------------------------------------------
// Email sending
// ---------------------------------------------------------------------------

async function sendEmail(to: string | string[], subject: string, html: string, text: string): Promise<void> {
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

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c] ?? c));
}

function notificationHtml(lead: ContactLead): string {
  const rows = [
    ["Jméno", escapeHtml(lead.name)],
    ["E-mail", `<a href="mailto:${escapeHtml(lead.email)}" style="color:#00A39A">${escapeHtml(lead.email)}</a>`],
    ...(lead.phone ? [["Telefon", escapeHtml(lead.phone)]] : []),
    ...(lead.company ? [["Firma", escapeHtml(lead.company)]] : []),
    ["Zpráva", `<span style="white-space:pre-wrap">${escapeHtml(lead.message)}</span>`],
    ["Čas", escapeHtml(lead.submittedAt)],
  ]
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;font-size:13px;color:rgba(255,255,255,0.5);width:90px;vertical-align:top">${label}</td>
        <td style="padding:8px 12px;font-size:14px;color:#fff;vertical-align:top">${value}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:sans-serif;background:#0a0a0a;color:#fff">
<table width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0a">
  <tr><td align="center" style="padding:40px 20px">
    <table width="600" cellspacing="0" cellpadding="0" style="background:#111;border-radius:12px;border:1px solid rgba(255,255,255,0.1);max-width:600px">
      <tr><td style="padding:28px 36px;background:linear-gradient(135deg,#0d3d56,#0a2a3d);border-radius:12px 12px 0 0;text-align:center">
        <h1 style="margin:0;font-size:20px;color:#fff">Nova zprava z kontaktniho formulare</h1>
      </td></tr>
      <tr><td style="padding:24px 36px">
        <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
          ${rows}
        </table>
      </td></tr>
      <tr><td style="padding:16px 36px 28px;text-align:center">
        <a href="mailto:${escapeHtml(lead.email)}" style="display:inline-block;padding:12px 28px;background:#00A39A;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600">Odpovedet</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function notificationText(lead: ContactLead): string {
  return [
    `Nova zprava z kontaktniho formulare`,
    `---`,
    `Jmeno:   ${lead.name}`,
    `E-mail:  ${lead.email}`,
    lead.phone ? `Telefon: ${lead.phone}` : null,
    lead.company ? `Firma:   ${lead.company}` : null,
    `Zprava:\n${lead.message}`,
    `Cas: ${lead.submittedAt}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function confirmationHtml(lead: ContactLead): string {
  const firstName = escapeHtml(lead.name.split(" ")[0]);
  const preview = escapeHtml(lead.message.slice(0, 300));

  return `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:sans-serif;background:#0a0a0a;color:#fff">
<table width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0a">
  <tr><td align="center" style="padding:40px 20px">
    <table width="600" cellspacing="0" cellpadding="0" style="background:#111;border-radius:12px;border:1px solid rgba(255,255,255,0.1);max-width:600px">
      <tr><td style="padding:28px 36px;background:linear-gradient(135deg,#0d3d56,#0a2a3d);border-radius:12px 12px 0 0;text-align:center">
        <h1 style="margin:0;font-size:20px;color:#fff">Potvrzeni prijeti zpravy</h1>
      </td></tr>
      <tr><td style="padding:28px 36px">
        <p style="margin:0 0 16px;font-size:16px;color:#fff">Dobry den, ${firstName},</p>
        <p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6">
          Dekujeme za zpravu. Ozevme se do <strong>2 pracovnich dnu</strong>.
        </p>
        <div style="padding:16px;background:rgba(255,255,255,0.04);border-left:3px solid #00A39A;border-radius:4px">
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);white-space:pre-wrap">${preview}${lead.message.length > 300 ? "…" : ""}</p>
        </div>
      </td></tr>
      <tr><td style="padding:0 36px 28px;text-align:center">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35)">
          Tato zprava byla odeslana automaticky. Neodpovidejte na ni.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function confirmationText(lead: ContactLead): string {
  const firstName = lead.name.split(" ")[0];
  return [
    `Dobry den, ${firstName},`,
    ``,
    `Dekujeme za Vasi zpravu. Ozevme se do 2 pracovnich dnu.`,
    ``,
    `Vase zprava:`,
    lead.message.slice(0, 300) + (lead.message.length > 300 ? "…" : ""),
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
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

  // Honeypot check — return generic 400, do not reveal reason
  if (raw._honeypot !== "" && raw._honeypot != null) {
    return err(400, "Invalid request");
  }

  // Extract and sanitize fields
  const name = typeof raw.name === "string" ? sanitize(raw.name) : "";
  const email = typeof raw.email === "string" ? sanitize(raw.email) : "";
  const phone = typeof raw.phone === "string" ? sanitize(raw.phone) : "";
  const company = typeof raw.company === "string" ? sanitize(raw.company) : "";
  const message = typeof raw.message === "string" ? sanitize(raw.message) : "";

  // Validation
  if (!name || name.length > 200) {
    return err(400, "Jmeno je povinne (max 200 znaku)");
  }
  if (!email || !isValidEmail(email)) {
    return err(400, "Zadejte platny e-mail");
  }
  if (phone && (phone.length < 6 || phone.length > 20 || !/^[\d+\-\s]+$/.test(phone))) {
    return err(400, "Neplatny format telefonu");
  }
  if (company && company.length > 200) {
    return err(400, "Nazev firmy je prilis dlouhy");
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return err(400, "Zprava musi mit 10–5000 znaku");
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

  // Build lead
  const lead: ContactLead = {
    id: `contact-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    source: "contact",
    name,
    email,
    phone: phone || undefined,
    company: company || undefined,
    message,
    submittedAt: new Date().toISOString(),
  };

  // Store lead (must succeed; return 500 if it fails entirely)
  try {
    await storeLead(lead);
  } catch (e) {
    console.error("[contact] blob storage failed:", e);
    return err(500, "Ulozeni zpravy selhalo. Zkuste to znovu.");
  }

  // Notification email(s)
  const notifRaw = process.env.CONTACT_NOTIFICATION_EMAILS || process.env.FROM_EMAIL || "";
  const notifRecipients = notifRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (notifRecipients.length > 0) {
    try {
      for (const recipient of notifRecipients) {
        await sendEmail(
          recipient,
          `Nova zprava z kontaktniho formulare — ${name}`,
          notificationHtml(lead),
          notificationText(lead)
        );
      }
    } catch (e) {
      console.error("[contact] notification email failed:", e);
      // Non-fatal: lead is already stored
    }
  }

  // Confirmation email to submitter
  try {
    await sendEmail(
      email,
      "Potvrzeni prijeti zpravy",
      confirmationHtml(lead),
      confirmationText(lead)
    );
  } catch (e) {
    console.error("[contact] confirmation email failed:", e);
    // Non-fatal
  }

  return ok("Zprava odeslana", { leadId: lead.id });
};

export { handler };
