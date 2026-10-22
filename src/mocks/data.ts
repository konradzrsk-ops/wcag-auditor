import type {
  AuditService,
  AuditReport,
  Complaint,
  ChartDataPoint,
  FlatError,
  RegulatoryService,
  PriorityCounts,
  AuditView,
  AuditProcess,
} from "../types";

// ==========================================
// GENERATORS
// ==========================================

const genPrio = (i: number): PriorityCounts => ({
  c: i % 3,
  w: i % 4,
  m: (i % 3) + 2,
});

const genErrors = (count: number, prefix: string) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `e-${prefix}-${i}`,
    title: `Zidentyfikowany błąd dostępności #${i + 1} - wymaga poprawy.`,
    criteria: [
      "1.1.1 Treść nietekstowa",
      "1.4.3 Kontrast",
      "2.1.1 Klawiatura",
      "3.3.2 Etykiety",
    ][i % 4],
    priority: (["Krytyczny", "Ważny", "Marginalny"] as const)[i % 3],
    status: (i % 3 === 0 ? "W trakcie" : "Nowy") as "Nowy" | "W trakcie" | "Rozwiązany",
  }));

const genViews = (count: number, prefix: string): AuditView[] =>
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

const genProcesses = (count: number, prefix: string): AuditProcess[] =>
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

