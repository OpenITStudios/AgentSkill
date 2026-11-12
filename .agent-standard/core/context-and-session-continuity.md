# Progressive Context and Session Continuity

**Goal:** minimum **sufficient** decision context with full preservation of safety, fidelity and evidence. Smaller text is a proxy; correctness and accepted output come first.

## Load progressively

`ROUTE → REQUIRED → CONDITIONAL → REUSE → STOP LOADING`

- **ROUTE:** identify goal, mode, primary owner, branch and actual host context.
- **REQUIRED:** current loaded root rules, selected profile (including holds), relevant owner and decisive source/evidence; one selected procedure if needed. Never trim mandatory safety or acceptance to fit a byte budget.
- **CONDITIONAL:** one source/module/skill reference whose answer could alter the next decision. Open only that section before expanding.
- **EXCLUDED by default:** all Skills, historical reports, vendor dumps, unrelated workstreams, private data without authorization and unavailable native-tool assumptions.
- **REUSE:** reuse a still-current source actually present in the agent's effective context. A URL, filename, hash or `context_ready` bit alone does **not** prove that its contents survived compaction.
- **STOP LOADING:** sufficient evidence reached, or the remaining action requires authorization/another host. Do not continually browse to avoid a decision.

## Stable instruction prefix / volatile task tail

Keep universal policy and reusable procedure stable. Keep current user delta, branch HEAD, selected model/asset, tool observations and pending checks in a **bounded dynamic tail**. Avoid appending session-specific facts to global `AGENTS.md` or shared Skills. Host caching is host-controlled: a byte-identical prefix is not evidence of a cache hit or token savings.

The source index and owner map are discovery tools, not proof. Open the authoritative content when needed; do not trust stale compacted summaries or historical commits over the current selected ref.

## Quality-first context budget

Assess overlong instructions for genuinely repeated text and redundant authority, not merely character count. A required quality constraint or visual acceptance witness must not be discarded to meet an arbitrary size threshold. Measure **cost to accepted result** (time/tool work/retry/corrections and real token telemetry if actually available) after checking acceptance quality. Do not promise exact allowance reduction from file size alone.

## Evidence invalidation

Every material mutation can invalidate observations of affected artifacts. Reuse an evidence receipt only if it has an identified source revision, scope/coverage, actor and unchanged dependencies. A successful tool call is not proof of the complete visual/semantic outcome. Do not request fresh full-repo evidence unless a relevant change has made prior proof stale.

## Safe compaction checkpoint

Preserve exactly the decision-critical packet:

`GOAL | RESULT | MODE | REPO | SELECTED_REF | LAST_OBSERVED_HEAD | AUTHORIZED_EFFECTS | HOLDS | PRIMARY_OWNER | REQUIRED_SOURCE/REVISIONS | COMPLETED_RECEIPTS | UNKNOWN_OUTCOMES | REQUIRED_PROOF | NEXT_SAFE_STEP`

Checkpoint is a recovery aid, not an alternate truth store. After restarting, re-pin selected ref and verify current source. Reload any mandatory material genuinely lost during compaction; do not pretend a summary contains an unread reference. Never replay a non-idempotent write simply because it appeared as a pending step.

## Anti-loop

If two retries yield no new discriminating evidence, stop that retry strategy and reclassify the failure. Continue only independent safe work; identify the missing proof, actor or permission. A task is complete when accepted criteria are met—not when a context or token budget is exhausted.
