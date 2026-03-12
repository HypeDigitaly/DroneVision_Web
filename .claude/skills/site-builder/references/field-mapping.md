# Field Mapping Reference: OnboardingLead → site.json

**Purpose:** Complete mapping of 58 OnboardingLead form fields (6 steps) to site.json keys for client website generation. Includes AI-generated content sources and pending items requiring manual input.

**Version:** 1.0
**Updated:** 2026-03-11
**Status:** Complete reference for site-builder skill pipeline

---

## Layer 1: Direct Field Mapping

Maps each OnboardingLead form field to corresponding site.json path with transformation rules.

### Mapping Table

| OnboardingLead Field | Data Type | site.json Path | Transform | Example | Required |
|---|---|---|---|---|---|
| companyName | string | company.name | Direct | "Prodej.cz s.r.o." | Yes |
| city | string | company.city | Direct | "Praha" | Yes |
| website | URL | meta.siteUrl | Direct | "https://prodej.cz" | Yes |
| website | URL | company.website | Direct | "https://prodej.cz" | Yes |
| ico | string (8 digits) | company.ico | Direct | "12345678" | Yes |
| contactPersonName | string | company.contactPerson.name | Direct | "Jan Novák" | Yes |
| contactPersonEmail | email | company.email | Direct | "jan@prodej.cz" | Yes |
| contactPersonEmail | email | contact.formNotificationEmails[0] | Extract email | "jan@prodej.cz" | Yes |
| additionalEmails | array[{name, email}] | contact.formNotificationEmails[1...n] | Map .email field | [{name: "marie", email: "marie@prodej.cz"}] | No |
| numSalespeople | number | stats.items[0].value | Direct (use in trust indicators) | 12 | Yes |
| monthlySalaryPerSalesman | number | PENDING: not directly mapped | Store in lead context | 35000 | Yes |
| currentClientCount | number | stats.items[1].value | Direct (use in trust indicators) | 240 | No |
| newClientsPerMonth | number | stats.items[2].value | Direct | 8 | No |
| newClientsPerYear | number | PENDING: use for calculation | Calculated: newClientsPerMonth * 12 | 96 | No |
| avgServicePrice | number | pricing.tiers[0].price (base) | Direct or calculated | 25000 | Yes |
| avgLTVPerYear | number | PENDING: context for pricing strategy | Calculate: avgServicePrice * newClientsPerYear | 2400000 | No |
| bestsellingProduct | string (50+ words) | hero.headline_cs (subject) | AI-generated from this + Hormozi framework | "Systém na prodej služeb..." | Yes |
| targetCustomerICP | string (30+ words) | hero.subheadline_cs (subject) | AI-generated from this + Hormozi framework | "Pro malé firmy s 5-50 zaměstnanci..." | Yes |
| sectorKeywords | string[] (1-3 tags) | services.items[].tags | Direct (use as tag identifiers) | ["prodej", "consulting", "SaaS"] | Yes |
| sectorKeywords | string[] | meta.keywords | Direct (use for SEO) | ["prodej", "consulting", "SaaS"] | Yes |
| wantWebsite | boolean | buildConfig.buildWebsite | Direct | true | Yes |
| websitePages | number (1-50) | buildConfig.pageCount | Direct (if wantWebsite=true) | 8 | Conditional |
| inspirationSources | array[{url, screenshot}] | PENDING: design reference | Store in onboarding context (not site.json) | [{url: "...", screenshot: blob}] | Conditional |
| wantLeadMagnet | boolean | leadMagnet.enabled | Direct | true | Yes |
| leadMagnetType | string enum | leadMagnet.type | Direct (allowed values: ebook, checklist, template, course, webinar) | "ebook" | Conditional |
| leadMagnetContent | string | leadMagnet.description_cs | Direct (or replace with AI-generated) | "Úplný průvodce prodejní automatizací" | Conditional |
| wantMarketingMaterials | boolean | PENDING: not directly mapped | Store in onboarding context | true | Yes |
| marketingMaterialTypes | string[] | PENDING: not directly mapped | Store in onboarding context (for future HypeLead) | ["email", "social", "one-pager"] | Conditional |
| wantCRM | boolean | PENDING: not directly mapped | Store in onboarding context | false | No |
| wantBlog | boolean | blog.enabled | Direct | true | No |
| blogArticleCount | number | blog.publishedPostCount | Direct (if wantBlog=true) | 3 | Conditional |
| automateAIBlog | boolean | blog.automateAIBlog | Direct | true | Conditional |
| vslLink | URL (YouTube) | hero.vslVideoId | Extract YouTube video ID from URL | "dQw4w9WgXcQ" | No |
| vslLink | URL | hero.vslVideoUrl | Direct | "https://www.youtube.com/watch?v=dQw4w9WgXcQ" | No |
| hostingAccess | string | PENDING: onboarding context | Store credentials securely (not in site.json) | "FTP: user/pass" | No |
| logo | file (blob) | company.logo | Copy blob to /images/logo.png, set path | "/images/logo.png" | No |
| images | file[] (blobs) | PENDING: asset library | Copy to /images/assets/, reference in onboarding | [blob1, blob2, ...] | No |
| pdfMaterials | file[] (blobs) | PENDING: asset library | Copy to /documents/, reference in onboarding | [blob1, blob2, ...] | No |
| brandingGuidelines | string or file | PENDING: design reference | Store in onboarding context (inform design decisions) | "Blue #0066CC, sans-serif..." | No |
| pricingList | string or file | PENDING: pricing reference | Store in onboarding context (inform pricing.tiers) | blob or text | No |
| serviceDescription | string | services.items[0].description | Direct or AI-enhanced | "Komplexní řešení pro B2B prodej" | No |
| notes | string | PENDING: internal notes | Store in onboarding context | "Klient má vlastní designer" | No |
| dailyVolume | string enum | contact.expectedVolume | Direct (allowed values: low, medium, high, very-high) | "high" | Yes |
| channels | string[] | contact.channels | Direct (allowed values: email, phone, form, sms) | ["email", "form"] | Yes |
| aresData.nazev | string (from ARES API) | company.legalName | Direct | "Prodej.cz s.r.o." | Auto-populated |
| aresData.sidlo.textovaAdresa | string (from ARES API) | company.address (parse) | Parse: street, number, city, zip from address string | "Nebeská 1, 110 00 Praha 1" | Auto-populated |
| aresData.czNace | string[] (from ARES API) | services.naceCategories | Direct (use for SEO context) | ["6201", "6202"] | Auto-populated |
| aresData.pocetZamestnancu | number (from ARES API) | stats.items[3].value | Direct | 25 | Auto-populated |
| niches | string[] | services.items[].niche | Direct (map to service categories) | ["B2B", "SaaS", "Consulting"] | Yes |
| selectedPackage | string enum | pricing.selectedTier | Direct (allowed values: starter, growth, enterprise) | "growth" | Yes |
| selectedPackage | string enum | pricing.template | Reference template configuration | "growth" → 3 tiers with specific features | Yes |
| setupFee | number (calculated) | pricing.setupFee | Calculated from selectedPackage template | 15000 | Calculated |
| monthlyFee | number (calculated) | pricing.monthlyFee | Calculated from selectedPackage template | 5000 | Calculated |
| totalFirstPeriod | number (calculated) | pricing.totalFirstPeriod | setupFee + (monthlyFee * 3) | 30000 | Calculated |

