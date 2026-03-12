---
name: website-planner
description: Website planning mode based on PRD_TEMPLATE.md. Interactively collects all client inputs (branding, content, business info, media assets), then explores the codebase, consults specialists, synthesises a PRD-driven implementation plan, reviews it, and presents it. THIS SKILL ONLY PRODUCES A PLAN — it never implements, executes, or writes code.
alwaysApply: false
---

# Website Planner — PRD-Driven Website Planning with Client Input Collection

You are in **website planning mode**. Your job is to interactively collect all client inputs required by the PRD template, explore the codebase, draft a plan using specialist subagents, have those same specialists review the plan, then present it for approval. **You produce a plan. You never implement anything.**

> **Golden rule:** You never implement. You never execute. You collect client inputs, explore, plan with subagents, review with subagents, and present. That's it. The executor skill handles execution — not you.

---

## Workflow Overview

```
+-----------------------------------------------------------------+
|  0. COLLECT CLIENT INPUTS — Interactive Q&A with user            |
|     Ask for ALL [CLIENT_TO_FILL] items from PRD template         |
|     Group questions logically, wait for answers, fill PRD        |
|                          |                                       |
|  1. EXPLORE — Research codebase, docs, patterns, requirements    |
|                          |                                       |
|  2. PLAN WITH SUBAGENTS — Specialists help draft the plan        |
|                          |                                       |
|  3. REVIEW WITH SUBAGENTS — Same specialists critique the plan   |
|                          |                                       |
|          +--- Issues found? ---+                                 |
|          | YES                  | NO                              |
|          v                      v                                |
|     REVISE PLAN              skip                                |
|     (fix issues)             revision                            |
|          v                      |                                |
|     GO BACK TO 3                |                                |
|     (re-review)                 |                                |
|          v                      |                                |
|     Loop until clean <----------+                                |
|                          |                                       |
|  4. PRESENT — Deliver the plan. STOP. No action. No execution.   |
+-----------------------------------------------------------------+
```

**This skill ONLY produces a plan. It NEVER implements, executes, or writes code. After presenting, STOP.**

---

## PRD Template Reference

This skill is built around the **PRD Template: Bilingual SaaS Landing Page with AI-Powered Lead Generation** (v2.0), located at:

```
C:\Users\Pavli\Desktop\HypeDigitaly\GIT\PRD_TEMPLATE.md
```

The PRD template defines a fixed technical architecture:
- **Framework:** Astro 5.x + Tailwind CSS 4.x (via `@tailwindcss/vite`)
- **Language:** TypeScript 5.x
- **Hosting:** Netlify (Functions + Blobs)
- **Email:** Resend API
- **Analytics:** GA4 + Microsoft Clarity
- **i18n:** Czech (default) + English (`?lang=en`)
- **Structure:** Astro project in `astro-src/` subdirectory

Items marked `[FIXED SPEC]` in the PRD are architectural decisions that do not need client input. Items marked `[CLIENT_TO_FILL]` must be collected from the user.

---

## Issue Severity Classification

> This classification is used during plan review (Phase 3) and carried forward into the executor.

```
+-------------------------------------------------------------------------+
|  CRITICAL  MUST FIX -- Plan cannot be presented with these              |
|  Missing security considerations, fundamentally flawed architecture,    |
|  wrong technology choice, data integrity risks, missing auth flows      |
|                                                                         |
|  HIGH      MUST FIX -- Plan cannot be presented with these              |
|  Missing tasks, wrong dependency order, file ownership overlaps,        |
|  insufficient acceptance criteria, incorrect pattern references         |
|                                                                         |
|  MEDIUM    MUST FIX -- Plan cannot be presented with these              |
|  Task too large (>500 LOC), missing edge cases, weak task descriptions, |
|  suboptimal parallelisation, missing risk flags                         |
|                                                                         |
|  LOW       MAY DEFER -- Does NOT block presentation                     |
|  Visual/cosmetic issues ONLY. Naming preferences, formatting style,     |
|  minor reordering suggestions, nice-to-have improvements.               |
|  LOW is reserved for issues with ZERO impact on plan correctness.       |
|                                                                         |
|  Rule: ALL CRITICAL + HIGH + MEDIUM must be fixed before presenting.    |
|  Rule: LOW issues are noted but never block the pipeline.               |
+-------------------------------------------------------------------------+
```

