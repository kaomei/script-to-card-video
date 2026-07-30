# Two-Template Card Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current one-layout/two-palette model with an unchanged editorial illustration template and a separate dark neon infographic template, then prove both with editable 15-second ChatCut pilots.

**Architecture:** Add a required `template` discriminator and validate editorial and neon scenes as separate shapes. Compile each template from its own background/content JSX pair; keep shared orchestration in the validator/compiler, but keep visual renderers isolated. Preserve the accepted editorial ChatCut timeline, create one new neon pilot, and stop before export.

**Tech Stack:** Node.js ESM, `node:test`, pure JavaScript JSX Motion Graphics, ChatCut MCP, native ChatCut captions/audio tracks, 1080×1920 at 30fps.

## Global Constraints

- Public templates are exactly `editorial-illustrated` and `neon-infographic`.
- `editorial-illustrated` must preserve the accepted editorial composition and motion.
- `neon-infographic` must use typography, charts, connections, data, comparison, and flow modules; it must not use generated images or character illustrations.
- Both pilots are 1080×1920, 30fps, and 450 frames.
- Scene durations stay within 3–6 seconds, targeting 3.5–5.5 seconds.
- Every scene contains two or three transcript-timed keywords and holds its final state for at least 0.8 seconds.
- Scene boundaries show incoming content on the first boundary frame and never retain the outgoing scene.
- Captions remain native, editable, white on a square-corner translucent dark band, with phrase pacing.
- Narration is the anchor audio track; requested music is a follower track mixed below narration.
- Existing ChatCut timelines/assets remain intact.
- Do not generate PPT/PPTX, raster AI images, personal branding, page numbers, or an automatic export.

---

## File Map

| File | Responsibility |
| --- | --- |
| `scripts/validate-scene-plan.mjs` | Shared validation plus template-specific scene validation |
| `scripts/build-motion-graphic.mjs` | Resolve one template definition and compile one background/content pair |
| `scripts/tests/fixtures.mjs` | Generate valid editorial and neon plans at multiple durations |
| `scripts/tests/validate-scene-plan.test.mjs` | Discriminated schema and migration-message regression tests |
| `scripts/tests/build-motion-graphic.test.mjs` | Compiler, JSX safety, editorial preservation, and neon renderer tests |
| `scripts/tests/skill-contract.test.mjs` | Public documentation and metadata contract tests |
| `assets/editorial-background-template.jsx` | Accepted warm paper background |
| `assets/editorial-content-template.jsx` | Accepted title/keyword/vector-illustration renderer |
| `assets/neon-background-template.jsx` | Static dark technology background |
| `assets/neon-content-template.jsx` | Dynamic text and five neon infographic modules |
| `references/scene-schema.md` | Public discriminated JSON schema and module fields |
| `references/visual-system.md` | Shared rules plus two separate visual systems |
| `SKILL.md` | Selection and end-to-end ChatCut workflow |
| `agents/openai.yaml` | User-facing Skill metadata |

---

### Task 1: Introduce the discriminated scene-plan schema

**Files:**
- Modify: `scripts/validate-scene-plan.mjs:1-149`
- Modify: `scripts/tests/fixtures.mjs:1-57`
- Modify: `scripts/tests/validate-scene-plan.test.mjs:1-86`

**Interfaces:**
- Produces: `SUPPORTED_TEMPLATES: Set<string>`
- Produces: `SUPPORTED_NEON_MODULES: Set<string>`
- Produces: `validateScenePlan(plan): {valid:boolean, errors:string[], warnings:string[]}`
- Produces: `assertValidScenePlan(plan): plan`
- Produces: `makeFixture({seconds, sceneCount, template}): ScenePlan`
- Consumed by: Tasks 2–7

- [ ] **Step 1: Write failing template-discriminator tests**

Add these tests to `scripts/tests/validate-scene-plan.test.mjs`:

```javascript
test("accepts exactly the two public templates", () => {
  for (const template of ["editorial-illustrated", "neon-infographic"]) {
    assert.equal(
      validateScenePlan(makeFixture({ seconds: 15, sceneCount: 3, template })).valid,
      true,
    );
  }

  const unsupported = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "editorial-illustrated",
  });
  unsupported.template = "deep-dusk";
  const result = validateScenePlan(unsupported);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /unsupported template/);
});

test("returns an explicit migration error for theme-only plans", () => {
  const plan = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "editorial-illustrated",
  });
  delete plan.template;
  plan.theme = "editorial-paper";
  const result = validateScenePlan(plan);
  assert.equal(result.valid, false);
  assert.match(
    result.errors.join("\n"),
    /theme is no longer supported; use template=editorial-illustrated/,
  );
});

test("keeps editorial and neon scene shapes isolated", () => {
  const editorial = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "editorial-illustrated",
  });
  editorial.scenes[0].visualModule = {
    type: "metric-stack",
    label: "验证",
    items: [{ label: "付款" }],
  };
  assert.match(
    validateScenePlan(editorial).errors.join("\n"),
    /editorial scenes must not contain visualModule/,
  );

  const neon = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  neon.scenes[0].illustration = { motif: "path-choice" };
  assert.match(
    validateScenePlan(neon).errors.join("\n"),
    /neon scenes must not contain illustration/,
  );
});
```

- [ ] **Step 2: Run the validator tests and verify RED**

Run:

```bash
node --test scripts/tests/validate-scene-plan.test.mjs
```

Expected: FAIL because `makeFixture` still accepts `theme`, the validator still exports `SUPPORTED_THEMES`, and no template-specific scene validation exists.

- [ ] **Step 3: Make fixtures emit distinct scene shapes**

Replace the fixture signature and scene-specific fields with:

