import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const exportsDir = path.join(projectRoot, "exports");

if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// ============================================================================
// 1. KATALOG FRAZ: STRONA LOGOWANIA (LOGIN VIEW)
// ============================================================================
export const loginPhrases = [
  // SEKCJA 1: Identyfikacja i Nagłówek
  {
    id: "login.brand.name",
    section: "Logowanie – Identyfikacja i Nagłówek",
    context: "Logo i nazwa systemu w lewym górnym rogu ekranu logowania",
    type: "Etykieta",
    original: "W-ally",
    plainLanguageSuggestion: "W-ally",
    editorNotes: "Nazwa własna platformy audytowej WCAG. Pozostawić bez zmian.",
  },
  {
    id: "login.header.title",
    section: "Logowanie – Identyfikacja i Nagłówek",
    context: "Główny nagłówek formularza (H1)",
    type: "Tytuł",
    original: "Witaj z powrotem",
    plainLanguageSuggestion: "Zaloguj się do konta",
    editorNotes: "W prostym języku można użyć bezpośredniego zwrotu do czynności: 'Zaloguj się do konta' lub pozostawić przyjazne 'Witaj z powrotem'.",
  },
  {
    id: "login.header.subtitle",
    section: "Logowanie – Identyfikacja i Nagłówek",
    context: "Tekst wprowadzający pod nagłówkiem H1",
    type: "Podtytuł",
    original: "Zaloguj się, aby zarządzać dostępnością cyfrową w swojej organizacji.",
    plainLanguageSuggestion: "Wpisz swoje dane, aby zarządzać dostępnością cyfrową serwisów i aplikacji banku.",
    editorNotes: "Krótkie, jasne zdanie w trybie rozkazującym/czynnym wyjaśniające cel logowania.",
  },

  // SEKCJA 2: Formularz i Pola Danych
  {
    id: "login.form.email_label",
    section: "Logowanie – Formularz i Pola",
    context: "Etykieta pola e-mail",
    type: "Etykieta pola",
    original: "Adres e-mail",
    plainLanguageSuggestion: "Adres e-mail",
    editorNotes: "Standardowe, powszechnie zrozumiałe określenie.",
  },
  {
    id: "login.form.email_placeholder",
    section: "Logowanie – Formularz i Pola",
    context: "Tekst zastępczy (placeholder) w polu e-mail",
    type: "Tekst podpowiedzi",
    original: "jan.kowalski@firma.pl",
    plainLanguageSuggestion: "twoj.email@twojabank.pl",
    editorNotes: "Przykładowy służbowy adres poczty elektronicznej.",
  },
  {
    id: "login.form.password_label",
    section: "Logowanie – Formularz i Pola",
    context: "Etykieta pola hasła",
    type: "Etykieta pola",
    original: "Hasło",
    plainLanguageSuggestion: "Hasło",
    editorNotes: "Jasne, jednoznaczne słowo.",
  },
  {
    id: "login.form.password_placeholder",
    section: "Logowanie – Formularz i Pola",
    context: "Tekst zastępczy w polu hasła",
    type: "Tekst podpowiedzi",
    original: "••••••••••••",
    plainLanguageSuggestion: "Wpisz hasło",
    editorNotes: "Kropki maskujące lub czytelna podpowiedź.",
  },
  {
    id: "login.form.forgot_password",
    section: "Logowanie – Formularz i Pola",
    context: "Odnośnik resetu hasła obok etykiety pola",
    type: "Odnośnik",
    original: "Zapomniałeś hasła?",
    plainLanguageSuggestion: "Nie pamiętasz hasła?",
    editorNotes: "Forma bezosobowa lub bezpośrednia 'Nie pamiętasz hasła?' zamiast zwrotu wyłącznie w rodzaju męskim.",
  },
  {
    id: "login.form.show_password_aria",
    section: "Logowanie – Formularz i Pola",
    context: "Etykieta dostępności przycisku odsłonięcia hasła",
    type: "Dostępność (Aria)",
    original: "Pokaż hasło",
    plainLanguageSuggestion: "Pokaż wpisane hasło",
    editorNotes: "Precyzyjna instrukcja dla czytników ekranu.",
  },
  {
    id: "login.form.hide_password_aria",
    section: "Logowanie – Formularz i Pola",
    context: "Etykieta dostępności przycisku ukrycia hasła",
    type: "Dostępność (Aria)",
    original: "Ukryj hasło",
    plainLanguageSuggestion: "Ukryj hasło",
    editorNotes: "Precyzyjna instrukcja dla czytników ekranu.",
  },
  {
    id: "login.form.remember_me",
    section: "Logowanie – Formularz i Pola",
    context: "Etykieta pola wyboru (checkbox) trwałego logowania",
    type: "Pole wyboru",
    original: "Zapamiętaj mnie na tym urządzeniu",
    plainLanguageSuggestion: "Zapamiętaj mnie na tym komputerze",
    editorNotes: "Jasny komunikat, że sesja zostanie zachowana.",
  },
  {
    id: "login.form.submit_button",
    section: "Logowanie – Formularz i Pola",
    context: "Główny niebieski przycisk logowania",
    type: "Przycisk",
    original: "Zaloguj się do panelu",
    plainLanguageSuggestion: "Zaloguj się",
    editorNotes: "Prostszy i krótszy zwrot 'Zaloguj się' jest bardziej naturalny niż 'Zaloguj się do panelu'.",
  },

  // SEKCJA 3: Bezpieczeństwo i Komunikaty Prawne
  {
    id: "login.security.notice",
    section: "Logowanie – Bezpieczeństwo i Noty Prawne",
    context: "Komunikat w szarej ramce pod formularzem logowania",
    type: "Komunikat informacyjny",
    original: "Dostęp do platformy wymaga konta służbowego utworzonego przez Twoją organizację. Wpisując dane potwierdzasz zgodność z Polityką Bezpieczeństwa.",
    plainLanguageSuggestion: "Zalogujesz się tylko kontem służbowym swojej organizacji. Logując się, akceptujesz zasady Polityki Bezpieczeństwa.",
    editorNotes: "Eliminacja konstrukcji biernej ('wymaga konta utworzonego') na rzecz krótkich, czytelnych zdań.",
  },
  {
    id: "login.security.policy_link",
    section: "Logowanie – Bezpieczeństwo i Noty Prawne",
    context: "Odnośnik do Polityki Bezpieczeństwa w notce",
    type: "Odnośnik",
    original: "Polityką Bezpieczeństwa",
    plainLanguageSuggestion: "Polityka Bezpieczeństwa",
    editorNotes: "Tytuł powiązanego dokumentu regulaminowego.",
  },

  // SEKCJA 4: Stopka Strony Logowania
  {
    id: "login.footer.copyright",
    section: "Logowanie – Stopka",
    context: "Nota praw autorskich w stopce",
    type: "Nota prawna",
    original: "© 2026 Widzialni.eu",
    plainLanguageSuggestion: "© 2026 Widzialni.eu",
    editorNotes: "Pozostawić bez zmian.",
  },
  {
    id: "login.footer.help",
    section: "Logowanie – Stopka",
    context: "Odnośnik do pomocy w stopce logowania",
    type: "Odnośnik",
    original: "Pomoc",
    plainLanguageSuggestion: "Pomoc i kontakt",
    editorNotes: "Można doprecyzować do 'Pomoc i kontakt'.",
  },
  {
    id: "login.footer.privacy",
    section: "Logowanie – Stopka",
    context: "Odnośnik do Polityki Prywatności w stopce",
    type: "Odnośnik",
    original: "Polityka Prywatności",
    plainLanguageSuggestion: "Polityka prywatności",
    editorNotes: "Zgodnie z zasadami polskiej ortografii małą literą drugi człon.",
  },
  {
    id: "login.footer.report_problem",
    section: "Logowanie – Stopka",
    context: "Odnośnik zgłaszania problemów z logowaniem",
    type: "Odnośnik",
    original: "Zgłoś problem",
    plainLanguageSuggestion: "Zgłoś problem z logowaniem",
    editorNotes: "Doprecyzowanie, czego dotyczy zgłoszenie.",
  },

  // SEKCJA 5: Panel Promocyjny i Korzyści (Prawa strona)
  {
    id: "login.promo.badge",
    section: "Logowanie – Panel Korzyści (Prawa strona)",
    context: "Niebieska pigułka z certyfikacją nad nagłówkiem",
    type: "Plakietka (Badge)",
    original: "Pełne wsparcie WCAG 2.2",
    plainLanguageSuggestion: "Zgodne z normą WCAG 2.2",
    editorNotes: "Wskazuje aktualny poziom standardu dostępności.",
  },
  {
    id: "login.promo.headline_line1",
    section: "Logowanie – Panel Korzyści (Prawa strona)",
    context: "Główny nagłówek panelu promocyjnego - linia 1",
    type: "Tytuł",
    original: "Nowy wymiar audytów",
    plainLanguageSuggestion: "Nowoczesne zarządzanie audytami",
    editorNotes: "Marketingowe hasło; w prostym języku warto wskazać konkretną wartość: 'Nowoczesne audyty'.",
  },
  {
    id: "login.promo.headline_line2",
    section: "Logowanie – Panel Korzyści (Prawa strona)",
    context: "Główny nagłówek panelu promocyjnego - linia 2 (gradient)",
    type: "Tytuł",
    original: "dostępności cyfrowej.",
    plainLanguageSuggestion: "dostępności cyfrowej.",
    editorNotes: "Dokończenie głównego hasła.",
  },
  {
    id: "login.promo.description",
    section: "Logowanie – Panel Korzyści (Prawa strona)",
    context: "Akapit opisowy pod nagłówkiem",
    type: "Opis",
    original: "Zarządzaj błędami WCAG, monitoruj SLA zespołów i generuj deklaracje PAD z jednego, scentralizowanego miejsca.",
    plainLanguageSuggestion: "Sprawdzaj błędy dostępności, kontroluj terminy napraw i twórz deklaracje zgodności w jednym miejscu.",
    editorNotes: "Zastąpienie skrótowców 'SLA' i 'PAD' zrozumiałymi pojęciami ('terminy napraw', 'deklaracje zgodności').",
  },
  {
    id: "login.promo.testimonial_quote",
    section: "Logowanie – Panel Korzyści (Prawa strona)",
    context: "Cytat rekomendacji w dolnej karcie",
    type: "Cytat / Opinia",
    original: "\"Wdrożenie platformy W-ally pozwoliło nam skrócić czas naprawy błędów priorytetowych o 40% i uporządkować współpracę z dostawcami.\"",
    plainLanguageSuggestion: "\"Dzięki platformie W-ally naprawiamy błędy krytyczne o 40% szybciej i sprawnie współpracujemy z programistami.\"",
    editorNotes: "Uproszczenie stylu, dynamiczne słowa ('naprawiamy błędy krytyczne szybciej').",
  },
  {
    id: "login.promo.testimonial_author",
    section: "Logowanie – Panel Korzyści (Prawa strona)",
    context: "Imię i nazwisko autora rekomendacji",
    type: "Podpis",
    original: "Anna Kowalczyk",
    plainLanguageSuggestion: "Anna Kowalczyk",
    editorNotes: "Pozostawić bez zmian.",
  },
  {
    id: "login.promo.testimonial_role",
    section: "Logowanie – Panel Korzyści (Prawa strona)",
    context: "Stanowisko i organizacja autora rekomendacji",
    type: "Podpis",
    original: "Accessibility Lead, Duży Bank SA",
    plainLanguageSuggestion: "Liderka ds. dostępności cyfrowej, Bank",
    editorNotes: "Spolszczenie anglicyzmu 'Accessibility Lead' na 'Liderka ds. dostępności cyfrowej'.",
  },
];

