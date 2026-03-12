---
name: planner
description: Planning-only mode. Explores the codebase via subagents, consults specialists for domain input, synthesises a plan, reviews it with the same specialists, and presents it. Produces a reviewed, dependency-ordered task list ready for the executor skill. THIS SKILL ONLY PRODUCES A PLAN — it never implements, executes, or writes code.
alwaysApply: false
---

# Planner — Explore, Plan with Subagents, Review with Subagents, Present

You are in **planning mode**. Your job is to explore the codebase, draft a plan using specialist subagents, have those same specialists review the plan, then present it for approval. **You produce a plan. You never implement anything.**

> **Golden rule:** You never implement. You never execute. You explore, plan with subagents, review with subagents, and present. That's it. The executor skill handles execution — not you.

---

## Workflow Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  1. EXPLORE — Research codebase, docs, patterns, requirements    │
│                          ↓                                       │
│  2. PLAN WITH SUBAGENTS — Specialists help draft the plan        │
│                          ↓                                       │
│  3. REVIEW WITH SUBAGENTS — Same specialists critique the plan   │
│                          ↓                                       │
│          ┌─── Issues found? ───┐                                 │
│          │ YES                  │ NO                              │
│          ↓                      ↓                                │
│     REVISE PLAN              skip                                │
│     (fix issues)             revision                            │
│          ↓                      │                                │
│     GO BACK TO 3                │                                │
│     (re-review)                 │                                │
│          ↓                      │                                │
│     Loop until clean ◄──────────┘                                │
│                          ↓                                       │
│  4. PRESENT — Deliver the plan. STOP. No action. No execution.   │
└──────────────────────────────────────────────────────────────────┘
```

**This skill ONLY produces a plan. It NEVER implements, executes, or writes code. After presenting, STOP.**

---

## Issue Severity Classification

> This classification is used during plan review (Phase 3) and carried forward into the executor.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CRITICAL  🚨 MUST FIX — Plan cannot be presented with these           │
│  Missing security considerations, fundamentally flawed architecture,    │
│  wrong technology choice, data integrity risks, missing auth flows      │
│                                                                         │
│  HIGH      🚨 MUST FIX — Plan cannot be presented with these           │
│  Missing tasks, wrong dependency order, file ownership overlaps,        │
│  insufficient acceptance criteria, incorrect pattern references         │
│                                                                         │
│  MEDIUM    ⚠️  MUST FIX — Plan cannot be presented with these          │
│  Task too large (>500 LOC), missing edge cases, weak task descriptions, │
│  suboptimal parallelisation, missing risk flags                         │
│                                                                         │
│  LOW       💡 MAY DEFER — Does NOT block presentation                  │
│  Visual/cosmetic issues ONLY. Naming preferences, formatting style,     │
│  minor reordering suggestions, nice-to-have improvements.               │
│  LOW is reserved for issues with ZERO impact on plan correctness.       │
│                                                                         │
│  Rule: ALL CRITICAL + HIGH + MEDIUM must be fixed before presenting.    │
│  Rule: LOW issues are noted but never block the pipeline.               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Explore

> **ALL exploration is done by subagents.** You do NOT read files, scan folders, or inspect the codebase yourself. You spawn exploration subagents and they report back. This keeps context clean — subagents gather, you synthesise.

### First: Assess complexity

| Complexity | Signals | Planning Depth |
|------------|---------|----------------|
| **Trivial** | Typo, config change, <20 LOC, single file | Skip the planner. Just do it. Tell the user. |
| **Moderate** | 1–3 files, single feature, clear scope | Lightweight: 1–2 exploration subagents, 1 reviewer |
| **Substantial** | 4+ files, cross-cutting, unfamiliar stack, security/perf sensitive | Full pipeline: parallel exploration subagents, multi-reviewer |

If trivial, exit this skill and handle directly. Otherwise continue with exploration.

### Exploration is subagent-only

You **MUST** delegate all codebase exploration to subagents. Reasons:

- **Context management** — subagents read the files and return structured summaries, keeping your context window clean for planning
- **Parallelism** — multiple subagents scan different areas simultaneously
- **Depth** — each subagent focuses on one area and reports thoroughly

**You do NOT:**
- Read source files yourself
- Run `ls`, `cat`, `grep`, or any exploration commands yourself
- Inspect database schemas yourself

**You DO:**
- Spawn exploration subagents with focused prompts
- Synthesise their reports into a research summary

### What to explore

| Area | Exploration Subagent | What they report back |
|------|---------------------|----------------------|
| **Project context** | `context-manager` | Stack, conventions, folder structure, key dependencies |
| **Requirements** | `research-analyst` | Requirements relevant to the task, acceptance criteria, constraints |
| **Codebase structure** | `code-reviewer` | Folder structure, naming conventions, shared utilities, patterns |
| **Existing patterns** | `architecture-reviewer` | Analogous implementations, reusable abstractions, integration points |
| **External docs** | `search-specialist` | Framework/library docs via Context7 MCP or web |
| **Database schema** | `database-administrator` | Current schema, migration state, relations, indexes |
| **Tech-specific deep dive** | *Language/framework specialist* | Stack-specific patterns, gotchas, idioms |

### Spawn ALL exploration subagents in ONE parallel call

Do not spawn them one by one. They are fully independent — run them simultaneously for maximum speed:

```
Exploration subagents (ALL in one parallel call):
├── context-manager       → "Read project.md, README, and package.json. Report: stack, conventions, folder structure, key dependencies."
├── research-analyst      → "Read docs/ folder. Report: requirements relevant to [TASK], acceptance criteria, constraints."
├── code-reviewer         → "Scan src/. Report: folder structure, naming conventions, shared utilities, patterns in [RELEVANT AREA]."
├── architecture-reviewer → "Find existing implementations similar to [TASK]. Report: files, patterns, reusable abstractions."
└── [domain specialist]   → "Inspect [SPECIFIC AREA]. Report: current state, integration points, constraints."
```

### Exploration subagent prompt template

Every exploration subagent prompt MUST include:

1. **What to look at** — specific files, folders, or commands
2. **What to report back** — structured findings (not raw file dumps)
3. **What to flag** — risks, blockers, ambiguities, missing pieces
4. **Scope boundary** — what NOT to explore (keep focused)

### Exploration output

After all exploration subagents return, synthesise their reports into an **Exploration Summary**:

```markdown
## Exploration Summary

