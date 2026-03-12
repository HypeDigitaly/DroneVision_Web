# PRD Template: Bilingual SaaS Landing Page with AI-Powered Lead Generation

**Document Version:** 2.0
**Date Created:** [CLIENT_TO_FILL]
**Owner:** [PRODUCT_MANAGER_NAME]
**Status:** [DRAFT/APPROVED/IN_DEVELOPMENT]

> **How to read this document:**
> Items marked `[CLIENT_TO_FILL]` require client input. Items marked `[FIXED SPEC]` are architectural decisions that should not be changed without a formal review. Code examples show the actual implementation patterns used in this stack.

---

## EXECUTIVE SUMMARY

**One-sentence vision:**
[CLIENT_TO_FILL: e.g., "Transform digital communication for regional government through AI chatbots and RAG systems"]

**Business objectives:**
- [ ] Primary business goal [CLIENT_TO_FILL]
- [ ] Secondary goal [CLIENT_TO_FILL]
- [ ] Revenue/conversion target [CLIENT_TO_FILL]
- [ ] Market expansion goal [CLIENT_TO_FILL]

**Target launch date:** [CLIENT_TO_FILL]
**Success metrics (after launch):** [CLIENT_TO_FILL — see Section 8 for structure]

---

## SECTION 1: PRODUCT OVERVIEW

### 1.1 Product Type & Scope

**Type:** B2B SaaS Landing Page + Lead Capture System

**What's included:**
- Landing page with multiple conversion touchpoints
- Bilingual content (Czech + English minimum)
- Contact/lead capture form with background processing
- Audit form with async background processing and status polling
- Survey form for user research collection
- Blog with bilingual posts and category filtering
- Admin dashboard for managing captured leads
- Email automation (transactional emails, bilingual)
- Analytics integration for tracking performance

**What's NOT included:**
- Customer account/login system
- Payment/billing integration
- Product demo environment
- Live chat or real-time customer support system

### 1.2 Target Users

**Primary personas:**
1. **Decision Maker** [CLIENT_TO_FILL]
   - Pain point: [CLIENT_TO_FILL]
   - Goal: [CLIENT_TO_FILL]
   - How landing page serves them: [CLIENT_TO_FILL]

2. **Technical Evaluator** [CLIENT_TO_FILL]
   - Pain point: [CLIENT_TO_FILL]
   - Goal: [CLIENT_TO_FILL]
   - How landing page serves them: [CLIENT_TO_FILL]

3. **End User** [CLIENT_TO_FILL]
   - Pain point: [CLIENT_TO_FILL]
   - Goal: [CLIENT_TO_FILL]

**Geographic market:** [CLIENT_TO_FILL — e.g., Czech Republic, EU, Global]

**Company sizes:** [CLIENT_TO_FILL — e.g., Mid-market (50–500 employees), Enterprise]

### 1.3 Key Problem Statements

**Problem 1:** [CLIENT_TO_FILL — what are customers struggling with?]
- Evidence: [CLIENT_TO_FILL — customer research, interviews, data]
- Impact: [CLIENT_TO_FILL — quantify the pain]

**Problem 2:** [CLIENT_TO_FILL]

**Problem 3:** [CLIENT_TO_FILL]

### 1.4 Value Proposition

**Headline (primary):**
[CLIENT_TO_FILL — concise, compelling, benefit-driven]

**Subheading:**
[CLIENT_TO_FILL — 1–2 sentences elaborating on main benefit]

**3 key differentiators:**
1. [CLIENT_TO_FILL]
2. [CLIENT_TO_FILL]
3. [CLIENT_TO_FILL]

**Why now?** (market context)
[CLIENT_TO_FILL — market trend, competitive landscape, urgency]

---

## SECTION 2: CLIENT INPUT CHECKLIST

### 2.1 Branding & Visual Identity

**REQUIRED — Client must provide:**

- [ ] **Company logo** (PNG/SVG, transparent background)
  - Primary version (for light/dark backgrounds)
  - Favicon (16x16, 32x32, 64x64)
  - File path: `/public/assets/images/logo.png`

- [ ] **Brand colors** (minimum 5)
  - Primary color: [HEX] (usage: CTAs, highlights)
  - Secondary color: [HEX] (usage: accents, borders)
  - Accent/Success: [HEX]
  - Background primary: [HEX]
  - Background secondary: [HEX]
  - Document: Defined in `@theme` block inside `astro-src/src/styles/global.css` [FIXED SPEC]

- [ ] **Typography specification**
  - Heading font: [FONT_NAME] (source: Google Fonts/Custom)
  - Body font: [FONT_NAME] (source: Google Fonts/Custom)
  - Monospace font (optional): [FONT_NAME]
  - Font weights to include: [e.g., 300, 400, 500, 600, 700]
  - Note: Geist font is async-preloaded via `<link rel="preload" as="style" onload="...">` pattern [FIXED SPEC]

- [ ] **Brand guidelines document** (if exists)
  - Logo usage rules
  - Color palette with technical specs
  - Typography scale
  - Tone of voice

### 2.2 Content & Copywriting

**REQUIRED — Client must provide:**

- [ ] **Homepage copy** (use template in Section 6)
  - [ ] Hero headline and subheadline
  - [ ] Hero CTA text
  - [ ] All section headings
  - [ ] All section body copy
  - [ ] All CTA button labels
  - [ ] FAQ questions and answers
  - [ ] Footer content

- [ ] **Service/product descriptions**
  - Service 1: [NAME]
    - Description: [CLIENT_TO_FILL]
    - Key features: [1–5 bullets]
    - Ideal for: [CLIENT_TO_FILL]
  - Service 2: [NAME]
  - Service 3: [NAME]
  - [etc.]

- [ ] **Case studies** (minimum 2–3)
  - Client name: [CLIENT_TO_FILL]
  - Company description: [CLIENT_TO_FILL]
  - Challenge: [CLIENT_TO_FILL]
  - Solution: [CLIENT_TO_FILL]
  - Results: [quantified metrics] [CLIENT_TO_FILL]
  - Quote/testimonial: [CLIENT_TO_FILL]
  - Logo/image: [CLIENT_TO_PROVIDE]

- [ ] **Testimonials** (minimum 3–5, preferably video or attributed)
  - Author name: [CLIENT_TO_FILL]
  - Title/role: [CLIENT_TO_FILL]
  - Company: [CLIENT_TO_FILL]
  - Quote: [CLIENT_TO_FILL]
  - Rating: [1–5 stars]

- [ ] **FAQ content** (15–20 questions minimum)
  - Organized by category: [CLIENT_TO_FILL — e.g., Product, Pricing, Implementation]
  - Format: Q&A pairs

- [ ] **Blog content** (optional but recommended)
  - Posts in both Czech and English
  - Each post needs: title_cs/title_en, excerpt_cs/excerpt_en, content_cs/content_en, category, slug, publishedDate, author, image

### 2.3 Translations & Localization

**Language strategy:** [FIXED SPEC]

- **Primary language:** Czech (default, clean URLs)
- **Secondary language:** English (`?lang=en` query parameter)
- **Translation keys:** ~1,000+ managed in modular TypeScript files under `astro-src/src/scripts/translations/`

**URL strategy:**
- Czech: `https://company.cz/` (clean, no suffix)
- English: `https://company.cz/?lang=en` (query param)
- Language detection priority: URL param → Cookie (`preferredLanguage`, 1-year lifetime) → Default (cs)
- Redirect rules: `/en/*` → `/*?lang=en` (301), `?lang=cs` → clean URL (301)

**Client responsibilities:**
- [ ] All copy must be provided in primary language (Czech) first
- [ ] Professional translation for English
- [ ] Review translated content for accuracy and brand voice
- [ ] Maintain translation consistency across all pages

**Technical note:** The translation system uses modular TypeScript files merged at build time. See Section 4.1 for full architecture.

### 2.4 Business/Commercial Input

**REQUIRED:**

- [ ] **Contact/lead form configuration**
  - Fields to capture: [CLIENT_TO_FILL — e.g., Name, Email, Company, Budget]
  - Required vs. optional fields: [CLIENT_TO_FILL]
  - Privacy/consent text: [CLIENT_TO_FILL]
  - GDPR compliance statement: [CLIENT_TO_FILL]

- [ ] **Audit form configuration**
  - What URL/domain should be audited: [CLIENT_TO_FILL]
  - Report delivery: email to submitter (bilingual, auto-generated)

- [ ] **Email configuration**
  - Sender email address: [CLIENT_TO_FILL — e.g., leads@company.com]
  - Sender name: [CLIENT_TO_FILL]
  - Reply-to address: [CLIENT_TO_FILL]
  - Internal notification recipients: [EMAIL_ADDRESSES]
  - Email template preferences: [CLIENT_TO_FILL]

- [ ] **Lead qualification criteria** (optional but recommended)
  - How should leads be scored? [CLIENT_TO_FILL]
  - Which fields indicate high-value leads? [CLIENT_TO_FILL]

- [ ] **Analytics & tracking configuration**
  - Google Analytics 4 property ID: [CLIENT_TO_FILL]
  - Microsoft Clarity project ID: [CLIENT_TO_FILL]
  - UTM parameter strategy: [CLIENT_TO_FILL — which sources/mediums to track?]
  - Conversion events to track: [CLIENT_TO_FILL]

- [ ] **Pricing information**
  - Pricing tiers/packages: [CLIENT_TO_FILL]
  - Pricing page location: [CLIENT_TO_FILL — include in /pricing or hero CTA?]

- [ ] **Offer / solutions structure**
  - What exactly does the company sell/provide: [CLIENT_TO_FILL]
  - Packages/tiers: [CLIENT_TO_FILL]
  - Service bundles: [CLIENT_TO_FILL]

- [ ] **Target audience definition**
  - Demographics: [CLIENT_TO_FILL — age, location, income, education]
  - Psychographics: [CLIENT_TO_FILL — values, interests, pain points]
  - Buying behavior: [CLIENT_TO_FILL — decision-making process, budget]

- [ ] **Lead magnet specification**
  - Free resource offered: [CLIENT_TO_FILL — audit, template, guide, toolkit?]
  - Format: [CLIENT_TO_FILL — PDF, interactive tool, video, checklist]
  - Lead capture value: [CLIENT_TO_FILL — what value does it provide?]

- [ ] **Customer journey / process roadmap**
  - Step 1 (Initial Contact): [CLIENT_TO_FILL]
  - Step 2 (Consultation): [CLIENT_TO_FILL]
  - Step 3 (Proposal/Onboarding): [CLIENT_TO_FILL]
  - Step 4 (Delivery/Implementation): [CLIENT_TO_FILL]
  - Timeline: [CLIENT_TO_FILL — how many days/weeks between steps?]

- [ ] **Booking/Scheduling Integration**
  - Cal.com embed code: [CLIENT_TO_FILL] OR
  - Calendly embed code: [CLIENT_TO_FILL]
  - Calendar location: footer section (lazy-loaded)

- [ ] **Social Proof Integration**
  - Google Reviews link: [CLIENT_TO_FILL]
  - Trustpilot profile URL: [CLIENT_TO_FILL]
  - Review badge display: on hero or dedicated section?

- [ ] **Third-party integrations**
  - Email service provider: Resend [FIXED SPEC]
  - Calendar booking: Cal.com or Calendly (lazy-loaded in footer via IntersectionObserver)
  - Chat/support widget: [CLIENT_TO_FILL — e.g., Voiceflow]
  - CRM system: [CLIENT_TO_FILL — e.g., HubSpot, Pipedrive]

- [ ] **Legal & Company Information**
  - Company legal name: [CLIENT_TO_FILL — with legal form: s.r.o., a.s., etc.]
  - IČO (Identification Number): [CLIENT_TO_FILL]
  - DIČ (Tax ID, if VAT registered): [CLIENT_TO_FILL]
  - Registered address: [CLIENT_TO_FILL — for footer and legal pages]
  - Company executives: [CLIENT_TO_FILL — names, roles, emails, phone]
  - Data Processing Officer contact: [CLIENT_TO_FILL — if applicable for GDPR]

- [ ] **Domain & hosting**
  - Primary domain: [CLIENT_TO_FILL]
  - Subdomain strategy: [CLIENT_TO_FILL]
  - Hosting provider: Netlify [FIXED SPEC]
  - SSL certificate: Auto-provisioned by Netlify [FIXED SPEC]

### 2.5 Media Assets

**Client must provide:**

- [ ] **Hero section image/video**
  - Format: JPG/PNG/WebP for image, MP4/WebM for video
  - Dimensions: [CLIENT_TO_FILL — recommended 1920x1080 minimum]
  - Alt text: [CLIENT_TO_FILL]
  - File path: `/public/assets/images/hero/`

- [ ] **VSL (Video Sales Letter)**
  - YouTube video ID or embed code: [CLIENT_TO_FILL]
  - VSL thumbnail image: 1280×720px (WebP preferred)
  - VSL duration: [CLIENT_TO_FILL — recommended 60–120 seconds]
  - Captions/subtitles: Czech and English (WebVTT format)
  - File path: `/public/assets/videos/` (for thumbnails and captions)
  - Hero layout pattern: Text+form LEFT, VSL RIGHT (desktop); stacked on mobile
  - Implementation: YoutubeFacade.astro component (shows thumbnail + play button, loads iframe on click)
  - DNS prefetch: youtube.com and i.ytimg.com [FIXED SPEC]
  - Mobile responsive: 16:9 aspect ratio, full-width below 768px breakpoint

- [ ] **Client/customer logos** (for "Trusted By" section)
  - Quantity: minimum 5–10 recommended
  - Format: PNG with transparent background
  - File path: `/public/assets/images/clients/`
  - Data file: `astro-src/src/data/clients.json`

- [ ] **Case study images**
  - Per case study: 1–3 relevant images or screenshots
  - Format: JPG/PNG

