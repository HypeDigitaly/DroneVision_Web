# Implementation Plan: Growth Club Survey Page — 7-Issue Fix

## Approach

Fix 7 issues on the existing `gc-pruzkum.astro` page and `admin/leads.astro` dashboard. The approach is conservative: modify 4 existing files, create 0 new files. Reuse existing patterns (gold theme `#D4A017`, Footer component props, pain-point "Other" pattern for industry "Other"). Add Chart.js from CDN (with SRI) for CRM visualization. No backend changes needed — the industry "Other" value is sent directly as the `industry` string, which the backend already accepts (no enum validation).

**Plan reviewed by:** `architect-reviewer`, `react-specialist` (frontend), `security-engineer`. All CRITICAL, HIGH, and MEDIUM findings from the first review round have been incorporated into this revised plan.

---

## File Ownership Map

| Subagent Role | Owned Files |
|---|---|
| `frontend-developer` (Task 1) | `astro-src/src/scripts/translations/survey.ts` |
| `frontend-developer` (Task 2) | `astro-src/src/pages/gc-pruzkum.astro` |
| `frontend-developer` (Task 3) | `astro-src/src/components/navigation/Navigation.astro` |
| `frontend-developer` (Task 4) | `astro-src/src/pages/admin/leads.astro` |

All 4 files already exist in the working tree.

---

## Task List

### Task 1: Add translation keys for personalization message and industry "Other"
- **Subagent:** `frontend-developer`
- **Phase:** 2A-Prerequisite
- **Files:** `astro-src/src/scripts/translations/survey.ts`
- **Dependencies:** None — can start immediately
- **Description:**

  Add 3 new keys. Each key must be added in **three places**: (1) the `SurveyKeys` interface, (2) the `cs` translation object, (3) the `en` translation object.

  **New keys:**

  1. `survey_form_personalization_note`
     - Interface: `survey_form_personalization_note: string;`
     - CS: `"Na základě Vašich odpovědí přizpůsobíme obsah a program akce tak, aby přinášel maximum konkrétní hodnoty právě pro Váš byznys a personalizovaný zážitek."`
     - EN: `"Based on your answers, we will tailor the event content and program to deliver maximum value specifically for your business and a personalized experience."`

  2. `survey_form_industry_other_placeholder`
     - Interface: `survey_form_industry_other_placeholder: string;`
     - CS: `"Upřesněte Váš obor..."`
     - EN: `"Specify your industry..."`

  3. `survey_form_industry_other_required`
     - Interface: `survey_form_industry_other_required: string;`
     - CS: `"Upřesněte prosím Váš obor"`
     - EN: `"Please specify your industry"`

  Place all 3 keys after the existing `survey_form_desc` key in the interface and both language objects, maintaining alphabetical/logical grouping.

- **Acceptance criteria:**
  - [ ] `SurveyKeys` interface contains all 3 new keys with `string` type
  - [ ] Czech `cs` object contains values for all 3 new keys
  - [ ] English `en` object contains values for all 3 new keys
  - [ ] TypeScript compiles without errors (`tsc --noEmit` or equivalent)
- **Do NOT touch:** Any `.astro` files, any backend files

---

