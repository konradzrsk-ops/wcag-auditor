import React, { useEffect } from "react";
import {
  MessageSquare,
  MessageSquareText,
  HelpCircle,
  Sparkles,
  Lock,
  X,
  Code2,
  BookOpen,
  Calendar,
  Layers,
  Video,
  FileText,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Users,
  Compass,
  ArrowRight,
} from "lucide-react";

// =========================================================================
// 1. MAKIETA MODALU: KONSULTACJE (SEKCJA PLANOWANA / OBECNIE NIEAKTYWNA)
// =========================================================================

export function PlannedConsultationsModal({
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
      aria-labelledby="planned-consultations-title"
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
              <MessageSquare size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  Funkcja planowana • Obecnie nieaktywna
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Roadmapa Q2 2026
                </span>
              </div>
              <h2
                id="planned-consultations-title"
                className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight"
              >
                Konsultacje z Audytorami WCAG
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Zamknij informację o konsultacjach"
          >
            <X size={20} />
          </button>
        </div>

        {/* PRZEWIJALNA TREŚĆ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#f8fafc]">
          {/* BANER INFORMACYJNY */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p className="font-semibold text-blue-900 mb-1">
              Moduł asynchronicznych konsultacji eksperckich jest obecnie projektowany.
            </p>
            <p className="text-slate-600 font-normal">
              Ta sekcja w docelowej wersji platformy W-ally umożliwi zespołom deweloperskim,
              projektantom UI/UX oraz koordynatorom dostępności bieżący, bezpośredni kontakt z
              certyfikowanymi audytorami WCAG bez konieczności oczekiwania na terminy spotkań online.
            </p>
          </div>

          {/* LISTA PLANOWANYCH FUNKCJI */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-[#0038F8]" />
              <span>Co znajdzie się w module Konsultacji:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Karta 1 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0038F8] flex items-center justify-center mb-2.5">
                  <MessageSquareText size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Asynchroniczne wątki per kryterium WCAG
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zadawaj pytania audytorom w kontekście badanego ekranu, komponentu lub procesu
                  bankowego bezpośrednio w trakcie sprintu deweloperskiego.
                </p>
              </div>

              {/* Karta 2 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5">
                  <Code2 size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Weryfikacja fragmentów kodu i tokenów UI
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Przesyłaj snippety JSX/HTML, tokeny kolorów oraz zrzuty ekranu przed wdrożeniem
                  na produkcję, z gwarancją odpowiedzi eksperta w 24 godziny.
                </p>
              </div>

              {/* Karta 3 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2.5">
                  <BookOpen size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Baza rozstrzygnięć i interpretacji WCAG
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Przeszukuj oficjalne interpretacje prawne i zalecenia techniczne wydane dla innych
                  komponentów, aby nie powielać wątpliwości architektonicznych.
                </p>
              </div>

              {/* Karta 4 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5">
                  <Layers size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Integracja z Jira, GitLab i GitHub
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Łącz wątki konsultacyjne bezpośrednio z zadaniami programistycznymi w backlogu,
                  z automatyczną synchronizacją statusów i komentarzy.
                </p>
              </div>

              {/* Karta 5 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-2.5">
                  <Calendar size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Szybkie spotkania online 15-30 min
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Wbudowany kalendarz do bezpośredniej rezerwacji krótkich slotów wideo z audytorem
                  wiodącym przy skomplikowanych problemach dostępności.
                </p>
              </div>

              {/* Karta 6 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-2.5">
                  <ShieldCheck size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Rekomendacje technologii asystujących
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Precyzyjne wytyczne dotyczące obsługi NVDA, JAWS, VoiceOver oraz klawiatury,
                  wraz ze schematami testów manualnych dla testerów QA.
                </p>
              </div>
            </div>
          </div>

          {/* BOX STATUSU */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={14} className="text-[#0038F8]" />
              <span>Dostępność modułu: planowane wdrożenie w kolejnym kwartale prac rozwojowych.</span>
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
          {/* BANER INFORMACYJNY */}
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

          {/* LISTA PLANOWANYCH FUNKCJI */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-[#0038F8]" />
              <span>Co znajdzie się w nowym Centrum Pomocy:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Karta 1 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0038F8] flex items-center justify-center mb-2.5">
                  <Video size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Interaktywne przewodniki i wideo-samouczki
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Przewodniki krok po kroku po wszystkich procesach: zlecaniu reaudytów, analizie
                  raportów, rejestracji procedury skarg klientów oraz sprawozdawczości PAD.
                </p>
              </div>

              {/* Karta 2 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5">
                  <Compass size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Wyszukiwarka kryteriów WCAG & EAA
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Wyczerpujące wyjaśnienia 49 kryteriów sukcesu na poziomach A i AA, powiązane
                  z konkretnymi przykładami dobrych i złych praktyk w bankowości.
                </p>
              </div>

              {/* Karta 3 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2.5">
                  <FileText size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Wzory dokumentów i deklaracji dostępności
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gotowe do pobrania, edytowalne szablony dokumentów formalnych: procedur obsługi
                  wniosków o zapewnienie dostępności, deklaracji PAD oraz rejestru ryzyk KNF.
                </p>
              </div>

              {/* Karta 4 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5">
                  <Phone size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Dedykowany Helpdesk Dostępności Cyfrowej
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bezpośredni kanał zgłaszania pytań technicznych, problemów z platformą oraz pytań
                  dotyczących interpretacji prawa z gwarantowanym czasem reakcji.
                </p>
              </div>

              {/* Karta 5 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-2.5">
                  <Layers size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Repozytorium wzorcowych komponentów UI
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sprawdzone wzorce dostępnych komponentów (modale, formularze, akordeony,
                  tabele danych) spełniające normę europejską EN 301 549.
                </p>
              </div>

              {/* Karta 6 */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-[#0038F8]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-2.5">
                  <ShieldCheck size={17} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Metodologia testów z czytnikami ekranu
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Przejrzyste instrukcje jak samodzielnie przeprowadzać weryfikację za pomocą
                  syntezatorów mowy NVDA, VoiceOver oraz klawiatury fizycznej.
                </p>
              </div>
            </div>
          </div>

          {/* BOX STATUSU */}
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
