# Three-Scene Preview and Product Positioning Design

Date: 2026-07-30

## Objective

Correct the public README so visitors can immediately understand two things:

1. each template can switch between clearly different cards as the narration advances;
2. the Skill is designed for full-screen, no-presenter explainer videos rather than an onscreen talking-head format.

## Current Issue

The two README preview strips currently show three progression states from one card. The repeated title and similar visual make the strip look like a single static card gaining keywords, so it does not demonstrate scene switching.

The README also describes the editorial template as suitable for “真人 IP 口播” and “个人 IP”. That positioning is misleading: the generated result is a full-frame card video. A supplied talking-head recording may provide narration audio, but the person is not shown in the final visual.

## Approved Approach

Use approach A: rebuild each template strip from three stable frames taken from three different semantic scenes in the already accepted 15-second examples.

This changes only documentation copy and documentation preview assets. It does not alter the renderers, timing model, template behavior, or source videos.

## Preview Composition

Both preview images remain `840 × 498` pixels. Each source frame is scaled to `280 × 498`, then the three frames are placed side by side without gaps.

### Editorial Illustrated

Output:

- `docs/assets/editorial-preview.png`

Source frames, from left to right:

1. `/private/tmp/chatcut-skill-final/editorial-a-f120.jpg`
   - title: `先去大厂几年，创业更稳？`
   - visual: path choice from employment toward entrepreneurship
2. `/private/tmp/chatcut-skill-final/editorial-a-f168.jpg`
   - title: `不真正下场，就看不见`
   - visual: magnifier revealing hidden information
3. `/private/tmp/chatcut-skill-final/editorial-b-f318.jpg`
   - title: `赛道有没有人愿意付钱？`
   - visual: payment validation with heart and receipt

### Neon Infographic

Output:

- `docs/assets/neon-preview.png`

Source frames, from left to right:

1. `/private/tmp/chatcut-neon-frames/frame-86.jpg`
   - title: `先去大厂，再创业？`
   - visual module: split comparison
2. `/private/tmp/chatcut-neon-frames/frame-187.jpg`
   - title: `不真正下场，就看不见`
   - visual module: node network
3. `/private/tmp/chatcut-neon-frames/frame-389.jpg`
   - title: `愿意付钱，才算验证`
   - visual module: bar and metric

The selected frames are stable, complete card states rather than transition-boundary frames.

## README Positioning

Replace talking-head and personal-IP suitability claims with a clear no-presenter positioning:

> 适合无需本人出镜的 AI、科技、商业解说、观点与知识短视频。

Clarify accepted input:

- script text;
- narration audio;
- or a talking-head recording used only as the narration source.

Clarify final output:

- the video remains a full-frame card presentation;
- the person from an input recording does not appear onscreen.

Update both preview captions and alt text so each strip is described as three distinct cards or scenes, not three keyword-progression states from one card.

## Scope Exclusions

- No renderer or compiler changes.
- No timing, transition, subtitle, music, or audio changes.
- No regeneration of the accepted 15-second videos.
- No change to the template count or template names.
- No change to the hero image unless verification uncovers a factual conflict.

## Verification

Before publication:

1. Confirm both rebuilt previews are exactly `840 × 498`.
2. Visually inspect both previews and confirm each strip contains three distinct titles and three visibly different visual modules.
3. Review the README and confirm it no longer markets the Skill as a真人/个人-IP onscreen format.
4. Confirm the README explicitly explains the no-presenter output and the audio-only use of an optional talking-head recording.
5. Run the complete project test suite, including release-package checks.
6. Run the official Skill validator.
7. Run `git diff --check`.

After pushing to `main`:

1. Confirm the public README loads.
2. Confirm both preview assets load at their natural `840 × 498` dimensions.
3. Confirm the public page shows three clearly different scenes for each template.

## Publication

Commit the documentation and preview-asset correction directly to `main`, then push it to:

- `https://github.com/kaomei/script-to-card-video`
