# Tool Boundaries, Reliability and Failure Recovery

## Capability ≠ authorization ≠ evidence

Evaluate three different questions before every effect:
1. **Available:** is the intended tool, runtime, environment or host genuinely connected and capable?
2. **Allowed:** does the current user request and project profile permit **this specific action** on this target/ref/data class?
3. **Proven:** what observation/receipt would demonstrate the action actually succeeded?

A text prompt, SKILL.md or advertised plugin name does not create a tool connection, scope or permission. A successful API transport acknowledgment is not necessarily a persisted state transition or an accepted product result.

## Tool design contract (for project-owned engines)

A useful tool should have stable:
- explicit `operation`, typed inputs, target identity and source/expected revision;
- declared read-only vs mutating effects, risk and idempotency semantics;
- concise, structured success/error reasons with affected scope and receipt;
- discoverable capabilities that load on demand, without dumping all tool schemas;
- bounded retry, cancellation, rollback or manual reconciliation guidance.

This is a **design standard** for tools owned by individual projects, not a new gateway or generic tool server. Project systems keep their actual MCP/REST/desktop implementations and source authority.

## Action and transport boundaries

| Situation | Required response |
| --- | --- |
| GitHub read/search | Pin explicit working ref; distinguish partial search from exact source |
| GitHub write | Check permissions, current blob/HEAD and concurrency; no unapproved fallback |
| Local code execution | Require real checkout and toolchain; match proof to revision |
| Native desktop/game/device | Require connected target observation; do not infer live acceptance from source |
| External send/payment/deploy | Separate explicit user authority, target, effect and receipt |
| ChatGPT conversation integration | Use documented authorized host capabilities; do not infer session control from a browser tab or GitHub link |

Do not infer an ability to run, read, write or automate ChatGPT conversations from a coding agent's ability to open a web page. Codex/OpenCode can act as hosts or workers only within the documented interfaces and permissions actually configured.

## Deterministic first, generative only where useful

Use the cheapest grounded query, schema check, hash, diff, parser or exact-state assertion before invoking broad agent reasoning if those checks fully settle the task. Conversely, do not replace qualitative judgment or visual acceptance with a purely numeric proxy. A deterministic gate is not a reason to ignore missing meaningful evidence.

## Failure classes and retry ceilings

Classify `SOURCE_DEFECT`, `CONTRACT_MISMATCH`, `STALE_EVIDENCE`, `TOOL_UNAVAILABLE`, `PERMISSION_DENIED`, `CONCURRENT_UPDATE`, `UNKNOWN_OUTCOME` or `NATIVE_NOT_VERIFIED`. Only retry after obtaining evidence that distinguishes the suspected cause. A denied operation is not a transient error to route around.

For non-idempotent actions with missing acknowledgement, **inspect persisted state before retrying**. If the receiving tool cannot expose it, keep status uncertain. Stop after repeated retries without new evidence, avoid hidden automatic side effects and report a concrete blocker.