```javascript
const MODULE_TYPES = [
  "metric-stack",
  "node-network",
  "bar-trend",
  "split-comparison",
  "step-flow",
];

const makeVisualModule = (type, index) => {
  if (type === "metric-stack") {
    return {
      type,
      label: `核心指标 ${index + 1}`,
      value: "",
      items: [{ label: "状态 A" }, { label: "状态 B" }],
    };
  }
  if (type === "node-network") {
    return {
      type,
      centerLabel: "核心",
      nodes: [{ label: "客户" }, { label: "渠道" }, { label: "交付" }],
      edges: [[0, 1], [0, 2]],
    };
  }
  if (type === "bar-trend") {
    return {
      type,
      bars: [
        { label: "之前", relativeValue: 0.38, displayValue: "" },
        { label: "之后", relativeValue: 0.82, displayValue: "" },
      ],
    };
  }
  if (type === "split-comparison") {
    return {
      type,
      left: { label: "轻飘飘的认可", detail: "点赞" },
      right: { label: "真实验证", detail: "现在付款" },
      conclusion: "行为比态度更有分量",
    };
  }
  return {
    type,
    steps: [{ label: "观察" }, { label: "试做" }, { label: "验证" }],
  };
};

export const makeFixture = ({
  seconds,
  sceneCount,
  template = "editorial-illustrated",
}) => {
  // Keep the existing duration, contiguity, title, and keyword construction.
  // For editorial scenes, add illustration/drawFrames/fillFrames.
  // For neon scenes, add supportingText/visualModule/moduleFrames.
};
```

The resulting plan must contain `template` and must not contain `theme`.

- [ ] **Step 4: Implement common and template-specific validation**

Replace `SUPPORTED_THEMES` with:

```javascript
export const SUPPORTED_TEMPLATES = new Set([
  "editorial-illustrated",
  "neon-infographic",
]);

export const SUPPORTED_NEON_MODULES = new Set([
  "metric-stack",
  "node-network",
  "bar-trend",
  "split-comparison",
  "step-flow",
]);
```

Add helpers with these contracts:

```javascript
const validateText = (value, path, errors) => {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${path} must be non-empty`);
    return false;
  }
  return true;
};

const validateEditorialScene = (scene, prefix, errors) => {
  if ("visualModule" in scene) {
    errors.push(`${prefix}: editorial scenes must not contain visualModule`);
  }
  if (!SUPPORTED_MOTIFS.has(scene.illustration?.motif)) {
    errors.push(`${prefix} has an unsupported motif`);
  }
  if (!Number.isInteger(scene.drawFrames) || scene.drawFrames < 10 || scene.drawFrames > 14) {
    errors.push(`${prefix}.drawFrames must be between 10 and 14`);
  }
  if (!Number.isInteger(scene.fillFrames) || scene.fillFrames < 1) {
    errors.push(`${prefix}.fillFrames must be a positive integer`);
  }
};

const validateNeonModule = (module, prefix, errors) => {
  if (!isObject(module) || !SUPPORTED_NEON_MODULES.has(module.type)) {
    errors.push(`${prefix}.visualModule has an unsupported type`);
    return;
  }
  if (module.type === "metric-stack") {
    validateText(module.label, `${prefix}.visualModule.label`, errors);
    if (!Array.isArray(module.items) || module.items.length < 1 || module.items.length > 3) {
      errors.push(`${prefix}.visualModule.items must contain 1–3 entries`);
    }
  }
  if (module.type === "node-network") {
    validateText(module.centerLabel, `${prefix}.visualModule.centerLabel`, errors);
    if (!Array.isArray(module.nodes) || module.nodes.length < 2 || module.nodes.length > 4) {
      errors.push(`${prefix}.visualModule.nodes must contain 2–4 entries`);
    }
    if (!Array.isArray(module.edges)) {
      errors.push(`${prefix}.visualModule.edges must be an array`);
    }
  }
  if (module.type === "bar-trend") {
    if (!Array.isArray(module.bars) || module.bars.length < 2 || module.bars.length > 5) {
      errors.push(`${prefix}.visualModule.bars must contain 2–5 entries`);
    } else if (
      module.bars.some(
        (bar) =>
          !isObject(bar) ||
          typeof bar.label !== "string" ||
          typeof bar.relativeValue !== "number" ||
          bar.relativeValue < 0 ||
          bar.relativeValue > 1,
      )
    ) {
      errors.push(`${prefix}.visualModule.bars require labels and relativeValue from 0 to 1`);
    }
  }
  if (module.type === "split-comparison") {
    validateText(module.left?.label, `${prefix}.visualModule.left.label`, errors);
    validateText(module.right?.label, `${prefix}.visualModule.right.label`, errors);
    validateText(module.conclusion, `${prefix}.visualModule.conclusion`, errors);
  }
  if (module.type === "step-flow") {
    if (!Array.isArray(module.steps) || module.steps.length < 2 || module.steps.length > 4) {
      errors.push(`${prefix}.visualModule.steps must contain 2–4 entries`);
    }
  }
};

