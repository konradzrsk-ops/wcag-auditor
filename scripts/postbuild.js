import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const distDir = path.join(rootDir, "dist");
const distAssetsDir = path.join(distDir, "assets");
const rootAssetsDir = path.join(rootDir, "assets");
const distIndexHtml = path.join(distDir, "index.html");
const rootIndexHtml = path.join(rootDir, "index.html");
const root404Html = path.join(rootDir, "404.html");
const nojekyllFile = path.join(rootDir, ".nojekyll");

if (!fs.existsSync(distIndexHtml)) {
  console.error("Error: dist/index.html not found. Did vite build fail?");
  process.exit(1);
}

// 1. Clean root assets/ directory and copy new assets
if (fs.existsSync(rootAssetsDir)) {
  const existingFiles = fs.readdirSync(rootAssetsDir);
  for (const f of existingFiles) {
    fs.rmSync(path.join(rootAssetsDir, f), { recursive: true, force: true });
  }
} else {
  fs.mkdirSync(rootAssetsDir, { recursive: true });
}

if (fs.existsSync(distAssetsDir)) {
  fs.cpSync(distAssetsDir, rootAssetsDir, { recursive: true });
  const copiedFiles = fs.readdirSync(rootAssetsDir);
  console.log(`✓ Copied ${copiedFiles.length} asset files to ./assets:`, copiedFiles.join(", "));
}

// 2. Copy dist/index.html to root index.html and 404.html for GitHub Pages (serving from main root or gh-pages)
fs.copyFileSync(distIndexHtml, rootIndexHtml);
console.log("✓ Updated root index.html with production build");

fs.copyFileSync(distIndexHtml, root404Html);
console.log("✓ Updated root 404.html with production build");

// 3. Create .nojekyll
fs.writeFileSync(nojekyllFile, "");
console.log("✓ Ensured .nojekyll exists in root");
