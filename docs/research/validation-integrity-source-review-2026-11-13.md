# Evidence Integrity — Publisher-Source Review (2026-11-13)

**Goal:** fix the observed false confidence of string-only validation and reinforce source-backed decision-making and context-goal continuity. **Proof limit:** source research and inspection only; no Node, Codex, OpenCode, Claude Code, local-PC/native tests, CI or hosted execution performed.

## Original publisher references and applied decisions

| Source | Grounded transferable observation | Decision |
| --- | --- | --- |
| [Google Testing Blog — Test Behavior, Not Implementation](https://testing.googleblog.com/2013/08/testing-on-toilet-test-behavior-not.html) | User-facing behavior is usually the useful acceptance target, not internals alone | Do not claim an instruction works from its words |
| [Martin Fowler — Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) | Focused lower-level checks are cheaper; duplicated tests need separate confidence value | Two bounded negative source fixtures, no new runner |
| [OpenAI — Harness Engineering](https://openai.com/index/harness-engineering/) | Developer feedback and explicit acceptance criteria can strengthen agent workflows; source-specific tools should not be assumed available universally | Improve existing owners, not add agents |
| [OpenAI — Agent Evaluation Best Practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) and [Evaluate Agent Workflows](https://developers.openai.com/api/docs/guides/agent-evals) | Grading model decisions needs actual examples/traces and a clear reference; token presence is insufficient | Distinguish source check, L1-L3 behavior and proof gaps |
| [GitHub — Commit API](https://docs.github.com/en/rest/commits/commits) and [REST API Best Practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api) | Partial commit results and rate-limit/unknown outcomes need careful reconciliation | Retain existing GitHub rules, no blind retries |
| [OWASP — LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) | Keyword/regex detection is not a security boundary; external data is not higher-priority permission | Leave real security enforcement with tools/profile, not Markdown checker |

## Confirmed source defect

At AgentSkill `main@eaae9c9e7ce8f8daafae24d37c912afcb34300d3`, `tools/standard.mjs` validates STOP with global `includes(...)` checks. A directive that *encourages* unnecessary polish could retain the words `optional polish`, `OPTIONAL_OR_UNRELATED` and `STOP` while violating the intended rule. The planned correction checks the actual prohibition inside its owning section and authors a bounded inverted-direction fixture. This is a narrow source-level check, **not** a parser for arbitrary Markdown semantics or a proof that the agent obeys.

The same audit found a concrete syntax defect in `tests/standard.test.mjs`: one declaration is `async () {` instead of `async () => {`. This is observable in the exact source, **not** evidence that a Node parser was executed. Repair it within the existing test file; keep test execution on hold.

## Acceptance and explicit limits

- Keep all three shared Skill IDs, eight method IDs and the current package version `0.1.0-draft`.
- Keep the existing validator, documentation owner, GitHub read/write and proof boundaries; no new agent, testing framework, separate truth store or third-party install.
- Author only negative fixtures that detect actual reversed policy direction, not tests that just count keywords.
- Add a small number of normative decision/proof cases; do not claim these were executed.
- This work is **DONE at source level** after one coherent commit and exact GitHub object/source verification. Future behavioral evaluation needs a separate authorized host.