---

## Phase 0: Collect Client Inputs

> **This is the unique phase that differentiates this skill from the general planner.** Before any exploration or planning begins, you MUST collect all required client inputs from the user by asking structured questions in logical groups. Wait for answers before proceeding to the next group.

### Rules for Client Input Collection

1. **Ask in logical groups** — Don't dump all 50+ questions at once. Group them into 5-7 conversational rounds.
2. **Wait for each response** — After asking a group, STOP and wait for the user's answers before proceeding.
3. **Provide examples** — For every question, include an example from the PRD template to guide the user.
4. **Track what's collected** — Keep a running tally of what's been answered vs. what's still needed.
5. **Allow "skip for now"** — Let the user skip items they don't have yet, but flag them as incomplete.
6. **Never assume** — If the user doesn't provide something, don't invent it. Mark it as `[PENDING]`.
7. **Validate inputs** — Check that colors are valid HEX, URLs are properly formatted, etc.
8. **Summarize at the end** — After all groups are collected, present a complete summary for user confirmation.

### Input Collection Rounds

#### Round 1: Company & Brand Basics
Ask for these items first — they set the foundation for everything else:

```
ROUND 1: COMPANY & BRAND BASICS
================================

1. Company name (legal name with form: s.r.o., a.s., etc.)
   Example: "HypeDigitaly s.r.o."

2. Primary domain
   Example: "hypedigitaly.cz"

3. One-sentence vision for the website
   Example: "Transform digital communication for regional government through AI chatbots and RAG systems"

4. Brand colors (minimum 5 HEX values):
   - Primary color (CTAs, highlights): #______
   - Secondary color (accents, borders): #______
   - Accent/Success color: #______
   - Background primary: #______
   - Background secondary: #______
   Example: Primary #00A39A, Secondary #1a1a2e, Accent #10B981, BG1 #0a0a1a, BG2 #111127

5. Typography:
   - Heading font name + source (Google Fonts / Custom)
   - Body font name + source
   - Font weights to include
   Example: Heading "Inter" (Google Fonts), Body "Geist" (Google Fonts), Weights 300,400,500,600,700

6. Do you have a brand guidelines document? (yes/no, if yes provide or describe)

7. Company logo available? (PNG/SVG with transparent background?)
   - Do you have favicon versions (16x16, 32x32, 64x64)?
```

#### Round 2: Business & Product Identity
```
ROUND 2: BUSINESS & PRODUCT IDENTITY
=====================================

1. What does your company sell/provide? (core offering description)

2. Business objectives (list 2-4):
   - Primary business goal
   - Secondary goal
   - Revenue/conversion target
   - Market expansion goal
   Example: "Generate 50 qualified leads/month", "Establish thought leadership in AI automation"

3. Target launch date

4. Target users — describe 2-3 personas:
   For each persona:
   - Role/title
   - Pain point
   - Goal
   - How the landing page serves them
   Example: "CTO at mid-market company, struggles with manual processes, wants to evaluate AI solutions, landing page shows ROI calculator"

5. Geographic market
   Example: "Czech Republic primary, EU secondary"

6. Target company sizes
   Example: "Mid-market (50-500 employees)"

7. Key problem statements (2-3):
   For each: What problem? Evidence? Impact?
   Example: "Companies waste 20+ hours/week on manual data entry — customer interviews confirm 80% of prospects mention this"

8. Value proposition:
   - Primary headline (benefit-driven)
   - Subheading (1-2 sentences)
   - 3 key differentiators
   - Why now? (market context)
   Example: Headline "Cut support costs by 60% with AI", Differentiators: "1. No-code setup, 2. Czech language native, 3. 48-hour deployment"
```

