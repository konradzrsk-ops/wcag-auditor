import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const screenshotsDir = path.join(rootDir, 'screenshots');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1050'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1050, deviceScaleFactor: 1.5 });

  const BASE_URL = 'http://localhost:4173/';

  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.setItem('wcag_auditor_authenticated', 'true'));
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await sleep(1000);

  // 1. Capture Consultations Tickets Module (currentView === "tickety")
  console.log('📸 1. Capturing designed Consultations Tickets View...');
  // Click consultation icon in TopNavbar
  const clickedConsult = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Konsultacje z audytorami"]') ||
                document.querySelector('button[title*="Konsultacje"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked consult header button:', clickedConsult);
  await sleep(1200);

  // Ensure first ticket is selected if needed
  await page.evaluate(() => {
    const firstTicket = document.querySelector('div[class*="cursor-pointer"]');
    if (firstTicket) firstTicket.click();
  });
  await sleep(800);

  await page.screenshot({ path: path.join(screenshotsDir, '17_konsultacje_modul_tickety.png') });
  console.log('✓ Saved 17_konsultacje_modul_tickety.png');

  // 2. Capture Complaints Details View (currentView === "reklamacja-szczegoly")
  console.log('📸 2. Capturing Complaints Details View...');
  // Click "Skargi i zawiadomienia" in nav
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('nav button, button')).find((x) => x.textContent.includes('Skargi i zawiadomienia'));
    if (b) b.click();
  });
  await sleep(1000);

  // Click row RKL-2026-089 or first complaint in list
  const clickedComplaint = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr, div[class*="cursor-pointer"]'));
    const target = rows.find((r) => r.textContent && (r.textContent.includes('RKL-2026-089') || r.textContent.includes('NVDA') || r.textContent.includes('wykresy')));
    if (target) {
      target.click();
      return true;
    }
    const tr = document.querySelector('tbody tr');
    if (tr) {
      tr.click();
      return true;
    }
    return false;
  });
  console.log('Clicked complaint row:', clickedComplaint);
  await sleep(1200);

  await page.screenshot({ path: path.join(screenshotsDir, '21_reklamacja_szczegoly_rozwiazania.png') });
  console.log('✓ Saved 21_reklamacja_szczegoly_rozwiazania.png');

  await browser.close();
  console.log('🎉 Both missing/updated screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Error:', err);
});
