# PRD Template System: Complete Documentation

**Status:** Ready for Production
**Version:** 2.0
**Created:** 2026-03-01
**Maintained by:** Product Management Team

---

## Executive Summary

This is a **production-ready PRD template system** for building bilingual SaaS landing pages with lead generation, CRO optimization, and SEO best practices.

**What you get:**
- Complete PRD template (8,500+ words, 12 sections)
- Customization guide for different project types
- Quick start reference
- Real-world implementation examples

**For:** Product managers, developers, project leads responsible for building high-converting websites

**Time to use:** 2-3 hours to customize per client (vs. 20+ hours to build from scratch)

---

## The 3 Core Documents

### 1. `PRD_TEMPLATE.md` (8,500+ words)

**What:** The actual PRD template. Use this for every project.

**Contains:**
- Section 1: Product Overview
- Section 2: Client Input Checklist (branding, copy, assets, pricing, target audience, lead magnet, IČO/DIČ, Cal.com, Google Reviews)
- Section 3: Technical Architecture (Astro + Tailwind + Netlify, VSL specs with YouTube facade and GA4)
- Section 4: Critical Features (i18n, forms, admin, SEO, CRO)
  - Section 4.10: CRO Copy Patterns (PAS flow, benefit-driven headlines)
  - Section 4.11: Czech Language Standards (vykání, native tone)
  - Section 4.12: Hero Section with Hormozi $100M Offers Framework
- Section 5: Analytics & Tracking (GA4, Clarity, UTM)
- Section 6: Content Template (copy structure for client)
- Section 7: Implementation Checklist (13 phases, 100+ tasks)
- Section 8: Success Metrics (business, UX, performance, SEO)
- Section 9: Environment Variables
- Section 10: Deployment & Hosting
- Section 11: Maintenance & Support
- Section 12: Team Roles

**How to use:**
1. Make a copy: `PRD_[ClientName]_v2.0.md`
2. Fill in `[CLIENT_TO_FILL]` sections from kickoff meeting
3. Share with client (Sections 2 & 6 specifically)
4. Use Section 7 as working checklist
5. Monitor Section 8 metrics post-launch

**Reading time:** 30 minutes per section, or skim for your section

---

### 2. `PRD_TEMPLATE_GUIDE.md` (6,000 words)

**What:** Deep guide on customizing the template for different scenarios

**Contains:**
- Template structure patterns
- Fill-in instructions vs. fixed specs
- Customization by project scope (MVP, Standard, Enterprise)
- Customization by industry (SaaS, Services, Local, E-commerce)
- Common scenarios with examples
- Troubleshooting guide
- Reusability metrics

**How to use:**
- **First time using template?** → Read "Customization Guide" section
- **Unfamiliar with template structure?** → Read "Section-by-Section Guidance"
- **Facing a tricky situation?** → Read "Common Customization Scenarios"
- **Team asking "why Astro?"** → Read "Troubleshooting: Can't change tech stack"

**Reading time:** 15-20 minutes (skim to your section)

---

### 3. `PRD_QUICK_START.md` (3,000 words)

**What:** Navigation guide, examples, shortcuts, red flags

**Contains:**
- 30-second summary
- 5-step "how to use template" guide
- Section-at-a-glance reference
- Common Q&A
- Shortcuts (Gantt chart, asset checklist, etc.)
- Red flags (when scope changes)
- Version control recommendations

**How to use:**
- **First time today?** → Read the 30-second summary
- **How do I get started?** → Follow the 5 easy steps
- **Which section do I need?** → Check section-at-a-glance
- **Quick answer to a question?** → Common Q&A section
- **Is this doable in 4 weeks?** → Check "Red Flags"

**Reading time:** 5-10 minutes (this is designed to be fast)

---

## Template Architecture Explained

### The "Fill-In" Pattern

Throughout the template, you'll see `[CLIENT_TO_FILL]` placeholders. This indicates:
- Information that MUST come from the client
- Or information specific to their industry/goals
- That can't be standardized across all projects

