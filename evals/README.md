# AgentSkill Evaluation Corpus

`cases.json` contains **normative expected/forbidden behaviors** for portable coding-agent governance. It is **not** a history of actual Codex/OpenCode model runs, a claim of correctness, or a native-product test.

## Levels
- `L0_STATIC` — deterministic file/profile/manifest/parity cases. Current validator checks structure and copies; not every scenario is executable yet.
- `L1_ROUTING` — whether the agent chooses the correct owner/skill and refuses an irrelevant one.
- `L2_WORKFLOW` — allowed action sequence, evidence accuracy, recovery and STOP.
- `L3_ADVERSARIAL` — malicious untrusted text, fake authority, CI/test-hold pressure, unsafe supply chain.

## Case contract
Each case has `id`, `level`, `title`, `request`, `context`, `expected`, `forbidden` and `severity`. Keywords are normative rubric labels; they are **not** traces. Expected positive behavior and forbidden negative behavior are both necessary.

## Running real host evaluations (future, separately authorized)
Pin (a) standard version/SHA, (b) target repo/ref SHA, (c) host/model/version/config, (d) exact effective instruction paths, and (e) case fixtures. Execute repeated trials in isolated disposable state, record tool calls, refusals, outcome, cost and unsupported capabilities. Compare baseline to candidate with both specification and safety scoring. Do not collect secrets or private user content into a public eval corpus.

No live model evaluations are executed as part of this foundation.

## Consolidated behavior coverage (cases GOV-029–GOV-044)

These cases extend the original baseline for context reloading, private-source handling, native proof freshness, overlong Skills, method-selection abstention, canonical owner isolation, speculation about token cost, unknown-outcome idempotency, source trust and cross-owner handoff. They remain **normative oracles only**; real model traces require separately authorized execution.


## Execution-surface and host identity coverage (GOV-045–GOV-066)

Cases verify the two different work methods, **no ChatGPT localtest demands**, no GitHub Actions/cloud test substitutes, completion of primary architecture before localtest, delayed handoff, exact native host/tool origin, agent application vs model provider, and version-specific Claude Code/OpenCode instruction loading. These are **expected outcomes only**; no case was executed on a real local agent during source design.

## User understanding and visual explanations (GOV-067–GOV-084)

`communication-rubric.json` defines response-quality gates and future human evaluation of time to correct understanding. Cases distinguish simple direct replies, diagrams for actual workflows, jargon reduction, requested technical depth and essential factual limitations. This is **normative source only**, not a completed readability study or model PASS.

## Method activation coverage (GOV-085–GOV-108)

The eight legacy methods have positive and negative cases. For material source changes, Karpathy and Ponytail are evaluated as **one** combined pass. Pstack, Harness², DeepSeek Harness, REA, UI UX Pro Max, and Matt Pocock must be selectively used or rejected. An authored evaluation corpus is not an executed model comparison.

## GitHub commit continuity and context recovery (GOV-109–GOV-128)

Source-only cases check meaningful subject + typed material body, truthful Proof and status, stable topic, one safe Next, and topic-scoped continuation in a new ChatGPT chat. No case requires or claims localtest, GitHub Actions or cloud verification.

The offline commit checker validates **message structure**, not whether the code actually works or a prior Next is permitted. A material GitHub commit with truthful values remains subject to source/permission review. A later host evaluation is needed to measure whether cross-chat context recovery improves.

## GitHub commit tiers and branch recovery (GOV-129–GOV-150)

Additional normative cases distinguish three commit tiers, safe diffs, nondefault branch recovery, path rename/pagination fallback, current-status precedence, and the inability of a format check to certify source or test correctness. All remain **NOT_EXECUTED** until an authorized PC-local agent measures them.

**GOV-129–GOV-150** specifically test proportional commit tiers, narrow trivial diff admission, protected-source escalation and branch/path-scoped context recovery. They are authored normative cases, not executed model results.

## GitHub commit source identity and recovery pilots (GOV-151–GOV-168)

The source-backed pilot examines actual selected branch snapshots, topic-specific commits, status-owner precedence, missing Next fields and revision-limited native evidence. New normative scenarios check parent/HEAD mismatch, changed-file scope, pagination, rename fallback, untrusted snapshot origin and old-test-SHA boundaries. The offline snapshot test code is **authored but NOT_EXECUTED**; no model benchmark, localtest or CI was run.

**GOV-169–GOV-170:** exact branch-with-slash recovery when a connector URL fails, and preservation of nested AGENTS before repository adoption. Authored source cases, not executed host checks.

## Adaptive workstream recovery and release discipline (GOV-171–GOV-190)

