import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Phone,
  Mail,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Info,
  ExternalLink,
  MessageSquareText,
  Send,
  Video,
  Sparkles,
  Copy,
  Check,
  UserCheck,
  MapPin,
  Award,
  Layers,
  ArrowRight,
  Plus,
} from "lucide-react";
import { ClientProfile, TeamMember } from "./UserProfileView";

export interface PersonProfileData {
  id: string;
  name: string;
  role: string;
  type: "auditor" | "coordinator" | "developer";
  avatar: string;
  email: string;
  phone?: string;
  organization?: string;
  bio?: string;
  location?: string;
  status?: string;
  specialization?: string;
  specializationLabel?: string;
  assignedServices?: string[];
  openErrorsCount?: number;
  resolvedErrorsCount?: number;
  assignedTicketsCount?: number;
}

interface PersonProfileViewProps {
  person?: PersonProfileData | TeamMember | string | null;
  setView: (view: string) => void;
  backView?: string;
  clientProfile?: ClientProfile;
  showToast?: (
    title: string,
    text: string,
    type?: "success" | "info" | "warning" | "danger"
  ) => void;
  onOpenNewTicket?: (initialContext?: any) => void;
  onViewMemberErrors?: (member: any) => void;
  onViewMemberTickets?: (member: any) => void;
}

// Domyślny profil Tomasza Straszaka
const DEFAULT_TOMASZ_PROFILE: PersonProfileData = {
  id: "tomasz-straszak",
  name: "Tomasz Straszak",
  role: "Dedykowany Opiekun Klienta & Audytor Wiodący W-ally",
  type: "auditor",
  avatar: "https://wally.widzialni.eu//uploads/avatars/avatar_133_1760079096.jpg",
  email: "tomek@widzialni.eu",
  phone: "+48 795 103 017",
  organization: "Fundacja Widzialni / W-ally",
  location: "Warszawa / Zdalnie",
  status: "Dostępny dzisiaj",
  bio: "Certyfikowany ekspert dostępności cyfrowej IAAP (WAS, CPACC), audytor wiodący z ponad 12-letnim doświadczeniem w badaniach bankowości cyfrowej, systemów transakcyjnych oraz aplikacji mobilnych. Twój bezpośredni opiekun w procesie wdrażania WCAG 2.1 AA i EAA w organizacji.",
};

// Domyślny profil Koordynatora (Kinga Wróblewska)
const createCoordinatorProfile = (clientProfile?: ClientProfile): PersonProfileData => ({
  id: "kinga-wroblewska",
  name: clientProfile?.auditCoordinatorName || clientProfile?.userName || "Kinga Wróblewska",
  role: "Koordynator Dostępności Cyfrowej & Główny Administrator",
  type: "coordinator",
  avatar:
    clientProfile?.userAvatar ||
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
  email: clientProfile?.auditCoordinatorEmail || clientProfile?.userEmail || "kinga.wroblewska@erstegroup.com",
  phone: "+48 22 123 45 67",
  organization: clientProfile?.orgName || "Erste Group Bank AG",
  location: "Warszawa / Centrala",
  status: "Aktywna w systemie",
  bio: "Główny koordynator dostępności cyfrowej w organizacji. Odpowiada za strategię spełniania wymogów WCAG 2.1 AA / 2.2 AA, podział zadań pomiędzy zespoły deweloperskie oraz nadzór nad realizacją rekomendacji audytorskich.",
});

