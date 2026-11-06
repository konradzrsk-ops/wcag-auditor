import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const templatePath = path.join(rootDir, "index.template.html");
const indexPath = path.join(rootDir, "index.html");

if (fs.existsSync(templatePath)) {
  fs.copyFileSync(templatePath, indexPath);
  console.log("✓ Prepared index.html from index.template.html");
}