### Task 2: Fix all visual/UX issues on gc-pruzkum.astro (6 fixes)
- **Subagent:** `frontend-developer`
- **Phase:** 2B-Main
- **Files:** `astro-src/src/pages/gc-pruzkum.astro`
- **Dependencies:** Task 1 (translation keys must exist before this task references them)
- **Description:**

  Apply 6 numbered fixes. This is the highest-risk task — it touches HTML, CSS, and JavaScript in a single file.

  ---

  **Fix 1 — Header overlaps "Growth Club" heading:**

  The fixed nav sits at `top-6` (24px) + `h-14` (56px) = 80px from viewport top. Current `mainPaddingClass="pt-12"` (48px) is insufficient.

  Change the `mainPaddingClass` prop on the `<PageLayout>` component from `"pt-12"` to `"pt-32"`. The prop is on the PageLayout opening tag near the top of the file. `pt-32` = 128px, which is the site-wide default and provides 48px breathing room below the nav.

  Alternatively, if `mainPaddingClass` is not used and instead the default `pt-32` is being overridden, simply remove the `mainPaddingClass` prop entirely so it falls back to the default.

  ---

  **Fix 2 — Footer missing company info, address, and map:**

  Change `simpleFooter={true}` to `simpleFooter={false}` on the `<PageLayout>` component. Keep `showCalendar={false}`.

  **Prop chain:** `gc-pruzkum.astro` passes `simpleFooter` to `PageLayout`, which translates it to `simple` and passes it to `Footer.astro`. Changing `simpleFooter={false}` will cause Footer to render the full company info section (address, Google Maps embed, nav links, social links, copyright) but NOT the Cal.com calendar widget (controlled separately by `showCalendar`).

  ---

  **Fix 3 — Required asterisks should be gold:**

  Find all instances of `<span class="text-orange-500">*</span>` in the file. There are exactly **5 occurrences** (for email, company name, industry, company size, and pain points required fields).

  Change each from:
  ```html
  <span class="text-orange-500">*</span>
  ```
  To:
  ```html
  <span class="text-[#D4A017]">*</span>
  ```

  Use the Tailwind arbitrary value class `text-[#D4A017]` (NOT inline styles). This matches the pattern already used elsewhere in this file for gold text (e.g., the badge and headline use `text-[#D4A017]`).

  ---

  **Fix 4 — Double border on focused fields (gold + teal):**

  The global CSS (`global.css`) has `:focus-visible { outline: 2px solid #00A39A !important; }`. The survey form's `<style>` block already overrides this for `input`, `textarea`, `select` with `outline: none !important`. This existing override is **correct and sufficient**.

  **DO NOT change the existing selector to a wildcard `*`.** The wildcard would suppress focus indicators on the submit button, privacy policy link, and other interactive elements — violating WCAG 2.4.7.

  Instead, only add **one targeted rule** if the checkbox/radio cards show a double outline:
  ```css
  #survey-form .checkbox-card:has(input:focus-visible) {
    outline: none;
  }
  ```

  Before adding this, verify the issue actually exists: click on a chip button (company size or pain point) and check if there's a visible teal outline alongside the gold box-shadow. If no double border is visible on checkbox-cards, skip this addition entirely.

  The gold box-shadow focus style (`0 0 0 4px rgba(212, 160, 23, 0.15)`) from `.form-input-field:focus` must remain as the ONLY focus indicator for text inputs, textareas, and selects.

  ---

  **Fix 5 — Missing personalization message:**

  Insert a gold-tinted info box **immediately after** the `<p class="text-neutral-500 mb-6">` element (the form description) and **before** the `<form id="survey-form">` element. This is inside the white form card container but above the actual form.

  ```html
  <div class="flex items-start gap-3 p-4 rounded-xl mb-6" style="background: rgba(212,160,23,0.08); border: 1px solid rgba(212,160,23,0.25);">
    <svg class="w-5 h-5 flex-shrink-0 mt-0.5" style="color: #D4A017;" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
    <p class="text-sm leading-relaxed" style="color: #7A5800;">{t.survey_form_personalization_note}</p>
  </div>
  ```

  The `t` variable references the translation added in Task 1. This will fail TypeScript if Task 1 is not complete.

  ---

  **Fix 6 — Industry "Other" needs a text field:**

  Follow the existing pain-point "Other" pattern already in this file.

  **Step A — HTML:** Immediately after the `</select>` tag for the industry dropdown (the `<select>` with `id="survey-industry"`), add:
  ```html
  <div id="industry-other-wrapper" class="hidden mt-3" aria-live="polite">
    <input type="text" name="industryOther" id="industry-other-text"
      placeholder={t.survey_form_industry_other_placeholder}
      class="w-full px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 transition-all duration-200 form-input-field" />
  </div>
  ```

  **Step B — JavaScript show/hide:** In the `<script is:inline>` block, add after the existing pain-point "Other" logic:
  ```javascript
  var industrySelect = document.getElementById('survey-industry');
  var industryOtherWrapper = document.getElementById('industry-other-wrapper');
  var industryOtherText = document.getElementById('industry-other-text');
  if (industrySelect && industryOtherWrapper) {
    industrySelect.addEventListener('change', function() {
      if (this.value === 'other') {
        industryOtherWrapper.classList.remove('hidden');
        if (industryOtherText) industryOtherText.focus();
      } else {
        industryOtherWrapper.classList.add('hidden');
        if (industryOtherText) industryOtherText.value = '';
      }
    });
  }
  ```

  **Step C — Validation:** In the `validateForm()` function, **after** the existing industry dropdown required check (the block that checks `if (!industry.value)`), add:
  ```javascript
  if (industry.value === 'other') {
    var industryOtherEl = document.getElementById('industry-other-text');
    if (industryOtherEl && !industryOtherEl.value.trim()) {
      showFieldError(industryOtherEl, langVal === 'cs' ? t_survey_form_industry_other_required_cs : t_survey_form_industry_other_required_en);
      if (!firstError) firstError = industryOtherEl;
      isValid = false;
    }
  }
  ```
  Note: since this is `is:inline` JS (not Astro template), the error message strings must be hardcoded or read from a data attribute. Use the same pattern as other error messages in the validator.

  **Step D — Submit payload:** In the submit handler, when building the payload object, **do NOT mutate the `<select>` DOM element value**. Instead, after the payload is built, add:
  ```javascript
  if (payload.industry === 'other') {
    var otherText = document.getElementById('industry-other-text');
    if (otherText && otherText.value.trim()) {
      payload.industry = otherText.value.trim();
    }
  }
  ```
  This sends the custom text directly as the `industry` value. The backend validates industry as a non-empty string max 200 chars with no enum check — so arbitrary text passes validation. No backend changes needed.