// ============================================================================
// 2. KATALOG FRAZ: PULPIT GŁÓWNY (DASHBOARD)
// ============================================================================
export const dashboardPhrases = [
  // SEKCJA 1: Nagłówek i Powitanie
  {
    id: "dashboard.breadcrumbs.home",
    section: "Pulpit – Nagłówek i Powitanie",
    context: "Pierwszy element ścieżki powrotnej (breadcrumbs)",
    type: "Nawigacja",
    original: "Pulpit",
    plainLanguageSuggestion: "Pulpit",
    editorNotes: "Wskazuje stronę główną w strukturze serwisu.",
  },
  {
    id: "dashboard.welcome.title",
    section: "Pulpit – Nagłówek i Powitanie",
    context: "Główny nagłówek H1 na pulpicie",
    type: "Tytuł",
    original: "Witaj, Piotr! 👋",
    plainLanguageSuggestion: "Dzień dobry, Piotr! 👋",
    editorNotes: "Przyjazne, bezpośrednie powitanie.",
  },
  {
    id: "dashboard.welcome.subtitle",
    section: "Pulpit – Nagłówek i Powitanie",
    context: "Podtytuł wprowadzający pod nagłówkiem H1",
    type: "Podtytuł",
    original: "Oto aktualny stan dostępności cyfrowej i wskaźniki zgodności WCAG 2.1 AA w Twojej organizacji.",
    plainLanguageSuggestion: "Sprawdź aktualny poziom dostępności cyfrowej i zgodności z normą WCAG w Twojej organizacji.",
    editorNotes: "Zamiana 'Oto...' na aktywne 'Sprawdź...'.",
  },
  {
    id: "dashboard.welcome.badge",
    section: "Pulpit – Nagłówek i Powitanie",
    context: "Etykieta aktualności danych przy nagłówku",
    type: "Plakietka (Badge)",
    original: "Aktualizacja na żywo",
    plainLanguageSuggestion: "Dane aktualizowane na bieżąco",
    editorNotes: "Jasna informacja, że wskaźniki odzwierciedlają najświeższe badania.",
  },
  {
    id: "dashboard.actions.btn_reports",
    section: "Pulpit – Nagłówek i Powitanie",
    context: "Przycisk nawigacji do raportów w nagłówku",
    type: "Przycisk",
    original: "Raportowanie",
    plainLanguageSuggestion: "Zobacz raporty",
    editorNotes: "Zastąpienie rzeczownika odczasownikowego konkretnym czasownikiem.",
  },
  {
    id: "dashboard.actions.btn_audits",
    section: "Pulpit – Nagłówek i Powitanie",
    context: "Główny niebieski przycisk w nagłówku pulpitu",
    type: "Przycisk",
    original: "Przeglądaj audyty",
    plainLanguageSuggestion: "Zobacz listę audytów",
    editorNotes: "Bezpośrednie polecenie wskazujące cel akcji.",
  },

  // SEKCJA 2: Karty KPI
  {
    id: "dashboard.kpi.avg_score.title",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Tytuł 1. karty KPI (średni wynik zgodności)",
    type: "Etykieta wskaźnika",
    original: "Średnia Dostępność",
    plainLanguageSuggestion: "Średnia dostępność",
    editorNotes: "Małą literą drugi człon dla naturalnego brzmienia w języku polskim.",
  },
  {
    id: "dashboard.kpi.avg_score.badge",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Plakietka trendu miesiąc do miesiąca",
    type: "Dynamika (Trend)",
    original: "+2.4% m/m",
    plainLanguageSuggestion: "+2,4% w tym miesiącu",
    editorNotes: "Rozwinięcie skrótu biznesowego 'm/m' na zrozumiały zapis 'w tym miesiącu'.",
  },
  {
    id: "dashboard.kpi.avg_score.subtext",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Dopisek pomocniczy pod wynikiem procentowym",
    type: "Podpis wskaźnika",
    original: "Zgodność z WCAG 2.1 AA",
    plainLanguageSuggestion: "Zgodność z normą WCAG 2.1 AA",
    editorNotes: "Doprecyzowanie, o jaką normę chodzi.",
  },
  {
    id: "dashboard.kpi.avg_score.tooltip",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Dymek pomocniczy (tooltip) ikony informacji przy karcie wyniku",
    type: "Dymek (Tooltip)",
    original: "Średni wynik spełnienia kryteriów sukcesu WCAG 2.1 AA dla wszystkich aktywnych audytów w organizacji.",
    plainLanguageSuggestion: "Pokazuje średni wynik dostępności ze wszystkich zbadanych serwisów i aplikacji. Wynik powyżej 80% oznacza wysoką zgodność.",
    editorNotes: "Wyjaśnienie w 1 zdaniu co oznacza ten wynik dla koordynatora.",
  },

  {
    id: "dashboard.kpi.coverage.title",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Tytuł 2. karty KPI (pokrycie audytowe)",
    type: "Etykieta wskaźnika",
    original: "Pokrycie Audytowe",
    plainLanguageSuggestion: "Zbadane usługi",
    editorNotes: "W prostym języku pojęcie 'Pokrycie audytowe' można wyjaśnić jako 'Zbadane usługi i procesy'.",
  },
  {
    id: "dashboard.kpi.coverage.badge",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Plakietka przyrostu w karcie pokrycia",
    type: "Dynamika (Trend)",
    original: "+5 audytów",
    plainLanguageSuggestion: "+5 nowych audytów",
    editorNotes: "Jasne wskazanie przyrostu zbadanych usług.",
  },
  {
    id: "dashboard.kpi.coverage.subtext",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Dopisek pomocniczy pod liczbą pokrycia",
    type: "Podpis wskaźnika",
    original: "50 z 50 procesów w Bazie Usług",
    plainLanguageSuggestion: "Wszystkie 50 procesów posiada aktualne badanie",
    editorNotes: "Potwierdzenie pełnego, 100% monitoringu.",
  },
  {
    id: "dashboard.kpi.coverage.tooltip",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Dymek pomocniczy przy karcie pokrycia",
    type: "Dymek (Tooltip)",
    original: "Odsetek zinwentaryzowanych procesów w Bazie Usług, które posiadają ważny audyt dostępności.",
    plainLanguageSuggestion: "Wskazuje, ile procesów z bazy banku zostało już przebadanych przez audytorów WCAG.",
    editorNotes: "Zastąpienie trudnego słowa 'zinwentaryzowanych' prostym zwrotem.",
  },

  {
    id: "dashboard.kpi.errors.title",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Tytuł 3. karty KPI (otwarte błędy)",
    type: "Etykieta wskaźnika",
    original: "Otwarte Błędy",
    plainLanguageSuggestion: "Błędy do naprawy",
    editorNotes: "Zamiast żargonowego 'Otwarte błędy' prosty zwrot 'Błędy do naprawy'.",
  },
  {
    id: "dashboard.kpi.errors.badge",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Plakietka dynamiki spadku błędów",
    type: "Dynamika (Trend)",
    original: "-12 w tym m-cu",
    plainLanguageSuggestion: "Ubyło 12 w tym miesiącu",
    editorNotes: "Rozwinięcie skrótu 'm-cu'.",
  },
  {
    id: "dashboard.kpi.errors.subtext",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Dopisek pomocniczy o triadzie priorytetów",
    type: "Podpis wskaźnika",
    original: "Czerwone: blokady krytyczne",
    plainLanguageSuggestion: "W pierwszej kolejności naprawiaj błędy krytyczne (czerwone)",
    editorNotes: "Wskazówka kierująca uwagę na usuwanie blokad uniemożliwiających klientom korzystanie z banku.",
  },
  {
    id: "dashboard.kpi.errors.tooltip",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Dymek pomocniczy przy karcie błędów",
    type: "Dymek (Tooltip)",
    original: "Łączna liczba wykrytych barier cyfrowych oczekujących na wdrożenie fixów przez zespoły deweloperskie.",
    plainLanguageSuggestion: "Liczba wykrytych problemów, które programiści muszą poprawić w kodzie stron i aplikacji.",
    editorNotes: "Zastąpienie anglicyzmu 'fixy' słowem 'poprawić'.",
  },
  {
    id: "dashboard.kpi.errors.dominance",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Wskaźnik dominacji barier na karcie błędów",
    type: "Wskaźnik dominacji",
    original: "Dominują: Ważne (54%)",
    plainLanguageSuggestion: "Najwięcej jest błędów ważnych (54%)",
    editorNotes: "Wskazuje na pierwszy rzut oka, która kategoria barier dominuje w audytach.",
  },
  {
    id: "dashboard.kpi.errors.structure_label",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Etykieta nad poziomym paskiem składowym barier",
    type: "Podpis wykresu",
    original: "Udział procentowy w całości:",
    plainLanguageSuggestion: "Procentowy podział błędów:",
    editorNotes: "Wprowadzenie do poziomego paska udziału.",
  },
  {
    id: "dashboard.kpi.errors.dominance_note",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Dopisek informacyjny przy poziomym pasku składowym",
    type: "Podpis wykresu",
    original: "Ważne stanowią ponad połowę (54%)",
    plainLanguageSuggestion: "Błędy ważne to ponad połowa wszystkich usterek (54%)",
    editorNotes: "Wyraźne podkreślenie skali występowania barier stopnia drugiego.",
  },

  {
    id: "dashboard.kpi.complaints.title",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Tytuł 4. karty KPI (zgłoszenia reklamacyjne)",
    type: "Etykieta wskaźnika",
    original: "Zgłoszenia Klientów",
    plainLanguageSuggestion: "Zgłoszenia od klientów",
    editorNotes: "Zrozumiałe określenie barier zgłoszonych z zewnątrz.",
  },
  {
    id: "dashboard.kpi.complaints.badge",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Plakietka dotrzymania terminów (SLA)",
    type: "Dynamika (Trend)",
    original: "SLA: 98%",
    plainLanguageSuggestion: "Terminowość: 98%",
    editorNotes: "Zastąpienie branżowego skrótu 'SLA' pojęciem 'Terminowość odpowiedzi'.",
  },
  {
    id: "dashboard.kpi.complaints.subtext",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Dopisek pomocniczy o czasie reakcji",
    type: "Podpis wskaźnika",
    original: "Śr. czas reakcji: 4.2h",
    plainLanguageSuggestion: "Średni czas odpowiedzi: 4 godziny",
    editorNotes: "Rozwinięcie skrótu 'h' i 'Śr.'.",
  },
  {
    id: "dashboard.kpi.complaints.tooltip",
    section: "Pulpit – Karty Wskaźników KPI",
    context: "Dymek pomocniczy przy karcie zgłoszeń",
    type: "Dymek (Tooltip)",
    original: "Zgłoszenia barier dostępności przesłane przez klientów i pracowników, wymagające opinii audytora lub naprawy.",
    plainLanguageSuggestion: "Liczba skarg na bariery cyfrowe zgłoszonych przez osoby ze szczególnymi potrzebami.",
    editorNotes: "Zwięzłe, empatyczne objaśnienie.",
  },

  // SEKCJA 3: Wykresy Dostępności i Kanałów
  {
    id: "dashboard.chart.trend.title",
    section: "Pulpit – Wykresy",
    context: "Tytuł głównego wykresu trendu 12-miesięcznego",
    type: "Tytuł wykresu",
    original: "Dynamika Dostępności i Liczba Błędów (Ostatnie 12 miesięcy)",
    plainLanguageSuggestion: "Postępy dostępności w ostatnich 12 miesiącach",
    editorNotes: "Krótszy, bardziej naturalny tytuł wykresu.",
  },
  {
    id: "dashboard.chart.trend.subtitle",
    section: "Pulpit – Wykresy",
    context: "Podtytuł wykresu trendu",
    type: "Podtytuł wykresu",
    original: "Miesięczna ewolucja średniego wyniku zgodności WCAG vs. tempo redukcji zidentyfikowanych barier cyfrowych.",
    plainLanguageSuggestion: "Sprawdź, jak rośnie wynik zgodności i jak szybko ubywa wykrytych błędów.",
    editorNotes: "Prostszy język: unikanie 'miesięcznej ewolucji' i 'vs.'.",
  },
  {
    id: "dashboard.chart.trend.legend_score",
    section: "Pulpit – Wykresy",
    context: "Legenda - słupek dostępności (%)",
    type: "Legenda",
    original: "Średnia dostępność (%)",
    plainLanguageSuggestion: "Średnia dostępność (%)",
    editorNotes: "Jasne oznaczenie niebieskich słupków.",
  },
  {
    id: "dashboard.chart.trend.legend_errors",
    section: "Pulpit – Wykresy",
    context: "Legenda - słupek liczby błędów",
    type: "Legenda",
    original: "Liczba błędów",
    plainLanguageSuggestion: "Liczba błędów w systemach",
    editorNotes: "Jasne oznaczenie szarych słupków.",
  },
  {
    id: "dashboard.chart.channels.title",
    section: "Pulpit – Wykresy",
    context: "Tytuł wykresu poziomego dla kanałów",
    type: "Tytuł wykresu",
    original: "Dostępność według Kanałów",
    plainLanguageSuggestion: "Dostępność w poszczególnych kanałach",
    editorNotes: "Wskazuje podział na technologie bankowe.",
  },
  {
    id: "dashboard.chart.channels.subtitle",
    section: "Pulpit – Wykresy",
    context: "Podtytuł wykresu kanałów",
    type: "Podtytuł wykresu",
    original: "Średnia ocena zgodności ze standardem WCAG 2.1 AA",
    plainLanguageSuggestion: "Średni wynik dla serwisów WWW, aplikacji mobilnych i dokumentów",
    editorNotes: "Wymienienie kanałów ułatwia zrozumienie.",
  },
  {
    id: "dashboard.channel.web",
    section: "Pulpit – Wykresy",
    context: "Nazwa kanału WWW",
    type: "Etykieta kanału",
    original: "Serwisy WWW",
    plainLanguageSuggestion: "Serwisy WWW (przeglądarka)",
    editorNotes: "Doprecyzowanie, że chodzi o komputery stacjonarne i laptopy.",
  },
  {
    id: "dashboard.channel.android",
    section: "Pulpit – Wykresy",
    context: "Nazwa kanału Android",
    type: "Etykieta kanału",
    original: "Aplikacja Android",
    plainLanguageSuggestion: "Aplikacja Android (telefon)",
    editorNotes: "Wskazuje aplikację mobilną ze sklepu Google Play.",
  },
  {
    id: "dashboard.channel.ios",
    section: "Pulpit – Wykresy",
    context: "Nazwa kanału iOS",
    type: "Etykieta kanału",
    original: "Aplikacja iOS",
    plainLanguageSuggestion: "Aplikacja iOS (iPhone)",
    editorNotes: "Wskazuje aplikację mobilną z App Store.",
  },
  {
    id: "dashboard.channel.docs",
    section: "Pulpit – Wykresy",
    context: "Nazwa kanału Dokumenty",
    type: "Etykieta kanału",
    original: "Dokumenty (PDF)",
    plainLanguageSuggestion: "Dokumenty PDF i regulaminy",
    editorNotes: "Wskazuje cyfrowe pliki do pobrania.",
  },

  // SEKCJA 4: Ostatnie Audyty
  {
    id: "dashboard.recent_audits.title",
    section: "Pulpit – Rejestr Badań",
    context: "Nagłówek sekcji tabeli ostatnich audytów",
    type: "Tytuł sekcji",
    original: "Ostatnie audyty",
    plainLanguageSuggestion: "Najnowsze audyty",
    editorNotes: "Zestawienie ostatnich badań w organizacji.",
  },
  {
    id: "dashboard.recent_audits.subtitle",
    section: "Pulpit – Rejestr Badań",
    context: "Podtytuł sekcji tabeli ostatnich audytów",
    type: "Podtytuł sekcji",
    original: "Najnowsze badania przeprowadzone przez certyfikowanych audytorów",
    plainLanguageSuggestion: "Ostatnio zakończone i trwające badania serwisów banku",
    editorNotes: "Zwięzłe streszczenie zawartości tabeli.",
  },
  {
    id: "dashboard.recent_audits.btn_view_all",
    section: "Pulpit – Rejestr Badań",
    context: "Przycisk przejścia do pełnego katalogu audytów",
    type: "Przycisk",
    original: "Zobacz wszystkie audyty",
    plainLanguageSuggestion: "Zobacz wszystkie audyty",
    editorNotes: "Jasne polecenie nawigacyjne.",
  },

  // SEKCJA 5: Współpraca – Konsultacje z Audytorami
  {
    id: "dashboard.tickets.widget_title",
    section: "Pulpit – Konsultacje z Audytorami",
    context: "Tytuł lewego widgetu współpracy na pulpicie",
    type: "Tytuł widgetu",
    original: "Konsultacje z Audytorami",
    plainLanguageSuggestion: "Zapytaj audytora (Konsultacje)",
    editorNotes: "Zastąpienie formalnego tytułu zachętą do zadania pytania.",
  },
  {
    id: "dashboard.tickets.widget_badge",
    section: "Pulpit – Konsultacje z Audytorami",
    context: "Plakietka w nagłówku widgetu konsultacji",
    type: "Plakietka (Badge)",
    original: "Bez spotkań",
    plainLanguageSuggestion: "Bez umawiania spotkań",
    editorNotes: "Podkreślenie asynchronicznej formy kontaktu.",
  },
  {
    id: "dashboard.tickets.widget_desc",
    section: "Pulpit – Konsultacje z Audytorami",
    context: "Opis wyjaśniający działanie konsultacji",
    type: "Opis",
    original: "Szybkie zapytania techniczne deweloperów o wytyczne WCAG i rekomendacje fixów.",
    plainLanguageSuggestion: "Masz wątpliwości jak wdrożyć poprawkę? Zadaj pytanie ekspertowi WCAG bez planowania spotkań.",
    editorNotes: "Przyjazny, instruktażowy język bez slangu.",
  },
  {
    id: "dashboard.tickets.btn_new",
    section: "Pulpit – Konsultacje z Audytorami",
    context: "Niebieski przycisk otwarcia nowej konsultacji",
    type: "Przycisk",
    original: "+ Nowa konsultacja",
    plainLanguageSuggestion: "+ Zadaj pytanie audytorowi",
    editorNotes: "Konkretna akcja zachęcająca do kontaktu.",
  },
  {
    id: "dashboard.tickets.banner_new_reply",
    section: "Pulpit – Konsultacje z Audytorami",
    context: "Zielony baner informujący o odpowiedzi audytora",
    type: "Powiadomienie / Baner",
    original: "Nowa odpowiedź audytora w sprawie:",
    plainLanguageSuggestion: "Audytor odpowiedział w sprawie:",
    editorNotes: "Prosty komunikat o nowej wiadomości.",
  },

  // SEKCJA 6: Komunikaty, Szkolenia i Opiekun Klienta
  {
    id: "dashboard.announcements.widget_title",
    section: "Pulpit – Komunikaty & Nowości",
    context: "Tytuł prawego widgetu wiedzy i zdarzeń",
    type: "Tytuł widgetu",
    original: "Komunikaty i Wydarzenia",
    plainLanguageSuggestion: "Wiadomości i szkolenia",
    editorNotes: "Prostsze, przystępne określenie.",
  },
  {
    id: "dashboard.announcements.webinar_title",
    section: "Pulpit – Komunikaty & Nowości",
    context: "Tytuł zaproszenia na webinar ekspercki",
    type: "Nagłówek zdarzenia",
    original: "Webinar: Przygotowanie bankowości elektronicznej do wymogów EAA 2026",
    plainLanguageSuggestion: "Szkolenie online: Jak spełnić wymogi Europejskiego Aktu o Dostępności (EAA)",
    editorNotes: "Zastąpienie obcego słowa 'Webinar' określeniem 'Szkolenie online' i rozwinięcie skrótu EAA.",
  },
  {
    id: "dashboard.announcements.btn_register",
    section: "Pulpit – Komunikaty & Nowości",
    context: "Przycisk zapisu na szkolenie",
    type: "Przycisk",
    original: "Zapisz zespół",
    plainLanguageSuggestion: "Zapisz zespół na bezpłatne szkolenie",
    editorNotes: "Jasna zachęta do bezpłatnego podniesienia kompetencji zespołu.",
  },
  {
    id: "dashboard.vip.title",
    section: "Pulpit – Opiekun Klienta",
    context: "Tytuł karty dedykowanego kontaktu",
    type: "Tytuł karty",
    original: "Dedykowany Opiekun Klienta",
    plainLanguageSuggestion: "Twój opiekun w zespole audytorów",
    editorNotes: "Ciepłe, partnerskie określenie.",
  },
  {
    id: "dashboard.vip.name",
    section: "Pulpit – Opiekun Klienta",
    context: "Imię i nazwisko doradcy",
    type: "Dane osoby",
    original: "Tomasz Straszak",
    plainLanguageSuggestion: "Tomasz Straszak",
    editorNotes: "Pozostawić bez zmian.",
  },
  {
    id: "dashboard.vip.status_available",
    section: "Pulpit – Opiekun Klienta",
    context: "Zielony wskaźnik dostępności telefonicznej",
    type: "Status",
    original: "Dostępny teraz",
    plainLanguageSuggestion: "Możesz dzwonić teraz",
    editorNotes: "Potwierdzenie bieżącej gotowości do rozmowy.",
  },
  {
    id: "dashboard.vip.btn_call",
    section: "Pulpit – Opiekun Klienta",
    context: "Przycisk bezpośredniego połączenia telefonicznego",
    type: "Przycisk",
    original: "Zadzwoń teraz: 795 103 017",
    plainLanguageSuggestion: "Zadzwoń: 795 103 017",
    editorNotes: "Proste połączenie z numerem telefonu.",
  },
];

