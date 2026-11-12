---
name: oits-development-brief
description: Scope and direct non-trivial or ambiguous repository development when architecture, ownership, acceptance or cross-component effects are unclear. Do not use for routine single-owner fixes, inspection-only requests, normal domain production or as automatic permission to mutate.
---

# Development Brief — Smallest Complete Plan

## Activation
Use for an authorized complex change that cannot safely proceed from a known bounded owner. Skip this skill for a trivial modification, an audit-only request or a domain procedure that already provides an adequate execution contract.

## Required contract
`Goal | Observable acceptance | Forbidden proxy | Selected repo/ref/HEAD | User permissions | Current holds | First wrong owner | Affected consumers | Tools available | Proof ceiling | STOP`.

## Procedure
1. Recover current authority from `AGENTS.md`, `GITHUB_RULES.md` and the local profile. Confirm work is `DEVELOP`/`MAINTAIN`, not `INSPECT`/`PLAN`.
2. Read minimal source, failing behavior and dependent contracts. Distinguish unverified hypothesis from observed root cause.
3. Specify non-goals and architecture boundary, preserving the existing canonical owner. Use a spec/change record only when complexity warrants one.
4. Break work into **coherent integration units**, not speculative micro-tasks. Choose the cheapest valid proof for each affected invariant.
5. Before any side effect: check branch/HEAD, action permission, protected paths, test/CI holds and actual host capability. One development brief is a conductor, **not a second router or multi-agent runtime**.
6. Implement within authorized scope, compare to acceptance and preservation invariants, and report matched source revision and real evidence.

## Failure and STOP
Classify source/test/tool/permission/native cause; fix the first wrong owner. If tools or approval are absent, finish safe independent work and report unresolved proof explicitly. Never manufacture PASS, start CI on hold, add unsolicited branches or continue after the outcome is achieved.
