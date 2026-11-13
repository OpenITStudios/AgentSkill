# OpenITStudios Repository Root Layout Standard

**Scope:** placement and ownership of files or folders at a project's repository root. **Status:** reference standard for future, separately authorized adoption. It does not automatically rename, migrate, delete, or reorganize any existing OpenITStudios repository.

## Primary rule

**The repository root is a discoverable entry surface and an actual toolchain/workspace boundary, not a general storage area.** Keep an entry at root only when its documented consumer requires that location, it is a useful repository-wide entry point, or an existing compatibility contract must be preserved. There is no universal maximum root-item count, fixed folder tree, or global allowlist.

Project-specific root rules, nested agent instructions, build manifests, application data boundaries, branch/CI/test holds, and existing Skills remain authoritative for their actual owners. The shared standard adds a decision method, not permission to move files.

## Placement decision

| Category | Typical location or examples | Root decision |
| --- | --- | --- |
| **Human/repository entry** | `README.md`, `AGENTS.md`, `GITHUB_RULES.md`, optionally `CONTEXT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `LICENSE` | Keep at root when used as current project entry/contract. AgentSkill portability does not itself prove adoption by another repo |
| **Actual toolchain/workspace contract** | `package.json`, lockfiles, `pyproject.toml`, `Cargo.toml`, `pnpm-workspace.yaml`, Java build wrappers, framework configs, `.editorconfig`, `.gitattributes`, `.gitignore` | Keep in their *required discovery locations*; do not relocate merely to reduce root clutter |
| **One necessary root operator entry** | A documented thin `DEV.cmd`, `manage.cmd`, `RUN.cmd` or app launcher; explicit compatibility alias | Keep when a real user, installer or tool depends on it; delegate implementation to the existing owner |
| **Domain source, procedures and durable evidence** | `src/`, `apps/`, `engine/`, `mcp/`, `kits/`, `packages/`, `docs/`, `tests/`, `tools/`, `scripts/`, `knowledge/`, `.agents/`, `.github/` | Use the **current project's** domain owner and naming; these paths are examples, not required universal directories |
| **Project asset/delivery state** | Existing `workspace/`, `outputs/`, `examples/`, `fixtures/`, `distribution/` or domain-specific equivalents | Preserve intentional tracked project assets and deliverables under their documented owner; do not classify every output as disposable |
| **Transient or private machine data** | Caches, log files, build output, installed runtime data, credentials, personal recordings and generated scratch artifacts | Use an owned, ignored local or external storage location as appropriate; keep only safe structural placeholders if necessary |

**Ownership check before placing a new root entry:** who reads/writes it, whether that consumer expects an exact root path, what its source of truth is, whether it contains retained/private/generated content, and whether another existing owner already satisfies the need. If there is no real repository-wide consumer, prefer the existing semantic directory. Do not create new directories merely to match an illustration.

## Practical layout (illustrative, not mandatory)

```text
repository/
├── README.md                         human entry and navigation
├── AGENTS.md / GITHUB_RULES.md        if this project uses these contracts
├── .gitignore and project config     actual Git/toolchain requirements
├── <framework manifests/lockfiles>   keep at required discovery paths
├── docs/                             durable documentation and navigation
├── <one or more domain roots>/       src, apps, engine, kits, mcp, etc.
├── <needed developer/test owners>/   tools, scripts, tests, etc.
└── <approved project data owners>/   optional; protect persistence/privacy
```

`CONTEXT.md` may own **stable project orientation** when the project already uses it. Current task state belongs to the existing planning/operations owner, not a duplicate root status file. Git history is revision history, not a workspace scratch directory. Do not create empty README placeholders or a second status database to manufacture conformity.

## Naming and migration safety

1. Prefer clear, predictable lowercase `kebab-case` for **new discretionary human-named paths**, only when it fits the project. Preserve mandatory case-sensitive names, package/framework conventions, historical public imports, product identities and established owners (for example `EngineData/`, `UserData/`, `Cargo.toml`, `VERSION.txt`).
2. **Do not automatically relocate** root-level code, reports, launchers, assets, skills, scripts or configuration. The presence of an unusual filename is a prompt to inspect its consumers, not proof of a defect.
3. For a proposed move, identify the exact affected **imports, scripts, GitHub workflows, installers, relative links, generated paths, OS case-sensitivity, tests and native runtime**. Preserve aliases only where needed. Check for tracked/untracked state and destination collisions; do not overwrite or delete unverified content.
4. Never confuse a `.gitignore` rule with proof that a file was never committed. Sensitive files require a separate, authorized incident/secret-response procedure; do **not** rewrite Git history as routine cleanup.
5. Keep root organization **proportionate**: new root entries need a genuine consumer; existing entries stay until their replacement is proven safe. A clean-looking tree does not justify breaking existing builds or user workflows.

## Read-only review and authorized change

**Inspect:** pin the user-selected repository/ref/HEAD. Read current `AGENTS.md`, `GITHUB_RULES.md`, profile/holds if present; inspect root tree, README, local root policy, tooling entrypoints and `.gitignore`. Search relevant references only for proposed moves. Treat truncated inventories and missing permission as incomplete evidence, not absence.

**Classify each entry:** `KEEP_ROOT`, `DOMAIN_OWNED`, `LOCAL_OR_GENERATED`, or `REVIEW_EXCEPTION`. For each proposed change state the **existing owner, consumer, reason, compatibility impact, authorization and available proof**. Do not publish private source content in AgentSkill. No file moves in an audit-only request.

**Change only if separately authorized:** perform the smallest coherent move/addition on the selected branch; update actual consumers and evidence links. Check relevant permitted source validation, respect test/CI holds and record `NOT_EXECUTED` for unavailable native checks. A commit is not build/test proof.

**STOP:** finish once root entry ownership is clear, true violations have been corrected **within approved scope** at the available proof ceiling, and essential consumers are preserved. Do not invent a mass migration, extra root validator or second root policy merely to increase tidiness.

## Original-source references

- [GitHub: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) — supported discoverability and placement.
- [GitHub: Community health file locations](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) — precedence and optional repository-wide documents.
- [GitHub: Ignoring files](https://docs.github.com/en/get-started/git-basics/ignoring-files) and [Sensitive-data cleanup](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) — local files and nontrivial history-removal risk.
- [PyPA: src versus flat layout](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/) — more than one valid project layout.
- [Cargo workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html) — workspace-level manifest and lockfile locations.
- [pnpm workspaces](https://pnpm.io/workspaces) — root workspace manifest placement.

These documents describe **publisher-supported behavior**; none requires every OpenITStudios repository to adopt an identical tree.
