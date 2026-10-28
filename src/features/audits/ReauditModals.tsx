import React, { useState, useMemo } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  AlertTriangle,
  Info,
  Plus,
  Trash2,
  Calendar,
  User,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  Layout,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";

// ==========================================
// TYPY DANYCH REAUDYTU
// ==========================================

export interface BaseAuditElement {
  id: number;
  title: string;
  channel: string;
  deviceType?: string;
}

export interface PreviousErrorVerification {
  id: string;
  title: string;
  elementTitle: string;
  criteria: string;
  priority: "Priorytetowy" | "Ważny" | "Marginalny";
  status: "fixed" | "persists"; // 'fixed' = Poprawiony, 'persists' = Występuje dalej
  comment?: string;
}

export interface NewReauditError {
  id: string;
  title: string;
  elementTitle: string;
  criteria: string;
  priority: "Priorytetowy" | "Ważny" | "Marginalny";
  description?: string;
  recommendation?: string;
}

export interface ReauditRecord {
  id: string;
  name: string;
  date: string;
  auditor: string;
  score: number;
  brokenCriteria: number;
  criticalErrors: number;
  status: "Zakończony" | "W trakcie";
  testedElements: BaseAuditElement[];
  verifiedPreviousErrors: PreviousErrorVerification[];
  newErrors: NewReauditError[];
  notes?: string;
}

// ==========================================
// DANE BAZOWEGO AUDYTU ("Portal informacyjny")
// Testowane są TE SAME elementy/ekrany
// ==========================================

export const DEFAULT_BASE_ELEMENTS: BaseAuditElement[] = [
  { id: 1, title: "Strona główna", channel: "WWW", deviceType: "Desktop / RWD" },
  { id: 2, title: 'Podstrona "konta"', channel: "Aplikacja", deviceType: "Android, iOS" },
  { id: 3, title: 'Podstrona "karty"', channel: "Dokumenty", deviceType: "Dokumenty cyfrowe" },
];

export const DEFAULT_PREVIOUS_ERRORS: Omit<PreviousErrorVerification, "status" | "comment">[] = [
  {
    id: "#001",
    title: "Brak alternatywy tekstowej dla obrazka promocyjnego",
    elementTitle: "Strona główna",
    criteria: "1.1.1 Treść nietekstowa",
    priority: "Priorytetowy",
  },
  {
    id: "#002",
    title: "Zbyt niski kontrast tekstu w stopce",
    elementTitle: "Strona główna",
    criteria: "1.4.3 Kontrast (Minimalny)",
    priority: "Ważny",
  },
  {
    id: "ERR-204",
    title: "Kontrast indykatora w formularzu przelewu (aktywny stan checkboxa)",
    elementTitle: 'Podstrona "konta"',
    criteria: "1.4.11 Kontrast elementów nietekstowych",
    priority: "Priorytetowy",
  },
  {
    id: "#003",
    title: "Brak widocznego fokusa na przycisku zatwierdzenia",
    elementTitle: 'Podstrona "konta"',
    criteria: "2.4.7 Widoczny fokus",
    priority: "Ważny",
  },
];

