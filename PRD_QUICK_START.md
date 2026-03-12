# PRD Template: Quick Start Guide

**Version:** 2.0
**TL;DR:** Use `PRD_TEMPLATE.md` for projects. Here's how.

---

## 30-Second Summary

The PRD template has **12 sections** (plus 3 new CRO/language sections) organized by **when you need them**:

1. **Week 1 (Kickoff):** Sections 1, 2, 8, 12
2. **Weeks 2-3 (Design):** Sections 3, 4, 6, 9
3. **Weeks 3-5 (Build):** Sections 5, 7, 10, 11
4. **Week 6+ (Launch):** Section 7 (checklist)

**Total template:** ~8,500 words, fills in completely customized PRD for one project

---

## The Three Documents

| Document | Purpose | Audience | Read Time |
|----------|---------|----------|-----------|
| **PRD_TEMPLATE.md** | The actual PRD template (use this for projects) | Product managers, clients | 30 min per section |
| **PRD_TEMPLATE_GUIDE.md** | How to customize and use the template | Product managers, team leads | 20 minutes |
| **PRD_QUICK_START.md** | You're reading this (navigation + examples) | Everyone | 5 minutes |

---

## How to Use the Template: 5 Easy Steps

### Step 1: Make a Copy for Your Client

```bash
# In your project folder:
cp PRD_TEMPLATE.md PRD_[ClientName]_v2.0.md

# Example:
cp PRD_TEMPLATE.md PRD_Acme_Corp_v2.0.md
```

### Step 2: Customize Sections 1 & 2

**At kickoff meeting with client, fill in:**

**Section 1: Product Overview**
- What problem are we solving? (1-2 sentences)
- Who are the users? (3 personas)
- What's the business goal? (measurable targets)
- Why now? (market context)

**Section 2: Client Input Checklist**
- Get client's logo, colors, fonts
- Collect copy (they fill in using Section 6 template)
- Confirm email addresses
- Set up integrations (analytics, email service)

**Time:** 1-2 hours in meeting + 1 week for client to gather assets

### Step 3: Technical Team Reviews Section 3-5

**Tech lead confirms:**
- [ ] Astro + Tailwind CSS 4 + Netlify stack approved (note: no `tailwind.config.mjs` — Tailwind v4 uses `@tailwindcss/vite` plugin)
- [ ] Project lives inside `astro-src/` subdirectory as specified in `netlify.toml`
- [ ] Database/KV store (Netlify Blobs) acceptable
- [ ] Email service (Resend) works with their domain
- [ ] Analytics (GA4 + Clarity) approved
- [ ] Background functions for audit processing understood (15-minute timeout via `audit-background.ts`)
- [ ] VSL specs reviewed (if video sales letter is in scope)

**No changes needed** - Section 3 is fixed across all projects

**Time:** 30 minutes

### Step 4: Customize Section 4 & 6

**Decide what features you're building:**
- Standard: Form, email, admin, SEO, animations
- Add-on: Booking, blog, chatbot, calendar
- Remove: Anything not in scope

**Map out content using Section 6 template:**
- Sections on hero, services, case studies, FAQ
- Client fills in exact copy using provided template
- Consider Hormozi $100M Offers Framework for hero section (Section 4.12)
- Apply CRO copy patterns for all CTAs (Section 4.10)
- For Czech copy, apply vykání rules and native speaker standards (Section 4.11)

**Time:** 2-3 hours

### Step 5: Use Section 7 as Working Checklist

**Print or paste into project management tool (Asana, GitHub Projects, etc.)**

**Each week:**
- [ ] Check off completed tasks
- [ ] Add blockers/risks
- [ ] Update team

**Time:** 5 minutes daily during project

---

## Template at a Glance

### Section-by-Section Cheat Sheet

**Sections 1-2: What & Why (Kickoff)**
```
Section 1: Product Overview
└─ Vision statement
└─ Target users & personas
└─ Problems we're solving
└─ Value proposition
└─ Business objectives

Section 2: Client Input Checklist
└─ Branding (logo, colors, fonts)
└─ Copy (all text content)
└─ Translations
└─ Business configuration
└─ Media assets
└─ Enhanced 2.4: Additional prerequisites (pricing, target audience, lead magnet, IČO/DIČ, Cal.com, Google Reviews)
└─ Enhanced 2.5 & 3.6: VSL specs (YouTube facade, mobile layout, GA4 tracking)
```

**Sections 3-5: How We Build It (Design)**
```
Section 3: Technical Architecture
└─ Tech stack (fixed: Astro, Tailwind CSS 4 via @tailwindcss/vite, Netlify)
└─ astro-src/ subdirectory structure
└─ System diagram (including background functions + audit polling)
└─ Directory structure
└─ Component specifications (navigation, sections, blog, ui, backgrounds)

Section 4: Critical Features
└─ Bilingual i18n (modular TS files in src/scripts/translations/)
└─ ?lang=en query-param URL strategy (not /en/ path prefixes)
└─ Lead capture & background processing (audit-background.ts, audit-status.ts)
└─ Blog system (bilingual posts, category filter)
└─ Admin dashboard
└─ Button system (.shiny-cta, .vf-button, .nav-cta-button in global.css)
└─ SEO & structured data
└─ CRO elements
└─ 4.10: CRO Copy Patterns (PAS flow, benefit-driven headlines)
└─ 4.11: Czech Language Standards (vykání, native tone)
└─ 4.12: Hero Section with $100M Offers Framework (Hormozi method)

Section 5: Analytics & Tracking
└─ GA4 events & dashboards
└─ Microsoft Clarity
└─ UTM parameter strategy (utm-tracker.ts captures source/medium/campaign)
```

