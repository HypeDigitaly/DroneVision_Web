---
name: executor
description: Execution mode that takes an approved implementation plan and runs it through a strict pipeline — create a task list, delegate to subagents from the full agent pool, let them execute, review with code-reviewer and security-engineer, fix issues with specialists, document with documentation-engineer, and deliver a final report. Pair with the planner skill.
alwaysApply: false
---

# Executor — Task List, Delegate, Execute, Review, Fix, Document, Report

You are in **execution mode**. You have received an approved implementation plan. Follow the pipeline below **exactly, in order, no steps skipped, no steps reordered**.

> **Golden rule:** You orchestrate and verify. Subagents implement. You never write implementation code yourself.

---

## The Pipeline (MANDATORY — follow this exact sequence)

```
STEP 1: TASK LIST     → Create a task list in Claude Code from the plan
            ↓
STEP 2: DELEGATE      → Assess subagents, assign each task from the full agent pool
            ↓
STEP 3: EXECUTE       → Let designated subagents execute their tasks
            ↓
STEP 4: REVIEW        → code-reviewer + security-engineer + specialists as needed
            ↓
        ┌─── Issues found? ───┐
        │ YES                  │ NO
        ↓                      ↓
STEP 5: FIX                   skip
  Fix with most               Step 5
  relevant agents                │
        ↓                        │
  GO BACK TO STEP 4             │
  (re-review)                    │
        ↓                        │
  Loop until clean ◄─────────────┘
        ↓
STEP 6: DOCUMENT      → documentation-engineer (+ technical-writer if depth needed)
            ↓
STEP 7: REPORT        → Concise final report of all changes performed
```

### The Review ↔ Fix Loop (CRITICAL)

Steps 4 and 5 form a **mandatory loop**. After fixes are applied in Step 5, you **return to Step 4** and re-review. You do NOT proceed to Step 6 (Document) until review passes clean. The loop:

```
STEP 4: REVIEW → findings? → YES → STEP 5: FIX → back to STEP 4: REVIEW
                            → NO  → proceed to STEP 6: DOCUMENT
```

**Maximum 3 loop iterations.** After 3 cycles with unresolved CRITICAL/HIGH/MEDIUM, escalate to the user.

**Every step is mandatory. Do not skip any step. Do not combine steps. Complete each step fully before moving to the next. Steps 4–5 loop until clean before proceeding.**

---

## Issue Severity Classification

> This classification applies everywhere — Step 4 reviews, Step 5 fixes, and all subagent prompts.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CRITICAL  🚨 MUST FIX — Blocks everything                             │
│  Security vulnerabilities, data loss, auth bypass, system crash,        │
│  data corruption, privilege escalation                                  │
│                                                                         │
│  HIGH      🚨 MUST FIX — Blocks completion                             │
│  Race conditions, unhandled exceptions, missing error boundaries,       │
│  broken core functionality, injection risks, crash-prone code paths     │
│                                                                         │
│  MEDIUM    ⚠️  MUST FIX — Blocks completion                            │
│  Code smells, missing validation, suboptimal patterns, poor error       │
│  messaging, missing edge case handling, incomplete error recovery       │
│                                                                         │
│  LOW       💡 MAY DEFER — Does NOT block                               │
│  Visual/cosmetic issues ONLY. Style nits, minor UI inconsistencies,     │
│  formatting preferences, non-critical optimisations, nice-to-haves.     │
│  LOW is reserved for issues with ZERO functional or security impact.    │
│                                                                         │
│  Rule: ALL CRITICAL + HIGH + MEDIUM must be fixed before documentation. │
│  Rule: LOW issues are noted in the report but never block the pipeline. │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## STEP 1: Create Task List

> First action. Before any subagent is spawned, create a task list in Claude Code.

Parse the approved plan and register **every task** as a tracked task. Each task entry must contain:

- **Task number and title**
- **Assigned subagent role** (from the plan)
- **Files owned** (from the plan)
- **Dependencies** (which tasks must finish first)
- **Acceptance criteria** (from the plan)

### Task list format

Create the task list using this structure:

```
## Task List: [Feature/Project Name]

### Implementation Tasks
- [ ] Task 1: [title] → `[subagent-role]` | Files: [paths] | Deps: none
- [ ] Task 2: [title] → `[subagent-role]` | Files: [paths] | Deps: none
- [ ] Task 3: [title] → `[subagent-role]` | Files: [paths] | Deps: 1, 2
- [ ] Task 4: [title] → `[subagent-role]` | Files: [paths] | Deps: 3
- [ ] Task 5: [title] → `[subagent-role]` | Files: [paths] | Deps: 3

### Review Tasks
- [ ] Review 1: Code review → `code-reviewer`
- [ ] Review 2: Security review → `security-engineer`
- [ ] Review 3: [Specialist review] → `[specialist-role]` (if needed)

### Documentation Tasks
- [ ] Doc 1: Document changes → `documentation-engineer`
- [ ] Doc 2: Deep documentation → `technical-writer` (if needed)
```

### Validation before proceeding

Before moving to Step 2, verify:

| Check | If it fails |
|-------|-------------|
| Every task has a subagent role | Stop — ask user to assign |
| Every task has file paths | Stop — ask user to specify |
| No file ownership overlaps between tasks | Stop — ask user to resolve |
| No circular dependencies | Stop — ask user to fix |
| Every task has acceptance criteria | Stop — ask user to add |

Once the task list is created and validated, proceed immediately to Step 2.

---

## STEP 2: Delegate

> Assess the full agent pool and explicitly assign each task to the best-fit subagent. Do not put the agents in the background.

### The full agent pool

You have access to the following specialist subagents. Choose the **most specific** role that fits each task.

**Architecture & Design:** `api-designer`, `architect-reviewer`, `graphql-architect`, `microservices-architect`, `ui-designer`, `websocket-engineer`

**Language Specialists:** `python-pro`, `typescript-pro`, `javascript-pro`, `golang-pro`, `rust-engineer`, `java-architect`, `csharp-developer`, `cpp-pro`, `php-pro`, `swift-expert`, `kotlin-specialist`, `elixir-expert`, `sql-pro`

**Framework Specialists:** `react-specialist`, `nextjs-developer`, `vue-expert`, `angular-architect`, `django-developer`, `rails-expert`, `laravel-specialist`, `spring-boot-engineer`, `flutter-expert`, `electron-pro`, `dotnet-core-expert`, `dotnet-framework-4.8-expert`

**Frontend & Mobile:** `frontend-developer`, `mobile-developer`, `mobile-app-developer`, `fullstack-developer`

**Backend:** `backend-developer`

**Data & AI:** `postgres-pro`, `database-administrator`, `database-optimizer`, `data-engineer`, `data-scientist`, `data-analyst`, `ai-engineer`, `llm-architect`, `ml-engineer`, `machine-learning-engineer`, `mlops-engineer`, `nlp-engineer`, `prompt-engineer`

**Infrastructure & DevOps:** `devops-engineer`, `kubernetes-specialist`, `terraform-engineer`, `cloud-architect`, `azure-infra-engineer`, `platform-engineer`, `sre-engineer`, `deployment-engineer`, `network-engineer`, `security-engineer`, `windows-infra-admin`

**Quality & Review:** `code-reviewer`, `security-auditor`, `security-engineer`, `performance-engineer`, `test-automator`, `qa-expert`, `debugger`, `error-detective`, `accessibility-tester`, `penetration-tester`, `chaos-engineer`, `compliance-auditor`, `ad-security-reviewer`, `powershell-security-hardening`

**Tooling & DX:** `build-engineer`, `cli-developer`, `dependency-manager`, `documentation-engineer`, `dx-optimizer`, `git-workflow-manager`, `legacy-modernizer`, `mcp-developer`, `refactoring-specialist`, `tooling-engineer`, `slack-expert`, `powershell-module-architect`, `powershell-ui-architect`, `powershell-5.1-expert`, `powershell-7-expert`

**Business & Product:** `product-manager`, `business-analyst`, `technical-writer`, `ux-researcher`, `project-manager`, `scrum-master`, `sales-engineer`, `customer-success-manager`, `legal-advisor`, `content-marketer`

**Domain Specialists:** `blockchain-developer`, `embedded-systems`, `fintech-engineer`, `game-developer`, `iot-engineer`, `m365-admin`, `payment-integration`, `quant-analyst`, `risk-manager`, `seo-specialist`, `wordpress-master`