const validateNeonScene = (scene, prefix, errors) => {
  if ("illustration" in scene) {
    errors.push(`${prefix}: neon scenes must not contain illustration`);
  }
  if ("drawFrames" in scene || "fillFrames" in scene) {
    errors.push(`${prefix}: neon scenes must use moduleFrames`);
  }
  validateNeonModule(scene.visualModule, prefix, errors);
  if (!Number.isInteger(scene.moduleFrames) || scene.moduleFrames < 10 || scene.moduleFrames > 16) {
    errors.push(`${prefix}.moduleFrames must be between 10 and 16`);
  }
};
```

At the plan level:

```javascript
if (!plan.template && plan.theme === "editorial-paper") {
  errors.push("theme is no longer supported; use template=editorial-illustrated");
} else if (!plan.template && plan.theme === "deep-dusk") {
  errors.push("theme is no longer supported; use template=neon-infographic");
} else if (!SUPPORTED_TEMPLATES.has(plan.template)) {
  errors.push("unsupported template");
}
```

Call `validateEditorialScene` or `validateNeonScene` after shared scene checks.

- [ ] **Step 5: Run validator tests and verify GREEN**

Run:

```bash
node --test scripts/tests/validate-scene-plan.test.mjs
```

Expected: all validator tests PASS.

- [ ] **Step 6: Commit Task 1**

```bash
git add scripts/validate-scene-plan.mjs scripts/tests/fixtures.mjs scripts/tests/validate-scene-plan.test.mjs
git commit -m "feat: validate two card video templates"
```

---

### Task 2: Split the compiler and preserve the editorial renderer

**Files:**
- Move: `assets/background-template.jsx` → `assets/editorial-background-template.jsx`
- Move: `assets/content-template.jsx` → `assets/editorial-content-template.jsx`
- Create: `assets/neon-background-template.jsx`
- Create: `assets/neon-content-template.jsx`
- Modify: `scripts/build-motion-graphic.mjs:1-108`
- Modify: `scripts/tests/build-motion-graphic.test.mjs:1-275`

**Interfaces:**
- Consumes: `plan.template`, `assertValidScenePlan(plan)`
- Produces: `getTemplateDefinition(template): TemplateDefinition`
- Produces: `buildMotionGraphicBundle(plan, templateDirectory): {background, content}`
- TemplateDefinition fields: `backgroundFile`, `contentFile`, `displayName`, `properties`
- Consumed by: Tasks 3–7

- [ ] **Step 1: Write failing compiler-routing tests**

Replace the two-theme manifest test and add:

```javascript
test("builds ChatCut-ready manifests for both templates", async () => {
  for (const template of ["editorial-illustrated", "neon-infographic"]) {
    const plan = makeFixture({ seconds: 15, sceneCount: 3, template });
    const bundle = await buildMotionGraphicBundle(plan, templateDirectory);
    for (const asset of [bundle.background, bundle.content]) {
      assert.equal(asset.width, 1080);
      assert.equal(asset.height, 1920);
      assert.equal(asset.durationInFrames, 450);
      assert.match(asset.code, /const Component = \(\{ item \}\) =>/);
      assert.doesNotMatch(asset.code, /\bimport\b|export default|Remotion\./);
      assert.doesNotMatch(asset.code, /__PLAN_JSON__/);
    }
  }
});

test("routes each template to an isolated source pair", async () => {
  const editorial = await buildMotionGraphicBundle(
    makeFixture({
      seconds: 15,
      sceneCount: 3,
      template: "editorial-illustrated",
    }),
    templateDirectory,
  );
  const neon = await buildMotionGraphicBundle(
    makeFixture({
      seconds: 15,
      sceneCount: 3,
      template: "neon-infographic",
    }),
    templateDirectory,
  );

  assert.match(editorial.content.name, /Editorial Illustrated/);
  assert.match(editorial.content.code, /MOTIF_RENDERERS/);
  assert.doesNotMatch(editorial.content.code, /NEON_MODULE_RENDERERS/);
  assert.match(neon.content.name, /Neon Infographic/);
  assert.match(neon.content.code, /NEON_MODULE_RENDERERS/);
  assert.doesNotMatch(neon.content.code, /MOTIF_RENDERERS/);
});
```

- [ ] **Step 2: Run the compiler test and verify RED**

Run:

```bash
node --test scripts/tests/build-motion-graphic.test.mjs
```

Expected: FAIL because the compiler reads fixed filenames and still branches on `plan.theme`.

- [ ] **Step 3: Move the accepted editorial files**

Run:

```bash
git mv assets/background-template.jsx assets/editorial-background-template.jsx
git mv assets/content-template.jsx assets/editorial-content-template.jsx
```

In `editorial-background-template.jsx`, remove the dark branch and keep the
accepted light values:

```javascript
const Component = ({ item }) => {
  const props = item.props || {};
  const paperGrid =
    "linear-gradient(90deg, rgba(87,50,37,0.045) 1px, transparent 1px), linear-gradient(rgba(87,50,37,0.045) 1px, transparent 1px)";
  const baseBackground =
    "radial-gradient(circle at 18% 18%, rgba(244,153,79,0.22), transparent 26%), linear-gradient(180deg, #F8F1E6 0%, #F5ECDE 100%)";
  // Preserve the existing root, grid, grain, and return structure.
};
```

Do not alter the editorial motif functions or motion block.

- [ ] **Step 4: Add minimal valid neon source files for routing**

Create `assets/neon-background-template.jsx`:

```javascript
const Component = ({ item }) => {
  const props = item.props || {};
  const rootStyle = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    background: props.transparentBackground
      ? "transparent"
      : "radial-gradient(circle at 82% 18%, rgba(67,231,255,0.12), transparent 28%), linear-gradient(165deg, #0B1728 0%, #06101D 100%)",
  };
  return <div style={rootStyle} />;
};
```

Create `assets/neon-content-template.jsx` as a functional routing baseline:

```javascript
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const PLAN = __PLAN_JSON__;
  const scene =
    PLAN.scenes.find(
      (candidate) => frame >= candidate.startFrame && frame < candidate.endFrame,
    ) || PLAN.scenes[PLAN.scenes.length - 1];
  const NEON_MODULE_RENDERERS = {};
  const rootStyle = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    backgroundColor: props.transparentBackground ? "transparent" : props.backgroundColor,
    color: props.textColor,
    fontFamily: props.fontFamily,
  };
  return <div style={rootStyle}>{scene.title}</div>;
};
```

This baseline is replaced by the full tested renderer in Tasks 3 and 4.

- [ ] **Step 5: Implement template definitions and file selection**

Replace `themeDefaults` with:

```javascript
const TEMPLATE_DEFINITIONS = {
  "editorial-illustrated": {
    displayName: "Editorial Illustrated",
    backgroundFile: "editorial-background-template.jsx",
    contentFile: "editorial-content-template.jsx",
    colors: {
      textColor: "#573225",
      accentColor: "#E86F2A",
      surfaceColor: "#FFF8F0",
      surfaceInkColor: "#573225",
      backgroundColor: "#F8F1E6",
    },
  },
  "neon-infographic": {
    displayName: "Neon Infographic",
    backgroundFile: "neon-background-template.jsx",
    contentFile: "neon-content-template.jsx",
    colors: {
      textColor: "#EAFBFF",
      accentColor: "#43E7FF",
      secondaryColor: "#8B6CFF",
      emphasisColor: "#FF4FD8",
      signalColor: "#B8FF5A",
      surfaceColor: "#0E2035",
      surfaceInkColor: "#EAFBFF",
      backgroundColor: "#06101D",
    },
  },
};

