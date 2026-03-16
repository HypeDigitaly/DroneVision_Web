import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createHash } from "crypto";
import {
  calculateAnnualLoss,
  getPricingTier,
  VALID_YEAR_RANGES,
} from "./utils/quiz-shared";
import {
  getUserResultEmail,
  getTeamNotificationEmail,
} from "./utils/quiz-email-templates";
import { generateAiAnalysis } from './utils/openrouter';
import type { AiAnalysisResult } from './utils/ai-types';

// =============================================================================
// QUIZ LEAD HANDLER — Netlify Function
// =============================================================================
// Receives quiz form submissions, validates input, rate-limits by IP,
// stores leads in Netlify Blobs (with email-based deduplication), and sends
// two emails via Resend: a result summary to the user and a notification to
// the DroneVision team.
//
// Env vars required: RESEND_API_KEY, FROM_EMAIL, SITE_URL
// POST /.netlify/functions/quiz-lead  (→ /api/quiz-lead via netlify.toml)
// =============================================================================

// ---------------------------------------------------------------------------
// CORS — SITE_URL with production domain fallback. Never uses wildcard.
// ---------------------------------------------------------------------------

function buildCorsHeaders(): Record<string, string> {
  const origin = process.env.SITE_URL ?? 'https://fotovoltaika.drone-vision.cz';
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConsentPayload {
  timestamp: string;
  policyVersion: string;
  consentText: string;
}

interface QuizLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  capacityKw: number;
  panelYear: string;
  planExpansion: boolean;
  annualLossKc: number;
  pricingTier: { price: number | null; label: string };
  aiAnalysis?: AiAnalysisResult;
  consent: ConsentPayload;
  submittedAt: string;
  updatedAt: string;
  submitCount: number;
  sourceIp: string;
}

interface QuizLeadIndexEntry {
  id: string;
  email: string;
  name: string;
  submittedAt: string;
  updatedAt: string;
}

