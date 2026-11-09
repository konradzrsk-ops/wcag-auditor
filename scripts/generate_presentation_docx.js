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
  console.log('Generating updated Word presentation document (incorporating user feedback)...');

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
                text: 'Kompletny materiał demonstracyjny ze zrzutami ekranu, analizą komponentów oraz narracją lektora (szkic zaktualizowany pod kątem uwag do makiet i gotowy dla Anety do redakcji).',
                size: 22,
                color: '475569',
              }),
            ],
            spacing: { after: 240 },
          }),

          // Metadata summary box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
              left: { style: BorderStyle.SINGLE, size: 16, color: '0038F8' },
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
                          new TextRun({ text: 'dokładnie 5 minut (300 sekund)', bold: true, color: '0038F8' }),
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
                          new TextRun({ text: '📌 Aktualizacje po uwagach: ', bold: true }),
                          new TextRun({ text: '1. Krok 6: Podsumowanie z widokiem Pulpitu (usunięto wewnętrzny hub popupów). 2. Krok 4: Moduł Konsultacji – doprecyzowana nazwa i narracja: strategiczny kontakt Koordynatora Dostępności z audytorem i opiekunem klienta, zamawianie nowych prac, omawianie reklamacji, powiązanie kontekstowe z audytem lub skargą. 3. Moduł Skarg: Szczegółowy widok konkretnego zgłoszenia (#RKL-2026-089) z unikalnymi integracjami.' }),
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
              new TextRun({ text: 'Agenda i Oś Czasu Prezentacji (5:00 min)', bold: true, size: 26, color: '0F172A' }),
            ],
            spacing: { before: 200, after: 140 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Wstęp & Bezpieczne Logowanie (0:00 – 0:25 | 25 s) — ', bold: true }),
              new TextRun({ text: 'Pierwsze wrażenie, korporacyjne bezpieczeństwo, cel platformy.' }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Pulpit (Dashboard) – Centrum Dowodzenia (0:25 – 1:25 | 60 s) — ', bold: true }),
              new TextRun({ text: 'Widok całościowy, komunikaty/baner, KPI, makieta trendów, Top bariery.' }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Audyty i Reaudyty – Diagnostyka i Weryfikacja (1:25 – 2:40 | 75 s) — ', bold: true }),
              new TextRun({ text: 'Lista badań, raport szczegółowy WCAG 2.2, reaudyty klienta, proces zlecenia.' }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. Raportowanie & Dostępność Usług (2:40 – 3:35 | 55 s) — ', bold: true }),
              new TextRun({ text: 'Zestawienia audytów, scoring procesów bankowych, zapowiedź raportów C-Level i PAD.' }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '5. Moduł Konsultacji (3:35 – 4:05 | 30 s) — ', bold: true }),
              new TextRun({ text: 'Strategiczny kontakt Koordynatora z audytorem i opiekunem, zamawianie prac, powiązanie z audytem lub skargą (w trakcie wdrożenia).' }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '6. Rejestr Skarg i Zawiadomień (4:05 – 4:45 | 40 s) — ', bold: true }),
              new TextRun({ text: 'Rejestr spraw, szczegóły konkretnej skargi (#RKL) z integracjami oraz nowy formularz.' }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '7. Podsumowanie & Wdrożenie Ekosystemu (4:45 – 5:00 | 15 s) — ', bold: true }),
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
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('01_ekran_logowania.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 1: Czysty, korporacyjny ekran logowania W-ally (widok po uproszczeniu makiety)', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Dzień dobry. Witamy na platformie W-ally – zintegrowanym środowisku do kompleksowego zarządzania dostępnością cyfrową w Twojej organizacji. Zanim przejdziemy do szczegółów, warto podkreślić, że dostęp do systemu jest w pełni zabezpieczony i przystosowany do standardów korporacyjnych. Logowanie odbywa się za pośrednictwem bezpiecznego konta służbowego, z zachowaniem pełnej poufności danych audytowych i operacyjnych. Zalogujmy się do panelu głównego, aby zobaczyć, jak W-ally wspiera Twoją codzienną pracę.”',
            '0:00 – 0:25 (25 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Logotyp i nazwa W-ally z dedykowaną identyfikacją wizualną.',
              'Formularz logowania e-mail/hasło z opcją zapamiętania sesji.',
              'Prawa kolumna wizerunkowa ze standardem WCAG 2.2 i kluczowymi korzyściami.',
              'Wyeliminowane zbędne linki i elementy testowe (zgodnie z ustaleniami makiety).',
            ],
            'Brak barier wejścia i pełna zgodność z politykami bezpieczeństwa IT banków i korporacji. Użytkownik od pierwszego kontaktu widzi profesjonalne, nowoczesne narzędzie klasy Enterprise.'
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
              new TextRun({ text: 'Rysunek 2: Główny Pulpit Menedżerski (Dashboard) – 360-stopniowy podgląd ekosystemu', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Oto Pulpit główny platformy W-ally – Twoje centrum dowodzenia dostępnością cyfrową. Zamiast dziesiątek rozproszonych raportów PDF i arkuszy Excel, w jednym miejscu zyskujesz natychmiastowy, 360-stopniowy wgląd w kondycję wszystkich serwisów www, aplikacji mobilnych i dokumentów w organizacji. Pulpit łączy twarde dane audytowe ze statystykami SLA i bieżącymi informacjami operacyjnymi.”',
            '0:25 – 0:45 (20 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Górny pasek nawigacyjny: dostęp do Audytów, Raportowania, Skarg i Profilu.',
              'Wyszukiwarka globalna oraz powiadomienia o zdarzeniach.',
              'Systemowy baner informacyjny o nowościach i zmianach regulacyjnych.',
              'Zestaw kluczowych kafelków KPI oraz wykres trendu dostępności.',
              'Tabele szybkiego reagowania: serwisy o najniższej dostępności i ostatnie audyty.',
            ],
            'Oszczędność czasu kadry zarządzającej i koordynatorów dostępności. Jeden ekran pozwala ocenić stan zgodności z WCAG i natychmiast wykryć newralgiczne punkty wymagające interwencji.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Komponent 1.1: Nagłówek i Baner
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 1.1: Pasek Górny i Baner „Komunikaty i Nowości”', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('03_pulpit_naglowek_i_baner.png', 500, 82),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 3: Pasek górny platformy oraz zintegrowany baner komunikatów systemowych', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„W górnej części interfejsu znajduje się intuicyjna belka nawigacyjna oraz podłużny baner informacyjny. W pierwszej wersji wdrożenia baner pełni rolę bezpośredniego kanału łączności z zespołem audytorów – informuje o zbliżających się terminach regulacyjnych, nowych wytycznych WCAG 2.2 czy pracach serwisowych. Wkrótce będzie on w pełni spięty z backendem powiadomień organizacji.”',
            '0:45 – 1:00 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Pasek TopNavbar z logo W-ally, przełącznikami modułów i wyszukiwarką.',
              'Szybki dostęp do konsultacji eksperckich (ikona czatu w nagłówku).',
              'Baner informacyjny z możliwością przejścia do pełnej historii komunikatów.',
              'Profil zalogowanego użytkownika (np. Koordynator Dostępności – Twoja Firma).',
            ],
            'Użytkownicy w banku są zawsze na bieżąco z wymogami prawa (np. ustawa PAD, EAA) bez konieczności czytania zewnętrznych mailingów.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Komponent 1.2: KPI i Trendy
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 1.2: Karty Wyników KPI oraz Karta „Trendy Dostępności”', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('04_pulpit_kpi_i_trendy.png', 500, 145),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 4: Kluczowe wskaźniki efektywności (KPI) oraz makieta wykresu trendu wielomiesięcznego', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Poniżej widzimy 4 kluczowe metryki: średnią dostępność w całej organizacji – w tym wypadku 86.2%, liczbę aktywnych błędów priorytetowych, wskaźnik spełnienia kryteriów oraz znakomity wskaźnik sprawności napraw SLA na poziomie 91%. Obok znajduje się karta Trendów Dostępności – to zapowiedź zaawansowanego modułu analitycznego, który pokazuje dynamikę eliminowania barier w czasie i pozwala raportować progres przed zarządem.”',
            '1:00 – 1:15 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Średnia dostępność organizacji liczona ważonym algorytmem zgodności.',
              'Licznik krytycznych usterek blokujących użytkowników z niepełnosprawnościami.',
              'Wskaźnik SLA napraw – kontrola terminowości pracy software house’ów.',
              'Karta „Trendy dostępności” z wykresem słupkowo-liniowym (12 miesięcy).',
            ],
            'Jednoznaczne wskaźniki gotowe do prezentacji przed zarządem i organami nadzorczymi (KNF, PFRON). Dowód, że inwestycje w dostępność przynoszą wymierny skutek.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Komponent 1.3: Usługi wymagające uwagi
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 1.3: Usługi Wymagające Uwagi (Top 5) i Ostatnie Audyty', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('05_pulpit_uslugi_wymagajace_uwagi.png', 500, 140),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 5: Ranking serwisów o najniższej dostępności oraz rejestr ostatnich aktywności', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„W dolnej części pulpitu system automatycznie tworzy ranking usług o najniższym procencie zgodności – na przykład kalkulator kredytu hipotecznego czy proces reklamacyjny. Dzięki temu zespoły deweloperskie dokładnie wiedzą, gdzie skierować zasoby w pierwszej kolejności, a bezpośrednie odnośniki pozwalają przejść do detali jednym kliknięciem.”',
            '1:15 – 1:25 (10 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Top 5 procesów o najniższym scoringu dostępności z liczbą błędów.',
              'Wskaźniki kolorystyczne ryzyka (czerwony/żółty/zielony).',
              'Lista najświeższych raportów z datami i nazwiskami audytorów.',
              'Przycisk przejścia do pełnego modułu analitycznego.',
            ],
            'Koniec z chaotycznymi poprawkami. Priorytetyzacja prac oparta na faktach i ryzyku biznesowym (procesy kluczowe dla sprzedaży otrzymują najwyższy priorytet).'
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
              new TextRun({ text: 'Rysunek 6: Główny widok listy audytów z zaawansowanym filtrowaniem i wskaźnikami statusu', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Przechodzimy do serca platformy – Modułu Audytów. Znajdziesz tu kompletny rejestr wszystkich badań zrealizowanych dla Twojej organizacji. Zwróć uwagę na intuicyjne filtry wielowymiarowe: możesz błyskawicznie przefiltrować audyty po audytorze, statusie badania, kanale – jak WWW, aplikacja iOS, Android czy dokumenty PDF – a także wyodrębnić tylko audyty przypięte do obserwowanych. Zgodnie z procesem korporacyjnym zlecenia wstępnych audytów są koordynowane z opiekunem, dlatego z widoku usunęliśmy zbędne przyciski zlecenia z zewnątrz, skupiając się na danych.”',
            '1:25 – 1:45 (20 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Filtry wielowymiarowe (Audytor, Status, Kanał, Czas).',
              'Tabela audytów z paskami postępu zgodności WCAG.',
              'Rozbicie usterek: Priorytetowe, Ważne, Marginalne.',
              'Możliwość przypinania audytów do obserwowanych (ikona pinezki).',
            ],
            'Błyskawiczne odnalezienie dowolnego badania w kilka sekund. Pełna transparentność postępów weryfikacji i brak szumu informacyjnego.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Szczegóły audytu
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 2.1: Karta Szczegółów Audytu i Raport Wykonawczy WCAG 2.2', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('07_audyt_szczegoly_podsumowanie.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 7: Widok raportu szczegółowego z metadanymi, podsumowaniem eksperckim i kafelkami metryk', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Klikając w wybrany audyt – na przykład Portal Bankowości – wchodzimy do szczegółowego raportu. W nagłówku widzimy certyfikowanego audytora, okres badania oraz standard WCAG 2.2. Dostępne są natychmiastowe eksporty do edytowalnego dokumentu Word oraz arkusza Excel. Poniżej znajduje się syntetyczne podsumowanie eksperta oraz 5 kafelków wyników: ogólny procent zgodności, błędy priorytetowe, ważne, marginalne oraz liczba niespełnionych kryteriów sukcesu.”',
            '1:45 – 2:05 (20 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Belka ViewHeader z przyciskami eksportu: Pobierz Word (.docx) oraz Pobierz Excel (.xlsx).',
              'Zintegrowany pasek metadanych (Termin, Audytor, Wersja standardu WCAG).',
              'Narracyjne podsumowanie audytorskie opisujące stan dostępności serwisu.',
              '5 kafelków kategoryzacji usterek i złamanych kryteriów.',
            ],
            'Programiści i koordynatorzy otrzymują gotowy, rzetelny audyt bez czekania na załączniki mailowe. Eksport Word umożliwia generowanie oficjalnych pism do zarządu w 3 sekundy.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Historia i reaudyty
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 2.2: Karta Historii i Postępów Reaudytów dla Klienta', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('08_audyt_historia_reaudytow.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 8: Oś czasu reaudytów w audycie – śledzenie postępów usuwania usterek w cyklach naprawczych', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Kluczową innowacją W-ally jest moduł Reaudytów, zaprojektowany specjalnie pod procesy ciągłego wytwarzania oprogramowania. Zamiast płacić za kolejny pełny audyt, rejestrujemy cykle reaudytorskie. W osi czasu widzimy dokładnie: kiedy przeprowadzono reaudyt, kto go wykonał i ile błędów zostało skutecznie naprawionych – na przykład 3 z 4 usterek priorytetowych, co podniosło wynik serwisu o ponad 3 punkty procentowe.”',
            '2:05 – 2:20 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Oś czasu z kolejnymi badaniami sprawdzającymi (Reaudyt #1, Reaudyt #2).',
              'Wskaźnik skuteczności napraw (np. Poprawiono 3 / 4 błędy).',
              'Wykaz przetestowanych widoków i ekranów z podziałem na wagi usterek.',
              'Przycisk „Zleć re-audyt” dostępny w kontekście danego badania.',
            ],
            'Drastyczna oszczędność budżetu organizacji. Klient płaci wyłącznie za ponowną weryfikację poprawionych elementów, a nie za powtórne badanie całego portalu od zera.'
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // Zlecenie reaudytu
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 2.3: Proces Zlecenia Reaudytu (Dla Badania z Otwartymi Błędami)', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('10_modal_zlecenia_reaudytu.png', 500, 330),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 9: Okno modalne zlecenia reaudytu z weryfikacją poprawek wdrożonych przez deweloperów', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„A jak wygląda zlecenie reaudytu w praktyce? Przełączając się na badanie aplikacji mobilnej, która posiada nierozwiązane usterki, klikamy „Zleć reaudyt”. Otwiera się dedykowany formularz. Koordynator zaznacza usterki, które zespół programistów oznaczył wewnętrznie jako naprawione na środowisku testowym. Możemy dopisać notatkę techniczną ze ścieżką do commita i złożyć zapotrzebowanie bezpośrednio do audytora prowadzącego.”',
            '2:20 – 2:30 (10 sekund)'
          ),
          new Paragraph({ spacing: { after: 100 } }),
          createDetailsTable(
            [
              'Nagłówek Panelu Koordynacji z przypisanym audytorem prowadzącym.',
              'Interaktywna lista błędów z poprzedniego audytu do oznaczenia naprawy.',
              'Pole notatek technicznych i instrukcji testowych dla audytora.',
              'Jasny podgląd kalkulacji zakresu i przycisk wysłania zlecenia.',
            ],
            'Eliminacja nieporozumień na linii deweloperzy – audytorzy. Audytor sprawdza dokładnie to, co zostało naprawione, oszczędzając czas obu zespołów.'
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
            '2:30 – 2:40 (10 sekund)'
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
          // MODUŁ 3: RAPORTOWANIE
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 3: RAPORTOWANIE I DOSTĘPNOŚĆ USŁUG BIZNESOWYCH', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('12_raportowanie_zestawienie_audytow.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 11: Moduł Raportowania – Zestawienie przekrojowe audytów z bezpośrednim eksportem do arkusza Excel', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Kolejnym filarem W-ally jest Moduł Raportowania. Pierwsza zakładka – Raporty z Audytów – pozwala tworzyć przekrojowe zestawienia wielu badań naraz. Usunęliśmy stąd zbędny etap pośredni: jednym kliknięciem generujesz i pobierasz gotowy plik Excel z pełnym wykazem wskaźników, urządzeń i statusów, idealny do wewnętrznych analiz analitycznych.”',
            '2:40 – 2:55 (15 sekund)'
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
              new TextRun({ text: 'Komponent 3.1: Raportowanie „Dostępność Usług” (Procesy Biznesowe)', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('13_raportowanie_dostepnosc_uslug.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 12: Przekrojowy scoring procesów biznesowych i usług (kredyt, BLIK, kantor) pod kątem barier WCAG', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Druga gotowa zakładka to Dostępność Usług. To unikalne spojrzenie biznesowe: zamiast patrzeć wyłącznie na serwery i adresy URL, W-ally bada całe procesy klienta – takie jak wzięcie kredytu hipotecznego, założenie rachunku firmowego czy płatności BLIK. Widzimy dokładny scoring każdego procesu i poziom ryzyka biznesowego.”',
            '2:55 – 3:15 (20 sekund)'
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
              new TextRun({ text: 'Komponent 3.2: Wizja Rozwoju – Raporty Zarządcze (C-Level) & Sprawozdawczość PAD', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('18_popup_raporty_zarzadcze.png', 500, 320),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 13: Zapowiedź planowanego modułu Raportów Zarządczych C-Level (popup informacyjny w makiecie)', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Kolejne dwa moduły raportowania – Raporty Zarządcze dla C-Level oraz Sprawozdawczość Regulacyjna PAD i EAA – są obecnie w fazie projektowej. Zostały zaprezentowane w formie estetycznych zapowiedzi. Docelowo pozwolą one jednym kliknięciem wygenerować urzędowy wzór Deklaracji Dostępności zgodnie z Ustawą oraz syntetyczne podsumowanie trendów dla dyrekcji.”',
            '3:15 – 3:35 (20 sekund)'
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
          // MODUŁ 4: KONSULTACJE (ZAPROJEKTOWANY WIDOK DLA KOORDYNATORA)
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 4: MODUŁ KONSULTACJI – CENTRALNY KANAŁ USTALEŃ I KOORDYNACJI', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('17_konsultacje_modul_tickety.png', 500, 325),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 14: Zaprojektowany moduł Konsultacje – bezpieczny kanał komunikacji Koordynatora Dostępności z audytorem WCAG i opiekunem klienta, z powiązaniem do audytów i reklamacji (w trakcie wdrożenia do produkcji)', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Kolejnym kluczowym elementem systemu jest Moduł Konsultacji – i zależy nam na dosłownym zachowaniu tej nazwy. Nie proponujemy modelu, w którym każdy deweloper pisze bezpośrednio do audytora z pojedynczym błędem technicznym, tworząc chaos komunikacyjny. Konsultacje to strategiczne narzędzie dedykowane dla Koordynatora Dostępności do bezpośredniego kontaktu z certyfikowanym audytorem oraz opiekunem klienta po stronie W-ally. W jednym miejscu przenosimy do systemu całą rozproszoną dotąd komunikację mailową i telefoniczną: możemy tu omawiać skomplikowane reklamacje, uzgadniać interpretacje kryteriów WCAG, a także zamawiać nowe prace i audyty. Co niezwykle ułatwia odnalezienie się w sprawach – każda konsultacja może być bezpośrednio przypisana do konkretnego audytu lub konkretnej reklamacji. Dzięki temu zarówno organizacja, jak i audytorzy mają zawsze pełny kontekst ustaleń i pełną historię decyzji pod ręką. Moduł prezentuje zaprojektowany interfejs i jest obecnie w trakcie końcowego wdrożenia produkcyjnego.”',
            '3:35 – 4:05 (30 sekund)'
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
          // MODUŁ 5: SKARGI I REKLAMACJE (REJESTR + SZCZEGÓŁY KONKRETNEJ SKARGI)
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 5: REJESTR SKARG I ZAWIADOMIEŃ NA BARIERY DOSTĘPNOŚCI', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('20_reklamacje_rejestr_skarg.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 15: Rejestr skarg i zawiadomień klientów dotyczących barier cyfrowych w usługach', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Kolejnym kluczowym modułem operacyjnym są Skargi i Zawiadomienia. Ustawa o dostępności nakłada na podmioty obowiązek rejestrowania i terminowego odpowiadania na zgłoszenia użytkowników z niepełnosprawnościami. W-ally zapewnia centralny rejestr takich spraw z monitoringiem ustawowych terminów, wagą problemu i powiązaniem z audytami technicznymi.”',
            '4:05 – 4:20 (15 sekund)'
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

          // Szczegóły konkretnej skargi (NOWOŚĆ z unikalnymi rozwiązaniami)
          new Paragraph({
            children: [
              new TextRun({ text: 'Komponent 5.1: Szczegóły Konkretnej Skargi (#RKL-2026-089) – Unikalne Rozwiązania', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('21_reklamacja_szczegoly_rozwiazania.png', 500, 330),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 16: Widok szczegółowy konkretnej skargi (#RKL-2026-089) – zaawansowane integracje: Jira, powiązany wątek w module Konsultacji z audytorem i opiekunem, zlecenie reaudytu i terminy SLA', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„Wchodząc w szczegóły konkretnej sprawy – na przykład zgłoszenia dotyczącego niedostępnych wykresów dla czytnika NVDA – odkrywamy pełną moc integracyjną W-ally. Z poziomu jednego ekranu widzimy licznik terminu ustawowego, przypisanego programistę oraz bezpośredni link do zadania w systemie Jira. Co więcej: skarga jest zintegrowana z wątkiem w module Konsultacji u audytora, a po wdrożeniu poprawki koordynator może jednym kliknięciem zlecić reaudyt weryfikacyjny, zamykając sprawę zgodnie z prawem.”',
            '4:20 – 4:35 (15 sekund)'
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
              new TextRun({ text: 'Komponent 5.2: Formularz Rejestracji Nowego Zgłoszenia o Barierze', bold: true, size: 22, color: '0F172A' }),
            ],
            spacing: { before: 180, after: 100 },
          }),
          createImageParagraph('21_reklamacja_nowe_zgloszenie.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 17: Dedykowany formularz rejestracji wniosku lub skargi klienta w systemie', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          createVoiceoverBox(
            '„W razie wpływu zawiadomienia pracownik infolinii lub oddziału rejestruje wniosek w 2 minuty: wybiera dotkniętą usługę, typ bariery – na przykład brak obsługi czytnika ekranu NVDA – oraz dane kontaktowe klienta. Zgłoszenie natychmiast trafia do koordynatora dostępności.”',
            '4:35 – 4:45 (10 sekund)'
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
          // PODSUMOWANIE & CALL TO ACTION (Z WIDOKIEM PULPITU KLIENTA)
          // =========================================================================
          new Paragraph({
            children: [
              new TextRun({ text: 'KROK 6: PODSUMOWANIE I WDROŻENIE W TWOJEJ ORGANIZACJI', bold: true, size: 28, color: '0038F8' }),
            ],
            spacing: { before: 300, after: 120 },
          }),
          createImageParagraph('02_pulpit_pelny_widok.png'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Rysunek 18: Zintegrowany ekosystem W-ally – Pulpit Menedżerski łączący audyty, reaudyty, raportowanie i skargi', size: 16, italics: true, color: '64748B' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
          }),
          createVoiceoverBox(
            '„Podsumowując: W-ally to nie jest zwykła przeglądarka audytów czy statyczna baza wiedzy. To kompletny, nowoczesny ekosystem, który łączy kadrę zarządzającą, koordynatorów dostępności, audytorów i deweloperów w jednym środowisku pracy. Zapewnia realną oszczędność budżetu dzięki reaudytom, chroni przed ryzykiem prawnym i realnie podnosi jakość cyfrowych usług Twojej organizacji. Dziękujemy za uwagę i zapraszamy do wspólnego wdrożenia platformy W-ally.”',
            '4:45 – 5:00 (15 sekund)'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          createDetailsTable(
            [
              'Jedno centralne środowisko pracy (Single Source of Truth) dla całej organizacji.',
              'Spójne połączenie audytów technicznych z procesami biznesowymi i obsługą skarg.',
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
