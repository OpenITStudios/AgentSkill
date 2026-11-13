# Skill Authoring and Routing Standard

**Format:** Agent Skills open specification. A portable skill is a folder with `SKILL.md` and YAML frontmatter. The required `name` is lowercase kebab-case, matches the folder, and has at most 64 characters. A concrete `description` is required and should identify positive/negative triggers. Keep detailed procedures in the body and references only as needed.

## Ownership and naming
- Universally reusable skills are owned by AgentSkill and prefixed `oits-`. Their source lives under `skills/core/<name>/SKILL.md` and is distributed **byte-identically** to `.agents/skills/<name>/SKILL.md`.
- Domain skills remain local to product repositories and are **not** synchronized 1:1 across unrelated domains.
- A skill is a procedure, not a permission authority or new runtime/agent. The root rules and local project profile own routing and safety boundaries.
- Keep one canonical owner per behavior. Do not add a second conductor/router, duplicate core skill name or shadowing `.opencode/skills` / `.claude/skills` ID.

## Preservation during categorization and upstream research

**Non-destructive by default:** categorizing Agent Rules, consolidating general methods, refreshing external references or packaging an AgentSkill bundle must **not remove, rename, disable, replace or silently shadow** existing project Skills, agents, their activation rules or native/domain procedures. This includes independently installed Karpathy, Ponytail and similarly named assets. Enumerate actual project Skills/agent directories and nested instructions before any separately authorized target migration; make a lossless owner/conflict mapping. A reference method in the central registry is **not** proof that a project's installed Skill was migrated.

When original project Skill and centralized method guidance overlap, keep the domain owner and preserve any stricter permissions or useful behavior. Treat the original maintainer's current source as research evidence to review, not automatically executable code. Verify provenance, exact ref and relevant path, license, negative triggers and host compatibility before proposing a change. When in doubt, preserve the existing asset and mark the conflict unresolved.

## Minimal skill contract
1. YAML `name` and `description` with explicit scope.
2. Positive trigger (when to load) and negative trigger (when **not** to load).
3. Input/source ownership and prerequisites.
4. Procedure with smallest context and capability/permission preflight.
5. Required outputs, falsifiable acceptance and STOP.
6. Evidence ceiling and failure/recovery behavior.
7. References/scripts only if actually needed; scripts undergo provenance and security review.

## Skill development loop
Baseline a real failure or missing capability → identify first owner → write the smallest skill update → prepare positive, negative, collision, hold and pressure cases → run permitted deterministic checks and host-level repeated evaluations when available → compare to baseline → publish with version/provenance. If model testing is unavailable, mark the change `SOURCE_REVIEWED` and behavioral efficacy `NOT_EXECUTED`.

## Context economy
Root instructions are an index. Skill metadata enables selection; the full procedure is loaded only after selection. Avoid enormous `SKILL.md` files and deep reference chains; do not require every project to read every specialist skill.

## External methods
Research from Superpowers, Spec Kit, OpenSpec and public prompt corpora is **method evidence**, not automatically installed skill authority. Do not vendor copyrighted/proprietary content or execute untrusted scripts by default. Track source, commit SHA, license and adaptations when material.