---

## Layer 2: AI-Generated Content Mapping

Maps the 5 AI-generated markdown files to site.json sections with extraction rules.

### AI Content Sources Table

| AI Source File | Generated By | site.json Section | Extraction Rule | What Gets Used | Priority |
|---|---|---|---|---|---|
| icp-definition.md | Claude Opus (2-pass) | problem.items | Extract "Pain Points" section; reformat as 3-5 cards with title, description, icon | Cards with pain point titles and descriptions | HIGH |
| icp-definition.md | Claude Opus (2-pass) | hero.subheadline_cs | Extract "ICP Profile" section; use summary as context for Hormozi "perceived likelihood" | Short description of ideal customer | HIGH |
| icp-definition.md | Claude Opus (2-pass) | services.items[].tags | Extract "NACE Niches" section; use as tags and categories for service offerings | Industry categories and niches | MEDIUM |
| icp-definition.md | Claude Opus (2-pass) | meta.keywords | Extract "Keywords" section; use top 10-15 keywords for SEO | SEO keyword list | MEDIUM |
| lead-magnet-ideas.md | GPT-5.4 | leadMagnet.headline_cs | Use first proposal's title | Lead magnet title/headline | HIGH |
| lead-magnet-ideas.md | GPT-5.4 | leadMagnet.description_cs | Use first proposal's description/value proposition | Lead magnet description | HIGH |
| lead-magnet-ideas.md | GPT-5.4 | leadMagnet.format | Extract first proposal's format field | Format type (PDF, video, checklist, etc.) | MEDIUM |
| lead-magnet-ideas.md | GPT-5.4 | leadMagnet.cta_text_cs | Extract first proposal's CTA | Call-to-action button text | MEDIUM |
| vsl-script.md | Claude Opus | hero.headline_cs | If vslLink provided: use "Dream Outcome" line from script as inspiration for headline | VSL-informed headline (Hormozi dream outcome) | MEDIUM |
| vsl-script.md | Claude Opus | cta.headline_cs | Extract "Risk Reversal" section from script; use as CTA inspiration (Hormozi framework) | VSL-informed CTA (Hormozi risk reversal) | MEDIUM |
| vsl-script.md | Claude Opus | REFERENCE ONLY | If no vslLink: script informs hero and cta copy decisions | Script for copywriter reference | LOW |
| email-campaigns.md | Claude Opus | NOT USED FOR WEBSITE | Store for HypeLead platform integration | Reference only (used by HypeLead, not site-builder) | N/A |
| implementation-checklist.md | GPT-5.4 | NOT USED FOR WEBSITE | Store for internal project management | Reference only (used by project manager, not site-builder) | N/A |

### Detailed AI Content Extraction Pipelines

#### icp-definition.md → Multiple site.json Sections

**Source:** Claude Opus (2-pass generation with bestsellingProduct + targetCustomerICP)

**Structure of icp-definition.md:**
```
# ICP Definition: [Company Name]

## Pain Points
- [5-8 specific pain points with 1-2 sentence descriptions]

## ICP Profile
[2-3 paragraph detailed profile of ideal customer]

## Key Characteristics
- [Firmographic data: company size, revenue, industry]
- [Behavioral: buying patterns, decision-making process]
- [Technographic: tools they use, tech stack]

## NACE Niches
- [3-5 NACE category codes with descriptions]

## Keywords & Phrases
- [15-20 high-volume search terms relevant to ICP and pain points]
```

**Extraction:**
1. **problem.items** (HIGH priority)
   - Extract "Pain Points" section
   - Take first 3 most critical pain points
   - Reformat each as: `{icon: "problem-icon", title: "Pain Point Title", description: "1-2 sentence explanation"}`
   - Example:
     ```json
     "problem": {
       "items": [
         {
           "icon": "trending-down",
           "title_cs": "Ztráta prodejních příležitostí",
           "description_cs": "Bez automatizace přicházíte o 30% potenciálních dealů..."
         }
       ]
     }
     ```

2. **hero.subheadline_cs** (HIGH priority)
   - Extract key phrase from "ICP Profile" section
   - Use 15-30 word summary describing ideal customer
   - Format: "Pro [customer type] které [situation]"
   - Example: "Pro B2B služby s 5-50 zaměstnanci, které chtějí zvýšit prodej bez náboru nových lidí"

3. **services.items[].tags** (MEDIUM priority)
   - Extract "NACE Niches" section
   - Use 3-5 niche identifiers from NACE codes
   - Map to services.items tags field
   - Example: `["consulting", "b2b-services", "saas"]`

4. **meta.keywords** (MEDIUM priority)
   - Extract "Keywords & Phrases" section
   - Use top 10-15 keywords for SEO
   - Format: comma-separated string
   - Example: `"prodejní automatizace, lead generation, B2B sales, CRM systém..."`

#### lead-magnet-ideas.md → leadMagnet Section

**Source:** GPT-5.4 (generated from bestsellingProduct + leadMagnetType + targetCustomerICP)

**Structure of lead-magnet-ideas.md:**
```
# Lead Magnet Ideas: [Company Name]

## Idea 1: [Title]
- **Format:** [ebook/checklist/template/course/webinar]
- **Value Proposition:** [2-3 sentence value for ICP]
- **Outline/Structure:** [Key sections if applicable]
- **CTA:** [Suggested button text, e.g., "Stáhněte zdarma"]
- **Delivery:** [How it's delivered: email, PDF, video link, etc.]

## Idea 2: [Title]
[Similar structure]

## Idea 3: [Title]
[Similar structure]
```

**Extraction (use FIRST idea only):**
1. **leadMagnet.headline_cs** → Idea 1 title
   - Example: "Komplexní průvodce prodejní automatizací"
2. **leadMagnet.description_cs** → Idea 1 value proposition (2-3 sentences)
   - Example: "Zjistěte, jak získat 50% více klientů bez zvýšení prodejního týmu..."
3. **leadMagnet.type** → Extract format field
   - Values: "ebook", "checklist", "template", "course", "webinar"
4. **leadMagnet.cta_text_cs** → Extract CTA field
   - Default: "Stáhněte zdarma" (can override with Idea 1 CTA)
5. **leadMagnet.deliveryMethod** → Extract Delivery field
   - Values: "email", "pdf", "video", "page"

#### vsl-script.md → Hero & CTA Sections

**Source:** Claude Opus (generated from targetCustomerICP + bestsellingProduct, Hormozi framework)

