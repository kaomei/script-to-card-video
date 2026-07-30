import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildMotionGraphicBundle } from "../build-motion-graphic.mjs";
import { SUPPORTED_MOTIFS } from "../validate-scene-plan.mjs";
import { makeFixture } from "./fixtures.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const templateDirectory = path.resolve(here, "../../assets");

const extractMotifRendererMapping = (code) => {
  const mapping = code.match(/const MOTIF_RENDERERS = \{([\s\S]*?)\n\s*\};/);
  assert.ok(mapping, "generated content must define MOTIF_RENDERERS");
  return Object.fromEntries(
    [...mapping[1].matchAll(/^\s*"([^"]+)":\s*(render[A-Za-z]+),$/gm)].map(
      ([, motif, renderer]) => [motif, renderer],
    ),
  );
};

const extractNeonRendererMapping = (code) => {
  const mapping = code.match(
    /const NEON_MODULE_RENDERERS = \{([\s\S]*?)\n\s*\};/,
  );
  assert.ok(
    mapping,
    "generated neon content must define NEON_MODULE_RENDERERS",
  );
  return Object.fromEntries(
    [
      ...mapping[1].matchAll(
        /^\s*"([^"]+)":\s*(render[A-Za-z]+),$/gm,
      ),
    ].map(([, type, renderer]) => [type, renderer]),
  );
};

const extractTopLevelDataDeclarations = (code) =>
  [...code.matchAll(/^const\s+([A-Za-z_$][\w$]*)\s*=\s*([^\n]+)/gm)]
    .filter(([, , initializer]) => {
      const value = initializer.trim();
      return !/^(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/.test(value) && !/^function\b/.test(value);
    })
    .map(([, name]) => name);

const relativeLuminance = (hexColor) => {
  const channels = hexColor
    .slice(1)
    .match(/../g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4),
    );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrastRatio = (firstColor, secondColor) => {
  const first = relativeLuminance(firstColor);
  const second = relativeLuminance(secondColor);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};

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
  assert.match(
    content.code,
    /progress\(scene\.startFrame - 1, scene\.moduleFrames\)/,
  );
  assert.doesNotMatch(content.code, /previousScene|pageNumber|\/ 09/);
});

test("neon content contains no raster image path", async () => {
  const plan = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  const { content } = await buildMotionGraphicBundle(
    plan,
    templateDirectory,
  );
  assert.doesNotMatch(content.code, /<Img|<Video|imageUrl|imageSource/);
  assert.equal(
    content.properties.some(
      (item) => item.type === "image" || item.type === "video",
    ),
    false,
  );
});

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
  const { content } = await buildMotionGraphicBundle(
    plan,
    templateDirectory,
  );
  assert.deepEqual(extractNeonRendererMapping(content.code), expected);
});

test("neon modules animate meaning without fabricating visible numbers", async () => {
  const plan = makeFixture({
    seconds: 25,
    sceneCount: 5,
    template: "neon-infographic",
  });
  const { content } = await buildMotionGraphicBundle(
    plan,
    templateDirectory,
  );
  assert.match(content.code, /module\.displayValue|bar\.displayValue/);
  assert.doesNotMatch(
    content.code,
    /Math\.round\(.*relativeValue.*\).*%/,
  );
  assert.match(content.code, /boxShadow/);
  assert.match(content.code, /strokeDasharray/);
  assert.match(content.code, /strokeDashoffset/);
});

test("neon supporting text is optional and renders conditionally", async () => {
  const plan = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  delete plan.scenes[0].supportingText;
  const { content } = await buildMotionGraphicBundle(
    plan,
    templateDirectory,
  );

  assert.match(
    content.code,
    /typeof scene\.supportingText === "string"/,
  );
  assert.match(content.code, /scene\.supportingText\.trim\(\) !== ""/);
});

test("neon connectors finish before dependent nodes activate", async () => {
  const plan = makeFixture({
    seconds: 25,
    sceneCount: 5,
    template: "neon-infographic",
  });
  const { content } = await buildMotionGraphicBundle(
    plan,
    templateDirectory,
  );

  const clampSource = content.code.match(/const clamp01 = [^\n]+;/)?.[0];
  const phaseSource = content.code.match(
    /const phaseProgress =[\s\S]*?\n};/,
  )?.[0];
  assert.ok(clampSource, "generated content must define clamp01");
  assert.ok(phaseSource, "generated content must define phaseProgress");
  const phaseProgress = Function(
    `${clampSource}\n${phaseSource}\nreturn phaseProgress;`,
  )();

  assert.equal(phaseProgress(0.2, 0, 5), 1);
  assert.equal(phaseProgress(0.2, 1, 5), 0);
  assert.equal(phaseProgress(0.4, 1, 5), 1);
  assert.equal(phaseProgress(0.4, 2, 5), 0);

  assert.match(
    content.code,
    /const networkPhaseCount =\s+1 \+ module\.nodes\.length \+ module\.edges\.length \+ module\.nodes\.length;/,
  );
  assert.match(
    content.code,
    /1 \+ positions\.length \+ module\.edges\.length \+ index,\s+networkPhaseCount/,
  );
  assert.match(content.code, /const flowPhaseCount = count \* 2 - 1;/);
  assert.match(
    content.code,
    /index \* 2 \+ 1,\s+flowPhaseCount/,
  );
  assert.match(
    content.code,
    /index \* 2,\s+flowPhaseCount/,
  );
});

