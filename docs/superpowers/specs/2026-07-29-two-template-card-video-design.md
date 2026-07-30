# Two-Template ChatCut Card Video Design

Date: 2026-07-29

## Objective

Replace the current “one layout with two color themes” model with exactly two
public, structurally distinct templates:

1. `editorial-illustrated` — preserve the accepted editorial-paper composition
   and its title, progressive keywords, and hand-drawn vector illustration.
2. `neon-infographic` — use dynamic typography plus neon charts, connections,
   data displays, and comparison modules, without generated or character
   illustrations.

Both templates create editable 9:16 ChatCut timelines from narration-led
Chinese scripts. They share script analysis, transcript timing, captions,
audio placement, and verification, but they do not share one conditional
content renderer.

## Current Problem

The current public options, `editorial-paper` and `deep-dusk`, are primarily
palette variants of the same content structure:

- one title;
- two or three progressive keyword cards;
- one large semantic vector illustration;
- one caption layer.

This makes the Skill appear to offer two templates while it actually offers
one template in two colors. The older ChatCut timeline
`动态文字＋用户旁白＋轻柔BGM v3` contains a genuinely different structure—large
dynamic headlines, explanatory text blocks, comparison cards, and other
typographic modules—but that structure is not reusable through the Skill.

## Scope

### Included

- Introduce a required top-level `template` discriminator.
- Support exactly `editorial-illustrated` and `neon-infographic`.
- Keep the accepted editorial composition and motion behavior unchanged.
- Add a separate neon background renderer and separate neon content renderer.
- Add a typed neon visual-module library.
- Keep native ChatCut narration, captions, and optional music tracks.
- Produce and verify one 15-second pilot for each template using the same
  narration span.
- Preserve all existing ChatCut timelines and assets.

### Excluded

- PPT or PPTX output.
- Raster AI image generation for the neon template.
- Character or hand-drawn illustration in the neon template.
- Automatic MP4 export.
- Personal brand text, page numbers, or bundled personal background art.
- A third public template or arbitrary mix-and-match theme system.

## Public Template Contract

New scene plans require:

```json
{
  "template": "editorial-illustrated",
  "canvas": {
    "width": 1080,
    "height": 1920,
    "fps": 30
  }
}
```

The old top-level `theme` field is removed from the public schema. Template
selection determines both structure and visual language. Primary colors remain
editable Motion Graphic properties, but changing colors does not create a
third template.

Existing ChatCut timelines remain renderable because they already contain
registered assets. New plans using only `theme` fail validation with a concise
migration message:

- `editorial-paper` → `editorial-illustrated`
- `deep-dusk` → choose `neon-infographic` for the new dark template

The Skill does not expose a hidden legacy template alias.

## Shared Pipeline

Both templates use the same orchestration:

1. Resolve or create the intended ChatCut project and 9:16 timeline.
2. Use supplied narration when available; generate narration only when absent.
3. Obtain real transcript timing.
4. Split the script into contiguous semantic scenes.
5. Build a template-specific scene plan.
6. Validate the discriminated scene schema.
7. Compile a template-specific background and content Motion Graphic bundle.
8. Register both assets through ChatCut’s inline JSX workflow.
9. Place background, content, narration, captions, and requested music as
   separate editable layers.
10. Inspect scene boundaries and settled frames.
11. Stop before export.

Shared caption treatment remains:

- white text;
- square-corner translucent dark band;
- phrase pacing;
- approximately 8–14 Chinese characters per displayed card when natural;
- bottom-center placement within the reserved caption zone.

## Template 1: `editorial-illustrated`

### Visual structure

- Warm paper background with restrained grain.
- Optional generic series label.
- Large editorial headline.
- Two or three progressive keyword cards.
- One centered semantic vector illustration.
- Bottom caption band.

### Motion

- The incoming headline starts visibly on the boundary frame through a
  six-frame mask.
- Keywords reveal sequentially over six frames each.
- The illustration draws on over 10–14 frames and then settles into fill.
- The final keyword and illustration hold for at least 0.8 seconds.
- No outgoing-scene residue and no content-empty boundary frame.

### Preservation rule

The accepted editorial JSX, proportional zones, vector motif library, palette,
and motion timing remain behaviorally unchanged. Refactoring may rename files
or route compilation, but visual output must match the accepted pilot.

### Pilot audio

The 15-second editorial pilot keeps its narration, native captions, and gentle
background music. Music remains on a follower audio track with narration as
the anchor.

## Template 2: `neon-infographic`

### Visual direction

The neon template adapts the information hierarchy of
`动态文字＋用户旁白＋轻柔BGM v3` into a generic dark technology system:

- near-black navy background: `#06101D` to `#0B1728`;
- primary cyan: `#43E7FF`;
- violet: `#8B6CFF`;
- magenta: `#FF4FD8`;
- optional lime signal: `#B8FF5A`;
- high-contrast text: `#EAFBFF`;
- restrained neon bloom around meaningful active strokes only.

It does not use a large illustration. Meaning is carried by typography,
relative data shape, topology, comparison, and ordered activation.

### Proportional zones

| Zone | Horizontal range | Vertical range | Use |
| --- | --- | --- | --- |
| Global safe zone | 6%–94% | 6%–78% | All main content |
| Optional series label | 6%–94% | 8%–13% | Generic label only |
| Dynamic text zone | 6%–94% | 15%–42% | Kicker, headline, explanation, keywords |
| Infographic zone | 6%–94% | 43%–76% | One semantic neon module |
| Buffer | 6%–94% | 76%–78% | Separation from captions |
| Caption zone | 0%–100% | 78%–100% | Native captions only |

No page number is rendered.