**Structure of vsl-script.md:**
```
# VSL Script: [Company Name]

## Hook (First 5 seconds)
[Attention-grabbing line]

## Dream Outcome
[What customer wants to achieve]

## Perceived Likelihood
[Why they believe it's possible]

## Urgency/Scarcity
[Why now/limited availability]

## Risk Reversal
[Money-back guarantee or guarantee of success]

## Full Script
[Complete video script in Czech]
```

**Extraction:**
1. **hero.headline_cs** (MEDIUM priority, if vslLink exists)
   - Extract "Dream Outcome" section
   - Use 8-15 word headline version
   - Follows Hormozi framework: [outcome] [without] [effort]
   - Example: "Prodejte 50% více bez najímání prodejců"

2. **cta.headline_cs** (MEDIUM priority, if vslLink exists)
   - Extract "Risk Reversal" section
   - Use as CTA inspiration (Hormozi guarantee style)
   - Format: "Garantujeme [outcome] nebo [refund]"
   - Example: "Garantujeme 20% zvýšení prodeje za 90 dní, nebo vám vrátíme peníze"

3. **Reference for copywriter** (LOW priority)
   - If no vslLink provided: store script location for copywriter reference
   - Script informs tone, key messages, and pain point language

#### email-campaigns.md → HypeLead Integration (NOT WEBSITE)

**Source:** Claude Opus (generated from bestsellingProduct + targetCustomerICP + channels)

**Not extracted for site.json.** This file is used by HypeLead platform for cold email automation:
- Store location in onboarding record
- Reference for HypeLead email sequence builder
- Contains 3-5 full email templates ready for deployment

#### implementation-checklist.md → Project Management (NOT WEBSITE)

**Source:** GPT-5.4 (generated from all form fields)

**Not extracted for site.json.** This file is for internal project management:
- Store location in onboarding record
- Reference for project manager tracking
- Contains task list for client implementation

---

## Layer 3: Pending Items Requiring Manual Input

Items missing from OnboardingLead form that must be configured separately.

### Pending Items Table

| site.json Path | Missing Data | Why It's Missing | Priority | Type | Suggested Action | Responsible |
|---|---|---|---|---|---|---|
| buildConfig.brandColors | HEX color palette (5 colors: primary, secondary, accent, error, neutral) | Form doesn't collect branding colors | HIGH | Design | Extract from logo using AI tool OR ask client for brand guidelines document | Designer/Client |
| buildConfig.typography | Font families (heading font, body font, monospace) | Form doesn't collect typography preferences | MEDIUM | Design | Use defaults: Inter (body), Sora (heading), code-mono (code) — can override if brandingGuidelines provided | Designer |
| buildConfig.pageLayout | Layout template (width, spacing, component grid) | Form doesn't collect layout preferences | LOW | Design | Use default: max-width 1200px, Tailwind grid system | Designer |
| meta.gaId | Google Analytics 4 Property ID | Not collected during onboarding | LOW | Analytics | Create GA4 property after site deployed, update manually | Client/DevOps |
| meta.clarityId | Microsoft Clarity Project ID | Optional analytics tool not in form | LOW | Analytics | Optional: create Clarity project if client wants, update manually | Client/Optional |
| meta.robots | Search engine crawler rules | Not collected; use sensible defaults | LOW | SEO | Default: "index, follow" for public sites | Auto-set |
| company.dic | DIČ (Czech VAT number) | ARES API may provide, or missing | MEDIUM | Legal | Query ARES API with ICO; if not found, ask client directly | System/Client |
| company.bankAccount | Bank account for invoicing | Not collected during onboarding | LOW | Financial | Ask client via follow-up email if needed for invoicing | Client |
| testimonials.items | Structured client quotes with name, title, company, quote text, image | Form has no testimonial collection (only PDFs) | HIGH | Social Proof | AI-generate 3-5 placeholder testimonials OR request from client via follow-up | Client/AI |
| logoMarquee.logos | Array of partner/client logos for "As Seen In" section | Form has no partner logo collection | LOW | Social Proof | Skip unless client provides specific partner logos; can add later | Client/Optional |
| team.members | Team member profiles (name, role, image, bio) | Form doesn't collect team info | MEDIUM | About | Can skip or ask client for team roster via follow-up | Client/Optional |
| aboutSection.story | Company origin story (500+ words) | Form only has companyName | MEDIUM | Content | Request from client OR AI-generate based on metrics + bestsellingProduct | Client/AI |
| aboutSection.mission | Company mission statement | Form doesn't collect this | MEDIUM | Content | Request from client OR AI-generate from business metrics | Client/AI |
| aboutSection.values | Company core values (3-5) | Form doesn't collect this | LOW | Content | Request from client OR use generic tech values | Client/Optional |
| case-studies.items | Detailed success stories with numbers, methodology, results | Form has no case study collection | MEDIUM | Social Proof | Request from client (templates provided) OR skip for MVP | Client/Optional |
| integrations.items | Third-party service logos and links (Slack, Zapier, etc.) | Form doesn't collect this | LOW | Feature | Only add if client uses specific integrations; skip for MVP | Client/Optional |
| faq.items (full list) | 8-12 FAQs with questions and answers | Form doesn't directly collect FAQs | MEDIUM | Content | AI-generate 8-12 FAQs from bestsellingProduct + targetCustomerICP + sectorKeywords (icp-definition.md context) | AI |
| blog.posts | Full blog post content and metadata | Form has blog flags, not post content | MEDIUM | Content | If automateAIBlog=true: AI-generate 3 starter posts from sectorKeywords + ICP (icp-definition.md); store as Astro .md files | AI |
| contact.presales.calendlyUrl | Calendly link for scheduling demos | Form doesn't collect Calendly/booking link | LOW | Conversion | Ask client for Calendly/Typeform link via follow-up | Client |
| contact.formBackend | Form submission backend webhook | Form doesn't specify backend preference | MEDIUM | Technical | Default: Netlify Forms (auto-configured) OR client provides Zapier/webhook URL | Client/Developer |
| social.channels | Social media links (LinkedIn, Twitter, Facebook, Instagram) | Form doesn't collect social handles | LOW | Connect | Ask client for social links via follow-up; skip if not provided | Client/Optional |
| hero.backgroundImage | Hero section background or gradient | Form doesn't collect image preference | MEDIUM | Design | Use default gradient OR extract from brandingGuidelines OR client provides image | Client/Designer |
| services.featured | Which services to highlight (limit 3-4) | Form has bestsellingProduct but not prioritization | MEDIUM | Content | Auto-select: use bestsellingProduct + top 2 from sectorKeywords | Auto-set |
| pricing.description | Descriptive text explaining pricing structure | Form doesn't collect explanation | LOW | Content | Auto-generate simple text OR request from client | AI/Client |
| pricing.tiers.features | Detailed feature lists per tier | Form has selectedPackage, not feature breakdown | MEDIUM | Product | Use template defaults based on selectedPackage (starter/growth/enterprise) | Template |
| cta.secondaryAction | Secondary call-to-action (e.g., "Learn More" vs "Buy Now") | Form doesn't specify CTA strategy | LOW | Conversion | Default: "Domluvit demo" for secondary; primary = "Začít zdarma" | Auto-set |