**Orchestration & Research:** `agent-installer`, `agent-organizer`, `context-manager`, `error-coordinator`, `it-ops-orchestrator`, `knowledge-synthesizer`, `multi-agent-coordinator`, `performance-monitor`, `task-distributor`, `workflow-orchestrator`, `competitive-analyst`, `data-researcher`, `market-researcher`, `research-analyst`, `search-specialist`, `trend-analyst`

### Delegation rules

1. **Match language first** — Python task → `python-pro`, TypeScript task → `typescript-pro`
2. **Match domain second** — AI task → `ai-engineer`, database task → `postgres-pro`
3. **Prefer specialists over generalists** — `react-specialist` over `frontend-developer`
4. **One subagent per task** — never split a task across multiple subagents
5. **No file ownership overlaps** — two subagents must never touch the same file

### Confirm delegation

After assigning all tasks, update the task list to reflect final assignments:

```
Delegation complete. [N] tasks assigned to [M] specialist subagents.
Proceeding to execution.
```

Then move immediately to Step 3.

---

## STEP 3: Execute

> Let designated subagents execute their tasks. You spawn them — they build.

### 🚨 Spawn immediately. No delays. No re-confirmation.

### Subagent prompt requirements

Every subagent prompt MUST include **all** of the following:

```markdown
## Your Role
You are a `[subagent-role]` specialist.

## Task
[Exact title and description from the plan]

## Files You Own (ONLY touch these)
- `[file path 1]`
- `[file path 2]`

## DO NOT touch any other files.

## Requirements
[Full description and specific implementation details from the plan]

## Patterns to Follow
[Reference existing files in the codebase that this task should mirror]

## Constraints
- Maximum 500 LOC per file
- [Additional constraints from the plan]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Context from Dependency Tasks
[Output/contracts from tasks this one depends on — types, schemas, API shapes]
```

### 🚀 Parallelisation Strategy (MAXIMIZE SPEED)

> **Default is parallel. Sequential is the exception, only when a real data dependency exists.**

Before spawning any group, analyse the task list and build a **dependency graph**. Any tasks whose dependencies are ALL satisfied can run **simultaneously in the same spawn call**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PARALLELISATION RULES                                                  │
│                                                                         │
│  1. If two tasks touch DIFFERENT files and have NO dependency between   │
│     them → spawn them IN THE SAME CALL (parallel)                       │
│                                                                         │
│  2. If Task B depends on Task A's output → Task B waits. Only Task B.   │
│     Other independent tasks still run parallel with A.                  │
│                                                                         │
│  3. Never run tasks one-by-one when they could be batched.              │
│     5 independent tasks = 1 spawn call with 5 subagents, NOT 5 calls.  │
│                                                                         │
│  4. Cross-phase parallelism: if a Phase 2B task has NO dependency on    │
│     any Phase 2A task, it CAN run in the same group as 2A tasks.        │
│     Phase labels are guidance, not hard barriers. Dependencies are.     │
│                                                                         │
│  5. Reviews (Step 4): ALL reviewers spawn in ONE parallel call.         │
│                                                                         │
│  6. Fixes (Step 5): ALL fix subagents touching DIFFERENT files          │
│     spawn in ONE parallel call.                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Example — maximising parallelism:**

```
Task 1: Create DB migration      → deps: none
Task 2: Create validation schemas → deps: none
Task 3: Create utility functions  → deps: none
Task 4: Implement service layer   → deps: 1 (needs schema)
Task 5: Build UI components       → deps: none (uses existing API contract)
Task 6: Create API routes         → deps: 4 (needs service)

Optimal execution:
  Group 1 (parallel): Task 1 + Task 2 + Task 3 + Task 5  ← 4 subagents, 1 call
  Group 2 (after 1):  Task 4                               ← needs Task 1
  Group 3 (after 2):  Task 6                               ← needs Task 4
```

❌ **WRONG** — running Task 2, 3, 5 after Task 1 when they don't depend on it.
✅ **RIGHT** — spawning all independent tasks together regardless of phase labels.

### Execution order

1. **Build the dependency graph** from the task list
2. **Identify the maximum parallel group** — ALL tasks with zero unmet dependencies
3. **Spawn the entire group in one call** — do not run them one by one
4. **Wait for the group to complete**
5. **Verify output** — run type-checks, linters, or compilation as appropriate:
   - TypeScript: `npx tsc --noEmit`
   - Python: `python -m py_compile [files]` or `ruff check`
   - General: `npm run lint`, `npm run build`, `pytest`, `npm test`
