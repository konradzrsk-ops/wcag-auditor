import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
} from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const screenshotsDir = path.join(rootDir, 'screenshots');
const outputDocxPath = path.join(rootDir, 'W-ally_Scenariusz_Onboarding_Prezentacja.docx');
const brainDocxPath = 'C:\\Users\\konra\\.gemini\\antigravity\\brain\\a8594c63-d840-4b98-9f0a-dd4a683bda6f\\W-ally_Scenariusz_Onboarding_Prezentacja.docx';

// Helper to create safe image runs with proportional sizing
function createImageParagraph(filename, maxWidth = 500, defaultHeight = 310) {
  const imgPath = path.join(screenshotsDir, filename);
  if (!fs.existsSync(imgPath)) {
    return new Paragraph({
      children: [
        new TextRun({
          text: `[Zrzut ekranu: ${filename} - plik nieodnaleziony]`,
          italics: true,
          color: '94A3B8',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120 },
    });
  }

  // Determine height based on filename specifics
  let h = defaultHeight;
  if (filename.includes('naglowek_i_baner')) h = 82;
  else if (filename.includes('kpi_i_trendy')) h = 145;
  else if (filename.includes('uslugi_wymagajace')) h = 140;
  else if (filename.includes('modal_zlecenia')) h = 330;
  else if (filename.includes('popup')) h = 320;
  else if (filename.includes('konsultacje_modul_tickety')) h = 325;
  else if (filename.includes('reklamacja_szczegoly')) h = 330;
  else if (filename.includes('baza_uslug')) h = 325;

  return new Paragraph({
    children: [
      new ImageRun({
        data: fs.readFileSync(imgPath),
        transformation: {
          width: maxWidth,
          height: h,
        },
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 120 },
  });
}

// Callout box for Voiceover / Lektor Script
function createVoiceoverBox(scriptText, durationText) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: '3B82F6' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: '3B82F6' },
      left: { style: BorderStyle.SINGLE, size: 24, color: '0038F8' }, // thick blue accent bar
      right: { style: BorderStyle.SINGLE, size: 8, color: '3B82F6' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: 'EFF6FF' },
            margins: { top: 140, bottom: 140, left: 180, right: 180 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '🎙️ GŁÓS LEKTORA (NARRACJA WIDEO)',
                    bold: true,
                    size: 19,
                    color: '0038F8',
                  }),
                  new TextRun({
                    text: `   [Czas trwania: ${durationText}]`,
                    bold: true,
                    size: 17,
                    color: '1E40AF',
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: scriptText,
                    italics: true,
                    size: 20,
                    color: '1E293B',
                  }),
                ],
                spacing: { after: 40 },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Info box for Visual breakdown & Business benefit
function createDetailsTable(visualPoints, businessBenefit) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '🔍 CO WIDAĆ NA EKRANIE / ROZWIĄZANIA:',
                    bold: true,
                    size: 18,
                    color: '334155',
                  }),
                ],
                spacing: { after: 80 },
              }),
              ...visualPoints.map(
                (p) =>
                  new Paragraph({
                    children: [
                      new TextRun({ text: '• ', bold: true, color: '0038F8' }),
                      new TextRun({ text: p, size: 18, color: '334155' }),
                    ],
                    spacing: { after: 40 },
                  })
              ),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'F0FDF4' }, // very light emerald
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '💡 WARTOŚĆ I KORZYŚĆ DLA KLIENTA:',
                    bold: true,
                    size: 18,
                    color: '166534',
                  }),
                ],
                spacing: { after: 80 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: businessBenefit,
                    size: 18,
                    color: '14532D',
                  }),
                ],
                spacing: { after: 40 },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