---

## Layer 4: Content Generation Workflow

Detailed workflow showing how form fields flow through AI generation and into site.json.

### Data Flow Diagram

```
OnboardingLead Form (6 steps)
         ↓
    Step 1-2 Data
    (company metrics)
         ↓
    ┌────────────────────────────────┐
    │ ARES API Lookup (ICO)           │
    │ → company.legalName             │
    │ → company.address (parsed)      │
    │ → aresData.czNace               │
    │ → company.dic                   │
    └────────────────────────────────┘
         ↓
    ┌────────────────────────────────┐
    │ AI Content Generation (5 files) │
    │ Inputs:                         │
    │ - bestsellingProduct            │
    │ - targetCustomerICP             │
    │ - sectorKeywords                │
    │ - niches                        │
    │ - leadMagnetType                │
    │ - company metrics               │
    └────────────────────────────────┘
         ↓
    ┌─────────────┬────────────┬──────────────┬──────────────┬──────────────┐
    │ icp-def.md  │ lead-mag.md│ vsl-script.md│ email-camp.md│ impl-check.md│
    └─────────────┴────────────┴──────────────┴──────────────┴──────────────┘
         ↓
    site.json Population (3 stages):

    STAGE 1: Direct Mapping
    - company.name, .email, .ico, .address
    - meta.siteUrl, .keywords
    - contact.channels, .expectedVolume
    - stats.items (from metrics)
    - pricing.setupFee, .monthlyFee, .totalFirstPeriod

    STAGE 2: AI Extraction
    - hero section (headline, subheadline from icp-def + vsl-script)
    - problem.items (from icp-definition.md pain points)
    - cta section (from vsl-script risk reversal)
    - leadMagnet section (from lead-magnet-ideas.md)
    - services.items (from bestsellingProduct + sectorKeywords + icp-definition.md)
    - faq.items (AI-generated from icp context)
    - blog.posts (if automateAIBlog=true, from icp context)

    STAGE 3: Manual Input / Defaults
    - buildConfig colors/typography (designer OR logo extraction)
    - testimonials (AI placeholder OR client provided)
    - case studies (optional, client provided)
    - team info (optional, client provided)
    - analytics IDs (post-deploy)
    - social links (optional, client provided)
         ↓
    Final site.json (complete)
         ↓
    Astro Build + Netlify Deploy
```

### Extraction Sequence

1. **OnboardingLead submitted**
   - Store all 58 fields in database
   - Trigger ARES API lookup with ICO
   - Store ARES response (nazev, sidlo, czNace, pocetZamestnancu)

2. **AI content generation (parallel, ~10 minutes)**
   - icp-definition.md: Claude Opus 2-pass (bestsellingProduct + targetCustomerICP + sectorKeywords)
   - lead-magnet-ideas.md: GPT-5.4 (leadMagnetType + bestsellingProduct + targetCustomerICP)
   - vsl-script.md: Claude Opus (targetCustomerICP + bestsellingProduct + Hormozi framework)
   - email-campaigns.md: Claude Opus (parallel, for HypeLead)
   - implementation-checklist.md: GPT-5.4 (parallel, for project manager)

3. **Parse AI files into site.json**
   - icp-definition.md → pain points, keywords, niches, ICP profile
   - lead-magnet-ideas.md → lead magnet section
   - vsl-script.md → hero headline, CTA headline, dream outcome
   - Email campaigns + checklist → store references, not extracted

4. **Generate site.json (full object)**
   - Merge direct mappings (company, meta, contact, stats, pricing)
   - Merge AI extractions (hero, problem, services, leadMagnet, cta, faq)
   - Merge defaults (typography, layout, footer, blog settings)
   - Mark pending items (colors, testimonials, case studies)
   - Return with "completeness score" (e.g., "92% complete, 8 items pending")

5. **Client review + manual completion**
   - Client provided design/branding → buildConfig.brandColors
   - Client provided testimonials → testimonials.items
   - Client provided team → team.members
   - Designer confirms layout → buildConfig.pageLayout
   - All pending items addressed → buildConfig.readyToDeploy = true

6. **Astro site generation**
   - site-builder skill reads final site.json
   - Generates all .astro component pages
   - Injects content from site.json
   - Runs SEO optimization
   - Builds static HTML
   - Deploys to Netlify

---

## Layer 5: Complete Coverage Summary

Comprehensive accounting of all site.json keys and their source.

### Coverage Breakdown

**Total site.json Keys:** 127 (estimated across all sections)

| Coverage Category | Key Count | Percentage | Details |
|---|---|---|---|
| Direct Mapping (form → site.json) | 38 | 30% | company, meta, contact, stats, pricing basic structure, blog flags |
| AI-Generated (md files → site.json) | 24 | 19% | hero, problem, cta, services, leadMagnet, faq, keywords, niche tags |
| Template Defaults | 31 | 24% | footer, layout, typography, component settings, seo defaults, form config |
| Auto-Calculated | 8 | 6% | setupFee, monthlyFee, totalFirstPeriod, derived stats, ARES enrichment |
| PENDING (manual input required) | 16 | 13% | buildConfig colors, testimonials, case studies, social links, team, analytics IDs |
| OPTIONAL (skip for MVP) | 10 | 8% | integrations, partner logos, advanced team features, advanced blog settings |

### Key Groups by Completion Stage

#### Stage 1: Direct Mapping (38 keys, 30%)
These populate automatically from form fields:
- company: name, email, ico, website, legalName, address (all)
- meta: siteUrl, keywords, language, title pattern
- contact: channels, expectedVolume, formNotificationEmails (all)
- stats: items (3-5 values from metrics)
- pricing: setupFee, monthlyFee, totalFirstPeriod, selectedTier
- blog: enabled, publishedPostCount, automateAIBlog
- leadMagnet: enabled, type
- buildConfig: buildWebsite, pageCount, language

#### Stage 2: AI-Generated (24 keys, 19%)
These populate from AI-generated .md file extraction:
- hero: headline_cs, subheadline_cs, vslVideoId, vslVideoUrl
- problem: items (3-5 cards from icp-definition.md)
- services: items (descriptions, tags, niche from icp-definition + bestsellingProduct)
- leadMagnet: headline_cs, description_cs, format, cta_text_cs
- cta: headline_cs (from vsl-script.md)
- faq: items (8-12 FAQs AI-generated)
- blog: posts (3 starter posts if automateAIBlog=true)
- meta: keywords (from icp-definition.md)