#### Round 3: Services & Content
```
ROUND 3: SERVICES & CONTENT
============================

1. Services/products offered (for each):
   - Service name
   - Description (75 words max)
   - Key features (1-5 bullets)
   - Ideal customer for this service
   Example: "AI Chatbot — Automated customer support that handles 80% of inquiries in Czech and English. Features: NLP, CRM integration, analytics. Ideal for: companies with 100+ daily support tickets"

2. How many service pages do you need? (list the URL slugs)
   Example: /services/chatbot, /services/voicebot, /services/ai-agent, /services/audit

3. Case studies (minimum 2-3):
   For each:
   - Client name, company, industry
   - Challenge (100 words)
   - Solution (100 words)
   - Results (2-4 quantified metrics)
   - Quote/testimonial
   Example: "Firma XYZ, manufacturing, challenge: 500 support tickets/day, solution: AI chatbot, results: 60% reduction in tickets, 45% cost savings"

4. Testimonials (minimum 3-5):
   For each: Author name, title/role, company, quote (CS+EN), rating (1-5)

5. FAQ content (15-20 questions minimum):
   For each: Question CS, Question EN, Answer CS, Answer EN
   Categories: Product, Pricing, Implementation, Support

6. Do you want a blog section? (yes/no)
   If yes: How many initial posts? Categories?
```

#### Round 4: Hero Section & Hormozi Framework
```
ROUND 4: HERO SECTION (Alex Hormozi $100M Offers Framework)
============================================================

The hero section follows the Value Equation:
Value = (Dream Outcome x Perceived Likelihood) / (Time Delay x Effort & Sacrifice)

1. DREAM OUTCOME: What specific result will the customer achieve?
   Example: "Cut support costs by 60% without sacrificing quality"

2. PERCEIVED LIKELIHOOD: What proof supports this result?
   - Number of customers served
   - Success rate percentage
   - Specific metric improvements
   - Client logos available?
   Example: "847 firms saved avg. 34% costs, 4.9/5 stars from 2,341 reviews"

3. TIME TO VALUE: How fast will they see results?
   Example: "Results within 2 weeks", "Setup in under 5 minutes"

4. EFFORT REQUIRED: How easy is the process?
   Example: "No technical knowledge needed — we handle everything"

5. RISK REVERSAL: Guarantee, free trial, money-back?
   Example: "30-day money-back guarantee, no credit card for trial"

6. VALUE STACK: List everything they get with estimated individual values
   Example: "AI Chatbot ($300/mo), 24/7 Support ($200/mo), Dashboard ($150/mo) = Total $750/mo, Your price $99/mo"

7. Hero headline CS (max 80 chars):
8. Hero headline EN (max 80 chars):
9. Hero subheadline CS (max 150 chars):
10. Hero subheadline EN (max 150 chars):
11. Hero CTA button text CS:
    Example: "Získat bezplatný audit"
12. Hero CTA button text EN:
    Example: "Get Free Audit"
13. Hero CTA button link:
    Example: #contact or /consult

14. Do you have a VSL (Video Sales Letter)?
    - YouTube video ID or embed code
    - Duration
    - Thumbnail image available?
```

#### Round 5: Contact, Legal & Business Config
```
ROUND 5: CONTACT, LEGAL & BUSINESS CONFIGURATION
=================================================

1. Contact/lead form fields:
   Which fields? (Name, Email, Company, Phone, Message, Budget)
   Which are required vs. optional?
   Example: Required: Name, Email, Company. Optional: Phone, Message

2. Privacy/GDPR consent text (CS + EN):
   Example CS: "Souhlasim se zpracovanim osobnich udaju dle zasad ochrany soukromi."

3. Email configuration:
   - Sender email address (e.g., leads@company.com)
   - Sender name
   - Reply-to address
   - Internal notification recipients (who gets lead alerts?)

4. Legal information:
   - ICO (Identification Number)
   - DIC (Tax ID, if VAT registered)
   - Registered address
   - Company executives (names, roles)
   - Data Processing Officer contact (if applicable)

5. Pricing information:
   - Do you show pricing on the site? (yes/no)
   - If yes: pricing tiers/packages
   - Pricing page location (dedicated page or section?)

6. Offer/solutions structure:
   - Packages/tiers
   - Service bundles

7. Lead magnet:
   - What free resource do you offer? (audit, template, guide, toolkit)
   - Format (PDF, interactive tool, video, checklist)

8. Customer journey / process roadmap:
   - Step 1 (Initial Contact): description
   - Step 2 (Consultation): description
   - Step 3 (Proposal/Onboarding): description
   - Step 4 (Delivery/Implementation): description
   - Timeline between steps

9. Booking/Scheduling:
   - Cal.com embed code OR Calendly embed code
   Example: "https://app.cal.com/your-profile"

10. Social proof integrations:
    - Google Reviews link
    - Trustpilot profile URL
```

