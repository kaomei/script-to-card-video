# `script-to-card-video` Open-Source Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the verified Skill, package it with real visual proof and complete open-source documentation, then publish it as the public repository `kaomei/script-to-card-video`.

**Architecture:** Keep the two accepted renderers and scene-plan pipeline unchanged. Limit implementation work to the public Skill contract, release assets, repository documentation, packaging tests, and GitHub metadata; use verified frames from the accepted 15-second pilots as visual proof.

**Tech Stack:** Codex Skill Markdown/YAML, Node.js ESM with `node:test`, FFmpeg for mechanical image composition, Git, GitHub CLI, ChatCut MCP runtime dependency.

## Global Constraints

- The public repository is `kaomei/script-to-card-video`.
- The Skill metadata name is `script-to-card-video`.
- The README is Chinese-first and includes a concise English summary.
- Public naming does not include `ChatCut`; runtime setup and architecture disclose the ChatCut dependency accurately.
- Public templates remain exactly `editorial-illustrated` and `neon-infographic`.
- Preview images come from real, verified 15-second pilot frames.
- Rendering behavior and the four JSX template files remain unchanged.
- Output remains 1080×1920 at 30 fps.
- No PPT/PPTX output and no automatic MP4 export.
- The public repository uses the MIT License.
- All existing tests and official Skill validation must pass before publication.

---

## File Map

| File | Responsibility |
| --- | --- |
| `SKILL.md` | Public Skill name, trigger description, template contract, and runtime workflow |
| `agents/openai.yaml` | Codex display name, default invocation, and ChatCut MCP dependency |
| `scripts/tests/skill-contract.test.mjs` | Public naming and two-template contract regression tests |
| `scripts/tests/release-package.test.mjs` | README, community files, link targets, and proof-asset package tests |
| `README.md` | Chinese-first product landing page and technical quick start |
| `CONTRIBUTING.md` | Contribution scope, checks, and pull-request expectations |
| `LICENSE` | MIT License |
| `docs/assets/hero-overview.png` | Side-by-side real output overview |
| `docs/assets/editorial-preview.png` | Three-frame real editorial sequence |
| `docs/assets/neon-preview.png` | Three-frame real neon sequence |
| `docs/assets/workflow.svg` | Script-to-editable-timeline pipeline diagram |

---

### Task 1: Rename the public Skill contract

**Files:**
- Modify: `scripts/tests/skill-contract.test.mjs`
- Modify: `SKILL.md`
- Modify: `agents/openai.yaml`

**Interfaces:**
- Consumes: existing two-template workflow and ChatCut MCP dependency
- Produces: invocable Skill name `$script-to-card-video`

- [ ] **Step 1: Add a failing public-name contract test**

Append this test to `scripts/tests/skill-contract.test.mjs`:

```javascript
test("public naming uses script-to-card-video while retaining the runtime dependency", async () => {
  const [skill, agent] = await Promise.all([
    fs.readFile(path.join(root, "SKILL.md"), "utf8"),
    fs.readFile(path.join(root, "agents/openai.yaml"), "utf8"),
  ]);

  assert.match(skill, /^name: script-to-card-video$/m);
  assert.match(skill, /^# Script to Card Video$/m);
  assert.match(agent, /Use \$script-to-card-video/);
  assert.match(agent, /value: "chatcut"/);
  assert.doesNotMatch(skill, /name: chatcut-script-to-card-video/);
  assert.doesNotMatch(agent, /\$chatcut-script-to-card-video/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test scripts/tests/skill-contract.test.mjs
```

Expected: FAIL because `SKILL.md` and `agents/openai.yaml` still use
`chatcut-script-to-card-video`.

- [ ] **Step 3: Rename user-facing Skill metadata**

Apply these exact public-name changes:

```yaml
# SKILL.md frontmatter
name: script-to-card-video
description: Use when a user provides a Chinese talking script or narration and wants an editable 9:16 knowledge, opinion, tutorial, or voiceover card video using either editorial vector illustrations or dark neon infographic components, with transcript-timed keywords, captions, optional music, and no PPTX output.
```