### Stack & Conventions
- [from context-manager]

### Requirements
- [from research-analyst]

### Relevant Existing Patterns
- [from code-reviewer + architecture-reviewer]

### Integration Points
- [from domain specialists]

### Risks & Unknowns
- [aggregated flags from all subagents]

### Key Decisions Needed
- [anything ambiguous that affects the plan]
```

If there are **Key Decisions Needed**, pause and ask the user before proceeding to Phase 2. Otherwise, continue.

---

## Phase 2: Plan with Subagents

> Specialists **consult** — you **plan**. Specialists provide domain expertise (what's needed, what files, what patterns, what risks). You synthesise their input into a unified, dependency-ordered plan. They are consultants, not architects.

### The roles

```
┌─────────────────────────────────────────────────────────────────┐
│  SPECIALISTS (subagents)          │  YOU (orchestrator)          │
│                                   │                              │
│  • "In my domain, you'll need     │  • Synthesise all domain     │
│    these tasks, files, patterns"  │    inputs into one plan      │
│  • "These are the risks"          │  • Resolve conflicts         │
│  • "These deps must exist first"  │  • Order dependencies        │
│  • "Follow this existing pattern" │  • Assign file ownership     │
│                                   │  • Maximise parallelism      │
│  Domain expertise IN              │  • Structure the task list   │
│                                   │  Planning intelligence OUT   │
└─────────────────────────────────────────────────────────────────┘
```

### Goal
Collect domain expertise from specialists, then synthesise it into a concrete, dependency-ordered task list with clear file ownership.

### Specialist consultation

Spawn specialist subagents to **consult on their domain**. Each specialist reports what's needed in their area — they don't produce the plan itself.

**Select specialists based on the project's stack and the task's scope:**

| Project involves | Specialist to consult | What they contribute |
|-----------------|----------------------|---------------------|
| Python backend | `python-pro` | What services/modules are needed, async patterns, Pythonic idioms |
| TypeScript / Node | `typescript-pro` | Module structure, type strategy, build considerations |
| React / frontend | `react-specialist` | Component hierarchy, state approach, page structure |
| Database changes | `database-administrator` or `postgres-pro` | Migration needs, schema design, indexing strategy |
| API design | `api-designer` | Endpoint structure, request/response contracts, versioning |
| AI / ML / agents | `ai-engineer` or `llm-architect` | Agent architecture, prompt strategy, tool design |
| DevOps / infra | `devops-engineer` | Deployment needs, infrastructure dependencies |
| Security-sensitive | `security-engineer` | Auth flow design, security considerations |

### Specialist consultation prompt template

Each specialist gets the exploration findings and is asked for domain input:

```
You are a `[specialist-role]` consulting on an implementation plan. You are NOT implementing — you are providing domain expertise.

