import React, { useState, useMemo } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Info,
  Plus,
  Trash2,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  Layout,
  Sparkles,
  TrendingUp,
  ArrowLeft,
  Monitor,
  Smartphone,
  Check,
} from "lucide-react";
import {
  BaseAuditElement,
  PreviousErrorVerification,
  NewReauditError,
  ReauditRecord,
  DEFAULT_BASE_ELEMENTS,
  DEFAULT_PREVIOUS_ERRORS,
} from "./ReauditModals";
import { ALL_WCAG_CRITERIA } from "../../components/ui/WcagCriteriaCombobox";

// Rozszerzona lista starych błędów, aby każdy badany ekran miał usterki do weryfikacji
export const ENRICHED_DEFAULT_PREVIOUS_ERRORS: Omit<PreviousErrorVerification, "status" | "comment">[] = [
  ...DEFAULT_PREVIOUS_ERRORS,
  {
    id: "#004",
    title: "Brak nagłówków wierszy i kolumn w tabeli opłat i prowizji kart płatniczych",
    elementTitle: 'Podstrona "karty"',
    criteria: "1.3.1 Informacje i relacje",
    priority: "Ważny",
  },
  {
    id: "#005",
    title: "Dokument regulaminu kart w formacie PDF nie posiada zdefiniowanego języka dokumentu",
    elementTitle: 'Podstrona "karty"',
    criteria: "3.1.1 Język strony",
    priority: "Marginalny",
  },
];

// Pomocnik do ikony kanału
export function getChannelIcon(channelName: string) {
  if (!channelName) return <Layout size={16} className="text-slate-500" />;
  const name = channelName.toLowerCase();
  if (name.includes("www") || name.includes("desktop"))
    return <Monitor size={16} className="text-[#0038F8]" />;
  if (name.includes("aplikacja") || name.includes("mobile") || name.includes("ios") || name.includes("android"))
    return <Smartphone size={16} className="text-purple-600" />;
  if (name.includes("dokument") || name.includes("pdf"))
    return <FileText size={16} className="text-red-500" />;
  return <Layout size={16} className="text-slate-500" />;
}

// =========================================================================
// WIDOK 1: PEŁNOEKRANOWY FORMULARZ REAUDYTU (OSOBNA STRONA Z PODZIAŁEM NA EKRANY)
// =========================================================================