export function PersonProfileView({
  person,
  setView,
  backView = "przeglad",
  clientProfile,
  showToast,
  onOpenNewTicket,
  onViewMemberErrors,
  onViewMemberTickets,
}: PersonProfileViewProps) {
  // Rozpoznanie danych osoby na podstawie wejścia
  const profileData: PersonProfileData = React.useMemo(() => {
    if (!person || person === "Tomasz Straszak" || (typeof person === "object" && "name" in person && person.name === "Tomasz Straszak")) {
      return DEFAULT_TOMASZ_PROFILE;
    }
    if (person === "Kinga Wróblewska" || (typeof person === "object" && "name" in person && (person.name === "Kinga Wróblewska" || person.name === clientProfile?.auditCoordinatorName))) {
      return createCoordinatorProfile(clientProfile);
    }
    if (typeof person === "object") {
      const p = person as any;
      return {
        id: p.id || "person-id",
        name: p.name || "Użytkownik",
        role: p.role || "Członek zespołu",
        type: p.type || "developer",
        avatar: p.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (p.name || "User"),
        email: p.email || "kontakt@erstegroup.com",
        phone: p.phone || "+48 500 000 000",
        organization: clientProfile?.orgName || "Erste Group Bank AG",
        location: p.location || "Polska / Zdalnie",
        status: p.status === "active" ? "Aktywny" : "Dostępny",
        specialization: p.specialization,
        specializationLabel: p.specializationLabel,
        assignedServices: p.assignedServices || ["Serwis transakcyjny", "Portal informacyjny"],
        openErrorsCount: p.openErrorsCount ?? 8,
        resolvedErrorsCount: p.resolvedErrorsCount ?? 24,
        assignedTicketsCount: p.assignedTicketsCount ?? 2,
        bio: p.bio || `Specjalista techniczny odpowiedzialny za wdrażanie poprawek dostępności cyfrowej w serwisach organizacji.`,
      };
    }
    return DEFAULT_TOMASZ_PROFILE;
  }, [person, clientProfile]);

  const isAuditor = profileData.type === "auditor" || profileData.name.includes("Tomasz Straszak");
  const isCoordinator = profileData.type === "coordinator" || profileData.name.includes("Kinga Wróblewska");
  const isDeveloper = !isAuditor && !isCoordinator;

  // Stan formularza rezerwacji 30-minutowego spotkania z Tomaszem
  const [selectedDate, setSelectedDate] = useState("2026-10-24");
  const [selectedSlot, setSelectedSlot] = useState("11:00");
  const [meetingType, setMeetingType] = useState<"video" | "phone">("video");
  const [meetingTopic, setMeetingTopic] = useState("Konsultacja błędu krytycznego");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Stan formularza szybkiej konsultacji / ticketu
  const [consultationSubject, setConsultationSubject] = useState("");
  const [consultationMessage, setConsultationMessage] = useState("");
  const [consultationPriority, setConsultationPriority] = useState<"Krytyczny" | "Ważny" | "Marginalny">("Ważny");
  const [isConsultationSent, setIsConsultationSent] = useState(false);

  // Dostępne dni i sloty dla Tomasza
  const bookingDays = [
    { date: "2026-10-24", dayName: "Jutro (Piątek)", slotsCount: 4 },
    { date: "2026-10-27", dayName: "Poniedziałek", slotsCount: 5 },
    { date: "2026-10-28", dayName: "Wtorek", slotsCount: 3 },
    { date: "2026-10-29", dayName: "Środa", slotsCount: 4 },
  ];

  const bookingSlots = [
    "09:30 - 10:00",
    "11:00 - 11:30",
    "13:30 - 14:00",
    "15:00 - 15:30",
    "16:30 - 17:00",
  ];

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(profileData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
    if (showToast) {
      showToast("Skopiowano do schowka", `Adres ${profileData.email} został pomyślnie skopiowany.`);
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingConfirmed(true);
    if (showToast) {
      showToast(
        "Spotkanie zostało zarezerwowane!",
        `Zarezerwowano 30-minutowe spotkanie z Tomaszem Straszakiem na dzień ${selectedDate} o godz. ${selectedSlot}. Link Google Meet przesłano na Twój email.`,
        "success"
      );
    }
  };

  const handleSendConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationSubject.trim() || !consultationMessage.trim()) return;

    setIsConsultationSent(true);
    if (showToast) {
      showToast(
        "Konsultacja wysłana",
        `Zapytanie "${consultationSubject}" zostało przekazane do: ${profileData.name}. Odpowiedź pojawi się w module Konsultacje.`,
        "success"
      );
    }
    setTimeout(() => {
      setConsultationSubject("");
      setConsultationMessage("");
      setIsConsultationSent(false);
    }, 4000);
  };

  const getBackLabel = () => {
    if (backView === "profil") return "Wróć do: Zarządzaj kontem / Zespół";
    if (backView === "tickety") return "Wróć do: Konsultacje i tickety";
    if (backView === "raport-bledy") return "Wróć do: Rejestr błędów";
    return "Wróć do: Pulpit";
  };

  return (
    <div className="flex-1 flex flex-col md:h-full w-full md:overflow-y-auto bg-[#f8fafc]">
      {/* GÓRNY PASEK NAWIGACJI */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setView(backView)}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer group"
            >
              <ArrowLeft size={16} className="text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
              <span>{getBackLabel()}</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span>Profil użytkownika</span>
              <span>•</span>
              <span className="text-slate-900 font-bold">{profileData.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isAuditor
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : isCoordinator
                  ? "bg-blue-50 text-[#0038F8] border-blue-200"
                  : "bg-purple-50 text-purple-800 border-purple-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAuditor ? "bg-emerald-500" : isCoordinator ? "bg-[#0038F8]" : "bg-purple-600"
                } inline-block animate-pulse`}
              />
              {isAuditor
                ? "Dedykowany Opiekun W-ally"
                : isCoordinator
                ? "Koordynator Klienta"
                : "Członek Zespołu Dev"}
            </span>
          </div>
        </div>
      </div>

      {/* ZAWARTOŚĆ GŁÓWNA */}
      <div className="max-w-[1500px] mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* KARTA HERO PROFILU OSOBY */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
              {/* Awatar ze statusem */}
              <div className="relative shrink-0 self-start sm:self-auto">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-slate-100"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center text-white"
                  title="Dostępny"
                >
                  <Check size={12} strokeWidth={3} />
                </span>
              </div>

              {/* Dane personalne */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {profileData.name}
                  </h1>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isAuditor
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : isCoordinator
                        ? "bg-blue-50 text-[#0038F8] border-blue-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {profileData.specializationLabel || profileData.role}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-600 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={15} className="text-slate-400" />
                    {profileData.organization || "Erste Group Bank AG"}
                  </span>
                  {profileData.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} className="text-slate-400" />
                      {profileData.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    {profileData.status || "Dostępny dzisiaj"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-3xl pt-1 leading-relaxed">
                  {profileData.bio}
                </p>
              </div>
            </div>

            {/* Szybkie dane kontaktowe */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 self-stretch md:self-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 justify-center">
              <a
                href={`mailto:${profileData.email}`}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0038F8] font-bold text-xs sm:text-sm transition-colors border border-blue-100 cursor-pointer shadow-2xs group"
                title="Wyślij wiadomość email"
              >
                <Mail size={16} className="text-[#0038F8] group-hover:scale-110 transition-transform" />
                <span className="truncate">{profileData.email}</span>
              </a>

              {profileData.phone && (
                <a
                  href={`tel:${profileData.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm transition-colors border border-slate-200 cursor-pointer shadow-2xs group"
                  title="Zadzwoń bezpośrednio"
                >
                  <Phone size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>{profileData.phone}</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Skopiowano email</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Kopiuj adres email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SEKCJA DEDYKOWANA DLA TOMASZA STRASZAKA (OPIEKUN W-ALLY) */}
        {/* ======================================================== */}
        {isAuditor && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEWA KOLUMNA (7 KOLUMN): FORMULARZ UMÓWIENIA SPOTKANIA 30 MIN */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white border-2 border-[#0038F8]/20 rounded-2xl p-5 sm:p-7 shadow-xs">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038F8] flex items-center justify-center shrink-0 border border-blue-200/80">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                          Umów spotkanie 30 min z Opiekunem
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          1:1 Bezpłatne
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        Wybierz dogodny termin na konsultację architektoniczną lub omówienie reaudytu.
                      </p>
                    </div>
                  </div>
                </div>

                {isBookingConfirmed ? (
                  <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col items-center text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900">
                        Spotkanie z Tomaszem zostało pomyślnie zarezerwowane!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                        Termin: <strong>{selectedDate}</strong>, godzina: <strong>{selectedSlot}</strong> (30 minut).
                        <br />
                        Temat: <em>{meetingTopic}</em>
                      </p>
                    </div>

                    <div className="p-3.5 bg-white border border-emerald-200 rounded-lg text-xs text-left w-full max-w-md space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-bold flex items-center gap-1.5">
                          <Video size={14} className="text-[#0038F8]" />
                          Link do spotkania (Google Meet):
                        </span>
                        <span className="font-mono text-[#0038F8] font-bold">meet.google.com/wca-ally-ts</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-100 text-[11px]">
                        <span>Organizator: Tomasz Straszak (tomek@widzialni.eu)</span>
                        <span>Czas: 30 min</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (showToast) {
                            showToast("Pobrano plik kalendarza", "Plik zaproszenia spotkanie-tomasz-straszak.ics został wygenerowany.");
                          }
                        }}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        Pobierz zaproszenie .ICS
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsBookingConfirmed(false)}
                        className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Zarezerwuj inne spotkanie
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleConfirmBooking} className="space-y-5">
                    {/* KROK 1: Wybór dnia */}
                    <div>
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                        1. Wybierz dzień spotkania:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {bookingDays.map((d) => {
                          const isSelected = selectedDate === d.date;
                          return (
                            <button
                              key={d.date}
                              type="button"
                              onClick={() => setSelectedDate(d.date)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-blue-50 border-[#0038F8] text-[#0038F8] ring-2 ring-[#0038F8]/20 shadow-xs"
                                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <div className="text-xs font-extrabold">{d.dayName}</div>
                              <div className="text-[11px] text-slate-500 font-medium mt-0.5">{d.date}</div>
                              <div className="text-[10px] font-bold text-emerald-700 mt-1">
                                {d.slotsCount} wolne sloty
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* KROK 2: Wybór godziny (30 min) */}
                    <div>
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                        2. Dostępne godziny (slot 30 min):
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {bookingSlots.map((slot) => {
                          const isSelected = selectedSlot === slot.split(" - ")[0];
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot.split(" - ")[0])}
                              className={`px-3 py-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#0038F8] border-[#0038F8] text-white shadow-xs"
                                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1.5">
                                <Clock size={12} className={isSelected ? "text-white" : "text-slate-400"} />
                                <span>{slot}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* KROK 3: Forma i temat */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                          3. Forma spotkania:
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMeetingType("video")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              meetingType === "video"
                                ? "bg-blue-50 border-[#0038F8] text-[#0038F8]"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <Video size={14} />
                            <span>Google Meet</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMeetingType("phone")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              meetingType === "phone"
                                ? "bg-blue-50 border-[#0038F8] text-[#0038F8]"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <Phone size={14} />
                            <span>Telefon 1:1</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                          4. Główny temat:
                        </label>
                        <select
                          value={meetingTopic}
                          onChange={(e) => setMeetingTopic(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/20 focus:border-[#0038F8]"
                        >
                          <option value="Konsultacja błędu krytycznego">Konsultacja błędu krytycznego</option>
                          <option value="Przygotowanie do reaudytu kwartalnego">Przygotowanie do reaudytu kwartalnego</option>
                          <option value="Architektura dostępności formularzy i modali">Architektura dostępności formularzy i modali</option>
                          <option value="Weryfikacja poprawek deweloperów">Weryfikacja poprawek deweloperów</option>
                          <option value="Zgodność z Europejskim Aktem o Dostępności (EAA)">Zgodność z EAA (czerwiec 2025)</option>
                          <option value="Inny temat konsultacyjny">Inny temat konsultacyjny</option>
                        </select>
                      </div>
                    </div>

                    {/* KROK 4: Krótka agenda */}
                    <div>
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                        5. Krótka agenda lub linki do zbadania (opcjonalnie):
                      </label>
                      <textarea
                        rows={2}
                        value={meetingNotes}
                        onChange={(e) => setMeetingNotes(e.target.value)}
                        placeholder="np. Chcemy omówić błąd krytyczny 1.4.3 na kafelkach kalkulatora kredytowego..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/20 focus:border-[#0038F8] resize-none"
                      />
                    </div>

                    {/* Przycisk potwierdzenia */}
                    <div className="pt-2 flex items-center justify-between gap-4">
                      <div className="text-xs text-slate-500 font-medium">
                        Potwierdzenie oraz zaproszenie do kalendarza otrzymasz od razu.
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Calendar size={16} />
                        <span>Potwierdź rezerwację (30 min)</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* KWALIFIKACJE I CERTYFIKATY OPIEKUNA */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Certyfikaty i akredytacje audytorskie
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standardy merytoryczne Fundacji Widzialni i IAAP
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-[#0038F8] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">IAAP Certified WAS</div>
                      <div className="text-slate-500 text-[11px]">Web Accessibility Specialist (International Association of Accessibility Professionals)</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-[#0038F8] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">IAAP CPACC</div>
                      <div className="text-slate-500 text-[11px]">Certified Professional in Accessibility Core Competencies</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Audytor Wiodący W-ally</div>
                      <div className="text-slate-500 text-[11px]">Zgodność z normą EN 301 549 oraz wytycznymi WCAG 2.1 / 2.2 poziom AA</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Ekspert Bankowości Cyfrowej</div>
                      <div className="text-slate-500 text-[11px]">Specjalizacja w standardach EAA dla sektora finansowego i płatności</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PRAWA KOLUMNA (5 KOLUMN): WIDGET UTWORZENIA KONSULTACJI ASYNCHRONICZNEJ */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <MessageSquareText size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        Szybka konsultacja merytoryczna
                      </h3>
                      <p className="text-xs text-slate-500">
                        Wątek asynchroniczny przypisany do Tomasza Straszaka
                      </p>
                    </div>
                  </div>

                  {isConsultationSent ? (
                    <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                      <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                      <div className="text-sm font-bold text-slate-900">Zapytanie zostało przekazane!</div>
                      <p className="text-xs text-slate-600">
                        Tomasz Straszak otrzymał powiadomienie. Odpowiedź z rekomendacją techniczną pojawi się w module Konsultacje.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendConsultation} className="space-y-3.5">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Temat konsultacji / błąd:
                        </label>
                        <input
                          type="text"
                          required
                          value={consultationSubject}
                          onChange={(e) => setConsultationSubject(e.target.value)}
                          placeholder="np. Wątpliwość co do kryterium 1.4.11 w modalach"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/20 focus:border-[#0038F8]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Priorytet:
                          </label>
                          <select
                            value={consultationPriority}
                            onChange={(e) => setConsultationPriority(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/20 focus:border-[#0038F8]"
                          >
                            <option value="Krytyczny">Krytyczny (Pilne)</option>
                            <option value="Ważny">Ważny (Standard)</option>
                            <option value="Marginalny">Marginalny (Niski)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Format odpowiedzi:
                          </label>
                          <div className="text-xs text-slate-600 py-2 font-medium">
                            Pisemna rekomendacja techniczna
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Treść zapytania / kod do weryfikacji:
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={consultationMessage}
                          onChange={(e) => setConsultationMessage(e.target.value)}
                          placeholder="Opisz problem techniczny, wklej fragment kodu lub zadaj pytanie dotyczące interpretacji WCAG..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/20 focus:border-[#0038F8] resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Send size={14} />
                        <span>Wyślij zapytanie do Tomasza</span>
                      </button>
                    </form>
                  )}
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Średni czas odpowiedzi Tomasza:</span>
                  <strong className="text-slate-800 font-bold">&lt; 3 godziny</strong>
                </div>
              </div>

              {/* AUDYTY OPIEKOWANE PRZEZ TOMASZA W ERSTE */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Aktywne procesy pod opieką Tomasza:
                </h4>
                <div className="space-y-2">
                  {[
                    { title: "Serwis transakcyjny - Nowy Dashboard", status: "W trakcie audytu", score: "62.1%" },
                    { title: "Portal informacyjny - wybrane podstrony", status: "Zakończony certyfikacją", score: "77.5%" },
                    { title: "Proces reklamacyjny i formularze wnioskowe", status: "W trakcie weryfikacji", score: "Nowy" },
                  ].map((proc, i) => (
                    <div
                      key={i}
                      onClick={() => setView("raporty")}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#0038F8] transition-colors truncate">
                          {proc.title}
                        </div>
                        <div className="text-[11px] text-slate-500">{proc.status}</div>
                      </div>
                      <span className="text-xs font-extrabold text-[#0038F8] shrink-0">
                        {proc.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SEKCJA DEDYKOWANA DLA KOORDYNATORA (KINGA WRÓBLEWSKA)    */}
        {/* ======================================================== */}
        {isCoordinator && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* KARTA STRATEGII I OBOWIĄZKÓW */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0038F8] flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Rola i uprawnienia Koordynatora Organizacji
                    </h2>
                    <p className="text-xs text-slate-500">
                      Zarządzanie standardem dostępności cyfrowej dla: {profileData.organization}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Obowiązujący standard
                    </span>
                    <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                      {clientProfile?.wcagStandard || "WCAG 2.1 AA"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">Wymóg EAA i KRI</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Docelowy próg dojrzałości
                    </span>
                    <span className="text-base font-extrabold text-[#0038F8] mt-0.5 block">
                      Cel: {clientProfile?.targetScore || 90}%
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Aktualnie: 86.2%</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Zespół techniczny
                    </span>
                    <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                      {clientProfile?.teamMembers?.length || 5} deweloperów
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">Frontend, Mobile, QA</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
                  <h3 className="font-bold text-slate-900 text-sm">Zakres odpowiedzialności koordynatora:</h3>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-600">
                    <li>Nadzór nad harmonogramem cyklicznych reaudytów z Fundacją Widzialni.</li>
                    <li>Przydzielanie wykrytych błędów dostępności do odpowiednich inżynierów i zespołów produktowych.</li>
                    <li>Weryfikacja i publikacja oficjalnej Deklaracji Dostępności na stronach banku.</li>
                    <li>Raportowanie postępów zgodności do Zarządu oraz instytucji regulacyjnych (KNF, PFRON).</li>
                  </ul>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setView("profil")}
                    className="px-4 py-2 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Zarządzaj zespołem i standardem WCAG</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("raportowanie")}
                    className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Przejdź do raportów zarządczych
                  </button>
                </div>
              </div>
            </div>

            {/* PRAWA KOLUMNA (4 KOLUMNY): WIDGET KONTAKTU Z KOORDYNATOREM */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Kontakt wewnętrzny z Koordynatorem
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Zgłoś problem organizacyjny, prośbę o dodanie dewelopera lub potrzebę reaudytu.
                </p>

                <form onSubmit={handleSendConsultation} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Temat notatki:
                    </label>
                    <input
                      type="text"
                      required
                      value={consultationSubject}
                      onChange={(e) => setConsultationSubject(e.target.value)}
                      placeholder="np. Wniosek o dodanie nowego serwisu do monitoringu"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/20 focus:border-[#0038F8]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Wiadomość do Kingi:
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={consultationMessage}
                      onChange={(e) => setConsultationMessage(e.target.value)}
                      placeholder="Napisz wiadomość..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/20 focus:border-[#0038F8] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send size={14} />
                    <span>Wyślij wiadomość do Koordynatora</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SEKCJA DEDYKOWANA DLA DEWELOPERÓW I TESTERÓW ZESPOŁU     */}
        {/* ======================================================== */}
        {isDeveloper && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* STATYSTYKI ZADAŃ I BŁĘDÓW DEWELOPERA */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Zadania i wskaźniki dostępności
                      </h2>
                      <p className="text-xs text-slate-500">
                        Bieżący stan realizacji zaleceń WCAG dla dewelopera
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
                  {/* Otwarte błędy */}
                  <div className="p-3.5 bg-red-50/70 border border-red-200/80 rounded-xl">
                    <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
                      Błędy Otwarte
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {profileData.openErrorsCount ?? 0}
                    </span>
                    <span className="text-[11px] text-red-600 font-semibold mt-1 block">
                      Wymaga wdrożenia fixu
                    </span>
                  </div>

                  {/* Naprawione błędy */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Rozwiązane Fixy
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {profileData.resolvedErrorsCount ?? 0}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                      Zweryfikowane pomyślnie
                    </span>
                  </div>

                  {/* Konsultacje i tickety */}
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl">
                    <span className="text-[11px] font-bold text-[#0038F8] uppercase tracking-wider block">
                      Przypisane Tickety
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {profileData.assignedTicketsCount ?? 0}
                    </span>
                    <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
                      Konsultacje z audytorami
                    </span>
                  </div>
                </div>

                {/* PRZYPISANE SERWISY */}
                <div className="mb-5 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                    Obsługiwane serwisy i komponenty:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(profileData.assignedServices || []).map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Building2 size={13} className="text-slate-500" />
                        <span>{srv}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* AKCJE SKRÓTÓW: ZOBACZ BŁĘDY / ZOBACZ TICKETY */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onViewMemberErrors) {
                        onViewMemberErrors(profileData);
                      } else {
                        setView("raport-bledy");
                      }
                    }}
                    className="px-4 py-2.5 bg-red-50 hover:bg-red-100/90 text-red-700 border border-red-200 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-2 group"
                  >
                    <AlertOctagon size={15} className="text-red-600 group-hover:scale-110 transition-transform" />
                    <span>Zobacz błędy przypisane do: {profileData.name} ({profileData.openErrorsCount})</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onViewMemberTickets) {
                        onViewMemberTickets(profileData);
                      } else {
                        setView("tickety");
                      }
                    }}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100/90 text-[#0038F8] border border-blue-200 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-2 group"
                  >
                    <MessageSquareText size={15} className="text-[#0038F8] group-hover:scale-110 transition-transform" />
                    <span>Przejdź do ticketów ({profileData.assignedTicketsCount})</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* PRAWA KOLUMNA (5 KOLUMN): WIDGET ZLECENIA KONSULTACJI Z DEWELOPEREM */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Send size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Zleć weryfikację lub konsultację deweloperowi
                    </h3>
                    <p className="text-xs text-slate-500">
                      Wiadomość z zadaniem WCAG dla: {profileData.name}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendConsultation} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Dotyczy serwisu / modułu:
                    </label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/20 focus:border-[#0038F8]"
                    >
                      {(profileData.assignedServices || ["Serwis transakcyjny"]).map((s, idx) => (
                        <option key={idx} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Tytuł zadania lub błąd do weryfikacji:
                    </label>
                    <input
                      type="text"
                      required
                      value={consultationSubject}
                      onChange={(e) => setConsultationSubject(e.target.value)}
                      placeholder="np. Prośba o ponowną weryfikację kontrastu w nawigacji"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/20 focus:border-[#0038F8]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Szczegółowe wytyczne / uwagi:
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={consultationMessage}
                      onChange={(e) => setConsultationMessage(e.target.value)}
                      placeholder="Wpisz szczegóły zadania lub zalecenia od audytora W-ally..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/20 focus:border-[#0038F8] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send size={14} />
                    <span>Wyślij zadanie do dewelopera</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