Twenty source-only normative cases cover adaptive depth, older targeted history, interleaved topics, superseded decisions, checkpoint/HEAD divergence, stale proof and release-only numbering. No real host/model/native tests were executed; behavioral improvement remains NOT_MEASURED.

## Non-destructive rule categories and upstream provenance (GOV-191–GOV-200)

Ten additional **normative, not executed** scenarios cover preserving existing installed Skills/agents, method-versus-Skill ownership, selective upstream freshness, community attribution, relevant file/blob comparison, permission/injection resistance and no automatic version bump. They are not evidence of actual host conformance or continuous monitoring.

## Original upstream Skill identity and effective host evidence (GOV-201–GOV-210)

Ten additional **normative, not executed** cases distinguish reference-only methods from publisher-owned original source, authentic installed files, host-selected instruction paths, real MCP/CLI capability and task-use receipts. They also prevent false claims based on mirrored repositories, missing assets, transformed installers, newer instructions with older runtime servers, or a source-only GitHub session. No external original Skill was installed and no behavioral agent trial was executed.

## Skill activation reliability (GOV-211–GOV-220)

Ten additional **normative, not executed** cases cover selecting the right core Skill, no-Skill abstention, preserving product-domain owners, optional-method nonactivation, missing host discovery, shadowed IDs and false use claims. The static validator enforces the existing routing table and discovery metadata only; it cannot measure L1 agent choices. Real Codex/Claude Code/OpenCode host trials remain `NOT_EXECUTED`.

## Frozen Skill activation evaluation (not executed)

[Machine-readable pilot](skill-activation-pilot.json) reuses GOV-211–GOV-220 without duplicating them; [pilot and observation protocol](skill-activation-pilot.md) defines fair baseline/candidate comparison, host receipts, eligible FN/FP denominators, safety/integrity gates and blocked/unverified exclusions. **No real host test or metric has been measured.**

## Evidence integrity and negative source inversion (GOV-231–GOV-236)

Six normative, **not executed** cases distinguish observed source from inferred causes, disallow source-only runtime PASS, and preserve the origin of instructions through session recovery. Two negative regression-source tests preserve the route marker but reverse the operative STOP and GitHub recovery directive. Even when executed, this is a narrow L0 check; it does not certify arbitrary Markdown semantics or real agent behavior.

## Result-first communication and next-step integrity (GOV-237–GOV-242)

Six additional **normative, not executed** scenarios cover clear actor/action/object sentences, scannable completed work, evidence limits, a visible final next step or terminal STOP, legitimate approval blockers, simple-answer abstention, and preservation of the user's language despite English source documentation. These cases are expected outcomes only; no user comprehension, host behavior or response-time study has been run.

## Visual-first comprehension and readability (GOV-243–GOV-248)

Six additional **normative, not executed** scenarios require the response format to match the information task: comparison tables, short directional process diagrams, charts only for sourced comparable numerical data, no visuals for simple facts, evidence-first audit tables and accessible text alternatives. These cases do not assert faster reading, successful rendering or improved host behavior. The communication rubric remains `NORMATIVE_NOT_MEASURED`.

## Three reading-zone separation (GOV-249)

One **normative, not executed** case specifies how material ChatGPT updates should distinguish Current status, Explanation and a final Next step using restrained headings and a single subtle divider, without colored cards or repeated conclusions. Existing cases continue to cover simple-answer abstention and terminal STOP. The response standard and rubric define the expected presentation, but no ChatGPT renderer or user-comprehension outcome has been measured.

## Execution identity in material commit history (GOV-250–GOV-253)

Four new **normative, not executed** cases distinguish the ChatGPT/GitHub API work method from a separately verified user-PC agent host, prohibit inferred local claims from model/branch names, preserve historical commits without `Surface` as environment-unrecorded, and discourage redundant Git/model metadata. The new-message checker requires the exact `Surface` grammar; the historical snapshot reader may accept legacy messages without granting any execution authority. A syntactically valid field does not prove actual host usage or test execution.

## Broad research and intent readiness (GOV-254–GOV-261)


Eight **normative, not executed** cases cover original source and alternative discovery, mirror duplication, material UX ambiguity before implementation, fast paths for bounded changes, avoiding repeated questions, separating design approval from mutation authorization, evidence-based research STOP, and honest coverage limits. Static source checks are not host behavioral evaluation, research recall or PC-local tests.

## Terminal report consistency and conditional history (GOV-276–GOV-281)

Six **normative, not executed** cases cover read-only audits with separately proposed repairs, genuinely terminal STOP, remaining authorized work, permission blockers, current-source-first history avoidance, and deeper history when workstream evidence is missing. The written source regression controls cannot measure actual host decisions. No localtest, CI or model benchmark was performed.