// ============================================================================
// 3. KATALOG FRAZ: MODUŁ AUDYTÓW (AUDYTY, PODSUMOWANIE, BŁĘDY, RE-AUDYT)
// ============================================================================
export const auditsPhrases = [
  // SEKCJA 1: Rejestr Audytów – Nagłówek i Metryki
  {
    id: "audits.list.header.title",
    section: "Audyty – Rejestr i Lista",
    context: "Główny nagłówek H1 modułu audytów",
    type: "Tytuł",
    original: "Audyty",
    plainLanguageSuggestion: "Audyty dostępności",
    editorNotes: "Warto doprecyzować 'Audyty dostępności', aby kontekst był natychmiast oczywisty.",
  },
  {
    id: "audits.list.header.subtitle",
    section: "Audyty – Rejestr i Lista",
    context: "Podtytuł informacyjny pod nagłówkiem",
    type: "Podtytuł",
    original: "Wykaz wszystkich badań dostępności cyfrowej przeprowadzonych dla serwisów i procesów organizacji.",
    plainLanguageSuggestion: "Przeglądaj raporty z badań stron, aplikacji i dokumentów banku pod kątem normy WCAG.",
    editorNotes: "Prostszy język: unikanie 'Wykazu wszystkich badań przeprowadzonych...'.",
  },
  {
    id: "audits.list.btn_order_audit",
    section: "Audyty – Rejestr i Lista",
    context: "Główny przycisk zlecenia nowego badania w nagłówku",
    type: "Przycisk",
    original: "Zleć nowy audyt",
    plainLanguageSuggestion: "Zamów nowy audyt",
    editorNotes: "Synonim prostego języka: 'Zamów nowy audyt' lub 'Zleć badanie'.",
  },
  {
    id: "audits.list.btn_export_all",
    section: "Audyty – Rejestr i Lista",
    context: "Przycisk eksportu rejestru badań do formatu Excel",
    type: "Przycisk",
    original: "Eksportuj do pliku Excel",
    plainLanguageSuggestion: "Pobierz arkusz Excel (.xlsx)",
    editorNotes: "Jasne wskazanie pliku i formatu do pobrania.",
  },

  // SEKCJA 2: Pasek Filtrów i Wyszukiwarka
  {
    id: "audits.filter.search_placeholder",
    section: "Audyty – Filtry i Wyszukiwarka",
    context: "Tekst podpowiedzi w polu wyszukiwania audytów",
    type: "Pole tekstowe (Placeholder)",
    original: "Szukaj audytu po nazwie usługi, procesie lub audytorze...",
    plainLanguageSuggestion: "Wpisz nazwę usługi, procesu lub nazwisko audytora...",
    editorNotes: "Instrukcja w trybie rozkazującym wskazująca, co można wpisać.",
  },
  {
    id: "audits.filter.pinned_only",
    section: "Audyty – Filtry i Wyszukiwarka",
    context: "Przycisk filtra obserwowanych audytów (z ikoną pineski)",
    type: "Przycisk filtra",
    original: "Obserwowane",
    plainLanguageSuggestion: "Tylko obserwowane",
    editorNotes: "Jasna informacja, że przycisk zawęża listę do badań oznaczonych pineską.",
  },
  {
    id: "audits.filter.pinned_only_tooltip",
    section: "Audyty – Filtry i Wyszukiwarka",
    context: "Dymek przycisku filtra obserwowanych",
    type: "Dymek (Tooltip)",
    original: "Pokaż tylko przypięte / obserwowane audyty",
    plainLanguageSuggestion: "Wyświetl wyłącznie audyty przypięte do obserwowanych",
    editorNotes: "Wyjaśnienie działania filtru.",
  },
  {
    id: "audits.filter.channel_label",
    section: "Audyty – Filtry i Wyszukiwarka",
    context: "Przycisk rozwijanego menu wyboru kanałów",
    type: "Przycisk menu",
    original: "Kanał",
    plainLanguageSuggestion: "Kanał dostępu",
    editorNotes: "Można doprecyzować do 'Kanał dostępu' (Desktop, iOS, Android, Dokument).",
  },
  {
    id: "audits.filter.status_label",
    section: "Audyty – Filtry i Wyszukiwarka",
    context: "Przycisk menu statusów audytu",
    type: "Przycisk menu",
    original: "Status",
    plainLanguageSuggestion: "Status badania",
    editorNotes: "Wskazuje etap audytu (Zakończony, W trakcie, Nowy).",
  },
  {
    id: "audits.filter.auditor_label",
    section: "Audyty – Filtry i Wyszukiwarka",
    context: "Przycisk menu wyboru audytora prowadzącego",
    type: "Przycisk menu",
    original: "Audytor",
    plainLanguageSuggestion: "Audytor prowadzący",
    editorNotes: "Pozwala filtrować badania wykonane przez konkretnego eksperta.",
  },
  {
    id: "audits.filter.time_label",
    section: "Audyty – Filtry i Wyszukiwarka",
    context: "Przycisk menu wyboru przedziału czasowego",
    type: "Przycisk menu",
    original: "Czas",
    plainLanguageSuggestion: "Okres badania",
    editorNotes: "Bardziej precyzyjne sformułowanie niż pojedyncze słowo 'Czas'.",
  },
  {
    id: "audits.filter.clear_all",
    section: "Audyty – Filtry i Wyszukiwarka",
    context: "Przycisk wyczyszczenia aktywnych filtrów",
    type: "Przycisk akcji",
    original: "Wyczyść wszystkie filtry",
    plainLanguageSuggestion: "Wyczyść filtry",
    editorNotes: "Krótki, standardowy zwrot resetujący widok do pełnej listy.",
  },

  // SEKCJA 3: Lista Audytów – Układy, Kolumny i Kafelki
  {
    id: "audits.view_mode.table",
    section: "Audyty – Lista i Tabela",
    context: "Przycisk przełączenia na widok tabeli",
    type: "Przełącznik widoku",
    original: "Tabela",
    plainLanguageSuggestion: "Widok tabeli",
    editorNotes: "Zwięzłe określenie układu danych.",
  },
  {
    id: "audits.view_mode.grid",
    section: "Audyty – Lista i Tabela",
    context: "Przycisk przełączenia na widok kafelkowy",
    type: "Przełącznik widoku",
    original: "Kafelki",
    plainLanguageSuggestion: "Widok kafelków",
    editorNotes: "Zwięzłe określenie układu danych.",
  },
  {
    id: "audits.counter.summary",
    section: "Audyty – Lista i Tabela",
    context: "Pasek informujący o liczbie znalezionych badań",
    type: "Licznik",
    original: "Wyniki: {count} z {total} audytów",
    plainLanguageSuggestion: "Wyświetlanie: {count} z {total} audytów",
    editorNotes: "Prosty licznik wyników wyszukiwania.",
  },
  {
    id: "audits.table.col_pin_aria",
    section: "Audyty – Lista i Tabela",
    context: "Etykieta przycisku pineski dla czytników ekranu",
    type: "Dostępność (Aria)",
    original: "Przypnij audyt do obserwowanych (ulubione)",
    plainLanguageSuggestion: "Dodaj audyt do listy obserwowanych",
    editorNotes: "Jasna informacja o akcji przypięcia.",
  },
  {
    id: "audits.table.col_unpin_aria",
    section: "Audyty – Lista i Tabela",
    context: "Etykieta odpięcia pineski",
    type: "Dostępność (Aria)",
    original: "Odepnij audyt z obserwowanych",
    plainLanguageSuggestion: "Usuń audyt z listy obserwowanych",
    editorNotes: "Jasna informacja o wyłączeniu obserwowania.",
  },
  {
    id: "audits.table.col_title",
    section: "Audyty – Lista i Tabela",
    context: "Nagłówek kolumny tytułu audytu",
    type: "Nagłówek kolumny",
    original: "Nazwa audytu i zakres",
    plainLanguageSuggestion: "Badana usługa lub proces",
    editorNotes: "Wskazuje, jaki element banku był poddany weryfikacji.",
  },
  {
    id: "audits.table.col_date",
    section: "Audyty – Lista i Tabela",
    context: "Nagłówek kolumny daty",
    type: "Nagłówek kolumny",
    original: "Data zakończenia",
    plainLanguageSuggestion: "Data badania",
    editorNotes: "Wskazuje termin ukończenia weryfikacji.",
  },
  {
    id: "audits.table.col_devices",
    section: "Audyty – Lista i Tabela",
    context: "Nagłówek kolumny urządzeń / kanałów",
    type: "Nagłówek kolumny",
    original: "Kanały i urządzenia",
    plainLanguageSuggestion: "Kanał dostępu",
    editorNotes: "Wskazuje: Desktop, iOS, Android lub Dokument.",
  },
  {
    id: "audits.table.col_auditor",
    section: "Audyty – Lista i Tabela",
    context: "Nagłówek kolumny audytora",
    type: "Nagłówek kolumny",
    original: "Audytor prowadzący",
    plainLanguageSuggestion: "Audytor",
    editorNotes: "Imię i nazwisko certyfikowanego eksperta.",
  },
  {
    id: "audits.table.col_priorities",
    section: "Audyty – Lista i Tabela",
    context: "Nagłówek kolumny triady priorytetów",
    type: "Nagłówek kolumny",
    original: "Priorytety błędów",
    plainLanguageSuggestion: "Otwarte błędy (K / W / M)",
    editorNotes: "Podział na błędy Krytyczne, Ważne i Marginalne.",
  },
  {
    id: "audits.table.col_score",
    section: "Audyty – Lista i Tabela",
    context: "Nagłówek kolumny wyniku punktowego",
    type: "Nagłówek kolumny",
    original: "Zgodność z WCAG",
    plainLanguageSuggestion: "Wynik zgodności (%)",
    editorNotes: "Ocena procentowa spełnienia badanych kryteriów.",
  },
  {
    id: "audits.table.action_details",
    section: "Audyty – Lista i Tabela",
    context: "Przycisk otwarcia szczegółów w wierszu tabeli",
    type: "Przycisk akcji",
    original: "Szczegóły",
    plainLanguageSuggestion: "Otwórz raport",
    editorNotes: "Czasownikowe polecenie 'Otwórz raport' precyzyjniej określa dokąd trafi użytkownik.",
  },
  {
    id: "audits.empty.title",
    section: "Audyty – Lista i Tabela",
    context: "Tytuł pustego stanu (brak wyników wyszukiwania)",
    type: "Pusty stan (Empty State)",
    original: "Brak audytów spełniających kryteria",
    plainLanguageSuggestion: "Nie znaleźliśmy audytów o takich kryteriach",
    editorNotes: "Bezpośredni, przyjazny komunikat zamiast technicznego 'Brak audytów'.",
  },
  {
    id: "audits.empty.description",
    section: "Audyty – Lista i Tabela",
    context: "Opis pustego stanu",
    type: "Pusty stan (Empty State)",
    original: "Żaden audyt nie pasuje do wpisanej frazy lub wybranych filtrów. Zresetuj filtry, aby wyświetlić pełny wykaz.",
    plainLanguageSuggestion: "Zmień wpisaną frazę w wyszukiwarce lub wyczyść filtry, aby zobaczyć całą listę badań.",
    editorNotes: "Jasna wskazówka co zrobić, by odzyskać listę.",
  },

  // SEKCJA 4: Podsumowanie Audytu (ReportSummaryView)
  {
    id: "audit_summary.header.back",
    section: "Audyt – Podsumowanie Badania",
    context: "Przycisk powrotu w lewym górnym rogu",
    type: "Przycisk powrotu",
    original: "Wróć do listy audytów",
    plainLanguageSuggestion: "Wróć do listy audytów",
    editorNotes: "Bezpieczna nawigacja powrotna.",
  },
  {
    id: "audit_summary.header.badge_wcag",
    section: "Audyt – Podsumowanie Badania",
    context: "Plakietka poziomu normy pod tytułem",
    type: "Plakietka (Badge)",
    original: "WCAG 2.1 Poziom AA",
    plainLanguageSuggestion: "Standard WCAG 2.1 AA",
    editorNotes: "Oficjalny poziom badanej normy.",
  },
  {
    id: "audit_summary.header.btn_pin",
    section: "Audyt – Podsumowanie Badania",
    context: "Przycisk przypięcia audytu w nagłówku szczegółów",
    type: "Przycisk akcji",
    original: "Przypnij audyt",
    plainLanguageSuggestion: "Dodaj do obserwowanych",
    editorNotes: "Wyjaśnienie, że audyt trafi do obserwowanych.",
  },
  {
    id: "audit_summary.header.btn_pinned_active",
    section: "Audyt – Podsumowanie Badania",
    context: "Stan aktywny przycisku przypięcia",
    type: "Przycisk akcji",
    original: "Obserwowany",
    plainLanguageSuggestion: "Obserwujesz ten audyt",
    editorNotes: "Potwierdzenie, że badanie jest na liście obserwowanych.",
  },
  {
    id: "audit_summary.header.btn_reaudit",
    section: "Audyt – Podsumowanie Badania",
    context: "Główny niebieski przycisk w nagłówku szczegółów",
    type: "Przycisk akcji",
    original: "Zleć re-audyt",
    plainLanguageSuggestion: "Zleć weryfikację poprawek",
    editorNotes: "W prostym języku pojęcie 're-audyt' warto objaśnić jako 'weryfikację wprowadzonych poprawek'.",
  },
  {
    id: "audit_summary.header.btn_pdf",
    section: "Audyt – Podsumowanie Badania",
    context: "Przycisk pobrania raportu PDF",
    type: "Przycisk akcji",
    original: "Pobierz raport (.pdf)",
    plainLanguageSuggestion: "Pobierz raport PDF",
    editorNotes: "Pobranie oficjalnego raportu audytowego.",
  },
  {
    id: "audit_summary.header.btn_xlsx",
    section: "Audyt – Podsumowanie Badania",
    context: "Przycisk eksportu arkusza Excel",
    type: "Przycisk akcji",
    original: "Eksport (.xlsx)",
    plainLanguageSuggestion: "Pobierz arkusz Excel (.xlsx)",
    editorNotes: "Pobranie szczegółowych metryk z kryteriami sukcesu.",
  },

  // KPI Podsumowania
  {
    id: "audit_summary.kpi.overall_score",
    section: "Audyt – Podsumowanie Badania",
    context: "Tytuł 1. karty metryki (wynik ogólny)",
    type: "Etykieta wskaźnika",
    original: "Wynik ogólny",
    plainLanguageSuggestion: "Ogólna dostępność",
    editorNotes: "Średni wskaźnik spełnienia kryteriów w tym audycie.",
  },
  {
    id: "audit_summary.kpi.critical_errors",
    section: "Audyt – Podsumowanie Badania",
    context: "Tytuł 2. karty metryki (błędy priorytetowe)",
    type: "Etykieta wskaźnika",
    original: "Priorytetowe",
    plainLanguageSuggestion: "Błędy krytyczne (blokujące)",
    editorNotes: "Bariery całkowicie uniemożliwiające załatwienie sprawy przez klienta z niepełnosprawnością.",
  },
  {
    id: "audit_summary.kpi.important_errors",
    section: "Audyt – Podsumowanie Badania",
    context: "Tytuł 3. karty metryki (błędy ważne)",
    type: "Etykieta wskaźnika",
    original: "Ważne",
    plainLanguageSuggestion: "Błędy ważne (utrudniające)",
    editorNotes: "Bariery powodujące znaczne trudności, ale możliwe do obejścia.",
  },
  {
    id: "audit_summary.kpi.marginal_errors",
    section: "Audyt – Podsumowanie Badania",
    context: "Tytuł 4. karty metryki (błędy marginalne)",
    type: "Etykieta wskaźnika",
    original: "Marginalne",
    plainLanguageSuggestion: "Drobne niedociągnięcia",
    editorNotes: "Drobne błędy semantyczne lub estetyczne o małym wpływie na użytkownika.",
  },

  // Lista zbadanych elementów
  {
    id: "audit_summary.views.title",
    section: "Audyt – Podsumowanie Badania",
    context: "Nagłówek sekcji zbadanych ekranów i podstron",
    type: "Tytuł sekcji",
    original: "Zbadane elementy / podstrony",
    plainLanguageSuggestion: "Zbadane ekrany i widoki",
    editorNotes: "Zamiast technicznego 'elementy' naturalny zwrot 'ekrany i widoki'.",
  },
  {
    id: "audit_summary.views.subtitle",
    section: "Audyt – Podsumowanie Badania",
    context: "Podtytuł sekcji zbadanych widoków",
    type: "Podtytuł sekcji",
    original: "Kliknij wybrany element, aby przejść do szczegółowej listy błędów, zrzutów ekranu i zaleceń audytora.",
    plainLanguageSuggestion: "Wybierz podstronę, aby zobaczyć zdiagnozowane usterki, zrzuty ekranu i instrukcje naprawy.",
    editorNotes: "Zachęta do przejścia do konkretnego ekranu.",
  },
  {
    id: "audit_summary.views.btn_view_errors",
    section: "Audyt – Podsumowanie Badania",
    context: "Przycisk otwarcia błędów na kafelku podstrony",
    type: "Przycisk akcji",
    original: "Przejdź do błędów",
    plainLanguageSuggestion: "Zobacz błędy",
    editorNotes: "Krótkie polecenie otwierające edytor usterek.",
  },

  // SEKCJA 5: Rejestr Błędów Podstrony (ReportErrorsView)
  {
    id: "audit_errors.header.back",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Przycisk powrotu do podsumowania audytu",
    type: "Przycisk powrotu",
    original: "Wróć do podsumowania",
    plainLanguageSuggestion: "Wróć do podsumowania audytu",
    editorNotes: "Precyzyjny odsyłacz powrotny.",
  },
  {
    id: "audit_errors.header.title",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Nagłówek widoku błędów konkretnego ekranu",
    type: "Tytuł",
    original: "Błędy na podstronie",
    plainLanguageSuggestion: "Wykaz błędów na tym ekranie",
    editorNotes: "Wskazuje usterki wykryte na badanej podstronie.",
  },
  {
    id: "audit_errors.filter.prio_critical",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Przycisk filtra błędów priorytetowych",
    type: "Przycisk filtra",
    original: "Priorytetowe",
    plainLanguageSuggestion: "Priorytetowe (blokady)",
    editorNotes: "Wyodrębnia naruszenia krytyczne.",
  },
  {
    id: "audit_errors.filter.prio_important",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Przycisk filtra błędów ważnych",
    type: "Przycisk filtra",
    original: "Ważne",
    plainLanguageSuggestion: "Ważne",
    editorNotes: "Wyodrębnia naruszenia stopnia drugiego.",
  },
  {
    id: "audit_errors.filter.prio_marginal",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Przycisk filtra błędów marginalnych",
    type: "Przycisk filtra",
    original: "Marginalne",
    plainLanguageSuggestion: "Marginalne (drobne)",
    editorNotes: "Wyodrębnia drobne usterki.",
  },
  {
    id: "audit_errors.filter.search_placeholder",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Pole wyszukiwania błędu lub numeru kryterium",
    type: "Pole tekstowe (Placeholder)",
    original: "Szukaj błędu, kryterium (np. 1.1.1) lub słowa kluczowego...",
    plainLanguageSuggestion: "Szukaj błędu, numeru kryterium (np. 1.4.3) lub słowa...",
    editorNotes: "Ułatwia wyszukiwanie konkretnej wytycznej WCAG.",
  },

  // Akordeon Usterki
  {
    id: "audit_errors.item.section_desc",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Etykieta sekcji opisu usterki w akordeonie",
    type: "Etykieta sekcji",
    original: "Opis problemu:",
    plainLanguageSuggestion: "Na czym polega błąd:",
    editorNotes: "Przystępne wyjaśnienie istoty bariery.",
  },
  {
    id: "audit_errors.item.section_impact",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Etykieta wpływu błędu na użytkowników z niepełnosprawnością",
    type: "Etykieta sekcji",
    original: "Wpływ na użytkownika:",
    plainLanguageSuggestion: "Jak błąd utrudnia korzystanie klientowi:",
    editorNotes: "Empatyczne wyjaśnienie perspektywy użytkownika czytnika ekranu lub klawiatury.",
  },
  {
    id: "audit_errors.item.section_recommendation",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Etykieta zaleceń naprawczych audytora",
    type: "Etykieta sekcji",
    original: "Rekomendacja audytora:",
    plainLanguageSuggestion: "Jak naprawić ten błąd:",
    editorNotes: "Konkretna, techniczna instrukcja dla programistów.",
  },
  {
    id: "audit_errors.item.jira_label",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Etykieta pola integracji z Jira",
    type: "Etykieta pola",
    original: "Zadanie w Jira:",
    plainLanguageSuggestion: "Numer zadania w Jira (np. ACC-104):",
    editorNotes: "Wskazuje pole do powiązania ze sprintem IT.",
  },
  {
    id: "audit_errors.item.btn_consult",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Przycisk konsultacji z audytorem na kafelku błędu",
    type: "Przycisk akcji",
    original: "Konsultuj z audytorem",
    plainLanguageSuggestion: "Zapytaj audytora o ten błąd",
    editorNotes: "Uruchamia wątek konsultacji automatycznie powiązany z danym błędem.",
  },
  {
    id: "audit_errors.item.screenshot_label",
    section: "Audyt – Rejestr Błędów Podstrony",
    context: "Podpis pod miniaturą zrzutu ekranu",
    type: "Podpis obrazu",
    original: "Kliknij, aby powiększyć zrzut ekranu (dowód)",
    plainLanguageSuggestion: "Kliknij miniaturę, aby powiększyć zrzut ekranu",
    editorNotes: "Informuje o podglądzie Lightbox w pełnej rozdzielczości.",
  },

  // SEKCJA 6: Modal Zlecenia Re-audytu (ReauditRequestModal)
  {
    id: "reaudit_modal.title",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Tytuł okna modalnego zlecenia re-audytu",
    type: "Tytuł modalu",
    original: "Zleć re-audyt powdrożeniowy",
    plainLanguageSuggestion: "Zleć weryfikację wprowadzonych poprawek",
    editorNotes: "W prostym języku warto zastąpić techniczne 're-audyt' jasnym pojęciem 'weryfikacji poprawek'.",
  },
  {
    id: "reaudit_modal.target_label",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Pole informujące o weryfikowanej usłudze",
    type: "Etykieta pola",
    original: "Badany proces / audyt:",
    plainLanguageSuggestion: "Weryfikowana usługa lub proces:",
    editorNotes: "Wskazuje zakres weryfikacji powdrożeniowej.",
  },
  {
    id: "reaudit_modal.auditor_label",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Pole przypisanego eksperta",
    type: "Etykieta pola",
    original: "Dedykowany audytor:",
    plainLanguageSuggestion: "Audytor prowadzący badanie:",
    editorNotes: "Nazwisko eksperta odpowiedzialnego za weryfikację.",
  },
  {
    id: "reaudit_modal.speed_label",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Wybór oczekiwanego terminu realizacji",
    type: "Etykieta grupy opcji",
    original: "Oczekiwany czas realizacji weryfikacji:",
    plainLanguageSuggestion: "Kiedy potrzebujesz wyników weryfikacji:",
    editorNotes: "Proste pytanie do zamawiającego.",
  },
  {
    id: "reaudit_modal.speed_standard",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Opcja 1: tryb standardowy",
    type: "Opcja wyboru",
    original: "Standard (do 5 dni roboczych) - w ramach pakietu",
    plainLanguageSuggestion: "Standardowy (do 5 dni roboczych) – w cenie pakietu",
    editorNotes: "Standardowy czas audytu weryfikacyjnego.",
  },
  {
    id: "reaudit_modal.speed_express",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Opcja 2: tryb ekspresowy",
    type: "Opcja wyboru",
    original: "Ekspres (do 48h) - pilne wydanie produkcyjne",
    plainLanguageSuggestion: "Ekspresowy (do 48 godzin) – pilne wdrożenie",
    editorNotes: "Tryb przyspieszony dla zespołów sprintowych.",
  },
  {
    id: "reaudit_modal.staging_url_label",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Etykieta pola adresu środowiska testowego",
    type: "Etykieta pola",
    original: "Adres środowiska testowego / staging (opcjonalnie):",
    plainLanguageSuggestion: "Adres strony testowej lub wersji staging (opcjonalnie):",
    editorNotes: "Wskazuje programistom, gdzie audytor ma sprawdzić poprawki.",
  },
  {
    id: "reaudit_modal.comment_label",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Etykieta pola dodatkowego komentarza",
    type: "Etykieta pola",
    original: "Dodatkowy komentarz lub zakres weryfikacji:",
    plainLanguageSuggestion: "Dodatkowe uwagi dla audytora:",
    editorNotes: "Miejsce na uwagi, numery zadań w Jira lub branch GIT.",
  },
  {
    id: "reaudit_modal.comment_placeholder",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Tekst podpowiedzi w polu komentarza",
    type: "Tekst podpowiedzi",
    original: "Wpisz dodatkowe uwagi, zakres wprowadzonych zmian, branch w repozytorium lub dane logowania testowego...",
    plainLanguageSuggestion: "Opisz krótko wprowadzone poprawki, podaj nazwę gałęzi w GIT lub dane konta testowego...",
    editorNotes: "Praktyczne przykłady tego, co warto przekazać audytorowi.",
  },
  {
    id: "reaudit_modal.notify_team_checkbox",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Pole wyboru powiadomienia zespołu deweloperskiego",
    type: "Pole wyboru",
    original: "Powiadom zespół deweloperski o zleceniu re-audytu (e-mail + powiadomienie w systemie)",
    plainLanguageSuggestion: "Wyślij powiadomienie do zespołu programistów o zleceniu weryfikacji",
    editorNotes: "Zapewnia transparentność wdrożenia w organizacji.",
  },
  {
    id: "reaudit_modal.consultation_checkbox",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Pole wyboru krótkiego omówienia wyników",
    type: "Pole wyboru",
    original: "Poproś o krótkie 15-minutowe omówienie wyników z audytorem po weryfikacji",
    plainLanguageSuggestion: "Poproś o 15-minutowe spotkanie online z audytorem po zakończeniu weryfikacji",
    editorNotes: "Opcjonalna odprawa poaudytowa.",
  },
  {
    id: "reaudit_modal.btn_cancel",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Przycisk anulowania zlecenia w modalu",
    type: "Przycisk",
    original: "Anuluj",
    plainLanguageSuggestion: "Anuluj",
    editorNotes: "Zamknięcie okna bez wysyłania zlecenia.",
  },
  {
    id: "reaudit_modal.btn_submit",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Przycisk potwierdzenia zlecenia re-audytu",
    type: "Przycisk",
    original: "Wyślij zlecenie re-audytu",
    plainLanguageSuggestion: "Zleć weryfikację poprawek",
    editorNotes: "Jasne potwierdzenie wysłania zlecenia do zespołu audytorów.",
  },
  {
    id: "reaudit_modal.toast_title",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Tytuł powiadomienia Toast po wysłaniu zlecenia",
    type: "Powiadomienie (Toast)",
    original: "Zlecenie re-audytu wysłane",
    plainLanguageSuggestion: "Zlecenie weryfikacji zostało wysłane",
    editorNotes: "Potwierdzenie przyjęcia zgłoszenia przez system.",
  },
  {
    id: "reaudit_modal.toast_desc",
    section: "Audyt – Zlecenie Weryfikacji (Modal Re-audytu)",
    context: "Treść powiadomienia Toast po wysłaniu zlecenia",
    type: "Powiadomienie (Toast)",
    original: "Zlecenie re-audytu dla \"{title}\" zostało przekazane do audytora Piotra Smułkowskiego. Potwierdzenie terminu w ciągu 2h.",
    plainLanguageSuggestion: "Zlecenie weryfikacji dla \"{title}\" trafiło do audytora Piotra Smułkowskiego. Potwierdzenie terminu otrzymasz w ciągu 2 godzin.",
    editorNotes: "Rozwinięcie skrótu '2h' na '2 godzin'.",
  },
];

