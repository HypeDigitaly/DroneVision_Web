# Changelog

## [Unreleased]

### Fixed

#### Quiz Form Submission Error (2026-03-16)

Fixed critical issue where quiz form submissions failed with "Nepodařilo se odeslat. Zkuste to znovu." error, preventing users from submitting lead data and receiving quiz results.

**Root Causes:**
1. **Function timeout too short** — Netlify's default 10-second timeout was insufficient for combined AI processing + blob storage + email sending operations. Increased `timeout = 26` in `netlify.toml`.
2. **Email failure was fatal** — If Resend email delivery failed, the entire submission returned HTTP 500 error, even though quiz results were already computed and the lead was stored. Made email delivery non-fatal: users now receive results regardless of notification email status.
3. **Missing environment variable handling** — Improved graceful degradation when `RESEND_API_KEY` or `SITE_URL` are missing, with proper logging and fallback CORS domain.

**Changes:**
- `netlify.toml` — Added `timeout = 26` to `[functions]` block
- `.env.example` — Added documentation comments for `SITE_URL` (must match canonical URL) and `FROM_EMAIL` (domain must be verified in Resend)
- `astro-src/netlify/functions/quiz-lead.ts`
  - Made user email non-fatal with graceful error handling
  - Added `RESEND_API_KEY` guard check
  - Added `emailSent` boolean to response object for client visibility
  - Removed sensitive environment variable names from client-facing error messages
  - Added fallback CORS domain when `SITE_URL` is missing
  - Moved team notification template inside email capability guard
  - Truncated Resend API error bodies in logs
- `astro-src/src/components/sections/HeroQuiz.astro` — Added i18n-aware info notice on step 6 when email delivery fails

**Impact:**
- Users can now submit quiz forms successfully
- Quiz results are delivered to users even if email notifications fail
- Improved error logging and debugging visibility
- Better environment variable validation and fallback handling

**Testing:**
- Verify quiz submission completes with results display
- Test with missing/invalid `RESEND_API_KEY` — should show success with notification warning
- Test with missing `SITE_URL` — should use fallback CORS domain
- Check logs for truncated Resend error bodies (no full API response leaks)
