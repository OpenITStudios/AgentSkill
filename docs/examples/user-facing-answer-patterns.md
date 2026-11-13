# Examples — Clear Actions, Visible Results and One Next Step

These examples demonstrate **presentation patterns**, not actual user records, executed tests or evidence of model behavior. The authoritative standard is `.agent-standard/core/user-facing-communication.md`. All documentation examples are in English; the assistant must still answer in the user's language.

## Visual-first examples — one view per information task

**Comparison request:** "Compare three implementation approaches by compatibility, cost and maintenance burden."

Prefer a compact table. Keep aligned criteria side by side; do not write a separate feature paragraph and card for every approach. If a value is unknown, label it **Unknown** rather than guessing.

| Approach | Compatibility evidence | Implementation burden |
| --- | --- | --- |
| A | Verified in the selected source | Low |
| B | Not yet verified | Medium |
| C | Not yet verified | Unknown |

*Illustrative values only; not a real product assessment.* State the principal tradeoff in one sentence under the table.

**Workflow request:** "Show the source-to-validation handoff." Use a short directional diagram, not a large table of sequential steps. Existing section E demonstrates the source-to-local workflow. Keep arrows true to the actual process and write its essential meaning in one sentence.

**Numeric-trend request:** "Show how failure rate changed over four measured periods." Use a chart **only after retrieving comparable measured values, units and periods**. Add a brief interpretation and, where appropriate, an accessible numeric table. Never draw a chart from invented percentages.

**One-line question:** "Did the tests run?" Say "No. The tests were written but not executed." No chart, table, diagram or Next step is needed.

**Long audit:** Open with the key finding. Use one prioritized table for issues, grounded evidence and ownership, then an explicit final decision. Avoid repeating the same items as cards, a pie chart and another summary.

**Accessibility and small screens:** Use short row/column headers, visible units, meaningful labels beyond color, and a textual equivalent for informative diagrams. For a very wide table, narrow its criteria or split it; do not shrink text until it becomes difficult to read.

## A. Simple factual answer — no template

**User asks:** "Did the local tests run?"

**Avoid:** "Based on the various stages of implementation, the local testing process remains scheduled for a later operational phase."

**Prefer:** "No. I reviewed the source, but nobody has run the tests on your computer."

Do not append headings, a diagram, a next-step panel or an invented task to a simple answer.

## B. Repository update — completed work and proof

**User asks:** "What did you change?"

**Prefer:**

> The agent updated the routing rules on the selected GitHub branch.
>
> **Completed work**
> - The agent clarified the positive and negative Skill activation conditions.
> - The agent preserved the existing shared Skills.
>
> **Evidence and limits**
> The current GitHub commit contains the source changes. No local tests ran.
>
> **Next step:** None — STOP. The source-only task is complete.

Each sentence identifies an actor, action and result. Do not call the changes "tested" when only GitHub source was reviewed.

## C. Blocked task — explicit next actor

**User asks:** "Can you publish the release now?"

**Prefer:**

> I prepared the release notes, but I did not publish a release.
>
> **Completed work:** I checked the version and the release notes against the selected source.
>
> **Evidence and limits:** The repository requires explicit release approval.
>
> **Next step:** The repository owner must approve the release before any publish action.

A missing approval is a blocker, not a completed release or an invitation to bypass permissions.

## D. Finished goal — do not create follow-up work

**User asks:** "Is the requested source correction complete?"

**Prefer:**

> I corrected the requested source issue and checked the affected files in GitHub. The task is complete at the source-review proof level; runtime tests remain deferred.
>
> **Next step:** None — STOP.

**Avoid:** "Next step: Refactor the architecture, add another evaluator, and repeat a full repository audit." A completed goal does not authorize unrelated polishing.

## E. Multi-stage process — use a small diagram

**User asks:** "How does source work move from ChatGPT to a PC-local agent?"

**Prefer:**

```text
ChatGPT + GitHub
       ↓
Source development and source review
       ↓
Source-ready handoff (not tested)
       ↓
Separately authorized PC-local validation
```

ChatGPT finishes the source work. The PC-local agent runs tests only after the user authorizes that phase. GitHub Actions do not substitute for PC-local tests.

## F. Expert review — keep the requested depth

**User asks:** "Review the API contract, affected callers, migration risk and acceptance evidence."

**Prefer:** Start with the decision, then explain the exact API changes, caller impact, compatibility risks and evidence by owner or topic. End with one necessary next action, or a terminal STOP. Do not truncate required technical detail to meet a word-count target.

## G. Unmeasured benefit — no invented percentage

**User asks:** "Did this communication standard reduce reading time by 60%?"

**Prefer:** "We have not measured that. The source defines a clearer response structure, but reading-time improvement needs comparable user observations."

**Non-goal:** These patterns do not introduce a mandatory reply template, a new response-rendering engine, extra agents or an obligation to show a next-step heading in every answer.
