# GitHub Continuity v2 — Worked Examples

These are illustrative commit messages, not observed builds, tests or actual user approvals.

## Trivial documentation typo

```text
docs(readme): correct a misspelled heading
```

Only when the actual diff proves a tiny, non-policy text correction. A `--trivial` flag **without a patch** must be rejected. If in doubt, use NORMAL or CRITICAL.

## Normal coherent source change

```text
fix(texture): cover all Cube face orientations

Goal: Detect missing faces within existing sampling budget.
Work: texture-face-scan — cover six orientations using the existing owner.
State: ACTIVE; SOURCE_INTEGRATION.
Proof: SOURCE_REVIEWED; TEST_AUTHORED_NOT_RUN.
Next: Review affected texture callers against current branch source.
```

If a decision or residual risk matters, add `Decision` / `Unresolved` in order before `Next`. If the work changes an interface, permission, or major architecture, use CRITICAL.

## Critical architecture or permissions change

```text
feat(agent): narrow repository write permissions

Goal: Ensure AI work stays on authorized source and branch.
Work: permission-routing — align action gates and current profile.
State: ACTIVE; SOURCE_INTEGRATION.
Proof: SOURCE_REVIEWED; LOCAL_TEST_DEFERRED.
Decision: Preserve explicit user authorization and test holds.
Unresolved: Effective host permission loading remains unverified.
Next: Inspect selected host adapter source without enabling CI.
```

## New ChatGPT session

```text
User: "Lanjutkan pekerjaan tekstur di branch Local"
        ↓
Read Local HEAD + root/profile + active texture status
        ↓
List Local commits scoped to texture source path
        ↓
Read matching Work topic + reconcile current source
        ↓
Continue source work; localtest deferred
```

## Avoid

- Selecting `main` because it is the default when the user selected `Local`.
- Calling global commit search and assuming nondefault branch commits do not exist.
- Repeating old `Next` if source or permission changed.
- Replacing a critical seven-field message with one-line subject to save time.
- Claiming `SOURCE_REVIEWED` means tests passed.