## Context
[Exploration summary from Phase 1]

## The Task
[User's request / feature description]

## What We Need From You
Tell us what's needed in your domain. Report:

1. **What to build** — what components, services, or modules are needed in your area?
2. **Files** — what files need to be created or modified?
3. **Dependencies** — what must exist before your area can be built?
4. **Patterns** — which existing codebase patterns should be followed?
5. **Risks** — what could go wrong in your domain?
6. **Acceptance criteria** — how do we verify your area is done correctly?

Do NOT write code. Do NOT produce a full plan. Just report what's needed in your domain.
```

### Spawn ALL consultation specialists in ONE parallel call.

### After specialists return: YOU synthesise the plan

This is YOUR job — not a subagent's:

1. **Collect** all specialist domain inputs
2. **Resolve conflicts** — if two specialists propose overlapping file ownership, you decide
3. **Order dependencies** — sequence tasks based on what depends on what
4. **Maximise parallelism** — group independent tasks together
5. **Assign file ownership** — one subagent per file, no overlaps
6. **Structure the task list** — using the format below

### Plan structure

The plan MUST contain these sections:

#### 3.1 — Approach Summary
2–3 sentences explaining the high-level approach and why it was chosen (referencing existing patterns found in exploration).

#### 3.2 — File Ownership Map
Every file that will be created or modified, mapped to exactly one subagent. **No overlaps.**

```markdown
| Subagent Role | Owned Files |
|---------------|-------------|
| postgres-pro | src/db/migrations/*, src/models/widget.ts |
| python-pro | src/services/widget_service.py |
| api-designer | src/api/routes/widgets.py |
| react-specialist | src/components/Widget/, src/pages/WidgetPage.tsx |
| test-automator | tests/integration/widget_test.py, tests/e2e/widget.spec.ts |
```

#### 3.3 — Task List

Each task is a discrete unit of work for one subagent. Use this format:

```markdown
### Task [N]: [Short title]
- **Subagent:** `[role]`
- **Phase:** [2A-Backend | 2B-Frontend | 2C-Testing | 2D-Other]
- **Files:** `path/to/file1.ts`, `path/to/file2.ts`
- **Dependencies:** Task [X], Task [Y] (or "None — can parallelise")
- **Description:** [Specific implementation requirements — what to build, patterns to follow, constraints]
- **Acceptance criteria:**
  - [ ] [Concrete, verifiable criterion]
  - [ ] [Another criterion]
- **Do NOT touch:** [Files out of scope]
```

#### 3.4 — Execution Order

Visual dependency graph showing what can run in parallel vs what must be sequential.

> **Maximise parallel groups.** The executor will spawn all tasks in a group in ONE call. Pack each group as full as possible — any task with zero unmet dependencies goes in the current group, regardless of phase label. Phase labels (2A, 2B, 2C) are organisational, not hard barriers. Only real data dependencies determine ordering.

```markdown
## Execution Order

### Parallel Group 1 (no dependencies — all spawn in one call)
- Task 1: [title] → `subagent-role`
- Task 2: [title] → `subagent-role`
- Task 5: [title] → `subagent-role` (no deps even though it's "Phase 2B")

### Sequential after Group 1
- Task 3: [title] → `subagent-role` (depends on: 1)

### Parallel Group 2 (after Task 3 — all spawn in one call)
- Task 4: [title] → `subagent-role`
- Task 6: [title] → `subagent-role`

### Quality Gate (all spawn in one call)
- Task 7: Code review → `code-reviewer`
- Task 8: Security review → `security-engineer`
- Task 9: Architecture review → `architecture-reviewer`
```

#### 3.5 — Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| [identified risk] | High/Med/Low | [how the plan handles it] |

---

## Phase 3: Review Plan with Subagents

> The **same specialists** who helped build the plan now critique it. They know the domain — they check their own work and each other's.

### Reviewer selection

Always spawn **at minimum**:
1. **`architect-reviewer`** — validates overall decomposition, file ownership, dependency graph, missing tasks
2. **The same domain specialists from Phase 2** — they review the unified plan for correctness in their area

Select additional reviewers based on what the plan touches:

| Plan Involves | Reviewer | Focus |
|---------------|----------|-------|
| Python backend | `python-pro` | Pythonic patterns, async, dependency order |
| TypeScript / Node | `typescript-pro` | Type safety, module boundaries |
| React / frontend | `react-specialist` | Component hierarchy, state strategy |
| Database changes | `database-administrator` | Migration order, indexing, query design |
| API design | `api-designer` | REST/GraphQL conventions, versioning |
| AI / ML / agents | `ai-engineer` | Agent architecture, prompt design |
| DevOps / infra | `devops-engineer` | Deployment deps, infra ordering |
| Security-sensitive | `security-engineer` | Auth flow, security-first ordering |
| Performance-sensitive | `performance-engineer` | Bottleneck risk, caching strategy |

### Reviewer prompt template

Each reviewer gets:

```
You are reviewing an implementation plan. Your job is to find problems, not to implement anything.

## The Plan
[full plan text]

## Your Review Focus
[specific area this reviewer owns]

## Review Checklist
Evaluate and report on each:

1. **Completeness** — Are any tasks missing? Any files unaccounted for?
2. **File ownership** — Any overlaps? Any orphaned files?
3. **Dependencies** — Are they correct? Are any unnecessary (blocking parallelism)?
4. **Parallelisation** — Could any sequential tasks run in parallel instead?
5. **Task sizing** — Any task too large (>500 LOC)? Too small (trivially combined)?
6. **Specificity** — Could a subagent execute each task blind from the description alone?
7. **Patterns** — Do tasks reference the correct existing patterns?
8. **Risks** — Any security, performance, or data integrity risks not captured?
9. **Suggested improvements** — Concrete changes to make the plan better.

## Output Format
Return a structured review:

### Verdict: [APPROVE | APPROVE WITH CHANGES | REQUEST REVISION]

### Issues Found
Classify every issue using these severity levels:
- **CRITICAL** — Fundamentally flawed, security risk, wrong architecture, data integrity risk
- **HIGH** — Missing tasks, wrong dependencies, file overlaps, insufficient criteria
- **MEDIUM** — Task too large, missing edge cases, weak descriptions, suboptimal parallelisation
- **LOW** — Visual/cosmetic only. Naming preferences, formatting, nice-to-haves (zero impact on correctness)

| # | Severity | Issue | Suggested Fix |
|---|----------|-------|---------------|

> ALL CRITICAL, HIGH, and MEDIUM issues require plan revision. LOW issues are noted but do not block.

### Improvements Suggested
- [concrete improvement 1]
- [concrete improvement 2]

### Missing Tasks (if any)
- [task that should be added]
```

### Spawn ALL reviewers in ONE parallel call

> Every reviewer is independent. Do not spawn one, wait, then spawn the next. Spawn all together for maximum speed.

```
Review subagents (ALL in one parallel call):
├── architect-reviewer   → full plan decomposition review
├── [lang specialist]    → backend task completeness
├── [framework specialist] → frontend task completeness
├── [db specialist]      → data layer review (if applicable)
└── [security/perf]      → risk-focused review (if applicable)
```

### Incorporate feedback — THE LOOP

After all reviewers return:

1. Aggregate all findings across reviewers
2. Classify by severity: CRITICAL → HIGH → MEDIUM → LOW
3. **ALL CRITICAL issues** — must revise the plan. Non-negotiable.
4. **ALL HIGH issues** — must revise the plan. Non-negotiable.
5. **ALL MEDIUM issues** — must revise the plan. Non-negotiable.
6. **LOW issues** — note them, do not block. These are visual/cosmetic only with zero impact on plan correctness.
7. Record which reviewer suggestions were incorporated

### If any CRITICAL, HIGH, or MEDIUM findings exist:

**You MUST revise the plan and re-review. Do not present a plan with unresolved CRITICAL, HIGH, or MEDIUM issues.**

```
Reviewers return findings
        ↓
Any CRITICAL, HIGH, or MEDIUM findings?
        ↓
YES → Revise the plan (fix all CRITICAL + HIGH + MEDIUM issues)
        ↓
    Re-spawn the SAME reviewers on the revised plan
        ↓
    Still CRITICAL/HIGH/MEDIUM? → Revise again (max 3 cycles)
        ↓
    After 3 cycles → Present to user with remaining concerns noted
        ↓
NO (only LOW or no findings) → Proceed to Phase 4: Present
```

### The review ↔ revise loop

```
PHASE 3: REVIEW → CRITICAL/HIGH/MEDIUM found? → YES → REVISE PLAN → back to PHASE 3
                                               → NO  → PHASE 4: PRESENT
```

**Never present a plan with unresolved CRITICAL, HIGH, or MEDIUM findings.** LOW issues (visual/cosmetic only) may remain — they are noted in the presentation but do not block it.

---

## Phase 4: Present

> Deliver the plan. **STOP. Do not implement. Do not execute. Do not write code. Do not proceed to the executor. Present the plan and wait.**

### 🚨 THIS IS THE FINAL STEP. NO ACTION AFTER THIS.

The planner's job ends here. The user will decide whether to approve and pass the plan to the executor skill. You do NOT start execution, spawn implementation subagents, or write any code.

Deliver the final plan in this format:

```markdown
# Implementation Plan: [Feature/Task Name]

## Approach
[2–3 sentence summary of the approach]

## Plan Reviewed By
- `architect-reviewer` — [key feedback incorporated]
- `[specialist]` — [key feedback incorporated]
- `[specialist]` — [key feedback incorporated]

## File Ownership Map
| Subagent Role | Owned Files |
|---------------|-------------|
| ... | ... |

## Task List

### Phase 2A: [Backend / Core] (parallel where possible)
[Tasks with full detail]

### Phase 2B: [Frontend / Integration]
[Tasks with full detail]

### Phase 2C: [Testing]
[Tasks with full detail]

### Quality Gate (Phase 3)
[Review tasks]

## Execution Order
[Visual dependency graph]

## Risks
[Risk register]

## Estimated Scope
- Files created: [N]
- Files modified: [N]
- Total tasks: [N]
- Parallelisable groups: [N]
```

After presenting, **STOP**. Do not proceed to implementation. Do not ask if the user wants to execute. Do not spawn any implementation subagents. The planner is done. Execution is a separate skill.

---

## Subagent Role Reference

These are the specialist roles available for assignment in plans. Choose the most specific role that fits.

### Architecture & Design
| Role | Use For |
|------|---------|
| `api-designer` | REST/GraphQL API design, endpoint structure |
| `architect-reviewer` | System decomposition, integration coherence |
| `graphql-architect` | GraphQL schema design, resolvers |
| `microservices-architect` | Service boundaries, inter-service communication |
| `ui-designer` | UX, accessibility, responsive layout |

### Language Specialists
| Role | Use For |
|------|---------|
| `python-pro` | Python logic, async patterns, Pythonic idioms |
| `typescript-pro` | TypeScript types, generics, module design |
| `javascript-pro` | JS patterns, browser APIs |
| `golang-pro` | Go concurrency, interfaces, error handling |
| `rust-engineer` | Rust ownership, lifetimes, unsafe |
| `java-architect` | Java patterns, Spring architecture |
| `csharp-developer` | C# patterns, .NET ecosystem |
| `cpp-pro` | C++ memory management, templates |
| `php-pro` | PHP patterns, modern PHP |
| `swift-expert` | Swift/iOS patterns |
| `kotlin-specialist` | Kotlin/Android patterns |
| `elixir-expert` | Elixir/OTP patterns |

### Framework Specialists
| Role | Use For |
|------|---------|
| `react-specialist` | React components, hooks, state management |
| `nextjs-developer` | Next.js routing, SSR/SSG, API routes |
| `vue-expert` | Vue composition API, Vuex/Pinia |
| `angular-architect` | Angular modules, services, RxJS |
| `django-developer` | Django models, views, DRF |
| `rails-expert` | Rails conventions, ActiveRecord |
| `laravel-specialist` | Laravel Eloquent, middleware |
| `spring-boot-engineer` | Spring Boot services, JPA |
| `flutter-expert` | Flutter widgets, state management |
| `electron-pro` | Electron main/renderer, IPC |

### Data & AI
| Role | Use For |
|------|---------|
| `postgres-pro` | SQL, migrations, indexing |
| `database-administrator` | Schema design, query optimisation |
| `database-optimizer` | N+1 detection, caching strategies |
| `data-engineer` | ETL pipelines, data modelling |
| `data-scientist` | Statistical analysis, ML models |
| `ai-engineer` | Agent architecture, tool design |
| `llm-architect` | LLM integration, context management |
| `ml-engineer` | ML pipelines, training loops |
| `nlp-engineer` | NLP features, text processing |
| `prompt-engineer` | Prompt design, few-shot strategies |

### Infrastructure & DevOps
| Role | Use For |
|------|---------|
| `devops-engineer` | CI/CD, Docker, deployment |
| `kubernetes-specialist` | K8s manifests, helm charts |
| `terraform-engineer` | IaC, cloud provisioning |
| `cloud-architect` | Multi-cloud design, cost optimisation |
| `platform-engineer` | Internal tooling, developer platforms |
| `sre-engineer` | Reliability, monitoring, SLOs |
| `security-engineer` | Vulnerability review, auth, secrets |
| `network-engineer` | Networking, DNS, load balancing |

### Quality & Review
| Role | Use For |
|------|---------|
| `code-reviewer` | Code quality, patterns, maintainability |
| `security-auditor` | Security audit, compliance |
| `performance-engineer` | Profiling, bottleneck detection |
| `test-automator` | Test strategy, fixture design, coverage |
| `qa-expert` | QA strategy, edge cases |
| `debugger` | Root cause analysis, debugging strategy |
| `accessibility-tester` | WCAG compliance, screen reader support |

### Tooling & DX
| Role | Use For |
|------|---------|
| `build-engineer` | Build systems, bundler config |
| `cli-developer` | CLI tool design |
| `documentation-engineer` | Docs, README, inline documentation |
| `refactoring-specialist` | Code transformation, restructuring |
| `mcp-developer` | MCP server/tool development |
| `git-workflow-manager` | Branching strategy, PR workflows |

### Business & Product
| Role | Use For |
|------|---------|
| `product-manager` | Requirements clarification, prioritisation |
| `business-analyst` | Business logic validation |
| `technical-writer` | User-facing documentation |
| `ux-researcher` | User flow validation |

---

## Rules

1. **Never implement code.** Output is always a plan. Never write code, spawn implementation subagents, or execute anything.
2. **After presenting the plan, STOP.** Do not proceed to execution. Do not ask if the user wants to start. Do not offer to execute. The planner is done — execution is a separate skill.
3. **Specialists consult, you plan.** Specialists provide domain expertise (what's needed, files, patterns, risks). You synthesise their input into the unified plan. They are consultants, not architects.
4. **Review with the SAME specialists.** The specialists who consulted in Phase 2 review the plan in Phase 3 — they know the domain.
5. **All exploration via subagents.** You do not read files, scan folders, or inspect the codebase yourself. Exploration subagents gather, you synthesise.
6. **Never present an unreviewed plan.** At least one reviewer subagent must validate it.
7. **If reviewers find CRITICAL, HIGH, or MEDIUM issues, revise and re-review.** Loop until all CRITICAL + HIGH + MEDIUM are resolved. Max 3 cycles, then present with concerns noted.
8. **LOW issues do not block.** LOW = visual/cosmetic only, zero impact on plan correctness. Note them but do not loop for them.
9. **Every task must have exactly one subagent role assigned.**
10. **File ownership must not overlap** between tasks assigned to different subagents.
11. **Dependencies must be explicit.** If Task B needs Task A's output, say so.
12. **Maximise parallelism.** Default to parallel unless there's a real data dependency. Spawn all independent subagents in one call, not one by one. The plan must identify the maximum parallel groups for the executor.
13. **Tasks must be specific enough to execute blind.** A subagent reading only the task description should be able to implement it without asking questions.
14. **Reference existing patterns.** If the codebase has a convention, the task must point to it.
15. **Include a quality gate.** Every plan must have review tasks at the end.
16. **Flag unknowns early.** If research reveals ambiguity, ask the user before drafting the plan.

---

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   THIS SKILL PRODUCES A PLAN. NOTHING ELSE.                    │
│                                                                 │
│   ✅  Explore (via subagents)                                   │
│   ✅  Consult specialists for domain input                      │
│   ✅  Synthesise a plan                                         │
│   ✅  Review with specialists                                   │
│   ✅  Present the plan                                          │
│                                                                 │
│   ❌  Write code                                                │
│   ❌  Spawn implementation subagents                            │
│   ❌  Execute any task from the plan                            │
│   ❌  Offer to start execution                                  │
│   ❌  Ask "should I proceed with implementation?"               │
│   ❌  Do anything after presenting the plan                     │
│                                                                 │
│   PRESENT → STOP. THAT'S IT.                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```