# OpenITStudios AgentSkill

AgentSkill provides shared agent instructions, reusable Skills, operating policies, and static conformance cases for OpenITStudios repositories. It helps keep engineering practices consistent without replacing project-specific tools, rules, or approvals.

**Status:** `0.1.0-draft`, source-only standards. This repository does not provide an installed multi-agent runtime, an automatic downstream installer, or proof that another repository has adopted its rules.

## Start here

Choose the path for your task. Reading these files does not authorize changes to another repository.

| Your task | Start with |
| --- | --- |
| Understand shared agent governance | [Agent rules](AGENTS.md) and [policy index](.agent-standard/core/INDEX.md) |
| Work on AgentSkill source | [GitHub rules](GITHUB_RULES.md) and [repository profile](.agent-standard/profile.json) |
| Review possible adoption by a project | [Controlled adoption guide](docs/adoption.md), then that project's current rules |
| Inspect changes and historical decisions | [Changelog](CHANGELOG.md) and [decision record](docs/decisions.md) |
| Improve a repository README | [README quality standard](docs/standards/repository-readme.md) |

For source work, identify the selected repository, branch, exact HEAD, and requested outcome. Read the applicable rules and only the relevant owner documents. A GitHub URL or Skill source file does not prove that an agent host loaded those instructions.

## Example: review AgentSkill source in ChatGPT

With a GitHub connection available in ChatGPT, submit this **read-only** request:

> Review OpenITStudios/AgentSkill on branch `main`. Pin the current HEAD and inspect `AGENTS.md`, `GITHUB_RULES.md`, `.agent-standard/profile.json`, `README.md`, and `package.json`. Check whether the commands described in the README match the source. Do not modify files, invoke tests, or dispatch CI. Report observed source facts, anything not verified, and a clear STOP decision.

**Expected result:** a report identifying the observed branch/commit, relevant source findings, and honest limits such as `NOT_EXECUTED` for unrun tests. This prompt does not guarantee that a GitHub connection is installed, that a test passed, or that the model loaded repository rules automatically. For README changes, see the [source review workflow](docs/standards/repository-readme.md#review-workflow).

## What this repository contains

- **Portable rules:** `AGENTS.md`, `GITHUB_RULES.md`, and `.agent-standard/core/` define shared governance and source-work boundaries.
- **Skills and methods:** `skills/core/` contains baseline Skills; [the method catalog](docs/methods/README.md) describes selectively applied engineering methods. An upstream method reference is not an installed Skill.
- **Distribution contracts:** `registry/standard.manifest.json`, `registry/methods.json`, and `schemas/` define the canonical package's structure and metadata.
- **Review source:** `tools/`, `tests/`, and `evals/` contain static validation, authored regression tests, and normative evaluation cases. Normative cases are **not executed model results**.

AgentSkill is a standards source, not an IDE, Blockbench or Minecraft runtime, native test runner, or production deployment service.

## Adoption and execution boundaries

| Work surface | Supported work | Evidence it does not provide |
| --- | --- | --- |
| `CHATGPT_GITHUB` | Authorized GitHub source review, architecture, coherent source edits, and exact-commit inspection | User-PC tests, native app behavior, or successful runtime execution |
| `LOCAL_PC_AGENT` | Separately authorized tools operating on the user's real PC against an identified source revision | Automatic permission to alter other repositories or bypass project holds |

Adoption requires an independently authorized, source-pinned review of the **target repository**. Staging a bundle is not installation; matching files do not establish effective host instruction loading. Preserve project Skills, privacy restrictions, branch policy, and test holds. See [controlled adoption](docs/adoption.md).

## Verification and evidence

The current [AgentSkill profile](.agent-standard/profile.json) disables CI and puts tests on hold. **Authored test files and documented commands are not evidence of successful execution.** Do not use GitHub Actions or a hosted runner as a substitute for authorized PC-local validation.

For a future **separately authorized local-PC phase**, with a compatible Node.js installation and an exact source checkout, the repository defines:

```bash
npm run check
npm test
```

These entries correspond to `package.json`: the first invokes static standard validation, and the second invokes the authored Node test suites. **Displaying these commands is not proof of execution or a request to run them now.**

The [evidence policy](.agent-standard/core/evidence-and-recovery.md) distinguishes reviewed source, committed source, authored-but-unrun tests, and native verification. For adoption numbers, consult the dated [read-only source audit](docs/research/adoption-readiness-source-audit-2026-11-13.md), not an undated count in this entry page.

## Documentation map

| Topic | Canonical owner |
| --- | --- |
| Policy and Skill routing | [Core index](.agent-standard/core/INDEX.md) |
| Clear, evidence-grounded communication | [Communication standard](.agent-standard/core/user-facing-communication.md) |
| Workstream recovery and commit evidence | [Commit continuity](.agent-standard/core/commit-continuity-and-recovery.md) |
| Repository root placement | [Root layout standard](docs/standards/repository-root-layout.md) |
| Accurate README content and maintenance | [README quality standard](docs/standards/repository-readme.md) |
| Architecture and decisions | [Decision record](docs/decisions.md) |
| Later local-PC acceptance handoff | [Source-to-local handoff](docs/templates/source-to-local-handoff.md) |

Use linked owners for detailed procedures rather than copying them into the README.

## Maintenance and licensing

**Maintainer:** [OpenITStudios](https://github.com/OpenITStudios). Changes follow the [GitHub operating rules](GITHUB_RULES.md) and selected repository permissions. Meaningful pending changes remain in `CHANGELOG.md` under **[Unreleased]**; publishing and version changes require separate approval.

**License:** No root `LICENSE` file is present in this source revision. Public visibility alone does not grant reuse rights; do not assume licensing or contribution permissions that have not been stated.
