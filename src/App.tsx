import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Shield,
  UserCog,
  Briefcase,
  ClipboardCheck,
  FolderKanban,
  CalendarOff,
  CalendarDays,
  BookOpen,
  Settings,
  Search,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Info,
  Download,
  ArrowRight,
  ArrowLeft,
  Eye,
  LayoutTemplate,
  Filter,
  MoreVertical,
  BarChart2,
  PanelLeftClose,
  PanelLeft,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Link,
  Plus,
  X,
  ExternalLink,
  Monitor,
  Smartphone,
  Clock,
  Calendar,
  FileText,
  Save,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  Check,
  ClipboardList,
  LogOut,
  User,
  Mail,
  Phone,
} from "lucide-react";

// ==========================================
// 0. GLOBALNE STYLE I ZMIENNE CSS (Soft & Clean UI + Figtree)
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800;900&display=swap');

    :root {
      /* --- TYPOGRAPHY --- */
      --font-family-base: 'Figtree', sans-serif;

      /* --- BRAND (PRIMARY) --- */
      --color-primary-50: #EEF2FF;
      --color-primary-100: #DBE5FF;
      --color-primary-500: #0038F8; /* Firmowy niebieski */
      --color-primary-700: #0027BA;
      --color-primary-900: #001566;

      /* --- NEUTRALS (SURFACES & TEXT) --- */
      --color-neutral-000: #FFFFFF;
      --color-neutral-050: #F8FAFC; /* Bardzo delikatne, chłodne tło aplikacji */
      --color-neutral-100: #F1F5F9; /* Tła dla hover / secondary areas */
      --color-neutral-200: #E2E8F0; /* Delikatne dzielniki */
      --color-neutral-400: #94A3B8; 
      --color-neutral-500: #64748B; /* Teksty pomocnicze, BORDERY WCAG (Kontrast 4.6:1 z bielą) */
      --color-neutral-700: #334155; /* Teksty zwykłe */
      --color-neutral-900: #0F172A; /* Nagłówki i ważne dane */

      /* --- SEMANTIC --- */
      --color-error-bg: #FEF2F2;
      --color-error-main: #EF4444;
      --color-error-text: #B91C1C;

      --color-warning-bg: #FFFBEB;
      --color-warning-main: #F59E0B;
      --color-warning-text: #92400E;

      --color-success-bg: #F0FDF4;
      --color-success-main: #10B981;
      --color-success-text: #166534;
      
      /* --- SOFT SHADOWS (Zwiększony kontrast cieni dla lepszej widoczności) --- */
      --shadow-sm: 0 2px 8px -2px rgba(15, 23, 42, 0.05);
      --shadow-soft: 0 8px 24px -4px rgba(15, 23, 42, 0.06);
      --shadow-card: 0 12px 32px -4px rgba(15, 23, 42, 0.08);
      --shadow-primary: 0 8px 24px -4px rgba(67, 56, 202, 0.3);
    }

    body, html, * {
      font-family: var(--font-family-base) !important;
    }

    body {
      font-variant-numeric: tabular-nums;
      background-color: var(--color-neutral-050);
      color: var(--color-neutral-700);
    }

    /* Ochrona WCAG 2.4.7 z łagodnymi zaokrągleniami */
    *:focus-visible {
      outline: 2px solid var(--color-primary-500) !important;
      outline-offset: 2px !important;
      border-color: transparent !important;
    }

    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--color-neutral-200); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--color-neutral-400); }
  `}</style>
);

// ==========================================
// 1. MOCK DATA
// ==========================================
const mockServicesData = [
  { id: "s1", title: "Kredyt konsumencki", score: null, processes: [] },
  { id: "s2", title: "Kredyt hipoteczny", score: null, processes: [] },
  {
    id: "s3",
    title: "Wskazane w ustawie usługi maklerskie",
    score: null,
    processes: [],
  },
  {
    id: "s4",
    title: "Usługi płatnicze i powiązane z rachunkiem płatniczym",
    score: 97.05,
    processes: [
      {
        id: "p1",
        title: "Zamknięcie konta z saldem dodatnim",
        score: 100,
        auditedViews: 5,
        totalViews: 5,
        status: "completed",
        views: [],
      },
      {
        id: "p2",
        title: "Otwarcie ROR (istniejący dorosły klient z MING desktop)",
        score: 85.2,
        auditedViews: 12,
        totalViews: 12,
        status: "needs_attention",
        views: [],
      },
      {
        id: "p3",
        title: "Otwarcie ROR (istniejący dorosły klient z MING android)",
        score: 97.05,
        auditedViews: 9,
        totalViews: 11,
        status: "in_progress",
        views: [
          {
            id: "v1",
            step: 1,
            title: "Strona główna ing.pl",
            score: 95.92,
            assignedElement: "Strona główna",
            stats: { priority: 4, warning: 0, details: 8 },
            errors: [
              {
                id: "e1",
                type: "priority",
                wcag: "1.1.1 Treść nietekstowa",
                desc: "Brak alternatywy tekstowej dla obrazka promocyjnego.",
                recommendation: "Dodaj atrybut alt opisujący funkcję obrazka.",
              },
              {
                id: "e2",
                type: "priority",
                wcag: "1.4.3 Kontrast",
                desc: "Zbyt niski kontrast tekstu na głównym przycisku.",
                recommendation: "Zmień kolor tekstu na #FFFFFF.",
              },
            ],
          },
          {
            id: "v2",
            step: 2,
            title: 'Podstrona "Konta"',
            score: 100,
            assignedElement: 'Podstrona "konta"',
            stats: { priority: 0, warning: 0, details: 8 },
            errors: [],
          },
          {
            id: "v3",
            step: 3,
            title: "Konto Direct",
            score: 80.0,
            assignedElement: null,
            stats: { priority: 6, warning: 0, details: 2 },
            errors: [],
          },
        ],
      },
    ],
  },
];

const mockAuditsData = [
  {
    id: "a1",
    title: "Strona ing.pl - wybrane podstrony",
    client: "ING",
    auditor: "Patryk Smułkowski",
    status: "Zakończony",
    dateStart: "12.02.2026",
    dateEnd: "12.02.2026",
    platforms: ["Desktop", "Android", "iOS"],
    level: "A, AA",
    version: "2.1",
    score: 77.55,
    stats: {
      priority: 3,
      warning: 1,
      marginal: 3,
      brokenCriteria: 11,
      totalCriteria: 49,
    },
    config: {
      desktop: "Chrome, NVDA",
      android: "Android 16, Talkback",
      ios: "iOS 15, Voiceover",
      docs: "",
    },
    summary:
      "Test podsumowania audytu z zachowaniem struktury wieloplatformowej.",
    elements: [
      {
        id: "el1",
        title: "Strona główna",
        priority: 1,
        warning: 1,
        marginal: 0,
      },
      {
        id: "el2",
        title: 'Podstrona "konta"',
        priority: 2,
        warning: 0,
        marginal: 1,
      },
      {
        id: "el3",
        title: 'Podstrona "karty"',
        priority: 0,
        warning: 0,
        marginal: 0,
      },
    ],
  },
  {
    id: "a2",
    title: "Aplikacja MING Android - wybrane elementy",
    client: "ING",
    auditor: "Patryk Smułkowski",
    status: "Zakończony",
    dateStart: "12.02.2026",
    dateEnd: "12.02.2026",
    platforms: ["Android"],
    level: "A, AA",
    version: "2.1",
    score: 83.67,
    stats: {
      priority: 2,
      warning: 2,
      marginal: 1,
      brokenCriteria: 8,
      totalCriteria: 49,
    },
    config: { desktop: "", android: "Android 16, Talkback", ios: "", docs: "" },
    summary: "Brak podsumowania",
    elements: [],
  },
];

const mockErrorsData = [
  {
    id: "e1",
    priority: "PRIORYTETOWY",
    platforms: ["Desktop", "Android"],
    problem:
      'Zbyt niski kontrast tekstu na głównym przycisku akcji "Weź pożyczkę".',
    recommendation: "Zmień kolor tła przycisku na ciemniejszy odcień.",
    criteria: ["1.4.3 Kontrast (Minimalny) (AA)"],
  },
  {
    id: "e2",
    priority: "WAŻNY",
    platforms: ["Desktop"],
    problem:
      "Brak widocznego fokusa na linkach w stopce po nawigacji klawiaturą.",
    recommendation: "Dodaj wyraźny styl :focus-visible.",
    criteria: ["2.4.7 Widoczny fokus (AA)", "2.1.1 Klawiatura (A)"],
  },
];

// ==========================================
// 2. WSPÓLNE KOMPONENTY UI (Zaktualizowane na WCAG 2.2 AA - Kontrast pól)
// ==========================================
const ScoreBadge = ({ score, large = false }) => {
  if (score === null)
    return (
      <span className="text-[var(--color-neutral-500)] text-sm font-bold bg-[var(--color-neutral-100)] rounded-lg px-3 py-1">
        -
      </span>
    );
  const isGood = score > 90;
  const isWarn = score > 70 && score <= 90;
  let bg = "bg-[var(--color-error-bg)]",
    text = "text-[var(--color-error-text)]";
  if (isGood) {
    bg = "bg-[var(--color-success-bg)]";
    text = "text-[var(--color-success-text)]";
  } else if (isWarn) {
    bg = "bg-[var(--color-warning-bg)]";
    text = "text-[var(--color-warning-text)]";
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-bold rounded-lg ${bg} ${text} ${
        large ? "px-4 py-1.5 text-base" : "px-3 py-1.5 text-xs"
      }`}
    >
      {score}%
    </span>
  );
};

