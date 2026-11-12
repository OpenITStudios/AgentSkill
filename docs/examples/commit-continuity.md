# Commit Messages for Continuous Work

These are **examples**, not observations of executed tests. Treat values as illustrative; actual GitHub commits must describe real work and matching evidence.

## 1. Existing pattern — good foundation

```text
fix(texture): balance bounded face scan across Cube orientations

Work: Address missing face orientations without altering texture budget.
State: SOURCE_AUTHORED / REGRESSION_AUTHORED_NOT_RUN.
Proof: SOURCE_REVIEWED; native NOT_EXECUTED.
Decision: Preserve Gateway and UV checks.
Unresolved: Native quality acceptance.
```

**Improvement:** add the user's **Goal**, a **stable topic ID**, a clear four-state `State`, and **Next**. The older format remains historical evidence; do not rewrite earlier commits to look compliant.

## 2. Better material commit (source still in progress)

```text
fix(texture): cover Cube orientations in face sampling

Goal: Detect missed faces without increasing texture cost.
Work: texture-face-scan — add six-direction sampling and focused regression.
State: ACTIVE; SOURCE_INTEGRATION.
Proof: SOURCE_REVIEWED; TEST_AUTHORED_NOT_RUN; native NOT_EXECUTED.
Decision: Keep original UV/cache checks and visual acceptance boundaries.
Unresolved: Source integration with asset ingestion; native QA deferred.
Next: Review texture consumers and complete source-only integration.
Refs: docs/05-operations/next-action.md
```

**Why this helps:** a fresh ChatGPT session can find the exact topic, see that the source task is still active, preserve constraints and continue work without assuming a localtest result.

## 3. Source work complete; localtest intentionally deferred

```text
feat(routing): complete source-side agent skill selection

Goal: Select the right primary skill for each project task.
Work: skill-routing — integrate dispatch, negative cases and domain owners.
State: DONE; SOURCE_READY_FOR_LOCAL.
Proof: SOURCE_REVIEWED; TEST_AUTHORED_NOT_RUN; LOCAL_TEST_DEFERRED.
Decision: Preserve one canonical router and existing project holds.
Unresolved: Native behavior not verified in a PC-local agent.
Next: STOP; await a separately selected PC-local validation phase.
```

**DONE** describes source scope only. It is not permission to run tests now or claim native acceptance.

## 4. Trivial typo (no body needed)

```text
docs(readme): correct a misspelled heading
```

## 5. Anti-patterns

| Bad | Why it fails |
| --- | --- |
| `chore: update lots of files` | Cannot locate a topic or outcome |
| `State: PASS` without an actual run | Misrepresents evidence |
| `Next: deploy automatically` | Does not have user authorization |
| `Proof: previous build passed` | May not match new HEAD |
| A full transcript in commit | Wastes context and risks exposing data |
| One commit for unrelated fixes | Makes history and rollback ambiguous |
| `Next` not present on a material in-progress commit | New ChatGPT session cannot identify a safe continuation |
