import React, { useState, useRef, useEffect } from "react";
import {
  Building2,
  ShieldCheck,
  User,
  Users,
  Bell,
  Upload,
  Globe,
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Sparkles,
  Landmark,
  ArrowLeft,
  ArrowRight,
  AlertOctagon,
  MessageSquareText,
  Key,
  Lock,
  Mail,
  Phone,
  FileText,
  HelpCircle,
  ExternalLink,
  Plus,
  UserPlus,
  Edit3,
  Search,
  Check,
  X,
  Camera,
  Layers,
  ArrowUp,
  ArrowDown,
  ListOrdered,
} from "lucide-react";
import { ClientProfile, TeamMember, ComplaintProcessStep } from "../../types";

interface UserProfileViewProps {
  setView: (view: string) => void;
  clientProfile: ClientProfile;
  setClientProfile: React.Dispatch<React.SetStateAction<ClientProfile>>;
  showToast?: (
    title: string,
    text: string,
    type?: "success" | "info" | "warning" | "danger"
  ) => void;
  initialTab?: "branding" | "team" | "wcag" | "account" | "notifications" | "complaints";
  onViewMemberErrors?: (member: TeamMember) => void;
  onViewMemberTickets?: (member: TeamMember) => void;
  onViewPersonProfile?: (person: any) => void;
}

// Domyślna procedura rozpatrywania skargi WCAG w organizacji
export const DEFAULT_COMPLAINT_PROCESS_STEPS: ComplaintProcessStep[] = [
  {
    id: "step-1",
    stepNumber: 1,
    title: "Rejestracja skargi i wstępna weryfikacja",
    description: "Wprowadzenie zgłoszenia klienta, mapowanie na usługę cyfrową i proces biznesowy z Bazy Usług oraz wskazanie naruszonych kryteriów WCAG.",
    responsibleRole: "Koordynator Dostępności",
  },
  {
    id: "step-2",
    stepNumber: 2,
    title: "Analiza ekspercka i diagnoza audytora",
    description: "Audytor WCAG bada zachowanie kodu, testuje z czytnikami ekranu (NVDA/JAWS/VoiceOver) i formułuje oficjalną rekomendację naprawczą.",
    responsibleRole: "Certyfikowany Audytor WCAG",
  },
  {
    id: "step-3",
    stepNumber: 3,
    title: "Przekazanie do zespołu technicznego i wdrożenie poprawki",
    description: "Koordynator podpina zadanie w Jira i wyznacza programistę. Deweloper wdraża poprawkę semantyczną i wskaźnik fokusu.",
    responsibleRole: "Lead Developer / Zespół Frontend",
  },
  {
    id: "step-4",
    stepNumber: 4,
    title: "Weryfikacja powdrożeniowa (Re-audyt)",
    description: "Oficjalny re-audyt przeprowadzony przez audytora potwierdzający usunięcie bariery i zgodność z kryterium sukcesu WCAG.",
    responsibleRole: "Audytor WCAG & QA",
  },
  {
    id: "step-5",
    stepNumber: 5,
    title: "Zamknięcie zgłoszenia i odpowiedź dla klienta",
    description: "Formalne poinformowanie klienta o sposobie rozwiązania, zaktualizowanie Deklaracji Dostępności banku oraz wpis do Rejestru Skarg.",
    responsibleRole: "Koordynator Dostępności / Dział Prawny",
  },
];

// Domyślny zespół deweloperów i testerów organizacji
const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "Marek Kowalski",
    email: "m.kowalski@erstegroup.com",
    role: "Lead Frontend Developer (React / Next.js)",
    specialization: "frontend",
    specializationLabel: "Frontend WWW",
    assignedServices: ["Serwis transakcyjny", "Portal informacyjny", "Kalkulator kredytowy"],
    status: "active",
    openErrorsCount: 12,
    resolvedErrorsCount: 28,
    assignedTicketsCount: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marek&backgroundColor=b6e3f4",
    phone: "+48 501 112 233",
  },
  {
    id: "tm-2",
    name: "Aleksandra Nowak",
    email: "a.nowak@erstegroup.com",
    role: "Senior iOS Developer (Swift)",
    specialization: "mobile",
    specializationLabel: "Aplikacja iOS",
    assignedServices: ["Aplikacja mobilna iOS", "Moduł BLIK"],
    status: "active",
    openErrorsCount: 6,
    resolvedErrorsCount: 19,
    assignedTicketsCount: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ola&backgroundColor=ffdfbf",
    phone: "+48 502 223 344",
  },
  {
    id: "tm-3",
    name: "Paweł Wiśniewski",
    email: "p.wisniewski@erstegroup.com",
    role: "Senior Android Developer (Kotlin)",
    specialization: "mobile",
    specializationLabel: "Aplikacja Android",
    assignedServices: ["Aplikacja mobilna Android", "Autoryzacja mobilna"],
    status: "active",
    openErrorsCount: 8,
    resolvedErrorsCount: 14,
    assignedTicketsCount: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pawel&backgroundColor=d1d4f9",
    phone: "+48 503 334 455",
  },
  {
    id: "tm-4",
    name: "Magdalena Ciesielska",
    email: "m.ciesielska@erstegroup.com",
    role: "QA Accessibility Specialist / Tester",
    specialization: "qa",
    specializationLabel: "Dostępność QA (NVDA/TalkBack)",
    assignedServices: ["Wszystkie serwisy", "Formularze wnioskowe"],
    status: "active",
    openErrorsCount: 3,
    resolvedErrorsCount: 42,
    assignedTicketsCount: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Magda&backgroundColor=ffd5dc",
    phone: "+48 504 445 566",
  },
  {
    id: "tm-5",
    name: "Kamil Bednarek",
    email: "k.bednarek@erstegroup.com",
    role: "Senior UI/UX Designer (Design System)",
    specialization: "design",
    specializationLabel: "Design System & Kontrasty",
    assignedServices: ["Komponenty UI", "Tokeny kolorów", "Formularze"],
    status: "active",
    openErrorsCount: 5,
    resolvedErrorsCount: 21,
    assignedTicketsCount: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamil&backgroundColor=c0aede",
    phone: "+48 505 556 677",
  },
];

