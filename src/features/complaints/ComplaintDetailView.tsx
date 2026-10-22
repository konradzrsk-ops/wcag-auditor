import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  User,
  CheckCircle2,
  FileText,
  Send,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { mockComplaints } from "../../mocks/data";
import { ComplaintStatus } from "../../types";

export function ComplaintDetailView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const complaint = mockComplaints.find((c) => c.id === id) || mockComplaints[0];

  const [currentStatus, setCurrentStatus] = useState<ComplaintStatus>(complaint.status);
  const [commentText, setCommentText] = useState("");
  const [activities, setActivities] = useState(complaint.activities);

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as ComplaintStatus);
    const newAct = {
      id: `act-${Date.now()}`,
      type: "status_change" as const,
      author: "P. Smułkowski (Koordynator)",
      createdAt: new Date().toISOString(),
      content: `Zmiana statusu na: ${newStatus}`,
      oldValue: currentStatus,
      newValue: newStatus,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newAct = {
      id: `act-${Date.now()}`,
      type: "comment" as const,
      author: "P. Smułkowski (Koordynator)",
      createdAt: new Date().toISOString(),
      content: commentText.trim(),
    };
    setActivities((prev) => [newAct, ...prev]);
    setCommentText("");
  };

  const statusOptions = [
    { value: "Nowy", label: "Nowy" },
    { value: "W analizie", label: "W analizie" },
    { value: "Rekomendacja", label: "Wystawiono rekomendację" },
    { value: "W naprawie", label: "W naprawie (developer)" },
    { value: "Weryfikacja", label: "Weryfikacja" },
    { value: "Zamknięty", label: "Zamknięty" },
  ];

  return (
    <div data-testid="complaint-detail-view" className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 w-full">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft size={16} />}
        onClick={() => navigate("/reklamacje")}
        className="mb-3 -ml-2"
      >
        Wróć do listy reklamacji
      </Button>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-badge">
              #{complaint.id}
            </span>
            <Badge
              variant={
                complaint.priority === "Krytyczny"
                  ? "danger"
                  : complaint.priority === "Ważny"
                  ? "warning"
                  : "info"
              }
              size="sm"
            >
              {complaint.priority}
            </Badge>
            <Badge variant="brand" size="sm">
              Status: {currentStatus}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {complaint.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Select
            label="Zmień status zgłoszenia"
            options={statusOptions}
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-56"
          />
        </div>
      </div>

      {/* Layout 2 kolumny */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEWA KOLUMNA: Opis, Rekomendacja ekspertów, Oś czasu */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opis problemu */}
          <Card className="p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">
              Treść zgłoszenia klienta
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
              {complaint.description}
            </p>

            {/* Załączniki */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Załączniki dowodowe ({complaint.attachments.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {complaint.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-control text-xs text-slate-700 font-semibold"
                    >
                      <FileText size={14} className="text-slate-400" />
                      <span>{att.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* KARTA REKOMENDACJI EKSPERTA WCAG */}
          {complaint.recommendation ? (
            <Card className="p-6 border-brand-200 bg-brand-50/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-brand-600">
                  <Sparkles size={20} />
                  <h2 className="text-base font-bold text-slate-900">
                    Oficjalna rekomendacja audytora WCAG
                  </h2>
                </div>
                {complaint.recommendation.estimatedFixTime && (
                  <Badge variant="brand" size="sm">
                    Czas naprawy: {complaint.recommendation.estimatedFixTime}
                  </Badge>
                )}
              </div>

              <div className="text-sm text-slate-800 leading-relaxed font-medium space-y-3">
                <div className="bg-white p-4 rounded-control border border-brand-100 font-mono text-xs text-slate-900 overflow-x-auto">
                  {complaint.recommendation.content}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between text-xs text-slate-500">
                <span>Audytor: <strong>{complaint.recommendation.author}</strong></span>
                <span>Wystawiono: {new Date(complaint.recommendation.createdAt).toLocaleDateString("pl-PL")}</span>
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-dashed border-slate-300 bg-slate-50/50 text-center">
              <Sparkles size={24} className="mx-auto text-slate-400 mb-2" />
              <h2 className="text-sm font-bold text-slate-700">Oczekiwanie na rekomendację audytora</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Nasi eksperci analizują zgłoszenie i przygotują techniczne wytyczne dla programistów wraz z fragmentem kodu.
              </p>
            </Card>
          )}

          {/* Oś czasu aktywności i komentarze */}
          <Card className="p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">
              Historia działań i dyskusja ({activities.length})
            </h2>

            {/* Formularz komentarza */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Napisz komentarz lub notatkę wewnętrzną..."
                  className="flex-1 bg-white border border-slate-200 rounded-control px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Send size={15} />}
                >
                  Dodaj
                </Button>
              </div>
            </form>

            {/* Lista zdarzeń */}
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                    {act.type === "status_change" ? (
                      <CheckCircle2 size={15} className="text-brand-500" />
                    ) : act.type === "recommendation" ? (
                      <Sparkles size={15} className="text-purple-600" />
                    ) : (
                      <MessageSquare size={15} className="text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 bg-slate-50 p-3 rounded-control border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{act.author}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(act.createdAt).toLocaleString("pl-PL")}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{act.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* PRAWA KOLUMNA: Informacje kontekstowe i powiązania */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Szczegóły zgłoszenia
            </h2>

            <div>
              <span className="text-micro font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Zgłaszający
              </span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <User size={14} className="text-slate-400" />
                <span>{complaint.reporter}</span>
              </div>
            </div>

            {complaint.assignee && (
              <div>
                <span className="text-micro font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Przypisany audytor
                </span>
                <div className="flex items-center gap-1.5 text-sm font-bold text-brand-600">
                  <ShieldCheck size={14} />
                  <span>{complaint.assignee}</span>
                </div>
              </div>
            )}

            {complaint.slaDeadline && (
              <div>
                <span className="text-micro font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Termin SLA
                </span>
                <div className="flex items-center gap-1.5 text-sm font-bold text-red-600">
                  <Clock size={14} />
                  <span>{new Date(complaint.slaDeadline).toLocaleDateString("pl-PL")} (Pilne)</span>
                </div>
              </div>
            )}

            <div>
              <span className="text-micro font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Data rejestracji
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Calendar size={13} />
                <span>{new Date(complaint.createdAt).toLocaleString("pl-PL")}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-3.5 bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
              Powiązanie w systemie
            </h2>

            <div>
              <span className="text-micro font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Usługa biznesowa
              </span>
              <span className="text-sm font-bold text-slate-800 block">
                {complaint.serviceName}
              </span>
            </div>

            {complaint.processName && (
              <div>
                <span className="text-micro font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Proces
                </span>
                <span className="text-xs font-semibold text-slate-700 block">
                  {complaint.processName}
                </span>
              </div>
            )}

            {complaint.viewName && (
              <div>
                <span className="text-micro font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Ekran / Widok
                </span>
                <span className="text-xs font-semibold text-slate-700 block">
                  {complaint.viewName}
                </span>
              </div>
            )}

            {complaint.wcagCriteria && (
              <div>
                <span className="text-micro font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Naruszone kryterium WCAG
                </span>
                <span className="text-xs font-bold text-brand-600 block">
                  {complaint.wcagCriteria}
                </span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