// ============================================================================
// FUNKCJE GENERUJĄCE PLIKI TXT, JSON I CSV
// ============================================================================

function generateTxtFile(catalog, filename, title) {
  const txtPath = path.join(exportsDir, filename);
  let content = "";

  content += "================================================================================\n";
  content += `              W-ALLY: ${title.toUpperCase()} (DO REDAKCJI PROSTEGO JĘZYKA)        \n`;
  content += "================================================================================\n";
  content += `Data wygenerowania: ${new Date().toLocaleString("pl-PL")}\n`;
  content += `Łączna liczba fraz: ${catalog.length}\n`;
  content += "\n";
  content += "INSTRUKCJA DLA REDAKTORA PROSTEGO JĘZYKA:\n";
  content += "1. Każda fraza posiada swój unikalny identyfikator [ID], kontekst występowania oraz [TYP].\n";
  content += "2. Pole [ORYGINALNY TEKST] zawiera obecne brzmienie w aplikacji.\n";
  content += "3. Wpisz swoją zredagowaną propozycję w linii [PROSTY JĘZYK: ...].\n";
  content += "4. Nie zmieniaj identyfikatorów [ID], aby plik mógł zostać automatycznie zaimportowany do kodu!\n";
  content += "5. Zasady prostego języka: krótkie zdania, strona czynna, brak żargonu, zrozumiałe skróty.\n";
  content += "================================================================================\n\n";

  let currentSection = "";

  for (const item of catalog) {
    if (item.section !== currentSection) {
      currentSection = item.section;
      content += `\n################################################################################\n`;
      content += `### SEKCJA: ${currentSection.toUpperCase()}\n`;
      content += `################################################################################\n\n`;
    }

    content += `--------------------------------------------------------------------------------\n`;
    content += `ID: ${item.id}\n`;
    content += `Lokalizacja: ${item.context}\n`;
    content += `Typ elementu: ${item.type}\n`;
    content += `ORYGINALNY TEKST:\n${item.original}\n\n`;
    content += `PROSTY JĘZYK (PO REDAKCJI):\n${item.plainLanguageSuggestion || item.original}\n\n`;
    content += `Wskazówka redakcyjna:\n${item.editorNotes}\n`;
  }

  content += `\n================================================================================\n`;
  content += `KONIEC PLIKU - ŁĄCZNIE ${catalog.length} POZYCJI\n`;
  content += `================================================================================\n`;

  fs.writeFileSync(txtPath, content, "utf-8");
  console.log(`[TXT] Wygenerowano: ${txtPath} (${catalog.length} fraz)`);
}