export function UserProfileView({
  setView,
  clientProfile,
  setClientProfile,
  showToast,
  initialTab,
  onViewMemberErrors,
  onViewMemberTickets,
  onViewPersonProfile,
}: UserProfileViewProps) {
  const [activeTab, setActiveTab] = useState<
    "branding" | "team" | "wcag" | "account" | "notifications" | "complaints"
  >(initialTab || "account");

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Kopia robocza formularza z gwarancją obecności zespołu i procedury skarg
  const [formData, setFormData] = useState<ClientProfile>({
    ...clientProfile,
    teamMembers:
      clientProfile.teamMembers && clientProfile.teamMembers.length > 0
        ? clientProfile.teamMembers
        : DEFAULT_TEAM_MEMBERS,
    complaintProcessSteps:
      clientProfile.complaintProcessSteps && clientProfile.complaintProcessSteps.length > 0
        ? clientProfile.complaintProcessSteps
        : DEFAULT_COMPLAINT_PROCESS_STEPS,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [previewBgDark, setPreviewBgDark] = useState(false);

  // Referencje do ukrytych inputów plików
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Stan dla modułu Zespołu
  const [teamSearch, setTeamSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Formularz nowego / edytowanego członka zespołu
  const [memberForm, setMemberForm] = useState<{
    name: string;
    email: string;
    phone: string;
    role: string;
    specialization: TeamMember["specialization"];
    assignedServicesText: string;
  }>({
    name: "",
    email: "",
    phone: "",
    role: "",
    specialization: "frontend",
    assignedServicesText: "Serwis WWW, Formularze",
  });

  // Zmiana pojedynczego pola w profilu
  const handleChange = <K extends keyof ClientProfile>(
    field: K,
    value: ClientProfile[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Obsługa edycji i zarządzania krokami procedury skarg (indywidualne dla każdego banku)
  const handleUpdateStep = (id: string, updates: Partial<ComplaintProcessStep>) => {
    setFormData((prev) => ({
      ...prev,
      complaintProcessSteps: (prev.complaintProcessSteps || DEFAULT_COMPLAINT_PROCESS_STEPS).map(
        (step) => (step.id === id ? { ...step, ...updates } : step)
      ),
    }));
    setHasChanges(true);
  };

  const handleAddStep = () => {
    const currentSteps = formData.complaintProcessSteps || DEFAULT_COMPLAINT_PROCESS_STEPS;
    const newStepNumber = currentSteps.length + 1;
    const newStep: ComplaintProcessStep = {
      id: "step-" + Date.now(),
      stepNumber: newStepNumber,
      title: `Nowy etap procedury #${newStepNumber}`,
      description: "Opisz wymagane działania, weryfikację lub formalności w tym kroku...",
      responsibleRole: "Koordynator Dostępności",
    };
    setFormData((prev) => ({
      ...prev,
      complaintProcessSteps: [...currentSteps, newStep],
    }));
    setHasChanges(true);
  };

  const handleRemoveStep = (id: string) => {
    const currentSteps = formData.complaintProcessSteps || DEFAULT_COMPLAINT_PROCESS_STEPS;
    if (currentSteps.length <= 1) {
      if (showToast) {
        showToast("Nie można usunąć", "Procedura musi zawierać co najmniej jeden krok.", "warning");
      }
      return;
    }
    const filtered = currentSteps.filter((s) => s.id !== id);
    const renumbered = filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setFormData((prev) => ({
      ...prev,
      complaintProcessSteps: renumbered,
    }));
    setHasChanges(true);
  };

  const handleMoveStep = (id: string, direction: "up" | "down") => {
    const currentSteps = [...(formData.complaintProcessSteps || DEFAULT_COMPLAINT_PROCESS_STEPS)];
    const index = currentSteps.findIndex((s) => s.id === id);
    if (index === -1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSteps.length) return;

    const temp = currentSteps[index];
    currentSteps[index] = currentSteps[targetIndex];
    currentSteps[targetIndex] = temp;

    const renumbered = currentSteps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setFormData((prev) => ({
      ...prev,
      complaintProcessSteps: renumbered,
    }));
    setHasChanges(true);
  };

  const handleResetSteps = () => {
    setFormData((prev) => ({
      ...prev,
      complaintProcessSteps: DEFAULT_COMPLAINT_PROCESS_STEPS,
    }));
    setHasChanges(true);
    if (showToast) {
      showToast("Przywrócono domyślne", "Kroki procedury skarg zostały zresetowane do standardu banku.", "info");
    }
  };

  // Obsługa wgrania pliku logo z dysku komputera
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      if (showToast) {
        showToast(
          "Nieprawidłowy format",
          "Wybierz plik graficzny (PNG, SVG, JPG lub WebP).",
          "danger"
        );
      }
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      if (showToast) {
        showToast(
          "Plik jest za duży",
          "Maksymalny rozmiar logo to 2 MB.",
          "warning"
        );
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({
          ...prev,
          orgLogo: dataUrl,
          orgAltText: prev.orgAltText || `Logo ${prev.orgName}`,
        }));
        setHasChanges(true);
        if (showToast) {
          showToast(
            "Logo wczytane z dysku",
            "Plik graficzny został wczytany. Zapisz profil, aby zastosować.",
            "info"
          );
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Obsługa wgrania zdjęcia awatara z dysku komputera
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      if (showToast) {
        showToast(
          "Nieprawidłowy format",
          "Wybierz plik graficzny (PNG, JPG lub WebP).",
          "danger"
        );
      }
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      if (showToast) {
        showToast(
          "Plik jest za duży",
          "Maksymalny rozmiar zdjęcia to 3 MB.",
          "warning"
        );
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({
          ...prev,
          userAvatar: dataUrl,
        }));
        setHasChanges(true);
        if (showToast) {
          showToast(
            "Zdjęcie awatara wczytane",
            "Twoje zdjęcie profilowe zostało wczytane z dysku.",
            "success"
          );
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Zapis zmian w profilu
  const handleSave = (andNavigateHome: boolean = false) => {
    setClientProfile(formData);
    try {
      localStorage.setItem(
        "wcag_auditor_client_profile",
        JSON.stringify(formData)
      );
    } catch {
      // ignore storage errors
    }
    setHasChanges(false);

    if (showToast) {
      showToast(
        "Zapisano zmiany w profilu",
        `Logo, dane zespołu (${formData.teamMembers?.length || 0} osób) oraz konfiguracja zostały zaktualizowane.`,
        "success"
      );
    }

    if (andNavigateHome) {
      setView("przeglad");
    }
  };

  // Reset do obecnego stanu profilu
  const handleReset = () => {
    setFormData({ ...clientProfile });
    setHasChanges(false);
    if (showToast) {
      showToast("Cofnięto", "Przywrócono poprzednio zapisane wartości.", "info");
    }
  };

  // Otwarcie modalu dodawania nowego członka
  const openAddMemberModal = () => {
    setEditingMember(null);
    setMemberForm({
      name: "",
      email: "",
      phone: "",
      role: "Frontend Developer (React)",
      specialization: "frontend",
      assignedServicesText: "Serwis transakcyjny, Portal WWW",
    });
    setIsMemberModalOpen(true);
  };

  // Otwarcie modalu edycji istniejącego członka
  const openEditMemberModal = (member: TeamMember) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      role: member.role,
      specialization: member.specialization,
      assignedServicesText: member.assignedServices.join(", "),
    });
    setIsMemberModalOpen(true);
  };

  // Zapis członka zespołu (dodanie lub aktualizacja)
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.email.trim()) {
      if (showToast) {
        showToast("Błąd", "Podaj imię, nazwisko oraz adres e-mail.", "danger");
      }
      return;
    }

    const assignedServices = memberForm.assignedServicesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const specLabels: Record<TeamMember["specialization"], string> = {
      frontend: "Frontend WWW",
      mobile: "Aplikacje mobilne",
      backend: "Backend & API",
      qa: "Dostępność QA",
      design: "Design System & UX",
      other: "Inne",
    };

    if (editingMember) {
      // Aktualizacja
      const updatedList = (formData.teamMembers || []).map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: memberForm.name,
              email: memberForm.email,
              phone: memberForm.phone,
              role: memberForm.role,
              specialization: memberForm.specialization,
              specializationLabel: specLabels[memberForm.specialization],
              assignedServices: assignedServices.length > 0 ? assignedServices : ["Wszystkie serwisy"],
            }
          : m
      );
      setFormData((prev) => ({ ...prev, teamMembers: updatedList }));
      setHasChanges(true);
      if (showToast) {
        showToast("Zaktualizowano", `Zaktualizowano dane dla: ${memberForm.name}`, "info");
      }
    } else {
      // Nowy członek
      const newMember: TeamMember = {
        id: `tm-${Date.now()}`,
        name: memberForm.name,
        email: memberForm.email,
        phone: memberForm.phone,
        role: memberForm.role,
        specialization: memberForm.specialization,
        specializationLabel: specLabels[memberForm.specialization],
        assignedServices: assignedServices.length > 0 ? assignedServices : ["Serwis transakcyjny"],
        status: "active",
        openErrorsCount: 0,
        resolvedErrorsCount: 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          memberForm.name
        )}&backgroundColor=b6e3f4`,
      };

      setFormData((prev) => ({
        ...prev,
        teamMembers: [newMember, ...(prev.teamMembers || [])],
      }));
      setHasChanges(true);
      if (showToast) {
        showToast("Dodano do zespołu", `Dodano nowego członka: ${memberForm.name}`, "success");
      }
    }

    setIsMemberModalOpen(false);
  };

  // Usunięcie członka zespołu
  const handleDeleteMember = (memberId: string, memberName: string) => {
    if (confirm(`Czy na pewno chcesz usunąć użytkownika ${memberName} z zespołu dostępności?`)) {
      const updatedList = (formData.teamMembers || []).filter((m) => m.id !== memberId);
      setFormData((prev) => ({ ...prev, teamMembers: updatedList }));
      setHasChanges(true);
      if (showToast) {
        showToast("Usunięto z zespołu", `Użytkownik ${memberName} został usunięty.`, "info");
      }
    }
  };

  // Filtrowanie listy zespołu
  const filteredTeam = (formData.teamMembers || []).filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(teamSearch.toLowerCase()) ||
      member.role.toLowerCase().includes(teamSearch.toLowerCase());

    const matchesSpecialization =
      teamFilter === "all" || member.specialization === teamFilter;

    return matchesSearch && matchesSpecialization;
  });

  const totalOpenErrorsInTeam = (formData.teamMembers || []).reduce(
    (acc, m) => acc + (m.openErrorsCount || 0),
    0
  );
  const totalResolvedErrorsInTeam = (formData.teamMembers || []).reduce(
    (acc, m) => acc + (m.resolvedErrorsCount || 0),
    0
  );

  return (
    <div
      data-testid="user-profile-view"
      className="flex-1 flex flex-col md:h-full w-full md:overflow-hidden bg-[#f8fafc]"
    >
      {/* NAGŁÓWEK WIDOKU */}
      <div className="w-full bg-white z-20 flex-shrink-0 border-b border-slate-200 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6">
          {/* Breadcrumbs */}
          <nav
            aria-label="Ścieżka nawigacyjna"
            className="flex items-center text-[13px] font-medium text-slate-500 mb-2"
          >
            <ol
              role="list"
              className="flex items-center flex-wrap gap-2 list-none m-0 p-0"
            >
              <li>
                <button
                  type="button"
                  onClick={() => setView("przeglad")}
                  className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Pulpit
                </button>
              </li>
              <li className="text-slate-300 select-none">/</li>
              <li aria-current="page" className="text-slate-800 font-semibold">
                Zarządzanie kontem i organizacją
              </li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038F8] border border-blue-200/70 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 size={24} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[24px] sm:text-[30px] font-extrabold text-slate-900 tracking-tight leading-tight">
                    Zarządzanie kontem i organizacją
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0038F8] border border-blue-200">
                    <Landmark size={12} />
                    {formData.orgShortName || formData.orgName}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                  Zarządzaj logo klienta, tożsamością instytucji, zespołem deweloperów usuwających błędy WCAG oraz kontem koordynatora.
                </p>
              </div>
            </div>

            {/* Akcje nagłówka */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setView("przeglad")}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Wróć do pulpitu</span>
              </button>
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={!hasChanges}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-all cursor-pointer ${
                  hasChanges
                    ? "bg-[#0038F8] hover:bg-[#002ECC] text-white ring-2 ring-[#0038F8]/30"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                <Save size={16} />
                <span>Zapisz zmiany</span>
              </button>
            </div>
          </div>

          {/* PASEK ZAKŁADEK */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-200 -mb-4 sm:-mb-6 overflow-x-auto scrollbar-hide">
            <button
              type="button"
              onClick={() => setActiveTab("branding")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "branding"
                  ? "border-[#0038F8] text-[#0038F8]"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Building2 size={16} />
              <span>Logo organizacji</span>
            </button>

            {/* ZAKŁADKA: MÓJ ZESPÓŁ */}
            <button
              type="button"
              onClick={() => setActiveTab("team")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "team"
                  ? "border-[#0038F8] text-[#0038F8]"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Users size={16} />
              <span>Mój zespół</span>
              <span className="ml-1 px-2 py-0.2 rounded-full text-[11px] font-extrabold bg-blue-100 text-[#0038F8]">
                {formData.teamMembers?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("wcag")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "wcag"
                  ? "border-[#0038F8] text-[#0038F8]"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <ShieldCheck size={16} />
              <span>Standard WCAG</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "account"
                  ? "border-[#0038F8] text-[#0038F8]"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <User size={16} />
              <span>Moje konto</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "notifications"
                  ? "border-[#0038F8] text-[#0038F8]"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Bell size={16} />
              <span>Powiadomienia</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("complaints")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "complaints"
                  ? "border-[#0038F8] text-[#0038F8]"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <ListOrdered size={16} />
              <span>Procedura skarg</span>
              <span className="ml-1 px-2 py-0.2 rounded-full text-[11px] font-extrabold bg-blue-100 text-[#0038F8]">
                {formData.complaintProcessSteps?.length || 5}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ZAWARTOŚĆ GŁÓWNA */}
      <div className="flex-1 md:overflow-y-auto w-full">
        <div className="max-w-[1600px] mx-auto w-full p-4 sm:p-8 lg:p-12 flex flex-col gap-6">
          {/* BANER NIEZAPISANYCH ZMIAN */}
          {hasChanges && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 shadow-xs animate-fadeIn">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    Masz niezapisane zmiany w profilu organizacji
                  </p>
                  <p className="text-[11px] text-amber-700">
                    Zapisz zmiany, aby nowe logo, dane zespołu i parametry pojawiły się na pulpicie.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#0038F8] hover:bg-[#002ECC] rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Zapisz teraz
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ZAKŁADKA 1: BRANDING & LOGO KLIENTA                      */}
          {/* ======================================================== */}
          {activeTab === "branding" && (
            <div className="space-y-6">
              {/* GŁÓWNA SEKCJA ZARZĄDZANIA LOGO */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEWA KOLUMNA: EDYCJA I WGRANIE LOGO (7 kolumn) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                          <Upload size={18} className="text-[#0038F8]" />
                          Ustawienie Logo Klienta
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Logo jest wyświetlane w naturalnych proporcjach, bez zaokrąglania narożników ani przycinania.
                        </p>
                      </div>

                      {formData.orgLogo && (
                        <button
                          type="button"
                          onClick={() => {
                            handleChange("orgLogo", "");
                            handleChange("orgAltText", "");
                          }}
                          className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Usuń logo"
                        >
                          <Trash2 size={13} />
                          <span>Usuń</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* SPOSÓB 1: Wgranie pliku z dysku */}
                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1.5">
                          Wgraj plik logo z dysku komputera (Zalecane)
                        </span>
                        <input
                          type="file"
                          ref={logoFileInputRef}
                          onChange={handleLogoUpload}
                          accept="image/png,image/svg+xml,image/jpeg,image/webp"
                          className="hidden"
                        />
                        <div
                          onClick={() => logoFileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 hover:border-[#0038F8] bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                        >
                          <div className="w-12 h-12 mx-auto rounded-xl bg-white group-hover:bg-[#0038F8] text-slate-500 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs mb-2.5">
                            <Upload size={22} />
                          </div>
                          <span className="text-sm font-bold text-slate-900 group-hover:text-[#0038F8] block">
                            Kliknij, aby wybrać plik logo z dysku
                          </span>
                          <span className="text-xs text-slate-500 mt-1 block">
                            PNG, SVG, JPG lub WebP (maksymalnie 2 MB)
                          </span>
                        </div>
                      </div>

                      {/* SPOSÓB 2: Wklejenie adresu URL */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          LUB podaj bezpośredni adres URL logo
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={formData.orgLogo}
                            onChange={(e) =>
                              handleChange("orgLogo", e.target.value)
                            }
                            placeholder="https://twojadomena.pl/logo.png"
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleChange(
                                "orgLogo",
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHgYtVh9h9eIsSNsP76-1aodQJJzy5gNNVXR6n_oyQ0g&s"
                              )
                            }
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                            title="Wstaw domyślne logo Erste"
                          >
                            Logo Erste
                          </button>
                        </div>
                      </div>

                      {/* WCAG 1.1.1: Tekst alternatywny dla logo */}
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <label className="text-xs font-bold text-slate-700">
                            Tekst alternatywny dla logo (alt text)
                          </label>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-blue-100 text-[#0038F8]">
                            WCAG 1.1.1
                          </span>
                        </div>
                        <input
                          type="text"
                          value={formData.orgAltText}
                          onChange={(e) =>
                            handleChange("orgAltText", e.target.value)
                          }
                          placeholder="np. Logo Erste Group Bank"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                        />
                        <p className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                          <HelpCircle size={13} className="text-[#0038F8] shrink-0 mt-0.5" />
                          <span>
                            <strong>Wymóg dostępności WCAG 2.1 AA:</strong> Tekst
                            odczytywany przez czytniki ekranu dla osób
                            niewidomych. Powinien zawierać nazwę instytucji bez
                            słów typu "obrazek" lub "grafika".
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRAWA KOLUMNA: DANE IDENTYFIKACYJNE FIRMY (5 kolumn) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* KARTA PODGLĄDU LOGO I KONTRASTU - BEZ ZAOKRĄGLEŃ NA OBRAZIE */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                        Podgląd Logo (Brak zaokrągleń)
                      </h4>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewBgDark(false)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            !previewBgDark
                              ? "bg-slate-200 text-slate-900"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          Jasne tło
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewBgDark(true)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            previewBgDark
                              ? "bg-slate-800 text-white"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          Ciemne tło
                        </button>
                      </div>
                    </div>

                    <div
                      className={`h-36 rounded-xl flex items-center justify-center p-4 border transition-colors ${
                        previewBgDark
                          ? "bg-slate-900 border-slate-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                    >
                      {formData.orgLogo ? (
                        <img
                          src={formData.orgLogo}
                          alt={formData.orgAltText || formData.orgName}
                          className="max-h-24 w-auto max-w-[220px] object-contain drop-shadow-xs block"
                          style={{ borderRadius: 0 }}
                          onError={(e) => {
                            if (e.currentTarget.src !== "./logos/erste.png") {
                              e.currentTarget.src = "./logos/erste.png";
                            }
                          }}
                        />
                      ) : (
                        <div className="text-center text-slate-400">
                          <Building2 size={36} className="mx-auto mb-1 opacity-50" />
                          <span className="text-xs font-bold block">Brak logo</span>
                          <span className="text-[10px]">
                            Wklej URL lub wybierz plik z dysku
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        Oryginalne proporcje bez przycinania
                      </span>
                      <span className="font-semibold text-slate-700">
                        Status: Aktywne
                      </span>
                    </div>
                  </div>

                  {/* FORMULARZ DANYCH FIRMY */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                      Dane Identyfikacyjne Instytucji
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pełna nazwa prawna organizacji
                      </label>
                      <input
                        type="text"
                        value={formData.orgName}
                        onChange={(e) =>
                          handleChange("orgName", e.target.value)
                        }
                        placeholder="np. Erste Group Bank AG"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nazwa skrócona
                        </label>
                        <input
                          type="text"
                          value={formData.orgShortName}
                          onChange={(e) =>
                            handleChange("orgShortName", e.target.value)
                          }
                          placeholder="np. Erste"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          NIP / Identyfikator
                        </label>
                        <input
                          type="text"
                          value={formData.taxId}
                          onChange={(e) =>
                            handleChange("taxId", e.target.value)
                          }
                          placeholder="PL 000-00-00-000"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sektor / Branża
                      </label>
                      <select
                        value={formData.sector}
                        onChange={(e) =>
                          handleChange("sector", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                      >
                        <option value="Bankowość i finanse">
                          Bankowość i finanse
                        </option>
                        <option value="Sektor publiczny - Administracja Rządowa">
                          Sektor publiczny - Administracja Rządowa
                        </option>
                        <option value="Sektor publiczny - Samorząd terytorialny">
                          Sektor publiczny - Samorząd terytorialny
                        </option>
                        <option value="E-commerce i Retail">
                          E-commerce i Retail
                        </option>
                        <option value="Ochrona zdrowia i Farmacja">
                          Ochrona zdrowia i Farmacja
                        </option>
                        <option value="Telekomunikacja i IT">
                          Telekomunikacja i IT
                        </option>
                        <option value="Ubezpieczenia">Ubezpieczenia</option>
                        <option value="Inne">Inne</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Główna domena WWW
                      </label>
                      <input
                        type="url"
                        value={formData.domain}
                        onChange={(e) =>
                          handleChange("domain", e.target.value)
                        }
                        placeholder="https://www.erstegroup.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ZAKŁADKA 2: MÓJ ZESPÓŁ & DEWELOPERZY (NOWA SEKCJA)       */}
          {/* ======================================================== */}
          {activeTab === "team" && (
            <div className="space-y-6">
              {/* BANER STATYSTYK ZESPOŁU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Członkowie zespołu
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-0.5 block">
                      {formData.teamMembers?.length || 0} osób
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold">
                      Aktywni wykonawcy
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0038F8] flex items-center justify-center shrink-0">
                    <Users size={22} />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Otwarte błędy zespołu
                    </span>
                    <span className="text-2xl font-black text-red-600 mt-0.5 block">
                      {totalOpenErrorsInTeam}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      W trakcie poprawy
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <AlertCircle size={22} />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Rozwiązane zadania
                    </span>
                    <span className="text-2xl font-black text-emerald-600 mt-0.5 block">
                      {totalResolvedErrorsInTeam}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      Zatwierdzone fixy
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={22} />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Pokrycie kanałów
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-0.5 block">
                      WWW + Mobile
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      iOS, Android, React
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Layers size={22} />
                  </div>
                </div>
              </div>

              {/* PASEK ZARZĄDZANIA: WYSZUKIWARKA, FILTRY I PRZYCISK DODAWANIA */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                  {/* Wyszukiwarka */}
                  <div className="relative flex-1 max-w-md">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                      placeholder="Szukaj dewelopera po imieniu, e-mailu lub roli..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:bg-white"
                    />
                  </div>

                  {/* Filtry ról */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                    {[
                      { id: "all", label: "Wszyscy" },
                      { id: "frontend", label: "Frontend" },
                      { id: "mobile", label: "Mobile" },
                      { id: "qa", label: "QA / Testy" },
                      { id: "design", label: "Design" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setTeamFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          teamFilter === f.id
                            ? "bg-[#0038F8] text-white shadow-2xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Przycisk dodania nowego członka */}
                <button
                  type="button"
                  onClick={openAddMemberModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <UserPlus size={16} />
                  <span>Dodaj członka zespołu</span>
                </button>
              </div>

              {/* LISTA KART CZŁONKÓW ZESPOŁU */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredTeam.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#0038F8]/40 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Nagłówek karty usera */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div
                          className="flex items-center gap-3 min-w-0 cursor-pointer group/title"
                          onClick={() => {
                            if (onViewPersonProfile) {
                              onViewPersonProfile(member);
                            }
                          }}
                          title={`Zobacz profil: ${member.name}`}
                        >
                          <img
                            src={member.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                            alt={member.name}
                            className="w-12 h-12 rounded-full border-2 border-slate-200 object-cover shrink-0 group-hover/title:ring-2 group-hover/title:ring-[#0038F8]"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-extrabold text-slate-900 group-hover/title:text-[#0038F8] transition-colors truncate flex items-center gap-1.5">
                              <span>{member.name}</span>
                              <ExternalLink size={12} className="text-slate-400 group-hover/title:text-[#0038F8] shrink-0" />
                            </h4>
                            <p className="text-xs text-slate-500 font-medium truncate">
                              {member.role}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                            member.specialization === "frontend"
                              ? "bg-blue-50 text-[#0038F8] border border-blue-200"
                              : member.specialization === "mobile"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : member.specialization === "qa"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {member.specializationLabel}
                        </span>
                      </div>

                      {/* Kontakt */}
                      <div className="space-y-1 text-xs text-slate-600 mb-4 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-slate-400 shrink-0" />
                          <a
                            href={`mailto:${member.email}`}
                            className="hover:text-[#0038F8] truncate"
                          >
                            {member.email}
                          </a>
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={13} className="text-slate-400 shrink-0" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Przypisane serwisy */}
                      <div className="mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                          Przypisane serwisy:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {member.assignedServices.map((srv, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200/80"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Statystyki błędów, tickety i akcje koordynatora */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
                        {/* PRZEJŚCIE DO ODFILTROWANYCH BŁĘDÓW DEWELOPERA */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewMemberErrors) {
                              onViewMemberErrors(member);
                            } else {
                              setView("raport-bledy");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100/90 text-red-700 border border-red-200/80 font-bold transition-all cursor-pointer group shadow-2xs"
                          title={`Przejdź do listy błędów przypisanych do dewelopera: ${member.name}`}
                        >
                          <AlertOctagon size={12} className="text-red-600 group-hover:scale-110 transition-transform" />
                          <span>{member.openErrorsCount} otwartych</span>
                          <ArrowRight size={11} className="text-red-400 group-hover:text-red-700 group-hover:translate-x-0.5 transition-all" />
                        </button>

                        {/* PRZEJŚCIE DO ODFILTROWANYCH TICKETÓW DEWELOPERA */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewMemberTickets) {
                              onViewMemberTickets(member);
                            } else {
                              setView("tickety");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100/90 text-[#0038F8] border border-blue-200/80 font-bold transition-all cursor-pointer group shadow-2xs"
                          title={`Przejdź do konsultacji i ticketów dla: ${member.name}`}
                        >
                          <MessageSquareText size={12} className="text-[#0038F8] group-hover:scale-110 transition-transform" />
                          <span>{member.assignedTicketsCount || 2} tickety</span>
                          <ArrowRight size={11} className="text-blue-400 group-hover:text-[#0038F8] group-hover:translate-x-0.5 transition-all" />
                        </button>

                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs px-1 py-1" title="Liczba naprawionych błędów">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          {member.resolvedErrorsCount} fixów
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewPersonProfile) {
                              onViewPersonProfile(member);
                            }
                          }}
                          className="p-1.5 hover:bg-blue-50 text-slate-500 hover:text-[#0038F8] rounded-lg transition-colors cursor-pointer"
                          title="Zobacz pełny profil osoby"
                        >
                          <User size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditMemberModal(member)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-[#0038F8] rounded-lg transition-colors cursor-pointer"
                          title="Edytuj dane dewelopera"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Usuń z zespołu"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTeam.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                  <Users size={36} className="text-slate-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-700">
                    Nie znaleziono deweloperów spełniających kryteria
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Zmień filtry lub dodaj nowego członka zespołu.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* ZAKŁADKA 3: STANDARDY WCAG & KOORDYNACJA                 */}
          {/* ======================================================== */}
          {activeTab === "wcag" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#0038F8]" />
                      Referencyjne Standardy Dostępności Cyfrowej
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Wybierz standard, według którego audytorzy W-ally weryfikują serwisy Twojej organizacji.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: "WCAG 2.1 AA",
                        name: "WCAG 2.1 Poziom AA (Standard Prawny)",
                        desc: "Wymóg Ustawy o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych (Dz.U. 2019 poz. 848) oraz standard rynkowy w Polsce.",
                        badge: "Zalecany",
                      },
                      {
                        id: "WCAG 2.2 AA",
                        name: "WCAG 2.2 Poziom AA (Najnowszy standard W3C)",
                        desc: "Zawiera 9 nowych kryteriów sukcesu, m.in. Focus Not Obscured, Dragging Movements, Target Size (Minimum) oraz Redundant Entry.",
                        badge: "Nowość",
                      },
                      {
                        id: "EAA 2025",
                        name: "EAA 2025 (Europejski Akt o Dostępności)",
                        desc: "Dyrektywa (UE) 2019/882 obowiązująca sektor bankowy, handel elektroniczny, usługi transportowe i telekomunikacyjne od 28 czerwca 2025 r.",
                        badge: "Biznes",
                      },
                    ].map((std) => {
                      const isSelected = formData.wcagStandard === std.id;
                      return (
                        <div
                          key={std.id}
                          onClick={() => handleChange("wcagStandard", std.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? "bg-blue-50/60 border-[#0038F8] ring-1 ring-[#0038F8]/30 shadow-xs"
                              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                              isSelected
                                ? "border-[#0038F8] bg-[#0038F8]"
                                : "border-slate-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                {std.name}
                              </h4>
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.2 rounded ${
                                  isSelected
                                    ? "bg-[#0038F8] text-white"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {std.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {std.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* CEL DOSTĘPNOŚCI W ORGANIZACJI */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="text-xs font-bold text-slate-800">
                          Strategiczny cel zgodności organizacji:
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Wyświetlany na karcie głównego KPI na pulpicie.
                        </p>
                      </div>
                      <span className="text-xl font-extrabold text-[#0038F8]">
                        {formData.targetScore}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="70"
                      max="100"
                      step="1"
                      value={formData.targetScore}
                      onChange={(e) =>
                        handleChange("targetScore", parseInt(e.target.value, 10))
                      }
                      className="w-full accent-[#0038F8] cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                      <span>70% (Minimum)</span>
                      <span>85% (Dobra dojrzałość)</span>
                      <span>90% (Cel zalecany EAA)</span>
                      <span>100% (Pełna zgodność)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Koordynator ds. Dostępności w Organizacji
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Osoba odpowiedzialna ustawowo za kontakt w sprawach dostępności.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Imię i nazwisko koordynatora
                    </label>
                    <input
                      type="text"
                      value={formData.auditCoordinatorName}
                      onChange={(e) =>
                        handleChange("auditCoordinatorName", e.target.value)
                      }
                      placeholder="np. Kinga Wróblewska"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Adres e-mail ds. dostępności
                    </label>
                    <input
                      type="email"
                      value={formData.auditCoordinatorEmail}
                      onChange={(e) =>
                        handleChange("auditCoordinatorEmail", e.target.value)
                      }
                      placeholder="dostepnosc@twojadomena.pl"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telefon kontaktowy
                    </label>
                    <input
                      type="text"
                      value={formData.auditCoordinatorPhone}
                      onChange={(e) =>
                        handleChange("auditCoordinatorPhone", e.target.value)
                      }
                      placeholder="+48 22 000 00 00"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Deklaracja Dostępności
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Aktualna
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Link do opublikowanej deklaracji
                    </label>
                    <input
                      type="url"
                      value={formData.declarationUrl}
                      onChange={(e) =>
                        handleChange("declarationUrl", e.target.value)
                      }
                      placeholder="https://twojadomena.pl/deklaracja-dostepnosci"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Data ostatniego przeglądu
                    </label>
                    <input
                      type="date"
                      value={formData.declarationDate}
                      onChange={(e) =>
                        handleChange("declarationDate", e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ZAKŁADKA 4: MOJE KONTO OSOBISTE & AWATAR Z DYSKU         */}
          {/* ======================================================== */}
          {activeTab === "account" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <User size={18} className="text-[#0038F8]" />
                      Dane Konta Użytkownika & Zdjęcie Awatara
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Możesz wgrać swoje prawdziwe zdjęcie z dysku lub wygenerować awatar.
                    </p>
                  </div>

                  {/* SEKCJA AWATARA ZE ZDJĘCIEM Z DYSKU */}
                  <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={formData.userAvatar}
                        alt={formData.userName}
                        className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-300 object-cover shrink-0 shadow-sm"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-900">
                          {formData.userName}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {formData.userRole}
                        </p>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          Format: PNG, JPG lub WebP (max 3 MB)
                        </span>
                      </div>
                    </div>

                    {/* PRZYCISKI WGRANIA Z DYSKU LUB LOSOWANIA */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      <input
                        type="file"
                        ref={avatarFileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <Upload size={14} />
                        <span>Wgraj zdjęcie z dysku</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const seed = Math.random().toString(36).substring(7);
                          handleChange(
                            "userAvatar",
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`
                          );
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Sparkles size={13} className="text-[#0038F8]" />
                        <span>Losuj awatar</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Imię i nazwisko
                      </label>
                      <input
                        type="text"
                        value={formData.userName}
                        onChange={(e) =>
                          handleChange("userName", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Rola w organizacji
                      </label>
                      <input
                        type="text"
                        value={formData.userRole}
                        onChange={(e) =>
                          handleChange("userRole", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Adres e-mail (Login)
                      </label>
                      <input
                        type="email"
                        value={formData.userEmail}
                        onChange={(e) =>
                          handleChange("userEmail", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Telefon bezpośredni
                      </label>
                      <input
                        type="text"
                        value={formData.userPhone}
                        onChange={(e) =>
                          handleChange("userPhone", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PRAWA STRONA: BEZPIECZEŃSTWO */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={15} className="text-[#0038F8]" />
                      Bezpieczeństwo i Logowanie
                    </h4>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Uwierzytelnianie dwuskładnikowe (2FA)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Wymaga kodu z aplikacji autoryzującej przy logowaniu.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.twoFactorEnabled}
                        onChange={(e) =>
                          handleChange("twoFactorEnabled", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0038F8]"></div>
                    </label>
                  </div>

                  <div className="pt-2">
                    <span className="block text-xs font-bold text-slate-700 mb-2">
                      Zmiana hasła
                    </span>
                    <div className="space-y-2.5">
                      <input
                        type="password"
                        placeholder="Aktualne hasło"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                      />
                      <input
                        type="password"
                        placeholder="Nowe hasło (min. 12 znaków)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (showToast) {
                            showToast(
                              "Hasło zaktualizowane",
                              "Twoje hasło do konta zostało pomyślnie zmienione.",
                              "success"
                            );
                          }
                        }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Zaktualizuj hasło
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ZAKŁADKA 5: POWIADOMIENIA & RAPORTY                      */}
          {/* ======================================================== */}
          {activeTab === "notifications" && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Bell size={18} className="text-[#0038F8]" />
                    Powiadomienia i Komunikaty E-mail
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Skonfiguruj alerty wysyłane na adres <strong>{formData.userEmail}</strong>.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "notifyCriticalErrors" as const,
                      title: "Alerty o nowych błędach krytycznych (Priorytetowych)",
                      desc: "Wysyłane natychmiast po wykryciu przez audytora błędu uniemożliwiającego użytkownikom ukończenie procesu cyfrowego.",
                    },
                    {
                      key: "notifyAuditorReplies" as const,
                      title: "Odpowiedzi audytorów w ticketach konsultacyjnych",
                      desc: "Powiadomienie, gdy audytor W-ally lub Opiekun Klienta (Tomasz Straszak) zamieści odpowiedź w wątku konsultacji.",
                    },
                    {
                      key: "weeklyDigest" as const,
                      title: "Tygodniowe podsumowanie stanu dostępności (Digest)",
                      desc: "Wysyłane w każdy poniedziałek o 08:00 rano ze statystykami napraw w zespole.",
                    },
                    {
                      key: "declarationReminders" as const,
                      title: "Przypomnienia o rocznym przeglądzie Deklaracji Dostępności",
                      desc: "Alerty wysyłane przed ustawowym terminem 31 marca każdego roku.",
                    },
                  ].map((notif) => (
                    <div
                      key={notif.key}
                      className="flex items-start justify-between p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 gap-4"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {notif.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {notif.desc}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={formData[notif.key]}
                          onChange={(e) =>
                            handleChange(notif.key, e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0038F8]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ZAKŁADKA: PROCEDURA ROZPATRYWANIA SKARG (BANK-SPECIFIC WORKFLOW) */}
          {activeTab === "complaints" && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <ListOrdered size={18} className="text-[#0038F8]" />
                      Procedura i etapy rozpatrywania skargi WCAG
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Dostosuj kroki postępowania dla organizacji <strong>{formData.orgName}</strong>. Zdefiniowane tutaj kroki wyświetlają się w bocznym panelu formularza dodawania nowej skargi jako instrukcja procesu.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleResetSteps}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Przywróć rekomendowane kroki bankowe"
                    >
                      <RotateCcw size={13} />
                      <span>Przywróć domyślne</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0038F8] hover:bg-[#002ECC] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus size={14} />
                      <span>Dodaj krok</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                  <Sparkles size={16} className="text-[#0038F8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Procedura bankowa dopasowana do Twojej organizacji:</span>
                    Każdy bank lub instytucja finansowa posiada własne regulacje dotyczące obsługi wniosków i skarg o zapewnienie dostępności (zgodnie z EAA i Ustawą o Dostępności Cyfrowej). Możesz zmieniać kolejność kroków, ich nazwy, opisy oraz wskazywać role odpowiedzialne (np. Koordynator, Zespół Dev, Audytor WCAG, Dział Prawny).
                  </div>
                </div>

                {/* Lista edytowalnych kroków */}
                <div className="space-y-4 pt-1">
                  {(formData.complaintProcessSteps || DEFAULT_COMPLAINT_PROCESS_STEPS).map((step, idx, arr) => (
                    <div
                      key={step.id}
                      className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-colors space-y-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-[#0038F8] text-white flex items-center justify-center font-black text-xs">
                            {step.stepNumber}
                          </span>
                          <span className="font-extrabold text-sm text-slate-900">
                            Etap {step.stepNumber}: {step.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveStep(step.id, "up")}
                            className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 rounded-lg hover:bg-slate-200/70 cursor-pointer disabled:cursor-not-allowed"
                            title="Przesuń krok w górę"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === arr.length - 1}
                            onClick={() => handleMoveStep(step.id, "down")}
                            className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 rounded-lg hover:bg-slate-200/70 cursor-pointer disabled:cursor-not-allowed"
                            title="Przesuń krok w dół"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={arr.length <= 1}
                            onClick={() => handleRemoveStep(step.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 disabled:opacity-30 disabled:hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer disabled:cursor-not-allowed ml-1"
                            title="Usuń ten krok procedury"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Tytuł etapu:
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleUpdateStep(step.id, { title: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/40"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Rola odpowiedzialna:
                          </label>
                          <input
                            type="text"
                            value={step.responsibleRole || ""}
                            onChange={(e) => handleUpdateStep(step.id, { responsibleRole: e.target.value })}
                            placeholder="np. Koordynator Dostępności"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/40"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Opis instrukcji / działań wymaganych w tym etapie:
                        </label>
                        <textarea
                          rows={2}
                          value={step.description}
                          onChange={(e) => handleUpdateStep(step.id, { description: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0038F8]/40"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Podgląd podsumowujący */}
                <div className="p-4 bg-slate-100/80 rounded-xl border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-700">Podsumowanie procedury:</span>
                    <span className="text-[11px] font-extrabold text-[#0038F8]">
                      Liczba kroków: {formData.complaintProcessSteps?.length || 0}
                    </span>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Zapisane zmiany będą natychmiast widoczne w module <strong>Skargi i Reklamacje → Nowe zgłoszenie</strong> w prawym panelu instruktażowym.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DOLNA BELKA AKCJI (STICKY FOOTER) */}
      <div className="w-full bg-white border-t border-slate-200 px-4 sm:px-8 lg:px-12 py-3.5 z-20 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {hasChanges ? (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <AlertCircle size={13} />
              Niezapisane zmiany w profilu
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Wszystkie zmiany zapisane
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("przeglad")}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Zamknij
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#0038F8] hover:bg-[#002ECC] rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Save size={15} />
            <span>Zapisz i przejdź do pulpitu</span>
          </button>
        </div>
      </div>

      {/* MODAL DODAWANIA / EDYCJI CZŁONKA ZESPOŁU */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038F8] flex items-center justify-center shrink-0">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingMember ? "Edytuj członka zespołu" : "Dodaj nowego dewelopera / członka"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Osoba ta będzie mogła odbierać i naprawiać błędy WCAG.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMemberModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="np. Tomasz Zieliński"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adres e-mail firmowy *
                  </label>
                  <input
                    type="email"
                    required
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    placeholder="t.zielinski@erstegroup.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefon (opcjonalnie)
                  </label>
                  <input
                    type="text"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    placeholder="+48 500 000 000"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rola / Stanowisko *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    placeholder="np. Senior Frontend Developer"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Główna specjalizacja
                  </label>
                  <select
                    value={memberForm.specialization}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        specialization: e.target.value as TeamMember["specialization"],
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                  >
                    <option value="frontend">Frontend WWW</option>
                    <option value="mobile">Aplikacje mobilne (iOS/Android)</option>
                    <option value="qa">Dostępność QA / Testy</option>
                    <option value="design">Design System & UX</option>
                    <option value="backend">Backend & API</option>
                    <option value="other">Inne</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Przypisane serwisy / procesy (oddzielone przecinkami)
                </label>
                <input
                  type="text"
                  value={memberForm.assignedServicesText}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, assignedServicesText: e.target.value })
                  }
                  placeholder="np. Serwis transakcyjny, Aplikacja mobilna, Formularz BLIK"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0038F8] hover:bg-[#002ECC] rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{editingMember ? "Zapisz zmiany" : "Dodaj do zespołu"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
