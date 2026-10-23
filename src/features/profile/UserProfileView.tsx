import React, { useState, useRef } from "react";
import {
  Building2,
  ShieldCheck,
  User,
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
  Key,
  Lock,
  Mail,
  Phone,
  FileText,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { ClientProfile } from "../../types";

interface UserProfileViewProps {
  setView: (view: string) => void;
  clientProfile: ClientProfile;
  setClientProfile: React.Dispatch<React.SetStateAction<ClientProfile>>;
  showToast?: (
    title: string,
    text: string,
    type?: "success" | "info" | "warning" | "danger"
  ) => void;
}

// Predefiniowane presety logotypów dla szybkiego testowania przez klienta
const PRESET_LOGOS = [
  {
    id: "erste",
    name: "Erste Group",
    shortName: "Erste",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHgYtVh9h9eIsSNsP76-1aodQJJzy5gNNVXR6n_oyQ0g&s",
    alt: "Logo Erste Group Bank",
    sector: "Bankowość i finanse",
    taxId: "PL 525-000-00-00",
    domain: "https://www.erstegroup.com",
  },
  {
    id: "mbank",
    name: "mBank S.A.",
    shortName: "mBank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/MBank_logo.svg/320px-MBank_logo.svg.png",
    alt: "Logo mBank S.A.",
    sector: "Bankowość i finanse",
    taxId: "PL 526-021-50-88",
    domain: "https://www.mbank.pl",
  },
  {
    id: "pko",
    name: "PKO Bank Polski",
    shortName: "PKO BP",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PKO_Bank_Polski_logo.svg/320px-PKO_Bank_Polski_logo.svg.png",
    alt: "Logo PKO Bank Polski",
    sector: "Bankowość i finanse",
    taxId: "PL 525-000-77-38",
    domain: "https://www.pkobp.pl",
  },
  {
    id: "gov",
    name: "Ministerstwo Cyfryzacji",
    shortName: "MC Gov",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Herb_Polski.svg/200px-Herb_Polski.svg.png",
    alt: "Godło Rzeczypospolitej Polskiej - Ministerstwo Cyfryzacji",
    sector: "Sektor publiczny - Administracja Rządowa",
    taxId: "PL 526-289-51-99",
    domain: "https://www.gov.pl/cyfryzacja",
  },
];

export function UserProfileView({
  setView,
  clientProfile,
  setClientProfile,
  showToast,
}: UserProfileViewProps) {
  const [activeTab, setActiveTab] = useState<
    "branding" | "wcag" | "account" | "notifications"
  >("branding");

  // Kopia robocza formularza
  const [formData, setFormData] = useState<ClientProfile>({ ...clientProfile });
  const [hasChanges, setHasChanges] = useState(false);
  const [previewBgDark, setPreviewBgDark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Zmiana pojedynczego pola
  const handleChange = <K extends keyof ClientProfile>(
    field: K,
    value: ClientProfile[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Obsługa wgrania pliku graficznego z dysku komputera
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            "Logo wczytane",
            "Plik graficzny został wczytany z dysku. Zapisz profil, aby zastosować.",
            "info"
          );
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Wybór presetu
  const applyPreset = (preset: (typeof PRESET_LOGOS)[0]) => {
    setFormData((prev) => ({
      ...prev,
      orgName: preset.name,
      orgShortName: preset.shortName,
      orgLogo: preset.logo,
      orgAltText: preset.alt,
      sector: preset.sector,
      taxId: preset.taxId,
      domain: preset.domain,
    }));
    setHasChanges(true);
    if (showToast) {
      showToast(
        "Zastosowano szablon",
        `Wczytano logo i dane dla: ${preset.name}`,
        "info"
      );
    }
  };

  // Zapis zmian
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
        `Logo i konfiguracja organizacji "${formData.orgName}" zostały zaktualizowane.`,
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
      showToast("Cofnięto", "Przywrócono zapisane wartości.", "info");
    }
  };

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
                Mój profil i organizacja
              </li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {/* Awatar usera / logo */}
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038F8] border border-blue-200/70 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 size={24} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[24px] sm:text-[30px] font-extrabold text-slate-900 tracking-tight leading-tight">
                    Mój profil i organizacja
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0038F8] border border-blue-200">
                    <Landmark size={12} />
                    {formData.orgShortName || formData.orgName}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                  Zarządzaj logo klienta wyświetlanym na pulpicie, danymi
                  instytucji, celami WCAG oraz kontem koordynatora.
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
              <span>Logo & Branding Organizacji</span>
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
              <span>Standardy WCAG & Koordynacja</span>
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
              <span>Konto Osobiste & Bezpieczeństwo</span>
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
              <span>Powiadomienia & Raporty</span>
            </button>
          </div>
        </div>
      </div>

      {/* ZAWARTOŚĆ GŁÓWNA - SCROLLABLE */}
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
                    Zapisz zmiany, aby nowe logo i parametry pojawiły się na
                    pulpicie i w nagłówkach raportów.
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
              {/* KARTA PODGLĄDU NA ŻYWO (LIVE PREVIEW) */}
              <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0038F8]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-yellow-400" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-blue-200">
                        Podgląd na żywo • Tak Twoja organizacja widnieje na
                        Pulpicie
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mt-4">
                      {/* Kontener logo klienta */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2.5 flex items-center justify-center shadow-lg shrink-0 border border-white/20">
                        {formData.orgLogo ? (
                          <img
                            src={formData.orgLogo}
                            alt={
                              formData.orgAltText ||
                              `Logo ${formData.orgName}`
                            }
                            className="max-h-full max-w-full object-contain rounded-lg"
                            onError={(e) => {
                              // Fallback jeśli URL z zewnątrz zawiedzie
                              if (e.currentTarget.src !== "./logos/erste.png") {
                                e.currentTarget.src = "./logos/erste.png";
                              }
                            }}
                          />
                        ) : (
                          <Building2 size={32} className="text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                            {formData.orgName || "Nazwa Twojej Organizacji"}
                          </h2>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/30">
                            {formData.orgShortName || "Klient"}
                          </span>
                        </div>
                        <p className="text-blue-100/80 text-xs sm:text-sm mt-1">
                          Sektor:{" "}
                          <strong className="text-white font-semibold">
                            {formData.sector}
                          </strong>{" "}
                          • Standard referencyjny:{" "}
                          <strong className="text-white font-semibold">
                            {formData.wcagStandard}
                          </strong>{" "}
                          • Cel dostępności:{" "}
                          <strong className="text-emerald-400 font-bold">
                            {formData.targetScore}%
                          </strong>
                        </p>
                        <p className="text-blue-200/60 text-[11px] mt-1">
                          Tekst alternatywny dla czytników:{" "}
                          <span className="italic text-white">
                            "{formData.orgAltText || `Logo ${formData.orgName}`}"
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                    <span className="text-xs font-bold text-blue-200">
                      Pakiet Enterprise
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSave(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                    >
                      <span>Zobacz na Pulpicie</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* GŁÓWNA SEKCJA ZARZĄDZANIA LOGO */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEWA KOLUMNA: EDYCJA I WGข้อ LOGO (7 kolumn) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                          <Upload size={18} className="text-[#0038F8]" />
                          Ustawienie Logo Klienta
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Logo będzie widoczne na pulpicie, w nagłówku raportów
                          audytowych oraz w deklaracji dostępności.
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

                    {/* SPOSÓB 1: Wklejenie adresu URL */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Adres URL logo (np. link do pliku PNG / SVG / JPG)
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
                        <p className="text-[11px] text-slate-400 mt-1">
                          Możesz wkleić bezpośredni link do logo ze strony
                          Twojej organizacji.
                        </p>
                      </div>

                      {/* SPOSÓB 2: Wgranie pliku z dysku */}
                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1.5">
                          LUB wgraj plik logo z dysku komputera
                        </span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/png,image/svg+xml,image/jpeg,image/webp"
                          className="hidden"
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 hover:border-[#0038F8] bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-5 text-center cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 mx-auto rounded-xl bg-white group-hover:bg-[#0038F8] text-slate-500 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs mb-2">
                            <Upload size={18} />
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-[#0038F8] block">
                            Kliknij, aby wybrać plik logo z dysku
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5 block">
                            PNG, SVG, JPG lub WebP (maksymalnie 2 MB)
                          </span>
                        </div>
                      </div>

                      {/* SPOSÓB 3: Gotowe presety demonstracyjne */}
                      <div className="pt-3 border-t border-slate-100">
                        <span className="block text-xs font-bold text-slate-700 mb-2">
                          Szybki wybór gotowego szablonu klienta (Presety demo):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {PRESET_LOGOS.map((p) => {
                            const isSelected =
                              formData.orgLogo === p.logo ||
                              formData.orgShortName === p.shortName;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => applyPreset(p)}
                                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 ${
                                  isSelected
                                    ? "bg-blue-50/80 border-[#0038F8] text-[#0038F8] shadow-2xs"
                                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <div className="h-7 w-full flex items-center justify-center px-1">
                                  <img
                                    src={p.logo}
                                    alt={p.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <span className="text-[11px] font-bold truncate max-w-full">
                                  {p.shortName}
                                </span>
                              </button>
                            );
                          })}
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
                  {/* KARTA PODGLĄDU LOGO I KONTRASTU */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                        Podgląd Logo i Test Kontrastu
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
                          className="max-h-24 max-w-[200px] object-contain drop-shadow-xs"
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
                        Format: Obsługiwany (SVG / PNG / JPG)
                      </span>
                      <span className="font-semibold text-slate-700">
                        Pulpit: Gotowe
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
                          placeholder="PL 000-000-00-00"
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
          {/* ZAKŁADKA 2: STANDARDY WCAG & KOORDYNACJA                 */}
          {/* ======================================================== */}
          {activeTab === "wcag" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEWA STRONA: STANDARDY AUDYTOWE (7 kolumn) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#0038F8]" />
                      Referencyjne Standardy Dostępności Cyfrowej
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Wybierz standard, według którego audytorzy W-ally weryfikują
                      serwisy Twojej organizacji i obliczają wskaźniki na
                      pulpicie.
                    </p>
                  </div>

                  {/* KAFELKI WYBORU STANDARDU */}
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

              {/* PRAWA STRONA: KOORDYNATOR & DEKLARACJA (5 kolumn) */}
              <div className="lg:col-span-5 space-y-6">
                {/* KOORDYNATOR DOSTĘPNOŚCI */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Koordynator ds. Dostępności w Organizacji
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Osoba odpowiedzialna ustawowo za kontakt w sprawach
                      dostępności oraz zgłoszenia skargowe.
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
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
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
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
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
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Departament / Jednostka
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        handleChange("department", e.target.value)
                      }
                      placeholder="np. Departament Standardów Cyfrowych & UX"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                    />
                  </div>
                </div>

                {/* DEKLARACJA DOSTĘPNOŚCI */}
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
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
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
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Wymóg corocznej aktualizacji deklaracji do 31 marca.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ZAKŁADKA 3: MOJE KONTO OSOBISTE & BEZPIECZEŃSTWO         */}
          {/* ======================================================== */}
          {activeTab === "account" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <User size={18} className="text-[#0038F8]" />
                      Dane Konta Użytkownika
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Twoje dane wyświetlane w prawym górnym rogu platformy
                      oraz w ticketach konsultacyjnych z audytorami.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={formData.userAvatar}
                      alt={formData.userName}
                      className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900">
                        {formData.userName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {formData.userRole}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const seed = Math.random().toString(36).substring(7);
                          handleChange(
                            "userAvatar",
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`
                          );
                        }}
                        className="mt-1.5 text-xs font-bold text-[#0038F8] hover:underline cursor-pointer"
                      >
                        Losuj inny awatar
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
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
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
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
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
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
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
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/30 focus:border-[#0038F8]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PRAWA STRONA: BEZPIECZEŃSTWO & HASŁO (5 kolumn) */}
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
          {/* ZAKŁADKA 4: POWIADOMIENIA & RAPORTY                      */}
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
                    Skonfiguruj, jakie informacje chcesz otrzymywać na adres{" "}
                    <strong>{formData.userEmail}</strong>.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "notifyCriticalErrors" as const,
                      title: "Alerty o nowych błędach krytycznych (Priorytetowych)",
                      desc: "Wysyłane natychmiast po zatwierdzeniu przez audytora błędu uniemożliwiającego użytkownikom ukończenie procesu cyfrowego.",
                    },
                    {
                      key: "notifyAuditorReplies" as const,
                      title: "Odpowiedzi audytorów w ticketach konsultacyjnych",
                      desc: "Powiadomienie, gdy Tomasz Straszak lub inny audytor W-ally udzieli rekomendacji merytorycznej w Twoim wątku.",
                    },
                    {
                      key: "weeklyDigest" as const,
                      title: "Tygodniowe podsumowanie stanu dostępności (Digest)",
                      desc: "Wysyłane w każdy poniedziałek o 08:00 rano z wykresem trendu i postępem w naprawianiu barier.",
                    },
                    {
                      key: "declarationReminders" as const,
                      title: "Przypomnienia o rocznym przeglądzie Deklaracji Dostępności",
                      desc: "Alerty wysyłane na 60, 30 i 14 dni przed terminem 31 marca każdego roku.",
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
        </div>
      </div>

      {/* DOLNA BELKA AKCJI (STICKY FOOTER) */}
      <div className="w-full bg-white border-t border-slate-200 px-4 sm:px-8 lg:px-12 py-3.5 z-20 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {hasChanges ? (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <AlertCircle size={13} />
              Niezapisane zmiany
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Wszystkie zmiany zapisane w profilu
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
    </div>
  );
}
