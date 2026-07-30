# Three-Scene Preview and Product Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the public repository demonstrate real card-to-card switching and accurately position the Skill as a full-frame, no-presenter explainer-video workflow.

**Architecture:** Recompose the two existing README preview strips from six already accepted stable frames, preserving each output at `840 × 498`. Update only public README wording and image descriptions; leave `SKILL.md`, renderers, templates, source videos, timing, audio, and the hero image unchanged.

**Tech Stack:** Markdown, PNG, FFmpeg/FFprobe, Node.js built-in test runner, Codex Skill validator, Git, GitHub.

## Global Constraints

- Keep exactly two public templates: `editorial-illustrated` and `neon-infographic`.
- Keep `docs/assets/editorial-preview.png` and `docs/assets/neon-preview.png` at exactly `840 × 498`.
- Show three different semantic scenes and titles in each preview strip.
- Position the output as a full-frame card video for content that does not require the creator to appear onscreen.
- If a talking-head recording is supplied, use it only as a narration source; do not claim that the person appears in the generated visual.
- Do not change renderer behavior, templates, timing, transitions, subtitles, music, source videos, or the hero image.
- Do not add brittle automated assertions for human-language marketing copy or visual semantics; verify those requirements by direct review.
- Publish the completed correction directly to `main`.

---

### Task 1: Rebuild the Editorial and Neon Preview Strips

**Files:**
- Modify: `docs/assets/editorial-preview.png`
- Modify: `docs/assets/neon-preview.png`

**Interfaces:**
- Consumes: six accepted `882 × 1568` JPEG frames under `/private/tmp/chatcut-skill-final/` and `/private/tmp/chatcut-neon-frames/`
- Produces: two PNG preview strips, each exactly `840 × 498`, referenced by `README.md`

- [ ] **Step 1: Confirm all six source frames are available**

Run:

```bash
for f in \
  /private/tmp/chatcut-skill-final/editorial-a-f120.jpg \
  /private/tmp/chatcut-skill-final/editorial-a-f168.jpg \
  /private/tmp/chatcut-skill-final/editorial-b-f318.jpg \
  /private/tmp/chatcut-neon-frames/frame-86.jpg \
  /private/tmp/chatcut-neon-frames/frame-187.jpg \
  /private/tmp/chatcut-neon-frames/frame-389.jpg
do
  test -f "$f" || exit 1
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height -of csv=p=0:s=x "$f"
done
```

Expected: six lines of `882x1568`, with exit status `0`.

- [ ] **Step 2: Compose the editorial strip**

Run:

```bash
ffmpeg -y \
  -i /private/tmp/chatcut-skill-final/editorial-a-f120.jpg \
  -i /private/tmp/chatcut-skill-final/editorial-a-f168.jpg \
  -i /private/tmp/chatcut-skill-final/editorial-b-f318.jpg \
  -filter_complex \
  "[0:v]scale=280:498[e0];[1:v]scale=280:498[e1];[2:v]scale=280:498[e2];[e0][e1][e2]hstack=inputs=3[out]" \
  -map "[out]" -frames:v 1 -update 1 -c:v png \
  docs/assets/editorial-preview.png
```

Expected: the output contains, from left to right, the stable cards titled:

1. `先去大厂几年，创业更稳？`
2. `不真正下场，就看不见`
3. `赛道有没有人愿意付钱？`

- [ ] **Step 3: Compose the neon strip**

Run:

```bash
ffmpeg -y \
  -i /private/tmp/chatcut-neon-frames/frame-86.jpg \
  -i /private/tmp/chatcut-neon-frames/frame-187.jpg \
  -i /private/tmp/chatcut-neon-frames/frame-389.jpg \
  -filter_complex \
  "[0:v]scale=280:498[n0];[1:v]scale=280:498[n1];[2:v]scale=280:498[n2];[n0][n1][n2]hstack=inputs=3[out]" \
  -map "[out]" -frames:v 1 -update 1 -c:v png \
  docs/assets/neon-preview.png
```

Expected: the output contains, from left to right, the stable cards titled:

1. `先去大厂，再创业？`
2. `不真正下场，就看不见`
3. `愿意付钱，才算验证`

- [ ] **Step 4: Verify dimensions**

Run:

```bash
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height -of csv=p=0:s=x \
  docs/assets/editorial-preview.png
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height -of csv=p=0:s=x \
  docs/assets/neon-preview.png
```

Expected:

```text
840x498
840x498
```

- [ ] **Step 5: Perform direct visual review**

Open both PNG files at original detail and confirm:

- each strip shows three different titles;
- the editorial visuals are respectively path choice, magnifier, and payment validation;
- the neon modules are respectively split comparison, node network, and bar/metric;
- no frame is caught mid-transition or visually cropped;
- the three panels read as three card changes, not three states of one card.

