import test from "node:test";
import assert from "node:assert/strict";
import {
  assertValidScenePlan,
  validateScenePlan,
} from "../validate-scene-plan.mjs";
import { makeFixture } from "./fixtures.mjs";

test("accepts 15s, 60s, and 120s fixtures", () => {
  for (const fixture of [
    makeFixture({ seconds: 15, sceneCount: 3 }),
    makeFixture({ seconds: 60, sceneCount: 12 }),
    makeFixture({
      seconds: 120,
      sceneCount: 24,
      template: "neon-infographic",
    }),
  ]) {
    assert.equal(validateScenePlan(fixture).valid, true);
    assert.equal(assertValidScenePlan(fixture), fixture);
  }
});

test("accepts exactly the two public templates", () => {
  for (const template of ["editorial-illustrated", "neon-infographic"]) {
    assert.equal(
      validateScenePlan(
        makeFixture({ seconds: 15, sceneCount: 3, template }),
      ).valid,
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

test("requires neon kickers and treats supporting text as optional", () => {
  const withoutSupportingText = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  delete withoutSupportingText.scenes[0].supportingText;
  assert.equal(validateScenePlan(withoutSupportingText).valid, true);

  const missingKicker = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  missingKicker.scenes[1].kicker = "";
  assert.match(
    validateScenePlan(missingKicker).errors.join("\n"),
    /scenes\[1\]\.kicker must be non-empty/,
  );

  const blankSupportingText = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  blankSupportingText.scenes[0].supportingText = "   ";
  assert.match(
    validateScenePlan(blankSupportingText).errors.join("\n"),
    /scenes\[0\]\.supportingText must be non-empty/,
  );
});

test("rejects out-of-range network edge indexes", () => {
  const plan = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  plan.scenes[0].visualModule = {
    type: "node-network",
    centerLabel: "流程",
    nodes: [{ label: "输入" }, { label: "输出" }],
    edges: [[0, 2]],
  };

  const result = validateScenePlan(plan);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /indexes within nodes/);
});

test("rejects non-finite bar values", () => {
  const plan = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  plan.scenes[0].visualModule = {
    type: "bar-trend",
    bars: [
      { label: "之前", relativeValue: Number.NaN },
      { label: "之后", relativeValue: 0.8 },
    ],
  };

  const result = validateScenePlan(plan);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /relativeValue must be from 0 to 1/);
});

test("rejects legacy theme even when template is present", () => {
  const plan = makeFixture({
    seconds: 15,
    sceneCount: 3,
    template: "neon-infographic",
  });
  plan.theme = "deep-dusk";

  const result = validateScenePlan(plan);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /theme is no longer supported/);
});

test("rejects gaps and overlaps", () => {
  const plan = makeFixture({ seconds: 15, sceneCount: 3 });
  plan.scenes[1].startFrame += 1;
  const result = validateScenePlan(plan);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /contiguous/);
});

test("rejects unsupported templates and motifs", () => {
  const plan = makeFixture({ seconds: 15, sceneCount: 3 });
  plan.template = "late-orange";
  plan.scenes[0].illustration.motif = "unknown";
  const result = validateScenePlan(plan);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /template/);
  assert.match(result.errors.join("\n"), /motif/);
});

test("requires 2–3 keywords and a 0.8s final hold", () => {
  const plan = makeFixture({ seconds: 15, sceneCount: 3 });
  plan.scenes[0].keywords = [{ text: "only", startFrame: 20 }];
  plan.scenes[1].keywords[1].startFrame = plan.scenes[1].endFrame - 10;
  const result = validateScenePlan(plan);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /2–3 keywords/);
  assert.match(result.errors.join("\n"), /0.8 seconds/);
});

test("blocks personal defaults but permits explicit user branding", () => {
  const defaultPlan = makeFixture({ seconds: 15, sceneCount: 3 });
  defaultPlan.branding.brandText = "WanCheng.ai";
  assert.equal(validateScenePlan(defaultPlan).valid, false);

  const userPlan = makeFixture({ seconds: 15, sceneCount: 3 });
  userPlan.branding.brandText = "WanCheng.ai";
  userPlan.branding.source = "user";
  assert.equal(validateScenePlan(userPlan).valid, true);
});

test("rejects null and non-object scenes without throwing", () => {
  const plan = makeFixture({ seconds: 15, sceneCount: 3 });
  plan.scenes[0] = null;
  plan.scenes[1] = "not a scene";

  let result;
  assert.doesNotThrow(() => {
    result = validateScenePlan(plan);
  });

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /scenes\[0\] must be an object/);
  assert.match(result.errors.join("\n"), /scenes\[1\] must be an object/);
});

test("rejects null and non-object keywords without throwing", () => {
  const plan = makeFixture({ seconds: 15, sceneCount: 3 });
  plan.scenes[0].keywords = [null, "not a keyword"];

  let result;
  assert.doesNotThrow(() => {
    result = validateScenePlan(plan);
  });

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /scenes\[0\]\.keywords\[0\] must be an object/);
  assert.match(result.errors.join("\n"), /scenes\[0\]\.keywords\[1\] must be an object/);
});