Use this H1:

```markdown
# Script to Card Video
```

Update `agents/openai.yaml` to:

```yaml
interface:
  display_name: "竖屏动态卡片视频"
  short_description: "用编辑插画或霓虹信息图模板生成可编辑竖屏口播视频"
  default_prompt: "Use $script-to-card-video to turn this Chinese talking script into an editable 9:16 card video; ask me to choose editorial-illustrated or neon-infographic when I have not specified a template, and do not export it."
```

Keep the existing dependency block unchanged:

```yaml
dependencies:
  tools:
    - type: "mcp"
      value: "chatcut"
      description: "ChatCut MCP server for creating and verifying editable video timelines"
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test scripts/tests/skill-contract.test.mjs
```

Expected: all public Skill contract tests PASS.

- [ ] **Step 5: Commit the public rename**

```bash
git add SKILL.md agents/openai.yaml scripts/tests/skill-contract.test.mjs
git commit -m "refactor: rename public card video skill"
```

---

### Task 2: Package real visual proof

**Files:**
- Create: `scripts/tests/release-package.test.mjs`
- Create: `docs/assets/hero-overview.png`
- Create: `docs/assets/editorial-preview.png`
- Create: `docs/assets/neon-preview.png`
- Create: `docs/assets/workflow.svg`

**Interfaces:**
- Consumes:
  - `/private/tmp/chatcut-skill-final2/editorial-f300.jpg`
  - `/private/tmp/chatcut-skill-final2/editorial-f318.jpg`
  - `/private/tmp/chatcut-skill-final2/editorial-f420.jpg`
  - `/private/tmp/chatcut-neon-frames/frame-270.jpg`
  - `/private/tmp/chatcut-neon-frames/frame-302.jpg`
  - `/private/tmp/chatcut-neon-frames/frame-416.jpg`
- Produces: four stable README assets under `docs/assets/`

- [ ] **Step 1: Write a failing asset-package test**

Create `scripts/tests/release-package.test.mjs`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");

const requiredAssets = [
  "docs/assets/hero-overview.png",
  "docs/assets/editorial-preview.png",
  "docs/assets/neon-preview.png",
  "docs/assets/workflow.svg",
];

test("release package contains non-empty visual proof assets", async () => {
  for (const relativePath of requiredAssets) {
    const absolutePath = path.join(root, relativePath);
    const stat = await fs.stat(absolutePath);
    assert.equal(stat.isFile(), true, `${relativePath} must be a file`);
    assert.ok(stat.size > 1000, `${relativePath} must not be an empty placeholder`);
  }
});

