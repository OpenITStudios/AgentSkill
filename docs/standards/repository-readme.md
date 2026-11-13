# OpenITStudios Repository README Quality Standard

**Scope:** repository README purpose, factual accuracy, usability, and upkeep. **Status:** a conditional source reference for separately authorized project adoption. It does not install instructions, grant writes, or initiate tests.

## Primary rule

**A README is a trustworthy reader entry point, not a duplicate policy manual or a live status dashboard.** The opening should identify the project, its audience or purpose, the first useful action, and material limitations. Link detailed procedures and fast-changing evidence to existing canonical owners.

Optimize for correct understanding and the reader's next action, not a fixed word count or number of sections. Different projects need different paths: SDKs, desktop applications, Minecraft tools, agent/MCP systems, and document-first repositories do not share one mandatory template.

## Reader needs and conditional content

| Question | Include when relevant | Verify against |
| --- | --- | --- |
| What is it, and who uses it? | Accurate product identity, purpose, and key exclusions | Product owner, current contracts, package metadata |
| What is available? | Supported features, prerequisites, limits, and experimental states | Implementation and applicable evidence |
| How do I begin? | Smallest supported setup or workflow, with an expected outcome | Actual launcher, entrypoint, commands, or operator guide |
| What is restricted? | Branch/test holds, sensitive-data boundaries, and permission or runtime limits | Current repository rules and project profile |
| Where is more detail? | Clear links to documentation, active status, decisions, and changelog | Existing canonical documents |
| Who maintains it? | Verified help, contribution, and license routes | Actual owner, repository settings, policy, and license |

**No universal section checklist:** a library may need installation and API examples; a desktop app may need operating-system and native test limits; an MCP product must distinguish authored tool catalogs from working installations; a document-only repository may have no executable setup. Keep project-specific terms and useful structure rather than forcing identical READMEs.

## Claim verification and freshness

Treat claims as statements to check, not as text to polish:

- **Commands:** match the exact flags, prerequisites, side effects, and actual `package.json`/launcher/build-script owner. A printed command was not necessarily executed.
- **Capabilities:** inspect the implementation and relevant consumers. Distinguish source-defined, experimental, enabled, installed, and runtime-observed features; a code stub is not a shipped product.
- **Versions and branches:** pin the selected branch and source revision. Read manifest and profile values instead of copying numbers or authority from historical chat.
- **Tests and quality:** separate authored tests, static review, executed test receipts, and native acceptance. Do not turn a GitHub commit or old CI badge into “all tests pass.”
- **Adoption:** verify target-repository and actual host evidence; central reference documentation, staged files, and Skills mentioned in prose are not proof of installation.
- **Privacy, contributors, and license:** confirm actual repository settings, local restrictions, and license files. Public source availability does not imply a reuse license.
- **Images and diagrams:** label conceptual images and inspect current UI/architecture before claiming a screenshot depicts a live build.

**Observed claims need a source owner and revision.** If critical evidence is unavailable, report `UNKNOWN` or `NOT_EXECUTED` rather than guessing. Source review cannot establish runtime or native behavior.

**Avoid volatile assertions in the root README.** Move changing tool counts, case counts, deadlines, current blockers, adoption totals, and test receipts to an existing status owner or a clearly dated audit. If a snapshot must appear, label the date, revision, and scope. Do not create a second status database or imply automatic updates.

## Navigation and writing quality

- Use a clear H1, descriptive headings, short active sentences, consistent terms, and meaningful link text. Write shared AgentSkill documents in clear English; respect a project's intended audience.
- Prefer repository-relative links; check destination existence and relevant anchors when possible. A valid path does not prove current or correct content. GitHub supports multiple link forms and heading fragments; use the real Markdown destination rather than checking only that a filename appears.
- Keep examples copyable, include required prerequisites and language identifiers, and distinguish sample output from observed output.
- Add tables, diagrams, screenshots, badges, and contents lists only if they help a real reader task. Provide alt text or a text alternative where the visual carries information.
- Avoid unqualified language such as “fully functional,” “always current,” “production ready,” or “tested” without matched evidence.

## Review workflow

1. **Pin and authorize:** identify the selected repository, branch, exact HEAD, user scope, and project-specific rules. README inspection is **read-only by default**, not permission to modify a project.
2. **Find readers and source owners:** identify the main reader task, real entrypoint, toolchain, active status, and policy owners. Preserve domain-specific documentation.
3. **Check claims and consumers:** compare product descriptions, commands, limitations, current status, and links against actual source. Do not infer runtime behavior.
4. **Write a useful entry:** present purpose and first action before long internal history. Link deeper procedures rather than deleting important detail or duplicating ownership.
5. **Review with proportionate evidence:** inspect relative-link targets, applicable heading anchors, and executable command definitions. AgentSkill's lightweight source guard covers ordinary inline/full/collapsed reference links, simple GitHub-style Markdown heading anchors, and fenced `npm run`/`npm test` commands. It is not a complete GitHub Flavored Markdown parser or an external-URL checker; complex syntax and content accuracy still need review. Static checks establish only stated coverage; authored but unrun tests remain `TEST_AUTHORED_NOT_RUN`.
6. **STOP:** record the source revision, changed scope, observed proof, and material limitations. Do not begin cross-repository rewrites or indefinite polishing.

**Revisit the README when a reader-facing contract changes:** identity, supported behavior, setup, entrypoint, CLI command, permissions, data boundary, or source/acceptance claim. An unrelated internal refactor does not automatically require a README rewrite.

## Example: evidence before confidence

**Avoid:** “The system passes every test, works in all clients, and is production ready.”

**Prefer:** “`package.json` defines validation commands. They were not executed during this source-only review; host-specific behavior requires separate evidence.”

A source command and a successful runtime outcome are distinct claims.

## Ownership and external references

[Repository Root Layout](repository-root-layout.md) owns **file placement**. [User-Facing Communication](../../.agent-standard/core/user-facing-communication.md) owns **assistant response style**. This standard owns **README reader utility, claims, and navigation**; [Controlled Adoption](../adoption.md) owns project-level approval and rollout.

Original sources inform this reference, but none is an automatically installed Skill or a mandatory layout for all projects:

- [GitHub: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) — project entry, onboarding, and relative links.
- [Diátaxis](https://diataxis.fr/) — task-based tutorials, how-to guides, references, and explanations.
- [Google developer documentation style guide](https://developers.google.com/style/highlights) — clear, accessible technical writing.
- [The Good Docs Project: README guide](https://www.thegooddocsproject.dev/template/readme) — audience and conditional sections.
- [Standard Readme specification](https://github.com/RichardLitt/standard-readme/blob/main/spec.md) — useful library conventions, not a universal repository template.
