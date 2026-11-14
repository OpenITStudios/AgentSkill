# Source-Grounded UI Preview in ChatGPT

**Status:** conditional OpenITStudios reference, not an installed Skill, automatic distribution, browser runtime, or legal patent. This standard applies only when a user **explicitly requests a preview of an already implemented product UI**. Every target repository must separately adopt it through its existing project UI owner, respecting its selected branch, restrictions and product-specific procedure.

## One ChatGPT delivery method

**`HTML_SOURCE_PREVIEW`** is the source-backed visual-review method for `CHATGPT_GITHUB`. Create a **renderable, self-contained HTML/CSS representation** directly in ChatGPT when a suitable HTML surface is available; otherwise deliver an offline `.html` artifact. A textual description, wireframe, generated picture or concept dashboard does **not** satisfy a request to *see* the current implemented UI. The preview is a **source-grounded approximation**, never a screenshot, executed app, native capture or pixel-parity receipt.

### PIN → READ → PROJECT → PRESENT → DISCLOSE

1. **PIN.** Read the target repository's **selected development branch and full HEAD SHA**; never silently use its default branch. Read current instructions, profile, local policy, one UI-owner Skill/procedure where available and the user's selected page/state/viewport.
2. **READ.** Inspect the actual implemented page and its imported visual components, CSS/tokens/themes, icons/assets, responsive layout, copy, accessibility and conditional states. Use an existing typed, non-sensitive fixture or the source-defined empty state. User-approved page/state/viewport overrides local defaults. No source, unavailable inputs or unimplemented screen means **stop and disclose**, not invent UI.
3. **PROJECT.** Translate source-owned dynamic templates into deterministic, **read-only** HTML/CSS. Preserve implemented content, navigation, hierarchy, controls and disabled/empty/error states within the limits of the chosen fixture. For Flutter/native/Minecraft/Blockbench content, reproduce only source-grounded application chrome and mark native canvas/device/game/editor areas **unavailable**—never insert fabricated gameplay, models, screenshots or telemetry. Preserve approved assets/licensing; no remote assets or personal data.
4. **PRESENT.** Render the HTML in ChatGPT's available HTML visual capability, or provide a directly inspectable standalone HTML file. A source preview may support selecting among real source-defined states, but no fake operation success. It may not call Tauri, MCP, device, filesystem, accounts, API endpoints or network. Creating a *review artifact* does **not** authorize modifying production code.
5. **DISCLOSE.** Label the deliverable `HTML_SOURCE_PREVIEW — SOURCE-GROUNDED APPROXIMATION`. Include repository, branch, full SHA, page, fixture/state, viewport, inspected source paths, important approximations and `Svelte/Flutter/browser/native: NOT_EXECUTED` as appropriate. Never claim same pixels or interaction correctness without observed matched runtime evidence.

## No fabrication and no false fallback

- **Prohibited:** image generation to simulate a screenshot of existing UI; generic redesign disguised as current source; invented labels/content, populated records, textures, charts, native controls or functional readiness; publishing private repository material, production finance data, device details or user data in a public artifact.
- **If UI source is incomplete:** show only supported visual regions with clearly marked gaps; if material elements cannot be grounded, report `PREVIEW_BLOCKED_SOURCE` instead of improvising.
- **If HTML cannot display inline:** deliver a valid offline HTML file and label it. Do not quietly replace a failed preview with image generation or a text-only explanation when file output is available.
- **No automatic local-PC handoff:** browser automation, built Svelte/Flutter, Playwright, Tauri/Windows, Blockbench/Minecraft, remote deployment and CI are **separate proof categories**, not prerequisites for a ChatGPT HTML preview. Existing local/native checks and project CI holds remain untouched. An existing browser-screenshot pipeline may be inspected if matched evidence already exists; do not invoke it against a hold.
- **No global overwrites:** local project UI Skills and product/permission rules outrank this reference on specific layout, page defaults, privacy, release, and native behavior. Do not add a duplicate application frontend, generic preview engine, separate policy router or a new version number.

## Receipt and acceptance

```yaml
method: HTML_SOURCE_PREVIEW
repository: owner/repo
branch: selected-branch
sha: exact-40-hex-commit
page: implemented-page
fixture: documented-source-fixture
viewport: widthxheight
source_coverage: [inspected-paths]
approximations: [actual-unverified-differences]
browser_build: NOT_EXECUTED
native_target: NOT_EXECUTED
```

**Acceptance:** the user receives a visible HTML preview or standalone HTML file, tied to the exact source and fixture, with no unsupported product screenshot or runtime claim. Static source checks can review construction and source coverage but **cannot certify visual parity**. A link to this document is adoption evidence only when the **target repo** actually routes it through its active owner; a central link alone is not proof that a host read it.