**Example:**
```markdown
[BEFORE - Template]
Business objectives:
- [ ] Primary business goal [CLIENT_TO_FILL]

[AFTER - Filled in]
Business objectives:
- [ ] Primary business goal: Generate 100 qualified leads per month
```

### The "Fixed Specification" Pattern

Some sections are **95% fixed** because they reflect the optimal tech stack and best practices.

**Never change:**
- Section 3: Technical Architecture (always Astro + Tailwind + Netlify)
- Section 4.10: CRO Copy Patterns (framework stays consistent)
- Section 4.12: Hormozi $100M Offers Framework (proven structure)
- Section 9: Environment Variables (standard set)
- Section 10: Deployment (Netlify setup)

**Always customize:**
- Section 1: Product Overview (different per client)
- Section 2: Client Input (varies by project type, includes new prerequisites and VSL specs)
- Section 4.11: Czech Language Standards (customize for other languages if needed)
- Section 6: Content (completely different copy)
- Section 8: Success Metrics (different goals per business)

### The "Progressive Detail" Pattern

The template is organized from **high-level overview → detailed specifications**:

1. **Sections 1-2** (Kickoff): What & Why - strategic overview
2. **Sections 3-6** (Design): How We Build - technical specs
3. **Sections 7-12** (Execution): Do The Work - operational details

This lets you:
- Start with client conversations (Sections 1-2)
- Hand off to dev team (Sections 3-6)
- Use as working checklist (Section 7)

---

## How the Template Saves Time

### First Project: 40 hours

```
- Understand requirements: 8h
- Create PRD from scratch: 24h
- Review/revise with client: 6h
- Kickoff: 2h
= 40 hours
```

### Second Project: 12 hours

```
- Copy template: 0.5h
- Customize Sections 1-2: 3h
- Customize Sections 4, 6, 8: 5h
- Client review/revise: 2.5h
- Kickoff: 1h
= 12 hours
```

### Third Project: 8 hours

```
- Copy template: 0.5h
- Customize (faster, more familiar): 5h
- Client review: 1.5h
- Kickoff: 1h
= 8 hours
```

**Total savings:** 32 hours per project (after second project)
**Over 5 projects:** 120+ hours saved

---

## Technology Stack: Why It's Fixed

The template always specifies:

| Component | Technology | Why Not Change? |
|-----------|-----------|---|
| **Framework** | Astro 5 | Zero JS by default, fastest builds, best for static sites |
| **Styling** | Tailwind CSS 4 via `@tailwindcss/vite` | No `tailwind.config.mjs`; v4 config lives in `global.css` `@theme` block |
| **Project layout** | `astro-src/` subdirectory | `netlify.toml` sets `base = "astro-src"`; all Astro source lives here |
| **Stylesheet** | `global.css` | Single entry point: `@import "tailwindcss"`, `@theme`, base styles, animations, button systems |
| **Translations** | Modular TS in `src/scripts/translations/` | One file per page domain; merged via `mergeTranslations()` in `index.ts`; follows Czech vykání rules if Czech language |
| **URL strategy** | `?lang=en` query params | Not `/en/` path prefixes; `netlify.toml` redirects `/en/*` → `/*?lang=en` (301) |
| **Language** | TypeScript | Type safety, fewer bugs, better DX |
| **Email** | Resend | Simple API, free tier, excellent deliverability |
| **Storage** | Netlify Blobs | Serverless KV (`audit-leads`, `contact-leads`, `survey-leads`), no database needed |
| **Functions** | Netlify Functions + background functions | Background function (`audit-background.ts`) has 15-minute timeout; `audit-status.ts` returns 0-100% progress |
| **UTM tracking** | `utm-tracker.ts` | Captures UTM params + referrer, stores in cookie, attaches to every form submission |
| **Hosting** | Netlify | Perfect for Astro, auto-deployments, built-in CDN |
| **CRO Framework** | PAS Copy Patterns (4.10) | Problem-Agitate-Solve for headlines, benefit-driven CTAs, psychological triggers |
| **Hero Framework** | Hormozi $100M Offers (4.12) | Value equation, VSL-inspired layout, urgency mechanisms |