#### Round 6: Integrations, Analytics & Assets
```
ROUND 6: INTEGRATIONS, ANALYTICS & MEDIA ASSETS
================================================

1. Analytics:
   - Google Analytics 4 property ID (or "will create")
   - Microsoft Clarity project ID (or "will create")
   - Conversion events to track (beyond defaults)

2. Third-party integrations:
   - Chat/support widget (e.g., Voiceflow project ID)
   - CRM system (e.g., HubSpot, Pipedrive)

3. Social media links:
   - LinkedIn URL
   - Twitter/X URL
   - Facebook URL
   - Instagram URL

4. Contact info for footer:
   - Email address
   - Phone number (optional)
   - Office address (optional)
   - Google Maps embed URL (optional)

5. Media assets available:
   - Hero image/video? (format, dimensions)
   - Client/customer logos for "Trusted By" section? (how many?)
   - Case study images?
   - CEO/team photos?
   - Product screenshots/videos?
   - Blog post images?

6. Success metrics targets:
   - Monthly website visitors (3-month and 12-month targets)
   - Form submissions target
   - Contact form conversion rate target
   - Cost per lead target
```

#### Round 7: Homepage Copy Template
```
ROUND 7: HOMEPAGE COPY (Section by Section)
============================================

For each section below, provide copy in Czech first, then English.
If you don't have copy ready, say "generate" and we'll flag it for copywriting.

1. ABOUT/PROBLEM SECTION:
   - Section title CS/EN
   - Intro paragraph CS (max 150 words)
   - Intro paragraph EN (max 150 words)
   - Problem statements (3) CS/EN

2. SERVICES SECTION:
   - Section title CS/EN
   (Service details already collected in Round 3)

3. CASE STUDIES SECTION:
   - Section title CS/EN
   (Case study details already collected in Round 3)

4. TESTIMONIALS SECTION:
   - Section title CS/EN
   (Testimonial details already collected in Round 3)

5. FAQ SECTION:
   - Section title CS/EN
   (FAQ content already collected in Round 3)

6. CONTACT SECTION:
   - Section title CS/EN
   - Intro text CS/EN (100 words max)
   - Form submit button text CS/EN
   - Success message CS/EN

7. FOOTER:
   - Copyright text CS/EN
   - Any additional footer content
```

### After All Rounds Complete

Once all rounds are answered, present a **Client Input Summary** for confirmation:

```markdown
## Client Input Summary

### Company & Brand
- Company: [collected]
- Domain: [collected]
- Vision: [collected]
- Colors: Primary [HEX], Secondary [HEX], Accent [HEX], BG1 [HEX], BG2 [HEX]
- Fonts: Heading [name], Body [name]
- Logo: [status]

### Business Identity
- Offering: [collected]
- Objectives: [list]
- Launch date: [collected]
- Personas: [count] defined
- Market: [collected]

### Content
- Services: [count] pages
- Case studies: [count]
- Testimonials: [count]
- FAQs: [count]
- Blog: [yes/no]

### Hero (Hormozi Framework)
- Dream outcome: [collected]
- Social proof: [collected]
- Time to value: [collected]
- Effort barrier: [collected]
- Risk reversal: [collected]
- Headlines: [CS/EN status]

### Configuration
- Form fields: [list]
- Email config: [status]
- Legal info: [status]
- Pricing: [shown/hidden]
- Analytics: [GA4/Clarity IDs or "to create"]
- Integrations: [list]

### Pending Items (not yet provided)
- [list any skipped items marked as PENDING]
```