// Domyślna historia wcześniejszych reaudytów
export const INITIAL_REAUDITS_HISTORY: ReauditRecord[] = [
  {
    id: "re1",
    name: "Reaudyt z dnia 15.04.2026",
    date: "15.04.2026",
    auditor: "Piotr Smułkowski",
    score: 85.2,
    brokenCriteria: 5,
    criticalErrors: 1,
    status: "Zakończony",
    testedElements: DEFAULT_BASE_ELEMENTS,
    verifiedPreviousErrors: [
      {
        id: "#001",
        title: "Brak alternatywy tekstowej dla obrazka promocyjnego",
        elementTitle: "Strona główna",
        criteria: "1.1.1 Treść nietekstowa",
        priority: "Priorytetowy",
        status: "fixed",
        comment: "Dodano prawidłowy atrybut alt='Konto oszczędnościowe z premią 7%' w kodzie szablonu strony głównej.",
      },
      {
        id: "#002",
        title: "Zbyt niski kontrast tekstu w stopce",
        elementTitle: "Strona główna",
        criteria: "1.4.3 Kontrast (Minimalny)",
        priority: "Ważny",
        status: "fixed",
        comment: "Kolor tekstu w stopce zmieniono na #334155, uzyskując kontrast 5.1:1 względem tła.",
      },
      {
        id: "ERR-204",
        title: "Kontrast indykatora w formularzu przelewu (aktywny stan checkboxa)",
        elementTitle: 'Podstrona "konta"',
        criteria: "1.4.11 Kontrast elementów nietekstowych",
        priority: "Priorytetowy",
        status: "persists",
        comment: "Stan aktywny checkboxa nadal ma współczynnik kontrastu 2.4:1 (wymagane min. 3.0:1). Poprawka oczekuje na wdrożenie przez zespół Dev.",
      },
      {
        id: "#003",
        title: "Brak widocznego fokusa na przycisku zatwierdzenia",
        elementTitle: 'Podstrona "konta"',
        criteria: "2.4.7 Widoczny fokus",
        priority: "Ważny",
        status: "fixed",
        comment: "Zastosowano styl outline: 2px solid #0038F8 przy fokusie klawiatury.",
      },
    ],
    newErrors: [],
    notes: "Pierwsza weryfikacja powdrożeniowa. 3 z 4 zgłoszonych barier zostały pomyślnie rozwiązane przez zespół frontendowy. Blokerem pozostaje błąd ERR-204.",
  },
  {
    id: "re2",
    name: "Reaudyt z dnia 20.05.2026",
    date: "20.05.2026",
    auditor: "Anna Nowak",
    score: 92.4,
    brokenCriteria: 2,
    criticalErrors: 0,
    status: "W trakcie",
    testedElements: DEFAULT_BASE_ELEMENTS,
    verifiedPreviousErrors: [
      {
        id: "ERR-204",
        title: "Kontrast indykatora w formularzu przelewu (aktywny stan checkboxa)",
        elementTitle: 'Podstrona "konta"',
        criteria: "1.4.11 Kontrast elementów nietekstowych",
        priority: "Priorytetowy",
        status: "fixed",
        comment: "Wymieniono komponent checkboxa na wersję z biblioteki komponentów Banku o kontraście 5.2:1.",
      },
      {
        id: "#001",
        title: "Brak alternatywy tekstowej dla obrazka promocyjnego",
        elementTitle: "Strona główna",
        criteria: "1.1.1 Treść nietekstowa",
        priority: "Priorytetowy",
        status: "fixed",
        comment: "Stan bez zmian - wada trwale usunięta.",
      },
      {
        id: "#002",
        title: "Zbyt niski kontrast tekstu w stopce",
        elementTitle: "Strona główna",
        criteria: "1.4.3 Kontrast (Minimalny)",
        priority: "Ważny",
        status: "fixed",
        comment: "Stan bez zmian - kontrast spełnia kryterium AA.",
      },
      {
        id: "#003",
        title: "Brak widocznego fokusa na przycisku zatwierdzenia",
        elementTitle: 'Podstrona "konta"',
        criteria: "2.4.7 Widoczny fokus",
        priority: "Ważny",
        status: "fixed",
        comment: "Stan bez zmian - obwódka widoczna.",
      },
    ],
    newErrors: [
      {
        id: "NEW-01",
        title: "Zbyt mały cel dotykowy linku 'Regulamin' w stopce",
        elementTitle: 'Podstrona "karty"',
        criteria: "2.5.8 Rozmiar celu (Wskaźnik)",
        priority: "Marginalny",
        description: "Element dotykowy na urządzeniach mobilnych ma wymiary 20x18px (wymagane min. 24x24px).",
        recommendation: "Zwiększ padding linku do min. 8px ze wszystkich stron.",
      },
    ],
    notes: "Reaudyt weryfikacyjny poprawki błędu ERR-204. Wszystkie priorytetowe błędy zostały zamknięte. Wykryto 1 drobne uchybienie marginalne.",
  },
];

// ==========================================
// MODAL: DODAJ REAUDYT
// ==========================================

