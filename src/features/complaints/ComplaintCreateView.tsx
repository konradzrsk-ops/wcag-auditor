import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Check } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { mockSharedServicesData, mockComplaints } from "../../mocks/data";
import { ComplaintPriority, Complaint } from "../../types";

export function ComplaintCreateView() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ComplaintPriority>("Krytyczny");
  const [serviceId, setServiceId] = useState("s1");
  const [processName, setProcessName] = useState("");
  const [viewName, setViewName] = useState("");
  const [criteria, setCriteria] = useState("4.1.2");
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const selectedService = mockSharedServicesData.find((s) => s.id === serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) newErrors.title = "Tytuł zgłoszenia jest wymagany";
    if (!description.trim()) newErrors.description = "Szczegółowy opis jest wymagany";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newComplaint: Complaint = {
      id: `RKL-0${mockComplaints.length + 44}`,
      title: title.trim(),
      description: description.trim(),
      status: "Nowy",
      priority,
      reporter: "Piotr Smułkowski (Koordynator)",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      serviceName: selectedService ? selectedService.name : "Usługi płatnicze",
      processName: processName || undefined,
      viewName: viewName || undefined,
      wcagCriteria: criteria,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: "comment",
          author: "Piotr Smułkowski",
          createdAt: new Date().toISOString(),
          content: "Zgłoszenie utworzone w systemie przez koordynatora.",
        },
      ],
      attachments: [],
    };

    mockComplaints.unshift(newComplaint);
    alert(`Pomyślnie utworzono zgłoszenie #${newComplaint.id}!`);
    navigate("/reklamacje");
  };

  return (
    <div data-testid="complaint-create-view" className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-[1000px]">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft size={16} />}
        onClick={() => navigate("/reklamacje")}
        className="mb-4 -ml-2"
      >
        Wróć do listy reklamacji
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Rejestracja nowej reklamacji dostępności
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Wprowadź zgłoszenie otrzymane od klienta lub z systemu helpdesk. Nasi eksperci WCAG przygotują oficjalną rekomendację naprawy.
        </p>
      </div>

      <Card className="p-6 sm:p-8 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tytuł */}
          <div>
            <Input
              label="Krótki tytuł problemu *"
              placeholder="np. Brak odczytu pól formularza przez NVDA na kroku 2"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              error={errors.title}
            />
          </div>

          {/* Dwa selecty: Priorytet i Usługa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Priorytet zgłoszenia *"
              options={[
                { value: "Krytyczny", label: "🔴 Krytyczny (Bloker dla czytnika/klawiatury)" },
                { value: "Ważny", label: "🟠 Ważny (Utrudnienie w realizacji procesu)" },
                { value: "Marginalny", label: "🔵 Marginalny (Drobny błąd wizualny/kontrast)" },
              ]}
              value={priority}
              onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
            />

            <Select
              label="Dotyczy usługi biznesowej *"
              options={mockSharedServicesData.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setProcessName("");
              }}
            />
          </div>

          {/* Proces i Ekran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Konkretny proces (opcjonalnie)"
              placeholder="-- Wybierz proces --"
              options={
                selectedService
                  ? selectedService.processes.map((p) => ({
                      value: p.name,
                      label: p.name,
                    }))
                  : []
              }
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
            />

            <Input
              label="Nazwa ekranu / widoku / podstrony"
              placeholder="np. Krok 2: Dane wnioskodawcy"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
            />
          </div>

          {/* Kryterium WCAG */}
          <div>
            <Select
              label="Prawdopodobne naruszone kryterium WCAG"
              options={[
                { value: "1.1.1 Treść nietekstowa", label: "1.1.1 Treść nietekstowa (brak alt)" },
                { value: "1.3.1 Informacje i relacje", label: "1.3.1 Informacje i relacje (nagłówki, tabele)" },
                { value: "1.4.3 Kontrast (minimum)", label: "1.4.3 Kontrast (tekst nieczytelny)" },
                { value: "2.1.1 Klawiatura", label: "2.1.1 Klawiatura (brak obsługi bez myszy)" },
                { value: "2.4.7 Widoczny fokus", label: "2.4.7 Widoczny fokus (brak obramowania zaznaczenia)" },
                { value: "3.3.2 Etykiety lub instrukcje", label: "3.3.2 Etykiety pól (brak powiązania)" },
                { value: "4.1.2 Nazwa, rola, wartość", label: "4.1.2 Nazwa, rola, wartość (błędy ARIA / czytnik)" },
              ]}
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
            />
          </div>

          {/* Opis problemu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dokładny opis sytuacji przez klienta *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Wklej treść reklamacji, używane oprogramowanie wspomagające (np. NVDA 2024, JAWS, VoiceOver), przeglądarkę i dokładne kroki do odtworzenia problemu..."
              className={`w-full bg-white border rounded-control px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${
                errors.description ? "border-red-300 focus:ring-red-500/50" : "border-slate-200"
              }`}
            />
            {errors.description && (
              <span className="text-xs text-red-600 mt-1.5 block">{errors.description}</span>
            )}
          </div>

          {/* Strefa załączników */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Załączniki (zrzuty ekranu, nagrania wideo)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-control p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
              <Upload size={24} className="mx-auto text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-700 block">
                Przeciągnij pliki tutaj lub kliknij, aby wybrać z dysku
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Obsługiwane formaty: PNG, JPG, MP4, PDF (maks. 25 MB)
              </span>
            </div>
          </div>

          {/* Przyciski akcji */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate("/reklamacje")}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Check size={16} />}
            >
              Zarejestruj ticket
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