**Sections 6-7: What To Build & How (Execution)**
```
Section 6: Content Template
└─ Homepage structure
└─ Copy templates (client fills in)
└─ Service pages
└─ FAQ content

Section 7: Implementation Checklist
└─ Phase 1: Setup (1 week)
└─ Phase 2: Structure (1 week)
└─ Phase 3: Components (1 week)
└─ Phase 4: Scripts (1 week)
└─ Phase 5: Pages (1 week)
└─ Phase 6: APIs (1 week)
└─ Phase 7: SEO/Performance (1 week)
└─ Phase 8-12: Testing, Deployment, Post-launch (2 weeks)
```

**Sections 8-12: Operations (Support)**
```
Section 8: Success Metrics
└─ Business metrics (leads, conversion rate)
└─ UX metrics (session duration, scroll depth)
└─ Technical metrics (performance, uptime)
└─ SEO metrics (organic traffic, rankings)
└─ Review cadence (weekly, monthly, quarterly)

Section 9: Environment Variables
└─ All config needed for deployment

Section 10: Deployment & Hosting
└─ Netlify setup guide
└─ Domain & DNS configuration
└─ SSL certificates

Section 11: Maintenance & Support
└─ Monthly/quarterly/annual tasks
└─ Common updates
└─ Troubleshooting guide

Section 12: Team Roles
└─ Who does what
└─ Client responsibilities
```

---

## Common Questions

### Q: How long is the template?

**A:** ~8,500 words. Takes 2-3 hours to customize for a specific client.

### Q: Do I have to use all sections?

**A:** No. Use Section 7 (Implementation Checklist) to decide scope.
- **MVP (4 weeks):** Sections 1-7 only
- **Standard (8 weeks):** Sections 1-12
- **Enterprise (12+ weeks):** Add custom sections

### Q: Can I modify the tech stack?

**A:** We don't recommend it. Section 3 is why the template works.

But if client insists:
1. Document trade-offs (cost, timeline, performance)
2. Create a separate variant PRD
3. Add +2-3 weeks to timeline

### Q: What if client doesn't have copy ready?

**A:** Use placeholder text for Week 1, swap in real copy as received.
Add 1 week to timeline for redesign with real copy lengths.

### Q: How do I customize for different industries?

**A:** See PRD_TEMPLATE_GUIDE.md section "Common Customization Scenarios"

Quick examples:
- **SaaS:** Emphasize features, free trial, pricing
- **Services:** Emphasize results, team, case studies
- **Local:** Emphasize location, hours, trust signals

### Q: Can I reuse components across projects?

**A:** Yes! Section 3 describes the full set of reusable Astro components organized into navigation, sections, blog, ui, and backgrounds groups.
Store them in a shared component library to save development time.

---

## Template Customization Examples

### Example 1: Minimal Scope (4 weeks)

**Client:** Small service business
**Remove from Section 7:**
- [ ] Admin dashboard → Leads go to email only
- [ ] Scroll animations → CSS basics only
- [ ] Advanced testing → Basic responsiveness only

**Result:** 4-week timeline, $6K budget

### Example 2: Standard Scope (8 weeks)

**Client:** Mid-market SaaS company
**Use as-is from template**

**Result:** 8-week timeline, $15K budget

### Example 3: Plus Scope (12+ weeks)

**Client:** Enterprise with CMS requirement
**Add to Section 4:**
```markdown
### 4.X Content Management System
- Integrate with Contentful/Strapi
- Allow non-technical content updates
- Requires Phase 13: CMS setup
```

**Result:** 12-week timeline, $25K+ budget

---

## Filling in Section 2: The "Client Input Checklist"

This is the most important section. It's what you send to the client.

### Create a Fillable Google Docs

1. Copy Section 2 into Google Docs
2. Add checkboxes using "List" → "Checkbox"
3. Share with client as "Edit" permission
4. Send email: "Please fill out this checklist by [DATE]"
5. Review comments in document
6. Lock document when complete

**Client sees:**
```
BRANDING & VISUAL IDENTITY

☐ Logo (PNG/SVG, transparent background)
  - Primary version (for light/dark backgrounds)
  - Favicon (16x16, 32x32, 64x64)
  - Where to provide: Please upload to shared folder

☐ Brand colors (provide as HEX codes)
  - Primary: [CLIENTS_ENTER_HERE]
  - Secondary: [CLIENTS_ENTER_HERE]
  - etc.
```

### Asset Collection Spreadsheet

Create a parallel spreadsheet for tracking:

| Asset | Status | Notes | Deadline |
|-------|--------|-------|----------|
| Logo | Pending | Waiting for high-res version | Jan 15 |
| Hero image | Received | Too large, reduce to 2MB | Jan 16 |
| Case studies | In progress | 2 of 3 submitted | Jan 20 |
| Translations | Not started | Need by Feb 1 | Feb 1 |

---

## Using Section 7: Implementation Checklist

### Week 1 Kickoff

**Project manager:**
1. Copy Section 7 into Asana/GitHub Projects/Trello
2. Assign tasks to team members
3. Set due dates
4. Add as recurring "Weekly standup" meeting

### Daily Standup

**Each team member:**
- [ ] Review tasks assigned to them
- [ ] Check off what was completed yesterday
- [ ] Flag any blockers
- [ ] Estimate when current task finishes

### Weekly Review

**Project manager:**
- Which Phase are we in?
- Are we on track for timeline?
- Any major blockers?
- Update client on progress

---

## Using Section 8: Success Metrics

### Before Launch

**PM + Client agree on targets:**

```
| Metric | Target (3mo) | Target (12mo) |
|--------|---|---|
| Monthly visitors | 500 | 1,500 |
| Form submissions | 10 | 50 |
| Conversion rate | 2% | 3% |
| Cost per lead | $150 | $50 |
```

### After Launch

**Track weekly:**
- Are we moving toward targets?
- What's underperforming?
- What's overperforming?

**Review monthly:**
- Full analytics deep dive
- Adjust strategy if needed
- Plan optimizations

---

## Most-Referenced Sections (During Project)

| Role | Sections | Frequency |
|------|----------|-----------|
| **Project Manager** | 1, 7, 8 | Daily |
| **Developer** | 3, 4, 7 | Daily |
| **Designer** | 2, 4, 6 | 3-4x per week |
| **Client** | 1, 2, 6 | Weekly |
| **Product Manager** | 1, 4, 5, 8 | 2-3x per week |
| **DevOps** | 3, 9, 10 | During deployment |
| **QA** | 4, 7, 8 | Testing phase |

---

## Shortcuts & Templates

### Shortcut 1: Copy Section 6 for Client

**Goal:** Get all copy from client in structured way

**How:**
1. Open Section 6: Content Template
2. Copy entire section into Google Docs
3. Send to client: "Please fill in all [CLIENT_TO_FILL] sections"
4. Set deadline (7-10 days)
5. Review for completeness

### Shortcut 2: Create Timeline Gantt Chart

**From Section 7, create visual timeline:**

```
Phase 1 (Week 1):  [████]  Setup
Phase 2 (Weeks 1-2): [█████] Structure
Phase 3 (Weeks 2-3): [█████] Components
Phase 4 (Week 3):    [███]  Scripts
Phase 5 (Week 4):    [███]  Pages
Phase 6 (Week 4):    [████] APIs
Phase 7 (Week 5):    [█████] SEO/Performance
Phase 8-12 (Weeks 6-7): [████████] Testing/Launch
```

Use this in kickoff meeting to set expectations.

### Shortcut 3: Create Client Onboarding Packet

**Package these with PRD when sending to client:**

1. **Asset Collection Checklist** (spreadsheet)
2. **Content Template** (copy from Section 6)
3. **Brand Guidelines** (if they have one)
4. **Timeline** (visual Gantt from Section 7)
5. **Team Contacts** (who to reach out to)
6. **Success Metrics** (what we're measuring)

---

## Red Flags: When Template Needs Adjustments

If during kickoff you hear:
- "We need a custom backend" → Add 4 weeks
- "We want mobile app too" → This is separate project
- "We don't have content ready yet" → Add 1 week buffer
- "CEO wants this in 2 weeks" → Reduce scope 50%
- "We need e-commerce" → Separate PRD needed

**Action:** Discuss with Product Manager before committing

---

## Version Control

**Keep it simple:**

```
PRD_Template.md (master v2.0, never touch)
  ├─ PRD_Acme_Corp_v2.0.md (Project kickoff)
  ├─ PRD_Acme_Corp_v2.1.md (After scope changes)
  ├─ PRD_Acme_Corp_FINAL.md (Approved version)
  └─ PRD_Acme_Corp_LAUNCH.md (As-built version, for reference)

[Store in Git: /docs/prd/[client_name]/]
```

---

## Next Steps

1. **Customize template for your client** (use this guide)
2. **Send Section 2 + Section 6 to client** (they fill in)
3. **Have kickoff meeting** (discuss Sections 1, 8, 12)
4. **Set up project management** (from Section 7)
5. **Start building** (follow Phase 1 checklist)

---

## Support

**Questions about template?**
- See PRD_TEMPLATE_GUIDE.md (detailed guidance)
- Check PRD_TEMPLATE.md (the actual template)
- Ask team lead or Product Manager

**Stuck during project?**
- Use Section 11 (Maintenance & Troubleshooting)
- Reference actual HypeDigitaly project (as example)
- Review Section 7 for next steps

---

Good luck! Questions? Ask the team.

**Created:** 2026-03-01