export const getTemplateDefinition = (template) => {
  const definition = TEMPLATE_DEFINITIONS[template];
  if (!definition) throw new Error(`unsupported template: ${template}`);
  return definition;
};
```

Read the selected files:

```javascript
const definition = getTemplateDefinition(plan.template);
const [backgroundTemplate, contentTemplate] = await Promise.all([
  fs.readFile(path.join(templateDirectory, definition.backgroundFile), "utf8"),
  fs.readFile(path.join(templateDirectory, definition.contentFile), "utf8"),
]);
```

Build properties from `definition.colors`, adding only keys present in that
template. Keep `seriesLabel`, `brandText`, `fontFamily`, and
`transparentBackground` in content properties.

- [ ] **Step 6: Run compiler tests and verify GREEN**

Run:

```bash
node --test scripts/tests/build-motion-graphic.test.mjs
```

Expected: routing/manifests PASS; later neon-quality tests do not exist yet.

- [ ] **Step 7: Commit Task 2**

```bash
git add assets scripts/build-motion-graphic.mjs scripts/tests/build-motion-graphic.test.mjs
git commit -m "refactor: isolate card video renderers"
```

---

### Task 3: Build the neon background, typography, and scene motion

**Files:**
- Modify: `assets/neon-background-template.jsx`
- Modify: `assets/neon-content-template.jsx`
- Modify: `scripts/tests/build-motion-graphic.test.mjs`

**Interfaces:**
- Consumes: shared scene fields and `scene.moduleFrames`
- Produces in generated JSX: `sceneProgress`, `supportProgress`, `keywordProgresses`, `moduleProgress`
- Produces layout tokens: `safeLeft`, `textTop`, `moduleTop`, `captionReservedTop`
- Consumed by: Task 4 module renderers

- [ ] **Step 1: Write failing neon visual-system tests**

Add:

```javascript
test("neon template has its own palette, safe zones, and boundary motion", async () => {
  const plan = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  const { background, content } = await buildMotionGraphicBundle(
    plan,
    templateDirectory,
  );
  const defaults = Object.fromEntries(
    content.properties.map((item) => [item.key, item.defaultValue]),
  );

  assert.equal(defaults.textColor, "#EAFBFF");
  assert.equal(defaults.accentColor, "#43E7FF");
  assert.equal(defaults.secondaryColor, "#8B6CFF");
  assert.equal(defaults.emphasisColor, "#FF4FD8");
  assert.equal(defaults.signalColor, "#B8FF5A");
  assert.match(background.code, /#06101D/);
  assert.match(content.code, /safeLeft/);
  assert.match(content.code, /textTop/);
  assert.match(content.code, /moduleTop/);
  assert.match(content.code, /captionReservedTop/);
  assert.match(content.code, /easeOut\(\(localFrame \+ 1\) \/ 6\)/);
  assert.match(content.code, /progress\(scene\.startFrame - 1, scene\.moduleFrames\)/);
  assert.doesNotMatch(content.code, /previousScene|pageNumber|\/ 09/);
});

test("neon content contains no raster image path", async () => {
  const plan = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  const { content } = await buildMotionGraphicBundle(plan, templateDirectory);
  assert.doesNotMatch(content.code, /<Img|<Video|imageUrl|imageSource/);
  assert.equal(
    content.properties.some((item) => item.type === "image" || item.type === "video"),
    false,
  );
});
```

- [ ] **Step 2: Run the two new tests and verify RED**

Run:

```bash
node --test --test-name-pattern="neon template|neon content contains" scripts/tests/build-motion-graphic.test.mjs
```

Expected: FAIL because the baseline neon content has no proportional layout or synchronized scene motion.

- [ ] **Step 3: Implement the static neon background**

Use three non-looping layers:

```javascript
const Component = ({ item }) => {
  const props = item.props || {};
  const rootStyle = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    background: props.transparentBackground
      ? "transparent"
      : "radial-gradient(circle at 82% 18%, rgba(67,231,255,0.13), transparent 26%), radial-gradient(circle at 18% 74%, rgba(255,79,216,0.09), transparent 24%), linear-gradient(165deg, #0B1728 0%, #06101D 100%)",
  };
  const gridStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(67,231,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(67,231,255,0.035) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
  };
  const horizonStyle = {
    position: "absolute",
    left: "6%",
    right: "6%",
    top: "42%",
    height: 1,
    backgroundColor: "rgba(67,231,255,0.18)",
  };
  return (
    <div style={rootStyle}>
      <div style={gridStyle} />
      <div style={horizonStyle} />
    </div>
  );
};
```

- [ ] **Step 4: Implement the neon scene shell**

Use:

```javascript
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const PLAN = __PLAN_JSON__;
  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const easeOut = (value) => 1 - Math.pow(1 - clamp01(value), 3);
  const progress = (start, frames) =>
    easeOut((frame - start) / Math.max(1, frames));

  const width = PLAN.canvas.width;
  const height = PLAN.canvas.height;
  const safeLeft = width * 0.06;
  const safeWidth = width * 0.88;
  const seriesTop = height * 0.08;
  const textTop = height * 0.15;
  const textHeight = height * 0.27;
  const moduleTop = height * 0.43;
  const moduleHeight = height * 0.33;
  const captionReservedTop = height * 0.78;

  const currentSceneIndex = Math.max(
    0,
    PLAN.scenes.findIndex(
      (candidate) => frame >= candidate.startFrame && frame < candidate.endFrame,
    ),
  );
  const scene = PLAN.scenes[currentSceneIndex];
  const localFrame = frame - scene.startFrame;
  const sceneProgress =
    currentSceneIndex === 0 ? 1 : easeOut((localFrame + 1) / 6);
  const supportProgress = progress(scene.startFrame + 4, 6);
  const keywordProgresses = scene.keywords.map((keyword) =>
    progress(keyword.startFrame, 6),
  );
  const moduleProgress = progress(scene.startFrame - 1, scene.moduleFrames);
  // Build root, optional generic series label, text zone, and module zone.
};
```

Typography rules:

- kicker: 24px-equivalent uppercase/Chinese label, cyan hairline;
- headline: `width * 0.064`, weight 900, line-height 1.1;
- supporting text: `width * 0.029`, maximum two lines;
- keywords: square-corner outlined labels, one neon color per semantic order;
- no page number and no personal brand fallback.

Apply `clipPath: inset(...)` to the incoming headline wrapper. Apply opacity and
a short upward settle to supporting text and keywords. Do not render any
previous scene.

- [ ] **Step 5: Run the neon shell tests and verify GREEN**

Run:

```bash
node --test --test-name-pattern="neon template|neon content contains" scripts/tests/build-motion-graphic.test.mjs
```

Expected: both tests PASS.

- [ ] **Step 6: Commit Task 3**

```bash
git add assets/neon-background-template.jsx assets/neon-content-template.jsx scripts/tests/build-motion-graphic.test.mjs
git commit -m "feat: add neon card video shell"
```

---

### Task 4: Implement the five neon infographic modules

**Files:**
- Modify: `assets/neon-content-template.jsx`
- Modify: `scripts/tests/build-motion-graphic.test.mjs`

**Interfaces:**
- Consumes: `scene.visualModule`, `moduleProgress`, neon palette
- Produces: `NEON_MODULE_RENDERERS`
- Produces renderers: `renderMetricStack`, `renderNodeNetwork`, `renderBarTrend`, `renderSplitComparison`, `renderStepFlow`

- [ ] **Step 1: Write failing module-coverage tests**

Add:

```javascript
const extractNeonRendererMapping = (code) => {
  const mapping = code.match(
    /const NEON_MODULE_RENDERERS = \{([\s\S]*?)\n\s*\};/,
  );
  assert.ok(mapping, "generated neon content must define NEON_MODULE_RENDERERS");
  return Object.fromEntries(
    [...mapping[1].matchAll(/^\s*"([^"]+)":\s*(render[A-Za-z]+),$/gm)].map(
      ([, type, renderer]) => [type, renderer],
    ),
  );
};