- [ ] **CEO/team photos** (if featuring team/founder)
  - Format: JPG (professional headshot)
  - Dimensions: Minimum 400x400px

- [ ] **Product screenshots/videos**
  - Video format: MP4 (H.264 codec, AAC audio)
  - Duration: [CLIENT_TO_FILL — 30–90 seconds recommended for hero]

- [ ] **Icons** (for features, services, benefits sections)
  - Format: SVG preferred
  - Alternative: Iconify library (included, no client assets needed)

- [ ] **Blog post images**
  - Format: WebP preferred (JPG/PNG accepted)
  - Dimensions: 1200x630px recommended (OG-compatible)

---

## SECTION 3: TECHNICAL ARCHITECTURE

### 3.1 Tech Stack [FIXED SPEC]

This is the fixed specification. Deviations require architectural review.

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Framework** | Astro | 5.x | Zero JS by default, fast builds, excellent for static sites |
| **Styling** | Tailwind CSS | 4.x | Utility-first via `@tailwindcss/vite` plugin — no `tailwind.config.mjs` |
| **Language** | TypeScript | 5.x | Type safety, reduced bugs, better DX |
| **Icons** | Iconify | Latest | SVG icons without bundling, extensive library |
| **Email Service** | Resend | Latest | Simple API, excellent deliverability, free tier available |
| **Serverless Functions** | Netlify Functions | N/A | Native integration, background function support for audit |
| **Key-Value Store** | Netlify Blobs | N/A | Serverless KV storage: `audit-leads`, `contact-leads`, `survey-leads` stores |
| **Analytics** | GA4 + Clarity | Latest | Conversion tracking + session replay |
| **Hosting** | Netlify | N/A | Perfect for Astro, automatic builds, CDN included |
| **SSL** | Netlify (included) | N/A | Auto-provisioned via Let's Encrypt |

### 3.2 System Architecture Overview

```
Client Browser
      |
  [Netlify CDN]
      |
[Static HTML + CSS + JS]  (Astro SSG output)
      |
      |--- Contact Form ---> [Netlify Function: contact.ts]
      |                           |--- Store in contact-leads (Blobs)
      |                           |--- Send email (Resend)
      |                           |--- UTM data attached
      |
      |--- Audit Form -----> [audit-validate.ts]  (fast validation, ~200ms)
      |                           |
      |                      [audit-background.ts]  (15-min timeout, 202 immediately)
      |                           |--- pending -> validating -> researching
      |                           |--- -> generating -> storing -> emailing -> completed
      |                           |--- Store in audit-leads (Blobs)
      |
      |--- Poll status ----> [audit-status.ts]  (GET, returns 0-100% progress)
      |
      |--- Survey Form ----> [survey.ts]
      |                           |--- Store in survey-leads (Blobs)
      |
      |--- Admin ---------> [admin-leads.ts]  (multi-method: GET/PUT/DELETE)
      |                     [admin-leads-delete.ts]
      |
  [/admin dashboard]
      |--- View Leads
      |--- Export CSV
      |--- Analytics
```

### 3.3 Directory Structure [FIXED SPEC]

The Astro project lives inside an `astro-src/` subdirectory of the repository root.

```
project-root/                         <- Git repository root
├── astro-src/                        <- Astro project root (base = "astro-src" in netlify.toml)
│   ├── src/
│   │   ├── components/
│   │   │   ├── navigation/
│   │   │   │   ├── Navigation.astro
│   │   │   │   ├── MobileMenu.astro
│   │   │   │   └── LanguageSwitcher.astro
│   │   │   ├── footer/
│   │   │   │   ├── FooterFull.astro   (includes Cal.com + Google Maps, lazy-loaded)
│   │   │   │   └── FooterSimple.astro
│   │   │   ├── sections/
│   │   │   │   ├── Hero.astro
│   │   │   │   ├── Services.astro
│   │   │   │   ├── CaseStudies.astro
│   │   │   │   ├── Testimonials.astro
│   │   │   │   ├── FAQ.astro
│   │   │   │   ├── ContactCTA.astro
│   │   │   │   ├── TechStack.astro
│   │   │   │   ├── TrustedBy.astro
│   │   │   │   └── Pricing.astro     (if applicable)
│   │   │   ├── blog/
│   │   │   │   ├── BlogCard.astro
│   │   │   │   └── BlogCategoryFilter.astro
│   │   │   ├── ui/
│   │   │   │   ├── Button.astro
│   │   │   │   ├── Card.astro
│   │   │   │   ├── Badge.astro
│   │   │   │   ├── Form.astro
│   │   │   │   └── Modal.astro
│   │   │   └── backgrounds/
│   │   │       ├── DigitalRain.astro
│   │   │       └── GridBackground.astro
│   │   ├── layouts/
│   │   │   ├── BaseLayout.astro
│   │   │   ├── PageLayout.astro
│   │   │   └── LegalLayout.astro
│   │   ├── pages/
│   │   │   ├── index.astro                    <- Homepage
│   │   │   ├── sitemap.xml.ts                 <- Dynamic sitemap route [FIXED SPEC]
│   │   │   ├── blog/
│   │   │   │   ├── index.astro                <- Blog listing with category filter
│   │   │   │   └── [slug].astro               <- Dynamic blog post pages
│   │   │   ├── services/                      <- Static .astro files per service [FIXED SPEC]
│   │   │   │   ├── chatbot.astro
│   │   │   │   ├── voicebot.astro
│   │   │   │   ├── ai-agent.astro
│   │   │   │   ├── audit.astro
│   │   │   │   └── [other-services].astro
│   │   │   ├── privacy-policy.astro
│   │   │   ├── terms-of-service.astro
│   │   │   ├── contact.astro
│   │   │   ├── consult.astro
│   │   │   └── 404.astro
│   │   ├── styles/
│   │   │   ├── global.css              <- ~1,300 lines: @import "tailwindcss", @theme,
│   │   │   │                              base styles, animations, component styles,
│   │   │   │                              .shiny-cta, .vf-button, .nav-cta-button
│   │   │   └── cookie-consent.css      <- ~200 lines: isolated cookie consent styles
│   │   ├── scripts/
│   │   │   ├── translations/           <- Modular i18n system [FIXED SPEC]
│   │   │   │   ├── index.ts            <- Barrel: mergeTranslations(), getLocalizedHref()
│   │   │   │   ├── types.ts            <- Language = 'cs' | 'en', TranslationKeys
│   │   │   │   ├── core.ts             <- Navigation, common UI, footer (~77 keys)
│   │   │   │   ├── landing.ts          <- Homepage sections (~66 keys)
│   │   │   │   ├── service-pages.ts    <- Service page content (~65 keys)
│   │   │   │   ├── chatbot.ts          <- Chatbot service page (~164 keys)
│   │   │   │   ├── contact.ts          <- Contact form & page (~67 keys)
│   │   │   │   ├── consult.ts          <- Consultation page (~80 keys)
│   │   │   │   ├── dataprep.ts         <- Data preparation page (~118 keys)
│   │   │   │   ├── audit.ts            <- Audit page & form (~67 keys)
│   │   │   │   ├── survey.ts           <- Survey form
│   │   │   │   ├── blog.ts             <- Blog pages (~72 keys)
│   │   │   │   ├── legal.ts            <- Privacy policy (~168 keys)
│   │   │   │   └── misc.ts             <- Miscellaneous (~62 keys)
│   │   │   ├── animations.ts           <- Scroll triggers, IntersectionObserver
│   │   │   ├── form.ts                 <- Form validation, submission
│   │   │   ├── analytics.ts            <- GA4, Clarity integration
│   │   │   ├── utm-tracker.ts          <- UTM capture, cookie, referrer detection
│   │   │   ├── cookie-consent.ts       <- CookieConsentManager class (code-split chunk)
│   │   │   └── utils.ts                <- Helpers
│   │   ├── data/
│   │   │   ├── blog-posts.json         <- All blog content (bilingual fields)
│   │   │   ├── clients.json            <- Client logos
│   │   │   ├── faq.json                <- FAQ content
│   │   │   └── sitemap-data.json       <- Generated by prebuild script
│   │   └── types/
│   │       ├── index.ts                <- General TypeScript types/interfaces
│   │       └── blog.ts                 <- BlogPost, BlogCategory interfaces
│   ├── public/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   ├── hero/
│   │   │   │   ├── clients/
│   │   │   │   ├── case-studies/
│   │   │   │   └── icons/
│   │   │   └── videos/
│   │   ├── robots.txt
│   │   └── .well-known/                <- GDPR, security.txt, etc.
│   ├── scripts/
│   │   └── generate-sitemap-data.js    <- Prebuild script for sitemap data
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   └── package.json
├── netlify/
│   ├── functions/
│   │   ├── contact.ts                  <- Contact form handler
│   │   ├── audit-background.ts         <- Background function (15-min timeout)
│   │   ├── audit-status.ts             <- GET polling: returns job progress 0-100%
│   │   ├── audit-validate.ts           <- Fast validation endpoint
│   │   ├── audit-report.ts             <- Report retrieval
│   │   ├── audit-services/             <- Shared audit service modules
│   │   ├── audit-shared/               <- Shared audit utilities
│   │   ├── admin-leads.ts              <- Multi-method handler (GET/PUT)
│   │   ├── admin-leads-delete.ts       <- DELETE handler (separate for clarity)
│   │   ├── email-templates.ts          <- Base bilingual email templates
│   │   ├── audit-templates.ts          <- Audit-specific email templates
│   │   ├── survey.ts                   <- Survey form handler
│   │   └── survey-templates.ts         <- Survey email templates
│   └── edge-functions/                 <- Optional: redirects, A/B testing
├── netlify.toml
├── .env.example
└── README.md
```

**Note on service pages:** Service pages are individual static `.astro` files (one file per service), not a single dynamic `[service-name].astro` route. This ensures full static generation and optimal per-page SEO control. [FIXED SPEC]

**Note on data files:** Most page content is managed through the translation TypeScript modules or embedded directly in page components. The `data/` directory contains structured data that needs to be queried at build time (blog posts, client logos, FAQ items, sitemap data).

### 3.4 Key Configuration Files

#### astro.config.mjs [FIXED SPEC]

```javascript
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  adapter: netlify(),
  build: {
    inlineStylesheets: 'always',
    assets: '_astro',
  },
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'cookie-consent': ['./src/scripts/cookie-consent.ts'],
          },
        },
      },
    },
  },
});
```

**Key points:**
- Tailwind CSS v4 is integrated via `@tailwindcss/vite` plugin — there is no `tailwind.config.mjs` file
- `cookie-consent.ts` is code-split into its own chunk to enable async loading
- `inlineStylesheets: 'always'` reduces render-blocking requests
- `compressHTML: true` minimizes HTML output size

#### netlify.toml [FIXED SPEC]

```toml
[build]
  base = "astro-src"
  command = "npm run build"
  publish = "dist"
  functions = "../netlify/functions"

[functions]
  node_bundler = "esbuild"
  included_files = ["../netlify/functions/**"]

[build.environment]
  NODE_VERSION = "20"

[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.images]
  compress = true

[[redirects]]
  from = "/en/*"
  to = "/:splat?lang=en"
  status = 301

[[redirects]]
  from = "/*"
  query = { lang = "cs" }
  to = "/:splat"
  status = 301

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; frame-src https://app.cal.com https://www.google.com https://www.youtube.com"
```

### 3.5 CSS Architecture [FIXED SPEC]

Tailwind CSS v4 uses the `@theme` directive inside `global.css` for all design tokens. There is no `tailwind.config.mjs`.

#### src/styles/global.css (~1,300 lines)

```css
@import "tailwindcss";

/* === DESIGN TOKENS === */
@theme {
  --color-primary: #00A39A;
  --color-primary-light: #00C4B4;
  --color-primary-dark: #008B84;
  --font-family-geist: 'Geist', sans-serif;
  /* [CLIENT_TO_FILL: add brand colors here] */
  /* --color-brand-secondary: #HEX; */
}

/* === BASE STYLES === */
/* CSS reset, base element styles, font imports */

/* === ANIMATIONS === */
/* @keyframes definitions, scroll reveal, hover states */

/* === COMPONENT STYLES === */
/* Reusable component classes, manual TW v4 utility overrides */

/* === BUTTON SYSTEMS === */
/* Three distinct animated button systems (see Section 4.5) */
```

#### src/styles/cookie-consent.css (~200 lines)

Isolated styles for the cookie consent banner. Kept separate to allow independent loading and to avoid FOUC (flash of unstyled content) on first visit.

### 3.6 Component Specifications

#### Navigation Component
**Purpose:** Global navigation bar (desktop + mobile)
**Props:**
- `currentPage?: string` — highlight active section
- `lang?: Language` — current language ('cs' | 'en')

**Features:**
- Sticky positioning on scroll
- Transparent with backdrop blur
- Desktop: Horizontal menu with dropdowns
- Mobile: Hamburger menu with collapsible sections
- Language switcher (toggles between clean URL and `?lang=en`)
- Nav CTA button (`.nav-cta-button` class with floating bubble animation)

**File:** `src/components/navigation/Navigation.astro`

#### Hero Section Component
**Purpose:** First impression, lead capture, value proposition
**Layout Options:**

*Option A: Text-heavy with form*
- Left: Headline, subheadline, CTA form
- Right: Feature list or social proof

*Option B: Image/video background*
- Full-width background image
- Headline and form overlay
- Gradient overlay for readability

*Option C: Split design*
- Left half: Content
- Right half: Hero image/video

**CTA elements:**
- Shiny CTA button (`.shiny-cta` class — rotating conic gradient border, shimmer animation)
- Email capture form or full lead form

**File:** `src/components/sections/Hero.astro`

