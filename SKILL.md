---
name: script-to-card-video
description: Use when a user provides a Chinese talking script or narration and wants an editable 9:16 knowledge, opinion, tutorial, or voiceover card video using either editorial vector illustrations or dark neon infographic components, with transcript-timed keywords, captions, optional music, and no PPTX output.
---

# Script to Card Video

Create editable ChatCut timeline state. Do not flatten the edit locally and do not export unless the user asks after review.

## Required companion skills

Load `chatcut:chatcut-plugin-basics` first. Route local recordings through `chatcut:asset-import`; use `chatcut:voice` only when narration is missing; use `chatcut:transcription` for speech timing and captions; use `chatcut:create-motion-graphics` for inline JSX assets and timeline placement; use `chatcut:music` only for requested music; use `chatcut:verification` before reporting success; and load `chatcut:known-errors` only after a ChatCut tool failure.

## Template selection

- `editorial-illustrated`: warm editorial paper, progressive keywords, and one semantic hand-drawn vector illustration per scene.
- `neon-infographic`: dark neon dynamic typography with one chart, network, metric, comparison, or flow module per scene.

Use the user-selected template. When the user has not selected one, ask which of the two structures they want before building. If they explicitly delegate the choice, use `editorial-illustrated`. Do not treat a color change as a new template. Do not generate raster images for `neon-infographic`.

## Workflow

1. Read the project ID from the active ChatCut editor URL, or explicitly target or create the project; never guess an ID.
2. Confirm `editorial-illustrated` or `neon-infographic` before writing the scene plan.
3. If a local recording is supplied, load `chatcut:asset-import`. If no recording exists, load `chatcut:voice` and generate narration.
4. Load `chatcut:transcription`, obtain real speech timing, and correct transcript text without inventing timestamps.
5. Read `references/scene-schema.md` and write a template-specific scene-plan JSON in the task workspace.
6. Run `scripts/build-motion-graphic.mjs --plan <plan.json> --out-dir <build-dir>`. The compiler calls `assertValidScenePlan` before writing output.
7. Read `<build-dir>/manifest.json`, then pass each asset's inline `code`, dimensions, duration, and properties to `create_motion_graphic_from_code`.
8. When the user did not name an existing target, create a fresh 9:16 timeline. Create one background video track, one content video track, one narration audio track with role `anchor`, and one optional music audio track with role `follower`.
9. Dry-run the complete placement transaction with `edit_item(validateOnly:true)`, then commit the same transaction.
10. Enable captions from the narration source. Use a square-corner translucent dark band, white text, phrase pacing, and bottom-center layout.
11. Load `chatcut:verification`; inspect scene boundaries and settled frames before reporting success.
12. Keep the editor project reviewable and stop before export unless the user asks.

## Template rules

For `editorial-illustrated`, choose one motif from the supported editorial library. Keep the accepted title, progressive keywords, draw-on outline, fill, and static warm-paper composition.

For `neon-infographic`, select the module by meaning:

| Meaning | Module |
| --- | --- |
| One metric with supporting signals | `metric-stack` |
| Relationships among customers, channels, resources, or causes | `node-network` |
| Relative magnitude or trend | `bar-trend` |
| Two positions, states, or behaviors | `split-comparison` |
| Ordered action or causal sequence | `step-flow` |

Use numeric labels only when the source or user supplies them. Relative bar lengths may encode emphasis, but do not derive or display a percentage from them.

## Fallbacks

- **No audio:** generate TTS through `chatcut:voice`.
- **Transcription is non-terminal:** track progress and wait for the returned interval; do not fabricate timing.
- **Invalid scene plan:** fix the plan before creating assets.
- **Motion Graphic tool failure:** load `chatcut:known-errors`, preserve old assets, and classify the failure as code, schema, placement, or readiness.
- **Caption failure:** leave the video editable and report the caption blocker.
- **Music failure:** continue without music.
- **Render proof unavailable:** ask the user to inspect the editor and do not claim pixel verification.

## Defaults

- 1080×1920, 30fps
- 3.5–5.5 seconds per semantic scene
- 2–3 transcript-timed keywords per scene
- generic series label `观点手记`
- empty brand text
- editable ChatCut project, no automatic export
- no PPT/PPTX output

## Safety

Preserve old assets and timelines until the new version passes visual verification. Do not bundle personal brand text, personal background art, page numbers, or fabricated data. User-provided branding is allowed only when explicitly supplied.
