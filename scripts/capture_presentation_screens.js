import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'screenshots');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 Starting improved presentation screenshot capture session...');
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
    // 1. Clean Login View (unauthenticated)
    console.log('📸 1. Login View...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await sleep(800);
    await takeShot('01_ekran_logowania.png');

    // 2. Authenticate & Full Dashboard
    console.log('📸 2. Dashboard...');
    await page.evaluate(() => {
      localStorage.setItem('wcag_auditor_authenticated', 'true');
    });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await sleep(1000);
    await takeShot('02_pulpit_pelny_widok.png');

    // 3. Header & Banner Component
    console.log('📸 3. Header & Banner...');
    await page.screenshot({
      path: path.join(outDir, '03_pulpit_naglowek_i_baner.png'),
      clip: { x: 0, y: 0, width: 1600, height: 260 },
    });
    console.log('✓ Saved: 03_pulpit_naglowek_i_baner.png');

    // 4. KPI & Trends Component
    console.log('📸 4. KPI & Trends...');
    await page.screenshot({
      path: path.join(outDir, '04_pulpit_kpi_i_trendy.png'),
      clip: { x: 0, y: 190, width: 1600, height: 470 },
    });
    console.log('✓ Saved: 04_pulpit_kpi_i_trendy.png');

    // 5. Top Services & Recent Audits Component
    console.log('📸 5. Top Services...');
    await page.screenshot({
      path: path.join(outDir, '05_pulpit_uslugi_wymagajace_uwagi.png'),
      clip: { x: 0, y: 580, width: 1600, height: 450 },
    });
    console.log('✓ Saved: 05_pulpit_uslugi_wymagajace_uwagi.png');

    // 6. Audits List View
    console.log('📸 6. Audits List View...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('nav button, button')).find((x) => x.textContent.includes('Audyty'));
      if (b) b.click();
    });
    await sleep(800);
    await takeShot('06_audyty_glowna_lista.png');

    // 7. Open Audit Details (click first table row)
    console.log('📸 7. Audit Details (Portal)...');
    await page.evaluate(() => {
      const tr = document.querySelector('tbody tr');
      if (tr) tr.click();
    });
    await sleep(1000);

    // Switch to audit with reaudits
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Portal - 2 re-audyty'));
      if (b) b.click();
    });
    await sleep(800);
    await takeShot('07_audyt_szczegoly_podsumowanie.png');

    // 8. Reaudit Timeline Section
    console.log('📸 8. Reaudits Timeline Section...');
    await page.evaluate(() => window.scrollBy(0, 500));
    await sleep(600);
    await takeShot('08_audyt_historia_reaudytow.png');

    // 9. Switch to Android Audit (no reaudits)
    console.log('📸 9. Android Audit (0 reaudits)...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(400);
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Android - 0 re-audytów'));
      if (b) b.click();
    });
    await sleep(800);
    await takeShot('09_audyt_bez_reaudytow_android.png');

    // 10. Reaudit Order Modal
    console.log('📸 10. Order Reaudit Modal...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Zleć re-audyt') || x.textContent.includes('Zleć reaudyt'));
      if (b) b.click();
    });
    await sleep(800);
    await takeShot('10_modal_zlecenia_reaudytu.png');

    // Close modal
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Anuluj'));
      if (b) b.click();
    });
    await sleep(500);

    // 11. Reaudit Details Verification View
    console.log('📸 11. Reaudit Verification Details View...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Portal - 2 re-audyty'));
      if (b) b.click();
    });
    await sleep(800);
    await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('div, h3, h4, span'));
      const target = els.find((e) => e.textContent && e.textContent.includes('Reaudyt z dnia 15.04.2026'));
      if (target) {
        const container = target.closest('[role="button"]') || target.closest('div.cursor-pointer');
        if (container) container.click();
        else target.click();
      }
    });
    await sleep(1000);
    await takeShot('11_reaudyt_szczegoly_weryfikacja.png');

    // 12. Reporting - Audits Report
    console.log('📸 12. Reporting - Audits Report...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('nav button, button')).find((x) => x.textContent.includes('Raportowanie'));
      if (b) b.click();
    });
    await sleep(1000);
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Raporty z Audytów'));
      if (b) b.click();
    });
    await sleep(600);
    await takeShot('12_raportowanie_zestawienie_audytow.png');

    // 13. Reporting - Services Availability
    console.log('📸 13. Reporting - Services Availability...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Dostępność Usług'));
      if (b) b.click();
    });
    await sleep(800);
    await takeShot('13_raportowanie_dostepnosc_uslug.png');

    // 14. Reporting - Management Reports
    console.log('📸 14. Reporting - Management Reports...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Zarządcze'));
      if (b) b.click();
    });
    await sleep(800);
    await takeShot('14_raportowanie_zarzadcze.png');

    // 15. Reporting - Regulatory PAD
    console.log('📸 15. Reporting - Regulatory PAD...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Regulacyjne'));
      if (b) b.click();
    });
    await sleep(800);
    await takeShot('15_raportowanie_regulacyjne_pad.png');

    // 16. Makiety Showcase Hub
    console.log('📸 16. Makiety Showcase Hub...');
    await page.goto(BASE_URL + '#makiety-popup', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await takeShot('16_makiety_showcase_hub.png');

    // 17. Planned Feature Modal - Consultations
    console.log('📸 17. Planned Feature Modal - Consultations...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div[class*="border"]'));
      const card = cards.find((c) => c.textContent && c.textContent.includes('Konsultacje'));
      if (card) {
        const btn = card.querySelector('button');
        if (btn) btn.click();
      }
    });
    await sleep(800);
    await takeShot('17_popup_konsultacje_eksperckie.png');
    await page.keyboard.press('Escape');
    await sleep(500);

    // 18. Planned Feature Modal - Management (Teaser)
    console.log('📸 18. Planned Feature Modal - Management Teaser...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div[class*="border"]'));
      const card = cards.find((c) => c.textContent && c.textContent.includes('Raporty Zarządcze'));
      if (card) {
        const btn = card.querySelector('button');
        if (btn) btn.click();
      }
    });
    await sleep(800);
    await takeShot('18_popup_raporty_zarzadcze.png');
    await page.keyboard.press('Escape');
    await sleep(500);

    // 19. Planned Feature Modal - PAD (Teaser)
    console.log('📸 19. Planned Feature Modal - PAD Teaser...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div[class*="border"]'));
      const card = cards.find((c) => c.textContent && c.textContent.includes('Sprawozdawczość Regulacyjna'));
      if (card) {
        const btn = card.querySelector('button');
        if (btn) btn.click();
      }
    });
    await sleep(800);
    await takeShot('19_popup_regulacyjne_pad.png');
    await page.keyboard.press('Escape');
    await sleep(500);

    // 20. Complaints Registry
    console.log('📸 20. Complaints Registry...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('nav button, button')).find((x) => x.textContent.includes('Skargi i zawiadomienia'));
      if (b) b.click();
    });
    await sleep(1000);
    await takeShot('20_reklamacje_rejestr_skarg.png');

    // 21. New Complaint Form
    console.log('📸 21. New Complaint Form...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => x.textContent.includes('Nowe zgłoszenie'));
      if (b) b.click();
    });
    await sleep(1000);
    await takeShot('21_reklamacja_nowe_zgloszenie.png');

    console.log('🎉 Comprehensive presentation screenshots capture finished!');
  } catch (err) {
    console.error('❌ Error during capture session:', err);
  } finally {
    await browser.close();
  }
}

main();
