import { useNavigate, useParams } from "react-router-dom";
import {
  ClipboardCheck,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Info,
  AlertOctagon,
  AlertTriangle,
  ListChecks,
  History,
  Plus,
  ArrowLeft,
  Download,
  Layout,
  ChevronRight,
  Monitor,
  Smartphone,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { PriorityStats } from "../../components/charts/PriorityStats";
import { mockAuditsList } from "../../mocks/data";

const mockReaudits = [
  {
    id: "re1",
    name: "Reaudyt z dnia 15.04.2026",
    date: "15.04.2026",
    auditor: "P. Smułkowski",
    score: 85.2,
    brokenCriteria: 5,
    criticalErrors: 1,
    status: "Zakończony",
  },
  {
    id: "re2",
    name: "Reaudyt z dnia 20.05.2026",
    date: "20.05.2026",
    auditor: "A. Nowak",
    score: 92.4,
    brokenCriteria: 2,
    criticalErrors: 0,
    status: "W trakcie",
  },
];

const mockTestedElements = [
  {
    id: "te1",
    title: "Strona główna",
    channel: "WWW",
    priorities: { c: 1, w: 1, m: 2 },
  },
  {
    id: "te2",
    title: 'Podstrona "konta"',
    channel: "Aplikacja",
    priorities: { c: 2, w: 0, m: 1 },
  },
  {
    id: "te3",
    title: 'Podstrona "karty"',
    channel: "Dokumenty",
    priorities: { c: 0, w: 0, m: 0 },
  },
];

export function AuditSummaryView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const currentAudit = mockAuditsList.find((a) => a.id === id) || mockAuditsList[0];

  return (
    <div data-testid="report-summary-view" className="w-full">
      {/* Breadcrumb & Back */}
      <nav aria-label="Ścieżka nawigacyjna" className="flex items-center text-[13px] font-medium text-slate-500 mb-3">
        <ol role="list" className="flex items-center flex-wrap gap-2 list-none m-0 p-0">
          <li>
            <button
              onClick={() => navigate("/")}
              className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Pulpit
            </button>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-slate-300 select-none font-normal" aria-hidden="true">/</span>
            <button
              onClick={() => navigate("/audyty")}
              className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Audyty
            </button>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-slate-300 select-none font-normal" aria-hidden="true">/</span>
            <span aria-current="page" className="text-slate-800 font-semibold truncate max-w-md">{currentAudit.title}</span>
          </li>
        </ol>
      </nav>

      {/* Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="success" size="md">
              <CheckCircle2 size={14} className="mr-1" /> {currentAudit.status}
            </Badge>
            <Badge variant="brand" size="md" className="font-bold uppercase tracking-wider">
              {currentAudit.clientName}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {currentAudit.title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate("/audyty")}
          >
            Powrót
          </Button>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<FileText size={16} className="text-blue-600" />}
            onClick={() => alert("Pobieranie raportu Word (.doc)")}
          >
            Pobierz Word (.doc)
          </Button>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<FileSpreadsheet size={16} className="text-emerald-600" />}
            onClick={() => alert("Pobieranie raportu Excel (.xlsx)")}
          >
            Pobierz Excel (.xlsx)
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<FileText size={16} className="text-red-500" />}
            onClick={() => alert("Pobieranie raportu PDF")}
          >
            Pobierz PDF
          </Button>
        </div>
      </div>

      {/* KARTA PODSUMOWANIA WYKONAWCZEGO I METADANYCH AUDYTU */}
      <Card className="bg-white border border-slate-200/90 rounded-card shadow-xs overflow-hidden mb-5">
        {/* Zintegrowany pasek metadanych audytu */}
        <div className="bg-slate-50/80 border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-brand-500" />
              <span>{currentAudit.startDate} — {currentAudit.endDate}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-brand-500" />
              <span>Audytor: <strong className="text-slate-800 font-bold">{currentAudit.auditor}</strong></span>
            </div>
            <div className="w-px h-3.5 bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-brand-500" />
              <span>Standard: <strong className="text-slate-800 font-bold">WCAG 2.1 Poziom {currentAudit.wcagLevel}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={12} className="text-emerald-600" />
              <span>Audyt zatwierdzony</span>
            </span>
          </div>
        </div>

        {/* Treść podsumowania audytora na czystym białym tle */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
              <FileText size={15} />
            </div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Podsumowanie audytu
            </h2>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed pl-1 sm:pl-9 font-normal">
            Audyt obejmował kluczowe ścieżki użytkownika na stronie głównej oraz w formularzach kontaktowych.
            Zidentyfikowano głównie problemy związane z niewystarczającym kontrastem elementów interaktywnych
            oraz brakiem odpowiednich etykiet dla czytników ekranu w procesie logowania. Mimo relatywnie wysokiego
            ogólnego wyniku dostępności ({currentAudit.score}%), wdrożenie rekomendacji dla błędów krytycznych (tzw. blokerów)
            jest bezwzględnie wymagane do spełnienia normy ustawowej.
          </p>
        </div>
      </Card>

      {/* RZĄD 5 KART KPI - ZGODNOŚĆ + WSZYSTKIE 3 WAGI BŁĘDÓW + KRYTERIA (PEŁEN KONTRAST WCAG AA) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-5">
        {/* 1. Dostępność */}
        <Card className="p-3.5 sm:p-4 hover:border-brand-500/30 transition-all flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-card bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/80">
            <CheckCircle2 size={22} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
              Dostępność
            </span>
            <span className="text-2xl font-black text-slate-900 leading-tight">
              {currentAudit.score}%
            </span>
          </div>
        </Card>

        {/* 2. Priorytetowe */}
        <Card className="p-3.5 sm:p-4 hover:border-red-300 transition-all flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-card bg-red-50 text-red-700 flex items-center justify-center shrink-0 border border-red-200/80">
            <AlertOctagon size={22} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
              Priorytetowe
            </span>
            <span className="text-2xl font-black text-red-700 leading-tight">
              {currentAudit.criticalErrors}
            </span>
          </div>
        </Card>

        {/* 3. Ważne */}
        <Card className="p-3.5 sm:p-4 hover:border-amber-300 transition-all flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-card bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200/80">
            <AlertTriangle size={22} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
              Ważne
            </span>
            <span className="text-2xl font-black text-amber-800 leading-tight">
              {currentAudit.brokenCriteria > 5 ? 5 : 2}
            </span>
          </div>
        </Card>

        {/* 4. Marginalne */}
        <Card className="p-3.5 sm:p-4 hover:border-blue-300 transition-all flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-card bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/80">
            <Info size={22} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
              Marginalne
            </span>
            <span className="text-2xl font-black text-blue-700 leading-tight">
              3
            </span>
          </div>
        </Card>

        {/* 5. Złamane kryteria */}
        <Card className="p-3.5 sm:p-4 hover:border-brand-500/30 transition-all flex items-center gap-3.5 col-span-2 sm:col-span-1">
          <div className="w-11 h-11 rounded-card bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200/80">
            <ListChecks size={22} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block truncate">
              Złamane kryteria
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 leading-tight">
                {currentAudit.brokenCriteria}
              </span>
              <span className="text-xs font-bold text-slate-600">
                / {currentAudit.totalCriteria}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Historia i Reaudyty (Czysta biała karta) */}
      <Card className="mb-5 p-4 sm:p-5 bg-white border border-slate-200 rounded-card shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History size={18} className="text-brand-500" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Historia i Reaudyty ({mockReaudits.length})
            </h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => alert("Zlecenie nowego reaudytu")}
          >
            Zleć reaudyt
          </Button>
        </div>

        <div className="flex flex-col gap-2.5">
          {mockReaudits.map((reaudit) => (
            <div
              key={reaudit.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/audyty/${id}/bledy`);
                }
              }}
              onClick={() => navigate(`/audyty/${id}/bledy`)}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 rounded-control p-4 shadow-sm hover:shadow-card-hover transition-shadow cursor-pointer gap-4 group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                <div className="w-10 h-10 rounded-control bg-blue-50 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                  <ClipboardCheck size={18} />
                </div>
                <div className="min-w-0 pr-4">
                  <div className="text-sm font-bold text-slate-800 leading-snug group-hover:text-brand-500 transition-colors truncate">
                    {reaudit.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1 truncate">
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar size={12} /> {reaudit.date}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <User size={12} /> {reaudit.auditor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-none">
                <div className="flex flex-col shrink-0 items-center justify-center">
                  <span className="text-micro font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Złamane Kryt.
                  </span>
                  <span className="text-base font-extrabold text-slate-700 text-center">
                    {reaudit.brokenCriteria}
                  </span>
                </div>

                <Badge
                  variant={reaudit.status === "Zakończony" ? "success" : "warning"}
                  size="sm"
                >
                  {reaudit.status}
                </Badge>

                <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-control border border-slate-100">
                  <div
                    className="relative group/tip flex items-center gap-1.5 border-r border-slate-200 pr-3 cursor-help"
                    title={`Błędy priorytetowe: ${reaudit.criticalErrors}`}
                  >
                    <AlertOctagon size={14} className="text-red-500" />
                    <span className="text-sm font-black text-slate-800">
                      {reaudit.criticalErrors}
                    </span>
                    <div
                      role="tooltip"
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                    >
                      Błędy priorytetowe: {reaudit.criticalErrors}
                      <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-micro font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
                      Zgodność:
                    </span>
                    <span
                      className={`text-sm font-black ${
                        reaudit.score >= 80 ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {reaudit.score}%
                    </span>
                  </div>
                </div>

                <ChevronRight size={18} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Przetestowane Elementy - Widok tabelaryczny z czytelnym podziałem na wagi błędów */}
      {(() => {
        const totalPriorities = mockTestedElements.reduce((acc, el) => acc + el.priorities.c, 0);
        const totalWarnings = mockTestedElements.reduce((acc, el) => acc + el.priorities.w, 0);
        const totalMarginals = mockTestedElements.reduce((acc, el) => acc + el.priorities.m, 0);

        return (
          <Card className="p-4 sm:p-5 bg-white border border-slate-200 rounded-card shadow-xs" data-testid="tested-elements-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Przetestowane Ekrany / Podstrony
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {mockTestedElements.length}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Wykaz zbadanych podstron i widoków z podziałem błędów według poziomu krytyczności
                </p>
              </div>

              {/* Legenda i łączne podsumowanie wag błędów z pełnym kontrastem WCAG AA */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto bg-slate-50 border border-slate-200 p-1.5 px-3 rounded-xl text-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mr-1 hidden sm:inline">
                  Łącznie błędów:
                </span>
                {/* Priorytetowe */}
                <div className="relative group/tip flex items-center">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs cursor-help"
                    title={`Błędy priorytetowe: ${totalPriorities}`}
                  >
                    <AlertOctagon size={13} className="text-red-700 shrink-0" />
                    <span>{totalPriorities}</span>
                    <span className="font-bold text-red-700 text-[11px] hidden sm:inline">priorytetowe</span>
                  </div>
                  <div
                    role="tooltip"
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                  >
                    Błędy priorytetowe: {totalPriorities}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>

                {/* Ważne */}
                <div className="relative group/tip flex items-center">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs cursor-help"
                    title={`Błędy ważne: ${totalWarnings}`}
                  >
                    <AlertTriangle size={13} className="text-amber-800 shrink-0" />
                    <span>{totalWarnings}</span>
                    <span className="font-bold text-amber-800 text-[11px] hidden sm:inline">ważny</span>
                  </div>
                  <div
                    role="tooltip"
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                  >
                    Błędy ważne: {totalWarnings}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>

                {/* Marginalne */}
                <div className="relative group/tip flex items-center">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs cursor-help"
                    title={`Błędy marginalne: ${totalMarginals}`}
                  >
                    <Info size={13} className="text-blue-700 shrink-0" />
                    <span>{totalMarginals}</span>
                    <span className="font-bold text-blue-700 text-[11px] hidden sm:inline">marginalne</span>
                  </div>
                  <div
                    role="tooltip"
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                  >
                    Błędy marginalne: {totalMarginals}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela elementów */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 w-[36%]">Przetestowany element / ekran</th>
                    <th className="px-3 py-3.5 text-center w-[14%]">
                      <div className="inline-flex items-center gap-1.5 text-red-700" title="Błędy o najwyższym priorytecie – blokery dostępności">
                        <AlertOctagon size={13} className="text-red-700 shrink-0" />
                        <span>Priorytetowe</span>
                      </div>
                    </th>
                    <th className="px-3 py-3.5 text-center w-[14%]">
                      <div className="inline-flex items-center gap-1.5 text-amber-800" title="Błędy o znaczącym wpływie na dostępność">
                        <AlertTriangle size={13} className="text-amber-800 shrink-0" />
                        <span>Ważne</span>
                      </div>
                    </th>
                    <th className="px-3 py-3.5 text-center w-[14%]">
                      <div className="inline-flex items-center gap-1.5 text-blue-700" title="Drobne uchybienia o charakterze marginalnym">
                        <Info size={13} className="text-blue-700 shrink-0" />
                        <span>Marginalne</span>
                      </div>
                    </th>
                    <th className="px-4 py-3.5 w-[11%]">Kanał</th>
                    <th className="px-5 py-3.5 text-right w-[11%]">Raport</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {mockTestedElements.map((el) => {
                    const ChannelIcon =
                      el.channel === "WWW"
                        ? Monitor
                        : el.channel === "Aplikacja"
                        ? Smartphone
                        : FileText;

                    return (
                      <tr
                        key={el.id}
                        data-testid="tested-element-item"
                        onClick={() => navigate(`/audyty/${id}/bledy`)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/audyty/${id}/bledy`);
                          }
                        }}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 bg-slate-100 group-hover:bg-brand-50 group-hover:text-brand-500 rounded-xl flex items-center justify-center text-slate-600 transition-colors shrink-0">
                              <Layout size={18} />
                            </div>
                            <span className="font-bold text-slate-800 text-[14px] group-hover:text-brand-500 transition-colors">
                              {el.title}
                            </span>
                          </div>
                        </td>
                        {/* Priorytetowe */}
                        <td className="px-3 py-4 text-center whitespace-nowrap">
                          <div className="relative group/tip inline-flex items-center justify-center">
                            {el.priorities.c > 0 ? (
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs cursor-help"
                                title={`Błędy priorytetowe: ${el.priorities.c}`}
                              >
                                <AlertOctagon size={13} className="text-red-700 shrink-0" />
                                <span>{el.priorities.c}</span>
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 cursor-help"
                                title="Brak błędów priorytetowych (0)"
                              >
                                0
                              </span>
                            )}
                            <div
                              role="tooltip"
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                            >
                              Błędy priorytetowe: {el.priorities.c}
                              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                            </div>
                          </div>
                        </td>

                        {/* Ważne */}
                        <td className="px-3 py-4 text-center whitespace-nowrap">
                          <div className="relative group/tip inline-flex items-center justify-center">
                            {el.priorities.w > 0 ? (
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs cursor-help"
                                title={`Błędy ważne: ${el.priorities.w}`}
                              >
                                <AlertTriangle size={13} className="text-amber-800 shrink-0" />
                                <span>{el.priorities.w}</span>
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 cursor-help"
                                title="Brak błędów ważnych (0)"
                              >
                                0
                              </span>
                            )}
                            <div
                              role="tooltip"
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                            >
                              Błędy ważne: {el.priorities.w}
                              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                            </div>
                          </div>
                        </td>

                        {/* Marginalne */}
                        <td className="px-3 py-4 text-center whitespace-nowrap">
                          <div className="relative group/tip inline-flex items-center justify-center">
                            {el.priorities.m > 0 ? (
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs cursor-help"
                                title={`Błędy marginalne: ${el.priorities.m}`}
                              >
                                <Info size={13} className="text-blue-700 shrink-0" />
                                <span>{el.priorities.m}</span>
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 cursor-help"
                                title="Brak błędów marginalnych (0)"
                              >
                                0
                              </span>
                            )}
                            <div
                              role="tooltip"
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
                            >
                              Błędy marginalne: {el.priorities.m}
                              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                            <ChannelIcon size={16} className="text-slate-400 shrink-0" />
                            <span>{el.channel}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <Button
                            variant="primary"
                            size="sm"
                            rightIcon={<ChevronRight size={14} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/audyty/${id}/bledy`);
                            }}
                          >
                            Raport
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })()}
    </div>
  );
}
