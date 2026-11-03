import React, { useState } from "react";
import {
  Sparkles,
  ArrowLeft,
  Eye,
  Lock,
  Layers,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import {
  FeatureTeaserModal,
  FeatureTeaserType,
  TEASER_PRESETS,
} from "../../components/modals/PlannedFeatureModals";

export function HiddenTeaserShowcaseView({
  setView,
  showToast,
}: {
  setView: (view: string) => void;
  showToast?: (title: string, message: string, type?: string) => void;
}) {
  const [activeTeaser, setActiveTeaser] = useState<FeatureTeaserType | null>(
    null
  );

  const teaserList: {
    type: FeatureTeaserType;
    statusBadge: string;
    statusTone: "active" | "hidden";
    triggerInfo: string;
  }[] = [
    {
      type: "consultations",
      statusBadge: "Podpięty pod przycisk „Nowa konsultacja”",
      statusTone: "active",
      triggerInfo:
        "Wywoływany po kliknięciu „Nowa konsultacja” na Pulpicie oraz w module Konsultacji.",
    },
    {
      type: "management",
      statusBadge: "Makieta ukryta • Niepodpięta do menu",
      statusTone: "hidden",
      triggerInfo:
        "Docelowo może blokować lub zapowiadać moduł raportów zarządczych (C-Level).",
    },
    {
      type: "pad",
      statusBadge: "Makieta ukryta • Niepodpięta do menu",
      statusTone: "hidden",
      triggerInfo:
        "Docelowo może zapowiadać moduł sprawozdawczości Ustawy PAD i Dyrektywy EAA.",
    },
    {
      type: "complaints",
      statusBadge: "Makieta ukryta • Niepodpięta do menu",
      statusTone: "hidden",
      triggerInfo:
        "Docelowo może zapowiadać rejestr i procedurę formalnych skarg konsumenckich.",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] flex flex-col">
      {/* NAGŁÓWEK WIDOKU */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6">
          {/* Breadcrumbs */}
          <nav
            aria-label="Ścieżka powrotu"
            className="flex items-center gap-2 text-xs text-slate-500 mb-3"
          >
            <button
              type="button"
              onClick={() => setView("przeglad")}
              className="hover:text-[#0038F8] font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>Wróć do pulpitu</span>
            </button>
            <span>/</span>
            <span className="font-bold text-slate-800">
              Laboratorium Makiet (Widok ukryty)
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md">
                  <Lock size={12} />
                  <span>Środowisko projektowe • Ukryta strona</span>
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Makiety zapowiedzi funkcji (Teaser Modals)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Podgląd Makiet Popupów Zapowiadających Nowe Funkcje
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Strona przeznaczona do weryfikacji estetyki, responsywności i
                treści lekkich popupów informacyjnych. Modale przygotowano w
                spójnym, zwięzłym stylu — bez nadmiaru obietnic technicznych i
                nieplanowanych integracji.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setView("przeglad")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
            >
              Zamknij i wróć
            </button>
          </div>
        </div>
      </div>

      {/* ZAWARTOŚĆ GŁÓWNA */}
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-8 py-8 space-y-6 flex-1">
        {/* BANER INFORMACYJNY DLA ZESPOŁU */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            <h3 className="font-bold text-amber-900 mb-1">
              Status podpięcia do drzewa nawigacji
            </h3>
            <p className="text-amber-900/90">
              Zgodnie z wytycznymi, popupy dla <strong>Raportów Zarządczych</strong>,{" "}
              <strong>Sprawozdawczości PAD</strong> oraz{" "}
              <strong>Modułu Reklamacji</strong> <u>nie są włączone</u> do
              głównego menu aplikacji. Wszystkie istniejące moduły działają bez
              zmian. Poniżej możesz przetestować każdy popup jednym kliknięciem.
            </p>
          </div>
        </div>

        {/* SIATKA KART MAKIE-POPUPÓW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {teaserList.map((item) => {
            const preset = TEASER_PRESETS[item.type];
            const Icon = preset.icon;

            return (
              <div
                key={item.type}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#0038F8]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Górna belka karty */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl ${preset.iconBg} ${preset.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        <Icon size={22} />
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border inline-block mb-1 ${
                            item.statusTone === "active"
                              ? "text-blue-700 bg-blue-50 border-blue-200"
                              : "text-slate-600 bg-slate-100 border-slate-200"
                          }`}
                        >
                          {item.statusBadge}
                        </span>
                        <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                          {preset.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Skrót treści */}
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {preset.summary}
                  </p>

                  {/* Kluczowe korzyści */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Punkty prezentowane klientowi:
                    </span>
                    {preset.benefits.map((b, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[11px] text-slate-700 font-medium"
                      >
                        <CheckCircle2
                          size={13}
                          className="text-[#0038F8] shrink-0"
                        />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Informacja o wywołaniu */}
                  <div className="text-[11px] text-slate-500 mb-4 bg-blue-50/50 border border-blue-100 rounded-lg p-2.5">
                    <span className="font-bold text-slate-700">Gdzie wywołać:</span>{" "}
                    {item.triggerInfo}
                  </div>
                </div>

                {/* Przycisk otwierający popup testowy */}
                <button
                  type="button"
                  onClick={() => setActiveTeaser(item.type)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0038F8] hover:bg-[#002ECC] transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <Eye size={15} />
                  <span>Otwórz mockup tego popapu</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* INSTRUKCJA JAK DOSTAĆ SIĘ NA TĘ STRONĘ */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs text-xs text-slate-600 space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers size={16} className="text-[#0038F8]" />
            <span>Jak szybko przejść do tej ukrytej strony w przyszłości?</span>
          </h3>
          <p className="text-slate-600 leading-relaxed">
            1. <strong>Przez adres URL</strong>: dopisz do paska przeglądarki hash{" "}
            <code className="bg-slate-100 text-[#0038F8] px-1.5 py-0.5 rounded font-mono font-bold">
              #makiety-popup
            </code>{" "}
            (np.{" "}
            <span className="text-slate-800 font-mono">
              https://konradzrsk-ops.github.io/wcag-auditor/#makiety-popup
            </span>
            ).
          </p>
          <p className="text-slate-600 leading-relaxed">
            2. <strong>Przez stopkę</strong>: na samym dole każdej podstrony
            znajduje się dyskretny odnośnik{" "}
            <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
              🔒 Makiety popupów (Dev)
            </code>
            .
          </p>
        </div>
      </div>

      {/* RENDEROWANY AKTYWNY MODAL */}
      {activeTeaser && (
        <FeatureTeaserModal
          isOpen={!!activeTeaser}
          onClose={() => setActiveTeaser(null)}
          type={activeTeaser}
        />
      )}
    </div>
  );
}