**Can you use something else?** Yes, but it requires:
1. A separate variant PRD
2. Justification of trade-offs (cost, timeline, performance)
3. +2-3 weeks added to timeline
4. Loss of template reusability

---

## Real-World Example: HypeDigitaly

The template is based on the **production HypeDigitaly website**, which includes:

✅ **Components** (reusable Astro components: navigation, sections, blog, ui, backgrounds groups)
✅ **Styling** (`global.css`: `@theme` block, Tailwind CSS 4, animations, `.shiny-cta`/`.vf-button`/`.nav-cta-button` button systems)
✅ **Features** (i18n via modular TS translations + `?lang=en` query params, forms, lead capture, background audit processing, blog, admin dashboard)
✅ **Analytics** (GA4, Clarity, custom events, `utm-tracker.ts` for full attribution)
✅ **SEO** (JSON-LD schema, hreflang, sitemaps)
✅ **Performance** (Lighthouse score 95+)
✅ **CRO** (multiple CTAs, scroll animations, testimonials)

You're not building something experimental—you're replicating a proven system.

---

## Project Timeline Reference

### Standard Scope (8 weeks)

```
Week 1: Setup + Design + Content (Phases 1-2)
Week 2: Components (Phase 3)
Week 3: Scripts + Pages (Phases 4-5)
Week 4: APIs + Content (Phase 6)
Week 5: SEO + Performance (Phase 7)
Week 6-7: Testing + Deployment (Phases 8-12)
```

### Minimal Scope (4 weeks)

Remove: Admin dashboard, advanced animations, testing phases
```
Week 1: Setup + Design (Phases 1-2)
Week 2: Components + Pages (Phases 3-5, combined)
Week 3: APIs + Content (Phase 6)
Week 4: Testing + Launch (Phases 8-12, compressed)
```

### Plus Scope (12+ weeks)

Add: CMS integration, custom features, advanced testing
```
Weeks 1-3: Standard scope
Weeks 4-5: CMS setup or additional features
Weeks 6-8: Extended testing and optimization
Weeks 9-12: Post-launch refinement
```

---

## Usage Checklist: Getting Started

### Day 1: Prepare Template
- [ ] Copy `PRD_TEMPLATE.md` to `PRD_[ClientName]_v2.0.md`
- [ ] Read `PRD_QUICK_START.md` (5 minutes)
- [ ] Schedule kickoff meeting

### Day 1-2: Kickoff Meeting
- [ ] Use Section 1 questions to understand client
- [ ] Use Section 2 to request assets/copy
- [ ] Use Section 8 to define success metrics
- [ ] Confirm timeline based on Section 7 phases

### Week 1: Customize Template
- [ ] Fill in Section 1 (product overview)
- [ ] Prepare Section 2 checklist (client to fill)
- [ ] Create Section 6 content template (client to fill)
- [ ] Share with client via Google Docs

### Week 2: Technical Planning
- [ ] Tech team reviews Section 3 (approve stack)
- [ ] Review Section 4 features (confirm scope)
- [ ] Set up Section 9 environment variables
- [ ] Set up Netlify/Git repository

### Week 2-3: Design & Structure
- [ ] Designer starts with Section 4 component specs
- [ ] Developer sets up directory structure (Section 3)
- [ ] Begin Phase 1-2 of Section 7 checklist

### Weeks 3-6: Development
- [ ] Team follows Section 7 checklist
- [ ] Check off tasks as completed
- [ ] Reference Section 4 for feature details
- [ ] Use Section 5 for analytics setup

### Week 6-7: Testing & Launch
- [ ] QA tests Section 7 Phase 8 checklist
- [ ] Reference Section 10 for deployment
- [ ] Launch per Section 10 steps
- [ ] Set up Section 8 success metrics