async function generateDocx() {
  console.log('Generating updated Word presentation document (with Baza Usług included)...');

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            size: 21,
            color: '0F172A',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 },
          },
        },
        children: [
          // ==================== COVER / METADATA ====================
          new Paragraph({
            children: [
              new TextRun({
                text: 'W-ALLY • PLATFORMA ZARZĄDZANIA DOSTĘPNOŚCIĄ CYFROWĄ',
                bold: true,
                size: 20,
                color: '0038F8',
              }),
            ],
            spacing: { before: 100, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Scenariusz Wideo Onboardingowego & Przewodnik po Systemie',
                bold: true,
                size: 38,
                color: '0F172A',
              }),
            ],
            spacing: { after: 140 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Kompletny materiał demonstracyjny ze zrzutami ekranu, analizą komponentów oraz narracją lektora (szkic zaktualizowany pod kątem uwag do makiet, bazy usług i gotowy dla Anety do redakcji).',
                size: 22,
                color: '475569',
              }),
            ],
            spacing: { after: 240 },
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
              left: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
              right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    margins: { top: 120, bottom: 120, left: 140, right: 140 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: '⏱️ Szacowany czas trwania wideo: ', bold: true }),
                          new TextRun({ text: 'ok. 5 minut (310 sekund)', bold: true, color: '0038F8' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: '🎯 Konwencja i ton: ', bold: true }),
                          new TextRun({ text: 'Szkoleniowiec / Trener wdrożeniowy (Onboarding Lead) – profesjonalny, oparty o korzyści biznesowe i operacyjne' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: '📌 Pełen zakres modułów: ', bold: true }),
                          new TextRun({ text: '1. Logowanie (bezpieczeństwo korporacyjne). 2. Pulpit (dashboard 360°). 3. Audyty i Reaudyty (weryfikacja napraw). 4. Baza Usług i Procesów (architektura EAA, 6 domen, filtry kanałowe, kafelki, tabela i ścieżka klienta). 5. Raportowanie (Excel, scoring usług, zapowiedź PAD). 6. Moduł Konsultacji (kontakt Koordynatora z audytorem i opiekunem, powiązanie z audytem lub skargą). 7. Rejestr Skarg (#RKL z integracjami). 8. Podsumowanie (Pulpit ekosystemu).' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: '✍️ Przeznaczenie dokumentu: ', bold: true }),
                          new TextRun({ text: 'Baza merytoryczno-wizualna dla Anety do wygładzenia stylistycznego („na ładnie”)' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 300 } }),

          // ==================== AGENDA / TIMELINE ====================
          new Paragraph({
            children: [
              new TextRun({ text: 'Agenda i Oś Czasu Prezentacji (~5:00 min)', bold: true, size: 26, color: '0F172A' }),
            ],
            spacing: { before: 200, after: 140 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Wstęp & Bezpieczne Logowanie (0:00 – 0:20 | 20 s) — ', bold: true }),
              new TextRun({ text: 'Pierwsze wrażenie, korporacyjne bezpieczeństwo, cel platformy.' }),
            ],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Pulpit (Dashboard) – Centrum Dowodzenia (0:20 – 1:15 | 55 s) — ', bold: true }),
              new TextRun({ text: 'Widok całościowy, komunikaty/baner, KPI, trendy zgodności, Top bariery.' }),
            ],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Audyty i Reaudyty – Diagnostyka i Weryfikacja (1:15 – 2:25 | 70 s) — ', bold: true }),
              new TextRun({ text: 'Lista badań, raport WCAG 2.2, reaudyty klienta, dedykowany proces zlecenia.' }),
            ],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. Baza Usług i Procesów Cyfrowych – Inwentaryzacja EAA (2:25 – 3:05 | 40 s) — ', bold: true }),
              new TextRun({ text: 'Katalog 6 domen bankowych, 50 zbadanych procesów, filtry kanałowe, kafelki i tabela, karta procesu biznesowego.' }),
            ],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '5. Raportowanie & Dostępność Usług (3:05 – 3:55 | 50 s) — ', bold: true }),
              new TextRun({ text: 'Zestawienia audytów (Excel), scoring usług bankowych, zapowiedź raportów C-Level i PAD.' }),
            ],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '6. Moduł Konsultacji – Centralny Kanał Ustaleń (3:55 – 4:25 | 30 s) — ', bold: true }),
              new TextRun({ text: 'Strategiczny kontakt Koordynatora z audytorem i opiekunem, zamawianie prac, powiązanie z audytem lub skargą.' }),
            ],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '7. Rejestr Skarg i Zawiadomień (4:25 – 4:55 | 30 s) — ', bold: true }),
              new TextRun({ text: 'Centralny rejestr spraw, szczegóły konkretnej skargi (#RKL-2026-089) z integracjami Jira/audyt oraz nowy formularz.' }),
            ],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '8. Podsumowanie & Wdrożenie Ekosystemu (4:55 – 5:10 | 15 s) — ', bold: true }),
              new TextRun({ text: 'Podsumowanie wartości platformy w oparciu o zintegrowany Pulpit.' }),
            ],
            spacing: { after: 300 },
          }),

          // =========================================================================
          // MODUŁ 0: WSTĘP & LOGOWANIE
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 0: WSTĘP I BEZPIECZNE LOGOWANIE DO PLATFORMY', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 200, after: 120 },
          }),
          createImageParagraph('01_ekran_logowania.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 1: Ekran logowania W-ally – korporacyjne uwierzytelnianie zgodne ze standardami Enterprise', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Dzień dobry. Witamy w W-ally – platformie do kompleksowego zarządzania dostępnością cyfrową WCAG w Twojej organizacji. Zaczynamy od bezpiecznego logowania służbowego, które gwarantuje pełną ochronę danych audytowych oraz spełnienie rygorystycznych wymogów bezpieczeństwa IT.”',
            '0:00 – 0:20 (20 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Nowoczesny, dwukolumnowy układ logowania Enterprise.',
              'Formularz logowania służbowego z walidacją i możliwością zapamiętania sesji.',
              'Panel brandingowy podkreślający zgodność ze standardem WCAG 2.2 oraz wymogami EAA.',
            ],
            'Poczucie bezpieczeństwa i stabilności technologicznej już od pierwszego kontaktu z systemem. Pełna zgodność z politykami bezpieczeństwa dużych instytucji.'
          ),

          new Paragraph({ spacing: { after: 360 } }),

          // =========================================================================
          // MODUŁ 1: PULPIT (DASHBOARD)
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 1: PULPIT MENEDŻERSKI (DASHBOARD) – CAŁOŚCIOWY PRZEGLĄD', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('02_pulpit_pelny_widok.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 2: Główny Pulpit Menedżerski W-ally – centrum dowodzenia dostępnością cyfrową', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Po zalogowaniu trafiamy bezpośrednio na Pulpit Główny – centrum dowodzenia dostępnością cyfrową. Zamiast przekopywać się przez setki stron raportów PDF, koordynator i kadra zarządzająca otrzymują natychmiastowy, całościowy wgląd w kondycję serwisów WWW, aplikacji mobilnych iOS i Android oraz procesów transakcyjnych.”',
            '0:20 – 0:35 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Syntetyczny widok 360 stopni łączący metryki techniczne i operacyjne.',
              'Główny pasek nawigacyjny z podziałem na Audyty, Bazę Usług, Raporty, Konsultacje i Skargi.',
              'Szybki podgląd stanu wdrożeń i najpilniejszych zadań.',
            ],
            'Oszczędność czasu: kadra zarządzająca i koordynatorzy dostępności widzą stan całej organizacji na jednym ekranie bez konieczności manualnej agregacji danych.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Komponent: Nagłówek i Baner
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 1.1: Baner Komunikacyjny i Powiadomienia Systemowe', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('03_pulpit_naglowek_i_baner.png', 500, 82),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 3: Górny pasek nawigacyjny oraz baner informacyjny zintegrowany z backendem', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Na samej górze ekranu znajduje się sekcja komunikatów. Zespół produktowy W-ally publikuje tu najważniejsze aktualizacje: od nowych wytycznych WCAG 2.2, przez terminy regulacyjne EAA, po powiadomienia o zrealizowanych reaudytach.”',
            '0:35 – 0:45 (10 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Dynamiczny baner informacyjny zintegrowany z backendem systemu.',
              'Wyszukiwarka globalna pozwalająca błyskawicznie odnaleźć błąd, audyt lub usługę.',
              'Dedykowane przyciski szybkich akcji: rejestracja zlecenia i konsultacje.',
            ],
            'Bieżący kanał komunikacji: organizacja jest zawsze poinformowana o zmianach w prawie, terminach kontroli i kluczowych wdrożeniach.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Komponent: KPI i Trendy
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 1.2: Kluczowe Wskaźniki Efektywności (KPI) & Trendy Zgodności', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('04_pulpit_kpi_i_trendy.png', 500, 145),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 4: Blok 4 kluczowych wskaźników KPI oraz makieta wykresu trendu dostępności', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Poniżej prezentujemy cztery kluczowe wskaźniki: ogólny poziom zgodności organizacji, liczbę aktywnych audytów, zrealizowane reaudyty weryfikacyjne oraz średni czas naprawy krytycznych błędów. Obok – interaktywny wykres trendu pokazujący realny wzrost dostępności w ujęciu kwartalnym.”',
            '0:45 – 1:00 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Wskaźnik ogólnej dostępności WCAG 2.2 z podziałem na kanały (Desktop, iOS, Android).',
              'Licznik reaudytów – dowód na systematyczne zamykanie usterek przez zespoły.',
              'Wizualizacja trendu kwartalnego przygotowana pod raportowanie zarządcze.',
            ],
            'Twarde dane dla zarządu i audytorów. Możliwość udowodnienia ciągłego doskonalenia procesów dostępności zgodnie z art. 13 Ustawy o Dostępności Cyfrowej.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Komponent: Usługi wymagające uwagi
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 1.3: Usługi Wymagające Uwagi & Ostatnie Zdarzenia', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('05_pulpit_uslugi_wymagajace_uwagi.png', 500, 140),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 5: Ewidencja usług i procesów wymagających natychmiastowej interwencji deweloperskiej', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„System automatycznie priorytetyzuje usługi wymagające pilnej uwagi. Widzimy tu procesy z najniższym scoringiem lub przekroczonym SLA poprawek. Koordynator nie traci czasu na analizy – od razu wie, do którego zespołu deweloperskiego skierować priorytetowe zadania.”',
            '1:00 – 1:15 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Automatyczna klasyfikacja ryzyk dostępności (Krytyczne / Wysokie / Średnie).',
              'Bezpośrednie odnośniki do konkretnych podstron i widoków aplikacji.',
              'Monitoring realizacji SLA zespołów frontendowych i mobilnych.',
            ],
            'Zarządzanie przez wyjątki (Management by Exception): natychmiastowa reakcja na bariery, które blokują klientom kluczowe procesy biznesowe.'
          ),

          new Paragraph({ spacing: { after: 360 } }),

          // =========================================================================
          // MODUŁ 2: AUDYTY I REAUDYTY
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 2: MODUŁ AUDYTÓW I REAUDYTÓW – DIAGNOSTYKA I WERYFIKACJA', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('06_audyty_glowna_lista.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 6: Główny widok modułu Audyty – ewidencja wszystkich badań audytowych instytucji', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Przechodzimy do serca diagnostycznego W-ally – modułu Audyty. To tutaj gromadzone są wszystkie formalne badania dostępności cyfrowej. Zgodnie z ustaleniami, widok jest w pełni przygotowany do prezentacji: usunęliśmy niepotrzebny przycisk „Zleć audyt”, a system skupia się na prezentacji zrealizowanych badań oraz obsłudze reaudytów.”',
            '1:15 – 1:35 (20 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Katalog wszystkich badań: portal informacyjny, bankowość internetowa, aplikacja Android i iOS.',
              'Podział na 4 kanały: Desktop, iOS, Android, Dokumenty.',
              'Precyzyjne metryki: wskaźnik zgodności WCAG, data badania, liczba wykrytych błędów.',
            ],
            'Jedno centralne repozytorium wiedzy audytowej (Single Source of Truth). Koniec z gubieniem raportów PDF w skrzynkach mailowych czy na dyskach sieciowych.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Szczegóły audytu
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 2.1: Karta Audytu i Szczegółowy Raport Zgodności WCAG', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('07_audyt_szczegoly_podsumowanie.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 7: Raport szczegółowy z audytu – metryki wykonawcze, wykres radarowy kryteriów i status badania', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Otwierając szczegóły audytu – na przykład dla Portalu Informacyjnego – otrzymujemy kompleksowy raport. Widzimy ocenę zgodności (77.5%), rozkład kryteriów WCAG na wykresie radarowym oraz listę barier z podziałem na krytyczne, poważne i umiarkowane. Każdy błąd posiada dokładny opis, zrzut ekranu oraz techniczną rekomendację naprawy dla programistów.”',
            '1:35 – 1:55 (20 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Podsumowanie wykonawcze (Executive Summary) dla kadry zarządzającej.',
              'Wykres radarowy 4 zasad WCAG: Postrzegalność, Funkcjonalność, Zrozumiałość, Rzetelność.',
              'Szczegółowa lista uchybień z kodem błędu, elementem DOM i instrukcją naprawczą.',
            ],
            'Deweloperzy otrzymują precyzyjny backlog zadań w języku technicznym, a koordynator widzi dokładny poziom zgodności z kryteriami sukcesu WCAG 2.1 / 2.2 AA.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Reaudyty klienta
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 2.2: Oś Czasu Reaudytów (Cykl Poprawek Powdrożeniowych)', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('08_audyt_historia_reaudytow.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 8: Interaktywna oś czasu reaudytów – historia kolejnych rund weryfikacyjnych i wzrost wyniku', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Kluczową przewagą W-ally jest wbudowana obsługa reaudytów. Gdy zespół deweloperski wdroży poprawki, nie zamawiamy kolejnego, pełnego audytu od zera. Oś czasu pokazuje kolejne rundy weryfikacyjne: widzimy, jak z pierwotnego wyniku 77% portal osiągnął 91.5% po pierwszym reaudycie i 96% po drugim.”',
            '1:55 – 2:10 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Chronologiczna oś weryfikacji powdrożeniowych (Reaudyt 1, Reaudyt 2).',
              'Wskaźnik wzrostu wyniku dostępności w czasie (np. +18.5 p.p.).',
              'Bezpośredni przycisk „Zleć re-audyt” dostępny w nagłówku badania.',
            ],
            'Realna oszczędność budżetu: organizacja płaci wyłącznie za weryfikację naprawionych błędów, a nie za powtórne badanie całego portalu od początku.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Modal zlecenia reaudytu
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 2.3: Intuicyjny Proces Zlecania Reaudytu przez Klienta', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('10_modal_zlecenia_reaudytu.png', 500, 330),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 9: Dedykowany modal zlecenia reaudytu – wybór środowiska, zakresu i wytycznych dla audytora', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Proces zlecenia reaudytu jest maksymalnie uproszczony: koordynator klika przycisk „Zleć re-audyt”, wskazuje środowisko testowe, np. staging, wybiera błędy zgłoszone przez deweloperów jako naprawione i przesyła zlecenie bezpośrednio do zespołu audytorskiego W-ally.”',
            '2:10 – 2:20 (10 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Dedykowany formularz zlecenia weryfikacji powdrożeniowej.',
              'Wybór adresu URL środowiska wdrożeniowego (staging/pre-prod) oraz danych dostępowych.',
              'Automatyczne zliczenie błędów gotowych do odbioru audytorskiego.',
            ],
            'Błyskawiczne zlecenie w 60 sekund bez formalności mailowych. Audytor natychmiast otrzymuje notyfikację ze środowiskiem testowym i listą poprawek.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Szczegóły weryfikacji reaudytu
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 2.4: Raport z Wyników Weryfikacji Reaudytu', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('11_reaudyt_szczegoly_weryfikacja.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 10: Raport z wynikami reaudytu – zestawienie błędów skutecznie rozwiązanych i wymagających dalszych prac', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Po zakończeniu weryfikacji przez audytora otrzymujemy przejrzysty bilans: błędy oznaczone zielonym statusem „Naprawiony” zostają oficjalnie zamknięte w historii serwisu, a jeśli któraś z poprawek okazała się niewystarczająca, audytor odnotowuje precyzyjne wskazówki, co należy poprawić w kodzie.”',
            '2:20 – 2:25 (5 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Podsumowanie weryfikacji: bilans błędów usuniętych vs pozostałych.',
              'Szczegółowe karty błędów z komentarzami audytora i zrzutami ekranu.',
              'Porównanie wskaźnika zgodności WCAG przed i po reaudycie.',
            ],
            'Pełna ścieżka audytowa (audit trail). W razie kontroli regulatora organizacja posiada niepodważalny dowód na sukcesywne usuwanie barier cyfrowych.'
          ),

          new Paragraph({ spacing: { after: 360 } }),

          // =========================================================================
          // MODUŁ 3: BAZA USŁUG I PROCESÓW (NOWOŚĆ W SCENARIUSZU)
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 3: BAZA USŁUG I PROCESÓW CYFROWYCH – CENTRALNY KATALOG I ARCHITEKTURA (EAA)', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('baza_uslug_01_hub_katalogowy.png', 500, 325),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 11: Hub Katalogowy Bazy Usług i Procesów – struktura 6 domen bankowych i metryki pokrycia procesów (EAA)', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Przechodzimy do Bazy Usług i Procesów – serca architektury cyfrowej w W-ally. Aby sprostać wymaganiom Europejskiego Aktu o Dostępności (EAA), system nie ogranicza się do badania pojedynczych stron, lecz inwentaryzuje całe ścieżki i produkty bankowe. Widzimy tu 6 głównych domen usługowych, 50 zbadanych procesów i pełne, stuprocentowe pokrycie audytowe. Z tego poziomu koordynator natychmiast diagnozuje poziom zgodności WCAG każdego obszaru biznesowego instytucji.”',
            '2:25 – 2:40 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              '4 kluczowe metryki KPI: Liczba kategorii usług (50 w 6 domenach), Zbadane procesy cyfrowe (50 procesów, 100% pokrycia audytem), Średnia zgodność WCAG (93.4%) oraz wskaźniki EAA i PAD.',
              'Podział na 6 domen tematycznych: Rachunki i Płatności, Kredyty i Pożyczki, Karty płatnicze, Oszczędności i Inwestycje, Ubezpieczenia i Emerytury oraz Usługi Dodatkowe.',
              'Przegląd kategorii w każdej domenie wraz z liczbą procesów, wskaźnikiem dostępności i bezpośrednim dostępem do ewidencji.',
            ],
            'Kompletna inwentaryzacja procesów cyfrowych wymagana przez Europejski Akt o Dostępności (EAA) i Ustawę. Organizacja zyskuje pewność, że żaden kluczowy proces transakcyjny nie pozostał poza audytem.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Ewidencja procesów: Kafelki & Tabela
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 3.1: Ewidencja i Filtrowanie Procesów Cyfrowych (Kafelki i Tabela)', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('baza_uslug_02_procesy_kafelki.png', 500, 325),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 12: Ewidencja procesów cyfrowych w widoku kafelkowym z filtrami 4 kanałów i wyszukiwarką', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createImageParagraph('baza_uslug_03_procesy_tabela.png', 500, 325),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 13: Kompaktowy widok tabelaryczny procesów cyfrowych dedykowany dla compliance i audytorów', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Otwierając wykaz procesów, zyskujemy precyzyjne narzędzie operacyjne. W-ally pozwala filtrować procesy według czterech ujednoliconych kanałów: Desktop WWW, aplikacji na systemy iOS i Android oraz dokumentów cyfrowych PDF. Intuicyjny przełącznik widoku umożliwia płynne przejście między bogatymi kafelkami prezentacyjnymi a zwartą tabelą danych – idealną do masowej ewidencji dla audytorów i zespołów compliance.”',
            '2:40 – 2:55 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Filtry kanałowe 360°: Desktop (portale WWW), iOS (aplikacje natywne Apple), Android (aplikacje natywne Google) oraz Dokumenty (pliki PDF, deklaracje, regulaminy).',
              'Wyszukiwarka tekstowa po nazwie procesu, zespole Dev i kanale oraz selektor progów zgodności WCAG (Wysoka zgodność ≥ 80% / Wymaga uwagi < 80%).',
              'Dwustanowy przełącznik widoku: Kafelki (prezentacja graficzna metryk) vs Tabela (zwarta macierz dla compliance).',
              'Szybka akcja „Zleć re-audyt” dostępna bezpośrednio przy każdym procesie.',
            ],
            'Elastyczność pracy dla różnych ról w organizacji: dyrektorzy i Product Ownerzy korzystają z kafelków biznesowych, a działy zgodności, ryzyka i audytu z kompaktowej tabeli danych. Błyskawiczne filtrowanie wąskich gardeł.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Karta procesu biznesowego
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 3.2: Karta Procesu Biznesowego i Mapowanie Ścieżki Klienta (Customer Journey)', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('baza_uslug_04_proces_szczegoly.png', 500, 325),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 14: Karta procesu biznesowego – rozbicie na zbadane ekrany, kroki ścieżki użytkownika i przypisany zespół deweloperski', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Klikając w dowolny proces – na przykład Otwarcie Rachunku Osobistego – przechodzimy do szczegółowej karty procesu. W-ally mapuje całą ścieżkę klienta, rozbijając proces na poszczególne ekrany i widoki transakcyjne. Dzięki temu dokładnie wiemy, na którym kroku formularza występują bariery, który zespół deweloperski odpowiada za poprawki i możemy jednym kliknięciem zlecić re-audyt powdrożeniowy dla tej konkretnej ścieżki.”',
            '2:55 – 3:05 (10 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Metryki procesu: wskaźnik zgodności WCAG (85.2%), zbadane widoki (12/12) oraz status reklamacji.',
              'Mapowanie architektury: powiązanie procesu z kategorią, kanałem dotarcia i dedykowanym zespołem technicznym.',
              'Ewidencja kroków i ekranów transakcyjnych użytkownika (np. Logowanie, Dane osobowe, Weryfikacja tożsamości, Zgody, Potwierdzenie).',
              'Dedykowany przycisk zlecenia re-audytu dla danego procesu po wdrożeniu poprawek przez deweloperów.',
            ],
            'Precyzyjna likwidacja barier w kluczowych lejkach sprzedażowych i transakcyjnych. Zamiast ponawiać kosztowny audyt całego portalu, zlecamy re-audyt wyłącznie weryfikowanego procesu biznesowego.'
          ),

          new Paragraph({ spacing: { after: 360 } }),

          // =========================================================================
          // MODUŁ 4: RAPORTOWANIE (DAWNY KROK 3)
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 4: RAPORTOWANIE I DOSTĘPNOŚĆ USŁUG BIZNESOWYCH', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('12_raportowanie_zestawienie_audytow.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 15: Moduł Raportowania – Zestawienie przekrojowe audytów z bezpośrednim eksportem do arkusza Excel', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Kolejnym filarem W-ally jest Moduł Raportowania. Pierwsza zakładka – Raporty z Audytów – pozwala tworzyć przekrojowe zestawienia wielu badań naraz. Usunęliśmy stąd zbędny etap pośredni: jednym kliknięciem generujesz i pobierasz gotowy plik Excel z pełnym wykazem wskaźników, urządzeń i statusów, idealny do wewnętrznych analiz analitycznych.”',
            '3:05 – 3:20 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Wielowymiarowy generator zestawień audytowych.',
              'Bezpośredni przycisk „Eksportuj do Excel (.xlsx)” bez zbędnych kroków.',
              'Zestawienie audytorów, terminów, zgodności procentowej i liczby błędów.',
            ],
            'Szybki eksport surowych danych dla analityków i działów compliance. Koniec z ręcznym kopiowaniem liczb z plików PDF do Excela.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Dostępność usług
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 4.1: Raportowanie „Dostępność Usług” (Scoring Procesów)', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('13_raportowanie_dostepnosc_uslug.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 16: Przekrojowy scoring procesów biznesowych i usług (kredyt, BLIK, kantor) pod kątem barier WCAG', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Druga gotowa zakładka to Dostępność Usług. To unikalne spojrzenie biznesowe: zamiast patrzeć wyłącznie na serwery i adresy URL, W-ally zestawia ze sobą wyniki procesów z Bazy Usług – takich jak wzięcie kredytu hipotecznego, założenie rachunku czy płatności BLIK. Widzimy dokładny scoring każdego procesu i poziom ryzyka biznesowego.”',
            '3:20 – 3:35 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Mapowanie wymagań WCAG na realne ścieżki i procesy biznesowe banku.',
              'Wskaźniki scoringowe dla poszczególnych produktów (np. BLIK: 72%, Kredyt: 42.5%).',
              'Szybkie filtry po jednostkach organizacyjnych i kanałach dotarcia.',
            ],
            'Product Ownerzy i dyrektorzy linii biznesowych rozumieją wpływ dostępności na konwersję i sprzedaż, a nie tylko techniczne reguły kodu.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Zapowiedź Zarządczych i PAD
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 4.2: Wizja Rozwoju – Raporty Zarządcze (C-Level) & Sprawozdawczość PAD', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('18_popup_raporty_zarzadcze.png', 500, 320),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 17: Zapowiedź planowanego modułu Raportów Zarządczych C-Level (popup informacyjny w makiecie)', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Kolejne dwa moduły raportowania – Raporty Zarządcze dla C-Level oraz Sprawozdawczość Regulacyjna PAD i EAA – są obecnie w fazie projektowej. Zostały zaprezentowane w formie estetycznych zapowiedzi. Docelowo pozwolą one jednym kliknięciem wygenerować urzędowy wzór Deklaracji Dostępności zgodnie z Ustawą oraz syntetyczne podsumowanie trendów dla dyrekcji.”',
            '3:35 – 3:55 (20 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Eleganckie modale typu feature teaser informujące o planowanych funkcjach.',
              'Zapowiedź automatycznego generatora Deklaracji Dostępności PAD/EAA.',
              'Syntetyczne raporty executive dla zarządów bez technicznego żargonu.',
            ],
            'Klient widzi stabilny, przemyślany roadmap platformy W-ally, odpowiadający na nadchodzące wymogi prawne dyrektywy Europejskiego Aktu o Dostępności (czerwiec 2025/2026).'
          ),

          new Paragraph({ spacing: { after: 360 } }),

          // =========================================================================
          // MODUŁ 5: KONSULTACJE (DAWNY KROK 4)
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 5: MODUŁ KONSULTACJI – CENTRALNY KANAŁ USTALEŃ I KOORDYNACJI', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('17_konsultacje_modul_tickety.png', 500, 325),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 18: Zaprojektowany moduł Konsultacje – bezpieczny kanał komunikacji Koordynatora Dostępności z audytorem WCAG i opiekunem klienta, z powiązaniem do audytów i reklamacji (w trakcie wdrożenia do produkcji)', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Kolejnym kluczowym elementem systemu jest Moduł Konsultacji – i zależy nam na dosłownym zachowaniu tej nazwy. Nie proponujemy modelu, w którym każdy deweloper pisze bezpośrednio do audytora z pojedynczym błędem technicznym, tworząc chaos komunikacyjny. Konsultacje to strategiczne narzędzie dedykowane dla Koordynatora Dostępności do bezpośredniego kontaktu z certyfikowanym audytorem oraz opiekunem klienta po stronie W-ally. W jednym miejscu przenosimy do systemu całą rozproszoną dotąd komunikację mailową i telefoniczną: możemy tu omawiać skomplikowane reklamacje, uzgadniać interpretacje kryteriów WCAG, a także zamawiać nowe prace i audyty. Co niezwykle ułatwia odnalezienie się w sprawach – każda konsultacja może być bezpośrednio przypisana do konkretnego audytu lub konkretnej reklamacji. Dzięki temu zarówno organizacja, jak i audytorzy mają zawsze pełny kontekst ustaleń i pełną historię decyzji pod ręką. Moduł prezentuje zaprojektowany interfejs i jest obecnie w trakcie końcowego wdrożenia produkcyjnego.”',
            '3:55 – 4:25 (30 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Panel wątków konsultacyjnych z filtrami statusów („Wymaga odpowiedzi”, „W trakcie ustaleń”, „Zakończone”) oraz kontekstów powiązania.',
              'Dedykowany kanał współpracy: Koordynator Dostępności – Audytor WCAG – Opiekun Klienta (brak rozproszenia i chaosu mailowego).',
              'Kontekstowe przypisanie: bezpośrednie powiązanie wątku z konkretnym audytem cyfrowym lub skargą/reklamacją konsumencką.',
              'Przestrzeń ustaleń strategicznych: omawianie reklamacji, interpretacji wytycznych WCAG 2.2 oraz zamawianie nowych audytów i prac eksperckich.',
              'Status: moduł zaprojektowany zgodnie z docelowym UX, obecnie w fazie końcowego wdrożenia produkcyjnego.',
            ],
            'Uporządkowanie i centralizacja komunikacji: koniec z gubieniem ustaleń w e-mailach i rozmowach. Koordynator Dostępności zachowuje pełną kontrolę nad zakresem, interpretacją barier i zleceniami, mając bezpośredni dostęp do audytora i opiekuna w kontekście konkretnego audytu lub reklamacji.'
          ),

          new Paragraph({ spacing: { after: 360 } }),

          // =========================================================================
          // MODUŁ 6: SKARGI I REKLAMACJE (DAWNY KROK 5)
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 6: REJESTR SKARG I ZAWIADOMIEŃ NA BARIERY DOSTĘPNOŚCI', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('20_reklamacje_rejestr_skarg.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 19: Rejestr skarg i zawiadomień klientów dotyczących barier cyfrowych w usługach', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Kolejnym kluczowym modułem operacyjnym są Skargi i Zawiadomienia. Ustawa o dostępności nakłada na podmioty obowiązek rejestrowania i terminowego odpowiadania na zgłoszenia użytkowników z niepełnosprawnościami. W-ally zapewnia centralny rejestr takich spraw z monitoringiem ustawowych terminów, wagą problemu i powiązaniem z audytami technicznymi.”',
            '4:25 – 4:40 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Centralny rejestr wniosków klientów z numerami spraw i kanałami zgłoszeń.',
              'Statusy obsługi: Nowe, W trakcie, Rozwiązane.',
              'Liczniki terminów ustawowych na udzielenie oficjalnej odpowiedzi.',
              'Przycisk rejestracji nowego zgłoszenia przez pracowników banku.',
            ],
            'Bezpieczeństwo prawne organizacji i ochrona przed karami finansowymi ze strony organów nadzorczych za niedotrzymanie terminów ustawowych.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Szczegóły konkretnej skargi
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 6.1: Szczegóły Konkretnej Skargi (#RKL-2026-089) – Unikalne Rozwiązania', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('21_reklamacja_szczegoly_rozwiazania.png', 500, 330),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 20: Widok szczegółowy konkretnej skargi (#RKL-2026-089) – zaawansowane integracje: Jira, powiązany wątek w module Konsultacji z audytorem i opiekunem, zlecenie reaudytu i terminy SLA', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Wchodząc w szczegóły konkretnej sprawy – na przykład zgłoszenia dotyczącego niedostępnych wykresów dla czytnika NVDA – odkrywamy pełną moc integracyjną W-ally. Z poziomu jednego ekranu widzimy licznik terminu ustawowego, przypisanego programistę oraz bezpośredni link do zadania w systemie Jira. Co więcej: skarga jest zintegrowana z wątkiem w module Konsultacji u audytora, a po wdrożeniu poprawki koordynator może jednym kliknięciem zlecić reaudyt weryfikacyjny, zamykając sprawę zgodnie z prawem.”',
            '4:40 – 4:55 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Karta sprawy z identyfikatorem #RKL-2026-089, powiązaną usługą oraz technologią asystującą (NVDA).',
              'Licznik SLA i dni pozostałych do ustawowego terminu odpowiedzi (zgodność z ustawą PAD).',
              'Bezpośrednie powiązanie z zadaniem programistycznym w Jira.',
              'Zintegrowany odnośnik do aktywnego wątku w module Konsultacji z audytorem i opiekunem klienta.',
              'Przycisk natychmiastowego zlecenia reaudytu / weryfikacji naprawionej bariery.',
              'Oś czasu obsługi zgłoszenia, notatki wewnętrzne i historia korespondencji.',
            ],
            'Całkowite domknięcie procesu: od skargi klienta, przez zadanie w Jira i konsultację w systemie z ekspertem WCAG, po oficjalny reaudyt i terminową odpowiedź. Niezrównane bezpieczeństwo prawne i wizerunkowe.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Formularz nowej skargi
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 6.2: Formularz Rejestracji Nowego Zgłoszenia o Barierze', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('21_reklamacja_nowe_zgloszenie.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 21: Dedykowany formularz rejestracji wniosku lub skargi klienta w systemie', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„W razie wpływu zawiadomienia pracownik infolinii lub oddziału rejestruje wniosek w 2 minuty: wybiera dotkniętą usługę, typ bariery – na przykład brak obsługi czytnika ekranu NVDA – oraz dane kontaktowe klienta. Zgłoszenie natychmiast trafia do koordynatora dostępności.”',
            '4:55 – 5:02 (7 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Prosty, intuicyjny formularz rejestracyjny z podpowiedziami pól.',
              'Wybór kanału (Infolinia, Oddział, E-mail, Formularz www).',
              'Automatyczne przypisanie do odpowiedniej jednostki biznesowej.',
            ],
            'Żadne zgłoszenie o barierze cyfrowej nie ginie w firmowej poczcie. Pełna kontrola nad obiegiem spraw osób ze szczególnymi potrzebami.'
          ),

          new Paragraph({ spacing: { after: 360 } }),

          // =========================================================================
          // MODUŁ 7: PODSUMOWANIE & CALL TO ACTION (DAWNY KROK 6)
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 7: PODSUMOWANIE I WDROŻENIE W TWOJEJ ORGANIZACJI', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('02_pulpit_pelny_widok.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 22: Zintegrowany ekosystem W-ally – Pulpit Menedżerski łączący audyty, reaudyty, bazę usług, raportowanie, konsultacje i skargi', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Podsumowując: W-ally to nie jest zwykła przeglądarka audytów czy statyczna baza wiedzy. To kompletny, nowoczesny ekosystem, który łączy kadrę zarządzającą, koordynatorów dostępności, audytorów i deweloperów w jednym środowisku pracy. Zapewnia realną oszczędność budżetu dzięki reaudytom, chroni przed ryzykiem prawnym i realnie podnosi jakość cyfrowych usług Twojej organizacji. Dziękujemy za uwagę i zapraszamy do wspólnego wdrożenia platformy W-ally.”',
            '5:02 – 5:15 (13 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Jedno centralne środowisko pracy (Single Source of Truth) dla całej organizacji.',
              'Spójne połączenie audytów technicznych z architekturą usług EAA, raportowaniem, modułem konsultacji i obsługą skarg.',
              'Skalowalność, bezpieczeństwo korporacyjne i pełna gotowość do wdrożenia.',
            ],
            'Przekształcenie dostępności cyfrowej z przykrego obowiązku formalnego w nowoczesną przewagę rynkową i trwałą wartość wizerunkową instytucji.'
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputDocxPath, buffer);
  console.log(`✓ Saved updated Word document: ${outputDocxPath} (${buffer.length} bytes)`);

  try {
    fs.copyFileSync(outputDocxPath, brainDocxPath);
    console.log(`✓ Copied to artifacts brain directory: ${brainDocxPath}`);
  } catch (e) {
    console.warn('Notice: Could not copy directly to brain dir, file remains in workspace:', e.message);
  }
}

generateDocx().catch((err) => {
  console.error('Error generating docx:', err);
});
