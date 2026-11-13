# Commit message templates — GitHub Continuity v2

**Use the smallest tier justified by the actual change.** See `.agent-standard/core/commit-continuity-and-recovery.md` for authority. These are templates, not proof that a change was committed or tested.

## TRIVIAL — only with an actual reviewed single-word documentation typo

```text
docs(readme): correct misspelled heading
```

No `--trivial` shortcut without a reviewed patch. If unsure, use NORMAL.

## NORMAL — bounded feature or bug fix

```text
fix(scope): concrete result

Goal: <why the user needs this>
Work: <stable-topic> — <actual source change>
State: ACTIVE | BLOCKED | PAUSED | DONE; <phase if useful>
Proof: <actual evidence; NOT_EXECUTED when not run>
Next: <one safe source step or STOP>
```

Optional `Decision` / `Unresolved` go between `Proof` and `Next` if they materially affect continuation.

## CRITICAL — architecture, security, policy, contract or high-risk work

```text
feat(scope): concrete result

Goal: <actual user objective>
Work: <stable-topic> — <change and owner>
State: ACTIVE | BLOCKED | PAUSED | DONE; <source phase>
Proof: <actual revision-matched evidence and limitations>
Decision: <must-preserve invariant or rationale>
Unresolved: <material unknown, or None if truly resolved>
Next: <one authorized safe step or STOP>
```

An optional `Refs` field can point to a small number of current owners. A commit is history, not permission for the future agent to execute its `Next` automatically.
