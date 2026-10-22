import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
} from "docx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const exportsDir = path.join(projectRoot, "exports");

if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// ==========================================
// BAZA FRAZ: MENU ORAZ PULPIT (DASHBOARD) WRAZ Z TOOLTIPAMI
// ==========================================

export const phrasesCatalog = [
  // -------------------------------------------------------------
  // SEKCJA 1: Nawigacja górna (Menu główne, Profil, Powiadomienia, Pomoc)
  // -------------------------------------------------------------
  {
    id: "nav.brand.name",
    section: "Nawigacja górna",
    context: "Logo / Brand w nagłówku po lewej stronie",
    type: "Etykieta",
    original: "W-ally",
    plainLanguageSuggestion: "W-ally",
    editorNotes: "Nazwa własna systemu WCAG Auditor / W-ally. Pozostawić bez zmian lub dostosować zapis.",
  },
  {
    id: "nav.menu.dashboard",
    section: "Nawigacja górna",
    context: "Pasek menu głównego (desktop i mobile) - Pozycja 1",
    type: "Etykieta menu",
    original: "Pulpit",
    plainLanguageSuggestion: "Pulpit",
    editorNotes: "Główny ekran przeglądowy. Alternatywy prostego języka: 'Start', 'Przegląd', 'Pulpit'.",
  },
  {
    id: "nav.menu.audits",
    section: "Nawigacja górna",
    context: "Pasek menu głównego - Pozycja 2",
    type: "Etykieta menu",
    original: "Audyty",
    plainLanguageSuggestion: "Audyty",
    editorNotes: "Lista formalnych badań dostępności cyfrowej. Zrozumiałe, jasne.",
  },
  {
    id: "nav.menu.services",
    section: "Nawigacja górna",
    context: "Pasek menu głównego - Pozycja 3",
    type: "Etykieta menu",
    original: "Baza Usług",
    plainLanguageSuggestion: "Katalog Usług",
    editorNotes: "Inwentaryzacja serwisów, systemów i procesów. Alternatywa: 'Usługi' lub 'Katalog usług'.",
  },
  {
    id: "nav.menu.reporting",
    section: "Nawigacja górna",
    context: "Pasek menu głównego - Pozycja 4",
    type: "Etykieta menu",
    original: "Raportowanie",
    plainLanguageSuggestion: "Raporty",
    editorNotes: "Rzeczownik odczasownikowy 'Raportowanie' można uprościć do 'Raporty'.",
  },
  {
    id: "nav.menu.complaints",
    section: "Nawigacja górna",
    context: "Pasek menu głównego - Pozycja 5",
    type: "Etykieta menu",
    original: "Skargi i reklamacje",
    plainLanguageSuggestion: "Zgłoszenia barier",
    editorNotes: "Prawnicze określenie. W prostym języku często: 'Zgłoszenia problemów' lub 'Skargi i wnioski'.",
  },
  {
    id: "nav.help.button",
    section: "Nawigacja górna",
    context: "Przycisk Pomoc w belce górnej",
    type: "Przycisk",
    original: "Pomoc",
    plainLanguageSuggestion: "Pomoc",
    editorNotes: "Krótkie, jasne słowo.",
  },
  {
    id: "nav.help.tooltip",
    section: "Nawigacja górna",
    context: "Atrybut title dla przycisku Pomoc",
    type: "Dymek (Tooltip)",
    original: "Pomoc",
    plainLanguageSuggestion: "Otwórz pomoc i instrukcje",
    editorNotes: "Wskazane doprecyzowanie, co robi przycisk po najechaniu myszą.",
  },
  {
    id: "nav.help.aria_label",
    section: "Nawigacja górna",
    context: "Etykieta aria-label przycisku Pomoc dla czytników ekranu",
    type: "Dostępność (Aria)",
    original: "Pomoc",
    plainLanguageSuggestion: "Otwórz okno pomocy i przewodnik",
    editorNotes: "Ułatwienie dla użytkowników niewidomych korzystających ze screenreadera.",
  },
  {
    id: "nav.tickets.title",
    section: "Nawigacja górna",
    context: "Przycisk ikony czatu z audytorami - atrybut title",
    type: "Dymek (Tooltip)",
    original: "Konsultacje",
    plainLanguageSuggestion: "Zapytaj audytora (konsultacje)",
    editorNotes: "Wyjaśnienie, że chodzi o bezpośredni kontakt merytoryczny z audytorem.",
  },
  {
    id: "nav.tickets.aria_label",
    section: "Nawigacja górna",
    context: "Przycisk czatu - etykieta aria-label",
    type: "Dostępność (Aria)",
    original: "Konsultacje z audytorami",
    plainLanguageSuggestion: "Konsultacje z zespołem audytorów",
    editorNotes: "Jasna informacja o przeznaczeniu przycisku.",
  },
  {
    id: "nav.notifications.title",
    section: "Nawigacja górna",
    context: "Przycisk ikony dzwonka - atrybut title",
    type: "Dymek (Tooltip)",
    original: "Powiadomienia: Odpowiedzi audytorów oraz Komunikaty",
    plainLanguageSuggestion: "Powiadomienia i wiadomości od audytorów",
    editorNotes: "Uproszczenie nazwy dymka powiadomień.",
  },
  {
    id: "nav.notifications.aria_label",
    section: "Nawigacja górna",
    context: "Przycisk ikony dzwonka - aria-label",
    type: "Dostępność (Aria)",
    original: "Otwórz menu powiadomień i komunikatów",
    plainLanguageSuggestion: "Otwórz listę powiadomień",
    editorNotes: "Krótka, jednoznaczna instrukcja działania.",
  },
  {
    id: "nav.profile.role",
    section: "Nawigacja górna",
    context: "Podpis pod nazwiskiem w menu profilu",
    type: "Etykieta",
    original: "Koordynator Dostępności",
    plainLanguageSuggestion: "Koordynator ds. dostępności",
    editorNotes: "Nazwa roli / uprawnień zalogowanego użytkownika.",
  },
  {
    id: "nav.profile.my_profile",
    section: "Nawigacja górna",
    context: "Rozwijane menu profilu użytkownika - Pozycja 1",
    type: "Pozycja menu",
    original: "Mój profil",
    plainLanguageSuggestion: "Twój profil",
    editorNotes: "Możliwość ujednolicenia do zwrotu bezpośredniego 'Twój profil' lub zachowania 'Mój profil'.",
  },
  {
    id: "nav.profile.logout",
    section: "Nawigacja górna",
    context: "Rozwijane menu profilu użytkownika - Pozycja 2",
    type: "Pozycja menu",
    original: "Wyloguj się",
    plainLanguageSuggestion: "Wyloguj się",
    editorNotes: "Jasne polecenie w trybie rozkazującym.",
  },
  {
    id: "nav.mobile.help_subtitle",
    section: "Nawigacja górna",
    context: "Podpis pod przyciskiem Pomoc w menu mobilnym",
    type: "Podtytuł",
    original: "Instrukcje & FAQ",
    plainLanguageSuggestion: "Instrukcje i częste pytania",
    editorNotes: "Zastąpienie angielskiego akronimu 'FAQ' oraz znaku '&' polskim 'i częste pytania'.",
  },
  {
    id: "nav.mobile.announcements_label",
    section: "Nawigacja górna",
    context: "Pozycja menu mobilnego",
    type: "Pozycja menu",
    original: "Komunikaty i Oferty",
    plainLanguageSuggestion: "Komunikaty i nowości",
    editorNotes: "Słowo 'Oferty' może brzmieć zbyt handlowo; 'nowości' brzmi bardziej przyjaźnie.",
  },
  {
    id: "nav.dropdown.tab_tickets",
    section: "Nawigacja górna",
    context: "Nagłówek zakładki w rozwijanym panelu powiadomień",
    type: "Nagłówek",
    original: "Wątki konsultacyjne z audytorami",
    plainLanguageSuggestion: "Rozmowy z audytorami",
    editorNotes: "Uproszczenie 'Wątki konsultacyjne' na prostsze 'Rozmowy z audytorami'.",
  },
  {
    id: "nav.dropdown.badge_action_required",
    section: "Nawigacja górna",
    context: "Pigułka statusowa w panelu powiadomień",
    type: "Etykieta",
    original: "Wymaga Twojej reakcji",
    plainLanguageSuggestion: "Czeka na Twoją odpowiedź",
    editorNotes: "Bardziej bezpośrednie i precyzyjne sformułowanie.",
  },
  {
    id: "nav.dropdown.badge_new_reply",
    section: "Nawigacja górna",
    context: "Etykieta przy nowej wypowiedzi w dymku",
    type: "Etykieta",
    original: "Nowa odpowiedź",
    plainLanguageSuggestion: "Nowa odpowiedź",
    editorNotes: "Zrozumiałe, jasne.",
  },
  {
    id: "nav.dropdown.open_ticket_link",
    section: "Nawigacja górna",
    context: "Link otwarcia czatu w powiadomieniu",
    type: "Link / Akcja",
    original: "Otwórz rozmowę w tickecie",
    plainLanguageSuggestion: "Przejdź do rozmowy",
    editorNotes: "Usunięcie żargonowego anglicyzmu 'w tickecie'.",
  },
  {
    id: "nav.dropdown.context_prefix",
    section: "Nawigacja górna",
    context: "Podpis kontekstu zgłoszenia w dymku",
    type: "Etykieta",
    original: "Dotyczy: {contextId}",
    plainLanguageSuggestion: "Dotyczy: {contextId}",
    editorNotes: "Krótka informacja o powiązanym audycie lub procesie.",
  },
  {
    id: "nav.dropdown.all_tickets_btn",
    section: "Nawigacja górna",
    context: "Przycisk na dole panelu konsultacji",
    type: "Przycisk",
    original: "Wszystkie konsultacje ({count})",
    plainLanguageSuggestion: "Zobacz wszystkie konsultacje ({count})",
    editorNotes: "Dodanie czasownika ułatwia zrozumienie akcji.",
  },
  {
    id: "nav.dropdown.tab_announcements",
    section: "Nawigacja górna",
    context: "Nagłówek zakładki komunikatów w dymku powiadomień",
    type: "Nagłówek",
    original: "Nowości systemowe i webinary",
    plainLanguageSuggestion: "Nowości i szkolenia",
    editorNotes: "Zamiast obcego słowa 'webinary' można użyć 'szkolenia' lub 'spotkania online'.",
  },
  {
    id: "nav.dropdown.mark_read_btn",
    section: "Nawigacja górna",
    context: "Przycisk oznaczania powiadomień w dymku",
    type: "Przycisk",
    original: "Oznacz przeczytane",
    plainLanguageSuggestion: "Oznacz wszystkie jako przeczytane",
    editorNotes: "Poprawa gramatyczna i pełniejsze zdanie.",
  },
  {
    id: "nav.dropdown.click_to_read",
    section: "Nawigacja górna",
    context: "Wskazówka na kafelku nieprzeczytanego komunikatu",
    type: "Podpowiedź",
    original: "Kliknij, by odczytać",
    plainLanguageSuggestion: "Kliknij, aby przeczytać",
    editorNotes: "Naturalniejsza forma w języku polskim.",
  },
  {
    id: "nav.dropdown.all_announcements_btn",
    section: "Nawigacja górna",
    context: "Przycisk na dole zakładki komunikatów",
    type: "Przycisk",
    original: "Zobacz wszystkie komunikaty ({count})",
    plainLanguageSuggestion: "Zobacz wszystkie komunikaty ({count})",
    editorNotes: "Prawidłowe wezwanie do działania.",
  },

  // -------------------------------------------------------------
  // SEKCJA 2: Pulpit – Nagłówek i akcje główne
  // -------------------------------------------------------------
  {
    id: "dashboard.header.breadcrumb",
    section: "Pulpit – Nagłówek",
    context: "Ścieżka powrotna (okruszki / breadcrumbs) nad tytułem",
    type: "Nawigacja",
    original: "Pulpit",
    plainLanguageSuggestion: "Pulpit",
    editorNotes: "Wskazuje aktualne miejsce w strukturze serwisu.",
  },
  {
    id: "dashboard.header.title",
    section: "Pulpit – Nagłówek",
    context: "Główny nagłówek H1 na pulpicie",
    type: "Tytuł",
    original: "Witaj, Kinga",
    plainLanguageSuggestion: "Witaj, Kinga",
    editorNotes: "Bezpośrednie, przyjazne powitanie użytkownika.",
  },
  {
    id: "dashboard.header.subtitle",
    section: "Pulpit – Nagłówek",
    context: "Podtytuł wprowadzający pod nagłówkiem H1",
    type: "Podtytuł",
    original: "Oto aktualny stan dostępności cyfrowej i wskaźniki zgodności WCAG 2.1 AA w Twojej organizacji.",
    plainLanguageSuggestion: "Sprawdź aktualny poziom dostępności cyfrowej i zgodności z normą WCAG w Twojej organizacji.",
    editorNotes: "Uproszczenie zdania, zastąpienie 'Oto...' aktywnym zwrotem 'Sprawdź...'.",
  },
  {
    id: "dashboard.header.btn_reporting",
    section: "Pulpit – Nagłówek",
    context: "Przycisk akcji w nagłówku - po prawej stronie",
    type: "Przycisk",
    original: "Raportowanie",
    plainLanguageSuggestion: "Przejdź do raportów",
    editorNotes: "Zastąpienie rzeczownika 'Raportowanie' jasnym poleceniem z czasownikiem.",
  },
  {
    id: "dashboard.header.btn_audits",
    section: "Pulpit – Nagłówek",
    context: "Główny przycisk akcji w nagłówku (niebieski)",
    type: "Przycisk",
    original: "Przeglądaj audyty",
    plainLanguageSuggestion: "Zobacz listę audytów",
    editorNotes: "Jasne określenie docelowego miejsca.",
  },

  // -------------------------------------------------------------
  // SEKCJA 3: Pulpit – Karty KPI (Kluczowe wskaźniki)
  // -------------------------------------------------------------
  {
    id: "dashboard.kpi.accessibility.label",
    section: "Pulpit – Karty KPI",
    context: "Karta 1: Etykieta głównego wskaźnika procentowego",
    type: "Etykieta",
    original: "Średnia Dostępność",
    plainLanguageSuggestion: "Średni poziom dostępności",
    editorNotes: "Naturalniejsze brzmienie w języku polskim (uniknięcie pisania obu słów wielką literą).",
  },
  {
    id: "dashboard.kpi.accessibility.trend_badge",
    section: "Pulpit – Karty KPI",
    context: "Karta 1: Zielona pigułka dynamiki",
    type: "Wskaźnik",
    original: "+2.4% r/r",
    plainLanguageSuggestion: "+2,4% w porównaniu z zeszłym rokiem",
    editorNotes: "Skrót r/r (rok do roku) bywa niezrozumiały dla osób spoza analityki finansowej. Warto wyjaśnić w dymku.",
  },
  {
    id: "dashboard.kpi.accessibility.target_label",
    section: "Pulpit – Karty KPI",
    context: "Karta 1: Podpis pod wartością procentową",
    type: "Etykieta",
    original: "Cel: 90%",
    plainLanguageSuggestion: "Twój cel: 90%",
    editorNotes: "Zwięzłe wskazanie progu docelowego.",
  },
  {
    id: "dashboard.kpi.coverage.label",
    section: "Pulpit – Karty KPI",
    context: "Karta 2: Etykieta wskaźnika przebadania usług",
    type: "Etykieta",
    original: "Pokrycie Audytowe",
    plainLanguageSuggestion: "Zbadane usługi i procesy",
    editorNotes: "Zwrot 'Pokrycie audytowe' jest kalką korporacyjną. Prostsze: 'Zbadane procesy' lub 'Objęte audytami'.",
  },
  {
    id: "dashboard.kpi.coverage.processes_badge",
    section: "Pulpit – Karty KPI",
    context: "Karta 2: Szara pigułka z liczbą zbadanych elementów",
    type: "Etykieta",
    original: "142 procesy",
    plainLanguageSuggestion: "142 procesy łącznie",
    editorNotes: "Wskazuje łączną liczbę zarejestrowanych ścieżek.",
  },
  {
    id: "dashboard.kpi.errors.label",
    section: "Pulpit – Karty KPI",
    context: "Karta 3: Etykieta podsumowania problemów",
    type: "Etykieta",
    original: "Błędy Otwarte (Razem: 239)",
    plainLanguageSuggestion: "Aktywne błędy (łącznie: 239)",
    editorNotes: "Zamiast informatycznego 'Błędy otwarte' prościej: 'Błędy do naprawy' lub 'Nierozwiązane problemy'.",
  },
  {
    id: "dashboard.kpi.errors.trend_badge",
    section: "Pulpit – Karty KPI",
    context: "Karta 3: Czerwona pigułka dynamiki błędów",
    type: "Wskaźnik",
    original: "+12 m/m",
    plainLanguageSuggestion: "+12 w tym miesiącu",
    editorNotes: "Skrót m/m (miesiąc do miesiąca) w prostym języku warto zastąpić zwrotem opisowym.",
  },
  {
    id: "dashboard.kpi.errors.priority_title",
    section: "Pulpit – Karty KPI",
    context: "Karta 3: Pierwsza podkategoria błędów (czerwona)",
    type: "Etykieta",
    original: "Priorytetowe",
    plainLanguageSuggestion: "Krytyczne (najpilniejsze)",
    editorNotes: "Kluczowa kategoria uniemożliwiająca korzystanie z serwisu osobom z niepełnosprawnościami.",
  },
  {
    id: "dashboard.kpi.errors.priority_action",
    section: "Pulpit – Karty KPI",
    context: "Karta 3: Podpis pod liczbą błędów priorytetowych",
    type: "Podtytuł",
    original: "Wymaga akcji",
    plainLanguageSuggestion: "Napraw w pierwszej kolejności",
    editorNotes: "Zastąpienie kalki 'Wymaga akcji' konkretną wskazówką działania.",
  },
  {
    id: "dashboard.kpi.errors.important_title",
    section: "Pulpit – Karty KPI",
    context: "Karta 3: Druga podkategoria błędów (pomarańczowa)",
    type: "Etykieta",
    original: "Ważne",
    plainLanguageSuggestion: "Ważne",
    editorNotes: "Jasne słowo.",
  },
  {
    id: "dashboard.kpi.errors.important_action",
    section: "Pulpit – Karty KPI",
    context: "Karta 3: Podpis pod liczbą błędów ważnych",
    type: "Podtytuł",
    original: "Do planu",
    plainLanguageSuggestion: "Zaplanuj do naprawy",
    editorNotes: "Rozwinięcie hasła 'Do planu' w czytelne zalecenie.",
  },
  {
    id: "dashboard.kpi.errors.marginal_title",
    section: "Pulpit – Karty KPI",
    context: "Karta 3: Trzecia podkategoria błędów (niebieska)",
    type: "Etykieta",
    original: "Marginalne",
    plainLanguageSuggestion: "Drobne",
    editorNotes: "'Drobne błędy' brzmi bardziej po polsku niż 'marginalne'.",
  },
  {
    id: "dashboard.kpi.errors.marginal_action",
    section: "Pulpit – Karty KPI",
    context: "Karta 3: Podpis pod liczbą błędów marginalnych",
    type: "Podtytuł",
    original: "Niski wpływ",
    plainLanguageSuggestion: "Niewielkie utrudnienie",
    editorNotes: "Wyjaśnienie, co oznacza ta waga dla użytkownika końcowego.",
  },
  {
    id: "dashboard.kpi.audits.label",
    section: "Pulpit – Karty KPI",
    context: "Karta 4: Etykieta liczby zrealizowanych audytów",
    type: "Etykieta",
    original: "Przeprowadzone Audyty",
    plainLanguageSuggestion: "Zrealizowane audyty",
    editorNotes: "Uniknięcie wielkich liter w środku zdania.",
  },
  {
    id: "dashboard.kpi.audits.period_badge",
    section: "Pulpit – Karty KPI",
    context: "Karta 4: Niebieska pigułka horyzontu czasowego",
    type: "Etykieta",
    original: "W tym kwartale",
    plainLanguageSuggestion: "W bieżącym kwartale",
    editorNotes: "Jasne określenie okresu rozliczeniowego.",
  },
  {
    id: "dashboard.kpi.audits.in_progress_label",
    section: "Pulpit – Karty KPI",
    context: "Karta 4: Podpis pod liczbą audytów",
    type: "Etykieta",
    original: "4 w trakcie",
    plainLanguageSuggestion: "4 audyty trwają obecnie",
    editorNotes: "Pełniejszy, bardziej naturalny opis.",
  },

  // -------------------------------------------------------------
  // SEKCJA 4: Pulpit – Dymki informacyjne (Tooltips) kart KPI
  // -------------------------------------------------------------
  {
    id: "dashboard.tooltip.accessibility_score",
    section: "Pulpit – Dymki informacyjne (Tooltips)",
    context: "Karta 1: Dymek przy etykiecie 'Średnia Dostępność'",
    type: "Dymek (Tooltip)",
    original: "Średni zagregowany wskaźnik spełnienia kryteriów sukcesu WCAG 2.1 AA we wszystkich audytowanych serwisach i procesach cyfrowych.",
    plainLanguageSuggestion: "Pokazuje, jaki procent wymogów dostępności cyfrowej spełniają łącznie wszystkie zbadane strony, aplikacje i procesy w Twojej organizacji.",
    editorNotes: "Uproszczenie: usunięcie trudnych słów 'zagregowany wskaźnik spełnienia kryteriów sukcesu'.",
  },
  {
    id: "dashboard.tooltip.accessibility_trend",
    section: "Pulpit – Dymki informacyjne (Tooltips)",
    context: "Karta 1: Dymek przy pigułce dynamiki '+2.4% r/r'",
    type: "Dymek (Tooltip)",
    original: "Porównanie rok do roku (r/r) – dynamika wzrostu ogólnego poziomu dostępności względem analogicznego okresu w ubiegłym roku.",
    plainLanguageSuggestion: "Porównanie z tym samym okresem w poprzednim roku. Wartość dodatnia oznacza, że dostępność Twoich usług rośnie.",
    editorNotes: "Usunięcie żargonu analitycznego ('dynamika wzrostu względem analogicznego okresu').",
  },
  {
    id: "dashboard.tooltip.accessibility_target",
    section: "Pulpit – Dymki informacyjne (Tooltips)",
    context: "Karta 1: Dymek przy celu 'Cel: 90%'",
    type: "Dymek (Tooltip)",
    original: "Strategiczny cel organizacji zgodny z wymaganiami Europejskiego Aktu o Dostępności (EAA).",
    plainLanguageSuggestion: "Cel wyznaczony dla Twojej organizacji, aby spełnić europejskie i polskie przepisy o dostępności cyfrowej (ustawa EAA).",
    editorNotes: "Rozwinięcie skrótu EAA w zrozumiały kontekst prawny.",
  },
  {
    id: "dashboard.tooltip.coverage_score",
    section: "Pulpit – Dymki informacyjne (Tooltips)",
    context: "Karta 2: Dymek przy etykiecie 'Pokrycie Audytowe'",
    type: "Dymek (Tooltip)",
    original: "Odsetek zidentyfikowanych procesów i ścieżek cyfrowych posiadających aktualny i ważny audyt WCAG.",
    plainLanguageSuggestion: "Odsetek usług i procesów internetowych, które mają aktualny i ważny audyt dostępności cyfrowej.",
    editorNotes: "Zastąpienie 'zidentyfikowanych ścieżek cyfrowych' zrozumiałym sformułowaniem.",
  },
  {
    id: "dashboard.tooltip.coverage_processes",
    section: "Pulpit – Dymki informacyjne (Tooltips)",
    context: "Karta 2: Dymek przy liczbie '142 procesy'",
    type: "Dymek (Tooltip)",
    original: "Łączna liczba zinwentaryzowanych procesów w Bazie Usług podlegających cyklicznemu monitoringowi dostępności.",
    plainLanguageSuggestion: "Tyle procesów (np. wniosków, płatności, formularzy) jest wpisanych do bazy i regularnie sprawdzanych.",
    editorNotes: "Wyjaśnienie trudnego słowa 'zinwentaryzowanych' za pomocą prostych przykładów.",
  },
  {
    id: "dashboard.tooltip.errors_open",
    section: "Pulpit – Dymki informacyjne (Tooltips)",
    context: "Karta 3: Dymek przy tytule 'Błędy Otwarte'",
    type: "Dymek (Tooltip)",
    original: "Łączna liczba zarejestrowanych, nierozwiązanych dotąd barier dostępności wykrytych we wszystkich audytowanych systemach.",
    plainLanguageSuggestion: "Wszystkie wykryte podczas audytów bariery i usterki, które nadal czekają na poprawienie przez programistów lub redaktorów.",
    editorNotes: "Konkretne wyjaśnienie, kto i co musi z tym zrobić.",
  },
  {
    id: "dashboard.tooltip.errors_trend",
    section: "Pulpit – Dymki informacyjne (Tooltips)",
    context: "Karta 3: Dymek przy dynamice '+12 m/m'",
    type: "Dymek (Tooltip)",
    original: "Porównanie miesiąc do miesiąca (m/m) – przyrost liczby otwartych błędów w stosunku do poprzedniego miesiąca.",
    plainLanguageSuggestion: "Różnica w porównaniu z poprzednim miesiącem. Wskazuje, o ile wzrosła lub zmalała liczba nierozwiązanych problemów.",
    editorNotes: "Proste wyjaśnienie mechanizmu m/m.",
  },
  {
    id: "dashboard.tooltip.audits_completed",
    section: "Pulpit – Dymki informacyjne (Tooltips)",
    context: "Karta 4: Dymek przy tytule 'Przeprowadzone Audyty'",
    type: "Dymek (Tooltip)",
    original: "Suma sfinalizowanych audytów certyfikacyjnych oraz re-audytów zarejestrowanych w systemie.",
    plainLanguageSuggestion: "Łączna liczba zakończonych audytów oraz audytów sprawdzających (re-audytów), które zostały odebrane w systemie.",
    editorNotes: "Zastąpienie 'sfinalizowanych' polskim 'zakończonych'.",
  },
  {
    id: "dashboard.tooltip.audits_period",
    section: "Pulpit – Dymki informacyjne (Tooltips)",
    context: "Karta 4: Dymek przy pigułce 'W tym kwartale'",
    type: "Dymek (Tooltip)",
    original: "Liczba formalnych audytów WCAG ukończonych i odebranych w bieżącym kwartale rozliczeniowym.",
    plainLanguageSuggestion: "Liczba audytów ukończonych i zatwierdzonych w obecnym kwartale roku.",
    editorNotes: "Uproszczenie stylu urzędowego.",
  },
  {
    id: "dashboard.tooltip.audits_in_progress",
    section: "Pulpit – Dymki informacyjne (Tooltips)",
    context: "Karta 4: Dymek przy statusie '4 w trakcie'",
    type: "Dymek (Tooltip)",
    original: "Audyty oraz re-audyty aktualnie realizowane przez zespół certyfikowanych audytorów WCAG.",
    plainLanguageSuggestion: "Audyty, nad którymi zespół certyfikowanych ekspertów pracuje w tej chwili.",
    editorNotes: "Prostsza, żywsza konstrukcja gramatyczna.",
  },

  // -------------------------------------------------------------
  // SEKCJA 5: Pulpit – Wykresy (Trendy i Kanały)
  // -------------------------------------------------------------
  {
    id: "dashboard.charts.trend.title",
    section: "Pulpit – Wykresy",
    context: "Wykres 1: Nagłówek wykresu słupkowego",
    type: "Tytuł",
    original: "Trend dostępności vs Błędy w czasie",
    plainLanguageSuggestion: "Zmiany dostępności i liczby błędów w czasie",
    editorNotes: "Zastąpienie obcego skrótu 'vs' polskim spójnikiem 'i' lub 'a'.",
  },
  {
    id: "dashboard.charts.trend.tooltip",
    section: "Pulpit – Wykresy",
    context: "Wykres 1: Dymek informacyjny obok tytułu wykresu",
    type: "Dymek (Tooltip)",
    original: "Zestawienie średniego wskaźnika zgodności WCAG (niebieskie słupki) z liczbą nowych wykrytych błędów (czerwone słupki) na przestrzeni ostatnich 12 miesięcy.",
    plainLanguageSuggestion: "Wykres pokazuje dwa wskaźniki z ostatnich 12 miesięcy: niebieskie słupki to średni poziom dostępności (w procentach), a czerwone słupki to liczba nowo wykrytych błędów.",
    editorNotes: "Zwięzły i czytelny przewodnik po kolorach i osiach wykresu.",
  },
  {
    id: "dashboard.charts.trend.subtitle",
    section: "Pulpit – Wykresy",
    context: "Wykres 1: Podtytuł pod nagłówkiem",
    type: "Podtytuł",
    original: "Ostatnie 12 miesięcy w całej organizacji",
    plainLanguageSuggestion: "Dane z ostatnich 12 miesięcy dla całej organizacji",
    editorNotes: "Krótkie doprecyzowanie kontekstu.",
  },
  {
    id: "dashboard.charts.trend.hover_format",
    section: "Pulpit – Wykresy",
    context: "Wykres 1: Treść dymka po najechaniu na pojedynczy miesiąc",
    type: "Dymek (Hover)",
    original: "Dostępność: {score}% | Błędy: {errors}",
    plainLanguageSuggestion: "Dostępność: {score}% | Nowe błędy: {errors}",
    editorNotes: "Doprecyzowanie, że czerwony słupek to nowe błędy wykryte w danym miesiącu.",
  },
  {
    id: "dashboard.charts.trend.legend_score",
    section: "Pulpit – Wykresy",
    context: "Wykres 1: Etykieta niebieskiej kropki w legendzie",
    type: "Legenda",
    original: "% Dostępności",
    plainLanguageSuggestion: "Poziom dostępności (%)",
    editorNotes: "Bardziej naturalny szyk słów.",
  },
  {
    id: "dashboard.charts.trend.legend_errors",
    section: "Pulpit – Wykresy",
    context: "Wykres 1: Etykieta czerwonego kwadracika w legendzie",
    type: "Legenda",
    original: "Liczba nowych błędów",
    plainLanguageSuggestion: "Liczba nowych błędów",
    editorNotes: "Jasne, jednoznaczne określenie.",
  },
  {
    id: "dashboard.charts.channels.title",
    section: "Pulpit – Wykresy",
    context: "Wykres 2: Nagłówek poziomego wykresu kanałów",
    type: "Tytuł",
    original: "Zgodność kanałów",
    plainLanguageSuggestion: "Dostępność według kanałów",
    editorNotes: "Słowo 'Zgodność' można zastąpić 'Dostępnością' lub 'Poziomem dostępności w kanałach'.",
  },
  {
    id: "dashboard.charts.channels.tooltip",
    section: "Pulpit – Wykresy",
    context: "Wykres 2: Dymek informacyjny obok tytułu",
    type: "Dymek (Tooltip)",
    original: "Średni poziom dostępności z podziałem na poszczególne kanały: serwis WWW, aplikacje mobilne (iOS, Android) oraz dokumenty cyfrowe (PDF/DOC).",
    plainLanguageSuggestion: "Średni wynik dostępności z podziałem na kanały kontaktu: stronę internetową, aplikacje na telefony (iOS i Android) oraz dokumenty do pobrania (PDF i Word).",
    editorNotes: "Zastąpienie skrótów 'PDF/DOC' przyjaznym 'dokumenty do pobrania (PDF i Word)'.",
  },
  {
    id: "dashboard.charts.channels.channel_web",
    section: "Pulpit – Wykresy",
    context: "Wykres 2: Etykieta pierwszego paska",
    type: "Etykieta",
    original: "WWW",
    plainLanguageSuggestion: "Strona internetowa (WWW)",
    editorNotes: "Ułatwienie dla użytkowników mniej technicznych.",
  },
  {
    id: "dashboard.charts.channels.channel_ios",
    section: "Pulpit – Wykresy",
    context: "Wykres 2: Etykieta drugiego paska",
    type: "Etykieta",
    original: "Aplikacja (iOS)",
    plainLanguageSuggestion: "Aplikacja na iPhone (iOS)",
    editorNotes: "Dodanie czytelnego skojarzenia ze smartfonami Apple.",
  },
  {
    id: "dashboard.charts.channels.channel_android",
    section: "Pulpit – Wykresy",
    context: "Wykres 2: Etykieta trzeciego paska",
    type: "Etykieta",
    original: "Aplikacja (Android)",
    plainLanguageSuggestion: "Aplikacja na Androida",
    editorNotes: "Spolszczona, naturalna odmiana nazwy systemu.",
  },
  {
    id: "dashboard.charts.channels.channel_docs",
    section: "Pulpit – Wykresy",
    context: "Wykres 2: Etykieta czwartego paska",
    type: "Etykieta",
    original: "Dokumenty (PDF/DOC)",
    plainLanguageSuggestion: "Dokumenty do pobrania (PDF, DOC)",
    editorNotes: "Czytelniejsza kategoria.",
  },

  // -------------------------------------------------------------
  // SEKCJA 6: Pulpit – Moduł współpracy: Konsultacje z audytorami
  // -------------------------------------------------------------
  {
    id: "dashboard.tickets.widget_title",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Nagłówek kafelka modułu konsultacji",
    type: "Tytuł",
    original: "Konsultacje",
    plainLanguageSuggestion: "Konsultacje z audytorami",
    editorNotes: "Doprecyzowanie, z kim użytkownik ma kontakt.",
  },
  {
    id: "dashboard.tickets.widget_badge",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Zielona pulsująca pigułka powiadomienia",
    type: "Licznik",
    original: "{count} nowa odp.",
    plainLanguageSuggestion: "{count} nowa odpowiedź",
    editorNotes: "Rozwinięcie skrótu 'odp.' do pełnego słowa.",
  },
  {
    id: "dashboard.tickets.widget_description",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Podtytuł wprowadzający w module konsultacji",
    type: "Opis",
    original: "Bezpośredni kontakt merytoryczny z zespołem audytorów WCAG bez konieczności spotkań online.",
    plainLanguageSuggestion: "Zadawaj pytania ekspertom WCAG i wyjaśniaj wątpliwości na bieżąco, bez konieczności organizowania spotkań.",
    editorNotes: "Bardziej bezpośredni, korzyściowy język mówiący do użytkownika.",
  },
  {
    id: "dashboard.tickets.btn_new",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Niebieski przycisk akcji w widgecie",
    type: "Przycisk",
    original: "Nowa konsultacja",
    plainLanguageSuggestion: "Zadaj pytanie audytorowi",
    editorNotes: "Forma czasownikowa jasno mówi użytkownikowi, co się stanie.",
  },
  {
    id: "dashboard.tickets.btn_all",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Biały przycisk przejścia do pełnej listy",
    type: "Przycisk",
    original: "Wszystkie ({count})",
    plainLanguageSuggestion: "Wszystkie rozmowy ({count})",
    editorNotes: "Zastąpienie bezosobowego 'Wszystkie' rzeczownikiem.",
  },
  {
    id: "dashboard.tickets.banner_tag",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Pasek nowej odpowiedzi w ramce banera",
    type: "Etykieta",
    original: "Nowa odpowiedź audytora • #{id}",
    plainLanguageSuggestion: "Nowa odpowiedź od audytora • #{id}",
    editorNotes: "Naturalna forma językowa.",
  },
  {
    id: "dashboard.tickets.banner_open",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Link przejścia po prawej stronie banera",
    type: "Link / Akcja",
    original: "Otwórz",
    plainLanguageSuggestion: "Przeczytaj odpowiedź",
    editorNotes: "Konkretna zapowiedź tego, co zobaczy użytkownik.",
  },
  {
    id: "dashboard.tickets.manager_status",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Zielona kropka statusu przy nazwisku opiekuna",
    type: "Status",
    original: "Dostępny",
    plainLanguageSuggestion: "Dostępny teraz",
    editorNotes: "Wskazuje gotowość opiekuna do kontaktu.",
  },
  {
    id: "dashboard.tickets.manager_role",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Podpis pod nazwiskiem opiekuna",
    type: "Etykieta",
    original: "Dedykowany Opiekun Klienta",
    plainLanguageSuggestion: "Twój dedykowany opiekun",
    editorNotes: "Cieplejszy, bardziej zorientowany na klienta zwrot.",
  },
  {
    id: "dashboard.tickets.btn_schedule_meeting",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Przycisk planowania spotkania w stopce karty",
    type: "Przycisk",
    original: "Umów spotkanie",
    plainLanguageSuggestion: "Umów krótkie spotkanie",
    editorNotes: "Zachęcające i obniżające barierę wejścia sformułowanie.",
  },
  {
    id: "dashboard.tickets.toast_title",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Powiadomienie po kliknięciu 'Umów spotkanie' - Tytuł",
    type: "Komunikat",
    original: "Zaproszenie na spotkanie statusowe",
    plainLanguageSuggestion: "Wysłano prośbę o spotkanie",
    editorNotes: "Proste potwierdzenie wykonania czynności.",
  },
  {
    id: "dashboard.tickets.toast_desc",
    section: "Pulpit – Konsultacje z audytorami",
    context: "Treść powiadomienia toast",
    type: "Komunikat",
    original: "Zaproszenie na spotkanie zostało przekazane do Tomasza Straszaka.",
    plainLanguageSuggestion: "Powiadomiliśmy Tomasza Straszaka. Wkrótce skontaktuje się z Tobą w sprawie terminu.",
    editorNotes: "Zastąpienie strony biernej ('zostało przekazane') aktywną obietnicą kontaktu.",
  },

  // -------------------------------------------------------------
  // SEKCJA 7: Pulpit – Moduł współpracy: Komunikaty & Nowości
  // -------------------------------------------------------------
  {
    id: "dashboard.announcements.widget_title",
    section: "Pulpit – Komunikaty & Nowości",
    context: "Tytuł modułu po prawej stronie",
    type: "Tytuł",
    original: "Komunikaty & Nowości",
    plainLanguageSuggestion: "Komunikaty i aktualności",
    editorNotes: "Zastąpienie znaku '&' spójnikiem 'i'.",
  },
  {
    id: "dashboard.announcements.widget_badge",
    section: "Pulpit – Komunikaty & Nowości",
    context: "Niebieska pigułka z liczbą nowych wiadomości",
    type: "Licznik",
    original: "{count} nowe",
    plainLanguageSuggestion: "{count} nowe wiadomości",
    editorNotes: "Doprecyzowanie, czego dotyczy liczba.",
  },
  {
    id: "dashboard.announcements.widget_description",
    section: "Pulpit – Komunikaty & Nowości",
    context: "Podtytuł modułu komunikatów",
    type: "Opis",
    original: "Aktualizacje prawne, webinary i oferty.",
    plainLanguageSuggestion: "Ważne zmiany w prawie, zaproszenia na szkolenia i wskazówki.",
    editorNotes: "Bardziej opisowe i przystępne podsumowanie.",
  },
  {
    id: "dashboard.announcements.btn_all",
    section: "Pulpit – Komunikaty & Nowości",
    context: "Przycisk w prawym górnym rogu modułu",
    type: "Przycisk",
    original: "Wszystkie ({count})",
    plainLanguageSuggestion: "Zobacz wszystkie ({count})",
    editorNotes: "Dodanie czasownika akcji.",
  },
  {
    id: "dashboard.announcements.badge_details",
    section: "Pulpit – Komunikaty & Nowości",
    context: "Szary przycisk na dole kafelka komunikatu",
    type: "Etykieta",
    original: "Szczegóły",
    plainLanguageSuggestion: "Więcej informacji",
    editorNotes: "Bardziej przyjazne sformułowanie.",
  },
  {
    id: "dashboard.announcements.footer_note",
    section: "Pulpit – Komunikaty & Nowości",
    context: "Informacja tekstowa po lewej stronie w stopce modułu",
    type: "Podpis",
    original: "Baza wiedzy & archiwum wytycznych",
    plainLanguageSuggestion: "Baza wiedzy i archiwum poradników",
    editorNotes: "Zastąpienie '&' oraz formalnego słowa 'wytyczne' bardziej zrozumiałym 'poradniki'.",
  },
  {
    id: "dashboard.announcements.btn_browse_all",
    section: "Pulpit – Komunikaty & Nowości",
    context: "Niebieski link w stopce modułu",
    type: "Przycisk",
    original: "Przeglądaj wszystkie",
    plainLanguageSuggestion: "Otwórz pełne archiwum",
    editorNotes: "Jasne wskazanie celu.",
  },

  // -------------------------------------------------------------
  // SEKCJA 8: Pulpit – Tabele i rankingi
  // -------------------------------------------------------------
  {
    id: "dashboard.recent_audits.title",
    section: "Pulpit – Tabele i rankingi",
    context: "Karta 1 w dolnym rzędzie: Nagłówek",
    type: "Tytuł",
    original: "Ostatnie audyty",
    plainLanguageSuggestion: "Ostatnie audyty",
    editorNotes: "Zrozumiałe, jasne.",
  },
  {
    id: "dashboard.recent_audits.subtitle",
    section: "Pulpit – Tabele i rankingi",
    context: "Podtytuł pod nagłówkiem 'Ostatnie audyty'",
    type: "Podtytuł",
    original: "Szybki podgląd prowadzonych prac",
    plainLanguageSuggestion: "Ostatnio zakończone i trwające badania dostępności",
    editorNotes: "Wyjaśnienie, czym są te prace w praktyce.",
  },
  {
    id: "dashboard.recent_audits.status_completed",
    section: "Pulpit – Tabele i rankingi",
    context: "Zielona etykieta statusu audytu",
    type: "Status",
    original: "Zakończony",
    plainLanguageSuggestion: "Zakończony",
    editorNotes: "Jasny status.",
  },
  {
    id: "dashboard.recent_audits.status_in_progress",
    section: "Pulpit – Tabele i rankingi",
    context: "Pomarańczowa etykieta statusu audytu",
    type: "Status",
    original: "W trakcie",
    plainLanguageSuggestion: "W trakcie realizacji",
    editorNotes: "Pełniejszy opis stanu badania.",
  },
  {
    id: "dashboard.recent_audits.status_new",
    section: "Pulpit – Tabele i rankingi",
    context: "Niebieska etykieta statusu audytu",
    type: "Status",
    original: "Nowy",
    plainLanguageSuggestion: "Zaplanowany (nowy)",
    editorNotes: "Doprecyzowanie, że badanie dopiero się rozpoczyna.",
  },
  {
    id: "dashboard.recent_audits.tooltip_critical",
    section: "Pulpit – Tabele i rankingi",
    context: "Dymek na czerwonym liczniku błędów przy audycie",
    type: "Dymek (Tooltip)",
    original: "Błędy priorytetowe: {count}",
    plainLanguageSuggestion: "Błędy krytyczne (najpilniejsze do naprawy): {count}",
    editorNotes: "Przypomnienie wagi tego typu błędów.",
  },
  {
    id: "dashboard.recent_audits.tooltip_important",
    section: "Pulpit – Tabele i rankingi",
    context: "Dymek na pomarańczowym liczniku błędów",
    type: "Dymek (Tooltip)",
    original: "Błędy ważne: {count}",
    plainLanguageSuggestion: "Błędy ważne: {count}",
    editorNotes: "Zrozumiałe.",
  },
  {
    id: "dashboard.recent_audits.tooltip_marginal",
    section: "Pulpit – Tabele i rankingi",
    context: "Dymek na niebieskim liczniku błędów",
    type: "Dymek (Tooltip)",
    original: "Błędy marginalne: {count}",
    plainLanguageSuggestion: "Drobne usterki: {count}",
    editorNotes: "Zastąpienie 'marginalnych' 'drobnymi usterkami'.",
  },
  {
    id: "dashboard.recent_audits.btn_go_to_audits",
    section: "Pulpit – Tabele i rankingi",
    context: "Przycisk na dole karty 'Ostatnie audyty'",
    type: "Przycisk",
    original: "Przejdź do modułu Audytów",
    plainLanguageSuggestion: "Zobacz wszystkie audyty",
    editorNotes: "Usunięcie technicznego słowa 'moduł'.",
  },
  {
    id: "dashboard.top_issues.title",
    section: "Pulpit – Tabele i rankingi",
    context: "Karta 2 w dolnym rzędzie: Nagłówek",
    type: "Tytuł",
    original: "Wymagające uwagi (Top 5)",
    plainLanguageSuggestion: "Usługi wymagające pilnej naprawy (Top 5)",
    editorNotes: "Wskazanie, na czym polega ta uwaga.",
  },
  {
    id: "dashboard.top_issues.subtitle",
    section: "Pulpit – Tabele i rankingi",
    context: "Podtytuł karty",
    type: "Podtytuł",
    original: "Usługi o najniższym procencie dostępności",
    plainLanguageSuggestion: "Usługi cyfrowe z najniższym wynikiem dostępności i największą liczbą błędów",
    editorNotes: "Bardziej opisowe wyjaśnienie kryteriów doboru.",
  },
  {
    id: "dashboard.top_issues.active_errors_suffix",
    section: "Pulpit – Tabele i rankingi",
    context: "Podpis pod nazwą usługi w rankingu",
    type: "Etykieta",
    original: "{count} aktywnych błędów",
    plainLanguageSuggestion: "{count} nierozwiązanych błędów",
    editorNotes: "Zamiast żargonowego 'aktywnych' proste słowo 'nierozwiązanych'.",
  },
  {
    id: "dashboard.top_issues.btn_see_ranking",
    section: "Pulpit – Tabele i rankingi",
    context: "Przycisk na dole rankingu Top 5",
    type: "Przycisk",
    original: "Zobacz pełny ranking w raportach",
    plainLanguageSuggestion: "Zobacz pełną listę usług w raportach",
    editorNotes: "Zastąpienie obcego słowa 'ranking' określeniem 'pełna lista usług'.",
  },
  {
    id: "common.tooltip.more_info_aria",
    section: "Elementy wspólne UI",
    context: "Aria-label dla ikony dymka informacyjnego (InfoTooltip)",
    type: "Dostępność (Aria)",
    original: "Więcej informacji",
    plainLanguageSuggestion: "Więcej informacji (wskazówka)",
    editorNotes: "Etykieta przycisku otwierającego dymek dla czytników ekranu.",
  },
];

