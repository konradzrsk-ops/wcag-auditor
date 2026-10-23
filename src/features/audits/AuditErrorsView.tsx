import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MonitorSmartphone,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  HorizontalFilterBar,
  FilterConfig,
  ActiveFilter,
} from "../../components/layout/HorizontalFilterBar";
import { mockAuditsList } from "../../mocks/data";

interface ErrorItemData {
  id: string;
  title: string;
  criteria: string;
  priority: "Krytyczny" | "Ważny" | "Marginalny";
  devices: string;
  description: string;
  recommendation: string;
}

const mockErrors: ErrorItemData[] = [
  {
    id: "#001",
    title: "Brak alternatywy tekstowej dla obrazka promocyjnego",
    criteria: "1.1.1 Treść nietekstowa",
    priority: "Krytyczny",
    devices: "Desktop, Android, iOS",
    description:
      "Główny baner promocyjny nie posiada atrybutu alt ani alternatywy tekstowej. Czytnik ekranu NVDA/VoiceOver odczytuje nazwę pliku baner_promo_q1_final.jpg, co wprowadza w błąd użytkowników niewidomych.",
    recommendation:
      "Dodaj atrybut alt z opisem merytorycznym banera lub dodaj alt='' jeśli obraz pełni rolę wyłącznie dekoracyjną i treść jest dostępna w nagłówku obok.",
  },
  {
    id: "#002",
    title: "Zbyt niski kontrast tekstu w stopce",
    criteria: "1.4.3 Kontrast (Minimalny)",
    priority: "Ważny",
    devices: "Desktop, Android",
    description:
      'Tekst etykiety w stopce ma współczynnik kontrastu 2.8:1 względem tła (#94A3B8 na #F1F5F9). Minimalny wymagany kontrast dla tekstu normalnej wielkości wynosi 4.5:1.',
    recommendation:
      "Zmień kolor tekstu na ciemniejszy odcień (np. #475569 lub #334155), aby osiągnąć kontrast co najmniej 4.5:1.",
  },
  {
    id: "#003",
    title: "Brak widocznego fokusa na przycisku zatwierdzenia",
    criteria: "2.4.7 Widoczny fokus",
    priority: "Krytyczny",
    devices: "Desktop",
    description:
      "W trakcie nawigacji tabulatorem przycisk 'Zatwierdź wniosek' nie posiada żadnego wizualnego wskaźnika skupienia uwagi (outline: none w stylach CSS). Użytkownik klawiatury nie wie, który element jest aktywny.",
    recommendation:
      "Usuń regułę outline: none lub zastąp ją wyrazistym focus-ringiem o szerokości minimum 2px i kontraście minimum 3:1 względem otoczenia.",
  },
  {
    id: "#004",
    title: "Brak powiązania etykiety label z polem formularza PESEL",
    criteria: "3.3.2 Etykiety lub instrukcje",
    priority: "Krytyczny",
    devices: "Desktop, iOS, Android",
    description:
      "Pole formularza PESEL posiada etykietę wizualną umieszczoną w elemencie <span> bez powiązania za pomocą for/id ani atrybutu aria-labelledby.",
    recommendation:
      "Użyj semantycznego elementu <label htmlFor='pesel'> lub dodaj do pola input atrybut aria-label='Numer PESEL'.",
  },
  {
    id: "#005",
    title: "Niejasny cel łącza 'Kliknij tutaj'",
    criteria: "2.4.4 Cel łącza (w kontekście)",
    priority: "Marginalny",
    devices: "Desktop, Android, iOS",
    description:
      "Odnośnik w sekcji informacyjnej ma treść 'Kliknij tutaj' bez dodatkowego kontekstu dla użytkowników czytników ekranu przeglądających listę linków.",
    recommendation:
      "Zmień treść linku na opisową, np. 'Pobierz tabelę opłat i prowizji (PDF)' lub uzupełnij atrybut aria-label.",
  },
];

