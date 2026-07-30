# `script-to-card-video` Open-Source Release Design

Date: 2026-07-30

## Objective

Publish the existing, verified two-template Codex Skill as a public GitHub
repository at `kaomei/script-to-card-video`.

The repository should make the result immediately understandable to creators:
provide a narration script and receive an editable 9:16 motion-card video with
timed typography, visuals, captions, narration, and optional music.

The release must be honest about the current implementation, visually
appealing, easy to install, and structured so that a new contributor can
understand the two templates without reading the renderer source first.

## Public Positioning

Public name:

```text
script-to-card-video
```

Primary promise:

> Turn a narration script into an editable vertical motion-card video.

The repository name, Skill name, hero title, and social-preview copy do not use
`ChatCut`. The README still states the runtime dependency clearly in setup and
architecture sections so that installation expectations are accurate.

The project is presented as a reusable Codex Skill, not as a hosted SaaS
product and not as a PPT generator.

## Supported Templates

The release exposes exactly two templates.

### `editorial-illustrated`

- warm editorial-paper visual language;
- large headline and progressively revealed keyword cards;
- one semantic hand-drawn vector illustration per scene;
- native phrase-paced captions;
- optional gentle background music;
- best suited to viewpoints, stories, creator education, and explanatory
  talking-head content.

### `neon-infographic`

- dark technology background and restrained neon accents;
- dynamic headline, supporting text, and timed keywords;
- charts, node networks, comparisons, metrics, and step flows;
- no generated or character illustration;
- native phrase-paced captions;
- optional technology-ambient background music;
- best suited to AI, product, business, data, process, and technical content.

The README must not imply that arbitrary themes, PPT output, automatic MP4
export, or unlimited visual systems already exist.

## README Experience

The README uses a creator-friendly product-landing-page structure while
remaining technically complete.

### 1. Hero

- project name;
- one-sentence Chinese value proposition;
- short English summary;
- badges for Codex Skill, two templates, 9:16, and MIT;
- a real visual overview assembled from verified output.

### 2. Immediate proof

- side-by-side preview of the editorial and neon templates;
- short captions explaining the structural difference;
- real frames or contact sheets from the accepted 15-second pilots;
- no conceptual mockups presented as rendered output.

### 3. Thirty-second quick start

- install from the GitHub repository;
- restart Codex if required by the installer;
- invoke the Skill with a narration script;
- select `editorial-illustrated` or `neon-infographic`;
- open the resulting editable video project.

### 4. Input and output

Show one concise Chinese prompt and the expected editable layers:

- background;
- motion content;
- narration;
- captions;
- optional music.

### 5. Template comparison

A compact table compares:

- visual language;
- semantic visual system;
- ideal content;
- illustration policy;
- motion behavior.

### 6. How it works

Explain the verified pipeline:

1. analyze narration and timing;
2. split the script into semantic scenes;
3. select a template-specific visual module;
4. validate the scene plan;
5. compile editable motion graphics;
6. place narration, captions, and optional music;
7. inspect boundaries and settled frames.

### 7. Customization

Document editable colors, copy, timing, module data, captions, and music
without claiming a visual theme builder.

### 8. Technical reference

Link to:

- `SKILL.md`;
- the scene schema;
- the visual system;
- the validator and compiler;
- template source files.

### 9. Reliability and limitations

State the existing automated test coverage and the important constraints:

- 1080×1920, 30 fps;
- narration-led scene timing;
- two public templates;
- no PPT output;
- no automatic export;
- output quality still depends on semantic scene planning and source audio.

### 10. Community

- roadmap;
- contributing notes;
- issue prompts for new modules and examples;
- MIT license;
- a concise star call-to-action based on usefulness, without inflated claims.

## Visual Assets

Repository visuals live under:

```text
docs/assets/
  hero-overview.*
  editorial-preview.*
  neon-preview.*
  workflow.*
```

Preferred formats:

- PNG or WebP for sharp static proof;
- a short optimized GIF only when it materially shows motion;
- SVG for the workflow diagram when practical.

The first release may use verified contact sheets and representative frames if
a compact motion preview cannot be generated reliably. Every visual must be
readable on GitHub in both desktop and mobile layouts.

## Repository Changes

Rename public metadata from `chatcut-script-to-card-video` to
`script-to-card-video` in:

- `SKILL.md` frontmatter and user-facing references;
- `agents/openai.yaml`;
- tests that assert the public Skill contract;
- repository documentation.

Keep implementation-specific ChatCut references where they describe required
tools, editable timeline behavior, or runtime setup.

Add:

- `README.md`;
- `LICENSE` using the MIT License;
- `CONTRIBUTING.md`;
- `docs/assets/` preview assets;
- release-oriented installation and usage examples.

Do not rewrite the accepted renderers merely for the release. Preserve the
verified two-template behavior.

## Publication

1. Implement and verify the release changes locally.
2. Run all Skill contract, compiler, and validator tests.
3. Run the official Skill validation.
4. Inspect the README links and embedded visuals.
5. Commit the release changes on `main`.
6. Create public repository `kaomei/script-to-card-video`.
7. Push `main`.
8. Verify the public repository description, default branch, README rendering,
   license detection, and asset loading.

## Acceptance Criteria

- The public repository is named `kaomei/script-to-card-video`.
- The Skill metadata name is `script-to-card-video`.
- The README is Chinese-first with a concise English summary.
- Both templates are clearly visible and structurally differentiated.
- Preview images come from real verified outputs.
- Installation and invocation examples are copyable.
- ChatCut is absent from public naming but accurately disclosed as a runtime
  dependency.
- Existing rendering behavior remains unchanged.
- All automated checks pass.
- The repository is public and carries an MIT license.
