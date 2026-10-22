import { useState, useMemo } from "react";
import {
  ClipboardList,
  Layout,
  PieChart,
  Scale,
  FileText,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { TrendChart } from "../../components/charts/TrendChart";
import { ChannelBars } from "../../components/charts/ChannelBars";
import {
  HorizontalFilterBar,
  FilterConfig,
  ActiveFilter,
} from "../../components/layout/HorizontalFilterBar";
import {
  chartTrendData,
  mockChannelData,
  mockRegulatoryData,
  mockSharedServicesData,
  genFlatErrors,
} from "../../mocks/data";

export function ReportingView() {
  const [activeGroup, setActiveGroup] = useState<
    "audyty" | "uslugi" | "zarzadcze" | "regulacyjne"
  >("audyty");
  const [activeAudytyTab, setActiveAudytyTab] = useState<"raport" | "bledy">("raport");
  const [activeUslugiTab, setActiveUslugiTab] = useState<"dostepnosc" | "bledy">("dostepnosc");

  // Global horizontal filters state
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const filterConfigs: FilterConfig[] = [
    {
      id: "service",
      label: "Usługa",
      type: "select",
      value: selectedService,
      options: [
        { value: "s1", label: "Usługi płatnicze i powiązane" },
        { value: "s2", label: "Kredyt hipoteczny" },
      ],
    },
    {
      id: "channel",
      label: "Kanał",
      type: "select",
      value: selectedChannel,
      options: [
        { value: "WWW", label: "WWW" },
        { value: "Aplikacja", label: "Aplikacja mobilna" },
        { value: "Dokumenty", label: "Dokumenty (PDF)" },
      ],
    },
  ];

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const list: ActiveFilter[] = [];
    if (selectedService) {
      list.push({
        id: "service",
        label: `Usługa: ${selectedService === "s1" ? "Płatności" : "Kredyt"}`,
        value: selectedService,
      });
    }
    if (selectedChannel) {
      list.push({
        id: "channel",
        label: `Kanał: ${selectedChannel}`,
        value: selectedChannel,
      });
    }
    return list;
  }, [selectedService, selectedChannel]);

  const handleFilterChange = (id: string, val: any) => {
    if (id === "service") setSelectedService(val || "");
    if (id === "channel") setSelectedChannel(val || "");
  };

  const handleFilterRemove = (id: string) => {
    if (id === "service") setSelectedService("");
    if (id === "channel") setSelectedChannel("");
  };

  const handleClearAll = () => {
    setSelectedService("");
    setSelectedChannel("");
    setSearchPhrase("");
  };

  const flatErrors = useMemo(() => genFlatErrors(15, "REP_"), []);

  return (
    <div data-testid="reporting-module-view" className="flex flex-col h-full w-full overflow-hidden">
      {/* Top Header & Tabs */}
      <div className="px-4 sm:px-8 lg:px-10 pt-6 sm:pt-8 bg-white shrink-0 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Raportowanie i Analizy
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Zagregowane zestawienia audytowe, zarządcze i zgodności formalno-prawnej
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<FileText size={16} className="text-red-500" />}
              onClick={() => alert("Generowanie raportu PDF")}
            >
              PDF
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<FileSpreadsheet size={16} className="text-emerald-600" />}
              onClick={() => alert("Eksport do Excel")}
            >
              XLS
            </Button>
          </div>
        </div>

        {/* 4 Główne Zakładki */}
        <div className="flex items-center gap-2 sm:gap-6 border-b border-transparent overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveGroup("audyty")}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 text-sm font-bold transition-colors whitespace-nowrap ${
              activeGroup === "audyty"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ClipboardList size={16} />
            <span>Raporty z Audytów</span>
          </button>

          <button
            onClick={() => setActiveGroup("uslugi")}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 text-sm font-bold transition-colors whitespace-nowrap ${
              activeGroup === "uslugi"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layout size={16} />
            <span>Dostępność Usług</span>
          </button>

          <button
            onClick={() => setActiveGroup("zarzadcze")}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 text-sm font-bold transition-colors whitespace-nowrap ${
              activeGroup === "zarzadcze"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <PieChart size={16} />
            <span>Zarządcze (C-Level)</span>
          </button>

          <button
            onClick={() => setActiveGroup("regulacyjne")}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 text-sm font-bold transition-colors whitespace-nowrap ${
              activeGroup === "regulacyjne"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Scale size={16} />
            <span>Regulacyjne (PAD / EAA)</span>
          </button>
        </div>
      </div>

      {/* POZIOME FILTRY */}
      <div className="px-4 sm:px-8 lg:px-10 py-3 bg-white border-b border-slate-200 shrink-0">
        <HorizontalFilterBar
          filters={filterConfigs}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onFilterRemove={handleFilterRemove}
          onClearAll={handleClearAll}
          searchValue={searchPhrase}
          onSearchChange={setSearchPhrase}
          searchPlaceholder="Filtruj raporty po frazie lub kryterium..."
        />
      </div>

      {/* Główna treść raportów */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 bg-surface-page">
        {/* ========================================== */}
        {/* GRUPA 1: RAPORTY Z AUDYTÓW                 */}
        {/* ========================================== */}
        {activeGroup === "audyty" && (
          <div className="flex flex-col gap-6 w-full">
            {/* Sub-nav */}
            <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-control w-max">
              <button
                onClick={() => setActiveAudytyTab("raport")}
                className={`px-4 py-1.5 text-xs font-bold rounded-badge transition-colors ${
                  activeAudytyTab === "raport"
                    ? "bg-white text-brand-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Zagregowany Raport Audytów
              </button>
              <button
                onClick={() => setActiveAudytyTab("bledy")}
                className={`px-4 py-1.5 text-xs font-bold rounded-badge transition-colors ${
                  activeAudytyTab === "bledy"
                    ? "bg-white text-brand-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Katalog Wszystkich Błędów ({flatErrors.length})
              </button>
            </div>

            {activeAudytyTab === "raport" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    Audytowane komponenty — poziom zgodności
                  </h3>
                  <div className="space-y-4">
                    {mockSharedServicesData[0].processes.slice(0, 5).map((proc) => (
                      <div key={proc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-control">
                        <div>
                          <span className="font-bold text-sm text-slate-800 block">{proc.name}</span>
                          <span className="text-xs text-slate-500">{proc.views.length} ekranów</span>
                        </div>
                        <Badge variant={proc.stats.score >= 80 ? "success" : "warning"} size="md">
                          {proc.stats.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    Zgodność wg platformy
                  </h3>
                  <ChannelBars channels={mockChannelData} />
                </Card>
              </div>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Problem</th>
                        <th className="p-3.5">Kryterium</th>
                        <th className="p-3.5">Priorytet</th>
                        <th className="p-3.5">Kanał</th>
                        <th className="p-3.5">Usługa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {flatErrors.map((err) => (
                        <tr key={err.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-700">{err.id}</td>
                          <td className="p-3.5 font-medium text-slate-800 max-w-md">{err.problem}</td>
                          <td className="p-3.5 font-semibold text-slate-600">{err.criteria}</td>
                          <td className="p-3.5">
                            <Badge
                              variant={
                                err.priority === "Krytyczny"
                                  ? "danger"
                                  : err.priority === "Ważny"
                                  ? "warning"
                                  : "info"
                              }
                              size="sm"
                            >
                              {err.priority}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-slate-500 font-medium">{err.channels.join(", ")}</td>
                          <td className="p-3.5 text-slate-600 font-semibold">{err.serviceName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* GRUPA 2: DOSTĘPNOŚĆ USŁUG                  */}
        {/* ========================================== */}
        {activeGroup === "uslugi" && (
          <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-control w-max">
              <button
                onClick={() => setActiveUslugiTab("dostepnosc")}
                className={`px-4 py-1.5 text-xs font-bold rounded-badge transition-colors ${
                  activeUslugiTab === "dostepnosc"
                    ? "bg-white text-brand-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Macierz Usług i Procesów
              </button>
              <button
                onClick={() => setActiveUslugiTab("bledy")}
                className={`px-4 py-1.5 text-xs font-bold rounded-badge transition-colors ${
                  activeUslugiTab === "bledy"
                    ? "bg-white text-brand-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Błędy w Usługach
              </button>
            </div>

            {activeUslugiTab === "dostepnosc" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockSharedServicesData.map((svc) => (
                  <Card key={svc.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{svc.name}</h3>
                        <span className="text-xs text-slate-500">{svc.stats.processes} procesów</span>
                      </div>
                      <Badge variant={svc.stats.score >= 80 ? "success" : "warning"} size="md">
                        {svc.stats.score}%
                      </Badge>
                    </div>

                    <div className="space-y-2.5 mt-4">
                      {svc.processes.slice(0, 4).map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-xs p-2.5 rounded-control bg-slate-50">
                          <span className="font-semibold text-slate-700">{p.name}</span>
                          <span className="font-bold text-slate-900">{p.stats.score}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-sm text-slate-600">
                Szczegółowy rejestr błędów powiązanych z procesami biznesowymi (dostępny w widoku tabeli).
              </Card>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* GRUPA 3: RAPORT ZARZĄDCZY (C-LEVEL)        */}
        {/* ========================================== */}
        {activeGroup === "zarzadcze" && (
          <div className="flex flex-col gap-6 w-full">
            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="p-6">
                <span className="text-tiny font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Średnia dostępność
                </span>
                <span className="text-3xl font-extrabold text-slate-900">86.2%</span>
                <span className="text-xs text-emerald-600 font-bold block mt-1">+2.4% r/r</span>
              </Card>
              <Card className="p-6">
                <span className="text-tiny font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Pokrycie procesów
                </span>
                <span className="text-3xl font-extrabold text-slate-900">92%</span>
                <span className="text-xs text-slate-500 font-medium block mt-1">142 procesy audytowane</span>
              </Card>
              <Card className="p-6">
                <span className="text-tiny font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Krytyczne blokerów
                </span>
                <span className="text-3xl font-extrabold text-red-600">47</span>
                <span className="text-xs text-red-500 font-bold block mt-1">Wymaga eskalacji</span>
              </Card>
              <Card className="p-6">
                <span className="text-tiny font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Po terminie SLA
                </span>
                <span className="text-3xl font-extrabold text-amber-600">12</span>
                <span className="text-xs text-amber-600 font-medium block mt-1">Średnio: 14 dni opóźnienia</span>
              </Card>
            </div>

            {/* Wykresy */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-base font-bold text-slate-900 mb-2">Trend dostępności w 12 miesiącach</h3>
                <TrendChart data={chartTrendData} height={220} />
              </Card>
              <Card className="p-6">
                <h3 className="text-base font-bold text-slate-900 mb-4">Stan wdrożenia w kanałach</h3>
                <ChannelBars channels={mockChannelData} />
              </Card>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* GRUPA 4: RAPORT REGULACYJNY (PAD / EAA)    */}
        {/* ========================================== */}
        {activeGroup === "regulacyjne" && (
          <div className="flex flex-col gap-6 w-full">
            {/* Banner informacyjny */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-slate-700 bg-brand-50/50 p-5 rounded-card border border-brand-100">
              <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Scale size={20} />
              </div>
              <div className="flex-1">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Wymogi Ustawy o dostępności cyfrowej i European Accessibility Act (EAA)
                </span>
                <span className="text-slate-600 text-xs sm:text-sm">
                  Moduł monitorowania statusu formalno-prawnego usług, terminów ustawowych audytów oraz aktualności Deklaracji Dostępności (wymóg rocznej aktualizacji do 31 marca).
                </span>
              </div>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Download size={16} />}
                onClick={() => alert("Pobieranie oficjalnego zestawienia prawnego dla organów nadzorczych")}
                className="shrink-0"
              >
                Generuj raport prawny
              </Button>
            </div>

            {/* KPI Ustawowe */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Card className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-control bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle size={24} />
                  </div>
                  <span className="text-tiny font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-badge">
                    Suma: 24
                  </span>
                </div>
                <span className="text-tiny font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Usługi W Pełni Zgodne
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">8</span>
                  <span className="text-sm font-semibold text-slate-400">(33%)</span>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-control bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle size={24} />
                  </div>
                </div>
                <span className="text-tiny font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Częściowo Zgodne
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">12</span>
                  <span className="text-sm font-semibold text-amber-600">(50%)</span>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-control bg-red-50 text-red-600 flex items-center justify-center">
                    <XCircle size={24} />
                  </div>
                </div>
                <span className="text-tiny font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Niezgodne Ustawowo
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">4</span>
                  <span className="text-sm font-semibold text-red-600">Ryzyko kar!</span>
                </div>
              </Card>
            </div>

            {/* Rejestr Zgodności Usług (Tabela) */}
            <Card className="overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-white">
                <h3 className="text-base font-bold text-slate-900">
                  Rejestr Zgodności Usług i Deklaracji Dostępności
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Usługa</th>
                      <th className="p-4">Typ</th>
                      <th className="p-4">Zgodność Prawna</th>
                      <th className="p-4">Ostatni Audyt</th>
                      <th className="p-4">Deklaracja Dostępności</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockRegulatoryData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{row.name}</td>
                        <td className="p-4 text-slate-500 font-medium">{row.type}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              row.compliance === "Zgodna"
                                ? "success"
                                : row.compliance === "Częściowo zgodna"
                                ? "warning"
                                : "danger"
                            }
                            size="sm"
                          >
                            {row.compliance}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{row.lastAuditDate}</td>
                        <td className="p-4">
                          <span
                            className={`font-semibold ${
                              row.declarationStatus === "Aktualna"
                                ? "text-emerald-700"
                                : "text-amber-700"
                            }`}
                          >
                            {row.declarationStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
