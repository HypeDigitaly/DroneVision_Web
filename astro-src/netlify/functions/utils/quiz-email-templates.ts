// =============================================================================
// QUIZ EMAIL TEMPLATES — DroneVision
// =============================================================================
// Provides two named exports consumed by the quiz Netlify function:
//   getUserResultEmail   — result summary sent to the quiz participant
//   getTeamNotificationEmail — internal lead notification sent to the team
//
// Both functions return { subject, html, text }.
// All user-supplied values are escaped via escapeHtml() before injection.
// Number formatting follows Czech convention: space as thousands separator.
// Branding: dark background (#0a0a0a), magenta accent (#D40074).
// =============================================================================

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Escape &, <, >, ", ' to safe HTML entities. Must be applied to every
 *  user-supplied value before it is interpolated into an HTML string. */
export function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c] ?? c)
  );
}

/** Format a number using a non-breaking space as the Czech thousands separator.
 *  e.g. 138600 → "138 600" */
export function formatCzk(amount: number): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

/** Format an ISO datetime string as a human-readable Czech datetime.
 *  e.g. "2026-03-14T10:05:00.000Z" → "14. 3. 2026, 11:05:00" (Europe/Prague) */
function formatCzechDatetime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("cs-CZ", {
      timeZone: "Europe/Prague",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return escapeHtml(iso);
  }
}

// ---------------------------------------------------------------------------
// Shared style constants (inline, email-client compatible)
// ---------------------------------------------------------------------------

const S = {
  body: "margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a0a;color:#ffffff",
  outerTable: "background:#0a0a0a",
  outerCell: "padding:40px 20px",
  card: "background:#111111;border-radius:12px;border:1px solid #2a2a2a;max-width:600px",
  header: "padding:28px 36px;background:linear-gradient(135deg,#4a0026,#2d0016);border-radius:12px 12px 0 0;text-align:center",
  headerH1: "margin:0;font-size:20px;color:#ffffff;font-weight:700",
  headerAccent: "display:inline-block;width:48px;height:3px;background:#D40074;border-radius:2px;margin-top:10px",
  body_cell: "padding:28px 36px",
  p_greeting: "margin:0 0 16px;font-size:16px;color:#ffffff;font-weight:500",
  p_body: "margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6",
  highlight_box: "padding:16px 20px;background:rgba(212,0,116,0.08);border-left:3px solid #D40074;border-radius:4px;margin:0 0 24px",
  highlight_text: "margin:0;font-size:15px;color:#ffffff;line-height:1.6",
  highlight_value: "color:#D40074;font-weight:700",
  section_label: "margin:20px 0 10px;font-size:12px;color:#B2B2B2;text-transform:uppercase;letter-spacing:0.08em;font-weight:600",
  divider: "border:none;border-top:1px solid #2a2a2a;margin:20px 0",
  list_item: "margin:0 0 8px;font-size:14px;color:rgba(255,255,255,0.85);padding-left:16px;position:relative",
  cta_cell: "padding:8px 36px 32px;text-align:center",
  cta_btn: "display:inline-block;padding:14px 36px;background:#D40074;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:700",
  footer_cell: "padding:16px 36px 28px;text-align:center;border-top:1px solid #2a2a2a",
  footer_text: "margin:0;font-size:12px;color:#B2B2B2;line-height:1.7",
  footer_muted: "margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.3)",
  // Notification table rows
  table_cell: "border-collapse:collapse;width:100%",
  td_label: "padding:8px 12px;font-size:13px;color:#B2B2B2;width:160px;vertical-align:top",
  td_value: "padding:8px 12px;font-size:14px;color:#ffffff;vertical-align:top",
  badge_new: "display:inline-block;padding:4px 12px;background:#D40074;color:#ffffff;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.04em",
  badge_update: "display:inline-block;padding:4px 12px;background:#7a0042;color:#ffffff;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.04em",
};