#### Stage 3: Template Defaults (31 keys, 24%)
These use sensible defaults with no input required:
- buildConfig: typography (Inter, Sora, code-mono), pageLayout, spacing
- footer: description_cs/en, links, copyright, legal
- seo: og tags, structuredData defaults, metaDescription pattern
- form: fields config, validation rules, success messages
- blog: sortOrder, itemsPerPage, tagsEnabled
- cta: secondaryActionText (defaults to "Domluvit demo")
- design: spacing tokens, breakpoints, component defaults

#### Stage 4: Auto-Calculated (8 keys, 6%)
These are derived from other data:
- pricing fees (setupFee = template default for package, monthlyFee = template default, totalFirstPeriod = setupFee + monthlyFee × 3)
- stats: items (newClientsPerYear = newClientsPerMonth × 12, LTV analysis, etc.)
- ARES enrichment: company.dic (if returned by ARES), company.address parsing
- company.tagline (auto-generated from bestsellingProduct first 20 words)

#### Stage 5: Pending Items (16 keys, 13%)
These require manual input and are marked in site.json as "pending":
- buildConfig: brandColors (5 HEX values from logo or client)
- testimonials: items (3-5 structured quotes from client or AI placeholder)
- case-studies: items (optional, from client)
- team: members (optional, from client)
- aboutSection: story, mission, values (from client or AI)
- contact: presales.calendlyUrl (from client)
- social: channels (LinkedIn, Twitter, etc. from client)
- hero: backgroundImage (from client or design)
- meta: gaId, clarityId (post-deploy)
- company: bankAccount, dic (post-ARES lookup)
- contact: formBackend webhook (if not Netlify default)

#### Stage 6: Optional (10 keys, 8%)
These can be skipped for MVP and added later:
- integrations: items (partner integrations, skipped by default)
- logoMarquee: logos (client logos, skipped unless provided)
- team: advanced settings (team page background, team filters)
- blog: advanced settings (related posts, reading time, author profiles)
- pages: custom pages beyond standard set (extra landing pages)
- design: advanced animations, interactive features
- conversion: advanced heat maps, session recording
- seo: advanced schema markup beyond defaults

### Completeness Score Calculation

```
Completeness = (Direct + AI-Generated + Template + Auto-Calculated) / Total × 100
             = (38 + 24 + 31 + 8) / 127 × 100
             = 101 / 127
             = 79.5% complete at end of site-builder pipeline

After Client Manual Input (Pending stage):
             = (38 + 24 + 31 + 8 + 16) / 127 × 100
             = 117 / 127
             = 92% complete (ready for deployment)

After Optional Features (full):
             = 127 / 127
             = 100% complete (fully featured)
```

### Typical Deployment Readiness Checklist

- [x] Direct mapping complete (company, meta, contact, stats, pricing)
- [x] AI content generated and extracted (hero, problem, services, faq, leadMagnet)
- [x] Template defaults applied (footer, typography, layout, seo)
- [x] Auto-calculated fields populated (fees, stats, ARES enrichment)
- [ ] Brand colors provided (PENDING: HIGH)
- [ ] Testimonials provided or AI placeholders confirmed (PENDING: HIGH)
- [ ] Team info provided (OPTIONAL, not required)
- [ ] Case studies provided (OPTIONAL, not required)
- [ ] Social media links provided (OPTIONAL, not required)
- [ ] Analytics IDs configured (PENDING: LOW, post-deploy)
- [ ] Form backend configured (DEFAULT: Netlify Forms)
- [ ] Calendly/booking link provided (OPTIONAL, not required)
- [ ] Final review and approval (REQUIRED before deploy)

---

## Appendix A: Field Mapping by Form Step

Quick reference showing which site.json keys each form step populates.

### Step 1: Info o firmě (3 fields)
- companyName → company.name, company.tagline (first 20 words)
- city → company.city
- website → meta.siteUrl, company.website

**site.json Keys: 5 direct + 2 parsed from city**

### Step 2: Obchodní metriky (10 fields)
- numSalespeople → stats.items[0].value
- monthlySalaryPerSalesman → CONTEXT (not direct)
- currentClientCount → stats.items[1].value
- newClientsPerMonth → stats.items[2].value, calculated: newClientsPerYear
- newClientsPerYear → stats.items[3].value
- avgServicePrice → pricing.tiers[0].price, CONTEXT
- avgLTVPerYear → CONTEXT (not direct)
- bestsellingProduct → hero.headline_cs (AI), services.items[0] (AI)
- targetCustomerICP → hero.subheadline_cs (AI), problem.items (AI from icp-definition.md)
- sectorKeywords → services.items[].tags, meta.keywords

**site.json Keys: 12 direct/AI + 3 context + 2 calculated**

### Step 3: Příchozí komunikace (9 fields)
- wantWebsite → buildConfig.buildWebsite
- websitePages → buildConfig.pageCount (conditional)
- inspirationSources → CONTEXT (not site.json)
- wantLeadMagnet → leadMagnet.enabled
- leadMagnetType → leadMagnet.type (conditional)
- wantMarketingMaterials → CONTEXT (not direct)
- marketingMaterialTypes → CONTEXT (not direct)
- leadMagnetContent → leadMagnet.description_cs (or replaced by AI)
- wantCRM → CONTEXT (not direct)

**site.json Keys: 5 direct + 4 context**

### Step 4: Assety & Kontakty (15 fields)
- vslLink → hero.vslVideoId (parsed), hero.vslVideoUrl
- hostingAccess → CONTEXT (not site.json)
- logo → company.logo (file path)
- images → CONTEXT (asset library)
- pdfMaterials → CONTEXT (asset library)
- notes → CONTEXT (not site.json)
- brandingGuidelines → PENDING (buildConfig.brandColors)
- pricingList → CONTEXT (pricing reference)
- serviceDescription → services.items[0].description
- contactPersonName → company.contactPerson.name
- contactPersonEmail → company.email, contact.formNotificationEmails[0]
- additionalEmails → contact.formNotificationEmails[1...n] (map .email)
- wantBlog → blog.enabled
- blogArticleCount → blog.publishedPostCount (conditional)
- automateAIBlog → blog.automateAIBlog (conditional)

**site.json Keys: 12 direct + 3 pending + 4 context**

### Step 5: Odchozí komunikace (2 fields)
- dailyVolume → contact.expectedVolume
- channels → contact.channels

**site.json Keys: 2 direct**

### Step 6: Výběr balíčku + ARES (6 fields + auto-populated)
- ico → company.ico, triggers ARES lookup
- aresData.nazev → company.legalName (auto-populated)
- aresData.sidlo.textovaAdresa → company.address (parsed, auto-populated)
- aresData.czNace → services.naceCategories (auto-populated)
- aresData.pocetZamestnancu → stats.items[3].value (auto-populated)
- niches → services.items[].niche
- selectedPackage → pricing.selectedTier, pricing template reference
- setupFee, monthlyFee, totalFirstPeriod → pricing fees (auto-calculated)

**site.json Keys: 8 direct + 5 auto-populated + 3 auto-calculated**

---