- [ ] **Step 6: Commit the preview correction**

Run:

```bash
git add docs/assets/editorial-preview.png docs/assets/neon-preview.png
git commit -m "docs: show three distinct card scenes"
```

Expected: one commit containing only the two rebuilt PNG assets.

### Task 2: Correct the Public Positioning and Preview Descriptions

**Files:**
- Modify: `README.md:31-45`
- Modify: `README.md:99-108`
- Modify: `README.md:112-121`

**Interfaces:**
- Consumes: the rebuilt preview paths from Task 1
- Produces: public copy that accurately describes three-scene switching and no-presenter output

- [ ] **Step 1: Update the editorial preview description**

Change the image alt text from a one-card progression description to:

```markdown
![编辑纸感模板的三个不同标题、关键词和插画场景](docs/assets/editorial-preview.png)
```

Replace the suitability sentence with:

```markdown
适合无需本人出镜的观点表达、个人故事、知识分享与商业思考短视频。
```

- [ ] **Step 2: Update the neon preview description**

Change the image alt text to:

```markdown
![霓虹信息图模板的三个不同标题与信息图场景](docs/assets/neon-preview.png)
```

Keep its AI、产品、商业、数据、流程、工具教程与技术内容 positioning.

- [ ] **Step 3: Add a shared no-presenter explanation**

Replace the sentence immediately after the neon suitability line with:

```markdown
上面的图片均来自实际可编辑时间线的验收帧，不是概念效果图；每组展示的是同一段口播中连续切换的三个不同场景。两套模板都默认生成全屏卡片视频，不展示真人画面。
```

- [ ] **Step 4: Correct the template comparison table**

Change the `适合内容` row to:

```markdown
| 适合内容 | 观点、故事、知识、商业思考 | AI、产品、商业、数据、教程 |
```

- [ ] **Step 5: Clarify talking-head input handling**

Replace the input bullet with:

```markdown
- 已录制的旁白音频，或仅用于提取旁白声音的真人口播视频；
```

Add this sentence after the input list:

```markdown
如果提供真人口播视频，最终画面仍是全屏卡片，人物不会出现在成片中。
```

- [ ] **Step 6: Review all positioning language**

Run:

```bash
rg -n "真人|个人 IP|出镜|editorial-preview|neon-preview" README.md SKILL.md agents references
```

Expected:

- README contains the intentional phrases `无需本人出镜`, `仅用于提取旁白声音的真人口播视频`, and `人物不会出现在成片中`;
- no README sentence claims suitability for `真人 IP 口播` or `个人 IP`;
- both preview links remain intact;
- `SKILL.md`, `agents/`, and `references/` have no conflicting positioning that requires a behavior change.

- [ ] **Step 7: Commit the README correction**

Run:

```bash
git add README.md
git commit -m "docs: clarify no-presenter video positioning"
```

Expected: one commit containing only `README.md`.

### Task 3: Validate the Release and Publish to Main

**Files:**
- Verify: `README.md`
- Verify: `docs/assets/editorial-preview.png`
- Verify: `docs/assets/neon-preview.png`
- Verify: complete Skill package

**Interfaces:**
- Consumes: Tasks 1 and 2 commits
- Produces: a validated public `main` branch at `https://github.com/kaomei/script-to-card-video`

- [ ] **Step 1: Run release-package tests**

Run:

```bash
node --test scripts/tests/release-package.test.mjs
```

Expected: all release-package subtests pass.

- [ ] **Step 2: Run the complete project test suite**

Run:

```bash
node --test scripts/tests/*.test.mjs
```

Expected: all 41 tests pass with zero failures.

- [ ] **Step 3: Run the official Skill validator**

Run:

```bash
PYTHONPATH=/private/tmp/script-card-validate-pydeps \
python3 /Users/eva/.codex/skills/.system/skill-creator/scripts/quick_validate.py .
```

Expected:

```text
Skill is valid!
```

- [ ] **Step 4: Check repository integrity**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors and no uncommitted files.

- [ ] **Step 5: Push the validated commits**

Run:

```bash
git push origin main
```

Expected: `origin/main` advances to the local `main` commit.

- [ ] **Step 6: Verify the public GitHub page**

Open:

```text
https://github.com/kaomei/script-to-card-video
```

Confirm:

- the README loads;
- both preview images load;
- each natural image size is `840 × 498`;
- each strip visibly contains three different titles and three different scene modules;
- the public copy says the creator does not appear onscreen;
- no public suitability claim says `真人 IP 口播` or `个人 IP`.

- [ ] **Step 7: Record final evidence**

Capture the final commit hash and report:

- the GitHub repository link;
- the two updated preview images;
- 41/41 project tests passing;
- official Skill validation passing;
- public GitHub verification passing.
