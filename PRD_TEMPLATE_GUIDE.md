# PRD Template Implementation Guide

**For:** Product Managers & Project Leads
**Purpose:** Understand the structure of PRD_TEMPLATE.md and how to customize it for different clients
**Version:** 2.0
**Date:** 2026-03-01

---

## OVERVIEW: PRD Template Structure

The template is divided into 12 sections, organized by both **who needs to fill information** and **when in the project lifecycle it's needed**.

### Quick Navigation

| Section | Purpose | When Needed | Who Fills |
|---------|---------|-------------|-----------|
| 1. Product Overview | Vision, scope, users | Kickoff | Product Manager + Client |
| 2. Client Input Checklist | What client must provide | Week 1 | Client |
| 3. Technical Architecture | How we'll build it | Week 1 | Tech Lead |
| 4. Critical Features | Feature specifications | Weeks 2-3 | Product Manager + Developers |
| 5. Analytics & Tracking | Measurement strategy | Week 4 | Product Manager + Analytics |
| 6. Content Template | Copy requirements | Weeks 1-2 | Content Writer + Client |
| 7. Implementation Checklist | Step-by-step tasks | Weeks 1-7 | Project Manager (checks off) |
| 8. Success Metrics | What "done" looks like | Kickoff | Product Manager + Client |
| 9. Environment Variables | Configuration | Week 1 | DevOps/Backend Dev |
| 10. Deployment & Hosting | Infrastructure | Week 1 | DevOps + Client |
| 11. Maintenance | Ongoing support | Post-launch | Support Team |
| 12. Team Roles | Who does what | Kickoff | Product Manager |

---

## TEMPLATE DESIGN PATTERNS

### Pattern 1: "CLIENT_TO_FILL" Markers

Throughout the document, you'll see `[CLIENT_TO_FILL]` placeholders. These mark information that **MUST come from the client**.

**How to use:**
1. Share PRD with client in Google Docs or via email
2. Clients search for `[CLIENT_TO_FILL]` and fill in their information
3. Or, you conduct an interview/workshop and fill in their answers

**Example of a completed section:**

```
[BEFORE]
Business objectives:
- [ ] Primary business goal [CLIENT_TO_FILL]
- [ ] Secondary goal [CLIENT_TO_FILL]

[AFTER - filled by client]
Business objectives:
- [ ] Primary business goal: Generate 50 qualified leads per month
- [ ] Secondary goal: Increase brand awareness in Czech market
```

### Pattern 2: "Fixed Specification" vs. "Customizable"

Some sections are **fixed** (the same for all projects) and some are **customizable** (vary by client).

**Fixed Sections (copy as-is, no changes):**
- Section 3: Technical Architecture (always Astro + Tailwind CSS 4 via `@tailwindcss/vite` + Netlify; no `tailwind.config.mjs`)
- Section 9: Environment Variables (standard set of vars)
- Deployment & Hosting (standard Netlify setup with `astro-src/` as `base` in `netlify.toml`)