test("neon template maps every module to a distinct renderer", async () => {
  const expected = {
    "metric-stack": "renderMetricStack",
    "node-network": "renderNodeNetwork",
    "bar-trend": "renderBarTrend",
    "split-comparison": "renderSplitComparison",
    "step-flow": "renderStepFlow",
  };
  const plan = makeFixture({
    seconds: 25,
    sceneCount: 5,
    template: "neon-infographic",
  });
  const { content } = await buildMotionGraphicBundle(plan, templateDirectory);
  assert.deepEqual(extractNeonRendererMapping(content.code), expected);
});

test("neon modules animate meaning without fabricating visible numbers", async () => {
  const plan = makeFixture({
    seconds: 25,
    sceneCount: 5,
    template: "neon-infographic",
  });
  const { content } = await buildMotionGraphicBundle(plan, templateDirectory);
  assert.match(content.code, /module\.displayValue|bar\.displayValue/);
  assert.doesNotMatch(content.code, /Math\.round\(.*relativeValue.*\).*%/);
  assert.match(content.code, /boxShadow/);
  assert.match(content.code, /strokeDasharray/);
  assert.match(content.code, /strokeDashoffset/);
});
```

- [ ] **Step 2: Run module tests and verify RED**

Run:

```bash
node --test --test-name-pattern="neon template maps|neon modules animate" scripts/tests/build-motion-graphic.test.mjs
```

Expected: FAIL because the module map is empty and no semantic renderers exist.

- [ ] **Step 3: Implement the shared neon visual helpers**

Add these functions before `Component`:

```javascript
const neonLine = (progress, length) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress),
});

const glowStyle = (color, active) => ({
  boxShadow: active
    ? `0 0 18px ${color}55, inset 0 0 14px ${color}22`
    : "none",
});

const itemProgress = (progress, index, count) => {
  const slot = 0.72 / Math.max(1, count);
  return Math.max(0, Math.min(1, (progress - index * slot) / 0.28));
};
```

Each renderer must return one compound visual entity inside one shared
coordinate system. SVG opacity belongs on HTML wrappers, not inner SVG
elements.

- [ ] **Step 4: Implement the five renderers**

Use these exact signatures and visual jobs:

```javascript
const renderMetricStack = (module, palette, progress) => {
  // Large label/value at top; 1–3 horizontal status rails below.
  // module.value is displayed only when it is a non-empty source string.
};

const renderNodeNetwork = (module, palette, progress) => {
  // Central node at (500, 240); distribute 2–4 nodes around it.
  // Draw edges first, then activate node wrappers in order.
};

const renderBarTrend = (module, palette, progress) => {
  // Render 2–5 bars from module.bars[*].relativeValue.
  // Show bar.displayValue only when supplied; never derive a percent label.
};

const renderSplitComparison = (module, palette, progress) => {
  // Two unequal panels with a cyan left marker, magenta right marker,
  // and one conclusion bridge at the bottom.
};