export const genFlatErrors = (count: number, type: string): FlatError[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: `#${type}${100 + i}`,
    problem: `Wygenerowany problem testowy #${i + 1} opisujący błąd dostępności komponentu. Tło ma zbyt niski kontrast w stosunku do tekstu.`,
    recommendation: `Zalecana naprawa dla błędu #${i + 1}. Zaktualizuj kod źródłowy dodając odpowiednie tagi ARIA lub dostosuj wartości kolorów HEX w CSS.`,
    priority: (["Krytyczny", "Ważny", "Marginalny"] as const)[i % 3],
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

// ==========================================
// SHARED SERVICES DATA
// ==========================================

export const mockSharedServicesData: AuditService[] = [
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
                priority: "Krytyczny",
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

// ==========================================
// CHART TREND DATA
// ==========================================

export const chartTrendData: ChartDataPoint[] = [
  { month: "Kwi", score: 65, errors: 40 },
  { month: "Maj", score: 68, errors: 38 },
  { month: "Cze", score: 70, errors: 35 },
  { month: "Lip", score: 72, errors: 42 },
  { month: "Sie", score: 75, errors: 30 },
  { month: "Wrz", score: 78, errors: 25 },
  { month: "Paź", score: 80, errors: 20 },
  { month: "Lis", score: 82, errors: 18 },
  { month: "Gru", score: 85, errors: 15 },
  { month: "Sty", score: 86, errors: 12 },
  { month: "Lut", score: 86, errors: 10 },
  { month: "Mar", score: 88, errors: 8 },
];

// ==========================================
// AUDIT REPORTS
// ==========================================

export const mockAuditsList: AuditReport[] = [
  {
    id: "a1",
    clientName: "ING",
    title: "Audyt dostępności serwisu ing.pl",
    status: "Zakończony",
    auditor: "Anna Ekspert",
    wcagLevel: "AA",
    startDate: "01.03.2024",
    endDate: "15.03.2024",
    score: 85.2,
    criticalErrors: 3,
    totalCriteria: 49,
    brokenCriteria: 11,
    channel: "WWW",
  },
  {
    id: "a2",
    clientName: "ING",
    title: "Audyt aplikacji mobilnej Moje ING (Android)",
    status: "W trakcie",
    auditor: "Piotr Audytor",
    wcagLevel: "AA",
    startDate: "10.03.2024",
    endDate: "-",
    score: 72.5,
    criticalErrors: 7,
    totalCriteria: 49,
    brokenCriteria: 18,
    channel: "Android",
  },
  {
    id: "a3",
    clientName: "mBank",
    title: "Audyt serwisu transakcyjnego mBank",
    status: "Zakończony",
    auditor: "Anna Ekspert",
    wcagLevel: "AAA",
    startDate: "15.02.2024",
    endDate: "28.02.2024",
    score: 91.0,
    criticalErrors: 1,
    totalCriteria: 49,
    brokenCriteria: 5,
    channel: "WWW",
  },
  {
    id: "a4",
    clientName: "Santander",
    title: "Audyt procesu otwarcia konta Santander",
    status: "Nowy",
    auditor: "Piotr Audytor",
    wcagLevel: "AA",
    startDate: "20.03.2024",
    endDate: "-",
    score: 0,
    criticalErrors: 0,
    totalCriteria: 49,
    brokenCriteria: 0,
    channel: "WWW",
  },
  {
    id: "a5",
    clientName: "PKO BP",
    title: "Audyt aplikacji iPKO",
    status: "W trakcie",
    auditor: "Anna Ekspert",
    wcagLevel: "AA",
    startDate: "05.03.2024",
    endDate: "-",
    score: 68.3,
    criticalErrors: 9,
    totalCriteria: 49,
    brokenCriteria: 22,
    channel: "iOS",
  },
  {
    id: "a6",
    clientName: "ING",
    title: "Audyt dokumentów PDF - regulaminy",
    status: "Zakończony",
    auditor: "Piotr Audytor",
    wcagLevel: "A",
    startDate: "01.02.2024",
    endDate: "10.02.2024",
    score: 45.0,
    criticalErrors: 12,
    totalCriteria: 30,
    brokenCriteria: 18,
    channel: "PDF",
  },
];

// ==========================================
// COMPLAINTS (NEW MODULE)
// ==========================================

export const mockComplaints: Complaint[] = [
  {
    id: "RKL-047",
    title: "Brak obsługi czytnika ekranu na formularzu kredytu",
    description:
      "Klient zgłasza, że czytnik ekranu NVDA nie odczytuje etykiet pól formularza na kroku 2 wniosku o kredyt hipoteczny. Brak informacji o wymaganych polach. Problem dotyczy zarówno pól tekstowych jak i selectów.",
    status: "W analizie",
    priority: "Krytyczny",
    reporter: "Jan Nowak",
    assignee: "Anna Ekspert",
    createdAt: "2026-10-16T10:15:00Z",
    updatedAt: "2026-10-17T14:30:00Z",
    slaDeadline: "2026-10-19T10:15:00Z",
    serviceName: "Kredyt hipoteczny",
    processName: "Wniosek o kredyt",
    viewName: "Krok 2: Dane osobowe",
    auditId: "a2",
    wcagCriteria: "4.1.2 Nazwa, rola, wartość",
    attachments: [
      { id: "att1", name: "screenshot-nvda.png", url: "#", type: "image/png", size: 245000 },
      { id: "att2", name: "nagranie-blad.mp4", url: "#", type: "video/mp4", size: 12500000 },
    ],
    recommendation: {
      id: "rec1",
      content:
        'Dodaj atrybut aria-label do każdego pola formularza:\n\n```html\n<input aria-label="Numer PESEL" aria-required="true" />\n```\n\nDodatkowo zastosuj aria-describedby do opisu walidacji. Powiązane kryteria: WCAG 2.1 SC 4.1.2, 3.3.2',
      author: "Anna Ekspert",
      createdAt: "2026-10-17T14:30:00Z",
      estimatedFixTime: "~2h",
      relatedCriteria: ["4.1.2", "3.3.2"],
    },
    activities: [
      {
        id: "act3",
        type: "recommendation",
        author: "Anna Ekspert",
        createdAt: "2026-10-17T14:30:00Z",
        content: "Dodano rekomendację naprawy",
      },
      {
        id: "act2",
        type: "status_change",
        author: "P. Smułkowski",
        createdAt: "2026-10-16T16:00:00Z",
        content: "Zmiana statusu",
        oldValue: "Nowy",
        newValue: "W analizie",
      },
      {
        id: "act1",
        type: "comment",
        author: "Jan Nowak",
        createdAt: "2026-10-16T10:15:00Z",
        content: "Ticket utworzony — klient VIP, priorytet obsługi",
      },
    ],
  },
  {
    id: "RKL-046",
    title: "Niski kontrast przycisku 'Dalej' w procesie otwarcia ROR",
    description:
      "Przycisk 'Dalej' na kroku 3 procesu otwarcia ROR ma zbyt niski kontrast (3.2:1 zamiast wymaganego 4.5:1). Klient z wadą wzroku nie jest w stanie odczytać tekstu na przycisku.",
    status: "Rekomendacja",
    priority: "Ważny",
    reporter: "Maria Kowalska",
    assignee: "Anna Ekspert",
    createdAt: "2026-10-14T09:00:00Z",
    updatedAt: "2026-10-15T11:00:00Z",
    serviceName: "Usługi płatnicze",
    processName: "Otwarcie ROR",
    viewName: "Krok 3: Potwierdzenie",
    wcagCriteria: "1.4.3 Kontrast (minimum)",
    recommendation: {
      id: "rec2",
      content:
        "Zmień kolor tła przycisku z #A8C4E8 na #2563EB (brand blue) lub ciemniejszy. Tekst powinien pozostać biały (#FFFFFF). Nowy kontrast wyniesie 7.1:1.",
      author: "Anna Ekspert",
      createdAt: "2026-10-15T11:00:00Z",
      estimatedFixTime: "~30min",
      relatedCriteria: ["1.4.3"],
    },
    activities: [
      {
        id: "act5",
        type: "recommendation",
        author: "Anna Ekspert",
        createdAt: "2026-10-15T11:00:00Z",
        content: "Dodano rekomendację naprawy kontrastu",
      },
      {
        id: "act4",
        type: "status_change",
        author: "Anna Ekspert",
        createdAt: "2026-10-14T14:00:00Z",
        content: "Zmiana statusu",
        oldValue: "Nowy",
        newValue: "W analizie",
      },
    ],
    attachments: [],
  },
  {
    id: "RKL-045",
    title: "Brak możliwości nawigacji klawiaturą w kalkulatorze",
    description:
      "Kalkulator kredytowy nie obsługuje nawigacji klawiaturą. Suwaki (range sliders) nie reagują na strzałki, a fokus klawiatury pomija interaktywne elementy.",
    status: "W naprawie",
    priority: "Krytyczny",
    reporter: "Tomasz Wiśniewski",
    assignee: "Piotr Audytor",
    createdAt: "2026-10-10T08:30:00Z",
    updatedAt: "2026-10-16T09:00:00Z",
    serviceName: "Kredyt hipoteczny",
    processName: "Kalkulator kredytowy",
    viewName: "Kalkulator - strona główna",
    wcagCriteria: "2.1.1 Klawiatura",
    recommendation: {
      id: "rec3",
      content:
        "Zastąp customowe suwaki natywnymi elementami <input type='range'> lub dodaj role='slider', aria-valuemin, aria-valuemax, aria-valuenow oraz obsługę klawiszy strzałek.",
      author: "Piotr Audytor",
      createdAt: "2026-10-12T10:00:00Z",
      estimatedFixTime: "~4h",
      relatedCriteria: ["2.1.1", "4.1.2"],
    },
    activities: [
      {
        id: "act8",
        type: "status_change",
        author: "Piotr Audytor",
        createdAt: "2026-10-16T09:00:00Z",
        content: "Zmiana statusu",
        oldValue: "Rekomendacja",
        newValue: "W naprawie",
      },
      {
        id: "act7",
        type: "comment",
        author: "Tomasz Wiśniewski",
        createdAt: "2026-10-14T15:00:00Z",
        content: "Frontend team rozpoczął prace nad naprawą suwaków",
      },
    ],
    attachments: [],
  },
  {
    id: "RKL-044",
    title: "Dokument PDF regulaminu niedostępny dla czytników",
    description: "Regulamin konta osobistego w formacie PDF nie ma struktury tagów, co uniemożliwia odczyt przez czytniki ekranu.",
    status: "Zamknięty",
    priority: "Ważny",
    reporter: "Anna Zielińska",
    createdAt: "2026-10-01T12:00:00Z",
    updatedAt: "2026-10-08T16:00:00Z",
    serviceName: "Usługi płatnicze",
    processName: "Dokumenty",
    viewName: "Regulamin ROR",
    wcagCriteria: "1.1.1 Treść nietekstowa",
    recommendation: {
      id: "rec4",
      content: "Dokument wymaga ponownego wyeksportowania z tagami PDF/UA. Użyj narzędzia Adobe Acrobat Pro do dodania struktury tagów.",
      author: "Anna Ekspert",
      createdAt: "2026-10-03T10:00:00Z",
      estimatedFixTime: "~1h",
      relatedCriteria: ["1.1.1", "1.3.1"],
    },
    activities: [
      {
        id: "act10",
        type: "status_change",
        author: "Anna Ekspert",
        createdAt: "2026-10-08T16:00:00Z",
        content: "Zmiana statusu",
        oldValue: "Weryfikacja",
        newValue: "Zamknięty",
      },
    ],
    attachments: [],
  },
  {
    id: "RKL-043",
    title: "Brak opisów alternatywnych na banerach promocyjnych",
    description: "Banery na stronie głównej nie posiadają atrybutów alt. Czytnik ekranu odczytuje nazwy plików graficznych zamiast treści.",
    status: "Nowy",
    priority: "Marginalny",
    reporter: "Ewa Dąbrowska",
    createdAt: "2026-10-18T14:00:00Z",
    updatedAt: "2026-10-18T14:00:00Z",
    serviceName: "Usługi płatnicze",
    processName: "Otwarcie ROR",
    viewName: "Strona główna ing.pl",
    wcagCriteria: "1.1.1 Treść nietekstowa",
    activities: [
      {
        id: "act11",
        type: "comment",
        author: "Ewa Dąbrowska",
        createdAt: "2026-10-18T14:00:00Z",
        content: "Ticket utworzony",
      },
    ],
    attachments: [],
  },
];

// ==========================================
// REGULATORY DATA
// ==========================================

export const mockRegulatoryData: RegulatoryService[] = [
  {
    id: "reg1",
    name: "Strona główna i serwis informacyjny (ing.pl)",
    type: "Serwis WWW",
    compliance: "Częściowo zgodna",
    lastAuditDate: "15.03.2024",
    declarationStatus: "Aktualna",
    needsReview: false,
  },
  {
    id: "reg2",
    name: "Aplikacja mobilna Moje ING (Android)",
    type: "Aplikacja mobilna",
    compliance: "Częściowo zgodna",
    lastAuditDate: "10.03.2024",
    declarationStatus: "Wymaga aktualizacji",
    needsReview: true,
  },
  {
    id: "reg3",
    name: "Kalkulator Kredytowy",
    type: "Moduł WWW",
    compliance: "Zgodna",
    lastAuditDate: "01.02.2024",
    declarationStatus: "Aktualna",
    needsReview: false,
  },
  {
    id: "reg4",
    name: "Platforma Wymiany Walut (Kantor)",
    type: "Serwis WWW",
    compliance: "Niezgodna",
    lastAuditDate: "20.01.2024",
    declarationStatus: "Przeterminowana",
    needsReview: true,
  },
];

// ==========================================
// CHANNEL DATA
// ==========================================

export const mockChannelData = [
  { name: "WWW", percentage: 94, icon: "Monitor" },
  { name: "iOS", percentage: 82, icon: "Smartphone" },
  { name: "Android", percentage: 78, icon: "Smartphone" },
  { name: "PDF", percentage: 45, icon: "FileText" },
];