test("generated assets keep only component and helper functions at top level", async () => {
  for (const template of ["editorial-illustrated", "neon-infographic"]) {
    const plan = makeFixture({ seconds: 15, sceneCount: 3, template });
    const bundle = await buildMotionGraphicBundle(plan, templateDirectory);

    assert.deepEqual(
      {
        background: extractTopLevelDataDeclarations(
          bundle.background.code,
        ),
        content: extractTopLevelDataDeclarations(bundle.content.code),
      },
      {
        background: [],
        content: [],
      },
    );
  }
});

test("background is opaque and content is transparent", async () => {
  const plan = makeFixture({ seconds: 15, sceneCount: 3 });
  const bundle = await buildMotionGraphicBundle(plan, templateDirectory);
  assert.equal(
    bundle.background.properties.find((item) => item.key === "transparentBackground").defaultValue,
    false,
  );
  assert.equal(
    bundle.content.properties.find((item) => item.key === "transparentBackground").defaultValue,
    true,
  );
});

test("generated content obeys canvas-pipeline SVG rules", async () => {
  for (const template of ["editorial-illustrated", "neon-infographic"]) {
    const plan = makeFixture({ seconds: 15, sceneCount: 3, template });
    const { content } = await buildMotionGraphicBundle(
      plan,
      templateDirectory,
    );
    assert.doesNotMatch(content.code, /<svg[^>]*style=\{\{[^}]*opacity/);
    assert.doesNotMatch(
      content.code,
      /<(path|line|rect|circle|ellipse|polygon)[^>]*\stransform=/,
    );
    assert.doesNotMatch(
      content.code,
      /<(path|line|rect|circle|ellipse|polygon)[^>]*\sopacity=/,
    );
  }
});

test("content template contains synchronized scene, keyword, and draw timing", async () => {
  const plan = makeFixture({ seconds: 15, sceneCount: 3 });
  const { content } = await buildMotionGraphicBundle(plan, templateDirectory);
  assert.match(content.code, /sceneProgress/);
  assert.match(content.code, /keywordProgresses/);
  assert.match(content.code, /drawProgress/);
  assert.match(content.code, /fillProgress/);
  assert.match(content.code, /textMaskStyle/);
  assert.match(content.code, /clipPath/);
});

test("scene boundaries reveal only the new text without retaining the previous scene", async () => {
  const plan = makeFixture({ seconds: 15, sceneCount: 3 });
  const { content } = await buildMotionGraphicBundle(plan, templateDirectory);
  assert.doesNotMatch(content.code, /previousScene/);
  assert.doesNotMatch(content.code, /previousLayerStyle/);
  assert.match(content.code, /easeOut\(\(localFrame \+ 1\) \/ 6\)/);
  assert.match(content.code, /progress\(scene\.startFrame - 1, scene\.drawFrames\)/);
  assert.match(content.code, /clipPath: `inset\(0 \$\{\(1 - sceneProgress\) \* 100\}% 0 0\)`/);
});

test("content uses proportional safe zones", async () => {
  const plan = makeFixture({ seconds: 15, sceneCount: 3 });
  const { content } = await buildMotionGraphicBundle(plan, templateDirectory);
  assert.match(content.code, /safeLeft/);
  assert.match(content.code, /textTop/);
  assert.match(content.code, /illustrationTop/);
  assert.match(content.code, /captionReservedTop/);
});

test("both templates expose editable surface colors with readable contrast", async () => {
  const expectedPalettes = {
    "editorial-illustrated": {
      surfaceColor: "#FFF8F0",
      surfaceInkColor: "#573225",
    },
    "neon-infographic": {
      surfaceColor: "#0E2035",
      surfaceInkColor: "#EAFBFF",
    },
  };

  for (const [template, expected] of Object.entries(expectedPalettes)) {
    const plan = makeFixture({ seconds: 15, sceneCount: 3, template });
    const { content } = await buildMotionGraphicBundle(plan, templateDirectory);
    const defaults = Object.fromEntries(
      content.properties.map((item) => [item.key, item.defaultValue]),
    );

    assert.equal(defaults.surfaceColor, expected.surfaceColor);
    assert.equal(defaults.surfaceInkColor, expected.surfaceInkColor);
    assert.ok(
      contrastRatio(defaults.surfaceColor, defaults.surfaceInkColor) >= 4.5,
      `${template} surface text contrast must be at least 4.5:1`,
    );
  }
});

test("generated JSX uses surface colors for keyword pills and filled motifs", async () => {
  const plan = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "editorial-illustrated",
  });
  const { content } = await buildMotionGraphicBundle(plan, templateDirectory);

  assert.match(
    content.code,
    /backgroundColor: index === 0 \? props\.surfaceInkColor : props\.surfaceColor/,
  );
  assert.match(
    content.code,
    /color: index === 0 \? props\.surfaceColor : props\.surfaceInkColor/,
  );
  assert.match(content.code, /surfaceInk: props\.surfaceInkColor/);
  assert.match(content.code, /paper: props\.surfaceColor/);
  assert.equal(
    (
      content.code.match(
        /fill=\{filled \? palette\.paper : "none"\}\s+stroke=\{surfaceStroke\}/g,
      ) || []
    ).length,
    9,
  );
  assert.equal(
    (
      content.code.match(
        /fill=\{filled \? palette\.accent : "none"\}\s+stroke=\{surfaceStroke\}/g,
      ) || []
    ).length,
    6,
  );
  assert.match(content.code, /fill="none"\s+stroke=\{palette\.ink\}/);
});

