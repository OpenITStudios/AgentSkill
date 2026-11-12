---
name: oits-agent-quality-review
description: Review and improve AI instructions, Agent Skills, SOP, routing, security and evaluation quality when the task explicitly concerns agent behavior. Do not run model tests without actual permitted hosts, install vendor skills automatically or replace product-specific quality checks.
---

# Agent Quality Review — Evidence-driven

## Trigger / non-trigger
Activate for an explicit audit, regression, design or repair request about agent rules, skill activation, prompting quality, context efficiency, permission handling or recovery. **Do not activate** for ordinary product work merely because an AI is performing it.

## Analysis contract
`Failure example | Desired behavior | Current rule/skill owner | Observed trace/absence | Positive trigger | Negative trigger | Collision | Required proof | STOP`.

## Procedure
1. Pin AgentSkill version and candidate project's rule revision. Inspect actual instructions selected by the host where observable; source files alone do not prove effective loading.
2. Identify exact behavior gap. Categorize `ROUTING`, `PERMISSION`, `TOOL_USE`, `CONTEXT`, `EVIDENCE`, `STOP` or `DOMAIN_HANDOFF`. Avoid a generic "AI was confused" diagnosis.
3. Prepare case(s) in `evals/cases.json` covering a positive case, negative control, conflicting authority and an adversarial/pressure variant where relevant.
4. Amend the smallest canonical instruction or skill owner. Keep the shared byte-for-byte contract and do not duplicate policy in downstream domain skills.
5. Run static validation when available and allowed. Run repeated real Codex/OpenCode host evaluations only when explicitly permitted and actually connected. Report attempts, conditions and observed traces; compare against baseline.
6. Mark `SOURCE_REVIEWED` or `TEST_AUTHORED_NOT_RUN` if runtime behavior was not measured. Unproven quality gains remain hypotheses.

## Output
Exact changed owner, rationale, scenario IDs, source checksum/revision, observable checks actually performed, missing behavioral proof, cross-repo impact and STOP. Do not promote an unverified experimental prompt to universal authority.
