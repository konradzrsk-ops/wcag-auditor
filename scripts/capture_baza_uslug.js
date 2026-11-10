import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'screenshots');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 Starting Baza Usług screenshot capture...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1050'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1050, deviceScaleFactor: 1.5 });

  const BASE_URL = 'http://localhost:4173/';

  const takeShot = async (filename, options = {}) => {
    const filePath = path.join(outDir, filename);
    await page.screenshot({ path: filePath, ...options });
    console.log(`✓ Saved: ${filename}`);
  };

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('wcag_auditor_authenticated', 'true');
    });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await sleep(1000);

    // Navigate to Baza Usług
    console.log('Navigating to Baza Usług...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('nav button, button')).find((x) =>
        x.textContent.includes('Baza Usług')
      );
      if (b) b.click();
    });
    await sleep(1000);

    // 1. Hub Katalogowy
    console.log('📸 1. Hub Katalogowy...');
    await takeShot('baza_uslug_01_hub_katalogowy.png');

    // 2. All processes in Cards view
    console.log('📸 2. Wykaz procesów (Kafelki)...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) =>
        x.textContent.includes('Wszystkie procesy')
      );
      if (b) b.click();
    });
    await sleep(800);
    await takeShot('baza_uslug_02_procesy_kafelki.png');

    // 3. Tabular view
    console.log('📸 3. Wykaz procesów (Tabela)...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) =>
        x.textContent.includes('Tabela')
      );
      if (b) b.click();
    });
    await sleep(800);
    await takeShot('baza_uslug_03_procesy_tabela.png');

    // 4. Process Details View
    console.log('📸 4. Szczegóły procesu...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) =>
        x.textContent.includes('Szczegóły')
      );
      if (b) b.click();
      else {
        // try clicking a table row
        const row = document.querySelector('tbody tr');
        if (row) row.click();
      }
    });
    await sleep(1000);
    await takeShot('baza_uslug_04_proces_szczegoly.png');

    console.log('🎉 All Baza Usług screenshots captured successfully!');
  } catch (err) {
    console.error('❌ Error capturing Baza Usług:', err);
  } finally {
    await browser.close();
  }
}

main();