## Appendix B: AI File Structure Reference

Complete template showing expected structure of each AI-generated markdown file.

### Template: icp-definition.md

```markdown
# ICP Definition: [Company Legal Name]

**Generated:** [ISO date]
**For:** [Onboarding Lead ID]

## Executive Summary
[1 paragraph overview of ideal customer profile]

## Pain Points

1. **[Pain Point 1 Title]**
   - Description: [1-2 sentences describing the pain point]
   - Impact: [Business impact if unresolved]
   - Frequency: [How often this occurs]

2. **[Pain Point 2 Title]**
   [Same structure]

3. **[Pain Point 3 Title]**
   [Same structure]

4. **[Pain Point 4 Title]**
   [Same structure]

5. **[Pain Point 5 Title]**
   [Same structure]

## ICP Profile

### Demographics
- Company Size: [number of employees]
- Annual Revenue: [estimated range]
- Industry: [primary industry]
- Company Age: [years in operation]

### Firmographics
- Decision Makers: [titles of typical decision makers]
- Budget Authority: [who controls budget]
- Buying Cycle: [typical sales cycle length]
- Contract Value: [typical deal size]

### Behavioral Characteristics
[2-3 paragraphs describing buying behavior, priorities, and decision-making process]

### Technographic Profile
- Current Tools: [tools they likely use]
- Tech Stack: [typical technology stack]
- Integration Needs: [what systems they need to connect]

## Key Characteristics

### Firmographic Data
- Company Size: [Small/Medium/Large: X-Y employees]
- Revenue: [Annual revenue estimate]
- Growth Stage: [Stage: startup/growth/mature]
- Geographic Focus: [Primary markets]

### Behavioral
- Primary Motivation: [What they're trying to achieve]
- Success Metric: [How they measure success]
- Decision Timeline: [How fast they decide]
- Risk Tolerance: [Conservative/Moderate/Aggressive]

### Technographic
- Cloud Adoption: [Public cloud, private, hybrid]
- API Integration: [Level of API sophistication]
- Automation Maturity: [Current level]
- Data Volume: [Scale of data handled]

## NACE Niches

1. **[NACE Code 1] - [Niche Name]**
   - Description: [What this niche does]
   - Relevance Score: 95%
   - Keywords: [3-5 relevant keywords]

2. **[NACE Code 2] - [Niche Name]**
   [Same structure]

3. **[NACE Code 3] - [Niche Name]**
   [Same structure]

## Keywords & Phrases

### High-Intent Keywords (Dream Outcome)
- [Keyword 1] — [Search volume estimate]
- [Keyword 2] — [Search volume estimate]
- [Keyword 3] — [Search volume estimate]
- [Keyword 4] — [Search volume estimate]
- [Keyword 5] — [Search volume estimate]

### Problem Keywords (Pain Points)
- [Keyword 1] — [Search volume estimate]
- [Keyword 2] — [Search volume estimate]
- [Keyword 3] — [Search volume estimate]
- [Keyword 4] — [Search volume estimate]
- [Keyword 5] — [Search volume estimate]

### Competitor Keywords (Market Context)
- [Keyword 1] — [Search volume estimate]
- [Keyword 2] — [Search volume estimate]
- [Keyword 3] — [Search volume estimate]
- [Keyword 4] — [Search volume estimate]
- [Keyword 5] — [Search volume estimate]

## Recommended Messaging Framework

### Dream Outcome (Hero Headline)
[Hormozi framework: "Get [outcome] without [objection]"]

### Perceived Likelihood (Hero Subheadline)
[Why they should believe it's possible]

### Urgency/Scarcity
[Time-sensitive hook]

### Risk Reversal
[Guarantee or risk-free element]

---
```

### Template: lead-magnet-ideas.md

```markdown
# Lead Magnet Ideas: [Company Legal Name]

**Generated:** [ISO date]
**For:** [Onboarding Lead ID]
**Type Requested:** [ebook/checklist/template/course/webinar]

## Overview
[1 paragraph explaining the strategic fit of these lead magnet ideas for this ICP]

## Idea 1: [Title]

**Format:** [ebook/checklist/template/course/webinar]
**Estimated Length:** [Pages/videos/modules]
**Delivery Method:** [Email, PDF download, video series, interactive page]

**Value Proposition:**
[2-3 sentences explaining why the ICP would want this; focus on outcome, not features]

**Outline/Structure:**
- Section 1: [Title] — [What it covers]
- Section 2: [Title] — [What it covers]
- Section 3: [Title] — [What it covers]
- Section 4: [Title] — [What it covers]
- Section 5: [Title] — [What it covers]

**Target Audience Pain Point:**
[Which ICP pain point does this address?]

**Suggested CTA:**
- Primary: [Button text, e.g., "Stáhněte PDF zdarma"]
- Secondary: [Alternative, e.g., "Přidat do emailu"]

**Success Metric:**
[How to measure if this works: downloads, email signups, conversion rate, etc.]

---

## Idea 2: [Title]

[Same structure as Idea 1]

---

## Idea 3: [Title]

[Same structure as Idea 1]

---

## Comparison Matrix

| Aspect | Idea 1 | Idea 2 | Idea 3 |
|---|---|---|---|
| Production Time | [days] | [days] | [days] |
| Estimated Downloads | [estimate] | [estimate] | [estimate] |
| Conversion Rate | [estimate %] | [estimate %] | [estimate %] |
| Production Cost | [estimate] | [estimate] | [estimate] |
| **Recommendation** | **BEST OPTION** | Good backup | Alternative |

---

## Implementation Recommendation

**Start with:** [Idea 1 Title]
**Why:** [Reasoning based on highest conversion potential, fastest production, best fit with ICP]

**Production Timeline:**
- Design/Layout: [X days]
- Content Creation: [X days]
- Review & Revision: [X days]
- Deployment: [X days]
- **Total:** [X days]

---
```

### Template: vsl-script.md

