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
  assert.doesNotMatch(
    skill,
    /supports the editorial-paper and deep-dusk themes/,
  );
  assert.doesNotMatch(schema, /"theme":/);
  assert.match(
    skill,
    /Do not generate raster images for `neon-infographic`/,
  );
});

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