interface ValidationError {
  field: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Response factories
// ---------------------------------------------------------------------------

function response(
  statusCode: number,
  body: unknown,
  corsHeaders: Record<string, string>
) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** SHA-256 hash of IP, truncated to 16 hex chars. */
function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

/** Strip HTML tags and trim whitespace. */
function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

/** RFC-5322 basic email check — local@domain.tld, max 254 chars. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/**
 * Normalise a Czech phone number:
 *   - Strip spaces and dashes
 *   - Validate that at least 9 digits remain
 * Returns the stripped string on success or null on failure.
 */
function normalizePhone(raw: string): string | null {
  const stripped = raw.replace(/[\s\-]/g, "");
  // Must contain at least 9 digit characters (ignoring a leading +)
  const digits = stripped.replace(/^\+/, "").replace(/\D/g, "");
  if (digits.length < 9) return null;
  return stripped;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateBody(raw: Record<string, unknown>): {
  errors: ValidationError[];
  fields?: {
    name: string;
    email: string;
    phone: string;
    capacityKw: number;
    panelYear: string;
    planExpansion: boolean;
    consent: ConsentPayload;
  };
} {
  const errors: ValidationError[] = [];

  // name
  const rawName = typeof raw.name === "string" ? sanitize(raw.name) : "";
  if (!rawName || rawName.length < 2) {
    errors.push({ field: "name", message: "Jméno je povinné (min. 2 znaky)." });
  } else if (rawName.length > 100) {
    errors.push({ field: "name", message: "Jméno nesmí přesáhnout 100 znaků." });
  }

  // email
  const rawEmail = typeof raw.email === "string" ? sanitize(raw.email) : "";
  if (!rawEmail || !isValidEmail(rawEmail)) {
    errors.push({ field: "email", message: "Zadejte platnou e-mailovou adresu." });
  }

  // phone
  const rawPhone = typeof raw.phone === "string" ? sanitize(raw.phone) : "";
  let normalizedPhone: string | null = null;
  if (!rawPhone) {
    errors.push({ field: "phone", message: "Telefonní číslo je povinné." });
  } else {
    normalizedPhone = normalizePhone(rawPhone);
    if (normalizedPhone === null) {
      errors.push({
        field: "phone",
        message: "Neplatný formát telefonního čísla (min. 9 číslic).",
      });
    }
  }

  // capacityKw
  const rawCapacity = raw.capacityKw;
  let capacityKw = 0;
  if (typeof rawCapacity !== "number" || !Number.isFinite(rawCapacity)) {
    errors.push({ field: "capacityKw", message: "Výkon FVE musí být číslo." });
  } else if (rawCapacity <= 0) {
    errors.push({ field: "capacityKw", message: "Výkon FVE musí být kladné číslo." });
  } else if (rawCapacity > 5000) {
    errors.push({ field: "capacityKw", message: "Výkon FVE nesmí přesáhnout 5 000 kWp." });
  } else {
    capacityKw = rawCapacity;
  }

  // panelYear
  const rawPanelYear = typeof raw.panelYear === "string" ? raw.panelYear.trim() : "";
  const validYears: readonly string[] = VALID_YEAR_RANGES;
  if (!validYears.includes(rawPanelYear)) {
    errors.push({
      field: "panelYear",
      message: `Neplatný rok panelů. Povolené hodnoty: ${VALID_YEAR_RANGES.join(", ")}.`,
    });
  }

  // planExpansion — must be a strict boolean
  const rawExpansion = raw.planExpansion;
  if (typeof rawExpansion !== "boolean") {
    errors.push({
      field: "planExpansion",
      message: "Pole planExpansion musí být true nebo false.",
    });
  }

  // consent object
  const rawConsent = raw.consent;
  if (
    typeof rawConsent !== "object" ||
    rawConsent === null ||
    Array.isArray(rawConsent)
  ) {
    errors.push({ field: "consent", message: "Souhlas je povinný." });
  } else {
    const c = rawConsent as Record<string, unknown>;
    if (typeof c.timestamp !== "string" || !c.timestamp) {
      errors.push({ field: "consent.timestamp", message: "Chybí časové razítko souhlasu." });
    } else if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(c.timestamp)) {
      errors.push({
        field: "consent.timestamp",
        message: "Časové razítko musí být ve formátu ISO 8601.",
      });
    }
    if (typeof c.policyVersion !== "string" || !c.policyVersion) {
      errors.push({ field: "consent.policyVersion", message: "Chybí verze zásad ochrany soukromí." });
    }
    if (typeof c.consentText !== "string" || !c.consentText) {
      errors.push({ field: "consent.consentText", message: "Chybí text souhlasu." });
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors: [],
    fields: {
      name: rawName,
      email: rawEmail,
      phone: normalizedPhone as string,
      capacityKw,
      panelYear: rawPanelYear,
      planExpansion: rawExpansion as boolean,
      consent: {
        timestamp: (rawConsent as Record<string, unknown>).timestamp as string,
        policyVersion: (rawConsent as Record<string, unknown>).policyVersion as string,
        consentText: (rawConsent as Record<string, unknown>).consentText as string,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const store = getStore({ name: "rate-limits", consistency: "strong" });
    const bucket = Math.floor(Date.now() / 3_600_000); // 1-hour bucket
    const key = `quiz-${hashIP(ip)}-${bucket}`;
    const raw = await store.get(key);
    const count = raw ? parseInt(raw, 10) : 0;
    if (count >= 5) return false;
    await store.set(key, String(count + 1));
    return true;
  } catch (e) {
    // If the rate-limit store is unavailable, allow the request through
    console.error("[quiz-lead] rate-limit store error:", e);
    return true;
  }
}

// ---------------------------------------------------------------------------
// Blob storage
// ---------------------------------------------------------------------------

async function upsertLead(
  lead: QuizLead
): Promise<{ isUpdate: boolean }> {
  const store = getStore({ name: "quiz-leads", consistency: "strong" });

  // Load current index
  const indexRaw = await store.get("_quiz_leads_index");
  const index: QuizLeadIndexEntry[] = indexRaw ? JSON.parse(indexRaw) : [];

  // Check for existing entry by email (case-insensitive)
  const existingIdx = index.findIndex(
    (e) => e.email.toLowerCase() === lead.email.toLowerCase()
  );

  if (existingIdx !== -1) {
    // Duplicate email — update existing record
    const existingEntry = index[existingIdx];
    const existingRaw = await store.get(existingEntry.id);
    const existing: QuizLead = existingRaw
      ? JSON.parse(existingRaw)
      : { ...lead, id: existingEntry.id, submitCount: 0 };

    const updated: QuizLead = {
      ...existing,
      // Update mutable fields with new submission values
      name: lead.name,
      phone: lead.phone,
      capacityKw: lead.capacityKw,
      panelYear: lead.panelYear,
      planExpansion: lead.planExpansion,
      annualLossKc: lead.annualLossKc,
      pricingTier: lead.pricingTier,
      // Preserve successful AI analysis from previous submission
      aiAnalysis: lead.aiAnalysis?.status === 'success'
        ? lead.aiAnalysis
        : (existing.aiAnalysis?.status === 'success' ? existing.aiAnalysis : lead.aiAnalysis),
      consent: lead.consent,
      updatedAt: lead.updatedAt,
      submitCount: existing.submitCount + 1,
      // Retain original sourceIp and submittedAt
    };

    await store.set(existingEntry.id, JSON.stringify(updated));

    // Refresh index entry (move to front, newest first)
    index.splice(existingIdx, 1);
    index.unshift({
      id: existingEntry.id,
      email: existing.email,
      name: updated.name,
      submittedAt: existing.submittedAt,
      updatedAt: updated.updatedAt,
    });
    await store.set("_quiz_leads_index", JSON.stringify(index));

    return { isUpdate: true };
  }

  // New lead — store record and prepend to index
  await store.set(lead.id, JSON.stringify(lead));
  index.unshift({
    id: lead.id,
    email: lead.email,
    name: lead.name,
    submittedAt: lead.submittedAt,
    updatedAt: lead.updatedAt,
  });
  await store.set("_quiz_leads_index", JSON.stringify(index));

  return { isUpdate: false };
}

// ---------------------------------------------------------------------------
// Email sending
// ---------------------------------------------------------------------------

async function sendResendEmail(
  to: string | string[],
  subject: string,
  html: string,
  text: string
): Promise<void> {
  const fromEmail = process.env.FROM_EMAIL || 'noreply@notifications.drone-vision.cz';
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      reply_to: fromEmail,
      subject,
      html,
      text,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body.slice(0, 200)}`);
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Timeout budget (10s Netlify limit):
  // AI call: 0-4s | Blob storage: ~0.5s | 2x Resend (parallel): ~1s | Overhead: ~1.5s

  // Build CORS headers — uses SITE_URL if set, falls back to hardcoded production domain
  const corsHeaders = buildCorsHeaders();

  if (!process.env.SITE_URL) {
    console.error("[quiz-lead] Missing required env: SITE_URL");
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        status: "error",
        code: "INTERNAL_ERROR",
        message: "Konfigurace serveru je neúplná.",
      }),
    };
  }

  if (!process.env.FROM_EMAIL) {
    console.error('[quiz-lead] FROM_EMAIL environment variable is not set');
  }

  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  // Method guard
  if (event.httpMethod !== "POST") {
    return response(
      405,
      { status: "error", code: "METHOD_NOT_ALLOWED", message: "Metoda není povolena." },
      corsHeaders
    );
  }

  // Body size guard (15 KB)
  if ((event.body?.length ?? 0) > 15_360) {
    return response(
      400,
      { status: "error", code: "VALIDATION_ERROR", errors: [{ field: "_body", message: "Požadavek je příliš velký." }] },
      corsHeaders
    );
  }

  // Parse JSON
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(event.body || "{}");
  } catch {
    return response(
      400,
      { status: "error", code: "VALIDATION_ERROR", errors: [{ field: "_body", message: "Neplatný formát JSON." }] },
      corsHeaders
    );
  }

  // Honeypot check — silently return 200, do NOT process, store, or email
  if (raw._honeypot != null && raw._honeypot !== "") {
    return response(
      200,
      { status: "created", message: "Výsledky byly odeslány na váš e-mail." },
      corsHeaders
    );
  }

  // Rate limiting — IP from x-forwarded-for (first entry)
  const ip =
    (event.headers["x-forwarded-for"] ?? "").split(",")[0].trim() ||
    event.headers["client-ip"] ||
    "unknown";

  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return response(
      429,
      {
        status: "error",
        code: "RATE_LIMIT_EXCEEDED",
        message: "Příliš mnoho pokusů. Zkuste to znovu za hodinu.",
        retryAfter: 3600,
      },
      corsHeaders
    );
  }

  // Validate all fields
  const { errors, fields } = validateBody(raw);
  if (errors.length > 0 || !fields) {
    return response(
      400,
      { status: "error", code: "VALIDATION_ERROR", errors },
      corsHeaders
    );
  }

  // Server-side computed values — never trust client input
  const annualLossKc = calculateAnnualLoss(fields.capacityKw, fields.panelYear);
  const pricingTier = getPricingTier(fields.capacityKw);

  // Generate AI analysis — non-blocking: failure returns 'failed'/'skipped', never throws
  const aiAnalysis = await generateAiAnalysis({
    capacityKw: fields.capacityKw,
    panelYear: fields.panelYear,
    planExpansion: fields.planExpansion,
    annualLossKc,
    pricingTier,
  });

  // Build record
  const now = new Date().toISOString();
  const id = `quiz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

  const lead: QuizLead = {
    id,
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    capacityKw: fields.capacityKw,
    panelYear: fields.panelYear,
    planExpansion: fields.planExpansion,
    annualLossKc,
    pricingTier,
    aiAnalysis,
    consent: fields.consent,
    submittedAt: now,
    updatedAt: now,
    submitCount: 1,
    sourceIp: hashIP(ip),
  };

  // Store in Netlify Blobs
  let isUpdate: boolean;
  try {
    ({ isUpdate } = await upsertLead(lead));
  } catch (e) {
    console.error("[quiz-lead] blob storage failed:", e);
    return response(
      500,
      { status: "error", code: "INTERNAL_ERROR", message: "Uložení záznamu selhalo. Zkuste to znovu." },
      corsHeaders
    );
  }

  // Email gate — skip all email sends when RESEND_API_KEY is absent
  const canSendEmail = !!process.env.RESEND_API_KEY;
  if (!canSendEmail) {
    console.warn('[quiz-lead] RESEND_API_KEY not set, skipping all emails');
  }

  // Emails — non-fatal, run in parallel to save time within 10s Netlify limit.
  // Lead is already persisted, so email failure must not block the response.
  let emailSent = false;
  if (canSendEmail) {
    const userTemplate = getUserResultEmail({
      name: fields.name,
      capacityKw: fields.capacityKw,
      panelYear: fields.panelYear,
      annualLossKc,
      pricingTier,
      aiAnalysis,
    });

    const teamTemplate = getTeamNotificationEmail({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      capacityKw: fields.capacityKw,
      panelYear: fields.panelYear,
      planExpansion: fields.planExpansion,
      annualLossKc,
      pricingTier,
      submittedAt: now,
      isUpdate,
      aiAnalysis,
    });

    const teamEmails = (process.env.QUIZ_NOTIFICATION_EMAILS || 'mira@dronesoft.cz,david@dronesoft.cz,pavelcermak@hypedigitaly.ai')
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    // Fire both emails in parallel — saves ~1s vs sequential
    const [userResult, teamResult] = await Promise.allSettled([
      sendResendEmail(fields.email, userTemplate.subject, userTemplate.html, userTemplate.text),
      sendResendEmail(teamEmails, teamTemplate.subject, teamTemplate.html, teamTemplate.text),
    ]);

    emailSent = userResult.status === 'fulfilled';
    if (userResult.status === 'rejected') {
      console.error('[quiz-lead] User email failed:', userResult.reason?.message ?? userResult.reason);
    }
    if (teamResult.status === 'rejected') {
      console.error('[quiz-lead] Team email failed:', teamResult.reason?.message ?? teamResult.reason);
    }
  }

  // Return 202 for new leads, 200 for updated records
  if (isUpdate) {
    return response(
      200,
      {
        status: "updated",
        message: "Výsledky byly aktualizovány.",
        annualLossKc,
        pricingTier,
        aiAnalysis: aiAnalysis?.status === 'success' ? { content: aiAnalysis.content } : null,
        emailSent,
      },
      corsHeaders
    );
  }

  return response(
    202,
    {
      status: "created",
      message: "Výsledky byly odeslány na váš e-mail.",
      annualLossKc,
      pricingTier,
      aiAnalysis: aiAnalysis?.status === 'success' ? { content: aiAnalysis.content } : null,
      emailSent,
    },
    corsHeaders
  );
};

export { handler };