test("content template implements every supported motif", async () => {
  const plan = makeFixture({ seconds: 60, sceneCount: 12 });
  const { content } = await buildMotionGraphicBundle(plan, templateDirectory);
  const templateBody = content.code.slice(content.code.indexOf("\n") + 1);
  const motifs = [
    "path-choice",
    "balance-tradeoff",
    "growth-stairs",
    "filter-funnel",
    "cashflow-account",
    "resource-network",
    "magnifier-discovery",
    "door-entry",
    "risk-gauge",
    "calendar-time",
    "proof-comparison",
    "action-checklist",
  ];
  const missingMotifs = motifs.filter((motif) => {
    const rendererName = `render${motif
      .split("-")
      .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
      .join("")}`;
    return !new RegExp(`const ${rendererName} =`).test(templateBody);
  });

  assert.deepEqual(missingMotifs, []);
});

test("content template maps every supported motif to its exact renderer", async () => {
  const expectedMapping = {
    "path-choice": "renderPathChoice",
    "balance-tradeoff": "renderBalanceTradeoff",
    "growth-stairs": "renderGrowthStairs",
    "filter-funnel": "renderFilterFunnel",
    "cashflow-account": "renderCashflowAccount",
    "resource-network": "renderResourceNetwork",
    "magnifier-discovery": "renderMagnifierDiscovery",
    "door-entry": "renderDoorEntry",
    "risk-gauge": "renderRiskGauge",
    "calendar-time": "renderCalendarTime",
    "proof-comparison": "renderProofComparison",
    "action-checklist": "renderActionChecklist",
  };
  assert.deepEqual(
    new Set(Object.keys(expectedMapping)),
    SUPPORTED_MOTIFS,
    "mapping expectation must stay aligned with validator support",
  );

  const plan = makeFixture({ seconds: 60, sceneCount: 12 });
  const { content } = await buildMotionGraphicBundle(plan, templateDirectory);
  assert.deepEqual(extractMotifRendererMapping(content.code), expectedMapping);
});

test("risk gauge renders exactly three radial ticks", async () => {
  const plan = makeFixture({ seconds: 60, sceneCount: 12 });
  const { content } = await buildMotionGraphicBundle(plan, templateDirectory);
  const riskGauge = content.code.match(
    /const renderRiskGauge =[\s\S]*?const renderCalendarTime =/,
  );
  assert.ok(riskGauge, "generated content must define the risk gauge renderer");
  const tickPath = riskGauge[0].match(
    /d="([^"]+)"\s+fill="none"\s+stroke=\{surfaceStroke\}\s+strokeWidth="11"/,
  );
  assert.ok(tickPath, "risk gauge must define its radial tick path");
  assert.equal((tickPath[1].match(/\bM/g) || []).length, 3);
});

test("compiles 15s, 60s, and 120s plans without leaving placeholders", async () => {
  const cases = ["editorial-illustrated", "neon-infographic"].flatMap(
    (template) =>
      [15, 60, 120].map((seconds) =>
        makeFixture({
          seconds,
          sceneCount: seconds / 5,
          template,
        }),
      ),
  );
  for (const plan of cases) {
    const bundle = await buildMotionGraphicBundle(plan, templateDirectory);
    assert.equal(bundle.content.durationInFrames, plan.durationInFrames);
    assert.equal(bundle.background.durationInFrames, plan.durationInFrames);
    assert.doesNotMatch(bundle.content.code, /__PLAN_JSON__|TODO|TBD/);
    assert.doesNotMatch(bundle.background.code, /__PLAN_JSON__|TODO|TBD/);
    assert.ok(bundle.content.code.length < 900_000);
  }
});