const StatusBadge = ({ status }) => {
  if (status === "Zakończony")
    return (
      <span className="text-[var(--color-success-text)] font-bold text-xs flex items-center bg-[var(--color-success-bg)] px-3 py-1.5 rounded-lg">
        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[var(--color-success-main)]" />{" "}
        {status}
      </span>
    );
  if (status === "W trakcie")
    return (
      <span className="text-[var(--color-warning-text)] font-bold text-xs flex items-center bg-[var(--color-warning-bg)] px-3 py-1.5 rounded-lg">
        <Clock className="w-3.5 h-3.5 mr-1.5 text-[var(--color-warning-main)]" />{" "}
        {status}
      </span>
    );
  if (status === "Wymaga poprawek")
    return (
      <span className="text-[var(--color-error-text)] font-bold text-xs flex items-center bg-[var(--color-error-bg)] px-3 py-1.5 rounded-lg">
        <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-[var(--color-error-main)]" />{" "}
        {status}
      </span>
    );
  return (
    <span className="text-[var(--color-neutral-700)] font-bold text-xs bg-[var(--color-neutral-100)] px-3 py-1.5 rounded-lg">
      {status}
    </span>
  );
};

// Globalne style przycisków i inputów (Mocne ramki zgodnie z 1.4.11 Non-text Contrast)
const btnPrimary =
  "flex items-center px-5 py-2.5 bg-[var(--color-primary-500)] text-white text-sm font-bold rounded-lg hover:bg-[var(--color-primary-700)] shadow-[var(--shadow-primary)] transition-all";
const btnGhost =
  "flex items-center px-5 py-2.5 bg-white border border-[var(--color-neutral-500)] text-[var(--color-neutral-700)] text-sm font-bold rounded-lg hover:bg-[var(--color-neutral-050)] hover:text-[var(--color-primary-500)] transition-all";
const btnIcon =
  "p-2 text-[var(--color-neutral-500)] hover:text-[var(--color-primary-500)] bg-[var(--color-neutral-050)] hover:bg-[var(--color-primary-50)] rounded-lg transition-colors cursor-pointer";

// Input WCAG Compliant - solidna, widoczna ramka (contrast 3:1), ciemny placeholder (contrast 4.5:1)
const inputClass =
  "w-full p-3 bg-white border border-[var(--color-neutral-500)] rounded-lg text-sm font-medium text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-500)] transition-all focus:border-[var(--color-primary-500)] focus:ring-4 focus:ring-[var(--color-primary-50)] outline-none";

// Karty z wyraźniejszym cieniem
const cardClass =
  "bg-white rounded-xl shadow-[var(--shadow-card)] overflow-hidden border border-[var(--color-neutral-100)] hover:shadow-[0_16px_40px_-4px_rgba(15,23,42,0.1)] hover:border-[var(--color-primary-100)] transition-all duration-300";

