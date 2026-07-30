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

test("README publishes the installable Skill contract and verified assets", async () => {
  const readme = await fs.readFile(path.join(root, "README.md"), "utf8");

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

test("community and license files publish contribution and MIT terms", async () => {
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
