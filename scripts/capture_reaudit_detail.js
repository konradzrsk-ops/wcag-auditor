import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1.5 });

  await page.goto('https://konradzrsk-ops.github.io/wcag-auditor/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.setItem('wcag_auditor_authenticated', 'true'));
  await page.goto('https://konradzrsk-ops.github.io/wcag-auditor/', { waitUntil: 'networkidle0' });
  await sleep(600);

  // Click Audyty in nav
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Audyty'));
    if (b) b.click();
  });
  await sleep(600);

  // Click row
  await page.evaluate(() => {
    const tr = document.querySelector('tbody tr');
    if (tr) tr.click();
  });
  await sleep(800);

  // Click Audyt z re-audytami
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Portal - 2 re-audyty'));
    if (b) b.click();
  });
  await sleep(800);

  // Click Reaudyt z dnia 15.04.2026
  const clicked = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('div, h3, h4, span'));
    const target = els.find((e) => e.textContent && e.textContent.includes('Reaudyt z dnia 15.04.2026'));
    if (target) {
      const container = target.closest('[role="button"]') || target.closest('div.cursor-pointer');
      if (container) {
        container.click();
        return true;
      }
      target.click();
      return true;
    }
    return false;
  });
  console.log('Clicked reaudit card:', clicked);
  await sleep(1200);

  await page.screenshot({ path: path.join(rootDir, 'screenshots', '11_reaudyt_szczegoly_weryfikacja.png') });
  console.log('✓ Successfully saved 11_reaudyt_szczegoly_weryfikacja.png');
  await browser.close();
}

main();
