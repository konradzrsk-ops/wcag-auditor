import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Check, ChevronDown, CheckSquare, Square, Filter, Sparkles } from "lucide-react";

export interface WcagCriterion {
  id: string;
  num: string;
  name: string;
  level: "A" | "AA";
  principle: "Postrzegalność" | "Funkcjonalność" | "Zrozumiałość" | "Rzetelność";
  version?: "2.1" | "2.2";
  fullName: string;
}

export const ALL_WCAG_CRITERIA: WcagCriterion[] = [
  // 1. Postrzegalność (Perceivable)
  { id: "1.1.1", num: "1.1.1", name: "Treść nietekstowa", level: "A", principle: "Postrzegalność", fullName: "1.1.1 Treść nietekstowa (Poziom A)" },
  { id: "1.2.1", num: "1.2.1", name: "Tylko audio lub wideo (nagranie)", level: "A", principle: "Postrzegalność", fullName: "1.2.1 Tylko audio lub wideo (nagranie) (Poziom A)" },
  { id: "1.2.2", num: "1.2.2", name: "Napisy rozszerzone (nagranie)", level: "A", principle: "Postrzegalność", fullName: "1.2.2 Napisy rozszerzone (nagranie) (Poziom A)" },
  { id: "1.2.3", num: "1.2.3", name: "Audiodeskrypcja lub alternatywa tekstowa (nagranie)", level: "A", principle: "Postrzegalność", fullName: "1.2.3 Audiodeskrypcja lub alternatywa tekstowa (Poziom A)" },
  { id: "1.2.4", num: "1.2.4", name: "Napisy rozszerzone (na żywo)", level: "AA", principle: "Postrzegalność", fullName: "1.2.4 Napisy rozszerzone (na żywo) (Poziom AA)" },
  { id: "1.2.5", num: "1.2.5", name: "Audiodeskrypcja (nagranie)", level: "AA", principle: "Postrzegalność", fullName: "1.2.5 Audiodeskrypcja (nagranie) (Poziom AA)" },
  { id: "1.3.1", num: "1.3.1", name: "Informacje i relacje", level: "A", principle: "Postrzegalność", fullName: "1.3.1 Informacje i relacje (Poziom A)" },
  { id: "1.3.2", num: "1.3.2", name: "Zrozumiała kolejność", level: "A", principle: "Postrzegalność", fullName: "1.3.2 Zrozumiała kolejność (Poziom A)" },
  { id: "1.3.3", num: "1.3.3", name: "Właściwości zmysłowe", level: "A", principle: "Postrzegalność", fullName: "1.3.3 Właściwości zmysłowe (Poziom A)" },
  { id: "1.3.4", num: "1.3.4", name: "Orientacja ekranu", level: "AA", principle: "Postrzegalność", fullName: "1.3.4 Orientacja ekranu (Poziom AA)" },
  { id: "1.3.5", num: "1.3.5", name: "Identyfikacja przeznaczenia danych", level: "AA", principle: "Postrzegalność", fullName: "1.3.5 Identyfikacja przeznaczenia danych (Poziom AA)" },
  { id: "1.4.1", num: "1.4.1", name: "Użycie koloru", level: "A", principle: "Postrzegalność", fullName: "1.4.1 Użycie koloru (Poziom A)" },
  { id: "1.4.2", num: "1.4.2", name: "Kontrola odtwarzania dźwięku", level: "A", principle: "Postrzegalność", fullName: "1.4.2 Kontrola odtwarzania dźwięku (Poziom A)" },
  { id: "1.4.3", num: "1.4.3", name: "Kontrast minimalny tekstu (4.5:1)", level: "AA", principle: "Postrzegalność", fullName: "1.4.3 Kontrast minimalny (Poziom AA)" },
  { id: "1.4.4", num: "1.4.4", name: "Zmiana rozmiaru tekstu (do 200%)", level: "AA", principle: "Postrzegalność", fullName: "1.4.4 Zmiana rozmiaru tekstu (Poziom AA)" },
  { id: "1.4.5", num: "1.4.5", name: "Tekst w postaci grafiki", level: "AA", principle: "Postrzegalność", fullName: "1.4.5 Tekst w postaci grafiki (Poziom AA)" },
  { id: "1.4.10", num: "1.4.10", name: "Zawijanie treści (Reflow 400%)", level: "AA", principle: "Postrzegalność", fullName: "1.4.10 Zawijanie treści (Reflow) (Poziom AA)" },
  { id: "1.4.11", num: "1.4.11", name: "Kontrast elementów nietekstowych (3:1)", level: "AA", principle: "Postrzegalność", fullName: "1.4.11 Kontrast elementów nietekstowych (Poziom AA)" },
  { id: "1.4.12", num: "1.4.12", name: "Odstępy w tekście", level: "AA", principle: "Postrzegalność", fullName: "1.4.12 Odstępy w tekście (Poziom AA)" },
  { id: "1.4.13", num: "1.4.13", name: "Treść spod kursora lub po najechaniu", level: "AA", principle: "Postrzegalność", fullName: "1.4.13 Treść spod kursora lub po najechaniu (Poziom AA)" },

  // 2. Funkcjonalność (Operable)
  { id: "2.1.1", num: "2.1.1", name: "Dostępność z klawiatury", level: "A", principle: "Funkcjonalność", fullName: "2.1.1 Klawiatura (Poziom A)" },
  { id: "2.1.2", num: "2.1.2", name: "Brak pułapki na klawiaturę", level: "A", principle: "Funkcjonalność", fullName: "2.1.2 Brak pułapki na klawiaturę (Poziom A)" },
  { id: "2.1.4", num: "2.1.4", name: "Jednoznakowe skróty klawiszowe", level: "A", principle: "Funkcjonalność", fullName: "2.1.4 Jednoznakowe skróty klawiszowe (Poziom A)" },
  { id: "2.2.1", num: "2.2.1", name: "Dostosowanie limitu czasu", level: "A", principle: "Funkcjonalność", fullName: "2.2.1 Dostosowanie czasu (Poziom A)" },
  { id: "2.2.2", num: "2.2.2", name: "Wstrzymywanie, zatrzymywanie, ukrywanie", level: "A", principle: "Funkcjonalność", fullName: "2.2.2 Wstrzymywanie, zatrzymywanie (Poziom A)" },
  { id: "2.3.1", num: "2.3.1", name: "Trzy błyski lub wartości poniżej progu", level: "A", principle: "Funkcjonalność", fullName: "2.3.1 Trzy błyski (Poziom A)" },
  { id: "2.4.1", num: "2.4.1", name: "Ominięcie bloków (Skip link)", level: "A", principle: "Funkcjonalność", fullName: "2.4.1 Ominięcie bloków (Poziom A)" },
  { id: "2.4.2", num: "2.4.2", name: "Tytuł strony", level: "A", principle: "Funkcjonalność", fullName: "2.4.2 Tytuł strony (Poziom A)" },
  { id: "2.4.3", num: "2.4.3", name: "Kolejność fokusu", level: "A", principle: "Funkcjonalność", fullName: "2.4.3 Kolejność fokusu (Poziom A)" },
  { id: "2.4.4", num: "2.4.4", name: "Cel łącza (w kontekście)", level: "A", principle: "Funkcjonalność", fullName: "2.4.4 Cel łącza (w kontekście) (Poziom A)" },
  { id: "2.4.5", num: "2.4.5", name: "Wiele dróg dotarcia do treści", level: "AA", principle: "Funkcjonalność", fullName: "2.4.5 Wiele dróg (Poziom AA)" },
  { id: "2.4.6", num: "2.4.6", name: "Nagłówki i etykiety", level: "AA", principle: "Funkcjonalność", fullName: "2.4.6 Nagłówki i etykiety (Poziom AA)" },
  { id: "2.4.7", num: "2.4.7", name: "Widoczny fokus", level: "AA", principle: "Funkcjonalność", fullName: "2.4.7 Widoczny fokus (Poziom AA)" },
  { id: "2.4.11", num: "2.4.11", name: "Wygląd fokusu (Focus Appearance)", level: "AA", principle: "Funkcjonalność", version: "2.2", fullName: "2.4.11 Wygląd fokusu (Poziom AA - WCAG 2.2)" },
  { id: "2.5.1", num: "2.5.1", name: "Gesty dotykowe (wskaźnik)", level: "A", principle: "Funkcjonalność", fullName: "2.5.1 Gesty wskaźnika (Poziom A)" },
  { id: "2.5.2", num: "2.5.2", name: "Anulowanie akcji wskaźnika", level: "A", principle: "Funkcjonalność", fullName: "2.5.2 Anulowanie akcji wskaźnika (Poziom A)" },
  { id: "2.5.3", num: "2.5.3", name: "Etykieta w nazwie dostępnej", level: "A", principle: "Funkcjonalność", fullName: "2.5.3 Etykieta w nazwie (Poziom A)" },
  { id: "2.5.4", num: "2.5.4", name: "Aktywowanie ruchem urządzenia", level: "A", principle: "Funkcjonalność", fullName: "2.5.4 Aktywowanie ruchem (Poziom A)" },
  { id: "2.5.7", num: "2.5.7", name: "Ruchy przeciągania (Dragging Movements)", level: "AA", principle: "Funkcjonalność", version: "2.2", fullName: "2.5.7 Ruchy przeciągania (Poziom AA - WCAG 2.2)" },
  { id: "2.5.8", num: "2.5.8", name: "Rozmiar celu (Target Size min. 24x24px)", level: "AA", principle: "Funkcjonalność", version: "2.2", fullName: "2.5.8 Rozmiar celu (minimum) (Poziom AA - WCAG 2.2)" },

  // 3. Zrozumiałość (Understandable)
  { id: "3.1.1", num: "3.1.1", name: "Język strony (lang)", level: "A", principle: "Zrozumiałość", fullName: "3.1.1 Język strony (Poziom A)" },
  { id: "3.1.2", num: "3.1.2", name: "Język części tekstu", level: "AA", principle: "Zrozumiałość", fullName: "3.1.2 Język części (Poziom AA)" },
  { id: "3.2.1", num: "3.2.1", name: "Kontekst po otrzymaniu fokusu", level: "A", principle: "Zrozumiałość", fullName: "3.2.1 Po otrzymaniu fokusu (Poziom A)" },
  { id: "3.2.2", num: "3.2.2", name: "Kontekst podczas wprowadzania danych", level: "A", principle: "Zrozumiałość", fullName: "3.2.2 Podczas wprowadzania danych (Poziom A)" },
  { id: "3.2.3", num: "3.2.3", name: "Spójna nawigacja w serwisie", level: "AA", principle: "Zrozumiałość", fullName: "3.2.3 Spójna nawigacja (Poziom AA)" },
  { id: "3.2.4", num: "3.2.4", name: "Spójna identyfikacja elementów", level: "AA", principle: "Zrozumiałość", fullName: "3.2.4 Spójna identyfikacja (Poziom AA)" },
  { id: "3.2.6", num: "3.2.6", name: "Spójna pomoc (Consistent Help)", level: "A", principle: "Zrozumiałość", version: "2.2", fullName: "3.2.6 Spójna pomoc (Poziom A - WCAG 2.2)" },
  { id: "3.3.1", num: "3.3.1", name: "Identyfikacja błędu formularza", level: "A", principle: "Zrozumiałość", fullName: "3.3.1 Identyfikacja błędu (Poziom A)" },
  { id: "3.3.2", num: "3.3.2", name: "Etykiety lub instrukcje w polach", level: "A", principle: "Zrozumiałość", fullName: "3.3.2 Etykiety lub instrukcje (Poziom A)" },
  { id: "3.3.3", num: "3.3.3", name: "Sugestie dotyczące poprawy błędów", level: "AA", principle: "Zrozumiałość", fullName: "3.3.3 Sugestie dotyczące błędów (Poziom AA)" },
  { id: "3.3.4", num: "3.3.4", name: "Zapobieganie błędom (prawne, finansowe)", level: "AA", principle: "Zrozumiałość", fullName: "3.3.4 Zapobieganie błędom (Poziom AA)" },
  { id: "3.3.7", num: "3.3.7", name: "Dostępne uwierzytelnianie (bez testu poznawczego)", level: "AA", principle: "Zrozumiałość", version: "2.2", fullName: "3.3.7 Dostępne uwierzytelnianie (Poziom AA - WCAG 2.2)" },
  { id: "3.3.8", num: "3.3.8", name: "Nadmiarowe wprowadzanie danych (Redundant Entry)", level: "A", principle: "Zrozumiałość", version: "2.2", fullName: "3.3.8 Nadmiarowe wprowadzanie danych (Poziom A - WCAG 2.2)" },

  // 4. Rzetelność (Robust)
  { id: "4.1.2", num: "4.1.2", name: "Nazwa, rola, wartość (WAI-ARIA)", level: "A", principle: "Rzetelność", fullName: "4.1.2 Nazwa, rola, wartość (Poziom A)" },
  { id: "4.1.3", num: "4.1.3", name: "Komunikaty o stanie (aria-live)", level: "AA", principle: "Rzetelność", fullName: "4.1.3 Komunikaty o stanie (Poziom AA)" },
];