// ==========================================
// 3. MODUŁ: MOJE USŁUGI
// ==========================================
const ServicesModule = ({ onNavigateToAuditor }) => {
  const [activeServiceId, setActiveServiceId] = useState("s4");
  const [activeProcessId, setActiveProcessId] = useState(null);
  const [expandedViews, setExpandedViews] = useState(["v1"]);
  const [isStructurePanelOpen, setIsStructurePanelOpen] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    title: "",
  });

  const activeService = mockServicesData.find((s) => s.id === activeServiceId);
  const activeProcess = activeService?.processes.find(
    (p) => p.id === activeProcessId
  );

  const openModal = (type, title, e) => {
    if (e) e.stopPropagation();
    setModalConfig({ isOpen: true, type, title });
  };
  const closeModal = () =>
    setModalConfig({ isOpen: false, type: null, title: "" });

  return (
    <div className="flex flex-1 overflow-hidden bg-[var(--color-neutral-050)]">
      {/* PANEL MASTER (Drzewo Usług) */}
      <div
        className={`bg-white flex flex-col z-10 flex-shrink-0 transition-all duration-300 ease-in-out whitespace-nowrap shadow-[var(--shadow-sm)] ${
          isStructurePanelOpen
            ? activeProcessId
              ? "w-[340px]"
              : "w-80"
            : "w-0 border-0 overflow-hidden"
        }`}
      >
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-neutral-900)]">
              Struktura
            </h2>
            <button
              onClick={() => setIsStructurePanelOpen(false)}
              className={btnIcon}
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-[var(--color-neutral-500)]" />
            <input
              type="text"
              placeholder="Szukaj usługi..."
              className={`${inputClass} pl-11 py-2.5`}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {mockServicesData.map((service) => {
            const isServiceActive = service.id === activeServiceId;
            const showProcessesInSidebar =
              isServiceActive && activeProcessId !== null;
            return (
              <div key={service.id} className="mb-2">
                <button
                  onClick={() => {
                    setActiveServiceId(service.id);
                    setActiveProcessId(null);
                    setIsStructurePanelOpen(true);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                    isServiceActive && !activeProcessId
                      ? "bg-[var(--color-primary-500)] text-white shadow-[var(--shadow-primary)]"
                      : "bg-transparent text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-050)]"
                  }`}
                >
                  <div className="flex items-center overflow-hidden pr-2">
                    {showProcessesInSidebar ? (
                      <ChevronDown
                        className={`w-4 h-4 mr-2.5 flex-shrink-0 ${
                          isServiceActive && !activeProcessId
                            ? "text-white/80"
                            : "text-[var(--color-neutral-500)]"
                        }`}
                      />
                    ) : (
                      <ChevronRight
                        className={`w-4 h-4 mr-2.5 flex-shrink-0 ${
                          isServiceActive && !activeProcessId
                            ? "text-white/80"
                            : "text-[var(--color-neutral-500)]"
                        }`}
                      />
                    )}
                    <FolderKanban
                      className={`w-4 h-4 mr-2.5 flex-shrink-0 ${
                        isServiceActive && !activeProcessId
                          ? "text-white"
                          : "text-[var(--color-primary-500)]"
                      }`}
                    />
                    <span className={`text-sm truncate font-bold`}>
                      {service.title}
                    </span>
                  </div>
                  {!showProcessesInSidebar && (
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                        isServiceActive && !activeProcessId
                          ? "bg-white/20 text-white"
                          : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-500)]"
                      }`}
                    >
                      {service.processes?.length || 0}
                    </span>
                  )}
                </button>

                {/* Zagnieżdżone procesy - wizualnie podpięte bez ramek */}
                {showProcessesInSidebar && (
                  <div className="mt-1 ml-4 space-y-1 border-l-2 border-[var(--color-neutral-100)] pl-2">
                    {service.processes.map((process) => {
                      const isProcessActive = process.id === activeProcessId;
                      return (
                        <button
                          key={process.id}
                          onClick={() => setActiveProcessId(process.id)}
                          className={`w-full flex items-center p-3 rounded-xl transition-all ${
                            isProcessActive
                              ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] font-bold"
                              : "text-[var(--color-neutral-600)] font-medium hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)]"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0 ${
                              isProcessActive
                                ? "bg-[var(--color-primary-500)]"
                                : "bg-[var(--color-neutral-300)]"
                            }`}
                          ></div>
                          <span className="text-sm truncate text-left">
                            {process.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PANEL DETAIL (Główny obszar) */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header Sekcji */}
        <div className="bg-white border-b border-[var(--color-neutral-100)] shadow-[var(--shadow-sm)] px-8 py-8 z-10 flex-shrink-0">
          <div className="flex items-center text-xs font-bold text-[var(--color-neutral-500)] mb-3">
            {!isStructurePanelOpen && (
              <button
                onClick={() => setIsStructurePanelOpen(true)}
                className={`${btnIcon} mr-3 py-1 px-1.5 bg-[var(--color-neutral-050)]`}
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
            <FolderKanban className="w-4 h-4 mr-2" />{" "}
            <span className="uppercase tracking-wider">Moje usługi</span>{" "}
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-[var(--color-neutral-300)]" />
            {activeProcessId ? (
              <span className="text-[var(--color-primary-500)] font-bold uppercase tracking-wider">
                Procesy audytowe
              </span>
            ) : (
              <span className="text-[var(--color-neutral-900)] font-bold uppercase tracking-wider">
                Przegląd struktury
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-[var(--color-neutral-900)] tracking-tight">
              {activeProcessId ? activeProcess.title : activeService?.title}
            </h1>
            <div className="flex space-x-3">
              {activeProcessId && (
                <button
                  onClick={() => setActiveProcessId(null)}
                  className={btnGhost}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Powrót
                </button>
              )}
              <button className={btnPrimary}>
                <Plus className="w-4 h-4 mr-2" />{" "}
                {activeProcessId ? "Nowy Widok" : "Nowy Proces"}
              </button>
            </div>
          </div>
        </div>

        {/* Zawartość Scrollowana */}
        <div className="flex-1 overflow-y-auto px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {!activeProcessId ? (
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-sm font-bold text-[var(--color-neutral-500)]">
                    Zarządzanie procesami (
                    {activeService?.processes.length || 0})
                  </span>
                </div>

                {/* Karty Procesów - Brak granic, poleganie na cieniu i tle */}
                {activeService?.processes.map((process) => (
                  <div
                    key={process.id}
                    className={`${cardClass} p-5 flex items-center justify-between cursor-pointer group`}
                    onClick={() => {
                      setActiveProcessId(process.id);
                      setIsStructurePanelOpen(true);
                    }}
                  >
                    <div className="flex items-center space-x-4 w-1/3">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-neutral-050)] flex items-center justify-center text-[var(--color-neutral-500)] group-hover:bg-[var(--color-primary-50)] group-hover:text-[var(--color-primary-500)] transition-colors">
                        <LayoutTemplate className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-[var(--color-neutral-900)] text-base group-hover:text-[var(--color-primary-500)] transition-colors line-clamp-1">
                        {process.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-center w-1/6">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-[var(--color-neutral-400)] uppercase tracking-wider mb-1.5">
                          Widoki
                        </span>
                        <span className="text-sm font-bold text-[var(--color-neutral-900)] bg-[var(--color-neutral-050)] px-3 py-1 rounded-lg">
                          {process.auditedViews}{" "}
                          <span className="text-[var(--color-neutral-400)]">
                            / {process.totalViews}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center w-1/6">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-[var(--color-neutral-400)] uppercase tracking-wider mb-1.5">
                          Dostępność
                        </span>
                        <ScoreBadge score={process.score} />
                      </div>
                    </div>

                    <div className="flex items-center justify-center w-1/6">
                      <StatusBadge status={process.status} />
                    </div>

                    <div className="flex items-center justify-end space-x-2 w-1/6">
                      <button className={btnIcon}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-error-main)] bg-[var(--color-neutral-050)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="p-2 text-[var(--color-primary-500)] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-5 max-w-5xl mx-auto mt-6">
                {/* Karty Widoków */}
                {activeProcess.views.map((view, index) => {
                  const isExpanded = expandedViews.includes(view.id);
                  const isPerfect = view.score === 100;
                  return (
                    <div
                      key={view.id}
                      className={`${cardClass} transition-shadow duration-300 ${
                        isExpanded
                          ? "shadow-md ring-1 ring-[var(--color-primary-100)]"
                          : ""
                      }`}
                    >
                      <div
                        className={`p-5 flex items-center justify-between cursor-pointer group ${
                          isExpanded
                            ? "bg-[var(--color-neutral-050)]/50"
                            : "hover:bg-[var(--color-neutral-050)]/50"
                        }`}
                        onClick={() =>
                          setExpandedViews((prev) =>
                            prev.includes(view.id)
                              ? prev.filter((v) => v !== view.id)
                              : [...prev, view.id]
                          )
                        }
                      >
                        <div className="flex items-center space-x-5 flex-1 min-w-0 pr-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                              isPerfect
                                ? "bg-[var(--color-success-bg)] text-[var(--color-success-main)]"
                                : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] group-hover:bg-[var(--color-primary-50)] group-hover:text-[var(--color-primary-700)] transition-colors"
                            }`}
                          >
                            {view.step}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <h3 className="text-lg font-bold text-[var(--color-neutral-900)] flex items-center">
                              {view.title}
                              {isPerfect && (
                                <CheckCircle2 className="w-5 h-5 ml-2 text-[var(--color-success-main)]" />
                              )}
                            </h3>
                            {view.assignedElement ? (
                              <p className="text-sm font-medium text-[var(--color-neutral-500)] mt-1 truncate flex items-center">
                                <Link className="w-3.5 h-3.5 mr-1.5 text-[var(--color-primary-500)]" />
                                {view.assignedElement}
                              </p>
                            ) : (
                              <p className="text-sm text-[var(--color-error-text)] mt-1 font-bold flex items-center">
                                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-[var(--color-error-main)]" />{" "}
                                Brak przypisanego audytu
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 flex-shrink-0">
                          <div
                            className="flex items-center space-x-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {view.assignedElement ? (
                              <button
                                onClick={() =>
                                  onNavigateToAuditor(view.assignedElement)
                                }
                                className="flex items-center px-4 py-2 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-500)] hover:text-white rounded-lg text-sm font-bold transition-colors"
                              >
                                Otwórz audyt{" "}
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </button>
                            ) : (
                              <button
                                onClick={(e) =>
                                  openModal(
                                    "assignAudit",
                                    "Przypisz element audytu",
                                    e
                                  )
                                }
                                className={btnGhost}
                              >
                                <Link className="w-4 h-4 mr-2 text-[var(--color-neutral-500)]" />{" "}
                                Przypisz audyt
                              </button>
                            )}
                            <button className={btnIcon} title="Edytuj widok">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="h-8 w-px bg-[var(--color-neutral-200)] mx-1"></div>

                          <div className="flex flex-col items-end w-32">
                            <div className="flex space-x-4 text-sm mb-1.5">
                              <div className="flex items-center font-bold text-[var(--color-neutral-700)]">
                                <AlertOctagon className="w-4 h-4 mr-1.5 text-[var(--color-error-main)]" />
                                {view.stats.priority}
                              </div>
                              <div className="flex items-center font-bold text-[var(--color-neutral-700)]">
                                <AlertTriangle className="w-4 h-4 mr-1.5 text-[var(--color-warning-main)]" />
                                {view.stats.warning}
                              </div>
                            </div>
                            <ScoreBadge score={view.score} />
                          </div>

                          <div
                            className={`p-2 rounded-lg transition-transform duration-300 ${
                              isExpanded
                                ? "bg-[var(--color-neutral-200)] rotate-180"
                                : "bg-[var(--color-neutral-100)] group-hover:bg-[var(--color-neutral-200)]"
                            }`}
                          >
                            <ChevronDown className="w-5 h-5 text-[var(--color-neutral-700)]" />
                          </div>
                        </div>
                      </div>

                      {/* Błędy (Akordeon z tłem) */}
                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          isExpanded
                            ? "max-h-[1000px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="p-6 bg-[var(--color-neutral-050)]/50 border-t border-[var(--color-neutral-100)]">
                          {view.errors && view.errors.length > 0 ? (
                            <div className="flex flex-col gap-3">
                              {view.errors.map((error, idx) => (
                                <div
                                  key={error.id}
                                  className="bg-white p-5 rounded-xl shadow-[var(--shadow-soft)] border border-[var(--color-neutral-100)] flex items-start"
                                >
                                  <div className="w-8 h-8 rounded-full bg-[var(--color-error-bg)] flex items-center justify-center mr-4 flex-shrink-0 mt-0.5">
                                    <AlertOctagon className="w-4 h-4 text-[var(--color-error-main)]" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <span className="text-[10px] font-bold text-[var(--color-error-text)] bg-[var(--color-error-bg)] px-2.5 py-1 rounded-md uppercase tracking-wider">
                                        Priorytet
                                      </span>
                                      <span className="text-xs font-bold text-[var(--color-neutral-500)] font-mono">
                                        {error.wcag}
                                      </span>
                                    </div>
                                    <p className="text-sm font-semibold text-[var(--color-neutral-900)]">
                                      {error.desc}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-8 text-center flex flex-col items-center bg-white rounded-xl shadow-[var(--shadow-soft)] border border-[var(--color-neutral-100)]">
                              <div className="w-12 h-12 bg-[var(--color-success-bg)] rounded-full flex items-center justify-center mb-3">
                                <CheckCircle2 className="w-6 h-6 text-[var(--color-success-main)]" />
                              </div>
                              <span className="text-sm font-bold text-[var(--color-success-text)]">
                                Ten widok nie posiada zgłoszonych błędów.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL MOCK */}
      {modalConfig.isOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--color-neutral-900)]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-[var(--color-neutral-100)] flex justify-between items-center bg-[var(--color-neutral-050)]">
              <h2 className="text-xl font-bold text-[var(--color-neutral-900)]">
                {modalConfig.title}
              </h2>
              <button onClick={closeModal} className={btnIcon}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 h-64 flex flex-col items-center justify-center text-[var(--color-neutral-400)] font-bold">
              <Link className="w-12 h-12 mb-4 text-[var(--color-primary-100)]" />
              Tu znajduje się formularz wyszukiwania elementu...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. MODUŁ: AUDYTY (Klient & Dev)
// ==========================================
const AuditsModule = ({ onNavigateToAuditor, isDevMode }) => {
  const [currentView, setCurrentView] = useState("list");
  const [activeAuditId, setActiveAuditId] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState(["Desktop"]);

  const activeAudit =
    mockAuditsData.find((a) => a.id === activeAuditId) || mockAuditsData[0];

  const navigateTo = (view, id = null) => {
    if (id) setActiveAuditId(id);
    if (view === "edit" && isDevMode) {
      const auditToEdit = id ? mockAuditsData.find((a) => a.id === id) : null;
      setSelectedPlatforms(auditToEdit ? auditToEdit.platforms : ["Desktop"]);
    }
    setCurrentView(view);
  };

  const togglePlatform = (p) =>
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--color-neutral-050)]">
      {/* ---------------- WIDOK 1: LISTA (Soft Grid) ---------------- */}
      {currentView === "list" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-[var(--color-neutral-100)] shadow-[var(--shadow-sm)] px-8 py-8 z-10 flex-shrink-0">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-[var(--color-neutral-900)] tracking-tight">
                    Projekty Audytowe
                  </h1>
                  <p className="text-base font-medium text-[var(--color-neutral-500)] mt-2">
                    {isDevMode
                      ? "Zarządzaj prowadzonymi projektami i elementami badawczymi."
                      : "Przeglądaj raporty dostępności dla swoich usług."}
                  </p>
                </div>
                {isDevMode && (
                  <button
                    onClick={() => navigateTo("edit")}
                    className={btnPrimary}
                  >
                    <Plus className="w-5 h-5 mr-2" /> Rozpocznij nowy projekt
                  </button>
                )}
              </div>

              {/* Sekcja filtrów - z wyraźnymi obramowaniami WCAG (3:1 Kontrast) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[var(--color-neutral-050)] p-4 rounded-xl border border-[var(--color-neutral-200)]">
                <div className="col-span-1 md:col-span-2 relative">
                  <Search className="w-5 h-5 absolute left-4 top-3.5 text-[var(--color-neutral-500)]" />
                  <input
                    type="text"
                    placeholder="Szukaj audytu po nazwie..."
                    className={`${inputClass} pl-12`}
                  />
                </div>
                <select className={inputClass}>
                  <option>Wszyscy klienci</option>
                  <option>ING</option>
                </select>
                <select className={inputClass}>
                  <option>Status: Wszystkie</option>
                  <option>W trakcie</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-12 mt-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockAuditsData.map((audit) => (
                  <div
                    key={audit.id}
                    className={`${cardClass} flex flex-col group hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="p-6 pb-4 flex justify-between items-center bg-white">
                      <span className="text-xs font-bold text-[var(--color-neutral-700)] flex items-center bg-[var(--color-neutral-050)] border border-[var(--color-neutral-200)] px-3 py-1.5 rounded-lg">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-[var(--color-primary-500)]" />{" "}
                        {audit.dateStart}
                      </span>
                      <StatusBadge status={audit.status} />
                    </div>

                    <div className="p-6 pt-2 flex-1 bg-white">
                      <div className="inline-block px-2.5 py-1 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-[10px] font-bold uppercase tracking-wider rounded-md mb-3">
                        {audit.client}
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-neutral-900)] mb-4 leading-tight group-hover:text-[var(--color-primary-500)] transition-colors">
                        {audit.title}
                      </h3>

                      <div className="flex items-center space-x-2 text-sm font-medium text-[var(--color-neutral-500)]">
                        <Monitor className="w-4 h-4" />{" "}
                        <span>{audit.platforms.join(", ")}</span>
                      </div>
                    </div>

                    <div className="p-6 bg-[var(--color-neutral-050)]/50 flex justify-between items-center mt-auto border-t border-[var(--color-neutral-100)]">
                      <div className="flex space-x-5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1">
                            Priorytet
                          </span>
                          <span className="text-xl font-bold text-[var(--color-error-main)] flex items-center leading-none">
                            {audit.stats.priority}
                          </span>
                        </div>
                        <div className="h-8 w-px bg-[var(--color-neutral-200)]"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1">
                            Wynik
                          </span>
                          <span className="text-xl font-bold text-[var(--color-success-main)] flex items-center leading-none">
                            {audit.score}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isDevMode && (
                          <button
                            onClick={() => navigateTo("edit", audit.id)}
                            className={btnGhost}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => navigateTo("details", audit.id)}
                          className="flex items-center justify-center w-10 h-10 bg-[var(--color-primary-500)] text-white rounded-lg shadow-[var(--shadow-primary)] hover:bg-[var(--color-primary-700)] transition-all transform hover:scale-105"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- WIDOK 2: SZCZEGÓŁY ---------------- */}
      {currentView === "details" && (
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          <div className="bg-white border-b border-[var(--color-neutral-100)] shadow-[var(--shadow-sm)] px-8 py-8 z-10">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => navigateTo("list")}
                className="flex items-center text-sm font-bold text-[var(--color-neutral-500)] hover:text-[var(--color-primary-500)] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Wróć do projektów
              </button>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <StatusBadge status={activeAudit.status} />
                    <span className="px-3 py-1 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-xs font-bold uppercase tracking-wider rounded-lg">
                      {activeAudit.client}
                    </span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[var(--color-neutral-900)]">
                    {activeAudit.title}
                  </h1>
                </div>
                <div className="flex space-x-3">
                  {isDevMode && (
                    <button
                      onClick={() => navigateTo("edit", activeAudit.id)}
                      className={btnGhost}
                    >
                      <Edit2 className="w-4 h-4 mr-2" /> Metadane
                    </button>
                  )}
                  <button className={btnPrimary}>
                    <FileText className="w-4 h-4 mr-2" /> Pobierz Raport
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full px-8 pb-12 space-y-8 mt-6">
            {/* Soft Cards for Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${cardClass} p-6 flex items-center space-x-5`}>
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-success-bg)] flex items-center justify-center text-[var(--color-success-main)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Zgodność
                  </p>
                  <h3 className="text-3xl font-extrabold text-[var(--color-neutral-900)] mt-1">
                    {activeAudit.score}%
                  </h3>
                </div>
              </div>
              <div className={`${cardClass} p-6 flex items-center space-x-5`}>
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-error-bg)] flex items-center justify-center text-[var(--color-error-main)]">
                  <AlertOctagon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Priorytety
                  </p>
                  <h3 className="text-3xl font-extrabold text-[var(--color-neutral-900)] mt-1">
                    {activeAudit.stats.priority}
                  </h3>
                </div>
              </div>
              <div className={`${cardClass} p-6 flex items-center space-x-5`}>
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-warning-bg)] flex items-center justify-center text-[var(--color-warning-main)]">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Ważne
                  </p>
                  <h3 className="text-3xl font-extrabold text-[var(--color-neutral-900)] mt-1">
                    {activeAudit.stats.warning}
                  </h3>
                </div>
              </div>
              <div className={`${cardClass} p-6 flex items-center space-x-5`}>
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-50)] flex items-center justify-center text-[var(--color-primary-500)]">
                  <ListOrdered className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Kryteria
                  </p>
                  <h3 className="text-3xl font-extrabold text-[var(--color-neutral-900)] mt-1">
                    {activeAudit.stats.brokenCriteria}{" "}
                    <span className="text-base text-[var(--color-neutral-400)] font-semibold">
                      / {activeAudit.stats.totalCriteria}
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="p-6 border-b border-[var(--color-neutral-100)] flex justify-between items-center bg-white">
                <h2 className="text-lg font-bold text-[var(--color-neutral-900)]">
                  Przetestowane Elementy (Widoki)
                </h2>
                {isDevMode && (
                  <button className="flex items-center text-sm font-bold text-[var(--color-primary-500)] hover:text-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-4 py-2 rounded-lg transition-colors">
                    <Plus className="w-4 h-4 mr-1.5" /> Dodaj element
                  </button>
                )}
              </div>

              <div className="p-6 bg-[var(--color-neutral-050)]/50">
                <div className="flex flex-col gap-3">
                  {activeAudit.elements.map((el) => (
                    <div
                      key={el.id}
                      className="bg-white p-5 rounded-xl shadow-[var(--shadow-soft)] border border-[var(--color-neutral-100)] flex items-center justify-between hover:shadow-[var(--shadow-card)] transition-all group"
                    >
                      <div className="flex items-center space-x-4 w-1/3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-neutral-050)] flex items-center justify-center text-[var(--color-neutral-500)] group-hover:bg-[var(--color-primary-50)] group-hover:text-[var(--color-primary-500)] transition-colors">
                          <LayoutTemplate className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-[var(--color-neutral-900)] group-hover:text-[var(--color-primary-500)] transition-colors">
                          {el.title}
                        </h3>
                      </div>

                      <div className="flex space-x-8 w-1/3 justify-center">
                        <div className="flex items-center text-sm font-bold">
                          <AlertOctagon
                            className={`w-4 h-4 mr-2 ${
                              el.priority > 0
                                ? "text-[var(--color-error-main)]"
                                : "text-[var(--color-neutral-300)]"
                            }`}
                          />
                          <span
                            className={
                              el.priority > 0
                                ? "text-[var(--color-neutral-900)]"
                                : "text-[var(--color-neutral-400)]"
                            }
                          >
                            {el.priority}
                          </span>
                        </div>
                        <div className="flex items-center text-sm font-bold">
                          <AlertTriangle
                            className={`w-4 h-4 mr-2 ${
                              el.warning > 0
                                ? "text-[var(--color-warning-main)]"
                                : "text-[var(--color-neutral-300)]"
                            }`}
                          />
                          <span
                            className={
                              el.warning > 0
                                ? "text-[var(--color-neutral-900)]"
                                : "text-[var(--color-neutral-400)]"
                            }
                          >
                            {el.warning}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 w-1/3">
                        <button
                          onClick={() => onNavigateToAuditor(el.title)}
                          className="flex items-center px-4 py-2 bg-[var(--color-neutral-050)] border border-[var(--color-neutral-200)] hover:bg-[var(--color-primary-50)] text-[var(--color-neutral-700)] hover:text-[var(--color-primary-700)] text-sm font-bold rounded-lg transition-colors"
                        >
                          {isDevMode ? "Edytuj błędy" : "Raport"}{" "}
                          <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                        </button>
                        {isDevMode && (
                          <>
                            <button
                              className={btnGhost}
                              style={{ padding: "0.5rem" }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-[var(--color-neutral-500)] hover:text-[var(--color-error-main)] bg-white shadow-sm border border-[var(--color-neutral-500)] hover:bg-[var(--color-error-bg)] hover:border-[var(--color-error-main)] rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- WIDOK 3: EDYCJA (Tylko Dev) ---------------- */}
      {currentView === "edit" && isDevMode && (
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--color-neutral-050)]">
          <div className="bg-white border-b border-[var(--color-neutral-100)] shadow-[var(--shadow-sm)] px-8 py-8 z-10 flex-shrink-0">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <h1 className="text-3xl font-extrabold text-[var(--color-neutral-900)] tracking-tight">
                {activeAuditId ? "Edytuj Audyt" : "Nowy Projekt Audytowy"}
              </h1>
              <button
                onClick={() => navigateTo(activeAuditId ? "details" : "list")}
                className="flex items-center text-sm font-bold text-[var(--color-neutral-700)] hover:text-[var(--color-primary-500)] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-[var(--color-neutral-500)]"
              >
                <X className="w-4 h-4 mr-1.5" /> Anuluj
              </button>
            </div>
          </div>
          <div className="max-w-4xl mx-auto w-full p-8">
            <div className={cardClass}>
              <div className="p-8 space-y-8 bg-white">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-neutral-900)] mb-2">
                      Klient *
                    </label>
                    <select
                      className={inputClass}
                      defaultValue={
                        activeAuditId ? "ING" : "Wybierz klienta..."
                      }
                    >
                      <option>Wybierz klienta...</option>
                      <option>ING</option>
                      <option>BNP Paribas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-neutral-900)] mb-2">
                      Nazwa audytu *
                    </label>
                    <input
                      type="text"
                      defaultValue={activeAuditId ? activeAudit.title : ""}
                      className={inputClass}
                      placeholder="Wpisz nazwę..."
                    />
                  </div>
                </div>

                <div className="border-t border-[var(--color-neutral-100)] pt-8">
                  <label className="block text-xs font-bold text-[var(--color-neutral-900)] mb-4">
                    Badane Platformy
                  </label>
                  <div className="flex flex-wrap gap-4 mb-8">
                    {["Desktop", "Android", "iOS", "Dokumenty"].map(
                      (platform) => (
                        <button
                          key={platform}
                          onClick={() => togglePlatform(platform)}
                          className={`flex items-center px-5 py-2.5 rounded-lg font-bold text-sm transition-all border ${
                            selectedPlatforms.includes(platform)
                              ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-[var(--color-primary-500)] ring-1 ring-[var(--color-primary-500)]"
                              : "bg-white text-[var(--color-neutral-700)] border-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-050)]"
                          }`}
                        >
                          {selectedPlatforms.includes(platform) && (
                            <Check className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />
                          )}
                          {platform}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-[var(--color-neutral-050)]/50 p-6 border-t border-[var(--color-neutral-100)] flex justify-end space-x-4">
                <button
                  onClick={() => navigateTo("details", activeAuditId || "a1")}
                  className={btnGhost}
                >
                  Zapisz projekt
                </button>
              </div>
            </div>
            <div className="pb-12"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. MODUŁ: PANEL AUDYTORA
// ==========================================
const AuditorWorkspaceModule = ({ activeElementName, onBack, isDevMode }) => {
  const [errors, setErrors] = useState(mockErrorsData);
  const [activeErrorId, setActiveErrorId] = useState(null);
  const [formData, setFormData] = useState({
    priority: "PRIORYTETOWY",
    platforms: ["Desktop"],
    problem: "",
    recommendation: "",
    criteria: [],
  });

  const handleEdit = (error) => {
    setActiveErrorId(error.id);
    setFormData({ ...error });
  };
  const handleAddNew = () => {
    setActiveErrorId(null);
    setFormData({
      priority: "PRIORYTETOWY",
      platforms: ["Desktop"],
      problem: "",
      recommendation: "",
      criteria: [],
    });
  };

  const PriorityBadge = ({ type }) => {
    const styles = {
      PRIORYTETOWY:
        "bg-[var(--color-error-bg)] text-[var(--color-error-text)] border-[var(--color-error-main)]",
      WAŻNY:
        "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border-[var(--color-warning-main)]",
    };
    return (
      <span
        className={`px-2.5 py-1 text-[10px] rounded-md font-bold uppercase tracking-wider border ${
          styles[type] ||
          "bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] border-[var(--color-neutral-500)]"
        }`}
      >
        {type}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-neutral-050)] relative z-30">
      <div className="bg-white border-b border-[var(--color-neutral-100)] shadow-[var(--shadow-sm)] z-10 px-8 py-5 flex justify-between items-center">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-xs font-bold text-[var(--color-neutral-700)] hover:text-[var(--color-primary-500)] mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Wróć do przeglądu
          </button>
          <h1 className="text-xl font-bold text-[var(--color-neutral-900)] flex items-center">
            Edytor elementu:{" "}
            <span className="text-[var(--color-primary-500)] ml-2">
              {activeElementName || "Logowanie"}
            </span>
          </h1>
        </div>
        <div className="bg-[var(--color-neutral-050)] rounded-xl px-5 py-2.5 flex items-center border border-[var(--color-neutral-200)]">
          <div className="flex flex-col items-center mr-6 pr-6 border-r border-[var(--color-neutral-200)]">
            <span className="text-xl font-bold text-[var(--color-error-main)] leading-none">
              2
            </span>
            <span className="text-[10px] font-bold text-[var(--color-neutral-700)] uppercase tracking-wider mt-1">
              Priorytety
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-[var(--color-success-main)] leading-none">
              89%
            </span>
            <span className="text-[10px] font-bold text-[var(--color-neutral-700)] uppercase tracking-wider mt-1">
              Zgodność WCAG
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        <div
          className={`${
            isDevMode ? "w-1/2 lg:w-5/12 xl:w-1/3" : "w-full max-w-4xl mx-auto"
          } flex flex-col`}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-sm font-bold text-[var(--color-neutral-900)]">
              Zgłoszone błędy ({errors.length})
            </span>
            {isDevMode && (
              <button
                onClick={handleAddNew}
                className={btnGhost}
                style={{ padding: "0.5rem 1rem" }}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Dodaj błąd
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pb-12 pr-2">
            {errors.map((error) => (
              <div
                key={error.id}
                onClick={() => isDevMode && handleEdit(error)}
                className={`bg-white p-5 rounded-xl shadow-[var(--shadow-soft)] border transition-all ${
                  isDevMode ? "cursor-pointer group" : ""
                } ${
                  activeErrorId === error.id && isDevMode
                    ? "border-[var(--color-primary-500)] ring-1 ring-[var(--color-primary-500)]"
                    : "border-[var(--color-neutral-200)] hover:border-[var(--color-primary-300)]"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-[var(--color-neutral-500)]">
                      #{error.id.replace("e", "00")}
                    </span>
                    <PriorityBadge type={error.priority} />
                  </div>
                  {isDevMode && (
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--color-neutral-500)] hover:text-[var(--color-error-main)] border border-transparent hover:border-[var(--color-error-main)] bg-[var(--color-neutral-050)] hover:bg-[var(--color-error-bg)] rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-[var(--color-neutral-900)] font-medium leading-relaxed">
                  {error.problem}
                </p>
              </div>
            ))}
          </div>
        </div>

        {isDevMode && (
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-[var(--shadow-card)] border border-[var(--color-neutral-200)] overflow-hidden mb-6">
            <div className="p-6 border-b border-[var(--color-neutral-100)] bg-white flex justify-between items-center">
              <h2 className="text-lg font-bold text-[var(--color-neutral-900)] flex items-center">
                {activeErrorId ? (
                  <>
                    <Edit2 className="w-5 h-5 mr-2 text-[var(--color-primary-500)]" />{" "}
                    Edycja błędu #{activeErrorId.replace("e", "00")}
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2 text-[var(--color-success-main)]" />{" "}
                    Zgłoś nowy błąd
                  </>
                )}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
              <div>
                <label className="block text-xs font-bold text-[var(--color-neutral-900)] mb-2">
                  Priorytet *
                </label>
                <select
                  className={inputClass}
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="PRIORYTETOWY">🔴 Priorytetowy</option>
                  <option value="WAŻNY">🟠 Ważny</option>
                  <option value="MARGINALNY">⚪ Marginalny</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-xs font-bold text-[var(--color-neutral-900)]">
                    Opis Problemu *
                  </label>
                  <button className="flex items-center text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg border border-violet-700 transition-colors">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Asystent AI
                  </button>
                </div>
                <textarea
                  rows="4"
                  className={inputClass}
                  value={formData.problem}
                  onChange={(e) =>
                    setFormData({ ...formData, problem: e.target.value })
                  }
                  placeholder="Opisz dokładnie na czym polega problem dostępności..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-neutral-900)] mb-2">
                  Rekomendacja dla klienta (Opcjonalnie)
                </label>
                <textarea
                  rows="3"
                  className={inputClass}
                  value={formData.recommendation}
                  onChange={(e) =>
                    setFormData({ ...formData, recommendation: e.target.value })
                  }
                  placeholder="Wpisz rekomendację rozwiązania..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-[var(--color-neutral-100)] bg-[var(--color-neutral-050)]/50 flex justify-end space-x-3">
              <button className={btnGhost}>Anuluj</button>
              <button className={btnPrimary}>
                <Check className="w-5 h-5 mr-2" /> Zapisz błąd
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// X. MODUŁ: PROFIL UŻYTKOWNIKA (Mój Profil)
// ==========================================
const ProfileModule = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--color-neutral-050)]">
      <div className="bg-white border-b border-[var(--color-neutral-100)] shadow-[var(--shadow-sm)] px-8 py-8 z-10 flex-shrink-0">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-[var(--color-neutral-900)] tracking-tight">
            Mój Profil
          </h1>
          <button className={btnGhost}>
            <Edit2 className="w-4 h-4 mr-2" /> Edytuj Profil
          </button>
        </div>
      </div>

      <div className="flex-1 px-8 py-8 pb-12">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Wizytówka Główna */}
          <div className={`${cardClass} p-8 flex items-center space-x-8`}>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Patryk"
              alt="Avatar"
              className="w-32 h-32 rounded-3xl border-4 border-[var(--color-neutral-050)] shadow-sm bg-[var(--color-neutral-100)]"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-[var(--color-neutral-900)] mb-1">
                Smułkowski Patryk
              </h2>
              <p className="text-sm font-medium text-[var(--color-neutral-700)] mb-3">
                Accessibility Specialist, Senior accessibility project manager
              </p>
              <p className="text-sm font-bold text-[var(--color-primary-500)] mb-4">
                Admin, Audytor, Klient
              </p>
              <span className="bg-[var(--color-success-main)] text-white text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm">
                Aktywny
              </span>
            </div>
          </div>

          {/* Dane kontaktowe */}
          <div className={cardClass}>
            <div className="p-5 border-b border-[var(--color-neutral-100)] bg-white flex items-center">
              <Mail className="w-5 h-5 mr-3 text-[var(--color-neutral-700)]" />
              <h3 className="text-sm font-bold text-[var(--color-neutral-900)]">
                Dane kontaktowe
              </h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-8 bg-[var(--color-neutral-050)]/30">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <Mail className="w-3 h-3 mr-1" /> Adres e-mail
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  patryk@widzialni.eu
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <Phone className="w-3 h-3 mr-1" /> Numer telefonu
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  503526875
                </p>
              </div>
            </div>
          </div>

          {/* Nieobecności i L4 */}
          <div className={cardClass}>
            <div className="p-5 border-b border-[var(--color-neutral-100)] bg-white flex items-center">
              <CalendarOff className="w-5 h-5 mr-3 text-[var(--color-neutral-700)]" />
              <h3 className="text-sm font-bold text-[var(--color-neutral-900)]">
                Nieobecności i L4 w roku 2026
              </h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-8 bg-[var(--color-neutral-050)]/30">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <CalendarDays className="w-3 h-3 mr-1" /> Ilość wykorzystanych
                  dni urlopu
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  13 dni
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Ilość dni na L4
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  0 dni
                </p>
              </div>
            </div>
          </div>

          {/* Informacje o zatrudnieniu */}
          <div className={cardClass}>
            <div className="p-5 border-b border-[var(--color-neutral-100)] bg-white flex items-center">
              <Briefcase className="w-5 h-5 mr-3 text-[var(--color-neutral-700)]" />
              <h3 className="text-sm font-bold text-[var(--color-neutral-900)]">
                Informacje o zatrudnieniu
              </h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-8 gap-x-8 bg-[var(--color-neutral-050)]/30">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Rejestrowanie czasu pracy
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  Tak
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <UserCog className="w-3 h-3 mr-1" /> Wymiar etatu
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  Pełny etat
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <CalendarDays className="w-3 h-3 mr-1" /> Roczna ilość dni
                  urlopu
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  26 dni
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <CalendarDays className="w-3 h-3 mr-1" /> Aktualna ilość dni
                  urlopu
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  13 dni
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> Data podjęcia współpracy
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  01.09.2023
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <CalendarOff className="w-3 h-3 mr-1" /> Data zakończenia
                  współpracy
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-500)] italic">
                  Nie podano
                </p>
              </div>
            </div>
          </div>

          {/* Informacje systemowe */}
          <div className={cardClass}>
            <div className="p-5 border-b border-[var(--color-neutral-100)] bg-white flex items-center">
              <Clock className="w-5 h-5 mr-3 text-[var(--color-neutral-700)]" />
              <h3 className="text-sm font-bold text-[var(--color-neutral-900)]">
                Informacje systemowe
              </h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-8 bg-[var(--color-neutral-050)]/30">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> Data utworzenia
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  02.09.2023 13:22
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider mb-1.5 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Ostatnia aktualizacja
                </p>
                <p className="text-sm font-bold text-[var(--color-neutral-900)]">
                  11.02.2026 11:06
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. GŁÓWNY ROUTER APLIKACJI
// ==========================================
export default function App() {
  const [currentAppModule, setCurrentAppModule] = useState("audits_dev");
  const [isGlobalNavOpen, setIsGlobalNavOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [auditorContext, setAuditorContext] = useState({
    prevModule: "services",
    elementName: "",
    isDevMode: false,
  });

  const handleOpenAuditor = (elementName, sourceModule, isDevMode = false) => {
    setAuditorContext({ prevModule: sourceModule, elementName, isDevMode });
    setIsGlobalNavOpen(false);
    setCurrentAppModule("auditor");
  };

  const handleBackFromAuditor = () => {
    setCurrentAppModule(auditorContext.prevModule);
    setIsGlobalNavOpen(true);
  };

  const NavItem = ({ id, icon: Icon, label }) => {
    const isActive =
      currentAppModule === id ||
      (currentAppModule === "auditor" && auditorContext.prevModule === id);
    return (
      <button
        onClick={() => setCurrentAppModule(id)}
        className={`w-full flex items-center mb-1.5 py-3.5 px-4 text-sm font-bold transition-all rounded-xl ${
          isActive
            ? "bg-white text-[var(--color-primary-500)] shadow-sm"
            : "bg-transparent text-[var(--color-neutral-400)] hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon
          className={`w-5 h-5 flex-shrink-0 ${
            isGlobalNavOpen ? "mr-3.5" : "mx-auto"
          } ${isActive ? "text-[var(--color-primary-500)]" : ""}`}
        />
        {isGlobalNavOpen && <span className="truncate">{label}</span>}
      </button>
    );
  };

  return (
    <>
      <GlobalStyles />
      {/* Usunięto konfliktującą klasę 'font-sans' z Tailwinda i wymuszono dziedziczenie styli */}
      <div
        className="flex h-screen overflow-hidden bg-[var(--color-neutral-050)]"
        style={{ fontFamily: "var(--font-family-base)" }}
      >
        {/* GLOBALNY SIDEBAR - Sleek Dark Theme */}
        <div
          className={`bg-[#181821] border-r border-white/5 flex flex-col z-50 flex-shrink-0 transition-all duration-300 ${
            isGlobalNavOpen ? "w-[280px]" : "w-[88px]"
          }`}
        >
          <div
            className={`p-6 pb-4 flex ${
              isGlobalNavOpen
                ? "items-center space-x-3"
                : "flex-col items-center"
            } border-b border-white/5 mb-6`}
          >
            <div className="w-10 h-10 bg-[var(--color-primary-500)] rounded-xl flex items-center justify-center shadow-[var(--shadow-primary)] flex-shrink-0">
              <svg
                className="w-5 h-5 fill-white"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 49 52"
              >
                <g className="type">
                  <path
                    className="signet"
                    clipPath="url(#ID_2_)"
                    d="M24.262,0.488C15.636,0.488,7.548,2.654,0,6.443v8.12
                    c7.548-3.789,15.636-5.954,24.262-5.954c8.627,0,16.714,2.165,24.261,5.954v-8.12C40.976,2.654,32.889,0.488,24.262,0.488
                    M0,18.535v8.12c4.348-2.183,8.879-3.805,13.584-4.807c-2.242,2.508-3.611,5.83-3.611,9.557c0,3.87,1.476,7.306,3.875,9.844
                    C9.048,40.254,4.429,38.608,0,36.386v8.12c7.548,3.789,15.636,5.954,24.262,5.954c8.627,0,16.714-2.165,24.261-5.954v-8.12
                    c-4.428,2.224-9.048,3.868-13.849,4.864c2.399-2.538,3.875-5.975,3.875-9.845c0-3.727-1.369-7.049-3.612-9.558
                    c4.706,1.002,9.239,2.624,13.586,4.808v-8.12c-7.547-3.79-15.634-5.955-24.261-5.955C15.636,12.58,7.548,14.745,0,18.535
                    M30.461,31.405c0,3.843-2.695,6.388-6.2,6.388s-6.2-2.545-6.2-6.388c0-3.844,2.695-6.388,6.2-6.388S30.461,27.562,30.461,31.405"
                  ></path>
                </g>
              </svg>
            </div>

            {isGlobalNavOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-white font-extrabold text-lg leading-none tracking-tight mb-1">
                  WCAG
                </span>
                <span className="text-[var(--color-neutral-400)] font-bold text-[10px] uppercase tracking-[0.25em] leading-none">
                  Auditor
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
            <nav>
              <div
                className={`text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-widest mb-4 px-2 ${
                  isGlobalNavOpen ? "block" : "hidden"
                }`}
              >
                Menu
              </div>
              <NavItem
                id="dashboard"
                icon={LayoutDashboard}
                label="Przegląd (Dashboard)"
              />
              <NavItem
                id="audits_client"
                icon={ClipboardCheck}
                label="Raporty Audytów (Klient)"
              />
              <NavItem
                id="audits_dev"
                icon={ClipboardList}
                label="Projekty Audytów (Dev)"
              />
              <NavItem id="services" icon={FolderKanban} label="Baza Usług" />
            </nav>
          </div>

          <div className="p-4 border-t border-white/5 relative">
            <div
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors ${
                isUserMenuOpen ? "bg-white/5" : ""
              }`}
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Patryk"
                alt="Avatar"
                className={`w-10 h-10 rounded-full border border-white/10 ${
                  isGlobalNavOpen ? "mr-3" : "mx-auto"
                }`}
              />
              {isGlobalNavOpen && (
                <>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-bold text-white truncate">
                      P. Smułkowski
                    </span>
                    <span className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider">
                      Admin
                    </span>
                  </div>
                  <MoreVertical className="w-4 h-4 text-[var(--color-neutral-500)] flex-shrink-0" />
                </>
              )}
            </div>

            {/* Podręczne menu użytkownika (Popover) */}
            {isUserMenuOpen && (
              <div
                className={`absolute ${
                  isGlobalNavOpen
                    ? "bottom-full left-4 right-4 mb-2"
                    : "bottom-0 left-full ml-4 w-48"
                } bg-[#1E293B] border border-white/10 rounded-xl shadow-xl py-1.5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100`}
              >
                <button
                  onClick={() => {
                    setCurrentAppModule("profile");
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-bold text-white hover:bg-white/5 flex items-center transition-colors"
                >
                  <User className="w-4 h-4 mr-3 text-[var(--color-neutral-400)]" />{" "}
                  Mój profil
                </button>
                <div className="h-px w-full bg-white/5 my-1"></div>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    alert("Wylogowano pomyślnie.");
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-bold text-[var(--color-error-main)] hover:bg-white/5 flex items-center transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" /> Wyloguj się
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setIsGlobalNavOpen(!isGlobalNavOpen);
                setIsUserMenuOpen(false);
              }}
              className="w-full mt-2 p-2.5 flex items-center justify-center text-[var(--color-neutral-400)] hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              {isGlobalNavOpen ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {currentAppModule === "profile" && <ProfileModule />}
        {currentAppModule === "services" && (
          <ServicesModule
            onNavigateToAuditor={(elementName) =>
              handleOpenAuditor(elementName, "services", true)
            }
          />
        )}
        {currentAppModule === "audits_client" && (
          <AuditsModule
            onNavigateToAuditor={(elementName) =>
              handleOpenAuditor(elementName, "audits_client", false)
            }
            isDevMode={false}
          />
        )}
        {currentAppModule === "audits_dev" && (
          <AuditsModule
            onNavigateToAuditor={(elementName) =>
              handleOpenAuditor(elementName, "audits_dev", true)
            }
            isDevMode={true}
          />
        )}
        {currentAppModule === "auditor" && (
          <AuditorWorkspaceModule
            activeElementName={auditorContext.elementName}
            onBack={handleBackFromAuditor}
            isDevMode={auditorContext.isDevMode}
          />
        )}
      </div>
    </>
  );
}