```markdown
# VSL Script: [Company Legal Name]

**Generated:** [ISO date]
**For:** [Onboarding Lead ID]
**Framework:** Hormozi VSL Structure
**Language:** Czech

---

## Script Outline (Internal)

### Hook (0-5 seconds)
[Attention-grabbing statement or question that stops scrolling]

### Dream Outcome (5-15 seconds)
[What the ideal customer wants to achieve; phrased as specific, measurable outcome]

### Perceived Likelihood (15-30 seconds)
[Why they should believe this outcome is achievable; proof, logic, or social proof]

### Urgency/Scarcity (30-45 seconds)
[Why they need to act now; limited spots, deadline, or seasonal relevance]

### Risk Reversal (45-60 seconds)
[Guarantee, money-back offer, or risk removal statement; removes objection to taking action]

### Call-to-Action (60-65 seconds)
[Clear, specific action: link, phone number, email, etc.]

---

## Full VSL Script

[SPOKEN FROM PERSPECTIVE OF: Owner/Expert speaking directly to ideal customer]

---

### Hook (Read at normal pace, slightly faster)

[Opening line that creates curiosity or captures attention]

---

### Dream Outcome (Speak with enthusiasm, show the vision)

"Máte představu, že by bylo skvělé, kdybyste..."

[Describe the ideal outcome in specific terms that resonate with ICP]

"Bez [current friction point], bez [common objection], bez [key blocker]."

---

### Perceived Likelihood (Shift tone to confident, matter-of-fact)

"Víte co? Právě to se dá udělat. Tady je proč..."

[Present evidence: own case study, client results, logic, third-party proof]

"Viděli jsme to už víckrát. Firmy ve vaší situaci, když [specific context], dosahují [specific result]."

---

### Urgency/Scarcity (Introduce urgency gently, not pushy)

"Tady je ale věc..."

[Present time-sensitive reason: limited availability, seasonal window, competitive advantage, or data supporting urgency]

"Pokud byste to chtěli vyřešit, teď je ten správný čas, protože [specific reason]."

---

### Risk Reversal (Speak with conviction and certainty)

"Aby vám došlo, že to není riziko, jsme vám schopní garantovat..."

[State the guarantee clearly and specifically]

"Zkusíte to za nulové riziko. Pokud [specific condition] nenastane v [timeframe], vrátíme vám [what]."

---

### Call-to-Action (Speak with clarity and action orientation)

"Takže teď je to jednoduché. Jenom [action step]."

[Clear instruction: click link, fill form, email, call, etc.]

"Najdete nás tady: [URL/phone/email]"

---

### Closing (Reinforce benefit one more time)

"[Short phrase reinforcing dream outcome and what they'll get from taking action]"

---

## Script Notes for Video Production

- **Tone:** [Conversational/Professional/Friendly/Expert]
- **Pace:** [Slow/Normal/Energetic]
- **Background:** [Suggestion for video background]
- **On-Screen Elements:** [What should appear on screen: product demo, testimonials, guarantee text, etc.]
- **Length:** [Estimated length: 60-90 seconds typical for VSL]
- **Call-to-Action Type:** [Direct: email, phone; Soft: schedule call, download resource, quiz]

---

## A/B Testing Variants

### Variant A: [Headline 1]
[Short version of script emphasizing [benefit]]

### Variant B: [Headline 2]
[Short version of script emphasizing [benefit]]

---

## Hormozi Framework Validation

- [x] Hook: Stops scrolling within 3 seconds
- [x] Dream Outcome: Clear, specific, measurable
- [x] Perceived Likelihood: Evidence-based, not hype
- [x] Urgency: Present, but not artificial
- [x] Risk Reversal: Specific guarantee removing objection
- [x] CTA: Clear, single action
- [x] Timing: 60-90 seconds total

---
```

### Template: email-campaigns.md

```markdown
# Cold Email Campaigns: [Company Legal Name]

**Generated:** [ISO date]
**For:** [Onboarding Lead ID]
**ICP Email Domain:** [@company-domain.com pattern]

---

## Campaign Overview

[1-2 paragraph explaining the email strategy, ideal deployment sequence, and expected metrics]

---

## Email Sequence 1: [Title/Hook]

### Email 1: [Subject Line]

**Subject:** [Subject line (40-50 chars), no "Re:" prefix on first email]

**Preview Text:** [Email preview text (50 chars), compelling continuation of subject]

**From:** [sender name, suggested]

**Body:**

```
[Full email body in Czech, conversational tone, max 150 words]

[CTA: Link or instruction to next step]
```

**Notes:**
- Send Day: [Day recommendation: Tue-Thu]
- Send Time: [Time recommendation: 9-11 AM]
- Expected Open Rate: [Estimate: X%]
- Expected Reply Rate: [Estimate: X%]

---

### Email 2: [Subject Line for follow-up]

[Same structure as Email 1]

---

### Email 3: [Subject Line for final follow-up]

[Same structure as Email 1]

---

## Email Sequence 2: [Alternative approach]

[Three emails following same pattern, different angle]

---

## Email Sequence 3: [Third approach]

[Three emails following same pattern, third angle]

---

## Deployment Guide

1. **List Building:** [Where to find emails for this ICP]
2. **Warm-up:** [Recommendation for email warm-up period]
3. **Schedule:** [Recommended send schedule: days between emails]
4. **Tracking:** [What to measure: open, click, reply rates]
5. **Response Handling:** [How to handle replies: forward to sales, auto-response, etc.]

---

## Performance Benchmarks

- **Open Rate Target:** [X%]
- **Click Rate Target:** [X%]
- **Reply Rate Target:** [X%]
- **Calendar Booking Rate:** [X%]

---
```

### Template: implementation-checklist.md

```markdown
# Implementation Checklist: [Company Legal Name]

**Generated:** [ISO date]
**For:** [Onboarding Lead ID]
**Prepared By:** [GPT-5.4]
**Project Manager:** [Name]

---

## Project Overview

- **Company:** [Company Name]
- **Project Start:** [Date]
- **Expected Completion:** [Date]
- **Total Tasks:** [Number]
- **Estimated Hours:** [Hours]

---

## Phase 1: Planning & Setup [Weeks 1-2]

- [ ] Onboarding call with client (30 min)
- [ ] Collect missing assets (logo, images, testimonials)
- [ ] Review brand guidelines and pricing list
- [ ] Confirm target keywords and ICP
- [ ] Set up project management tool (Asana/Monday)
- [ ] Create shared document for feedback
- [ ] Confirm deployment timeline

**Status:** [ ] On Track [ ] At Risk [ ] Blocked

---

## Phase 2: Content Generation [Weeks 2-4]

- [ ] Generate icp-definition.md (Claude Opus)
- [ ] Generate lead-magnet-ideas.md (GPT-5.4)
- [ ] Generate vsl-script.md (Claude Opus)
- [ ] Generate email-campaigns.md (Claude Opus)
- [ ] Client review of AI-generated content (48 hours)
- [ ] Incorporate client feedback and revisions
- [ ] Finalize all content documents

**Status:** [ ] On Track [ ] At Risk [ ] Blocked

---

## Phase 3: Website Build [Weeks 4-6]

- [ ] Create site.json with all form fields mapped
- [ ] Generate Astro component scaffold
- [ ] Inject content from site.json
- [ ] Design and implement buildConfig colors (coordinate with designer)
- [ ] Add testimonials (client-provided or AI placeholder)
- [ ] Set up blog automation (if enabled)
- [ ] Configure lead magnet form and email
- [ ] Test all forms and CTAs

**Status:** [ ] On Track [ ] At Risk [ ] Blocked

---

## Phase 4: SEO & Performance [Weeks 6-7]

- [ ] Generate meta descriptions for all pages
- [ ] Set up schema markup (Organization, Product, FAQ)
- [ ] Configure Open Graph tags for social sharing
- [ ] Optimize images (compression, lazy loading)
- [ ] Set up Netlify analytics
- [ ] Test Core Web Vitals (Lighthouse)
- [ ] Verify mobile responsiveness
- [ ] Configure robots.txt and sitemap

**Status:** [ ] On Track [ ] At Risk [ ] Blocked

---

## Phase 5: Launch Prep [Week 7]

- [ ] Final content review with client
- [ ] QA testing on staging deployment
- [ ] Fix any bugs found during QA
- [ ] Set up DNS and domain configuration
- [ ] Final backup of all client assets
- [ ] Deployment checklist verification
- [ ] Client sign-off on final version

**Status:** [ ] On Track [ ] At Risk [ ] Blocked

---

## Phase 6: Deployment & Launch [Week 8]

- [ ] Deploy to Netlify production
- [ ] Verify all pages load correctly
- [ ] Test forms submit successfully
- [ ] Verify email notifications working
- [ ] Set up Google Analytics tracking
- [ ] Submit sitemap to Google Search Console
- [ ] Create Bing Webmaster Tools account
- [ ] Post-launch monitoring (24 hours)

**Status:** [ ] On Track [ ] At Risk [ ] Blocked

---

## Phase 7: Post-Launch [Ongoing]

- [ ] Weekly monitoring for errors
- [ ] Monthly performance review
- [ ] Quarterly content updates
- [ ] Lead follow-up automation setup
- [ ] Blog post publishing schedule (if enabled)
- [ ] Client support for questions/updates

**Status:** [ ] On Track [ ] At Risk [ ] Blocked

---

## Risk Log

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Client delays asset delivery | High | High | Weekly reminders, offer to generate placeholders |
| AI content requires heavy revisions | Medium | Medium | Multiple rounds built into timeline |
| Design colors not provided | High | Medium | Use logo extraction tool or Tailwind defaults |
| Lead magnet PDF production | Medium | Low | Offer design template or defer |

---

## Dependencies

- [ ] All OnboardingLead form fields completed
- [ ] ARES API lookup successful
- [ ] AI content generation completed (5 files)
- [ ] Client approval of AI content
- [ ] Brand colors or logo provided
- [ ] Domain DNS configured

---

## Sign-Off

**Client Approval:** _________________ Date: _______

**Project Manager:** _________________ Date: _______

**Technical Lead:** _________________ Date: _______

---
```

