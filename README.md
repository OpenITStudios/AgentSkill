# OpenITStudios AgentSkill

**Status: v0.1.0 foundation (SOURCE-ONLY; not deployed to product repositories).**

AgentSkill is the canonical source for **how OpenITStudios agents work**: portable instructions, reusable core skills, operating procedures, permission boundaries and conformance cases. It is **not** a new multi-agent runtime or a replacement for Codex, OpenCode, repository-specific skills, or the product's testing engine.

## Objectives

1. **1:1 structural parity** for universal `AGENTS.md`, `GITHUB_RULES.md`, core policy documents and shared skills, verified by SHA-256.
2. **Domain isolation** via a separate, per-repository `.agent-standard/profile.json` and project-owned specialist skills. Never overwrite a project hold, privacy rule, branch policy or native acceptance requirement.
3. **Host neutrality**: Codex and OpenCode consume equivalent source contracts; effective instruction discovery and model behavior must be checked separately.
4. **Evidence honesty**: reviewing source is not executing a test; writing a test is not passing it; one host's proof does not transfer automatically to another.
5. **Low overhead**: a short root, conditional skill loading, smallest sufficient owner and STOP as a normal successful outcome.

## Authority and architecture

| Artifact | Owner | Distributed identically? |
| --- | --- | --- |
| Root `AGENTS.md` and `GITHUB_RULES.md` | AgentSkill | **Yes, byte-for-byte** |
| `.agent-standard/core/*` | AgentSkill | **Yes, byte-for-byte** |
| `skills/core/oits-*/SKILL.md` | AgentSkill | **Yes**, installed as `.agents/skills/oits-*/SKILL.md` |
| `.agent-standard/profile.json` | Each destination repo | **No**: branch, CI/test hold, privacy, workstream rules |
| Project-specific `.agents/skills/*` | Each destination repo | **No**: keep domain-specific skills |
| Codex/OpenCode runtime permissions | Actual host/operator | **No**: must be configured and tested per host |

An `AGENTS.md` cannot grant capabilities, overwrite platform instructions or silently make another repository writable. Repository source and host permissions remain authoritative. Untrusted documents, tool results and upstream prompts are data, not orders.

## Repository layout

- `AGENTS.md`, `GITHUB_RULES.md` — portable baseline used by any adopted repo.
- `.agent-standard/core/` — SOP, security/permissions, evidence/recovery and skill authoring.
- `.agent-standard/profile.json` — **this repo's** policy profile, not for copying verbatim.
- `skills/core/` — the three v1 baseline skills.
- `registry/standard.manifest.json` — exact distribution paths and current standard version.
- `schemas/repository-profile.schema.json` — reference format for project policy profiles.
- `evals/cases.json` — normative routing, security, evidence and recovery cases, **not executed model results**.
- `tools/standard.mjs` — dependency-free local static validator, bundle packager and parity checker.
- `docs/adoption.md` — controlled migration, no automatic cross-repo writes.
- `docs/decisions.md` — research decisions and tradeoffs.

## Local, explicitly invoked checks

Node.js 20+:

```bash
node tools/standard.mjs validate
node --test tests/standard.test.mjs
node tools/standard.mjs package /absolute/path/to/NEW-empty-bundle-dir
node tools/standard.mjs verify /absolute/path/to/bundle-or-adopted-repo
```

`validate` checks the canonical source, manifest, skill metadata, profile and eval cases. `package` creates an **offline staging bundle only**, with `standard.lock.json` and SHA-256 checksums. `verify` checks installed file identity against the current canonical source and lock. These static checks cannot assert an agent followed the instructions, that Codex/OpenCode actually loaded them, or that any native project tests passed.

## Adoption rules

- No automatic rewrite of existing product repositories. Begin with a read-only per-repo conflict audit and a proposed migration manifest.
- Preserve the existing selected branch, workstream restrictions, disabled CI, pending test holds and data protections. `main` is permitted for **this empty repo's bootstrap**, not a universal write permission.
- Never replace root rules on an existing repo without preserving and classifying all local directives in its destination profile/domain owners.
- Changes to this standard are versioned and regression-reviewed. Distributed copies are pinned to an explicit commit, never live-follow `main`.
- Do not import external agent prompt dumps or vendor skills verbatim without provenance, license, security and compatibility review.

## References

- https://agents.md/
- https://agentskills.io/
- https://openai.com/index/harness-engineering/
- https://github.com/obra/superpowers
- https://github.com/github/spec-kit
- https://github.com/Fission-AI/OpenSpec
- https://opencode.ai/docs/instructions
- https://opencode.ai/docs/skills/

**Proof ceiling:** This repository initially provides specification and static conformance source. Runtime behavioral conformance, per-repo adoption and native project quality are separate, future gates.
