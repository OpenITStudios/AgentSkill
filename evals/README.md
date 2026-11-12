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