export interface WcagCriteriaComboboxProps {
  selectedCriteria: string[];
  onChange: (criteria: string[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  helperText?: string;
  id?: string;
}

/**
 * Normalizuje ciągi kryteriów, aby łatwo porównywać wpisy pełne, skrócone lub zagnieżdżone
 */
export function normalizeCriterion(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  const match = trimmed.match(/^(\d+\.\d+\.\d+)/);
  if (match) {
    return match[1];
  }
  return trimmed;
}

export function WcagCriteriaCombobox({
  selectedCriteria = [],
  onChange,
  label = "Dotknięte kryteria WCAG (możliwy wybór wielu)",
  placeholder = "Szukaj lub wybierz kryteria WCAG (np. 1.4.3, kontrast, klawiatura)...",
  error,
  className = "",
  helperText = "Wybierz jedno lub więcej kryteriów sukcesu WCAG 2.1 / 2.2 AA naruszonych w zgłoszeniu.",
  id = "wcag-criteria-combobox",
}: WcagCriteriaComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePrinciple, setActivePrinciple] = useState<string>("Wszystkie");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Ujednolicenie zaznaczonych wartości do identyfikatorów
  const selectedIds = useMemo(() => {
    return selectedCriteria.map((c) => normalizeCriterion(c));
  }, [selectedCriteria]);

  // Zamknięcie po kliknięciu na zewnątrz
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Automatyczne fokusowanie inputa po otwarciu
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filtrowanie kryteriów
  const filteredCriteria = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ALL_WCAG_CRITERIA.filter((c) => {
      const matchesPrinciple =
        activePrinciple === "Wszystkie" || c.principle === activePrinciple;
      if (!matchesPrinciple) return false;

      if (!q) return true;
      return (
        c.num.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        c.principle.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activePrinciple]);

  const toggleCriterion = (criterion: WcagCriterion) => {
    const isSelected = selectedIds.includes(criterion.num);
    let updated: string[];
    if (isSelected) {
      updated = selectedCriteria.filter(
        (c) => normalizeCriterion(c) !== criterion.num
      );
    } else {
      updated = [...selectedCriteria, criterion.fullName];
    }
    onChange(updated);
  };

  const removeCriterion = (criterionNum: string) => {
    const updated = selectedCriteria.filter(
      (c) => normalizeCriterion(c) !== criterionNum
    );
    onChange(updated);
  };

  const handleSelectPopular = () => {
    const popularNums = ["1.1.1", "1.4.3", "1.4.11", "2.1.1", "2.4.7", "3.3.1", "4.1.2"];
    const popularCriteria = ALL_WCAG_CRITERIA.filter((c) =>
      popularNums.includes(c.num)
    ).map((c) => c.fullName);
    // Połącz bez duplikatów
    const combined = Array.from(new Set([...selectedCriteria, ...popularCriteria]));
    onChange(combined);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={id} className="block text-xs font-bold text-slate-700">
            {label}
          </label>
          {selectedCriteria.length > 0 && (
            <span className="text-[11px] font-bold text-[#0038F8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Wybrano: {selectedCriteria.length}
            </span>
          )}
        </div>
      )}

      {/* Główny kontener - tagi + przycisk rozwijania */}
      <div
        id={id}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          } else if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
        className={`min-h-[42px] w-full bg-white border rounded-xl p-2 flex flex-wrap items-center gap-1.5 cursor-pointer transition-all shadow-2xs ${
          isOpen
            ? "border-[#0038F8] ring-2 ring-[#0038F8]/20"
            : error
            ? "border-red-300 ring-2 ring-red-500/20"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        {selectedCriteria.length === 0 ? (
          <div className="flex items-center justify-between w-full px-2 py-1 text-slate-400 text-xs font-medium">
            <span className="truncate">{placeholder}</span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180 text-[#0038F8]" : ""}`} />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex flex-wrap items-center gap-1.5 flex-1 max-h-[140px] overflow-y-auto pr-1">
              {selectedCriteria.map((criterionStr) => {
                const num = normalizeCriterion(criterionStr);
                const found = ALL_WCAG_CRITERIA.find((c) => c.num === num);
                const labelText = found ? `${found.num} ${found.name}` : criterionStr;
                const level = found ? found.level : "AA";

                return (
                  <span
                    key={criterionStr}
                    className="inline-flex items-center gap-1 bg-blue-50/90 hover:bg-blue-100/90 text-[#0038F8] text-xs font-bold px-2 py-1 rounded-lg border border-blue-200/80 transition-colors shadow-2xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[10px] uppercase font-black px-1 py-0.2 rounded bg-[#0038F8] text-white">
                      {level}
                    </span>
                    <span className="max-w-[200px] truncate">{labelText}</span>
                    <button
                      type="button"
                      aria-label={`Usuń kryterium ${labelText}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCriterion(num);
                      }}
                      className="ml-0.5 p-0.5 hover:bg-blue-200 rounded text-blue-700 hover:text-blue-900 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-1 shrink-0 self-center pl-1">
              <span className="text-[11px] font-semibold text-slate-400">
                + Dodaj / zmień
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180 text-[#0038F8]" : ""}`} />
            </div>
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
      )}
      {error && <p className="text-xs text-red-600 mt-1 font-semibold">{error}</p>}

      {/* Rozwijane menu z wyszukiwarką i checkboxami */}
      {isOpen && (
        <div
          className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-98 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pasek wyszukiwania */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtruj wg numeru lub nazwy (np. 1.4.3, kontrast, fokus)..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Zakładki POUR */}
            <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5 text-[11px]">
              {["Wszystkie", "Postrzegalność", "Funkcjonalność", "Zrozumiałość", "Rzetelność"].map(
                (p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setActivePrinciple(p)}
                    className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      activePrinciple === p
                        ? "bg-[#0038F8] text-white shadow-2xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            {/* Szybkie akcje */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200/60 text-[11px]">
              <button
                type="button"
                onClick={handleSelectPopular}
                className="inline-flex items-center gap-1 font-bold text-[#0038F8] hover:underline cursor-pointer"
              >
                <Sparkles size={12} /> Zaznacz najczęstsze (Top 7)
              </button>
              {selectedCriteria.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Odznacz wszystkie
                </button>
              )}
            </div>
          </div>

          {/* Lista kryteriów */}
          <div
            role="listbox"
            aria-multiselectable="true"
            className="max-h-64 overflow-y-auto divide-y divide-slate-100 p-1"
          >
            {filteredCriteria.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Nie znaleziono kryteriów pasujących do frazy "{searchQuery}"
              </div>
            ) : (
              filteredCriteria.map((criterion) => {
                const isSelected = selectedIds.includes(criterion.num);

                return (
                  <div
                    key={criterion.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggleCriterion(criterion)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50/70 hover:bg-blue-100/70 text-slate-900"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="mt-0.5 text-slate-400 shrink-0">
                      {isSelected ? (
                        <CheckSquare size={16} className="text-[#0038F8]" />
                      ) : (
                        <Square size={16} className="text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-black text-xs text-slate-900">
                          {criterion.num}
                        </span>
                        <span className="font-bold text-xs text-slate-800">
                          {criterion.name}
                        </span>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.2 rounded border ${
                            criterion.level === "A"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          Poziom {criterion.level}
                        </span>
                        {criterion.version === "2.2" && (
                          <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-1 py-0.2 rounded border border-indigo-200">
                            WCAG 2.2
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Zasada: {criterion.principle}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Stopka menu */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Zaznaczono {selectedCriteria.length} z {ALL_WCAG_CRITERIA.length} kryteriów
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-[#0038F8] hover:bg-[#002ECC] text-white px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              Zatwierdź wybór
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