// ---------------------------------------------------------------------------
// getUserResultEmail
// ---------------------------------------------------------------------------

export interface PricingTier {
  price: number | null;
  label: string;
}

export interface UserResultEmailData {
  name: string;
  capacityKw: number;
  panelYear: string;
  annualLossKc: number;
  pricingTier: PricingTier;
}

export interface EmailResult {
  subject: string;
  html: string;
  text: string;
}

/** Builds the result email sent to the quiz participant. */
export function getUserResultEmail(data: UserResultEmailData): EmailResult {
  const { name, capacityKw, panelYear, annualLossKc, pricingTier } = data;

  const safeName = escapeHtml(name);
  const safeCapacity = escapeHtml(String(capacityKw));
  const safePanelYear = escapeHtml(panelYear);
  const formattedLoss = formatCzk(annualLossKc);
  const safeLabel = escapeHtml(pricingTier.label);

  const pricingLine =
    pricingTier.price !== null
      ? `Inspekce vaší FVE (${safeLabel}): <strong style="${S.highlight_value}">${formatCzk(pricingTier.price)}&nbsp;Kč</strong>`
      : `Inspekce vaší FVE (${safeLabel}): <strong style="${S.highlight_value}">Individuální nacenění</strong>`;

  const subject = "Výsledky vaší kalkulace ztrát FVE \u2014 DroneVision";

  const html = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${subject}</title>
</head>
<body style="${S.body}">
<table width="100%" cellspacing="0" cellpadding="0" style="${S.outerTable}">
  <tr><td align="center" style="${S.outerCell}">
    <table width="600" cellspacing="0" cellpadding="0" style="${S.card}">

      <!-- Header -->
      <tr><td style="${S.header}">
        <h1 style="${S.headerH1}">Výsledky vaší kalkulace ztrát FVE</h1>
        <span style="${S.headerAccent}"></span>
      </td></tr>

      <!-- Body -->
      <tr><td style="${S.body_cell}">

        <p style="${S.p_greeting}">Dobrý den, ${safeName},</p>

        <p style="${S.p_body}">
          Na základě vašich údajů (${safeCapacity}&nbsp;kWp, panely&nbsp;${safePanelYear}) přicházíte ročně přibližně o
        </p>

        <!-- Annual loss highlight -->
        <div style="${S.highlight_box}">
          <p style="${S.highlight_text}">
            Odhadovaná roční ztráta:&nbsp;
            <strong style="${S.highlight_value}">${formattedLoss}&nbsp;Kč</strong>
          </p>
        </div>

        <!-- Pricing -->
        <p style="${S.section_label}">Cena inspekce</p>
        <p style="${S.p_body}">${pricingLine}</p>

        <hr style="${S.divider}">

        <!-- What's included -->
        <p style="${S.section_label}">Co je zahrnuto v ceně</p>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr><td style="padding:0 0 6px 0;font-size:14px;color:rgba(255,255,255,0.85)">
            <span style="color:#D40074;font-weight:700;margin-right:6px">&#10003;</span>Termokamerová inspekce dronem
          </td></tr>
          <tr><td style="padding:0 0 6px 0;font-size:14px;color:rgba(255,255,255,0.85)">
            <span style="color:#D40074;font-weight:700;margin-right:6px">&#10003;</span>Fotoplán celé elektrárny
          </td></tr>
          <tr><td style="padding:0 0 6px 0;font-size:14px;color:rgba(255,255,255,0.85)">
            <span style="color:#D40074;font-weight:700;margin-right:6px">&#10003;</span>Zaznačení závad na snímcích
          </td></tr>
          <tr><td style="padding:0 0 6px 0;font-size:14px;color:rgba(255,255,255,0.85)">
            <span style="color:#D40074;font-weight:700;margin-right:6px">&#10003;</span>Doprava do 100&nbsp;km zdarma
          </td></tr>
          <tr><td style="padding:0 0 6px 0;font-size:14px;color:rgba(255,255,255,0.85)">
            <span style="color:#D40074;font-weight:700;margin-right:6px">&#10003;</span>Přístup do aplikace DroneSoft
          </td></tr>
        </table>

        <hr style="${S.divider}">

        <p style="${S.p_body}">
          Máte zájem o inspekci nebo chcete probrat individuální nacenění?
          Zavolejte nám — rádi vše probereme.
        </p>

      </td></tr>

      <!-- CTA -->
      <tr><td style="${S.cta_cell}">
        <a href="tel:+420603445089" style="${S.cta_btn}">
          Zavolejte nám: +420&nbsp;603&nbsp;445&nbsp;089
        </a>
      </td></tr>

      <!-- Footer -->
      <tr><td style="${S.footer_cell}">
        <p style="${S.footer_text}">
          <strong style="color:#ffffff">DRONE VISION, s.r.o.</strong><br>
          Revoluční 658/8, 415&nbsp;01 Teplice
        </p>
        <p style="${S.footer_muted}">
          Tento e-mail byl odeslán automaticky na základě vyplněného kvízu. Neodpovídejte na něj.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    `Výsledky vaší kalkulace ztrát FVE — DroneVision`,
    ``,
    `Dobrý den, ${name},`,
    ``,
    `Na základě vašich údajů (${capacityKw} kWp, panely ${panelYear}) přicházíte ročně přibližně o ${formattedLoss} Kč.`,
    ``,
    `--- Cena inspekce ---`,
    pricingTier.price !== null
      ? `Inspekce vaší FVE (${pricingTier.label}): ${formatCzk(pricingTier.price)} Kč`
      : `Inspekce vaší FVE (${pricingTier.label}): Individuální nacenění`,
    ``,
    `--- Co je zahrnuto v ceně ---`,
    `+ Termokamerová inspekce dronem`,
    `+ Fotoplán celé elektrárny`,
    `+ Zaznačení závad na snímcích`,
    `+ Doprava do 100 km zdarma`,
    `+ Přístup do aplikace DroneSoft`,
    ``,
    `Chcete si domluvit inspekci? Zavolejte nám: +420 603 445 089`,
    ``,
    `---`,
    `DRONE VISION, s.r.o.`,
    `Revoluční 658/8, 415 01 Teplice`,
  ].join("\n");

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// getTeamNotificationEmail
// ---------------------------------------------------------------------------

