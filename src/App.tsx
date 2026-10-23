import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  LayoutGrid,
  ClipboardCheck,
  Library,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Calendar,
  CheckCircle2,
  CreditCard,
  MonitorSmartphone,
  ArrowRight,
  Smartphone,
  Folder,
  ChevronRight,
  ChevronLeft,
  Plus,
  Pencil,
  Trash2,
  PanelRightClose,
  PanelRightOpen,
  Layout,
  ArrowLeft,
  Download,
  AlertOctagon,
  AlertTriangle,
  Bell,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Compass,
  FileQuestion,
  Check,
  GraduationCap,
  List,
  ListChecks,
  Phone,
  Tag,
  Video,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Link2,
  AlertCircle,
  BarChart2,
  FileText,
  FileSpreadsheet,
  FileCode,
  Code2,
  Filter,
  Layers,
  PieChart,
  TrendingUp,
  Activity,
  ChevronRightSquare,
  Bug,
  ClipboardList,
  ShieldAlert,
  Users,
  Clock,
  Scale,
  FileSignature,
  Landmark,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Monitor,
  Info,
  User,
  LogOut,
  Mail,
  Lock,
  ShieldCheck,
  History,
  MessageSquare,
  MessageSquareText,
  Paperclip,
  Inbox,
  Sparkles,
  Send,
  RefreshCw,
  Building2,
} from "lucide-react";
import { UserProfileView } from "./features/profile/UserProfileView";
import { PersonProfileView } from "./features/profile/PersonProfileView";
import { ClientProfile } from "./types";

// ==========================================
// GENERATORY DANYCH TESTOWYCH
// ==========================================

const getChannelIcon = (channelName) => {
  if (!channelName) return null;
  const name = channelName.toLowerCase();
  const tooltip = `Kanał: ${channelName}`;
  if (name.includes("www"))
    return <span title={tooltip}><Monitor size={16} className="text-slate-600 shrink-0" /></span>;
  if (name.includes("aplikacja"))
    return <span title={tooltip}><Smartphone size={16} className="text-slate-600 shrink-0" /></span>;
  if (name.includes("dokumenty"))
    return <span title={tooltip}><FileText size={16} className="text-slate-600 shrink-0" /></span>;
  return <span title={tooltip}><Layout size={16} className="text-slate-600 shrink-0" /></span>;
};

const genPrio = (i) => ({ c: i % 3, w: i % 4, m: (i % 3) + 2 });

const genErrors = (count, prefix) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `e-${prefix}-${i}`,
    title: `Zidentyfikowany błąd dostępności #${i + 1} - wymaga poprawy.`,
    criteria: [
      "1.1.1 Treść nietekstowa",
      "1.4.3 Kontrast",
      "2.1.1 Klawiatura",
      "3.3.2 Etykiety",
    ][i % 4],
    priority: ["Priorytetowy", "Ważny", "Marginalny"][i % 3],
    status: i % 3 === 0 ? "W trakcie" : "Nowy",
  }));

const genViews = (count, prefix) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `v-${prefix}-${i}`,
    name: `Podstrona procesu / Ekran formularza #${i + 1}`,
    channel: i % 2 === 0 ? "WWW" : "Aplikacja",
    score: 60 + ((i * 7) % 40),
    priorities: genPrio(i),
    errors: genErrors((i % 3) + 2, `${prefix}-${i}`),
    history: [
      { date: "01.2024", score: 50 },
      { date: "02.2024", score: 65 },
      { date: "03.2024", score: 60 + ((i * 7) % 40) },
    ],
  }));

const genProcesses = (count, prefix) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `p-${prefix}-${i}`,
    name: `Automatyczny Proces Biznesowy #${i + 1}`,
    stats: {
      views: 8,
      totalViews: 8,
      score: 75 + ((i * 3) % 20),
      priorities: genPrio(i + 5),
    },
    views: genViews(8, `${prefix}-${i}`),
    history: [
      { date: "01.2024", score: 60 },
      { date: "02.2024", score: 70 },
      { date: "03.2024", score: 75 + ((i * 3) % 20) },
    ],
  }));

const genFlatErrors = (count, type) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `#${type}${100 + i}`,
    problem: `Wygenerowany problem testowy #${
      i + 1
    } opisujący błąd dostępności komponentu. Tło ma zbyt niski kontrast w stosunku do tekstu.`,
    recommendation: `Zalecana naprawa dla błędu #${
      i + 1
    }. Zaktualizuj kod źródłowy dodając odpowiednie tagi ARIA lub dostosuj wartości kolorów HEX w CSS.`,
    priority: ["Priorytetowy", "Ważny", "Marginalny"][i % 3],
    channels: i % 2 === 0 ? ["WWW"] : ["Aplikacja", "WWW"],
    dateFound: `1${(i % 9) + 1}.03.2024`,
    criteria: ["1.3.1 Informacje", "1.4.3 Kontrast", "2.1.1 Klawiatura"][i % 3],
    auditViewName: `Widok audytowy ${i + 1}`,
    serviceViewName: `Widok usługi ${i + 1}`,
    processName: `Proces masowy ${(i % 5) + 1}`,
    serviceName: i % 2 === 0 ? "Usługi płatnicze" : "Kredyt hipoteczny",
    auditName: `Audyt okresowy Q1 - ${(i % 3) + 1}`,
    auditStatus: i % 2 === 0 ? "Zakończony" : "W trakcie",
    auditStart: "01.03.2024",
    auditEnd: i % 2 === 0 ? "15.03.2024" : "-",
  }));

const mockSharedServicesData = [
  {
    id: "s1",
    name: "Usługi płatnicze i powiązane z rachunkiem",
    stats: {
      processes: 15,
      views: 65,
      totalViews: 70,
      score: 82.4,
      priorities: { c: 2, w: 15, m: 40 },
    },
    history: [
      { date: "01.2024", score: 65 },
      { date: "02.2024", score: 72 },
      { date: "03.2024", score: 82.4 },
    ],
    processes: [
      {
        id: "p1",
        name: "Otwarcie ROR (istniejący)",
        stats: {
          views: 5,
          totalViews: 5,
          score: 85.2,
          priorities: { c: 0, w: 3, m: 5 },
        },
        history: [
          { date: "01.2024", score: 60 },
          { date: "02.2024", score: 75 },
          { date: "03.2024", score: 85.2 },
        ],
        views: [
          {
            id: "v1",
            name: "Strona główna ing.pl",
            channel: "WWW",
            score: 95.9,
            priorities: { c: 0, w: 0, m: 2 },
            history: [
              { date: "01.2024", score: 80 },
              { date: "02.2024", score: 90 },
              { date: "03.2024", score: 95.9 },
            ],
            errors: [
              {
                id: "e1",
                title: "Brak alternatywy tekstowej dla obrazka promocyjnego.",
                criteria: "1.1.1 Treść nietekstowa",
                priority: "Marginalny",
                status: "Nowy",
              },
              {
                id: "e2",
                title: "Zbyt niski kontrast tekstu w stopce.",
                criteria: "1.4.3 Kontrast",
                priority: "Marginalny",
                status: "Nowy",
              },
            ],
          },
          {
            id: "v2",
            name: "Formularz otwarcia - Krok 1",
            channel: "Aplikacja",
            score: 71.2,
            priorities: { c: 1, w: 3, m: 3 },
            history: [
              { date: "01.2024", score: 40 },
              { date: "02.2024", score: 60 },
              { date: "03.2024", score: 71.2 },
            ],
            errors: [
              {
                id: "e3",
                title: "Zbyt niski kontrast przycisku akceptacji regulaminu.",
                criteria: "1.4.3 Kontrast",
                priority: "Ważny",
                status: "Nowy",
              },
              {
                id: "e4",
                title: "Brak etykiety powiązanej z polem PESEL.",
                criteria: "3.3.2 Etykiety",
                priority: "Priorytetowy",
                status: "Nowy",
              },
              {
                id: "e5",
                title: "Brak komunikatu o błędzie po wysłaniu formularza.",
                criteria: "4.1.3 Komunikaty",
                priority: "Ważny",
                status: "W trakcie",
              },
              {
                id: "e6",
                title: "Niedostępny z klawiatury element zamykający.",
                criteria: "2.1.1 Klawiatura",
                priority: "Ważny",
                status: "Nowy",
              },
            ],
          },
          ...genViews(6, "s1-p1-gen"),
        ],
      },
      ...genProcesses(14, "s1-gen"),
    ],
  },
  {
    id: "s2",
    name: "Kredyt hipoteczny (Wniosek i Kalkulator)",
    stats: {
      processes: 8,
      views: 32,
      totalViews: 40,
      score: 68.1,
      priorities: { c: 5, w: 22, m: 15 },
    },
    history: [
      { date: "01.2024", score: 45 },
      { date: "02.2024", score: 55 },
      { date: "03.2024", score: 68.1 },
    ],
    processes: genProcesses(8, "s2-gen"),
  },
];

const chartTrendData = [
  { m: "Kwi", s: 65, e: 40 },
  { m: "Maj", s: 68, e: 38 },
  { m: "Cze", s: 70, e: 35 },
  { m: "Lip", s: 72, e: 42 },
  { m: "Sie", s: 75, e: 30 },
  { m: "Wrz", s: 78, e: 25 },
  { m: "Paź", s: 80, e: 20 },
  { m: "Lis", s: 82, e: 18 },
  { m: "Gru", s: 85, e: 15 },
  { m: "Sty", s: 86, e: 12 },
  { m: "Lut", s: 86, e: 10 },
  { m: "Mar", s: 88, e: 8 },
];

// ==========================================
// DANE MODUŁU REKLAMACJI I REKOMENDACJI WCAG
// ==========================================

const initialComplaintsData = [
  {
    id: "RKL-2026-089",
    title: "Brak możliwości zatwierdzenia przelewu przez czytnik ekranu NVDA",
    service: "Bankowość internetowa",
    process: "Przelewy krajowe Elixir",
    view: "Ekran potwierdzenia autoryzacji SMS",
    channel: "Desktop WWW",
    source: "Rzecznik Klienta",
    wcagCriterion: "2.1.1 Klawiatura (Poziom A)",
    priority: "Priorytetowy",
    status: "Gotowa rekomendacja",
    responsiblePerson: "Marek Pawlak (Lead Frontend Developer)",
    devTeam: "Marek Pawlak (Lead Frontend Developer)",
    jiraUrl: "https://jira.bank.pl/browse/ACC-104",
    jiraTicket: "ACC-104",
    reporter: "Katarzyna Wiśniewska (Koordynator Dostępności)",
    auditor: "Piotr Smułkowski (Lead WCAG Auditor)",
    date: "18.04.2026",
    slaDeadline: "25.04.2026 (pozostało 4 dni)",
    device: "Desktop Chrome 124 / NVDA 2023.3",
    description: "Klient z dysfunkcją wzroku złożył oficjalną skargę do Rzecznika Klienta: podczas próby wykonania przelewu krajowego w nowej wersji serwisu transakcyjnego przycisk 'Potwierdź kodem SMS' nie przyjmuje fokusu klawiatury przy włączonym NVDA. Powoduje to całkowitą niemożność dokończenia transakcji przez osoby niewidome bez pomocy osób trzecich. Sprawa ma wysoki priorytet ze względu na zbliżający się audyt EAA.",
    hasRecommendation: true,
    recommendation: {
      author: "Piotr Smułkowski",
      role: "Główny Audytor Dostępności WCAG",
      date: "19.04.2026 14:30",
      diagnosis: "Element interfejsu odpowiedzialny za zatwierdzenie został zaimplementowany jako <div> z przypisanym handlerem zdarzenia onClick, bez odpowiedniej semantyki i atrybutów dostępności (brak tabindex='0', brak role='button' oraz brak obsługi klawiszy Enter i Spacja). Czytnik NVDA w trybie przeglądania formularza pomija ten element w sekwencji nawigacji tabulacją.",
      solution: "Zaleca się wykorzystanie semantycznego znacznika <button> zamiast <div> z jednoznaczną etykietą tekstową. W przypadku konieczności zachowania obecnego elementu DOM w szablonie, deweloperzy powinni nadać mu atrybuty role=\"button\" i tabindex=\"0\", obsłużyć klawisze Enter i Spacja w zdarzeniu keydown oraz zapewnić widoczny wskaźnik fokusu klawiatury (:focus-visible).",
      keyAttributes: ["<button>", "role=\"button\"", "tabindex=\"0\"", "aria-label", "keydown (Enter / Spacja)", ":focus-visible"],
      wcagCriteria: "2.1.1 Klawiatura (Poziom A), 4.1.2 Nazwa, rola, wartość (Poziom A)",
    },
    comments: [
      {
        id: 1,
        author: "Katarzyna Wiśniewska",
        role: "Koordynator Dostępności",
        date: "18.04.2026 10:15",
        text: "Zgłoszenie wpłynęło od klienta korzystającego z NVDA. Prosimy o audyt i rekomendację dla zespołu frontend.",
        isStaff: false
      },
      {
        id: 2,
        author: "Piotr Smułkowski",
        role: "Lead WCAG Auditor",
        date: "19.04.2026 14:30",
        text: "Przygotowałem rekomendację wdrożeniową dla deweloperów. Problem wynika z braku semantyki przycisku – opisaliśmy wymagane atrybuty ARIA i obsługę zdarzeń klawiatury.",
        isStaff: true
      }
    ]
  },
  {
    id: "RKL-2026-074",
    title: "Zbyt niski kontrast tekstu w potwierdzeniu kodu BLIK na ekranach OLED",
    service: "Aplikacja mobilna",
    process: "Płatności mobilne BLIK",
    view: "Ekran kodu i potwierdzenia transakcji",
    channel: "Android",
    source: "Infolinia / Formularz WWW",
    wcagCriterion: "1.4.3 Kontrast minimalny (Poziom AA)",
    priority: "Ważny",
    status: "W trakcie wdrożenia",
    responsiblePerson: "Michał Zieliński (Senior Mobile Dev - iOS/Android)",
    devTeam: "Michał Zieliński (Senior Mobile Dev - iOS/Android)",
    jiraUrl: "https://jira.bank.pl/browse/MOB-451",
    jiraTicket: "MOB-451",
    reporter: "Tomasz Dąbrowski (Lead UX)",
    auditor: "Anna Nowak (Senior WCAG Specialist)",
    date: "15.04.2026",
    slaDeadline: "22.04.2026 (pozostało 2 dni)",
    device: "Samsung Galaxy S24 (Android 14) / iOS 17",
    description: "Użytkownicy słabowidzący zgłaszają, że 6-cyfrowy kod BLIK wyświetlany jest szarym kolorem na jasnoszarym tle. Współczynnik kontrastu wynosi zaledwie 2.3:1 (wymagane min. 4.5:1 dla tekstu standardowego lub 3.0:1 dla powiększonego).",
    hasRecommendation: true,
    recommendation: {
      author: "Anna Nowak",
      role: "Senior WCAG Specialist",
      date: "16.04.2026 09:20",
      diagnosis: "Token koloru tekstu w motywie aplikacji mobilnej nie spełnia kryterium minimalnego kontrastu dla tekstu standardowego (16px). Kontrast 2.3:1 jest dalece niewystarczający dla użytkowników słabowidzących oraz w warunkach silnego oświetlenia zewnętrznego.",
      solution: "Należy skorygować token koloru w bibliotece stylów aplikacji mobilnej. Wartość kontrastu dla tekstu musi wynosić minimum 4.5:1 względem tła (dla optymalnej czytelności na ekranach AMOLED zalecany kontrast powyżej 7:1). Implementacja wymaga jedynie zmiany mapowania tokenu w pliku motywu aplikacji.",
      keyAttributes: ["Kontrast min. 4.5:1 (AA)", "Token text-primary", "Kryterium 1.4.3 (AA)"],
      wcagCriteria: "1.4.3 Kontrast minimalny (Poziom AA)",
    },
    comments: [
      {
        id: 1,
        author: "Tomasz Dąbrowski",
        role: "Lead UX",
        date: "15.04.2026 11:00",
        text: "Zgłoszenie dotyczy modułu BLIK w nowym design systemie.",
        isStaff: false
      },
      {
        id: 2,
        author: "Anna Nowak",
        role: "Senior WCAG Specialist",
        date: "16.04.2026 09:25",
        text: "Rekomendacja gotowa. Wystarczy zmiana definicji tokenu barwy w motywie mobilnym, co automatycznie naprawi błąd we wszystkich widokach BLIK.",
        isStaff: true
      }
    ]
  },
  {
    id: "RKL-2026-068",
    title: "Formularz wniosku o pożyczkę gubi fokus klawiatury po błędzie walidacji",
    service: "Kredyty i pożyczki",
    process: "Wnioskowanie o limit w koncie",
    view: "Krok 2: Oświadczenie dochodowe",
    channel: "Desktop WWW",
    source: "Koordynator Dostępności",
    wcagCriterion: "3.3.1 Identyfikacja błędu (Poziom A)",
    priority: "Priorytetowy",
    status: "W trakcie analizy",
    responsiblePerson: "Katarzyna Wiśniewska (Koordynator Dostępności)",
    devTeam: "Katarzyna Wiśniewska (Koordynator Dostępności)",
    jiraUrl: "https://jira.bank.pl/browse/KRED-209",
    jiraTicket: "KRED-209",
    reporter: "Marta Lis (Oficer ds. Zgodności)",
    auditor: "Piotr Smułkowski (Lead WCAG Auditor)",
    date: "19.04.2026",
    slaDeadline: "26.04.2026 (pozostało 5 dni)",
    device: "Wszystkie przeglądarki desktopowe",
    description: "Gdy użytkownik niewidomy lub korzystający wyłącznie z klawiatury pominie wymagane pole i naciśnie 'Dalej', fokus ucieka na początek dokumentu (znacznika <body>), zamiast przenieść się do pierwszego błędnego pola wraz z odczytaniem komunikatu o błędzie.",
    hasRecommendation: false,
    comments: [
      {
        id: 1,
        author: "Marta Lis",
        role: "Oficer ds. Zgodności",
        date: "19.04.2026 16:45",
        text: "Reklamacja wpłynęła z infolinii dla klientów z niepełnosprawnościami. Prosimy o wsparcie w zdefiniowaniu poprawnego zachowania fokusu.",
        isStaff: false
      }
    ]
  },
  {
    id: "RKL-2026-052",
    title: "Tabela opłat i prowizji PDF nie odczytuje poprawnie nagłówków kolumn",
    service: "Karty i dokumenty",
    process: "Pobieranie dokumentów i regulaminów",
    view: "Tabela Opłat i Prowizji PDF 2026",
    channel: "Dokumenty",
    source: "Audytor wewnętrzny",
    wcagCriterion: "1.3.1 Informacje i relacje (Poziom A)",
    priority: "Marginalny",
    status: "Zamknięte",
    responsiblePerson: "Grzegorz Kamiński (Product Manager)",
    devTeam: "Grzegorz Kamiński (Product Manager)",
    jiraUrl: "https://jira.bank.pl/browse/DOC-88",
    jiraTicket: "DOC-88",
    reporter: "Grzegorz Kamiński (Product Manager)",
    auditor: "Piotr Smułkowski",
    date: "10.04.2026",
    slaDeadline: "17.04.2026 (zrealizowane)",
    device: "Adobe Acrobat Reader DC / NVDA",
    description: "W wygenerowanym dokumencie PDF struktura tagów tabeli zawierała błędy w zagnieżdżeniu tagów <TH> i <TD>, co powodowało dezorientację użytkowników czytników ekranu.",
    hasRecommendation: true,
    recommendation: {
      author: "Piotr Smułkowski",
      role: "Główny Audytor Dostępności WCAG",
      date: "11.04.2026 12:00",
      diagnosis: "W strukturze tagów wygenerowanego pliku PDF wiersze tabeli nie posiadają poprawnie oznaczonych komórek nagłówkowych, co uniemożliwia czytnikom ekranu powiązanie wartości z etykietami kolumn.",
      solution: "W szablonie generatora PDF należy zdefiniować pierwszy wiersz jako nagłówkowy z tagami <TH> oraz ustawić atrybut Scope=\"Col\" dla każdej kolumny, co zagwarantuje prawidłowe czytanie struktury tabeli w czytnikach PDF/UA.",
      keyAttributes: ["Tag <TH>", "Atrybut Scope=\"Col\"", "Standard PDF/UA (ISO 14289-1)"],
      wcagCriteria: "1.3.1 Informacje i relacje (Poziom A)",
    },
    comments: [
      {
        id: 1,
        author: "Grzegorz Kamiński",
        role: "Product Manager",
        date: "12.04.2026 15:00",
        text: "Szablon zaktualizowany zgodnie z wytycznymi audytora. Przetestowano w NVDA.",
        isStaff: false
      }
    ]
  }
];

const COMPLAINT_SOURCES = [
  "Rzecznik Klienta",
  "Infolinia / Formularz WWW",
  "Koordynator Dostępności",
  "Audytor wewnętrzny",
  "Zgłoszenie z oddziału banku",
  "Organ nadzorczy / KNF / PFRON",
];

const RESPONSIBLE_USERS_LIST = [
  "Marek Pawlak (Lead Frontend Developer)",
  "Katarzyna Wiśniewska (Koordynator Dostępności)",
  "Piotr Smułkowski (Główny Audytor WCAG)",
  "Tomasz Straszak (Dedykowany Opiekun Klienta)",
  "Anna Nowak (Architekt UX / Accessibility)",
  "Michał Zieliński (Senior Mobile Dev - iOS/Android)",
  "Grzegorz Kamiński (Product Manager)",
  "Marta Lis (Oficer ds. Zgodności i Compliance)",
];

const DEV_TEAMS_LIST = RESPONSIBLE_USERS_LIST;

const COMPLAINT_STATUS_OPTIONS = [
  { value: "Zweryfikowane pozytywnie", label: "Zweryfikowane pozytywnie" },
  { value: "Odrzucone", label: "Odrzucone" },
  { value: "Zamknięte", label: "Zamknięte" },
  { value: "Nowe", label: "Nowe zgłoszenie" },
  { value: "W trakcie analizy", label: "W trakcie analizy" },
  { value: "Gotowa rekomendacja", label: "Gotowa rekomendacja" },
  { value: "W trakcie wdrożenia", label: "W trakcie wdrożenia" },
];

// ==========================================
// DLA CIEBIE / NASZA WSPÓŁPRACA - CENTRUM KOMUNIKACJI I OFERT
// ==========================================

const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    category: "komunikaty",
    categoryLabel: "Nowość w systemie",
    categoryColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Sparkles,
    date: "Dzisiaj, 09:15",
    title: "Weryfikacja dostępności dokumentów PDF/UA w procesach CI/CD",
    description: "Udostępniliśmy integrację API pozwalającą na automatyczne audytowanie generowanych regulaminów i umów bankowych w formatach PDF/UA bezpośrednio w potokach wdrożeniowych.",
    meta: "Wersja API v2.4 • Webhooki i alerty SLA",
    ctaText: "Poznaj dokumentację i aktywuj",
    actionMessage: "Instrukcja konfiguracji API została wysłana na Twój adres e-mail.",
    unread: true,
  },
  {
    id: "ann-2",
    category: "komunikaty",
    categoryLabel: "Webinar & Szkolenie",
    categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Video,
    date: "28 maja 2026, godz. 11:00",
    title: "Warsztat na żywo: WCAG 2.2 w bankowości internetowej i mobilnej",
    description: "Praktyczne warsztaty dla projektantów UX i deweloperów: audytowanie nowych kryteriów sukcesu (m.in. 2.5.7 Dragging Movements i 3.3.8 Accessible Authentication). Pokażemy testy na żywo z czytnikami NVDA oraz VoiceOver.",
    meta: "Prowadzący: dr Piotr Smułkowski & Tomasz Straszak (90 min, Certyfikat)",
    ctaText: "Zarezerwuj bezpłatne miejsce",
    actionMessage: "Dziękujemy! Twoje miejsce na webinarze zostało zarezerwowane. Zaproszenie kalendarzowe wysłano na maila.",
    unread: true,
  },
  {
    id: "ann-3",
    category: "oferty",
    categoryLabel: "Oferta dedykowana",
    categoryColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Tag,
    date: "Oferta ważna do 30.06.2026",
    title: "Pakiet 5 Reaudytów Ekspresowych (SLA 48h) z rabatem 20%",
    description: "Przed planowanym wdrożeniem produkcyjnym nowej aplikacji skorzystaj ze specjalnego pakietu szybkiej weryfikacji poprawek zgłoszonych w audycie głównym. Gwarantowany czas raportu reaudytu: 48h.",
    meta: "Dedykowany dla zespołów Digital Banking & Mobile",
    ctaText: "Aktywuj pakiet ze zniżką 20%",
    actionMessage: "Zapytanie o pakiet reaudytów zostało przekazane. Twój doradca Tomasz Straszak wkrótce się z Tobą skontaktuje.",
    unread: true,
  },
  {
    id: "ann-4",
    category: "komunikaty",
    categoryLabel: "Aktualność regulacyjna",
    categoryColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: BookOpen,
    date: "14 maja 2026",
    title: "Przewodnik wdrożeniowy: Europejski Akt o Dostępności (EAA) i KNF",
    description: "Opracowaliśmy eksperckie kompendium wiedzy o nadchodzących terminach ustawowych EAA/PAD dla sektora bankowego, procedurach kontrolnych oraz wzorcach deklaracji dostępności.",
    meta: "Format PDF (28 stron) • Wzory dokumentacji prawnej",
    ctaText: "Pobierz bezpłatny przewodnik",
    actionMessage: "Rozpoczęto pobieranie przewodnika EAA w formacie PDF.",
    unread: false,
  },
  {
    id: "ann-5",
    category: "oferty",
    categoryLabel: "Nowa usługa",
    categoryColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Users,
    date: "10 maja 2026",
    title: "Audyty Dostępności Architektonicznej Placówek i Bankomatów",
    description: "Rozszerzamy zakres audytów o placówki stacjonarne: weryfikacja dostępności wejść, pętli indukcyjnych dla osób słabosłyszących oraz oznakowania dotykowego bankomatów i wpłatomatów.",
    meta: "Certyfikacja dostępności fizycznej wg normy PN-EN 301 549",
    ctaText: "Zapytaj o wycenę dla sieci oddziałów",
    actionMessage: "Wysłano zapytanie do zespołu ds. dostępności architektonicznej.",
    unread: false,
  },
];

// ==========================================
// SYSTEM TICKETÓW & KONSULTACJI Z AUDYTORAMI
// ==========================================

const INITIAL_AUDITOR_TICKETS = [
  {
    id: "TCK-104",
    title: "Czy kontrast 3.8:1 dla aktywnego stanu checkboxa spełnia WCAG 2.2?",
    category: "error",
    categoryLabel: "Błąd w audycie",
    categoryColor: "bg-red-50 text-red-700 border-red-200",
    contextType: "error",
    contextId: "ERR-204",
    contextTitle: "Błąd #ERR-204: Kontrast indykatora w formularzu przelewu",
    contextPath: "Audyty > Aplikacja Mobilna iOS > Formularz przelewu",
    contextView: "raport-bledy",
    assignedDeveloper: "Marek Kowalski",
    status: "auditor_reply",
    statusLabel: "Nowa odpowiedź audytora",
    priority: "urgent",
    priorityLabel: "Pilny (Bloker)",
    createdAt: "Dzisiaj, 09:30",
    updatedAt: "15 min temu",
    unreadByClient: true,
    assignedAuditor: {
      name: "Tomasz Straszak",
      role: "Dedykowany Opiekun Klienta",
      avatar: "https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg",
    },
    messages: [
      {
        id: "m-104-1",
        sender: "client",
        authorName: "Piotr Smułkowski",
        authorRole: "Koordynator Dostępności (Bank)",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
        date: "Dzisiaj, 09:30",
        content: "Cześć Tomku, zespół frontendowy przygotował poprawkę dla błędu #ERR-204 w formularzu przelewu. Zwiększyli kontrast ramki zaznaczonego checkboxa do 3.8:1 na białym tle. Czy w świetle kryterium 1.4.11 Non-text Contrast w WCAG 2.2 taki współczynnik jest dla Was w 100% akceptowalny, czy musimy bezwzględnie dociągnąć do 4.5:1? Mamy jutro release kandydat.",
        attachments: [
          { name: "zrzut_checkbox_state_active.png", size: "240 KB" }
        ],
      },
      {
        id: "m-104-2",
        sender: "auditor",
        authorName: "Tomasz Straszak",
        authorRole: "Dedykowany Opiekun Klienta",
        authorAvatar: "https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg",
        date: "Dzisiaj, 10:12 (15 min temu)",
        content: "Cześć Piotrze! Skonsultowałem tę kwestię natychmiast z naszym audytorem wiodącym WCAG. Dobra wiadomość: dla komponentów interfejsu użytkownika (formularze, kontrolki, ramki pól wyboru) kryterium sukcesu 1.4.11 Non-text Contrast wymaga kontrastu minimum 3.0:1 względem przyległego tła (współczynnik 4.5:1 dotyczy wyłącznie standardowego tekstu z kryterium 1.4.3). Współczynnik 3.8:1 jest w pełni zgodny z WCAG 2.1 oraz WCAG 2.2 na poziomie AA! Audytor potwierdził, że możecie bezpiecznie wdrażać ten komponent do jutrzejszego release'u.",
        attachments: [
          { name: "wytyczna_wcag_1_4_11_komponenty.pdf", size: "1.2 MB" }
        ],
      },
    ],
  },
  {
    id: "TCK-103",
    title: "Rekomendacja kodu dla skargi #RKL-089 – alternatywa tekstowa wykresów giełdowych",
    category: "complaint",
    categoryLabel: "Skarga klienta",
    categoryColor: "bg-amber-50 text-amber-700 border-amber-200",
    contextType: "complaint",
    contextId: "RKL-2026-089",
    contextTitle: "Skarga #RKL-2026-089: Niedostępne wykresy notowań dla NVDA",
    contextPath: "Skargi i reklamacje > #RKL-2026-089",
    contextView: "reklamacja-szczegoly",
    assignedDeveloper: "Kamil Bednarek",
    status: "waiting_auditor",
    statusLabel: "W analizie audytora",
    priority: "normal",
    priorityLabel: "Standardowy",
    createdAt: "Wczoraj, 14:15",
    updatedAt: "Wczoraj, 16:40",
    unreadByClient: false,
    assignedAuditor: {
      name: "dr Piotr Smułkowski",
      role: "Główny Audytor WCAG",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    messages: [
      {
        id: "m-103-1",
        sender: "client",
        authorName: "Piotr Smułkowski",
        authorRole: "Koordynator Dostępności (Bank)",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
        date: "Wczoraj, 14:15",
        content: "Dzień dobry Panie Doktorze, otrzymaliśmy skargę od niewidomego klienta (skarga #RKL-2026-089), który nie jest w stanie odczytać wykresów świecowych notowań giełdowych w portalu Makler. Zespół Dev pyta o wzorcową implementację tabeli ukrytej dostępnej pod skrótem klawiszowym lub aria-describedby. Czy moglibyśmy prosić o wytyczną techniczną?",
      },
      {
        id: "m-103-2",
        sender: "auditor",
        authorName: "dr Piotr Smułkowski",
        authorRole: "Główny Audytor WCAG",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        date: "Wczoraj, 16:40",
        content: "Dzień dobry. Zapoznałem się ze strukturą komponentu wykresu. Przygotowuję dla Waszego zespołu deweloperskiego wzorcowy kod HTML/ARIA z tabelą semantyczną transponującą serie danych w czasie rzeczywistym oraz zoptymalizowaną pod czytniki ekranu NVDA i JAWS. Pełną próbkę kodu prześlę dziś do końca dnia roboczego.",
      },
    ],
  },
  {
    id: "TCK-102",
    title: "Harmonogram i zakres reaudytu modułu Płatności Blik po refaktorze UI",
    category: "audit",
    categoryLabel: "Audyt całościowy",
    categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
    contextType: "audit",
    contextId: "AUD-2026-001",
    contextTitle: "Audyt: Portal Klienta - Serwis Transakcyjny WWW",
    contextPath: "Audyty > Portal Klienta (Serwis Transakcyjny)",
    contextView: "raport-szczegoly",
    assignedDeveloper: "Aleksandra Nowak",
    status: "resolved",
    statusLabel: "Rozwiązany",
    priority: "normal",
    priorityLabel: "Standardowy",
    createdAt: "18 maja 2026",
    updatedAt: "19 maja 2026",
    unreadByClient: false,
    assignedAuditor: {
      name: "Tomasz Straszak",
      role: "Dedykowany Opiekun Klienta",
      avatar: "https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg",
    },
    messages: [
      {
        id: "m-102-1",
        sender: "client",
        authorName: "Piotr Smułkowski",
        authorRole: "Koordynator Dostępności (Bank)",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
        date: "18 maja 2026, 11:00",
        content: "Tomku, zamknęliśmy poprawki dla 6 zgłoszonych błędów w module Blik. Kiedy audytor mógłby przystąpić do reaudytu weryfikacyjnego na środowisku testowym?",
      },
      {
        id: "m-102-2",
        sender: "auditor",
        authorName: "Tomasz Straszak",
        authorRole: "Dedykowany Opiekun Klienta",
        authorAvatar: "https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg",
        date: "19 maja 2026, 09:20",
        content: "Potwierdzam rezerwację terminu reaudytu na najbliższy czwartek od godz. 09:00. Środowisko testowe zostało pomyślnie zweryfikowane. Raport z reaudytu dostarczymy w piątek do godz. 14:00.",
      },
    ],
  },
  {
    id: "TCK-101",
    title: "Wzór oświadczenia Deklaracji Dostępności pod wymogi ustawy i EAA",
    category: "general",
    categoryLabel: "Konsultacja ogólna",
    categoryColor: "bg-purple-50 text-purple-700 border-purple-200",
    contextType: "general",
    contextTitle: "Konsultacja ogólna: Deklaracja Dostępności Cyfrowej",
    contextPath: "Baza wiedzy & Regulacje EAA",
    assignedDeveloper: "Marek Kowalski",
    status: "resolved",
    statusLabel: "Rozwiązany",
    priority: "low",
    priorityLabel: "Niski",
    createdAt: "12 maja 2026",
    updatedAt: "13 maja 2026",
    unreadByClient: false,
    assignedAuditor: {
      name: "Tomasz Straszak",
      role: "Dedykowany Opiekun Klienta",
      avatar: "https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg",
    },
    messages: [
      {
        id: "m-101-1",
        sender: "client",
        authorName: "Piotr Smułkowski",
        authorRole: "Koordynator Dostępności (Bank)",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
        date: "12 maja 2026, 15:30",
        content: "Czy posiadacie aktualny wzór deklaracji dostępności zgodny z wytycznymi Ministerstwa Cyfryzacji oraz nadchodzącym EAA dla banków komercyjnych?",
      },
      {
        id: "m-101-2",
        sender: "auditor",
        authorName: "Tomasz Straszak",
        authorRole: "Dedykowany Opiekun Klienta",
        authorAvatar: "https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg",
        date: "13 maja 2026, 10:05",
        content: "Cześć Piotrze! Oczywiście, przesyłam zaktualizowany wzorzec deklaracji z uzupełnionymi klauzulami prawnymi wymaganymi przez KNF i EAA. W pliku zaznaczyłem na żółto pola do uzupełnienia danymi banku.",
        attachments: [
          { name: "wzorzec_deklaracji_dostepnosci_2026.docx", size: "85 KB" }
        ],
      },
    ],
  },
];

// ==========================================
// KOMPONENTY DLA KOORDYNATORA DOSTĘPNOŚCI:
// TOAST, ZLECENIE REAUDYTU, EDYCJA SKARGI
// ==========================================

function ToastNotification({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[120] max-w-md bg-slate-900 text-white rounded-xl shadow-2xl p-4 flex items-start gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
        {toast.type === "info" ? (
          <Info size={18} />
        ) : (
          <CheckCircle2 size={18} />
        )}
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <div className="text-xs font-bold text-white mb-0.5">{toast.title || "Powiadomienie systemu"}</div>
        <div className="text-xs text-slate-300 leading-relaxed font-medium">{toast.text}</div>
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
        aria-label="Zamknij powiadomienie"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Ujednolicony, dostępny komponent przycisku zlecenia re-audytu
function ReauditButton({
  onClick,
  variant = "primary", // "primary" | "secondary" | "icon"
  size = "md", // "sm" | "md"
  label = "Zleć re-audyt",
  title = "Zleć formalną weryfikację wprowadzonych poprawek do audytora",
  className = "",
  fullWidth = false,
  disabled = false,
}) {
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={title}
        disabled={disabled}
        className={`w-8 h-8 rounded-lg border border-blue-200/80 bg-blue-50/70 text-[#0038F8] hover:bg-blue-100 hover:border-blue-300 flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <ClipboardCheck size={14} className="shrink-0" />
      </button>
    );
  }

  const baseClasses =
    "inline-flex items-center justify-center font-bold transition-all cursor-pointer rounded-lg shadow-xs select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-xs gap-1.5"
      : "px-3.5 py-2 text-xs font-bold gap-1.5";

  const variantClasses =
    variant === "primary"
      ? "bg-[#0038F8] hover:bg-[#002ECC] text-white border border-transparent shadow-xs active:translate-y-px"
      : "bg-blue-50/80 hover:bg-blue-100 text-[#0038F8] border border-blue-200 shadow-2xs active:translate-y-px";

  const iconSize = size === "sm" ? 13 : 14;

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      <ClipboardCheck size={iconSize} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function ReauditRequestModal({
  isOpen,
  onClose,
  targetTitle,
  targetType = "Audyt WCAG 2.1 AA",
  auditor = "Piotr Smułkowski",
  onSubmit,
}) {
  const [scope, setScope] = useState("priority");
  const [speed, setSpeed] = useState("standard");
  const [stagingUrl, setStagingUrl] = useState("https://staging-acc.bank.pl/release-2026-q2");
  const [notes, setNotes] = useState("");
  const [requestConsultation, setRequestConsultation] = useState(false);
  const [notifyDevTeam, setNotifyDevTeam] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        targetTitle,
        scope,
        speed,
        stagingUrl,
        notes,
        requestConsultation,
        notifyDevTeam,
        date: new Date().toLocaleDateString("pl-PL"),
      });
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reaudit-modal-title"
      className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038F8] border border-blue-200/80 flex items-center justify-center shrink-0 mt-0.5">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0038F8] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80">
                  Panel Koordynatora Dostępności
                </span>
                <span className="text-xs text-slate-400 font-semibold">• {targetType}</span>
              </div>
              <h2 id="reaudit-modal-title" className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                Zlecenie formalnego re-audytu dostępności
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Zgłoszenie wdrożonych poprawek do weryfikacji przez akredytowanego audytora WCAG.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Zamknij okno"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Target Pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-semibold">Element audytowany:</span>
            <span className="font-bold text-slate-900 text-right truncate">{targetTitle}</span>
          </div>

          {/* Dedicated Auditor Card */}
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-200/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white border border-blue-200 flex items-center justify-center font-bold text-[#0038F8] text-sm shrink-0 shadow-xs">
                PS
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">{auditor}</span>
                  <span className="text-[10px] font-bold bg-[#0038F8] text-white px-1.5 py-0.5 rounded">
                    Lead Auditor
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium mt-0.5">
                  Dedykowany opiekun i audytor prowadzący Twojej organizacji
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-600 flex flex-col sm:items-end font-semibold">
              <span className="text-[#0038F8]">p.smulkowski@w-ally.pl</span>
              <span className="text-slate-400">+48 22 123 45 67</span>
            </div>
          </div>

          {/* Scope Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              1. Zakres weryfikacji re-audytowej:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  scope === "priority"
                    ? "bg-blue-50/50 border-[#0038F8] ring-1 ring-[#0038F8]/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="scope"
                  value="priority"
                  checked={scope === "priority"}
                  onChange={() => setScope("priority")}
                  className="mt-0.5 accent-[#0038F8]"
                />
                <div>
                  <div className="font-bold text-slate-900">Błędy priorytetowe (blokery)</div>
                  <div className="text-slate-500 font-normal mt-0.5 leading-relaxed">
                    Weryfikacja tylko krytycznych niezgodności przed wdrożeniem na produkcję.
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  scope === "full"
                    ? "bg-blue-50/50 border-[#0038F8] ring-1 ring-[#0038F8]/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="scope"
                  value="full"
                  checked={scope === "full"}
                  onChange={() => setScope("full")}
                  className="mt-0.5 accent-[#0038F8]"
                />
                <div>
                  <div className="font-bold text-slate-900">Pełny re-audyt kryteriów</div>
                  <div className="text-slate-500 font-normal mt-0.5 leading-relaxed">
                    Ponowne sprawdzenie wszystkich 49 kryteriów WCAG 2.1 AA i aktualizacja wskaźnika.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Staging URL & Speed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                URL środowiska testowego (Staging / Branch):
              </label>
              <input
                type="text"
                value={stagingUrl}
                onChange={(e) => setStagingUrl(e.target.value)}
                placeholder="https://staging.bank.pl/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tryb realizacji zlecenia:
              </label>
              <select
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                <option value="standard">Standardowy (do 5 dni roboczych)</option>
                <option value="express">Ekspresowy pre-release (SLA 48h)</option>
                <option value="scheduled">Planowane wdrożenie sprintowe</option>
              </select>
            </div>
          </div>

          {/* Notes for Auditor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Opis wprowadzonych poprawek przez zespół techniczny:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Podaj informacje dla audytora: np. zespół frontend wymienił przyciski div na button, poprawiono fokus klawiatury w modalach, podwyższono kontrast kolorów..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 leading-relaxed"
            />
          </div>

          {/* Additional Options Checkboxes */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={requestConsultation}
                onChange={(e) => setRequestConsultation(e.target.checked)}
                className="rounded text-[#0038F8] accent-[#0038F8] w-4 h-4"
              />
              <span>Poproś o krótkie spotkanie online (30 min) z audytorem przed weryfikacją</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={notifyDevTeam}
                onChange={(e) => setNotifyDevTeam(e.target.checked)}
                className="rounded text-[#0038F8] accent-[#0038F8] w-4 h-4"
              />
              <span>Wyślij automatyczne powiadomienie e-mail do przypisanego zespołu deweloperskiego</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Send size={14} />
              <span>Przekaż zlecenie do audytora</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ComplaintEditModal({ isOpen, onClose, complaint, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    devTeam: RESPONSIBLE_USERS_LIST[0],
    source: COMPLAINT_SOURCES[0],
    status: "Gotowa rekomendacja",
    priority: "Priorytetowy",
    wcagCriterion: "2.1.1 Klawiatura (Poziom A)",
    channel: "Desktop WWW",
    device: "Desktop Chrome 124 / NVDA 2023.3",
    jiraUrl: "",
  });

  useEffect(() => {
    if (complaint) {
      setFormData({
        title: complaint.title || "",
        description: complaint.description || "",
        devTeam: complaint.responsiblePerson || complaint.devTeam || RESPONSIBLE_USERS_LIST[0],
        source: complaint.source || COMPLAINT_SOURCES[0],
        status: complaint.status || "Gotowa rekomendacja",
        priority: complaint.priority || "Priorytetowy",
        wcagCriterion: complaint.wcagCriterion || "2.1.1 Klawiatura (Poziom A)",
        channel: complaint.channel || "Desktop WWW",
        device: complaint.device || "Desktop Chrome 124 / NVDA 2023.3",
        jiraUrl: complaint.jiraUrl || "",
      });
    }
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticketKey = (formData.jiraUrl || "").replace(/https?:\/\/[^/]+\/browse\//, "").trim();
    const fullUrl = formData.jiraUrl ? (formData.jiraUrl.startsWith("http") ? formData.jiraUrl : `https://jira.bank.pl/browse/${formData.jiraUrl}`) : "";
    if (onSave) {
      onSave({
        ...complaint,
        ...formData,
        responsiblePerson: formData.devTeam,
        jiraUrl: fullUrl,
        jiraTicket: ticketKey,
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-complaint-title"
      className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038F8] border border-blue-200/80 flex items-center justify-center shrink-0 mt-0.5">
              <Pencil size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0038F8] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80">
                  Panel Koordynatora Dostępności
                </span>
                <span className="font-mono text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  #{complaint.id}
                </span>
              </div>
              <h2 id="edit-complaint-title" className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                Edycja zgłoszenia i przypisanie osoby odpowiedzialnej
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Modyfikuj treść skargi, przypisz osobę odpowiedzialną za wdrożenie lub zmień status postępowania.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Zamknij okno"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tytuł zgłoszenia skargi / błędu:
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Osoba odpowiedzialna:
              </label>
              <select
                value={formData.devTeam}
                onChange={(e) => setFormData({ ...formData, devTeam: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                {RESPONSIBLE_USERS_LIST.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Źródło skargi / Nadawca:
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                {COMPLAINT_SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Status reklamacji:
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                {!COMPLAINT_STATUS_OPTIONS.some((opt) => opt.value === formData.status) && (
                  <option value={formData.status}>{formData.status}</option>
                )}
                {COMPLAINT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Powiązanie z Jira */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Link2 size={13} className="text-[#0038F8]" />
                <span>Link do zadania w Jira (zespół Dev):</span>
              </span>
              {formData.jiraUrl && (
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Klucz: {formData.jiraUrl.replace(/https?:\/\/[^/]+\/browse\//, "")}
                </span>
              )}
            </label>
            <div className="relative">
              <Link2 size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={formData.jiraUrl || ""}
                onChange={(e) => setFormData({ ...formData, jiraUrl: e.target.value })}
                placeholder="np. https://jira.bank.pl/browse/ACC-104 lub ACC-104"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Koordynator może podpiąć zadanie Jira, by po wdrożeniu przez zespół programistów zweryfikować poprawkę i skierować ją do re-audytu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Priorytet błędu:
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                <option value="Priorytetowy">🚨 Priorytetowy (Bloker)</option>
                <option value="Ważny">🟠 Ważny</option>
                <option value="Marginalny">🔵 Marginalny</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dotknięte kryterium WCAG:
              </label>
              <input
                type="text"
                value={formData.wcagCriterion}
                onChange={(e) => setFormData({ ...formData, wcagCriterion: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Szczegółowy opis problemu zgłoszony przez klienta:
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kanał:
              </label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                <option value="Desktop WWW">Desktop WWW</option>
                <option value="Android">Aplikacja Android</option>
                <option value="iOS">Aplikacja iOS</option>
                <option value="Dokumenty">Dokumenty PDF</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Środowisko i czytnik:
              </label>
              <input
                type="text"
                value={formData.device}
                onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Check size={14} />
              <span>Zapisz zmiany</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// DOMYŚLNY PROFIL KLIENTA I ORGANIZACJI (ERSTE GROUP)
// ==========================================

const INITIAL_CLIENT_PROFILE: ClientProfile = {
  // 1. Profil organizacji & Branding (Erste Group jako domyślne)
  orgName: "Erste Group Bank AG",
  orgShortName: "Erste",
  orgLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHgYtVh9h9eIsSNsP76-1aodQJJzy5gNNVXR6n_oyQ0g&s",
  orgAltText: "Logo Erste Group Bank",
  taxId: "PL 525-000-00-00",
  sector: "Bankowość i finanse",
  domain: "https://www.erstegroup.com",
  accountTier: "Enterprise EAA & WCAG 2.1 AA",

  // 2. Standardy audytowe & WCAG
  wcagStandard: "WCAG 2.1 AA",
  targetScore: 90,
  auditCoordinatorName: "Kinga Wróblewska",
  auditCoordinatorEmail: "kinga.wroblewska@erstegroup.com",
  auditCoordinatorPhone: "+48 22 500 12 34",
  department: "Departament Transformacji Cyfrowej i UX",
  declarationDate: "2026-03-15",
  declarationUrl: "https://www.erstegroup.com/pl/deklaracja-dostepnosci",

  // 3. Profil użytkownika
  userName: "Kinga Wróblewska",
  userRole: "Koordynator Dostępności Cyfrowej",
  userEmail: "kinga.wroblewska@erstegroup.com",
  userPhone: "+48 601 234 567",
  userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  twoFactorEnabled: true,

  // 4. Powiadomienia & Raportowanie
  notifyCriticalErrors: true,
  notifyAuditorReplies: true,
  weeklyDigest: true,
  declarationReminders: true,

  // 5. Zespół deweloperski i wykonawczy (Koordynator)
  teamMembers: [
    {
      id: "tm-1",
      name: "Marek Kowalski",
      email: "m.kowalski@erstegroup.com",
      role: "Lead Frontend Developer (React / Next.js)",
      specialization: "frontend",
      specializationLabel: "Frontend WWW",
      assignedServices: ["Serwis transakcyjny", "Portal informacyjny", "Kalkulator kredytowy"],
      status: "active",
      openErrorsCount: 12,
      resolvedErrorsCount: 28,
      assignedTicketsCount: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marek&backgroundColor=b6e3f4",
      phone: "+48 501 112 233",
    },
    {
      id: "tm-2",
      name: "Aleksandra Nowak",
      email: "a.nowak@erstegroup.com",
      role: "Senior iOS Developer (Swift)",
      specialization: "mobile",
      specializationLabel: "Aplikacja iOS",
      assignedServices: ["Aplikacja mobilna iOS", "Moduł BLIK"],
      status: "active",
      openErrorsCount: 6,
      resolvedErrorsCount: 19,
      assignedTicketsCount: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ola&backgroundColor=ffdfbf",
      phone: "+48 502 223 344",
    },
    {
      id: "tm-3",
      name: "Paweł Wiśniewski",
      email: "p.wisniewski@erstegroup.com",
      role: "Senior Android Developer (Kotlin)",
      specialization: "mobile",
      specializationLabel: "Aplikacja Android",
      assignedServices: ["Aplikacja mobilna Android", "Autoryzacja mobilna"],
      status: "active",
      openErrorsCount: 8,
      resolvedErrorsCount: 14,
      assignedTicketsCount: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pawel&backgroundColor=d1d4f9",
      phone: "+48 503 334 455",
    },
    {
      id: "tm-4",
      name: "Magdalena Ciesielska",
      email: "m.ciesielska@erstegroup.com",
      role: "QA Accessibility Specialist / Tester",
      specialization: "qa",
      specializationLabel: "Dostępność QA (NVDA/TalkBack)",
      assignedServices: ["Wszystkie serwisy", "Formularze wnioskowe"],
      status: "active",
      openErrorsCount: 3,
      resolvedErrorsCount: 42,
      assignedTicketsCount: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Magda&backgroundColor=ffd5dc",
      phone: "+48 504 445 566",
    },
    {
      id: "tm-5",
      name: "Kamil Bednarek",
      email: "k.bednarek@erstegroup.com",
      role: "Senior UI/UX Designer (Design System)",
      specialization: "design",
      specializationLabel: "Design System & Kontrasty",
      assignedServices: ["Komponenty UI", "Tokeny kolorów", "Formularze"],
      status: "active",
      openErrorsCount: 5,
      resolvedErrorsCount: 21,
      assignedTicketsCount: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamil&backgroundColor=c0aede",
      phone: "+48 505 556 677",
    },
  ],
};

// ==========================================
// GŁÓWNY LAYOUT (ZARZĄDZANIE STANEM LOGOWANIA)
// ==========================================

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState("przeglad");
  const [clientProfile, setClientProfile] = useState<ClientProfile>(() => {
    try {
      const saved = localStorage.getItem("wcag_auditor_client_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.teamMembers || parsed.teamMembers.length === 0) {
          parsed.teamMembers = INITIAL_CLIENT_PROFILE.teamMembers;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_CLIENT_PROFILE;
  });
  const [selectedComplaintId, setSelectedComplaintId] = useState("RKL-2026-089");
  const [complaintsList, setComplaintsList] = useState(initialComplaintsData);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Stan dla Koordynatora Dostępności
  const [isReauditModalOpen, setIsReauditModalOpen] = useState(false);
  const [reauditContext, setReauditContext] = useState({
    targetTitle: "Portal informacyjny - wybrane podstrony",
    targetType: "Audyt WCAG 2.1 AA",
    auditor: "Piotr Smułkowski",
  });
  const [toast, setToast] = useState(null);
  const [isComplaintEditOpen, setIsComplaintEditOpen] = useState(false);
  const [complaintToEdit, setComplaintToEdit] = useState(null);

  // Stan dla systemu ticketów i konsultacji z audytorami
  const [tickets, setTickets] = useState(INITIAL_AUDITOR_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState("TCK-104");
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTicketInitialContext, setNewTicketInitialContext] = useState(null);

  // Filtry kontekstowe dla Koordynatora (wg deweloperów z zespołu)
  const [developerErrorFilter, setDeveloperErrorFilter] = useState(null);
  const [developerTicketFilter, setDeveloperTicketFilter] = useState(null);
  const [profileInitialTab, setProfileInitialTab] = useState<
    "branding" | "team" | "wcag" | "account" | "notifications"
  >("account");

  const handleOpenProfile = (
    tab: "branding" | "team" | "wcag" | "account" | "notifications" = "account"
  ) => {
    setProfileInitialTab(tab);
    setCurrentView("profil");
  };

  // Dedykowany widok profilu osoby (Opiekun, Koordynator, Deweloper)
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [personProfileBackView, setPersonProfileBackView] = useState("przeglad");

  const handleViewPersonProfile = (person: any, backView?: string) => {
    setSelectedPerson(person);
    setPersonProfileBackView(backView || currentView || "przeglad");
    setCurrentView("osoba-profil");
  };

  const unreadTicketsCount = tickets.filter((t) => t.unreadByClient).length;

  const handleOpenNewTicket = (context = null) => {
    setNewTicketInitialContext(context);
    setIsNewTicketModalOpen(true);
  };

  const handleOpenTicketThread = (ticketId) => {
    setSelectedTicketId(ticketId);
    setCurrentView("tickety");
  };

  const showToast = (title, text, type = "success") => {
    setToast({ title, text, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleOpenReaudit = (title, type = "Audyt WCAG 2.1 AA", auditor = "Piotr Smułkowski") => {
    setReauditContext({
      targetTitle: title || "Portal informacyjny - wybrane podstrony",
      targetType: type,
      auditor: auditor,
    });
    setIsReauditModalOpen(true);
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* PEŁNA SZEROKOŚĆ 100VW DLA TŁA I NAGŁÓWKA, CONTENT WEWNĄTRZ OGRANICZONY DO 1600PX */}
      <div
        data-testid="app-container"
        className="flex flex-col min-h-screen md:h-screen w-full bg-[#f8fafc] font-['Figtree',_sans-serif] overflow-x-hidden md:overflow-hidden text-slate-900 relative"
      >
        {/* NOWA JASNA NAWIGACJA POZIOMA - TŁO 100VW, CONTENT MAX 1600PX */}
        <TopNavbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onLogout={() => setIsAuthenticated(false)}
          isAnnouncementsOpen={isAnnouncementsOpen}
          setIsAnnouncementsOpen={setIsAnnouncementsOpen}
          announcements={announcements}
          setAnnouncements={setAnnouncements}
          tickets={tickets}
          setTickets={setTickets}
          unreadTicketsCount={unreadTicketsCount}
          onOpenTicket={handleOpenTicketThread}
          onOpenNewTicket={handleOpenNewTicket}
          isHelpOpen={isHelpOpen}
          setIsHelpOpen={setIsHelpOpen}
          showToast={showToast}
          clientProfile={clientProfile}
          onOpenProfile={handleOpenProfile}
        />

        {/* GŁÓWNA ZAWARTOŚĆ - TŁO 100VW */}
        <main
          data-testid="main-content"
          className="flex-1 flex flex-col md:h-full md:overflow-hidden bg-[#f8fafc] relative z-10 w-full"
        >
          {currentView === "przeglad" && (
            <DashboardView
              setView={setCurrentView}
              onOpenAnnouncements={() => setCurrentView("komunikaty")}
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              tickets={tickets}
              setTickets={setTickets}
              unreadTicketsCount={unreadTicketsCount}
              onOpenTicket={handleOpenTicketThread}
              onOpenNewTicket={handleOpenNewTicket}
              showToast={showToast}
              clientProfile={clientProfile}
              onViewPersonProfile={(person) => handleViewPersonProfile(person, "przeglad")}
              onOpenProfile={handleOpenProfile}
            />
          )}
          {currentView === "tickety" && (
            <TicketsPageView
              setView={setCurrentView}
              tickets={tickets}
              setTickets={setTickets}
              selectedTicketId={selectedTicketId}
              setSelectedTicketId={setSelectedTicketId}
              onOpenNewTicket={handleOpenNewTicket}
              showToast={showToast}
              developerFilter={developerTicketFilter}
              setDeveloperFilter={setDeveloperTicketFilter}
              onViewPersonProfile={(person) => handleViewPersonProfile(person, "tickety")}
              onOpenProfile={handleOpenProfile}
            />
          )}
          {currentView === "komunikaty" && (
            <AnnouncementsPageView
              setView={setCurrentView}
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              showToast={showToast}
              onViewPersonProfile={(person) => handleViewPersonProfile(person, "komunikaty")}
            />
          )}
          {currentView === "raporty" && (
            <RaportyView
              setView={setCurrentView}
              onOpenReaudit={handleOpenReaudit}
              showToast={showToast}
            />
          )}
          {(currentView === "baza-uslug" ||
            currentView === "proces-szczegoly") && (
            <BazaUslugContainer
              currentView={currentView}
              setView={setCurrentView}
              onOpenReaudit={handleOpenReaudit}
              showToast={showToast}
            />
          )}
          {currentView === "raport-szczegoly" && (
            <ReportSummaryView
              setView={setCurrentView}
              onOpenReaudit={handleOpenReaudit}
              showToast={showToast}
            />
          )}
          {currentView === "raport-bledy" && (
            <ReportErrorsView
              setView={setCurrentView}
              onOpenReaudit={handleOpenReaudit}
              tickets={tickets}
              onOpenTicket={handleOpenTicketThread}
              onOpenNewTicket={handleOpenNewTicket}
              showToast={showToast}
              developerFilter={developerErrorFilter}
              setDeveloperFilter={setDeveloperErrorFilter}
              onOpenProfile={handleOpenProfile}
            />
          )}
          {currentView === "raportowanie" && (
            <ReportingModuleView
              setView={setCurrentView}
              showToast={showToast}
            />
          )}
          {currentView === "reklamacje" && (
            <ComplaintsModuleView
              setView={setCurrentView}
              complaintsList={complaintsList}
              setSelectedComplaintId={setSelectedComplaintId}
              tickets={tickets}
              onOpenTicket={handleOpenTicketThread}
              showToast={showToast}
            />
          )}
          {currentView === "reklamacja-szczegoly" && (
            <ComplaintDetailsView
              setView={setCurrentView}
              complaintId={selectedComplaintId}
              complaintsList={complaintsList}
              setComplaintsList={setComplaintsList}
              tickets={tickets}
              onOpenTicket={handleOpenTicketThread}
              onOpenNewTicket={handleOpenNewTicket}
              onEditComplaint={(complaint) => {
                setComplaintToEdit(complaint);
                setIsComplaintEditOpen(true);
              }}
              onOpenReaudit={handleOpenReaudit}
              showToast={showToast}
            />
          )}
          {currentView === "reklamacja-nowa" && (
            <ComplaintCreateView
              setView={setCurrentView}
              setComplaintsList={setComplaintsList}
              setSelectedComplaintId={setSelectedComplaintId}
              showToast={showToast}
            />
          )}
          {currentView === "profil" && (
            <UserProfileView
              setView={setCurrentView}
              clientProfile={clientProfile}
              setClientProfile={setClientProfile}
              showToast={showToast}
              initialTab={profileInitialTab}
              onViewMemberErrors={(member) => {
                setDeveloperErrorFilter(member.name);
                setCurrentView("raport-bledy");
              }}
              onViewMemberTickets={(member) => {
                setDeveloperTicketFilter(member.name);
                setCurrentView("tickety");
              }}
              onViewPersonProfile={(member) => handleViewPersonProfile(member, "profil")}
            />
          )}
          {currentView === "osoba-profil" && (
            <PersonProfileView
              person={selectedPerson}
              setView={setCurrentView}
              backView={personProfileBackView}
              clientProfile={clientProfile}
              showToast={showToast}
              onOpenNewTicket={handleOpenNewTicket}
              onViewMemberErrors={(member) => {
                setDeveloperErrorFilter(member.name);
                setCurrentView("raport-bledy");
              }}
              onViewMemberTickets={(member) => {
                setDeveloperTicketFilter(member.name);
                setCurrentView("tickety");
              }}
            />
          )}
        </main>

        {/* MODAL NOWEGO TICKETU / KONSULTACJI Z AUDYTORAMI */}
        <CreateTicketModal
          isOpen={isNewTicketModalOpen}
          onClose={() => setIsNewTicketModalOpen(false)}
          initialContext={newTicketInitialContext}
          tickets={tickets}
          setTickets={setTickets}
          onTicketCreated={(newTicket) => {
            setSelectedTicketId(newTicket.id);
            setCurrentView("tickety");
          }}
          showToast={showToast}
        />

        {/* MODAL ZLECENIA REAUDYTU / KONTAKT Z OPIEKUNEM */}
        <ReauditRequestModal
          isOpen={isReauditModalOpen}
          onClose={() => setIsReauditModalOpen(false)}
          targetTitle={reauditContext.targetTitle}
          targetType={reauditContext.targetType}
          auditor={reauditContext.auditor}
          onSubmit={(details) => {
            setIsReauditModalOpen(false);
            showToast(
              "Zlecenie re-audytu wysłane",
              `Zlecenie re-audytu dla "${reauditContext.targetTitle}" zostało przekazane do audytora Piotra Smułkowskiego. Potwierdzenie terminu w ciągu 2h.`
            );
          }}
        />

        {/* MODAL EDYCJI SKARGI DLA KOORDYNATORA */}
        <ComplaintEditModal
          isOpen={isComplaintEditOpen}
          onClose={() => setIsComplaintEditOpen(false)}
          complaint={complaintToEdit}
          onSave={(updatedComplaint) => {
            setComplaintsList((prev) =>
              prev.map((c) => (c.id === updatedComplaint.id ? updatedComplaint : c))
            );
            setIsComplaintEditOpen(false);
            showToast(
              "Zaktualizowano skargę",
              `Zgłoszenie #${updatedComplaint.id} zostało pomyślnie zaktualizowane (zespół: ${updatedComplaint.devTeam || "brak"}).`
            );
          }}
        />

        {/* TOAST SYSTEMOWY DLA AKCJI KOORDYNATORA */}
        <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
      </div>
    </>
  );
}

// ==========================================
// EKRAN LOGOWANIA
// ==========================================

function LoginView({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (onLogin) onLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');
      `}</style>

      <div data-testid="login-view" className="flex h-screen w-full bg-white font-['Figtree',_sans-serif] text-slate-900 overflow-hidden">
        {/* LEWA STRONA - FORMULARZ LOGOWANIA */}
        <div data-testid="login-form-container" className="w-full lg:w-[500px] xl:w-[600px] flex flex-col p-8 sm:p-12 lg:p-16 relative z-10 bg-white overflow-y-auto">
          <div className="w-full max-w-[400px] mx-auto flex flex-col h-full min-h-[500px]">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-[#0038F8] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#0038F8]/20 flex-shrink-0">
                <Eye size={22} strokeWidth={2.5} />
              </div>
              <span className="text-slate-900 font-extrabold text-2xl leading-none tracking-tight">
                W-ally
              </span>
            </div>

            {/* Główny formularz */}
            <div className="w-full my-auto py-12">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                  Witaj z powrotem
                </h1>
                <p className="text-slate-500 font-medium">
                  Zaloguj się, aby zarządzać dostępnością cyfrową w swojej
                  organizacji.
                </p>
              </div>

              <form data-testid="login-form" onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700">
                    Adres e-mail
                  </label>
                  <div className="relative flex items-center group">
                    <Mail
                      className="absolute left-4 text-slate-400 group-focus-within:text-[#0038F8] transition-colors"
                      size={20}
                    />
                    <input
                      data-testid="login-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jan.kowalski@firma.pl"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 focus:border-[#0038F8] transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[13px] font-bold text-slate-700">
                      Hasło
                    </label>
                    <a
                      href="#"
                      className="text-[13px] font-bold text-[#0038F8] hover:text-[#002ECC] transition-colors"
                    >
                      Zapomniałeś hasła?
                    </a>
                  </div>
                  <div className="relative flex items-center group">
                    <Lock
                      className="absolute left-4 text-slate-400 group-focus-within:text-[#0038F8] transition-colors"
                      size={20}
                    />
                    <input
                      data-testid="login-password-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-12 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 focus:border-[#0038F8] transition-all bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:text-[#0038F8]"
                      aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group w-max mt-2">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 rounded border-2 border-slate-300 peer-checked:border-[#0038F8] peer-checked:bg-[#0038F8] transition-all flex items-center justify-center">
                      <CheckCircle2
                        size={14}
                        className="text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                    Zapamiętaj mnie na tym urządzeniu
                  </span>
                </label>

                <button
                  data-testid="login-submit-button"
                  type="submit"
                  className="w-full bg-[#0038F8] hover:bg-[#002ECC] text-white py-4 rounded-xl font-bold shadow-[0_4px_14px_rgba(0,56,248,0.25)] hover:shadow-[0_6px_20px_rgba(0,56,248,0.3)] transition-all flex items-center justify-center gap-2 mt-6 group"
                >
                  Zaloguj się do panelu
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </form>

              <div className="mt-8 p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="text-[#0038F8] shrink-0 mt-0.5"
                />
                <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                  Dostęp do platformy wymaga konta służbowego utworzonego przez Twoją organizację.
                  Wpisując dane potwierdzasz zgodność z{" "}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-[#0038F8] font-bold hover:underline"
                  >
                    Polityką Bezpieczeństwa
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Stopka */}
            <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-400 gap-4 shrink-0">
              <span>© 2026 Widzialni.eu</span>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-slate-600 transition-colors">
                  Pomoc
                </a>
                <a href="#" className="hover:text-slate-600 transition-colors">
                  Polityka Prywatności
                </a>
                <a href="#" className="hover:text-slate-600 transition-colors">
                  Zgłoś problem
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* PRAWA STRONA - MARKETING / BRANDING */}
        <div className="hidden lg:flex lg:flex-1 relative bg-[#0038F8] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0038F8] via-[#002ECC] to-[#001766]"></div>
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#00D4FF]/20 blur-3xl mix-blend-overlay"></div>

          <div className="relative z-10 flex flex-col justify-center items-center w-full p-16 h-full text-white">
            <div className="max-w-[500px] w-full">
              <div className="w-full bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-6 mb-12 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex items-end gap-4 mb-8">
                  <div className="w-1/3 bg-white/10 h-24 rounded-lg border border-white/5 relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-1/2 bg-[#00D4FF]/30"></div>
                  </div>
                  <div className="w-1/3 bg-white/10 h-32 rounded-lg border border-white/5 relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-3/4 bg-[#00D4FF]/50"></div>
                  </div>
                  <div className="w-1/3 bg-white/20 h-40 rounded-lg border border-white/20 relative overflow-hidden shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                    <div className="absolute bottom-0 w-full h-[90%] bg-[#00D4FF]"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-3 bg-white/10 rounded-full"></div>
                  <div className="w-4/5 h-3 bg-white/10 rounded-full"></div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#00D4FF] mb-6 uppercase tracking-widest backdrop-blur-sm">
                <CheckCircle2 size={14} /> Pełne wsparcie WCAG 2.2
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-6">
                Nowy wymiar audytów <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-white">
                  dostępności cyfrowej.
                </span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed font-medium mb-12">
                Zarządzaj błędami WCAG, monitoruj SLA zespołów i generuj
                deklaracje PAD z jednego, scentralizowanego miejsca.
              </p>

              <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <p className="italic text-white/90 text-sm mb-4">
                  "Wdrożenie platformy W-ally pozwoliło nam skrócić czas naprawy
                  błędów priorytetowych o 40% i uporządkować współpracę z
                  dostawcami."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold">
                    AK
                  </div>
                  <div>
                    <div className="font-bold text-sm">Anna Kowalczyk</div>
                    <div className="text-xs text-blue-200">
                      Accessibility Lead, Duży Bank SA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// POZOSTAŁE KOMPONENTY GŁÓWNE
// ==========================================

// KOMUNIKATY I OFERTY:
// 1. DROPDOWN (KOMPAKTOWE ROZWINIĘCIE - 2 OSTATNIE KOMUNIKATY)
// 2. DEDYKOWANA STRONA (PEŁNE CENTRUM KOMUNIKATÓW)

function NotificationsDropdown({
  announcements = [],
  setAnnouncements,
  tickets = [],
  setTickets,
  onClose,
  onViewAllAnnouncements,
  onViewAllTickets,
  onOpenTicket,
  showToast,
}) {
  const dropdownRef = useRef(null);
  const unreadTicketsCount = tickets.filter((t) => t.unreadByClient).length;
  const unreadAnnouncementsCount = announcements.filter((a) => a.unread).length;
  const [activeTab, setActiveTab] = useState(unreadTicketsCount > 0 ? "tickets" : "announcements");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const recentAnnouncements = announcements.slice(0, 2);
  const recentTickets = tickets.slice(0, 3);

  const markAllAnnouncementsRead = (e) => {
    e.stopPropagation();
    setAnnouncements((prev) => prev.map((a) => ({ ...a, unread: false })));
    if (showToast) {
      showToast("Komunikaty", "Oznaczono wszystkie komunikaty jako przeczytane.");
    }
  };

  const handleAnnouncementClick = (item) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, unread: false } : a))
    );
    if (showToast && item.actionMessage) {
      showToast(item.categoryLabel, item.actionMessage);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-left"
      role="dialog"
      aria-label="Centrum powiadomień i wiadomości"
    >
      {/* Zakładki na górze menu */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("tickets")}
          className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "tickets"
              ? "bg-white text-[#0038F8] shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <MessageSquareText size={13} />
          <span>Konsultacje</span>
          {unreadTicketsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white animate-pulse">
              {unreadTicketsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("announcements")}
          className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "announcements"
              ? "bg-white text-[#0038F8] shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles size={13} />
          <span>Komunikaty ({announcements.length})</span>
          {unreadAnnouncementsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#0038F8] text-white">
              {unreadAnnouncementsCount}
            </span>
          )}
        </button>
      </div>

      {/* ZAWARTOŚĆ ZAKŁADKI 1: TICKETY / ODPOWIEDZI AUDYTORÓW */}
      {activeTab === "tickets" && (
        <div>
          <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Wątki konsultacyjne z audytorami</span>
            {unreadTicketsCount > 0 && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Wymaga Twojej reakcji
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {recentTickets.map((t) => {
              const lastMsg = t.messages[t.messages.length - 1];
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    onClose();
                    if (onOpenTicket) onOpenTicket(t.id);
                  }}
                  className={`p-3.5 hover:bg-slate-50/90 transition-colors cursor-pointer group relative ${
                    t.unreadByClient ? "bg-emerald-50/30 border-l-3 border-emerald-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${t.categoryColor}`}>
                        {t.categoryLabel}
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-800">
                        #{t.id}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {t.updatedAt}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0038F8] transition-colors leading-snug line-clamp-1">
                    {t.title}
                  </h4>

                  {/* Snippet ostatniej wypowiedzi */}
                  <div className="mt-1.5 flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <img
                      src={lastMsg.authorAvatar}
                      alt={lastMsg.authorName}
                      className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-slate-700 flex items-center justify-between">
                        <span>{lastMsg.authorName}</span>
                        {t.unreadByClient && (
                          <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100/80 px-1.5 rounded">
                            Nowa odpowiedź
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                        {lastMsg.content}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 font-bold text-[#0038F8] group-hover:underline">
                      <span>Otwórz rozmowę w tickecie</span>
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Dotyczy: {t.contextId || "Ogólne"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 bg-slate-50/80 border-t border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onViewAllTickets) onViewAllTickets();
              }}
              className="w-full py-2 px-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#0038F8]/40 text-[#0038F8] rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <span>Wszystkie konsultacje ({tickets.length})</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* ZAWARTOŚĆ ZAKŁADKI 2: KOMUNIKATY I OFERTY */}
      {activeTab === "announcements" && (
        <div>
          <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Nowości systemowe i webinary</span>
            {unreadAnnouncementsCount > 0 && (
              <button
                type="button"
                onClick={markAllAnnouncementsRead}
                className="text-[11px] font-bold text-slate-500 hover:text-[#0038F8] cursor-pointer"
              >
                Oznacz przeczytane
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {recentAnnouncements.map((item) => {
              const ItemIcon = item.icon || Sparkles;
              return (
                <div
                  key={item.id}
                  onClick={() => handleAnnouncementClick(item)}
                  className={`p-3.5 hover:bg-slate-50/90 transition-colors cursor-pointer group relative ${
                    item.unread ? "bg-blue-50/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${item.categoryColor}`}
                    >
                      <ItemIcon size={11} />
                      <span>{item.categoryLabel}</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {item.date}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0038F8] transition-colors leading-snug line-clamp-1">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0038F8] group-hover:underline">
                      <span>{item.ctaText}</span>
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </span>
                    {item.unread && (
                      <span className="text-[10px] font-semibold text-slate-400">
                        Kliknij, by odczytać
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 bg-slate-50/80 border-t border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onViewAllAnnouncements) onViewAllAnnouncements();
              }}
              className="w-full py-2 px-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#0038F8]/40 text-[#0038F8] rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <span>Zobacz wszystkie komunikaty ({announcements.length})</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const AnnouncementsDropdown = NotificationsDropdown;

function AnnouncementsPageView({
  setView,
  announcements,
  setAnnouncements,
  showToast,
  onViewPersonProfile,
}: {
  setView: (v: string) => void;
  announcements: any[];
  setAnnouncements: any;
  showToast?: (t: string, b: string) => void;
  onViewPersonProfile?: (p: any) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Zredukowana ilość kategorii do 2 głównych grup + Wszystkie
  const categories = [
    { id: "all", label: "Wszystkie", count: announcements.length },
    {
      id: "komunikaty",
      label: "Komunikaty i aktualności",
      icon: Sparkles,
      count: announcements.filter((a) => a.category === "komunikaty").length,
    },
    {
      id: "oferty",
      label: "Oferty i usługi",
      icon: Tag,
      count: announcements.filter((a) => a.category === "oferty").length,
    },
  ];

  const unreadCount = announcements.filter((a) => a.unread).length;

  const markAllAsRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, unread: false })));
    if (showToast) {
      showToast("Komunikaty", "Oznaczono wszystkie wiadomości jako przeczytane.");
    }
  };

  const handleCtaClick = (item) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, unread: false } : a))
    );
    if (showToast) {
      showToast(
        item.categoryLabel,
        item.actionMessage || "Zgłoszenie zostało pomyślnie zarejestrowane."
      );
    }
  };

  const toggleReadStatus = (itemId) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === itemId ? { ...a, unread: !a.unread } : a))
    );
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesUnread = !unreadOnly || item.unread;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.categoryLabel.toLowerCase().includes(query) ||
      (item.meta && item.meta.toLowerCase().includes(query));
    return matchesCategory && matchesUnread && matchesQuery;
  });

  return (
    <div
      data-testid="announcements-page-view"
      className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden bg-[#f8fafc]"
    >
      <ViewHeader
        breadcrumbs={[
          { label: "Pulpit", onClick: () => setView("przeglad") },
          { label: "Centrum Komunikatów i Ofert" },
        ]}
        title="Centrum Komunikatów i Ofert"
        subtitle="Bieżące powiadomienia systemowe, nowe funkcjonalności, terminy warsztatów oraz pakiety wsparcia dedykowanego."
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Check size={16} className="text-emerald-600" />
                <span>Oznacz wszystkie jako przeczytane</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setView("przeglad")}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Wróć do Pulpitu</span>
            </button>
          </div>
        }
      />

      {/* Przewijana zawartość strony */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
        {/* Pasek filtrów: zredukowane kategorie + wyszukiwarka + toggle nieprzeczytane */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Uproszczone kategorie (tylko 2 główne + Wszystkie) */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0038F8] text-white shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                  }`}
                >
                  {Icon && <Icon size={14} />}
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/70 text-slate-600"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Wyszukiwarka i filtr nieprzeczytanych */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj w komunikatach i ofertach..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer shrink-0 ${
                unreadOnly
                  ? "bg-blue-50 border-[#0038F8] text-[#0038F8]"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tylko nieprzeczytane {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>

        {/* Siatka komunikatów */}
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Bell size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              Brak komunikatów spełniających kryteria
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              Spróbuj wyczyścić filtr wyszukiwania lub przełącz kategorię na
              „Wszystkie”.
            </p>
            {(searchQuery || unreadOnly || activeCategory !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                  setUnreadOnly(false);
                }}
                className="mt-4 px-4 py-2 bg-[#0038F8] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#002ecc] transition-colors cursor-pointer"
              >
                Resetuj filtry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredAnnouncements.map((item) => {
              const ItemIcon = item.icon || Sparkles;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all hover:shadow-md ${
                    item.unread
                      ? "border-[#0038F8]/40 ring-1 ring-[#0038F8]/15 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div>
                    {/* Belka nagłówkowa karty */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${item.categoryColor}`}
                        >
                          <ItemIcon size={13} />
                          <span>{item.categoryLabel}</span>
                        </span>
                        {item.unread && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0038F8] text-white">
                            Nowe
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-400">
                        {item.date}
                      </span>
                    </div>

                    {/* Tytuł i opis */}
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Meta info */}
                    {item.meta && (
                      <div className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>{item.meta}</span>
                      </div>
                    )}
                  </div>

                  {/* Dolna stopka karty z akcją CTA i statusem */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleCtaClick(item)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0038F8] hover:bg-[#002ecc] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleReadStatus(item.id)}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {item.unread ? "Oznacz jako przeczytane" : "Oznacz jako nieprzeczytane"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SPÓJNA KARTA DEDYKOWANEGO OPIEKUNA KLIENTA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div
              className="flex items-center gap-3 cursor-pointer group/mgr"
              onClick={() => {
                if (onViewPersonProfile) {
                  onViewPersonProfile("Tomasz Straszak");
                }
              }}
              title="Kliknij, aby otworzyć profil Tomasza Straszaka"
            >
              <div className="relative shrink-0">
                <img
                  src="https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg"
                  alt="Tomasz Straszak"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs group-hover/mgr:ring-2 group-hover/mgr:ring-[#0038F8]"
                />
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"
                  title="Dostępny"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 group-hover/mgr:text-[#0038F8] transition-colors truncate flex items-center gap-1.5">
                    <span>Tomasz Straszak</span>
                    <ExternalLink size={12} className="text-slate-400 group-hover/mgr:text-[#0038F8]" />
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    Dostępny
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-500 truncate">
                  Dedykowany Opiekun Klienta
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold mt-1">
                  <a
                    href="tel:+48795103017"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 hover:text-[#0038F8] transition-colors"
                  >
                    <Phone size={12} className="text-[#0038F8]" /> 795 103 017
                  </a>
                  <a
                    href="mailto:tomek@widzialni.eu"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 hover:text-[#0038F8] transition-colors"
                  >
                    <Mail size={12} className="text-[#0038F8]" /> tomek@widzialni.eu
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setView("tickety")}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquareText size={14} className="text-emerald-700" />
                <span>Nowa konsultacja</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onViewPersonProfile) {
                    onViewPersonProfile("Tomasz Straszak");
                  } else {
                    setView("profil");
                  }
                }}
                className="px-4 py-2 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                title="Umów spotkanie 30 min z Tomaszem Straszakiem"
              >
                <Calendar size={14} />
                <span>Umów spotkanie 30 min</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ClientAnnouncementsDrawer = () => null;

// ========================================================
// SYSTEM TICKETÓW & KONSULTACJI Z AUDYTORAMI:
// 1. MODAL TWORZENIA NOWEGO TICKETU (CreateTicketModal)
// 2. DEDYKOWANA STRONA CENTRUM TICKETÓW (TicketsPageView)
// ========================================================

function CreateTicketModal({
  isOpen,
  onClose,
  initialContext,
  tickets = [],
  setTickets,
  onTicketCreated,
  showToast,
}) {
  const [contextType, setContextType] = useState("error");
  const [contextId, setContextId] = useState("ERR-204");
  const [contextTitle, setContextTitle] = useState("Błąd #ERR-204: Kontrast indykatora w formularzu przelewu");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("normal");
  const [auditorName, setAuditorName] = useState("Tomasz Straszak");
  const [content, setContent] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("");

  useEffect(() => {
    if (initialContext) {
      setContextType(initialContext.type || "general");
      setContextId(initialContext.id || "");
      setContextTitle(initialContext.title || "");
      if (initialContext.title) {
        setTitle(`Konsultacja: ${initialContext.title}`);
      }
    } else {
      setContextType("error");
      setContextId("ERR-204");
      setContextTitle("Błąd #ERR-204: Kontrast indykatora w formularzu przelewu");
      setTitle("");
    }
    setContent("");
    setAttachedFileName("");
  }, [initialContext, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      if (showToast) {
        showToast("Błąd formularza", "Wypełnij temat i treść zapytania do audytora.", "error");
      }
      return;
    }

    const newId = `TCK-${105 + tickets.length}`;
    const auditorObj =
      auditorName === "dr Piotr Smułkowski"
        ? {
            name: "dr Piotr Smułkowski",
            role: "Główny Audytor WCAG",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          }
        : {
            name: "Tomasz Straszak",
            role: "Dedykowany Opiekun Klienta",
            avatar: "https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg",
          };

    const newTicket = {
      id: newId,
      title: title.trim(),
      category: contextType,
      categoryLabel:
        contextType === "error"
          ? "Błąd w audycie"
          : contextType === "complaint"
          ? "Skarga klienta"
          : contextType === "audit"
          ? "Audyt całościowy"
          : "Konsultacja ogólna",
      categoryColor:
        contextType === "error"
          ? "bg-red-50 text-red-700 border-red-200"
          : contextType === "complaint"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : contextType === "audit"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-purple-50 text-purple-700 border-purple-200",
      contextType,
      contextId: contextId || "Ogólne",
      contextTitle: contextTitle || title.trim(),
      contextPath:
        contextType === "error"
          ? "Audyty > Raport błędów"
          : contextType === "complaint"
          ? "Skargi i reklamacje"
          : "Audyty i weryfikacje",
      contextView:
        contextType === "error"
          ? "raport-bledy"
          : contextType === "complaint"
          ? "reklamacja-szczegoly"
          : "raport-szczegoly",
      status: "waiting_auditor",
      statusLabel: "W analizie audytora",
      priority,
      priorityLabel:
        priority === "urgent"
          ? "Pilny (Bloker)"
          : priority === "low"
          ? "Niski"
          : "Standardowy",
      createdAt: "Przed chwilą",
      updatedAt: "Przed chwilą",
      unreadByClient: false,
      assignedAuditor: auditorObj,
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: "client",
          authorName: "Piotr Smułkowski",
          authorRole: "Koordynator Dostępności (Bank)",
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
          date: "Przed chwilą",
          content: content.trim(),
          attachments: attachedFileName
            ? [{ name: attachedFileName, size: "320 KB" }]
            : undefined,
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    if (showToast) {
      showToast(
        "Wysłano zapytanie",
        `Zapytanie konsultacyjne #${newId} zostało przesłane do audytora: ${auditorObj.name}. Otrzymasz powiadomienie po nadejściu odpowiedzi.`
      );
    }
    onClose();
    if (onTicketCreated) onTicketCreated(newId);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0038F8]/10 text-[#0038F8] flex items-center justify-center shrink-0">
              <MessageSquareText size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Nowa konsultacja
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bezpośredni kontakt w sprawach technicznych bez konieczności spotkania online.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-left">
          {/* Kontekst powiązania */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Czego dotyczy to zapytanie?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "error", label: "Błąd w audycie" },
                { id: "audit", label: "Cały audyt" },
                { id: "complaint", label: "Skarga klienta" },
                { id: "general", label: "Konsultacja ogólna" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setContextType(c.id)}
                  className={`p-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    contextType === c.id
                      ? "bg-blue-50 border-[#0038F8] text-[#0038F8] shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Konkretny element powiązany */}
          {contextType === "error" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Wybierz błąd z audytu:
              </label>
              <select
                value={contextId}
                onChange={(e) => {
                  setContextId(e.target.value);
                  const selectedText = e.target.options[e.target.selectedIndex].text;
                  setContextTitle(selectedText);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
              >
                <option value="ERR-204">Błąd #ERR-204: Kontrast indykatora w formularzu przelewu (Kryterium 1.4.11)</option>
                <option value="ERR-101">Błąd #ERR-101: Brak widocznego fokusu klawiatury na kafelkach logowania (Kryterium 2.4.7)</option>
                <option value="ERR-102">Błąd #ERR-102: Brak alternatyw tekstowych dla ikon operacji bankowych (Kryterium 1.1.1)</option>
                <option value="ERR-103">Błąd #ERR-103: Nieprawidłowa hierarchia nagłówków w sekcji ofertowej (Kryterium 1.3.1)</option>
              </select>
            </div>
          )}

          {contextType === "complaint" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Wybierz powiązaną skargę klienta:
              </label>
              <select
                value={contextId}
                onChange={(e) => {
                  setContextId(e.target.value);
                  const selectedText = e.target.options[e.target.selectedIndex].text;
                  setContextTitle(selectedText);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
              >
                <option value="RKL-2026-089">Skarga #RKL-2026-089: Niedostępne wykresy notowań dla NVDA (Makler)</option>
                <option value="RKL-2026-088">Skarga #RKL-2026-088: Pułapka klawiatury w modalu zatwierdzenia przelewu</option>
                <option value="RKL-2026-087">Skarga #RKL-2026-087: Niezrozumiałe komunikaty błędów w formularzu kredytowym</option>
              </select>
            </div>
          )}

          {contextType === "audit" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Wybierz powiązany audyt:
              </label>
              <select
                value={contextId}
                onChange={(e) => {
                  setContextId(e.target.value);
                  const selectedText = e.target.options[e.target.selectedIndex].text;
                  setContextTitle(selectedText);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
              >
                <option value="AUD-2026-001">Audyt: Portal Klienta - Serwis Transakcyjny WWW</option>
                <option value="AUD-2026-002">Audyt: Aplikacja Mobilna iOS (Wersja 4.2)</option>
                <option value="AUD-2026-003">Audyt: Aplikacja Mobilna Android</option>
              </select>
            </div>
          )}

          {/* Temat zgłoszenia */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Temat zapytania *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="np. Czy kontrast 3.8:1 dla aktywnego stanu checkboxa spełnia WCAG 2.2?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
            />
          </div>

          {/* Adresat i Priorytet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Adresat zgłoszenia:
              </label>
              <select
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
              >
                <option value="Tomasz Straszak">Tomasz Straszak (Opiekun Klienta – ustalenia, wyceny, dystrybucja do audytorów)</option>
                <option value="dr Piotr Smułkowski">dr Piotr Smułkowski (Główny Audytor WCAG – analiza techniczna)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Priorytet:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
              >
                <option value="normal">Standardowy (odpowiedź w 24h)</option>
                <option value="urgent">🚨 Pilny – bloker release'u (odpowiedź do 4h)</option>
                <option value="low">Niski – ogólne pytanie teoretyczne</option>
              </select>
            </div>
          </div>

          {/* Treść zapytania */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Treść zapytania / opis wątpliwości *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Opisz wątpliwość techniczną, zaproponowane rozwiązanie zespołu Dev lub zapytaj o rekomendację..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 resize-none leading-relaxed"
            />
          </div>

          {/* Załącznik */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Załącznik (kod / zrzut ekranu):</span>
              {attachedFileName && (
                <button
                  type="button"
                  onClick={() => setAttachedFileName("")}
                  className="text-red-600 hover:underline font-normal text-[11px]"
                >
                  Usuń plik
                </button>
              )}
            </div>
            {attachedFileName ? (
              <div className="flex items-center gap-2 p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs font-semibold text-blue-800">
                <Paperclip size={14} className="text-[#0038F8]" />
                <span className="truncate flex-1">{attachedFileName}</span>
                <span className="text-[10px] text-blue-600 font-normal">320 KB</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAttachedFileName("zrzut_ekranu_blad_fokus.png")}
                className="w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-[#0038F8] bg-slate-50 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-slate-600 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Paperclip size={14} className="text-slate-400" />
                <span>Kliknij, aby dodać zrzut ekranu lub plik kodu (.png, .jpg, .tsx, .log)</span>
              </button>
            )}
          </div>

          {/* Stopka modala */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Send size={13} />
              <span>Wyślij zapytanie</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TicketsPageView({
  setView,
  tickets = [],
  setTickets,
  selectedTicketId,
  setSelectedTicketId,
  onOpenNewTicket,
  showToast,
  developerFilter = null,
  setDeveloperFilter = null,
  onViewPersonProfile,
  onOpenProfile,
}: {
  setView: (v: string) => void;
  tickets?: any[];
  setTickets?: any;
  selectedTicketId?: string;
  setSelectedTicketId?: any;
  onOpenNewTicket?: (ctx?: any) => void;
  showToast?: (t: string, b: string, type?: string) => void;
  developerFilter?: string | null;
  setDeveloperFilter?: any;
  onViewPersonProfile?: (person: any) => void;
  onOpenProfile?: (tab?: "branding" | "team" | "wcag" | "account" | "notifications") => void;
}) {
  const [activeFilterStatus, setActiveFilterStatus] = useState("all");
  const [activeFilterContext, setActiveFilterContext] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyAttachment, setReplyAttachment] = useState(null);

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  // Oznaczanie aktywnego ticketu jako przeczytany
  useEffect(() => {
    if (activeTicket && activeTicket.unreadByClient) {
      setTickets((prev) =>
        prev.map((t) => (t.id === activeTicket.id ? { ...t, unreadByClient: false } : t))
      );
    }
  }, [activeTicket?.id]);

  const unreadCount = tickets.filter((t) => t.unreadByClient).length;
  const waitingCount = tickets.filter((t) => t.status === "waiting_auditor").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      activeFilterStatus === "all" ||
      (activeFilterStatus === "requires_action" && ticket.status === "auditor_reply") ||
      (activeFilterStatus === "waiting" && ticket.status === "waiting_auditor") ||
      (activeFilterStatus === "resolved" && (ticket.status === "resolved" || ticket.status === "closed"));
    const matchesContext =
      activeFilterContext === "all" || ticket.contextType === activeFilterContext;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ticket.id.toLowerCase().includes(q) ||
      ticket.title.toLowerCase().includes(q) ||
      ticket.contextTitle.toLowerCase().includes(q) ||
      ticket.assignedAuditor.name.toLowerCase().includes(q);
    const matchesDeveloper =
      !developerFilter ||
      ticket.assignedDeveloper === developerFilter ||
      ticket.title.toLowerCase().includes(developerFilter.toLowerCase()) ||
      ticket.contextTitle?.toLowerCase().includes(developerFilter.toLowerCase());
    return matchesStatus && matchesContext && matchesSearch && matchesDeveloper;
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "client",
      authorName: "Piotr Smułkowski",
      authorRole: "Koordynator Dostępności (Bank)",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
      date: "Przed chwilą",
      content: replyText.trim(),
      attachments: replyAttachment
        ? [{ name: replyAttachment, size: "280 KB" }]
        : undefined,
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              status: "waiting_auditor",
              statusLabel: "W analizie audytora",
              updatedAt: "Przed chwilą",
              unreadByClient: false,
            }
          : t
      )
    );

    setReplyText("");
    setReplyAttachment(null);
    if (showToast) {
      showToast(
        "Wysłano odpowiedź",
        `Wiadomość w tickecie #${activeTicket.id} została przekazana do audytora (${activeTicket.assignedAuditor.name}).`
      );
    }
  };

  const handleToggleResolveTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const isResolved = t.status === "resolved";
          return {
            ...t,
            status: isResolved ? "waiting_auditor" : "resolved",
            statusLabel: isResolved ? "W analizie audytora" : "Rozwiązany",
            updatedAt: "Przed chwilą",
          };
        }
        return t;
      })
    );
    if (showToast) {
      showToast("Zaktualizowano status", "Status konsultacji został zmieniony.");
    }
  };

  return (
    <div
      data-testid="tickets-page-view"
      className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden bg-[#f8fafc]"
    >
      <ViewHeader
        breadcrumbs={[
          { label: "Pulpit", onClick: () => setView("przeglad") },
          ...(developerFilter
            ? [
                {
                  label: "Mój zespół",
                  onClick: () => {
                    setDeveloperFilter && setDeveloperFilter(null);
                    if (onOpenProfile) onOpenProfile("team");
                    else setView("profil");
                  },
                },
                { label: `Konsultacje: ${developerFilter}` },
              ]
            : [{ label: "Konsultacje" }]),
        ]}
        title={developerFilter ? `Konsultacje: ${developerFilter}` : "Konsultacje"}
        subtitle={
          developerFilter
            ? `Wątki konsultacyjne i zapytania do audytorów powiązane z deweloperem ${developerFilter}.`
            : "Zadawaj pytania audytorom, konsultuj interpretację kryteriów WCAG i uzgadniaj wytyczne naprawcze bez czekania na spotkania online."
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenNewTicket && onOpenNewTicket()}
              className="flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span>Nowa konsultacja</span>
            </button>
            {developerFilter ? (
              <button
                type="button"
                onClick={() => {
                  setDeveloperFilter && setDeveloperFilter(null);
                  if (onOpenProfile) onOpenProfile("team");
                  else setView("profil");
                }}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Wróć do Zespołu</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setView("przeglad")}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Pulpit</span>
              </button>
            )}
          </div>
        }
      />

      {/* Kontener główny idealnie zbieżny z gridem 1600px i paddingami px-4 sm:px-8 lg:px-12 */}
      <div className="flex-1 overflow-hidden flex flex-col w-full">
        {/* Pasek metryk KPI - wyrównany co do piksela do lewej i prawej krawędzi */}
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 pb-2 sm:pb-3 flex-shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div
              onClick={() => setActiveFilterStatus("all")}
              className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                activeFilterStatus === "all"
                  ? "bg-white border-[#0038F8]/40 shadow-xs ring-1 ring-[#0038F8]/20"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Wszystkie konsultacje
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 block">
                  {tickets.length}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold shrink-0">
                <Inbox size={17} />
              </div>
            </div>

            <div
              onClick={() => setActiveFilterStatus(activeFilterStatus === "requires_action" ? "all" : "requires_action")}
              className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                activeFilterStatus === "requires_action"
                  ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                  : "bg-white border-slate-200 hover:border-emerald-300"
              }`}
            >
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Nowe odpowiedzi audytora
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 block">
                    {unreadCount}
                  </span>
                  {unreadCount > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-100">
                <MessageSquareText size={17} />
              </div>
            </div>

            <div
              onClick={() => setActiveFilterStatus(activeFilterStatus === "waiting" ? "all" : "waiting")}
              className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                activeFilterStatus === "waiting"
                  ? "bg-blue-50 border-blue-300 ring-2 ring-blue-500/20 shadow-xs"
                  : "bg-white border-slate-200 hover:border-blue-300"
              }`}
            >
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                  W analizie audytora
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-blue-700 mt-0.5 block">
                  {waitingCount}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 border border-blue-100">
                <Clock size={17} />
              </div>
            </div>

            <div
              onClick={() => setActiveFilterStatus(activeFilterStatus === "resolved" ? "all" : "resolved")}
              className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                activeFilterStatus === "resolved"
                  ? "bg-purple-50 border-purple-300 ring-2 ring-purple-500/20 shadow-xs"
                  : "bg-white border-slate-200 hover:border-purple-300"
              }`}
            >
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Rozwiązane / Zamknięte
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-slate-700 mt-0.5 block">
                  {resolvedCount}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold shrink-0">
                <CheckCircle size={17} />
              </div>
            </div>
          </div>
        </div>

        {/* Baner odfiltrowania dla dewelopera */}
        {developerFilter && (
          <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 pb-2">
            <div className="p-3 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <Users size={16} className="text-[#0038F8]" />
                <span className="text-xs font-bold text-slate-900">
                  Odfiltrowano tickety przypisane do dewelopera: <strong className="text-[#0038F8]">{developerFilter}</strong>
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {filteredTickets.length} wyników
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDeveloperFilter && setDeveloperFilter(null)}
                className="text-xs font-bold text-[#0038F8] hover:text-red-600 flex items-center gap-1 cursor-pointer"
              >
                <X size={13} />
                <span>Wyczyść filtr dewelopera</span>
              </button>
            </div>
          </div>
        )}

        {/* Główny obszar dwukolumnowy: dokładnie ten sam padding poziomy px-4 sm:px-8 lg:px-12 */}
        <div className="flex-1 overflow-hidden max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-1 pb-4 sm:pb-6 flex flex-col md:flex-row gap-4 sm:gap-6 min-h-0">
          {/* LEWA KOLUMNA: LISTA KONSULTACJI (szerokość 40% na desktopie) */}
          <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-shrink-0 h-[380px] md:h-full">
          {/* Pasek wyszukiwania i filtrów kontekstu */}
          <div className="p-3.5 border-b border-slate-100 space-y-2.5 bg-slate-50/50">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj po ID, temacie lub audytorze..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: "all", label: "Wszystkie" },
                { id: "error", label: "Błędy" },
                { id: "audit", label: "Audyty" },
                { id: "complaint", label: "Skargi" },
                { id: "general", label: "Ogólne" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveFilterContext(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeFilterContext === c.id
                      ? "bg-[#0038F8] text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista pozycji */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquareText size={32} className="mx-auto mb-2 text-slate-300" />
                <div className="text-xs font-bold text-slate-600">Brak pasujących konsultacji</div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilterStatus("all");
                    setActiveFilterContext("all");
                    setSearchQuery("");
                  }}
                  className="mt-2 text-xs text-[#0038F8] font-bold hover:underline"
                >
                  Wyczyść filtry
                </button>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = activeTicket?.id === t.id;
                const lastMsg = t.messages[t.messages.length - 1];
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-3.5 cursor-pointer transition-all border-l-4 text-left ${
                      isSelected
                        ? "bg-blue-50/50 border-[#0038F8] shadow-2xs"
                        : t.unreadByClient
                        ? "bg-emerald-50/30 border-emerald-500 hover:bg-slate-50"
                        : "border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${t.categoryColor}`}>
                          {t.categoryLabel}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          #{t.id}
                        </span>
                        {t.unreadByClient && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Nowa odpowiedź" />
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        {t.updatedAt}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                      {t.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      <strong className="text-slate-700 font-semibold">{lastMsg.authorName}:</strong>{" "}
                      {lastMsg.content}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100/80">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <img
                          src={t.assignedAuditor.avatar}
                          alt={t.assignedAuditor.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="truncate max-w-[110px]">{t.assignedAuditor.name}</span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          t.status === "auditor_reply"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "resolved"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {t.statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PRAWA KOLUMNA: SZCZEGÓŁY TICKETU I WĄTEK KONWERSACJI (szerokość 60% na desktopie) */}
        {activeTicket ? (
          <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden h-[500px] md:h-full">
            {/* Nagłówek wątku */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${activeTicket.categoryColor}`}>
                    {activeTicket.categoryLabel}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    #{activeTicket.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      activeTicket.status === "auditor_reply"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse"
                        : activeTicket.status === "resolved"
                        ? "bg-slate-100 text-slate-700 border-slate-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {activeTicket.statusLabel}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      activeTicket.priority === "urgent"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {activeTicket.priorityLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleToggleResolveTicket(activeTicket.id)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {activeTicket.status === "resolved" ? "Wznów ticket" : "Oznacz jako rozwiązany"}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {activeTicket.title}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                  <span>Utworzono: {activeTicket.createdAt}</span>
                  <span>•</span>
                  <span>Ostatnia aktywność: {activeTicket.updatedAt}</span>
                </div>
              </div>

              {/* Baner powiązania z kontekstem w systemie (Błąd / Skarga / Audyt) */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Kontekst:
                  </span>
                  <span className="font-semibold text-slate-800 truncate">
                    {activeTicket.contextTitle}
                  </span>
                </div>

                {activeTicket.contextView && (
                  <button
                    type="button"
                    onClick={() => setView(activeTicket.contextView)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0038F8] hover:underline cursor-pointer shrink-0"
                  >
                    <span>Przejdź do tego elementu w audycie</span>
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>

            {/* Oś czasu wiadomości (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {activeTicket.messages.map((msg) => {
                const isAuditor = msg.sender === "auditor";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 text-left ${
                      isAuditor ? "bg-blue-50/40 p-4 rounded-2xl border border-blue-100/80" : "p-2"
                    }`}
                  >
                    <img
                      src={msg.authorAvatar}
                      alt={msg.authorName}
                      onClick={() => {
                        if (onViewPersonProfile) {
                          onViewPersonProfile(msg.authorName);
                        }
                      }}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 cursor-pointer hover:ring-2 hover:ring-[#0038F8]"
                      title={`Zobacz profil: ${msg.authorName}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div
                          className="flex items-center gap-2 flex-wrap cursor-pointer group/author"
                          onClick={() => {
                            if (onViewPersonProfile) {
                              onViewPersonProfile(msg.authorName);
                            }
                          }}
                          title={`Zobacz profil: ${msg.authorName}`}
                        >
                          <span className="text-xs font-bold text-slate-900 group-hover/author:text-[#0038F8] transition-colors flex items-center gap-1">
                            <span>{msg.authorName}</span>
                            <ExternalLink size={11} className="text-slate-400 group-hover/author:text-[#0038F8]" />
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              isAuditor
                                ? "bg-blue-100/80 text-blue-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {msg.authorRole}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {msg.date}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2 whitespace-pre-line">
                        {msg.content}
                      </div>

                      {/* Załączniki */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          {msg.attachments.map((att, idx) => (
                            <div
                              key={idx}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs"
                            >
                              <Paperclip size={13} className="text-[#0038F8]" />
                              <span>{att.name}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                ({att.size})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Formularz odpowiedzi do audytora na dole */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-2.5">
              {/* Szybkie szablony odpowiedzi */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
                  Szybka odpowiedź:
                </span>
                {[
                  "Dziękuję za wyjaśnienie, wdrażamy!",
                  "Czy możecie podesłać wzorcowy kod ARIA?",
                  "Poprawka wgrana na testy – można weryfikować",
                ].map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(template)}
                    className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-slate-600 hover:text-[#0038F8] text-[11px] font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {template}
                  </button>
                ))}
              </div>

              {replyAttachment && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-800">
                  <Paperclip size={13} className="text-[#0038F8]" />
                  <span className="truncate flex-1">{replyAttachment}</span>
                  <button
                    type="button"
                    onClick={() => setReplyAttachment(null)}
                    className="text-blue-600 hover:text-blue-900 font-bold"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Napisz odpowiedź do ${activeTicket.assignedAuditor.name}...`}
                  className="flex-1 bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 resize-none leading-relaxed"
                />

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setReplyAttachment("zrzut_weryfikacja_fokus.png")}
                    title="Załącz plik"
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Send size={15} />
                    <span className="hidden sm:inline">Odpowiedz</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
            <MessageSquareText size={48} className="text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">Wybierz konsultację z listy</h3>
            <p className="text-xs text-slate-500 mt-1">
              Kliknij dowolne zgłoszenie po lewej stronie, aby otworzyć wątek dyskusji z audytorem.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

// ========================================================
// MODAL POMOCY, INSTRUKCJE EKRANÓW I SŁOWNIK POJĘĆ WCAG
// ========================================================

const GLOSSARY_ITEMS = [
  {
    term: "WCAG 2.1 (Web Content Accessibility Guidelines)",
    category: "Standardy",
    badge: "Standard ISO",
    definition:
      "Międzynarodowy standard dostępności treści internetowych opracowany przez grupę W3C. Definiuje mierzalne kryteria sukcesu gwarantujące, że serwisy i aplikacje cyfrowe są dostępne dla osób ze wszystkimi rodzajami niepełnosprawności (wzrok, słuch, ruch, funkcje poznawcze).",
    practicalTip: "Europejski Akt o Dostępności (EAA) oraz polskie prawo nakładają obowiązek spełnienia poziomu WCAG 2.1 AA.",
  },
  {
    term: "Poziomy zgodności: A, AA, AAA",
    category: "Standardy",
    badge: "Kryteria",
    definition:
      "Trzystopniowa gradacja kryteriów sukcesu WCAG:\n• Poziom A – podstawowe minimum dostępności (jego brak całkowicie blokuje użytkowników asystujących),\n• Poziom AA – rynkowy i prawny standard dla sektora bankowego, usług komercyjnych i publicznych,\n• Poziom AAA – poziom zaawansowany dedykowany specjalistycznym portalom.",
    practicalTip: "Aplikacja W-ally audytuje i monitoruje zgodność pod kątem pełnego spełnienia poziomów A oraz AA.",
  },
  {
    term: "Zasady POUR (P-O-U-R)",
    category: "Standardy",
    badge: "Filary WCAG",
    definition:
      "Cztery fundamentalne filary standardu WCAG:\n1. Postrzegalność (Perceivable) – treść musi być dostrzegalna zmysłami wzroku lub słuchu,\n2. Funkcjonalność (Operable) – interfejs musi dać się obsłużyć m.in. za pomocą klawiatury,\n3. Zrozumiałość (Understandable) – informacje i nawigacja muszą być logiczne i przewidywalne,\n4. Rzetelność (Robust) – kod musi być kompatybilny z technologiami asystującymi (czytniki ekranu).",
    practicalTip: "Każdy audytowany błąd w W-ally jest bezpośrednio powiązany z jedną z tych 4 zasad.",
  },
  {
    term: "Błąd Priorytetowy (Krytyczny)",
    category: "Klasyfikacja błędów",
    badge: "Priorytet wysoki",
    definition:
      "Błąd dostępności, który uniemożliwia użytkownikowi ukończenie kluczowej ścieżki lub transakcji (np. brak możliwości zatwierdzenia przelewu klawiaturą, pułapka na fokusie w oknie modalnym, brak odczytu kwoty przez syntezator mowy).",
    practicalTip: "Błędy priorytetowe mają najwyższą wagę i podlegają najkrótszemu czasowi naprawy w rejestrze ryzyka.",
  },
  {
    term: "Błąd Ważny",
    category: "Klasyfikacja błędów",
    badge: "Priorytet średni",
    definition:
      "Naruszenie, które w znacznym stopniu utrudnia lub spowalnia realizację zadania, ale użytkownik posiada alternatywne obejście problemu (np. zbyt niski kontrast tekstu 2.3:1, brak opisów alternatywnych części grafik).",
    practicalTip: "Powinien zostać zaplanowany do usunięcia w bieżącym cyklu wydawniczym aplikacji.",
  },
  {
    term: "Błąd Marginalny",
    category: "Klasyfikacja błędów",
    badge: "Priorytet niski",
    definition:
      "Drobna usterka formalna, językowa lub estetyczna, która nie blokuje realizacji zadań ani nie powoduje dezorientacji (np. brak atrybutu lang przy obcojęzycznym zwrocie, drobna niekonsekwencja w hierarchii nagłówków).",
    practicalTip: "Usuwany zwykle w ramach rutynowych prac refaktoryzacyjnych kodu.",
  },
  {
    term: "Czytnik ekranu (Screen Reader)",
    category: "Technologie",
    badge: "Narzędzie asystujące",
    definition:
      "Oprogramowanie używane przez osoby niewidome i słabowidzące, które analizuje kod strony i odczytuje treść za pomocą syntezatora mowy lub monitora brajlowskiego (np. NVDA, JAWS dla Windows; VoiceOver dla macOS/iOS; TalkBack dla Androida).",
    practicalTip: "Czytnik nie widzi pikseli – opiera się na drzewie dostępności (Accessibility Tree) i semantyce HTML.",
  },
  {
    term: "Nawigacja klawiaturą i Fokus",
    category: "Technologie",
    badge: "Kryteria 2.1.1 & 2.4.7",
    definition:
      "Zasada mówiąca, że każdy element interaktywny (przyciski, linki, pola formularzy) musi dać się aktywować klawiszem Tab, Shift+Tab, Enter oraz Spacją, a aktualnie wybrany element musi mieć wyraźny wizualny wskaźnik fokusu (:focus-visible).",
    practicalTip: "Zastosowanie reguły outline: none w CSS bez alternatywnego stylu to jeden z najczęstszych błędów WCAG.",
  },
  {
    term: "Kontrast minimalny (Kryterium 1.4.3)",
    category: "Standardy",
    badge: "WCAG 2.1 AA",
    definition:
      "Stosunek luminancji tekstu względem tła. Dla tekstu standardowego (poniżej 18pt lub 14pt pogrubionego) współczynnik kontrastu musi wynosić co najmniej 4.5:1. Dla tekstu dużego i grafik interfejsu minimum to 3.0:1.",
    practicalTip: "Spełnienie kontrastu 4.5:1 gwarantuje czytelność również na ekranach telefonów w mocnym słońcu.",
  },
  {
    term: "Atrybuty WAI-ARIA",
    category: "Technologie",
    badge: "Semantyka",
    definition:
      "Zestaw specjalnych atrybutów HTML (np. role, aria-label, aria-expanded, aria-hidden, aria-describedby), które uzupełniają brakujące informacje semantyczne dla technologii asystujących w dynamicznych interfejsach.",
    practicalTip: "Złota reguła: Jeśli istnieje natywny element HTML (np. <button>), należy użyć go zamiast <div role='button'>.",
  },
  {
    term: "EAA (Europejski Akt o Dostępności)",
    category: "Prawo",
    badge: "Dyrektywa UE",
    definition:
      "Dyrektywa Parlamentu Europejskiego i Rady (UE) 2019/882, która nakłada obowiązek spełnienia wymogów dostępności cyfrowej dla kluczowych usług komercyjnych (bankowość, handel elektroniczny, aplikacje mobilne, bankomaty).",
    practicalTip: "Niedopełnienie wymogów EAA wiąże się z karami finansowymi nakładanymi przez organy nadzoru rynkowego.",
  },
  {
    term: "Ustawa o dostępności cyfrowej (PAD)",
    category: "Prawo",
    badge: "Ustawa PL",
    definition:
      "Polska ustawa z 4 kwietnia 2019 r. regulująca dostępność cyfrową stron internetowych i aplikacji mobilnych, wymagająca m.in. corocznego przeglądu i publikacji Deklaracji Dostępności.",
    practicalTip: "Raport PAD generowany w W-ally odpowiada oficjalnym szablonom sprawozdawczym.",
  },
  {
    term: "Średnia Dostępność (%)",
    category: "Wskaźniki",
    badge: "Metryka W-ally",
    definition:
      "Agregowany wskaźnik procentowy określający poziom spełnienia kryteriów sukcesu WCAG 2.1 AA we wszystkich aktywnych audytach organizacji.",
    practicalTip: "Wynik >=80% oznacza wysoką dostępność, 60-79% średnią, a poniżej 60% wymaga pilnego planu naprawczego.",
  },
  {
    term: "Pokrycie Audytowe (%)",
    category: "Wskaźniki",
    badge: "Metryka W-ally",
    definition:
      "Stosunek liczby procesów cyfrowych posiadających aktualny audyt w Bazie Usług do łącznej liczby zidentyfikowanych procesów biznesowych.",
    practicalTip: "Docelowy poziom pokrycia dla dojrzałej organizacji wynosi co najmniej 90%.",
  },
  {
    term: "Re-audyt (Weryfikacja powdrożeniowa)",
    category: "Wskaźniki",
    badge: "Proces",
    definition:
      "Ponowne badanie audytorskie przeprowadzane po wdrożeniu zaleceń przez zespół deweloperski w celu formalnego potwierdzenia usunięcia zidentyfikowanej wady.",
    practicalTip: "Po udanym re-audycie status błędu zmienia się na 'Zakończony', co podnosi wynik procentowy usługi.",
  },
  {
    term: "SLA Naprawy (Service Level Agreement)",
    category: "Wskaźniki",
    badge: "Zarządzanie",
    definition:
      "Deklarowany maksymalny czas usunięcia błędu przez zespół deweloperski klienta (np. 14 dni dla błędów priorytetowych, 45 dni dla ważnych).",
    practicalTip: "Przekroczenie SLA skutkuje automatycznym odnotowaniem w Rejestrze Ryzyka w module Raportowania.",
  },
  {
    term: "Konsultacje z Audytorami (Asynchroniczne)",
    category: "Współpraca",
    badge: "Wsparcie WCAG",
    definition:
      "Dedykowany kanał kontaktu merytorycznego w W-ally pomiędzy koordynatorem/deweloperami a certyfikowanym zespołem audytorów WCAG. Zastępuje umawianie spotkań online oraz korespondencję e-mailową w bieżących wątpliwościach technicznych.",
    practicalTip: "Zadaj pytanie, wklej fragment kodu lub załącznik – certyfikowani audytorzy WCAG na bieżąco analizują przesłane materiały.",
  },
  {
    term: "Powiązanie kontekstowe (Błąd / Audyt / Skarga)",
    category: "Współpraca",
    badge: "Funkcja W-ally",
    definition:
      "Mechanizm łączenia wątku konsultacyjnego z konkretnym błędem (ERR), audytem (AUD) lub skargą klienta (RKL). Pozwala audytorowi i koordynatorowi błyskawicznie przejść z dyskusji do badanego ekranu oraz śledzić całą historię w jednym miejscu.",
    practicalTip: "Kliknij przycisk 'Konsultuj z audytorem' na kafelku błędu lub w skardze, aby automatycznie powiązać kontekst.",
  },
  {
    term: "Powiadomienia o Odpowiedziach Audytora",
    category: "Współpraca",
    badge: "Alerty systemowe",
    definition:
      "Wielokanałowy system informowania koordynatora o nowej wypowiedzi lub rekomendacji audytora. Obejmuje zielony pulsujący wskaźnik z licznikiem w górnym pasku navbara, zakładkę w powiadomieniach oraz baner na pulpicie.",
    practicalTip: "Kliknięcie w powiadomienie natychmiast otwiera dany wątek konwersacji.",
  },
];

const VIEW_GUIDES = {
  przeglad: {
    id: "przeglad",
    title: "Pulpit Główny Dostępności",
    category: "Przegląd zarządczy",
    summary: "Centralne podsumowanie kondycji dostępności cyfrowej wszystkich serwisów i kanałów organizacji w jednym miejscu.",
    purpose:
      "Pulpit zapewnia koordynatorowi dostępności natychmiastowy wgląd w kluczowe wskaźniki (KPI), dynamikę postępów usuwania barier oraz pozwala błyskawicznie wykryć obszary wymagające interwencji audytora lub deweloperów.",
    keyElements: [
      {
        name: "Średnia Dostępność (%)",
        badge: "Główny KPI",
        desc: "Średni wynik spełnienia kryteriów WCAG 2.1 AA we wszystkich audytach. Docelowy poziom dojrzałości wynosi min. 90.0%.",
      },
      {
        name: "Pokrycie Audytowe (%)",
        badge: "Zasięg",
        desc: "Odsetek zidentyfikowanych procesów w Bazie Usług, które posiadają aktualny audyt w bieżącym cyklu.",
      },
      {
        name: "Otwarte Błędy (Triada Priorytetów)",
        badge: "Naruszenia",
        desc: "Karta podsumowująca błędy: Priorytetowe (czerwone, blokujące klienta), Ważne (bursztynowe) oraz Marginalne (błękitne).",
      },
      {
        name: "Trend 12-miesięczny",
        badge: "Wykres słupkowy",
        desc: "Miesięczna dynamika wzrostu dostępności (%) oraz spadek liczby otwartych błędów w czasie.",
      },
      {
        name: "Dostępność według Kanałów",
        badge: "Segmentacja",
        desc: "Wskaźniki postępu dla kluczowych kanałów: WWW, Aplikacji mobilnych (Android/iOS) oraz Dokumentów cyfrowych (PDF).",
      },
      {
        name: "Ostatnie audyty",
        badge: "Rejestr badań",
        desc: "Lista najnowszych badań z datą, statusem i bezpośrednim odnośnikiem do szczegółowego raportu.",
      },
      {
        name: "Moduł Konsultacji z Audytorami",
        badge: "Współpraca",
        desc: "Lewy widget współpracy: lista wątków, statusy odpowiedzi, przycisk 'Nowa konsultacja' oraz baner najnowszej odpowiedzi audytora.",
      },
      {
        name: "Widget Komunikatów i Zdarzeń",
        badge: "Wiedza & Oferty",
        desc: "Prawy widget współpracy: komunikaty o webinarach, szkoleniach dla zespołów IT oraz dedykowany kontakt z opiekunem klienta.",
      },
    ],
    steps: [
      "Krok 1: Sprawdź liczbę błędów w karcie 'Błędy Otwarte' – priorytetem są naruszenia oznaczone kolorem czerwonym.",
      "Krok 2: Zweryfikuj widget 'Konsultacje' – jeśli widnieje zielony badge 'nowa odp.', kliknij baner, aby zapoznać się ze wskazówkami audytora.",
      "Krok 3: W razie wątpliwości deweloperów kliknij 'Nowa konsultacja' i zadaj pytanie audytorowi bez umawiania spotkania.",
      "Krok 4: Skontroluj wskaźniki kanałowe oraz listę 'Ostatnie audyty', aby monitorować bieżące badania.",
      "Krok 5: Sprawdź prawy panel komunikatów i zapisz zespół na bezpłatne webinary eksperckie.",
    ],
    tips: [
      "Wskaźnik powyżej 80% oznacza wysoką zgodność z WCAG 2.1 AA; poniżej 60% wymaga natychmiastowego planu naprawczego.",
      "Kliknięcie w dowolną kartę KPI natychmiast przenosi do powiązanego modułu (Raportowanie lub Baza Usług).",
      "Zielona ikona wiadomości w nagłówku z licznikiem pozwala jednym kliknięciem przejść do wszystkich wątków konsultacji.",
    ],
  },
  tickety: {
    id: "tickety",
    title: "Konsultacje z Zespołem Audytorów WCAG",
    category: "Współpraca i doradztwo",
    summary:
      "Dedykowane centrum bezpośredniego kontaktu merytorycznego z certyfikowanymi audytorami WCAG w sprawach niewymagających spotkań online.",
    purpose:
      "Umożliwia koordynatorom i deweloperom zadawanie precyzyjnych pytań, konsultowanie interpretacji kryteriów sukcesu WCAG 2.1 AA, ocenę propozycji fixów oraz załączanie kodu lub zrzutów ekranu w uporządkowanych wątkach dyskusji z audytorami.",
    keyElements: [
      {
        name: "Pasek wskaźników i filtrów KPI",
        badge: "Wskaźniki",
        desc: "Karty: Wszystkie konsultacje, Nowe odpowiedzi audytora (zielony licznik z pulsowaniem), W analizie audytora oraz Rozwiązane / Zamknięte.",
      },
      {
        name: "Lista wątków i filtry kontekstu",
        badge: "Organizacja",
        desc: "Wyszukiwarka oraz szybkie filtry wątków powiązanych z: Błędami (ERR), Audytami (AUD), Skargami (RKL) lub Konsultacjami ogólnymi.",
      },
      {
        name: "Wątek konwersacji (Czat audytorski)",
        badge: "Komunikacja",
        desc: "Chronologiczna historia wymiany wiadomości z audytorem, awatarami ekspertów, znacznikami czasu oraz załączonymi plikami.",
      },
      {
        name: "Karta kontekstu powiązania",
        badge: "Śledzenie",
        desc: "Bezpośredni odsyłacz do powiązanego błędu w audycie lub zgłoszenia reklamacji, umożliwiający podgląd szczegółów jednym kliknięciem.",
      },
      {
        name: "Oznacz jako rozwiązany / wznów",
        badge: "Workflow",
        desc: "Przycisk pozwalający koordynatorowi lub audytorowi zamknąć wątek po uzgodnieniu wytycznych naprawczych lub ponownie go otworzyć.",
      },
      {
        name: "Przycisk '+ Nowa konsultacja'",
        badge: "Inicjowanie",
        desc: "Formularz zadania nowego pytania z wyborem kontekstu, tematu, stopnia pilności i dedykowanego eksperta.",
      },
    ],
    steps: [
      "Krok 1: Kliknij '+ Nowa konsultacja' w prawym górnym rogu lub przycisk 'Konsultuj z audytorem' przy konkretnym błędzie lub skardze.",
      "Krok 2: Wybierz kontekst sprawy (Błąd, Audyt, Skarga lub Konsultacja ogólna), wpisz temat oraz opisz wątpliwości techniczne zespołu.",
      "Krok 3: W razie potrzeby dołącz fragment kodu (HTML/CSS/JS) lub zrzut ekranu problematycznego komponentu.",
      "Krok 4: Gdy audytor odpowie, otrzymasz powiadomienie (zielony licznik na ikonie Konsultacji w nagłówku i baner na pulpicie).",
      "Krok 5: Po uzgodnieniu rozwiązania kliknij 'Oznacz jako rozwiązany', aby uporządkować rejestr spraw.",
    ],
    tips: [
      "Zadanie pytania w Konsultacjach eliminuje konieczność planowania spotkań wideo – wątki są obsługiwane bezpośrednio przez certyfikowanych audytorów WCAG.",
      "Wątki konsultacji można wywoływać bezpośrednio z kart błędów na ekranie badania ('Konsultuj z audytorem') – kontekst błędu zostanie przypisany automatycznie.",
      "Konsultacje nie zastępują formalnego re-audytu, lecz przygotowują deweloperów do prawidłowego wdrożenia przed zleceniem weryfikacji.",
    ],
  },
  komunikaty: {
    id: "komunikaty",
    title: "Centrum Komunikatów i Nowości",
    category: "Baza wiedzy i edukacja",
    summary:
      "Oficjalne komunikaty zespołu audytorskiego, oferty szkoleń WCAG, bezpłatne webinary eksperckie oraz aktualizacje prawa EAA.",
    purpose:
      "Dostęp do bieżących informacji o zmianach prawnych, możliwościach podnoszenia kompetencji zespołu deweloperskiego oraz bezpośredni kontakt z dedykowanym opiekunem klienta.",
    keyElements: [
      {
        name: "Kategorie komunikatów",
        badge: "Filtrowanie",
        desc: "Zakładki tematyczne: Wszystkie, Oferty i pakiety, Prawo & EAA, Szkolenia i warsztaty, Ważne komunikaty.",
      },
      {
        name: "Karty powiadomień i ofert",
        badge: "Zdarzenia",
        desc: "Powiadomienia z datą, oznaczeniem nowości oraz przyciskami szybkiej rejestracji na szkolenia lub kontaktu z doradcą.",
      },
      {
        name: "Karta Dedykowanego Opiekuna Klienta",
        badge: "Kontakt VIP",
        desc: "Bezpośredni kontakt telefoniczny (795 103 017) i mailowy do Tomasza Straszaka ze statusem dostępności w czasie rzeczywistym.",
      },
    ],
    steps: [
      "Krok 1: Przeglądaj regularnie komunikaty oznaczone niebieskim punktem nowości.",
      "Krok 2: Klikaj przyciski 'Zapisz się' lub 'Szczegóły oferty', aby zgłosić zespół deweloperski na warsztaty z dostępności.",
      "Krok 3: W przypadku nagłych pytań proceduralnych skorzystaj z bezpośredniego telefonu do opiekuna klienta.",
    ],
    tips: [
      "Licznik na dzwonku w nagłówku informuje o nowych komunikatach od ostatniego logowania.",
    ],
  },
  raporty: {
    id: "raporty",
    title: "Rejestr i Raporty z Audytów",
    category: "Nadzór audytowy",
    summary: "Wykaz wszystkich badań dostępności przeprowadzonych dla serwisów i procesów organizacji.",
    purpose:
      "Służy do wyszukiwania, weryfikacji i filtrowania audytów WCAG, porównywania wyników pomiędzy kanałami oraz przechodzenia do szczegółowych ustaleń audytorskich.",
    keyElements: [
      {
        name: "Przełącznik układu (Tabela / Kafelki)",
        badge: "Widok",
        desc: "Pozwala wybrać widok kompaktowej tabeli danych (standard) lub wizualnych kafelków ze szczegółami.",
      },
      {
        name: "Wyszukiwarka i filtry poziome",
        badge: "Filtrowanie",
        desc: "Błyskawiczne zawężanie audytów po tytule, nazwisku audytora, statusie (Zakończony, W trakcie, Nowy) i kanale.",
      },
      {
        name: "Kolumna Priorytety",
        badge: "Ryzyko",
        desc: "Liczba otwartych błędów krytycznych wykrytych podczas badania danej usługi.",
      },
      {
        name: "Wynik zgodności (%)",
        badge: "Punktacja",
        desc: "Oficjalna ocena procentowa spełnienia badanych kryteriów WCAG (kolor zielony dla >=80%).",
      },
    ],
    steps: [
      "Krok 1: Wpisz frazę w wyszukiwarkę lub użyj filtrów, aby zawęzić listę do interesującej Cię usługi lub kanału.",
      "Krok 2: Użyj sortowania w tabeli, aby znaleźć audyty o najniższym wyniku lub z największą liczbą błędów.",
      "Krok 3: Kliknij wiersz audytu lub przycisk 'Szczegóły', aby otworzyć pełny raport podsumowujący.",
    ],
    tips: [
      "Widok tabeli jest zalecany przy analizie dużej liczby badań i eksporcie danych.",
      "Widok kafelkowy ułatwia szybkie przeglądanie urządzeń testowych i statusów.",
    ],
  },
  "raport-szczegoly": {
    id: "raport-szczegoly",
    title: "Podsumowanie Wyników Audytu",
    category: "Raport audytowy",
    summary: "Szczegółowa karta wybranego badania WCAG z metrykami, historią re-audytów i listą podstron.",
    purpose:
      "Prezentuje syntetyczne wnioski z badania, certyfikację zgodności, chronologię re-audytów oraz stan poszczególnych badanych widoków.",
    keyElements: [
      {
        name: "Wskaźnik ogólny (%) i Triada Błędów",
        badge: "KPI badania",
        desc: "Podsumowanie liczby błędów Priorytetowych, Ważnych i Marginalnych na całym badanym serwisie.",
      },
      {
        name: "Śledzenie re-audytów",
        badge: "Weryfikacja",
        desc: "Lista ponownych weryfikacji powdrożeniowych z datami i informacją o liczbie naprawionych kryteriów.",
      },
      {
        name: "Lista zbadanych elementów / podstron",
        badge: "Zakres",
        desc: "Każdy przebadany ekran (np. podstrona konta, formularz) z liczbą wykrytych usterek i odnośnikiem do edytora błędów.",
      },
      {
        name: "Pobierz raport (.pdf)",
        badge: "Eksport",
        desc: "Generowanie certyfikowanego pliku PDF podsumowującego audyt dla compliance i regulatora.",
      },
    ],
    steps: [
      "Krok 1: Przeanalizuj ogólną punktację i sprawdź, czy audyt posiada re-audyty powdrożeniowe.",
      "Krok 2: Sprawdź listę zbadanych elementów i zidentyfikuj podstrony o najniższej dostępności.",
      "Krok 3: Kliknij wybrany element, aby otworzyć listę konkretnych błędów z opisami i wytycznymi.",
    ],
    tips: [
      "Raport PDF można pobrać w prawym górnym rogu nagłówka i przekazać do dokumentacji wdrożeniowej.",
    ],
  },
  "raport-bledy": {
    id: "raport-bledy",
    title: "Edytor i Rejestr Błędów Podstrony",
    category: "Analiza błędów",
    summary: "Szczegółowy wykaz wszystkich naruszeń WCAG zdiagnozowanych na konkretnym ekranie.",
    purpose:
      "Dostarcza deweloperom i audytorom precyzyjnych informacji: opis problemu, kryterium sukcesu, zrzuty ekranu oraz rekomendacje naprawcze.",
    keyElements: [
      {
        name: "Akordeony błędów",
        badge: "Szczegóły",
        desc: "Rozwijane panele dla każdego błędu z unikalnym ID, kryterium sukcesu i poziomem (A / AA).",
      },
      {
        name: "Zrzuty ekranu z dowodami",
        badge: "Lightbox",
        desc: "Klikalne miniatury zrzutów ekranu obrazujące barierę u użytkownika asystującego.",
      },
      {
        name: "Rekomendacja audytora",
        badge: "Wskazówki",
        desc: "Eksperckie wytyczne co do wymaganej semantyki, atrybutów i zachowania klawiatury.",
      },
      {
        name: "Konsultuj z audytorem (Nowy wątek)",
        badge: "Konsultacje",
        desc: "Dedykowany przycisk na kafelku błędu umożliwiający natychmiastowe zadanie pytania audytorowi WCAG odnośnie interpretacji wytycznej lub propozycji fixu.",
      },
      {
        name: "Powiązanie zadania w Jira",
        badge: "Integracja",
        desc: "Pole klucza zadania w Jira (np. ACC-104) bezpośrednio w nagłówku błędu, ułatwiające powiązanie ze sprintem programistów.",
      },
    ],
    steps: [
      "Krok 1: Rozwiń wybrany błąd klikając w jego nagłówek.",
      "Krok 2: Przeczytaj 'Opis problemu' oraz zapoznaj się ze zrzutem ekranu powiększając go kliknięciem.",
      "Krok 3: Przekaż wytyczne z sekcji 'Rekomendacja' do zespołu deweloperskiego odpowiedzialnego za ten moduł.",
      "Krok 4: Jeśli deweloperzy mają wątpliwości lub proponują alternatywny fix, kliknij 'Konsultuj z audytorem', aby zadać pytanie bez zwoływania spotkania.",
    ],
    tips: [
      "Kliknięcie miniatury zrzutu ekranu otwiera pełnoekranowy podgląd Lightbox.",
    ],
  },
  "baza-uslug": {
    id: "baza-uslug",
    title: "Baza Usług i Procesów",
    category: "Architektura usług",
    summary: "Centralny wykaz procesów cyfrowych banku z horyzontalnym podziałem na kategorie, filtrami i metrykami WCAG.",
    purpose:
      "Umożliwia monitorowanie zgodności WCAG wszystkich ścieżek transakcyjnych banku, weryfikację 100% pokrycia audytowego oraz bezpośrednie zlecanie re-audytów powdrożeniowych.",
    keyElements: [
      {
        name: "Pasek wskaźników KPI",
        badge: "Metryki",
        desc: "Zagregowane wskaźniki: liczba procesów (50), pokrycie audytowe (100%), średnia dostępność WCAG (93.4%) i aktywne skargi.",
      },
      {
        name: "Horyzontalny selektor kategorii",
        badge: "Nawigacja",
        desc: "Pille/zakładki do przełączania obszarów bankowych (Płatności, Kredyty, Maklerskie) na pełnej szerokości siatki 1600 px.",
      },
      {
        name: "Przełącznik Tabela / Kafelki",
        badge: "Układ",
        desc: "Wybór pomiędzy widokiem bogatych kafelków z metrykami a zwartą tabelą danych dla audytorów i compliance.",
      },
      {
        name: "Wyszukiwarka i filtry kanałów",
        badge: "Filtrowanie",
        desc: "Błyskawiczne zawężanie procesów po nazwie, zespole, kanale (WWW/Mobile) oraz przedziale zgodności WCAG.",
      },
    ],
    steps: [
      "Krok 1: Wybierz kategorię usług z poziomego paska lub skorzystaj z wyszukiwarki do przeszukania wszystkich 50 procesów.",
      "Krok 2: Użyj przełącznika widoku (Kafelki lub Tabela) w zależności od preferowanego poziomu szczegółowości.",
      "Krok 3: Kliknij kartę lub wiersz procesu, aby otworzyć wykaz kroków i zbadanych ekranów.",
      "Krok 4: W razie potrzeby użyj przycisku 'Zleć re-audyt' bezpośrednio z kafelka lub w nagłówku strony.",
    ],
    tips: [
      "Widok kafelkowy prezentuje wizualne podsumowanie i opis procesu, natomiast widok tabelaryczny sprawdza się przy audytach i porównywaniu wielu procesów.",
    ],
  },
  raportowanie: {
    id: "raportowanie",
    title: "Centrum Raportowania Zarządczego",
    category: "Zarządzanie i Compliance",
    summary: "Wielowymiarowe raporty dla kadry zarządzającej, audytorów zewnętrznych i organów regulacyjnych.",
    purpose:
      "Agreguje dane o postępach, rejestrze ryzyka, dotrzymaniu terminów SLA oraz spełnieniu wymogów prawnych (EAA i ustawy o dostępności cyfrowej).",
    keyElements: [
      {
        name: "4 Zakładki tematyczne",
        badge: "Moduły",
        desc: "Raporty z audytów, Dostępność usług, Raport zarządczy oraz Zgodność regulacyjna PAD.",
      },
      {
        name: "Rejestr Ryzyka (Błędy po SLA)",
        badge: "Eskalacja",
        desc: "Tabela naruszeń priorytetowych, które przekroczyły deklarowany czas naprawy wraz z przyciskiem eskalacji.",
      },
      {
        name: "Ranking dojrzałości usług",
        badge: "Analiza",
        desc: "Zestawienie usług o najwyższej i najniższej zgodności ze standardem WCAG.",
      },
    ],
    steps: [
      "Krok 1: Wybierz odpowiednią zakładkę raportową (np. 'Zarządcze' na spotkanie komitetu).",
      "Krok 2: Skonfiguruj filtry kontekstu (jednostka biznesowa, kanał, horyzont czasowy).",
      "Krok 3: Zweryfikuj Rejestr Ryzyka i podejmij decyzję o ewentualnej eskalacji do właścicieli biznesowych.",
    ],
    tips: [
      "Raport regulacyjny PAD odpowiada oficjalnemu wzorowi wymaganemu podczas kontroli organów nadzorczych.",
    ],
  },
  reklamacje: {
    id: "reklamacje",
    title: "Moduł Skarg i Reklamacji",
    category: "Obsługa zgłoszeń",
    summary: "Zarządzanie barierami dostępności zgłoszonymi bezpośrednio przez klientów lub pracowników.",
    purpose:
      "Umożliwia szybką rejestrację incydentu dostępności, przekazanie go do certyfikowanego audytora WCAG, opracowanie zaleceń technicznych i monitorowanie wdrożenia.",
    keyElements: [
      {
        name: "Pasek wskaźników zgłoszeń",
        badge: "Status",
        desc: "Liczba otwartych zgłoszeń, oczekujących na audytora, z gotową rekomendacją oraz rozwiązanych.",
      },
      {
        name: "Karty skarg i reklamacji",
        badge: "Rejestr",
        desc: "Zgłoszenie z unikalnym ID, priorytetem, statusem, kanałem dostępu oraz ścieżką w Bazie Usług.",
      },
      {
        name: "Przycisk '+ Nowe zgłoszenie'",
        badge: "Akcja",
        desc: "Formularz rejestracji nowej bariery zgłoszonej przez klienta lub organizację.",
      },
      {
        name: "Filtry wg statusu i usługi",
        badge: "Filtrowanie",
        desc: "Szybki wybór spraw wymagających działania lub posiadających gotowe rekomendacje.",
      },
    ],
    steps: [
      "Krok 1: Kliknij '+ Nowe zgłoszenie', aby wprowadzić barierę zgłoszoną przez klienta.",
      "Krok 2: Przypisany audytor przeanalizuje problem i doda w zgłoszeniu 'Rekomendację eksperta WCAG' z wytycznymi atrybutów.",
      "Krok 3: Wejdź w szczegóły zgłoszenia, zapoznaj się z zaleceniami i przekaż je zespołowi deweloperskiemu.",
      "Krok 4: Po wdrożeniu i weryfikacji zmień status sprawy na 'Zamknięte'.",
    ],
    tips: [
      "Zgłoszenia ze statusem 'Priorytetowy' podlegają 24-godzinnemu czasowi reakcji audytorskiej.",
    ],
  },
  "reklamacja-szczegoly": {
    id: "reklamacja-szczegoly",
    title: "Szczegóły Skargi i Rekomendacja WCAG",
    category: "Obsługa zgłoszenia",
    summary: "Widok pojedynczego zgłoszenia z diagnozą audytorską, rekomendacją techniczną i historią ustaleń.",
    purpose:
      "Stanowi most komunikacyjny pomiędzy klientem/koordynatorem a zespołem technicznym, dostarczając jasnych wytycznych bez narzucania konkretnej implementacji kodu.",
    keyElements: [
      {
        name: "Treść zgłoszonej skargi",
        badge: "Dane klienta",
        desc: "Szczegółowy opis problemu od użytkownika, środowisko testowe (np. NVDA) i kryterium WCAG.",
      },
      {
        name: "Rekomendacja eksperta WCAG",
        badge: "Ekspertyza",
        desc: "Diagnoza przyczyny, rekomendowane rozwiązanie semantyczne oraz lista wymaganych atrybutów.",
      },
      {
        name: "Rekomendowane atrybuty",
        badge: "Wytyczne",
        desc: "Zwięzła lista znaczników i atrybutów (np. <button>, role='button', tabindex='0', aria-label).",
      },
      {
        name: "Zarządzanie statusem (Prawy panel)",
        badge: "Workflow",
        desc: "Dropdown wyboru statusu (Nowe, Oczekuje, Gotowa rekomendacja, W trakcie wdrożenia, Zamknięte).",
      },
      {
        name: "Powiązana Konsultacja WCAG",
        badge: "Konsultacje",
        desc: "Dedykowany wątek konsultacji z audytorem dla tej skargi – możliwość zadania pytań bez umawiania spotkań i podgląd statusu odpowiedzi.",
      },
      {
        name: "Powiązanie z zadaniem w Jira",
        badge: "Integracja",
        desc: "Klucz zadania w Jira (np. ACC-104) umożliwiający bezpośrednie przejście do sprintu deweloperów.",
      },
    ],
    steps: [
      "Krok 1: Przeczytaj opis zgłoszenia od klienta i sprawdź środowisko asystujące.",
      "Krok 2: Zapoznaj się z 'Rekomendacją eksperta WCAG' oraz listą sugerowanych atrybutów.",
      "Krok 3: W razie wątpliwości skorzystaj z karty 'Konsultacja z audytorem' i zadaj pytanie w wątku.",
      "Krok 4: Wprowadź klucz zadania Jira, zmień status na 'W trakcie wdrożenia u klienta' i przekaż wytyczne do deweloperów.",
    ],
    tips: [
      "Rekomendacja nie zawiera gotowego kodu źródłowego – implementacja należy do deweloperów klienta.",
    ],
  },
  "reklamacja-nowa": {
    id: "reklamacja-nowa",
    title: "Formularz Nowego Zgłoszenia Skargi",
    category: "Nowe zgłoszenie",
    summary: "Rejestracja nowej bariery dostępności zgłoszonej przez klienta lub koordynatora.",
    purpose:
      "Ustrukturyzowane zebranie informacji o incydencie w celu przekazania go audytorom do rzetelnej analizy.",
    keyElements: [
      {
        name: "Tytuł i Priorytet",
        badge: "Podstawowe",
        desc: "Zwięzły tytuł usterki oraz waga (Priorytetowy dla blokad, Ważny dla utrudnień).",
      },
      {
        name: "Kanał i Kryterium WCAG",
        badge: "Klasyfikacja",
        desc: "Wybór kanału (WWW, Android, iOS, PDF) oraz podejrzenia naruszonego kryterium sukcesu.",
      },
      {
        name: "Powiązanie w Bazie Usług",
        badge: "Struktura",
        desc: "Wskazanie usługi, procesu i konkretnego ekranu lub kroku, na którym wystąpił problem.",
      },
      {
        name: "Opis sytuacji od klienta",
        badge: "Opis",
        desc: "Dokładne odwzorowanie okoliczności wystąpienia błędu i zachowania technologii asystującej.",
      },
    ],
    steps: [
      "Krok 1: Wpisz tytuł i wybierz odpowiedni priorytet sprawy.",
      "Krok 2: Wybierz kanał dostępu oraz powiązaną usługę z Bazy Usług.",
      "Krok 3: Opisz dokładnie problem i środowisko klienta (np. przeglądarka i wersja czytnika NVDA).",
      "Krok 4: Kliknij 'Utwórz zgłoszenie' – sprawa natychmiast trafi do rejestru audytorów.",
    ],
    tips: [
      "Dokładny opis środowiska asystującego (np. NVDA 2024 na Chrome) przyspiesza diagnozę o 80%.",
    ],
  },
  profil: {
    id: "profil",
    title: "Zarządzanie Kontem i Organizacją",
    category: "Konfiguracja i Branding",
    summary: "Panel zarządzania logo klienta na pulpicie, tożsamością instytucji, standardami WCAG oraz kontem koordynatora.",
    purpose:
      "Umożliwia klientowi personalizację platformy W-ally poprzez wgranie własnego logo, określenie docelowego progu dostępności WCAG oraz wyznaczenie osób odpowiedzialnych za deklarację dostępności.",
    keyElements: [
      {
        name: "Logo Klienta & Branding",
        badge: "Identyfikacja",
        desc: "Wprowadź adres URL logo (np. Erste) lub wgraj plik z dysku. Logo jest prezentowane na pulpicie i w nagłówkach raportów.",
      },
      {
        name: "Wymóg WCAG 1.1.1 (Tekst alternatywny)",
        badge: "Dostępność",
        desc: "Każde logo musi posiadać opis alternatywny odczytywany przez czytniki ekranu osób z niepełnosprawnością wzroku.",
      },
      {
        name: "Standard Referencyjny (WCAG 2.1 / 2.2 / EAA)",
        badge: "Zgodność",
        desc: "Wybór wytycznych będących podstawą audytów i obliczania wskaźników dojrzałości cyfrowej.",
      },
      {
        name: "Strategiczny cel zgodności (%)",
        badge: "Cel KPI",
        desc: "Docelowy próg spełnienia kryteriów sukcesu (np. 90%), widoczny na głównym kafelku na pulpicie.",
      },
      {
        name: "Koordynator ds. Dostępności",
        badge: "Kontakt",
        desc: "Dane osoby odpowiedzialnej za kontakt w sprawach dostępności cyfrowej zgodnie z art. 10 ustawy.",
      },
    ],
    steps: [
      "Krok 1: W zakładce 'Logo & Branding' wklej link do logo lub wybierz plik z dysku.",
      "Krok 2: Uzupełnij tekst alternatywny dla logo (zgodnie z WCAG 1.1.1).",
      "Krok 3: W zakładce 'Standardy WCAG' ustaw docelowy próg dostępności dla organizacji.",
      "Krok 4: Kliknij 'Zapisz i przejdź do pulpitu', aby natychmiast zobaczyć nowe logo.",
    ],
    tips: [
      "Wgranie pliku w formacie SVG lub transparentnego PNG zapewnia idealną ostrość logo na każdym ekranie.",
    ],
  },
};

const FAQ_ITEMS = [
  {
    q: "Jak skonsultować błąd lub kryterium WCAG z audytorem bez umawiania spotkania online?",
    a: "Skorzystaj z modułu 'Konsultacje'. Możesz przejść do niego klikając ikonę wiadomości w prawym górnym rogu navbara lub użyć przycisku 'Konsultuj z audytorem' bezpośrednio przy konkretnym błędzie na karcie audytu lub w szczegółach skargi. Wpisz temat, opisz wątpliwości lub propozycję fixu od programistów, a w razie potrzeby załącz kod lub zrzut ekranu. Certyfikowany audytor odpowie w wątku bez konieczności rezerwowania czasu na spotkanie wideo.",
  },
  {
    q: "Jak dowiem się, że audytor odpowiedział na moje zapytanie konsultacyjne?",
    a: "Platforma W-ally powiadomi Cię wielokanałowo: 1) na ikonie Konsultacji w prawym górnym rogu paska nawigacji pojawi się zielony pulsujący wskaźnik z liczbą nowych odpowiedzi, 2) na Pulpicie w module Konsultacji wyświetli się dedykowany zielony baner z podglądem ostatniej wypowiedzi audytora, 3) w centrum powiadomień pod ikoną dzwonka pojawi się powiadomienie w zakładce 'Konsultacje'. Kliknięcie w dowolny z tych elementów natychmiast otwiera właściwy wątek.",
  },
  {
    q: "Czym różni się zapytanie w Konsultacjach od zlecenia formalnego Re-audytu?",
    a: "Konsultacja to bieżący kontakt doradczo-techniczny – służy do wyjaśniania niejasności, interpretacji kryteriów WCAG lub oceny koncepcji poprawki przed jej zaimplementowaniem. Re-audyt (weryfikacja powdrożeniowa) to formalne badanie audytorskie zlecane po wdrożeniu zmian na środowisku, które oficjalnie potwierdza usunięcie usterki, zamyka pozycję w Rejestrze Ryzyka i podnosi wskaźnik zgodności usługi.",
  },
  {
    q: "Czy mogę powiązać błąd audytowy lub skargę z zadaniem w systemie Jira?",
    a: "Tak. Zarówno na kafelku błędu podstrony, jak i w panelu zarządzania skargą znajduje się dedykowane pole na klucz zadania (np. ACC-104) lub pełny link URL. Po zapisaniu system tworzy bezpośredni odnośnik do Twojego projektu w Jira, co ułatwia koordynację pracy programistów z rejestrem WCAG.",
  },
  {
    q: "Jak zgłosić nową skargę lub barierę zgłoszoną przez klienta?",
    a: "Przejdź do zakładki 'Skargi i reklamacje' w górnym menu, a następnie kliknij przycisk '+ Nowe zgłoszenie' w prawym górnym rogu. Wypełnij formularz podając tytuł, priorytet, powiązaną usługę oraz dokładny opis sytuacji i używane technologie asystujące (np. NVDA). Zgłoszenie natychmiast trafi do kolejki certyfikowanych audytorów WCAG.",
  },
  {
    q: "Dlaczego w rekomendacjach technicznych nie ma gotowego kodu programistycznego?",
    a: "Zgodnie ze standardami audytorskimi, platforma W-ally dostarcza wytycznych architektonicznych, diagnozy przyczyn oraz listy wymaganych atrybutów semantycznych (np. role='button', tabindex='0', aria-label). Implementacja kodu źródłowego leży po stronie wewnętrznego zespołu programistów klienta, co zapobiega konfliktom ze specyfiką stosowanego frameworka i architektury frontendowej.",
  },
  {
    q: "Jak przełączyć układ widoku audytów między tabelą a kafelkami?",
    a: "W widoku 'Audyty' tuż obok paska sortowania znajduje się przełącznik widoku z ikonami Tabela (trzy linie) oraz Kafelki (cztery kwadraty). Widok tabeli jest zalecany do szybkiego przeglądu wielu wskaźników naraz, a widok kafelkowy ułatwia wizualną ocenę poszczególnych serwisów.",
  },
  {
    q: "Czym różni się błąd Priorytetowy od Ważnego i Marginalnego?",
    a: "Błąd Priorytetowy (czerwony) całkowicie blokuje użytkownika asystującego w wykonaniu kluczowej czynności (np. brak obsługi klawiatury w przelewie). Błąd Ważny (bursztynowy) znacząco utrudnia korzystanie z serwisu (np. zbyt słaby kontrast), ale istnieje alternatywna ścieżka. Błąd Marginalny (niebieski) to drobna usterka formalna nieutrudniająca realizacji zadań.",
  },
  {
    q: "Co oznacza re-audyt i kiedy należy go zlecić?",
    a: "Re-audyt to ponowna weryfikacja dostępności przeprowadzana po wdrożeniu poprawek przez zespół programistyczny. Potwierdza trwałe usunięcie błędu, aktualizuje wskaźnik zgodności (%) usługi w Bazie Usług oraz zamyka pozycję w Rejestrze Ryzyka.",
  },
  {
    q: "Jakie wymogi nakłada Europejski Akt o Dostępności (EAA)?",
    a: "EAA (Dyrektywa UE 2019/882) nakłada na instytucje finansowe, banki i serwisy e-commerce prawny obowiązek zapewnienia pełnej dostępności cyfrowej zgodnie ze standardem WCAG 2.1 AA. Brak zgodności od 2025/2026 roku wiąże się z karami finansowymi oraz ryzykiem wstrzymania dystrybucji produktów cyfrowych.",
  },
];

function HelpGuideModal({ isOpen, onClose, currentView, onNavigate }) {
  const [activeTab, setActiveTab] = useState("guide");
  const [selectedView, setSelectedView] = useState(currentView || "przeglad");
  const [glossarySearch, setGlossarySearch] = useState("");
  const [glossaryCategory, setGlossaryCategory] = useState("all");
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Synchronizuj wybrany widok z aktualnym ekranem przy otwarciu
  useEffect(() => {
    if (isOpen) {
      // Jeśli jesteśmy na podwidoku procesu, mapujemy na baza-uslug lub proces-szczegoly
      setSelectedView(currentView || "przeglad");
      setActiveTab("guide");
    }
  }, [isOpen, currentView]);

  // Obsługa klawisza Escape i blokada scrollowania body
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Aktywny przewodnik dla wybranego ekranu
  const guide = VIEW_GUIDES[selectedView] || VIEW_GUIDES.przeglad;

  // Filtrowanie słownika pojęć
  const filteredGlossary = GLOSSARY_ITEMS.filter((item) => {
    const matchesCategory =
      glossaryCategory === "all" || item.category === glossaryCategory;
    const q = glossarySearch.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.term.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q) ||
      (item.practicalTip && item.practicalTip.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  const categories = ["all", "Współpraca", "Standardy", "Klasyfikacja błędów", "Technologie", "Prawo", "Wskaźniki"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* NAGŁÓWEK MODALA */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0038F8] text-white flex items-center justify-center shadow-sm shrink-0">
              <HelpCircle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="help-modal-title" className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                  Pomoc
                </h2>
                <Badge variant="brand" className="hidden sm:inline-flex">
                  WCAG 2.1 AA
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Przewodnik po platformie, instrukcje ekranów, moduł Konsultacji i słownik pojęć WCAG
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Zamknij pomoc"
          >
            <X size={20} />
          </button>
        </div>

        {/* PASEK ZAKŁADEK */}
        <div className="flex items-center px-4 sm:px-6 border-b border-slate-200 bg-white gap-2 sm:gap-4 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "guide"
                ? "border-[#0038F8] text-[#0038F8]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass size={16} />
            <span>Instrukcja ekranu</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-[#0038F8] font-bold">
              {guide.category}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("glossary")}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "glossary"
                ? "border-[#0038F8] text-[#0038F8]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen size={16} />
            <span>Słownik pojęć WCAG</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              {GLOSSARY_ITEMS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("faq")}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "faq"
                ? "border-[#0038F8] text-[#0038F8]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileQuestion size={16} />
            <span>Częste pytania (FAQ)</span>
          </button>
        </div>

        {/* TREŚĆ MODALA - SCROLLOWALNA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8fafc] space-y-6">
          {/* ======================================================== */}
          {/* ZAKŁADKA 1: INSTRUKCJA EKRANU                            */}
          {/* ======================================================== */}
          {activeTab === "guide" && (
            <div className="space-y-6">
              {/* SZYBKI WYBÓR EKRANU DO PRZEJRZENIA */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <span className="text-xs font-bold text-slate-600">
                  Przeglądasz instrukcję dla:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "przeglad", label: "Pulpit" },
                    { id: "tickety", label: "Konsultacje" },
                    { id: "raporty", label: "Audyty" },
                    { id: "raport-szczegoly", label: "Szczegóły audytu" },
                    { id: "raport-bledy", label: "Błędy podstrony" },
                    { id: "baza-uslug", label: "Baza Usług" },
                    { id: "raportowanie", label: "Raportowanie" },
                    { id: "reklamacje", label: "Skargi i reklamacje" },
                    { id: "reklamacja-szczegoly", label: "Szczegóły skargi" },
                    { id: "komunikaty", label: "Komunikaty" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedView(v.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedView === v.id
                          ? "bg-[#0038F8] text-white border-[#0038F8] shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* KARTA: CEL I PRZEZNACZENIE EKRANU */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{guide.title}</span>
                  </h3>
                  <Badge variant="info">{guide.category}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 mb-3">
                  {guide.purpose}
                </p>
                <div className="text-xs text-slate-500 font-medium">
                  {guide.summary}
                </div>
              </div>

              {/* KARTA: WIDOCZNE ELEMENTY INTERFEJSU */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <Layout size={15} className="text-[#0038F8]" />
                  <span>Widoczne elementy interfejsu i ich znaczenie</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guide.keyElements.map((el, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#0038F8]/40 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-xs text-slate-900">
                          {el.name}
                        </span>
                        <span className="text-[10px] font-semibold text-[#0038F8] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {el.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {el.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KARTA: REKOMENDOWANY WORKFLOW (KROK PO KROKU) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <ListChecks size={16} className="text-emerald-600" />
                  <span>Rekomendowany sposób pracy na tym ekranie (Krok po kroku)</span>
                </h3>

                <div className="space-y-2.5">
                  {guide.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#0038F8] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KARTA: WSKAZÓWKI I DOBRE PRAKTYKI */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Lightbulb size={14} className="text-amber-600 shrink-0" />
                  <span>Wskazówki koordynatora dostępności:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 ml-1">
                  {guide.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ZAKŁADKA 2: SŁOWNIK POJĘĆ WCAG & W-ALLY                  */}
          {/* ======================================================== */}
          {activeTab === "glossary" && (
            <div className="space-y-4">
              {/* WYSZUKIWARKA I KATEGORIE */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={glossarySearch}
                    onChange={(e) => setGlossarySearch(e.target.value)}
                    placeholder="Wyszukaj pojęcie, skrót, kryterium (np. Kontrast, NVDA, EAA, POUR)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/40"
                  />
                  {glossarySearch && (
                    <button
                      type="button"
                      onClick={() => setGlossarySearch("")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold p-0.5"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGlossaryCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        glossaryCategory === cat
                          ? "bg-[#0038F8] text-white border-[#0038F8]"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cat === "all" ? "Wszystkie pojęcia" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* LISTA POJĘĆ */}
              {filteredGlossary.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
                  <BookOpen size={28} className="mx-auto text-slate-300" />
                  <div className="font-bold text-slate-800 text-sm">
                    Brak pojęć dla zapytania „{glossarySearch}”
                  </div>
                  <p className="text-xs text-slate-400">
                    Spróbuj zmienić kategorię lub wpisać krótszą frazę.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setGlossarySearch("");
                      setGlossaryCategory("all");
                    }}
                    className="text-xs font-bold text-[#0038F8] hover:underline"
                  >
                    Wyczyść filtry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredGlossary.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-[#0038F8]/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                            {item.term}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line mb-3">
                          {item.definition}
                        </p>
                      </div>

                      {item.practicalTip && (
                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5 bg-slate-50/70 p-2 rounded-lg">
                          <Lightbulb size={13} className="text-[#0038F8] shrink-0 mt-0.5" />
                          <span>{item.practicalTip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* ZAKŁADKA 3: CZĘSTE PYTANIA (FAQ) & PROCEDURY             */}
          {/* ======================================================== */}
          {activeTab === "faq" && (
            <div className="space-y-3">
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/70 text-xs text-blue-900 mb-4">
                <span className="font-bold">Baza wiedzy i procedury W-ally:</span> Poniżej znajdują się odpowiedzi na najczęstsze pytania koordynatorów dostępności oraz rekomendowane procedury postępowania w systemie.
              </div>

              {FAQ_ITEMS.map((faq, idx) => {
                const isExpanded = expandedFaqId === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isExpanded ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <FileQuestion size={16} className="text-[#0038F8] shrink-0" />
                        <span>{faq.q}</span>
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="p-4 pt-1 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 bg-slate-50/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* STOPKA MODALA */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>Naciśnij klawisz <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Esc</kbd> lub kliknij w tło, aby powrócić do ekranu.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Zamknij pomoc
          </button>
        </div>
      </div>
    </div>
  );
}

function TopNavbar({
  currentView,
  setCurrentView,
  onLogout,
  isAnnouncementsOpen,
  setIsAnnouncementsOpen,
  announcements,
  setAnnouncements,
  tickets = [],
  setTickets,
  unreadTicketsCount = 0,
  onOpenTicket,
  onOpenNewTicket,
  isHelpOpen,
  setIsHelpOpen,
  showToast,
  clientProfile,
  onOpenProfile,
}: {
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout: () => void;
  isAnnouncementsOpen: boolean;
  setIsAnnouncementsOpen: (open: boolean) => void;
  announcements: any[];
  setAnnouncements: any;
  tickets?: any[];
  setTickets?: any;
  unreadTicketsCount?: number;
  onOpenTicket?: (ticketId: string) => void;
  onOpenNewTicket?: (context?: any) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;
  showToast?: (title: string, text: string, type?: string) => void;
  clientProfile?: any;
  onOpenProfile?: (
    tab?: "branding" | "team" | "wcag" | "account" | "notifications"
  ) => void;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadAnnouncementsCount = (announcements || []).filter((a) => a.unread).length;
  const totalUnreadNotifications = unreadAnnouncementsCount + unreadTicketsCount;

  const menuItems = [
    { id: "przeglad", label: "Pulpit", icon: LayoutGrid },
    { id: "raporty", label: "Audyty", icon: ClipboardCheck },
    { id: "baza-uslug", label: "Baza Usług", icon: Library },
    { id: "raportowanie", label: "Raportowanie", icon: BarChart2 },
    { id: "reklamacje", label: "Skargi i reklamacje", icon: MessageSquare },
  ];

  return (
    <header
      data-testid="top-navbar"
      className="bg-white border-b border-slate-200 sticky top-0 z-40 w-full shadow-xs flex-shrink-0"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* LEWA STRONA: LOGO */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setCurrentView("przeglad")}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-10 h-10 bg-[#0038F8] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#0038F8]/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <Eye size={22} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 leading-none">
                W-ally
              </span>
            </button>
          </div>

          {/* ŚRODEK: POZIOME MENU (DESKTOP) */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive =
                currentView === item.id ||
                (item.id === "baza-uslug" && currentView === "proces-szczegoly") ||
                (item.id === "raporty" && (currentView === "raport-szczegoly" || currentView === "raport-bledy")) ||
                (item.id === "reklamacje" && (currentView === "reklamacja-szczegoly" || currentView === "reklamacja-nowa"));
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-blue-50 text-[#0038F8] shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon
                    size={17}
                    className={isActive ? "text-[#0038F8]" : "text-slate-500"}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* PRAWA STRONA: KOMUNIKATY I PROFIL */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Przycisk Pomoc */}
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              title="Pomoc"
              aria-label="Pomoc"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-[#0038F8] bg-slate-50 hover:bg-blue-50/80 transition-all cursor-pointer font-bold text-xs border border-slate-200/80 hover:border-[#0038F8]/30 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
            >
              <HelpCircle size={16} className="text-[#0038F8] shrink-0" />
              <span className="hidden sm:inline">Pomoc</span>
            </button>

            {/* Przycisk Konsultacji z audytorami */}
            <button
              type="button"
              onClick={() => {
                if (onOpenTicket) onOpenTicket(tickets[0]?.id || "TCK-104");
                else setCurrentView("tickety");
              }}
              title="Konsultacje"
              aria-label="Konsultacje z audytorami"
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 relative ${
                currentView === "tickety"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <MessageSquareText size={19} />
                {unreadTicketsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-extrabold text-white bg-emerald-600 rounded-full ring-2 ring-white shadow-xs pointer-events-none animate-pulse">
                    {unreadTicketsCount}
                  </span>
                )}
              </div>
            </button>

            {/* Przycisk Komunikatów i Ofert ("Dla Ciebie") z Dropdownem powiadomień */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAnnouncementsOpen(!isAnnouncementsOpen)}
                title="Powiadomienia: Odpowiedzi audytorów oraz Komunikaty"
                aria-label="Otwórz menu powiadomień i komunikatów"
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 ${
                  isAnnouncementsOpen
                    ? "bg-blue-50 text-[#0038F8]"
                    : "text-slate-600 hover:text-[#0038F8] hover:bg-blue-50/80"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Bell size={19} />
                  {totalUnreadNotifications > 0 && (
                    <span className={`absolute -top-1.5 -right-2 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-extrabold text-white rounded-full ring-2 ring-white shadow-xs pointer-events-none ${
                      unreadTicketsCount > 0 ? "bg-emerald-600" : "bg-[#0038F8]"
                    }`}>
                      {totalUnreadNotifications}
                    </span>
                  )}
                </div>
              </button>

              {/* Kompaktowe rozwinięcie - Zakładki: Odpowiedzi audytorów + Komunikaty */}
              {isAnnouncementsOpen && (
                <AnnouncementsDropdown
                  announcements={announcements}
                  setAnnouncements={setAnnouncements}
                  tickets={tickets}
                  setTickets={setTickets}
                  onClose={() => setIsAnnouncementsOpen(false)}
                  onViewAllAnnouncements={() => {
                    setIsAnnouncementsOpen(false);
                    setCurrentView("komunikaty");
                  }}
                  onViewAllTickets={() => {
                    setIsAnnouncementsOpen(false);
                    setCurrentView("tickety");
                  }}
                  onOpenTicket={(ticketId) => {
                    setIsAnnouncementsOpen(false);
                    if (onOpenTicket) onOpenTicket(ticketId);
                    else setCurrentView("tickety");
                  }}
                  showToast={showToast}
                />
              )}
            </div>

            {/* Profil użytkownika */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              >
                <img
                  src={
                    clientProfile?.userAvatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4"
                  }
                  alt={clientProfile?.userName || "Użytkownik"}
                  className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 object-cover flex-shrink-0"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {clientProfile?.userName || "Kinga Wróblewska"}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600">
                    {clientProfile?.userRole || "Koordynator Dostępności"}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-500 hidden sm:block transition-transform duration-200 ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 shadow-xl rounded-xl z-50 py-1.5 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                      <div className="text-xs font-bold text-slate-800">
                        {clientProfile?.userName || "Kinga Wróblewska"}
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        {clientProfile?.userRole || "Koordynator Dostępności"}
                      </div>
                      <div className="text-[10px] text-[#0038F8] font-bold mt-0.5">
                        {clientProfile?.orgName || "Erste Group Bank"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onOpenProfile) {
                          onOpenProfile("account");
                        } else {
                          setCurrentView("profil");
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                        currentView === "profil"
                          ? "bg-blue-50 text-[#0038F8]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User
                          size={15}
                          className={
                            currentView === "profil"
                              ? "text-[#0038F8]"
                              : "text-slate-500"
                          }
                        />
                        <span>Zarządzaj kontem</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Profil & Zespół
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors border-t border-slate-100 cursor-pointer"
                    >
                      <LogOut size={15} className="text-red-700" />
                      Wyloguj się
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Przycisk menu mobilnego */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Zamknij menu" : "Otwórz menu nawigacji"}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ROZWIJANE MENU MOBILNE */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenProfile) {
                  onOpenProfile("account");
                } else {
                  setCurrentView("profil");
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                currentView === "profil"
                  ? "bg-blue-50 text-[#0038F8]"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <User size={18} className="text-[#0038F8]" />
                <span>Zarządzaj kontem</span>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {clientProfile?.orgShortName || "Erste"}
              </span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsHelpOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-[#0038F8] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-[#0038F8]" />
                <span>Pomoc</span>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Instrukcje & FAQ</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setCurrentView("komunikaty");
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-[#0038F8] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-[#0038F8]" />
                <span>Komunikaty i Oferty</span>
              </div>
              {unreadAnnouncementsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0038F8] text-white">
                  {unreadAnnouncementsCount} nowe
                </span>
              )}
            </button>

            {menuItems.map((item) => {
              const isActive =
                currentView === item.id ||
                (item.id === "baza-uslug" && currentView === "proces-szczegoly") ||
                (item.id === "raporty" && (currentView === "raport-szczegoly" || currentView === "raport-bledy")) ||
                (item.id === "reklamacje" && (currentView === "reklamacja-szczegoly" || currentView === "reklamacja-nowa"));
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-[#0038F8]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-[#0038F8]" : "text-slate-500"}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end px-3">
              <button
                onClick={onLogout}
                className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LogOut size={13} /> Wyloguj się
              </button>
            </div>
          </div>
        )}
      </div>


      {/* MODAL POMOCY */}
      <HelpGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        currentView={currentView}
        onNavigate={(targetView) => {
          setCurrentView(targetView);
          setIsHelpOpen(false);
        }}
      />
    </header>
  );
}

// Kompatybilność wsteczna
function Sidebar(props) {
  return <TopNavbar {...props} />;
}

// ==========================================
// UNIWERSALNY, ZUNIFIKOWANY NAGŁÓWEK WIDOKU
// ==========================================

function ViewHeader({
  breadcrumbs = [],
  badges,
  title,
  subtitle,
  actions,
  children,
  className = "",
  topBanner,
}) {
  return (
    <div className={`w-full bg-white z-20 flex-shrink-0 border-b border-slate-200 shadow-2xs ${className}`}>
      <div className={`max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 ${children || topBanner ? "pt-3.5 pb-3 sm:pt-5 sm:pb-4" : "py-3.5 sm:py-6"}`}>
        {/* Prosty, czytelny, standardowy breadcrumbs bez ikonek i kolorów */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Ścieżka nawigacyjna" className="flex items-center text-[13px] font-medium text-slate-500 mb-2">
            <ol role="list" className="flex items-center flex-wrap gap-2 list-none m-0 p-0">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={idx} className="flex items-center gap-2">
                    {idx > 0 && (
                      <span className="text-slate-300 select-none font-normal" aria-hidden="true">
                        /
                      </span>
                    )}
                    {isLast ? (
                      <span aria-current="page" className="text-slate-800 font-semibold truncate max-w-md">
                        {crumb.label}
                      </span>
                    ) : crumb.onClick ? (
                      <button
                        type="button"
                        onClick={crumb.onClick}
                        className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className="text-slate-500">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Wyróżniony pasek górny (np. kluczowe terminy SLA, metadane) */}
        {topBanner && <div className="mb-4">{topBanner}</div>}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Title & Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>
              {badges && <div className="flex items-center gap-2">{badges}</div>}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center flex-wrap gap-3 shrink-0">
              {actions}
            </div>
          )}
        </div>

        {/* Opcjonalne komponenty podrzędne (zakładki, filtry) */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}

function InfoTooltip({ text, position = "top", align = "center", className = "" }) {
  const alignClass =
    align === "right"
      ? "right-0 translate-x-0"
      : align === "left"
      ? "left-0 translate-x-0"
      : "left-1/2 -translate-x-1/2";

  const arrowAlign =
    align === "right"
      ? "right-2 translate-x-0"
      : align === "left"
      ? "left-2 translate-x-0"
      : "left-1/2 -translate-x-1/2";

  const posClass =
    position === "bottom"
      ? "top-full mt-2"
      : "bottom-full mb-2";

  const arrowPos =
    position === "bottom"
      ? "top-[-4px]"
      : "bottom-[-4px]";

  return (
    <span
      className={`relative inline-flex items-center group/tooltip ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <button
        type="button"
        aria-label="Więcej informacji"
        className="inline-flex items-center justify-center p-0.5 text-slate-500 hover:text-[#0038F8] focus-visible:text-[#0038F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038F8] focus-visible:ring-offset-1 transition-colors cursor-help rounded-full hover:bg-slate-100"
      >
        <Info size={12} className="shrink-0" />
      </button>
      <span
        role="tooltip"
        className={`absolute pointer-events-none opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-xs font-medium leading-relaxed px-2.5 py-1.5 rounded-lg shadow-xl w-52 sm:w-60 text-left ${posClass} ${alignClass}`}
      >
        {text}
        <span
          className={`absolute w-2 h-2 bg-slate-900 rotate-45 ${arrowPos} ${arrowAlign}`}
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

function DashboardView({
  setView,
  onOpenAnnouncements,
  announcements = [],
  tickets = [],
  setTickets,
  unreadTicketsCount = 0,
  onOpenTicket,
  onOpenNewTicket,
  showToast,
  clientProfile,
  onViewPersonProfile,
  onOpenProfile,
}: {
  setView: (v: string) => void;
  onOpenAnnouncements?: () => void;
  announcements?: any[];
  setAnnouncements?: any;
  tickets?: any[];
  setTickets?: any;
  unreadTicketsCount?: number;
  onOpenTicket?: (id: string) => void;
  onOpenNewTicket?: (context?: any) => void;
  showToast?: (title: string, text: string, type?: string) => void;
  clientProfile?: any;
  onViewPersonProfile?: (person: any) => void;
  onOpenProfile?: (
    tab?: "branding" | "team" | "wcag" | "account" | "notifications"
  ) => void;
}) {
  return (
    <div data-testid="dashboard-view" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden">
      <ViewHeader
        breadcrumbs={[
          { label: "Pulpit" },
        ]}
        title={`Witaj, ${clientProfile?.userName || "Kinga"}`}
        subtitle={`Oto aktualny stan dostępności cyfrowej dla organizacji ${clientProfile?.orgName || "Erste Group Bank"} (${clientProfile?.sector || "Bankowość i finanse"}). Obowiązujący standard: ${clientProfile?.wcagStandard || "WCAG 2.1 AA"}.`}
        badges={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-blue-50 text-[#0038F8] border border-blue-200/80 shadow-2xs">
              <Landmark size={13} />
              {clientProfile?.orgName || "Erste Group Bank AG"}
            </span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200/80">
              {clientProfile?.wcagStandard || "WCAG 2.1 AA"}
            </span>
          </div>
        }
        actions={
          <>
            <button
              onClick={() => setView("raportowanie")}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <BarChart2 size={16} className="text-[#0038F8]" />
              <span>Raportowanie</span>
            </button>
            <button
              onClick={() => setView("raporty")}
              className="flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <ClipboardCheck size={16} />
              <span>Przeglądaj audyty</span>
            </button>
          </>
        }
      />

      <div className="flex-1 md:overflow-y-auto bg-[#f8fafc] w-full">
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4.5 flex flex-col gap-3.5 sm:gap-4">

        {/* BANER TOŻSAMOŚCI ORGANIZACJI KLIENTA Z LOGO (NP. ERSTE) - BEZ RAMKI PRZY LOGO */}
        <div
          data-testid="client-org-banner"
          className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 sm:py-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {/* LOGO KLIENTA (NP. ERSTE) - CAŁKOWICIE BEZ RAMKI, BEZ ZAOKRĄGLEŃ NA OBRAZIE */}
            <div
              className="flex items-center justify-center shrink-0 cursor-pointer group py-0.5"
              onClick={() => {
                if (onOpenProfile) onOpenProfile("branding");
                else setView("profil");
              }}
              title="Kliknij, aby przejść do zarządzania kontem i logotypem organizacji"
            >
              {clientProfile?.orgLogo ? (
                <img
                  src={clientProfile.orgLogo}
                  alt={clientProfile.orgAltText || `Logo ${clientProfile.orgName}`}
                  className="h-8 sm:h-10 w-auto max-w-[140px] sm:max-w-[170px] object-contain block group-hover:opacity-90 transition-opacity"
                  style={{ borderRadius: 0 }}
                  onError={(e) => {
                    if (e.currentTarget.src !== "./logos/erste.png") {
                      e.currentTarget.src = "./logos/erste.png";
                    }
                  }}
                />
              ) : (
                <Building2 size={24} className="text-slate-400" />
              )}
            </div>

            <div className="min-w-0 border-l border-slate-200/80 pl-3.5">
              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0038F8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Przestrzeń Klienta
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {clientProfile?.sector || "Bankowość i finanse"}
                </span>
                <span className="text-xs font-semibold text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  NIP: {clientProfile?.taxId || "PL 525-000-00-00"}
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{clientProfile?.orgName || "Erste Group Bank AG"}</span>
                <span className="text-xs font-semibold text-slate-500 font-normal">
                  ({clientProfile?.orgShortName || "Erste"})
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700 font-medium mt-1">
                <span>
                  Koordynator organizacji:{" "}
                  <button
                    type="button"
                    onClick={() => {
                      if (onViewPersonProfile) {
                        onViewPersonProfile("Kinga Wróblewska");
                      } else {
                        setView("profil");
                      }
                    }}
                    className="text-slate-900 hover:text-[#0038F8] font-bold underline decoration-slate-300 hover:decoration-[#0038F8] cursor-pointer inline-flex items-center gap-1"
                    title="Zobacz profil Koordynatora"
                  >
                    <span>{clientProfile?.auditCoordinatorName || "Kinga Wróblewska"}</span>
                    <ExternalLink size={11} className="text-slate-400" />
                  </button>
                </span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <span>
                  Opiekun W-ally:{" "}
                  <button
                    type="button"
                    onClick={() => {
                      if (onViewPersonProfile) {
                        onViewPersonProfile("Tomasz Straszak");
                      } else {
                        setView("profil");
                      }
                    }}
                    className="text-slate-900 hover:text-[#0038F8] font-bold underline decoration-slate-300 hover:decoration-[#0038F8] cursor-pointer inline-flex items-center gap-1"
                    title="Zobacz profil Opiekuna W-ally i umów spotkanie 30 min"
                  >
                    <span>Tomasz Straszak</span>
                    <ExternalLink size={11} className="text-[#0038F8]" />
                  </button>
                </span>
              </div>
            </div>
          </div>

          {/* PRAWA STRONA BANERU: WSKAŹNIK CELU I PRZYCISK EDYCJI */}
          <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Docelowy próg dojrzałości
              </span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-xs sm:text-sm font-extrabold text-[#0038F8]">
                  Cel: {clientProfile?.targetScore || 90}%
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Aktualnie: 86.2%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onOpenProfile) onOpenProfile("branding");
                else setView("profil");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#0038F8] border border-slate-200 hover:border-[#0038F8]/40 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs group"
            >
              <Pencil size={12} className="text-slate-500 group-hover:text-[#0038F8]" />
              <span>Zarządzaj kontem</span>
            </button>
          </div>
        </div>

      {/* RZĄD 1: Główne KPI (skompresowane) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card
          className="p-3.5 sm:p-4 hover:border-[#0038F8]/30 transition-colors cursor-pointer"
          onClick={() => setView("raportowanie")}
        >
          <div className="flex justify-between items-start mb-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="success">
                +2.4% r/r
              </Badge>
              <InfoTooltip
                text="Porównanie rok do roku (r/r) – dynamika wzrostu ogólnego poziomu dostępności względem analogicznego okresu w ubiegłym roku."
                position="bottom"
                align="right"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Średnia Dostępność
            </span>
            <InfoTooltip
              text="Średni zagregowany wskaźnik spełnienia kryteriów sukcesu WCAG 2.1 AA we wszystkich audytowanych serwisach i procesach cyfrowych."
              position="top"
              align="left"
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              86.2%
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-600">
                Cel: {clientProfile?.targetScore || 90}%
              </span>
              <InfoTooltip
                text={`Strategiczny cel organizacji (${clientProfile?.orgName || "Erste Group"}) zdefiniowany w profilu organizacji, zgodny z wymaganiami ${clientProfile?.wcagStandard || "WCAG 2.1 AA"}.`}
                position="top"
                align="left"
              />
            </div>
          </div>
        </Card>

        <Card
          className="p-3.5 sm:p-4 hover:border-[#0038F8]/30 transition-colors cursor-pointer"
          onClick={() => setView("baza-uslug")}
        >
          <div className="flex justify-between items-start mb-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0038F8]/10 text-[#0038F8] flex items-center justify-center">
              <ListChecks size={20} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                142 procesy
              </span>
              <InfoTooltip
                text="Łączna liczba zinwentaryzowanych procesów w Bazie Usług podlegających cyklicznemu monitoringowi dostępności."
                position="bottom"
                align="right"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Pokrycie Audytowe
            </span>
            <InfoTooltip
              text="Odsetek zidentyfikowanych procesów i ścieżek cyfrowych posiadających aktualny i ważny audyt WCAG."
              position="top"
              align="left"
            />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">92.0%</span>
        </Card>

        {/* KARTA BŁĘDÓW: Priorytetowe, Ważne, Marginalne (zwarte) */}
        <Card
          className="p-3 sm:p-3.5 hover:border-red-300 transition-all cursor-pointer flex flex-col justify-between"
          onClick={() => setView("raportowanie")}
        >
          <div className="flex justify-between items-start mb-1.5">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Błędy Otwarte (Razem: 239)
              </span>
              <InfoTooltip
                text="Łączna liczba zarejestrowanych, nierozwiązanych dotąd barier dostępności wykrytych we wszystkich audytowanych systemach."
                position="top"
                align="left"
              />
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="danger" className="!px-2 !py-0.5 !text-xs font-bold">
                +12 m/m
              </Badge>
              <InfoTooltip
                text="Porównanie miesiąc do miesiąca (m/m) – przyrost liczby otwartych błędów w stosunku do poprzedniego miesiąca."
                position="bottom"
                align="right"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 py-0.5">
            {/* Priorytetowe */}
            <div className="flex flex-col bg-red-50/70 p-1.5 rounded-lg border border-red-100">
              <div className="flex items-center gap-1 text-red-700 mb-0.5">
                <AlertOctagon size={11} className="shrink-0" />
                <span className="text-xs font-bold text-red-700 tracking-tight whitespace-nowrap">
                  Priorytet.
                </span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">47</span>
              <span className="text-xs font-bold text-red-700 mt-0.5 whitespace-nowrap">Wymaga akcji</span>
            </div>

            {/* Ważne */}
            <div className="flex flex-col bg-amber-50/70 p-1.5 rounded-lg border border-amber-100">
              <div className="flex items-center gap-1 text-amber-800 mb-0.5">
                <AlertTriangle size={11} className="shrink-0" />
                <span className="text-xs font-bold text-amber-800 tracking-tight whitespace-nowrap">
                  Ważne
                </span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">128</span>
              <span className="text-xs font-bold text-amber-800 mt-0.5 whitespace-nowrap">Do planu</span>
            </div>

            {/* Marginalne */}
            <div className="flex flex-col bg-blue-50/70 p-1.5 rounded-lg border border-blue-100">
              <div className="flex items-center gap-1 text-blue-700 mb-0.5">
                <Info size={11} className="shrink-0" />
                <span className="text-xs font-bold text-blue-700 tracking-tight whitespace-nowrap">
                  Marginalne
                </span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">64</span>
              <span className="text-xs font-bold text-blue-700 mt-0.5 whitespace-nowrap">Niski wpływ</span>
            </div>
          </div>
        </Card>

        <Card
          className="p-3.5 sm:p-4 hover:border-blue-300 transition-colors cursor-pointer"
          onClick={() => setView("raporty")}
        >
          <div className="flex justify-between items-start mb-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <ClipboardCheck size={20} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                W tym kwartale
              </span>
              <InfoTooltip
                text="Liczba formalnych audytów WCAG ukończonych i odebranych w bieżącym kwartale rozliczeniowym."
                position="bottom"
                align="right"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Przeprowadzone Audyty
            </span>
            <InfoTooltip
              text="Suma sfinalizowanych audytów certyfikacyjnych oraz re-audytów zarejestrowanych w systemie."
              position="top"
              align="left"
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">12</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-600">
                4 w trakcie
              </span>
              <InfoTooltip
                text="Audyty oraz re-audyty aktualnie realizowane przez zespół certyfikowanych audytorów WCAG."
                position="top"
                align="left"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* RZĄD 2: Trendy i Kanały (zoptymalizowana wysokość do 275px) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Wykres Liniowy: Trend */}
        <Card className="p-3.5 sm:p-4 flex flex-col h-[260px] sm:h-[280px] lg:col-span-2">
          <div className="flex items-center justify-between mb-1.5 shrink-0">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Trend dostępności vs Błędy w czasie
                </h3>
                <InfoTooltip
                  text="Zestawienie średniego wskaźnika zgodności WCAG (niebieskie słupki) z liczbą nowych wykrytych błędów (czerwone słupki) na przestrzeni ostatnich 12 miesięcy."
                  position="top"
                  align="left"
                />
              </div>
              <span className="text-xs text-slate-600 font-medium">
                Ostatnie 12 miesięcy w całej organizacji
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={16} />
            </button>
          </div>

          <div className="flex flex-1 min-h-0 mt-1">
            <div className="w-8 shrink-0 flex flex-col justify-between items-end pb-6 pt-5 pr-2 text-xs font-bold text-slate-600 border-r border-slate-200 z-10 bg-white">
              <span className="leading-none">100</span>
              <span className="leading-none">50</span>
              <span className="leading-none translate-y-0.5">0</span>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-end gap-1 sm:gap-2 border-b border-slate-200 pt-5 px-1.5 sm:px-3">
                {chartTrendData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 flex justify-center items-end h-full relative group"
                  >
                    <div
                      className="w-full max-w-[28px] bg-[#0038F8]/20 group-hover:bg-[#0038F8]/30 transition-colors rounded-t-md relative z-10 flex items-start justify-center"
                      style={{ height: `${val.s}%` }}
                    >
                      <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#0038F8] border-2 border-white"></div>
                    </div>
                    <div
                      className="absolute bottom-0 w-1/2 max-w-[14px] bg-red-100 group-hover:bg-red-200 transition-colors rounded-t-sm"
                      style={{ height: `${val.e}%` }}
                    ></div>

                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded z-20 whitespace-nowrap pointer-events-none hidden sm:block shadow-lg">
                      Dostępność: {val.s}% | Błędy: {val.e}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-6 flex items-start gap-1 sm:gap-2 w-full shrink-0 pt-1 px-1.5 sm:px-3">
                {chartTrendData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-xs font-bold text-slate-600"
                  >
                    {val.m}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-5 mt-1 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0038F8]"></div> %
              Dostępności
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <div className="w-2.5 h-2.5 rounded bg-red-200"></div> Liczba nowych
              błędów
            </div>
          </div>
        </Card>

        {/* Wykres Paskowy Poziomy: Kanały (skompresowany) */}
        <Card className="p-3.5 sm:p-4.5 flex flex-col h-[260px] sm:h-[280px]">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Zgodność kanałów
              </h3>
              <InfoTooltip
                text="Średni poziom dostępności z podziałem na poszczególne kanały: serwis WWW, aplikacje mobilne (iOS, Android) oraz dokumenty cyfrowe (PDF/DOC)."
                position="top"
                align="left"
              />
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={16} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>WWW</span> <span>94%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: "94%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Aplikacja (iOS)</span> <span>82%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#0038F8] h-full rounded-full"
                  style={{ width: "82%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Aplikacja (Android)</span> <span>78%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#0038F8] h-full rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Dokumenty (PDF/DOC)</span> <span>45%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* RZĄD 2.5: WSPÓŁPRACA Z AUDYTORAMI & KOMUNIKATY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6" data-testid="dashboard-collaboration-row">
        {/* LEWY WIDGET (7 KOLUMN): KONSULTACJE & TICKETY Z AUDYTORAMI WCAG */}
        <Card className="p-5 sm:p-6 lg:col-span-7 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            {/* Nagłówek modułu ticketów */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <MessageSquareText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      Konsultacje
                    </h3>
                    {unreadTicketsCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white animate-pulse">
                        {unreadTicketsCount} nowa odp.
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Bezpośredni kontakt merytoryczny z zespołem audytorów WCAG bez konieczności spotkań online.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenNewTicket && onOpenNewTicket()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Nowa konsultacja</span>
                </button>
                <button
                  type="button"
                  onClick={() => setView("tickety")}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                >
                  <span>Wszystkie ({tickets.length})</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* BANER WYRÓŻNIONEJ ODPOWIEDZI (JEŚLI SĄ NIEPRZECZYTANE) */}
            {unreadTicketsCount > 0 && (
              <div
                onClick={() => onOpenTicket && onOpenTicket("TCK-104")}
                className="mb-3.5 p-3 sm:p-3.5 bg-gradient-to-r from-emerald-50 via-emerald-50/80 to-white border border-emerald-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:shadow-xs transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="relative shrink-0 mt-0.5 cursor-pointer hover:opacity-90"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onViewPersonProfile) {
                          onViewPersonProfile("Tomasz Straszak");
                        }
                      }}
                      title="Kliknij, aby otworzyć profil Tomasza Straszaka"
                    >
                      <img
                        src="https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg"
                        alt="Tomasz Straszak"
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-300"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded">
                          Nowa odpowiedź • #TCK-104
                        </span>
                        <span className="text-xs font-semibold text-slate-500">15 min temu</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        Czy kontrast 3.8:1 dla aktywnego stanu checkboxa spełnia WCAG 2.2?
                      </h4>
                      <p className="text-xs text-slate-700 line-clamp-1 mt-1 italic">
                        Tomasz Straszak (Opiekun): "Skonsultowałem to z audytorem: współczynnik 3.8:1 jest w pełni zgodny z WCAG 2.1 oraz 2.2 AA..."
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:underline self-center">
                    <span>Otwórz</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            )}

            {/* LISTA OSTATNICH TICKETÓW */}
            <div className="space-y-2 mb-4">
              {tickets.slice(0, 3).map((ticket) => {
                const isReply = ticket.status === "auditor_reply";
                const isWaiting = ticket.status === "waiting_auditor";

                return (
                  <div
                    key={ticket.id}
                    onClick={() => onOpenTicket && onOpenTicket(ticket.id)}
                    className="py-2.5 px-3 sm:px-3.5 bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/80 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 flex flex-col items-center">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isReply
                              ? "bg-emerald-500 ring-2 ring-emerald-200"
                              : isWaiting
                              ? "bg-amber-500"
                              : "bg-slate-300"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">
                            #{ticket.id}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded border ${ticket.categoryColor}`}
                          >
                            {ticket.categoryLabel}
                          </span>
                          {ticket.contextId && (
                            <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 truncate">
                              {ticket.contextId}
                            </span>
                          )}
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              isReply
                                ? "bg-emerald-50 text-emerald-700"
                                : isWaiting
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {ticket.statusLabel}
                          </span>
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0038F8] transition-colors truncate">
                          {ticket.title}
                        </h5>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div
                        className="hidden sm:flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewPersonProfile) {
                            onViewPersonProfile(ticket.assignedAuditor?.name || "Tomasz Straszak");
                          }
                        }}
                        title={`Zobacz profil: ${ticket.assignedAuditor?.name || "Audytor"}`}
                      >
                        <img
                          src={ticket.assignedAuditor?.avatar}
                          alt={ticket.assignedAuditor?.name}
                          className="w-5 h-5 rounded-full object-cover border border-white shrink-0"
                        />
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                          {ticket.assignedAuditor?.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {ticket.updatedAt}
                      </span>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SPÓJNA STOPKA: DEDYKOWANY OPIEKUN KLIENTA */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="p-3.5 sm:p-4 bg-slate-50/90 hover:bg-blue-50/30 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-colors">
              <div
                className="flex items-center gap-3.5 cursor-pointer group/opiekun"
                onClick={() => {
                  if (onViewPersonProfile) {
                    onViewPersonProfile("Tomasz Straszak");
                  }
                }}
                title="Kliknij, aby otworzyć profil Tomasza Straszaka"
              >
                <div className="relative shrink-0">
                  <img
                    src="https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg"
                    alt="Tomasz Straszak"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-white shadow-xs group-hover/opiekun:ring-2 group-hover/opiekun:ring-[#0038F8]"
                  />
                  <span
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white"
                    title="Dostępny"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-extrabold text-slate-900 group-hover/opiekun:text-[#0038F8] transition-colors truncate flex items-center gap-1.5">
                      <span>Tomasz Straszak</span>
                      <ExternalLink size={13} className="text-slate-400 group-hover/opiekun:text-[#0038F8]" />
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                      Opiekun Klienta
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                      Dostępny dzisiaj
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-slate-600 font-medium">
                    <a
                      href="tel:+48795103017"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#0038F8] font-semibold transition-colors"
                    >
                      <Phone size={13} className="text-[#0038F8]" />
                      <span>795 103 017</span>
                    </a>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <a
                      href="mailto:tomek@widzialni.eu"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#0038F8] font-semibold transition-colors"
                    >
                      <Mail size={13} className="text-[#0038F8]" />
                      <span>tomek@widzialni.eu</span>
                    </a>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="text-slate-500 text-xs hidden sm:inline">Ustalenia, wyceny, dystrybucja zadań</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start md:self-auto pt-1 md:pt-0">
                <button
                  type="button"
                  onClick={() => onOpenNewTicket && onOpenNewTicket()}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquareText size={13} className="text-[#0038F8]" />
                  <span>Nowa konsultacja</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onViewPersonProfile) {
                      onViewPersonProfile("Tomasz Straszak");
                    } else {
                      setView("profil");
                    }
                  }}
                  className="px-3.5 py-2 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Przejdź do profilu i umów spotkanie 30 min z Tomaszem Straszakiem"
                >
                  <Calendar size={14} />
                  <span>Umów spotkanie 30 min</span>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* PRAWY WIDGET (5 KOLUMN): KOMUNIKATY & NOWOŚCI */}
        <Card className="p-5 sm:p-6 lg:col-span-5 bg-gradient-to-br from-white via-white to-blue-50/20 border border-slate-200 shadow-xs flex flex-col justify-between" data-testid="announcements-teaser">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0038F8]/10 text-[#0038F8] flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      Komunikaty & Nowości
                    </h3>
                    {announcements.filter((a) => a.unread).length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#0038F8] text-white">
                        {announcements.filter((a) => a.unread).length} nowe
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Aktualizacje prawne, webinary i oferty.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenAnnouncements}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-[#0038F8] border border-[#0038F8]/30 hover:border-[#0038F8] rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
              >
                <span>Wszystkie ({announcements.length})</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* 2 KAFELKI OSTATNICH KOMUNIKATÓW */}
            <div className="space-y-3 mb-3">
              {announcements.slice(0, 2).map((item) => {
                const ItemIcon = item.icon || Sparkles;
                return (
                  <div
                    key={item.id}
                    onClick={onOpenAnnouncements}
                    className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 hover:shadow-xs hover:border-[#0038F8]/40 transition-all cursor-pointer flex flex-col justify-between group relative"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold border ${item.categoryColor}`}
                        >
                          <ItemIcon size={12} />
                          <span>{item.categoryLabel}</span>
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {item.date}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0038F8] transition-colors leading-snug line-clamp-1">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-700 mt-1 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0038F8] group-hover:underline inline-flex items-center gap-1.5">
                        <span>{item.ctaText}</span>
                        <ArrowRight size={12} strokeWidth={2.5} />
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                        Szczegóły
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Baza wiedzy & wytyczne</span>
            <button
              type="button"
              onClick={onOpenAnnouncements}
              className="text-xs font-bold text-[#0038F8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Przeglądaj wszystkie</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </Card>
      </div>

      {/* RZĄD 3: Listy akcji i ostatnie audyty (skompresowane) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-4.5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Ostatnie audyty
              </h3>
              <span className="text-xs text-slate-600 font-medium">
                Szybki podgląd prowadzonych prac
              </span>
            </div>
            <button className="text-[#0038F8] bg-[#0038F8]/5 hover:bg-[#0038F8]/10 p-1.5 rounded-lg transition-colors">
              <Plus size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {[
              {
                id: 1,
                date: "12.03.2026",
                status: "Zakończony",
                title: "Portal informacyjny - wybrane podstrony",
                score: "77.5%",
                statusVariant: "success",
                critical: 3,
                important: 7,
                marginal: 4,
              },
              {
                id: 2,
                date: "15.04.2026",
                status: "W trakcie",
                title: "Serwis transakcyjny - Nowy Dashboard",
                score: "62.1%",
                statusVariant: "warning",
                critical: 5,
                important: 14,
                marginal: 8,
              },
              {
                id: 3,
                date: "05.06.2026",
                status: "Nowy",
                title: "Proces reklamacyjny - formularze",
                score: "-",
                statusVariant: "info",
                critical: 8,
                important: 19,
                marginal: 11,
              },
            ].map((audit) => (
              <div
                key={audit.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-2 px-2.5 sm:px-3 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer group"
                onClick={() => setView("raport-szczegoly")}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1.5 sm:mb-0 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant={audit.statusVariant} className="!px-2.5 !py-0.5 !text-xs font-bold">
                      {audit.status}
                    </Badge>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0038F8] transition-colors truncate">
                    {audit.title}
                  </span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
                  {/* Rozbicie na 3 wagi błędów z tooltipami */}
                  <div className="flex items-center gap-1">
                    {/* Priorytetowe */}
                    <div className="relative group/tip flex items-center">
                      <span
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-200 cursor-help"
                        title={`Błędy priorytetowe: ${audit.critical}`}
                      >
                        <AlertOctagon size={11} className="text-red-600" />
                        {audit.critical}
                      </span>
                      <div
                        role="tooltip"
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-xl whitespace-nowrap"
                      >
                        Błędy priorytetowe: {audit.critical}
                      </div>
                    </div>

                    {/* Ważne */}
                    <div className="relative group/tip flex items-center">
                      <span
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 cursor-help"
                        title={`Błędy ważne: ${audit.important}`}
                      >
                        <AlertTriangle size={11} className="text-amber-800" />
                        {audit.important}
                      </span>
                      <div
                        role="tooltip"
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-xl whitespace-nowrap"
                      >
                        Błędy ważne: {audit.important}
                      </div>
                    </div>

                    {/* Marginalne */}
                    <div className="relative group/tip flex items-center">
                      <span
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 cursor-help"
                        title={`Błędy marginalne: ${audit.marginal}`}
                      >
                        <Info size={11} className="text-blue-700" />
                        {audit.marginal}
                      </span>
                      <div
                        role="tooltip"
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-xl whitespace-nowrap"
                      >
                        Błędy marginalne: {audit.marginal}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Calendar size={12} /> {audit.date}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-extrabold ${
                      audit.score === "-"
                        ? "text-slate-600 font-bold"
                        : parseFloat(audit.score) >= 80
                        ? "text-emerald-700 font-bold"
                        : "text-amber-800 font-bold"
                    }`}
                  >
                    {audit.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setView("raporty")}
            className="w-full mt-2.5 text-xs font-bold text-[#0038F8] hover:bg-[#0038F8]/5 py-2 rounded-lg transition-colors border border-[#0038F8]/10 cursor-pointer"
          >
            Przejdź do modułu Audytów
          </button>
        </Card>

        <Card className="p-3.5 sm:p-4.5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Wymagające uwagi (Top 5)
              </h3>
              <span className="text-xs text-slate-600 font-medium">
                Usługi o najniższym procencie dostępności
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            {[
              { name: "Kredyt hipoteczny (Kalkulator)", score: 42.5, err: 54 },
              { name: "Otwarcie rachunku firmowego", score: 58.2, err: 32 },
              { name: "Panel wymiany walut (Kantor)", score: 64.0, err: 28 },
              { name: "Proces reklamacyjny", score: 68.5, err: 21 },
              { name: "Usługi płatnicze - BLIK", score: 72.1, err: 15 },
            ].map((u, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer"
                onClick={() => setView("baza-uslug")}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded bg-red-50 text-red-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                      {u.name}
                    </div>
                    <div className="text-xs text-slate-600 font-semibold">
                      {u.err} aktywnych błędów
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    u.score < 50
                      ? "danger"
                      : u.score < 70
                      ? "warning"
                      : "success"
                  }
                  className="w-14 justify-center !py-0.5 !text-xs font-bold shrink-0 ml-2"
                >
                  {u.score}%
                </Badge>
              </div>
            ))}
          </div>
          <button
            onClick={() => setView("raportowanie")}
            className="w-full mt-2.5 text-xs font-bold text-[#0038F8] hover:bg-[#0038F8]/5 py-2 rounded-lg transition-colors border border-[#0038F8]/10 cursor-pointer"
          >
            Zobacz pełny ranking w raportach
          </button>
        </Card>
      </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// GLOBALNE KOMPONENTY UI
// ==========================================

function Card({ children, className = "", ...props }) {
  return (
    <div
      data-testid="card"
      className={`bg-white rounded-xl shadow-xs border border-slate-200/90 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function Badge({ children, variant = "neutral", className = "", title = "" }) {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    warning: "bg-amber-50 text-amber-700 border-amber-200/80",
    danger: "bg-red-50 text-red-700 border-red-200/80",
    info: "bg-blue-50 text-blue-700 border-blue-200/80",
    neutral: "bg-slate-50 text-slate-600 border-slate-200/80",
    lightBlue: "bg-indigo-50/60 text-indigo-700 border-indigo-200/70",
    brand: "bg-blue-50 text-[#0038F8] border-blue-200/80",
  };
  return (
    <span
      data-testid="badge"
      title={title}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${variants[variant] || variants.neutral} ${className}`}
    >
      {children}
    </span>
  );
}

// Unified PriorityBadge component with icons for consistent error display
function PriorityBadge({ priority, size = "default", className = "" }) {
  // Spójne wymiary etykiet w całym systemie: delikatne, czytelne rounded-lg, 13px ikona
  const sizeClasses = size === "small"
    ? "text-xs px-2.5 py-1"
    : "text-xs px-2.5 py-1";
  
  // Normalizujemy nazewnictwo: "Krytyczny" staje się "Priorytetowy"
  const normalizedPriority = priority === "Krytyczny" ? "Priorytetowy" : priority;

  const config = {
    "Priorytetowy": {
      icon: AlertOctagon,
      iconSize: 13,
      className: "bg-red-50 text-red-700 border-red-200/80",
    },
    "Krytyczny": {
      icon: AlertOctagon,
      iconSize: 13,
      className: "bg-red-50 text-red-700 border-red-200/80",
    },
    "Ważny": {
      icon: AlertTriangle,
      iconSize: 13,
      className: "bg-amber-50 text-amber-700 border-amber-200/80",
    },
    "Marginalny": {
      icon: Info,
      iconSize: 13,
      className: "bg-blue-50 text-blue-700 border-blue-200/80",
    },
  };

  const { icon: Icon, iconSize, className: colorClass } = config[normalizedPriority] || {
    icon: AlertCircle,
    iconSize: 13,
    className: "bg-slate-50 text-slate-600 border-slate-200/80",
  };

  return (
    <span
      data-testid="priority-badge"
      className={`inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold border ${colorClass} ${sizeClasses} ${className}`}
    >
      <Icon size={iconSize} className="flex-shrink-0" />
      <span>{normalizedPriority}</span>
    </span>
  );
}

function Input({ icon: Icon, className = "", ...props }) {
  return (
    <div data-testid="input-container" className={`relative flex items-center ${className}`}>
      {Icon && <Icon className="absolute left-4 text-slate-500" size={18} aria-hidden="true" />}
      <input
        data-testid="input"
        className={`w-full bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#0038F8] focus:ring-2 focus:ring-[#0038F8]/30 transition-shadow ${
          Icon ? "pl-11 pr-4 py-3.5" : "px-4 py-3.5"
        }`}
        {...props}
      />
    </div>
  );
}

function ShowMoreToggle({ isExpanded, onToggle, total, visibleCount, label }) {
  if (total <= visibleCount) return null;
  return (
    <button
      data-testid="show-more-toggle"
      onClick={onToggle}
      className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 text-[13px] font-bold text-[#0038F8] hover:text-[#002ECC] bg-[#0038F8]/5 hover:bg-[#0038F8]/10 rounded-xl transition-colors border border-[#0038F8]/10 shadow-sm"
    >
      {isExpanded
        ? "Zwiń listę"
        : `Rozwiń pozostałe (${total - visibleCount}) ${label}`}
      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );
}

function PriorityStats({ c = 0, w = 0, m = 0 }) {
  return (
    <div data-testid="priority-stats" className="flex items-center gap-1 sm:gap-0">
      {/* Błędy priorytetowe */}
      <div
        data-testid="priority-critical"
        className="relative group/tip flex items-center gap-1 w-10 sm:w-12 shrink-0 justify-center cursor-help py-0.5"
        title={`Błędy priorytetowe: ${c}`}
      >
        <AlertOctagon
          size={16}
          className={c > 0 ? "text-red-700" : "text-slate-500"}
        />
        <span
          className={`font-bold text-sm ${
            c > 0 ? "text-red-700" : "text-slate-600"
          }`}
        >
          {c}
        </span>
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
        >
          Błędy priorytetowe: {c}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      </div>

      {/* Błędy ważne */}
      <div
        className="relative group/tip flex items-center gap-1 w-10 sm:w-12 shrink-0 justify-center cursor-help py-0.5"
        title={`Błędy ważne: ${w}`}
      >
        <AlertTriangle
          size={16}
          className={w > 0 ? "text-amber-800" : "text-slate-500"}
        />
        <span
          className={`font-bold text-sm ${
            w > 0 ? "text-amber-800" : "text-slate-600"
          }`}
        >
          {w}
        </span>
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
        >
          Błędy ważne: {w}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      </div>

      {/* Błędy marginalne */}
      <div
        className="relative group/tip flex items-center gap-1 w-10 sm:w-12 shrink-0 justify-center cursor-help py-0.5"
        title={`Błędy marginalne: ${m}`}
      >
        <Info
          size={16}
          className={m > 0 ? "text-blue-700" : "text-slate-500"}
        />
        <span
          className={`font-bold text-sm ${
            m > 0 ? "text-blue-700" : "text-slate-600"
          }`}
        >
          {m}
        </span>
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
        >
          Błędy marginalne: {m}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// BAZA USŁUG I PROCESÓW (KONCEPCJA B: HUB KATALOGOWY & DRILL-DOWN)
// ==========================================

const SERVICE_DOMAINS = [
  {
    id: "rachunki",
    label: "Rachunki i Płatności",
    code: "DOM-01",
    count: 10,
    processesCount: 28,
    score: 93.4,
    description: "Konta osobiste ROR, przelewy Elixir/SEPA, wymiana walut, zlecenia stałe i wyciągi bankowe.",
    theme: {
      badge: "bg-blue-100 text-[#0038F8]",
      iconBg: "bg-blue-600 text-white shadow-xs shadow-blue-500/20",
      accent: "text-[#0038F8]",
      lightBadge: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    icon: Landmark,
  },
  {
    id: "kredyty",
    label: "Kredyty i Pożyczki",
    code: "DOM-02",
    count: 10,
    processesCount: 6,
    score: 91.0,
    description: "Pożyczki gotówkowe, kredyty hipoteczne, konsolidacja, limity odnawialne, BNPL i wakacje kredytowe.",
    theme: {
      badge: "bg-amber-100 text-amber-800",
      iconBg: "bg-amber-600 text-white shadow-xs shadow-amber-500/20",
      accent: "text-amber-800",
      lightBadge: "bg-amber-50 text-amber-800 border border-amber-200",
    },
    icon: Scale,
  },
  {
    id: "karty",
    label: "Karty płatnicze",
    code: "DOM-03",
    count: 8,
    processesCount: 12,
    score: 95.8,
    description: "Karty debetowe, kredytowe, BLIK, płatności zbliżeniowe Apple/Google Pay, karty wirtualne i 3D Secure.",
    theme: {
      badge: "bg-purple-100 text-purple-700",
      iconBg: "bg-purple-600 text-white shadow-xs shadow-purple-500/20",
      accent: "text-purple-700",
      lightBadge: "bg-purple-50 text-purple-700 border border-purple-200",
    },
    icon: CreditCard,
  },
  {
    id: "oszczednosci",
    label: "Oszczędności i Inwestycje",
    code: "DOM-04",
    count: 8,
    processesCount: 4,
    score: 94.5,
    description: "Konta oszczędnościowe, lokaty, fundusze TFI, usługi maklerskie PAD, IKE/IKZE i obligacje.",
    theme: {
      badge: "bg-emerald-100 text-emerald-800",
      iconBg: "bg-emerald-600 text-white shadow-xs shadow-emerald-500/20",
      accent: "text-emerald-800",
      lightBadge: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    },
    icon: TrendingUp,
  },
  {
    id: "firmowe",
    label: "Bankowość Przedsiębiorstw",
    code: "DOM-05",
    count: 8,
    processesCount: 0,
    score: 92.1,
    description: "Rachunki firmowe, Split Payment VAT, kredyty obrotowe, leasing, faktoring i terminale POS.",
    theme: {
      badge: "bg-indigo-100 text-indigo-700",
      iconBg: "bg-indigo-600 text-white shadow-xs shadow-indigo-500/20",
      accent: "text-indigo-700",
      lightBadge: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    },
    icon: Users,
  },
  {
    id: "dodatkowe",
    label: "Ubezpieczenia i Bezpieczeństwo",
    code: "DOM-06",
    count: 6,
    processesCount: 0,
    score: 96.0,
    description: "Polisy ochronne, ubezpieczenia nieruchomości, tożsamość cyfrowa mojeID i procedury reklamacyjne.",
    theme: {
      badge: "bg-rose-100 text-rose-700",
      iconBg: "bg-rose-600 text-white shadow-xs shadow-rose-500/20",
      accent: "text-rose-700",
      lightBadge: "bg-rose-50 text-rose-700 border border-rose-200",
    },
    icon: ShieldCheck,
  },
];

const SERVICE_CATEGORIES = [
  // 1. Rachunki i Płatności (10 kategorii)
  { id: "platnicze", label: "Usługi płatnicze i powiązane z rachunkiem płatniczym", count: 2, domain: "rachunki" },
  { id: "ror_standard", label: "Rachunki oszczędnościowo-rozliczeniowe (ROR)", count: 1, domain: "rachunki" },
  { id: "przelewy_krajowe", label: "Przelewy krajowe Elixir i Express Elixir", count: 2, domain: "rachunki" },
  { id: "przelewy_zagraniczne", label: "Przelewy zagraniczne SWIFT i europejskie SEPA", count: 2, domain: "rachunki" },
  { id: "rachunki_walutowe", label: "Rachunki walutowe (EUR, USD, GBP, CHF)", count: 0, domain: "rachunki" },
  { id: "kantor_internetowy", label: "Wymiana walut i kantor internetowy", count: 0, domain: "rachunki" },
  { id: "zlecenia_stale", label: "Zlecenia stałe i polecenia zapłaty", count: 1, domain: "rachunki" },
  { id: "doladowania", label: "Doładowania telefonów i mikropłatności cykliczne", count: 0, domain: "rachunki" },
  { id: "splata_zadluzenia", label: "Automatyczna spłata zobowiązań i subkont", count: 0, domain: "rachunki" },
  { id: "wyciagi_potwierdzenia", label: "Wyciągi bankowe, zestawienia i historia operacji", count: 0, domain: "rachunki" },

  // 2. Kredyty i Finansowanie (10 kategorii)
  { id: "konsumencki", label: "Kredyt konsumencki i pożyczki gotówkowe", count: 0, domain: "kredyty" },
  { id: "hipoteczny", label: "Kredyt hipoteczny i budowlano-hipoteczny", count: 0, domain: "kredyty" },
  { id: "konsolidacyjny", label: "Kredyty konsolidacyjne i przeniesienie zobowiązań", count: 0, domain: "kredyty" },
  { id: "limit_odnawialny", label: "Limit odnawialny w koncie osobistym (debet)", count: 0, domain: "kredyty" },
  { id: "kredyt_ekologiczny", label: "Kredyty ekologiczne i termomodernizacyjne", count: 0, domain: "kredyty" },
  { id: "pozyczka_ratalna", label: "Zakupy na raty i płatności odroczone (BNPL)", count: 0, domain: "kredyty" },
  { id: "wakacje_kredytowe", label: "Obsługa ustawowych wakacji kredytowych", count: 0, domain: "kredyty" },
  { id: "kredyt_studencki", label: "Kredyty studenckie z dopłatami państwowymi", count: 0, domain: "kredyty" },
  { id: "refinansowanie", label: "Refinansowanie kredytów zewnętrznych", count: 0, domain: "kredyty" },
  { id: "wczesniejsza_splata", label: "Wcześniejsza spłata i nadpłata kredytu", count: 0, domain: "kredyty" },

  // 3. Karty i Płatności mobilne (8 kategorii)
  { id: "karty_debetowe", label: "Karty debetowe wielowalutowe", count: 0, domain: "karty" },
  { id: "karty_kredytowe", label: "Karty kredytowe z programem ratalnym", count: 0, domain: "karty" },
  { id: "blik", label: "Płatności BLIK i przelewy na numer telefonu", count: 1, domain: "karty" },
  { id: "portfele_cyfrowe", label: "Płatności zbliżeniowe (Apple Pay, Google Pay, Garmin)", count: 0, domain: "karty" },
  { id: "karty_wirtualne", label: "Karty wirtualne i jednorazowe do zakupów online", count: 0, domain: "karty" },
  { id: "programy_rabatowe", label: "Programy lojalnościowe, korzyści i cashback", count: 0, domain: "karty" },
  { id: "limity_kart", label: "Zarządzanie limitami i autoryzacja 3D Secure", count: 1, domain: "karty" },
  { id: "blokada_kart", label: "Zastrzeganie i czasowa blokada kart płatniczych", count: 1, domain: "karty" },

  // 4. Oszczędności i Inwestycje (8 kategorii)
  { id: "rachunki_oszczednosciowe", label: "Rachunki oszczędnościowe z podwyższonym oprocentowaniem", count: 0, domain: "oszczednosci" },
  { id: "lokaty_terminowe", label: "Lokaty terminowe krótko- i długoterminowe", count: 0, domain: "oszczednosci" },
  { id: "fundusze_inwestycyjne", label: "Fundusze inwestycyjne otwarte i portfele TFI", count: 0, domain: "oszczednosci" },
  { id: "maklerskie", label: "Wskazane w ustawie usługi maklerskie (PAD)", count: 0, domain: "oszczednosci" },
  { id: "plany_emerytalne", label: "Indywidualne Konta Emerytalne (IKE i IKZE)", count: 0, domain: "oszczednosci" },
  { id: "obligacje_skarbowe", label: "Obligacje skarbowe i detaliczne instrumenty dłużne", count: 0, domain: "oszczednosci" },
  { id: "portfele_modelowe", label: "Doradztwo inwestycyjne i robo-advisory", count: 0, domain: "oszczednosci" },
  { id: "struktury_inwestycyjne", label: "Certyfikaty depozytowe i produkty strukturyzowane", count: 0, domain: "oszczednosci" },

  // 5. Bankowość Przedsiębiorstw i MSP (8 kategorii)
  { id: "rachunki_firmowe", label: "Rachunki bieżące i pomocnicze dla przedsiębiorców", count: 0, domain: "firmowe" },
  { id: "split_payment", label: "Mechanizm podzielonej płatności (Split Payment VAT)", count: 0, domain: "firmowe" },
  { id: "finansowanie_firm", label: "Linie kredytowe i kredyty obrotowe dla firm", count: 0, domain: "firmowe" },
  { id: "leasing", label: "Leasing operacyjny i finansowy pojazdów i maszyn", count: 0, domain: "firmowe" },
  { id: "faktoring", label: "Faktoring jawny i cichy z finansowaniem faktur", count: 0, domain: "firmowe" },
  { id: "terminale_pos", label: "Terminale płatnicze POS i aplikacje SoftPOS", count: 0, domain: "firmowe" },
  { id: "bramka_platnosci", label: "Bramki płatności internetowych dla sklepów e-commerce", count: 0, domain: "firmowe" },
  { id: "gwarancje_bankowe", label: "Gwarancje bankowe, przetargowe i akredytywy", count: 0, domain: "firmowe" },

  // 6. Ubezpieczenia i Bezpieczeństwo (6 kategorii)
  { id: "ubezpieczenia_zycie", label: "Ubezpieczenia na życie i polisy ochronne NNW", count: 0, domain: "dodatkowe" },
  { id: "ubezpieczenia_nieruchomosci", label: "Ubezpieczenia mieszkań, domów i kredytobiorców", count: 0, domain: "dodatkowe" },
  { id: "ubezpieczenia_turystyczne", label: "Ubezpieczenia podróżne i koszty leczenia za granicą", count: 0, domain: "dodatkowe" },
  { id: "tozsamosc_cyfrowa", label: "Zarządzanie tożsamością cyfrową, mojeID i Profil Zaufany", count: 1, domain: "dodatkowe" },
  { id: "pelnomocnictwa", label: "Pełnomocnictwa, dyspozycje na wypadek śmierci i spadki", count: 0, domain: "dodatkowe" },
  { id: "reklamacje_spory", label: "Procedury reklamacyjne, chargeback i spory transakcyjne", count: 0, domain: "dodatkowe" },
];

const INITIAL_PROCESSES_LIST = [
  {
    id: "p1",
    title: "Otwarcie ROR (istniejący dorosły klient)",
    category: "platnicze",
    categoryLabel: "Usługi płatnicze",
    channel: "WWW",
    channelLabel: "Portal WWW",
    viewsCount: 12,
    totalViews: 12,
    score: 85.2,
    scoreVariant: "warning",
    issuesCount: 5,
    criticalErrors: 1,
    auditDate: "15.03.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Zespół Kont i Płatności",
    description: "Proces wnioskowania o rachunek oszczędnościowo-rozliczeniowy przez dotychczasowego klienta banku w bankowości elektronicznej.",
  },
  {
    id: "p2",
    title: "Zamknięcie konta z saldem dodatnim",
    category: "platnicze",
    categoryLabel: "Usługi płatnicze",
    channel: "WWW",
    channelLabel: "Portal WWW",
    viewsCount: 5,
    totalViews: 5,
    score: 100,
    scoreVariant: "success",
    issuesCount: 5,
    criticalErrors: 0,
    auditDate: "10.03.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Zespół Kont i Płatności",
    description: "Ścieżka dyspozycji zamknięcia rachunku wraz z przelewem pozostałych środków na wskazane konto zewnętrzne.",
  },
  {
    id: "p3",
    title: "Otwarcie ROR (nowy klient - selfie i e-Dowód)",
    category: "ror_standard",
    categoryLabel: "Konta osobiste ROR",
    domain: "rachunki",
    channel: "Mobile",
    channelLabel: "Aplikacja Mobilna",
    viewsCount: 9,
    totalViews: 11,
    score: 97.05,
    scoreVariant: "success",
    issuesCount: 5,
    criticalErrors: 0,
    auditDate: "02.04.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Onboarding Mobilny",
    description: "Zdalna identyfikacja biometryczna i weryfikacja tożsamości nowego klienta w aplikacji iOS i Android.",
  },
  {
    id: "p4",
    title: "Przelew krajowy Elixir - desktop",
    category: "przelewy_krajowe",
    categoryLabel: "Przelewy krajowe",
    domain: "rachunki",
    channel: "WWW",
    channelLabel: "Portal WWW",
    viewsCount: 6,
    totalViews: 6,
    score: 94.5,
    scoreVariant: "success",
    issuesCount: 5,
    criticalErrors: 0,
    auditDate: "20.02.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Obsługa Transakcji",
    description: "Formularz standardowego przelewu krajowego z walidacją numeru rachunku IBAN i autoryzacją.",
  },
  {
    id: "p5",
    title: "Przelew krajowy - aplikacja mobilna",
    category: "przelewy_krajowe",
    categoryLabel: "Przelewy krajowe",
    domain: "rachunki",
    channel: "Mobile",
    channelLabel: "Aplikacja Mobilna",
    viewsCount: 5,
    totalViews: 5,
    score: 92.0,
    scoreVariant: "success",
    issuesCount: 5,
    criticalErrors: 0,
    auditDate: "18.02.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Bankowość Mobilna",
    description: "Zlecenie przelewu w aplikacji mobilnej z potwierdzeniem biometrycznym lub kodem PIN.",
  },
  {
    id: "p6",
    title: "Przelew zagraniczny SWIFT / walutowy",
    category: "przelewy_zagraniczne",
    categoryLabel: "Przelewy zagraniczne",
    domain: "rachunki",
    channel: "WWW",
    channelLabel: "Portal WWW",
    viewsCount: 8,
    totalViews: 10,
    score: 88.3,
    scoreVariant: "warning",
    issuesCount: 5,
    criticalErrors: 1,
    auditDate: "25.01.2024",
    auditStatus: "W trakcie re-audytu",
    assignedTeam: "Rynki Finansowe",
    description: "Obsługa przelewów międzynarodowych w walutach obcych z kalkulatorem kursów walut.",
  },
  {
    id: "p7",
    title: "Przelew europejski SEPA",
    category: "przelewy_zagraniczne",
    categoryLabel: "Przelewy zagraniczne",
    domain: "rachunki",
    channel: "WWW",
    channelLabel: "Portal WWW",
    viewsCount: 7,
    totalViews: 7,
    score: 91.7,
    scoreVariant: "success",
    issuesCount: 5,
    criticalErrors: 0,
    auditDate: "12.02.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Płatności Europejskie",
    description: "Przelewy w walucie EUR do krajów Europejskiego Obszaru Gospodarczego.",
  },
  {
    id: "p8",
    title: "Zlecenie stałe - założenie i modyfikacja",
    category: "zlecenia_stale",
    categoryLabel: "Zlecenia stałe",
    domain: "rachunki",
    channel: "WWW",
    channelLabel: "Portal WWW",
    viewsCount: 6,
    totalViews: 6,
    score: 95.0,
    scoreVariant: "success",
    issuesCount: 3,
    criticalErrors: 0,
    auditDate: "05.03.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Obsługa Transakcji",
    description: "Zarządzanie cyklicznymi płatnościami z wyborem częstotliwości i daty rozpoczęcia.",
  },
  {
    id: "p9",
    title: "Płatności BLIK - przelew na telefon i kod",
    category: "blik",
    categoryLabel: "Płatności BLIK",
    domain: "karty",
    channel: "Mobile",
    channelLabel: "Aplikacja Mobilna",
    viewsCount: 7,
    totalViews: 7,
    score: 96.5,
    scoreVariant: "success",
    issuesCount: 1,
    criticalErrors: 0,
    auditDate: "28.02.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Innowacje Płatnicze",
    description: "Płatności natychmiastowe z wykorzystaniem kodu BLIK oraz przelewy na numer telefonu.",
  },
  {
    id: "p10",
    title: "Autoryzacja mobilna i powiadomienia PUSH",
    category: "tozsamosc_cyfrowa",
    categoryLabel: "Tożsamość cyfrowa",
    domain: "dodatkowe",
    channel: "Mobile",
    channelLabel: "Aplikacja Mobilna",
    viewsCount: 5,
    totalViews: 5,
    score: 93.4,
    scoreVariant: "success",
    issuesCount: 2,
    criticalErrors: 0,
    auditDate: "10.02.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Bezpieczeństwo Cyfrowe",
    description: "Zatwierdzanie operacji bankowych za pomocą powiadomień PUSH z biometrią.",
  },
  {
    id: "p11",
    title: "Zmiana limitów transakcyjnych kart płatniczych",
    category: "limity_kart",
    categoryLabel: "Limity kart",
    domain: "karty",
    channel: "WWW",
    channelLabel: "Portal WWW",
    viewsCount: 4,
    totalViews: 4,
    score: 89.0,
    scoreVariant: "warning",
    issuesCount: 2,
    criticalErrors: 0,
    auditDate: "14.01.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Zarządzanie Kartami",
    description: "Suwaki i pola kwotowe do modyfikacji limitów dziennych i miesięcznych dla płatności internetowych i bankomatowych.",
  },
  {
    id: "p12",
    title: "Zastrzeganie i blokada tymczasowa karty",
    category: "blokada_kart",
    categoryLabel: "Zastrzeganie kart",
    domain: "karty",
    channel: "Mobile",
    channelLabel: "Aplikacja Mobilna",
    viewsCount: 3,
    totalViews: 3,
    score: 98.2,
    scoreVariant: "success",
    issuesCount: 0,
    criticalErrors: 0,
    auditDate: "22.03.2024",
    auditStatus: "Zakończony",
    assignedTeam: "Zarządzanie Kartami",
    description: "Szybka ścieżka bezpieczeństwa: natychmiastowa blokada lub trwałe zastrzeżenie zagubionej karty płatniczej.",
  },
];

function BazaUslugContainer({ currentView, setView, onOpenReaudit, showToast }) {
  // activeCategory: null = Hub Katalogowy (Widok 6 domen x 50 kategorii)
  // activeCategory: "all_processes" = Zbiorcza lista wszystkich 50 procesów
  // activeCategory: "domain:xxx" = Procesy w danej domenie bankowej
  // activeCategory: string (np. "platnicze", "blik") = Dedykowany widok wybranej kategorii
  const [activeCategory, setActiveCategory] = useState(null);

  // Filtry wewnątrz widoku procesów
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [viewMode, setViewMode] = useState("cards"); // "cards" | "table"
  const [selectedProcessId, setSelectedProcessId] = useState("p1");
  const [processesList, setProcessesList] = useState(INITIAL_PROCESSES_LIST);

  // Wyszukiwanie i filtrowanie w Hubie Katalogowym
  const [hubSearchQuery, setHubSearchQuery] = useState("");
  const [hubDomainFilter, setHubDomainFilter] = useState("all");

  // Aktywny obiekt kategorii
  const currentCategoryObj = useMemo(() => {
    if (!activeCategory || activeCategory === "all_processes") {
      return { id: "all_processes", label: "Wszystkie procesy cyfrowe (50 procesów)", domain: "all", count: 50 };
    }
    if (activeCategory.startsWith("domain:")) {
      const domId = activeCategory.replace("domain:", "");
      const dom = SERVICE_DOMAINS.find((d) => d.id === domId);
      return {
        id: activeCategory,
        label: dom ? `Wszystkie procesy: ${dom.label}` : "Domena bankowa",
        domain: domId,
        count: dom ? dom.processesCount : 0,
      };
    }
    return SERVICE_CATEGORIES.find((c) => c.id === activeCategory) || SERVICE_CATEGORIES[0];
  }, [activeCategory]);

  const currentDomainObj = useMemo(() => {
    if (!currentCategoryObj || currentCategoryObj.domain === "all") return null;
    return SERVICE_DOMAINS.find((d) => d.id === currentCategoryObj.domain) || null;
  }, [currentCategoryObj]);

  // Kategorie w tej samej domenie (do szybkiego selektora wewnątrz widoku procesów)
  const siblingCategories = useMemo(() => {
    if (!currentDomainObj) return [];
    return SERVICE_CATEGORIES.filter((c) => c.domain === currentDomainObj.id);
  }, [currentDomainObj]);

  // Filtrowanie procesów
  const filteredProcesses = useMemo(() => {
    return processesList.filter((p) => {
      if (activeCategory && activeCategory !== "all_processes") {
        if (activeCategory.startsWith("domain:")) {
          const domId = activeCategory.replace("domain:", "");
          const cat = SERVICE_CATEGORIES.find((c) => c.id === p.category);
          if ((cat && cat.domain !== domId) && p.domain !== domId) return false;
        } else if (p.category !== activeCategory) {
          return false;
        }
      }
      if (channelFilter !== "all" && p.channel !== channelFilter) return false;
      if (scoreFilter === "high" && p.score < 80) return false;
      if (scoreFilter === "medium" && p.score >= 80) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.channelLabel.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [processesList, activeCategory, channelFilter, scoreFilter, searchQuery]);

  const activeProcess = useMemo(() => {
    return processesList.find((p) => p.id === selectedProcessId) || processesList[0];
  }, [processesList, selectedProcessId]);

  const handleOpenProcess = (processId) => {
    setSelectedProcessId(processId);
    if (setView) setView("proces-szczegoly");
  };

  const handleDeleteProcess = (processId, title) => {
    setProcessesList((prev) => prev.filter((p) => p.id !== processId));
    if (showToast) {
      showToast("Usunięto proces", `Proces "${title}" został usunięty z Bazy Usług.`);
    }
  };

  if (currentView === "proces-szczegoly") {
    return (
      <ProcessDetailsView
        setView={setView}
        onOpenReaudit={onOpenReaudit}
        selectedProcess={activeProcess}
        showToast={showToast}
      />
    );
  }

  // ==========================================
  // EKRAN 1: HUB KATALOGOWY (activeCategory === null)
  // ==========================================
  if (activeCategory === null) {
    return (
      <div data-testid="baza-uslug-hub" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden bg-[#f8fafc]">
        <ViewHeader
          breadcrumbs={[
            { label: "Pulpit", onClick: () => setView("przeglad") },
            { label: "Katalog Usług (Hub)" },
          ]}
          title="Baza Usług i Procesów"
          subtitle="Katalog 50 obszarów bankowych zorganizowanych w 6 domenach tematycznych (EAA & PAD). Wybierz kategorię, aby zarządzać procesami cyfrowymi."
          actions={
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all_processes");
                  setSearchQuery("");
                }}
                className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <List size={14} className="text-[#0038F8]" />
                <span>Wszystkie procesy (50)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (showToast) showToast("Nowy proces", "Formularz rejestracji nowego procesu cyfrowego w przygotowaniu.");
                }}
                className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={14} className="text-[#0038F8]" />
                <span>Nowy Proces</span>
              </button>
              <ReauditButton
                onClick={() => {
                  if (onOpenReaudit) {
                    onOpenReaudit("Wszystkie procesy w Bazie Usług", "Re-audyt procesów bankowych");
                  }
                }}
                variant="primary"
                title="Zleć formalną weryfikację bazy procesów"
              />
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-6 space-y-6">

            {/* RZĄD METRYK KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Katalog usług
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 block">
                    50 kategorii
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">
                    W 6 domenach bankowych
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038F8] flex items-center justify-center font-bold shrink-0 border border-blue-100">
                  <Layers size={18} />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Zbadane procesy
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-0.5 block">
                    50 procesów
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">
                    100% pokrycia audytem
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-100">
                  <CheckCircle2 size={18} />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Średnia zgodność WCAG
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 block">
                    93.4%
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
                    Wysoka zgodność (EAA & PAD)
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0 border border-indigo-100">
                  <ShieldCheck size={18} />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                    Zgłoszone skargi
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-amber-800 mt-0.5 block">
                    35 zgłoszeń
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">
                    5 w trakcie wdrożenia
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0 border border-amber-100">
                  <MessageSquare size={18} />
                </div>
              </div>
            </div>

            {/* PASEK WYSZUKIWANIA I FILTRÓW DOMEN W HUBIE */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Pole wyszukiwarki kategorii na żywo */}
                <div className="relative flex-1 max-w-lg">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={hubSearchQuery}
                    onChange={(e) => setHubSearchQuery(e.target.value)}
                    placeholder="Wyszukaj w 50 kategoriach (np. ROR, kredyt hipoteczny, BLIK, split payment, ubezpieczenie)..."
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                  />
                  {hubSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setHubSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Informacja o strukturze */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
                  <span>Struktura:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0038F8] font-bold">
                    6 domen bankowych
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
                    50 kategorii
                  </span>
                </div>
              </div>

              {/* Pigułki filtrowania domen */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 shrink-0">
                  Filtruj domeny:
                </span>
                <button
                  type="button"
                  onClick={() => setHubDomainFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    hubDomainFilter === "all"
                      ? "bg-[#0038F8] text-white shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Wszystkie domeny (6)
                </button>
                {SERVICE_DOMAINS.map((dom) => (
                  <button
                    key={dom.id}
                    type="button"
                    onClick={() => setHubDomainFilter(dom.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      hubDomainFilter === dom.id
                        ? "bg-[#0038F8] text-white shadow-2xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {dom.label} ({dom.count})
                  </button>
                ))}
              </div>
            </div>

            {/* SIATKA 6 KART DOMEN BANKOWYCH (HUB DIRECTORY) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {SERVICE_DOMAINS
                .filter((dom) => hubDomainFilter === "all" || hubDomainFilter === dom.id)
                .map((dom) => {
                  const DomainIcon = dom.icon || Landmark;
                  // Pobierz kategorie z tej domeny i przefiltruj wg hubSearchQuery
                  const domainCats = SERVICE_CATEGORIES.filter((c) => {
                    if (c.domain !== dom.id) return false;
                    if (hubSearchQuery.trim()) {
                      const q = hubSearchQuery.toLowerCase();
                      return c.label.toLowerCase().includes(q);
                    }
                    return true;
                  });

                  return (
                    <div
                      key={dom.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                    >
                      {/* Nagłówek domeny */}
                      <div className="p-5 border-b border-slate-100 bg-slate-50/60">
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${dom.theme.iconBg}`}>
                              <DomainIcon size={20} />
                            </div>
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                {dom.code} • {dom.count} kategorii
                              </span>
                              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                                {dom.label}
                              </h3>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <ShieldCheck size={13} />
                              {dom.score}%
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Śr. zgodność</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {dom.description}
                        </p>
                      </div>

                      {/* Lista kategorii w domenie */}
                      <div className="p-3 sm:p-4 flex-1 space-y-1 overflow-y-auto max-h-[300px]">
                        {domainCats.length === 0 ? (
                          <div className="py-8 text-center text-slate-400 text-xs">
                            Brak kategorii pasujących do wyszukiwania
                          </div>
                        ) : (
                          domainCats.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setActiveCategory(cat.id);
                                setSearchQuery("");
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/80 border border-transparent hover:border-blue-100 transition-all flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex-1 pr-2">
                                <span className="text-xs font-bold text-slate-700 group-hover:text-[#0038F8] transition-colors block">
                                  {cat.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {cat.count > 0 ? (
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-[#0038F8]">
                                    {cat.count} {cat.count === 1 ? "proc." : "proc."}
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-400">
                                    0 proc.
                                  </span>
                                )}
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-[#0038F8] group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </button>
                          ))
                        )}
                      </div>

                      {/* Stopka domeny */}
                      <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium text-[11px]">
                          Razem procesów: <strong className="text-slate-800">{dom.processesCount}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCategory("domain:" + dom.id);
                            setSearchQuery("");
                          }}
                          className="font-bold text-[#0038F8] hover:underline flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <span>Przeglądaj procesy domeny</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // EKRAN 2: DEDYKOWANY WIDOK PROCESÓW (activeCategory !== null)
  // ==========================================
  return (
    <div data-testid="baza-uslug-category" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden bg-[#f8fafc]">
      <ViewHeader
        breadcrumbs={[
          { label: "Pulpit", onClick: () => setView("przeglad") },
          { label: "Katalog Usług (Hub)", onClick: () => setActiveCategory(null) },
          ...(currentDomainObj ? [{ label: currentDomainObj.label, onClick: () => setActiveCategory("domain:" + currentDomainObj.id) }] : []),
          { label: currentCategoryObj.label },
        ]}
        title={currentCategoryObj.label}
        subtitle={
          activeCategory === "all_processes"
            ? "Zbiorczy wykaz wszystkich procesów cyfrowych banku zbadanych pod kątem standardów WCAG 2.1 AA i ustawy EAA."
            : `Wykaz procesów cyfrowych w obszarze ${currentCategoryObj.label}. Monitoruj zgodność kroków, zbadane widoki oraz wskaźniki EAA.`
        }
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Wróć do Katalogu Usług</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (showToast) showToast("Nowy proces", `Formularz rejestracji nowego procesu w kategorii "${currentCategoryObj.label}".`);
              }}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={14} className="text-[#0038F8]" />
              <span>Nowy Proces</span>
            </button>
            <ReauditButton
              onClick={() => {
                if (onOpenReaudit) {
                  onOpenReaudit(`Kategoria: ${currentCategoryObj.label}`, "Re-audyt procesów kategorii");
                }
              }}
              variant="primary"
              title="Zleć formalną weryfikację procesów w tej kategorii"
            />
          </div>
        }
      />

      {/* OBSZAR PROCESÓW W KATEGORII */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-6 space-y-6">

          {/* PASEK KONTEKSTOWY KATEGORII (CONTEXT BANNER) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0038F8] flex items-center justify-center font-bold shrink-0 border border-blue-100">
                <Library size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {currentDomainObj && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0038F8] border border-blue-200">
                      Domena: {currentDomainObj.label}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {filteredProcesses.length} {filteredProcesses.length === 1 ? "proces" : filteredProcesses.length < 5 ? "procesy" : "procesów"}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {currentCategoryObj.label}
                </h2>
              </div>
            </div>

            {/* Prawa strona: Szybki przełącznik sąsiednich kategorii z tej samej domeny */}
            {siblingCategories.length > 1 && (
              <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  Inne kategorie w domenie:
                </span>
                <select
                  value={activeCategory}
                  onChange={(e) => {
                    setActiveCategory(e.target.value);
                    setSearchQuery("");
                  }}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 max-w-[260px] truncate"
                >
                  <option value={activeCategory}>Bieżąca: {currentCategoryObj.label}</option>
                  {siblingCategories
                    .filter((c) => c.id !== activeCategory)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} ({c.count} proc.)
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* PASEK WYSZUKIWANIA I FILTRÓW */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Szukaj procesu po nazwie, kanale lub zespole..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filtr kanału */}
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 cursor-pointer"
              >
                <option value="all">Wszystkie kanały</option>
                <option value="WWW">Portal WWW Desktop</option>
                <option value="Mobile">Aplikacja Mobilna</option>
              </select>

              {/* Filtr zgodności */}
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 cursor-pointer"
              >
                <option value="all">Wszystkie wyniki zgodności</option>
                <option value="high">Wysoka zgodność (≥ 80%)</option>
                <option value="medium">Wymaga uwagi (&lt; 80%)</option>
              </select>
            </div>

            {/* Prawa strona: licznik i przełącznik widoku */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <span className="text-xs font-semibold text-slate-500">
                Wyniki: <strong className="text-slate-800">{filteredProcesses.length}</strong> z {processesList.length}
              </span>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "cards"
                      ? "bg-white text-[#0038F8] shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Widok kafelkowy"
                >
                  <LayoutGrid size={14} />
                  <span>Kafelki</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white text-[#0038F8] shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Widok tabelaryczny"
                >
                  <List size={14} />
                  <span>Tabela</span>
                </button>
              </div>
            </div>
          </div>

          {/* GŁÓWNA LISTA PROCESÓW */}
          {filteredProcesses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-14 text-center shadow-2xs">
              <div className="w-14 h-14 bg-blue-50 text-[#0038F8] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-100">
                <Library size={24} />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                {selectedCategory !== "all"
                  ? `Brak procesów w kategorii: ${currentCategoryObj.label}`
                  : "Brak procesów spełniających wybrane kryteria"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1.5 leading-relaxed">
                {selectedCategory !== "all"
                  ? `W wybranym obszarze bankowym nie zarejestrowano jeszcze procesów cyfrowych w bazie lub procesy oczekują na wstępny audyt EAA / WCAG.`
                  : "W wybranej kombinacji filtrów lub zapytaniu wyszukiwania nie znaleziono pasujących procesów."}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {selectedCategory !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("platnicze")}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#0038F8] text-xs font-bold rounded-xl transition-colors cursor-pointer border border-blue-200"
                  >
                    Wróć do: Usługi płatnicze (50 procesów)
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setChannelFilter("all");
                    setScoreFilter("all");
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Pokaż wszystkie (50 procesów)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (showToast) showToast("Nowy proces", `Rejestracja procesu cyfrowego w kategorii: ${currentCategoryObj.label}`);
                  }}
                  className="px-4 py-2.5 bg-[#0038F8] hover:bg-[#002ECC] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  + Dodaj pierwszy proces do tej kategorii
                </button>
              </div>
            </div>
          ) : viewMode === "cards" ? (
            /* WIDOK KAFELKOWY */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProcesses.map((p) => {
                const isSuccess = p.score >= 80;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleOpenProcess(p.id)}
                    className="p-5 bg-white border border-slate-200 hover:border-[#0038F8]/40 hover:shadow-md transition-all rounded-2xl flex flex-col justify-between group cursor-pointer shadow-2xs"
                  >
                    <div>
                      {/* Nagłówek karty */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                              p.channel === "WWW"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            }`}
                          >
                            {p.channel === "WWW" ? (
                              <Monitor size={12} />
                            ) : (
                              <Smartphone size={12} />
                            )}
                            <span>{p.channelLabel}</span>
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                          {p.categoryLabel}
                        </span>
                      </div>

                      {/* Tytuł procesu */}
                      <h3 className="text-[15px] sm:text-base font-bold text-slate-900 group-hover:text-[#0038F8] transition-colors leading-snug line-clamp-2">
                        {p.title}
                      </h3>

                      {/* Krótki opis */}
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Blok metryk */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 mt-4 text-center">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            Widoki
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5 block">
                            {p.viewsCount} / {p.totalViews}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            Dostępność
                          </span>
                          <span
                            className={`text-xs sm:text-sm font-extrabold mt-0.5 block ${
                              isSuccess ? "text-emerald-600" : "text-amber-600"
                            }`}
                          >
                            {p.score}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            Reklamacje
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5 block">
                            {p.issuesCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dolny pasek akcji */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0038F8] group-hover:underline">
                        <span>Szczegóły kroków</span>
                        <ArrowRight size={13} />
                      </span>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <ReauditButton
                          onClick={() => {
                            if (onOpenReaudit) onOpenReaudit(`Proces: ${p.title}`, "Re-audyt procesu");
                          }}
                          variant="icon"
                          title="Zleć re-audyt tego procesu"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (showToast) showToast("Edycja procesu", `Otwarto edycję procesu "${p.title}".`);
                          }}
                          className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edytuj proces"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProcess(p.id, p.title)}
                          className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-colors cursor-pointer"
                          title="Usuń proces"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* WIDOK TABELI */
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Proces biznesowy</th>
                      <th className="px-4 py-3.5">Kanał</th>
                      <th className="px-4 py-3.5">Widoki / Kroki</th>
                      <th className="px-4 py-3.5">Dostępność WCAG</th>
                      <th className="px-4 py-3.5">Reklamacje</th>
                      <th className="px-4 py-3.5">Ostatni audyt</th>
                      <th className="px-5 py-3.5 text-right">Akcje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProcesses.map((p) => {
                      const isSuccess = p.score >= 80;
                      return (
                        <tr
                          key={p.id}
                          onClick={() => handleOpenProcess(p.id)}
                          className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#0038F8] flex items-center justify-center shrink-0 border border-slate-200/60">
                                {p.channel === "WWW" ? <Monitor size={15} /> : <Smartphone size={15} />}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 group-hover:text-[#0038F8] transition-colors block truncate max-w-md">
                                  {p.title}
                                </span>
                                <span className="text-[11px] text-slate-400 block truncate">
                                  {p.categoryLabel} • {p.assignedTeam}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                                p.channel === "WWW"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                              }`}
                            >
                              {p.channelLabel}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="font-bold text-slate-800 text-xs sm:text-sm">
                              {p.viewsCount} / {p.totalViews}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                isSuccess
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isSuccess ? "bg-emerald-500" : "bg-amber-500"
                                }`}
                              />
                              <span>{p.score}%</span>
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                              <MessageSquare size={13} className="text-slate-400" />
                              <span>{p.issuesCount}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-500">
                            {p.auditDate}
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleOpenProcess(p.id)}
                                className="px-2.5 py-1.5 text-xs font-bold text-[#0038F8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              >
                                Szczegóły
                              </button>
                              <ReauditButton
                                onClick={() => {
                                  if (onOpenReaudit) onOpenReaudit(`Proces: ${p.title}`, "Re-audyt procesu");
                                }}
                                variant="icon"
                                title="Zleć re-audyt tego procesu"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteProcess(p.id, p.title)}
                                className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                                title="Usuń"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}

function ProcessDetailsView({ setView, onOpenReaudit, selectedProcess, showToast }) {
  const process = selectedProcess || {
    id: "p1",
    title: "Otwarcie ROR (istniejący dorosły klient)",
    categoryLabel: "Usługi płatnicze",
    channelLabel: "Portal WWW",
    channel: "WWW",
    viewsCount: 12,
    totalViews: 12,
    score: 85.2,
    issuesCount: 5,
    assignedTeam: "Zespół Kont i Płatności",
  };

  return (
    <div data-testid="process-details-view" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden bg-[#f8fafc]">
      <ViewHeader
        breadcrumbs={[
          { label: "Pulpit", onClick: () => setView("przeglad") },
          { label: "Baza Usług", onClick: () => setView("baza-uslug") },
          { label: process.title },
        ]}
        title={process.title}
        subtitle="Wykaz kroków, zbadanych widoków oraz szczegółowych wskaźników dostępności WCAG dla tego procesu."
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setView("baza-uslug")}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Powrót do Bazy Usług</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (showToast) showToast("Nowy widok", "Formularz dodawania nowego kroku do procesu w przygotowaniu.");
              }}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
            >
              <Plus size={14} className="text-[#0038F8]" />
              <span>Nowy Widok</span>
            </button>
            <ReauditButton
              onClick={() => {
                if (onOpenReaudit) {
                  onOpenReaudit(`Proces: ${process.title}`, "Re-audyt procesu");
                }
              }}
              variant="primary"
              title="Zleć formalną weryfikację tego procesu"
            />
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-6 space-y-6">

          {/* KARTA PODSUMOWANIA PROCESU */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {process.channelLabel || "Portal WWW"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
                    {process.categoryLabel || "Usługi płatnicze"}
                  </span>
                  <span className="text-xs text-slate-400">
                    Zespół: <strong className="text-slate-700">{process.assignedTeam || "Zespół Kont i Płatności"}</strong>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {process.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Ścieżka klienta obejmuje {process.viewsCount || 12} zbadanych ekranów. Wszystkie widoki posiadają aktywny audyt okresowy.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="text-center px-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Zgodność
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-0.5 block">
                    {process.score || 85.2}%
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Widoki
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5 block">
                    {process.viewsCount || 12}/{process.totalViews || 12}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Skargi
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5 block">
                    {process.issuesCount || 5}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* LISTA KROKÓW / WIDOKÓW PROCESU */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Kroki i zbadane ekrany w tym procesie
            </h3>
            <div className="flex flex-col gap-3">
              <StepItem
                number="1"
                title="Strona główna serwisu transakcyjnego"
                subtitle="Ekran startowy po zalogowaniu"
                channel="WWW"
                score="95.92%"
                scoreVariant="success"
                priorities={0}
                warnings={0}
                marginals={2}
                actionType="open"
                onOpenAudit={() => setView("raport-szczegoly")}
              />
              <StepItem
                number="2"
                title='Katalog produktów - sekcja "Konta i pakiety"'
                titleIcon={<CheckCircle2 className="text-emerald-500" size={16} />}
                subtitle="Podstrona wyboru typu rachunku"
                channel="WWW"
                score="100%"
                scoreVariant="success"
                priorities={0}
                warnings={0}
                marginals={0}
                actionType="open"
                onOpenAudit={() => setView("raport-szczegoly")}
              />
              <StepItem
                number="3"
                title="Konto Direct - parametry i opłaty"
                subtitle="Szczegóły oferty i tabela prowizji"
                channel="WWW"
                score="92.5%"
                scoreVariant="success"
                priorities={0}
                warnings={1}
                marginals={2}
                actionType="open"
                onOpenAudit={() => setView("raport-szczegoly")}
              />
              <StepItem
                number="4"
                title="Wniosek o otwarcie ROR - Krok 1 (Dane osobowe)"
                subtitle="Formularz weryfikacyjny"
                channel="WWW"
                score="85.2%"
                scoreVariant="warning"
                priorities={1}
                warnings={3}
                marginals={3}
                actionType="open"
                onOpenAudit={() => setView("raport-szczegoly")}
              />
              <StepItem
                number="5"
                title="Wniosek o otwarcie ROR - Krok 2 (Wybór karty i usług)"
                subtitle="Konfiguracja karty wielowalutowej i limitów"
                channel="WWW"
                score="96.0%"
                scoreVariant="success"
                priorities={0}
                warnings={0}
                marginals={1}
                actionType="open"
                onOpenAudit={() => setView("raport-szczegoly")}
              />
              <StepItem
                number="6"
                title="Potwierdzenie autoryzacyjne i podsumowanie"
                subtitle="Ekran podpisu umowy kodem SMS / PUSH"
                channel="WWW"
                score="88.0%"
                scoreVariant="warning"
                priorities={0}
                warnings={2}
                marginals={1}
                actionType="open"
                onOpenAudit={() => setView("raport-szczegoly")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({
  number,
  title,
  titleIcon,
  subtitle,
  subtitleWarning,
  channel,
  score,
  scoreVariant,
  priorities,
  warnings,
  marginals = 0,
  actionType,
  onOpenAudit,
}) {
  return (
    <Card
      data-testid="step-item"
      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between bg-white hover:border-[#0038F8]/30 transition-all duration-300 gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm sm:text-lg flex-shrink-0">
          {number}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-slate-900 text-[15px] sm:text-[17px]">
              {title}
            </span>
            {titleIcon}
          </div>
          <div className="flex items-center gap-1.5">
            {subtitleWarning ? (
              <AlertTriangle size={14} className="text-red-500" />
            ) : (
              <Link2 size={14} className="text-[#0038F8]" />
            )}
            <span
              className={`text-xs sm:text-sm font-medium ${
                subtitleWarning ? "text-red-500" : "text-slate-500"
              }`}
            >
              {subtitle}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-3 border-t sm:border-none border-slate-100 pt-3 sm:pt-0">
        <div className="flex items-center gap-3 sm:gap-4 sm:border-r border-slate-100 sm:pr-4">
          {/* Priorytetowe */}
          <div
            className="relative group/tip flex items-center gap-1.5 w-8 sm:w-9 cursor-help"
            title={`Błędy priorytetowe: ${priorities}`}
          >
            <AlertOctagon
              size={14}
              className={priorities > 0 ? "text-red-700" : "text-slate-500"}
            />
            <span
              className={`font-bold text-[13px] sm:text-[15px] ${
                priorities > 0 ? "text-red-700" : "text-slate-600"
              }`}
            >
              {priorities}
            </span>
            <div
              role="tooltip"
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
            >
              Błędy priorytetowe: {priorities}
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>

          {/* Ważne */}
          <div
            className="relative group/tip flex items-center gap-1.5 w-8 sm:w-9 cursor-help"
            title={`Błędy ważne: ${warnings}`}
          >
            <AlertTriangle
              size={14}
              className={warnings > 0 ? "text-amber-800" : "text-slate-500"}
            />
            <span
              className={`font-bold text-[13px] sm:text-[15px] ${
                warnings > 0 ? "text-amber-800" : "text-slate-600"
              }`}
            >
              {warnings}
            </span>
            <div
              role="tooltip"
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
            >
              Błędy ważne: {warnings}
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>

          {/* Marginalne */}
          <div
            className="relative group/tip flex items-center gap-1.5 w-8 sm:w-9 cursor-help"
            title={`Błędy marginalne: ${marginals}`}
          >
            <Info
              size={14}
              className={marginals > 0 ? "text-blue-700" : "text-slate-500"}
            />
            <span
              className={`font-bold text-[13px] sm:text-[15px] ${
                marginals > 0 ? "text-blue-700" : "text-slate-600"
              }`}
            >
              {marginals}
            </span>
            <div
              role="tooltip"
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
            >
              Błędy marginalne: {marginals}
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>
          <Badge
            variant={scoreVariant}
            className="px-2 sm:px-3 py-1 text-[11px] sm:text-[13px] w-16 sm:w-20 justify-center"
          >
            {score}
          </Badge>
        </div>

        <div className="flex items-center gap-2 w-auto sm:w-[85px] shrink-0">
          {channel ? (
            <>
              {getChannelIcon(channel)}
              <span className="text-[12px] sm:text-[13px] font-medium text-slate-500 whitespace-nowrap">
                {channel}
              </span>
            </>
          ) : (
            <span className="w-full"></span>
          )}
        </div>

        <div className="flex items-center justify-end flex-1 sm:flex-none w-full sm:w-auto mt-2 sm:mt-0">
          {actionType === "open" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenAudit) onOpenAudit();
              }}
              className="flex items-center justify-center sm:justify-end gap-2 text-[#0038F8] font-bold text-[12px] sm:text-[13px] hover:text-[#002ECC] transition-colors w-full sm:w-[120px] shrink-0"
            >
              Otwórz audyt <ExternalLink size={14} />
            </button>
          ) : (
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center sm:justify-end gap-2 text-slate-600 font-bold text-[12px] sm:text-[13px] hover:text-slate-800 transition-colors w-full sm:w-[120px] shrink-0"
            >
              <Link2 size={14} /> Przypisz audyt
            </button>
          )}
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 sm:w-10 sm:h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0 ml-3 sm:ml-4"
          >
            <Pencil size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// RAPORTY Z AUDYTÓW (Wyszukiwarka)
// ==========================================

function RaportyView({ setView, onOpenReaudit, showToast }) {
  const mockAuditsList = [
    {
      id: 1,
      date: "12.03.2026",
      status: "Zakończony",
      title: "Portal informacyjny - wybrane podstrony",
      devices: "Desktop, Android, iOS",
      priority: "3",
      critical: 3,
      important: 7,
      marginal: 4,
      score: "77.55%",
      icon: MonitorSmartphone,
      statusVariant: "success",
      auditor: "Piotr Smułkowski",
    },
    {
      id: 2,
      date: "04.03.2026",
      status: "Zakończony",
      title: "Aplikacja mobilna Android - wybrane procesy",
      devices: "Android",
      priority: "2",
      critical: 2,
      important: 5,
      marginal: 3,
      score: "83.67%",
      icon: Smartphone,
      statusVariant: "success",
      auditor: "Piotr Smułkowski",
    },
    {
      id: 3,
      date: "15.04.2026",
      status: "W trakcie",
      title: "Serwis transakcyjny - Nowy Dashboard",
      devices: "Desktop",
      priority: "5",
      critical: 5,
      important: 14,
      marginal: 8,
      score: "62.10%",
      icon: MonitorSmartphone,
      statusVariant: "warning",
      auditor: "Anna Nowak",
    },
    {
      id: 4,
      date: "22.04.2026",
      status: "W trakcie",
      title: "Aplikacja mobilna - moduł inwestycji",
      devices: "iOS, Android",
      priority: "1",
      critical: 1,
      important: 3,
      marginal: 2,
      score: "89.40%",
      icon: Smartphone,
      statusVariant: "warning",
      auditor: "Jan Kowalski",
    },
    {
      id: 5,
      date: "10.05.2026",
      status: "Zakończony",
      title: "Dokumenty PDF - Regulaminy kart",
      devices: "Dokumenty",
      priority: "0",
      critical: 0,
      important: 1,
      marginal: 2,
      score: "95.00%",
      icon: FileText,
      statusVariant: "success",
      auditor: "Piotr Smułkowski",
    },
    {
      id: 6,
      date: "05.06.2026",
      status: "Nowy",
      title: "Proces reklamacyjny - formularze",
      devices: "Desktop, Mobile Web",
      priority: "8",
      critical: 8,
      important: 19,
      marginal: 11,
      score: "45.20%",
      icon: LayoutGrid,
      statusVariant: "info",
      auditor: "Anna Nowak",
    },
  ];

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuditor, setSelectedAuditor] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [selectedChannels, setSelectedChannels] = useState({});
  const [activeTimeRange, setActiveTimeRange] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [sortBy, setSortBy] = useState("score_desc");
  const [layoutMode, setLayoutMode] = useState("table"); // 'table' (standardowy) | 'grid' (kafelkowy)

  // Bezpieczne zamykanie dropdownu przy kliknięciu poza niego (bez blokowania kliknięć wewnątrz)
  useEffect(() => {
    if (!activeDropdown) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-dropdown-container]")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedAuditor("");
    setSelectedStatuses({});
    setSelectedChannels({});
    setActiveTimeRange("all");
    setDateFrom("");
    setDateTo("");
    setOnlyCritical(false);
    setActiveDropdown(null);
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedAuditor ||
    Object.values(selectedStatuses).some(Boolean) ||
    Object.values(selectedChannels).some(Boolean) ||
    activeTimeRange !== "all" ||
    dateFrom ||
    dateTo ||
    onlyCritical
  );

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedAuditor ? 1 : 0) +
    Object.values(selectedStatuses).filter(Boolean).length +
    Object.values(selectedChannels).filter(Boolean).length +
    (activeTimeRange !== "all" || dateFrom || dateTo ? 1 : 0) +
    (onlyCritical ? 1 : 0);

  // Dynamiczne filtrowanie i sortowanie na bieżąco
  const filteredAudits = useMemo(() => {
    let list = [...mockAuditsList];

    // Wyszukiwanie po tekście
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.devices.toLowerCase().includes(q) ||
          a.status.toLowerCase().includes(q)
      );
    }

    // 1. Audytor
    if (selectedAuditor) {
      list = list.filter((a) => a.auditor === selectedAuditor);
    }

    // 3. Status audytu
    const activeStatuses = Object.keys(selectedStatuses).filter((k) => selectedStatuses[k]);
    if (activeStatuses.length > 0) {
      list = list.filter((a) => activeStatuses.includes(a.status));
    }

    // 4. Kanał
    const activeChannels = Object.keys(selectedChannels).filter((k) => selectedChannels[k]);
    if (activeChannels.length > 0) {
      list = list.filter((a) =>
        activeChannels.some((ch) => a.devices.toLowerCase().includes(ch.toLowerCase()))
      );
    }

    // 5. Czas
    if (dateFrom) {
      const fromTime = new Date(dateFrom).getTime();
      list = list.filter((a) => {
        const [d, m, y] = a.date.split(".").map(Number);
        return new Date(y, m - 1, d).getTime() >= fromTime;
      });
    }
    if (dateTo) {
      const toTime = new Date(dateTo).getTime();
      list = list.filter((a) => {
        const [d, m, y] = a.date.split(".").map(Number);
        return new Date(y, m - 1, d).getTime() <= toTime;
      });
    }
    if (activeTimeRange === "30d") {
      list = list.filter((a) => {
        const [, m] = a.date.split(".").map(Number);
        return m >= 5;
      });
    } else if (activeTimeRange === "60d") {
      list = list.filter((a) => {
        const [, m] = a.date.split(".").map(Number);
        return m >= 4;
      });
    }

    // 6. Błędy: tylko priorytetowe
    if (onlyCritical) {
      list = list.filter((a) => parseInt(a.priority, 10) > 0);
    }

    // Sortowanie
    if (sortBy === "score_desc") {
      list.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
    } else if (sortBy === "score_asc") {
      list.sort((a, b) => parseFloat(a.score) - parseFloat(b.score));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => {
        const [d1, m1, y1] = a.date.split(".").map(Number);
        const [d2, m2, y2] = b.date.split(".").map(Number);
        return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
      });
    } else if (sortBy === "alpha") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // newest
      list.sort((a, b) => {
        const [d1, m1, y1] = a.date.split(".").map(Number);
        const [d2, m2, y2] = b.date.split(".").map(Number);
        return new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
      });
    }

    return list;
  }, [
    mockAuditsList,
    searchQuery,
    selectedAuditor,
    selectedStatuses,
    selectedChannels,
    activeTimeRange,
    dateFrom,
    dateTo,
    onlyCritical,
    sortBy,
  ]);

  return (
    <div data-testid="raporty-view" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden">
      {/* Główny nagłówek z dynamicznymi filtrami - Tło 100vw, content max 1600px wyśrodkowany */}
      <div className="w-full bg-white z-20 flex-shrink-0 border-b border-slate-200 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-4">
          {/* Prosty, czytelny breadcrumbs bez ikonek i kolorów */}
          <nav aria-label="Ścieżka nawigacyjna" className="flex items-center text-[13px] font-medium text-slate-500 mb-2">
            <ol role="list" className="flex items-center flex-wrap gap-2 list-none m-0 p-0">
              <li>
                <button
                  type="button"
                  onClick={() => setView("przeglad")}
                  className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Pulpit
                </button>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-300 select-none font-normal" aria-hidden="true">/</span>
                <span aria-current="page" className="text-slate-800 font-semibold">Audyty</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
                Raporty z audytów
              </h1>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Przeglądaj i filtruj dynamicznie wyniki przeprowadzonych audytów cyfrowych.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() =>
                  showToast &&
                  showToast(
                    "Eksport do Excela (.xlsx)",
                    "Wygenerowano arkusz Excel z 6 audytami i szczegółowymi metrykami WCAG w formacie .xlsx."
                  )
                }
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                title="Eksportuj audyty do pliku Excel"
              >
                <FileSpreadsheet size={14} className="text-emerald-600" />
                <span>Eksport (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast &&
                  showToast(
                    "Pobieranie Word (.doc)",
                    "Rozpoczęto generowanie pakietu audytów w formacie Microsoft Word (.docx)..."
                  )
                }
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                title="Pobierz w formacie Microsoft Word (.doc)"
              >
                <FileCode size={14} className="text-blue-600" />
                <span>Pobierz (.doc)</span>
              </button>
              <ReauditButton
                onClick={() =>
                  onOpenReaudit &&
                  onOpenReaudit(
                    "Zbiorcze audyty organizacji",
                    "Audyt WCAG 2.1 AA",
                    "Piotr Smułkowski"
                  )
                }
                variant="primary"
              />
            </div>
          </div>

        <div className="mb-3">
          <Input
            icon={Search}
            placeholder="Wyszukaj audyt po tytule, banku lub kanale..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white"
          />
        </div>

        {/* POZIOME FILTRY DYNAMICZNE (Bez przycisku Zastosuj - reakcja natychmiastowa) */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-4 shadow-xs relative z-30">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-24 shrink-0 flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              <Filter size={14} className="text-[#0038F8]" />
              <span>Filtry:</span>
            </div>

            {/* 1. Audytor */}
            <div className="relative" data-dropdown-container="true">
              <button
                type="button"
                onClick={() => toggleDropdown("audytor")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  selectedAuditor
                    ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>1. Audytor{selectedAuditor ? `: ${selectedAuditor}` : ""}</span>
                <ChevronDown size={14} className={selectedAuditor ? "text-white" : "text-slate-400"} />
              </button>
              {activeDropdown === "audytor" && (
                <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                  {[
                    { value: "", label: "Wszyscy audytorzy" },
                    { value: "Piotr Smułkowski", label: "Piotr Smułkowski" },
                    { value: "Anna Nowak", label: "Anna Nowak" },
                    { value: "Jan Kowalski", label: "Jan Kowalski" },
                  ].map((aud) => (
                    <button
                      key={aud.value}
                      type="button"
                      onClick={() => {
                        setSelectedAuditor(aud.value);
                        setActiveDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                        selectedAuditor === aud.value
                          ? "bg-[#0038F8] text-white"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>{aud.label}</span>
                      {selectedAuditor === aud.value && <CheckCircle2 size={13} className="text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Status audytu */}
            <div className="relative" data-dropdown-container="true">
              <button
                type="button"
                onClick={() => toggleDropdown("status")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  Object.values(selectedStatuses).some(Boolean)
                    ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>2. Status audytu{Object.values(selectedStatuses).filter(Boolean).length > 0 ? ` (${Object.values(selectedStatuses).filter(Boolean).length})` : ""}</span>
                <ChevronDown size={14} className={Object.values(selectedStatuses).some(Boolean) ? "text-white" : "text-slate-400"} />
              </button>
              {activeDropdown === "status" && (
                <div className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
                  {["Zakończony", "W trakcie", "Nowy"].map((st) => {
                    const isChecked = Boolean(selectedStatuses[st]);
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setSelectedStatuses((prev) => ({ ...prev, [st]: !prev[st] }));
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                          isChecked
                            ? "bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20"
                            : "hover:bg-slate-50 text-slate-700 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="w-4 h-4 rounded text-[#0038F8] pointer-events-none"
                          />
                          <span>{st}</span>
                        </div>
                        {isChecked && <CheckCircle2 size={14} className="text-[#0038F8]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Kanał */}
            <div className="relative" data-dropdown-container="true">
              <button
                type="button"
                onClick={() => toggleDropdown("kanal")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  Object.values(selectedChannels).some(Boolean)
                    ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>3. Kanał{Object.values(selectedChannels).filter(Boolean).length > 0 ? ` (${Object.values(selectedChannels).filter(Boolean).length})` : ""}</span>
                <ChevronDown size={14} className={Object.values(selectedChannels).some(Boolean) ? "text-white" : "text-slate-400"} />
              </button>
              {activeDropdown === "kanal" && (
                <div className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
                  {["Desktop", "Mobile Web", "iOS", "Android", "Dokumenty"].map((ch) => {
                    const isChecked = Boolean(selectedChannels[ch]);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => {
                          setSelectedChannels((prev) => ({ ...prev, [ch]: !prev[ch] }));
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                          isChecked
                            ? "bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20"
                            : "hover:bg-slate-50 text-slate-700 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="w-4 h-4 rounded text-[#0038F8] pointer-events-none"
                          />
                          <span>{ch}</span>
                        </div>
                        {isChecked && <CheckCircle2 size={14} className="text-[#0038F8]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Czas */}
            <div className="relative" data-dropdown-container="true">
              <button
                type="button"
                onClick={() => toggleDropdown("czas")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  activeTimeRange !== "all" || dateFrom || dateTo
                    ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>4. Czas{activeTimeRange !== "all" ? `: ${activeTimeRange === "30d" ? "30 dni" : activeTimeRange === "60d" ? "60 dni" : "1 Rok"}` : (dateFrom || dateTo) ? ": Zakres" : ""}</span>
                <ChevronDown size={14} className={activeTimeRange !== "all" || dateFrom || dateTo ? "text-white" : "text-slate-400"} />
              </button>
              {activeDropdown === "czas" && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3.5 space-y-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-1.5 font-semibold">Szybki wybór okresu</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "30d", label: "30 dni" },
                        { id: "60d", label: "60 dni" },
                        { id: "1y", label: "1 Rok" },
                        { id: "all", label: "Wszystkie" },
                      ].map((tr) => (
                        <button
                          key={tr.id}
                          type="button"
                          onClick={() => {
                            setActiveTimeRange(tr.id);
                            setDateFrom("");
                            setDateTo("");
                          }}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border cursor-pointer ${
                            activeTimeRange === tr.id
                              ? "bg-[#0038F8] text-white border-[#0038F8]"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                          }`}
                        >
                          {tr.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1 font-semibold">Data realizacji</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => {
                          setDateFrom(e.target.value);
                          setActiveTimeRange("custom");
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700"
                      />
                      <span className="text-slate-400 text-xs">-</span>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => {
                          setDateTo(e.target.value);
                          setActiveTimeRange("custom");
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Błędy */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOnlyCritical(!onlyCritical)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  onlyCritical
                    ? "bg-red-500 text-white border-red-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <AlertOctagon size={12} className={onlyCritical ? "text-white" : "text-slate-400"} />
                <span>5. Tylko priorytetowe</span>
                {onlyCritical && <CheckCircle2 size={12} className="text-white" />}
              </button>
            </div>

            {/* Przycisk: Wyczyść */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleClear}
                disabled={!hasActiveFilters}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-colors text-xs border shadow-sm ${
                  hasActiveFilters
                    ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 cursor-pointer"
                    : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                }`}
                title={hasActiveFilters ? "Zresetuj wszystkie aktywne filtry" : "Brak aktywnych filtrów"}
              >
                <X size={12} className={hasActiveFilters ? "text-slate-500" : "text-slate-400"} />
                <span>Wyczyść</span>
              </button>
            </div>
          </div>

          {/* PASEK WYBRANYCH FILTRÓW (Klient widzi od razu wybrane filtry i że wyniki są odfiltrowane) */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2.5 mt-2.5 border-t border-slate-200/80">
              <div className="w-28 shrink-0 flex items-center text-xs font-bold text-slate-500 whitespace-nowrap">
                <span>Wybrane filtry:</span>
              </div>

              {/* Chip: Wyszukiwanie */}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
                  <span>Szukaj: "{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                    title="Usuń ten filtr"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {/* Chip: Audytor */}
              {selectedAuditor && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
                  <span>Audytor: {selectedAuditor}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedAuditor("")}
                    className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                    title="Usuń ten filtr"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {/* Chips: Statusy */}
              {Object.keys(selectedStatuses).filter((k) => selectedStatuses[k]).map((st) => (
                <span key={st} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
                  <span>Status: {st}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedStatuses(prev => ({ ...prev, [st]: false }))}
                    className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                    title={`Usuń filtr ${st}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {/* Chips: Kanały */}
              {Object.keys(selectedChannels).filter((k) => selectedChannels[k]).map((ch) => (
                <span key={ch} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
                  <span>Kanał: {ch}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedChannels(prev => ({ ...prev, [ch]: false }))}
                    className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                    title={`Usuń filtr ${ch}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {/* Chip: Czas */}
              {activeTimeRange !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
                  <span>Czas: {activeTimeRange === "30d" ? "30 dni" : activeTimeRange === "60d" ? "60 dni" : activeTimeRange === "1y" ? "1 Rok" : "Własny zakres"}</span>
                  <button
                    type="button"
                    onClick={() => { setActiveTimeRange("all"); setDateFrom(""); setDateTo(""); }}
                    className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                    title="Usuń filtr czasu"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {/* Chip: Daty */}
              {(dateFrom || dateTo) && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
                  <span>Zakres: {dateFrom || "..."} do {dateTo || "..."}</span>
                  <button
                    type="button"
                    onClick={() => { setDateFrom(""); setDateTo(""); setActiveTimeRange("all"); }}
                    className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                    title="Usuń filtr dat"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {/* Chip: Tylko priorytetowe */}
              {onlyCritical && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                  <AlertOctagon size={12} className="text-red-500" />
                  <span>Tylko błędy priorytetowe</span>
                  <button
                    type="button"
                    onClick={() => setOnlyCritical(false)}
                    className="hover:bg-red-200/50 p-0.5 rounded transition-colors cursor-pointer"
                    title="Usuń filtr błędów priorytetowych"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm font-bold text-slate-700">
              Wyniki: <span className="text-[#0038F8] font-black">{filteredAudits.length}</span> z {mockAuditsList.length} audytów
            </span>
            {hasActiveFilters && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
                <CheckCircle2 size={12} /> Wyniki odfiltrowane ({activeFilterCount})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-semibold text-slate-400">Sortuj:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 cursor-pointer shadow-sm"
              >
                <option value="score_desc">Wynik: od najwyższego (%)</option>
                <option value="score_asc">Wynik: od najniższego (%)</option>
                <option value="newest">Data: od najnowszych</option>
                <option value="oldest">Data: od najstarszych</option>
                <option value="alpha">Alfabetycznie (A-Z)</option>
              </select>
            </div>

            <div
              className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80"
              role="group"
              aria-label="Układ widoku audytów"
            >
              <button
                type="button"
                onClick={() => setLayoutMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  layoutMode === "table"
                    ? "bg-white text-[#0038F8] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-pressed={layoutMode === "table"}
                title="Widok tabeli (standardowy)"
              >
                <List size={14} />
                <span className="hidden sm:inline">Tabela</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  layoutMode === "grid"
                    ? "bg-white text-[#0038F8] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-pressed={layoutMode === "grid"}
                title="Widok kafelkowy"
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Kafelki</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="flex-1 md:overflow-auto w-full">
        <div className="max-w-[1600px] mx-auto p-4 sm:p-8 lg:p-12">
        {filteredAudits.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <ClipboardCheck size={36} className="mx-auto text-slate-300 mb-3" />
            <div className="font-bold text-slate-700 text-base">Brak audytów spełniających wybrane filtry</div>
            <p className="text-slate-400 text-xs mt-1 mb-4">Spróbuj zmienić parametry filtrów lub wyszukiwaną frazę.</p>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 bg-[#0038F8] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-[#002ECC] transition-colors cursor-pointer"
            >
              Wyczyść wszystkie filtry
            </button>
          </div>
        ) : layoutMode === "table" ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" data-testid="audits-table-view">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[960px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Audyt / Zakres</th>
                    <th className="px-5 py-3.5">Kanał</th>
                    <th className="px-5 py-3.5">Data audytu</th>
                    <th className="px-5 py-3.5">Audytor</th>
                    <th className="px-5 py-3.5 text-center whitespace-nowrap">Błędy (Priorytet / Ważne / Marginalne)</th>
                    <th className="px-5 py-3.5 text-center">Wynik WCAG</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Akcja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredAudits.map((audit) => {
                    const DeviceIcon = audit.icon;
                    const scoreNum = parseFloat(audit.score);
                    const isHigh = scoreNum >= 80;
                    return (
                      <tr
                        key={audit.id}
                        onClick={() => setView("raport-szczegoly")}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setView("raport-szczegoly");
                          }
                        }}
                      >
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 group-hover:text-[#0038F8] transition-colors leading-snug">
                            {audit.title}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                            {DeviceIcon && <DeviceIcon size={16} className="text-slate-400 shrink-0" />}
                            <span>{audit.devices}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                            <Calendar size={13} className="text-slate-400 shrink-0" />
                            <span>{audit.date}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-medium">
                            <User size={13} className="text-slate-400 shrink-0" />
                            <span>{audit.auditor}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            {/* Priorytetowe */}
                            <div className="relative group/tip flex items-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border cursor-help ${
                                  audit.critical > 0
                                    ? "bg-red-50 text-red-700 border-red-200/80"
                                    : "bg-slate-50 text-slate-400 border-slate-200/60"
                                }`}
                                title={`Błędy priorytetowe: ${audit.critical}`}
                              >
                                <AlertOctagon size={12} className={audit.critical > 0 ? "text-red-500" : "text-slate-400"} />
                                <span>{audit.critical}</span>
                              </span>
                              <div
                                role="tooltip"
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                              >
                                Błędy priorytetowe: {audit.critical}
                                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                              </div>
                            </div>

                            {/* Ważne */}
                            <div className="relative group/tip flex items-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border cursor-help ${
                                  audit.important > 0
                                    ? "bg-amber-50 text-amber-700 border-amber-200/80"
                                    : "bg-slate-50 text-slate-400 border-slate-200/60"
                                }`}
                                title={`Błędy ważne: ${audit.important}`}
                              >
                                <AlertTriangle size={12} className={audit.important > 0 ? "text-amber-500" : "text-slate-400"} />
                                <span>{audit.important}</span>
                              </span>
                              <div
                                role="tooltip"
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                              >
                                Błędy ważne: {audit.important}
                                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                              </div>
                            </div>

                            {/* Marginalne */}
                            <div className="relative group/tip flex items-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border cursor-help ${
                                  audit.marginal > 0
                                    ? "bg-blue-50 text-blue-700 border-blue-200/80"
                                    : "bg-slate-50 text-slate-400 border-slate-200/60"
                                }`}
                                title={`Błędy marginalne: ${audit.marginal}`}
                              >
                                <Info size={12} className={audit.marginal > 0 ? "text-blue-500" : "text-slate-400"} />
                                <span>{audit.marginal}</span>
                              </span>
                              <div
                                role="tooltip"
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                              >
                                Błędy marginalne: {audit.marginal}
                                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          <span
                            className={`text-sm font-extrabold ${
                              isHigh ? "text-emerald-600" : "text-red-500"
                            }`}
                          >
                            {audit.score}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <Badge variant={audit.statusVariant}>
                            {audit.statusVariant === "success" && (
                              <CheckCircle2 size={13} className="shrink-0" />
                            )}
                            {audit.statusVariant === "warning" && (
                              <Activity size={13} className="shrink-0" />
                            )}
                            {audit.statusVariant === "info" && (
                              <Eye size={13} className="shrink-0" />
                            )}
                            <span>{audit.status}</span>
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setView("raport-szczegoly");
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] hover:bg-[#0038F8] hover:text-white transition-colors cursor-pointer"
                            title="Otwórz szczegóły audytu"
                          >
                            <span>Szczegóły</span>
                            <ArrowRight size={13} strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6" data-testid="audits-grid-view">
            {filteredAudits.map((audit) => (
              <ReportCard
                key={audit.id}
                date={audit.date}
                status={audit.status}
                statusVariant={audit.statusVariant}
                title={audit.title}
                devices={audit.devices}
                priority={audit.priority}
                critical={audit.critical}
                important={audit.important}
                marginal={audit.marginal}
                score={audit.score}
                icon={audit.icon}
                onClick={() => setView("raport-szczegoly")}
              />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

function ReportCard({
  date,
  status,
  statusVariant = "neutral",
  title,
  devices,
  priority,
  critical = 0,
  important = 0,
  marginal = 0,
  score,
  icon: DeviceIcon,
  onClick,
}) {
  return (
    <Card
      data-testid="report-card"
      className="p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer group flex flex-col"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <Badge variant="lightBlue">
          <Calendar size={12} className="text-indigo-600 shrink-0" />
          <span>{date}</span>
        </Badge>
        <Badge variant={statusVariant}>
          {statusVariant === "success" && (
            <CheckCircle2 size={13} className="shrink-0" />
          )}
          {statusVariant === "warning" && (
            <Activity size={13} className="shrink-0" />
          )}
          {statusVariant === "info" && (
            <Eye size={13} className="shrink-0" />
          )}
          <span>{status}</span>
        </Badge>
      </div>
      <div className="mb-3 sm:mb-4 flex-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mb-1.5 sm:mb-2 pr-2">
          {title}
        </h3>
      </div>
      <hr className="border-slate-100 mb-3" />
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Priorytetowe */}
            <div className="relative group/tip flex items-center">
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 cursor-help"
                title={`Błędy priorytetowe: ${critical ?? priority}`}
              >
                <AlertOctagon size={11} className="text-red-700" />
                {critical ?? priority}
              </span>
              <div
                role="tooltip"
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
              >
                Błędy priorytetowe: {critical ?? priority}
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>

            {/* Ważne */}
            <div className="relative group/tip flex items-center">
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 cursor-help"
                title={`Błędy ważne: ${important}`}
              >
                <AlertTriangle size={11} className="text-amber-800" />
                {important}
              </span>
              <div
                role="tooltip"
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
              >
                Błędy ważne: {important}
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>

            {/* Marginalne */}
            <div className="relative group/tip flex items-center">
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 cursor-help"
                title={`Błędy marginalne: ${marginal}`}
              >
                <Info size={11} className="text-blue-700" />
                {marginal}
              </span>
              <div
                role="tooltip"
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
              >
                Błędy marginalne: {marginal}
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-16 sm:w-20 shrink-0">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">
              Zgodność
            </span>
            <span
              className={`text-base sm:text-lg font-black leading-none ${
                parseFloat(score) >= 80 ? "text-emerald-700" : "text-amber-800"
              }`}
            >
              {score}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] sm:text-xs font-medium">
            <DeviceIcon size={16} className="w-4 h-4" />
            {devices}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-sm"
        >
          <ArrowRight size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>
      </div>
    </Card>
  );
}

function ReportSummaryView({ setView, onOpenReaudit, showToast }) {
  const [reauditsList, setReauditsList] = useState([
    {
      id: "re1",
      name: "Reaudyt 1: Weryfikacja po poprawkach",
      date: "15.04.2026",
      auditor: "P. Smułkowski",
      score: 85.2,
      brokenCriteria: 5,
      criticalErrors: 1,
      status: "Zakończony",
    },
    {
      id: "re2",
      name: "Reaudyt 2: Błędy priorytetowe",
      date: "20.05.2026",
      auditor: "A. Nowak",
      score: 92.4,
      brokenCriteria: 2,
      criticalErrors: 0,
      status: "W trakcie",
    },
  ]);

  const handleDownloadPdf = () => {
    if (showToast) {
      showToast(
        "Pobieranie raportu PDF",
        "Generowanie oficjalnego certyfikowanego raportu audytu WCAG 2.1 AA (Portal_Informacyjny_Audyt_Q1.pdf)..."
      );
    }
  };

  const handleDownloadDoc = () => {
    if (showToast) {
      showToast(
        "Pobieranie raportu Word (.docx)",
        "Generowanie w pełni edytowalnego dokumentu raportu Microsoft Word (.docx) z tabelami błędów i rekomendacjami..."
      );
    }
  };

  const handleTriggerReaudit = () => {
    if (onOpenReaudit) {
      onOpenReaudit(
        "Portal informacyjny - wybrane podstrony",
        "Audyt WCAG 2.1 AA",
        "Piotr Smułkowski"
      );
    }
  };

  return (
    <div data-testid="report-summary-view" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden">
      <ViewHeader
        breadcrumbs={[
          { label: "Pulpit", onClick: () => setView("przeglad") },
          { label: "Audyty", onClick: () => setView("raporty") },
          { label: "Portal informacyjny (wybrane podstrony)" },
        ]}
        badges={
          <Badge variant="success">
            <CheckCircle2 size={13} className="shrink-0" /> Zakończony
          </Badge>
        }
        title="Portal informacyjny - wybrane podstrony"
        subtitle="Raport z badania dostępności cyfrowej WCAG 2.1 AA • Cykl Q1 2026"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setView("raporty")}
              className="flex justify-center items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
            >
              <ArrowLeft size={14} /> <span>Wróć</span>
            </button>
            <button
              onClick={handleDownloadDoc}
              className="flex justify-center items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
              title="Pobierz edytowalny raport w formacie Microsoft Word (.docx)"
            >
              <FileCode size={14} className="text-blue-600" /> <span>Pobierz Word (.doc)</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex justify-center items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
              title="Pobierz oficjalny raport w formacie PDF"
            >
              <Download size={14} className="text-red-500" /> <span>Pobierz PDF</span>
            </button>
            <ReauditButton
              onClick={handleTriggerReaudit}
              variant="primary"
            />
          </div>
        }
      />

      <div className="flex-1 md:overflow-y-auto bg-[#f8fafc] w-full">
        <div className="max-w-[1600px] mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-5">

          {/* KARTA PODSUMOWANIA WYKONAWCZEGO I METADANYCH AUDYTU */}
          <Card className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            {/* Zintegrowany pasek metadanych audytu */}
            <div className="bg-slate-50/80 border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#0038F8]" />
                  <span>01.03.2026 - 12.03.2026</span>
                </div>
                <div className="w-px h-3.5 bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-[#0038F8]" />
                  <span>Audytor: <strong className="text-slate-800 font-bold">Piotr Smułkowski</strong></span>
                </div>
                <div className="w-px h-3.5 bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#0038F8]" />
                  <span>Standard: <strong className="text-slate-800 font-bold">WCAG 2.1 Poziom AA</strong></span>
                </div>
                <div className="w-px h-3.5 bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span>Cykl: <strong>Q1 2026</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>Audyt zatwierdzony</span>
                </span>
              </div>
            </div>

            {/* Treść podsumowania audytora na czystym białym tle */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0038F8]/10 text-[#0038F8] flex items-center justify-center shrink-0">
                  <FileText size={15} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Wnioski i podsumowanie wykonawcze audytora
                </h3>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed pl-1 sm:pl-9 font-normal">
                Audyt obejmował kluczowe ścieżki użytkownika na stronie głównej oraz w formularzach kontaktowych. Zidentyfikowano głównie problemy związane z niewystarczającym kontrastem elementów interaktywnych oraz brakiem odpowiednich etykiet dla czytników ekranu w procesie logowania. Mimo relatywnie wysokiego ogólnego wyniku dostępności (77.5%), wdrożenie rekomendacji dla 3 błędów priorytetowych (tzw. blokerów) jest bezwzględnie wymagane do spełnienia normy ustawowej.
              </p>
            </div>
          </Card>

          {/* RZĄD 5 KART KPI - ZGODNOŚĆ + WSZYSTKIE 3 WAGI BŁĘDÓW + KRYTERIA (PEŁEN KONTRAST WCAG AA) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* 1. Dostępność */}
            <Card className="p-3.5 sm:p-4 hover:border-[#0038F8]/30 transition-all flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/80">
                <CheckCircle2 size={22} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
                  Dostępność
                </span>
                <span className="text-2xl font-black text-slate-900 leading-tight">
                  77.5%
                </span>
                <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">
                  Średnia zgodność
                </span>
              </div>
            </Card>

            {/* 2. Priorytetowe */}
            <Card className="p-3.5 sm:p-4 hover:border-red-300 transition-all flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 border border-red-200/80">
                <AlertOctagon size={22} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
                  Priorytetowe
                </span>
                <span className="text-2xl font-black text-red-700 leading-tight">
                  3
                </span>
                <span className="text-[11px] font-bold text-red-700 block mt-0.5">
                  Wymaga akcji
                </span>
              </div>
            </Card>

            {/* 3. Ważne */}
            <Card className="p-3.5 sm:p-4 hover:border-amber-300 transition-all flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200/80">
                <AlertTriangle size={22} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
                  Ważne
                </span>
                <span className="text-2xl font-black text-amber-800 leading-tight">
                  1
                </span>
                <span className="text-[11px] font-bold text-amber-800 block mt-0.5">
                  Do planu
                </span>
              </div>
            </Card>

            {/* 4. Marginalne */}
            <Card className="p-3.5 sm:p-4 hover:border-blue-300 transition-all flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/80">
                <Info size={22} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
                  Marginalne
                </span>
                <span className="text-2xl font-black text-blue-700 leading-tight">
                  3
                </span>
                <span className="text-[11px] font-bold text-blue-700 block mt-0.5">
                  Niski wpływ
                </span>
              </div>
            </Card>

            {/* 5. Złamane kryteria */}
            <Card className="p-3.5 sm:p-4 hover:border-[#0038F8]/30 transition-all flex items-center gap-3.5 col-span-2 sm:col-span-1">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200/80">
                <ListChecks size={22} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
                  Złamane kryteria
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 leading-tight">
                    11
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    / 49
                  </span>
                </div>
                <span className="text-[11px] font-bold text-indigo-700 block mt-0.5">
                  Kryteria WCAG 2.1
                </span>
              </div>
            </Card>
          </div>

          {/* HISTORIA I REAUDYTY (BIAŁA KARTA ZAMIAST NIEBIESKIEGO TŁA) */}
          <Card className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History size={18} className="text-[#0038F8]" />
                <h2 className="text-[15px] sm:text-base font-bold text-slate-900">
                  Historia i Reaudyty ({reauditsList.length})
                </h2>
              </div>
              <ReauditButton
                onClick={handleTriggerReaudit}
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex text-xs py-1.5 px-3"
              />
            </div>

            <div className="flex flex-col gap-2.5">
          {reauditsList.map((reaudit) => (
            <div
              key={reaudit.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 hover:border-[#0038F8]/30 rounded-xl p-3 sm:p-3.5 transition-all cursor-pointer gap-4 group"
              onClick={() => setView("raport-szczegoly")}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-[240px]">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0038F8] group-hover:bg-[#0038F8] group-hover:text-white transition-colors flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck size={17} />
                </div>
                <div className="min-w-0 pr-3">
                  <div className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-[#0038F8] transition-colors truncate">
                    {reaudit.name}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar size={11} /> {reaudit.date}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <User size={11} /> {reaudit.auditor}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto mt-2 sm:mt-0 pt-2.5 sm:pt-0 border-t border-slate-200/60 sm:border-none">
                <div className="flex flex-col hidden sm:flex shrink-0 items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-0.5">
                    Złamane Kryt.
                  </span>
                  <span className="text-[15px] font-extrabold text-slate-800 text-center">
                    {reaudit.brokenCriteria}
                  </span>
                </div>

                <div className="hidden sm:flex shrink-0 items-center justify-center">
                  <Badge
                    variant={
                      reaudit.status === "Zakończony" ? "success" : "warning"
                    }
                    className="!py-0.5 !px-2.5 !text-[11px] w-max font-bold"
                  >
                    {reaudit.status}
                  </Badge>
                </div>

                <div className="flex shrink-0 items-center justify-end">
                  <div className="flex items-center gap-2.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    <div
                      className="relative group/tip flex items-center gap-1.5 border-r border-slate-200 pr-2.5 cursor-help"
                      title={`Błędy priorytetowe: ${reaudit.criticalErrors}`}
                    >
                      <AlertOctagon size={13} className={reaudit.criticalErrors > 0 ? "text-red-700" : "text-slate-500"} />
                      <span className={`text-[14px] font-black ${reaudit.criticalErrors > 0 ? "text-red-700" : "text-slate-600"}`}>
                        {reaudit.criticalErrors}
                      </span>
                      <div
                        role="tooltip"
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                      >
                        Błędy priorytetowe: {reaudit.criticalErrors}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden sm:block">
                        Zgodność:
                      </span>
                      <span
                        className={`text-[14px] font-black ${
                          reaudit.score >= 80
                            ? "text-emerald-700"
                            : "text-amber-800"
                        }`}
                      >
                        {reaudit.score}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-8 flex justify-end shrink-0 hidden sm:flex">
                  <ChevronRight size={18} className="text-slate-500 group-hover:text-[#0038F8] transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <ReauditButton
          onClick={handleTriggerReaudit}
          variant="secondary"
          fullWidth
          className="mt-4 flex sm:hidden"
        />
      </Card>

      {/* Przetestowane Elementy - Widok tabelaryczny z czytelnym podziałem na wagi błędów */}
      {(() => {
        const testedElements = [
          {
            id: 1,
            title: "Strona główna",
            priorities: 1,
            warnings: 1,
            marginals: 2,
            channel: "WWW",
          },
          {
            id: 2,
            title: 'Podstrona "konta"',
            priorities: 2,
            warnings: 0,
            marginals: 1,
            channel: "Aplikacja",
          },
          {
            id: 3,
            title: 'Podstrona "karty"',
            priorities: 0,
            warnings: 0,
            marginals: 0,
            channel: "Dokumenty",
          },
        ];

        const totalPriorities = testedElements.reduce((acc, el) => acc + el.priorities, 0);
        const totalWarnings = testedElements.reduce((acc, el) => acc + el.warnings, 0);
        const totalMarginals = testedElements.reduce((acc, el) => acc + el.marginals, 0);

        return (
          <Card className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-xs" data-testid="tested-elements-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[16px] sm:text-[18px] font-bold text-slate-900">
                    Przetestowane Elementy
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {testedElements.length}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Wykaz zbadanych podstron i widoków z podziałem błędów według poziomu krytyczności
                </p>
              </div>

              {/* Legenda i łączne podsumowanie wag błędów z pełnym kontrastem WCAG AA */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto bg-slate-50 border border-slate-200 p-1.5 px-3 rounded-xl text-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mr-1 hidden sm:inline">
                  Łącznie błędów:
                </span>
                {/* Priorytetowe */}
                <div className="relative group/tip flex items-center">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs cursor-help"
                    title={`Błędy priorytetowe: ${totalPriorities}`}
                  >
                    <AlertOctagon size={13} className="text-red-700 shrink-0" />
                    <span>{totalPriorities}</span>
                    <span className="font-bold text-red-700 text-[11px] hidden sm:inline">priorytetowe</span>
                  </div>
                  <div
                    role="tooltip"
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                  >
                    Błędy priorytetowe: {totalPriorities}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>

                {/* Ważne */}
                <div className="relative group/tip flex items-center">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs cursor-help"
                    title={`Błędy ważne: ${totalWarnings}`}
                  >
                    <AlertTriangle size={13} className="text-amber-800 shrink-0" />
                    <span>{totalWarnings}</span>
                    <span className="font-bold text-amber-800 text-[11px] hidden sm:inline">ważny</span>
                  </div>
                  <div
                    role="tooltip"
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                  >
                    Błędy ważne: {totalWarnings}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>

                {/* Marginalne */}
                <div className="relative group/tip flex items-center">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs cursor-help"
                    title={`Błędy marginalne: ${totalMarginals}`}
                  >
                    <Info size={13} className="text-blue-700 shrink-0" />
                    <span>{totalMarginals}</span>
                    <span className="font-bold text-blue-700 text-[11px] hidden sm:inline">marginalne</span>
                  </div>
                  <div
                    role="tooltip"
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                  >
                    Błędy marginalne: {totalMarginals}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela elementów */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 w-[36%]">Przetestowany element / ekran</th>
                    <th className="px-3 py-3.5 text-center w-[14%]">
                      <div className="inline-flex items-center gap-1.5 text-red-700" title="Błędy o najwyższym priorytecie – blokery dostępności">
                        <AlertOctagon size={13} className="text-red-700 shrink-0" />
                        <span>Priorytetowe</span>
                      </div>
                    </th>
                    <th className="px-3 py-3.5 text-center w-[14%]">
                      <div className="inline-flex items-center gap-1.5 text-amber-800" title="Błędy o znaczącym wpływie na dostępność">
                        <AlertTriangle size={13} className="text-amber-800 shrink-0" />
                        <span>Ważne</span>
                      </div>
                    </th>
                    <th className="px-3 py-3.5 text-center w-[14%]">
                      <div className="inline-flex items-center gap-1.5 text-blue-700" title="Drobne uchybienia o charakterze marginalnym">
                        <Info size={13} className="text-blue-700 shrink-0" />
                        <span>Marginalne</span>
                      </div>
                    </th>
                    <th className="px-4 py-3.5 w-[11%]">Kanał</th>
                    <th className="px-5 py-3.5 text-right w-[11%]">Raport</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {testedElements.map((item) => (
                    <tr
                      key={item.id}
                      data-testid="tested-element-item"
                      onClick={() => setView("raport-bledy")}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setView("raport-bledy");
                        }
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 bg-slate-100 group-hover:bg-[#0038F8]/10 group-hover:text-[#0038F8] rounded-xl flex items-center justify-center text-slate-600 transition-colors shrink-0">
                            <Layout size={18} />
                          </div>
                          <span className="font-bold text-slate-800 text-[14px] group-hover:text-[#0038F8] transition-colors">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      {/* Priorytetowe */}
                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        <div className="relative group/tip inline-flex items-center justify-center">
                          {item.priorities > 0 ? (
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200/80 shadow-2xs cursor-help"
                              title={`Błędy priorytetowe: ${item.priorities}`}
                            >
                              <AlertOctagon size={13} className="text-red-700 shrink-0" />
                              <span>{item.priorities}</span>
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 cursor-help"
                              title="Brak błędów priorytetowych (0)"
                            >
                              0
                            </span>
                          )}
                          <div
                            role="tooltip"
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                          >
                            Błędy priorytetowe: {item.priorities}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                          </div>
                        </div>
                      </td>

                      {/* Ważne */}
                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        <div className="relative group/tip inline-flex items-center justify-center">
                          {item.warnings > 0 ? (
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs cursor-help"
                              title={`Błędy ważne: ${item.warnings}`}
                            >
                              <AlertTriangle size={13} className="text-amber-800 shrink-0" />
                              <span>{item.warnings}</span>
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 cursor-help"
                              title="Brak błędów ważnych (0)"
                            >
                              0
                            </span>
                          )}
                          <div
                            role="tooltip"
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                          >
                            Błędy ważne: {item.warnings}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                          </div>
                        </div>
                      </td>

                      {/* Marginalne */}
                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        <div className="relative group/tip inline-flex items-center justify-center">
                          {item.marginals > 0 ? (
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs cursor-help"
                              title={`Błędy marginalne: ${item.marginals}`}
                            >
                              <Info size={13} className="text-blue-700 shrink-0" />
                              <span>{item.marginals}</span>
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 cursor-help"
                              title="Brak błędów marginalnych (0)"
                            >
                              0
                            </span>
                          )}
                          <div
                            role="tooltip"
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                          >
                            Błędy marginalne: {item.marginals}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                          {getChannelIcon(item.channel)}
                          <span>{item.channel}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setView("raport-bledy");
                          }}
                          className="inline-flex items-center justify-center gap-1.5 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer"
                          title={`Zobacz raport błędów: ${item.title}`}
                        >
                          <span>Raport</span>
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })()}
        </div>
      </div>
    </div>
  );
}

function TestedElementItem({
  title,
  priorities,
  warnings,
  marginals = 0,
  channel,
  onReportClick,
}) {
  return (
    <div
      data-testid="tested-element-item"
      className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4 sm:gap-0"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
          <Layout size={18} />
        </div>
        <span className="font-bold text-slate-800 text-[15px] truncate">
          {title}
        </span>
      </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end flex-shrink-0 border-t border-slate-100 sm:border-none pt-3 sm:pt-0 w-full sm:w-auto">
          <div className="flex items-center gap-1 sm:gap-0 sm:pr-4 w-32 sm:w-40 justify-center">
            {/* Priorytetowe */}
            <div
              className="relative group/tip flex items-center gap-1.5 w-10 sm:w-12 shrink-0 justify-center cursor-help py-0.5"
              title={`Błędy priorytetowe: ${priorities}`}
            >
              <AlertOctagon
                size={16}
                className={priorities > 0 ? "text-red-700" : "text-slate-500"}
              />
              <span
                className={`font-bold text-sm ${
                  priorities > 0 ? "text-red-700" : "text-slate-600"
                }`}
              >
                {priorities}
              </span>
              <div
                role="tooltip"
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
              >
                Błędy priorytetowe: {priorities}
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>

            {/* Ważne */}
            <div
              className="relative group/tip flex items-center gap-1.5 w-10 sm:w-12 shrink-0 justify-center cursor-help py-0.5"
              title={`Błędy ważne: ${warnings}`}
            >
              <AlertTriangle
                size={16}
                className={warnings > 0 ? "text-amber-800" : "text-slate-500"}
              />
              <span
                className={`font-bold text-sm ${
                  warnings > 0 ? "text-amber-800" : "text-slate-600"
                }`}
              >
                {warnings}
              </span>
              <div
                role="tooltip"
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
              >
                Błędy ważne: {warnings}
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>

            {/* Marginalne */}
            <div
              className="relative group/tip flex items-center gap-1.5 w-10 sm:w-12 shrink-0 justify-center cursor-help py-0.5"
              title={`Błędy marginalne: ${marginals}`}
            >
              <Info
                size={16}
                className={marginals > 0 ? "text-blue-700" : "text-slate-500"}
              />
              <span
                className={`font-bold text-sm ${
                  marginals > 0 ? "text-blue-700" : "text-slate-600"
                }`}
              >
                {marginals}
              </span>
              <div
                role="tooltip"
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
              >
                Błędy marginalne: {marginals}
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          </div>

        <div className="flex items-center gap-2 sm:border-l border-slate-200 sm:pl-6 w-auto sm:w-32 shrink-0 justify-start sm:justify-start">
          {channel && (
            <>
              {getChannelIcon(channel)}
              <span className="text-[12px] sm:text-[13px] font-medium text-slate-500 whitespace-nowrap">
                {channel}
              </span>
            </>
          )}
        </div>

        <div className="w-full sm:w-[130px] shrink-0 mt-3 sm:mt-0 flex justify-end ml-2">
          <button
            onClick={onReportClick}
            className="flex justify-center items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm w-full"
          >
            Raport <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportErrorsView({
  setView,
  onOpenReaudit,
  tickets = [],
  onOpenTicket,
  onOpenNewTicket,
  showToast,
  developerFilter = null,
  setDeveloperFilter = null,
  onOpenProfile,
}: {
  setView: (v: string) => void;
  onOpenReaudit?: (title?: string, type?: string, auditor?: string) => void;
  tickets?: any[];
  onOpenTicket?: (id: string) => void;
  onOpenNewTicket?: (ctx?: any) => void;
  showToast?: (t: string, b: string, type?: string) => void;
  developerFilter?: string | null;
  setDeveloperFilter?: any;
  onOpenProfile?: (tab?: "branding" | "team" | "wcag" | "account" | "notifications") => void;
}) {
  const allErrors = [
    {
      id: "ERR-204",
      title: "Kontrast indykatora w formularzu przelewu (aktywny stan checkboxa)",
      subtext: "1.4.11 Kontrast elementów nietekstowych (WCAG 2.1 / 2.2 AA)",
      initialExpanded: true,
      initialStatus: "W pracach Dev",
      initialDevTeam: "Zespół Bankowości Internetowej (Frontend)",
      assignedDeveloper: "Marek Kowalski",
      initialJiraUrl: "https://jira.bank.pl/browse/FE-1082",
    },
    {
      id: "#001",
      title: "Brak alternatywy tekstowej dla obrazka promocyjnego.",
      subtext: "1.1.1 Treść nietekstowa, 1.4.3 Kontrast",
      initialExpanded: false,
      initialStatus: "W pracach Dev",
      initialDevTeam: "Zespół Bankowości Internetowej (Frontend)",
      assignedDeveloper: "Marek Kowalski",
      initialJiraUrl: "https://jira.bank.pl/browse/FE-1082",
    },
    {
      id: "#002",
      title: "Zbyt niski kontrast tekstu w stopce.",
      subtext: "1.4.3 Kontrast (Minimalny)",
      initialExpanded: false,
      initialStatus: "Poprawione (do re-audytu)",
      initialDevTeam: "Zespół Aplikacji Mobilnych (iOS)",
      assignedDeveloper: "Aleksandra Nowak",
      initialJiraUrl: "https://jira.bank.pl/browse/FE-1044",
    },
    {
      id: "#003",
      title: "Brak widocznego fokusa na przycisku zatwierdzenia",
      subtext: "2.4.7 Widoczny fokus",
      initialExpanded: false,
      initialStatus: "Do naprawy",
      initialDevTeam: "Zespół Aplikacji Mobilnych (Android)",
      assignedDeveloper: "Paweł Wiśniewski",
      initialJiraUrl: "",
    },
  ];

  const displayedErrors = developerFilter
    ? allErrors.filter((e) => e.assignedDeveloper === developerFilter)
    : allErrors;

  return (
    <div data-testid="report-errors-view" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden">
      <ViewHeader
        breadcrumbs={[
          { label: "Pulpit", onClick: () => setView("przeglad") },
          { label: "Audyty", onClick: () => setView("raporty") },
          { label: "Portal informacyjny", onClick: () => setView("raport-szczegoly") },
          { label: developerFilter ? `Błędy dewelopera: ${developerFilter}` : 'Błędy: Podstrona "konta"' },
        ]}
        badges={
          <div className="flex items-center gap-2">
            <Badge variant="neutral">
              <User size={13} className="text-slate-400 shrink-0" /> Piotr Smułkowski
            </Badge>
            {developerFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-blue-50 text-[#0038F8] border border-blue-200">
                <Users size={13} /> {developerFilter}
              </span>
            )}
          </div>
        }
        title={developerFilter ? `Błędy przypisane: ${developerFilter}` : 'Edytor elementu: Podstrona "konta"'}
        subtitle={
          developerFilter
            ? `Lista otwartych barier dostępności i zadań naprawczych przypisanych do dewelopera ${developerFilter}.`
            : "Zidentyfikowane błędy i niezgodności ze standardem WCAG 2.1 AA na wybranej podstronie."
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                if (developerFilter) {
                  setDeveloperFilter && setDeveloperFilter(null);
                  if (onOpenProfile) onOpenProfile("team");
                  else setView("profil");
                } else {
                  setView("raport-szczegoly");
                }
              }}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
            >
              <ArrowLeft size={14} /> <span>{developerFilter ? "Wróć do Zespołu" : "Wróć"}</span>
            </button>
            <button
              onClick={() =>
                showToast &&
                showToast(
                  "Eksport błędów (.xlsx)",
                  'Wygenerowano arkusz Excel (.xlsx) zawierający listę błędów z podstrony "konta" wraz z przypisanymi zadaniami Jira oraz zespołami Dev.'
                )
              }
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
              title="Eksportuj listę błędów do pliku Excel"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>Eksport (.xlsx)</span>
            </button>
            <ReauditButton
              onClick={() =>
                onOpenReaudit &&
                onOpenReaudit(
                  'Podstrona "konta" (Portal informacyjny)',
                  "Audyt WCAG 2.1 AA",
                  "Piotr Smułkowski"
                )
              }
              variant="primary"
            />
            <div className="flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg gap-2 text-xs font-bold">
              <span className="text-slate-400">KANAŁ: <span className="text-slate-700 font-extrabold">WWW</span></span>
              <span className="text-slate-300">|</span>
              <span className="text-red-600 font-extrabold">WYNIKI: {displayedErrors.length}</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-extrabold">89%</span>
            </div>
          </div>
        }
      />

      <div className="flex-1 md:overflow-y-auto bg-[#f8fafc] w-full">
        <div className="max-w-[1600px] mx-auto w-full p-4 sm:p-8 lg:p-12 flex flex-col gap-6">

          {/* BANER ODFILTROWANIA DLA DEWELOPERA */}
          {developerFilter && (
            <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-200 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0038F8] flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      Odfiltrowano błędy dla dewelopera: <strong className="text-[#0038F8]">{developerFilter}</strong>
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-[#0038F8]">
                      {displayedErrors.length} otwartych zadań
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Wyświetlasz wyłącznie błędy przypisane do tego członka Twojego zespołu.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeveloperFilter && setDeveloperFilter(null)}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <X size={14} className="text-slate-400" />
                <span>Wyczyść filtr (pokaż wszystkie)</span>
              </button>
            </div>
          )}

          <Card className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Numer, problem lub rekomendacja
            </label>
            <Input
              icon={Search}
              placeholder="Wpisz frazę..."
              className="w-full bg-slate-50"
            />
          </div>
          <div className="w-full lg:w-[220px] shrink-0">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Priorytet
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 transition-shadow appearance-none">
              <option value="">Wszystkie priorytety</option>
              <option value="priorytetowy">🚨 Priorytetowe (Blokery)</option>
              <option value="wazny">🟠 Ważne</option>
              <option value="marginalny">🔵 Marginalne</option>
            </select>
          </div>
          <div className="w-full lg:w-[280px] shrink-0">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Kryterium WCAG
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 transition-shadow appearance-none">
              <option value="">Wszystkie kryteria</option>
              <option value="1.1.1">1.1.1 Treść nietekstowa</option>
              <option value="1.4.3">1.4.3 Kontrast (Minimalny)</option>
              <option value="1.4.11">1.4.11 Kontrast elementów nietekstowych</option>
              <option value="2.4.7">2.4.7 Widoczny fokus</option>
              <option value="3.3.2">3.3.2 Etykiety lub instrukcje</option>
            </select>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0 shrink-0">
            <button className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-3 rounded-xl font-bold shadow-sm transition-colors text-sm">
              Szukaj
            </button>
            <button
              className="flex justify-center items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-5 py-3 rounded-xl font-bold transition-colors text-sm shrink-0 shadow-sm"
              title="Wyczyść filtry"
            >
              <X size={16} className="text-slate-400" />
              <span className="hidden sm:inline">Wyczyść</span>
            </button>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-[16px] sm:text-lg font-bold text-slate-900">
            Zgłoszone błędy ({displayedErrors.length})
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            Znaleziono: {displayedErrors.length} błędy
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4">
          {displayedErrors.map((err) => (
            <ErrorAccordionItem
              key={err.id}
              id={err.id}
              title={err.title}
              subtext={err.subtext}
              initialExpanded={err.initialExpanded}
              initialStatus={err.initialStatus}
              initialDevTeam={err.initialDevTeam}
              assignedDeveloper={err.assignedDeveloper}
              initialJiraUrl={err.initialJiraUrl}
              onOpenReaudit={onOpenReaudit}
              tickets={tickets}
              onOpenTicket={onOpenTicket}
              onOpenNewTicket={onOpenNewTicket}
              showToast={showToast}
            />
          ))}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}

function ErrorAccordionItem({
  id,
  title,
  subtext,
  initialExpanded = false,
  initialStatus = "Do naprawy",
  initialDevTeam = DEV_TEAMS_LIST[0],
  assignedDeveloper = "",
  initialJiraUrl = "",
  onOpenReaudit,
  tickets = [],
  onOpenTicket,
  onOpenNewTicket,
  showToast,
}) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [remediationStatus, setRemediationStatus] = useState(initialStatus);
  const [devTeam, setDevTeam] = useState(initialDevTeam);
  const [jiraUrl, setJiraUrl] = useState(initialJiraUrl);

  const cleanId = (id || "").replace(/^#/, "").trim();
  const linkedTicket = (tickets || []).find(
    (t) =>
      t.contextId === cleanId ||
      t.contextId === id ||
      (t.contextTitle && t.contextTitle.toLowerCase().includes(cleanId.toLowerCase()))
  );

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const handleSaveStatus = (e) => {
    e.stopPropagation();
    if (showToast) {
      const ticketInfo = jiraUrl ? ` oraz zadanie w Jira: "${jiraUrl.replace(/https?:\/\/[^/]+\/browse\//, "")}"` : "";
      showToast(
        "Zapisano status błędu",
        `Błąd ${id}: Zaktualizowano status na "${remediationStatus}", przypisano zespół: ${devTeam}${ticketInfo}.`
      );
    }
  };

  const handleReauditError = (e) => {
    e.stopPropagation();
    if (onOpenReaudit) {
      onOpenReaudit(
        `Błąd ${id}: ${title}`,
        "Weryfikacja błędu WCAG",
        "Piotr Smułkowski"
      );
    }
  };

  return (
    <Card
      data-testid="error-accordion-item"
      className={`overflow-hidden transition-all duration-300 ${
        isExpanded
          ? "border-[#0038F8]/30 shadow-xs ring-1 ring-[#0038F8]/10"
          : "hover:border-slate-300"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(e);
          }
        }}
        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer bg-white gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0038F8] focus-visible:ring-inset"
        onClick={handleToggle}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
            {id}
          </span>
          <div className="flex flex-col pr-4 sm:pr-0">
            <span className="font-bold text-slate-900 text-[14px] sm:text-[16px] mb-1 leading-snug">
              {title}
            </span>
            <span className="text-[11px] sm:text-sm text-slate-600 font-medium">
              {subtext}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-5 border-t border-slate-100 sm:border-none pt-3 sm:pt-0 mt-1 sm:mt-0 flex-wrap">
          {/* Status pill for coordinator */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              remediationStatus === "Poprawione (do re-audytu)"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : remediationStatus === "Zweryfikowane OK"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : remediationStatus === "W pracach Dev"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            <Code2 size={12} className="shrink-0" />
            <span>{remediationStatus}</span>
          </span>

          {/* Przypisany deweloper */}
          {assignedDeveloper && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <User size={12} className="text-[#0038F8]" />
              <span>{assignedDeveloper}</span>
            </span>
          )}

          {/* Ticket badge on error header */}
          {linkedTicket ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenTicket) onOpenTicket(linkedTicket.id);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                linkedTicket.unreadByClient
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/30 animate-pulse"
                  : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              }`}
              title="Otwórz wątek konsultacji z audytorem dla tego błędu"
            >
              <MessageSquareText size={12} className={linkedTicket.unreadByClient ? "text-emerald-700" : "text-purple-700"} />
              <span>Konsultacja #{linkedTicket.id} {linkedTicket.unreadByClient ? "• Nowa odp." : ""}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenNewTicket) onOpenNewTicket({ type: "error", id, title });
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors cursor-pointer"
              title="Zadaj pytanie audytorowi WCAG w sprawie tego błędu (konsultacja)"
            >
              <MessageSquareText size={12} className="text-slate-600" />
              <span>Konsultuj z audytorem</span>
            </button>
          )}

          {/* Jira badge on error header */}
          {jiraUrl && (
            <a
              href={jiraUrl.startsWith("http") ? jiraUrl : `https://jira.bank.pl/browse/${jiraUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
              title="Otwórz zgłoszenie błędu w Jira (nowa karta)"
            >
              <ExternalLink size={12} className="text-blue-700 shrink-0" />
              <span>Jira: {jiraUrl.replace(/https?:\/\/[^/]+\/browse\//, "")}</span>
            </a>
          )}

          <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded-md">
            Priorytetowy
          </span>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isExpanded
                ? "bg-[#0038F8]/10 text-[#0038F8]"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 sm:p-6 pt-2 bg-white flex flex-col gap-4 border-t border-slate-100 mt-2">
          {/* PANEL KOORDYNATORA DOSTĘPNOŚCI DLA TEGO BŁĘDU */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-[#0038F8]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Panel Koordynatora: Zarządzanie wdrożeniem i zespołem Dev
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-slate-600">
                Ostatnia modyfikacja: dzisiaj
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Status naprawy błędu:
                </label>
                <select
                  value={remediationStatus}
                  onChange={(e) => setRemediationStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
                >
                  <option value="Do naprawy">🔴 Do naprawy (Otwarte)</option>
                  <option value="W pracach Dev">🔵 W pracach zespołu Dev</option>
                  <option value="Poprawione (do re-audytu)">🟣 Poprawione (Gotowe do re-audytu)</option>
                  <option value="Zweryfikowane OK">🟢 Zweryfikowane pozytywnie</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Przypisany zespół deweloperski:
                </label>
                <select
                  value={devTeam}
                  onChange={(e) => setDevTeam(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
                >
                  {DEV_TEAMS_LIST.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Link2 size={13} className="text-[#0038F8]" />
                    <span>Zadanie w Jira (link / klucz):</span>
                  </span>
                  {jiraUrl && (
                    <a
                      href={jiraUrl.startsWith("http") ? jiraUrl : `https://jira.bank.pl/browse/${jiraUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#0038F8] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink size={11} /> Otwórz
                    </a>
                  )}
                </label>
                <div className="relative">
                  <Link2 size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={jiraUrl}
                    onChange={(e) => setJiraUrl(e.target.value)}
                    placeholder="np. https://jira.bank.pl/browse/FE-1082 lub FE-1082"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Info size={13} className="text-[#0038F8] shrink-0" />
                <span>Przypisz zadanie Jira, by po miesiącu zweryfikować poprawkę z zespołem Dev i skierować błąd do re-audytu.</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  className="bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} /> <span>Zapisz zmiany</span>
                </button>
                <ReauditButton
                  onClick={handleReauditError}
                  variant="secondary"
                  size="sm"
                  title="Zleć formalny re-audyt dla tego błędu"
                />
              </div>
            </div>
          </div>

          {/* WĄTEK KONSULTACJI Z AUDYTOREM DLA TEGO BŁĘDU */}
          <div className={`p-4 rounded-xl border transition-all ${
            linkedTicket?.unreadByClient
              ? "bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-white border-emerald-200 shadow-2xs"
              : "bg-slate-50/70 border-slate-200/90"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  linkedTicket?.unreadByClient
                    ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300"
                    : "bg-blue-100 text-[#0038F8]"
                }`}>
                  <MessageSquareText size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      Konsultacja z audytorem WCAG
                    </span>
                    {linkedTicket ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        linkedTicket.status === "auditor_reply"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>
                        #{linkedTicket.id}: {linkedTicket.statusLabel}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Brak aktywnego wątku
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {linkedTicket ? (
                      <span>
                        Ostatnia wypowiedź ({linkedTicket.assignedAuditor?.name}): "{linkedTicket.messages[linkedTicket.messages.length - 1]?.content.slice(0, 110)}..."
                      </span>
                    ) : (
                      <span>
                        Masz wątpliwości co do interpretacji wytycznej WCAG lub propozycji fixu od deweloperów? Rozpocznij konsultację i zapytaj audytora bez umawiania spotkania.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-auto">
                {linkedTicket ? (
                  <button
                    type="button"
                    onClick={() => onOpenTicket && onOpenTicket(linkedTicket.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Otwórz konsultację #{linkedTicket.id}</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenNewTicket && onOpenNewTicket({ type: "error", id, title })}
                    className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={13} className="text-emerald-600" />
                    <span>Zadaj pytanie audytorowi</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 sm:mb-3">
              Opis problemu
            </h3>
            <p className="text-[12px] sm:text-sm text-slate-600 leading-relaxed">
              Etykieta pola "Zapisz" na stronie internetowej nie spełnia
              wymagań dotyczących kontrastu określonych w WCAG 2.1. Brak
              odpowiedniego kontrastu (co najmniej 4.5:1) między tekstem
              etykiety a tłem może prowadzić do trudności w odczycie tekstu
              przez osoby z deficytem wzroku. Osoby te mogą napotykać
              trudności w korzystaniu ze strony internetowej oraz w
              skutecznym wypełnianiu formularzy. Poprawienie kontrastu
              etykiety "Zapisz" jest niezbędne dla zapewnienia pełnej
              dostępności strony dla wszystkich użytkowników, niezależnie od
              ich umiejętności wzrokowych.
            </p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 sm:mb-3">
              Rekomendacja audytora
            </h3>
            <p className="text-[12px] sm:text-sm text-slate-600 leading-relaxed">
              Zaleca się weryfikację i zmianę koloru tła przycisku lub samego
              tekstu, tak aby stosunek kontrastu spełniał normy WCAG.
            </p>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={handleToggle}
              className="text-[#0038F8] hover:text-[#002ECC] font-bold text-[12px] flex items-center gap-1.5 bg-[#0038F8]/5 hover:bg-[#0038F8]/10 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronUp size={16} /> Zwiń szczegóły błędu
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

// ==========================================
// SEKCJE FILTRÓW I REGULACJI DLA MODUŁU RAPORTOWANIA
// ==========================================

// 1. Dedykowane filtry dla: Raporty z Audytów
function AuditsFilterSection({
  auditService,
  setAuditService,
  auditProcess,
  setAuditProcess,
  auditChannels,
  setAuditChannels,
  auditPriorities,
  setAuditPriorities,
  auditStatuses,
  setAuditStatuses,
  auditSources,
  setAuditSources,
  auditAuditor,
  setAuditAuditor,
  auditScoreRange,
  setAuditScoreRange,
  auditTimeRange,
  setAuditTimeRange,
  auditDateFrom,
  setAuditDateFrom,
  auditDateTo,
  setAuditDateTo,
  activeDropdown,
  toggleDropdown,
  clearAuditFilters,
  auditFiltersCount,
  hasActiveFilters,
  scopeSummaryText,
}) {
  return (
    <div
      data-testid="audits-filter-section"
      className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs relative z-30 mb-4"
    >
      <div
        className="flex flex-wrap items-center gap-2"
        data-reporting-dropdown="true"
      >
        <div className="w-24 shrink-0 flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          <Filter size={14} className="text-[#0038F8]" />
          <span>Filtry:</span>
        </div>

        {/* 1. Usługa / Proces */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("audit_usluga")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              auditService !== "all" || auditProcess !== "all"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>
              1. Usługa / Proces
              {auditService !== "all" ? `: ${auditService === "s1" ? "Płatności" : "Kredyt"}` : ""}
            </span>
            <ChevronDown size={14} className={auditService !== "all" || auditProcess !== "all" ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "audit_usluga" && (
            <div className="absolute top-full left-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3.5 space-y-3">
              <div>
                <label className="text-xs text-slate-600 mb-1.5 font-bold block">Usługa</label>
                <select
                  value={auditService}
                  onChange={(e) => setAuditService(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
                >
                  <option value="all">Wszystkie usługi</option>
                  <option value="s1">Usługi płatnicze i powiązane z rachunkiem</option>
                  <option value="s2">Kredyt hipoteczny</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 mb-1.5 font-bold block">Proces biznesowy</label>
                <select
                  value={auditProcess}
                  onChange={(e) => setAuditProcess(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
                >
                  <option value="all">Wszystkie procesy</option>
                  <option value="p1">Otwarcie ROR i autoryzacja</option>
                  <option value="p2">Przelew krajowy Elixir</option>
                  <option value="p3">Wniosek o kredyt hipoteczny</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 2. Kanał */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("audit_kanal")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              Object.values(auditChannels).some(Boolean)
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>
              2. Kanał
              {Object.values(auditChannels).filter(Boolean).length > 0 ? ` (${Object.values(auditChannels).filter(Boolean).length})` : ""}
            </span>
            <ChevronDown size={14} className={Object.values(auditChannels).some(Boolean) ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "audit_kanal" && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
              {["WWW", "Aplikacja", "Dokument"].map((ch) => {
                const isChecked = Boolean(auditChannels[ch]);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setAuditChannels((prev) => ({ ...prev, [ch]: !prev[ch] }))}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      isChecked ? "bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20 font-bold" : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={isChecked} readOnly className="w-4 h-4 rounded text-[#0038F8] pointer-events-none accent-[#0038F8]" />
                      <span>{ch === "Dokument" ? "Dokumenty / PDF" : ch}</span>
                    </div>
                    {isChecked && <CheckCircle2 size={14} className="text-[#0038F8]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Priorytet */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("audit_prio")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              Object.values(auditPriorities).some(Boolean)
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>
              3. Priorytet błędu
              {Object.values(auditPriorities).filter(Boolean).length > 0 ? ` (${Object.values(auditPriorities).filter(Boolean).length})` : ""}
            </span>
            <ChevronDown size={14} className={Object.values(auditPriorities).some(Boolean) ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "audit_prio" && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
              {[
                { id: "Priorytetowy", label: "Priorytetowy", icon: AlertOctagon, color: "text-red-500" },
                { id: "Ważny", label: "Ważny", icon: AlertTriangle, color: "text-amber-500" },
                { id: "Marginalny", label: "Marginalny", icon: Info, color: "text-blue-500" },
              ].map((p) => {
                const isChecked = Boolean(auditPriorities[p.id]);
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setAuditPriorities((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      isChecked ? "bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20 font-bold" : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={isChecked} readOnly className="w-4 h-4 rounded text-[#0038F8] pointer-events-none accent-[#0038F8]" />
                      <Icon size={14} className={p.color} />
                      <span>{p.label}</span>
                    </div>
                    {isChecked && <CheckCircle2 size={14} className="text-[#0038F8]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Status */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("audit_status")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              Object.values(auditStatuses).some(Boolean)
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>
              4. Status błędu
              {Object.values(auditStatuses).filter(Boolean).length > 0 ? ` (${Object.values(auditStatuses).filter(Boolean).length})` : ""}
            </span>
            <ChevronDown size={14} className={Object.values(auditStatuses).some(Boolean) ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "audit_status" && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
              {["Nowy", "W trakcie", "Gotowa rekomendacja", "Naprawiony"].map((st) => {
                const isChecked = Boolean(auditStatuses[st]);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setAuditStatuses((prev) => ({ ...prev, [st]: !prev[st] }))}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      isChecked ? "bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20 font-bold" : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={isChecked} readOnly className="w-4 h-4 rounded text-[#0038F8] pointer-events-none accent-[#0038F8]" />
                      <span>{st}</span>
                    </div>
                    {isChecked && <CheckCircle2 size={14} className="text-[#0038F8]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Źródło */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("audit_zrodlo")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              Object.values(auditSources).some(Boolean)
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>
              5. Źródło
              {Object.values(auditSources).filter(Boolean).length > 0 ? ` (${Object.values(auditSources).filter(Boolean).length})` : ""}
            </span>
            <ChevronDown size={14} className={Object.values(auditSources).some(Boolean) ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "audit_zrodlo" && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
              {["Audyt", "Reaudyt", "Zgłoszenie użytkownika", "Skarga"].map((src) => {
                const isChecked = Boolean(auditSources[src]);
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setAuditSources((prev) => ({ ...prev, [src]: !prev[src] }))}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      isChecked ? "bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20 font-bold" : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={isChecked} readOnly className="w-4 h-4 rounded text-[#0038F8] pointer-events-none accent-[#0038F8]" />
                      <span>{src}</span>
                    </div>
                    {isChecked && <CheckCircle2 size={14} className="text-[#0038F8]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Audytor i % */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("audit_audytor")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              auditAuditor || auditScoreRange !== "all"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>
              6. Audytor i %
              {auditAuditor ? `: ${auditAuditor.split(" ")[0]}` : auditScoreRange !== "all" ? `: ${auditScoreRange === "low" ? "< 70%" : auditScoreRange === "medium" ? "70-89%" : "90%+"}` : ""}
            </span>
            <ChevronDown size={14} className={auditAuditor || auditScoreRange !== "all" ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "audit_audytor" && (
            <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3.5 space-y-3">
              <div>
                <label className="text-xs text-slate-600 mb-1.5 font-bold block">Audytor</label>
                <select
                  value={auditAuditor}
                  onChange={(e) => setAuditAuditor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
                >
                  <option value="">Wszyscy audytorzy</option>
                  <option value="Piotr Smułkowski">Piotr Smułkowski</option>
                  <option value="Anna Nowak">Anna Nowak</option>
                  <option value="Jan Kowalski">Jan Kowalski</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 mb-1.5 font-bold block">Zakres % zgodności WCAG</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "all", label: "Wszystkie" },
                    { id: "low", label: "< 70%" },
                    { id: "medium", label: "70% - 89%" },
                    { id: "high", label: "90%+" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAuditScoreRange(item.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        auditScoreRange === item.id ? "bg-[#0038F8] text-white border-[#0038F8]" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 7. Czas */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("audit_czas")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              auditTimeRange !== "all" || auditDateFrom || auditDateTo
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>
              7. Czas
              {auditTimeRange !== "all" ? `: ${auditTimeRange === "30d" ? "30 dni" : auditTimeRange === "60d" ? "60 dni" : "1 Rok"}` : (auditDateFrom || auditDateTo) ? ": Zakres" : ""}
            </span>
            <ChevronDown size={14} className={auditTimeRange !== "all" || auditDateFrom || auditDateTo ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "audit_czas" && (
            <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3.5 space-y-3">
              <div>
                <div className="text-xs text-slate-600 mb-1.5 font-bold">Szybki wybór okresu</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "30d", label: "30 dni" },
                    { id: "60d", label: "60 dni" },
                    { id: "1y", label: "1 Rok" },
                    { id: "all", label: "Wszystkie" },
                  ].map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => {
                        setAuditTimeRange(tr.id);
                        setAuditDateFrom("");
                        setAuditDateTo("");
                      }}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border cursor-pointer ${
                        auditTimeRange === tr.id ? "bg-[#0038F8] text-white border-[#0038F8]" : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                      }`}
                    >
                      {tr.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-px bg-slate-100 my-1"></div>
              <div>
                <div className="text-xs text-slate-600 mb-1.5 font-bold">Dokładny zakres dat</div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={auditDateFrom}
                    onChange={(e) => {
                      setAuditDateFrom(e.target.value);
                      setAuditTimeRange("custom");
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="date"
                    value={auditDateTo}
                    onChange={(e) => {
                      setAuditDateTo(e.target.value);
                      setAuditTimeRange("custom");
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Przycisk: Wyczyść */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={clearAuditFilters}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-colors text-xs border shadow-sm ${
              hasActiveFilters
                ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 cursor-pointer"
                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
            }`}
            title={hasActiveFilters ? "Zresetuj wszystkie aktywne filtry" : "Brak aktywnych filtrów"}
          >
            <X size={12} className={hasActiveFilters ? "text-slate-500" : "text-slate-400"} />
            <span>Wyczyść</span>
          </button>
        </div>
      </div>

      {/* RZĄD CHIPÓW AKTYWNYCH FILTRÓW */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2.5 mt-2.5 border-t border-slate-200/80">
          <div className="w-24 shrink-0 flex items-center text-xs font-bold text-slate-500 whitespace-nowrap">
            <span>Wybrane filtry:</span>
          </div>

          {auditService !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Usługa: {auditService === "s1" ? "Płatności" : "Kredyt"}</span>
              <button type="button" onClick={() => setAuditService("all")} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}

          {auditProcess !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Proces: {auditProcess}</span>
              <button type="button" onClick={() => setAuditProcess("all")} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}

          {Object.keys(auditPriorities).filter((k) => auditPriorities[k]).map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Priorytet: {p}</span>
              <button type="button" onClick={() => setAuditPriorities((prev) => ({ ...prev, [p]: false }))} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          ))}

          {Object.keys(auditChannels).filter((k) => auditChannels[k]).map((ch) => (
            <span key={ch} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Kanał: {ch}</span>
              <button type="button" onClick={() => setAuditChannels((prev) => ({ ...prev, [ch]: false }))} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          ))}

          {Object.keys(auditStatuses).filter((k) => auditStatuses[k]).map((st) => (
            <span key={st} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Status: {st}</span>
              <button type="button" onClick={() => setAuditStatuses((prev) => ({ ...prev, [st]: false }))} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          ))}

          {auditAuditor && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Audytor: {auditAuditor}</span>
              <button type="button" onClick={() => setAuditAuditor("")} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}

          {auditTimeRange !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Okres: {auditTimeRange === "30d" ? "30 dni" : auditTimeRange === "60d" ? "60 dni" : "1 Rok"}</span>
              <button type="button" onClick={() => setAuditTimeRange("all")} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// 2. Dedykowane filtry dla: Dostępność Usług
function ServicesFilterSection({
  serviceFilter,
  setServiceFilter,
  serviceProcess,
  setServiceProcess,
  serviceChannel,
  setServiceChannel,
  serviceSla,
  setServiceSla,
  servicePeriod,
  setServicePeriod,
  activeDropdown,
  toggleDropdown,
  clearServiceFilters,
  serviceFiltersCount,
  hasActiveFilters,
  scopeSummaryText,
}) {
  return (
    <div
      data-testid="services-filter-section"
      className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs relative z-30 mb-4"
    >
      <div
        className="flex flex-wrap items-center gap-2"
        data-reporting-dropdown="true"
      >
        <div className="w-24 shrink-0 flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          <Filter size={14} className="text-[#0038F8]" />
          <span>Filtry:</span>
        </div>

        {/* 1. Usługa */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("srv_usluga")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              serviceFilter !== "all"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>1. Usługa{serviceFilter !== "all" ? `: ${serviceFilter === "s1" ? "Płatności" : "Kredyt"}` : ""}</span>
            <ChevronDown size={14} className={serviceFilter !== "all" ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "srv_usluga" && (
            <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
              {[
                { id: "all", label: "Wszystkie usługi (2)" },
                { id: "s1", label: "Usługi płatnicze i powiązane z rachunkiem" },
                { id: "s2", label: "Kredyt hipoteczny" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setServiceFilter(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    serviceFilter === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Proces */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("srv_proces")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              serviceProcess !== "all"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>2. Proces{serviceProcess !== "all" ? `: ${serviceProcess}` : ""}</span>
            <ChevronDown size={14} className={serviceProcess !== "all" ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "srv_proces" && (
            <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
              {[
                { id: "all", label: "Wszystkie procesy (14)" },
                { id: "Otwarcie konta", label: "Otwarcie ROR i autoryzacja" },
                { id: "Przelew Elixir", label: "Przelew krajowy Elixir" },
                { id: "Kredyt hipoteczny", label: "Wniosek o kredyt hipoteczny" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setServiceProcess(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    serviceProcess === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Kanał */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("srv_kanal")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              serviceChannel !== "all"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>3. Kanał{serviceChannel !== "all" ? `: ${serviceChannel}` : ""}</span>
            <ChevronDown size={14} className={serviceChannel !== "all" ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "srv_kanal" && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
              {[
                { id: "all", label: "Wszystkie kanały" },
                { id: "WWW", label: "Serwis WWW (Desktop)" },
                { id: "Mobile", label: "Aplikacja Mobilna" },
                { id: "Dokument", label: "Wzorce dokumentów / PDF" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setServiceChannel(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    serviceChannel === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Próg zgodności SLA */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("srv_sla")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              serviceSla !== "all"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>4. SLA{serviceSla !== "all" ? `: ${serviceSla === "under80" ? "< 80%" : ">= 80%"}` : ""}</span>
            <ChevronDown size={14} className={serviceSla !== "all" ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "srv_sla" && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
              {[
                { id: "all", label: "Wszystkie progi SLA" },
                { id: "under80", label: "Poniżej progu SLA (< 80%)" },
                { id: "over80", label: "Zgodne z normą SLA (>= 80%)" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setServiceSla(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    serviceSla === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. Okres */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("srv_period")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              servicePeriod !== "q2_2026"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>5. Cykl{servicePeriod === "q2_2026" ? ": Q2 2026" : servicePeriod === "q1_2026" ? ": Q1 2026" : ": 12 m-cy"}</span>
            <ChevronDown size={14} className={servicePeriod !== "q2_2026" ? "text-white" : "text-slate-400"} />
          </button>
          {activeDropdown === "srv_period" && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
              {[
                { id: "q2_2026", label: "Q2 2026 (Bieżący cykl)" },
                { id: "q1_2026", label: "Q1 2026 (Poprzedni cykl)" },
                { id: "year", label: "Ostatnie 12 miesięcy (Trend)" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setServicePeriod(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    servicePeriod === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Przycisk: Wyczyść */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={clearServiceFilters}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-colors text-xs border shadow-sm ${
              hasActiveFilters
                ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 cursor-pointer"
                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
            }`}
            title={hasActiveFilters ? "Zresetuj wszystkie aktywne filtry" : "Brak aktywnych filtrów"}
          >
            <X size={12} className={hasActiveFilters ? "text-slate-500" : "text-slate-400"} />
            <span>Wyczyść</span>
          </button>
        </div>
      </div>

      {/* RZĄD CHIPÓW AKTYWNYCH FILTRÓW */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2.5 mt-2.5 border-t border-slate-200/80">
          <div className="w-24 shrink-0 flex items-center text-xs font-bold text-slate-500 whitespace-nowrap">
            <span>Wybrane filtry:</span>
          </div>

          {serviceFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Usługa: {serviceFilter === "s1" ? "Płatności" : "Kredyt"}</span>
              <button type="button" onClick={() => setServiceFilter("all")} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}

          {serviceProcess !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Proces: {serviceProcess}</span>
              <button type="button" onClick={() => setServiceProcess("all")} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}

          {serviceChannel !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Kanał: {serviceChannel}</span>
              <button type="button" onClick={() => setServiceChannel("all")} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}

          {serviceSla !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>SLA: {serviceSla === "under80" ? "< 80%" : ">= 80%"}</span>
              <button type="button" onClick={() => setServiceSla("all")} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}

          {servicePeriod !== "q2_2026" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <span>Cykl: {servicePeriod}</span>
              <button type="button" onClick={() => setServicePeriod("q2_2026")} className="hover:bg-[#0038F8]/20 p-0.5 rounded cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// 3. Dedykowane filtry i parametry dla: Raporty Zarządcze
function ManagementFilterSection({
  mgmtUnit,
  setMgmtUnit,
  mgmtPeriod,
  setMgmtPeriod,
  mgmtKpi,
  setMgmtKpi,
  mgmtChannel,
  setMgmtChannel,
  activeDropdown,
  toggleDropdown,
  clearMgmtFilters,
  mgmtFiltersCount,
  hasActiveFilters,
  scopeSummaryText,
}) {
  return (
    <section
      data-testid="management-filter-section"
      className={`rounded-xl border-2 transition-all p-4 sm:p-5 relative z-40 overflow-visible mb-6 shadow-sm ${
        hasActiveFilters
          ? "bg-blue-50/40 border-[#0038F8]/40 shadow-sm"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${
              hasActiveFilters
                ? "bg-[#0038F8] text-white shadow-md shadow-[#0038F8]/25"
                : "bg-white text-slate-700 border-2 border-slate-300"
            }`}
          >
            {hasActiveFilters ? <CheckCircle2 size={18} className="text-white" /> : <PieChart size={16} />}
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-900">
              Parametry agregacji dla Dyrekcji i Władz Banku
            </span>
            <p className="text-slate-500 text-xs mt-0.5">
              Zdefiniuj poziom agregacji KPI, horyzont strategiczny oraz jednostkę organizacyjną do raportu wykonawczego.
            </p>
          </div>
        </div>

        {/* TYLKO JEDEN PRZYCISK WYCZYŚĆ */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {hasActiveFilters ? (
            <>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#0038F8] text-white shadow-xs">
                <CheckCircle2 size={13} />
                Parametry zmodyfikowane ({mgmtFiltersCount})
              </span>
              <button
                type="button"
                onClick={clearMgmtFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-800 bg-white hover:bg-red-50 border border-red-200 shadow-2xs transition-colors cursor-pointer"
                title="Przywróć domyślne parametry zarządcze"
              >
                <X size={12} />
                <span>Wyczyść filtry</span>
              </button>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-200 shadow-2xs">
              <PieChart size={13} className="text-slate-400" />
              Agregacja bankowa: Całość (domyślna)
            </span>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-200/80 my-3"></div>

      {/* POZIOME KONTROLKI ZARZĄDCZE */}
      <div
        className="flex flex-wrap items-center gap-2.5 relative overflow-visible z-40"
        data-reporting-dropdown="true"
      >
        {/* 1. Jednostka organizacyjna */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("mgmt_unit")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-xs ${
              mgmtUnit !== "all"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-md shadow-[#0038F8]/20"
                : "bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <span>1. Jednostka{mgmtUnit !== "all" ? `: ${mgmtUnit === "detal" ? "Detaliczna" : "Korporacyjna"}` : ": ING Bank Śląski (Całość)"}</span>
            <ChevronDown size={14} className={mgmtUnit !== "all" ? "text-white" : "text-slate-500"} />
          </button>
          {activeDropdown === "mgmt_unit" && (
            <div
              className="absolute top-full left-0 mt-2 w-72 bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-2.5 space-y-1.5"
              style={{ zIndex: 100 }}
            >
              {[
                { id: "all", label: "ING Bank Śląski (Wszystkie piony)" },
                { id: "detal", label: "Pion Bankowości Detalicznej" },
                { id: "corp", label: "Pion Bankowości Korporacyjnej i MŚP" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setMgmtUnit(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    mgmtUnit === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Horyzont czasowy */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("mgmt_period")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-xs ${
              mgmtPeriod !== "q1_q2_2026"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-md shadow-[#0038F8]/20"
                : "bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <span>2. Horyzont{mgmtPeriod === "q1_q2_2026" ? ": H1 2026 (Bieżący)" : mgmtPeriod === "annual" ? ": Roczny 2025/2026" : ": 3-letni trend"}</span>
            <ChevronDown size={14} className={mgmtPeriod !== "q1_q2_2026" ? "text-white" : "text-slate-500"} />
          </button>
          {activeDropdown === "mgmt_period" && (
            <div
              className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-2.5 space-y-1.5"
              style={{ zIndex: 100 }}
            >
              {[
                { id: "q1_q2_2026", label: "H1 2026 (Q1 + Q2 bieżący)" },
                { id: "annual", label: "Ujęcie roczne 2025 - 2026" },
                { id: "3yr", label: "Perspektywa strategiczna 3-letnia" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setMgmtPeriod(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    mgmtPeriod === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Kluczowy wskaźnik KPI */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("mgmt_kpi")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-xs ${
              mgmtKpi !== "all"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-md shadow-[#0038F8]/20"
                : "bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <span>3. Wskaźnik wiodący{mgmtKpi !== "all" ? `: ${mgmtKpi}` : ": Wszystkie KPI"}</span>
            <ChevronDown size={14} className={mgmtKpi !== "all" ? "text-white" : "text-slate-500"} />
          </button>
          {activeDropdown === "mgmt_kpi" && (
            <div
              className="absolute top-full left-0 mt-2 w-72 bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-2.5 space-y-1.5"
              style={{ zIndex: 100 }}
            >
              {[
                { id: "all", label: "Zestawienie pełne (Wszystkie KPI)" },
                { id: "Indeks ogólny", label: "Średni wskaźnik dostępności (Compliance %)" },
                { id: "Błędy krytyczne", label: "Redukcja błędów priorytetowych (SLA)" },
                { id: "Obciążenie zespołów", label: "Wydajność napraw deweloperskich" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setMgmtKpi(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    mgmtKpi === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PODSUMOWANIE */}
      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-200/80 text-xs text-slate-500">
        <span className="font-semibold">Bieżący zakres zarządczy:</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs">
          <CheckCircle2 size={12} className="text-[#0038F8]" />
          {scopeSummaryText}
        </span>
      </div>
    </section>
  );
}

// 4. Dedykowane filtry i regulacje dla: Regulacyjne (PAD)
function RegulatoryFilterSection({
  regLaw,
  setRegLaw,
  regService,
  setRegService,
  regStatus,
  setRegStatus,
  regYear,
  setRegYear,
  regRiskOnly,
  setRegRiskOnly,
  activeDropdown,
  toggleDropdown,
  clearRegFilters,
  regFiltersCount,
  hasActiveFilters,
  scopeSummaryText,
}) {
  return (
    <section
      data-testid="regulatory-filter-section"
      className={`rounded-xl border-2 transition-all p-4 sm:p-5 relative z-40 overflow-visible mb-6 shadow-sm ${
        hasActiveFilters
          ? "bg-blue-50/40 border-[#0038F8]/40 shadow-sm"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${
              hasActiveFilters
                ? "bg-[#0038F8] text-white shadow-md shadow-[#0038F8]/25"
                : "bg-white text-slate-700 border-2 border-slate-300"
            }`}
          >
            {hasActiveFilters ? <CheckCircle2 size={18} className="text-white" /> : <Scale size={16} />}
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-900">
              Wymogi formalne, podstawa prawna i zakres regulacyjny (PAD / EAA)
            </span>
            <p className="text-slate-500 text-xs mt-0.5">
              Sprawozdawczość zgodności z Ustawą o dostępności niektórych produktów i usług oraz Europejskim Aktem o Dostępności.
            </p>
          </div>
        </div>

        {/* TYLKO JEDEN PRZYCISK WYCZYŚĆ */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {hasActiveFilters ? (
            <>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#0038F8] text-white shadow-xs">
                <CheckCircle2 size={13} />
                Regulacje zmodyfikowane ({regFiltersCount})
              </span>
              <button
                type="button"
                onClick={clearRegFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-800 bg-white hover:bg-red-50 border border-red-200 shadow-2xs transition-colors cursor-pointer"
                title="Przywróć domyślne parametry regulacji PAD"
              >
                <X size={12} />
                <span>Wyczyść filtry</span>
              </button>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-200 shadow-2xs">
              <Scale size={13} className="text-slate-400" />
              Pełny reżim regulacyjny PAD 2026
            </span>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-200/80 my-3"></div>

      {/* POZIOME KONTROLKI REGULACYJNE */}
      <div
        className="flex flex-wrap items-center gap-2.5 relative overflow-visible z-40"
        data-reporting-dropdown="true"
      >
        {/* 1. Podstawa prawna */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("reg_law")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-xs ${
              regLaw !== "pad_eaa"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-md shadow-[#0038F8]/20"
                : "bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <span>1. Ustawa: {regLaw === "pad_eaa" ? "Ustawa PAD / EAA (Dostępność usług)" : "Ustawa o dostępności cyfrowej stron (WCAG)"}</span>
            <ChevronDown size={14} className={regLaw !== "pad_eaa" ? "text-white" : "text-slate-500"} />
          </button>
          {activeDropdown === "reg_law" && (
            <div
              className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-2.5 space-y-1.5"
              style={{ zIndex: 100 }}
            >
              {[
                { id: "pad_eaa", label: "Ustawa o dostępności niektórych produktów i usług (PAD / EAA)" },
                { id: "wcag_cyfrowa", label: "Ustawa o dostępności cyfrowej stron i aplikacji (WCAG 2.1 AA)" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setRegLaw(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    regLaw === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Usługi objęte ustawą */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("reg_srv")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-xs ${
              regService !== "all"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-md shadow-[#0038F8]/20"
                : "bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <span>2. Usługi objęte PAD{regService !== "all" ? `: ${regService}` : ": Wszystkie kluczowe (2)"}</span>
            <ChevronDown size={14} className={regService !== "all" ? "text-white" : "text-slate-500"} />
          </button>
          {activeDropdown === "reg_srv" && (
            <div
              className="absolute top-full left-0 mt-2 w-72 bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-2.5 space-y-1.5"
              style={{ zIndex: 100 }}
            >
              {[
                { id: "all", label: "Wszystkie usługi ustawowe (2)" },
                { id: "Płatnicze", label: "Usługi płatnicze i rachunki (art. 12)" },
                { id: "Kredytowe", label: "Umowy o kredyt konsumencki (art. 14)" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setRegService(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    regService === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Status deklaracji */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("reg_stat")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-xs ${
              regStatus !== "all"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-md shadow-[#0038F8]/20"
                : "bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <span>3. Status deklaracji{regStatus !== "all" ? `: ${regStatus}` : ": Wszystkie"}</span>
            <ChevronDown size={14} className={regStatus !== "all" ? "text-white" : "text-slate-500"} />
          </button>
          {activeDropdown === "reg_stat" && (
            <div
              className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-2.5 space-y-1.5"
              style={{ zIndex: 100 }}
            >
              {[
                { id: "all", label: "Wszystkie statusy" },
                { id: "Opublikowana", label: "Opublikowana (Zgodna)" },
                { id: "Aktualizacja", label: "Wymaga aktualizacji" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setRegStatus(opt.id);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    regStatus === opt.id ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Rok */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("reg_yr")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-xs ${
              regYear !== "2026"
                ? "bg-[#0038F8] text-white border-[#0038F8] shadow-md shadow-[#0038F8]/20"
                : "bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <span>4. Rok: {regYear}</span>
            <ChevronDown size={14} className={regYear !== "2026" ? "text-white" : "text-slate-500"} />
          </button>
          {activeDropdown === "reg_yr" && (
            <div
              className="absolute top-full left-0 mt-2 w-44 bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-2.5 space-y-1.5"
              style={{ zIndex: 100 }}
            >
              {["2026", "2025"].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    setRegYear(yr);
                    toggleDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    regYear === yr ? "bg-[#0038F8] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  Rok sprawozdawczy {yr}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. Ryzyko sankcji */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRegRiskOnly((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-xs ${
              regRiskOnly
                ? "bg-red-500 text-white border-red-600 shadow-md shadow-red-500/20"
                : "bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <AlertOctagon size={13} className={regRiskOnly ? "text-white" : "text-slate-500"} />
            <span>5. Ryzyko sankcji KNF</span>
            {regRiskOnly && <CheckCircle2 size={13} className="text-white" />}
          </button>
        </div>
      </div>

      {/* PODSUMOWANIE */}
      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-200/80 text-xs text-slate-500">
        <span className="font-semibold">Bieżący zakres regulacyjny:</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs">
          <CheckCircle2 size={12} className="text-[#0038F8]" />
          {scopeSummaryText}
        </span>
      </div>
    </section>
  );
}

// ==========================================
// GŁÓWNY MODUŁ RAPORTOWANIA
// ==========================================

function ReportingModuleView({ setView, showToast }) {
  // Nadrzędne menu raportowania (4 główne kategorie)
  const [activeGroup, setActiveGroup] = useState("audyty"); // 'audyty' | 'uslugi' | 'zarzadcze' | 'regulacyjne'
  const [activeAudytyTab, setActiveAudytyTab] = useState("raport");
  const [activeUslugiTab, setActiveUslugiTab] = useState("dostepnosc");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState(null);

  // Bezpieczne zamykanie dropdownu przy kliknięciu poza niego
  useEffect(() => {
    if (!activeDropdown) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-reporting-dropdown]")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setLastGeneratedAt(
        new Date().toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 350);
  };

  // 1. STAN DLA: RAPORTY Z AUDYTÓW
  const [auditService, setAuditService] = useState("all");
  const [auditProcess, setAuditProcess] = useState("all");
  const [auditChannels, setAuditChannels] = useState({});
  const [auditPriorities, setAuditPriorities] = useState({});
  const [auditStatuses, setAuditStatuses] = useState({});
  const [auditSources, setAuditSources] = useState({});
  const [auditAuditor, setAuditAuditor] = useState("");
  const [auditScoreRange, setAuditScoreRange] = useState("all");
  const [auditTimeRange, setAuditTimeRange] = useState("all");
  const [auditDateFrom, setAuditDateFrom] = useState("");
  const [auditDateTo, setAuditDateTo] = useState("");

  const clearAuditFilters = () => {
    setAuditService("all");
    setAuditProcess("all");
    setAuditChannels({});
    setAuditPriorities({});
    setAuditStatuses({});
    setAuditSources({});
    setAuditAuditor("");
    setAuditScoreRange("all");
    setAuditTimeRange("all");
    setAuditDateFrom("");
    setAuditDateTo("");
    setActiveDropdown(null);
  };

  const auditFiltersCount =
    (auditService !== "all" ? 1 : 0) +
    (auditProcess !== "all" ? 1 : 0) +
    Object.values(auditSources).filter(Boolean).length +
    Object.values(auditPriorities).filter(Boolean).length +
    Object.values(auditStatuses).filter(Boolean).length +
    Object.values(auditChannels).filter(Boolean).length +
    (auditAuditor ? 1 : 0) +
    (auditScoreRange !== "all" ? 1 : 0) +
    (auditTimeRange !== "all" || auditDateFrom || auditDateTo ? 1 : 0);

  // 2. STAN DLA: DOSTĘPNOŚĆ USŁUG
  const [serviceFilter, setServiceFilter] = useState("all");
  const [serviceProcess, setServiceProcess] = useState("all");
  const [serviceChannel, setServiceChannel] = useState("all");
  const [serviceSla, setServiceSla] = useState("all");
  const [servicePeriod, setServicePeriod] = useState("q2_2026");

  const clearServiceFilters = () => {
    setServiceFilter("all");
    setServiceProcess("all");
    setServiceChannel("all");
    setServiceSla("all");
    setServicePeriod("q2_2026");
    setActiveDropdown(null);
  };

  const serviceFiltersCount =
    (serviceFilter !== "all" ? 1 : 0) +
    (serviceProcess !== "all" ? 1 : 0) +
    (serviceChannel !== "all" ? 1 : 0) +
    (serviceSla !== "all" ? 1 : 0) +
    (servicePeriod !== "q2_2026" ? 1 : 0);

  // 3. STAN DLA: ZARZĄDCZE
  const [mgmtUnit, setMgmtUnit] = useState("all");
  const [mgmtPeriod, setMgmtPeriod] = useState("q1_q2_2026");
  const [mgmtKpi, setMgmtKpi] = useState("all");
  const [mgmtChannel, setMgmtChannel] = useState("all");

  const clearMgmtFilters = () => {
    setMgmtUnit("all");
    setMgmtPeriod("q1_q2_2026");
    setMgmtKpi("all");
    setMgmtChannel("all");
    setActiveDropdown(null);
  };

  const mgmtFiltersCount =
    (mgmtUnit !== "all" ? 1 : 0) +
    (mgmtPeriod !== "q1_q2_2026" ? 1 : 0) +
    (mgmtKpi !== "all" ? 1 : 0) +
    (mgmtChannel !== "all" ? 1 : 0);

  // 4. STAN DLA: REGULACYJNE (PAD)
  const [regLaw, setRegLaw] = useState("pad_eaa");
  const [regService, setRegService] = useState("all");
  const [regStatus, setRegStatus] = useState("all");
  const [regYear, setRegYear] = useState("2026");
  const [regRiskOnly, setRegRiskOnly] = useState(false);

  const clearRegFilters = () => {
    setRegLaw("pad_eaa");
    setRegService("all");
    setRegStatus("all");
    setRegYear("2026");
    setRegRiskOnly(false);
    setActiveDropdown(null);
  };

  const regFiltersCount =
    (regLaw !== "pad_eaa" ? 1 : 0) +
    (regService !== "all" ? 1 : 0) +
    (regStatus !== "all" ? 1 : 0) +
    (regYear !== "2026" ? 1 : 0) +
    (regRiskOnly ? 1 : 0);

  return (
    <div data-testid="reporting-module-view" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden">
      {/* GŁÓWNY NAGŁÓWEK RAPORTOWANIA: TŁO 100VW, CONTENT MAX 1600PX WYŚRODKOWANY */}
      <div className="w-full bg-white border-b border-slate-200 flex-shrink-0 z-30 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-0">
          {/* Prosty, czytelny breadcrumbs bez ikonek i kolorów */}
          <nav aria-label="Ścieżka nawigacyjna" className="flex items-center text-[13px] font-medium text-slate-500 mb-2">
            <ol role="list" className="flex items-center flex-wrap gap-2 list-none m-0 p-0">
              <li>
                <button
                  type="button"
                  onClick={() => setView && setView("przeglad")}
                  className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Pulpit
                </button>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-300 select-none font-normal" aria-hidden="true">/</span>
                <span aria-current="page" className="text-slate-800 font-semibold">Raportowanie</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
                Raportowanie i Analizy Dostępności
              </h1>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Wybierz nadrzędny moduł raportowania, zdefiniuj zakres filtrów lub regulacji i wygeneruj odpowiednie zestawienie.
              </p>
            </div>
          </div>

          {/* NADRZĘDNE MENU RAPORTOWANIA: 4 GŁÓWNE ZAKŁADKI */}
          <div className="flex items-center gap-2 sm:gap-6 border-b border-slate-200 overflow-x-auto scrollbar-hide">
            <TabButton
              isActive={activeGroup === "audyty"}
              onClick={() => setActiveGroup("audyty")}
              icon={ClipboardList}
            >
              Raporty z Audytów
            </TabButton>
            <TabButton
              isActive={activeGroup === "uslugi"}
              onClick={() => setActiveGroup("uslugi")}
              icon={Layout}
            >
              Dostępność Usług
            </TabButton>
            <TabButton
              isActive={activeGroup === "zarzadcze"}
              onClick={() => setActiveGroup("zarzadcze")}
              icon={PieChart}
            >
              Zarządcze
            </TabButton>
            <TabButton
              isActive={activeGroup === "regulacyjne"}
              onClick={() => setActiveGroup("regulacyjne")}
              icon={Scale}
            >
              Regulacyjne (PAD)
            </TabButton>
          </div>
        </div>
      </div>

      {/* PRZEWIJALNA TREŚĆ: TŁO 100VW, CONTENT MAX 1600PX WYŚRODKOWANY */}
      <div className="flex-1 md:overflow-auto bg-[#f8fafc] flex flex-col w-full">
        <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col px-4 sm:px-8 lg:px-12 py-6">

          {/* ========================================================= */}
          {/* 1. ZAKŁADKA: RAPORTY Z AUDYTÓW                            */}
          {/* ========================================================= */}
          {activeGroup === "audyty" && (
            <>
              {/* Pod-nawigacja i przyciski akcji audytów */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl w-max border border-slate-200/50">
                  <SubNavButton
                    isActive={activeAudytyTab === "raport"}
                    onClick={() => setActiveAudytyTab("raport")}
                  >
                    Raport Audytów
                  </SubNavButton>
                  <SubNavButton
                    isActive={activeAudytyTab === "bledy"}
                    onClick={() => setActiveAudytyTab("bledy")}
                  >
                    Błędy z Audytów
                  </SubNavButton>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {lastGeneratedAt && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={13} /> Raport aktualny ({lastGeneratedAt})
                    </span>
                  )}
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm shadow-[#0038F8]/20 transition-all cursor-pointer disabled:opacity-70"
                  >
                    <Sparkles size={14} className={isGenerating ? "animate-spin" : ""} />
                    <span>{isGenerating ? "Generowanie..." : "Generuj raport z audytów"}</span>
                  </button>
                  <button
                    onClick={() =>
                      showToast &&
                      showToast(
                        "Generowanie PDF",
                        "Generowanie skonsolidowanego raportu audytów WCAG w formacie PDF..."
                      )
                    }
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    title="Pobierz raport w formacie PDF"
                  >
                    <FileText size={14} className="text-red-500" />
                    <span>Pobierz PDF</span>
                  </button>
                  <button
                    onClick={() =>
                      showToast &&
                      showToast(
                        "Eksport do Excela (.xlsx)",
                        "Pomyślnie wygenerowano plik Excel: Raport_Audyty_Zestawienie_2026.xlsx (zawiera 49 kryteriów WCAG i metryki)."
                      )
                    }
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    title="Eksportuj do pliku Excel"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-600" />
                    <span>Eksport (.xlsx)</span>
                  </button>
                </div>
              </div>

              {/* Dedykowana sekcja filtrów dla Audytów */}
              <AuditsFilterSection
                auditService={auditService}
                setAuditService={setAuditService}
                auditProcess={auditProcess}
                setAuditProcess={setAuditProcess}
                auditChannels={auditChannels}
                setAuditChannels={setAuditChannels}
                auditPriorities={auditPriorities}
                setAuditPriorities={setAuditPriorities}
                auditStatuses={auditStatuses}
                setAuditStatuses={setAuditStatuses}
                auditSources={auditSources}
                setAuditSources={setAuditSources}
                auditAuditor={auditAuditor}
                setAuditAuditor={setAuditAuditor}
                auditScoreRange={auditScoreRange}
                setAuditScoreRange={setAuditScoreRange}
                auditTimeRange={auditTimeRange}
                setAuditTimeRange={setAuditTimeRange}
                auditDateFrom={auditDateFrom}
                setAuditDateFrom={setAuditDateFrom}
                auditDateTo={auditDateTo}
                setAuditDateTo={setAuditDateTo}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                clearAuditFilters={clearAuditFilters}
                auditFiltersCount={auditFiltersCount}
                hasActiveFilters={auditFiltersCount > 0}
                scopeSummaryText={`${auditService === "s1" ? "Usługi płatnicze" : auditService === "s2" ? "Kredyt hipoteczny" : "Wszystkie usługi (2)"} • 6 audytów • 47 błędów priorytetowych • Śr. zgodność 86.2%`}
              />

              {/* Zawartość wybranego pod-widoku audytów */}
              <div className="flex-1">
                {activeAudytyTab === "raport" && <AuditReportView />}
                {activeAudytyTab === "bledy" && <AuditErrorsReportView />}
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* 2. ZAKŁADKA: DOSTĘPNOŚĆ USŁUG                            */}
          {/* ========================================================= */}
          {activeGroup === "uslugi" && (
            <>
              {/* Pod-nawigacja i przyciski akcji usług */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl w-max border border-slate-200/50">
                  <SubNavButton
                    isActive={activeUslugiTab === "dostepnosc"}
                    onClick={() => setActiveUslugiTab("dostepnosc")}
                  >
                    Dostępność Usług
                  </SubNavButton>
                  <SubNavButton
                    isActive={activeUslugiTab === "postepy"}
                    onClick={() => setActiveUslugiTab("postepy")}
                  >
                    Postępy
                  </SubNavButton>
                  <SubNavButton
                    isActive={activeUslugiTab === "bledy"}
                    onClick={() => setActiveUslugiTab("bledy")}
                  >
                    Błędy w Usługach
                  </SubNavButton>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {lastGeneratedAt && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={13} /> Analiza aktualna ({lastGeneratedAt})
                    </span>
                  )}
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm shadow-[#0038F8]/20 transition-all cursor-pointer disabled:opacity-70"
                  >
                    <Sparkles size={14} className={isGenerating ? "animate-spin" : ""} />
                    <span>{isGenerating ? "Generowanie..." : "Generuj zestawienie usług"}</span>
                  </button>
                  <button
                    onClick={() =>
                      showToast &&
                      showToast(
                        "Generowanie PDF",
                        "Generowanie raportu dostępności usług w formacie PDF..."
                      )
                    }
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    title="Pobierz raport w formacie PDF"
                  >
                    <FileText size={14} className="text-red-500" />
                    <span>Pobierz PDF</span>
                  </button>
                  <button
                    onClick={() =>
                      showToast &&
                      showToast(
                        "Eksport do Excela (.xlsx)",
                        "Pomyślnie wygenerowano plik Excel: Dostepnosc_Uslug_Procesy_2026.xlsx z danymi kanałów WWW, Mobile i PDF."
                      )
                    }
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    title="Eksportuj do pliku Excel"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-600" />
                    <span>Eksport (.xlsx)</span>
                  </button>
                </div>
              </div>

              {/* Dedykowana sekcja filtrów dla Usług */}
              <ServicesFilterSection
                serviceFilter={serviceFilter}
                setServiceFilter={setServiceFilter}
                serviceProcess={serviceProcess}
                setServiceProcess={setServiceProcess}
                serviceChannel={serviceChannel}
                setServiceChannel={setServiceChannel}
                serviceSla={serviceSla}
                setServiceSla={setServiceSla}
                servicePeriod={servicePeriod}
                setServicePeriod={setServicePeriod}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                clearServiceFilters={clearServiceFilters}
                serviceFiltersCount={serviceFiltersCount}
                hasActiveFilters={serviceFiltersCount > 0}
                scopeSummaryText={`${serviceFilter === "s1" ? "Usługi płatnicze" : serviceFilter === "s2" ? "Kredyt hipoteczny" : "Wszystkie usługi (2)"} • ${serviceProcess !== "all" ? serviceProcess : "14 procesów biznesowych"} • SLA: 86.2%`}
              />

              {/* Zawartość wybranego pod-widoku usług */}
              <div className="flex-1">
                {activeUslugiTab === "dostepnosc" && <OperationalReport />}
                {activeUslugiTab === "postepy" && <ProgressReport />}
                {activeUslugiTab === "bledy" && <ServicesErrorReport />}
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* 3. ZAKŁADKA: ZARZĄDCZE                                   */}
          {/* ========================================================= */}
          {activeGroup === "zarzadcze" && (
            <>
              {/* Pasek akcji raportu zarządczego */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Raport Zarządczy KPI i Trendy Dostępności
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Wskaźniki strategiczne, realizacja celów dostępności i podsumowanie executive dla Dyrekcji.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {lastGeneratedAt && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={13} /> Wskaźniki przeliczone ({lastGeneratedAt})
                    </span>
                  )}
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm shadow-[#0038F8]/20 transition-all cursor-pointer disabled:opacity-70"
                  >
                    <Sparkles size={14} className={isGenerating ? "animate-spin" : ""} />
                    <span>{isGenerating ? "Przeliczanie..." : "Przelicz wskaźniki KPI"}</span>
                  </button>
                  <button
                    onClick={() =>
                      showToast &&
                      showToast(
                        "Generowanie Raportu Zarządczego (PDF)",
                        "Generowanie oficjalnego podsumowania executive dla Dyrekcji w formacie PDF..."
                      )
                    }
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    title="Pobierz oficjalny raport executive PDF"
                  >
                    <FileText size={14} className="text-red-500" />
                    <span>Pobierz Raport Zarządczy (PDF)</span>
                  </button>
                  <button
                    onClick={() =>
                      showToast &&
                      showToast(
                        "Eksport KPI do Excela (.xlsx)",
                        "Pomyślnie wygenerowano plik Excel: Wskazniki_Zarzadcze_Dostepnosc_2026.xlsx z danymi KPI i trendami."
                      )
                    }
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    title="Eksportuj KPI do pliku Excel"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-600" />
                    <span>Eksport KPI (.xlsx)</span>
                  </button>
                </div>
              </div>

              {/* Dedykowana sekcja filtrów dla Zarządczych */}
              <ManagementFilterSection
                mgmtUnit={mgmtUnit}
                setMgmtUnit={setMgmtUnit}
                mgmtPeriod={mgmtPeriod}
                setMgmtPeriod={setMgmtPeriod}
                mgmtKpi={mgmtKpi}
                setMgmtKpi={setMgmtKpi}
                mgmtChannel={mgmtChannel}
                setMgmtChannel={setMgmtChannel}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                clearMgmtFilters={clearMgmtFilters}
                mgmtFiltersCount={mgmtFiltersCount}
                hasActiveFilters={mgmtFiltersCount > 0}
                scopeSummaryText={`ING Bank Śląski • Zgodność ogólna: 86.2% (+4.2% r/r) • 47 błędów priorytetowych w obsłudze • Cykl Q1/Q2 2026`}
              />

              {/* Widok raportu zarządczego */}
              <div className="flex-1">
                <ManagementReport />
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* 4. ZAKŁADKA: REGULACYJNE (PAD)                            */}
          {/* ========================================================= */}
          {activeGroup === "regulacyjne" && (
            <>
              {/* Pasek akcji raportu regulacyjnego PAD */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Sprawozdawczość Regulacyjna PAD & Europejski Akt o Dostępności (EAA)
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Weryfikacja wymogów Ustawy o dostępności produktów i usług, status deklaracji oraz ryzyko sankcji nadzorczych.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {lastGeneratedAt && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={13} /> Raport wygenerowany ({lastGeneratedAt})
                    </span>
                  )}
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm shadow-[#0038F8]/20 transition-all cursor-pointer disabled:opacity-70"
                  >
                    <Scale size={14} className={isGenerating ? "animate-spin" : ""} />
                    <span>{isGenerating ? "Generowanie..." : "Generuj Deklarację Zgodności PAD"}</span>
                  </button>
                  <button
                    onClick={() =>
                      showToast &&
                      showToast(
                        "Generowanie Deklaracji PAD (PDF)",
                        "Generowanie urzędowej Deklaracji Dostępności zgodnie z wymogami Ustawy PAD i EAA w formacie PDF..."
                      )
                    }
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    title="Pobierz Deklarację Dostępności w formacie PDF"
                  >
                    <FileText size={14} className="text-red-500" />
                    <span>Pobierz Deklarację PAD (PDF)</span>
                  </button>
                  <button
                    onClick={() =>
                      showToast &&
                      showToast(
                        "Eksport dla Nadzoru (.xlsx)",
                        "Pomyślnie wygenerowano plik Excel: Zestawienie_Nadzorcze_KNF_PFRON_PAD_2026.xlsx z audytem zgodności."
                      )
                    }
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    title="Eksportuj tabelę zgodności dla KNF/PFRON"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-600" />
                    <span>Zestawienie dla Nadzoru (.xlsx)</span>
                  </button>
                </div>
              </div>

              {/* Dedykowana sekcja filtrów dla Regulacji PAD */}
              <RegulatoryFilterSection
                regLaw={regLaw}
                setRegLaw={setRegLaw}
                regService={regService}
                setRegService={setRegService}
                regStatus={regStatus}
                setRegStatus={setRegStatus}
                regYear={regYear}
                setRegYear={setRegYear}
                regRiskOnly={regRiskOnly}
                setRegRiskOnly={setRegRiskOnly}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                clearRegFilters={clearRegFilters}
                regFiltersCount={regFiltersCount}
                hasActiveFilters={regFiltersCount > 0}
                scopeSummaryText={`Reżim: Ustawa o dostępności niektórych produktów i usług (PAD/EAA) • Rok ${regYear} • 2 usługi kluczowe • Brak ryzyka sankcji`}
              />

              {/* Widok raportu regulacyjnego PAD */}
              <div className="flex-1">
                <RegulatoryReportView />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function TabButton({
  isActive,
  onClick,
  icon: Icon,
  disabled,
  disabledLabel,
  children,
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`flex items-center gap-2 pb-4 border-b-2 font-bold text-[13px] sm:text-[15px] transition-colors whitespace-nowrap flex-shrink-0 
        ${
          disabled
            ? "opacity-50 cursor-not-allowed border-transparent text-slate-500"
            : isActive
            ? "border-[#0038F8] text-[#0038F8]"
            : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
        }
      `}
    >
      <Icon size={18} />
      {children}
      {disabledLabel && (
        <span className="bg-slate-200 text-slate-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest ml-1">
          {disabledLabel}
        </span>
      )}
    </button>
  );
}

function SubNavButton({ isActive, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 sm:px-5 py-2 text-[12px] sm:text-[13px] font-bold rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-white text-[#0038F8] shadow-sm"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
      }`}
    >
      {children}
    </button>
  );
}

function FiltersSidebar({ isCollapsed, setIsCollapsed }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("all");
  const [isServiceAccOpen, setIsServiceAccOpen] = useState(true);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState("all");

  const serviceShortNames = {
    s1: "Usługi płatnicze...",
    s2: "Kredyt hipoteczny",
  };

  const accordionTitle =
    !isServiceAccOpen && selectedService !== "all"
      ? `Wybrano: ${serviceShortNames[selectedService]}`
      : "1. Wybór usługi i procesu";

  const getMobileHeaderText = () => {
    if (isMobileOpen) return "Filtrowanie wyników";
    if (selectedService !== "all" && filtersApplied)
      return `Wybrano: ${serviceShortNames[selectedService]} (+ filtry)`;
    if (selectedService !== "all")
      return `Wybrano: ${serviceShortNames[selectedService]}`;
    if (filtersApplied) return "Filtry zastosowane";
    return "Ustaw filtry i wybierz usługę";
  };

  return (
    <div
      className={`
      bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300 z-20 shadow-sm md:shadow-none overflow-visible relative
      ${isCollapsed ? "md:w-0" : "w-full md:w-[320px]"}
    `}
    >
      {/* Przycisk rozwijania - widoczny tylko na desktop */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsCollapsed(!isCollapsed);
        }}
        className={`hidden md:flex items-center justify-center w-8 h-8 transition-all duration-300 z-50
          ${isCollapsed
            ? "absolute left-0 top-[23px] bg-slate-900 text-white hover:bg-slate-800 rounded-r-lg rounded-l-none"
            : "absolute right-[15px] top-[23px] bg-slate-100 text-slate-700 hover:bg-[#0038F8] hover:text-white rounded-lg"
          }
        `}
        title={isCollapsed ? "Rozwiń filtry" : "Zwiń filtry"}
      >
        {isCollapsed ? (
          <ChevronRight size={20} />
        ) : (
          <ChevronLeft size={20} />
        )}
      </button>

      <div
        className={`p-4 md:p-6 flex items-center ${
          isCollapsed ? "md:justify-center px-2" : "justify-between"
        } cursor-pointer md:cursor-default transition-colors duration-200
          ${
            isMobileOpen
              ? "bg-slate-900 text-white border-b border-slate-800"
              : "bg-[#0038F8] text-white md:bg-white md:text-slate-900 border-b border-[#002ECC] md:border-slate-100"
          }
        `}
        onClick={() => {
          if (window.innerWidth < 768) {
            setIsMobileOpen(!isMobileOpen);
          }
        }}
      >
        <div
          className={`flex items-center gap-2 md:gap-3 min-w-0 pr-2 ${
            isCollapsed ? "md:hidden" : ""
          }`}
        >
          <Filter
            size={20}
            className={`flex-shrink-0 ${
              isMobileOpen
                ? "text-slate-400 md:text-[#0038F8]"
                : "text-white md:text-[#0038F8]"
            }`}
          />
          <h2 className="text-[15px] md:text-lg font-bold min-w-0 truncate">
            <span className="md:hidden flex items-center gap-2 truncate">
              {(selectedService !== "all" || filtersApplied) &&
              !isMobileOpen ? (
                <CheckCircle2 size={16} className="text-white flex-shrink-0" />
              ) : null}
              <span className="truncate">{getMobileHeaderText()}</span>
            </span>
            <span className="hidden md:block">Filtry</span>
          </h2>
        </div>
        <button
          className={`md:hidden p-1.5 transition-colors rounded-lg flex-shrink-0 ${
            isMobileOpen
              ? "bg-slate-800 text-slate-400 hover:text-white"
              : "bg-white/20 text-white"
          }`}
        >
          {isMobileOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div
        className={`md:flex-1 overflow-y-auto p-4 space-y-3 max-h-[65vh] md:max-h-none ${
          isCollapsed ? "md:hidden" : ""
        } ${
          isMobileOpen ? "block" : "hidden md:block"
        } bg-slate-50 md:bg-white`}
      >
        <FilterAccordion
          title={accordionTitle}
          count={0}
          controlledExpanded={isServiceAccOpen}
          onControlledToggle={setIsServiceAccOpen}
          titleBadge={
            selectedService !== "all" && !isServiceAccOpen ? (
              <CheckCircle2
                size={16}
                className="text-emerald-500 flex-shrink-0"
              />
            ) : null
          }
        >
          <div className="space-y-4 pt-1">
            <div>
              <div className="text-xs text-slate-500 mb-1.5 font-semibold">
                Usługi
              </div>
              <select
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  if (e.target.value !== "all") {
                    setIsServiceAccOpen(false);
                  }
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 font-medium shadow-sm"
              >
                <option value="all">Wszystkie usługi</option>
                <option value="s1">
                  Usługi płatnicze i powiązane z rachunkiem
                </option>
                <option value="s2">Kredyt hipoteczny</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1.5 font-semibold">
                Procesy
              </div>
              <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 font-medium shadow-sm">
                <option value="all">Wszystkie procesy</option>
                <option value="p1">Otwarcie ROR</option>
                <option value="p2">Przelew krajowy</option>
              </select>
            </div>
          </div>
        </FilterAccordion>

        <FilterAccordion title="2. Źródło wykrycia błędu" count={0}>
          <FilterCheckbox label="Audyt" />
          <FilterCheckbox label="Reaudyt" />
          <FilterCheckbox label="Zgłoszenie użytkownika" />
          <FilterCheckbox label="Skarga" />
        </FilterAccordion>

        <FilterAccordion title="3. Błąd" count={0}>
          <FilterCheckbox label={<><AlertOctagon size={12} className="text-red-500 inline mr-1.5" />Priorytet: Priorytetowy</>} />
          <FilterCheckbox label={<><AlertTriangle size={12} className="text-orange-500 inline mr-1.5" />Priorytet: Ważny</>} />
          <FilterCheckbox label={<><Info size={12} className="text-blue-500 inline mr-1.5" />Priorytet: Marginalny</>} />
          <FilterCheckbox label="Status: Nowy" />
          <FilterCheckbox label="Status: Naprawiony" />
        </FilterAccordion>

        <FilterAccordion title="4. Kanał" count={0}>
          <FilterCheckbox label="WWW" />
          <FilterCheckbox label="Aplikacja" />
          <FilterCheckbox label="Dokument" />
        </FilterAccordion>

        <FilterAccordion title="5. Audyty i Wyniki" count={0}>
          <div className="space-y-4 pt-1">
            <div>
              <div className="text-xs text-slate-500 mb-1.5 font-semibold">
                Audytor
              </div>
              <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 font-medium shadow-sm">
                <option value="">Wszyscy audytorzy</option>
                <option value="1">Jan Kowalski</option>
                <option value="2">Piotr Smułkowski</option>
              </select>
            </div>
            <FilterNumberRange
              label="Zakres % dostępności"
              placeholderOd="Min %"
              placeholderDo="Max %"
            />
          </div>
        </FilterAccordion>

        <FilterAccordion title="6. Czas">
          <div className="space-y-4 pt-1">
            <div>
              <div className="text-xs text-slate-500 mb-2 font-semibold">
                Szybki wybór okresu
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTimeRange("30d")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                    activeTimeRange === "30d"
                      ? "bg-[#0038F8] text-white border-[#0038F8]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                  }`}
                >
                  30 dni
                </button>
                <button
                  onClick={() => setActiveTimeRange("60d")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                    activeTimeRange === "60d"
                      ? "bg-[#0038F8] text-white border-[#0038F8]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                  }`}
                >
                  60 dni
                </button>
                <button
                  onClick={() => setActiveTimeRange("1y")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                    activeTimeRange === "1y"
                      ? "bg-[#0038F8] text-white border-[#0038F8]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                  }`}
                >
                  1 Rok
                </button>
                <button
                  onClick={() => setActiveTimeRange("all")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                    activeTimeRange === "all"
                      ? "bg-[#0038F8] text-white border-[#0038F8]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                  }`}
                >
                  Wszystkie
                </button>
              </div>
            </div>
            <div className="h-px bg-slate-100 my-1 mx-1"></div>
            <FilterDateRange label="Data audytu" />
            <div className="h-px bg-slate-100 my-1 mx-1"></div>
            <FilterDateRange label="Data wykrycia błędów" />
          </div>
        </FilterAccordion>
      </div>

      <div
        className={`p-4 border-t border-slate-100 bg-slate-50 shrink-0 gap-2 ${
          isCollapsed ? "md:hidden" : ""
        } ${isMobileOpen ? "flex flex-col" : "hidden md:flex md:flex-col"}`}
        >
          <button
            onClick={() => {
              setFiltersApplied(true);
              if (window.innerWidth < 768) setIsMobileOpen(false);
            }}
            className="w-full bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-3 rounded-xl font-bold shadow-sm transition-colors text-sm"
          >
            Zastosuj filtry
          </button>
          <button
            onClick={() => {
              setSelectedService("all");
              setIsServiceAccOpen(true);
              setFiltersApplied(false);
              setActiveTimeRange("all");
            }}
            className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-3 rounded-xl font-bold transition-colors text-sm shadow-sm"
          >
            Wyczyść
          </button>
        </div>
    </div>
  );
}

function FilterAccordion({
  title,
  count,
  isOpen = false,
  controlledExpanded,
  onControlledToggle,
  children,
  titleBadge,
}) {
  const [internalExpanded, setInternalExpanded] = useState(isOpen);
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isControlled) {
      onControlledToggle(!isExpanded);
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  return (
    <div
      data-testid="filter-accordion"
      className={`border rounded-xl bg-white overflow-hidden transition-colors ${
        isControlled && !isExpanded && titleBadge
          ? "border-[#0038F8]/40 shadow-sm"
          : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span
            className={`font-bold text-sm text-left truncate transition-colors ${
              isControlled && !isExpanded && titleBadge
                ? "text-[#0038F8]"
                : "text-slate-800"
            }`}
          >
            {title}
          </span>
          {titleBadge}
          {count > 0 && (
            <span className="bg-[#0038F8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0">
              {count}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
        )}
      </button>
      {isExpanded && (
        <div className="p-3 border-t border-slate-100 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function FilterCheckbox({ label }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <label
      data-testid="filter-checkbox"
      className="flex items-center gap-3 cursor-pointer group"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        className="hidden"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
          isChecked
            ? "bg-[#0038F8] border-[#0038F8]"
            : "bg-white border-slate-300 group-hover:border-[#0038F8]"
        }`}
      >
        {isChecked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <polyline points="2.5 6 5 8.5 9.5 3"></polyline>
          </svg>
        )}
      </div>
      <span
        className={`text-sm transition-colors flex items-center ${
          isChecked
            ? "font-bold text-slate-900"
            : "font-medium text-slate-600 group-hover:text-slate-900"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function FilterDateRange({ label }) {
  return (
    <div
      data-testid="filter-date-range"
    >
      <div className="text-xs text-slate-500 mb-1.5 font-semibold">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 shadow-sm"
        />
        <span className="text-slate-400 text-xs">-</span>
        <input
          type="date"
          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 shadow-sm"
        />
      </div>
    </div>
  );
}

function FilterNumberRange({
  label,
  placeholderOd = "Od",
  placeholderDo = "Do",
}) {
  return (
    <div
      data-testid="filter-number-range"
    >
      <div className="text-xs text-slate-500 mb-1.5 font-semibold">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={placeholderOd}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 shadow-sm"
        />
        <span className="text-slate-400 text-xs">-</span>
        <input
          type="number"
          placeholder={placeholderDo}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 shadow-sm"
        />
      </div>
    </div>
  );
}

// ==========================================
// RAPORT AUDYTÓW (Odświeżona Pełna Wersja)
// ==========================================

function AuditReportView() {
  const [detailLevel, setDetailLevel] = useState(2);
  const [sortBy, setSortBy] = useState("date_desc");

  const mockAudits = [
    {
      id: "a1",
      name: "Strona ing.pl - wybrane podstrony",
      startDate: "01.03.2024",
      endDate: "12.03.2024",
      wcagVersion: "WCAG 2.1 Poziom AA",
      channels: ["WWW", "Aplikacja"],
      auditor: "P. Smułkowski",
      score: 77.5,
      brokenCriteria: 11,
      totalErrors: 45,
      priorities: { c: 3, w: 12, m: 20 },
      reaudits: [
        {
          id: "re1",
          name: "Reaudyt 1: Weryfikacja po poprawkach",
          date: "15.04.2024",
          auditor: "P. Smułkowski",
          score: 85.2,
          brokenCriteria: 5,
          critical: 1,
          status: "Zakończony",
        },
        {
          id: "re2",
          name: "Reaudyt 2: Błędy priorytetowe",
          date: "20.05.2024",
          auditor: "A. Nowak",
          score: 92.4,
          brokenCriteria: 2,
          critical: 0,
          status: "W trakcie",
        },
      ],
      views: [
        {
          id: "v1",
          name: "Strona główna - modal logowania",
          score: 65.0,
          brokenCriteria: 4,
          totalErrors: 15,
          priorities: { c: 1, w: 5, m: 6 },
          errors: [
            {
              id: "e1",
              title: "Brak powiązania etykiety z polem PESEL.",
              criteria: "3.3.2 Etykiety",
              priority: "Ważny",
              status: "Nowy",
            },
            {
              id: "e2",
              title: 'Brak fokusa na przycisku "Zaloguj".',
              criteria: "2.4.7 Widoczny fokus",
              priority: "Priorytetowy",
              status: "Nowy",
            },
          ],
        },
        ...genViews(12, "aud-1-gen"),
      ],
    },
    {
      id: "a2",
      name: "Aplikacja MING Android - Kredyty",
      startDate: "10.02.2024",
      endDate: "28.02.2024",
      wcagVersion: "WCAG 2.1 Poziom AA",
      channels: ["Aplikacja"],
      auditor: "J. Kowalski",
      score: 83.6,
      brokenCriteria: 6,
      totalErrors: 18,
      priorities: { c: 0, w: 8, m: 5 },
      reaudits: [],
      views: genViews(8, "aud-2-gen"),
    },
  ];

  return (
    <div
      data-testid="audit-report-view"
      className="w-full"
    >
      {/* Pasek wyników, sortowania i zagnieżdżenia - spójny z Audytami i Skargami */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-sm font-bold text-slate-700">
            Wyniki: <span className="text-[#0038F8] font-black">{mockAudits.length}</span> audytów
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
            <CheckCircle2 size={12} /> Zakres: 6 audytów • 47 błędów • Śr. zgodność 86.2%
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Sortuj:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 cursor-pointer shadow-sm"
            >
              <option value="score_desc">Wynik: od najwyższego (%)</option>
              <option value="score_asc">Wynik: od najniższego (%)</option>
              <option value="date_desc">Data zakończenia: od najnowszych</option>
              <option value="name_asc">Nazwa audytu (A-Z)</option>
              <option value="errors_desc">Liczba błędów: od największej</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Zagnieżdżenie:</span>
            <select
              value={detailLevel}
              onChange={(e) => setDetailLevel(Number(e.target.value))}
              className="bg-white border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 cursor-pointer shadow-sm"
            >
              <option value={1}>1. Tylko Raporty</option>
              <option value={2}>2. Raporty + Widoki w audycie</option>
              <option value={3}>3. Raporty + Widoki + Błędy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {mockAudits.map((audit) => (
          <AuditNode key={audit.id} audit={audit} detailLevel={detailLevel} />
        ))}
      </div>
    </div>
  );
}

function AuditNode({ audit, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const visibleViews = expanded ? audit.views : audit.views.slice(0, 3);

  return (
    <Card
      data-testid="audit-node"
      className="overflow-hidden border border-slate-200 shadow-sm"
    >
      <div className="bg-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex flex-col flex-1 min-w-[280px]">
          <div className="flex items-center gap-2 mb-1.5">
            <ClipboardCheck
              size={18}
              className="text-[#0038F8] flex-shrink-0"
            />
            <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
              {audit.name}
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {audit.startDate} - {audit.endDate}
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {audit.auditor}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral" className="!py-0.5 !px-2 !text-[10px]">
              {audit.wcagVersion}
            </Badge>
            {audit.channels.map((ch) => (
              <Badge
                key={ch}
                variant="lightBlue"
                className="!py-0.5 !px-2 !text-[10px]"
              >
                {ch}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 md:mt-0">
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-24 sm:w-28 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Złamane Kryteria
            </span>
            <span className="text-xl font-extrabold text-slate-700">
              {audit.brokenCriteria}
            </span>
          </div>
          <div className="flex flex-col pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Liczna błędów
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold text-slate-700">
                {audit.totalErrors}
              </span>
              <PriorityStats {...audit.priorities} />
            </div>
          </div>
          <div className="w-auto sm:w-28 flex justify-end shrink-0">
            <div className="flex flex-col items-end w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
                Zgodność
              </span>
              <span className={`text-lg font-bold ${
                audit.score >= 80 ? 'text-emerald-600' : 'text-amber-500'
              }`}>
                {audit.score.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {audit.reaudits && audit.reaudits.length > 0 && (
        <div className="bg-[#f0f5ff] border-b border-[#dbeafe] p-4 sm:px-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <span title="Historia wyników">
              <History size={16} className="text-[#0038F8]" />
            </span>
            <h4 className="text-[11px] font-extrabold text-[#0038F8] uppercase tracking-widest">
              Historia i Reaudyty ({audit.reaudits.length})
            </h4>
          </div>
          <div className="flex flex-col gap-2.5">
            {audit.reaudits.map((reaudit) => (
              <div
                key={reaudit.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-[#bfdbfe] rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer gap-3 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0038F8] group-hover:bg-[#0038F8] group-hover:text-white transition-colors flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck size={16} />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-[#0038F8] transition-colors">
                      {reaudit.name}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {reaudit.date}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1">
                        <User size={12} /> {reaudit.auditor}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-none">
                  <div className="flex flex-col hidden sm:flex shrink-0 items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Złamane Kryt.
                    </span>
                    <span className="text-[16px] font-extrabold text-slate-700 text-center">
                      {reaudit.brokenCriteria}
                    </span>
                  </div>

                  <div className="hidden sm:flex shrink-0 items-center justify-center">
                    <Badge
                      variant={
                        reaudit.status === "Zakończony" ? "success" : "warning"
                      }
                      className="!py-1 !px-3 !text-[11px]"
                    >
                      {reaudit.status}
                    </Badge>
                  </div>

                  <div className="flex shrink-0 items-center justify-end">
                    <div className="flex items-center gap-4 bg-white px-3 py-1.5 rounded-lg border border-blue-100/50">
                      <div
                        className="relative group/tip flex items-center gap-1.5 cursor-help"
                        title={`Błędy priorytetowe: ${reaudit.critical || 0}`}
                      >
                        <AlertOctagon size={14} className="text-red-500" />
                        <span className="text-[15px] font-black text-slate-800">
                          {reaudit.critical || 0}
                        </span>
                        <div
                          role="tooltip"
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                        >
                          Błędy priorytetowe: {reaudit.critical || 0}
                          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                        </div>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
                          Zgodność:
                        </span>
                        <span
                          className={`text-[15px] font-black ${
                            reaudit.score >= 80
                              ? "text-emerald-600"
                              : "text-amber-500"
                          }`}
                        >
                          {reaudit.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 flex justify-end shrink-0 hidden sm:flex ml-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 group-hover:text-[#0038F8] group-hover:bg-blue-50 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {detailLevel >= 2 && audit.views.length > 0 && (
        <div className="bg-slate-50/50 flex flex-col p-4 gap-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 mb-1">
            Widoki w audycie
          </h4>
          {visibleViews.map((view) => (
            <AuditViewNode
              key={view.id}
              view={view}
              detailLevel={detailLevel}
            />
          ))}
          <ShowMoreToggle
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            total={audit.views.length}
            visibleCount={3}
            label="widoków"
          />
        </div>
      )}
    </Card>
  );
}

function AuditViewNode({ view, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const visibleErrors = view.errors
    ? expanded
      ? view.errors
      : view.errors.slice(0, 2)
    : [];

  return (
    <div
      data-testid="audit-view-node"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
    >
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3 flex-1">
          <ChevronRightSquare
            size={16}
            className="text-slate-400 flex-shrink-0"
          />
          <div>
            <h3 className="text-[14px] font-bold text-slate-800 leading-snug">
              {view.name}
            </h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-24 sm:w-28 hidden sm:flex shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Złamane Kryt.
            </span>
            <span className="text-sm font-extrabold text-slate-700">
              {view.errors?.length || 0}
            </span>
          </div>
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Błędy w widoku
            </span>
            <PriorityStats {...view.priorities} />
          </div>
          <div className="w-auto sm:w-28 flex justify-end shrink-0">
            <div className="flex flex-col items-end w-full">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
                Dostępność
              </span>
              <span
                className={`text-sm font-extrabold ${
                  view.score >= 80
                    ? "text-emerald-600"
                    : view.score >= 60
                    ? "text-amber-500"
                    : "text-red-500"
                }`}
              >
                {view.score.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {detailLevel >= 3 && view.errors && view.errors.length > 0 && (
        <div className="bg-slate-50/80 border-t border-slate-100 p-3 pl-4 sm:pl-12 flex flex-col gap-2">
          {visibleErrors.map((err) => (
            <div
              key={err.id}
              className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-start gap-3 shadow-sm"
            >
              <Bug
                size={14}
                className="text-slate-400 mt-1 flex-shrink-0 hidden sm:block"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13px] text-slate-900 mb-0.5 truncate leading-snug">
                  {err.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Kryterium:{" "}
                  <span className="font-semibold">{err.criteria}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-end sm:items-center">
                <Badge variant="neutral" className="!py-0.5 !text-[10px]">
                  Status: {err.status}
                </Badge>
                <PriorityBadge priority={err.priority} size="small" />
              </div>
            </div>
          ))}
          <ShowMoreToggle
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            total={view.errors.length}
            visibleCount={2}
            label="błędów"
          />
        </div>
      )}
    </div>
  );
}

function AuditErrorsReportView() {
  const [sortBy, setSortBy] = useState("date_desc");
  const [visibleCount, setVisibleCount] = useState(10);

  const data = useMemo(() => genFlatErrors(30, "AUD_ERR_"), []);

  return (
    <div
      data-testid="audit-errors-report-view"
      className="w-full"
    >
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4 border-slate-200">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bug size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Znalezionych błędów
            </div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {data.length}
            </div>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-center border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Rozbicie na priorytety
          </div>
          <PriorityStats c={12} w={48} m={60} />
        </Card>
        <Card className="p-4 flex flex-col justify-center border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Najczęstsze kryterium
          </div>
          <div className="text-sm font-bold text-slate-800 truncate">
            1.4.3 Kontrast (Minimalny)
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-center border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Kanały z błędami
          </div>
          <div className="flex gap-2 mt-1">
            <Badge variant="neutral" className="!text-[10px] !py-0.5">
              WWW: 80%
            </Badge>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-4 py-4 w-[5%]"></th>
                <th className="px-4 py-4 w-[25%]">Błąd i Kryterium</th>
                <th className="px-4 py-4 w-[25%]">
                  Pochodzenie (Audyt / Widok)
                </th>
                <th className="px-4 py-4 w-[10%]">Priorytet</th>
                <th className="px-4 py-4 w-[10%]">Kanały</th>
                <th className="px-4 py-4 w-[10%]">Znaleziono</th>
                <th className="px-4 py-4 w-[15%]">Status Audytu</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {data.slice(0, visibleCount).map((err) => (
                <AuditErrorTableRow key={err.id} data={err} />
              ))}
            </tbody>
          </table>

          {visibleCount < data.length && (
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setVisibleCount((v) => v + 10)}
                className="w-full py-3 text-[13px] font-bold text-[#0038F8] bg-white border border-[#0038F8]/20 hover:bg-[#0038F8]/5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Wczytaj więcej błędów ({data.length - visibleCount} z{" "}
                {data.length} ukrytych)
                <ChevronDown size={16} />
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function AuditErrorTableRow({ data }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <tr
        data-testid="audit-error-table-row"
        onClick={handleToggle}
        className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
      >
        <td className="px-4 py-4 text-slate-400 group-hover:text-[#0038F8]">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </td>
        <td className="px-4 py-4">
          <div className="font-bold text-slate-900 mb-1 leading-snug pr-4 line-clamp-2">
            {data.problem}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded">
            {data.criteria}
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <ClipboardCheck
                size={12}
                className="text-[#0038F8] flex-shrink-0"
              />
              <span className="font-bold text-slate-700 truncate">
                {data.auditName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pl-3 mt-1">
              <ChevronRightSquare
                size={10}
                className="text-slate-400 flex-shrink-0"
              />
              <span className="font-medium text-slate-600 truncate">
                {data.auditViewName}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">{PriorityBadge({ priority: data.priority })}</td>
        <td className="px-4 py-4">
          <div className="flex flex-wrap gap-1">
            {data.channels.map((ch, i) => (
              <span
                key={i}
                className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm"
              >
                {ch}
              </span>
            ))}
          </div>
        </td>
        <td className="px-4 py-4 font-semibold text-slate-700 whitespace-nowrap">
          {data.dateFound}
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-col gap-1.5">
            <Badge
              variant={
                data.auditStatus === "Zakończony" ? "success" : "warning"
              }
              className="!py-0.5 !text-[10px] w-max"
            >
              Status: {data.auditStatus}
            </Badge>
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <Calendar size={10} /> {data.auditStart}
            </span>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50 border-b-2 border-[#0038F8]/20">
          <td></td>
          <td colSpan={6} className="px-4 py-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" /> Opis
                  Problemu
                </h4>
                <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  {data.problem}
                </p>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                  Rekomendacja / Wskazówki
                </h4>
                <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                  {data.recommendation}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-[#0038F8]/10">
              <button
                type="button"
                onClick={handleToggle}
                className="text-[#0038F8] hover:text-[#002ECC] font-bold text-[12px] flex items-center gap-1.5 bg-[#0038F8]/5 hover:bg-[#0038F8]/10 px-4 py-2 rounded-lg transition-colors"
              >
                <ChevronUp size={16} /> Zwiń szczegóły błędu
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ==========================================
// RAPORT OPERACYJNY (DOSTĘPNOŚĆ USŁUG)
// ==========================================

function OperationalReport() {
  const [detailLevel, setDetailLevel] = useState(3);
  const [sortBy, setSortBy] = useState("name");
  const data = mockSharedServicesData;

  return (
    <div
      data-testid="operational-report"
      className="w-full"
    >
      {/* Pasek wyników, sortowania i zagnieżdżenia - spójny z Audytami i Skargami */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-sm font-bold text-slate-700">
            Wyniki: <span className="text-[#0038F8] font-black">{data.length}</span> usług
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
            <CheckCircle2 size={12} /> Zakres: 6 usług • 18 procesów • Śr. zgodność 82.4%
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Sortuj:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 cursor-pointer shadow-sm"
            >
              <option value="name">Alfabetycznie po nazwie usługi</option>
              <option value="score_desc">
                Dostępność usług malejąco (Najlepsze)
              </option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Zagnieżdżenie:</span>
            <select
              value={detailLevel}
              onChange={(e) => setDetailLevel(Number(e.target.value))}
              className="bg-white border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 cursor-pointer shadow-sm"
            >
              <option value={1}>1. Tylko Usługi (Ogólne podsumowanie)</option>
              <option value={2}>2. Usługi + Procesy</option>
              <option value={3}>3. Usługi + Procesy + Widoki</option>
              <option value={4}>
                4. Pełen wykaz (wraz ze szczegółami błędów)
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {data.map((service) => (
          <ServiceNode
            key={service.id}
            service={service}
            detailLevel={detailLevel}
          />
        ))}
      </div>
    </div>
  );
}

function ServiceNode({ service, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const visibleProcesses = expanded
    ? service.processes
    : service.processes.slice(0, 2);

  return (
    <Card
      data-testid="service-node"
      className="overflow-hidden border border-slate-200 shadow-sm"
    >
      <div className="bg-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
            <Library size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Usługa
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
              {service.name}
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 md:mt-0">
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Struktura
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {service.stats.processes} procesów • {service.stats.views}/
              {service.stats.totalViews} widoków
            </span>
          </div>
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Błędy w usłudze
            </span>
            <PriorityStats {...service.stats.priorities} />
          </div>
          <div className="w-auto sm:w-28 flex justify-end shrink-0">
            <div className="flex flex-col items-end w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
                Dostępność Usługi
              </span>
              <span className={`text-sm font-bold ${
                service.stats.score >= 80 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {service.stats.score.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {detailLevel >= 2 && service.processes.length > 0 && (
        <div className="bg-slate-50/50 flex flex-col p-4 gap-4">
          {visibleProcesses.map((p) => (
            <ProcessNode key={p.id} process={p} detailLevel={detailLevel} />
          ))}
          <ShowMoreToggle
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            total={service.processes.length}
            visibleCount={2}
            label="procesy"
          />
        </div>
      )}
    </Card>
  );
}

function ProcessNode({ process, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const visibleViews = expanded ? process.views : process.views.slice(0, 3);

  return (
    <div
      data-testid="process-node"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
    >
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <ChevronRightSquare size={16} className="text-[#0038F8]" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Proces
            </span>
            <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-800 leading-snug">
              {process.name}
            </h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Widoki
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {process.views.length} przypisanych
            </span>
          </div>
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Błędy
            </span>
            <PriorityStats {...process.stats.priorities} />
          </div>
          <div className="w-auto sm:w-28 flex justify-end shrink-0">
            <div className="flex flex-col items-end w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
                Dostępność
              </span>
              <span className="text-xs font-bold text-amber-600">
                {process.stats.score.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {detailLevel >= 3 && process.views.length > 0 && (
        <div className="flex flex-col divide-y divide-slate-100 bg-slate-50/30">
          {visibleViews.map((v) => (
            <ViewNode key={v.id} view={v} detailLevel={detailLevel} />
          ))}
          <ShowMoreToggle
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            total={process.views.length}
            visibleCount={3}
            label="widoków"
          />
        </div>
      )}
    </div>
  );
}

function ViewNode({ view, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const visibleErrors = view.errors
    ? expanded
      ? view.errors
      : view.errors.slice(0, 2)
    : [];

  return (
    <div
      data-testid="view-node"
      className="flex flex-col"
    >
      <div className="p-3 pl-4 sm:pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
        <div className="flex flex-col flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span title={`Widok: ${view.name}`}>
              <Layout size={14} className="text-slate-400 flex-shrink-0" />
            </span>
            <span className="font-bold text-[14px] text-slate-800 leading-snug">
              {view.name}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium" title={`Kanał: ${view.channel}`}>
            Kanał: {view.channel}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            {/* Pusta kolumna dla utrzymania siatki */}
          </div>
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Błędy
            </span>
            <PriorityStats {...view.priorities} />
          </div>
          <div className="w-auto sm:w-28 flex justify-end shrink-0">
            <div className="flex flex-col items-end w-full">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
                Dostępność
              </span>
              <span className="text-sm font-extrabold text-emerald-600">
                {view.score.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {detailLevel >= 4 && view.errors && view.errors.length > 0 && (
        <div className="pl-4 sm:pl-[52px] pr-4 pb-3 flex flex-col gap-2">
          {visibleErrors.map((err) => (
            <div
              key={err.id}
              className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-start gap-3 shadow-sm"
            >
              <span className="text-xs font-bold text-slate-400 mt-0.5 hidden sm:block">
                {err.id}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13px] text-slate-900 mb-0.5 truncate leading-snug">
                  {err.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Kryterium: {err.criteria}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-end sm:items-center">
                <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-1 rounded">
                  {err.status}
                </span>
                <PriorityBadge priority={err.priority} size="small" />
              </div>
            </div>
          ))}
          <ShowMoreToggle
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            total={view.errors.length}
            visibleCount={2}
            label="błędów"
          />
        </div>
      )}
    </div>
  );
}

// ==========================================
// RAPORT POSTĘPÓW
// ==========================================

function ProgressReport() {
  const data = mockSharedServicesData;

  return (
    <div
      data-testid="progress-report"
      className="w-full"
    >
      <Card className="mb-6 p-4 flex flex-col md:flex-row items-end md:items-center gap-4 sm:gap-6 bg-white border-slate-200">
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Filtruj po usłudze
          </label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50">
            <option value="all">Wszystkie usługi</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Filtruj po procesie
          </label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50">
            <option value="all">Wszystkie procesy</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Sortowanie wyników
          </label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50">
            <option value="service_asc">
              Alfabetycznie po nazwie usługi (A-Z)
            </option>
          </select>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        {data.map((service) => (
          <ProgressServiceNode key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

function ProgressServiceNode({ service }) {
  return (
    <Card
      data-testid="progress-service-node"
      className="overflow-hidden border border-slate-200 shadow-sm"
    >
      <div className="bg-slate-50 p-4 sm:p-5 sm:pr-8 lg:pr-10 flex items-center gap-3 border-b border-slate-200">
        <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
          <Library size={16} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
            Usługa
          </span>
          <h2 className="text-[15px] sm:text-[16px] font-extrabold text-slate-900 leading-snug">
            {service.name}
          </h2>
        </div>
      </div>
      <div className="flex flex-col divide-y divide-slate-100 bg-white">
        {service.processes.map((p) => (
          <ProgressProcessNode key={p.id} process={p} />
        ))}
      </div>
    </Card>
  );
}

function ProgressProcessNode({ process }) {
  return (
    <div
      data-testid="progress-process-node"
      className="p-4 sm:p-5 sm:pr-8 lg:pr-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
    >
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-[250px]">
        <ChevronRightSquare
          size={16}
          className="text-[#0038F8] flex-shrink-0 mt-0.5 sm:mt-0"
        />
        <div>
          <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-800 leading-snug mb-0.5">
            {process.name}
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            {process.views.length} przypisanych widoków
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-8 w-full lg:w-auto mt-2 lg:mt-0 pt-3 lg:pt-0 border-t border-slate-100 lg:border-none">
        <div className="flex items-center gap-4 sm:gap-6">
          {process.history.map((h, i) => {
            const colorClass =
              h.score >= 80
                ? "text-emerald-600"
                : h.score >= 60
                ? "text-amber-500"
                : "text-red-500";
            return (
              <div key={i} className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  {h.date}
                </span>
                <span
                  className={`text-[13px] sm:text-[15px] font-extrabold ${colorClass}`}
                >
                  {h.score.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-[120px] hidden sm:flex justify-center border-l border-slate-100 pl-6 ml-2">
          <SparklineChart data={process.history} />
        </div>
      </div>
    </div>
  );
}

function SparklineChart({ data }) {
  if (!data || data.length === 0) return null;
  const width = 120;
  const height = 40;
  const min = 0;
  const max = 100;
  const stepX = width / Math.max(data.length - 1, 1);
  const points = data
    .map(
      (d, i) =>
        `${i * stepX},${height - ((d.score - min) / (max - min)) * height}`
    )
    .join(" ");

  return (
    <div
      data-testid="sparkline-chart"
      className="flex flex-col items-center justify-center relative group"
      title="Trend zmian w czasie"
    >
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke="#0038F8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70 group-hover:opacity-100 transition-opacity"
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={i * stepX}
            cy={height - ((d.score - min) / (max - min)) * height}
            r="4"
            fill="white"
            stroke="#0038F8"
            strokeWidth="2"
            className="transition-all duration-300 hover:r-[6px] hover:fill-[#0038F8] cursor-pointer"
          >
            <title>
              {d.date}: {d.score.toFixed(1)}%
            </title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

// ==========================================
// RAPORT BŁĘDÓW W USŁUGACH
// ==========================================

function ServicesErrorReport() {
  const [sortBy, setSortBy] = useState("priority_desc");
  const [visibleCount, setVisibleCount] = useState(10);

  const data = useMemo(() => genFlatErrors(40, "SRV_ERR_"), []);

  return (
    <div className="w-full">
      <Card className="mb-6 p-4 flex flex-col md:flex-row items-end md:items-center gap-4 sm:gap-6 bg-white border-slate-200">
        <div className="flex-1 w-full max-w-sm">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Sortowanie wyników
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
          >
            <option value="priority_desc">Od najwyższego priorytetu</option>
            <option value="date_desc">Data dodania (najnowsze)</option>
            <option value="service_asc">Alfabetycznie po nazwie usługi</option>
          </select>
        </div>
        <div className="flex-1 text-sm text-slate-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-start sm:items-center gap-2 w-full mt-2 md:mt-0">
          <AlertCircle
            size={16}
            className="text-[#0038F8] flex-shrink-0 mt-0.5 sm:mt-0"
          />
          <span>
            Szczegółowe filtry znajdziesz w lewym panelu. Kliknij wiersz w
            tabeli, aby przeczytać pełną rekomendację.
          </span>
        </div>
      </Card>

      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="p-4 w-[5%]"></th>
                <th className="p-4 w-[25%]">Błąd i Kryterium</th>
                <th className="p-4 w-[25%]">
                  Lokalizacja (Usługa / Proces / Widok)
                </th>
                <th className="p-4 w-[15%]">Audyt</th>
                <th className="p-4 w-[10%]">Kanał</th>
                <th className="p-4 w-[10%]">Priorytet</th>
                <th className="p-4 w-[10%]">Data wykrycia</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {data.slice(0, visibleCount).map((err) => (
                <ServiceErrorTableRow key={err.id} data={err} />
              ))}
            </tbody>
          </table>

          {visibleCount < data.length && (
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setVisibleCount((v) => v + 15)}
                className="w-full py-3 text-[13px] font-bold text-[#0038F8] bg-white border border-[#0038F8]/20 hover:bg-[#0038F8]/5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Pokaż kolejne 15 błędów (Łącznie: {data.length})
                <ChevronDown size={16} />
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function ServiceErrorTableRow({ data }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <tr
        onClick={handleToggle}
        className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
      >
        <td className="p-4 text-slate-400 group-hover:text-[#0038F8]">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </td>
        <td className="p-4">
          <div className="font-bold text-slate-900 mb-1 leading-snug pr-4 line-clamp-2">
            {data.problem}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">
            {data.criteria}
          </div>
        </td>
        <td className="p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Library size={12} className="text-slate-400 flex-shrink-0" />
              <span className="font-semibold text-slate-700 truncate">
                {data.serviceName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pl-3">
              <div className="w-px h-3 bg-slate-300"></div>
              <ChevronRightSquare
                size={10}
                className="text-slate-400 flex-shrink-0"
              />
              <span className="font-medium text-slate-600 truncate">
                {data.processName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pl-6">
              <div className="w-px h-3 bg-slate-300"></div>
              <Layout size={10} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-500 truncate">
                {data.serviceViewName}
              </span>
            </div>
          </div>
        </td>
        <td className="px-5 py-4">
          <div className="text-slate-600 font-medium truncate mb-1">
            {data.auditViewName}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Nazwa z audytu
          </div>
        </td>
        <td className="px-5 py-4">
          <div className="flex flex-col gap-1">
            {data.channels.map((ch, i) => (
              <span
                key={i}
                className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm w-max"
              >
                {ch}
              </span>
            ))}
          </div>
        </td>
        <td className="px-5 py-4">{PriorityBadge({ priority: data.priority })}</td>
        <td className="px-5 py-4 font-semibold text-slate-700 whitespace-nowrap">
          {data.dateFound}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50 border-b-2 border-[#0038F8]/20">
          <td></td>
          <td colSpan={6} className="px-5 py-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" /> Opis
                  Problemu
                </h4>
                <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  {data.problem}
                </p>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                  Rekomendacja / Wskazówki
                </h4>
                <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                  {data.recommendation}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-[#0038F8]/10">
              <button
                type="button"
                onClick={handleToggle}
                className="text-[#0038F8] hover:text-[#002ECC] font-bold text-[12px] flex items-center gap-1.5 bg-[#0038F8]/5 hover:bg-[#0038F8]/10 px-4 py-2 rounded-lg transition-colors"
              >
                <ChevronUp size={16} /> Zwiń szczegóły błędu
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ==========================================
// RAPORT ZARZĄDCZY (DASHBOARD)
// ==========================================

function ManagementReport() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#0038F8] flex-shrink-0" />
          <span className="font-medium whitespace-nowrap">Kontekst:</span>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-2">
          <Badge variant="lightBlue" className="!py-0.5 !text-[11px]">
            Wszystkie Usługi
          </Badge>
          <Badge variant="lightBlue" className="!py-0.5 !text-[11px]">
            Kanał: WWW, Aplikacja
          </Badge>
          <Badge variant="lightBlue" className="!py-0.5 !text-[11px]">
            Okres: Ostatnie 12 miesięcy
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <Badge variant="success">
              +2.4% r/r
            </Badge>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Średnia Dostępność
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              86.2%
            </span>
            <span className="text-sm font-semibold text-slate-400">
              Cel: 90%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0038F8]/10 text-[#0038F8] flex items-center justify-center">
              <ListChecks size={24} />
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 bg-slate-100 px-2 py-0.5 rounded">
              142 procesy
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Pokrycie Audytowe
          </span>
          <span className="text-3xl font-extrabold text-slate-900">92.0%</span>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <AlertOctagon size={24} />
            </div>
            <Badge variant="danger">
              +12 m/m
            </Badge>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Priorytetowe Błędy Otwarte
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">47</span>
            <span className="text-sm font-semibold text-red-500">
              Wymaga akcji!
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded mt-1">
              SLA -15%
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Błędy po terminie naprawy
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">24</span>
            <span className="text-sm font-semibold text-slate-400">
              Śr. opóźnienie: 12 dni
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 sm:p-6 flex flex-col h-[340px] sm:h-[380px] lg:col-span-2">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Trend dostępności vs Błędy w czasie
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Ostatnie 12 miesięcy
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="flex flex-1 min-h-0 mt-2">
            <div className="w-8 shrink-0 flex flex-col justify-between items-end pb-8 pt-12 pr-2 text-[10px] font-bold text-slate-400 border-r border-slate-200 z-10 bg-white">
              <span className="leading-none">100</span>
              <span className="leading-none">50</span>
              <span className="leading-none translate-y-1">0</span>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-end gap-1 sm:gap-2 border-b border-slate-200 pt-12 px-2 sm:px-4">
                {chartTrendData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 flex justify-center items-end h-full relative group"
                  >
                    <div
                      className="w-full max-w-[32px] bg-[#0038F8]/20 group-hover:bg-[#0038F8]/30 transition-colors rounded-t-md relative z-10 flex items-start justify-center"
                      style={{ height: `${val.s}%` }}
                    >
                      <div className="absolute -top-1.5 w-2 h-2 rounded-full bg-[#0038F8] border-2 border-white"></div>
                    </div>
                    <div
                      className="absolute bottom-0 w-1/2 max-w-[16px] bg-red-100 group-hover:bg-red-200 transition-colors rounded-t-sm"
                      style={{ height: `${val.e}%` }}
                    ></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded z-20 whitespace-nowrap pointer-events-none hidden sm:block shadow-lg">
                      Dostępność: {val.s}% | Błędy: {val.e}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-8 flex items-start gap-1 sm:gap-2 w-full shrink-0 pt-2 px-2 sm:px-4">
                {chartTrendData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-[10px] sm:text-[11px] font-bold text-slate-500"
                  >
                    {val.m}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-2 shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <div className="w-3 h-3 rounded-full bg-[#0038F8]"></div> %
              Dostępności
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <div className="w-3 h-3 rounded bg-red-200"></div> Liczba nowych
              błędów
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">
              Zgodność według kanałów
            </h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>WWW</span> <span>94%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: "94%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Aplikacja mobilna (iOS)</span> <span>82%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#0038F8] h-full rounded-full"
                  style={{ width: "82%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Aplikacja mobilna (Android)</span> <span>78%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#0038F8] h-full rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Dokumenty (PDF/DOC)</span> <span>45%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Status błędów według zespołów
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Kto odpowiada za wdrożenia poprawek?
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { team: "Frontend Squad A", done: 60, inProg: 20, open: 5 },
              { team: "Mobile Team (iOS)", done: 30, inProg: 40, open: 15 },
              { team: "Vendor: E-Dokumenty", done: 10, inProg: 10, open: 50 },
              { team: "Vendor: Platforma X", done: 40, inProg: 15, open: 20 },
            ].map((t, i) => {
              const total = t.done + t.inProg + t.open;
              const pDone = (t.done / total) * 100;
              const pProg = (t.inProg / total) * 100;
              const pOpen = (t.open / total) * 100;

              return (
                <div key={i}>
                  <div className="flex justify-between text-[13px] font-bold text-slate-700 mb-1.5">
                    <span>{t.team}</span>
                    <span className="text-slate-500">Suma: {total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 flex overflow-hidden group cursor-pointer">
                    <div
                      className="bg-emerald-500 h-full transition-opacity group-hover:opacity-90"
                      style={{ width: `${pDone}%` }}
                      title={`Naprawione: ${t.done}`}
                    ></div>
                    <div
                      className="bg-amber-400 h-full transition-opacity group-hover:opacity-90 border-l border-white"
                      style={{ width: `${pProg}%` }}
                      title={`W naprawie: ${t.inProg}`}
                    ></div>
                    <div
                      className="bg-red-500 h-full transition-opacity group-hover:opacity-90 border-l border-white"
                      style={{ width: `${pOpen}%` }}
                      title={`Nowe/Do podjęcia: ${t.open}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-start gap-4 mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <div className="w-2.5 h-2.5 rounded bg-emerald-500"></div>{" "}
              Naprawione
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <div className="w-2.5 h-2.5 rounded bg-amber-400"></div> W
              naprawie
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <div className="w-2.5 h-2.5 rounded bg-red-500"></div> Nowe
              (Otwarte)
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Usługi wymagające uwagi (Top 5)
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Usługi o najniższym procencie dostępności
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { name: "Kredyt hipoteczny (Kalkulator)", score: 42.5, err: 54 },
              { name: "Otwarcie rachunku firmowego", score: 58.2, err: 32 },
              { name: "Panel wymiany walut (Kantor)", score: 64.0, err: 28 },
              { name: "Proces reklamacyjny", score: 68.5, err: 21 },
              { name: "Usługi płatnicze - BLIK", score: 72.1, err: 15 },
            ].map((u, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-800">
                      {u.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">
                      {u.err} aktywnych błędów
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    u.score < 50
                      ? "danger"
                      : u.score < 70
                      ? "warning"
                      : "success"
                  }
                  className="w-16 justify-center !py-1"
                >
                  {u.score}%
                </Badge>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-[13px] font-bold text-[#0038F8] hover:bg-[#0038F8]/5 py-2.5 rounded-xl transition-colors">
            Zobacz pełny ranking
          </button>
        </Card>
      </div>

      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Rejestr Ryzyka: Błędy Priorytetowe po terminie SLA
            </h3>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              Błędy najwyższego priorytetu, które przekroczyły deklarowany czas
              naprawy.
            </span>
          </div>
          <button className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold transition-colors text-sm border border-red-100 w-full sm:w-auto">
            <ShieldAlert size={16} /> Eskaluj do właścicieli
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Opis błędu</th>
                <th className="px-6 py-4">Lokalizacja</th>
                <th className="px-6 py-4">Zespół / Właściciel</th>
                <th className="px-6 py-4">Termin SLA</th>
                <th className="px-6 py-4 text-right">Opóźnienie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              <tr className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">
                  Brak możliwości przejścia formularza za pomocą klawiatury.
                  (Krok 2)
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  Kredyt hipoteczny / Wniosek
                </td>
                <td className="px-6 py-4">
                  <Badge variant="neutral" className="!py-0.5">
                    Vendor: Platforma X
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-600">10.02.2024</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-red-600 font-extrabold bg-red-50 px-2 py-1 rounded">
                    -34 dni
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">
                  Dokument PDF z regulaminem nie jest tagowany (całkowicie
                  niedostępny).
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  Otwarcie ROR / Dokumenty
                </td>
                <td className="px-6 py-4">
                  <Badge variant="neutral" className="!py-0.5">
                    Vendor: E-Dokumenty
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-600">01.03.2024</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-red-600 font-extrabold bg-red-50 px-2 py-1 rounded">
                    -16 dni
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">
                  Pola do wpisania kodu SMS nie mają przypisanych etykiet dla
                  czytników.
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  Przelew krajowy / Autoryzacja
                </td>
                <td className="px-6 py-4">
                  <Badge variant="neutral" className="!py-0.5">
                    Mobile Team (iOS)
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-600">10.03.2024</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-red-600 font-extrabold bg-red-50 px-2 py-1 rounded">
                    -7 dni
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ==========================================
// NOWY RAPORT: RAPORT REGULACYJNY (PAD)
// ==========================================

function RegulatoryReportView() {
  const [sortBy, setSortBy] = useState("compliance_desc");

  const mockRegulatoryData = [
    {
      id: "r1",
      name: "Strona główna i serwis informacyjny (ing.pl)",
      type: "Serwis WWW",
      compliance: "Częściowo zgodna",
      lastAudit: "12.03.2024",
      declarationStatus: "Aktualna",
    },
    {
      id: "r2",
      name: "Aplikacja mobilna Moje ING (Android)",
      type: "Aplikacja mobilna",
      compliance: "Częściowo zgodna",
      lastAudit: "15.02.2024",
      declarationStatus: "Wymaga aktualizacji",
    },
    {
      id: "r3",
      name: "Kalkulator Kredytowy",
      type: "Moduł WWW",
      compliance: "Zgodna",
      lastAudit: "05.01.2024",
      declarationStatus: "Aktualna",
    },
    {
      id: "r4",
      name: "Platforma Wymiany Walut (Kantor)",
      type: "Serwis WWW",
      compliance: "Niezgodna",
      lastAudit: "10.11.2023",
      declarationStatus: "Przeterminowana",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Pasek Informacyjny EAA / PAD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0038F8] flex items-center justify-center flex-shrink-0">
          <Scale size={20} />
        </div>
        <div>
          <span className="font-bold block mb-0.5">
            Wymogi Ustawy o dostępności cyfrowej i EAA
          </span>
          <span className="text-slate-500 hidden sm:inline">
            Raport ten służy do monitorowania statusu formalno-prawnego usług,
            terminów ustawowych audytów oraz aktualności Deklaracji Dostępności
            (wymaganej aktualizacji do 31 marca każdego roku).
          </span>
        </div>
      </div>

      {/* RZĄD 1: KPI Ustawowe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 bg-slate-100 px-2 py-0.5 rounded">
              Suma: 24
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Usługi W Pełni Zgodne
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">8</span>
            <span className="text-sm font-semibold text-slate-400">(33%)</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Częściowo Zgodne
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">12</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <XCircle size={24} />
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Niezgodne Ustawowo
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">4</span>
            <span className="text-sm font-semibold text-red-500 hidden sm:block">
              Ryzyko kar!
            </span>
          </div>
        </Card>
      </div>

      {/* RZĄD 2: Deklaracje Dostępności */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deklaracje - Status */}
        <Card className="p-4 sm:p-6 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">
              Deklaracje Dostępności
            </h3>
            <FileSignature size={20} className="text-slate-400" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>{" "}
                Aktualne (2024)
              </div>
              <span className="font-extrabold text-slate-900">15</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div> Do
                aktualizacji
              </div>
              <span className="font-extrabold text-slate-900">5</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Brak /
                Stare
              </div>
              <span className="font-extrabold text-slate-900">4</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 mt-6 flex overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-opacity hover:opacity-90"
              style={{ width: "62.5%" }}
            ></div>
            <div
              className="bg-amber-500 h-full transition-opacity hover:opacity-90 border-l border-white"
              style={{ width: "20.8%" }}
            ></div>
            <div
              className="bg-red-500 h-full transition-opacity hover:opacity-90 border-l border-white"
              style={{ width: "16.7%" }}
            ></div>
          </div>
        </Card>

        {/* Informacje Ostrzegawcze / Akcje */}
        <Card className="p-4 sm:p-6 lg:col-span-2 flex flex-col justify-center bg-blue-50/50 border-blue-100">
          <div className="flex items-start gap-4 mb-6">
            <Landmark size={24} className="text-[#0038F8] mt-1 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-[#0038F8] mb-2">
                Raportowanie do ministerstwa
              </h3>
              <p className="text-[13px] sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                Zgodnie z obowiązującym prawem, do końca I kwartału należy
                zaktualizować status Deklaracji Dostępności dla wszystkich domen
                i aplikacji mobilnych.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto">
            <button className="flex justify-center items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm">
              <Download size={16} /> Pobierz raport prawny
            </button>
            <button className="flex justify-center items-center gap-2 bg-white border border-[#0038F8]/20 text-[#0038F8] hover:bg-[#0038F8]/5 w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm">
              <FileText size={16} /> Generuj XML Deklaracji
            </button>
          </div>
        </Card>
      </div>

      {/* RZĄD 3: Wykaz Zgodności (Tabela) */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between bg-white gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Rejestr Zgodności Usług
            </h3>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              Oficjalny status prawny w odniesieniu do Ustawy o dostępności
              cyfrowej.
            </span>
          </div>
          <div className="w-full sm:w-[300px]">
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="compliance_desc">Od Niezgodnych</option>
              <option value="name_asc">Nazwa Usługi (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-4 sm:px-6 py-4">Nazwa Usługi / Kanał</th>
                <th className="px-4 sm:px-6 py-4">Zgodność z Ustawą</th>
                <th className="px-4 sm:px-6 py-4 text-center">Ostatni Audyt</th>
                <th className="px-4 sm:px-6 py-4">Deklaracja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {mockRegulatoryData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="font-bold text-slate-900 mb-1">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">
                      {item.type}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <Badge
                      variant={
                        item.compliance === "Zgodna"
                          ? "success"
                          : item.compliance === "Częściowo zgodna"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {item.compliance}
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <div className="font-semibold text-slate-700 mb-0.5">
                      {item.lastAudit}
                    </div>
                    {item.compliance === "Niezgodna" && (
                      <span className="text-[10px] text-red-500 font-bold block">
                        Nowy przegląd!
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.declarationStatus === "Aktualna" ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                      <span
                        className={`font-bold ${
                          item.declarationStatus === "Aktualna"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.declarationStatus}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ==========================================
// MODUŁ REKLAMACJI I REKOMENDACJI WCAG (KOMPONENTY)
// ==========================================

function ComplaintsModuleView({
  setView,
  complaintsList,
  setSelectedComplaintId,
  tickets = [],
  onOpenTicket,
  showToast,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [devTeamFilter, setDevTeamFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Bezpieczne zamykanie dropdownu przy kliknięciu poza niego (identycznie jak w Audytach)
  useEffect(() => {
    if (!activeDropdown) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-dropdown-container]")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleClear = () => {
    setSearchTerm("");
    setSourceFilter("all");
    setDevTeamFilter("all");
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSelectedServices([]);
    setActiveDropdown(null);
  };

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    sourceFilter !== "all" ||
    devTeamFilter !== "all" ||
    selectedStatuses.length > 0 ||
    selectedPriorities.length > 0 ||
    selectedServices.length > 0
  );

  const activeFilterCount =
    (searchTerm.trim() ? 1 : 0) +
    (sourceFilter !== "all" ? 1 : 0) +
    (devTeamFilter !== "all" ? 1 : 0) +
    selectedStatuses.length +
    selectedPriorities.length +
    selectedServices.length;

  const filteredComplaints = useMemo(() => {
    let list = complaintsList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.process && item.process.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(item.status);

      const matchesPriority =
        selectedPriorities.length === 0 ||
        selectedPriorities.includes(item.priority) ||
        (selectedPriorities.includes("Priorytetowy") && item.priority === "Krytyczny");

      const matchesService =
        selectedServices.length === 0 || selectedServices.includes(item.service);

      const matchesDevTeam =
        devTeamFilter === "all" || (item.responsiblePerson || item.devTeam) === devTeamFilter;

      const matchesSource =
        sourceFilter === "all" || item.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesService && matchesDevTeam && matchesSource;
    });

    if (sortBy === "newest") {
      list.sort((a, b) => (b.id || "").localeCompare(a.id || ""));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => (a.id || "").localeCompare(b.id || ""));
    } else if (sortBy === "priority") {
      const pWeights = {
        "Krytyczny": 3,
        "Priorytetowy": 3,
        "Ważny": 2,
        "Marginalny": 1,
      };
      list.sort((a, b) => (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0));
    } else if (sortBy === "status") {
      list.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    }

    return list;
  }, [complaintsList, searchTerm, selectedStatuses, selectedPriorities, selectedServices, devTeamFilter, sourceFilter, sortBy]);

  const totalCount = complaintsList.length;
  const awaitingCount = complaintsList.filter(c => c.status === "Oczekuje na audytora" || !c.hasRecommendation).length;
  const readyCount = complaintsList.filter(c => c.status === "Gotowa rekomendacja").length;
  const inProgressCount = complaintsList.filter(c => c.status === "W trakcie wdrożenia" || c.status === "Przypisane do Dev").length;

  return (
    <div data-testid="complaints-module-view" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden">
      <ViewHeader
        breadcrumbs={[
          { label: "Pulpit", onClick: () => setView("przeglad") },
          { label: "Skargi i reklamacje" },
        ]}
        title="Moduł Skarg i reklamacji"
        subtitle="Zgłaszaj skargi i reklamacje dostępności od klientów, przypisuj zespoły deweloperskie i wdrażaj gotowe rekomendacje techniczne."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() =>
                showToast &&
                showToast(
                  "Eksport zgłoszeń (.xlsx)",
                  `Wygenerowano arkusz Excel z ${complaintsList.length} zgłoszeniami skarg, przypisanymi zespołami Dev i statusem poprawek.`
                )
              }
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
              title="Eksportuj zgłoszenia do pliku Excel"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>Eksport (.xlsx)</span>
            </button>
            <button
              onClick={() => setView("reklamacja-nowa")}
              className="flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus size={15} />
              <span>Nowe zgłoszenie</span>
            </button>
          </div>
        }
      />

      <div className="flex-1 md:overflow-y-auto bg-[#f8fafc] w-full">
        <div className="max-w-[1600px] mx-auto w-full p-4 sm:p-8 lg:p-12 flex flex-col gap-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wszystkie zgłoszenia</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <MessageSquare size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCount}</div>
        </Card>

        <Card className="p-4 border border-amber-200 bg-amber-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Oczekujące na audytora</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">{awaitingCount}</div>
        </Card>

        <Card className="p-4 border border-emerald-200 bg-emerald-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Gotowe rekomendacje</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{readyCount}</div>
        </Card>

        <Card className="p-4 border border-blue-200 bg-blue-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">W pracach Dev</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#0038F8]">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0038F8]">{inProgressCount}</div>
        </Card>
      </div>

      {/* Wyszukiwarka */}
      <div>
        <Input
          icon={Search}
          placeholder="Wyszukaj zgłoszenie po tytule, usłudze, procesie lub identyfikatorze #RKL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white shadow-xs"
        />
      </div>

      {/* POZIOME FILTRY DYNAMICZNE (Zgodne ze stylem Audytów) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs relative z-30">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-24 shrink-0 flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            <Filter size={14} className="text-[#0038F8]" />
            <span>Filtry:</span>
          </div>

          {/* 1. Źródło skargi */}
          <div className="relative" data-dropdown-container="true">
            <button
              type="button"
              onClick={() => toggleDropdown("source")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                sourceFilter !== "all"
                  ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span>1. Źródło{sourceFilter !== "all" ? `: ${sourceFilter}` : " skargi"}</span>
              <ChevronDown size={14} className={sourceFilter !== "all" ? "text-white" : "text-slate-400"} />
            </button>
            {activeDropdown === "source" && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1 max-h-72 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSourceFilter("all");
                    setActiveDropdown(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    sourceFilter === "all"
                      ? "bg-[#0038F8] text-white"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <span>Wszystkie źródła</span>
                  {sourceFilter === "all" && <CheckCircle2 size={13} className="text-white" />}
                </button>
                {COMPLAINT_SOURCES.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => {
                      setSourceFilter(src);
                      setActiveDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      sourceFilter === src
                        ? "bg-[#0038F8] text-white"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="truncate mr-2">{src}</span>
                    {sourceFilter === src && <CheckCircle2 size={13} className="text-white shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Osoba odpowiedzialna */}
          <div className="relative" data-dropdown-container="true">
            <button
              type="button"
              onClick={() => toggleDropdown("devTeam")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                devTeamFilter !== "all"
                  ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span>
                2. Osoba{devTeamFilter !== "all" ? `: ${devTeamFilter.split(" (")[0]}` : " odpowiedzialna"}
              </span>
              <ChevronDown size={14} className={devTeamFilter !== "all" ? "text-white" : "text-slate-400"} />
            </button>
            {activeDropdown === "devTeam" && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1 max-h-72 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setDevTeamFilter("all");
                    setActiveDropdown(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    devTeamFilter === "all"
                      ? "bg-[#0038F8] text-white"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <span>Wszyscy odpowiedzialni</span>
                  {devTeamFilter === "all" && <CheckCircle2 size={13} className="text-white" />}
                </button>
                {RESPONSIBLE_USERS_LIST.map((user) => (
                  <button
                    key={user}
                    type="button"
                    onClick={() => {
                      setDevTeamFilter(user);
                      setActiveDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      devTeamFilter === user
                        ? "bg-[#0038F8] text-white"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="truncate mr-2">{user}</span>
                    {devTeamFilter === user && <CheckCircle2 size={13} className="text-white shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Status skargi */}
          <div className="relative" data-dropdown-container="true">
            <button
              type="button"
              onClick={() => toggleDropdown("status")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                selectedStatuses.length > 0
                  ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span>3. Status{selectedStatuses.length === 1 ? `: ${selectedStatuses[0]}` : selectedStatuses.length > 1 ? ` (${selectedStatuses.length})` : ""}</span>
              <ChevronDown size={14} className={selectedStatuses.length > 0 ? "text-white" : "text-slate-400"} />
            </button>
            {activeDropdown === "status" && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1 max-h-72 overflow-y-auto">
                <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-slate-100 px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Wybierz statusy</span>
                  {selectedStatuses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedStatuses([])}
                      className="text-[#0038F8] hover:underline normal-case font-semibold cursor-pointer"
                    >
                      Wyczyść ({selectedStatuses.length})
                    </button>
                  )}
                </div>
                {COMPLAINT_STATUS_OPTIONS.map((opt) => {
                  const isChecked = selectedStatuses.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSelectedStatuses((prev) =>
                          prev.includes(opt.value)
                            ? prev.filter((s) => s !== opt.value)
                            : [...prev, opt.value]
                        );
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20 font-bold"
                          : "hover:bg-slate-50 text-slate-700 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 rounded text-[#0038F8] pointer-events-none accent-[#0038F8]"
                        />
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isChecked && <CheckCircle2 size={14} className="text-[#0038F8] shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Priorytet */}
          <div className="relative" data-dropdown-container="true">
            <button
              type="button"
              onClick={() => toggleDropdown("priority")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                selectedPriorities.length > 0
                  ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span>4. Priorytet{selectedPriorities.length === 1 ? `: ${selectedPriorities[0]}` : selectedPriorities.length > 1 ? ` (${selectedPriorities.length})` : ""}</span>
              <ChevronDown size={14} className={selectedPriorities.length > 0 ? "text-white" : "text-slate-400"} />
            </button>
            {activeDropdown === "priority" && (
              <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
                <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-slate-100 px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Wybierz priorytety</span>
                  {selectedPriorities.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedPriorities([])}
                      className="text-[#0038F8] hover:underline normal-case font-semibold cursor-pointer"
                    >
                      Wyczyść ({selectedPriorities.length})
                    </button>
                  )}
                </div>
                {["Priorytetowy", "Ważny", "Marginalny"].map((p) => {
                  const isChecked = selectedPriorities.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setSelectedPriorities((prev) =>
                          prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                        );
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20 font-bold"
                          : "hover:bg-slate-50 text-slate-700 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 rounded text-[#0038F8] pointer-events-none accent-[#0038F8]"
                        />
                        <span>{p}</span>
                      </div>
                      {isChecked && <CheckCircle2 size={14} className="text-[#0038F8] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Usługa */}
          <div className="relative" data-dropdown-container="true">
            <button
              type="button"
              onClick={() => toggleDropdown("service")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                selectedServices.length > 0
                  ? "bg-[#0038F8] text-white border-[#0038F8] shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span>5. Usługa{selectedServices.length === 1 ? `: ${selectedServices[0]}` : selectedServices.length > 1 ? ` (${selectedServices.length})` : ""}</span>
              <ChevronDown size={14} className={selectedServices.length > 0 ? "text-white" : "text-slate-400"} />
            </button>
            {activeDropdown === "service" && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
                <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-slate-100 px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Wybierz usługi</span>
                  {selectedServices.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedServices([])}
                      className="text-[#0038F8] hover:underline normal-case font-semibold cursor-pointer"
                    >
                      Wyczyść ({selectedServices.length})
                    </button>
                  )}
                </div>
                {["Bankowość internetowa", "Aplikacja mobilna", "Kredyty i pożyczki", "Karty i dokumenty"].map((s) => {
                  const isChecked = selectedServices.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSelectedServices((prev) =>
                          prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                        );
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20 font-bold"
                          : "hover:bg-slate-50 text-slate-700 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 rounded text-[#0038F8] pointer-events-none accent-[#0038F8]"
                        />
                        <span className="truncate">{s}</span>
                      </div>
                      {isChecked && <CheckCircle2 size={14} className="text-[#0038F8] shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Przycisk: Wyczyść */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasActiveFilters}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-colors text-xs border shadow-sm ${
                hasActiveFilters
                  ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 cursor-pointer"
                  : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
              }`}
              title={hasActiveFilters ? "Zresetuj wszystkie aktywne filtry" : "Brak aktywnych filtrów"}
            >
              <X size={12} className={hasActiveFilters ? "text-slate-500" : "text-slate-400"} />
              <span>Wyczyść</span>
            </button>
          </div>
        </div>

        {/* PASEK WYBRANYCH FILTRÓW */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 mt-2.5 border-t border-slate-200/80">
            <div className="w-24 shrink-0 flex items-center text-xs font-bold text-slate-500 whitespace-nowrap">
              <span>Wybrane filtry:</span>
            </div>

            {/* Chip: Wyszukiwanie */}
            {searchTerm.trim() && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
                <span>Szukaj: "{searchTerm}"</span>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                  title="Usuń ten filtr"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {/* Chip: Źródło */}
            {sourceFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
                <span>Źródło: {sourceFilter}</span>
                <button
                  type="button"
                  onClick={() => setSourceFilter("all")}
                  className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                  title="Usuń filtr źródła"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {/* Chip: Osoba odpowiedzialna */}
            {devTeamFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
                <span>Osoba: {devTeamFilter.split(" (")[0]}</span>
                <button
                  type="button"
                  onClick={() => setDevTeamFilter("all")}
                  className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                  title="Usuń filtr osoby odpowiedzialnej"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {/* Chips: Statusy */}
            {selectedStatuses.map((st) => (
              <span
                key={st}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20"
              >
                <span>Status: {st}</span>
                <button
                  type="button"
                  onClick={() => setSelectedStatuses((prev) => prev.filter((s) => s !== st))}
                  className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                  title={`Usuń filtr statusu: ${st}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {/* Chips: Priorytety */}
            {selectedPriorities.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20"
              >
                <span>Priorytet: {p}</span>
                <button
                  type="button"
                  onClick={() => setSelectedPriorities((prev) => prev.filter((x) => x !== p))}
                  className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                  title={`Usuń filtr priorytetu: ${p}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {/* Chips: Usługi */}
            {selectedServices.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20"
              >
                <span>Usługa: {s}</span>
                <button
                  type="button"
                  onClick={() => setSelectedServices((prev) => prev.filter((x) => x !== s))}
                  className="hover:bg-[#0038F8]/20 p-0.5 rounded transition-colors cursor-pointer"
                  title={`Usuń filtr usługi: ${s}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* PASEK WYNIKÓW I SORTOWANIA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-sm font-bold text-slate-700">
            Wyniki: <span className="text-[#0038F8] font-black">{filteredComplaints.length}</span> z {complaintsList.length} zgłoszeń
          </span>
          {hasActiveFilters && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0038F8]/10 text-[#0038F8] border border-[#0038F8]/20">
              <CheckCircle2 size={12} /> Wyniki odfiltrowane ({activeFilterCount})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Sortuj:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 cursor-pointer shadow-sm"
          >
            <option value="newest">Od najnowszego</option>
            <option value="oldest">Od najstarszego</option>
            <option value="priority">Po priorytecie</option>
            <option value="status">Po statusie</option>
          </select>
        </div>
      </div>

      {/* Lista zgłoszeń */}
      <div className="space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <MessageSquare size={36} className="mx-auto text-slate-300 mb-3" />
            <div className="font-bold text-slate-700 text-base">Brak zgłoszeń spełniających wybrane kryteria</div>
            <p className="text-slate-400 text-xs mt-1">Zmień filtry lub wyszukiwaną frazę.</p>
          </div>
        ) : (
          filteredComplaints.map((item) => (
            <Card
              key={item.id}
              onClick={() => {
                setSelectedComplaintId(item.id);
                setView("reklamacja-szczegoly");
              }}
              className="p-5 hover:shadow-md transition-all cursor-pointer group border border-slate-200 hover:border-[#0038F8]/40"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-black bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                    #{item.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.date}
                  </span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {item.channel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                    <span className="text-slate-400">Źródło:</span>
                    <strong className="text-slate-800">{item.source || "Rzecznik Klienta"}</strong>
                  </span>
                  {item.slaDeadline && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                      <Clock size={11} className="text-amber-600 shrink-0" />
                      <span>SLA: <strong className="text-amber-900">{item.slaDeadline}</strong></span>
                    </span>
                  )}
                  {(item.responsiblePerson || item.devTeam) && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                      <User size={12} className="text-indigo-600 shrink-0" />
                      <span>{item.responsiblePerson || item.devTeam}</span>
                    </span>
                  )}
                  {item.jiraUrl && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.jiraUrl.startsWith("http") ? item.jiraUrl : `https://jira.bank.pl/browse/${item.jiraUrl}`, "_blank");
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition-colors cursor-pointer"
                      title="Kliknij, aby otworzyć zadanie w Jira (nowa karta)"
                    >
                      <ExternalLink size={11} className="text-blue-600 shrink-0" />
                      <span>Jira: {item.jiraTicket || item.jiraUrl.replace(/https?:\/\/[^/]+\/browse\//, "")}</span>
                    </span>
                  )}
                  {(() => {
                    const linked = (tickets || []).find((t) => t.contextId === item.id);
                    if (!linked) return null;
                    return (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenTicket) onOpenTicket(linked.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          linked.unreadByClient
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300"
                            : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                        }`}
                        title="Otwórz powiązaną konsultację z audytorem"
                      >
                        <MessageSquareText size={12} className={linked.unreadByClient ? "text-emerald-600" : "text-purple-600"} />
                        <span>Konsultacja #{linked.id}</span>
                      </span>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <PriorityBadge priority={item.priority} size="small" />
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      item.status === "Gotowa rekomendacja"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                        : item.status === "Zweryfikowane pozytywnie"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold"
                        : item.status === "Zamknięte"
                        ? "bg-slate-100 text-slate-700 border-slate-300 font-bold"
                        : item.status === "Odrzucone"
                        ? "bg-red-50 text-red-700 border-red-200/80 font-bold"
                        : item.status === "W trakcie wdrożenia" || item.status === "Przypisane do Dev"
                        ? "bg-blue-50 text-blue-700 border-blue-200/80"
                        : item.status === "Wdrożone przez deweloperów"
                        ? "bg-purple-50 text-purple-700 border-purple-200/80"
                        : item.status === "Gotowe do re-audytu"
                        ? "bg-cyan-50 text-cyan-700 border-cyan-200/80"
                        : item.status === "Oczekuje na audytora" || item.status === "W trakcie analizy"
                        ? "bg-amber-50 text-amber-700 border-amber-200/80"
                        : "bg-slate-50 text-slate-600 border-slate-200/80"
                    }`}
                  >
                    {item.status === "Gotowa rekomendacja" && <Sparkles size={13} className="text-emerald-600 shrink-0" />}
                    {(item.status === "Oczekuje na audytora" || item.status === "W trakcie analizy") && <Clock size={13} className="text-amber-600 shrink-0" />}
                    {item.status === "Zweryfikowane pozytywnie" && <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />}
                    {item.status === "Zamknięte" && <Check size={13} className="text-slate-600 shrink-0" />}
                    {item.status === "Odrzucone" && <XCircle size={13} className="text-red-600 shrink-0" />}
                    {(item.status === "W trakcie wdrożenia" || item.status === "Przypisane do Dev") && <CheckCircle2 size={13} className="text-blue-600 shrink-0" />}
                    {item.status === "Wdrożone przez deweloperów" && <Code2 size={13} className="text-purple-600 shrink-0" />}
                    {item.status === "Gotowe do re-audytu" && <ClipboardCheck size={13} className="text-cyan-600 shrink-0" />}
                    <span>{item.status}</span>
                  </span>
                </div>
              </div>

              {/* Title & description */}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0038F8] transition-colors mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                {item.description}
              </p>

              {/* Footer info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-medium">
                <div className="flex items-center gap-2 flex-wrap text-slate-500">
                  <span className="font-bold text-slate-700">{item.service}</span>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span>{item.process}</span>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span className="text-slate-400">{item.view}</span>
                </div>

                <div className="flex items-center gap-3">
                  {item.hasRecommendation && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 text-xs">
                      <Sparkles size={13} className="text-emerald-600 shrink-0" />
                      <span>Rekomendacja eksperta dostępna</span>
                    </span>
                  )}
                  <span className="font-bold text-[#0038F8] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Szczegóły <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
        </div>
      </div>
    </div>
  );
}

function ComplaintDetailsView({
  setView,
  complaintId,
  complaintsList,
  setComplaintsList,
  tickets = [],
  onOpenTicket,
  onOpenNewTicket,
  onEditComplaint,
  onOpenReaudit,
  showToast,
}) {
  const complaint = complaintsList.find((c) => c.id === complaintId) || complaintsList[0];
  const [newComment, setNewComment] = useState("");
  const [currentStatus, setCurrentStatus] = useState(complaint.status);
  const [currentResponsiblePerson, setCurrentResponsiblePerson] = useState(
    complaint.responsiblePerson || complaint.devTeam || RESPONSIBLE_USERS_LIST[0]
  );
  const [currentSource, setCurrentSource] = useState(complaint.source || COMPLAINT_SOURCES[0]);
  const [currentJiraUrl, setCurrentJiraUrl] = useState(complaint.jiraUrl || "");

  const cleanComplaintId = (complaint.id || "").replace(/^#/, "").trim();
  const linkedTicket = (tickets || []).find(
    (t) =>
      t.contextId === cleanComplaintId ||
      t.contextId === complaint.id ||
      (t.contextTitle && t.contextTitle.toLowerCase().includes(cleanComplaintId.toLowerCase()))
  );

  useEffect(() => {
    setCurrentStatus(complaint.status);
    setCurrentResponsiblePerson(complaint.responsiblePerson || complaint.devTeam || RESPONSIBLE_USERS_LIST[0]);
    setCurrentSource(complaint.source || COMPLAINT_SOURCES[0]);
    setCurrentJiraUrl(complaint.jiraUrl || "");
  }, [complaint]);

  const handleSaveJiraUrl = () => {
    const ticketKey = currentJiraUrl.replace(/https?:\/\/[^/]+\/browse\//, "").trim();
    const fullUrl = currentJiraUrl ? (currentJiraUrl.startsWith("http") ? currentJiraUrl : `https://jira.bank.pl/browse/${currentJiraUrl}`) : "";
    const updated = complaintsList.map((item) => {
      if (item.id === complaint.id) {
        return {
          ...item,
          jiraUrl: fullUrl,
          jiraTicket: ticketKey,
        };
      }
      return item;
    });
    setComplaintsList(updated);
    if (showToast) {
      showToast(
        "Zapisano link do Jira",
        `Zgłoszenie #${complaint.id} zostało powiązane z zadaniem w Jira: "${ticketKey || "Brak"}".`
      );
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      author: "Katarzyna Wiśniewska (Koordynator)",
      role: "Koordynator Dostępności",
      date: "Dzisiaj, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newComment,
      isStaff: false
    };
    const updated = complaintsList.map((item) => {
      if (item.id === complaint.id) {
        return {
          ...item,
          comments: [...(item.comments || []), commentObj]
        };
      }
      return item;
    });
    setComplaintsList(updated);
    setNewComment("");
    if (showToast) {
      showToast("Dodano komentarz", "Komentarz został pomyślnie dodany do historii zgłoszenia.");
    }
  };

  const handleStatusChange = (newStat) => {
    setCurrentStatus(newStat);
    const updated = complaintsList.map((item) => {
      if (item.id === complaint.id) {
        return {
          ...item,
          status: newStat
        };
      }
      return item;
    });
    setComplaintsList(updated);
    if (showToast) {
      showToast("Zmieniono status", `Status zgłoszenia #${complaint.id} zmieniono na: "${newStat}".`);
    }
  };

  const handleResponsiblePersonChange = (newPerson) => {
    setCurrentResponsiblePerson(newPerson);
    const commentObj = {
      id: Date.now(),
      author: "Koordynator Dostępności",
      role: "System / Przypisanie",
      date: "Dzisiaj, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Koordynator przypisał osobę odpowiedzialną: "${newPerson}".`,
      isStaff: false
    };
    const updated = complaintsList.map((item) => {
      if (item.id === complaint.id) {
        return {
          ...item,
          responsiblePerson: newPerson,
          devTeam: newPerson,
          comments: [...(item.comments || []), commentObj]
        };
      }
      return item;
    });
    setComplaintsList(updated);
    if (showToast) {
      showToast("Przypisano osobę odpowiedzialną", `Zgłoszenie #${complaint.id} przypisano do: ${newPerson}.`);
    }
  };

  const handleSourceChange = (newSource) => {
    setCurrentSource(newSource);
    const updated = complaintsList.map((item) => {
      if (item.id === complaint.id) {
        return {
          ...item,
          source: newSource,
        };
      }
      return item;
    });
    setComplaintsList(updated);
    if (showToast) {
      showToast("Zmieniono źródło skargi", `Zgłoszenie #${complaint.id} ma teraz źródło: "${newSource}".`);
    }
  };

  const getStatusBadge = (stat) => {
    const s = (stat || "").toLowerCase();
    if (s.includes("zweryfikowane pozytywnie") || s.includes("pozytywnie")) {
      return {
        bg: "bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold",
        icon: <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />,
        label: stat
      };
    }
    if (s.includes("odrzucone")) {
      return {
        bg: "bg-red-50 text-red-700 border-red-200/90 font-extrabold",
        icon: <XCircle size={14} className="text-red-600 shrink-0" />,
        label: stat
      };
    }
    if (s.includes("zamknięte")) {
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-300 font-extrabold",
        icon: <Check size={14} className="text-slate-600 shrink-0" />,
        label: stat
      };
    }
    if (s.includes("rekomendacja")) {
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
        icon: <Sparkles size={14} className="text-emerald-600 shrink-0" />,
        label: stat
      };
    }
    if (s.includes("analiz") || s.includes("oczekuje")) {
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200/80 font-bold",
        icon: <Clock size={14} className="text-amber-600 shrink-0" />,
        label: stat
      };
    }
    return {
      bg: "bg-blue-50 text-blue-700 border-blue-200/80 font-bold",
      icon: <CheckCircle2 size={14} className="text-blue-600 shrink-0" />,
      label: stat
    };
  };

  const statusBadge = getStatusBadge(currentStatus);

  return (
    <div data-testid="complaint-details-view" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden">
      <ViewHeader
        breadcrumbs={[
          { label: "Pulpit", onClick: () => setView("przeglad") },
          { label: "Skargi i reklamacje", onClick: () => setView("reklamacje") },
          { label: `Zgłoszenie #${complaint.id}` },
        ]}
        badges={
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={complaint.priority} size="small" />
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusBadge.bg}`}
            >
              {statusBadge.icon}
              <span>{currentStatus}</span>
            </span>
            {(currentResponsiblePerson || complaint.responsiblePerson || complaint.devTeam) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                <User size={12} className="text-indigo-600 shrink-0" />
                <span>{currentResponsiblePerson || complaint.responsiblePerson || complaint.devTeam}</span>
              </span>
            )}
            {complaint.jiraUrl && (
              <a
                href={complaint.jiraUrl.startsWith("http") ? complaint.jiraUrl : `https://jira.bank.pl/browse/${complaint.jiraUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition-colors"
                title="Otwórz powiązane zadanie w Jira w nowej karcie"
              >
                <ExternalLink size={12} className="text-blue-600 shrink-0" />
                <span>Jira: {complaint.jiraTicket || complaint.jiraUrl.replace(/https?:\/\/[^/]+\/browse\//, "")}</span>
              </a>
            )}
            {linkedTicket ? (
              <button
                type="button"
                onClick={() => onOpenTicket && onOpenTicket(linkedTicket.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  linkedTicket.unreadByClient
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/30 animate-pulse"
                    : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                }`}
                title="Otwórz powiązaną konsultację z audytorem"
              >
                <MessageSquareText size={12} className={linkedTicket.unreadByClient ? "text-emerald-600" : "text-purple-600"} />
                <span>Konsultacja #{linkedTicket.id}: {linkedTicket.statusLabel}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenNewTicket && onOpenNewTicket({ type: "complaint", id: complaint.id, title: complaint.title })}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer"
                title="Zadaj pytanie audytorowi WCAG w sprawie tej skargi (konsultacja)"
              >
                <MessageSquareText size={12} className="text-emerald-600" />
                <span>Konsultuj z audytorem</span>
              </button>
            )}
          </div>
        }
        title={complaint.title}
        subtitle={`Zgłaszający: ${complaint.reporter} • Środowisko: ${complaint.device || "Desktop Chrome / NVDA"} • Kryterium: ${complaint.wcagCriterion}`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setView("reklamacje")}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
            >
              <ArrowLeft size={14} /> <span>Wróć</span>
            </button>
            <button
              onClick={() => onEditComplaint && onEditComplaint(complaint)}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
              title="Edytuj treść zgłoszenia, zmień zespół Dev lub priorytet"
            >
              <Pencil size={14} className="text-[#0038F8]" /> <span>Edytuj skargę</span>
            </button>
            <button
              onClick={() => {
                if (showToast) {
                  showToast(
                    "Pobieranie karty zgłoszenia (.doc)",
                    `Przygotowano plik Word (.docx) ze skargą #${complaint.id} i rekomendacją audytora.`
                  );
                }
              }}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
              title="Pobierz w formacie Word (.doc)"
            >
              <FileCode size={14} className="text-blue-600" /> <span>Pobierz (.doc)</span>
            </button>
            <ReauditButton
              onClick={() => {
                if (onOpenReaudit) {
                  onOpenReaudit(
                    `Skarga #${complaint.id}: ${complaint.title}`,
                    "Weryfikacja skargi WCAG",
                    complaint.auditor || "Piotr Smułkowski"
                  );
                }
              }}
              variant="primary"
            />
          </div>
        }
      />

      <div className="flex-1 md:overflow-y-auto bg-[#f8fafc] w-full">
        <div className="max-w-[1600px] mx-auto w-full p-4 sm:p-8 lg:p-12">
          {/* Pierwsza sekcja na szarym tle: Karta z datami i kluczowymi informacjami */}
          <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
              {/* 1. DATA WPŁYNIĘCIA (Mocno wyróżniona) */}
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0038F8] flex items-center justify-center shrink-0 border border-blue-100">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Data wpłynięcia:
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                    {complaint.date || "18.04.2026"}
                  </div>
                </div>
              </div>

              {/* 2. TERMIN ROZWIĄZANIA (SLA) (Mocno wyróżniony) */}
              <div className="flex items-center gap-2.5 bg-amber-50/70 border border-amber-300/80 rounded-xl px-3.5 py-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Termin rozwiązania (SLA):
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                      SLA 14 dni
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-amber-950 tracking-tight">
                    {complaint.slaDeadline || "25.04.2026 (pozostało 4 dni)"}
                  </div>
                </div>
              </div>

              {/* 3. ŹRÓDŁO SKARGI / NADAWCA */}
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                  <Landmark size={15} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Źródło skargi / Nadawca:
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {currentSource || complaint.source || "Rzecznik Klienta"}
                  </div>
                </div>
              </div>

              {/* 4. OSOBA ODPOWIEDZIALNA */}
              <div className="flex items-center gap-2.5 bg-indigo-50/50 border border-indigo-200/90 rounded-xl px-3.5 py-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200">
                  <User size={15} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Osoba odpowiedzialna:
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-indigo-950 truncate max-w-[220px]">
                    {currentResponsiblePerson || complaint.responsiblePerson || complaint.devTeam || "Marek Pawlak"}
                  </div>
                </div>
              </div>
            </div>

            {/* Status sprawy */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border ${statusBadge.bg}`}>
                {statusBadge.icon}
                <span>{currentStatus}</span>
              </span>
            </div>
          </div>
          {/* Main Grid: Left content (2 cols), Right sidebar (1 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kolumna lewa (treść zgłoszenia + rekomendacja + komentarze) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Karta zgłoszenia klienta */}
              <Card className="p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-[#0038F8]" />
                    <h2 className="text-base font-bold text-slate-900">Treść zgłoszonej skargi</h2>
                  </div>
                  <Badge variant="neutral">
                    Kanał: {complaint.channel}
                  </Badge>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-4">
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {complaint.description}
                  </p>
                </div>

                {/* Metadane techniczne */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Środowisko i urządzenie:</span>
                    <span className="font-bold text-slate-800">{complaint.device || "Desktop Chrome 124 / Czytnik NVDA"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Dotknięte kryterium WCAG:</span>
                    <span className="font-bold text-[#0038F8]">{complaint.wcagCriterion}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Zgłaszający koordynator:</span>
                    <span className="font-bold text-slate-800">{complaint.reporter}</span>
                  </div>
                </div>
              </Card>

              {/* KARTA REKOMENDACJI WCAG (standardowa, czytelna jak w audycie) */}
              <Card className="p-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-snug">
                        Rekomendacja eksperta WCAG
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Wytyczne techniczne dla deweloperów dotyczące sposobu naprawy błędu
                      </p>
                    </div>
                  </div>

                  {complaint.hasRecommendation && (
                    <Badge variant="success">
                      <CheckCircle2 size={13} className="shrink-0" />
                      <span>Gotowa rekomendacja</span>
                    </Badge>
                  )}
                </div>

                {complaint.hasRecommendation && complaint.recommendation ? (
                  <div className="space-y-5">
                    {/* Informacja o audytorze */}
                    <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-[#0038F8]" />
                        <span className="font-bold text-slate-800">{complaint.recommendation.author}</span>
                        <span className="text-slate-400 font-medium">({complaint.recommendation.role})</span>
                      </div>
                      <span className="text-slate-400 font-semibold">{complaint.recommendation.date}</span>
                    </div>

                    {/* Diagnoza przyczyny błędu */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Diagnoza problemu
                      </h3>
                      <div className="text-sm text-slate-700 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 leading-relaxed font-normal">
                        {complaint.recommendation.diagnosis}
                      </div>
                    </div>

                    {/* Rekomendowane rozwiązanie */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Rekomendowane rozwiązanie
                      </h3>
                      <div className="text-sm text-slate-800 bg-emerald-50/30 p-4 rounded-xl border border-emerald-200/70 leading-relaxed font-normal">
                        {complaint.recommendation.solution}
                      </div>
                    </div>

                    {/* Podsumowanie standardu */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                      <div>
                        <span className="font-bold text-slate-600 mr-2">Wymagany standard:</span>
                        <span className="font-semibold text-slate-800">
                          {complaint.recommendation.wcagCriteria || complaint.wcagCriterion}
                        </span>
                      </div>
                      <span className="text-slate-400 italic">Implementacja leży po stronie deweloperów klienta</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center space-y-3">
                    <Clock size={28} className="mx-auto text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-800">
                      Rekomendacja audytora jest w przygotowaniu
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Zgłoszenie jest analizowane przez audytora dostępności. Opis problemu oraz rekomendowane wytyczne semantyczne zostaną udostępnione w tym miejscu.
                    </p>
                    <button
                      onClick={() => {
                        const updated = complaintsList.map((item) => {
                          if (item.id === complaint.id) {
                            return {
                              ...item,
                              hasRecommendation: true,
                              status: "Gotowa rekomendacja",
                              recommendation: {
                                author: "Piotr Smułkowski",
                                role: "Lead WCAG Auditor",
                                date: "Dzisiaj, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                diagnosis: "W formularzu po wystąpieniu błędu walidacji fokus klawiatury jest resetowany na początek dokumentu zamiast przenieść się do pierwszego niepoprawnego pola.",
                                solution: "Zaleca się programowe przeniesienie fokusu (metoda focus()) na pierwsze pole z błędem walidacji oraz powiązanie komunikatu błędu z polem za pomocą atrybutu aria-describedby i oznaczenie pola atrybutem aria-invalid=\"true\".",
                                keyAttributes: ["focus()", "aria-describedby", "aria-invalid=\"true\"", "aria-live=\"polite\""],
                                wcagCriteria: "3.3.1 Identyfikacja błędu (Poziom A), 2.4.3 Kolejność fokusu (Poziom A)",
                              }
                            };
                          }
                          return item;
                        });
                        setComplaintsList(updated);
                        setCurrentStatus("Gotowa rekomendacja");
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      <Sparkles size={14} /> Wprowadź rekomendację eksperta (Demo)
                    </button>
                  </div>
                )}
              </Card>

              {/* HISTORIA ZGŁOSZENIA I KOMENTARZE */}
              <Card className="p-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <History size={18} className="text-[#0038F8]" />
                    <h2 className="text-base font-bold text-slate-900">
                      Historia zgłoszenia i komentarze ({complaint.comments?.length || 0})
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                    <Info size={13} className="text-blue-600 shrink-0" />
                    <span>Dyskusje i konsultacje z audytorem są w osobnym oknie</span>
                  </div>
                </div>

                {/* Lista wpisów historii */}
                <div className="space-y-3 mb-6">
                  {(complaint.comments || []).map((comm) => (
                    <div
                      key={comm.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 text-xs hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {comm.author ? comm.author.charAt(0) : "U"}
                          </div>
                          <span className="font-bold text-slate-900">{comm.author}</span>
                          <span className="text-slate-500 font-medium text-[11px]">({comm.role})</span>
                          {comm.isStaff ? (
                            <span className="bg-[#0038F8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Audytor
                            </span>
                          ) : (
                            <span className="bg-slate-200/80 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Komentarz
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 font-medium text-[11px]">{comm.date}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-normal pl-8">{comm.text}</p>
                    </div>
                  ))}
                </div>

                {/* Formularz dodania nowego komentarza */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">
                      Dodaj komentarz do historii zgłoszenia:
                    </label>
                    <span className="text-[11px] text-slate-400">Widoczne w wewnętrznej historii sprawy</span>
                  </div>
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Wpisz treść komentarza lub notatki wewnętrznej..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 focus:bg-white transition-colors"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      {linkedTicket ? (
                        <button
                          type="button"
                          onClick={() => onOpenTicket && onOpenTicket(linkedTicket.id)}
                          className="text-[#0038F8] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquareText size={12} /> Przejdź do osobnego okna dyskusji (#{linkedTicket.id})
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenNewTicket && onOpenNewTicket({ type: "complaint", id: complaint.id, title: complaint.title })}
                          className="text-[#0038F8] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquareText size={12} /> Otwórz osobną dyskusję / konsultację z audytorem
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddComment}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer shrink-0"
                    >
                      <Plus size={14} /> Dodaj komentarz
                    </button>
                  </div>
                </div>
              </Card>
        </div>

        {/* Kolumna prawa (Sidebar szczegółów) */}
        <div className="space-y-6">
          {/* OSOBA ODPOWIEDZIALNA I ŹRÓDŁO SKARGI */}
          <Card className="p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User size={14} className="text-[#0038F8]" />
                <span>Osoba odpowiedzialna</span>
              </h3>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200/80">
                Opiekun
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Osoba odpowiedzialna:
                </label>
                <select
                  value={currentResponsiblePerson}
                  onChange={(e) => handleResponsiblePersonChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
                >
                  {RESPONSIBLE_USERS_LIST.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Źródło skargi / Nadawca:
                </label>
                <select
                  value={currentSource}
                  onChange={(e) => handleSourceChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
                >
                  {COMPLAINT_SOURCES.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Kanał powiadomień:</span>
                  <span className="font-semibold text-slate-700">Jira / E-mail</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Status przekazania:</span>
                  <span className="font-bold text-emerald-600">Zsynchronizowane</span>
                </div>
              </div>
            </div>
          </Card>

          {/* POWIĄZANE ZADANIE W JIRA (DEV) */}
          <Card className="p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 size={14} className="text-[#0038F8]" />
                <span>Zadanie w Jira (Dev)</span>
              </h3>
              {complaint.jiraUrl ? (
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200/80 flex items-center gap-1">
                  <Check size={10} /> Podpięte
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200/80">
                  Brak linku
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Link do zadania w Jira lub klucz:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={currentJiraUrl}
                      onChange={(e) => setCurrentJiraUrl(e.target.value)}
                      placeholder="np. https://jira.bank.pl/browse/ACC-104 lub ACC-104"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveJiraUrl}
                    className="bg-[#0038F8] hover:bg-[#002ECC] text-white px-3 py-2 rounded-lg font-bold text-xs transition-colors shadow-xs shrink-0 cursor-pointer"
                  >
                    Zapisz
                  </button>
                </div>
              </div>

              {complaint.jiraUrl && (
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      Jira
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {complaint.jiraTicket || complaint.jiraUrl.replace(/https?:\/\/[^/]+\/browse\//, "")}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{complaint.jiraUrl}</div>
                    </div>
                  </div>
                  <a
                    href={complaint.jiraUrl.startsWith("http") ? complaint.jiraUrl : `https://jira.bank.pl/browse/${complaint.jiraUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded text-xs font-bold shadow-xs shrink-0 transition-colors"
                  >
                    <ExternalLink size={12} className="text-[#0038F8]" />
                    <span>Otwórz</span>
                  </a>
                </div>
              )}

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Umożliwia koordynatorowi weryfikację stanu prac w Jira przed skierowaniem poprawki do formalnego re-audytu.
              </p>
            </div>
          </Card>

          {/* POWIĄZANY TICKET / KONSULTACJA Z AUDYTOREM */}
          <Card className={`p-5 border transition-all ${
            linkedTicket?.unreadByClient
              ? "bg-gradient-to-br from-emerald-50/40 via-white to-white border-emerald-200 shadow-2xs"
              : "border-slate-200"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareText size={14} className="text-emerald-600" />
                <span>Konsultacja z audytorem WCAG</span>
              </h3>
              {linkedTicket ? (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  linkedTicket.status === "auditor_reply"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}>
                  {linkedTicket.statusLabel}
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                  Brak konsultacji
                </span>
              )}
            </div>

            <div className="space-y-3">
              {linkedTicket ? (
                <>
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-3">
                    <img
                      src={linkedTicket.assignedAuditor?.avatar}
                      alt={linkedTicket.assignedAuditor?.name}
                      className="w-8 h-8 rounded-full object-cover border border-white shrink-0 mt-0.5"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {linkedTicket.assignedAuditor?.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{linkedTicket.updatedAt}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-800 truncate">
                        Konsultacja #{linkedTicket.id}: {linkedTicket.title}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 italic">
                        "{linkedTicket.messages[linkedTicket.messages.length - 1]?.content.slice(0, 95)}..."
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenTicket && onOpenTicket(linkedTicket.id)}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquareText size={13} />
                    <span>Otwórz wątek konsultacji (#{linkedTicket.id})</span>
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Nie wymaga spotkania online: zadaj pytanie audytorowi WCAG odnośnie interpretacji tej skargi lub rekomendacji technicznej.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenNewTicket && onOpenNewTicket({ type: "complaint", id: complaint.id, title: complaint.title })}
                    className="w-full py-2 px-3 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Nowa konsultacja z audytorem</span>
                  </button>
                </>
              )}
            </div>
          </Card>

          {/* STATUS I ZARZĄDZANIE */}
          <Card className="p-5 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Zarządzanie statusem zgłoszenia
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Status reklamacji:
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
                >
                  {!COMPLAINT_STATUS_OPTIONS.some((opt) => opt.value === currentStatus) && (
                    <option value={currentStatus}>{currentStatus}</option>
                  )}
                  {COMPLAINT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Szybkie akcje statusowe koordynatora */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Szybkie akcje statusu:
                </span>
                <button
                  type="button"
                  onClick={() => handleStatusChange("Zweryfikowane pozytywnie")}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>Zweryfikowane pozytywnie</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("Zamknięte")}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                >
                  <Check size={14} className="text-slate-600" />
                  <span>Zamknij reklamację</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("Odrzucone")}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                >
                  <XCircle size={14} className="text-red-600" />
                  <span>Odrzuć reklamację</span>
                </button>
                <ReauditButton
                  onClick={() => {
                    if (onOpenReaudit) {
                      onOpenReaudit(
                        `Skarga #${complaint.id}: ${complaint.title}`,
                        "Weryfikacja skargi WCAG",
                        complaint.auditor || "Piotr Smułkowski"
                      );
                    }
                  }}
                  variant="secondary"
                  fullWidth
                  title="Zleć formalną weryfikację dla tej reklamacji"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SLA odpowiedzi:</span>
                  <span className="font-bold text-emerald-600">Dotrzymane (4h)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Przypisany audytor:</span>
                  <span className="font-bold text-slate-800">{complaint.auditor || "Piotr Smułkowski"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Powiązanie w Baza Usług */}
          <Card className="p-5 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Powiązanie w Bazie Usług
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Usługa:</span>
                <span className="font-bold text-slate-900">{complaint.service}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Proces biznesowy:</span>
                <span className="font-bold text-slate-900">{complaint.process}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Ekran / Krok:</span>
                <span className="font-bold text-slate-900">{complaint.view}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setView("baza-uslug")}
                  className="text-[#0038F8] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Folder size={14} /> Otwórz proces w Bazie Usług
                </button>
              </div>
            </div>
          </Card>

          {/* Załączniki */}
          <Card className="p-5 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Załączniki i pliki klienta (2)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 truncate">
                  <FileText size={16} className="text-[#0038F8] shrink-0" />
                  <span className="font-semibold text-slate-700 truncate">Zrzut_ekranu_NVDA.png</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast && showToast("Pobieranie", "Pobieranie pliku Zrzut_ekranu_NVDA.png...")}
                  title="Pobierz"
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <Download size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 truncate">
                  <FileText size={16} className="text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700 truncate">Log_konsoli_przelew.txt</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast && showToast("Pobieranie", "Pobieranie pliku Log_konsoli_przelew.txt...")}
                  title="Pobierz"
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}

function ComplaintCreateView({ setView, setComplaintsList, setSelectedComplaintId, showToast }) {
  const [formData, setFormData] = useState({
    title: "",
    service: "Bankowość internetowa",
    process: "Przelewy krajowe Elixir",
    view: "Ekran autoryzacji transakcji",
    channel: "Desktop WWW",
    source: COMPLAINT_SOURCES[0],
    responsiblePerson: RESPONSIBLE_USERS_LIST[0],
    devTeam: RESPONSIBLE_USERS_LIST[0],
    wcagCriterion: "2.1.1 Klawiatura (Poziom A)",
    priority: "Priorytetowy",
    device: "Windows 11 / Chrome 124 / NVDA 2024",
    description: "",
    jiraUrl: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Proszę wypełnić tytuł oraz opis zgłoszenia reklamacji.");
      return;
    }

    const ticketKey = (formData.jiraUrl || "").replace(/https?:\/\/[^/]+\/browse\//, "").trim();
    const fullUrl = formData.jiraUrl ? (formData.jiraUrl.startsWith("http") ? formData.jiraUrl : `https://jira.bank.pl/browse/${formData.jiraUrl}`) : "";

    const newId = "RKL-2026-0" + (Math.floor(Math.random() * 800) + 100);
    const newComplaint = {
      id: newId,
      title: formData.title,
      service: formData.service,
      process: formData.process,
      view: formData.view,
      channel: formData.channel,
      source: formData.source,
      responsiblePerson: formData.responsiblePerson,
      devTeam: formData.responsiblePerson,
      wcagCriterion: formData.wcagCriterion,
      priority: formData.priority,
      status: "Nowe",
      jiraUrl: fullUrl,
      jiraTicket: ticketKey,
      reporter: "Katarzyna Wiśniewska (Koordynator Dostępności)",
      auditor: "Piotr Smułkowski (Lead WCAG Auditor)",
      date: new Date().toLocaleDateString("pl-PL"),
      slaDeadline: formData.priority === "Priorytetowy" ? "7 dni (SLA priorytet)" : "14 dni (SLA standard)",
      device: formData.device,
      description: formData.description,
      hasRecommendation: false,
      comments: [
        {
          id: 1,
          author: "Katarzyna Wiśniewska",
          role: "Koordynator Dostępności",
          date: "Przed chwilą",
          text: `Zgłoszenie zarejestrowane ze źródła "${formData.source}". Osoba odpowiedzialna: "${formData.responsiblePerson}". Oczekuje na analizę audytora.`,
          isStaff: false
        }
      ]
    };

    setComplaintsList((prev) => [newComplaint, ...prev]);
    setSelectedComplaintId(newId);
    if (showToast) {
      showToast(
        "Utworzono zgłoszenie skargi",
        `Zgłoszenie #${newId} zostało utworzone ze źródła "${formData.source}". Osoba odpowiedzialna: ${formData.responsiblePerson}.`
      );
    }
    setView("reklamacja-szczegoly");
  };

  return (
    <div data-testid="complaint-create-view" className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden">
      <ViewHeader
        breadcrumbs={[
          { label: "Pulpit", onClick: () => setView("przeglad") },
          { label: "Skargi i reklamacje", onClick: () => setView("reklamacje") },
          { label: "Nowe zgłoszenie" },
        ]}
        title="Nowe zgłoszenie skargi / reklamacji"
        subtitle="Opisz problem dostępności zgłoszony przez klienta. Nasi audytorzy WCAG przeanalizują kod i przygotują gotowe rekomendacje techniczne."
        actions={
          <button
            type="button"
            onClick={() => setView("reklamacje")}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-bold shadow-xs transition-colors text-xs cursor-pointer"
          >
            <ArrowLeft size={14} /> <span>Anuluj</span>
          </button>
        }
      />

      <div className="flex-1 md:overflow-y-auto bg-[#f8fafc] w-full">
        <div className="max-w-[1600px] mx-auto w-full p-4 sm:p-8 lg:p-12">
          <Card className="max-w-4xl mx-auto p-6 sm:p-8 border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tytuł */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tytuł reklamacji / błędu *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="np. Brak możliwości zatwierdzenia wniosku przez czytnik ekranu NVDA..."
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
            />
          </div>

          {/* Grid: Priorytet, Osoba odpowiedzialna, Źródło skargi, Kanał, Kryterium WCAG */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Priorytet zgłoszenia *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                <option value="Priorytetowy">🚨 Priorytetowy (Bloker)</option>
                <option value="Ważny">🟠 Ważny</option>
                <option value="Marginalny">🔵 Marginalny</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Osoba odpowiedzialna *
              </label>
              <select
                value={formData.responsiblePerson}
                onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value, devTeam: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                {RESPONSIBLE_USERS_LIST.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Źródło skargi / Nadawca *
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                {COMPLAINT_SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kanał dostępu *
              </label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                <option value="Desktop WWW">Desktop WWW</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
                <option value="Dokumenty">Dokumenty PDF</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kryterium WCAG 2.1
              </label>
              <select
                value={formData.wcagCriterion}
                onChange={(e) => setFormData({ ...formData, wcagCriterion: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                <option value="2.1.1 Klawiatura (Poziom A)">2.1.1 Klawiatura (A)</option>
                <option value="1.4.3 Kontrast minimalny (Poziom AA)">1.4.3 Kontrast minimalny (AA)</option>
                <option value="4.1.2 Nazwa, rola, wartość (Poziom A)">4.1.2 Nazwa, rola, wartość (A)</option>
                <option value="1.3.1 Informacje i relacje (Poziom A)">1.3.1 Informacje i relacje (A)</option>
                <option value="3.3.1 Identyfikacja błędu (Poziom A)">3.3.1 Identyfikacja błędu (A)</option>
                <option value="Inne / Do weryfikacji przez audytora">Inne / Do weryfikacji przez audytora</option>
              </select>
            </div>
          </div>

          {/* Usługa, Proces, Widok */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Usługa cyfrowa
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                <option value="Bankowość internetowa">Bankowość internetowa</option>
                <option value="Aplikacja mobilna">Aplikacja mobilna</option>
                <option value="Kredyty i pożyczki">Kredyty i pożyczki</option>
                <option value="Karty i dokumenty">Karty i dokumenty</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Proces biznesowy
              </label>
              <input
                type="text"
                value={formData.process}
                onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                placeholder="np. Przelewy krajowe Elixir"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ekran / Krok procesu
              </label>
              <input
                type="text"
                value={formData.view}
                onChange={(e) => setFormData({ ...formData, view: e.target.value })}
                placeholder="np. Ekran potwierdzenia autoryzacji"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              />
            </div>
          </div>

          {/* Opis sytuacji od klienta */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Szczegółowy opis reklamacji klienta *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Dokładnie opisz, co zgłaszał klient, z jakiej technologii asystującej korzystał (np. NVDA, JAWS, VoiceOver) i w którym momencie nastąpiła blokada..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 leading-relaxed font-normal"
            />
          </div>

          {/* Środowisko techniczne */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Urządzenie / Przeglądarka / Czytnik ekranu
            </label>
            <input
              type="text"
              value={formData.device}
              onChange={(e) => setFormData({ ...formData, device: e.target.value })}
              placeholder="np. Windows 11, Chrome 124, NVDA 2024.1"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
            />
          </div>

          {/* Powiązane zadanie w Jira */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Link2 size={13} className="text-[#0038F8]" />
                <span>Link do zadania w Jira (opcjonalnie)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold normal-case">Dla zespołu Dev</span>
            </label>
            <div className="relative">
              <Link2 size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={formData.jiraUrl}
                onChange={(e) => setFormData({ ...formData, jiraUrl: e.target.value })}
                placeholder="np. https://jira.bank.pl/browse/ACC-104 lub ACC-104"
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Pozwala koordynatorowi na późniejszą bezpośrednią weryfikację stanu naprawy błędu przez zespół techniczny przed zgłoszeniem do re-audytu.
            </p>
          </div>

          {/* Mockup strefy uploadu plików */}
          <div className="border-2 border-dashed border-slate-200 hover:border-[#0038F8]/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
            <FileText size={28} className="mx-auto text-slate-400 mb-2" />
            <div className="text-xs font-bold text-slate-700">
              Przeciągnij zrzuty ekranu, logi konsoli lub nagrania czytnika ekranu
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              PNG, JPG, PDF, TXT do 25 MB
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setView("reklamacje")}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all hover:shadow-lg"
            >
              <Send size={14} />
              Utwórz zgłoszenie i prześlij do audytora WCAG
            </button>
          </div>
        </form>
      </Card>
        </div>
      </div>
    </div>
  );
}