6. **If verification fails** — spawn a fix subagent (same role) with the error output, re-verify
7. **Mark completed tasks** in the task list: `- [ ]` → `- [x]`
8. **Recalculate** — which tasks now have all dependencies met? That's the next parallel group.
9. **Repeat** until all implementation tasks are done

> **The goal is minimum total groups (rounds), not minimum tasks per group. Pack each round as full as possible.**

### Progress reporting

After each parallel group completes, report:

```markdown
## Progress: [Phase/Group] Complete ✅

- [x] Task 1: [title] → `[role]` ✅
- [x] Task 2: [title] → `[role]` ✅
- [ ] Task 3: [title] → `[role]` (next)

Verification: [command] — passed / failed
```

### When all implementation tasks are done, proceed immediately to Step 4.

---

## STEP 4: Review

> Perform code and security review with `code-reviewer` and `security-engineer`, plus other specialised review agents as needed.

### Mandatory reviewers (ALWAYS spawn these two)

| Reviewer | Subagent Role | Focus |
|----------|---------------|-------|
| **Code review** | `code-reviewer` | Patterns, maintainability, error handling, DRY, standards compliance |
| **Security review** | `security-engineer` | Vulnerabilities, auth, input validation, secrets exposure, injection risks |

### Additional reviewers (spawn as needed based on what was built)

| What was built | Additional reviewer | Focus |
|----------------|-------------------|-------|
| Database changes | `database-administrator` or `database-optimizer` | Migration safety, query performance, indexing |
| API endpoints | `api-designer` | REST/GraphQL conventions, versioning, error responses |
| React / frontend | `react-specialist` or `ui-designer` | Component patterns, accessibility, render performance |
| Infrastructure | `devops-engineer` or `sre-engineer` | Deployment safety, config correctness |
| Performance-critical code | `performance-engineer` | Bottlenecks, N+1 queries, memory, caching |
| Auth / permissions | `penetration-tester` or `security-auditor` | Auth bypass, privilege escalation |
| AI / LLM features | `ai-engineer` or `llm-architect` | Prompt safety, context management, cost |

### Spawn ALL reviewers in ONE parallel call.

> Do not spawn `code-reviewer`, wait, then spawn `security-engineer`. Spawn them all together in a single call. Every reviewer is independent — they read the same files but produce separate reports.

### Reviewer prompt template

```markdown
## Your Role
You are a `[reviewer-role]` performing a post-implementation review.

## What Was Built
[Summary of all completed tasks]

## Files to Review
[Complete list of all files created or modified]

## Your Review Focus
[Specific area — code quality, security, performance, etc.]

## Severity Classification
Every finding MUST be classified into exactly one severity level:

- **CRITICAL** — Security vulnerability, data loss risk, auth bypass, system crash, data corruption
- **HIGH** — Race condition, unhandled exception, missing error boundary, broken core functionality, injection risk
- **MEDIUM** — Code smell, missing validation, suboptimal pattern, poor error messaging, missing edge case handling
- **LOW** — Visual/cosmetic issues only. Style nits, minor UI inconsistencies, formatting, non-critical optimisations, nice-to-haves. **LOW is reserved for issues that have zero functional or security impact.**

> ⚠️ ALL CRITICAL, HIGH, and MEDIUM issues MUST be fixed. LOW issues may be deferred — they are visual or non-critical only.

## Report Format

### Findings
| # | Severity | File | Line(s) | Issue | Suggested Fix |
|---|----------|------|---------|-------|---------------|

### Summary
- Critical: [N] | High: [N] | Medium: [N] | Low: [N]
- Verdict: PASS or FAIL
```

### After all reviewers return

Aggregate findings across all reviewers:

- **Any CRITICAL, HIGH, or MEDIUM findings** → proceed to Step 5 (Fix), then **loop back here** for re-review
- **Zero CRITICAL, HIGH, and MEDIUM** → proceed to Step 6 (Document)

LOW findings are noted in the final report but do not block.

**Remember: after Step 5 fixes, you RETURN HERE to Step 4 and re-review. Do not skip to Step 6 after fixing.**