export interface TeamNotificationEmailData {
  name: string;
  email: string;
  phone: string;
  capacityKw: number;
  panelYear: string;
  planExpansion: boolean;
  annualLossKc: number;
  pricingTier: PricingTier;
  submittedAt: string;
  isUpdate: boolean;
}

/** Builds the internal lead-notification email sent to the DroneVision team. */
export function getTeamNotificationEmail(data: TeamNotificationEmailData): EmailResult {
  const {
    name,
    email,
    phone,
    capacityKw,
    panelYear,
    planExpansion,
    annualLossKc,
    pricingTier,
    submittedAt,
    isUpdate,
  } = data;

  const subjectSafeName = name.replace(/[\r\n]/g, "");
  const subject = isUpdate
    ? `Aktualizovaný lead z kvízu \u2014 ${subjectSafeName} (${capacityKw} kWp)`
    : `Nový lead z kvízu \u2014 ${subjectSafeName} (${capacityKw} kWp)`;

  const badgeStyle = isUpdate ? S.badge_update : S.badge_new;
  const badgeLabel = isUpdate ? "AKTUALIZACE" : "NOVÝ LEAD";

  const formattedDatetime = formatCzechDatetime(submittedAt);

  const pricingDisplay =
    pricingTier.price !== null
      ? `${escapeHtml(pricingTier.label)}: ${formatCzk(pricingTier.price)}&nbsp;Kč`
      : `${escapeHtml(pricingTier.label)}: Individuální nacenění`;

  /** Build a table row: label | value */
  function row(label: string, value: string): string {
    return `
          <tr style="border-bottom:1px solid #2a2a2a">
            <td style="${S.td_label}">${label}</td>
            <td style="${S.td_value}">${value}</td>
          </tr>`;
  }

  const rows = [
    row("Jméno", escapeHtml(name)),
    row(
      "E-mail",
      `<a href="mailto:${escapeHtml(email)}" style="color:#D40074;text-decoration:none">${escapeHtml(email)}</a>`
    ),
    row(
      "Telefon",
      phone
        ? `<a href="tel:${escapeHtml(phone.replace(/\s/g, ""))}" style="color:#D40074;text-decoration:none">${escapeHtml(phone)}</a>`
        : `<span style="color:#B2B2B2">—</span>`
    ),
    row("Kapacita FVE", `${escapeHtml(String(capacityKw))}&nbsp;kWp`),
    row("Rok panelů", escapeHtml(panelYear)),
    row("Plánuje rozšíření", planExpansion ? "Ano" : "Ne"),
    row("Odhadovaná roční ztráta", `<strong style="color:#D40074">${formatCzk(annualLossKc)}&nbsp;Kč</strong>`),
    row("Cenová kategorie", pricingDisplay),
    row("Odesláno", escapeHtml(formattedDatetime)),
  ].join("");

  const html = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="${S.body}">
<table width="100%" cellspacing="0" cellpadding="0" style="${S.outerTable}">
  <tr><td align="center" style="${S.outerCell}">
    <table width="600" cellspacing="0" cellpadding="0" style="${S.card}">

      <!-- Header -->
      <tr><td style="${S.header}">
        <p style="margin:0 0 10px"><span style="${badgeStyle}">${badgeLabel}</span></p>
        <h1 style="${S.headerH1}">Lead z kvízu DroneVision</h1>
        <span style="${S.headerAccent}"></span>
      </td></tr>

      <!-- Lead data table -->
      <tr><td style="${S.body_cell}">
        <table width="100%" cellspacing="0" cellpadding="0" style="${S.table_cell}">
          ${rows}
        </table>
      </td></tr>

      <!-- Quick-action buttons -->
      <tr><td style="padding:4px 36px 32px;text-align:center">
        <a href="mailto:${escapeHtml(email)}"
           style="${S.cta_btn};margin-right:8px">
          Odpovědět e-mailem
        </a>
        ${
          phone
            ? `<a href="tel:${escapeHtml(phone.replace(/\s/g, ""))}"
           style="${S.cta_btn};background:#7a0042;margin-top:8px;display:inline-block">
          Zavolat
        </a>`
            : ""
        }
      </td></tr>

      <!-- Footer -->
      <tr><td style="${S.footer_cell}">
        <p style="${S.footer_muted}">
          Automatická notifikace z kvízu DroneVision &bull; DRONE VISION, s.r.o., Revoluční 658/8, 415&nbsp;01 Teplice
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    subject,
    `=`.repeat(60),
    ``,
    `Jméno:              ${name}`,
    `E-mail:             ${email}`,
    `Telefon:            ${phone || "—"}`,
    ``,
    `Kapacita FVE:       ${capacityKw} kWp`,
    `Rok panelů:         ${panelYear}`,
    `Plánuje rozšíření:  ${planExpansion ? "Ano" : "Ne"}`,
    ``,
    `Roční ztráta:       ${formatCzk(annualLossKc)} Kč`,
    `Cenová kategorie:   ${pricingTier.label}${pricingTier.price !== null ? ` — ${formatCzk(pricingTier.price)} Kč` : " — Individuální nacenění"}`,
    ``,
    `Odesláno:           ${formattedDatetime}`,
    `Typ záznamu:        ${isUpdate ? "Aktualizace" : "Nový lead"}`,
  ].join("\n");

  return { subject, html, text };
}