export function AddReauditModal({
  isOpen,
  onClose,
  auditTitle = "Portal informacyjny - wybrane podstrony",
  baseScore = 77.5,
  baseElements = DEFAULT_BASE_ELEMENTS,
  previousErrors = DEFAULT_PREVIOUS_ERRORS,
  onSaveReaudit,
}: {
  isOpen: boolean;
  onClose: () => void;
  auditTitle?: string;
  baseScore?: number;
  baseElements?: BaseAuditElement[];
  previousErrors?: Omit<PreviousErrorVerification, "status" | "comment">[];
  onSaveReaudit: (newReaudit: ReauditRecord) => void;
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

  // Stan weryfikacji błędów z poprzedniego audytu (Dla każdego: fixed | persists)
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
  const [isAddingNewError, setIsAddingNewError] = useState(false);
  const [newErrorDraft, setNewErrorDraft] = useState({
    title: "",
    elementTitle: baseElements[0]?.title || "Strona główna",
    criteria: "1.4.3 Kontrast (Minimalny)",
    priority: "Ważny" as "Priorytetowy" | "Ważny" | "Marginalny",
    description: "",
    recommendation: "",
  });

  if (!isOpen) return null;

  // Statystyki na żywo
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
  // Baza to baseScore (np. 77.5%).
  // Każdy błąd naprawiony podnosi wynik, każdy nierozwiązany i nowy obniża/utrzymuje.
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

  const handleAddNewError = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newErrorDraft.title.trim()) return;

    const created: NewReauditError = {
      id: `NEW-0${newErrors.length + 1}`,
      title: newErrorDraft.title.trim(),
      elementTitle: newErrorDraft.elementTitle,
      criteria: newErrorDraft.criteria,
      priority: newErrorDraft.priority,
      description: newErrorDraft.description.trim(),
      recommendation: newErrorDraft.recommendation.trim(),
    };

    setNewErrors((prev) => [...prev, created]);
    setNewErrorDraft({
      title: "",
      elementTitle: baseElements[0]?.title || "Strona główna",
      criteria: "1.4.3 Kontrast (Minimalny)",
      priority: "Ważny",
      description: "",
      recommendation: "",
    });
    setIsAddingNewError(false);
  };

  const handleRemoveNewError = (id: string) => {
    setNewErrors((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-reaudit-modal-title"
      className="fixed inset-0 z-[120] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150 overflow-y-auto"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* NAGŁÓWEK */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/20 shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0038F8] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <ClipboardCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0038F8] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/80">
                  Nowy Reaudyt
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  • Badanie weryfikacyjne
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Te same ekrany ({baseElements.length})
                </span>
              </div>
              <h2
                id="add-reaudit-modal-title"
                className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug"
              >
                Wprowadzenie wyników Reaudytu
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Audyt bazowy: <strong className="text-slate-900">{auditTitle}</strong>.
                Weryfikacja usunięcia zidentyfikowanych wcześniej usterek oraz rejestracja ewentualnych nowych błędów.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Zamknij okno"
          >
            <X size={20} />
          </button>
        </div>

        {/* PRZEWIJANA ZAWARTOŚĆ FORMULARZA */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* 1. METADANE REAUDYTU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nazwa reaudytu:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Audytor prowadzący:
              </label>
              <select
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                <option value="Piotr Smułkowski">Piotr Smułkowski (Lead)</option>
                <option value="Anna Nowak">Anna Nowak (Senior)</option>
                <option value="Jan Kowalski">Jan Kowalski (Audytor)</option>
                <option value="Tomasz Straszak">Tomasz Straszak (Ekspert)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Data badania:
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="dd.mm.rrrr"
                required
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status badania:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Zakończony" | "W trakcie")}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              >
                <option value="Zakończony">Zakończony</option>
                <option value="W trakcie">W trakcie weryfikacji</option>
              </select>
            </div>
          </div>

          {/* 2. BADANE ELEMENTY / EKRANY (TE SAME EKRANY) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <Layout size={16} className="text-[#0038F8]" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Badane ekrany (Identyczny zakres co w audycie bazowym)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {baseElements.length} ekrany
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3 font-normal">
              Zgodnie z metodologią reaudytu, badaniu podlegają te same widoki systemu, które zostały wytypowane w audycie pierwotnym.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {baseElements.map((el) => (
                <div
                  key={el.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200/90 bg-slate-50/70"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-[#0038F8] flex items-center justify-center shrink-0">
                    <Layout size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {el.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Kanał: {el.channel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. WERYFIKACJA DOTYCHCZASOWYCH BŁĘDÓW */}
          <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-white shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <ClipboardCheck size={18} className="text-[#0038F8]" />
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Weryfikacja dotychczasowych błędów ({previousErrors.length})
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sprawdź każdy błąd wykazany w pierwotnym badaniu: czy został naprawiony przez deweloperów, czy nadal występuje.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 size={13} /> Poprawione: {fixedCount}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                  <XCircle size={13} /> Występuje dalej: {persistsCount}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {previousErrors.map((err) => {
                const isFixed = (verifications[err.id]?.status || "fixed") === "fixed";
                const commentVal = verifications[err.id]?.comment || "";

                return (
                  <div
                    key={err.id}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                      isFixed
                        ? "bg-emerald-50/20 border-emerald-200/80"
                        : "bg-red-50/20 border-red-200/80"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                            {err.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            • Ekran: <strong className="text-slate-800">{err.elementTitle}</strong>
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            (WCAG {err.criteria})
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              err.priority === "Priorytetowy"
                                ? "bg-red-100 text-red-800"
                                : err.priority === "Ważny"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {err.priority}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {err.title}
                        </h4>
                      </div>

                      {/* DWUSTANOWY PRZEŁĄCZNIK STANU */}
                      <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (!isFixed) handleToggleVerificationStatus(err.id);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isFixed
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          <CheckCircle2 size={13} />
                          <span>Poprawiony</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (isFixed) handleToggleVerificationStatus(err.id);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            !isFixed
                              ? "bg-red-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-red-700 hover:bg-red-50"
                          }`}
                        >
                          <XCircle size={13} />
                          <span>Występuje dalej</span>
                        </button>
                      </div>
                    </div>

                    {/* KOMENTARZ AUDYTORA DO WERYFIKACJI */}
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100/90 flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="text-[11px] font-bold text-slate-500 whitespace-nowrap shrink-0">
                        Komentarz z weryfikacji:
                      </label>
                      <input
                        type="text"
                        value={commentVal}
                        onChange={(e) => handleCommentChange(err.id, e.target.value)}
                        placeholder={
                          isFixed
                            ? "np. Potwierdzono usunięcie usterki w branchu release. Etykieta dostępna."
                            : "np. Usterka nadal występuje. Zgłoszono do ponownego sprintu dev."
                        }
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. NOWE BŁĘDY WYKRYTE PODCZAS REAUDYTU */}
          <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-white shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#0038F8]" />
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Nowe błędy zidentyfikowane podczas reaudytu ({newErrors.length})
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Jeśli podczas weryfikacji wykryto nowe regresje lub usterki na badanych ekranach, dodaj je poniżej.
                </p>
              </div>

              {!isAddingNewError && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewError(true)}
                  className="inline-flex items-center gap-1.5 bg-[#0038F8] hover:bg-[#002ECC] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Dodaj nowy błąd</span>
                </button>
              )}
            </div>

            {/* FORMULARZ DODAWANIA NOWEGO BŁĘDU */}
            {isAddingNewError && (
              <div className="bg-slate-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-3.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0038F8] uppercase tracking-wider">
                    Formularz nowego błędu z reaudytu
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewError(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                  >
                    Anuluj
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Badany ekran:
                    </label>
                    <select
                      value={newErrorDraft.elementTitle}
                      onChange={(e) =>
                        setNewErrorDraft((prev) => ({
                          ...prev,
                          elementTitle: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    >
                      {baseElements.map((el) => (
                        <option key={el.id} value={el.title}>
                          {el.title} ({el.channel})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
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
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    >
                      <option value="1.1.1 Treść nietekstowa">1.1.1 Treść nietekstowa</option>
                      <option value="1.4.3 Kontrast (Minimalny)">1.4.3 Kontrast (Minimalny)</option>
                      <option value="1.4.11 Kontrast elementów nietekstowych">1.4.11 Kontrast nietekstowy</option>
                      <option value="2.4.7 Widoczny fokus">2.4.7 Widoczny fokus</option>
                      <option value="2.5.8 Rozmiar celu (Wskaźnik)">2.5.8 Rozmiar celu</option>
                      <option value="3.3.1 Identyfikacja błędów">3.3.1 Identyfikacja błędów</option>
                      <option value="3.3.2 Etykiety lub instrukcje">3.3.2 Etykiety lub instrukcje</option>
                      <option value="4.1.2 Nazwa, rola, wartość">4.1.2 Nazwa, rola, wartość</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Waga usterki:
                    </label>
                    <select
                      value={newErrorDraft.priority}
                      onChange={(e) =>
                        setNewErrorDraft((prev) => ({
                          ...prev,
                          priority: e.target.value as "Priorytetowy" | "Ważny" | "Marginalny",
                        }))
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    >
                      <option value="Priorytetowy">Priorytetowy (Bloker)</option>
                      <option value="Ważny">Ważny</option>
                      <option value="Marginalny">Marginalny</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tytuł błędu / opis problemu:
                  </label>
                  <input
                    type="text"
                    value={newErrorDraft.title}
                    onChange={(e) =>
                      setNewErrorDraft((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="np. Brak komunikatu o błędzie po wprowadzeniu nieprawidłowego numeru rachunku"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Rekomendacja naprawy:
                  </label>
                  <textarea
                    rows={2}
                    value={newErrorDraft.recommendation}
                    onChange={(e) =>
                      setNewErrorDraft((prev) => ({
                        ...prev,
                        recommendation: e.target.value,
                      }))
                    }
                    placeholder="Wprowadź zalecenie naprawcze dla zespołu programistów..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0038F8]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewError(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Anuluj
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewError}
                    disabled={!newErrorDraft.title.trim()}
                    className="bg-[#0038F8] hover:bg-[#002ECC] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Zapisz usterkę do listy
                  </button>
                </div>
              </div>
            )}

            {/* LISTA NOWO DODANYCH BŁĘDÓW */}
            {newErrors.length === 0 && !isAddingNewError ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Sparkles size={20} className="mx-auto text-slate-300 mb-1.5" />
                <p className="text-xs font-semibold text-slate-600">
                  Brak nowych usterek w tym reaudycie
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Jeśli podczas weryfikacji nie wystąpiły żadne nowe usterki, pozostaw tę sekcję pustą.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {newErrors.map((nErr) => (
                  <div
                    key={nErr.id}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/30 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                          {nErr.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {nErr.elementTitle}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({nErr.criteria})
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
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

          {/* 5. DYNAMICZNY BILANS I PODSUMOWANIE METRYK */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Szacowany wynik zgodności po Reaudycie
                </h4>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Audyt bazowy: {baseScore}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
              <div className="bg-white/10 rounded-lg p-2.5">
                <div className="text-lg font-black text-emerald-400 leading-tight">
                  {calculatedScore}%
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-300 mt-0.5">
                  Nowa zgodność
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5">
                <div className="text-lg font-black text-emerald-400 leading-tight">
                  {fixedCount}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-300 mt-0.5">
                  Poprawione
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5">
                <div className="text-lg font-black text-amber-300 leading-tight">
                  {persistsCount}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-300 mt-0.5">
                  Występuje dalej
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5">
                <div className="text-lg font-black text-blue-300 leading-tight">
                  {newErrorsCount}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-300 mt-0.5">
                  Nowe błędy
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Syntetyczne podsumowanie audytora z reaudytu (opcjonalnie):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Podsumuj krótko efekty weryfikacji powdrożeniowej, np. wdrożone poprawki znacząco podniosły dostępność formularzy, rekomendowany termin kolejnego badania..."
                className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
          </div>
        </form>

        {/* STOPKA MODALNA */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Wynik po zatwierdzeniu trafi do historii reaudytów tego badania.
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 bg-[#0038F8] hover:bg-[#002ECC] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Zapisz i opublikuj Reaudyt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: SZCZEGÓŁOWY PODGLĄD REAUDYTU
// ==========================================

export function ReauditDetailModal({
  isOpen,
  onClose,
  reaudit,
  auditTitle = "Portal informacyjny - wybrane podstrony",
  onShowToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  reaudit: ReauditRecord | null;
  auditTitle?: string;
  onShowToast?: (title: string, text: string) => void;
}) {
  if (!isOpen || !reaudit) return null;

  const verifiedErrors = reaudit.verifiedPreviousErrors || [];
  const fixedCount = verifiedErrors.filter((e) => e.status === "fixed").length;
  const persistsCount = verifiedErrors.filter((e) => e.status === "persists").length;
  const newErrors = reaudit.newErrors || [];
  const testedElements = reaudit.testedElements || DEFAULT_BASE_ELEMENTS;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reaudit-details-modal-title"
      className="fixed inset-0 z-[120] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150 overflow-y-auto"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* NAGŁÓWEK */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70 shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038F8] border border-blue-200/80 flex items-center justify-center shrink-0">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0038F8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80">
                  Karta Reaudytu
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  • {auditTitle}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    reaudit.status === "Zakończony"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {reaudit.status}
                </span>
              </div>
              <h2
                id="reaudit-details-modal-title"
                className="text-lg sm:text-xl font-extrabold text-slate-900"
              >
                {reaudit.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="text-[#0038F8]" /> {reaudit.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User size={12} className="text-[#0038F8]" /> {reaudit.auditor}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#0038F8]" /> Standard WCAG 2.1 AA
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Zamknij"
          >
            <X size={20} />
          </button>
        </div>

        {/* ZAWARTOŚĆ PRZEWIJANA */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* 4 KAFELKI KPI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Zgodność WCAG
              </span>
              <span className="text-2xl font-black text-emerald-700 leading-tight">
                {reaudit.score}%
              </span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Poprawione usterki
              </span>
              <span className="text-2xl font-black text-emerald-700 leading-tight">
                {fixedCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Występuje dalej
              </span>
              <span className="text-2xl font-black text-amber-700 leading-tight">
                {persistsCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Nowe błędy
              </span>
              <span className="text-2xl font-black text-blue-700 leading-tight">
                {newErrors.length}
              </span>
            </div>
          </div>

          {/* BADANE EKRANY (TE SAME EKRANY) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layout size={15} className="text-[#0038F8]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Badane ekrany (Identyczny zestaw co w audycie głównym)
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                {testedElements.length} ekrany
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {testedElements.map((el) => (
                <div
                  key={el.id}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between"
                >
                  <span className="truncate">{el.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {el.channel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* WYNIKI WERYFIKACJI POPRZEDNICH BŁĘDÓW */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ClipboardCheck size={15} className="text-[#0038F8]" />
              <span>Wyniki weryfikacji barier z poprzedniego badania</span>
            </h4>
            <div className="space-y-2.5">
              {verifiedErrors.map((err) => (
                <div
                  key={err.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                        {err.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {err.elementTitle}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        (WCAG {err.criteria})
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {err.title}
                    </div>
                    {err.comment && (
                      <div className="text-[11px] text-slate-500 mt-1 italic">
                        Notatka audytora: "{err.comment}"
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 self-start sm:self-center">
                    {err.status === "fixed" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 size={13} /> Poprawiony
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                        <XCircle size={13} /> Występuje dalej
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NOWE BŁĘDY W REAUDYCIE */}
          {newErrors.length > 0 && (
            <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/30">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Sparkles size={15} className="text-amber-700" />
                <span>Nowo zidentyfikowane usterki ({newErrors.length})</span>
              </h4>
              <div className="space-y-2">
                {newErrors.map((nErr) => (
                  <div
                    key={nErr.id}
                    className="p-2.5 bg-white rounded-lg border border-amber-200 text-xs"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                        {nErr.id}
                      </span>
                      <span className="font-bold text-slate-800">
                        {nErr.elementTitle}
                      </span>
                      <span className="text-slate-500">({nErr.criteria})</span>
                    </div>
                    <div className="font-bold text-slate-900">{nErr.title}</div>
                    {nErr.recommendation && (
                      <div className="text-[11px] text-slate-600 mt-1">
                        Zalecenie: {nErr.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTATKI AUDYTORA */}
          {reaudit.notes && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
              <strong className="block text-slate-900 mb-1 font-bold">
                Wnioski końcowe audytora:
              </strong>
              {reaudit.notes}
            </div>
          )}
        </div>

        {/* STOPKA */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onShowToast) {
                  onShowToast(
                    "Pobieranie raportu reaudytu",
                    `Generowanie pliku PDF z raportem weryfikacji dla "${reaudit.name}"...`
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <FileText size={13} className="text-red-500" />
              <span>Raport PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (onShowToast) {
                  onShowToast(
                    "Eksport wyników (.xlsx)",
                    `Wygenerowano arkusz Excel z weryfikacją błędów dla "${reaudit.name}".`
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={13} className="text-emerald-600" />
              <span>Excel (.xlsx)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