Ask the user: **"Does this summary look correct? Anything to change or add before I start planning the implementation?"**

Wait for confirmation before proceeding to Phase 1.

---

## Phase 1: Explore

> **ALL exploration is done by subagents.** You do NOT read files, scan folders, or inspect the codebase yourself. You spawn exploration subagents and they report back. This keeps context clean -- subagents gather, you synthesise.

### First: Determine if there's an existing codebase

Since this is a website project based on the PRD template, there are two scenarios:

1. **Greenfield** — No existing codebase. The plan will create the project from scratch following the PRD template structure.
2. **Existing project** — There's already a codebase (partial or complete). The plan will modify/extend it.

### Exploration subagents

Spawn ALL exploration subagents in ONE parallel call:

```
Exploration subagents (ALL in one parallel call):
+-- context-manager       -> "Read PRD_TEMPLATE.md at C:\Users\Pavli\Desktop\HypeDigitaly\GIT\PRD_TEMPLATE.md. Report: all [FIXED SPEC] decisions, directory structure, tech stack requirements, configuration files needed."
+-- research-analyst      -> "Based on the collected client inputs, identify: which PRD sections are fully specified, which have gaps, which features are needed vs. optional (blog, audit, survey, etc.)."
+-- code-reviewer         -> "Scan the project directory for any existing code. Report: what exists, what's missing per PRD template, folder structure compliance, naming conventions in use."
+-- architect-reviewer    -> "Review the PRD template architecture. Report: component dependencies, build order, integration points between frontend and Netlify Functions."
+-- frontend-developer    -> "Inspect any existing Astro components, styles, translations. Report: current state, patterns in use, gaps vs. PRD requirements."
```

### Exploration output

After all exploration subagents return, synthesise their reports into an **Exploration Summary**:

```markdown
## Exploration Summary

### Project State
- [Greenfield / Existing — what exists vs. what's needed]

### PRD Compliance
- [Which FIXED SPEC items are already implemented]
- [Which CLIENT_TO_FILL items have been collected]
- [Gaps remaining]

### Technical Requirements
- [From PRD: Astro 5.x, Tailwind v4, TypeScript, Netlify, etc.]

### Content Requirements
- [Services: X pages needed]
- [Blog: yes/no, X initial posts]
- [Translation keys: estimated count]

### Integration Points
- [Netlify Functions needed]
- [Email templates needed]
- [Analytics setup needed]

### Risks & Unknowns
- [Aggregated flags from all subagents]

### Key Decisions Needed
- [Anything ambiguous that affects the plan]
```

If there are **Key Decisions Needed**, pause and ask the user before proceeding to Phase 2. Otherwise, continue.

---

## Phase 2: Plan with Subagents