#### VSL (Video Sales Letter) Integration
**Purpose:** Hero section video marketing — YouTube embed with lazy-loading facade pattern
**Layout:**
- Desktop: Text + form on LEFT side, VSL video on RIGHT side
- Mobile: Content stacked (video above form)

**Implementation pattern:**
- Use `YoutubeFacade.astro` component — shows thumbnail + play button, loads iframe on click
- Alternative: `VideoModal.astro` for lightbox display
- DNS prefetch for youtube.com and i.ytimg.com (deferred until needed)
- GA4 tracking events:
  - `video_play` — user clicked play button
  - `video_progress` — tracked at 25%, 50%, 75%, 100% completion

**Component files:**
- `src/components/YoutubeFacade.astro` — lazy-loading facade with thumbnail
- `src/components/VideoModal.astro` — modal/lightbox alternative

**Responsive behavior:**
- Video aspect ratio: 16:9 (maintained on all sizes)
- Desktop (≥768px): video 50% width, right-aligned
- Mobile (<768px): video full-width below form/content

**Props for YoutubeFacade.astro:**
- `youtubeId: string` — YouTube video ID
- `title: string` — video title/alt text
- `thumbnail?: string` — custom thumbnail URL (default: YouTube CDN)
- `gaEventLabel?: string` — GA4 event label

**File:** `src/components/sections/Hero.astro` (uses YoutubeFacade or VideoModal as needed)

#### Services/Solutions Section
**Purpose:** Describe core offerings
**Layout:** Grid of 3–6 service cards
**Card:** Icon + Title + Description + Link to individual static service page

**File:** `src/components/sections/Services.astro`

#### Blog Components
**Purpose:** Display bilingual blog content with category filtering

**Files:**
- `src/components/blog/BlogCard.astro` — individual post card
- `src/components/blog/BlogCategoryFilter.astro` — category filter tabs
- `src/pages/blog/index.astro` — listing page
- `src/pages/blog/[slug].astro` — individual post page
- `src/data/blog-posts.json` — all posts with bilingual fields
- `src/types/blog.ts` — TypeScript interfaces

**blog-posts.json structure:**
```json
[
  {
    "slug": "example-post",
    "title_cs": "Příklad nadpisu článku",
    "title_en": "Example Article Title",
    "excerpt_cs": "Krátký popis článku v češtině.",
    "excerpt_en": "Short article excerpt in English.",
    "content_cs": "Plný obsah v češtině...",
    "content_en": "Full content in English...",
    "category": "ai",
    "publishedDate": "2026-03-01",
    "author": "Author Name",
    "image": "/assets/images/blog/example-post.webp"
  }
]
```

**BlogPost TypeScript interface (src/types/blog.ts):**
```typescript
export interface BlogPost {
  slug: string;
  title_cs: string;
  title_en: string;
  excerpt_cs: string;
  excerpt_en: string;
  content_cs: string;
  content_en: string;
  category: BlogCategory;
  publishedDate: string;
  author: string;
  image: string;
}

export type BlogCategory = 'ai' | 'automation' | 'case-study' | 'news' | string;
```

#### Footer Component
**Purpose:** Navigation, legal info, contact details, Cal.com calendar, Google Maps, copyright
**Sections:**

1. **Quick Links** — localized per language
2. **Legal** — Privacy Policy, Terms of Service, GDPR statement
3. **Social Links** — LinkedIn, Twitter, Facebook (as configured)
4. **Contact Info** — email, phone, address
5. **Cal.com Calendar Embed** — lazy-loaded via IntersectionObserver; `dns-prefetch` for `app.cal.com`; embed script only loads when section scrolls into view
6. **Google Maps Embed** — lazy-loaded via IntersectionObserver; heavy iframe deferred until visible
7. **Copyright** — year + company name

**File:** `src/components/footer/FooterFull.astro`

**Lazy-loading pattern for footer embeds:**
```javascript
// Used for both Cal.com and Google Maps in the footer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Load embed script / set iframe src
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: '200px' });

observer.observe(document.getElementById('calendar-section'));
observer.observe(document.getElementById('map-section'));
```

---

## SECTION 4: CRITICAL FEATURES

### 4.1 Bilingual/Internationalization (i18n) [FIXED SPEC]

**Translation module architecture:**

The translation system uses modular TypeScript files instead of a single JSON file. Each module covers one page or feature area and exports `{ cs: {...}, en: {...} }`.

```
src/scripts/translations/
├── index.ts          <- Barrel export: mergeTranslations(), getLocalizedHref(), Language type
├── types.ts          <- Language = 'cs' | 'en', TranslationKeys interface
├── core.ts           <- Navigation, common UI, footer strings (~77 keys)
├── landing.ts        <- Homepage sections (~66 keys)
├── service-pages.ts  <- Service page content (~65 keys)
├── chatbot.ts        <- Chatbot service page (~164 keys)
├── contact.ts        <- Contact form & page (~67 keys)
├── consult.ts        <- Consultation page (~80 keys)
├── dataprep.ts       <- Data preparation page (~118 keys)
├── audit.ts          <- Audit page & form (~67 keys)
├── survey.ts         <- Survey form
├── blog.ts           <- Blog pages (~72 keys)
├── legal.ts          <- Privacy policy (~168 keys)
└── misc.ts           <- Miscellaneous (~62 keys)
```

**Individual module format (e.g., core.ts):**

```typescript
export const coreTranslations = {
  cs: {
    'nav.home': 'Domů',
    'nav.services': 'Služby',
    'nav.contact': 'Kontakt',
    'footer.rights': 'Všechna práva vyhrazena',
    // ... ~77 keys total
  },
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'footer.rights': 'All rights reserved',
    // ... ~77 keys total
  },
};
```

**Barrel index.ts:**

```typescript
import { coreTranslations } from './core';
import { landingTranslations } from './landing';
import { serviceTranslations } from './service-pages';
import { chatbotTranslations } from './chatbot';
import { contactTranslations } from './contact';
import { consultTranslations } from './consult';
import { dataprepTranslations } from './dataprep';
import { auditTranslations } from './audit';
import { surveyTranslations } from './survey';
import { blogTranslations } from './blog';
import { legalTranslations } from './legal';
import { miscTranslations } from './misc';
import type { TranslationKeys } from './types';

export type Language = 'cs' | 'en';

function mergeTranslations(lang: Language): TranslationKeys {
  return {
    ...coreTranslations[lang],
    ...landingTranslations[lang],
    ...serviceTranslations[lang],
    ...chatbotTranslations[lang],
    ...contactTranslations[lang],
    ...consultTranslations[lang],
    ...dataprepTranslations[lang],
    ...auditTranslations[lang],
    ...surveyTranslations[lang],
    ...blogTranslations[lang],
    ...legalTranslations[lang],
    ...miscTranslations[lang],
  };
}

export const translations: Record<Language, TranslationKeys> = {
  cs: mergeTranslations('cs'),
  en: mergeTranslations('en'),
};

export function getLocalizedHref(path: string, lang: Language): string {
  if (lang === 'cs') return path;
  return `${path}?lang=en`;
}
```

**Usage in Astro components:**

```astro
---
import { translations, type Language } from '../scripts/translations/index';

const lang = (Astro.url.searchParams.get('lang') as Language) || 'cs';
const t = translations[lang];
---

<h1>{t['hero.title']}</h1>
<a href={`/contact${lang === 'en' ? '?lang=en' : ''}`}>{t['nav.contact']}</a>
```

**Language detection priority:**
1. URL param: `?lang=en` present → use English
2. Cookie: `preferredLanguage` cookie (1-year lifetime) → use stored preference
3. Default: Czech

**hreflang implementation (correct for this URL strategy):**

```html
<!-- In BaseLayout.astro head -->
<link rel="alternate" hreflang="cs" href="https://company.cz/">
<link rel="alternate" hreflang="en" href="https://company.cz/?lang=en">
<link rel="alternate" hreflang="x-default" href="https://company.cz/">
```

**SEO considerations:**
- Czech content is the default and receives clean canonical URLs
- English content uses canonical URL with `?lang=en`
- Both variants are included in the dynamic sitemap

### 4.2 Lead Capture & Background Processing

#### Standard Contact Form

**Flow:**
```
User fills form + clicks submit
    |
Client-side validation + UTM data attachment
    |
[Honeypot check — verify spam field is empty]
    |
POST /api/contact with form data + UTM context
    |
[Netlify Function: contact.ts]
    |-- Validate data (server-side)
    |-- Generate lead ID: lead-{timestamp}-{random}
    |-- Update _leads_index key in contact-leads Blob store
    |-- Store lead JSON in contact-leads Blob store
    |-- Send bilingual notification email (Resend)
    |-- Send confirmation email to user (optional)
    |-- Return success response
    |
Show success message to user
```

**Netlify Blobs storage pattern:**

```typescript
import { getStore } from '@netlify/blobs';

// Each store name maps to a specific form type
const store = getStore('contact-leads');  // or 'audit-leads', 'survey-leads'

// Generate deterministic but unique ID
const leadId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Update the leads index (array of IDs)
const existingIndex = await store.getJSON('_leads_index') as string[] || [];
await store.setJSON('_leads_index', [...existingIndex, leadId]);

// Store individual lead
await store.setJSON(leadId, {
  id: leadId,
  ...formData,
  utmData,  // from hd_traffic_source cookie
  timestamp: new Date().toISOString(),
  status: 'new',
});
```

**Three Blob stores:**
- `contact-leads` — contact form submissions
- `audit-leads` — audit request submissions + generated report data
- `survey-leads` — survey form responses

Each store uses `_leads_index` key containing an array of lead IDs. Individual leads are accessed by their generated `lead-{timestamp}-{random}` ID.

#### Audit Background Processing [FIXED SPEC]

The audit feature uses an async background processing pattern because generating a full site audit can take several minutes.

**Functions:**

| Function | Type | Purpose |
|----------|------|---------|
| `audit-validate.ts` | Standard (~200ms) | Fast validation: checks URL format, rate limits, creates job record |
| `audit-background.ts` | Background (15-min timeout) | Full audit processing: returns HTTP 202 immediately, processes async |
| `audit-status.ts` | Standard GET | Polling endpoint: returns job state and progress percentage (0–100%) |
| `audit-report.ts` | Standard GET | Returns completed report data for display |

**Job status state machine:**

```
pending → validating → researching → generating → storing → emailing → completed
                                                                     → failed
```

**Frontend polling pattern:**

```typescript
// After submitting audit form, poll until completion
async function pollAuditStatus(jobId: string) {
  const interval = setInterval(async () => {
    const res = await fetch(`/api/audit-status?jobId=${jobId}`);
    const { state, progress } = await res.json();

    updateProgressBar(progress);   // 0-100

    if (state === 'completed') {
      clearInterval(interval);
      showReport(jobId);
    } else if (state === 'failed') {
      clearInterval(interval);
      showError();
    }
  }, 3000);  // poll every 3 seconds
}
```

**Background function pattern:**

```typescript
// audit-background.ts
import type { BackgroundHandler } from '@netlify/functions';

export const handler: BackgroundHandler = async (event) => {
  // Returns 202 immediately — processing happens asynchronously
  const jobId = JSON.parse(event.body || '{}').jobId;
  const store = getStore('audit-leads');

  await updateJobStatus(store, jobId, 'validating', 5);
  // ... validate URL

  await updateJobStatus(store, jobId, 'researching', 25);
  // ... research site data

  await updateJobStatus(store, jobId, 'generating', 60);
  // ... generate AI report

  await updateJobStatus(store, jobId, 'storing', 85);
  // ... save report to Blobs

  await updateJobStatus(store, jobId, 'emailing', 95);
  // ... send report email via Resend

  await updateJobStatus(store, jobId, 'completed', 100);
};
```

#### Contact Form Client-Side Implementation

File: `src/scripts/form.ts`

```typescript
export function initContactForm() {
  const form = document.querySelector('#contact-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Attach UTM data from cookie
    const utmData = getUTMData();  // from utm-tracker.ts

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      honeyPot: formData.get('website_url'),
      utmData,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        window.gtag?.('event', 'form_submission', {
          event_category: 'engagement',
          event_label: 'contact_form',
        });
        form.innerHTML = '<div class="success-message">...</div>';
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });
}
```

### 4.3 UTM Tracking [FIXED SPEC]

File: `src/scripts/utm-tracker.ts`

The UTM tracker captures campaign attribution data and attaches it to all form submissions.

**Features:**
- Captures: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, `msclkid`
- Stores in 30-day cookie named `hd_traffic_source`
- First-touch attribution (preserves original source; campaigns with UTM params override direct)
- Auto-detects referrer platform: Google, Facebook, LinkedIn, Twitter, etc.
- Data automatically attached to all form submissions

```typescript
// src/scripts/utm-tracker.ts

export interface UTMData {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
  referrerPlatform?: string;
  capturedAt: string;
}

const COOKIE_NAME = 'hd_traffic_source';
const COOKIE_DAYS = 30;

export function initUTMTracker(): void {
  const params = new URLSearchParams(window.location.search);

  const hasUTM = params.has('utm_source') || params.has('gclid')
    || params.has('fbclid') || params.has('msclkid');

  // First-touch: only update if no existing cookie, or new campaign data present
  const existing = getUTMData();
  if (existing && !hasUTM) return;

  const data: UTMData = {
    source: params.get('utm_source') || detectReferrerPlatform(),
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    content: params.get('utm_content') || undefined,
    term: params.get('utm_term') || undefined,
    gclid: params.get('gclid') || undefined,
    fbclid: params.get('fbclid') || undefined,
    msclkid: params.get('msclkid') || undefined,
    referrer: document.referrer || undefined,
    referrerPlatform: detectReferrerPlatform(),
    capturedAt: new Date().toISOString(),
  };

  setCookie(COOKIE_NAME, JSON.stringify(data), COOKIE_DAYS);
}

export function getUTMData(): UTMData | null {
  const raw = getCookie(COOKIE_NAME);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function detectReferrerPlatform(): string | undefined {
  const ref = document.referrer.toLowerCase();
  if (ref.includes('google')) return 'google';
  if (ref.includes('facebook') || ref.includes('fb.com')) return 'facebook';
  if (ref.includes('linkedin')) return 'linkedin';
  if (ref.includes('twitter') || ref.includes('t.co')) return 'twitter';
  if (ref.includes('bing')) return 'bing';
  return ref ? 'referral' : 'direct';
}
```

