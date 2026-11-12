# Decision, Routing and Ownership Contract

**Owner:** OpenITStudios AgentSkill. **Applicability:** all adopted repositories; project-specific taxonomy may narrow domain selection but not core authority or permissions.

## Decision before action

For a bounded task, infer only the smallest safe contract needed. For complex work, record:

`GOAL | RESULT | MODE | SCOPE/NON-GOALS | SELECTED_REPO/REF/HEAD | CURRENT_HOLDS | PRIMARY_OWNER | MATERIAL_UNKNOWN | NEXT_SAFE_ACTION | REQUIRED_PROOF | STOP`

Do not turn this into a user-facing questionnaire or a mandatory planning document. The agent should work directly when requirements and authority are already clear.

**Two independent axes:**
- **Mode** = `INSPECT`, `PLAN`, `DEVELOP`, `MAINTAIN`, `VALIDATE`, `PRODUCE`, `RELEASE`. A request to review/audit/research is read-only, regardless of how many improvements are discovered. Validation is not permission for repair; production is not permission for system development.
- **Complexity** = bounded / standard / complex. Use a fuller development brief only when ownership, acceptance, architecture or cross-component implications are genuinely ambiguous.

## One accountable owner

Select the **semantic owner of the requested final deliverable**, not the programming language, file extension or most frequent keyword. Distinguish:

| Question | Canonical owner |
| --- | --- |
| What the product is expected to do | product/foundation contract and current authorized user intent |
| How a behavior is implemented | source module and its interfaces |
| Which domain procedure to follow | one primary domain `SKILL.md` |
| Which task/skill is active | root routing and project skill registry/taxonomy |
| Which branch or file may change | selected branch, repository profile and real tool permission |
| Whether a result actually works | matching executable/runtime/observation evidence |
| What to do on next session | compact checkpoint; current source remains authoritative |

An implementation technology alone does not justify a new Skill. No separate Skills merely for TypeScript, Rust, packaging, screenshots or a one-off fix unless repeated work demonstrates a distinct **reusable semantic responsibility**.

## Conditional skill selection

1. Resolve mode and final output.
2. Determine the first wrong or necessary owner. A direct source/owner path may require **no** Skill for a bounded correction.
3. Check positive and **negative** triggers. Select one primary Skill only where it contributes a real procedure or judgment.
4. Read only its required source and direct references; supporting skills answer narrowly defined questions, not create parallel control planes.
5. A handoff **ends** the previous specialist's responsibility; one actor remains accountable for final integration.

### Collision examples

- "Amati repo" → `oits-repository-audit`, **not** development or an implicit commit.
- "Fix a typo in existing README" → bounded owner directly, **not** the meta development Skill.
- "Refactor contracts across engine/UI" → `oits-development-brief`, plus exact domain owners in sequence.
- "Improve how the AI selects skills" → `oits-agent-quality-review`, **not** a domain production Skill.
- "Create a model/map/document" → project domain Skill; core review/brief only if a separate system problem is authorized.
- "Validate a result" → actual evidence check, **not** permission to mutate the original target.

## Cross-owner ambiguity and handoff

If several owners appear relevant, ask which owns the output if the file format/tool changed. If still ambiguous, inspect the current canonical domain docs and existing callers. Do not create another router to settle a documentation gap. Refer to `handoff-and-state.md` for typed handoff.

## Quality boundary

Skill selection is an evaluated decision; a substring keyword match is only a discovery hint. A correct router must **abstain** when no skill adds value. Project-specific skill sets and approvals are not imported as a universal eight-agent hierarchy.
