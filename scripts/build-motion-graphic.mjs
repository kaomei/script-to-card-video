import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertValidScenePlan } from "./validate-scene-plan.mjs";

const replacePlan = (template, plan) =>
  template.replace("__PLAN_JSON__", JSON.stringify(plan));

const TEMPLATE_DEFINITIONS = {
  "editorial-illustrated": {
    displayName: "Editorial Illustrated",
    backgroundFile: "editorial-background-template.jsx",
    contentFile: "editorial-content-template.jsx",
    description: "Timed titles, keywords, and vector illustrations",
    colors: {
      textColor: "#573225",
      accentColor: "#E86F2A",
      creamColor: "#FFF8F0",
      surfaceColor: "#FFF8F0",
      surfaceInkColor: "#573225",
      backgroundColor: "#F8F1E6",
    },
  },
  "neon-infographic": {
    displayName: "Neon Infographic",
    backgroundFile: "neon-background-template.jsx",
    contentFile: "neon-content-template.jsx",
    description: "Timed titles, keywords, and neon infographic modules",
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

const property = (key, type, defaultValue) => ({
  key,
  label: key,
  type,
  defaultValue,
});

export const buildMotionGraphicBundle = async (plan, templateDirectory) => {
  assertValidScenePlan(plan);
  const definition = getTemplateDefinition(plan.template);
  const [backgroundTemplate, contentTemplate] = await Promise.all([
    fs.readFile(
      path.join(templateDirectory, definition.backgroundFile),
      "utf8",
    ),
    fs.readFile(
      path.join(templateDirectory, definition.contentFile),
      "utf8",
    ),
  ]);

  return {
    background: {
      name: `Card Video Background · ${definition.displayName}`,
      description: `Static ${definition.displayName} vertical background`,
      width: plan.canvas.width,
      height: plan.canvas.height,
      durationInFrames: plan.durationInFrames,
      code: replacePlan(backgroundTemplate, plan),
      properties: [
        property("transparentBackground", "boolean", false),
      ],
    },
    content: {
      name: `Card Video Content · ${definition.displayName} · ${plan.scenes.length} scenes`,
      description: definition.description,
      width: plan.canvas.width,
      height: plan.canvas.height,
      durationInFrames: plan.durationInFrames,
      code: replacePlan(contentTemplate, plan),
      properties: [
        property("seriesLabel", "text", plan.branding.seriesLabel),
        property("brandText", "text", plan.branding.brandText),
        ...Object.entries(definition.colors).map(([key, value]) =>
          property(key, "color", value),
        ),
        property("fontFamily", "font", "Noto Sans SC"),
        property("transparentBackground", "boolean", true),
      ],
    },
  };
};

const parseArgs = (argv) => {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    result[argv[index]] = argv[index + 1];
  }
  return result;
};

const runCli = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (!args["--plan"] || !args["--out-dir"]) {
    throw new Error("usage: node build-motion-graphic.mjs --plan <plan.json> --out-dir <directory>");
  }
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
  const templateDirectory = path.resolve(moduleDirectory, "../assets");
  const plan = JSON.parse(await fs.readFile(args["--plan"], "utf8"));
  const bundle = await buildMotionGraphicBundle(plan, templateDirectory);
  await fs.mkdir(args["--out-dir"], { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(args["--out-dir"], "background.jsx"), bundle.background.code),
    fs.writeFile(path.join(args["--out-dir"], "content.jsx"), bundle.content.code),
    fs.writeFile(path.join(args["--out-dir"], "manifest.json"), JSON.stringify(bundle, null, 2)),
  ]);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
