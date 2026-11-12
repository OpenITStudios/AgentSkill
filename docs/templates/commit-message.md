# Commit Body Template — For Material Work

Paste only the template **values that reflect observed work**. Do not invent evidence. This is a source-authoring template, **not a required extra repository file**.

```text
type(scope): concrete outcome

Goal: <user outcome; why this change matters>
Work: <stable-topic> — <actual change and affected source owner>
State: ACTIVE | BLOCKED | PAUSED | DONE; <phase if relevant>
Proof: <observed source/test evidence and unexecuted limits>
Decision: <important constraint or must-preserve behavior>
Unresolved: <one material open issue, or None>
Next: <one safe authorized next source action, or STOP>
Refs: <optional current canonical paths or issue ID>
```

Good default for ChatGPT+GitHub: `SOURCE_REVIEWED; TEST_AUTHORED_NOT_RUN; LOCAL_TEST_DEFERRED` **only if those descriptions accurately match the work**. Never run or request localtest to fill in the field.

Read `.agent-standard/core/commit-continuity-and-recovery.md` for when full metadata is required and how to recover the correct topic.
