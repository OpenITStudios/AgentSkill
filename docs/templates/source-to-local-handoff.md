# Source → Local-PC Validation Handoff (Template)

> **Timing:** Write this only when the agreed main architecture and source implementation are complete. This document is **not** a request for immediate localtest, a local execution receipt or automatic authorization to run tests. Never use cloud/GitHub Actions to fill missing local evidence.

## Source identity and readiness

- Repository: `<repo>`
- Selected branch: `<branch>`
- Reviewed and committed source HEAD: `<SHA>`
- Architecture state: `SOURCE_READY_FOR_LOCAL` / `SOURCE_IN_PROGRESS` (choose honestly)
- Exact source scope, completed modules and owners: `<list>`
- Source files/contracts touched and critical integration edges: `<list>`
- Source-only review performed: `<diff/commit/owner evidence>`
- Tests/fixtures **authored but not executed**: `<list or none>`
- Remaining architecture blockers: `<none or explicitly list; cannot claim SOURCE_READY_FOR_LOCAL if material unresolved>`

## Local validation plan — deferred

- Candidate actual local host: `CLAUDE_CODE` / `CODEX_CLI` / `OPENCODE` / `NOT_SELECTED`
- Native/OS/toolchain targets to **verify upon local transition**, not assumed installed: `<list>`
- Local checks to execute **later when selected and permitted**: `<commands/expected outcomes>`
- Native/visual acceptance criteria requiring real target: `<list>`
- Project test holds, protected data and forbidden actions: `<list>`
- Observed tools currently unavailable via ChatGPT/GitHub: `<list>`

## Feedback contract

When local validation occurs, record source SHA, local checkout/dirty state, actual host and tool execution target, command/test results, native observations and repro steps. Return concrete source defects to the first wrong owner. A new source HEAD does not inherit historical test PASS.

**Status:** `SOURCE_COMMITTED / SOURCE_REVIEWED; LOCAL_TEST_DEFERRED; CI_CLOUD_NOT_USED`.

**No localtest requests should be sent by ChatGPT during active source-development cycles.** Users decide when to begin local validation.