function generateJsonFile(catalog, filename, title) {
  const jsonPath = path.join(exportsDir, filename);
  const data = {
    metadata: {
      title,
      generatedAt: new Date().toISOString(),
      totalPhrases: catalog.length,
      instructions: "Edytuj pole 'plainLanguage' dla każdej frazy. Nie zmieniaj wartości 'id'.",
    },
    items: catalog.map((item) => ({
      id: item.id,
      section: item.section,
      context: item.context,
      type: item.type,
      original: item.original,
      plainLanguage: item.plainLanguageSuggestion || item.original,
      editorNotes: item.editorNotes,
    })),
  };
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`[JSON] Wygenerowano: ${jsonPath}`);
}

function generateCsvFile(catalog, filename) {
  const csvPath = path.join(exportsDir, filename);
  const headers = [
    "ID",
    "Sekcja",
    "Lokalizacja_Kontekst",
    "Typ_Elementu",
    "Oryginalny_Tekst",
    "Prosty_Jezyk_Propozycja",
    "Wskazowki_Dla_Redaktora",
  ];

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = catalog.map((item) => [
    escapeCsv(item.id),
    escapeCsv(item.section),
    escapeCsv(item.context),
    escapeCsv(item.type),
    escapeCsv(item.original),
    escapeCsv(item.plainLanguageSuggestion || item.original),
    escapeCsv(item.editorNotes),
  ]);

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
  fs.writeFileSync(csvPath, csvContent, "utf-8");
  console.log(`[CSV] Wygenerowano: ${csvPath}`);
}