**Customizable Sections (modify per project):**
- Section 1: Product Overview (different vision per client)
- Section 2: Client Input Checklist (some clients need PayPal, others don't)
- Section 4: Critical Features (feature set varies)
- Section 7: Implementation Checklist (prioritize based on scope)
- Section 8: Success Metrics (different goals per industry)

### Pattern 3: Progressive Detail

The template increases in detail as you move through sections:
- Sections 1-2: High-level overview
- Sections 3-6: Detailed specifications
- Sections 7-12: Operational/implementation details

This allows you to:
1. Start with client conversations using Sections 1-2
2. Hand off to development team with Sections 3-6
3. Use Sections 7-12 as working checklists during execution

---

## CUSTOMIZATION GUIDE

### For Different Project Scopes

#### Scope A: Standard Landing Page (as described)

**Use sections:** 1-7, 8-12
**Estimated timeline:** 6-8 weeks
**Team size:** 3-4 people

**Customizations:**
- All sections apply as-is
- Minimal scope changes needed
- Blog system is included by default (bilingual `blog-posts.json`, `BlogCard.astro`, `BlogCategoryFilter.astro`, `blog.ts` translations)

#### Scope B: Landing Page + Extended Blog

**Use sections:** 1-12 PLUS extend blog with:
```markdown
### 4.X Extended Blog System
- Pagination for large post archives
- Author pages
- Tag taxonomy (in addition to categories)
- RSS feed
- Search functionality
```

**Additional phases:**
- Phase 13A: Extended blog features
- Phase 13B: Advanced SEO for blog (structured data per post)
- Implementation checklist: Add editorial workflow tasks

#### Scope C: Landing Page + CMS (Headless)

**Use sections:** 1-12 PLUS:
```markdown
### 3.X CMS Integration (new subsection)
- Strapi / Contentful / Sanity CMS
- Astro integration for dynamic content
- Content sync workflow
```

**Warning:** This significantly increases scope. Recommend separate PRD.

#### Scope D: Landing Page with Booking System

**Use sections:** 1-12 PLUS:
```markdown
### 4.X Booking/Scheduling System
- Integration with Cal.com or Calendly (easier)
- Or: Custom booking database + confirmation emails
```

**Cal.com/Calendly approach:** Minimal implementation (embed widget)
**Custom approach:** Requires Phase 13 (database design, scheduling logic)

---

## FILL-IN CHECKLIST: How to Use This Template

### Pre-Project (Week 1)

**Step 1: Kickoff Meeting with Client**

Use Sections 1-2 to guide conversation:
- [ ] Product vision: What problem are we solving?
- [ ] Target users: Who are we building for?
- [ ] Business goals: What's success?
- [ ] Timeline: When do we need this live?
- [ ] Budget: What's available?

**Step 2: Gather Client Assets**

Use Section 2.1-2.5 as a checklist:
- [ ] Logo files
- [ ] Brand colors and fonts
- [ ] Copy for all sections (use Section 6 template)
- [ ] Images and videos
- [ ] Contact details and integrations

**Step 3: Technical Planning**

Use Section 3 and 9:
- [ ] Confirm Astro + Tailwind CSS 4 stack is approved (no `tailwind.config.mjs` — uses `@tailwindcss/vite` plugin)
- [ ] Confirm `astro-src/` as the project subdirectory (set as `base` in `netlify.toml`)
- [ ] Set up Git repository
- [ ] Configure Netlify account
- [ ] Create `.env` template with client's values

**Step 4: Success Metrics Agreement**

Use Section 8:
- [ ] Define baseline metrics (if launching into existing business)
- [ ] Agree on targets for 3 months and 12 months
- [ ] Decide what gets measured (GA4, Clarity, form submissions, etc.)

### During Project (Weeks 1-7)

**Weekly standup checklist:**
Use Section 7 to track progress:
- [ ] Which phase are we in?
- [ ] Which tasks completed this week?
- [ ] Any blockers?
- [ ] What's due next week?

**Phase completion:**
Check off entire phase in Section 7:
- [ ] Phase 1 complete (all 3 sections done)
- [ ] Phase 2 complete
- [ ] etc.

### Pre-Launch (Week 6-7)

**Final verification:**
Use Section 8 (Success Metrics) and Section 7 (Testing):
- [ ] All metrics configured in analytics
- [ ] All forms tested
- [ ] All pages responsive
- [ ] SEO checklist complete
- [ ] Performance targets met

### Post-Launch (Ongoing)

**Monthly reviews:**
Use Section 8.5:
- [ ] Are we hitting targets?
- [ ] What's underperforming?
- [ ] What needs optimization?

**Maintenance:**
Use Section 11:
- [ ] What updates are needed?
- [ ] Who's responsible for each?
- [ ] What's the cadence?

---

## SECTION-BY-SECTION GUIDANCE

### Section 1: Product Overview

**What this section does:**
- Frames the project for everyone (client, team, stakeholders)
- Answers "Why are we building this?"
- Establishes shared understanding

**How to customize:**

For a **B2B SaaS landing page:**
```
Target users:
- Enterprise decision makers (VP of IT, CTO)
- IT evaluators (technical team)

Problem statement:
- Manual support processes are expensive
- Customers need 24/7 support
- Current system can't scale
```

For a **Service business landing page:**
```
Target users:
- Small business owners looking for services

Problem statement:
- Can't reach potential customers online
- No credibility/trust signals
- No lead capture mechanism
```

**Key customization points:**
- Change "Value Proposition" to fit client's actual differentiation
- Update "Key Problem Statements" based on customer research
- Adjust "Target Users" personas to match their audience

### Section 2: Client Input Checklist

**Critical:** This section determines project success.

**How to customize:**

**For a tech company (many features, complex):**
- [ ] Expand "Services" section (might have 10+ services)
- [ ] Add "API documentation" if they have one
- [ ] Add "Integration requirements" for their systems
- [ ] Include Section 2.4 prerequisites: IČO/DIČ, pricing model, target audience, lead magnet strategy
- [ ] Confirm Cal.com embed or alternative booking method

**For a local service business (simpler):**
- [ ] Keep checklist simpler
- [ ] Remove "Pricing tier" if fixed pricing
- [ ] Add "Contractor/team member bios"
- [ ] Include Section 2.4 prerequisites: business ID, service area, hours

**For e-commerce:**
- [ ] Add "Product data import" (CSV template)
- [ ] Add "Shipping integration" requirements
- [ ] Add "Payment provider" setup
- [ ] Include Google Reviews link (Section 2.4)

**Pro tip:** Create a separate "Asset Collection Checklist" spreadsheet for clients to track what they've provided. Reference VSL specs in Section 2.5 if video is in scope.

### Section 3: Technical Architecture

**This section is 95% fixed.**

**What you might customize:**
- Hosting provider (if client insists on AWS instead of Netlify)
- Email provider (if client has Brevo account instead of Resend)
- CMS integration (if needed)
- VSL specs (Section 3.6): YouTube facade layout, mobile responsiveness, GA4 event tracking

**What NOT to change:**
- Astro framework
- Tailwind CSS 4 (integrated via `@tailwindcss/vite` — there is no `tailwind.config.mjs`)
- TypeScript
- Static HTML output
- `astro-src/` subdirectory layout
- `global.css` as the single stylesheet entry point (contains `@import "tailwindcss"`, `@theme` block, base styles, animations, and button systems like `.shiny-cta`, `.vf-button`, `.nav-cta-button`)
- Modular translation TypeScript files under `src/scripts/translations/` (not a single JSON file)

The beauty of this template is the tech stack doesn't change. This means you can reuse components across projects.

### Section 4: Critical Features

**This is 60% fixed + 40% customizable.**

**Fixed features (every project needs):**
- Bilingual i18n system using modular TypeScript files in `src/scripts/translations/` (one file per page/domain; merged at build time via `mergeTranslations()` in `index.ts`)
- Language switching via `?lang=en` query param, not `/en/` path prefixes; cookie (`preferredLanguage`) persists choice for 1 year
- Lead capture form with UTM parameter tracking (`utm-tracker.ts`)
- Async background processing for audit form (`audit-background.ts` with 15-minute timeout; `audit-status.ts` for polling 0-100% progress)
- Blog system (bilingual posts, category filter component)
- Admin dashboard
- SEO foundation
- CRO best practices (button system: `.shiny-cta`, `.vf-button`, `.nav-cta-button` defined in `global.css`)
- CRO Copy Patterns (Section 4.10): PAS flow, benefit-driven headlines, CTA patterns
- Czech Language Standards (Section 4.11): vykání rules, native speaker tone, terminology
- Hero Section Framework (Section 4.12): Alex Hormozi $100M Offers Framework for value equation

**Customizable features:**
- What form fields do you capture? (email only vs. detailed form)
- Do you need booking integration? (Yes/No)
- Do you need a chatbot? (Yes/No)
- What case studies/testimonials matter? (varies)

**How to customize:**

If client needs booking:
```markdown
### 4.X Booking Integration
**Options:**
1. Cal.com embed (easiest, no backend code)
2. Calendly widget (also simple)
3. Custom booking system (hardest, more control)

**Recommendation:** Start with Cal.com for MVP.
```

If client has complex forms:
```markdown
### 4.2 Lead Capture & Validation
**Custom fields:**
- Budget range (dropdown)
- Number of employees (dropdown)
- Timeline (radio buttons)
- Industry vertical (multi-select)
```

### Section 5: Analytics & Tracking

**This is 70% fixed + 30% customizable.**

**Fixed:**
- GA4 implementation approach
- Clarity setup
- UTM parameter strategy (`utm-tracker.ts` captures source, medium, campaign, content, and term; stores in cookie; attaches to every form submission)

**Customizable:**
- Which events matter to this business?
- What's a "successful" conversion?
- What's the revenue model? (ads, leads, SaaS, etc.)

**How to customize:**

For a **lead generation business:**
```markdown
### 5.1 Key Events
- form_submission (most important)
- form_field_error (track drop-off points)
- form_field_filled (track engagement)
- cta_click (which CTAs drive most submissions?)
```

For an **affiliate/content business:**
```markdown
### 5.1 Key Events
- affiliate_link_click (track earnings potential)
- video_play (content engagement)
- comment_submission (community engagement)
- newsletter_signup (list building)
```

### Section 6: Content Template

**This is 100% customizable but the structure stays the same.**

The template provides a **fill-in-the-blank structure** for clients.

**How to customize:**

The structure never changes, but you modify:
1. Number of sections (hero vs. hero + video)
2. Type of content (FAQ vs. testimonials emphasis)
3. Field names in forms
4. Call-to-action text

**Pro tip:** Create industry-specific content templates:

```markdown
[For SaaS]
- Pricing section (required)
- Feature comparison table
- Technical documentation link

[For Services]
- Portfolio/case studies (required)
- Team bios
- Service descriptions with processes

[For E-commerce]
- Product showcase
- Trust signals (reviews, ratings)
- Shipping/return policy links
```

### Section 7: Implementation Checklist

**This is the working document during development.**

**How to use:**

1. **At start of each phase:** Review all tasks
2. **Daily standup:** Check off completed tasks
3. **Blockers:** Mark tasks as "blocked" with reason
4. **Prioritization:** Star critical-path tasks

**How to customize:**

**For a tight timeline (4 weeks instead of 7):**
- Combine phases (do design + structure simultaneously)
- Remove optional tasks (some animations, advanced CRO)
- Use template components as-is (no heavy customization)

**For a larger scope:**
- Extend phases
- Add sub-tasks (Phase 3.5: Advanced animations)
- Allocate more people

**For specific client needs:**
- Add client-specific tasks (integrating with their CRM)
- Move some tasks earlier (if client wants to see design mockups first)

### Section 8: Success Metrics

**Critical section: defines what "done" means.**

**How to customize:**

**For a new business:**
```markdown
Baseline = 0 (no current website)
Target 3mo = 100 visitors/month, 5 leads/month
Target 12mo = 500 visitors/month, 25 leads/month
```

**For a redesign:**
```markdown
Baseline = current website metrics (from GA4)
Target 3mo = +50% traffic, +30% conversion rate
Target 12mo = +100% traffic, +50% conversion rate
```

**Different industries need different metrics:**

| Industry | Primary Metric | Secondary |
|----------|---|---|
| B2B Services | Cost per qualified lead | Sales cycle time |
| SaaS | Trial signup rate | Free-to-paid conversion |
| E-commerce | Average order value | Return customer rate |
| Creator/Content | Email subscribers | Video views |
| Local Business | Store visits from site | Phone call rate |

---

## COMMON CUSTOMIZATION SCENARIOS

### Scenario 1: Client Has Existing Website

**Modifications needed:**

```markdown
## SECTION 1: Product Overview (MODIFIED)

### 1.5 Migration Strategy
- Old website: [URL]
- Launch strategy: Soft launch, then redirect old domain
- Redirect plan: 301 redirects for all old URLs (see spreadsheet)
- Timeline: 2-week dual-run period before full switch

## SECTION 8: Success Metrics (MODIFIED)

### 8.1 Business Metrics

| Metric | Old Site | New Site Target (3mo) |
|--------|----------|-----|
| Monthly visitors | 500 | 750 (+50%) |
| Form submissions | 5 | 15 (+200%) |
| Conversion rate | 1% | 2% |
| Avg. session duration | 1:30 | 2:30 |

[Add baseline data from Google Analytics]
```

### Scenario 2: Client Needs Translation Later

**Modifications:**

```markdown
## SECTION 9: Environment Variables

### TRANSLATION STRATEGY (Updated)

**Launch (Phase 1):** Czech only
**Post-launch (Phase 2, Month 2):** Add English
**Post-launch (Phase 3, Month 3):** Add German (if budget allows)

## SECTION 7: Implementation Checklist

### Phase 13: Post-Launch (New)
- [ ] Review analytics for 4 weeks
- [ ] Collect client feedback
- [ ] Prioritize improvements
- [ ] Plan Phase 2 enhancements (translations, new sections, etc.)
```

### Scenario 3: Client Insists on Different Tech Stack

**Your response (as PM):**

1. **Understand why:** "What's driving the need for different tech?"
   - They have existing codebase? (Maybe integrate differently)
   - Developer preference? (Educate on trade-offs)
   - Specific requirement? (Does it actually exist?)

2. **Present trade-offs:** Make them explicit

```markdown
## RECOMMENDATION: Stick with Astro + Tailwind + Netlify

### Why not [their suggestion]?

[Alternative: Next.js + Vercel]
- Pro: More JavaScript ecosystem support
- Con: Requires more RAM, slower builds, higher CO2 footprint for this use case
- Cost impact: +$20/month hosting
- Timeline impact: +1 week for setup & deployment
- Recommendation: Only if you need SSR, which you don't

[Alternative: WordPress]
- Pro: Familiar to non-technical staff
- Con: Slower (60 vs. 95 Lighthouse score), less control, security overhead, hosting costs
- Cost impact: +$30/month hosting + plugin subscriptions
- Timeline impact: +2 weeks (theme selection, plugin setup)
- Recommendation: Not suitable for high-performance landing page
```

3. **If they insist, create separate PRD** tailored to their stack

---

## TEMPLATE SECTIONS CHECKLIST

Use this when preparing the template for a new client:

### Before Sending to Client

- [ ] Section 1-2: Review and fill in with kickoff meeting notes
- [ ] Section 3: Confirm tech stack is approved
- [ ] Section 4: Customize features list (check which apply)
- [ ] Section 6: Add industry-specific examples
- [ ] Section 7: Adjust timeline for this project
- [ ] Section 8: Set baseline and targets
- [ ] Section 9: List environment variables they need to configure
- [ ] Section 12: Assign team roles

### Client Approval Process

- [ ] Share draft with product stakeholder (not just one contact)
- [ ] Allow 5-7 days for feedback
- [ ] Schedule sync to discuss changes
- [ ] Get sign-off from decision-maker
- [ ] Save approved version in project folder

### During Development

- [ ] Use Section 7 as working checklist
- [ ] Update Section 8 dashboards weekly
- [ ] Reference Section 4 when design questions arise
- [ ] Use Section 6 when content delays occur

### Post-Launch

- [ ] Archive PRD in project folder
- [ ] Use Section 11 as maintenance guide
- [ ] Reference for similar future projects (copy and customize)

---

## TEMPLATE REUSABILITY ACROSS PROJECTS

### What You Can Clone (Copy Exactly)

1. **Section 3: Technical Architecture** (95% reusable)
   - Same stack for all projects
   - Just update company names/links if needed

2. **Section 4.1-4.3: Bilingual System** (90% reusable)
   - i18n approach is the same: modular TypeScript files in `src/scripts/translations/`, `?lang=en` query param URLs, cookie-based persistence
   - Just change languages (e.g., Czech+German instead of Czech+English) and add the corresponding translation module files

3. **Section 4.4: SEO & Structured Data** (80% reusable)
   - Same SEO best practices
   - Update example schemas with client info

4. **Section 7: Implementation Checklist** (70% reusable)
   - Same phases and structure
   - Maybe adjust timeline
   - Reorder based on client priority

5. **Section 9: Environment Variables** (95% reusable)
   - Same set of environment variables
   - Update example values

### What You Must Customize

1. **Section 1: Product Overview** (0% reusable)
   - Completely new for each client
   - Different vision, users, goals

2. **Section 2: Client Input Checklist** (20% reusable)
   - Structure is the same
   - Content varies by industry and scope
   - Add/remove items based on project type

3. **Section 4: Critical Features** (40% reusable)
   - Core features are the same
   - Additional features vary
   - Implementation details differ

4. **Section 6: Content Template** (10% reusable)
   - Structure is the same (section titles)
   - All copy examples change
   - Industry-specific sections vary

5. **Section 8: Success Metrics** (20% reusable)
   - Template structure is the same
   - All values are custom
   - Metrics prioritization varies by industry

### Time Savings by Reusing Template

| Phase | First Project | Second Project | Third Project |
|-------|---|---|---|
| PRD Creation | 40 hours | 12 hours | 8 hours |
| Development | 160 hours | 120 hours | 100 hours |
| **Total** | **200 hours** | **132 hours** | **108 hours** |

**Reuse factor:** Each project gets ~1.35x faster with template

---

## TROUBLESHOOTING

### "The template is too long for my client"

**Solution:** Create a **Client-Facing Executive Summary** (2-3 pages)

```markdown
# PROJECT OVERVIEW

## What We're Building
[1-2 paragraphs from Section 1]

## Timeline
[Gantt chart version of Section 7 phases]

## Investment & ROI
[Section 8 success metrics, simplified]

## Next Steps
[Week 1 deliverables from Section 7]

[Note: Full PRD available for tech team]
```

### "We need to change the tech stack"

**Solution:** Create a **Variant PRD** with:
- Section 3 completely replaced
- Sections 7 updated with new timeline
- Everything else stays the same

### "Timeline is half what the template suggests"

**Solution:** Use **Scoping Meeting** to reduce scope:

```markdown
## SCOPE REDUCTION OPTIONS (Pick 2-3)

❌ Remove: Admin dashboard (minimal ROI for MVP)
❌ Remove: Scroll reveal animations (can add post-launch)
❌ Reduce: Translations to English only (add Czech later)
✅ Keep: Form, lead capture, analytics, SEO

New timeline: 4 weeks (instead of 7)
Revised success metrics: Basic analytics only (can expand)
```

### "Client won't provide copy before we start"

**Solution:** Plan accordingly:

```markdown
## MODIFIED TIMELINE

Week 1: Development begins (use lorem ipsum placeholders)
Week 2-3: Client provides copy (swap in as received)
Week 4-5: Redesign/reflow with real copy (usually adds 2-3 days)
Week 6: Testing and deployment

[Add to Section 7: "Content delay risk: If copy delayed 2+ weeks,
push launch by 1 week"]
```

---

## BEST PRACTICES FOR PRD TEMPLATES

1. **Version Control:** Keep template in Git
   - Each client project gets a versioned copy: `PRD_v2.0_[CLIENT].md`
   - Track changes to master template
   - Allow community PRs for improvements

2. **Customization Documentation:** Create variant templates
   - `PRD_Template_SaaS.md` (B2B SaaS defaults)
   - `PRD_Template_Services.md` (Service business defaults)
   - `PRD_Template_Ecommerce.md` (E-commerce defaults)

3. **Checklist Automation:** Use GitHub Projects or Asana
   - Auto-generate task board from Section 7
   - Track completion as team checks off items
   - Generate burndown charts

4. **Metrics Dashboards:** Create template dashboards
   - GA4 dashboard template (import by client)
   - Clarity dashboard template
   - Email submission tracking spreadsheet

5. **Client Onboarding:** Create companion materials
   - Asset collection spreadsheet
   - Copy template in Google Docs
   - Image sizing guide
   - Video specifications guide

---

## MEASURING TEMPLATE EFFECTIVENESS

Track these metrics to improve the template over time:

| Metric | Target | How to Measure |
|--------|--------|---|
| **PRD completion time** | < 2 weeks | Time from kickoff to signed PRD |
| **Client satisfaction** | > 4.5/5 | Post-project survey |
| **Scope creep** | < 20% | Planned vs. actual hours |
| **On-time delivery** | > 80% | Projects delivered on schedule |
| **Reuse factor** | > 60% | % of template content used as-is |
| **Client questions** | < 10 clarifications | Support tickets referencing PRD |

Use this data to improve the template quarterly.

---

## TEMPLATE MAINTENANCE

**Quarterly template review:**
- [ ] Update based on lessons learned
- [ ] Add new customization options
- [ ] Remove sections that aren't working
- [ ] Update technology versions
- [ ] Adjust timeline estimates

**Annual major revision:**
- [ ] Review entire structure
- [ ] Update tech stack section (Astro version, Tailwind CSS version, new features)
- [ ] Refresh success metrics guidance
- [ ] Add new best practices
- [ ] Create updated version (current: 2.0; next: 3.0)

---

## CONCLUSION

This template is designed to be:
1. **Comprehensive** - covers every aspect of the project
2. **Flexible** - customizable for different client types
3. **Reusable** - save time on future projects
4. **Practical** - actually used as working document during project

Use Section 7 (Implementation Checklist) as your north star. If you're doing what's on that checklist, you're on track.

Good luck with your projects!

---

**Template created:** 2026-03-01
**Template version:** 2.0
**Maintained by:** [Product Management Team]
**Last updated:** 2026-03-01
**Next review:** 2026-06-01