### 4.4 Cookie Consent Architecture [FIXED SPEC]

File: `src/scripts/cookie-consent.ts`

```typescript
export class CookieConsentManager {
  private consentKey = 'hd_cookie_consent';

  hasConsent(category: 'analytics' | 'marketing' | 'functional'): boolean { /* ... */ }
  showBanner(): void { /* ... */ }
  acceptAll(): void { /* ... */ }
  rejectNonEssential(): void { /* ... */ }
  savePreferences(prefs: Record<string, boolean>): void { /* ... */ }
}
```

**Integration with Vite build:**
- `cookie-consent.ts` is extracted into its own chunk via `rollupOptions.output.manualChunks`
- Loaded asynchronously, does not block page render
- Isolated styles in `src/styles/cookie-consent.css`
- GA4 and Clarity only initialize after analytics consent is granted

### 4.5 Button Systems [FIXED SPEC]

Three distinct animated button systems are defined in `src/styles/global.css`:

#### Shiny CTA (`.shiny-cta`)
Full-width pill button with animated effects.
- Rotating conic gradient border
- Shimmer sweep animation on the border layer
- Breathing glow (box-shadow pulse)
- Color variants: teal (default), purple, blue, orange, cyan, pink
- Usage: Primary conversion CTAs, hero section

```css
/* Example variant in global.css */
.shiny-cta {
  /* Full-width pill shape */
  /* Rotating conic gradient border via pseudo-element */
  /* Shimmer animation on ::before */
  /* Breathing glow on ::after */
}

.shiny-cta--purple { /* purple gradient variant */ }
.shiny-cta--blue   { /* blue gradient variant */ }
/* etc. */
```

#### Voiceflow Button (`.vf-button`)
Rounded button for chat/bot interaction triggers.
- Radial gradient background
- Floating particle dots (animated pseudo-elements)
- Inner glow effect
- Usage: Chatbot launch, Voiceflow widget trigger

#### Nav CTA Button (`.nav-cta-button`)
Compact button for the navigation bar.
- Gradient background
- Floating bubble animation
- Usage: Navigation bar CTA only

### 4.6 Email Templates [FIXED SPEC]

Email templates are modular TypeScript files in `netlify/functions/`:

| File | Purpose |
|------|---------|
| `email-templates.ts` | Base module: layout, styles, `escapeHtml()` XSS prevention, bilingual wrapper |
| `audit-templates.ts` | Audit-specific: report summary, job status notification |
| `survey-templates.ts` | Survey-specific: confirmation and internal notification |