export function NewReauditPageView({
  setView,
  auditTitle = "Portal informacyjny - wybrane podstrony",
  baseScore = 77.5,
  baseElements = DEFAULT_BASE_ELEMENTS,
  previousErrors = ENRICHED_DEFAULT_PREVIOUS_ERRORS,
  onSaveReaudit,
  showToast,
}: {
  setView: (view: string) => void;
  auditTitle?: string;
  baseScore?: number;
  baseElements?: BaseAuditElement[];
  previousErrors?: Omit<PreviousErrorVerification, "status" | "comment">[];
  onSaveReaudit: (newReaudit: ReauditRecord) => void;
  showToast?: (title: string, message: string, type?: string) => void;
}) {
  const todayStr = useMemo(() => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }, []);

  const [name, setName] = useState(`Reaudyt z dnia ${todayStr}`);
  const [auditor, setAuditor] = useState("Piotr Smułkowski");
  const [date, setDate] = useState(todayStr);
  const [status, setStatus] = useState<"Zakończony" | "W trakcie">("Zakończony");
  const [notes, setNotes] = useState("");

  // Stan weryfikacji błędów z poprzedniego audytu (Dla każdego: fixed | persists + komentarz)
  const [verifications, setVerifications] = useState<
    Record<string, { status: "fixed" | "persists"; comment: string }>
  >(() => {
    const init: Record<string, { status: "fixed" | "persists"; comment: string }> = {};
    previousErrors.forEach((err) => {
      init[err.id] = {
        status: "fixed",
        comment: "",
      };
    });
    return init;
  });

  // Stan nowych błędów wykrytych podczas tego reaudytu
  const [newErrors, setNewErrors] = useState<NewReauditError[]>([]);

  // Aktywna zakładka filtrowania ekranu ("all" = wszystkie ekrany, lub elementTitle)
  const [activeScreenTab, setActiveScreenTab] = useState<string>("all");

  // Identyfikator ekranu, na którym aktualnie otwarty jest formularz dodawania nowego błędu
  const [addingErrorForScreen, setAddingErrorForScreen] = useState<string | null>(null);

  // Formularz nowego błędu
  const [newErrorDraft, setNewErrorDraft] = useState({
    title: "",
    criteria: "1.4.3 Kontrast (Minimalny)",
    priority: "Ważny" as "Priorytetowy" | "Ważny" | "Marginalny",
    description: "",
    recommendation: "",
  });

  // Statystyki globalne
  const totalVerified = previousErrors.length;
  const fixedCount = previousErrors.filter(
    (e) => (verifications[e.id]?.status || "fixed") === "fixed"
  ).length;
  const persistsCount = totalVerified - fixedCount;
  const newErrorsCount = newErrors.length;

  const criticalErrorsRemaining =
    previousErrors.filter(
      (e) =>
        e.priority === "Priorytetowy" &&
        verifications[e.id]?.status === "persists"
    ).length +
    newErrors.filter((e) => e.priority === "Priorytetowy").length;

  // Wyliczenie dynamicznego wyniku zgodności
  const calculatedScore = useMemo(() => {
    let score = baseScore;
    previousErrors.forEach((e) => {
      const isFixed = (verifications[e.id]?.status || "fixed") === "fixed";
      if (isFixed) {
        if (e.priority === "Priorytetowy") score += 4.5;
        else if (e.priority === "Ważny") score += 3.0;
        else score += 1.5;
      }
    });
    newErrors.forEach((e) => {
      if (e.priority === "Priorytetowy") score -= 4.0;
      else if (e.priority === "Ważny") score -= 2.5;
      else score -= 1.0;
    });
    return Math.min(100, Math.max(45, Math.round(score * 10) / 10));
  }, [baseScore, previousErrors, verifications, newErrors]);

  const brokenCriteriaCount = Math.max(
    0,
    11 - fixedCount + newErrors.length
  );

  const handleToggleVerificationStatus = (errorId: string) => {
    setVerifications((prev) => {
      const current = prev[errorId]?.status || "fixed";
      const nextStatus = current === "fixed" ? "persists" : "fixed";
      return {
        ...prev,
        [errorId]: {
          ...prev[errorId],
          status: nextStatus,
        },
      };
    });
  };

  const handleCommentChange = (errorId: string, comment: string) => {
    setVerifications((prev) => ({
      ...prev,
      [errorId]: {
        ...(prev[errorId] || { status: "fixed" }),
        comment,
      },
    }));
  };

  const handleStartAddingNewError = (elementTitle: string) => {
    setAddingErrorForScreen(elementTitle);
    setNewErrorDraft({
      title: "",
      criteria: "1.4.3 Kontrast (Minimalny)",
      priority: "Ważny",
      description: "",
      recommendation: "",
    });
  };

  const handleSaveNewError = (elementTitle: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newErrorDraft.title.trim()) return;

    const created: NewReauditError = {
      id: `NEW-0${newErrors.length + 1}`,
      title: newErrorDraft.title.trim(),
      elementTitle,
      criteria: newErrorDraft.criteria,
      priority: newErrorDraft.priority,
      description: newErrorDraft.description.trim(),
      recommendation: newErrorDraft.recommendation.trim(),
    };

    setNewErrors((prev) => [...prev, created]);
    setAddingErrorForScreen(null);

    if (showToast) {
      showToast(
        "Dodano nowy błąd",
        `Dodano usterkę do ekranu "${elementTitle}".`,
        "info"
      );
    }
  };

  const handleRemoveNewError = (id: string) => {
    setNewErrors((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSaveAndPublish = () => {
    const verifiedList: PreviousErrorVerification[] = previousErrors.map((err) => ({
      ...err,
      status: verifications[err.id]?.status || "fixed",
      comment: verifications[err.id]?.comment || "",
    }));

    const newReauditRecord: ReauditRecord = {
      id: `reaudit-${Date.now()}`,
      name: name.trim() || `Reaudyt z dnia ${date}`,
      date,
      auditor,
      score: calculatedScore,
      brokenCriteria: brokenCriteriaCount,
      criticalErrors: criticalErrorsRemaining,
      status,
      testedElements: baseElements,
      verifiedPreviousErrors: verifiedList,
      newErrors,
      notes: notes.trim(),
    };

    onSaveReaudit(newReauditRecord);
  };

  // Ekrany do wyrenderowania
  const visibleElements = useMemo(() => {
    if (activeScreenTab === "all") return baseElements;
    return baseElements.filter((el) => el.title === activeScreenTab);
  }, [baseElements, activeScreenTab]);

  return (
    <div data-testid="new-reaudit-page" className="flex-1 flex flex-col w-full bg-[#f8fafc] overflow-y-auto min-h-screen">
      {/* 1. GÓRNY PASEK NAWIGACYJNY / BREADCRUMBS */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <nav aria-label="Ścieżka nawigacyjna" className="flex items-center text-xs font-semibold text-slate-500 mb-1.5">
              <button
                type="button"
                onClick={() => setView("przeglad")}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Pulpit
              </button>
              <span className="mx-2 text-slate-300">/</span>
              <button
                type="button"
                onClick={() => setView("raporty")}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Audyty
              </button>
              <span className="mx-2 text-slate-300">/</span>
              <button
                type="button"
                onClick={() => setView("raport-szczegoly")}
                className="hover:text-slate-900 transition-colors cursor-pointer truncate max-w-[200px]"
              >
                {auditTitle}
              </button>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-[#0038F8] font-bold">Nowy Reaudyt (Osobna strona)</span>
            </nav>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-[#0038F8] border border-blue-200">
                <ClipboardCheck size={13} />
                <span>Reaudyt powdrożeniowy</span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {name || "Nowy Reaudyt"}
              </h1>
              <span className="text-xs text-slate-500 font-medium">
                • Badanie weryfikacyjne dla: <strong className="text-slate-800">{auditTitle}</strong>
              </span>
            </div>
          </div>

          {/* PRZYCISKI GŁÓWNE W NAGŁÓWKU */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setView("raport-szczegoly")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Wróć do audytu</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAndPublish}
              className="inline-flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <CheckCircle2 size={15} />
              <span>Zapisz i zakończ Reaudyt</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
        {/* 2. KARTA GŁÓWNYCH METRYK I PARAMETRÓW REAUDYTU */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Lewa strona: edycja metadanych reaudytu */}
            <div className="lg:col-span-5 space-y-3.5 pr-0 lg:pr-6 lg:border-r border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#0038F8]" />
                <span>Parametry badania weryfikacyjnego</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nazwa reaudytu:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="np. Reaudyt powdrożeniowy - Sprint 14"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Audytor weryfikujący:
                    </label>
                    <input
                      type="text"
                      value={auditor}
                      onChange={(e) => setAuditor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Data reaudytu:
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Status badania:
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "Zakończony" | "W trakcie")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
                    >
                      <option value="Zakończony">Zakończony</option>
                      <option value="W trakcie">W trakcie</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <ShieldCheck size={13} className="text-[#0038F8]" /> Standard: WCAG 2.1 AA
                  </span>
                  <span>•</span>
                  <span>Badane ekrany: <strong>{baseElements.length}</strong></span>
                  <span>•</span>
                  <span>Wszystkich barier: <strong>{totalVerified + newErrorsCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Prawa strona: Dynamiczny kalkulator zgodności na żywo */}
            <div className="lg:col-span-7">
              <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-400" />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Dynamiczny bilans zgodności WCAG po Reaudycie
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Kalkulacja w czasie rzeczywistym uwzględniająca poprawione błędy oraz nowo zgłoszone usterki.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg">
                    Audyt bazowy: {baseScore}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 leading-none">
                      {calculatedScore}%
                    </div>
                    <div className="text-[11px] uppercase font-bold text-slate-300 mt-1">
                      Nowa zgodność
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                      {calculatedScore >= baseScore ? `+${(calculatedScore - baseScore).toFixed(1)}%` : `${(calculatedScore - baseScore).toFixed(1)}%`}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3 border border-emerald-500/30">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 leading-none">
                      {fixedCount}
                    </div>
                    <div className="text-[11px] uppercase font-bold text-slate-300 mt-1">
                      Poprawione
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      z {totalVerified} wykazanych
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3 border border-red-500/30">
                    <div className="text-2xl sm:text-3xl font-black text-red-400 leading-none">
                      {persistsCount}
                    </div>
                    <div className="text-[11px] uppercase font-bold text-slate-300 mt-1">
                      Występuje dalej
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      wymaga naprawy
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3 border border-blue-500/30">
                    <div className="text-2xl sm:text-3xl font-black text-blue-300 leading-none">
                      {newErrorsCount}
                    </div>
                    <div className="text-[11px] uppercase font-bold text-slate-300 mt-1">
                      Nowe błędy
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      zidentyfikowane
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PODZIAŁ NA EKRANY: SELEKTOR ZAKŁADEK EKRANÓW */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 sm:p-2.5 shadow-2xs">
          <div className="flex items-center justify-between mb-2 px-2 pt-1">
            <div className="flex items-center gap-2">
              <Layout size={16} className="text-[#0038F8]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Wybierz badany ekran lub przejdź do widoku zbiorczego:
              </span>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Ekrany w audycie: {baseElements.length}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveScreenTab("all")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeScreenTab === "all"
                  ? "bg-[#0038F8] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
              }`}
            >
              <Layout size={14} />
              <span>Wszystkie ekrany ({baseElements.length})</span>
            </button>

            {baseElements.map((screen) => {
              const screenPrev = previousErrors.filter((e) => e.elementTitle === screen.title);
              const screenFixed = screenPrev.filter((e) => (verifications[e.id]?.status || "fixed") === "fixed").length;
              const screenNew = newErrors.filter((e) => e.elementTitle === screen.title).length;
              const isSelected = activeScreenTab === screen.title;

              return (
                <button
                  key={screen.id}
                  type="button"
                  onClick={() => setActiveScreenTab(screen.title)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? "bg-white border-[#0038F8] text-[#0038F8] ring-2 ring-[#0038F8]/15 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {getChannelIcon(screen.channel)}
                  <span>{screen.title}</span>
                  <div className="flex items-center gap-1 text-[10px] ml-1">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {screenFixed}/{screenPrev.length}
                    </span>
                    {screenNew > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                        +{screenNew}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. LISTA EKRANÓW Z BŁĘDAMI (DLA KAŻDEGO EKRANU: NAJPIERW STARE, PONIŻEJ NOWE) */}
        <div className="space-y-6">
          {visibleElements.map((screen) => {
            const screenPrevious = previousErrors.filter((e) => e.elementTitle === screen.title);
            const screenNew = newErrors.filter((e) => e.elementTitle === screen.title);
            const screenFixed = screenPrevious.filter(
              (e) => (verifications[e.id]?.status || "fixed") === "fixed"
            ).length;
            const screenPersists = screenPrevious.length - screenFixed;
            const isAddingHere = addingErrorForScreen === screen.title;

            return (
              <div
                key={screen.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* NAGŁÓWEK DANEGO EKRANU */}
                <div className="bg-slate-50/90 border-b border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                      {getChannelIcon(screen.channel)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                          Ekran #{screen.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          Kanał: <strong className="text-slate-800">{screen.channel}</strong>
                        </span>
                        {screen.deviceType && (
                          <span className="text-[11px] text-slate-400">
                            • {screen.deviceType}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {screen.title}
                      </h3>
                    </div>
                  </div>

                  {/* MINI BADGE STANU EKRANU */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 size={13} /> Poprawione: {screenFixed} / {screenPrevious.length}
                    </span>
                    {screenPersists > 0 && (
                      <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                        <XCircle size={13} /> Występuje dalej: {screenPersists}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                      <Sparkles size={13} /> Nowe usterki: {screenNew.length}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                  {/* ============================================================ */}
                  {/* SEKCJA 1 DLA EKRANU: NAJPIERW STARE BŁĘDY (DOTYCHCZASOWE) */}
                  {/* ============================================================ */}
                  <div>
                    <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck size={17} className="text-[#0038F8]" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                          1. Dotychczasowe błędy z audytu bazowego ({screenPrevious.length})
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Krok 1: Wskaż, czy błąd wykazany w pierwotnym badaniu został poprawiony
                      </span>
                    </div>

                    {screenPrevious.length === 0 ? (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                        <Info size={15} className="text-slate-400" />
                        <span>Na tym ekranie w badaniu bazowym nie odnotowano barier dostępności.</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {screenPrevious.map((err) => {
                          const isFixed = (verifications[err.id]?.status || "fixed") === "fixed";
                          const commentVal = verifications[err.id]?.comment || "";

                          return (
                            <div
                              key={err.id}
                              className={`p-4 rounded-xl border transition-all ${
                                isFixed
                                  ? "bg-emerald-50/25 border-emerald-200"
                                  : "bg-red-50/25 border-red-200"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                                      {err.id}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-600">
                                      Kryterium: <strong className="text-slate-900">WCAG {err.criteria}</strong>
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                        err.priority === "Priorytetowy"
                                          ? "bg-red-100 text-red-800 border border-red-200"
                                          : err.priority === "Ważny"
                                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                                          : "bg-blue-100 text-blue-800 border border-blue-200"
                                      }`}
                                    >
                                      {err.priority}
                                    </span>
                                  </div>

                                  <h5 className="text-sm font-bold text-slate-900 leading-snug">
                                    {err.title}
                                  </h5>
                                </div>

                                {/* DWUSTANOWY PRZEŁĄCZNIK WERYFIKACJI BŁĘDU */}
                                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!isFixed) handleToggleVerificationStatus(err.id);
                                    }}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      isFixed
                                        ? "bg-emerald-600 text-white shadow-xs"
                                        : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    }`}
                                  >
                                    <CheckCircle2 size={14} />
                                    <span>Poprawiony</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isFixed) handleToggleVerificationStatus(err.id);
                                    }}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      !isFixed
                                        ? "bg-red-600 text-white shadow-xs"
                                        : "text-slate-600 hover:text-red-700 hover:bg-red-50"
                                    }`}
                                  >
                                    <XCircle size={14} />
                                    <span>Występuje dalej</span>
                                  </button>
                                </div>
                              </div>

                              {/* NOTATKA AUDYTORA DO WERYFIKACJI TEGO BŁĘDU */}
                              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-2">
                                <label className="text-[11px] font-bold text-slate-600 whitespace-nowrap shrink-0 flex items-center gap-1">
                                  <span>Notatka audytora:</span>
                                </label>
                                <input
                                  type="text"
                                  value={commentVal}
                                  onChange={(e) => handleCommentChange(err.id, e.target.value)}
                                  placeholder={
                                    isFixed
                                      ? "np. Potwierdzono poprawne usunięcie bariery. Element dostępny z klawiatury i czytnika."
                                      : "np. Usterka nadal występuje w wersji produkcyjnej. Wymagane ponowne zlecenie poprawki."
                                  }
                                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* ============================================================ */}
                  {/* SEKCJA 2 DLA EKRANU: PONIŻEJ NOWE BŁĘDY WYKRYTE NA TYM EKRANIE */}
                  {/* ============================================================ */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Sparkles size={17} className="text-amber-500" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                          2. Nowe błędy zidentyfikowane na tym ekranie ({screenNew.length})
                        </h4>
                      </div>

                      {!isAddingHere && (
                        <button
                          type="button"
                          onClick={() => handleStartAddingNewError(screen.title)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0038F8] hover:bg-[#002ECC] text-white shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus size={13} />
                          <span>Dodaj nowy błąd dla tego ekranu</span>
                        </button>
                      )}
                    </div>

                    {/* FORMULARZ INLINE DLA TEGO EKRANU */}
                    {isAddingHere && (
                      <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-4 sm:p-5 mb-4 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-200">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-[#0038F8] flex items-center gap-1.5">
                            <Plus size={14} />
                            <span>Formularz nowej usterki dla ekranu: <strong>{screen.title}</strong></span>
                          </h5>
                          <button
                            type="button"
                            onClick={() => setAddingErrorForScreen(null)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800"
                          >
                            Anuluj
                          </button>
                        </div>

                        <form onSubmit={(e) => handleSaveNewError(screen.title, e)} className="space-y-3.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Kryterium WCAG:
                              </label>
                              <select
                                value={newErrorDraft.criteria}
                                onChange={(e) =>
                                  setNewErrorDraft((prev) => ({
                                    ...prev,
                                    criteria: e.target.value,
                                  }))
                                }
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
                              >
                                {ALL_WCAG_CRITERIA.map((crit) => (
                                  <option key={crit.id} value={`${crit.id} ${crit.name}`}>
                                    {crit.id} {crit.name} (Poz. {crit.level})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Priorytet:
                              </label>
                              <select
                                value={newErrorDraft.priority}
                                onChange={(e) =>
                                  setNewErrorDraft((prev) => ({
                                    ...prev,
                                    priority: e.target.value as any,
                                  }))
                                }
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                              >
                                <option value="Priorytetowy">Priorytetowy (Krytyczny)</option>
                                <option value="Ważny">Ważny (Utrudniający)</option>
                                <option value="Marginalny">Marginalny (Drobny)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Tytuł zidentyfikowanej usterki:
                            </label>
                            <input
                              type="text"
                              value={newErrorDraft.title}
                              onChange={(e) =>
                                setNewErrorDraft((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                              placeholder="np. Brak logicznego porządku tabulacji w nowo dodanej sekcji kart..."
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Rekomendacja naprawcza / zalecenie dla programistów:
                            </label>
                            <input
                              type="text"
                              value={newErrorDraft.recommendation}
                              onChange={(e) =>
                                setNewErrorDraft((prev) => ({
                                  ...prev,
                                  recommendation: e.target.value,
                                }))
                              }
                              placeholder="np. Zapewnić poprawną kolejność DOM lub usunąć sztuczne tabindex > 0..."
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setAddingErrorForScreen(null)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200/80 transition-colors cursor-pointer"
                            >
                              Anuluj
                            </button>
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              <Plus size={13} />
                              <span>Zapisz nowy błąd dla tego ekranu</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* LISTA NOWYCH BŁĘDÓW NA TYM EKRANIE */}
                    {screenNew.length === 0 && !isAddingHere ? (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-600" />
                          <span>Brak nowych usterek zidentyfikowanych na tym ekranie podczas reaudytu.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStartAddingNewError(screen.title)}
                          className="text-[#0038F8] hover:underline font-bold text-xs"
                        >
                          + Dodaj błąd
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {screenNew.map((nErr) => (
                          <div
                            key={nErr.id}
                            className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/20 flex items-start justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                                  {nErr.id} (Nowy)
                                </span>
                                <span className="text-xs font-semibold text-slate-600">
                                  WCAG {nErr.criteria}
                                </span>
                                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                                  {nErr.priority}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-slate-900">
                                {nErr.title}
                              </div>
                              {nErr.recommendation && (
                                <div className="text-[11px] text-slate-600 mt-1 font-normal">
                                  Rekomendacja: {nErr.recommendation}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveNewError(nErr.id)}
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer shrink-0"
                              title="Usuń ten błąd"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. PODSUMOWANIE KOŃCOWE AUDYTORA */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <FileText size={17} className="text-[#0038F8]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Wnioski i podsumowanie audytora z reaudytu (opcjonalnie)
            </h3>
          </div>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Podsumuj krótko efekty weryfikacji powdrożeniowej, np. wdrożone poprawki znacząco podniosły dostępność formularzy, rekomendowany termin kolejnego badania..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
          />
        </div>

        {/* 6. DOLNY PASEK ZAPISU */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Wynik reaudytu zostanie zapisany i powiązany z badanym serwisem w module Raporty.
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() => setView("raport-szczegoly")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={handleSaveAndPublish}
              className="inline-flex items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 size={15} />
              <span>Zapisz i zakończ Reaudyt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// WIDOK 2: PEŁNOEKRANOWA KARTA PODGLĄDU REAUDYTU (OSOBNA STRONA)
// =========================================================================

export function ReauditDetailsPageView({
  setView,
  reaudit,
  auditTitle = "Portal informacyjny - wybrane podstrony",
  showToast,
}: {
  setView: (view: string) => void;
  reaudit: ReauditRecord | null;
  auditTitle?: string;
  showToast?: (title: string, message: string) => void;
}) {
  const [activeScreenTab, setActiveScreenTab] = useState<string>("all");

  if (!reaudit) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 min-h-screen text-center">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Brak wybranego reaudytu do wyświetlenia</h2>
        <button
          type="button"
          onClick={() => setView("raport-szczegoly")}
          className="bg-[#0038F8] text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          Wróć do szczegółów audytu
        </button>
      </div>
    );
  }

  const verifiedErrors = reaudit.verifiedPreviousErrors || [];
  const fixedCount = verifiedErrors.filter((e) => e.status === "fixed").length;
  const persistsCount = verifiedErrors.filter((e) => e.status === "persists").length;
  const newErrors = reaudit.newErrors || [];
  const testedElements = reaudit.testedElements || DEFAULT_BASE_ELEMENTS;

  const visibleElements = activeScreenTab === "all"
    ? testedElements
    : testedElements.filter((el) => el.title === activeScreenTab);

  return (
    <div data-testid="reaudit-details-page" className="flex-1 flex flex-col w-full bg-[#f8fafc] overflow-y-auto min-h-screen">
      {/* 1. GÓRNY PASEK NAWIGACJI */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <nav aria-label="Ścieżka nawigacyjna" className="flex items-center text-xs font-semibold text-slate-500 mb-1.5">
              <button
                type="button"
                onClick={() => setView("przeglad")}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Pulpit
              </button>
              <span className="mx-2 text-slate-300">/</span>
              <button
                type="button"
                onClick={() => setView("raporty")}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Audyty
              </button>
              <span className="mx-2 text-slate-300">/</span>
              <button
                type="button"
                onClick={() => setView("raport-szczegoly")}
                className="hover:text-slate-900 transition-colors cursor-pointer truncate max-w-[200px]"
              >
                {auditTitle}
              </button>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-[#0038F8] font-bold">Karta Reaudytu</span>
            </nav>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 size={13} />
                <span>{reaudit.status}</span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {reaudit.name}
              </h1>
              <span className="text-xs text-slate-500 font-medium">
                • Data: <strong>{reaudit.date}</strong> • Audytor: <strong>{reaudit.auditor}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (showToast) {
                  showToast(
                    "Pobieranie raportu reaudytu",
                    `Generowanie pliku PDF z raportem weryfikacji dla "${reaudit.name}"...`
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <FileText size={14} className="text-red-500" />
              <span>Raport PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (showToast) {
                  showToast(
                    "Eksport wyników (.xlsx)",
                    `Wygenerowano arkusz Excel z weryfikacją błędów dla "${reaudit.name}".`
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>Excel (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={() => setView("raport-szczegoly")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Wróć do audytu</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
        {/* 2. 4 KAFELKI KPI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Zgodność WCAG po badaniu
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 leading-tight mt-1 block">
              {reaudit.score}%
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">Standard WCAG 2.1 AA</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Poprawione usterki
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 leading-tight mt-1 block">
              {fixedCount}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">z {verifiedErrors.length} zbadanych</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Występuje dalej
            </span>
            <span className="text-3xl sm:text-4xl font-black text-amber-600 leading-tight mt-1 block">
              {persistsCount}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">wymaga ponownego sprintu</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Nowo zidentyfikowane
            </span>
            <span className="text-3xl sm:text-4xl font-black text-blue-600 leading-tight mt-1 block">
              {newErrors.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">nowe regresje</span>
          </div>
        </div>

        {/* 3. PODZIAŁ NA EKRANY: ZAKŁADKI */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 sm:p-2.5 shadow-2xs">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveScreenTab("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeScreenTab === "all"
                  ? "bg-[#0038F8] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Layout size={14} />
              <span>Wszystkie ekrany ({testedElements.length})</span>
            </button>

            {testedElements.map((screen) => {
              const screenPrev = verifiedErrors.filter((e) => e.elementTitle === screen.title);
              const screenFixed = screenPrev.filter((e) => e.status === "fixed").length;
              const screenNew = newErrors.filter((e) => e.elementTitle === screen.title).length;
              const isSelected = activeScreenTab === screen.title;

              return (
                <button
                  key={screen.id}
                  type="button"
                  onClick={() => setActiveScreenTab(screen.title)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? "bg-white border-[#0038F8] text-[#0038F8] ring-2 ring-[#0038F8]/15 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {getChannelIcon(screen.channel)}
                  <span>{screen.title}</span>
                  <div className="flex items-center gap-1 text-[10px] ml-1">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      {screenFixed}/{screenPrev.length}
                    </span>
                    {screenNew > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        +{screenNew}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. LISTA EKRANÓW: DLA KAŻDEGO NAJPIERW STARE, PONIŻEJ NOWE */}
        <div className="space-y-6">
          {visibleElements.map((screen) => {
            const screenPrevious = verifiedErrors.filter((e) => e.elementTitle === screen.title);
            const screenNew = newErrors.filter((e) => e.elementTitle === screen.title);
            const screenFixed = screenPrevious.filter((e) => e.status === "fixed").length;

            return (
              <div
                key={screen.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* NAGŁÓWEK EKRANU */}
                <div className="bg-slate-50/90 border-b border-slate-200 p-4 sm:p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                      {getChannelIcon(screen.channel)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                          Ekran #{screen.id}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Kanał: <strong className="text-slate-800">{screen.channel}</strong>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {screen.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      Poprawiono: {screenFixed} / {screenPrevious.length}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                      Nowe błędy: {screenNew.length}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                  {/* SEKCJA 1: STARE BŁĘDY NA TYM EKRANIE (NAJPIERW) */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ClipboardCheck size={16} className="text-[#0038F8]" />
                      <span>1. Wyniki weryfikacji barier z audytu bazowego ({screenPrevious.length})</span>
                    </h4>

                    {screenPrevious.length === 0 ? (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                        Brak wcześniejszych usterek na tym ekranie.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {screenPrevious.map((err) => (
                          <div
                            key={err.id}
                            className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              err.status === "fixed"
                                ? "bg-emerald-50/20 border-emerald-200"
                                : "bg-red-50/20 border-red-200"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                                  {err.id}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                  WCAG {err.criteria}
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                    err.priority === "Priorytetowy"
                                      ? "bg-red-100 text-red-800"
                                      : err.priority === "Ważny"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {err.priority}
                                </span>
                              </div>
                              <div className="text-xs sm:text-sm font-bold text-slate-900">
                                {err.title}
                              </div>
                              {err.comment && (
                                <div className="text-xs text-slate-600 mt-1.5 italic bg-white/70 p-2 rounded-lg border border-slate-200/60">
                                  Notatka audytora: "{err.comment}"
                                </div>
                              )}
                            </div>

                            <div className="shrink-0">
                              {err.status === "fixed" ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shadow-2xs">
                                  <CheckCircle2 size={14} /> Poprawiony
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg shadow-2xs">
                                  <XCircle size={14} /> Występuje dalej
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SEKCJA 2: NOWE BŁĘDY NA TYM EKRANIE (PONIŻEJ) */}
                  {screenNew.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Sparkles size={16} className="text-blue-600" />
                        <span>2. Nowe błędy zidentyfikowane na tym ekranie ({screenNew.length})</span>
                      </h4>
                      <div className="space-y-2.5">
                        {screenNew.map((nErr) => (
                          <div
                            key={nErr.id}
                            className="p-3.5 bg-blue-50/30 rounded-xl border border-blue-200 text-xs"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                                {nErr.id}
                              </span>
                              <span className="font-semibold text-slate-700">WCAG {nErr.criteria}</span>
                              <span className="font-bold text-[10px] uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                {nErr.priority}
                              </span>
                            </div>
                            <div className="font-bold text-slate-900 text-sm">{nErr.title}</div>
                            {nErr.recommendation && (
                              <div className="text-xs text-slate-600 mt-1">
                                Zalecenie naprawcze: {nErr.recommendation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. NOTATKA AUDYTORA */}
        {reaudit.notes && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <FileText size={15} className="text-[#0038F8]" />
              <span>Wnioski końcowe audytora:</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {reaudit.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