console.log(`Zdefiniowano ${phrasesCatalog.length} fraz w katalogu.`);

// ==========================================
// 1. GENEROWANIE PLIKU JSON (DO IMPORTU)
// ==========================================
function generateJson() {
  const jsonPath = path.join(exportsDir, "frazy_menu_pulpit_dane.json");
  const data = {
    metadata: {
      title: "Katalog fraz interfejsu W-ally: Menu i Pulpit",
      createdAt: new Date().toISOString(),
      version: "1.0.0",
      totalPhrases: phrasesCatalog.length,
      sections: [
        "Nawigacja górna",
        "Pulpit – Nagłówek",
        "Pulpit – Karty KPI",
        "Pulpit – Dymki informacyjne (Tooltips)",
        "Pulpit – Wykresy",
        "Pulpit – Konsultacje z audytorami",
        "Pulpit – Komunikaty & Nowości",
        "Pulpit – Tabele i rankingi",
        "Elementy wspólne UI",
      ],
      instructions:
        "Wypełnij pole 'plainLanguage' nową, zredagowaną wersją tekstu. Po redakcji plik można zaimportować z powrotem do systemu za pomocą skryptu scripts/import_plain_language.js.",
    },
    items: phrasesCatalog.map((item) => ({
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

// ==========================================
// 2. GENEROWANIE PLIKU NOTATNIKA (.TXT)
// ==========================================
function generateTxt() {
  const txtPath = path.join(exportsDir, "frazy_menu_pulpit_redakcja.txt");
  let content = "";

  content += "================================================================================\n";
  content += "              W-ALLY: FRAZY MENU I PULPITU (DO REDAKCJI PROSTEGO JĘZYKA)        \n";
  content += "================================================================================\n";
  content += `Data wygenerowania: ${new Date().toLocaleString("pl-PL")}\n`;
  content += `Łączna liczba fraz: ${phrasesCatalog.length}\n`;
  content += "\n";
  content += "INSTRUKCJA DLA REDAKTORA PROSTEGO JĘZYKA:\n";
  content += "1. Każda fraza posiada swój unikalny identyfikator [ID], kontekst występowania oraz [TYP].\n";
  content += "2. Pole [ORYGINALNY TEKST] zawiera obecne brzmienie w aplikacji.\n";
  content += "3. Wpisz swoją zredagowaną propozycję w linii [PROSTY JĘZYK: ...].\n";
  content += "4. Nie zmieniaj identyfikatorów [ID], aby plik mógł zostać automatycznie zaimportowany do kodu!\n";
  content += "5. Zasady prostego języka: krótkie zdania, strona czynna, brak żargonu, zrozumiałe skróty.\n";
  content += "================================================================================\n\n";

  let currentSection = "";

  for (const item of phrasesCatalog) {
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
  content += `KONIEC PLIKU - ŁĄCZNIE ${phrasesCatalog.length} POZYCJI\n`;
  content += `================================================================================\n`;

  fs.writeFileSync(txtPath, content, "utf-8");
  console.log(`[TXT] Wygenerowano: ${txtPath}`);
}

// ==========================================
// 3. GENEROWANIE PLIKU TABELI CSV (DLA EXCELA / WORDA)
// ==========================================
function generateCsv() {
  const csvPath = path.join(exportsDir, "frazy_menu_pulpit_tabela.csv");
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

  const rows = phrasesCatalog.map((item) => [
    escapeCsv(item.id),
    escapeCsv(item.section),
    escapeCsv(item.context),
    escapeCsv(item.type),
    escapeCsv(item.original),
    escapeCsv(item.plainLanguageSuggestion || item.original),
    escapeCsv(item.editorNotes),
  ]);

  // UTF-8 BOM (\uFEFF) gwarantuje poprawne wyświetlanie polskich znaków w Excelu
  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
  fs.writeFileSync(csvPath, csvContent, "utf-8");
  console.log(`[CSV] Wygenerowano: ${csvPath}`);
}

// ==========================================
// 4. GENEROWANIE PLIKU MICROSOFT WORD (.DOCX)
// ==========================================
async function generateDocx() {
  const docxPath = path.join(exportsDir, "frazy_menu_pulpit_redakcja.docx");

  const brandColor = "0038F8";
  const headerBgColor = "EBF0FF";
  const lightGrayBg = "F8FAFC";
  const borderColor = "CBD5E1";

  const tableHeaderCell = (text, widthPercent) =>
    new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: headerBgColor },
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              size: 19,
              color: brandColor,
              font: "Arial",
            }),
          ],
        }),
      ],
    });

  const bodyCell = (text, widthPercent, isEditable = false, isBold = false) =>
    new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: isEditable
        ? { type: ShadingType.CLEAR, fill: "FFFFFF" }
        : { type: ShadingType.CLEAR, fill: lightGrayBg },
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text || "",
              bold: isBold,
              size: 18,
              font: "Arial",
              color: isEditable ? "0F172A" : "334155",
            }),
          ],
        }),
      ],
    });

  // Grupowanie według sekcji
  const sectionsMap = new Map();
  for (const item of phrasesCatalog) {
    if (!sectionsMap.has(item.section)) {
      sectionsMap.set(item.section, []);
    }
    sectionsMap.get(item.section).push(item);
  }

  const docChildren = [];

  // Tytuł dokumentu
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: "W-ally: Zestawienie treści Menu i Pulpitu",
          bold: true,
          size: 36,
          color: brandColor,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "Karta pracy dla redakcji prostego języka (Plain Language Audit)",
          size: 24,
          bold: true,
          color: "475569",
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: `Data generacji: ${new Date().toLocaleDateString("pl-PL")} | Łączna liczba fraz do weryfikacji: ${phrasesCatalog.length}`,
          size: 19,
          color: "64748B",
          font: "Arial",
        }),
      ],
    }),

    // Ramka z wytycznymi prostego języka
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: "Wskazówki dla redakcji prostego języka:",
          bold: true,
          size: 22,
          color: "0F172A",
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Pisz zwięźle i bezpośrednio do odbiorcy – unikaj strony biernej (zamiast 'zostało zrobione' napisz 'zrobiliśmy' lub 'sprawdź').",
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Eliminuj żargon urzędowy i techniczny – pojęcia takie jak 'm/m', 'r/r', 'zinwentaryzowany proces' zastąp czytelnym wyjaśnieniem.",
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: "Dymki informacyjne (tooltips) powinny w 1-2 zdaniach odpowiadać na pytanie: 'Co to dla mnie oznacza?'.",
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "Wypełnij kolumnę 'Prosty język (po redakcji)'. Nie modyfikuj kolumny 'Klucz ID' – posłuży ona do automatycznego importu Twoich zmian do kodu aplikacji.",
          size: 20,
          bold: true,
          color: brandColor,
          font: "Arial",
        }),
      ],
    })
  );

  // Generowanie tabel dla każdej sekcji
  for (const [sectionName, items] of sectionsMap.entries()) {
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 140 },
        children: [
          new TextRun({
            text: sectionName,
            bold: true,
            size: 24,
            color: "0F172A",
            font: "Arial",
          }),
        ],
      })
    );

    const rows = [
      new TableRow({
        tableHeader: true,
        children: [
          tableHeaderCell("Klucz ID & Kontekst", 26),
          tableHeaderCell("Typ", 10),
          tableHeaderCell("Oryginalny tekst w aplikacji", 28),
          tableHeaderCell("Prosty język (do edycji)", 36),
        ],
      }),
    ];

    for (const item of items) {
      const leftCellText = `${item.id}\n[${item.context}]`;
      const editableText = item.plainLanguageSuggestion || item.original;

      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 26, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: lightGrayBg },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: item.id,
                      bold: true,
                      size: 17,
                      color: brandColor,
                      font: "Arial",
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: item.context,
                      size: 16,
                      color: "64748B",
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            bodyCell(item.type, 10),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: lightGrayBg },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: item.original,
                      size: 18,
                      font: "Arial",
                      color: "1E293B",
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 80 },
                  children: [
                    new TextRun({
                      text: `Wskazówka: ${item.editorNotes}`,
                      size: 15,
                      italic: true,
                      color: "64748B",
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 36, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: editableText,
                      size: 18,
                      font: "Arial",
                      bold: true,
                      color: "0F172A",
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    }

    docChildren.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows,
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(docxPath, buffer);
  console.log(`[DOCX] Wygenerowano: ${docxPath}`);
}

async function main() {
  console.log("Rozpoczynanie generowania zestawienia fraz dla redakcji prostego języka...");
  generateJson();
  generateTxt();
  generateCsv();
  await generateDocx();
  console.log("Wszystkie formaty zostały pomyślnie wygenerowane w katalogu exports/ !");
}

main().catch((err) => {
  console.error("Błąd podczas generowania:", err);
  process.exit(1);
});