export function AuditErrorsView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const currentAudit = mockAuditsList.find((a) => a.id === id) || mockAuditsList[0];

  // Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>("#001");

  const filterConfigs: FilterConfig[] = [
    {
      id: "priority",
      label: "Priorytet",
      type: "multiselect",
      value: selectedPriorities,
      options: [
        { value: "Krytyczny", label: "Priorytetowe" },
        { value: "Ważny", label: "Ważne" },
        { value: "Marginalny", label: "Marginalne" },
      ],
    },
    {
      id: "criteria",
      label: "Kryterium WCAG",
      type: "select",
      value: selectedCriteria,
      options: [
        { value: "1.1.1", label: "1.1.1 Treść nietekstowa" },
        { value: "1.4.3", label: "1.4.3 Kontrast (Minimalny)" },
        { value: "2.4.4", label: "2.4.4 Cel łącza" },
        { value: "2.4.7", label: "2.4.7 Widoczny fokus" },
        { value: "3.3.2", label: "3.3.2 Etykiety lub instrukcje" },
      ],
    },
  ];

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const active: ActiveFilter[] = [];
    selectedPriorities.forEach((p) => {
      const pLabel = p === "Krytyczny" ? "Priorytetowe" : p === "Ważny" ? "Ważne" : "Marginalne";
      active.push({ id: `p-${p}`, label: `Priorytet: ${pLabel}`, value: p });
    });
    if (selectedCriteria) {
      active.push({ id: "criteria", label: `Kryterium: ${selectedCriteria}`, value: selectedCriteria });
    }
    return active;
  }, [selectedPriorities, selectedCriteria]);

  const handleFilterChange = (filterId: string, val: any) => {
    if (filterId === "priority") setSelectedPriorities(val || []);
    if (filterId === "criteria") setSelectedCriteria(val || "");
  };

  const handleFilterRemove = (filterId: string) => {
    if (filterId.startsWith("p-")) {
      const p = filterId.replace("p-", "");
      setSelectedPriorities((prev) => prev.filter((item) => item !== p));
    } else if (filterId === "criteria") {
      setSelectedCriteria("");
    }
  };

  const handleClearAll = () => {
    setSelectedPriorities([]);
    setSelectedCriteria("");
    setSearchQuery("");
  };

  const filteredErrors = useMemo(() => {
    return mockErrors.filter((err) => {
      if (
        searchQuery &&
        !err.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !err.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !err.id.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedPriorities.length > 0 && !selectedPriorities.includes(err.priority)) {
        return false;
      }
      if (selectedCriteria && !err.criteria.includes(selectedCriteria)) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedPriorities, selectedCriteria]);

  return (
    <div data-testid="report-errors-view" className="w-full">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft size={16} />}
        onClick={() => navigate(`/audyty/${id}`)}
        className="mb-3 -ml-2"
      >
        Wróć do podsumowania audytu
      </Button>

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between mb-6 pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="brand" size="sm">
              {currentAudit.clientName}
            </Badge>
            <span className="text-xs text-slate-500 font-semibold">
              Audyt: {currentAudit.title}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Katalog zidentyfikowanych błędów dostępności
          </h1>
        </div>

        <Card className="flex items-center p-3 px-5 gap-6 shrink-0 bg-slate-50/50">
          <div>
            <span className="text-tiny font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Błędy łącznie
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              {filteredErrors.length}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <span className="text-tiny font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Krytyczne
            </span>
            <span className="text-xl font-extrabold text-red-600">
              {filteredErrors.filter((e) => e.priority === "Krytyczny").length}
            </span>
          </div>
        </Card>
      </div>

      {/* POZIOME FILTRY BŁĘDÓW */}
      <div className="mb-6">
        <HorizontalFilterBar
          filters={filterConfigs}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onFilterRemove={handleFilterRemove}
          onClearAll={handleClearAll}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Wpisz numer błędu, słowo kluczowe lub problem..."
        />
      </div>

      {/* Error Accordions */}
      <div className="flex flex-col gap-4">
        {filteredErrors.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            Brak błędów spełniających podane kryteria filtrowania.
          </Card>
        ) : (
          filteredErrors.map((err) => {
            const isExpanded = expandedId === err.id;
            const priorityVariant =
              err.priority === "Krytyczny"
                ? "danger"
                : err.priority === "Ważny"
                ? "warning"
                : "info";

            return (
              <Card
                key={err.id}
                data-testid="error-accordion-item"
                className={`overflow-hidden transition-all duration-200 ${
                  isExpanded ? "border-brand-500/40 shadow-card-hover ring-1 ring-brand-500/10" : ""
                }`}
              >
                {/* Header row */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedId(isExpanded ? null : err.id);
                    }
                  }}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer bg-white gap-3 select-none"
                  onClick={() => setExpandedId(isExpanded ? null : err.id)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                      {err.id}
                    </span>
                    <div>
                      <h2 className="font-bold text-slate-900 text-sm sm:text-base mb-1 leading-snug">
                        {err.title}
                      </h2>
                      <span className="text-xs text-slate-600 font-medium">
                        Kryterium: {err.criteria}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t border-slate-100 sm:border-none pt-3 sm:pt-0 mt-1 sm:mt-0">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs hidden lg:flex font-semibold">
                      <MonitorSmartphone size={15} />
                      <span>{err.devices}</span>
                    </div>
                    <Badge variant={priorityVariant} size="sm">
                      {err.priority}
                    </Badge>
                    <div className="w-8 h-8 rounded-control flex items-center justify-center bg-slate-100 text-slate-600">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 pt-2 bg-white flex flex-col gap-4 border-t border-slate-100">
                    <div className="border border-slate-200 rounded-control p-4 sm:p-5 bg-slate-50/30">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">
                        Opis problemu
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {err.description}
                      </p>
                    </div>

                    <div className="border border-emerald-200 bg-emerald-50/40 rounded-control p-4 sm:p-5">
                      <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">
                        💡 Rekomendacja naprawy dla deweloperów
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {err.recommendation}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