test("workflow asset is an SVG document", async () => {
  const workflow = await fs.readFile(
    path.join(root, "docs/assets/workflow.svg"),
    "utf8",
  );
  assert.match(workflow, /<svg/);
  assert.match(workflow, /口播稿/);
  assert.match(workflow, /可编辑时间线/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test scripts/tests/release-package.test.mjs
```

Expected: FAIL with `ENOENT` because `docs/assets/` does not exist.

- [ ] **Step 3: Compose three PNG assets from verified frames**

Create `docs/assets/`, then run these FFmpeg compositions:

```bash
ffmpeg -y \
  -i /private/tmp/chatcut-skill-final2/editorial-f420.jpg \
  -i /private/tmp/chatcut-neon-frames/frame-416.jpg \
  -filter_complex "[0:v]scale=420:746,pad=460:786:20:20:color=#F5E9DD[e];[1:v]scale=420:746,pad=460:786:20:20:color=#06101D[n];[e][n]hstack=inputs=2[out]" \
  -map "[out]" -frames:v 1 -c:v png \
  docs/assets/hero-overview.png
```

```bash
ffmpeg -y \
  -i /private/tmp/chatcut-skill-final2/editorial-f300.jpg \
  -i /private/tmp/chatcut-skill-final2/editorial-f318.jpg \
  -i /private/tmp/chatcut-skill-final2/editorial-f420.jpg \
  -filter_complex "[0:v]scale=280:498[a];[1:v]scale=280:498[b];[2:v]scale=280:498[c];[a][b][c]hstack=inputs=3[out]" \
  -map "[out]" -frames:v 1 -c:v png \
  docs/assets/editorial-preview.png
```

```bash
ffmpeg -y \
  -i /private/tmp/chatcut-neon-frames/frame-270.jpg \
  -i /private/tmp/chatcut-neon-frames/frame-302.jpg \
  -i /private/tmp/chatcut-neon-frames/frame-416.jpg \
  -filter_complex "[0:v]scale=280:498[a];[1:v]scale=280:498[b];[2:v]scale=280:498[c];[a][b][c]hstack=inputs=3[out]" \
  -map "[out]" -frames:v 1 -c:v png \
  docs/assets/neon-preview.png
```

- [ ] **Step 4: Add the exact workflow SVG**

Create `docs/assets/workflow.svg` as a 1200×280 diagram with:

- background `#07111F`;
- five square-corner cards labeled `口播稿`, `语音时间轴`, `语义场景`, `模板渲染`, `可编辑时间线`;
- cyan arrows between cards;
- orange accent on the editorial branch;
- violet accent on the neon branch;
- accessible `<title>` and `<desc>` elements.

The diagram text must remain live SVG text rather than rasterized text.

- [ ] **Step 5: Run the focused test and inspect the images**

Run:

```bash
node --test scripts/tests/release-package.test.mjs
ffprobe -v error -show_entries stream=width,height -of csv=p=0 docs/assets/hero-overview.png
ffprobe -v error -show_entries stream=width,height -of csv=p=0 docs/assets/editorial-preview.png
ffprobe -v error -show_entries stream=width,height -of csv=p=0 docs/assets/neon-preview.png
```

Expected:

```text
920,786
840,498
840,498
```

Visually inspect all three PNG files and the SVG. Confirm that no frame is
cropped, distorted, mislabeled, or presented as a mockup.

- [ ] **Step 6: Commit the visual proof package**

```bash
git add docs/assets scripts/tests/release-package.test.mjs
git commit -m "docs: add verified template previews"
```

---

### Task 3: Build the open-source landing page and community package

**Files:**
- Modify: `scripts/tests/release-package.test.mjs`
- Create: `README.md`
- Create: `CONTRIBUTING.md`
- Create: `LICENSE`

**Interfaces:**
- Consumes: four assets from Task 2 and `$script-to-card-video` from Task 1
- Produces: a complete GitHub landing page and MIT-licensed contribution surface

- [ ] **Step 1: Add failing documentation-package tests**

Append to `scripts/tests/release-package.test.mjs`:

```javascript
test("README exposes the complete public release contract", async () => {
  const readme = await fs.readFile(path.join(root, "README.md"), "utf8");

  for (const heading of [
    "## 效果预览",
    "## 30 秒开始使用",
    "## 两套模板",
    "## 输入与输出",
    "## 工作原理",
    "## 自定义",
    "## 已知边界",
    "## Roadmap",
    "## Contributing",
    "## License",
  ]) {
    assert.match(readme, new RegExp(heading));
  }

  assert.match(readme, /\$script-to-card-video/);
  assert.match(readme, /editorial-illustrated/);
  assert.match(readme, /neon-infographic/);
  assert.match(readme, /docs\/assets\/hero-overview\.png/);
  assert.match(readme, /docs\/assets\/editorial-preview\.png/);
  assert.match(readme, /docs\/assets\/neon-preview\.png/);
  assert.match(readme, /docs\/assets\/workflow\.svg/);
  assert.match(readme, /ChatCut/);
  assert.match(readme, /MIT/);
  assert.doesNotMatch(readme, /\$chatcut-script-to-card-video/);
});

test("README local links resolve", async () => {
  const readme = await fs.readFile(path.join(root, "README.md"), "utf8");
  const localLinks = [...readme.matchAll(/\]\((?!https?:|#)([^)]+)\)/g)]
    .map((match) => match[1].split("#")[0])
    .filter(Boolean);

  for (const relativePath of new Set(localLinks)) {
    const stat = await fs.stat(path.join(root, relativePath));
    assert.ok(stat.isFile() || stat.isDirectory(), `${relativePath} must resolve`);
  }
});

test("community and license files exist", async () => {
  const [contributing, license] = await Promise.all([
    fs.readFile(path.join(root, "CONTRIBUTING.md"), "utf8"),
    fs.readFile(path.join(root, "LICENSE"), "utf8"),
  ]);

  assert.match(contributing, /node --test scripts\/tests\/\*\.test\.mjs/);
  assert.match(contributing, /editorial-illustrated/);
  assert.match(contributing, /neon-infographic/);
  assert.match(license, /MIT License/);
  assert.match(license, /Copyright \(c\) 2026 kaomei/);
});
```

- [ ] **Step 2: Run the package test and verify RED**

Run:

```bash
node --test scripts/tests/release-package.test.mjs
```

Expected: asset tests PASS; README/community tests FAIL with `ENOENT`.

- [ ] **Step 3: Create the README with this exact information architecture**

Create `README.md` with:

1. centered hero title `script-to-card-video`;
2. Chinese promise `把一段口播稿，变成可编辑的竖屏动态卡片视频。`;
3. English summary `A Codex Skill that turns narration scripts into editable 9:16 motion-card videos.`;
4. badges for `Codex Skill`, `2 templates`, `1080×1920`, and `MIT`;
5. `docs/assets/hero-overview.png`;
6. “效果预览” with both three-frame proof strips;
7. “30 秒开始使用” with these commands:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo kaomei/script-to-card-video \
  --path . \
  --name script-to-card-video
```

```text
Use $script-to-card-video to turn the following Chinese script into an
editorial-illustrated 9:16 card video with captions and gentle music:

<粘贴口播稿>
```

8. a two-template comparison table that states:
   - editorial uses semantic vector illustration;
   - neon uses charts, networks, metrics, comparisons, and flows;
   - neon does not generate character illustration;
9. an “输入与输出” layer list: background, motion content, narration,
   captions, optional music;
10. `docs/assets/workflow.svg` and the seven-step verified pipeline;
11. customization of copy, colors, timing, module data, captions, and music;
12. links to `SKILL.md`, `references/scene-schema.md`,
    `references/visual-system.md`, and `CONTRIBUTING.md`;
13. known boundaries: two templates, 1080×1920/30fps, no PPT, no automatic
    export, ChatCut runtime dependency;
14. Roadmap items for more verified modules, more examples, and packaging
    improvements without promising dates;
15. contributing and MIT sections;
16. the closing line `如果它帮你少做了一次重复剪辑，欢迎点个 Star。`

Do not claim one-click MP4 generation, hosted service availability, universal
language support, or a template marketplace.

- [ ] **Step 4: Add contribution and license files**

Create `CONTRIBUTING.md` with:

- supported contribution types;
- a rule that new public templates require a design spec and real visual proof;
- a rule that renderer changes must preserve caption and scene-boundary safety;
- the commands:

```bash
node --test scripts/tests/*.test.mjs
python3 /Users/eva/.codex/skills/.system/skill-creator/scripts/quick_validate.py .
```

- pull-request evidence: test output plus before/after frames for visual changes.

Create `LICENSE` with the standard MIT License text and:

```text
Copyright (c) 2026 kaomei
```

- [ ] **Step 5: Run package tests and Markdown checks**

Run:

```bash
node --test scripts/tests/release-package.test.mjs
rg -n 'chatcut-script-to-card-video|\\$chatcut-script-to-card-video' README.md CONTRIBUTING.md SKILL.md agents/openai.yaml
git diff --check
```

Expected:

- all release-package tests PASS;
- `rg` returns no matches;
- `git diff --check` exits successfully.

- [ ] **Step 6: Commit the landing page**

```bash
git add README.md CONTRIBUTING.md LICENSE scripts/tests/release-package.test.mjs
git commit -m "docs: package open-source skill release"
```

---

### Task 4: Verify the complete local release

**Files:**
- Verify: all tracked files

**Interfaces:**
- Consumes: Tasks 1–3
- Produces: a clean, validated `main` commit ready for GitHub

- [ ] **Step 1: Run the full automated suite**

Run:

```bash
node --test scripts/tests/*.test.mjs
```

Expected: all tests PASS, including the existing validator/compiler tests and
the new release-package tests.

- [ ] **Step 2: Run official Skill validation**

Run:

```bash
python3 /Users/eva/.codex/skills/.system/skill-creator/scripts/quick_validate.py .
```

Expected:

```text
Skill is valid!
```

- [ ] **Step 3: Audit public naming and repository hygiene**

Run:

```bash
rg -n 'chatcut-script-to-card-video|\\$chatcut-script-to-card-video|WanCheng|晚橙|页码' \
  SKILL.md agents README.md CONTRIBUTING.md assets references
git diff --check
git status --short
```

Expected:

- the naming/branding scan returns no matches;
- `git diff --check` succeeds;
- the worktree is clean.

- [ ] **Step 4: Review the final commit range**

Run:

```bash
git log --oneline --decorate -8
git diff 6da3fea..HEAD --stat
```

Confirm that the release commits modify metadata, tests, documentation, and
proof assets only; no JSX renderer or compiler behavior changes.

---

### Task 5: Publish and verify `kaomei/script-to-card-video`

**Files:**
- External: GitHub repository `kaomei/script-to-card-video`

**Interfaces:**
- Consumes: clean validated local `main`
- Produces: public GitHub repository URL and post-publication install proof

- [ ] **Step 1: Confirm the target repository does not already exist**

Run:

```bash
gh repo view kaomei/script-to-card-video
```

Expected: GitHub reports that the repository cannot be found. If it exists,
inspect its default branch and remotes before changing anything; do not create
a duplicate repository.

- [ ] **Step 2: Create the public repository and push `main`**

Run:

```bash
gh repo create kaomei/script-to-card-video \
  --public \
  --description "Turn narration scripts into editable 9:16 motion-card videos with editorial or neon infographic templates." \
  --source . \
  --remote origin \
  --push
```

Expected: repository creation succeeds and local `main` tracks `origin/main`.

- [ ] **Step 3: Add discoverability topics**

Run:

```bash
gh repo edit kaomei/script-to-card-video \
  --enable-issues \
  --add-topic codex \
  --add-topic codex-skill \
  --add-topic motion-graphics \
  --add-topic video-editing \
  --add-topic short-video \
  --add-topic vertical-video
```

- [ ] **Step 4: Verify repository metadata and rendered files**

Run:

```bash
gh repo view kaomei/script-to-card-video \
  --json nameWithOwner,url,visibility,description,defaultBranchRef
gh api repos/kaomei/script-to-card-video/readme --jq '.name'
gh api repos/kaomei/script-to-card-video/license --jq '.license.spdx_id'
```

Expected:

- `nameWithOwner` is `kaomei/script-to-card-video`;
- visibility is `PUBLIC`;
- default branch is `main`;
- README name is `README.md`;
- license SPDX ID is `MIT`.

- [ ] **Step 5: Smoke-test installation from the public repository**

Create a fresh temporary destination and run:

```bash
python3 /Users/eva/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo kaomei/script-to-card-video \
  --path . \
  --name script-to-card-video \
  --dest /private/tmp/script-to-card-video-install-smoke
```

Expected:

```text
Installed script-to-card-video to /private/tmp/script-to-card-video-install-smoke/script-to-card-video
```

Then validate the installed copy:

```bash
python3 /Users/eva/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  /private/tmp/script-to-card-video-install-smoke/script-to-card-video
```

Expected:

```text
Skill is valid!
```

- [ ] **Step 6: Report the public handoff**

Provide:

- `https://github.com/kaomei/script-to-card-video`;
- the two public template names;
- the installation command;
- the exact test count;
- the official validation result;
- the post-publication install-smoke result.
