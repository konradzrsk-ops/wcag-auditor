import React, { useEffect } from "react";
import {
  MessageSquare,
  HelpCircle,
  Sparkles,
  Lock,
  X,
  PieChart,
  Scale,
  AlertCircle,
  CheckCircle2,
  Video,
  FileText,
  Phone,
  ShieldCheck,
  Compass,
  Layers,
} from "lucide-react";

// =========================================================================
// KONFIGURACJA LEKKICH MAKIE-POPUPÓW (ZAPOWIEDZI FUNKCJONALNOŚCI)
// =========================================================================

export type FeatureTeaserType =
  | "consultations"
  | "management"
  | "pad"
  | "complaints";

export interface TeaserPreset {
  id: FeatureTeaserType;
  title: string;
  badge: string;
  badgeTone: "blue" | "purple" | "emerald" | "amber";
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  summary: string;
  benefits: string[];
  buttonLabel?: string;
}

export const TEASER_PRESETS: Record<FeatureTeaserType, TeaserPreset> = {
  consultations: {
    id: "consultations",
    title: "Konsultacje z Audytorami WCAG",
    badge: "Wkrótce w W-ally",
    badgeTone: "blue",
    icon: MessageSquare,
    iconBg: "bg-blue-50",
    iconColor: "text-[#0038F8]",
    summary:
      "Pracujemy nad modułem bezpośrednich konsultacji ze specjalistami dostępności cyfrowej. Już wkrótce będziesz mógł w prosty sposób zadać pytanie audytorowi i szybko uzyskać praktyczną poradę dotyczącą usuwania barier.",
    benefits: [
      "Bezpośredni kontakt z audytorem prowadzącym audyt",
      "Szybkie rozwiewanie wątpliwości przed wdrożeniem zmian",
      "Praktyczne wskazówki techniczne dostosowane do Twojego serwisu",
    ],
    buttonLabel: "Rozumiem, dziękuję",
  },
  management: {
    id: "management",
    title: "Raporty Zarządcze & Trendy Dostępności",
    badge: "Wkrótce w W-ally",
    badgeTone: "purple",
    icon: PieChart,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-700",
    summary:
      "Projektujemy przejrzysty panel analityczny dla dyrekcji i zarządu. Zapewni syntetyczny wgląd w postępy prac nad dostępnością, poziom ryzyka oraz kluczowe wskaźniki bez konieczności zagłębiania się w techniczne detale.",
    benefits: [
      "Syntetyczne podsumowania dla kadry zarządzającej",
      "Wykresy trendów i tempa usuwania barier w czasie",
      "Gotowe zestawienia do prezentacji i sprawozdawczości wewnętrznej",
    ],
    buttonLabel: "Rozumiem, dziękuję",
  },
  pad: {
    id: "pad",
    title: "Sprawozdawczość Regulacyjna PAD & EAA",
    badge: "Wkrótce w W-ally",
    badgeTone: "emerald",
    icon: Scale,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    summary:
      "Opracowujemy moduł dedykowany wymogom Ustawy o dostępności produktów i usług oraz Europejskiego Aktu o Dostępności (EAA). Pomoże w przygotowaniu oficjalnej Deklaracji Dostępności i raportów dla organów nadzorczych.",
    benefits: [
      "Wzorce urzędowej Deklaracji Dostępności zgodnie z prawem",
      "Monitorowanie zgodności z wytycznymi KNF i PFRON",
      "Bezpieczeństwo formalne i ochrona przed sankcjami nadzorczymi",
    ],
    buttonLabel: "Rozumiem, dziękuję",
  },
  complaints: {
    id: "complaints",
    title: "Moduł Reklamacji i Skarg na Dostępność",
    badge: "Wkrótce w W-ally",
    badgeTone: "amber",
    icon: AlertCircle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    summary:
      "Tworzymy centralne miejsce do rejestrowania i obsługi wniosków oraz skarg klientów dotyczących barier cyfrowych. Ułatwi to dotrzymanie terminów ustawowych i koordynację poprawek z zespołem technicznym.",
    benefits: [
      "Rejestr zgłoszeń klientów o barierach w usługach banku",
      "Kontrola terminów ustawowych na udzielenie odpowiedzi",
      "Powiązanie skargi z konkretnym audytem i zadaniem naprawczym",
    ],
    buttonLabel: "Rozumiem, dziękuję",
  },
};

// =========================================================================
// 1. UNIWERSALNY, LEKKI MODAL ZAPOWIEDZI FUNKCJI (TEASER MODAL)
// =========================================================================