### Scene text hierarchy

Each scene contains:

- one short kicker or category label;
- one headline;
- zero or one supporting sentence;
- two or three timed keywords.

The headline is present at the scene boundary through an incoming-only mask.
Supporting text and keywords reveal in semantic order. Text blocks use natural
layout rather than independent hard-coded vertical coordinates.

### Neon module library

Each scene selects exactly one module:

1. `metric-stack`
   - one primary metric or qualitative status;
   - up to three supporting labels;
   - animated bars, rings, or signal marks.
2. `node-network`
   - one central node;
   - two to four connected nodes;
   - edges activate in narration order.
3. `bar-trend`
   - two to five bars or one trend path;
   - supports comparative or directional meaning;
   - displays numeric labels only when numbers exist in the source.
4. `split-comparison`
   - left and right semantic states;
   - contrasting labels, markers, and one conclusion bridge.
5. `step-flow`
   - two to four ordered stages;
   - nodes and connectors activate sequentially.

The renderer must not fabricate numbers. When the script contains no measured
value, modules use qualitative labels, relative lengths, state markers, or
unlabelled directional movement.

### Module selection

Select modules by the viewer’s information job:

| Information job | Module |
| --- | --- |
| One important amount, threshold, or status | `metric-stack` |
| Resources, dependencies, channels, or relationships | `node-network` |
| Increase, decrease, gap, or directional comparison | `bar-trend` |
| Two competing ideas, before/after, true/false | `split-comparison` |
| Method, process, sequence, or progression | `step-flow` |

Adjacent scenes should not repeat the same module unless the viewer task is
intentionally recurring.

### Motion

- Headline: six-frame incoming-only mask, visible on the boundary frame.
- Supporting sentence: short masked reveal after the headline.
- Keywords: six-frame stagger tied to transcript timing.
- Module: 10–16 frame line build, node activation, bar growth, or data
  progression.
- Neon glow appears only after the corresponding stroke or node activates.
- Final state holds for at least 0.8 seconds.
- Background remains static.
- No full-frame flash, outgoing-scene residue, shimmer loop, or decorative
  scan line.

### Pilot audio

The neon pilot uses the same 15-second narration span and caption segmentation
as the editorial pilot. It includes a gentle technology-ambient music bed on a
follower track, mixed below narration.

## Asset Architecture

Use four source templates:

```text
assets/
  editorial-background-template.jsx
  editorial-content-template.jsx
  neon-background-template.jsx
  neon-content-template.jsx
```

The compiler selects one pair from `plan.template`. It does not load both
content renderers and branch inside one large component.

Shared utilities remain in compiler/validator code only when they are truly
format-neutral:

- plan loading;
- canvas and duration validation;
- branding validation;
- build manifest structure;
- CLI argument parsing.

Template-specific scene validation stays in explicit validator branches:

- editorial scenes require `illustration.motif`;
- neon scenes require `visualModule.type` and module-specific content;
- neon scenes reject `illustration`;
- editorial scenes reject `visualModule`.

## ChatCut Timeline Architecture

Each 15-second pilot contains:

- V1: one static full-duration background Motion Graphic;
- V2: one full-duration template-specific content Motion Graphic;
- A1: narration anchor;
- A2: music follower;
- native timeline captions sourced from A1.

The existing timeline `Skill 验收｜15s｜编辑纸感` is preserved and reused as the
editorial acceptance reference. A new timeline named
`Skill 验收｜15s｜霓虹信息图` is created for the neon pilot.

The timelines `Skill 验收｜15s｜深色暮光` and
`动态文字＋用户旁白＋轻柔BGM v3` remain untouched as historical references and are
not described as public Skill templates.

## Verification Strategy

### Automated validation

Add failing tests before implementation for:

- exactly two accepted `template` values;
- rejection of the old public `theme`-only shape;
- editorial plans requiring illustration motifs;
- neon plans requiring visual modules and rejecting illustrations;
- compiler selection of separate asset files;
- no personal branding or page-number defaults;
- no generated-image property or image URL in the neon bundle;
- complete 15-, 60-, and 120-second compilation for both templates;
- scene contiguity, keyword timing, and final hold;
- non-empty incoming scene boundaries.

### Real ChatCut validation

For each pilot:

- register compiled Motion Graphics through the real ChatCut validator;
- verify editable layers and properties;
- inspect the first frame, every scene boundary, one settled frame per scene,
  and the final frame;
- compare the two 15-second pilots side by side;
- confirm music ducking and caption placement;
- confirm no export was created.

### Acceptance criteria

The change is accepted when:

1. The Skill publicly lists exactly two templates.
2. The editorial pilot is visually unchanged and includes music.
3. The neon pilot has a visibly different composition, not an editorial
   recolor.
4. Every neon scene uses one chart, connection, data, comparison, or flow
   module and no illustration.
5. Both pilots are 1080×1920, 30fps, and 15 seconds.
6. Titles and keywords follow narration timing without boundary flashes.
7. Captions remain readable and editable.
8. All local tests, official Skill validation, ChatCut asset validation, and
   pixel inspection pass.
9. Existing timelines and assets remain intact.
10. No video is exported without a separate user request.

## Failure Handling

- Invalid discriminated plan: stop before asset creation and report the exact
  schema mismatch.
- Unsupported legacy `theme`: return the explicit migration mapping.
- Neon module lacks required labels: repair the plan from script meaning
  without inventing numbers.
- Motion Graphic validation failure: preserve registered assets, classify the
  failure, and patch only the affected template.
- Music failure: keep the editable pilot and report the missing music layer.
- Pixel proof unavailable: do not claim visual acceptance; leave the timeline
  ready for user review.

