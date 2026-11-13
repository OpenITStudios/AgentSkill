# Evidence, Quality and Recovery Contract

## Proof taxonomy
| Label | Allowed claim | Not allowed |
| --- | --- | --- |
| `SOURCE_REVIEWED` | Exact files/commit inspected; source-level invariant checked | Runtime working |
| `SOURCE_COMMITTED` | Change committed; exact resulting SHA known | Tests passed |
| `TEST_AUTHORED_NOT_RUN` | Test cases or scripts prepared | Test successful |
| `EXECUTED_TEST_PASS` / `EXECUTED_TEST_FAIL` | Executed test and its actual result with runner, inputs and revision | Unexecuted host or native acceptance |
| `LIVE_TARGET_VERIFIED` | Actual connected target tested and observed; target identity and revision recorded | Transfer proof to a different host/version |
| `NOT_EXECUTED` | Evidence unavailable, tool absent, or testing held | PASS, CERTIFIED or READY |

Never invent an execution receipt, approval, performance number or claim of observed behavior. Source at one SHA and tests at another SHA are not a matched proof unless the equivalence is established.

## Surface and phase labels — never confused with test PASS

- `SOURCE_IN_PROGRESS` / `SOURCE_READY_FOR_LOCAL` are **architecture/source phase statuses**, not proof that an application was built or executed.
- `LOCAL_TEST_DEFERRED` is the correct default in `CHATGPT_GITHUB`. It requires **no user request or workaround**; explicitly state only when material.
- `LOCAL_VALIDATION` requires an observed user-PC agent host, actual local tool context and user-selected transition. `LOCALLY_VERIFIED` requires matched actual executed evidence.
- A source-only ChatGPT/GitHub run cannot claim local/native PASS even if a code sandbox, CI tool or uploaded transcript exists.

## Minimum evidence receipt
`taskId; repository; branch/ref; headSHA; actor/host; mode; changedOwners; action; testCommandOrObservation; outcome; evidencePointer; limitations; unresolved; timestamp(if actually observed)`.
The receipt is a reporting schema, not a command to create a separate status database for every task.

## Quality gates
1. **Standards adherence:** authorization, selected branch and core invariant preserved.
2. **Specification fit:** changed behavior satisfies the actual user goal, not a proxy metric.
3. **Preservation:** impacted consumers, interfaces, data safety and expected negative behavior checked.
4. **Proof fit:** test tier matches the claim and target context.
5. **Efficiency:** no redundant rounds or newly invented scaffolding with no decision value.

A completed source change may be `SOURCE_COMMITTED + NOT_EXECUTED`; that is a legitimate bounded result when execution is unavailable. Mark remaining evidence explicitly.

## Goal acceptance before STOP

Check **two independent axes** against the user's scoped result: **Specification** (the requested behavior/output and affected consumers are complete) and **Standards** (branch/permissions, safety, compatibility, absence of material regressions and truthful proof). A clean diff, passing formatting check, large number of files changed, or apparent progress cannot substitute for the actual requested result.

Use the **smallest sufficient evidence**: current authorized source owner, affected interfaces and changed-path reconciliation; relevant positive/negative cases if they change a decision; actual execution evidence only when the permitted host has really run it. Mark an unsupported runtime claim `NOT_EXECUTED`, not `PASS`, and do not repeatedly inspect unrelated sources to fill that gap.

At the source proof ceiling, decide: **CONTINUE** only for an unmet material in-scope acceptance item; **BLOCKED** for a required forbidden/unavailable action or unresolved material safety risk; or **DONE → STOP** when scope, preservation and available evidence are complete. Separate optional observations from unmet acceptance. A finished goal does not implicitly authorize a new goal or perpetual follow-up work.

## Context and recovery checkpoint
Keep the smallest recoverable packet: `Goal | Task mode | Repo | selected branch | observed SHA | user-authorized effects | active holds | primary owner | accepted decisions | completed | remaining | proof tier | next safe action`. On recovery, re-pin HEAD and compare current source; do not replay a prior unconfirmed write.

Stop when the success condition is met; a required approval/permission is missing; a hold applies; the evidence ceiling prevents a claim; or retries do not reduce uncertainty. Make the blocker concrete, not a generic handoff request.