export function FeatureTeaserModal({
  isOpen,
  onClose,
  type = "consultations",
  customConfig,
}: {
  isOpen: boolean;
  onClose: () => void;
  type?: FeatureTeaserType;
  customConfig?: Partial<TeaserPreset>;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const preset = TEASER_PRESETS[type] || TEASER_PRESETS.consultations;
  const config: TeaserPreset = { ...preset, ...(customConfig || {}) };
  const IconComponent = config.icon;

  const toneClasses = {
    blue: "text-[#0038F8] bg-blue-50 border-blue-200",
    purple: "text-purple-700 bg-purple-50 border-purple-200",
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-200",
    amber: "text-amber-800 bg-amber-50 border-amber-200",
  }[config.badgeTone || "blue"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="teaser-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* NAGŁÓWEK */}
        <div className="p-5 pb-4 flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl ${config.iconBg} ${config.iconColor} flex items-center justify-center shadow-2xs shrink-0`}
            >
              <IconComponent size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${toneClasses}`}
                >
                  <Sparkles size={11} />
                  <span>{config.badge}</span>
                </span>
              </div>
              <h2
                id="teaser-modal-title"
                className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug"
              >
                {config.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Zamknij zapowiedź funkcji"
          >
            <X size={18} />
          </button>
        </div>

        {/* PRZEWIJALNA TREŚĆ */}
        <div className="p-5 space-y-4 bg-white text-xs sm:text-sm text-slate-700 overflow-y-auto max-h-[70vh]">
          {/* ZWIĘZŁY OPIS */}
          <p className="text-slate-600 leading-relaxed font-normal">
            {config.summary}
          </p>

          {/* LISTA KLUCZOWYCH KORZYŚCI */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Co zyskasz dzięki tej funkcji:
            </span>
            <ul className="space-y-2">
              {config.benefits.map((b, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 font-medium leading-relaxed"
                >
                  <CheckCircle2
                    size={15}
                    className="text-[#0038F8] shrink-0 mt-0.5"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NOTATKA KONTAKTOWA */}
          <p className="text-[11px] text-slate-400 leading-normal">
            Chcesz poznać plan wdrożenia lub zgłosić zapotrzebowanie? Skontaktuj
            się ze swoim dedykowanym opiekunem w W-ally.
          </p>
        </div>

        {/* STOPKA */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0038F8] hover:bg-[#002ECC] transition-all cursor-pointer shadow-xs active:scale-98 text-center"
          >
            {config.buttonLabel || "Rozumiem, dziękuję"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ALIAS: MODAL KONSULTACJI (używany np. po kliknięciu "Nowa konsultacja")
export function PlannedConsultationsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <FeatureTeaserModal
      isOpen={isOpen}
      onClose={onClose}
      type="consultations"
    />
  );
}

// ALIAS: MODAL RAPORTÓW ZARZĄDCZYCH
export function ManagementTeaserModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <FeatureTeaserModal isOpen={isOpen} onClose={onClose} type="management" />
  );
}

// ALIAS: MODAL REGULACYJNY PAD
export function PadTeaserModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return <FeatureTeaserModal isOpen={isOpen} onClose={onClose} type="pad" />;
}

// ALIAS: MODAL REKLAMACJI I SKARG
export function ComplaintsTeaserModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <FeatureTeaserModal isOpen={isOpen} onClose={onClose} type="complaints" />
  );
}

// =========================================================================
// 2. MAKIETA MODALU: POMOC (SEKCJA PLANOWANA / OBECNIE NIEAKTYWNA)
// =========================================================================

export function PlannedHelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="planned-help-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* NAGŁÓWEK MODALU */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-blue-50/50 via-white to-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0038F8] text-white flex items-center justify-center shadow-sm shadow-[#0038F8]/30 shrink-0">
              <HelpCircle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  Funkcja planowana • Obecnie nieaktywna
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Roadmapa 2026
                </span>
              </div>
              <h2
                id="planned-help-title"
                className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight"
              >
                Centrum Pomocy i Wsparcia WCAG
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Zamknij informację o pomocy"
          >
            <X size={20} />
          </button>
        </div>

        {/* PRZEWIJALNA TREŚĆ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#f8fafc]">
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p className="font-semibold text-blue-900 mb-1">
              Nowe, zintegrowane Centrum Pomocy W-ally jest obecnie w fazie opracowywania.
            </p>
            <p className="text-slate-600 font-normal">
              W docelowej wersji połączy interaktywny onboarding i samouczki wideo, inteligentną
              bazę wiedzy z interpretacją wymogów prawnych (EAA, Ustawa o dostępności) oraz bezpośredni
              kontakt z dedykowanym helpdeskiem dostępności cyfrowej.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-[#0038F8]" />
              <span>Co znajdzie się w nowym Centrum Pomocy:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0038F8] flex items-center justify-center mb-2.5">
                  <Video size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Interaktywne przewodniki i wideo-samouczki
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Przewodniki krok po kroku po wszystkich procesach: zlecaniu reaudytów, analizie
                  raportów, obsłudze wniosków oraz sprawozdawczości PAD.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5">
                  <Compass size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Wyszukiwarka kryteriów WCAG & EAA
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Wyczerpujące wyjaśnienia kryteriów sukcesu na poziomach A i AA, powiązane
                  z konkretnymi przykładami dobrych praktyk w bankowości.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2.5">
                  <FileText size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Wzory dokumentów i deklaracji dostępności
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gotowe do pobrania, edytowalne szablony dokumentów formalnych: procedur obsługi
                  wniosków o zapewnienie dostępności oraz deklaracji PAD.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5">
                  <Phone size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Dedykowany Helpdesk Dostępności Cyfrowej
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bezpośredni kanał zgłaszania pytań technicznych i problemów z platformą
                  z gwarantowanym czasem reakcji.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-2.5">
                  <Layers size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Repozytorium wzorcowych komponentów UI
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sprawdzone wzorce dostępnych komponentów (modale, formularze, akordeony)
                  spełniające normę europejską EN 301 549.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-2.5">
                  <ShieldCheck size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Metodologia testów z czytnikami ekranu
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Przejrzyste instrukcje jak przeprowadzać weryfikację za pomocą
                  syntezatorów mowy NVDA, VoiceOver oraz nawigacji klawiaturą.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={14} className="text-[#0038F8]" />
              <span>Dostępność modułu: sekcja obecnie nieaktywna, w przygotowaniu do kolejnego wydania.</span>
            </span>
            <span className="text-slate-400 font-semibold text-[11px]">Wersja makiet: v2.4</span>
          </div>
        </div>

        {/* STOPKA MODALU */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0038F8] hover:bg-[#002ECC] transition-all cursor-pointer shadow-xs active:scale-98 text-center"
          >
            Rozumiem, zamknij
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 3. MAKIETA MODALU: BLOKADA SAMODZIELNEGO DODAWANIA UŻYTKOWNIKÓW PRZEZ KLIENTA
// =========================================================================

export function BlockedAddUserModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blocked-add-user-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* NAGŁÓWEK */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-amber-50/60 via-white to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                Procedura administracyjna
              </span>
              <h2
                id="blocked-add-user-title"
                className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight mt-0.5"
              >
                Dodawanie użytkowników zablokowane
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Zamknij powiadomienie"
          >
            <X size={18} />
          </button>
        </div>

        {/* TREŚĆ */}
        <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700 bg-white overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 leading-relaxed">
            <p className="font-bold mb-1">
              Samodzielne dodawanie użytkowników przez profil klienta jest wyłączone.
            </p>
            <p className="text-amber-900">
              Tymczasowo rejestracja nowych profili deweloperów, testerów i koordynatorów odbywa się
              <strong> wyłącznie centralnie przez panel administracyjny W-ally</strong>.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Jak dodać nowego użytkownika:
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                Zbierz dane nowego członka zespołu: <strong>imię i nazwisko</strong>,{" "}
                <strong>adres e-mail</strong>, <strong>rolę w zespole</strong> (np. Lead Frontend Developer) oraz
                <strong> przypisane serwisy</strong>.
              </li>
              <li>
                Przekaż zgłoszenie do swojego <strong>Administratora Systemu</strong> lub bezpośrednio
                do dedykowanego <strong>Opiekuna Klienta w W-ally</strong>.
              </li>
              <li>
                Profil zostanie zweryfikowany i aktywowany w panelu administracyjnym z odpowiednimi
                uprawnieniami w ciągu <strong>maksymalnie 24 godzin</strong>.
              </li>
            </ol>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#0038F8] shrink-0" />
            <span>
              Polityka ta zapewnia ścisłą kontrolę dostępu do poufnych raportów podatności WCAG banku.
            </span>
          </div>
        </div>

        {/* STOPKA */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer text-center"
          >
            Rozumiem, zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
