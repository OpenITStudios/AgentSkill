# Frozen Skill Activation Pilot

**Work:** `skill-activation-reliability` · **Status:** `NORMATIVE_NOT_EXECUTED`. This is a source-authored comparison protocol, **not** evidence that Codex, Claude Code or OpenCode loaded any Skill. It uses the existing cases GOV-211–GOV-220 from [`cases.json`](cases.json), frozen in [`skill-activation-pilot.json`](skill-activation-pilot.json).

## Admission and fair comparison

Use only a **separately authorized, real `LOCAL_PC_AGENT`** after the user chooses local validation and existing repository holds allow the activity. No ChatGPT/GitHub source-only trial, GitHub Actions, cloud CI/hosted substitute, automatic installation, privileged permission change or test-on-hold override. A host observation cannot be inferred from an instruction file.

Record exact AgentSkill commit SHA for **baseline and candidate** (historical pre-activation: `4dc6402479fb24f8c902ea67ae2d4a59c6fe593d`; initial routing contract: `95445ff3d361d1112b9ce1e75eb3abb2b7467a3c`). At execution, pin both actual candidate and target repository branch/HEAD. Freeze user request, host app/version, model/config, available Skills, permissions and test fixture across arms; if conditions are incompatible, report **NOT_COMPARABLE** rather than an improvement. Three independent trials per case per arm is a suggested small pilot, not a statistical guarantee.

Use safe disposable fixtures; do not change production source solely for routing measurement. Keep actual host transcripts private and exclude secrets and customer data from public AgentSkill. If a requested Skill is missing or access is denied, record `BLOCKED` or `NOT_VERIFIED`; do not install tools or bypass holds to make a test pass.

## Frozen cases

| Case | Expected primary | Group |
| --- | --- | --- |
| GOV-211 | `oits-repository-audit` | Required shared Skill |
| GOV-212 | `oits-agent-quality-review` | Required shared Skill |
| GOV-213 | `oits-development-brief` | Required shared Skill |
| GOV-214 | No shared meta Skill | Correct abstention |
| GOV-215 | Existing `lazydesigner-modelling` Skill, **if actually available** | Required domain Skill |
| GOV-216 | No shared meta Skill; no unauthorized repair | Abstention + permission |
| GOV-217 | Do not claim unavailable Skill loaded | Capability exclusion |
| GOV-218 | Shadowed Skill ID must not pass identity gate | Integrity gate |
| GOV-219 | Karpathy + Ponytail baseline, no unrelated optional methods | Method metric, **not** shared Skill metric |
| GOV-220 | Without actual trace, do not claim activation PASS | Evidence gate |

## Observation receipt

One **real host** receipt per case × arm × attempt. The following is an **unfilled template**, not a result:

```json
{
  "caseId": "GOV-211",
  "arm": "candidate",
  "attempt": 1,
  "standardSha": "<actual full AgentSkill SHA>",
  "targetRepo": "<authorized repository>",
  "targetRef": "<selected branch>",
  "targetHead": "<actual full target SHA>",
  "hostApp": "<CODEX_CLI | CLAUDE_CODE | OPENCODE>",
  "hostVersion": "<observed host version>",
  "model": "<observed model and configuration>",
  "permissionAndHoldState": "<observed relevant permissions>",
  "advertisedSkillIds": [],
  "selectedSkillId": null,
  "effectiveLoadedSkillPath": null,
  "loadEvidenceRef": null,
  "outcome": "NOT_VERIFIED",
  "reviewer": "<actual observer>"
}
```

Attach a real host instruction/Skill load event and, if relevant, real tool/side-effect evidence. A claimed activation in an assistant answer, copied `SKILL.md`, GitHub object, or source-only checksum is **not** a host receipt. `OBSERVED` alone is not PASS: its evidence, task correctness and safety still need independent review.

## Scoring: false negative (FN) and false positive (FP)

- **Eligible positive**: required core/domain Skill is actually installed, discoverable, permitted and observable on the target host. **FN**: eligible required Skill was not actually loaded for that task. Count wrong Skill/owner separately.
- **Eligible abstention**: the task requires **no shared meta Skill** and the actual host can expose loaded Skill identity. **FP**: unnecessary `oits-*` Skill loaded. A legitimate domain Skill is not automatically an FP.
- **Required Skill recall** = `(eligible_positives - FN) / eligible_positives`. **Unnecessary shared-Skill rate** = `FP / eligible_abstentions`. Report raw counts and denominators before percentages. Zero eligible trials means **NOT_MEASURED**, not 0%.
- **Separate gates**: wrong-owner selection, shadowed identity, method overactivation, false claims, blocked/unverifiable evidence, permission breaches, product correctness and cost. Never average critical safety/integrity violations into a high success score.
- `BLOCKED`, `NOT_VERIFIED`, identity-integrity, method-only and evidence-only scenarios are **not silently added to FN/FP denominators**. They need their own stated result and limitations.

When actual comparable, authorized host receipts exist, compare baseline and candidate by case and host. Otherwise the outcome remains **`SOURCE_AUTHORED / HOST_EVAL_NOT_EXECUTED`**. Do not report a model improvement, request repeated localtest during active GitHub source work, or auto-release.

