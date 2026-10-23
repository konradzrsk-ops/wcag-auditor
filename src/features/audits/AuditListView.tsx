import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Activity,
  Eye,
  MonitorSmartphone,
  Smartphone,
  FileText,
  LayoutGrid,
  ArrowRight,
  Plus,
  AlertOctagon,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/layout/PageHeader";
import {
  HorizontalFilterBar,
  FilterConfig,
  ActiveFilter,
} from "../../components/layout/HorizontalFilterBar";
import { mockAuditsList } from "../../mocks/data";

const DEVICE_ICONS: Record<string, any> = {
  WWW: MonitorSmartphone,
  Android: Smartphone,
  iOS: Smartphone,
  PDF: FileText,
  Desktop: MonitorSmartphone,
  Dokumenty: FileText,
};

export function AuditListView() {
  const navigate = useNavigate();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedAuditor, setSelectedAuditor] = useState<string>("");

  const filterConfigs: FilterConfig[] = [
    {
      id: "status",
      label: "Status",
      type: "multiselect",
      value: selectedStatuses,
      options: [
        { value: "Zakończony", label: "Zakończony" },
        { value: "W trakcie", label: "W trakcie" },
        { value: "Nowy", label: "Nowy" },
      ],
    },
    {
      id: "channel",
      label: "Kanał",
      type: "multiselect",
      value: selectedChannels,
      options: [
        { value: "Desktop", label: "Desktop" },
        { value: "iOS", label: "iOS" },
        { value: "Android", label: "Android" },
        { value: "Dokumenty", label: "Dokumenty" },
      ],
    },
    {
      id: "client",
      label: "Klient",
      type: "select",
      value: selectedClient,
      options: [
        { value: "ING", label: "ING Bank Śląski" },
        { value: "mBank", label: "mBank" },
        { value: "Santander", label: "Santander" },
        { value: "PKO BP", label: "PKO BP" },
      ],
    },
    {
      id: "auditor",
      label: "Audytor",
      type: "select",
      value: selectedAuditor,
      options: [
        { value: "Anna Ekspert", label: "Anna Ekspert" },
        { value: "Piotr Audytor", label: "Piotr Audytor" },
      ],
    },
  ];

  // Active filters list for chips
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const active: ActiveFilter[] = [];
    selectedStatuses.forEach((status) => {
      active.push({ id: `status-${status}`, label: `Status: ${status}`, value: status });
    });
    selectedChannels.forEach((ch) => {
      active.push({ id: `channel-${ch}`, label: `Kanał: ${ch}`, value: ch });
    });
    if (selectedClient) {
      active.push({ id: "client", label: `Klient: ${selectedClient}`, value: selectedClient });
    }
    if (selectedAuditor) {
      active.push({ id: "auditor", label: `Audytor: ${selectedAuditor}`, value: selectedAuditor });
    }
    return active;
  }, [selectedStatuses, selectedChannels, selectedClient, selectedAuditor]);

  const handleFilterChange = (filterId: string, value: any) => {
    if (filterId === "status") setSelectedStatuses(value || []);
    if (filterId === "channel") setSelectedChannels(value || []);
    if (filterId === "client") setSelectedClient(value || "");
    if (filterId === "auditor") setSelectedAuditor(value || "");
  };

  const handleFilterRemove = (filterId: string) => {
    if (filterId.startsWith("status-")) {
      const val = filterId.replace("status-", "");
      setSelectedStatuses((prev) => prev.filter((s) => s !== val));
    } else if (filterId.startsWith("channel-")) {
      const val = filterId.replace("channel-", "");
      setSelectedChannels((prev) => prev.filter((c) => c !== val));
    } else if (filterId === "client") {
      setSelectedClient("");
    } else if (filterId === "auditor") {
      setSelectedAuditor("");
    }
  };

  const handleClearAll = () => {
    setSelectedStatuses([]);
    setSelectedChannels([]);
    setSelectedClient("");
    setSelectedAuditor("");
    setSearchQuery("");
  };

  // Filtered audits
  const filteredAudits = useMemo(() => {
    return mockAuditsList.filter((audit) => {
      // Search
      if (
        searchQuery &&
        !audit.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !audit.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Status
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(audit.status)) {
        return false;
      }
      // Channel
      if (selectedChannels.length > 0) {
        const matches = selectedChannels.some(
          (ch) =>
            audit.channel === ch ||
            (ch === "Desktop" && audit.channel === "WWW") ||
            (ch === "Dokumenty" && audit.channel === "PDF")
        );
        if (!matches) return false;
      }
      // Client
      if (selectedClient && audit.clientName !== selectedClient) {
        return false;
      }
      // Auditor
      if (selectedAuditor && audit.auditor !== selectedAuditor) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedStatuses, selectedChannels, selectedClient, selectedAuditor]);

  return (
    <div data-testid="raporty-view" className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-6 pb-2 shrink-0">
        <PageHeader
          title="Audyty i raporty WCAG"
          subtitle={`Przegląd przeprowadzonych audytów zgodności z WCAG 2.1 / 2.2 (${filteredAudits.length} znalezionych)`}
          actions={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus size={16} />}
              onClick={() => alert("Formularz zlecenia nowego audytu")}
            >
              Zleć nowy audyt
            </Button>
          }
        />

        {/* POZIOME FILTRY */}
        <div className="mt-4">
          <HorizontalFilterBar
            filters={filterConfigs}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onFilterRemove={handleFilterRemove}
            onClearAll={handleClearAll}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Szukaj po nazwie usługi lub kliencie..."
            extraFiltersCount={3}
          />
        </div>
      </div>

      {/* Grid audytów */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-2">
        {filteredAudits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <LayoutGrid size={48} className="text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Brak audytów spełniających kryteria</h3>
            <p className="text-sm text-slate-400 mt-1 mb-4">
              Spróbuj zmienić parametry filtrów lub wyszukiwania.
            </p>
            <Button variant="secondary" size="sm" onClick={handleClearAll}>
              Wyczyść wszystkie filtry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredAudits.map((audit) => {
              const DeviceIcon = DEVICE_ICONS[audit.channel] || MonitorSmartphone;
              const statusVariant =
                audit.status === "Zakończony"
                  ? "success"
                  : audit.status === "W trakcie"
                  ? "warning"
                  : "info";

              return (
                <Card
                  key={audit.id}
                  data-testid="report-card"
                  className="p-4 sm:p-5 hover:border-brand-500/40 transition-all flex flex-col justify-between"
                  hoverable
                  onClick={() => navigate(`/audyty/${audit.id}`)}
                  aria-label={`${audit.title}, Status: ${audit.status}, Zgodność: ${audit.score}%. Kliknij aby zobaczyć szczegóły`}
                >
                  <div>
                    {/* Top Tag & Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="brand" size="sm">
                          <Calendar size={12} className="mr-1" />
                          {audit.startDate}
                        </Badge>
                        <span className="text-micro font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-badge">
                          {audit.clientName}
                        </span>
                      </div>
                      <Badge variant={statusVariant} size="sm">
                        {statusVariant === "success" && <CheckCircle2 size={12} className="mr-1" />}
                        {statusVariant === "warning" && <Activity size={12} className="mr-1" />}
                        {statusVariant === "info" && <Eye size={12} className="mr-1" />}
                        {audit.status}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 group-hover:text-brand-500 transition-colors">
                      {audit.title}
                    </h3>

                    {/* Auditor and Level */}
                    <div className="text-xs text-slate-500 mb-4 flex items-center gap-3">
                      <span>Audytor: <strong className="text-slate-700">{audit.auditor}</strong></span>
                      <span>Poziom: <strong className="text-slate-700">WCAG 2.1 {audit.wcagLevel}</strong></span>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="pt-3 border-t border-slate-100 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* 3 wagi błędów obok siebie z tooltipami */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Priorytetowe */}
                          <div className="relative group/tip flex items-center">
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-200/60 cursor-help"
                              title={`Błędy priorytetowe: ${audit.criticalErrors}`}
                            >
                              <AlertOctagon size={11} className="text-red-500" />
                              {audit.criticalErrors}
                            </span>
                            <div
                              role="tooltip"
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                            >
                              Błędy priorytetowe: {audit.criticalErrors}
                              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                            </div>
                          </div>

                          {/* Ważne */}
                          <div className="relative group/tip flex items-center">
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 cursor-help"
                              title={`Błędy ważne: ${Math.round((audit.brokenCriteria || 8) * 0.6)}`}
                            >
                              <AlertTriangle size={11} className="text-amber-500" />
                              {Math.round((audit.brokenCriteria || 8) * 0.6)}
                            </span>
                            <div
                              role="tooltip"
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                            >
                              Błędy ważne: {Math.round((audit.brokenCriteria || 8) * 0.6)}
                              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                            </div>
                          </div>

                          {/* Marginalne */}
                          <div className="relative group/tip flex items-center">
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 cursor-help"
                              title={`Błędy marginalne: ${Math.max(1, (audit.brokenCriteria || 10) - audit.criticalErrors - Math.round((audit.brokenCriteria || 8) * 0.6))}`}
                            >
                              <Info size={11} className="text-blue-500" />
                              {Math.max(1, (audit.brokenCriteria || 10) - audit.criticalErrors - Math.round((audit.brokenCriteria || 8) * 0.6))}
                            </span>
                            <div
                              role="tooltip"
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                            >
                              Błędy marginalne: {Math.max(1, (audit.brokenCriteria || 10) - audit.criticalErrors - Math.round((audit.brokenCriteria || 8) * 0.6))}
                              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                            Zgodność
                          </span>
                          <span
                            className={`text-lg font-bold leading-none ${
                              audit.score >= 80 ? "text-emerald-600" : "text-amber-600"
                            }`}
                          >
                            {audit.score > 0 ? `${audit.score}%` : "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium ml-1">
                          <DeviceIcon size={16} aria-hidden="true" />
                          <span>{audit.channel}</span>
                        </div>
                      </div>

                      <div className="w-9 h-9 bg-brand-50 text-brand-500 hover:bg-brand-500 hover:text-white rounded-control flex items-center justify-center transition-all shadow-sm">
                        <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
