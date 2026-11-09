import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 90, deviceScaleFactor: 2 });
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        margin: 0;
        padding: 10px 16px;
        background: transparent;
        display: inline-flex;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .container {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .icon-box {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: linear-gradient(135deg, #0038F8 0%, #0020A0 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,56,248,0.25);
        color: white;
      }
      .brand-text {
        display: flex;
        flex-direction: column;
      }
      .brand-title {
        font-size: 21px;
        font-weight: 900;
        color: #0f172a;
        letter-spacing: -0.5px;
        line-height: 1.1;
      }
      .brand-sub {
        font-size: 10px;
        font-weight: 700;
        color: #64748b;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        margin-top: 2px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="icon-box">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
          <path d="M10 6h4"/>
          <path d="M10 10h4"/>
          <path d="M10 14h4"/>
          <path d="M10 18h4"/>
        </svg>
      </div>
      <div class="brand-text">
        <div class="brand-title">TWOJA FIRMA</div>
        <div class="brand-sub">SPÓŁKA AKCYJNA</div>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const container = await page.$('.container');
  
  const logosDir = path.join(rootDir, 'public', 'logos');
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }

  await container.screenshot({ path: path.join(logosDir, 'twoja-firma.png'), omitBackground: true });
  await container.screenshot({ path: path.join(logosDir, 'erste.png'), omitBackground: true });
  
  // Also copy to dist if dist exists
  const distLogosDir = path.join(rootDir, 'dist', 'logos');
  if (fs.existsSync(distLogosDir)) {
    fs.copyFileSync(path.join(logosDir, 'twoja-firma.png'), path.join(distLogosDir, 'twoja-firma.png'));
    fs.copyFileSync(path.join(logosDir, 'erste.png'), path.join(distLogosDir, 'erste.png'));
  }

  console.log('✓ Successfully generated twoja-firma.png and updated erste.png');
  await browser.close();
}

main().catch(console.error);
