#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BUNDLE_ROOT = path.join(ROOT, "skills", "livestream-style-video");
const STAGING_ROOT = path.join(ROOT, "skills", ".livestream-style-video.tmp");

export function normalizeRelativePath(relativePath) {
  return relativePath.replaceAll("\\", "/");
}

function walkFiles(relativeDirectory) {
  const absoluteDirectory = path.join(ROOT, relativeDirectory);
  const files = [];
  for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
  return files;
}

export const BUNDLE_FILES = [
  "SKILL.md",
  "LICENSE",
  "agents/openai.yaml",
  "assets/icon.svg",
  "assets/library/catalog.json",
  ...walkFiles("references"),
  ...walkFiles("templates"),
  "studio/index.html",
  "studio/live_hud_studio.js",
  "scripts/rig_spec.mjs",
  "scripts/hud_presets.mjs",
  "scripts/shot_compiler.mjs",
  "scripts/drift_check.mjs",
  "scripts/render_preview.mjs",
  "scripts/compose_hud.py"
]
  .map(normalizeRelativePath)
  .sort();

export function syncSkillBundle() {
  fs.rmSync(STAGING_ROOT, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(STAGING_ROOT), { recursive: true });

  for (const relativePath of BUNDLE_FILES) {
    const source =
      relativePath === "SKILL.md"
        ? path.join(BUNDLE_ROOT, relativePath)
        : path.join(ROOT, relativePath);
    const target = path.join(STAGING_ROOT, relativePath);
    if (!fs.existsSync(source)) {
      throw new Error(`Cannot package missing source file: ${relativePath}`);
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }

  fs.rmSync(BUNDLE_ROOT, { recursive: true, force: true });
  fs.renameSync(STAGING_ROOT, BUNDLE_ROOT);
  return BUNDLE_FILES.length;
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  const fileCount = syncSkillBundle();
  console.log(`Synchronized ${fileCount} files into skills/livestream-style-video`);
}