// ============================================================================
// GŁÓWNA PROCEDURA URUCHOMIENIOWA
// ============================================================================
export function generateAllExports() {
  console.log("================================================================================");
  console.log("   GENEROWANIE PLIKÓW EKSPORTU DLA REDAKCJI PROSTEGO JĘZYKA (W-ALLY)");
  console.log("================================================================================");

  // 1. Pulpit (Dashboard)
  generateTxtFile(dashboardPhrases, "frazy_pulpit_redakcja.txt", "FRAZY PULPITU GŁÓWNEGO");
  generateJsonFile(dashboardPhrases, "frazy_pulpit_dane.json", "Frazy Pulpitu Głównego");
  generateCsvFile(dashboardPhrases, "frazy_pulpit_tabela.csv");

  // 2. Strona logowania (Login View)
  generateTxtFile(loginPhrases, "frazy_logowanie_redakcja.txt", "FRAZY STRONY LOGOWANIA");
  generateJsonFile(loginPhrases, "frazy_logowanie_dane.json", "Frazy Strony Logowania");
  generateCsvFile(loginPhrases, "frazy_logowanie_tabela.csv");

  // 3. Audyty (Audits Module)
  generateTxtFile(auditsPhrases, "frazy_audyty_redakcja.txt", "FRAZY MODUŁU AUDYTÓW");
  generateJsonFile(auditsPhrases, "frazy_audyty_dane.json", "Frazy Modułu Audytów");
  generateCsvFile(auditsPhrases, "frazy_audyty_tabela.csv");

  console.log("================================================================================");
  console.log("Pomyślnie wygenerowano wszystkie pliki w katalogu exports/ !");
  console.log("  - Pulpit:          exports/frazy_pulpit_redakcja.txt");
  console.log("  - Strona logowania: exports/frazy_logowanie_redakcja.txt");
  console.log("  - Audyty:          exports/frazy_audyty_redakcja.txt");
  console.log("================================================================================");
}

// Uruchomienie bezpośrednie
if (process.argv[1] && process.argv[1].endsWith("generate_exports_pulpit_login_audits.js")) {
  generateAllExports();
}
