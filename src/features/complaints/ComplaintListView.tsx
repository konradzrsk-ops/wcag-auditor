import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Plus,
  Clock,
  ChevronRight,
  User,
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
import { mockComplaints } from "../../mocks/data";
import { ComplaintStatus } from "../../types";

export function ComplaintListView() {
  const navigate = useNavigate();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");

  const filterConfigs: FilterConfig[] = [
    {
      id: "status",
      label: "Status ticketu",
      type: "multiselect",
      value: selectedStatuses,
      options: [
        { value: "Nowy", label: "Nowy" },
        { value: "W analizie", label: "W analizie" },
        { value: "Rekomendacja", label: "Rekomendacja wystawiona" },
        { value: "W naprawie", label: "W naprawie (deweloperzy)" },
        { value: "Weryfikacja", label: "Weryfikacja audytora" },
        { value: "Zamknięty", label: "Zamknięty" },
      ],
    },
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
      id: "service",
      label: "Usługa",
      type: "select",
      value: selectedService,
      options: [
        { value: "Kredyt hipoteczny", label: "Kredyt hipoteczny" },
        { value: "Usługi płatnicze", label: "Usługi płatnicze i ROR" },
      ],
    },
  ];

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const list: ActiveFilter[] = [];
    selectedStatuses.forEach((st) => {
      list.push({ id: `st-${st}`, label: `Status: ${st}`, value: st });
    });
    selectedPriorities.forEach((p) => {
      list.push({ id: `p-${p}`, label: `Priorytet: ${p}`, value: p });
    });
    if (selectedService) {
      list.push({ id: "service", label: `Usługa: ${selectedService}`, value: selectedService });
    }
    return list;
  }, [selectedStatuses, selectedPriorities, selectedService]);

  const handleFilterChange = (id: string, val: any) => {
    if (id === "status") setSelectedStatuses(val || []);
    if (id === "priority") setSelectedPriorities(val || []);
    if (id === "service") setSelectedService(val || "");
  };

  const handleFilterRemove = (id: string) => {
    if (id.startsWith("st-")) {
      const val = id.replace("st-", "");
      setSelectedStatuses((prev) => prev.filter((s) => s !== val));
    } else if (id.startsWith("p-")) {
      const val = id.replace("p-", "");
      setSelectedPriorities((prev) => prev.filter((p) => p !== val));
    } else if (id === "service") {
      setSelectedService("");
    }
  };

  const handleClearAll = () => {
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSelectedService("");
    setSearchQuery("");
  };

  const filteredComplaints = useMemo(() => {
    return mockComplaints.filter((c) => {
      if (
        searchQuery &&
        !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(c.status)) {
        return false;
      }
      if (selectedPriorities.length > 0 && !selectedPriorities.includes(c.priority)) {
        return false;
      }
      if (selectedService && c.serviceName !== selectedService) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedStatuses, selectedPriorities, selectedService]);

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case "Nowy":
        return <Badge variant="neutral" size="sm">{status}</Badge>;
      case "W analizie":
        return <Badge variant="info" size="sm">{status}</Badge>;
      case "Rekomendacja":
        return <Badge variant="brand" size="sm">💡 {status}</Badge>;
      case "W naprawie":
        return <Badge variant="warning" size="sm">{status}</Badge>;
      case "Zamknięty":
        return <Badge variant="success" size="sm">{status}</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div data-testid="complaints-list-view" className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-6 pb-2 shrink-0">
        <PageHeader
          title="Moduł Skarg i reklamacji"
          subtitle="Obsługa zgłoszeń i skarg klientów z rekomendacjami ekspertów WCAG"
          actions={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus size={16} />}
              onClick={() => navigate("/reklamacje/nowy")}
            >
              Nowe zgłoszenie
            </Button>
          }
        />

        {/* Liczniki metryk ticketów */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-4">
          <Card className="p-3.5 bg-white">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-0.5">
              Wszystkie zgłoszenia
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {mockComplaints.length}
            </span>
          </Card>
          <Card className="p-3.5 bg-blue-50/50 border-blue-100">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block mb-0.5">
              W analizie / Nowe
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-blue-800">
              {mockComplaints.filter((c) => c.status === "Nowy" || c.status === "W analizie").length}
            </span>
          </Card>
          <Card className="p-3.5 bg-brand-50/50 border-brand-100">
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-widest block mb-0.5">
              Wydane rekomendacje
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-brand-600">
              {mockComplaints.filter((c) => !!c.recommendation).length}
            </span>
          </Card>
          <Card className="p-3.5 bg-amber-50/50 border-amber-100">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block mb-0.5">
              W naprawie u devów
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-800">
              {mockComplaints.filter((c) => c.status === "W naprawie").length}
            </span>
          </Card>
        </div>

        {/* POZIOME FILTRY */}
        <HorizontalFilterBar
          filters={filterConfigs}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onFilterRemove={handleFilterRemove}
          onClearAll={handleClearAll}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Szukaj po ID, tytule lub usłudze..."
        />
      </div>

      {/* Lista ticketów */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-2">
        {filteredComplaints.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            Brak zgłoszeń spełniających wybrane kryteria filtrowania.
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredComplaints.map((item) => {
              const priorityVariant =
                item.priority === "Krytyczny"
                  ? "danger"
                  : item.priority === "Ważny"
                  ? "warning"
                  : "info";

              return (
                <Card
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:border-brand-500/40 hover:shadow-card-hover transition-all cursor-pointer gap-4"
                  hoverable
                  onClick={() => navigate(`/reklamacje/${item.id}`)}
                  aria-label={`Ticket ${item.id}: ${item.title}. Status: ${item.status}`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-control bg-slate-100 group-hover:bg-brand-50 group-hover:text-brand-500 flex items-center justify-center text-slate-500 shrink-0 transition-colors">
                      <MessageSquare size={20} />
                    </div>

                    <div className="min-w-0 pr-2">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-badge">
                          #{item.id}
                        </span>
                        <Badge variant={priorityVariant} size="sm">
                          {item.priority}
                        </Badge>
                        {getStatusBadge(item.status)}
                        {item.recommendation && (
                          <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-badge border border-brand-100">
                            Gotowa rekomendacja
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand-500 transition-colors truncate">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Usługa: <strong className="text-slate-700">{item.serviceName}</strong></span>
                        {item.viewName && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span>Ekran: <strong className="text-slate-700">{item.viewName}</strong></span>
                          </>
                        )}
                        {item.wcagCriteria && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-brand-600 font-semibold">{item.wcagCriteria}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-none border-slate-100 pt-3 sm:pt-0 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <User size={13} />
                        <span>{item.reporter}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5 font-medium">
                        <Clock size={11} />
                        <span>{new Date(item.createdAt).toLocaleDateString("pl-PL")}</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-control bg-slate-100 group-hover:bg-brand-500 group-hover:text-white flex items-center justify-center text-slate-500 transition-colors">
                      <ChevronRight size={18} />
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
