import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Folder,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Layout,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  ExternalLink,
  Library,
  Search,
  Monitor,
  Smartphone,
  FileText,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PriorityStats } from "../../components/charts/PriorityStats";
import {
  HorizontalFilterBar,
  FilterConfig,
  ActiveFilter,
} from "../../components/layout/HorizontalFilterBar";
import { mockSharedServicesData } from "../../mocks/data";

export function ServicesCatalogView() {
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("s1");
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [treeSearch, setTreeSearch] = useState("");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    s1: true,
    s2: false,
  });

  // Filters for processes
  const [processSearch, setProcessSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState<string>("");

  const currentService =
    mockSharedServicesData.find((s) => s.id === selectedServiceId) ||
    mockSharedServicesData[0];

  const currentProcess = selectedProcessId
    ? currentService.processes.find((p) => p.id === selectedProcessId)
    : null;

  const toggleFolder = (folderId: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  // Filter configs for process list
  const filterConfigs: FilterConfig[] = [
    {
      id: "score",
      label: "Poziom zgodności",
      type: "select",
      value: scoreFilter,
      options: [
        { value: "high", label: "Wysoka (>= 90%)" },
        { value: "medium", label: "Średnia (80 - 89%)" },
        { value: "low", label: "Wymaga poprawy (< 80%)" },
      ],
    },
  ];

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const list: ActiveFilter[] = [];
    if (scoreFilter) {
      const label =
        scoreFilter === "high"
          ? "Zgodność: >= 90%"
          : scoreFilter === "medium"
          ? "Zgodność: 80-89%"
          : "Zgodność: < 80%";
      list.push({ id: "score", label, value: scoreFilter });
    }
    return list;
  }, [scoreFilter]);

  // Filtered processes list
  const filteredProcesses = useMemo(() => {
    return currentService.processes.filter((proc) => {
      if (
        processSearch &&
        !proc.name.toLowerCase().includes(processSearch.toLowerCase())
      ) {
        return false;
      }
      if (scoreFilter === "high" && proc.stats.score < 90) return false;
      if (
        scoreFilter === "medium" &&
        (proc.stats.score < 80 || proc.stats.score >= 90)
      ) {
        return false;
      }
      if (scoreFilter === "low" && proc.stats.score >= 80) return false;
      return true;
    });
  }, [currentService, processSearch, scoreFilter]);

  return (
    <div
      data-testid="baza-uslug-container"
      className="flex flex-col md:flex-row h-full w-full overflow-hidden"
    >
      {/* LEWY SIDEBAR DRZEWA STRUKTURY USŁUG */}
      <div
        className={`bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300 z-20 relative overflow-hidden ${
          isSidebarCollapsed ? "md:w-0" : "w-full md:w-[320px]"
        }`}
      >
        {/* Przycisk zwijania na desktop */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex items-center justify-center w-8 h-8 absolute right-3 top-4 bg-slate-100 text-slate-700 hover:bg-brand-500 hover:text-white rounded-control transition-colors z-30"
          title={isSidebarCollapsed ? "Rozwiń drzewo usług" : "Zwiń panel"}
          aria-expanded={!isSidebarCollapsed}
          aria-label="Przełącz widoczność drzewa usług"
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Header drzewka */}
        <div className="p-4 sm:p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Library size={20} className="text-brand-500" />
            <h2 className="text-base font-bold text-slate-900">Drzewo Usług</h2>
          </div>
          <Input
            icon={Search}
            placeholder="Filtruj usługi..."
            size="sm"
            value={treeSearch}
            onChange={(e) => setTreeSearch(e.target.value)}
          />
        </div>

        {/* Lista gałęzi drzewa */}
        <nav
          role="tree"
          aria-label="Struktura usług i procesów biznesowych"
          className="flex-1 overflow-y-auto p-3 space-y-1.5"
        >
          {mockSharedServicesData
            .filter((svc) =>
              treeSearch ? svc.name.toLowerCase().includes(treeSearch.toLowerCase()) : true
            )
            .map((svc) => {
              const isSelected = selectedServiceId === svc.id;
              const isOpen = openFolders[svc.id] ?? false;

              return (
                <div key={svc.id} role="treeitem" aria-expanded={isOpen} className="select-none">
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedServiceId(svc.id);
                        setSelectedProcessId(null);
                        toggleFolder(svc.id);
                      }
                    }}
                    onClick={() => {
                      setSelectedServiceId(svc.id);
                      setSelectedProcessId(null);
                      toggleFolder(svc.id);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-control cursor-pointer transition-colors ${
                      isSelected && !selectedProcessId
                        ? "bg-brand-50 text-brand-700 font-bold"
                        : "hover:bg-slate-50 text-slate-800 font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <Folder
                        size={16}
                        className={isSelected ? "text-brand-500 shrink-0" : "text-slate-400 shrink-0"}
                      />
                      <span className="text-xs sm:text-sm truncate">{svc.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-badge">
                        {svc.processes.length}
                      </span>
                      {isOpen ? (
                        <ChevronDown size={14} className="text-slate-400" />
                      ) : (
                        <ChevronRight size={14} className="text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Procesy w folderze */}
                  {isOpen && (
                    <div role="group" className="ml-5 pl-2.5 border-l border-slate-200 mt-1 space-y-1">
                      {svc.processes.map((proc) => {
                        const isProcSelected = selectedProcessId === proc.id;
                        return (
                          <div
                            key={proc.id}
                            role="treeitem"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedServiceId(svc.id);
                                setSelectedProcessId(proc.id);
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedServiceId(svc.id);
                              setSelectedProcessId(proc.id);
                            }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-control text-xs cursor-pointer transition-colors ${
                              isProcSelected
                                ? "bg-brand-500 text-white font-bold"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                            }`}
                          >
                            <span className="truncate pr-2">{proc.name}</span>
                            <span
                              className={`text-[10px] font-bold ${
                                isProcSelected
                                  ? "text-blue-100"
                                  : proc.stats.score >= 80
                                  ? "text-emerald-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {proc.stats.score}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </nav>
      </div>

      {/* PRAWY OBSZAR: LISTA PROCESÓW LUB SZCZEGÓŁY PROCESU */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 min-h-0 bg-surface-page">
        {currentProcess ? (
          /* ========================================== */
          /* WIDOK: SZCZEGÓŁY PROCESU (KROKI / WIDOKI) */
          /* ========================================== */
          <div data-testid="process-details-view" className="max-w-[1000px] w-full">
            {/* Breadcrumb */}
            <nav aria-label="Ścieżka procesu" className="flex items-center text-[13px] font-medium text-slate-500 mb-4">
              <ol role="list" className="flex items-center flex-wrap gap-2 list-none m-0 p-0">
                <li>
                  <button
                    onClick={() => setSelectedProcessId(null)}
                    className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {currentService.name}
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-300 select-none font-normal" aria-hidden="true">/</span>
                  <span aria-current="page" className="text-slate-800 font-semibold">{currentProcess.name}</span>
                </li>
              </ol>
            </nav>

            {/* Title & Back */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {currentProcess.name}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Kolejne kroki i ekrany użytkownika składające się na proces biznesowy
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<ArrowLeft size={16} />}
                  onClick={() => setSelectedProcessId(null)}
                >
                  Wróć do listy procesów
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Plus size={16} />}
                  onClick={() => alert("Dodanie nowego widoku do procesu")}
                >
                  Nowy widok
                </Button>
              </div>
            </div>

            {/* Metryki procesu */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <Card className="p-4">
                <span className="text-micro font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Liczba ekranów
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {currentProcess.views.length}
                </span>
              </Card>
              <Card className="p-4">
                <span className="text-micro font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Średnia zgodność
                </span>
                <span className="text-2xl font-extrabold text-emerald-600">
                  {currentProcess.stats.score}%
                </span>
              </Card>
              <Card className="p-4">
                <span className="text-micro font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Błędy krytyczne
                </span>
                <span className="text-2xl font-extrabold text-red-600">
                  {currentProcess.stats.priorities.c}
                </span>
              </Card>
              <Card className="p-4">
                <span className="text-micro font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Reklamacje
                </span>
                <span className="text-2xl font-extrabold text-slate-700">
                  2 otwarte
                </span>
              </Card>
            </div>

            {/* Lista kroków / ekranów */}
            <div className="flex flex-col gap-4">
              {currentProcess.views.map((view, idx) => {
                const ChannelIcon =
                  view.channel === "WWW"
                    ? Monitor
                    : view.channel === "Aplikacja"
                    ? Smartphone
                    : FileText;

                return (
                  <Card
                    key={view.id}
                    data-testid="step-item"
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:border-brand-500/30 transition-all gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-control bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm sm:text-base shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {view.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <ChannelIcon size={14} />
                          <span>{view.channel}</span>
                          <span className="text-slate-300">•</span>
                          <span>Błędów: {view.errors.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 border-t sm:border-none border-slate-100 pt-3 sm:pt-0">
                      <PriorityStats
                        critical={view.priorities.c}
                        important={view.priorities.w}
                        marginal={view.priorities.m}
                        size="sm"
                      />

                      <Badge
                        variant={view.score >= 80 ? "success" : "warning"}
                        size="md"
                        className="w-18 justify-center"
                      >
                        {view.score}%
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ExternalLink size={14} />}
                        onClick={() => navigate("/audyty/a1")}
                      >
                        Otwórz audyt
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          /* ========================================== */
          /* WIDOK: LISTA PROCESÓW WYBRANEJ USŁUGI      */
          /* ========================================== */
          <div data-testid="process-list-view" className="max-w-[1100px] w-full">
            {/* Breadcrumb */}
            <nav aria-label="Ścieżka nawigacyjna" className="flex items-center text-[13px] font-medium text-slate-500 mb-4">
              <ol role="list" className="flex items-center flex-wrap gap-2 list-none m-0 p-0">
                <li className="text-slate-500">
                  Baza Usług
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-300 select-none font-normal" aria-hidden="true">/</span>
                  <span aria-current="page" className="text-slate-800 font-semibold">{currentService.name}</span>
                </li>
              </ol>
            </nav>

            {/* Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {currentService.name}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Łączny stan dostępności: <strong>{currentService.stats.score}%</strong> •{" "}
                  {currentService.processes.length} zmapowanych procesów biznesowych
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus size={16} />}
                onClick={() => alert("Dodanie nowego procesu")}
                className="shrink-0"
              >
                Nowy Proces
              </Button>
            </div>

            {/* POZIOME FILTRY PROCESÓW (NOWOŚĆ!) */}
            <div className="mb-6">
              <HorizontalFilterBar
                filters={filterConfigs}
                activeFilters={activeFilters}
                onFilterChange={(_, val) => setScoreFilter(val || "")}
                onFilterRemove={() => setScoreFilter("")}
                onClearAll={() => {
                  setScoreFilter("");
                  setProcessSearch("");
                }}
                searchValue={processSearch}
                onSearchChange={setProcessSearch}
                searchPlaceholder="Filtruj procesy po nazwie..."
              />
            </div>

            {/* Lista procesów */}
            <div className="flex flex-col gap-3">
              {filteredProcesses.map((proc) => {
                const scoreVariant =
                  proc.stats.score >= 90
                    ? "success"
                    : proc.stats.score >= 80
                    ? "warning"
                    : "danger";

                return (
                  <Card
                    key={proc.id}
                    data-testid="process-card"
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:border-brand-500/40 hover:shadow-card-hover transition-all cursor-pointer group gap-4"
                    hoverable
                    onClick={() => setSelectedProcessId(proc.id)}
                    aria-label={`Proces ${proc.name}, zgodność ${proc.stats.score}%. Kliknij aby zobaczyć ekrany`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 group-hover:bg-brand-50 group-hover:text-brand-500 rounded-control flex items-center justify-center text-slate-400 transition-colors shrink-0">
                        <Layout size={20} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand-500 transition-colors truncate">
                          {proc.name}
                        </h2>
                        <span className="text-xs text-slate-500 font-medium">
                          {proc.views.length} ekranów w ścieżce
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 border-t sm:border-none border-slate-100 pt-3 sm:pt-0 shrink-0">
                      <div>
                        <span className="text-micro font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                          Ekrany
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          {proc.views.length} / {proc.stats.totalViews}
                        </span>
                      </div>

                      <div>
                        <span className="text-micro font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                          Dostępność
                        </span>
                        <Badge variant={scoreVariant} size="sm">
                          {proc.stats.score}%
                        </Badge>
                      </div>

                      <div>
                        <span className="text-micro font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                          Błędy kryt.
                        </span>
                        <span className="text-sm font-bold text-red-600 text-center block">
                          {proc.stats.priorities.c}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Edycja procesu: ${proc.name}`);
                          }}
                          className="w-9 h-9 border border-slate-200 rounded-control flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Edytuj proces"
                          aria-label={`Edytuj proces ${proc.name}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Czy na pewno chcesz usunąć proces: ${proc.name}?`)) {
                              alert("Usunięto proces.");
                            }
                          }}
                          className="w-9 h-9 border border-slate-200 rounded-control flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                          title="Usuń proces"
                          aria-label={`Usuń proces ${proc.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