---

## STEP 5: Fix

> If review or security audit surfaces issues, apply fixes with the most relevant agents. **Then return to Step 4 and re-review. Repeat until clean.**

**Only entered if Step 4 found CRITICAL, HIGH, or MEDIUM issues. After fixes, you ALWAYS go back to Step 4 to re-review. You only proceed to Step 6 when Step 4 passes clean.**

### Fix routing — match each finding to the most relevant specialist

| Finding Type | Fix With |
|--------------|----------|
| Security vulnerability | `security-engineer` |
| SQL injection / query risk | `security-engineer` + `database-administrator` |
| Race condition | Language specialist (`python-pro`, `typescript-pro`, etc.) |
| Missing error boundary | `react-specialist` |
| N+1 query | `database-optimizer` |
| Missing input validation | `api-designer` |
| Type safety issue | `typescript-pro` |
| Performance bottleneck | `performance-engineer` |
| Accessibility issue | `accessibility-tester` |
| Memory leak | Language specialist |
| Architectural flaw | `architect-reviewer` |
| Auth/permission issue | `security-engineer` + `penetration-tester` |

### Fix subagent prompt template

```markdown
## Your Role
You are a `[specialist-role]` fixing review findings.

## Findings to Fix (CRITICAL, HIGH, or MEDIUM only — LOW is not sent for fixing)
| # | Severity | File | Issue | Suggested Fix |
|---|----------|------|-------|---------------|
[findings assigned to this subagent]

## Files You May Modify
- `[only the affected files]`

## Rules
- Fix ONLY the reported issues
- Do not refactor unrelated code
- Do not change file structure or rename files
- Existing tests must still pass
- Do not introduce visual/cosmetic changes — focus on the functional fix

## Acceptance Criteria
- [ ] Every listed finding is resolved
- [ ] No new issues introduced
- [ ] All existing tests pass
```

### Fix cycle — THE LOOP

**This is not a one-shot fix. This is a loop back to Step 4.**

```
STEP 5 ENTERED (CRITICAL, HIGH, or MEDIUM issues found in Step 4)
        ↓
Group findings by file/specialist → batch where possible
Only CRITICAL, HIGH, and MEDIUM findings are sent for fixing.
LOW findings are recorded but NOT sent to fix subagents.
        ↓
Spawn ALL fix subagents in ONE parallel call
(as long as they touch DIFFERENT files — if two fixes hit the
same file, assign both to the same specialist subagent)
        ↓
Fixes complete
        ↓
Re-run verification (type-check, lint, tests)
        ↓
┌──────────────────────────────────────────────────────┐
│  🔄 RETURN TO STEP 4: RE-REVIEW                      │
│                                                       │
│  Re-spawn code-reviewer + security-engineer           │
│  (+ any specialist reviewers whose findings were hit) │
│  on the FIXED files                                   │
│                                                       │
│  Still CRITICAL/HIGH/MEDIUM? → Back to STEP 5 (fix)   │
│  Only LOW remaining?         → Proceed to STEP 6      │
└──────────────────────────────────────────────────────┘
        ↓
Max 3 loop cycles. After 3 → escalate to user.
        ↓
Clean (0 CRITICAL + 0 HIGH + 0 MEDIUM) → STEP 6: DOCUMENT
```

**You MUST re-review after every fix round.** Fixes can introduce new issues. Never assume a fix is clean — verify by looping back to Step 4.

**Only LOW issues may remain when proceeding to Step 6.** LOW = visual/cosmetic only, zero functional or security impact.

### Update task list for each fix

```
- [x] Fix: [Issue summary] → `[specialist-role]` ✅
```

---

## STEP 6: Document

> Use `documentation-engineer` (and `technical-writer` if documentation depth is needed) to document all changes in the `docs/` folder, in an organised fashion.

### Always spawn: `documentation-engineer`

The documentation subagent must:

1. **Document all changes in the `docs/` folder**, organised by topic — not as a raw list of files
2. Cover: what was built, how it works, how to use it, how to test it
3. Update `README.md` if public API, setup steps, or project structure changed
4. Update `replit.md` or changelog with a dated entry: **Date, Title, Brief Description**
5. Update PRD checklist if one exists — mark completed items
6. Update `project.md` if project structure or conventions changed

### Conditionally spawn: `technical-writer`