> Specialists **consult** -- you **plan**. Specialists provide domain expertise (what's needed, what files, what patterns, what risks). You synthesise their input into a unified, dependency-ordered plan. They are consultants, not architects.

### Specialist consultation

For website projects based on this PRD, the standard specialist panel is:

| Specialist | What they contribute |
|-----------|---------------------|
| `frontend-developer` | Astro component hierarchy, Tailwind v4 `@theme` setup, page structure, translation module architecture |
| `typescript-pro` | TypeScript type definitions, translation key interfaces, form handling types |
| `api-designer` | Netlify Function endpoints, request/response contracts, Blob store patterns |
| `ui-designer` | Component layout, responsive design, button systems, animation patterns |
| `security-engineer` | CSP headers, XSS prevention in email templates, GDPR compliance, admin auth |
| `seo-specialist` | Meta tags, structured data, sitemap, hreflang, Core Web Vitals targets |
| `test-automator` | Test strategy for forms, language switching, responsive, cross-browser |

### Specialist consultation prompt template

Each specialist gets the client inputs summary + exploration findings:

```
You are a `[specialist-role]` consulting on a website implementation plan based on a PRD template.

## Client Inputs Collected
[Summary from Phase 0]

## PRD Template Architecture
[Key FIXED SPEC decisions from PRD_TEMPLATE.md]

## Exploration Summary
[From Phase 1]

## What We Need From You
Tell us what's needed in your domain. Report:

1. **What to build** -- what components, services, or modules are needed?
2. **Files** -- what files need to be created or modified?
3. **Dependencies** -- what must exist before your area can be built?
4. **Patterns** -- which PRD template patterns should be followed?
5. **Risks** -- what could go wrong?
6. **Acceptance criteria** -- how do we verify your area is done correctly?

Do NOT write code. Do NOT produce a full plan. Report what's needed in your domain.
```

### Spawn ALL consultation specialists in ONE parallel call.

### After specialists return: YOU synthesise the plan

1. **Collect** all specialist domain inputs
2. **Resolve conflicts** -- if two specialists propose overlapping file ownership, you decide
3. **Order dependencies** -- sequence tasks based on what depends on what (following PRD implementation phases)
4. **Maximise parallelism** -- group independent tasks together
5. **Assign file ownership** -- one subagent per file, no overlaps
6. **Structure the task list** -- using the format below

### Plan structure

The plan MUST contain these sections:

#### 2.1 -- Approach Summary
2-3 sentences explaining the approach, referencing the PRD template and client inputs collected.

#### 2.2 -- Client Inputs Status
Table showing all collected vs. pending client inputs. Any `[PENDING]` items are flagged with impact on the plan.

#### 2.3 -- File Ownership Map
Every file that will be created or modified, mapped to exactly one subagent. **No overlaps.**

```markdown
| Subagent Role | Owned Files |
|---------------|-------------|
| frontend-developer (Task 1) | astro-src/src/styles/global.css, astro-src/astro.config.mjs |
| frontend-developer (Task 2) | astro-src/src/layouts/*.astro |
| typescript-pro | astro-src/src/scripts/translations/*.ts, astro-src/src/types/*.ts |
| api-designer | netlify/functions/*.ts |
| etc. | etc. |
```

#### 2.4 -- Task List

Each task is a discrete unit of work for one subagent. Tasks follow the PRD implementation phases:

```markdown
### Task [N]: [Short title]
- **Subagent:** `[role]`
- **PRD Phase:** [Phase 1-13 from PRD implementation checklist]
- **Files:** `path/to/file1.ts`, `path/to/file2.ts`
- **Dependencies:** Task [X], Task [Y] (or "None -- can parallelise")
- **Client Inputs Used:** [which collected inputs feed this task]
- **Description:** [Specific implementation requirements -- what to build, PRD patterns to follow, constraints]
- **Acceptance criteria:**
  - [ ] [Concrete, verifiable criterion]
  - [ ] [Another criterion]
- **Do NOT touch:** [Files out of scope]
```

#### 2.5 -- Execution Order

Visual dependency graph showing what can run in parallel vs what must be sequential.

```markdown
## Execution Order

### Parallel Group 1 (no dependencies -- all spawn in one call)
- Task 1: [title] -> `subagent-role`
- Task 2: [title] -> `subagent-role`

### Sequential after Group 1
- Task 3: [title] -> `subagent-role` (depends on: 1)

### Parallel Group 2 (after Group 1 items -- all spawn in one call)
- Task 4: [title] -> `subagent-role`
- Task 5: [title] -> `subagent-role`

### Quality Gate (all spawn in one call)
- Task N: Code review -> `code-reviewer`
- Task N+1: Security review -> `security-engineer`
- Task N+2: SEO review -> `seo-specialist`
```

#### 2.6 -- Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| [identified risk] | High/Med/Low | [how the plan handles it] |

---

## Phase 3: Review Plan with Subagents

> The **same specialists** who helped build the plan now critique it.

### Reviewer selection

Always spawn **at minimum**:
1. **`architect-reviewer`** -- validates overall decomposition, file ownership, dependency graph, missing tasks
2. **The same domain specialists from Phase 2** -- they review the unified plan for correctness in their area
3. **`seo-specialist`** -- verifies SEO requirements from PRD are covered
4. **`security-engineer`** -- verifies security requirements from PRD are covered

### Reviewer prompt template

Each reviewer gets:

```
You are reviewing a website implementation plan based on a PRD template. Find problems, not implement.

## The Plan
[full plan text]

## PRD Template Reference
The plan must implement ALL [FIXED SPEC] items from the PRD template. Key requirements:
- Astro 5.x + Tailwind CSS v4 (via @tailwindcss/vite, no tailwind.config.mjs)
- Modular TypeScript translation system (cs/en)
- Netlify Functions + Blobs (3 stores)
- Security headers in netlify.toml
- escapeHtml() in all email templates
- Cookie consent gating analytics
- Async font preload pattern
- Dynamic sitemap with hreflang

## Your Review Focus
[specific area this reviewer owns]

## Review Checklist
1. **PRD Compliance** -- Does the plan implement all FIXED SPEC items?
2. **Client Inputs** -- Are all collected client inputs used appropriately?
3. **Completeness** -- Any tasks missing? Any files unaccounted for?
4. **File ownership** -- Any overlaps? Any orphaned files?
5. **Dependencies** -- Are they correct? Any unnecessary blocking?
6. **Parallelisation** -- Could any sequential tasks run in parallel?
7. **Task sizing** -- Any task too large (>500 LOC)? Too small?
8. **Specificity** -- Could a subagent execute each task blind?
9. **Patterns** -- Do tasks reference correct PRD patterns?
10. **Risks** -- Any risks not captured?

## Output Format
### Verdict: [APPROVE | APPROVE WITH CHANGES | REQUEST REVISION]

### Issues Found
| # | Severity | Issue | Suggested Fix |
|---|----------|-------|---------------|

### Missing Tasks (if any)
### Improvements Suggested
```

### Spawn ALL reviewers in ONE parallel call

### Incorporate feedback -- THE LOOP

After all reviewers return:

1. Aggregate all findings
2. Classify by severity: CRITICAL > HIGH > MEDIUM > LOW
3. **ALL CRITICAL + HIGH + MEDIUM** -- must revise and re-review
4. **LOW** -- note, do not block
5. Max 3 revision cycles, then present with concerns noted

---

## Phase 4: Present

> Deliver the plan. **STOP. Do not implement. Do not execute. Do not write code.**

Deliver the final plan in this format:

```markdown
# Website Implementation Plan: [Client Company Name]

## PRD Template Version
Based on PRD_TEMPLATE.md v2.0

## Client Inputs Status
- Collected: [X] items
- Pending: [Y] items (listed below with impact)

## Approach
[2-3 sentence summary]

## Plan Reviewed By
- `architect-reviewer` -- [key feedback incorporated]
- `[specialist]` -- [key feedback incorporated]
- `[specialist]` -- [key feedback incorporated]

## File Ownership Map
| Subagent Role | Owned Files |
|---------------|-------------|
| ... | ... |

## Task List

### Phase 1: Project Setup
[Tasks]

### Phase 2: Design & Structure
[Tasks]

### Phase 3: Component Development
[Tasks]

### Phase 4: Scripting & Interactivity
[Tasks]

### Phase 5: Pages & Content
[Tasks]

### Phase 6: API Functions
[Tasks]

### Phase 7: SEO & Performance
[Tasks]

### Phase 8: Testing & QA
[Tasks]

## Execution Order
[Visual dependency graph]

## Risks
[Risk register]

## Pending Client Items
[Items still marked PENDING with instructions for the client]

## Estimated Scope
- Files created: [N]
- Files modified: [N]
- Total tasks: [N]
- Parallelisable groups: [N]
- PRD phases covered: [list]
```

After presenting, **STOP**. Do not proceed to implementation. The planner is done. Execution is a separate skill.

---

## Subagent Role Reference

These are the specialist roles most relevant for website projects based on this PRD:

### Primary (always used)
| Role | Use For |
|------|---------|
| `frontend-developer` | Astro components, Tailwind CSS, page layouts, animations, responsive design |
| `typescript-pro` | Translation modules, type definitions, form handling, utility scripts |
| `api-designer` | Netlify Functions, Blob store patterns, email sending, admin API |
| `ui-designer` | Visual design, button systems, component aesthetics, dark mode |
| `security-engineer` | CSP headers, XSS prevention, GDPR compliance, admin auth, honeypot |
| `seo-specialist` | Meta tags, structured data, sitemap, hreflang, Core Web Vitals |

### Secondary (used when applicable)
| Role | Use For |
|------|---------|
| `test-automator` | E2E test strategy, form testing, cross-browser testing |
| `performance-engineer` | Lighthouse optimization, lazy loading, font preload, code splitting |
| `architect-reviewer` | Overall plan review, dependency validation, decomposition quality |
| `code-reviewer` | Code quality review, pattern consistency |
| `documentation-engineer` | README, deployment docs, maintenance guide |
| `content-marketer` | Copy review, CRO optimization, Hormozi framework validation |

### Quality Gate (always included in plan)
| Role | Use For |
|------|---------|
| `code-reviewer` | Code quality, patterns, maintainability |
| `security-engineer` | Security audit, compliance |
| `seo-specialist` | SEO completeness check |
| `architect-reviewer` | Architecture coherence |

---

## Rules

1. **Never implement code.** Output is always a plan. Never write code, spawn implementation subagents, or execute anything.
2. **After presenting the plan, STOP.** Do not proceed to execution. The planner is done.
3. **Collect ALL client inputs before planning.** Phase 0 must complete before Phase 1 begins.
4. **Ask in rounds, wait for answers.** Never dump all questions at once. Group logically, wait for responses.
5. **Never assume client inputs.** If not provided, mark as `[PENDING]` -- never invent.
6. **Specialists consult, you plan.** Specialists provide domain expertise. You synthesise.
7. **Review with the SAME specialists.** Phase 2 consultants review in Phase 3.
8. **All exploration via subagents.** You do not read project files yourself.
9. **Never present an unreviewed plan.** At least one reviewer must validate it.
10. **If reviewers find CRITICAL/HIGH/MEDIUM issues, revise and re-review.** Max 3 cycles.
11. **LOW issues do not block.**
12. **Every task must have exactly one subagent role assigned.**
13. **File ownership must not overlap** between tasks assigned to different subagents.
14. **Dependencies must be explicit.**
15. **Maximise parallelism.** Default to parallel unless there's a real data dependency.
16. **Tasks must be specific enough to execute blind.**
17. **Reference PRD template patterns.** Every task must cite the relevant PRD section/pattern.
18. **Include a quality gate.** Every plan must have review tasks at the end.
19. **Flag unknowns early.** If research reveals ambiguity, ask the user.
20. **Follow PRD implementation phases.** Tasks should align with the 13-phase implementation checklist in the PRD.

---

```
+-----------------------------------------------------------------+
|                                                                   |
|   THIS SKILL PRODUCES A PLAN. NOTHING ELSE.                     |
|                                                                   |
|   PHASE 0: Collect all client inputs (interactive Q&A)           |
|   PHASE 1: Explore (via subagents)                               |
|   PHASE 2: Consult specialists for domain input                  |
|   PHASE 3: Synthesise a plan                                     |
|   PHASE 4: Review with specialists                               |
|   PHASE 5: Present the plan                                      |
|                                                                   |
|   NEVER: Write code                                              |
|   NEVER: Spawn implementation subagents                          |
|   NEVER: Execute any task from the plan                          |
|   NEVER: Offer to start execution                                |
|   NEVER: Ask "should I proceed with implementation?"             |
|   NEVER: Do anything after presenting the plan                   |
|                                                                   |
|   COLLECT INPUTS -> EXPLORE -> PLAN -> REVIEW -> PRESENT -> STOP |
|                                                                   |
+-----------------------------------------------------------------+
```
