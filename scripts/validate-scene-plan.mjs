export const SUPPORTED_TEMPLATES = new Set([
  "editorial-illustrated",
  "neon-infographic",
]);

export const SUPPORTED_MOTIFS = new Set([
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
]);

export const SUPPORTED_NEON_MODULES = new Set([
  "metric-stack",
  "node-network",
  "bar-trend",
  "split-comparison",
  "step-flow",
]);

const PERSONAL_DEFAULT_PATTERN = /晚橙|宛成|wancheng\.ai/i;

const isPositiveInteger = (value) =>
  Number.isInteger(value) && value > 0;

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const validateText = (value, path, errors) => {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${path} must be non-empty`);
    return false;
  }
  return true;
};

const validateOptionalText = (value, path, errors) => {
  if (value === undefined || value === "") return true;
  return validateText(value, path, errors);
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

const validateLabeledEntries = (entries, path, errors) => {
  for (const [index, entry] of entries.entries()) {
    if (!isObject(entry)) {
      errors.push(`${path}[${index}] must be an object`);
      continue;
    }
    validateText(entry.label, `${path}[${index}].label`, errors);
  }
};

const validateNeonModule = (module, prefix, errors) => {
  const path = `${prefix}.visualModule`;
  if (!isObject(module) || !SUPPORTED_NEON_MODULES.has(module.type)) {
    errors.push(`${path} has an unsupported type`);
    return;
  }

  if (module.type === "metric-stack") {
    validateText(module.label, `${path}.label`, errors);
    if (!Array.isArray(module.items) || module.items.length < 1 || module.items.length > 3) {
      errors.push(`${path}.items must contain 1–3 entries`);
    } else {
      validateLabeledEntries(module.items, `${path}.items`, errors);
    }
    if (module.value !== undefined && typeof module.value !== "string") {
      errors.push(`${path}.value must be a string when provided`);
    }
  }

  if (module.type === "node-network") {
    validateText(module.centerLabel, `${path}.centerLabel`, errors);
    if (!Array.isArray(module.nodes) || module.nodes.length < 2 || module.nodes.length > 4) {
      errors.push(`${path}.nodes must contain 2–4 entries`);
    } else {
      validateLabeledEntries(module.nodes, `${path}.nodes`, errors);
    }
    if (!Array.isArray(module.edges)) {
      errors.push(`${path}.edges must be an array`);
    } else {
      const invalidEdgeShape = module.edges.some(
        (edge) =>
          !Array.isArray(edge) ||
          edge.length !== 2 ||
          edge.some((index) => !Number.isInteger(index) || index < 0),
      );
      if (invalidEdgeShape) {
        errors.push(`${path}.edges must contain pairs of non-negative indexes`);
      } else if (
        Array.isArray(module.nodes) &&
        module.edges.some((edge) =>
          edge.some((index) => index >= module.nodes.length),
        )
      ) {
        errors.push(`${path}.edges must contain indexes within nodes`);
      }
    }
  }

  if (module.type === "bar-trend") {
    if (!Array.isArray(module.bars) || module.bars.length < 2 || module.bars.length > 5) {
      errors.push(`${path}.bars must contain 2–5 entries`);
    } else {
      for (const [index, bar] of module.bars.entries()) {
        const barPath = `${path}.bars[${index}]`;
        if (!isObject(bar)) {
          errors.push(`${barPath} must be an object`);
          continue;
        }
        validateText(bar.label, `${barPath}.label`, errors);
        if (
          !Number.isFinite(bar.relativeValue) ||
          bar.relativeValue < 0 ||
          bar.relativeValue > 1
        ) {
          errors.push(`${barPath}.relativeValue must be from 0 to 1`);
        }
        if (
          bar.displayValue !== undefined &&
          typeof bar.displayValue !== "string"
        ) {
          errors.push(`${barPath}.displayValue must be a string when provided`);
        }
      }
    }
  }

  if (module.type === "split-comparison") {
    validateText(module.left?.label, `${path}.left.label`, errors);
    validateText(module.right?.label, `${path}.right.label`, errors);
    validateText(module.conclusion, `${path}.conclusion`, errors);
  }

  if (module.type === "step-flow") {
    if (!Array.isArray(module.steps) || module.steps.length < 2 || module.steps.length > 4) {
      errors.push(`${path}.steps must contain 2–4 entries`);
    } else {
      validateLabeledEntries(module.steps, `${path}.steps`, errors);
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
  validateText(scene.kicker, `${prefix}.kicker`, errors);
  validateOptionalText(
    scene.supportingText,
    `${prefix}.supportingText`,
    errors,
  );
  validateNeonModule(scene.visualModule, prefix, errors);
  if (!Number.isInteger(scene.moduleFrames) || scene.moduleFrames < 10 || scene.moduleFrames > 16) {
    errors.push(`${prefix}.moduleFrames must be between 10 and 16`);
  }
};

export const validateScenePlan = (plan) => {
  const errors = [];
  const warnings = [];

  if (!plan || typeof plan !== "object") {
    return { valid: false, errors: ["plan must be an object"], warnings };
  }

  if (plan.version !== 1) errors.push("version must equal 1");
  const hasLegacyTheme = Object.prototype.hasOwnProperty.call(plan, "theme");
  const hasKnownLegacyTheme =
    plan.theme === "editorial-paper" || plan.theme === "deep-dusk";
  if (hasLegacyTheme && plan.theme === "editorial-paper") {
    errors.push("theme is no longer supported; use template=editorial-illustrated");
  } else if (hasLegacyTheme && plan.theme === "deep-dusk") {
    errors.push("theme is no longer supported; use template=neon-infographic");
  } else if (hasLegacyTheme) {
    errors.push("theme is no longer supported; remove theme and use template");
  }
  if (
    !SUPPORTED_TEMPLATES.has(plan.template) &&
    !(hasKnownLegacyTheme && !plan.template)
  ) {
    errors.push("unsupported template");
  }

  const canvas = plan.canvas || {};
  if (!isPositiveInteger(canvas.width)) errors.push("canvas.width must be a positive integer");
  if (!isPositiveInteger(canvas.height)) errors.push("canvas.height must be a positive integer");
  if (!isPositiveInteger(canvas.fps)) errors.push("canvas.fps must be a positive integer");
  if (canvas.width >= canvas.height) errors.push("canvas must be portrait");
  if (!isPositiveInteger(plan.durationInFrames)) errors.push("durationInFrames must be a positive integer");

  const branding = plan.branding || {};
  if (!["default", "user"].includes(branding.source)) {
    errors.push("branding.source must be default or user");
  }
  const defaultBrandCopy = `${branding.seriesLabel || ""} ${branding.brandText || ""}`;
  if (branding.source !== "user" && String(branding.brandText || "").trim() !== "") {
    errors.push("non-empty brandText requires branding.source=user");
  }
  if (branding.source !== "user" && PERSONAL_DEFAULT_PATTERN.test(defaultBrandCopy)) {
    errors.push("default branding contains a prohibited personal brand");
  }

  if (!Array.isArray(plan.scenes) || plan.scenes.length === 0) {
    errors.push("scenes must be a non-empty array");
    return { valid: false, errors, warnings };
  }

  let expectedStart = 0;
  for (const [index, scene] of plan.scenes.entries()) {
    const prefix = `scenes[${index}]`;
    if (!isObject(scene)) {
      errors.push(`${prefix} must be an object`);
      continue;
    }
    if (scene.startFrame !== expectedStart) {
      errors.push(`${prefix} must be contiguous with the previous scene`);
    }
    if (!Number.isInteger(scene.endFrame) || scene.endFrame <= scene.startFrame) {
      errors.push(`${prefix}.endFrame must be after startFrame`);
    }

    const sceneFrames = scene.endFrame - scene.startFrame;
    const sceneSeconds = sceneFrames / canvas.fps;
    if (sceneSeconds < 3 || sceneSeconds > 6) {
      errors.push(`${prefix} duration must stay within 3–6 seconds`);
    } else if (sceneSeconds < 3.5 || sceneSeconds > 5.5) {
      warnings.push(`${prefix} duration is outside the 3.5–5.5 second target`);
    }

    if (typeof scene.title !== "string" || scene.title.trim() === "") {
      errors.push(`${prefix}.title must be non-empty`);
    } else if (scene.title.trim().length > 24) {
      warnings.push(`${prefix}.title should be shortened for video-scale readability`);
    }
    if (!Array.isArray(scene.keywords) || scene.keywords.length < 2 || scene.keywords.length > 3) {
      errors.push(`${prefix} must contain 2–3 keywords`);
    } else {
      let previousKeywordFrame = scene.startFrame - 1;
      for (const [keywordIndex, keyword] of scene.keywords.entries()) {
        if (!isObject(keyword)) {
          errors.push(`${prefix}.keywords[${keywordIndex}] must be an object`);
          continue;
        }
        if (typeof keyword.text !== "string" || keyword.text.trim() === "") {
          errors.push(`${prefix}.keywords[${keywordIndex}].text must be non-empty`);
        } else if (keyword.text.trim().length > 10) {
          warnings.push(`${prefix}.keywords[${keywordIndex}] should be shortened`);
        }
        if (
          !Number.isInteger(keyword.startFrame) ||
          keyword.startFrame < scene.startFrame ||
          keyword.startFrame >= scene.endFrame
        ) {
          errors.push(`${prefix}.keywords[${keywordIndex}] must start inside the scene`);
        } else if (keyword.startFrame <= previousKeywordFrame) {
          errors.push(`${prefix}.keywords must be ordered by startFrame`);
        }
        previousKeywordFrame = keyword.startFrame;
      }
      const lastKeyword = scene.keywords.at(-1);
      if (
        isObject(lastKeyword) &&
        scene.endFrame - lastKeyword.startFrame < Math.ceil(canvas.fps * 0.8)
      ) {
        errors.push(`${prefix} must hold the final keyword for at least 0.8 seconds`);
      }
    }

    if (plan.template === "editorial-illustrated") {
      validateEditorialScene(scene, prefix, errors);
    } else if (plan.template === "neon-infographic") {
      validateNeonScene(scene, prefix, errors);
    } else if ("illustration" in scene) {
      validateEditorialScene(scene, prefix, errors);
    } else if ("visualModule" in scene) {
      validateNeonScene(scene, prefix, errors);
    }

    expectedStart = scene.endFrame;
  }

  if (expectedStart !== plan.durationInFrames) {
    errors.push("scenes must cover durationInFrames exactly");
  }

  return { valid: errors.length === 0, errors, warnings };
};

export const assertValidScenePlan = (plan) => {
  const result = validateScenePlan(plan);
  if (!result.valid) throw new Error(result.errors.join("\n"));
  return plan;
};
