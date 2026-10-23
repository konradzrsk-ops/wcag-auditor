import { useNavigate } from "react-router-dom";
import {
  Activity,
  ListChecks,
  AlertOctagon,
  ClipboardCheck,
  Calendar,
  Plus,
  Info,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Tooltip } from "../../components/ui/Tooltip";
import { TrendChart } from "../../components/charts/TrendChart";
import { ChannelBars } from "../../components/charts/ChannelBars";
import { chartTrendData, mockChannelData } from "../../mocks/data";

export function DashboardView() {
  const navigate = useNavigate();

  return (
    <div data-testid="dashboard-view" className="max-w-[1600px] flex flex-col gap-6 w-full mx-auto">
      <div className="mb-2 sm:mb-4">
        <nav aria-label="Ścieżka nawigacyjna" className="text-xs font-semibold text-slate-600 mb-1">
          <span>Pulpit</span>
        </nav>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
          Witaj, Kinga
        </h1>
        <p className="text-slate-600 text-sm">
          Oto podsumowanie stanu dostępności w Twojej organizacji na dziś.
        </p>
      </div>

      {/* RZĄD 1: Główne KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card
          className="p-6 hover:border-brand-500/30 transition-colors"
          hoverable
          onClick={() => navigate("/raportowanie")}
          aria-label="Średnia Dostępność: 86.2%. Kliknij, aby przejść do raportowania"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Activity size={24} aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-tiny font-bold text-slate-600 uppercase tracking-widest block">
              Średnia Dostępność
            </span>
            <Tooltip content="Zagregowany średni wskaźnik zgodności z kryteriami sukcesu WCAG 2.1 AA we wszystkich procesach." position="top">
              <span className="p-0.5 text-slate-500 hover:text-brand-500 cursor-help rounded-full">
                <Info size={12} />
              </span>
            </Tooltip>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              86.2%
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-slate-600">
                Cel: 90%
              </span>
              <Tooltip content="Strategiczny cel organizacji zgodny ze standardem Europejskiego Aktu o Dostępności (EAA)." position="top">
                <span className="p-0.5 text-slate-500 hover:text-brand-500 cursor-help rounded-full">
                  <Info size={12} />
                </span>
              </Tooltip>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 hover:border-brand-500/30 transition-colors"
          hoverable
          onClick={() => navigate("/uslugi")}
          aria-label="Pokrycie audytowe: 92.0%, 142 procesy. Kliknij, aby przejść do bazy usług"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ListChecks size={24} aria-hidden="true" />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-tiny font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-badge">
                142 procesy
              </span>
              <Tooltip content="Łączna liczba zinwentaryzowanych procesów w Bazie Usług podlegających cyklicznemu monitoringowi dostępności." position="bottom">
                <span className="p-0.5 text-slate-500 hover:text-brand-500 cursor-help rounded-full">
                  <Info size={12} />
                </span>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-tiny font-bold text-slate-600 uppercase tracking-widest block">
              Pokrycie Audytowe
            </span>
            <Tooltip content="Odsetek zidentyfikowanych procesów i ścieżek cyfrowych posiadających aktualny audyt WCAG." position="top">
              <span className="p-0.5 text-slate-500 hover:text-brand-500 cursor-help rounded-full">
                <Info size={12} />
              </span>
            </Tooltip>
          </div>
          <span className="text-3xl font-extrabold text-slate-900">92.0%</span>
        </Card>

        <Card
          className="p-6 hover:border-red-300 transition-colors"
          hoverable
          onClick={() => navigate("/raportowanie")}
          aria-label="Błędy: 47. Kliknij, aby przejść do raportowania"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
              <AlertOctagon size={24} aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-tiny font-bold text-slate-600 uppercase tracking-widest block">
              Błędy
            </span>
            <Tooltip content="Łączna liczba zarejestrowanych barier dostępności." position="top">
              <span className="p-0.5 text-slate-500 hover:text-red-700 cursor-help rounded-full">
                <Info size={12} />
              </span>
            </Tooltip>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">47</span>
          </div>
        </Card>

        <Card
          className="p-6 hover:border-blue-300 transition-colors"
          hoverable
          onClick={() => navigate("/audyty")}
          aria-label="Przeprowadzone audyty: 12, 4 w trakcie. Kliknij, aby przejść do audytów"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ClipboardCheck size={24} aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-tiny font-bold text-slate-600 uppercase tracking-widest block">
              Przeprowadzone Audyty
            </span>
            <Tooltip content="Liczba zrealizowanych audytów certyfikacyjnych i okresowych zarejestrowanych w systemie." position="top">
              <span className="p-0.5 text-slate-500 hover:text-blue-700 cursor-help rounded-full">
                <Info size={12} />
              </span>
            </Tooltip>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">12</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-slate-600">
                4 w trakcie
              </span>
              <Tooltip content="Audyty oraz re-audyty w trakcie realizacji przez audytorów WCAG." position="top">
                <span className="p-0.5 text-slate-500 hover:text-blue-700 cursor-help rounded-full">
                  <Info size={12} />
                </span>
              </Tooltip>
            </div>
          </div>
        </Card>
      </div>

      {/* RZĄD 2: Listy akcji i ostatnie audyty */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Ostatnie audyty
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Szybki podgląd prowadzonych prac
              </span>
            </div>
            <button
              onClick={() => navigate("/audyty")}
              className="text-brand-500 bg-brand-50 hover:bg-brand-100 p-2 rounded-control transition-colors"
              title="Zobacz wszystkie audyty"
              aria-label="Zobacz wszystkie audyty"
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {[
              {
                id: "a1",
                date: "12.03.2026",
                status: "Zakończony" as const,
                tag: "ING",
                title: "Strona ing.pl - wybrane podstrony",
                score: "77.5%",
                statusVariant: "success" as const,
              },
              {
                id: "a2",
                date: "15.04.2026",
                status: "W trakcie" as const,
                tag: "mBank",
                title: "Serwis transakcyjny - Nowy Dashboard",
                score: "62.1%",
                statusVariant: "warning" as const,
              },
              {
                id: "a3",
                date: "05.06.2026",
                status: "Nowy" as const,
                tag: "ING",
                title: "Proces reklamacyjny - formularze",
                score: "-",
                statusVariant: "info" as const,
              },
            ].map((audit) => (
              <div
                key={audit.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/audyty/${audit.id}`);
                  }
                }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-control hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer group"
                onClick={() => navigate(`/audyty/${audit.id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={audit.statusVariant}
                      size="sm"
                      className="w-[85px] justify-center"
                    >
                      {audit.status}
                    </Badge>
                    <span className="text-micro font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-badge">
                      {audit.tag}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-brand-500 transition-colors line-clamp-1">
                    {audit.title}
                  </span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Calendar size={13} aria-hidden="true" /> {audit.date}
                  </span>
                  <span
                    className={`text-sm font-extrabold ${
                      audit.score === "-"
                        ? "text-slate-600 font-bold"
                        : parseFloat(audit.score) >= 80
                        ? "text-emerald-700 font-bold"
                        : "text-amber-800 font-bold"
                    }`}
                  >
                    {audit.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/audyty")}
            className="w-full mt-4 text-sm font-bold text-brand-500 hover:bg-brand-50 py-2.5 rounded-control transition-colors border border-brand-500/20"
          >
            Przejdź do Audytów
          </button>
        </Card>

        <Card className="p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Wymagające uwagi (Top 5)
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Usługi o najniższym procencie dostępności
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {[
              { name: "Kredyt hipoteczny (Kalkulator)", score: 42.5, err: 54 },
              { name: "Otwarcie rachunku firmowego", score: 58.2, err: 32 },
              { name: "Panel wymiany walut (Kantor)", score: 64.0, err: 28 },
              { name: "Proces reklamacyjny", score: 68.5, err: 21 },
              { name: "Usługi płatnicze - BLIK", score: 72.1, err: 15 },
            ].map((u, i) => (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate("/uslugi");
                  }
                }}
                className="flex items-center justify-between p-3 rounded-control hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer"
                onClick={() => navigate("/uslugi")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-red-50 text-red-600 flex items-center justify-center text-micro font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 line-clamp-1">
                      {u.name}
                    </div>
                    <div className="text-xs text-slate-500 font-semibold">
                      {u.err} aktywnych błędów
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    u.score < 50
                      ? "danger"
                      : u.score < 70
                      ? "warning"
                      : "success"
                  }
                  size="sm"
                  className="w-16 justify-center shrink-0 ml-2"
                >
                  {u.score}%
                </Badge>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/raportowanie")}
            className="w-full mt-4 text-sm font-bold text-brand-500 hover:bg-brand-50 py-2.5 rounded-control transition-colors border border-brand-500/20"
          >
            Zobacz pełny ranking w raportach
          </button>
        </Card>
      </div>

      {/* RZĄD 3: Trendy i Kanały */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wykres Liniowy / Słupkowy: Trend */}
        <Card className="p-4 sm:p-6 flex flex-col min-h-[380px] lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Trend dostępności vs Błędy w czasie
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Ostatnie 12 miesięcy w całej organizacji
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <TrendChart data={chartTrendData} height={220} />
          </div>
        </Card>

        {/* Wykres Paskowy Poziomy: Kanały */}
        <Card className="p-6 flex flex-col min-h-[380px]">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Zgodność kanałów
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Stan wdrożenia wytycznych wg platform
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <ChannelBars channels={mockChannelData} />
          </div>
        </Card>
      </div>
    </div>
  );
}