const renderStepFlow = (module, palette, progress) => {
  // Render 2–4 ordered nodes; draw connectors before activating each node.
};

const NEON_MODULE_RENDERERS = {
  "metric-stack": renderMetricStack,
  "node-network": renderNodeNetwork,
  "bar-trend": renderBarTrend,
  "split-comparison": renderSplitComparison,
  "step-flow": renderStepFlow,
};
```

Implementation dimensions inside the module box:

- viewBox: `0 0 1000 560`;
- outer padding: 48;
- stroke width: 5–8;
- node radius: 42–58;
- panel corner radius: 0–12, never pill-like;
- active glow: one 18–24px bloom;
- label size: 32–42;
- primary metric size: 72–96;
- module progress: 10–16 frames, then static.

Select and render:

```javascript
const renderer =
  NEON_MODULE_RENDERERS[scene.visualModule.type] || renderMetricStack;
const palette = {
  text: props.textColor,
  cyan: props.accentColor,
  violet: props.secondaryColor,
  magenta: props.emphasisColor,
  lime: props.signalColor,
  surface: props.surfaceColor,
};
const moduleGraphic = renderer(scene.visualModule, palette, moduleProgress);
```

- [ ] **Step 5: Run module tests and the full Node suite**

Run:

```bash
node --test --test-name-pattern="neon template maps|neon modules animate" scripts/tests/build-motion-graphic.test.mjs
node --test scripts/tests/*.test.mjs
```

Expected: module tests PASS; full suite PASS.

- [ ] **Step 6: Commit Task 4**

```bash
git add assets/neon-content-template.jsx scripts/tests/build-motion-graphic.test.mjs
git commit -m "feat: add neon infographic modules"
```

---

### Task 5: Make the Skill contract list exactly two templates

**Files:**
- Create: `scripts/tests/skill-contract.test.mjs`
- Modify: `SKILL.md:1-51`
- Modify: `references/scene-schema.md:1-59`
- Modify: `references/visual-system.md:1-96`
- Modify: `agents/openai.yaml:1-13`

**Interfaces:**
- Consumes: schema and compiler names from Tasks 1–4
- Produces: discoverable public Skill contract for future Codex instances

- [ ] **Step 1: Write the failing documentation-contract test**

Create:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");

test("public Skill contract exposes exactly two structural templates", async () => {
  const [skill, schema, visual] = await Promise.all([
    fs.readFile(path.join(root, "SKILL.md"), "utf8"),
    fs.readFile(path.join(root, "references/scene-schema.md"), "utf8"),
    fs.readFile(path.join(root, "references/visual-system.md"), "utf8"),
  ]);
  for (const text of [skill, schema, visual]) {
    assert.match(text, /editorial-illustrated/);
    assert.match(text, /neon-infographic/);
  }
  assert.doesNotMatch(skill, /supports the editorial-paper and deep-dusk themes/);
  assert.doesNotMatch(schema, /"theme":/);
  assert.match(skill, /Do not generate raster images for `neon-infographic`/);
});
```

- [ ] **Step 2: Run the contract test and verify RED**

Run:

```bash
node --test scripts/tests/skill-contract.test.mjs
```

Expected: FAIL because current documentation still describes two themes on one renderer.

- [ ] **Step 3: Update `SKILL.md` selection and workflow**

The description must mention the two structural templates without summarizing
the entire workflow. Add a short selection section:

```markdown
## Template selection

- `editorial-illustrated`: warm editorial paper, progressive keywords, and one
  semantic hand-drawn vector illustration.
- `neon-infographic`: dark neon dynamic typography with one chart, network,
  metric, comparison, or flow module per scene.

Use the user-selected template. When the user does not select one, ask which of
the two structures they want before building. Do not treat color changes as a
new template. Do not generate raster images for `neon-infographic`.
```

Keep the existing ChatCut companion-skill routing and stop-before-export rule.
Change the default from `editorial-paper` to `editorial-illustrated`.

- [ ] **Step 4: Rewrite schema and visual references**

`references/scene-schema.md` must contain one complete editorial plan and one
complete neon scene example. Document all five module shapes exactly as
validated in Task 1.

`references/visual-system.md` must have:

- shared safe/caption rules;
- a self-contained editorial section;
- a self-contained neon palette/layout/motion section;
- module-selection table;
- explicit no-fabricated-number rule;
- explicit no-image/no-illustration rule for neon.

Remove the old table that presents `editorial-paper` and `deep-dusk` as two
columns of one system.

- [ ] **Step 5: Regenerate or patch UI metadata**

Keep the display name. Set:

```yaml
interface:
  display_name: "ChatCut 竖屏动态卡片视频"
  short_description: "用编辑插画或霓虹信息图模板生成可编辑竖屏口播视频"
  default_prompt: "Use $chatcut-script-to-card-video to turn this Chinese talking script into an editable 9:16 ChatCut video; ask me to choose editorial-illustrated or neon-infographic when I have not specified a template, and do not export it."
```

Preserve the existing ChatCut MCP dependency and invocation policy.

- [ ] **Step 6: Run contract and full tests**

Run:

```bash
node --test scripts/tests/skill-contract.test.mjs
node --test scripts/tests/*.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 7: Commit Task 5**

```bash
git add SKILL.md agents/openai.yaml references scripts/tests/skill-contract.test.mjs
git commit -m "docs: expose two card video templates"
```

---

### Task 6: Validate both templates locally and with the official Skill validator

**Files:**
- Modify only if verification exposes a defect in files from Tasks 1–5
- Evidence: `.superpowers/sdd/2026-07-30-two-template-card-video/local-validation.md` (ignored process evidence)

**Interfaces:**
- Consumes: `makeFixture`, compiler CLI, Skill folder
- Produces: validated 15s/60s/120s bundles for both templates

- [ ] **Step 1: Compile six duration/template combinations**

Use a short ESM verification script through `node --input-type=module -e` that
calls `makeFixture` and `buildMotionGraphicBundle` for:

```text
editorial-illustrated: 15s / 60s / 120s
neon-infographic:      15s / 60s / 120s
```

Assert:

```javascript
assert.equal(bundle.background.durationInFrames, plan.durationInFrames);
assert.equal(bundle.content.durationInFrames, plan.durationInFrames);
assert.ok(bundle.content.code.length < 900_000);
assert.doesNotMatch(bundle.background.code, /__PLAN_JSON__/);
assert.doesNotMatch(bundle.content.code, /__PLAN_JSON__/);
```

- [ ] **Step 2: Run the official Skill validator**

Run:

```bash
/Users/eva/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 \
  /Users/eva/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  /Users/eva/Documents/Codex/2026-07-15/skill-ppt/chatcut-script-to-card-video
```

If the bundled runtime needs the existing temporary YAML dependency, set:

```bash
PYTHONPATH=/private/tmp/codex-pyyaml
```

Expected: `Skill is valid!`

- [ ] **Step 3: Run production cleanliness scans**

Run:

```bash
rg -n "晚橙|宛成|WanCheng\\.ai" SKILL.md agents assets references scripts \
  -g '!scripts/tests/**' \
  -g '!scripts/validate-scene-plan.mjs' \
  -g '!references/scene-schema.md'
rg -n "editorial-paper|deep-dusk" SKILL.md agents assets references scripts \
  -g '!scripts/tests/**' \
  -g '!scripts/validate-scene-plan.mjs' \
  -g '!references/scene-schema.md'
```

Expected: no production branding matches and no old public theme names outside
the deliberate migration documentation/validator.

- [ ] **Step 4: Record local evidence**

Write the exact commands, exit codes, test count, and current commit to:

```text
.superpowers/sdd/2026-07-30-two-template-card-video/local-validation.md
```

Do not add this process report to the Skill bundle.

- [ ] **Step 5: Commit any verification-driven fix**

If no defect is found, do not create an empty commit. If a defect is found,
write a failing regression test first, implement the minimal fix, rerun the
full suite, then:

```bash
git add <regression-test> <fixed-file>
git commit -m "fix: satisfy two-template validation"
```

---

### Task 7: Build and verify the 15-second neon ChatCut pilot

**Files:**
- No bundled Skill file changes unless real ChatCut validation exposes a defect
- Temporary plans/builds: `/private/tmp/chatcut-two-template-pilot/`
- Evidence: `.superpowers/sdd/2026-07-30-two-template-card-video/pilot-report.md`

**Interfaces:**
- Project: `5d851736-70b3-4356-8312-52ad4b24fdbf`
- Existing editorial acceptance timeline: `ab4b45986c` (`Skill 验收｜15s｜编辑纸感`)
- Historical timelines to preserve: `1e391bad3d` and `b56c49418b`
- Produces: new timeline `Skill 验收｜15s｜霓虹信息图`

- [ ] **Step 1: Refresh current ChatCut state**

Use `manage_timelines(action:"list")`, then read the editorial timeline,
narration track, music track, and caption layer. Confirm:

```text
1080×1920
30fps
450 frames
narration role=anchor
music role=follower
native captions present
```

Do not rely on stale item or asset IDs.

- [ ] **Step 2: Establish the external RED condition**

Confirm there is no existing timeline named exactly
`Skill 验收｜15s｜霓虹信息图`. Render representative frames from the existing
editorial timeline and record that they contain editorial illustration rather
than neon infographic modules.

Expected: the requested second structural template does not yet exist.

- [ ] **Step 3: Build the transcript-aligned neon plan**

Use the same first 450-frame narration span and scene boundaries as the
editorial pilot. Create:

```text
/private/tmp/chatcut-two-template-pilot/neon-plan.json
```

Use three scenes and three different module types. A valid structure is:

```json
{
  "version": 1,
  "template": "neon-infographic",
  "canvas": { "width": 1080, "height": 1920, "fps": 30 },
  "durationInFrames": 450,
  "branding": {
    "seriesLabel": "观点手记",
    "brandText": "",
    "source": "default"
  },
  "scenes": [
    {
      "id": "scene-01",
      "startFrame": 0,
      "endFrame": 150,
      "kicker": "一个常见想法",
      "title": "先去大厂几年，创业更稳？",
      "supportingText": "稳定感，不等于真实反馈",
      "keywords": [
        { "text": "准备更久", "startFrame": 24 },
        { "text": "风险更小", "startFrame": 60 }
      ],
      "conclusion": "",
      "visualModule": {
        "type": "split-comparison",
        "left": { "label": "准备", "detail": "想象中的稳定" },
        "right": { "label": "下场", "detail": "真实反馈" },
        "conclusion": "行动让差距显形"
      },
      "moduleFrames": 14
    },
    {
      "id": "scene-02",
      "startFrame": 150,
      "endFrame": 270,
      "kicker": "真正的盲区",
      "title": "不真正下场，就看不见",
      "supportingText": "关键问题藏在真实行动里",
      "keywords": [
        { "text": "真正下场", "startFrame": 162 },
        { "text": "根本看不见", "startFrame": 193 },
        { "text": "几个东西", "startFrame": 211 }
      ],
      "conclusion": "",
      "visualModule": {
        "type": "node-network",
        "centerLabel": "下场",
        "nodes": [
          { "label": "客户" },
          { "label": "渠道" },
          { "label": "交付" }
        ],
        "edges": [[0, 1], [0, 2]]
      },
      "moduleFrames": 14
    },
    {
      "id": "scene-03",
      "startFrame": 270,
      "endFrame": 450,
      "kicker": "第一步验证",
      "title": "愿意付钱，才算验证",
      "supportingText": "态度反馈和付款行为不是一回事",
      "keywords": [
        { "text": "不是点赞", "startFrame": 294 },
        { "text": "现在付款", "startFrame": 350 },
        { "text": "真实验证", "startFrame": 416 }
      ],
      "conclusion": "",
      "visualModule": {
        "type": "bar-trend",
        "bars": [
          { "label": "口头认可", "relativeValue": 0.36, "displayValue": "" },
          { "label": "付款行为", "relativeValue": 0.86, "displayValue": "" }
        ]
      },
      "moduleFrames": 14
    }
  ]
}
```

Before using this plan, verify every keyword frame against the real narration
timing and adjust labels rather than inventing timestamps.

- [ ] **Step 4: Compile and register both neon Motion Graphics**

Run:

```bash
node scripts/build-motion-graphic.mjs \
  --plan /private/tmp/chatcut-two-template-pilot/neon-plan.json \
  --out-dir /private/tmp/chatcut-two-template-pilot/neon-build
```

Read `manifest.json`. Register the background and content through
`create_motion_graphic_from_code` using the manifest’s exact code, dimensions,
duration, and properties. Both real ChatCut validation results must be valid
with no warnings before placement.

- [ ] **Step 5: Create the editable neon timeline**

Create `Skill 验收｜15s｜霓虹信息图` at 1080×1920. Build:

```text
V1: one 450-frame neon background MG
V2: one 450-frame neon content MG
A1: the same 450-frame narration source, role=anchor
A2: gentle technology-ambient music, role=follower
Captions: native caption layer sourced from A1
```

Use `edit_item(validateOnly:true)` for the complete placement transaction,
then commit the same transaction. Set music ducking below narration and use a
short final fade.

- [ ] **Step 6: Match caption treatment**

Apply:

```text
font size: 72
color: #FFFFFF
weight: 800
background: #07111F
background opacity: 0.84
corner radius: 0
maximum lines: 1 where natural
target page length: 8–14 Chinese characters
width: 900
bottom offset: 190
```

Use phrase pacing and transcript-backed display breaks. Do not rewrite source
truth merely to improve pagination.

- [ ] **Step 7: Verify structure and pixels**

Re-read the new timeline and all tracks. Render and inspect:

```text
0, 1, 24, 120, 149, 150, 151, 162,
269, 270, 271, 294, 416, 449
```

Acceptance checks:

- frame 150 and frame 270 already contain incoming neon text/module marks;
- no previous-scene residue;
- three scenes use visibly different module structures;
- no illustration or image appears;
- title/supporting text/keywords remain in the text zone;
- module remains in the infographic zone;
- captions stay below the module;
- music does not mask narration;
- no black or content-empty frame.

- [ ] **Step 8: Preserve and restore project state**

Do not modify or hide the editorial and historical timelines. After
verification, switch the active timeline to
`Skill 验收｜15s｜霓虹信息图` so the user can immediately review the requested new
sample.

- [ ] **Step 9: Record pilot evidence**

Write timeline/track/item/asset IDs, validator results, caption configuration,
rendered frame list, and contact-sheet paths to:

```text
.superpowers/sdd/2026-07-30-two-template-card-video/pilot-report.md
```

Do not export a video.

- [ ] **Step 10: Commit any ChatCut-discovered regression fix**

If real validation exposes a code defect, first add a local failing regression
test, then patch the affected template, rerun all tests and real asset
validation, and commit:

```bash
git add <regression-test> <fixed-template-or-script>
git commit -m "fix: pass ChatCut neon pilot validation"
```

If no source change is required, do not create an empty commit.

---

### Task 8: Final release verification and fresh forward test

**Files:**
- Modify only for regression fixes backed by failing tests
- Evidence: `.superpowers/sdd/2026-07-30-two-template-card-video/final-report.md`

**Interfaces:**
- Consumes: completed Skill and neon pilot
- Produces: final release verdict

- [ ] **Step 1: Run all local release gates**

Run:

```bash
node --test scripts/tests/*.test.mjs
git diff --check
git status --short
```

Run the official Skill validator from Task 6 again. Expected: all tests PASS,
validation PASS, no uncommitted tracked changes.

- [ ] **Step 2: Forward-test template selection with a fresh agent**

Give a fresh agent only:

```text
Use the Skill at <absolute skill path> to plan a 15-second editable ChatCut
video from this script. The user selected neon-infographic. Stop before export.
```

Pass a short script that contains one comparison, one relationship, and one
process. Do not reveal expected module choices. The fresh result passes when
it:

- selects only `neon-infographic`;
- creates no illustration or image request;
- chooses valid modules from the five-type library;
- uses real or explicitly requested narration timing;
- keeps the result editable and stops before export.

Do not let the forward test modify the user’s acceptance project; use a
separate temporary project or stop at plan/build validation.

- [ ] **Step 3: Request an independent final review**

Ask a fresh read-only reviewer to check:

- design-spec coverage;
- exactly two public templates;
- editorial preservation;
- neon schema/renderer isolation;
- no raster image path;
- no fabricated visible numbers;
- 15/60/120-second builds;
- ChatCut pilot evidence;
- no export;
- clean `main`.

Require a strict PASS/FAIL and exact file/line findings.

- [ ] **Step 4: Fix findings through TDD**

For every valid finding:

1. add a failing regression test;
2. verify the failure;
3. implement the minimal fix;
4. rerun the focused and full suites;
5. repeat real ChatCut validation when rendering changed;
6. commit the fix.

- [ ] **Step 5: Write final evidence**

Record the final commit, complete test count, official validator result,
forward-test result, independent-review verdict, ChatCut timeline name/ID, and
no-export confirmation in:

```text
.superpowers/sdd/2026-07-30-two-template-card-video/final-report.md
```

- [ ] **Step 6: Hand off**

Report:

- Skill path and final commit;
- exactly two available templates;
- the unchanged editorial pilot name;
- the new neon pilot name;
- test and review verdicts;
- direct ChatCut editor link;
- that no export was created.