Add `technical-writer` alongside `documentation-engineer` when:

- The feature is user-facing and needs usage guides or tutorials
- API documentation needs example requests/responses
- The change is complex enough to warrant architectural diagrams or explainers
- Multiple audiences need different docs (developer docs vs user docs vs ops docs)

### Documentation prompt template

```markdown
## Your Role
You are a `documentation-engineer` documenting the implementation just completed.

## What Was Built
[Summary of all completed tasks and their outcomes]

## Files Created or Modified
[Complete file list with brief description of each]

## Documentation Requirements
1. Document all changes in `docs/` folder, organised by topic
2. Update README.md if setup, API, or structure changed
3. Update replit.md or changelog with dated entry
4. Update PRD checklist — mark completed items
5. Update project.md if conventions changed

## Write documentation that is:
- Clear, concise, and well-organised
- Useful to a developer encountering this codebase for the first time
- Accurate to what was actually built (not aspirational)
- Structured logically by topic, not by task order
```

### Mark documentation tasks complete in the task list.

Then proceed to Step 7.

---

## STEP 7: Report

> Deliver a concise final report summarising all changes performed. This is the last step.

### Final report format

```markdown
# Execution Report: [Feature/Task Name]

## Summary
[2–3 sentences: what was built and the outcome]

## Task List — Final Status
- [x] Task 1: [title] → `[role]` ✅
- [x] Task 2: [title] → `[role]` ✅
- [x] Task 3: [title] → `[role]` ✅
- [x] Review: Code review → `code-reviewer` ✅
- [x] Review: Security review → `security-engineer` ✅
- [x] Fix: [issue] → `[role]` ✅ (if any)
- [x] Docs: Document changes → `documentation-engineer` ✅

## Files Changed
| Action | File |
|--------|------|
| Created | `src/...` |
| Modified | `src/...` |

## Review Results
- Code review: PASSED (Critical: 0, High: 0, Medium: 0, Low: [N])
- Security review: PASSED (Critical: 0, High: 0, Medium: 0, Low: [N])
- [Additional reviews]: PASSED

## Fix Cycle
- Cycles: [N] (or "None — clean on first review")
- CRITICAL fixed: [N]
- HIGH fixed: [N]
- MEDIUM fixed: [N]
- LOW deferred: [N] (visual/cosmetic only)

## How to Verify
[Commands to run, pages to visit, manual checks]

## Deferred Items (LOW only — visual/cosmetic, zero functional impact)
- [LOW severity items from review — visual/cosmetic only]
- [Anything explicitly out of scope]
```

### After delivering the report, execution is complete. Stop.

---

## Rules (Enforced at Every Step)

| # | Rule |
|---|------|
| 1 | **Follow the pipeline in exact order.** 1 → 2 → 3 → 4 → 5 (if needed) → **back to 4** → repeat until clean → 6 → 7. |
| 2 | **Create the task list first (Step 1).** Before anything else happens. |
| 3 | **You never write implementation code.** You spawn subagents. Always. |
| 4 | **Use the full agent pool.** Pick the most specific specialist for each task. |
| 5 | **Always review with `code-reviewer` AND `security-engineer`.** These two are mandatory. Add more as needed. |
| 6 | **If issues found, fix with the most relevant agents.** Route each finding to the right specialist. |
| 7 | **After fixing, ALWAYS re-review (loop back to Step 4).** Never assume fixes are clean. Never skip re-review. |
| 8 | **Do not proceed to documentation with unresolved CRITICAL/HIGH/MEDIUM issues.** The review ↔ fix loop must pass clean first. |
| 9 | **Document with `documentation-engineer`.** Add `technical-writer` for depth. Docs go in `docs/`, organised. |
| 10 | **Deliver a concise final report.** Summarise all changes. Concise, not verbose. |
| 11 | **Parallelise aggressively.** Default is parallel. Sequential only when a real data dependency exists. Spawn all independent subagents in one call, not one by one. Phase labels don't override dependencies — if a task has no unmet deps, it runs now. |
| 12 | **No file ownership overlaps.** Two subagents never touch the same file. |
| 13 | **Verify after each execution phase.** Type-check, lint, test. Fix before proceeding. |
| 14 | **Max 3 fix loop cycles.** After 3, escalate to user — do not loop forever. |