### Post-Launch: Ongoing
- [ ] Use Section 11 for maintenance tasks
- [ ] Monitor Section 8 metrics
- [ ] Schedule quarterly content updates

---

## For Different Roles

### Product Manager

**Read:** Sections 1, 2, 4, 5, 8, 12
**Use:** Manage client expectations, feature prioritization, success metrics
**Time:** 2 hours per project

### Developer

**Read:** Sections 3, 4, 6, 7
**Use:** Implementation checklist, component specifications, feature details
**Time:** Reference as needed (daily)

### Designer

**Read:** Sections 2, 4, 6
**Use:** Visual specs, content structure, component design
**Time:** 2-3 hours initial, then reference

### Project Manager

**Read:** Sections 7 (mainly), 1, 8, 11
**Use:** Task management, timeline tracking, stakeholder updates
**Time:** 1 hour initial, 30 min per week maintenance

### Client

**Read:** Sections 1, 2, 6, 8
**Use:** Understanding project, providing assets/copy, success metrics
**Time:** 10-15 hours (mostly filling in checklists)

### DevOps / Deployment

**Read:** Sections 3, 9, 10, 11
**Use:** Infrastructure setup, environment configuration, deployment
**Time:** 3-4 hours initial, then troubleshooting as needed

---

## Document Customization Quick Reference

### By Project Type

**B2B SaaS:**
- Emphasize: Features, ROI, integration capabilities
- Section 4: Add "API documentation" and "Integration" sections
- Section 6: Add "Pricing" section
- Section 8: Focus on "Cost per lead" and "Sales cycle" metrics

**Service Business:**
- Emphasize: Results, case studies, team expertise
- Section 4: Add "Team bios" and "Certifications"
- Section 6: Expand case studies section
- Section 8: Focus on "Lead quality" and "Conversion rate" metrics

**Local Business:**
- Emphasize: Location, trust signals, reviews
- Section 4: Add "Google My Business" integration
- Section 2: Include "Service area" and "Hours"
- Section 6: Add "Service area map" and "Hours"

**E-commerce:**
- Emphasize: Product catalog, social proof, security
- Section 4: Add "Product showcase" and "Payment integration"
- Section 6: Add "Product grid" and "Reviews section"
- Section 8: Focus on "AOV" and "Repeat purchase rate"

### By Timeline

**Accelerated (4 weeks):**
- Remove: Advanced animations, custom dashboard, extensive testing
- Simplify: One language (add translations later), minimal case studies
- Focus: Form, analytics, basic design

**Standard (8 weeks):**
- Keep: Everything as-is in template

**Extended (12+ weeks):**
- Add: CMS integration, custom features, A/B testing phase
- Enhance: More case studies, testimonials, content depth
- Include: Advanced analytics, performance optimization

### By Budget

**$6K (Minimal):**
- Form only (no admin dashboard)
- Single page, no service pages
- Limited CSS animations
- Basic email only
- Team: 1 dev, 1 designer

**$15K (Standard):**
- Full template as-is
- 3-5 pages
- Full animations
- Admin dashboard included
- Team: 2 devs, 1 designer, 1 PM

**$25K+ (Premium):**
- Everything in standard, plus:
- CMS integration
- Custom features
- Extensive analytics
- Advanced testing and optimization
- Team: 3+ devs, 2 designers, 1 PM, 1 QA

---

## Common Answers

**Q: How do I know which sections to read first?**

A: Use this decision tree:
1. Read PRD_QUICK_START.md (this tells you what to read next)
2. First project? Read PRD_TEMPLATE_GUIDE.md "Customization Guide"
3. During project? Reference Section 7 of PRD_TEMPLATE.md
4. Stuck? Search PRD_TEMPLATE_GUIDE.md "Troubleshooting"

**Q: What if my client wants to change the tech stack?**

A: See PRD_TEMPLATE_GUIDE.md "Troubleshooting: Client Insists on Different Tech Stack"

TL;DR: Show them trade-offs, but strongly recommend keeping Astro + Tailwind