---

## Appendix C: Error Handling & Edge Cases

Guidance for handling missing or incomplete data.

### Missing Required Fields

| Form Field | Required For | Fallback | Action |
|---|---|---|---|
| companyName | company.name, all hero copy | "New Company" | Request immediately, delay generation |
| ico | ARES lookup, company.ico | Skip ARES, use form data only | Request, continue with limited data |
| contactPersonEmail | contact notifications, company.email | No fallback | Request immediately, cannot proceed |
| bestsellingProduct | hero headline, services copy | Use service description or generic | Request, use placeholder |
| targetCustomerICP | hero subheadline, problem cards | Use sectorKeywords generically | Request, use placeholder |
| sectorKeywords | services tags, meta keywords, FAQ generation | Empty array | Request, use generic tech keywords |
| selectedPackage | pricing tiers, fees | Default to "growth" | Request, confirm with client |

### Missing Optional Fields

| Form Field | Fallback | Impact |
|---|---|---|
| logo | Initials-based logo generator | Medium impact: generic appearance |
| brandingGuidelines | Tailwind default colors (slate/blue) | Medium impact: generic look |
| currentClientCount | Zero | Low impact: no trust indicator for client count |
| leadMagnetContent | Use AI-generated from lead-magnet-ideas.md | Low impact: good quality fallback |
| vslLink | No video in hero; use script copy instead | Medium impact: lower engagement |
| testimonials | AI-generated placeholder testimonials | Medium impact: lower social proof |
| images | Placeholder image library | Low-medium impact: less polished |

### API Failures

| Scenario | Fallback | Impact |
|---|---|---|
| ARES API timeout | Use ICO as company identifier only, skip enrichment | Low: manual entry can fix later |
| AI content generation fails | Use template placeholders with [NEEDS COPY] markers | Medium: content needed manually |
| File upload fails (logo, images) | Accept retry, offer base64 encoding | Low: can re-upload |
| Email service error | Queue for retry, notify via dashboard | Low: retry automatic |

### Completeness Thresholds

```
MVP Deployable: 70% complete
  - All direct mappings present
  - AI content generated and basic extraction done
  - Template defaults applied
  - Ready for client review

Client Ready: 85% complete
  - All direct + AI mappings complete
  - Brand colors provided (or approved defaults)
  - Key testimonials added
  - Ready for QA testing

Production Ready: 92%+ complete
  - All pending items addressed
  - Full review completed
  - All forms tested
  - SEO optimized
  - Ready to deploy
```

---

## Appendix D: Field Validation Rules

Validation rules for OnboardingLead form fields to ensure data quality.

| Field | Type | Validation | Error Message |
|---|---|---|---|
| companyName | string | 3-100 chars | "Jméno firmy musí mít 3-100 znaků" |
| city | string | 2-50 chars | "Město musí mít 2-50 znaků" |
| website | URL | Valid HTTPS URL | "Zadejte platný URL s https://" |
| ico | string | Exactly 8 digits | "IČO musí mít přesně 8 číslic" |
| numSalespeople | number | 1-1000 | "Počet prodejců musí být 1-1000" |
| monthlySalaryPerSalesman | number | 10000-500000 CZK | "Plat musí být reálný (10k-500k CZK)" |
| currentClientCount | number | 0-100000 | "Počet klientů musí být 0-100000" |
| avgServicePrice | number | 1000-10000000 CZK | "Cena služby musí být 1k-10M CZK" |
| bestsellingProduct | string | 50+ words | "Popis produktu musí mít min. 50 slov" |
| targetCustomerICP | string | 30+ words | "ICP popis musí mít min. 30 slov" |
| sectorKeywords | array | 1-3 items, 3-20 chars each | "1-3 klíčová slova, 3-20 znaků" |
| websitePages | number | 1-50 (if wantWebsite=true) | "Počet stran musí být 1-50" |
| vslLink | URL | Valid YouTube URL or empty | "Zadejte platný YouTube URL" |
| contactPersonEmail | email | Valid email format | "Zadejte platný email" |
| dailyVolume | string | Enum: low/medium/high/very-high | "Vyberte platný objem" |
| channels | array | At least 1: email/phone/form/sms | "Vyberte alespoň jeden kanál" |
| niches | array | 1-5 items | "Vyberte 1-5 nišoví" |

---

## End of Field Mapping Reference

**Total Mappings:** 127 site.json keys
**Form Fields Covered:** 58 OnboardingLead fields
**AI Content Files:** 5 sources
**Pending Items:** 16 requiring manual input
**Completeness Target:** 92%+ (after manual input)

**Last Updated:** 2026-03-11
**Version:** 1.0
**Status:** Complete and ready for site-builder skill integration