**Template requirements:**
- Bilingual support (Czech/English selected by lead's language preference)
- UTM data included in internal notification emails
- `escapeHtml()` applied to all user-supplied input before insertion into HTML
- Responsive HTML email layout

```typescript
// From email-templates.ts
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function buildEmailLayout(content: string, lang: 'cs' | 'en'): string {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>...</head>
<body>
  <div class="email-wrapper">
    ${content}
  </div>
</body>
</html>`;
}
```

### 4.7 SEO & Structured Data

**On-page SEO elements:**

1. **Meta tags** (every page)
   - `<title>`: keyword-rich, 50–60 characters
   - `<meta name="description">`: 150–160 characters, include main keyword
   - Canonical URL (self-referencing, or `?lang=en` variant for English)

2. **Open Graph tags** (for social sharing)
   - `og:title`, `og:description`, `og:image`, `og:url`, `og:locale`

3. **hreflang tags** (query-param strategy)
   ```html
   <link rel="alternate" hreflang="cs" href="https://company.cz/">
   <link rel="alternate" hreflang="en" href="https://company.cz/?lang=en">
   <link rel="alternate" hreflang="x-default" href="https://company.cz/">
   ```

4. **Structured data** (JSON-LD)
   - Organization schema
   - LocalBusiness schema (if location-specific)
   - Service schema (per service page)
   - FAQ schema
   - Article schema (blog posts)
   - BreadcrumbList schema

5. **Dynamic sitemap** (`src/pages/sitemap.xml.ts`)
   ```typescript
   // src/pages/sitemap.xml.ts
   import type { APIRoute } from 'astro';
   import sitemapData from '../data/sitemap-data.json';

   export const GET: APIRoute = async () => {
     const urls = sitemapData.pages.map(page => `
       <url>
         <loc>${page.loc}</loc>
         <lastmod>${page.lastmod}</lastmod>
         <changefreq>${page.changefreq}</changefreq>
         <priority>${page.priority}</priority>
         <xhtml:link rel="alternate" hreflang="cs" href="${page.loc}"/>
         <xhtml:link rel="alternate" hreflang="en" href="${page.loc}?lang=en"/>
       </url>
     `).join('');

     return new Response(
       `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml">
          ${urls}
        </urlset>`,
       { headers: { 'Content-Type': 'application/xml' } }
     );
   };
   ```

   The `sitemap-data.json` is generated by the `scripts/generate-sitemap-data.js` prebuild script, which runs before the Astro build:

   ```json
   // astro-src/package.json
   {
     "scripts": {
       "prebuild": "node scripts/generate-sitemap-data.js",
       "build": "astro build",
       "dev": "astro dev"
     }
   }
   ```

**Technical SEO:**

| Item | Requirement | Status |
|------|-------------|--------|
| Sitemap | Generated dynamically via `sitemap.xml.ts` + prebuild script | [FIXED SPEC] |
| robots.txt | Custom rules per client — disallow `/admin` | Configure |
| Mobile responsiveness | Tested on all breakpoints | Required |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1, INP < 200ms | Target |
| SSL/HTTPS | Required | Auto (Netlify) |
| 404 page | Branded 404 page | Required |
| Redirects | `/en/*` → `/*?lang=en` (301) via netlify.toml | [FIXED SPEC] |
| Geist font | Async preloaded (non-render-blocking) | [FIXED SPEC] |

**Geist font async preload pattern:**

```html
<!-- In BaseLayout.astro head — non-render-blocking font load -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  rel="preload"
  as="style"
  href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap"
  onload="this.onload=null;this.rel='stylesheet'"
>
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap">
</noscript>
```

### 4.8 Admin Dashboard for Lead Management

**Purpose:** View, filter, export captured leads
**Location:** `/admin` (Bearer token protected — inline auth check, no separate auth function)

**Authentication:** Inline Bearer token check in `admin-leads.ts`:
```typescript
const auth = req.headers.get('authorization');
if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
  return new Response('Unauthorized', { status: 401 });
}
```

**Features:**

1. **Lead List View**
   - Table: Name | Email | Company | Date | Status | Form Type | Actions
   - Sort by: Date (newest first)
   - Filter by: Status, date range, form type (contact/audit/survey)
   - Search by: Name, email, company
   - Bulk actions: Mark as contacted, export, delete

2. **Lead Detail View**
   - Full submission data including UTM attribution
   - Timestamp
   - Status management
   - Notes field

3. **Export Functionality**
   - CSV export (for CRM import)
   - Includes UTM/attribution data

4. **Analytics Summary**
   - Total leads by type
   - Leads by source (from UTM data in `hd_traffic_source` cookie)
   - Embedded GA4 widget (if permissions allow)

**Admin functions:**
- `admin-leads.ts` — multi-method handler (GET for listing, PUT for status update)
- `admin-leads-delete.ts` — DELETE handler for removing leads

```typescript
// admin-leads.ts — multi-method pattern
export default async (req: Request) => {
  // Auth check (inline — no separate auth function)
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (req.method === 'GET') {
    const storeType = new URL(req.url).searchParams.get('store') || 'contact-leads';
    const store = getStore(storeType);
    const index = await store.getJSON('_leads_index') as string[] || [];
    const leads = await Promise.all(index.map(id => store.getJSON(id)));
    return Response.json(leads.filter(Boolean));
  }

  if (req.method === 'PUT') {
    const { storeType, leadId, updates } = await req.json();
    const store = getStore(storeType);
    const existing = await store.getJSON(leadId);
    await store.setJSON(leadId, { ...existing, ...updates });
    return Response.json({ success: true });
  }

  return new Response('Method Not Allowed', { status: 405 });
};
```

### 4.9 Conversion Rate Optimization (CRO)

**CRO elements included in template:**

1. **Multiple CTAs** placed strategically — hero, mid-page, after case studies, after FAQ, footer

2. **Animated CTAs** — Shiny CTA buttons with conic gradient border and shimmer; color contrast optimized

3. **Social proof** — Client logos, testimonials with photos and names, case studies with metrics, review ratings

4. **Trust signals** — Clear value proposition above fold, service guarantees, team credibility, certifications

5. **Form optimization** — Minimal required fields (3–5 max), clear labels, privacy statement near checkbox, confirmation message

6. **Urgency/scarcity** — "Limited availability" badges (use only if true), newsletter CTA with subscriber count

7. **Content strategy** — Benefit-driven copy, specific metrics in case studies, FAQ objection handling

**Testing & Iteration:**
- A/B test CTA button text
- Test form field requirements
- Monitor GA4 scroll depth and time on page
- Track Clarity session recordings for drop-off points

### 4.10 CRO Copy Patterns

**Pain → Agitate → Solution (PAS) flow across page sections:**

1. **Problem Section**: Name the pain, quantify impact
   - Example Czech: "Vláčejí se Vám webové stránky? 47% návštěvníků odchází, pokud se stránkaloaduje déle než 3 sekundy."
   - Example English: "Is your website slow? 47% of visitors leave if the page takes longer than 3 seconds to load."

2. **Agitate Section**: Show consequences of inaction, hidden costs
   - Example Czech: "Každou sekundu zpoždění ztrácíte 7% potenciálních konverzí. To znamená desítky tisíc korun ztracených příjmů měsíčně."
   - Example English: "Every second of delay costs you 7% of potential conversions. That's tens of thousands in lost revenue monthly."

3. **Solution Section**: Present offer with proof and easy next step
   - Example Czech: "Naše optimalizační služba zrychlila webové stránky našich klientů o průměrně 68%, čímž zvýšila konverze o 34%."
   - Example English: "Our optimization service accelerated our clients' sites by an average of 68%, increasing conversions by 34%."

**Benefit-driven headlines (not feature-driven):**

| Feature Focus | Benefit Focus |
|---------------|---------------|
| ❌ "Naše platforma má AI automatizaci" | ✅ "Ušetřete 20 hodin týdně díky AI automatizaci" |
| ❌ "Blockchain-based security" | ✅ "Sleep soundly knowing your data is 256-bit encrypted" |
| ❌ "Cloud-native infrastructure" | ✅ "Scale to 10x traffic without downtime" |

**Specific metrics in social proof:**

| Vague | Specific |
|-------|----------|
| ❌ "Stovky spokojených klientů" | ✅ "847 firem ušetřilo průměrně 34 % nákladů" |
| ❌ "Clients love us" | ✅ "4.9/5 stars from 2,341 verified reviews" |
| ❌ "Trusted by enterprises" | ✅ "Used by 23 of the Fortune 500 since 2015" |

**CTA copy: action-outcome, not generic:**

| Generic | Outcome-Focused |
|---------|-----------------|
| ❌ "Odeslat" (Submit) | ✅ "Získat bezplatný audit" (Get Free Audit) |
| ❌ "Klikněte zde" (Click here) | ✅ "Zarezervovat konzultaci" (Book Consultation) |
| ❌ "Learn more" | ✅ "See how we cut costs by 40%" |
| ❌ "Sign up" | ✅ "Start your 14-day free trial" |

**CTA copy checklist:**
- [ ] CTA copy focuses on customer outcome, not company action
- [ ] CTA includes specific benefit or result
- [ ] CTA copy is action-oriented verb + noun (e.g., "Get", "Download", "Schedule")
- [ ] CTAs avoid generic terms like "Submit", "Click here", "Next"
- [ ] Button text can be understood without surrounding context

### 4.11 Czech Language (Čeština) Copywriting Standards

**Formality: Vykání (formal "Vy") as DEFAULT**

All website copy MUST use formal "vykání" (Vy/Vás/Vám/Váš) as the default.
- NEVER use informal "tykání" (ty/tě/ti/tvůj) in main website copy
- Exception: Blog posts or social media quotes MAY use conversational tykání if brand strategy allows, with clear client approval

**Examples:**
- ✅ "Jak Vám můžeme pomoci?" (correct — formal Vy)
- ✅ "Získejte Váš bezplatný audit" (correct — formal possessive)
- ✅ "Jsme tu pro Vás" (correct — formal you)
- ❌ "Jak ti můžeme pomoct?" (wrong — informal ty)
- ❌ "Získej svůj bezplatný audit" (wrong — informal tvůj)

**Conversational Native Czech Tone**

Copy must read as if written by a native Czech speaker in natural conversation:
- NEVER use literal translations from English
- Czech has different sentence structure, idioms, and phrasing patterns
- Use natural Czech phrasing, not "translation Czech" (překladatelská čeština)
- Avoid overly formal/corporate Czech — aim for professional but approachable
- Real Czech speakers will immediately detect machine translation or poor localization

**Examples of natural vs. translated Czech:**

Good (Natural Czech):
- "Přestaňte ztrácet čas manuální prací" (Stop wasting time on manual work)
- "Pomůžeme Vám automatizovat to, co Vás brzdí" (We'll help you automate what's slowing you down)
- "Dejte nám věřit – vaše data jsou u nás v bezpečí" (Trust us – your data is safe with us)
- "Chceme, aby Vaše podnikání rostlo" (We want your business to grow)

Bad (Translation Czech/Robotic):
- "Zastavte ztrátu času na manuální práci" (awkward construction)
- "Naše řešení umožňuje automatizaci procesů" (corporate/passive, not conversational)
- "Váša data jsou chráněna naším systémem zabezpečení" (stilted, unnatural word order)
- "Náš cíl je rozšíření Vašeho podnikání" (stiff, formal register)

**Tech Terminology Guidelines**

- **Established English tech terms keep English form:**
  - AI, chatbot, CRM, ROI, machine learning, API, UX/UI, MVP
  - Example: "Naše AI chatbot integruje se s Vaším CRM"

- **Business terms: use Czech where natural:**
  - "obchodní příležitosti" (not "business opportunities")
  - "zlepšení efektivity" (not "efficiency optimization")
  - "automatizace procesů" (not "process automation")

- **When in doubt:** Use the term Czech businesspeople would actually say in conversation
  - Research: Check what Czech companies use in their own marketing
  - Ask client: "How does your team talk about this in Czech?"

**Czech-Specific Formatting Rules**

- **Character limits:** Czech is ~20% longer than English due to longer average word length
  - Headline limit: 80 characters (vs 60 in English)
  - Subheadline: 180–200 characters (vs 150 in English)

- **Em-dash formatting:** Use spaces around em-dash (Czech standard)
  - ✅ "Řešení — jednoduché a efektivní" (correct with spaces)
  - ❌ "Řešení—jednoduché a efektivní" (no spaces, incorrect)

- **Capitalization:** Only capitalize first word in headings (Czech convention, NOT Title Case)
  - ✅ "Jak zlepšit efektivitu Vašeho týmu" (only first word capitalized)
  - ❌ "Jak Zlepšit Efektivitu Vašeho Týmu" (wrong — Title Case)
  - ✅ "Bezplatná konzultace dostupná tento měsíc" (correct)
  - ❌ "Bezplatná Konzultace Dostupná Tento Měsíc" (wrong)

**Czech-Specific Idioms & Phrases to Use**

- Instead of generic "Learn more": "Zjistěte více", "Dozvíte se více", "Chcete vědět víc?"
- Instead of "Discover": "Objevte", "Najděte", "Podívejte se"
- Instead of "Transform": "Přeměňte", "Změňte", "Transformujte" (less used, but acceptable)
- "Let us help": "Dejte nám pomoct", "Pomůžeme Vám", "Spoléhejte na nás"
- "Trusted by": "Věří nám", "Důvěřují nám", "Spoléhají na nás"

**Common Mistakes to Avoid**

| Mistake | Correct |
|---------|---------|
| ❌ "V současné době" (too formal) | ✅ "Teď", "Nyní" |
| ❌ "Dlouhodobé partnerství" (stiff) | ✅ "Dlouhodobá spolupráce" |
| ❌ "Webová aplikace" (translation) | ✅ "Webová aplikace" (acceptable) but prefer "Web app" in tech context |
| ❌ "Uživatelský interface" (forced translation) | ✅ "Uživatelské rozhraní" or just "UI" |
| ❌ "Seznamte se s našimi službami" (overly formal) | ✅ "Podívejte se na naše služby", "Descobrire naše nabídky" |

**Native Speaker Review Checklist** (add to QA section)

- [ ] All copy uses vykání consistently (no mixed tykání)
- [ ] Czech reads naturally, NOT like a translation from English
- [ ] No "překladatelská čeština" (translator Czech) detected
- [ ] Tech terms are appropriately handled (kept English where natural, localized where appropriate)
- [ ] Sentence structure is natural Czech (verb position, word order, particles)
- [ ] Tone is professional but conversational, not robotic or overly corporate
- [ ] Character counts checked and adjusted for Czech word length
- [ ] Em-dashes properly formatted with spaces
- [ ] Headings use lowercase after first word only
- [ ] Czech idioms and phrases used where appropriate
- [ ] Reviewed by native Czech speaker (not translator or non-native)
- [ ] Client approves tone and terminology

---

### 4.12 Hero Section: Alex Hormozi $100M Offers Framework

**Framework Overview:** The hero section MUST follow the Alex Hormozi Value Equation:

**Value Equation: Value = (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)**

#### Components Required:

**1. Dream Outcome** (clearly stated in headline)
- What transformation will the customer achieve?
- Must answer: "What will be different in my life/business after I use this?"
- Example (Czech): "Snižte náklady na podporu o 60% bez ztráty kvality"
- Example (English): "Cut support costs by 60% without sacrificing quality"

**2. Perceived Likelihood** (social proof next to/below hero)
- What proof supports that this result is achievable?
- Use client logos, case study metrics, ratings, testimonials
- Position directly below or adjacent to headline
- Include specific numbers: "847 firms have saved avg. 34%"

**3. Time Delay** (minimize time to value)
- How fast will customers see results?
- Specify timeline: "Results within 2 weeks", "Setup in under 5 minutes"
- Include in subheadline or value proposition
- Example: "Erste Ergebnisse innerhalb von 48 Stunden" or "See results in 48 hours"

**4. Effort & Sacrifice** (minimize barriers)
- How easy is the process for them?
- Highlight what you handle: "We manage everything", "No technical knowledge required"
- Remove friction language: avoid "complex", "time-consuming", "difficult"
- Example: "Žádné technické znalosti – my se postaráme o vše" / "No technical skills needed – we handle everything"

**5. Irresistible Offer Framing**
- Value stack: List everything they get (with estimated individual value)
- Risk reversal: Guarantee, free trial, money-back policy
- Bonuses: Extras included that amplify the offer
- Example structure:
  ```
  Your Investment: $99/month

  You Get:
  - AI Chatbot ($300/mo value)
  - 24/7 Support ($200/mo value)
  - Analytics Dashboard ($150/mo value)
  - Custom Integrations ($100/mo value)

  Total Value: $750/mo
  Your Price: $99/mo (87% savings)

  Risk Reversal:
  - 30-day money-back guarantee
  - No credit card required for trial
  - Cancel anytime, no penalties
  ```

**6. The Offer Must Be "So Good People Feel Stupid Saying No"**
- Value delivered >> price paid
- Remove objections proactively
- Make the case so compelling it feels like a no-brainer

#### Hero Section Layout [FIXED SPEC]

**Desktop (≥768px):**
```
┌──────────────────────────────────────────────────┐
│                                                  │
│  LEFT SIDE (60%)         │  RIGHT SIDE (40%)    │
│  ─────────────────────   │  ──────────────────  │
│  • Headline              │  • VSL Video         │
│  • Subheadline           │    (thumbnail +      │
│  • Dream Outcome         │     play button)     │
│  • Lead Form or CTA      │                      │
│  • Social Proof Badges   │                      │
│    (client logos, etc.)  │                      │
│                          │                      │
└──────────────────────────────────────────────────┘
```

**Mobile (<768px):**
```
┌─────────────────────┐
│  Headline           │
│  Subheadline        │
├─────────────────────┤
│  VSL Video (16:9)   │
│  (full width)       │
├─────────────────────┤
│  Lead Form/CTA      │
├─────────────────────┤
│  Social Proof       │
│  (logos stack)      │
└─────────────────────┘
```

#### Hero Copywriting Template

Fill in the Hormozi framework:

```
DREAM OUTCOME:
[CLIENT_TO_FILL — What specific result will the customer achieve?]

PERCEIVED LIKELIHOOD:
[CLIENT_TO_FILL — What proof/social proof supports this?]
Examples:
- X number of customers
- Y% success rate
- Z metric improvement (with numbers)
- Client logos + testimonials

TIME TO VALUE:
[CLIENT_TO_FILL — How fast will they see results?]
Examples:
- "Within 2 weeks"
- "In under 5 minutes"
- "By tomorrow morning"
- "Same-day results"

EFFORT REQUIRED:
[CLIENT_TO_FILL — How easy is the process for them?]
Examples:
- "No technical knowledge needed"
- "We handle the setup"
- "Point-and-click integration"
- "3-minute onboarding"

RISK REVERSAL:
[CLIENT_TO_FILL — Guarantee, free trial, money-back?]
Examples:
- "30-day money-back guarantee"
- "Free 14-day trial, no credit card"
- "Satisfaction guaranteed or your money back"

VALUE STACK:
[CLIENT_TO_FILL — List everything they get, with estimated value of each]
Example format:
- Feature 1 ($XXX value)
- Feature 2 ($XXX value)
- Bonus 1 ($XXX value)
- Training ($XXX value)
Total Value: $XXX
Your Investment: $YY/mo (ZZ% savings)

IRRESISTIBLE OFFER STATEMENT:
[CLIENT_TO_FILL — The one-liner that makes it feel like a no-brainer]
Example: "Get AI support that pays for itself in month one – or we'll refund every penny."
```

#### Hero Copy Checklist

- [ ] Dream outcome is clear, specific, and customer-focused (not feature-focused)
- [ ] Perceived likelihood is supported by visible social proof (logos, ratings, metrics)
- [ ] Time to value is explicitly mentioned ("within X", "by Y date")
- [ ] Effort barrier is minimized or removed ("no technical knowledge", "we handle it")
- [ ] Irresistible offer includes value stack, risk reversal, and bonuses
- [ ] No objections remain unanswered
- [ ] Offer feels "too good to refuse"
- [ ] Copy is benefit-driven, not feature-driven
- [ ] VSL video is positioned prominently (right side desktop, above form mobile)
- [ ] Form has 3–5 fields max (minimal friction)
- [ ] CTA button text is outcome-focused ("Get Consultation", not "Submit")
- [ ] Mobile layout is optimized (video full-width, readable text, easy CTA tap)

---

## SECTION 5: ANALYTICS & TRACKING

### 5.1 Google Analytics 4 Implementation

**Key events to track:**

| Event | Trigger | Use Case |
|-------|---------|----------|
| `form_submission` | Contact/audit/survey form submitted | Lead generation tracking |
| `scroll_depth` | 25%, 50%, 75%, 100% scroll | Engagement measurement |
| `cta_click` | Any CTA button clicked | Conversion path analysis |
| `external_link` | External link clicked | Outbound tracking |
| `video_play` | Hero video played | Video engagement |
| `language_switch` | Language changed via switcher | Language preference |
| `audit_submitted` | Audit form submitted | Audit funnel entry |
| `audit_completed` | Audit report received | Audit funnel completion |

**File:** `src/scripts/analytics.ts`

```typescript
export function initGA4() {
  // Track form submission
  document.addEventListener('form:submitted', (e: CustomEvent) => {
    window.gtag?.('event', 'form_submission', {
      event_category: 'engagement',
      event_label: e.detail?.formType || 'contact_form',
    });
  });

  // Track scroll depth
  let maxScroll = 0;
  const depths = [25, 50, 75, 90];
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (pct > maxScroll) {
      maxScroll = pct;
      depths.forEach(d => {
        if (pct >= d && maxScroll < d + 1) {
          window.gtag?.('event', 'scroll_depth', { depth: `${d}%` });
        }
      });
    }
  });

  // Track CTA clicks
  document.querySelectorAll('[data-track-cta]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.gtag?.('event', 'cta_click', {
        event_label: btn.getAttribute('data-cta-name'),
      });
    });
  });
}
```

### 5.2 Microsoft Clarity Integration

**Purpose:** Session replay for understanding user behavior

**Key metrics from Clarity:**
- Heatmaps (click, scroll, move)
- Session recordings (understand drop-off points)
- User frustration signals (rage clicks, dead clicks)
- Form abandonment insights

**File:** `src/scripts/analytics.ts` (Clarity initialized here alongside GA4)

### 5.3 UTM Parameter Strategy

**Standard UTM parameters:**

```
https://[DOMAIN]/?utm_source=linkedin&utm_medium=social&utm_campaign=Q1_2026

utm_source   = traffic origin (facebook, google, linkedin, email, etc.)
utm_medium   = link type (organic, paid, social, email, referral)
utm_campaign = campaign name (Q1_2026_Launch, etc.)
utm_content  = specific ad/link (for A/B testing)
utm_term     = keyword (paid search)
gclid        = Google Click ID (auto-appended by Google Ads)
fbclid       = Facebook Click ID (auto-appended by Meta Ads)
msclkid      = Microsoft Click ID (auto-appended by Bing Ads)
```

All UTM data is captured by `utm-tracker.ts`, stored in the `hd_traffic_source` cookie, and attached to every form submission for attribution reporting in the admin dashboard.

**Example UTM links:**

| Source | Medium | Campaign | Example URL |
|--------|--------|----------|-------------|
| LinkedIn | Social | LinkedIn_Lead_Gen | `?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin_lead_gen` |
| Email | Email | Q1_Newsletter | `?utm_source=email&utm_medium=email&utm_campaign=q1_newsletter` |
| Facebook | Paid | FB_Ads_Q1 | `?utm_source=facebook&utm_medium=paid&utm_campaign=fb_ads_q1` |
| Google | Paid | Google_Ads | `?utm_source=google&utm_medium=paid&utm_campaign=google_ads` (+ auto gclid) |

---

## SECTION 6: CONTENT TEMPLATE

### 6.1 Homepage Copy Structure

Use this template to collect all copy from the client. Provide all content in Czech first, then English.

```
HOME PAGE COPY TEMPLATE
=======================

HERO SECTION
------------
Headline CS (max 80 characters):
[CLIENT_TO_FILL]

Headline EN (max 80 characters):
[CLIENT_TO_FILL]

Subheadline CS (max 150 characters):
[CLIENT_TO_FILL]

Subheadline EN (max 150 characters):
[CLIENT_TO_FILL]

Hero CTA Button Text CS:
[CLIENT_TO_FILL — e.g., "Získat konzultaci"]

Hero CTA Button Text EN:
[CLIENT_TO_FILL — e.g., "Get Consultation"]

Hero CTA Button Link:
[CLIENT_TO_FILL — typically #contact or /consult]


ABOUT/PROBLEM SECTION
----------------------
Section Title CS/EN:
[CLIENT_TO_FILL]

Intro paragraph CS (max 150 words):
[CLIENT_TO_FILL]

Intro paragraph EN (max 150 words):
[CLIENT_TO_FILL]

Problem statement 1 CS/EN: [CLIENT_TO_FILL]
Problem statement 2 CS/EN: [CLIENT_TO_FILL]
Problem statement 3 CS/EN: [CLIENT_TO_FILL]


SERVICES SECTION
----------------
Section Title CS/EN:
[CLIENT_TO_FILL]

Service 1:
  Name CS/EN: [CLIENT_TO_FILL]
  Description CS (75 words max): [CLIENT_TO_FILL]
  Description EN (75 words max): [CLIENT_TO_FILL]
  Page URL: /services/[slug]
  Icon: [CLIENT_TO_PROVIDE or Iconify icon name]

Service 2:
  [same structure]

Service 3:
  [same structure]


CASE STUDIES SECTION
--------------------
Section Title CS/EN:
[CLIENT_TO_FILL — e.g., "Případové studie" / "Case Studies"]

Case Study 1:
  Client Name: [CLIENT_TO_FILL]
  Client Logo: [CLIENT_TO_PROVIDE]
  Industry: [CLIENT_TO_FILL]
  Challenge CS/EN (100 words max): [CLIENT_TO_FILL]
  Solution CS/EN (100 words max): [CLIENT_TO_FILL]
  Results (2-4 quantified metrics):
    - [CLIENT_TO_FILL — e.g., "50% reduction in support tickets"]
  Quote CS: "[CLIENT_TO_FILL]"
  Quote EN: "[CLIENT_TO_FILL]"
  Quote Author: [NAME, TITLE]
  Image: [CLIENT_TO_PROVIDE]

Case Study 2:
  [same structure]


TESTIMONIALS SECTION
--------------------
Section Title CS/EN:
[CLIENT_TO_FILL]

Testimonial 1:
  Quote CS: "[CLIENT_TO_FILL]"
  Quote EN: "[CLIENT_TO_FILL]"
  Author Name: [CLIENT_TO_FILL]
  Author Title: [CLIENT_TO_FILL]
  Author Company: [CLIENT_TO_FILL]
  Author Photo: [CLIENT_TO_PROVIDE — 200x200px headshot]
  Rating (1-5): [CLIENT_TO_FILL]

[Repeat for 3-5 testimonials minimum]


FAQ SECTION
-----------
Section Title CS/EN:
[CLIENT_TO_FILL — typically "Časté dotazy" / "Frequently Asked Questions"]

FAQ 1:
  Question CS: [CLIENT_TO_FILL]
  Question EN: [CLIENT_TO_FILL]
  Answer CS: [CLIENT_TO_FILL — 50-150 words]
  Answer EN: [CLIENT_TO_FILL — 50-150 words]

[Repeat for 15-20 total questions]


CONTACT SECTION
---------------
Section Title CS/EN:
[CLIENT_TO_FILL]

Intro Text CS/EN (100 words max):
[CLIENT_TO_FILL]

Form Fields (select which to include):
  - [ ] Name
  - [ ] Email (required)
  - [ ] Company
  - [ ] Phone
  - [ ] Message
  - [ ] Budget (if applicable)
  - [ ] Checkbox: GDPR consent (required by law)

Privacy Statement CS (appears next to checkbox):
[CLIENT_TO_FILL — e.g., "Souhlasím se zpracováním osobních údajů."]

Privacy Statement EN:
[CLIENT_TO_FILL — e.g., "I agree to the processing of personal data."]

Form Submit Button Text CS/EN:
[CLIENT_TO_FILL — e.g., "Odeslat" / "Submit"]

Success Message CS/EN:
[CLIENT_TO_FILL — e.g., "Děkujeme! Ozveme se do 24 hodin." / "Thank you! We'll be in touch within 24 hours."]


FOOTER
------
Company Name:
[CLIENT_TO_FILL]

Footer Links:
  - Home / Domů
  - Services / Služby
  - Blog (optional)
  - Contact / Kontakt
  - Privacy Policy / Zásady ochrany soukromí (required)
  - Terms of Service / Podmínky použití (required)

Social Media Links:
  - [ ] LinkedIn: [URL]
  - [ ] Twitter/X: [URL]
  - [ ] Facebook: [URL]
  - [ ] Instagram: [URL]

Contact Info:
  Email: [CLIENT_TO_FILL]
  Phone (optional): [CLIENT_TO_FILL]
  Office Address (optional): [CLIENT_TO_FILL]

Cal.com profile URL (for calendar booking in footer):
[CLIENT_TO_FILL — e.g., https://app.cal.com/your-profile]

Google Maps embed URL (for office location in footer):
[CLIENT_TO_FILL — optional]

Copyright Text CS/EN:
[CLIENT_TO_FILL — e.g., "© 2026 Company Name. Všechna práva vyhrazena." / "All rights reserved."]
```

### 6.2 Service Pages

Each service has its own static `.astro` file (e.g., `src/pages/services/chatbot.astro`). Create one content block per service:

```
SERVICE PAGE: [SERVICE_NAME]
============================

URL: /services/[slug]
File: src/pages/services/[slug].astro

Meta Title CS (50-60 chars): [CLIENT_TO_FILL]
Meta Title EN (50-60 chars): [CLIENT_TO_FILL]
Meta Description CS (150-160 chars): [CLIENT_TO_FILL]
Meta Description EN (150-160 chars): [CLIENT_TO_FILL]

Hero Headline CS/EN: [CLIENT_TO_FILL]
Hero Subheadline CS/EN: [CLIENT_TO_FILL]

What is [Service]? CS (200-300 words): [CLIENT_TO_FILL]
What is [Service]? EN (200-300 words): [CLIENT_TO_FILL]

How It Works:
  Step 1 CS/EN:
    Title: [CLIENT_TO_FILL]
    Description: [CLIENT_TO_FILL — 50 words]
    Icon: [Iconify icon name]

  Step 2 CS/EN: [same structure]
  Step 3 CS/EN: [same structure]

Key Features (3-6):
  Feature 1 CS/EN: [CLIENT_TO_FILL]
  [etc.]

Service-specific FAQ (10-15 questions): [CLIENT_TO_FILL]

CTA Headline CS/EN: [CLIENT_TO_FILL]
CTA Button Link: /contact or /consult
```

### 6.3 Blog Post Template

```
BLOG POST: [POST_TITLE]
=======================

slug: [url-friendly-slug]
category: [ai | automation | case-study | news | CLIENT_TO_FILL]
publishedDate: [YYYY-MM-DD]
author: [AUTHOR_NAME]
image: /assets/images/blog/[slug].webp

title_cs: [CLIENT_TO_FILL]
title_en: [CLIENT_TO_FILL]

excerpt_cs (150 chars max): [CLIENT_TO_FILL]
excerpt_en (150 chars max): [CLIENT_TO_FILL]

content_cs: [Full article in Czech — Markdown or HTML]
content_en: [Full article in English — Markdown or HTML]
```

---

## SECTION 7: IMPLEMENTATION CHECKLIST

### Phase 1: Project Setup (Week 1)

#### 1.1 Environment & Repository
- [ ] Create Git repository (GitHub/GitLab)
- [ ] Initialize Astro project inside `astro-src/` subdirectory (`npm create astro`)
- [ ] Install dependencies: `@astrojs/netlify`, `@tailwindcss/vite`, TypeScript, Iconify, Resend
- [ ] Configure `astro.config.mjs` with Netlify adapter and Tailwind CSS v4 via `@tailwindcss/vite`
- [ ] Configure Tailwind CSS v4 `@theme` in `src/styles/global.css` (no `tailwind.config.mjs`)
- [ ] Set up `.env` file with required variables
- [ ] Create `.gitignore` (include `node_modules`, `.env`, `.netlify`, `dist`)
- [ ] Configure `netlify.toml` with `base = "astro-src"`, build command, functions path, security headers

#### 1.2 Netlify Configuration
- [ ] Connect Git repository to Netlify
- [ ] Confirm build settings from `netlify.toml` are picked up
- [ ] Configure environment variables in Netlify dashboard
- [ ] Set up Netlify Blobs stores: `audit-leads`, `contact-leads`, `survey-leads`
- [ ] Set up automatic deployments on push to main

#### 1.3 Content Collection
- [ ] Collect all copy from client (use Section 6 template — bilingual CS/EN)
- [ ] Collect all images/videos/assets
- [ ] Obtain brand guidelines document
- [ ] Confirm domain name
- [ ] Get professional translation review for all English content

### Phase 2: Design & Structure (Weeks 1–2)

#### 2.1 Style System
- [ ] Create `src/styles/global.css`
  - [ ] Add `@import "tailwindcss"` at top
  - [ ] Define brand colors in `@theme` block (replace placeholder values)
  - [ ] Define font family tokens in `@theme`
  - [ ] Add base styles (reset, body, headings, links)
  - [ ] Add animation keyframes
  - [ ] Add component styles (cards, forms, etc.)
  - [ ] Add button systems: `.shiny-cta`, `.vf-button`, `.nav-cta-button`

- [ ] Create `src/styles/cookie-consent.css`
  - [ ] Isolated cookie consent banner styles

#### 2.2 Tailwind CSS v4 Configuration
- [ ] Verify `@tailwindcss/vite` plugin is active in `astro.config.mjs`
- [ ] Define all design tokens in `@theme` inside `global.css`
- [ ] Confirm no `tailwind.config.mjs` exists (Tailwind v4 does not use it)
- [ ] Test that `@theme` variables are available as CSS custom properties

#### 2.3 Data Files
- [ ] Create `src/data/blog-posts.json` with bilingual field structure
- [ ] Create `src/data/clients.json` with client logo data
- [ ] Create `src/data/faq.json` with FAQ content
- [ ] Create `scripts/generate-sitemap-data.js` prebuild script
- [ ] Confirm `package.json` has `"prebuild": "node scripts/generate-sitemap-data.js"`
- [ ] Services data: embed in static page components or create per-service JSON if preferred

### Phase 3: Component Development (Weeks 2–3)

#### 3.1 Layout Components
- [ ] Create `BaseLayout.astro`
  - [ ] HTML structure with `lang` attribute (cs or en)
  - [ ] Head: meta tags, Geist font async preload, `dns-prefetch` for cal.com
  - [ ] Global scripts (analytics init, UTM tracker, cookie consent)

- [ ] Create `PageLayout.astro` (wraps BaseLayout, includes Navigation and Footer)
- [ ] Create `LegalLayout.astro` (for privacy policy, terms — simpler header/footer)

#### 3.2 Navigation
- [ ] Create `Navigation.astro`
  - [ ] Desktop menu with `.nav-cta-button`
  - [ ] Language switcher (toggles `?lang=en` query param)
  - [ ] Sticky positioning, backdrop blur

- [ ] Create `MobileMenu.astro`
- [ ] Create `LanguageSwitcher.astro`

#### 3.3 Footer
- [ ] Create `FooterFull.astro`
  - [ ] Quick links, legal, social, contact info, copyright
  - [ ] Cal.com calendar embed (lazy-loaded via IntersectionObserver)
  - [ ] Google Maps embed (lazy-loaded via IntersectionObserver)
  - [ ] `dns-prefetch` for `app.cal.com`

#### 3.4 Background Components
- [ ] Create `DigitalRain.astro` (optional visual effect)
- [ ] Create `GridBackground.astro` (optional background pattern)

#### 3.5 UI Components
- [ ] Create `Button.astro` (variants: shiny-cta, vf-button, nav-cta, secondary)
- [ ] Create `Card.astro`
- [ ] Create `Form.astro` (text, email, textarea; validation feedback; honeypot)
- [ ] Create `Badge.astro`
- [ ] Create `Modal.astro`

#### 3.6 Section Components
- [ ] Create `Hero.astro` (headline, subheadline, `.shiny-cta`, background, optional form)
- [ ] Create `Services.astro` (grid of service cards linking to static service pages)
- [ ] Create `CaseStudies.astro`
- [ ] Create `Testimonials.astro` (carousel or grid)
- [ ] Create `FAQ.astro` (accordion, keyboard accessible)
- [ ] Create `TrustedBy.astro` (client logo marquee)
- [ ] Create `TechStack.astro`
- [ ] Create `ContactCTA.astro`

#### 3.7 Blog Components
- [ ] Create `BlogCard.astro`
- [ ] Create `BlogCategoryFilter.astro`
- [ ] Define `BlogPost` and `BlogCategory` interfaces in `src/types/blog.ts`

### Phase 4: Scripting & Interactivity (Week 3)

#### 4.1 Translation System
- [ ] Create `src/scripts/translations/types.ts` — `Language` type, `TranslationKeys` interface
- [ ] Create each translation module (core.ts, landing.ts, etc.) with cs/en keys
- [ ] Create `src/scripts/translations/index.ts` — `mergeTranslations()`, `getLocalizedHref()`, barrel exports
- [ ] Implement language detection: URL param → cookie → default (cs)
- [ ] Set `preferredLanguage` cookie (1-year lifetime) on language switch

#### 4.2 Form Handling
- [ ] Create `src/scripts/form.ts`
  - [ ] Client-side validation (HTML5 + custom)
  - [ ] Honeypot field check before submission
  - [ ] Attach UTM data from `hd_traffic_source` cookie
  - [ ] Submit to `/api/contact` (or appropriate endpoint)
  - [ ] Handle success/error states
  - [ ] Fire GA4 event on success

#### 4.3 UTM Tracking
- [ ] Create `src/scripts/utm-tracker.ts`
  - [ ] Capture UTM params, gclid, fbclid, msclkid
  - [ ] Auto-detect referrer platform
  - [ ] Store in `hd_traffic_source` cookie (30-day lifetime)
  - [ ] First-touch attribution logic
  - [ ] Export `getUTMData()` for form scripts

#### 4.4 Cookie Consent
- [ ] Create `src/scripts/cookie-consent.ts` — `CookieConsentManager` class
- [ ] Verify it is extracted into its own chunk via `manualChunks` in `astro.config.mjs`
- [ ] Integrate consent gates: GA4 and Clarity only load after analytics consent
- [ ] Connect to `src/styles/cookie-consent.css`

#### 4.5 Animations & Scroll Effects
- [ ] Create `src/scripts/animations.ts`
  - [ ] IntersectionObserver for scroll-reveal (fade-in, slide-in)
  - [ ] Navbar scroll behavior (sticky, color transition)
  - [ ] Lazy-load triggers for Cal.com and Google Maps

#### 4.6 Utilities
- [ ] Create `src/scripts/utils.ts`
  - [ ] Mobile menu toggle
  - [ ] Accordion/FAQ toggle
  - [ ] Smooth scroll to anchor
  - [ ] Debounce/throttle helpers

#### 4.7 Analytics
- [ ] Create `src/scripts/analytics.ts`
  - [ ] GA4 initialization (conditional on consent)
  - [ ] Clarity initialization (conditional on consent)
  - [ ] Scroll depth tracking
  - [ ] CTA click tracking
  - [ ] Form submission event

### Phase 5: Pages & Content (Week 4)

#### 5.1 Homepage
- [ ] Create `src/pages/index.astro` — imports all sections, passes lang and t props

#### 5.2 Service Pages (Static Files)
- [ ] Create individual static `.astro` files per service under `src/pages/services/`
  - [ ] `chatbot.astro`
  - [ ] `voicebot.astro`
  - [ ] `ai-agent.astro`
  - [ ] `audit.astro`
  - [ ] [Additional services per client]
- [ ] Each page: service-specific hero, description, how-it-works, features, FAQ, CTA

#### 5.3 Blog Pages
- [ ] Create `src/pages/blog/index.astro` — listing with `BlogCategoryFilter`
- [ ] Create `src/pages/blog/[slug].astro` — dynamic route consuming `blog-posts.json`

#### 5.4 Legal Pages
- [ ] Create `src/pages/privacy-policy.astro` (GDPR compliant, bilingual)
- [ ] Create `src/pages/terms-of-service.astro` (bilingual)

#### 5.5 Other Pages
- [ ] Create `src/pages/contact.astro`
- [ ] Create `src/pages/consult.astro`
- [ ] Create `src/pages/admin/index.astro` — leads dashboard
- [ ] Create `src/pages/admin/login.astro`
- [ ] Create `src/pages/404.astro` — branded, links back to home

#### 5.6 Sitemap
- [ ] Create `scripts/generate-sitemap-data.js` — prebuild script
- [ ] Create `src/pages/sitemap.xml.ts` — dynamic Astro route
- [ ] Verify `package.json` prebuild hook runs before `astro build`
- [ ] Confirm sitemap includes hreflang entries for `?lang=en` variants

### Phase 6: API Functions (Week 4)

#### 6.1 Email Templates
- [ ] Create `netlify/functions/email-templates.ts`
  - [ ] `escapeHtml()` utility
  - [ ] Base bilingual layout function
  - [ ] Common reusable sections

- [ ] Create `netlify/functions/audit-templates.ts`
- [ ] Create `netlify/functions/survey-templates.ts`

#### 6.2 Contact Form API
- [ ] Create `netlify/functions/contact.ts`
  - [ ] Validate method (POST only)
  - [ ] Server-side field validation
  - [ ] Honeypot check
  - [ ] Generate `lead-{timestamp}-{random}` ID
  - [ ] Update `_leads_index` in `contact-leads` Blob store
  - [ ] Store lead JSON in `contact-leads`
  - [ ] Send bilingual notification email via Resend (using `email-templates.ts`)
  - [ ] Include UTM data in notification email
  - [ ] Return success response

#### 6.3 Audit Functions
- [ ] Create `netlify/functions/audit-validate.ts` (fast, ~200ms)
- [ ] Create `netlify/functions/audit-background.ts` (Background Function, 15-min timeout)
  - [ ] Implement state machine: pending → validating → researching → generating → storing → emailing → completed/failed
  - [ ] Store job state in `audit-leads` Blob store
  - [ ] Send report email via `audit-templates.ts` on completion
- [ ] Create `netlify/functions/audit-status.ts` (GET, returns state + progress 0–100%)
- [ ] Create `netlify/functions/audit-report.ts` (GET, returns completed report)
- [ ] Create `netlify/functions/audit-services/` directory for shared audit modules
- [ ] Create `netlify/functions/audit-shared/` directory for shared utilities

#### 6.4 Survey Function
- [ ] Create `netlify/functions/survey.ts`
  - [ ] POST handler: validate, store in `survey-leads`, send emails
- [ ] Create `netlify/functions/survey-templates.ts`

#### 6.5 Admin Functions
- [ ] Create `netlify/functions/admin-leads.ts` (multi-method: GET + PUT)
  - [ ] Inline Bearer token auth (no separate auth function)
  - [ ] GET: read `_leads_index` + fetch all leads from specified store
  - [ ] PUT: update lead status/notes in specified store
- [ ] Create `netlify/functions/admin-leads-delete.ts` (DELETE)

### Phase 7: SEO & Performance (Week 5)

#### 7.1 SEO Implementation
- [ ] Verify `src/pages/sitemap.xml.ts` is rendering valid XML
- [ ] Create `public/robots.txt` — allow crawling, disallow `/admin`, reference sitemap
- [ ] Add structured data (JSON-LD) in `BaseLayout.astro` head
  - [ ] Organization schema
  - [ ] Service schemas (in service page components)
  - [ ] FAQ schema
  - [ ] Article schema (in blog post pages)
- [ ] Audit meta tags on every page (unique title, description, canonical, OG, hreflang)
- [ ] Optimize images: WebP/AVIF, width/height attributes, alt text, responsive srcset

#### 7.2 Performance Optimization
- [ ] Lighthouse audit — target Performance > 90, Accessibility = 100, Best Practices = 100, SEO = 100
- [ ] Verify Geist font uses async preload pattern (non-render-blocking)
- [ ] Verify Cal.com and Google Maps are lazy-loaded (IntersectionObserver)
- [ ] Verify cookie-consent.ts is code-split (not blocking main bundle)
- [ ] Verify `inlineStylesheets: 'always'` is set in `astro.config.mjs`
- [ ] Set cache headers in `netlify.toml` (long cache for assets, no-cache for HTML)

#### 7.3 Security
- [ ] Verify security headers are set in `netlify.toml` for `/*`:
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
  - [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - [ ] `Content-Security-Policy` (customized for your third-party scripts)
- [ ] Verify `escapeHtml()` is used in all email template functions
- [ ] Verify honeypot fields are on all public forms
- [ ] Verify rate limiting on API endpoints (recommend: 5 submissions per IP per hour for forms, 10 failed attempts per IP with 15-min lockout for admin)
- [ ] GDPR: cookie consent obtained BEFORE setting analytics cookies, privacy policy accessible, data handling transparent
- [ ] Admin auth: Bearer token is strong (32+ characters), session has idle timeout

### Phase 8: Testing & QA (Weeks 5–6)

#### 8.1 Functional Testing
- [ ] Contact form: validates, honeypot works, email received, lead stored in `contact-leads`
- [ ] Audit form: validation fast, 202 returned, background processes, status polling works, report emailed
- [ ] Survey form: validates, stored in `survey-leads`, confirmation sent
- [ ] Language switching: URL param sets language, cookie persists preference
- [ ] Navigation: all links work, mobile menu toggles, language switcher functions
- [ ] Blog: listing loads from `blog-posts.json`, category filter works, individual posts render
- [ ] Admin: login works, leads display from all three stores, export functions

#### 8.2 Responsiveness Testing
- [ ] Desktop (1920px, 1440px) — all layouts, images, text
- [ ] Tablet (768px) — grid adjusts, forms accessible
- [ ] Mobile (375px) — single column, 44x44px touch targets, hamburger menu
- [ ] Browsers: Chrome, Firefox, Safari, Edge (latest); Mobile Safari, Chrome Mobile

#### 8.3 SEO Testing
- [ ] Lighthouse SEO audit (target 100)
- [ ] Schema.org validation for all structured data types
- [ ] Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Mobile-Friendly Test (Google)
- [ ] Open Graph preview (LinkedIn, Facebook)
- [ ] hreflang validation (Google Search Console or Merkle hreflang checker)

#### 8.4 Security Testing
- [ ] HTTPS enforced
- [ ] Security headers present (verify with securityheaders.com)
- [ ] XSS prevention: all user input escaped in email templates
- [ ] Admin authentication working, Bearer token not guessable

### Phase 9: Translation & Localization (Week 6)

#### 9.1 Translation Modules
- [ ] Audit all hardcoded text for missing translation keys
- [ ] Ensure all keys are present in both `cs` and `en` objects across all modules
- [ ] Test language switching on every page type

#### 9.2 URL Strategy Verification
- [ ] Czech pages load at clean URLs (no suffix)
- [ ] English pages load at `?lang=en` query param
- [ ] `/en/*` redirects to `/*?lang=en` (301) — verify via curl
- [ ] `?lang=cs` redirects to clean URL (301) — verify via curl
- [ ] hreflang tags correct on all pages

#### 9.3 Native Speaker Review
- [ ] Czech copy reviewed by native Czech speaker
- [ ] English copy reviewed by native English speaker

### Phase 10: Analytics Setup (Week 6)

#### 10.1 Google Analytics 4
- [ ] Create GA4 property, install measurement ID in env vars
- [ ] Verify consent gate (only fires after cookie consent)
- [ ] Verify events: `form_submission`, `scroll_depth`, `cta_click`, `audit_submitted`, `audit_completed`
- [ ] Create Overview, Conversion, Traffic Sources, and User Behavior dashboards

#### 10.2 Microsoft Clarity
- [ ] Set up Clarity project, install script ID in env vars
- [ ] Verify consent gate
- [ ] Enable session recording, review heatmaps

#### 10.3 UTM Attribution
- [ ] Verify `utm-tracker.ts` captures all param types (UTM, gclid, fbclid, msclkid)
- [ ] Verify `hd_traffic_source` cookie is set on first visit
- [ ] Verify UTM data appears in admin dashboard lead records
- [ ] Document UTM naming convention for marketing team

### Phase 11: Admin Dashboard Setup (Week 6)

- [ ] Test login page (Bearer token auth)
- [ ] Test leads dashboard — contact, audit, and survey leads all accessible
- [ ] Test lead detail view (including UTM attribution data)
- [ ] Test lead status update (PUT via `admin-leads.ts`)
- [ ] Test lead deletion (`admin-leads-delete.ts`)
- [ ] Test CSV export
- [ ] Verify notification emails for all three form types

### Phase 12: Deployment & Launch (Week 7)

#### 12.1 Pre-Launch Checklist
- [ ] All pages render correctly
- [ ] All three form types submit successfully
- [ ] Audit background function completes and emails report
- [ ] Analytics firing after consent granted
- [ ] No console errors
- [ ] Lighthouse scores acceptable (Performance > 90)
- [ ] Mobile responsiveness confirmed
- [ ] All content proofread and approved in both languages
- [ ] Legal pages reviewed by legal counsel
- [ ] Admin Bearer token is strong and securely stored in Netlify env vars
- [ ] All email addresses configured and tested
- [ ] Domain DNS configured, SSL active
- [ ] Security headers verified via securityheaders.com

#### 12.2 Soft Launch (Internal Team)
- [ ] Deploy to Netlify
- [ ] Test all URLs
- [ ] Test all form submissions end-to-end
- [ ] Monitor Netlify function logs for errors
- [ ] Confirm admin dashboard access

#### 12.3 Production Launch
- [ ] Update domain DNS to Netlify
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify site live on custom domain
- [ ] Test all functionality on live domain
- [ ] Submit sitemap to Google Search Console
- [ ] Request index for key pages in Google Search Console
- [ ] Set up uptime monitoring

#### 12.4 Post-Launch (First 72 Hours)
- [ ] Monitor analytics and form submissions
- [ ] Watch Netlify function logs for errors
- [ ] Verify audit background function completes in production
- [ ] Respond to incoming leads promptly
- [ ] Document any issues for iteration

### Phase 13: Post-Launch Optimization (Ongoing)

#### 13.1 Analytics Review
- [ ] Weekly: form submissions, traffic, error rates
- [ ] Monthly: GA4 deep dive, Clarity session review, Core Web Vitals
- [ ] Quarterly: goal progress, CRO experiments, roadmap planning

#### 13.2 A/B Testing
- [ ] CTA button text and color variants
- [ ] Hero headline copy
- [ ] Form field requirements
- [ ] Page layout variations

#### 13.3 Content Updates
- [ ] Add new blog posts (both languages)
- [ ] Add new case studies and testimonials
- [ ] Refresh outdated service descriptions

#### 13.4 Performance Monitoring
- [ ] Monthly Lighthouse audits
- [ ] Core Web Vitals monitoring in Google Search Console
- [ ] Error rate monitoring via Netlify logs

---

## SECTION 8: SUCCESS METRICS & GOALS

### 8.1 Business Metrics (Primary)

| Metric | Baseline | Target (3 months) | Target (12 months) | Measurement |
|--------|----------|-------------------|--------------------|-------------|
| **Monthly website visitors** | [CLIENT_TO_FILL] | [CLIENT_TO_FILL] | [CLIENT_TO_FILL] | GA4 Users |
| **Form submissions (all types)** | 0 | [CLIENT_TO_FILL] | [CLIENT_TO_FILL] | GA4 Events |
| **Contact form conversion rate** | N/A | [CLIENT_TO_FILL] % | [CLIENT_TO_FILL] % | Forms / Users |
| **Audit form submissions** | 0 | [CLIENT_TO_FILL] | [CLIENT_TO_FILL] | Admin dashboard |
| **Cost per lead** | N/A | [CLIENT_TO_FILL] | [CLIENT_TO_FILL] | Ad Spend / Forms |
| **Sales qualified leads** | N/A | [CLIENT_TO_FILL] | [CLIENT_TO_FILL] | Manual review |
| **Customer acquisition cost** | N/A | [CLIENT_TO_FILL] | [CLIENT_TO_FILL] | Revenue / Costs |

### 8.2 User Experience Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Average session duration** | > 2 minutes | GA4 |
| **Bounce rate** | < 50% | GA4 |
| **Scroll depth (average)** | > 60% | GA4 custom event |
| **Pages per session** | > 2.5 | GA4 |
| **Mobile usability score** | 100 | Google PageSpeed Insights |
| **Form abandonment rate** | < 40% | GA4 (form_start vs. form_submission) |
| **CTA click-through rate** | > 5% | GA4 event tracking |
| **Audit completion rate** | > 80% | audit-status polling metrics |

### 8.3 Technical Performance Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Lighthouse Performance** | > 90 | Chrome DevTools / Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | PageSpeed Insights |
| **Interaction to Next Paint (INP)** | < 200ms | PageSpeed Insights / Core Web Vitals |
| **Cumulative Layout Shift (CLS)** | < 0.1 | PageSpeed Insights |
| **Page load time (p95)** | < 3s | WebPageTest |
| **Uptime** | > 99.9% | Netlify dashboard |
| **Audit background function success rate** | > 95% | Netlify function logs |

### 8.4 SEO Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Organic traffic** | > [CLIENT_TO_FILL] visitors/month | GA4 (Organic channel) |
| **Keyword rankings** | Top 20 for main keywords | SEMrush / Ahrefs |
| **Impressions (Google)** | > [CLIENT_TO_FILL] | Google Search Console |
| **Click-through rate (CTR)** | > 5% | Google Search Console |
| **Pages indexed** | All key pages + blog posts | Google Search Console |
| **Crawl errors** | 0 | Google Search Console |
| **hreflang errors** | 0 | Google Search Console |

### 8.5 Regular Review Cadence

- **Weekly:** Form submissions, traffic anomalies, function error rates
- **Monthly:** Analytics deep dive, Clarity session reviews, performance metrics, CRO experiments
- **Quarterly:** Goal progress, competitive analysis, roadmap planning, technology updates
- **Annually:** ROI analysis, major design refresh assessment, strategic goal review

---

## SECTION 9: ENVIRONMENT VARIABLES

Create `.env.example` at the repository root. Client fills in actual values in `.env` (never commit):

```bash
# DOMAIN CONFIGURATION
SITE_URL=https://client-domain.com
SITE_NAME=Client Company Name
SITE_DESCRIPTION=Brief description of site

# NETLIFY & HOSTING
NETLIFY_SITE_ID=your-site-id-from-netlify
NETLIFY_AUTH_TOKEN=your-netlify-auth-token

# EMAIL CONFIGURATION (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=leads@client-domain.com
SENDER_NAME=Client Company Name
NOTIFY_EMAIL=sales@client-domain.com
NOTIFY_EMAIL_CC=extra-recipient@client-domain.com

# ANALYTICS
GA4_ID=G-XXXXXXXXXX
CLARITY_ID=xxxxxxxxxxxxx
GTM_ID=GTM-XXXXXXX

# ADMIN AUTHENTICATION
# This is the Bearer token used in Authorization header for admin functions
# Must be strong (32+ characters), random, changed after first deployment
ADMIN_PASSWORD=strong-random-password-change-after-deployment

# THIRD-PARTY INTEGRATIONS
CAL_COM_URL=https://app.cal.com/your-profile
VOICEFLOW_PROJECT_ID=xxxxx

# DEVELOPMENT
DEBUG=false
NODE_ENV=production
```

---

## SECTION 10: DEPLOYMENT & HOSTING

### 10.1 Netlify Deployment

**Prerequisites:**
- Git repository (GitHub, GitLab, etc.)
- Netlify account

**Key configuration (`netlify.toml` at repository root):**
```toml
[build]
  base = "astro-src"        <- Astro project is in subdirectory
  command = "npm run build"  <- runs prebuild (sitemap data) then astro build
  publish = "dist"
  functions = "../netlify/functions"
```

**Setup steps:**

1. Connect repository to Netlify (New site from Git)
2. Netlify reads `netlify.toml` for all build settings automatically
3. Add all environment variables in Netlify dashboard (Site settings → Environment)
4. Configure custom domain (Site settings → Domain management → Add custom domain)
5. Netlify provisions SSL automatically via Let's Encrypt

**Continuous deployment:**
- Automatic deploys on push to main branch
- Preview deploys on pull requests
- Rollback capability via Netlify deploy history

### 10.2 DNS Configuration

```
Type  Name   Value                      Notes
A     @      [Netlify-IP]               Main domain
CNAME www    your-site.netlify.com      www subdomain
TXT   @      v=spf1 include:resend.com ~all  For Resend email sending
```

Or delegate DNS to Netlify nameservers for automatic management.

### 10.3 Alternative Hosting

If client prefers not Netlify, the following trade-offs apply:

| Host | Pros | Cons |
|------|------|------|
| Vercel | Fast, Astro-optimized | No native Blobs — need external KV store (Upstash, etc.) |
| AWS S3 + CloudFront | Cheap, scalable | Complex setup, need separate Lambda for functions |
| GitHub Pages | Free | Static only — no serverless functions |
| Traditional VPS | Full control | High maintenance, no CDN out of the box |

**Note:** Netlify Blobs (`audit-leads`, `contact-leads`, `survey-leads`) are Netlify-specific. Migration to another host requires replacing Blobs with a compatible KV store (Redis, DynamoDB, Upstash, etc.).

---

## SECTION 11: MAINTENANCE & SUPPORT

### 11.1 Ongoing Maintenance Tasks

**Weekly:**
- Review form submissions across all three stores (admin dashboard)
- Check Netlify function logs for errors
- Monitor audit background function completion rates

**Monthly:**
- Analytics deep dive (GA4 + Clarity)
- Update blog with new posts (both languages)
- Update case studies/testimonials if available
- Check for broken links (site crawl)
- Dependency updates (security patches)

**Quarterly:**
- Content refresh (outdated service information, pricing)
- Security audit (dependencies, vulnerabilities)
- Performance audit (Lighthouse, Core Web Vitals)
- SEO audit (Google Search Console issues)
- A/B testing results review

**Annually:**
- Competitive analysis
- Major design refresh assessment
- Strategic goal review
- Technology stack update assessment (Astro, Tailwind, etc.)

### 11.2 Common Updates

**Adding a blog post:**
1. Add entry to `astro-src/src/data/blog-posts.json` with both `_cs` and `_en` fields
2. Provide blog image at correct path
3. Commit and push — Netlify auto-deploys

**Adding a case study:**
1. Add content to the relevant component or JSON file
2. Provide image assets
3. Rebuild and deploy

**Updating copy:**
1. Locate the appropriate translation module in `astro-src/src/scripts/translations/`
2. Update the relevant key in both `cs` and `en` objects
3. Commit and push — Netlify auto-deploys

**Updating brand colors:**
1. Open `astro-src/src/styles/global.css`
2. Update color values in the `@theme` block
3. Test across all pages
4. Commit and push

**Adding a new service page:**
1. Create `astro-src/src/pages/services/[new-service].astro`
2. Add translation keys to `astro-src/src/scripts/translations/service-pages.ts`
3. Add the service to the Services section on the homepage
4. Update `scripts/generate-sitemap-data.js` to include the new page
5. Rebuild and deploy

### 11.3 Troubleshooting

| Issue | Solution |
|-------|----------|
| Contact form not submitting | Check `RESEND_API_KEY` in Netlify env vars; check Resend dashboard; review `contact.ts` function logs |
| Audit not completing | Check `audit-background.ts` logs (15-min timeout); verify Blob store access; check Resend for report email |
| Audit status stuck | Check `audit-status.ts` function; verify job ID is correct in `audit-leads` store |
| Language not switching | Check `?lang=en` param is being set; verify `preferredLanguage` cookie; check translation key exists in both languages |
| Images not loading | Verify paths match `/public/assets/images/`; check WebP format support; check srcset attributes |
| Analytics not firing | Verify `GA4_ID` configured; verify cookie consent granted; check gtag script in head; browser console errors |
| Slow page load | Run Lighthouse; check lazy-loading for Cal.com and Maps; check image compression; verify `inlineStylesheets: 'always'` |
| Admin access denied | Verify Bearer token matches `ADMIN_PASSWORD` env var exactly; check Authorization header format |
| Sitemap not updating | Run `node scripts/generate-sitemap-data.js` manually; verify prebuild hook in `package.json`; check `sitemap.xml.ts` |

### 11.4 Support Resources

- **Netlify issues:** Netlify dashboard logs → Functions tab, Deploy log
- **Email delivery issues:** Resend dashboard → Logs, check spam filters, verify DNS TXT records
- **Analytics issues:** Google Analytics help docs, GA4 DebugView for real-time event verification
- **Domain issues:** Domain registrar support or Netlify support chat
- **Astro issues:** Astro documentation (docs.astro.build) and Discord community

---

## SECTION 12: TEAM ROLES & RESPONSIBILITIES

### 12.1 Required Team

**Product Manager**
- Owns PRD and requirements, fills all `[CLIENT_TO_FILL]` items
- Aligns stakeholders, prioritizes changes
- Makes go/no-go decisions, approves translations

**Frontend Developer(s)**
- Builds Astro components and service page static files
- Implements `global.css` button systems and Tailwind `@theme`
- Implements translation modules and language switching
- Client-side scripting (UTM tracker, cookie consent, analytics)

**Backend/Serverless Engineer**
- Implements Netlify Functions (contact, audit pipeline, admin, survey)
- Configures Netlify Blobs (three stores with `_leads_index` pattern)
- Email template modules with bilingual support and XSS prevention
- `netlify.toml` configuration (security headers, redirects, build)

**Content/Copy Writer**
- Writes all copy in Czech (primary language)
- Coordinates professional English translation
- Blog post content (bilingual), case studies, FAQ

**QA/Tester**
- Tests all three form submission flows end-to-end
- Cross-browser and responsive testing
- Language switching verification on all pages
- Security header verification
- Audit background function pipeline testing

**Client Stakeholder**
- Provides all `[CLIENT_TO_FILL]` items from Section 2
- Reviews and approves translated content
- Final approval on design and copy before launch
- Provides all media assets

### 12.2 Communication & Review

- **Weekly sync:** Status against implementation checklist
- **Design review:** Before Phase 3 component development begins
- **Content review:** Before Phase 5 pages are built (all copy must be finalized)
- **QA review:** End of Phase 8 — sign-off required before launch
- **Launch approval:** Product Manager + Client Stakeholder sign-off required

---

## APPENDIX: QUICK REFERENCE

### Fixed Architecture Decisions (Do Not Change Without Review)

| Decision | Specification |
|----------|--------------|
| Repository structure | Astro project in `astro-src/` subdirectory |
| CSS tooling | Tailwind v4 via `@tailwindcss/vite` — no `tailwind.config.mjs` |
| Design tokens | `@theme` block in `global.css` |
| CSS files | `global.css` (~1,300 lines) + `cookie-consent.css` (~200 lines) |
| Translation system | Modular TypeScript files in `src/scripts/translations/` |
| URL i18n strategy | Czech = clean URLs, English = `?lang=en` query param |
| Language detection | URL param → Cookie (`preferredLanguage`, 1yr) → Default (cs) |
| Blob stores | `contact-leads`, `audit-leads`, `survey-leads` with `_leads_index` |
| Lead ID format | `lead-{timestamp}-{random}` |
| Audit processing | Background Function (15-min), status polling, 202 response |
| Sitemap | Dynamic route `src/pages/sitemap.xml.ts` + prebuild script |
| Font loading | Async preload (`rel="preload" as="style" onload="..."`) |
| Footer embeds | Cal.com + Google Maps: IntersectionObserver lazy-load |
| UTM tracking | `utm-tracker.ts`, `hd_traffic_source` cookie (30 days), all forms |
| Cookie consent | `CookieConsentManager` class, code-split chunk, isolated CSS |
| Admin auth | Inline Bearer token check — no separate auth function |
| Security headers | Set in `netlify.toml` for `/*` (X-Frame-Options, CSP, etc.) |
| Email XSS prevention | `escapeHtml()` in `email-templates.ts` applied to all user input |
| Service pages | Static individual `.astro` files — not dynamic `[slug].astro` |

### Client-Customizable Items

| Item | Where to Configure |
|------|-------------------|
| Brand colors | `@theme` block in `src/styles/global.css` |
| Typography | `@theme` block + font preload in `BaseLayout.astro` |
| All copy (CS + EN) | Translation modules in `src/scripts/translations/` |
| Blog posts | `src/data/blog-posts.json` |
| Client logos | `src/data/clients.json` + `/public/assets/images/clients/` |
| FAQ content | `src/data/faq.json` |
| Services offered | Individual static `.astro` files in `src/pages/services/` |
| Form fields | `src/components/ui/Form.astro` + `netlify/functions/contact.ts` |
| Email sender/recipients | Netlify environment variables |
| Analytics IDs | Netlify environment variables |
| Cal.com URL | Netlify environment variable + `FooterFull.astro` |
| Social media links | `FooterFull.astro` and translation modules |
| Admin password | `ADMIN_PASSWORD` Netlify environment variable |