**Q: Can I reuse components across projects?**

A: Yes! All components defined in Section 3 are reusable (organized into navigation, sections, blog, ui, and backgrounds groups).
Store them in a shared repo to save development time.

**Q: How much time does this save?**

A: First project: 0 hours saved (you're learning)
Second project: 30 hours saved
Third project onward: 30+ hours per project

**Q: Is this just for HypeDigitaly-style projects?**

A: Mostly. The template assumes:
- Static site (no complex backend)
- Lead generation model (form submission)
- SaaS/service company
- Professional B2B audience

If your project is different (e-commerce, app, complex features), use this as a base and adapt sections.

**Q: Can we use Gatsby, Next.js, or Vue instead of Astro?**

A: Technically yes, but:
1. Creates duplicate work (rewriting components)
2. Loses reusability across projects
3. Template doesn't cover those stacks
4. Loses CRO and Hormozi framework integration benefits

Create variant PRDs if you need different frameworks.

**Q: Do we have to use the Hormozi $100M Offers Framework for hero sections?**

A: It's the recommended best practice (Section 4.12), but you can customize. The framework is proven for maximum initial conversion. Pair with CRO Copy Patterns (Section 4.10) for best results.

**Q: How do we handle non-Czech language clients?**

A: Section 4.11 covers Czech vykání rules. For other languages, follow the same modular TS translation approach with language-specific tone guides. Reference Section 4.11 as template for creating language-specific standards.

---

## Maintenance & Updates

### Quarterly Review
- Update based on lessons learned from projects
- Add new customization options
- Remove sections not working
- Update technology versions

### Annual Major Revision
- Full structural review
- Update tech stack (Astro version, new features)
- Refresh success metrics guidance
- Add new best practices
- Create new version (e.g., 2.0)

**Last Updated:** 2026-03-01
**Next Review:** 2026-06-01

---

## File Structure in Your Project

```
/PRD_Documents/
├── PRD_TEMPLATE.md               (8,500 words - USE THIS for projects)
├── PRD_TEMPLATE_GUIDE.md         (6,000 words - customization help)
├── PRD_QUICK_START.md            (3,000 words - quick reference)
├── README_PRD_TEMPLATE_SYSTEM.md (THIS FILE - overview)
└── /projects/
    ├── PRD_Acme_Corp_v2.0.md     (Customized copy for Acme)
    ├── PRD_Acme_Corp_FINAL.md    (Approved version)
    └── PRD_Acme_Corp_LAUNCH.md   (As-built, for reference)
```

---

## Getting Help

**Question?** → Check PRD_TEMPLATE_GUIDE.md
**Quick answer?** → Check PRD_QUICK_START.md
**Creating PRD?** → Use PRD_TEMPLATE.md
**Stuck during project?** → Use Section 7 & 11 of PRD_TEMPLATE.md
**Something missing?** → File an issue or suggest improvement

---

## Success Indicators: How to Know It's Working

✅ **PRD completed in 2-3 hours** (vs. 20+ hours from scratch)
✅ **Team understands project scope** (no constant clarifications)
✅ **Client satisfied with structure** (clear expectations)
✅ **Project delivered on timeline** (Section 7 checklist keeps you on track)
✅ **Launch metrics achieved** (Section 8 success metrics)
✅ **Reusable components** (save time on next project)

---

## Conclusion

This template system turns PRD creation from a **20+ hour process** into a **2-3 hour process**.

It codifies 5+ years of building high-converting SaaS landing pages into a repeatable system that:
- ✅ Covers every aspect of the project
- ✅ Saves time through reusability
- ✅ Reduces scope creep
- ✅ Aligns stakeholders
- ✅ Tracks success metrics
- ✅ Provides implementation clarity

**Start with PRD_QUICK_START.md. Follow the 5 easy steps. You'll have a complete PRD in one day.**

---

**Created:** 2026-03-01
**Version:** 2.0
**Status:** Production Ready
**Maintained by:** Product Management Team

Questions? Check the documentation or ask the team.