- **Acceptance criteria:**
  - [ ] "Growth Club · 28.03." badge fully visible below nav, no overlap on any viewport
  - [ ] Footer shows company address (Velká Hradební 2800/54, Ústí nad Labem), Google Maps embed, nav links, social links, copyright. No Cal.com calendar.
  - [ ] All 5 required field asterisks are gold (#D4A017), not orange (#f97316). Verify with DevTools color picker.
  - [ ] Click into any text input: ONLY gold border + gold box-shadow visible. No teal outline. Check with DevTools Computed Styles: `outline: none`, `box-shadow` contains `rgba(212, 160, 23, ...)`.
  - [ ] Gold info box with star icon + personalization message appears between form description and first form field
  - [ ] Select "Jiné" in industry dropdown → text input appears below, auto-focused
  - [ ] Select a different industry → text input hides, its value is cleared
  - [ ] Submit with "Jiné" selected + text "Veterinární medicína" → network request body shows `industry: "Veterinární medicína"` (not `"other"`)
  - [ ] Submit with "Jiné" selected + empty text → validation error on the text input (not the select)
- **Do NOT touch:** Navigation.astro, admin dashboard, backend functions, global.css

---

### Task 3: Ensure CTA button visible in ultra-minimal nav
- **Subagent:** `frontend-developer`
- **Phase:** 2B-Main
- **Files:** `astro-src/src/components/navigation/Navigation.astro`
- **Dependencies:** None — independent of Tasks 1-2
- **Description:**

  The current Navigation.astro wraps the entire right-side section (language switcher + CTA button + mobile menu button) inside a `{!ultraMinimalNav && (...)}` conditional block. When `ultraMinimalNav={true}` (as on the survey page), nothing renders on the right side of the nav — including the CTA button.

  **Goal:** Make the CTA button always visible, even in ultra-minimal mode.

  **Restructure the right side of the nav as follows:**

  The nav uses `justify-between` with flex children. Create a new always-rendered wrapper `<div>` for the right side:

  ```astro
  <div class="flex items-center gap-3">
    {!ultraMinimalNav && (
      <Fragment>
        {/* Language switcher elements here */}
      </Fragment>
    )}

    {/* CTA button — ALWAYS rendered */}
    <a href={ctaUrl || href("/kontakt")} class="... existing CTA classes ...">
      <span class="text-xs font-semibold tracking-tight relative z-10">{t.nav_cta}</span>
      <svg ...>arrow icon</svg>
    </a>

    {!simple && !ultraMinimalNav && (
      <button id="mobile-menu-btn" class="...">hamburger icon</button>
    )}
  </div>
  ```

  **Key points:**
  - The outer `<div class="flex items-center gap-3">` is ALWAYS rendered (provides the flex container the CTA needs for positioning)
  - Language switcher is inside `{!ultraMinimalNav}` — hidden on survey page
  - CTA `<a>` is outside any conditional — always visible
  - Mobile menu button is inside `{!simple && !ultraMinimalNav}` — hidden on survey page
  - The CTA button keeps its existing teal/primary brand colors (`from-primary/30`, `text-neutral-200`, etc.) — it does NOT change to gold on the survey page

  **What NOT to do:**
  - Do not move the CTA to a completely different position in the DOM (it stays in the same flex row)
  - Do not change the CTA's styling or link target
  - Do not break the existing nav on homepage, contact, or any other pages

- **Acceptance criteria:**
  - [ ] On gc-pruzkum page: CTA button "Domluvit konzultaci" (teal-styled) visible in top-right of header
  - [ ] On gc-pruzkum page: no language switcher, no hamburger menu visible
  - [ ] On homepage: CTA button, language switcher, and mobile menu all still work correctly
  - [ ] On contact page: nav renders correctly with all expected elements
  - [ ] CTA links to `/kontakt` by default (the survey page does not set `navCtaUrl`)
  - [ ] No visual regression on any page — the only change is CTA becoming visible where it was previously hidden
- **Do NOT touch:** gc-pruzkum.astro, admin dashboard, any backend files

---

### Task 4: Add charts/graphs to CRM admin dashboard
- **Subagent:** `frontend-developer`
- **Phase:** 2C-Enhancement
- **Files:** `astro-src/src/pages/admin/leads.astro`
- **Dependencies:** None — fully independent of Tasks 1-3
- **Description:**

  Add Chart.js-powered data visualizations for survey leads to the admin dashboard. The dashboard currently has only statistics cards + data table with no charts.

  **Chart.js Setup:**

  Load Chart.js 4.4.7 from CDN with SRI hash. Place this `<script>` tag in the `<head>` section alongside the existing Iconify script. Use synchronous loading (no `async`/`defer`) so `Chart` global is available when inline scripts execute:

  ```html
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"
    integrity="sha384-[COMPUTE_HASH_AT_IMPLEMENTATION_TIME]"
    crossorigin="anonymous"></script>
  ```

  **Important:** The implementer MUST compute the actual SRI hash. Use `https://www.srihash.org/` or `curl` the CDN URL and compute `sha384` hash. Do NOT leave the placeholder.

  **Charts to add (6 total):**

  | # | Chart Type | Data Field | Sort Order | Notes |
  |---|---|---|---|---|
  | 1 | Donut | `aiMaturity` | N/A (3 segments) | Colors: `#DC2626` (none), `#D4A017` (experimenting), `#00A39A` (active) |
  | 2 | Donut | `companySize` | N/A (5 segments) | Colors: `#D4A017`, `#F0C040`, `#00A39A`, `#8b5cf6`, `#f97316` for solo → 250+ |
  | 3 | Horizontal Bar | `industry` | Descending by frequency | Single bar color: `#D4A017`. Group any value NOT matching the known enum values into a single "Ostatní" bucket. |
  | 4 | Horizontal Bar | `painPoints` | Descending by frequency | Multi-select array: count each item independently. Color: `#00A39A` |
  | 5 | Horizontal Bar | `hoursLostPerWeek` | **Ordinal order** (1-5 → 40+) | Do NOT sort by frequency. Preserve order: `['1-5', '5-10', '10-20', '20-40', '40+']`. Color: `#8b5cf6` |
  | 6 | Horizontal Bar | `toolsUsed` | Descending by frequency | Multi-select array. Color: `#f97316` |

  **Data field types (from the API response):**
  - `painPoints`: `string[]` (always present for survey leads, required field)
  - `toolsUsed`: `string[] | undefined` (optional, may be missing or undefined)
  - `industry`: `string` (always present, may be free-text from "Other" selection)
  - `aiMaturity`: `string` (may be `""` empty string if not answered)
  - `hoursLostPerWeek`: `string` (may be `""` empty string)
  - `companySize`: `string` (always present, required field)

  **Handle empty/undefined values:** Map both `""` and `undefined` to a single "Neuvedeno" label in all charts. Do not create separate buckets for empty vs undefined.

  **Layout:**
  - Insert charts section between the existing stats cards and the filters row
  - Section header: `<h2>Analýza průzkumu</h2>` with subtitle `<span>N = X respondentů</span>` showing count of survey leads
  - Row 1: AI Maturity donut + Company Size donut (2-column CSS grid, `grid-template-columns: 1fr 1fr`)
  - Row 2: Industry bar (full width)
  - Row 3: Pain Points bar + Hours Lost bar (2-column grid)
  - Row 4: Tools Used bar (full width)
  - Each chart inside a card with the same dark-theme styling as the existing stats cards (rounded corners, consistent padding, subtle border)
  - Responsive: collapse 2-column to 1-column below 768px via media query
  - Chart canvas containers need explicit height: 260px for donuts, dynamic `Math.max(200, itemCount * 28)` for horizontal bars

  **Data aggregation (client-side):**

  After `fetchLeads()` completes (inside its success path), filter `allLeads` to `source === 'survey'` only, then compute frequency distributions:

  ```javascript
  // Single-value fields: count occurrences
  function countField(leads, field) {
    return leads.reduce((acc, lead) => {
      const val = lead[field] || 'Neuvedeno';
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
  }

  // Array fields (multi-select): count each item independently
  function countArrayField(leads, field) {
    return leads.reduce((acc, lead) => {
      const values = lead[field];
      if (Array.isArray(values)) {
        values.forEach(v => { if (v) acc[v] = (acc[v] || 0) + 1; });
      }
      return acc;
    }, {});
  }
  ```

  **Industry "Other" grouping for charts:** The known industry enum values are: `ecommerce`, `retail`, `manufacturing`, `professional_svcs`, `real_estate`, `hospitality`, `healthcare`, `education`, `construction`, `logistics`, `finance`, `marketing_agency`, `it_tech`, `other`. Any industry value that does NOT match one of these known values should be grouped into a single "Ostatní" bucket in the chart. This handles free-text entries from users who typed custom industries.

  **Guard:** If fewer than 3 survey leads exist, hide the entire charts section and show a placeholder text: "Zatím není dostatek dat pro zobrazení grafů (minimum 3 odpovědi)."

  **Resilience:**
  - Wrap all chart code in `if (typeof Chart !== 'undefined') { ... }`. If Chart.js CDN failed, silently hide the charts section with no console errors.
  - Store all chart instances in variables (e.g., `let chartAiMaturity = null;`). Before creating a new chart, call `chart.destroy()` if the variable is not null. This prevents "Canvas is already in use" errors on `fetchLeads()` refresh.
  - Charts re-render on EVERY `fetchLeads()` completion (not just first load), so data stays fresh after refresh or delete operations. But charts do NOT re-render on filter changes — they always show aggregate data for ALL survey leads.
  - Each `<canvas>` element must have `role="img"` and a descriptive `aria-label` in Czech.

  **Chart.js configuration notes:**
  - All charts: `responsive: true`, `maintainAspectRatio: false`
  - Horizontal bars: `indexAxis: 'y'`
  - Donut: `type: 'doughnut'`, `cutout: '60%'`
  - Legend position: `'bottom'` for donuts, hidden for bars (labels are on the y-axis)
  - Use `Chart.register(...Chart.registerables)` or auto-register to ensure all controllers are available

- **Acceptance criteria:**
  - [ ] 6 charts render correctly when ≥3 survey leads exist in the dataset
  - [ ] "Zatím není dostatek dat" placeholder shown when <3 survey leads
  - [ ] Donut charts show correct proportions with specified color arrays
  - [ ] Bar charts show correct frequency counts — multi-select fields count each item per respondent
  - [ ] Hours Lost chart maintains ordinal order (1-5h first, 40+h last), NOT sorted by frequency
  - [ ] Industry chart groups unknown/free-text values into "Ostatní" bucket
  - [ ] Empty/undefined field values mapped to "Neuvedeno", not separate empty-string buckets
  - [ ] Charts survive page refresh — no "Canvas already in use" errors (proper `destroy()` before re-render)
  - [ ] Charts re-render with fresh data after clicking the "Obnovit" refresh button
  - [ ] Charts section hidden gracefully if Chart.js CDN fails to load (no JS errors)
  - [ ] Responsive: 2-column grid collapses to 1-column below 768px
  - [ ] Chart labels use Czech names (translate enum values to human-readable Czech labels)
  - [ ] Each canvas has `role="img"` + descriptive `aria-label`
  - [ ] Chart.js loaded with pinned version + SRI hash + `crossorigin="anonymous"`
- **Do NOT touch:** gc-pruzkum.astro, Navigation.astro, backend functions, translations

---

## Execution Order

### Parallel Group 1 (no dependencies — ALL spawn in one call)
- Task 1: Add translation keys → `frontend-developer`
- Task 3: Fix CTA in nav → `frontend-developer`
- Task 4: Add CRM charts → `frontend-developer`

### Sequential after Group 1
- Task 2: Fix visual/UX issues on survey page → `frontend-developer` (depends on: Task 1 for translation keys)

### Quality Gate (after ALL tasks complete — spawn in one call)
- Task 5: Code review → `code-reviewer`
- Task 6: Security review → `security-engineer`
- Task 7: Architecture review → `architect-reviewer`

Quality gate reviewers focus on:
- **Code reviewer:** Cross-task field naming consistency, no leftover references, prop defaults preserve existing behavior, gold colors scoped correctly
- **Security reviewer:** SRI hash on Chart.js CDN, XSS in industry free-text display (admin + emails), focus-visible not suppressed on interactive elements (accessibility)
- **Architect reviewer:** Task decomposition, file ownership, dependency correctness

---

## Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Nav restructure (Task 3) breaks other pages | High | Acceptance criteria require verifying homepage + contact page. Regression testing is mandatory. If broken, revert Navigation.astro only. |
| Industry "Other" free-text fragments chart data | Medium | Task 4 groups unknown values into "Ostatní" bucket. Known enum values get their own bars. |
| Chart.js CDN unavailable or slow in CZ | Low | SRI + `typeof Chart` guard. Charts section hidden silently on failure. Admin page still fully functional without charts. |
| Focus-visible wildcard suppresses button/link focus | Eliminated | Plan explicitly forbids wildcard selector. Only targeted rules added if double-border actually observed. |
| Task 2 is large (6 fixes in one file) | Medium | Task is the highest-risk item. Quality gate will review it most carefully. Fixes are in distinct areas (props, CSS, HTML, JS) so merge conflicts within the file are unlikely. |
| Netlify Blobs index race condition (pre-existing) | Low | Not in scope. Individual lead blobs are always stored correctly. Flagged for future: replace index with `store.list()`. |
| Chart.js CDN supply-chain attack | Medium | Mitigated by SRI hash + pinned version. CDN only loaded on password-protected admin page. |
| Admin password in localStorage (pre-existing) | Low | Not introduced by this plan. Noted for future: migrate to `sessionStorage`. |

---

## Estimated Scope

- Files created: 0
- Files modified: 4 (`survey.ts`, `gc-pruzkum.astro`, `Navigation.astro`, `leads.astro`)
- Total tasks: 4 implementation + 3 quality gate = 7
- Parallelisable groups: 2 implementation groups + 1 quality gate group
- Highest-risk task: Task 2 (6 fixes, largest LOC delta)
- No backend changes required
