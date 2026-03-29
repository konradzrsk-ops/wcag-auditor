import React, { useState, useMemo } from "react";
import {
  Eye,
  EyeOff,
  LayoutGrid,
  ClipboardCheck,
  Library,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Calendar,
  CheckCircle2,
  MonitorSmartphone,
  ArrowRight,
  Smartphone,
  Folder,
  ChevronRight,
  ChevronLeft,
  Plus,
  Pencil,
  Trash2,
  PanelRightClose,
  PanelRightOpen,
  Layout,
  ArrowLeft,
  Download,
  AlertOctagon,
  AlertTriangle,
  ListChecks,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Link2,
  AlertCircle,
  BarChart2,
  FileText,
  FileSpreadsheet,
  Filter,
  PieChart,
  TrendingUp,
  Activity,
  ChevronRightSquare,
  Bug,
  ClipboardList,
  ShieldAlert,
  Users,
  Clock,
  Scale,
  FileSignature,
  Landmark,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Monitor,
  Info,
  User,
  LogOut,
  Mail,
  Lock,
  ShieldCheck,
  History,
} from "lucide-react";

// ==========================================
// GENERATORY DANYCH TESTOWYCH
// ==========================================

const getChannelIcon = (channelName) => {
  if (!channelName) return null;
  const name = channelName.toLowerCase();
  const tooltip = `Kanał: ${channelName}`;
  if (name.includes("www"))
    return <span title={tooltip}><Monitor size={16} className="text-slate-400 shrink-0" /></span>;
  if (name.includes("aplikacja"))
    return <span title={tooltip}><Smartphone size={16} className="text-slate-400 shrink-0" /></span>;
  if (name.includes("dokumenty"))
    return <span title={tooltip}><FileText size={16} className="text-slate-400 shrink-0" /></span>;
  return <span title={tooltip}><Layout size={16} className="text-slate-400 shrink-0" /></span>;
};

const genPrio = (i) => ({ c: i % 3, w: i % 4, m: (i % 3) + 2 });

const genErrors = (count, prefix) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `e-${prefix}-${i}`,
    title: `Zidentyfikowany błąd dostępności #${i + 1} - wymaga poprawy.`,
    criteria: [
      "1.1.1 Treść nietekstowa",
      "1.4.3 Kontrast",
      "2.1.1 Klawiatura",
      "3.3.2 Etykiety",
    ][i % 4],
    priority: ["Krytyczny", "Ważny", "Marginalny"][i % 3],
    status: i % 3 === 0 ? "W trakcie" : "Nowy",
  }));

const genViews = (count, prefix) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `v-${prefix}-${i}`,
    name: `Podstrona procesu / Ekran formularza #${i + 1}`,
    channel: i % 2 === 0 ? "WWW" : "Aplikacja",
    score: 60 + ((i * 7) % 40),
    priorities: genPrio(i),
    errors: genErrors((i % 3) + 2, `${prefix}-${i}`),
    history: [
      { date: "01.2024", score: 50 },
      { date: "02.2024", score: 65 },
      { date: "03.2024", score: 60 + ((i * 7) % 40) },
    ],
  }));

const genProcesses = (count, prefix) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `p-${prefix}-${i}`,
    name: `Automatyczny Proces Biznesowy #${i + 1}`,
    stats: {
      views: 8,
      totalViews: 8,
      score: 75 + ((i * 3) % 20),
      priorities: genPrio(i + 5),
    },
    views: genViews(8, `${prefix}-${i}`),
    history: [
      { date: "01.2024", score: 60 },
      { date: "02.2024", score: 70 },
      { date: "03.2024", score: 75 + ((i * 3) % 20) },
    ],
  }));

const genFlatErrors = (count, type) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `#${type}${100 + i}`,
    problem: `Wygenerowany problem testowy #${
      i + 1
    } opisujący błąd dostępności komponentu. Tło ma zbyt niski kontrast w stosunku do tekstu.`,
    recommendation: `Zalecana naprawa dla błędu #${
      i + 1
    }. Zaktualizuj kod źródłowy dodając odpowiednie tagi ARIA lub dostosuj wartości kolorów HEX w CSS.`,
    priority: ["Krytyczny", "Ważny", "Marginalny"][i % 3],
    channels: i % 2 === 0 ? ["WWW"] : ["Aplikacja", "WWW"],
    dateFound: `1${(i % 9) + 1}.03.2024`,
    criteria: ["1.3.1 Informacje", "1.4.3 Kontrast", "2.1.1 Klawiatura"][i % 3],
    auditViewName: `Widok audytowy ${i + 1}`,
    serviceViewName: `Widok usługi ${i + 1}`,
    processName: `Proces masowy ${(i % 5) + 1}`,
    serviceName: i % 2 === 0 ? "Usługi płatnicze" : "Kredyt hipoteczny",
    auditName: `Audyt okresowy Q1 - ${(i % 3) + 1}`,
    auditStatus: i % 2 === 0 ? "Zakończony" : "W trakcie",
    auditStart: "01.03.2024",
    auditEnd: i % 2 === 0 ? "15.03.2024" : "-",
  }));

const mockSharedServicesData = [
  {
    id: "s1",
    name: "Usługi płatnicze i powiązane z rachunkiem",
    stats: {
      processes: 15,
      views: 65,
      totalViews: 70,
      score: 82.4,
      priorities: { c: 2, w: 15, m: 40 },
    },
    history: [
      { date: "01.2024", score: 65 },
      { date: "02.2024", score: 72 },
      { date: "03.2024", score: 82.4 },
    ],
    processes: [
      {
        id: "p1",
        name: "Otwarcie ROR (istniejący)",
        stats: {
          views: 5,
          totalViews: 5,
          score: 85.2,
          priorities: { c: 0, w: 3, m: 5 },
        },
        history: [
          { date: "01.2024", score: 60 },
          { date: "02.2024", score: 75 },
          { date: "03.2024", score: 85.2 },
        ],
        views: [
          {
            id: "v1",
            name: "Strona główna ing.pl",
            channel: "WWW",
            score: 95.9,
            priorities: { c: 0, w: 0, m: 2 },
            history: [
              { date: "01.2024", score: 80 },
              { date: "02.2024", score: 90 },
              { date: "03.2024", score: 95.9 },
            ],
            errors: [
              {
                id: "e1",
                title: "Brak alternatywy tekstowej dla obrazka promocyjnego.",
                criteria: "1.1.1 Treść nietekstowa",
                priority: "Marginalny",
                status: "Nowy",
              },
              {
                id: "e2",
                title: "Zbyt niski kontrast tekstu w stopce.",
                criteria: "1.4.3 Kontrast",
                priority: "Marginalny",
                status: "Nowy",
              },
            ],
          },
          {
            id: "v2",
            name: "Formularz otwarcia - Krok 1",
            channel: "Aplikacja",
            score: 71.2,
            priorities: { c: 1, w: 3, m: 3 },
            history: [
              { date: "01.2024", score: 40 },
              { date: "02.2024", score: 60 },
              { date: "03.2024", score: 71.2 },
            ],
            errors: [
              {
                id: "e3",
                title: "Zbyt niski kontrast przycisku akceptacji regulaminu.",
                criteria: "1.4.3 Kontrast",
                priority: "Ważny",
                status: "Nowy",
              },
              {
                id: "e4",
                title: "Brak etykiety powiązanej z polem PESEL.",
                criteria: "3.3.2 Etykiety",
                priority: "Krytyczny",
                status: "Nowy",
              },
              {
                id: "e5",
                title: "Brak komunikatu o błędzie po wysłaniu formularza.",
                criteria: "4.1.3 Komunikaty",
                priority: "Ważny",
                status: "W trakcie",
              },
              {
                id: "e6",
                title: "Niedostępny z klawiatury element zamykający.",
                criteria: "2.1.1 Klawiatura",
                priority: "Ważny",
                status: "Nowy",
              },
            ],
          },
          ...genViews(6, "s1-p1-gen"),
        ],
      },
      ...genProcesses(14, "s1-gen"),
    ],
  },
  {
    id: "s2",
    name: "Kredyt hipoteczny (Wniosek i Kalkulator)",
    stats: {
      processes: 8,
      views: 32,
      totalViews: 40,
      score: 68.1,
      priorities: { c: 5, w: 22, m: 15 },
    },
    history: [
      { date: "01.2024", score: 45 },
      { date: "02.2024", score: 55 },
      { date: "03.2024", score: 68.1 },
    ],
    processes: genProcesses(8, "s2-gen"),
  },
];

const chartTrendData = [
  { m: "Kwi", s: 65, e: 40 },
  { m: "Maj", s: 68, e: 38 },
  { m: "Cze", s: 70, e: 35 },
  { m: "Lip", s: 72, e: 42 },
  { m: "Sie", s: 75, e: 30 },
  { m: "Wrz", s: 78, e: 25 },
  { m: "Paź", s: 80, e: 20 },
  { m: "Lis", s: 82, e: 18 },
  { m: "Gru", s: 85, e: 15 },
  { m: "Sty", s: 86, e: 12 },
  { m: "Lut", s: 86, e: 10 },
  { m: "Mar", s: 88, e: 8 },
];

// ==========================================
// GŁÓWNY LAYOUT (ZARZĄDZANIE STANEM LOGOWANIA)
// ==========================================

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState("przeglad");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div data-testid="app-container" className="flex flex-col md:flex-row h-screen w-full bg-[#f8fafc] font-['Figtree',_sans-serif] overflow-hidden text-slate-900 relative">
        {/* MOBILNY HEADER */}
        <div data-testid="mobile-header" className="md:hidden flex items-center justify-between bg-[#16161e] text-white px-5 py-4 z-30 relative shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0038F8] rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Eye size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg leading-none tracking-tight">
              WCAG AUDITOR
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* MOBILNY BACKDROP (TŁO ZACIEMNIAJĄCE) */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={() => setIsAuthenticated(false)}
        />

        {/* GŁÓWNA ZAWARTOŚĆ */}
        <main data-testid="main-content" className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc] relative z-10">
          {currentView === "przeglad" && (
            <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
              <DashboardView setView={setCurrentView} />
            </div>
          )}
          {currentView === "raporty" && (
            <RaportyView setView={setCurrentView} />
          )}
          {(currentView === "baza-uslug" ||
            currentView === "proces-szczegoly") && (
            <BazaUslugContainer
              currentView={currentView}
              setView={setCurrentView}
            />
          )}
          {currentView === "raport-szczegoly" && (
            <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
              <ReportSummaryView setView={setCurrentView} />
            </div>
          )}
          {currentView === "raport-bledy" && (
            <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
              <ReportErrorsView setView={setCurrentView} />
            </div>
          )}
          {currentView === "raportowanie" && <ReportingModuleView />}
        </main>
      </div>
    </>
  );
}

// ==========================================
// EKRAN LOGOWANIA
// ==========================================

function LoginView({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (onLogin) onLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');
      `}</style>

      <div data-testid="login-view" className="flex h-screen w-full bg-white font-['Figtree',_sans-serif] text-slate-900 overflow-hidden">
        {/* LEWA STRONA - FORMULARZ LOGOWANIA */}
        <div data-testid="login-form-container" className="w-full lg:w-[500px] xl:w-[600px] flex flex-col p-8 sm:p-12 lg:p-16 relative z-10 bg-white overflow-y-auto">
          <div className="w-full max-w-[400px] mx-auto flex flex-col h-full min-h-[500px]">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-[#0038F8] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#0038F8]/20 flex-shrink-0">
                <Eye size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-slate-900 font-extrabold text-xl leading-none tracking-tight">
                  WCAG
                </span>
                <span className="text-[#0038F8] text-[11px] font-black tracking-[0.25em] mt-1 uppercase">
                  Auditor
                </span>
              </div>
            </div>

            {/* Główny formularz */}
            <div className="w-full my-auto py-12">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                  Witaj z powrotem
                </h1>
                <p className="text-slate-500 font-medium">
                  Zaloguj się, aby zarządzać dostępnością cyfrową w swojej
                  organizacji.
                </p>
              </div>

              <form data-testid="login-form" onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700">
                    Adres e-mail
                  </label>
                  <div className="relative flex items-center group">
                    <Mail
                      className="absolute left-4 text-slate-400 group-focus-within:text-[#0038F8] transition-colors"
                      size={20}
                    />
                    <input
                      data-testid="login-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jan.kowalski@firma.pl"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 focus:border-[#0038F8] transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[13px] font-bold text-slate-700">
                      Hasło
                    </label>
                    <a
                      href="#"
                      className="text-[13px] font-bold text-[#0038F8] hover:text-[#002ECC] transition-colors"
                    >
                      Zapomniałeś hasła?
                    </a>
                  </div>
                  <div className="relative flex items-center group">
                    <Lock
                      className="absolute left-4 text-slate-400 group-focus-within:text-[#0038F8] transition-colors"
                      size={20}
                    />
                    <input
                      data-testid="login-password-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-12 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 focus:border-[#0038F8] transition-all bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:text-[#0038F8]"
                      aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group w-max mt-2">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 rounded border-2 border-slate-300 peer-checked:border-[#0038F8] peer-checked:bg-[#0038F8] transition-all flex items-center justify-center">
                      <CheckCircle2
                        size={14}
                        className="text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                    Zapamiętaj mnie na tym urządzeniu
                  </span>
                </label>

                <button
                  data-testid="login-submit-button"
                  type="submit"
                  className="w-full bg-[#0038F8] hover:bg-[#002ECC] text-white py-4 rounded-xl font-bold shadow-[0_4px_14px_rgba(0,56,248,0.25)] hover:shadow-[0_6px_20px_rgba(0,56,248,0.3)] transition-all flex items-center justify-center gap-2 mt-6 group"
                >
                  Zaloguj się do panelu
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </form>

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Lub kontynuuj przez
                </span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-700 transition-colors shadow-sm"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23C14.97 23 17.16 22.02 18.72 20.34L15.71 17.58C14.73 18.24 13.48 18.64 12 18.64C9.14 18.64 6.7 16.71 5.84 14.11H2.15V16.97C3.96 20.57 7.7 23 12 23Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.11C5.62 13.45 5.49 12.74 5.49 12C5.49 11.26 5.62 10.55 5.84 9.89V7.03H2.15C1.4 8.52 0.96 10.2 0.96 12C0.96 13.8 1.4 15.48 2.15 16.97L5.84 14.11Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.36C13.62 5.36 15.06 5.92 16.2 7.02L19.35 3.87C17.15 1.86 14.97 1 12 1C7.7 1 3.96 3.43 2.15 7.03L5.84 9.89C6.7 7.29 9.14 5.36 12 5.36Z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-700 transition-colors shadow-sm"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 0H0V10H10V0Z" fill="#F25022" />
                    <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
                    <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
                    <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
                  </svg>
                  Microsoft
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="text-[#0038F8] shrink-0 mt-0.5"
                />
                <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                  Logowanie objęte jest korporacyjnymi zasadami bezpieczeństwa.
                  Wpisując dane potwierdzasz zgodność z{" "}
                  <a
                    href="#"
                    className="text-[#0038F8] font-bold hover:underline"
                  >
                    Polityką Bezpieczeństwa
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Stopka */}
            <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-400 gap-4 shrink-0">
              <span>© 2026 Widzialni.eu</span>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-slate-600 transition-colors">
                  Pomoc
                </a>
                <a href="#" className="hover:text-slate-600 transition-colors">
                  Polityka Prywatności
                </a>
                <a href="#" className="hover:text-slate-600 transition-colors">
                  Zgłoś problem
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* PRAWA STRONA - MARKETING / BRANDING */}
        <div className="hidden lg:flex lg:flex-1 relative bg-[#0038F8] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0038F8] via-[#002ECC] to-[#001766]"></div>
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#00D4FF]/20 blur-3xl mix-blend-overlay"></div>

          <div className="relative z-10 flex flex-col justify-center items-center w-full p-16 h-full text-white">
            <div className="max-w-[500px] w-full">
              <div className="w-full bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-6 mb-12 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex items-end gap-4 mb-8">
                  <div className="w-1/3 bg-white/10 h-24 rounded-lg border border-white/5 relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-1/2 bg-[#00D4FF]/30"></div>
                  </div>
                  <div className="w-1/3 bg-white/10 h-32 rounded-lg border border-white/5 relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-3/4 bg-[#00D4FF]/50"></div>
                  </div>
                  <div className="w-1/3 bg-white/20 h-40 rounded-lg border border-white/20 relative overflow-hidden shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                    <div className="absolute bottom-0 w-full h-[90%] bg-[#00D4FF]"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-3 bg-white/10 rounded-full"></div>
                  <div className="w-4/5 h-3 bg-white/10 rounded-full"></div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#00D4FF] mb-6 uppercase tracking-widest backdrop-blur-sm">
                <CheckCircle2 size={14} /> Pełne wsparcie WCAG 2.2
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-6">
                Nowy wymiar audytów <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-white">
                  dostępności cyfrowej.
                </span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed font-medium mb-12">
                Zarządzaj błędami WCAG, monitoruj SLA zespołów i generuj
                deklaracje PAD z jednego, scentralizowanego miejsca.
              </p>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <p className="italic text-white/90 text-sm mb-4">
                  "Wdrożenie WCAG Auditora pozwoliło nam skrócić czas naprawy
                  błędów krytycznych o 40% i uporządkować współpracę z
                  dostawcami."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold">
                    AK
                  </div>
                  <div>
                    <div className="font-bold text-sm">Anna Kowalczyk</div>
                    <div className="text-xs text-blue-200">
                      Accessibility Lead, Duży Bank SA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// POZOSTAŁE KOMPONENTY GŁÓWNE
// ==========================================

function Sidebar({
  currentView,
  setCurrentView,
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLogout,
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const menuItems = [
    { id: "przeglad", label: "Przegląd", icon: LayoutGrid },
    { id: "raporty", label: "Audyty", icon: ClipboardCheck },
    { id: "baza-uslug", label: "Baza Usług", icon: Library },
    { id: "raportowanie", label: "Raportowanie", icon: BarChart2 },
  ];

  return (
    <aside
      data-testid="sidebar"
      className={`
      fixed md:relative z-50 h-full bg-[#16161e] text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out
      ${
        isMobileMenuOpen
          ? "translate-x-0 shadow-2xl"
          : "-translate-x-full md:translate-x-0"
      }
      ${isCollapsed ? "md:w-[88px] w-[280px]" : "w-[280px]"}
    `}
    >
      <div
        className={`flex ${
          isCollapsed
            ? "items-center justify-center md:flex-col md:justify-center md:gap-4 px-4 md:px-0 py-6 md:py-8"
            : "items-center justify-between px-6 py-8"
        } overflow-hidden`}
      >
        <div className={`flex items-center gap-3 ${isCollapsed ? "md:hidden" : ""}`}>
          <div className="w-8 h-8 bg-[#0038F8] rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Eye size={20} strokeWidth={2.5} />
          </div>
          <div
            className={`flex flex-col whitespace-nowrap ${
              isCollapsed ? "md:hidden" : ""
            }`}
          >
            <span className="text-white font-bold text-lg leading-none tracking-tight">
              WCAG
            </span>
            <span className="text-slate-400 text-[10px] font-semibold tracking-[0.2em] mt-1">
              AUDITOR
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800 w-8 h-8 rounded-lg transition-colors"
            title={isCollapsed ? "Rozwiń menu" : "Zwiń menu"}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-500 hover:text-white p-1 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2 overflow-hidden">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setIsMobileMenuOpen(false);
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? "md:justify-center px-4 md:px-0" : "gap-3 px-4"
              } py-3.5 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white text-[#0038F8] shadow-sm"
                  : "text-white hover:bg-slate-800/50"
              }`}
            >
              <Icon
                size={20}
                className={
                  isActive
                    ? "text-[#0038F8] flex-shrink-0"
                    : "text-white flex-shrink-0"
                }
              />
              <span
                className={`text-sm whitespace-nowrap ${
                  isCollapsed ? "md:hidden" : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto relative">
        {isProfileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsProfileMenuOpen(false)}
            ></div>
            <div
              className={`absolute bottom-full mb-2 bg-[#1e1e2d] border border-slate-700/50 shadow-xl rounded-xl z-50 py-2 overflow-hidden transition-all ${
                isCollapsed ? "left-4 w-48" : "left-4 right-4"
              }`}
            >
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <User size={16} className="shrink-0" />
                <span>Mój profil</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
              >
                <LogOut size={16} className="shrink-0" />
                <span>Wyloguj</span>
              </button>
            </div>
          </>
        )}

        <div
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className={`flex items-center ${
            isCollapsed ? "md:justify-center" : "justify-between px-2"
          } py-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer overflow-hidden ${
            isProfileMenuOpen ? "bg-slate-800/50" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4"
              alt="P. Smułkowski"
              className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 object-cover flex-shrink-0"
            />
            <div
              className={`flex flex-col text-left whitespace-nowrap ${
                isCollapsed ? "md:hidden" : ""
              }`}
            >
              <span className="text-white text-sm font-semibold">
                P. Smułkowski
              </span>
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-0.5">
                Admin
              </span>
            </div>
          </div>
          <MoreVertical
            size={16}
            className={`text-slate-500 flex-shrink-0 transition-transform ${
              isProfileMenuOpen ? "rotate-90" : ""
            } ${isCollapsed ? "md:hidden" : ""}`}
          />
        </div>
      </div>
    </aside>
  );
}

function DashboardView({ setView }) {
  return (
    <div data-testid="dashboard-view" className="max-w-[1400px] flex flex-col gap-6 w-full">
      <div className="mb-2 sm:mb-4">
        <h1 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
          Przegląd główny
        </h1>
        <p className="text-slate-500 text-sm">
          Witaj Piotr, oto podsumowanie stanu dostępności w Twojej organizacji
          na dziś.
        </p>
      </div>

      {/* RZĄD 1: Główne KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card
          className="p-6 hover:border-[#0038F8]/30 transition-colors cursor-pointer"
          onClick={() => setView("raportowanie")}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <Badge variant="success" className="text-[10px]">
              +2.4% r/r
            </Badge>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Średnia Dostępność
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              86.2%
            </span>
            <span className="text-sm font-semibold text-slate-400">
              Cel: 90%
            </span>
          </div>
        </Card>

        <Card
          className="p-6 hover:border-[#0038F8]/30 transition-colors cursor-pointer"
          onClick={() => setView("baza-uslug")}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0038F8]/10 text-[#0038F8] flex items-center justify-center">
              <ListChecks size={24} />
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 bg-slate-100 px-2 py-0.5 rounded">
              142 procesy
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Pokrycie Audytowe
          </span>
          <span className="text-3xl font-extrabold text-slate-900">92.0%</span>
        </Card>

        <Card
          className="p-6 hover:border-red-300 transition-colors cursor-pointer"
          onClick={() => setView("raportowanie")}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <AlertOctagon size={24} />
            </div>
            <Badge variant="danger" className="text-[10px]">
              +12 m/m
            </Badge>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Krytyczne Błędy Otwarte
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">47</span>
            <span className="text-sm font-semibold text-red-500">
              Wymaga akcji!
            </span>
          </div>
        </Card>

        <Card
          className="p-6 hover:border-blue-300 transition-colors cursor-pointer"
          onClick={() => setView("raporty")}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <ClipboardCheck size={24} />
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded mt-1">
              W tym kwartale
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Przeprowadzone Audyty
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">12</span>
            <span className="text-sm font-semibold text-slate-400">
              4 w trakcie
            </span>
          </div>
        </Card>
      </div>

      {/* RZĄD 2: Trendy i Kanały */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wykres Liniowy: Trend */}
        <Card className="p-4 sm:p-6 flex flex-col h-[340px] sm:h-[380px] lg:col-span-2">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Trend dostępności vs Błędy w czasie
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Ostatnie 12 miesięcy w całej organizacji
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="flex flex-1 min-h-0 mt-2">
            <div className="w-8 shrink-0 flex flex-col justify-between items-end pb-8 pt-12 pr-2 text-[10px] font-bold text-slate-400 border-r border-slate-200 z-10 bg-white">
              <span className="leading-none">100</span>
              <span className="leading-none">50</span>
              <span className="leading-none translate-y-1">0</span>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-end gap-1 sm:gap-2 border-b border-slate-200 pt-12 px-2 sm:px-4">
                {chartTrendData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 flex justify-center items-end h-full relative group"
                  >
                    <div
                      className="w-full max-w-[32px] bg-[#0038F8]/20 group-hover:bg-[#0038F8]/30 transition-colors rounded-t-md relative z-10 flex items-start justify-center"
                      style={{ height: `${val.s}%` }}
                    >
                      <div className="absolute -top-1.5 w-2 h-2 rounded-full bg-[#0038F8] border-2 border-white"></div>
                    </div>
                    <div
                      className="absolute bottom-0 w-1/2 max-w-[16px] bg-red-100 group-hover:bg-red-200 transition-colors rounded-t-sm"
                      style={{ height: `${val.e}%` }}
                    ></div>

                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded z-20 whitespace-nowrap pointer-events-none hidden sm:block shadow-lg">
                      Dostępność: {val.s}% | Błędy: {val.e}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-8 flex items-start gap-1 sm:gap-2 w-full shrink-0 pt-2 px-2 sm:px-4">
                {chartTrendData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-[10px] sm:text-[11px] font-bold text-slate-500"
                  >
                    {val.m}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-2 shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <div className="w-3 h-3 rounded-full bg-[#0038F8]"></div> %
              Dostępności
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <div className="w-3 h-3 rounded bg-red-200"></div> Liczba nowych
              błędów
            </div>
          </div>
        </Card>

        {/* Wykres Paskowy Poziomy: Kanały */}
        <Card className="p-6 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">
              Zgodność kanałów
            </h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>WWW</span> <span>94%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: "94%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Aplikacja (iOS)</span> <span>82%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#0038F8] h-full rounded-full"
                  style={{ width: "82%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Aplikacja (Android)</span> <span>78%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#0038F8] h-full rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Dokumenty (PDF/DOC)</span> <span>45%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* RZĄD 3: Listy akcji i ostatnie audyty */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Ostatnie audyty
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Szybki podgląd prowadzonych prac
              </span>
            </div>
            <button className="text-[#0038F8] bg-[#0038F8]/5 hover:bg-[#0038F8]/10 p-2 rounded-xl transition-colors">
              <Plus size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {[
              {
                id: 1,
                date: "12.03.2026",
                status: "Zakończony",
                tag: "ING",
                title: "Strona ing.pl - wybrane podstrony",
                score: "77.5%",
                statusVariant: "success",
              },
              {
                id: 2,
                date: "15.04.2026",
                status: "W trakcie",
                tag: "mBank",
                title: "Serwis transakcyjny - Nowy Dashboard",
                score: "62.1%",
                statusVariant: "warning",
              },
              {
                id: 3,
                date: "05.06.2026",
                status: "Nowy",
                tag: "ING",
                title: "Proces reklamacyjny - formularze",
                score: "-",
                statusVariant: "info",
              },
            ].map((audit) => (
              <div
                key={audit.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer group"
                onClick={() => setView("raport-szczegoly")}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={audit.statusVariant}
                      className="!py-0.5 !text-[10px] w-[80px] justify-center"
                    >
                      {audit.status}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {audit.tag}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-slate-800 group-hover:text-[#0038F8] transition-colors line-clamp-1">
                    {audit.title}
                  </span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                    <Calendar size={12} /> {audit.date}
                  </span>
                  <span
                    className={`text-[13px] font-extrabold ${
                      audit.score === "-"
                        ? "text-slate-400"
                        : parseFloat(audit.score) >= 80
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }`}
                  >
                    {audit.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setView("raporty")}
            className="w-full mt-4 text-[13px] font-bold text-[#0038F8] hover:bg-[#0038F8]/5 py-2.5 rounded-xl transition-colors border border-[#0038F8]/10"
          >
            Przejdź do modułu Audytów
          </button>
        </Card>

        <Card className="p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Wymagające uwagi (Top 5)
              </h3>
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
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer"
                onClick={() => setView("baza-uslug")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-red-50 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-800 line-clamp-1">
                      {u.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">
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
                  className="w-14 sm:w-16 justify-center !py-1 shrink-0 ml-2"
                >
                  {u.score}%
                </Badge>
              </div>
            ))}
          </div>
          <button
            onClick={() => setView("raportowanie")}
            className="w-full mt-4 text-[13px] font-bold text-[#0038F8] hover:bg-[#0038F8]/5 py-2.5 rounded-xl transition-colors border border-[#0038F8]/10"
          >
            Zobacz pełny ranking w raportach
          </button>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// GLOBALNE KOMPONENTY UI
// ==========================================

function Card({ children, className = "", ...props }) {
  return (
    <div
      data-testid="card"
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function Badge({ children, variant = "neutral", className = "", title }) {
  const variants = {
    success: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border border-amber-100",
    danger: "bg-red-50 text-red-600 border border-red-100",
    info: "bg-[#0038F8]/10 text-[#0038F8]",
    neutral: "bg-slate-100 text-slate-600 border border-slate-200",
    lightBlue: "bg-[#0038F8]/5 text-slate-700",
  };
  return (
    <span
      data-testid="badge"
      title={title}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// Unified PriorityBadge component with icons for consistent error display
function PriorityBadge({ priority, size = "default" }) {
  const sizeClasses = size === "small" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  
  const config = {
    "Krytyczny": {
      icon: AlertOctagon,
      iconSize: size === "small" ? 12 : 14,
      className: "bg-red-50 text-red-600 border border-red-100",
    },
    "Ważny": {
      icon: AlertTriangle,
      iconSize: size === "small" ? 12 : 14,
      className: "bg-orange-50 text-orange-600 border border-orange-100",
    },
    "Marginalny": {
      icon: Info,
      iconSize: size === "small" ? 12 : 14,
      className: "bg-blue-50 text-blue-600 border border-blue-100",
    },
  };

  const { icon: Icon, iconSize, className } = config[priority] || {
    icon: AlertCircle,
    iconSize: size === "small" ? 12 : 14,
    className: "bg-slate-100 text-slate-600 border border-slate-200",
  };

  return (
    <span data-testid="priority-badge" className={`inline-flex items-center gap-1.5 rounded-xl font-semibold border ${className} ${sizeClasses}`}>
      <Icon size={iconSize} className="flex-shrink-0" />
      {priority}
    </span>
  );
}

function Input({ icon: Icon, className = "", ...props }) {
  return (
    <div data-testid="input-container" className={`relative flex items-center ${className}`}>
      {Icon && <Icon className="absolute left-4 text-slate-400" size={18} />}
      <input
        data-testid="input"
        className={`w-full bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 transition-shadow ${
          Icon ? "pl-11 pr-4 py-3.5" : "px-4 py-3.5"
        }`}
        {...props}
      />
    </div>
  );
}

function ShowMoreToggle({ isExpanded, onToggle, total, visibleCount, label }) {
  if (total <= visibleCount) return null;
  return (
    <button
      data-testid="show-more-toggle"
      onClick={onToggle}
      className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 text-[13px] font-bold text-[#0038F8] hover:text-[#002ECC] bg-[#0038F8]/5 hover:bg-[#0038F8]/10 rounded-xl transition-colors border border-[#0038F8]/10 shadow-sm"
    >
      {isExpanded
        ? "Zwiń listę"
        : `Rozwiń pozostałe (${total - visibleCount}) ${label}`}
      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );
}

function PriorityStats({ c = 0, w = 0, m = 0 }) {
  return (
    <div data-testid="priority-stats" className="flex items-center gap-1 sm:gap-0">
      <div data-testid="priority-critical" className="flex items-center gap-1 w-10 sm:w-12 shrink-0 justify-center" title={`Błędy krytyczne: ${c}`}>
        <AlertOctagon
          size={16}
          className={c > 0 ? "text-red-500" : "text-slate-400"}
        />
        <span
          className={`font-bold text-sm ${
            c > 0 ? "text-slate-800" : "text-slate-500"
          }`}
        >
          {c}
        </span>
      </div>
      <div className="flex items-center gap-1 w-10 sm:w-12 shrink-0 justify-center" title={`Błędy ważne: ${w}`}>
        <AlertTriangle
          size={16}
          className={w > 0 ? "text-amber-500" : "text-slate-400"}
        />
        <span
          className={`font-bold text-sm ${
            w > 0 ? "text-slate-800" : "text-slate-500"
          }`}
        >
          {w}
        </span>
      </div>
      <div className="flex items-center gap-1 w-10 sm:w-12 shrink-0 justify-center" title={`Błędy marginalne: ${m}`}>
        <Info
          size={16}
          className={m > 0 ? "text-blue-500" : "text-slate-400"}
        />
        <span
          className={`font-bold text-sm ${
            m > 0 ? "text-slate-800" : "text-slate-500"
          }`}
        >
          {m}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// BAZA USŁUG
// ==========================================

function BazaUslugContainer({ currentView, setView }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <div data-testid="baza-uslug-container" className="flex flex-col md:flex-row h-full w-full">
      <ServicesSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        setView={setView}
      />
      <div className="flex-1 overflow-auto p-4 sm:p-8 lg:p-12 min-h-0">
        {currentView === "baza-uslug" ? (
          <ProcessListView setView={setView} />
        ) : (
          <ProcessDetailsView setView={setView} />
        )}
      </div>
    </div>
  );
}

function ServicesSidebar({ isCollapsed, setIsCollapsed, setView }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");

  const handleFolderClick = (title) => {
    setSelectedItemName(title);
    if (setView) setView("baza-uslug");
    if (window.innerWidth < 768) setIsMobileOpen(false);
  };

  const handleItemClick = (e, title) => {
    if (e) e.stopPropagation();
    setSelectedItemName(title);
    if (setView) setView("proces-szczegoly");
    if (window.innerWidth < 768) setIsMobileOpen(false);
  };

  return (
    <div
      className={`
      bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300 z-20 shadow-sm md:shadow-none overflow-visible relative
      ${isCollapsed ? "md:w-0" : "w-full md:w-[320px]"}
    `}
    >
      {/* Przycisk rozwijania - widoczny tylko na desktop */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsCollapsed(!isCollapsed);
        }}
        className={`hidden md:flex items-center justify-center w-8 h-8 transition-all duration-300 z-50
          ${isCollapsed
            ? "absolute left-0 top-[23px] bg-slate-900 text-white hover:bg-slate-800 rounded-r-lg rounded-l-none"
            : "absolute right-[15px] top-[23px] bg-slate-100 text-slate-700 hover:bg-[#0038F8] hover:text-white rounded-lg"
          }
        `}
        title={isCollapsed ? "Rozwiń filtry" : "Zwiń filtry"}
      >
        {isCollapsed ? (
          <ChevronRight size={20} />
        ) : (
          <ChevronLeft size={20} />
        )}
      </button>

      <div
        className={`p-4 md:p-6 flex items-center ${
          isCollapsed ? "md:justify-center px-2" : "justify-between"
        } cursor-pointer md:cursor-default transition-colors duration-200
          ${
            isMobileOpen
              ? "bg-slate-900 text-white border-b border-slate-800"
              : "bg-[#0038F8] text-white md:bg-white md:text-slate-900 border-b border-[#002ECC] md:border-slate-100"
          }
        `}
        onClick={() => {
          if (window.innerWidth < 768) {
            setIsMobileOpen(!isMobileOpen);
          }
        }}
      >
        <div
          className={`flex items-center gap-2 md:gap-3 min-w-0 pr-2 ${
            isCollapsed ? "md:hidden" : ""
          }`}
        >
          <Library
            size={18}
            className={`flex-shrink-0 ${
              isMobileOpen ? "text-slate-400 md:hidden" : "text-white md:hidden"
            }`}
          />
          <h2
            className={`text-[15px] md:text-lg font-bold min-w-0 truncate ${
              isCollapsed ? "md:hidden" : ""
            }`}
          >
            <span className="md:hidden flex items-center gap-2 truncate">
              {isMobileOpen ? (
                "Drzewo struktury"
              ) : selectedItemName ? (
                <>
                  <CheckCircle2
                    size={16}
                    className="text-white md:text-emerald-600 flex-shrink-0"
                  />
                  <span className="truncate">Wybrano: {selectedItemName}</span>
                </>
              ) : (
                "Wybierz usługę z bazy"
              )}
            </span>
            <span className="hidden md:block">Struktura Usług</span>
          </h2>
        </div>
        <button
          className={`md:hidden p-1.5 transition-colors rounded-lg flex-shrink-0 ${
            isMobileOpen
              ? "bg-slate-800 text-slate-400 hover:text-white"
              : "bg-white/20 text-white"
          }`}
        >
          {isMobileOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      <div
        className={`flex-col md:flex-1 md:overflow-hidden ${
          isCollapsed ? "md:hidden" : ""
        } ${isMobileOpen ? "flex" : "hidden md:flex"}`}
      >
        <div className="p-4 border-b border-slate-100 shrink-0">
          <Input
            icon={Search}
            placeholder="Szukaj usługi..."
            className="bg-slate-50"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1 max-h-[60vh] md:max-h-none">
          <TreeFolder
            title="Kredyt konsumencki"
            count={0}
            onFolderClick={handleFolderClick}
          />
          <TreeFolder
            title="Kredyt hipoteczny"
            count={0}
            onFolderClick={handleFolderClick}
          />
          <TreeFolder
            title="Wskazane w ustawie usługi m..."
            count={0}
            onFolderClick={handleFolderClick}
          />
          <TreeFolder
            title="Usługi płatnicze i powiązane z rach..."
            count={50}
            isActive
            isOpen
            onFolderClick={handleFolderClick}
          >
            <TreeItem
              title="Zamknięcie konta z saldem dodatnim..."
              onClick={handleItemClick}
            />
            <TreeItem
              title="Otwarcie ROR (istniejący dorosły kli..."
              isActive
              onClick={handleItemClick}
            />
            <TreeItem
              title="Przelew krajowy - desktop"
              onClick={handleItemClick}
            />
            <TreeItem
              title="Przelew krajowy - mobile"
              onClick={handleItemClick}
            />
            <TreeItem
              title="Przelew zagraniczny SWIFT"
              onClick={handleItemClick}
            />
            <TreeItem title="Przelew SEPA" onClick={handleItemClick} />
            <TreeItem
              title="Zlecenie stałe - założenie"
              onClick={handleItemClick}
            />
          </TreeFolder>
        </div>
      </div>
    </div>
  );
}

function TreeFolder({
  title,
  count,
  isActive,
  isOpen = false,
  children,
  onFolderClick,
}) {
  const [expanded, setExpanded] = useState(isOpen);

  const handleClick = () => {
    setExpanded(!expanded);
    if (onFolderClick) onFolderClick(title);
  };

  return (
    <div className="flex flex-col mb-1.5 min-w-0">
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors min-w-0 ${
          isActive
            ? "bg-[#0038F8] text-white shadow-sm"
            : "hover:bg-slate-50 text-slate-700"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <Folder
            size={18}
            className={`flex-shrink-0 ${
              isActive ? "text-white" : "text-[#0038F8]"
            }`}
            fill={isActive ? "currentColor" : "none"}
          />
          <span className="text-sm font-semibold truncate text-left">
            {title}
          </span>
        </div>
        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
            isActive
              ? "bg-[#0038F8]/80 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {count}
        </span>
      </button>
      {expanded && children && (
        <div className="flex flex-col mt-2 pl-[22px] ml-4 border-l-2 border-slate-100 py-1 space-y-1.5 relative">
          {children}
        </div>
      )}
    </div>
  );
}

function TreeItem({ title, isActive, onClick }) {
  return (
    <button
      data-testid={`tree-item-${title.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={(e) => {
        if (onClick) onClick(e, title);
      }}
      className="w-full flex items-center gap-3 px-3 py-1.5 transition-colors text-left group min-w-0"
    >
      <div
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 relative -left-[27px] ${
          isActive ? "bg-[#0038F8]" : "bg-slate-300 group-hover:bg-slate-400"
        }`}
      />
      <span
        className={`text-[13px] truncate relative -left-3 ${
          isActive
            ? "text-[#0038F8] font-bold"
            : "text-slate-500 font-medium group-hover:text-slate-700"
        }`}
      >
        {title}
      </span>
    </button>
  );
}

function ProcessListView({ setView }) {
  return (
    <div data-testid="process-list-view" className="max-w-[1000px] w-full">
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        <Folder size={14} className="text-slate-400" />
        <span>BAZA USŁUG</span>
        <ChevronRight size={14} />
        <span className="text-[#0038F8]">PROCESY</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl">
          Usługi płatnicze i powiązane z rachunkiem płatniczym
        </h1>
        <button className="flex items-center justify-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-2.5 text-sm font-bold rounded-xl shadow-sm transition-colors w-full sm:w-auto">
          <Plus size={16} /> Nowy Proces
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-sm font-semibold text-slate-500">
          Zarządzanie procesami
        </h2>
        <span className="bg-[#0038F8] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          50
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <ProcessCard
          title="Zamknięcie konta z saldem"
          views="5 / 5"
          score="100%"
          scoreVariant="success"
          issues="5"
          onClick={() => setView("proces-szczegoly")}
        />
        <ProcessCard
          title="Otwarcie ROR (istniejący)"
          views="12 / 12"
          score="85.2%"
          scoreVariant="warning"
          issues="5"
          onClick={() => setView("proces-szczegoly")}
        />
        <ProcessCard
          title="Otwarcie ROR (nowy)"
          views="9 / 11"
          score="97.05%"
          scoreVariant="success"
          issues="5"
          onClick={() => setView("proces-szczegoly")}
        />
        <ProcessCard
          title="Przelew krajowy - desktop"
          views="6 / 6"
          score="94.5%"
          scoreVariant="success"
          issues="5"
          onClick={() => setView("proces-szczegoly")}
        />
        <ProcessCard
          title="Przelew krajowy - mobile"
          views="5 / 5"
          score="92%"
          scoreVariant="success"
          issues="5"
          onClick={() => setView("proces-szczegoly")}
        />
        <ProcessCard
          title="Przelew zagraniczny SWIFT"
          views="8 / 10"
          score="88.3%"
          scoreVariant="warning"
          issues="5"
          onClick={() => setView("proces-szczegoly")}
        />
        <ProcessCard
          title="Przelew SEPA"
          views="7 / 7"
          score="91.7%"
          scoreVariant="success"
          issues="5"
          onClick={() => setView("proces-szczegoly")}
        />
      </div>
    </div>
  );
}

function ProcessCard({ title, views, score, scoreVariant, issues, onClick }) {
  return (
    <Card
      data-testid="process-card"
      className="flex flex-col sm:flex-row sm:items-center p-4 sm:p-5 gap-4 hover:border-[#0038F8]/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 w-full sm:flex-1">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100/80 group-hover:bg-[#0038F8]/10 group-hover:text-[#0038F8] rounded-xl flex items-center justify-center text-slate-400 border border-slate-200/50 transition-colors flex-shrink-0">
          <Layout size={18} />
        </div>
        <h3 className="text-[15px] sm:text-[17px] font-bold text-slate-800 group-hover:text-[#0038F8] transition-colors truncate flex-1">
          {title}
        </h3>
      </div>
      <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-8 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 h-3 flex items-end">
            Widoki
          </span>
          <div className="h-7 flex items-center justify-center">
            <span className="text-[13px] sm:text-[15px] font-bold text-slate-700">
              {views}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 h-3 flex items-end">
            Dostępność
          </span>
          <div className="h-7 flex items-center justify-end w-full">
            <span className={`text-[13px] sm:text-[15px] font-bold ${
              scoreVariant === 'success' ? 'text-emerald-600' :
              scoreVariant === 'warning' ? 'text-amber-500' :
              scoreVariant === 'danger' ? 'text-red-600' :
              'text-slate-700'
            }`}>
              {score}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 h-3 flex items-end">
            Reklamacje
          </span>
          <div className="h-7 flex items-center justify-center w-full">
            <span className="bg-slate-100 text-slate-600 text-[11px] sm:text-[13px] font-bold px-3 sm:px-4 py-0.5 sm:py-1 rounded-xl text-center">
              {issues}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 z-10 w-full sm:w-auto justify-end mt-2 sm:mt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors bg-white"
        >
          <Pencil size={14} className="sm:w-[18px] sm:h-[18px]" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors bg-white"
        >
          <Trash2 size={14} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>
    </Card>
  );
}

function ProcessDetailsView({ setView }) {
  return (
    <div data-testid="process-details-view" className="max-w-[1000px] w-full">
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        <Folder size={14} className="text-slate-400" />
        <span>BAZA USŁUG</span>
        <ChevronRight size={14} />
        <span className="text-[#0038F8]">PROCESY</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <h1 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl">
          Otwarcie ROR (istniejący dorosły klient)
        </h1>
        <div className="flex items-center gap-3 mt-1 w-full sm:w-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setView("baza-uslug");
            }}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Powrót
          </button>
          <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-sm">
            <Plus size={16} /> Nowy Widok
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <StepItem
          number="1"
          title="Strona główna ing.pl"
          subtitle="Strona główna"
          channel="WWW"
          score="95.92%"
          scoreVariant="success"
          priorities={4}
          warnings={0}
          marginals={2}
          actionType="open"
          onOpenAudit={() => setView("raport-szczegoly")}
        />
        <StepItem
          number="2"
          title='Podstrona "Konta"'
          titleIcon={<CheckCircle2 className="text-emerald-500" size={16} />}
          subtitle='Podstrona "konta"'
          channel="WWW"
          score="100%"
          scoreVariant="success"
          priorities={0}
          warnings={0}
          marginals={0}
          actionType="open"
          onOpenAudit={() => setView("raport-szczegoly")}
        />
        <StepItem
          number="3"
          title="Konto Direct"
          subtitle="Brak przypisanego audytu"
          subtitleWarning={true}
          channel="Aplikacja"
          score="80%"
          scoreVariant="warning"
          priorities={6}
          warnings={0}
          marginals={3}
          actionType="assign"
        />
      </div>
    </div>
  );
}

function StepItem({
  number,
  title,
  titleIcon,
  subtitle,
  subtitleWarning,
  channel,
  score,
  scoreVariant,
  priorities,
  warnings,
  marginals = 0,
  actionType,
  onOpenAudit,
}) {
  return (
    <Card
      data-testid="step-item"
      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between bg-white hover:border-[#0038F8]/30 transition-all duration-300 gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm sm:text-lg flex-shrink-0">
          {number}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-slate-900 text-[15px] sm:text-[17px]">
              {title}
            </span>
            {titleIcon}
          </div>
          <div className="flex items-center gap-1.5">
            {subtitleWarning ? (
              <AlertTriangle size={14} className="text-red-500" />
            ) : (
              <Link2 size={14} className="text-[#0038F8]" />
            )}
            <span
              className={`text-xs sm:text-sm font-medium ${
                subtitleWarning ? "text-red-500" : "text-slate-500"
              }`}
            >
              {subtitle}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-3 border-t sm:border-none border-slate-100 pt-3 sm:pt-0">
        <div className="flex items-center gap-3 sm:gap-4 sm:border-r border-slate-100 sm:pr-4">
          <div className="flex items-center gap-1.5 w-8 sm:w-9">
            <AlertOctagon
              size={14}
              className={priorities > 0 ? "text-red-500" : "text-slate-400"}
            />
            <span
              className={`font-bold text-[13px] sm:text-[15px] ${
                priorities > 0 ? "text-slate-800" : "text-slate-500"
              }`}
            >
              {priorities}
            </span>
          </div>
          <div className="flex items-center gap-1.5 w-8 sm:w-9">
            <AlertTriangle
              size={14}
              className={warnings > 0 ? "text-amber-500" : "text-slate-400"}
            />
            <span
              className={`font-bold text-[13px] sm:text-[15px] ${
                warnings > 0 ? "text-slate-800" : "text-slate-500"
              }`}
            >
              {warnings}
            </span>
          </div>
          <div className="flex items-center gap-1.5 w-8 sm:w-9">
            <Info
              size={14}
              className={marginals > 0 ? "text-blue-500" : "text-slate-400"}
            />
            <span
              className={`font-bold text-[13px] sm:text-[15px] ${
                marginals > 0 ? "text-slate-800" : "text-slate-500"
              }`}
            >
              {marginals}
            </span>
          </div>
          <Badge
            variant={scoreVariant}
            className="px-2 sm:px-3 py-1 text-[11px] sm:text-[13px] w-16 sm:w-20 justify-center"
          >
            {score}
          </Badge>
        </div>

        <div className="flex items-center gap-2 w-auto sm:w-[85px] shrink-0">
          {channel ? (
            <>
              {getChannelIcon(channel)}
              <span className="text-[12px] sm:text-[13px] font-medium text-slate-500 whitespace-nowrap">
                {channel}
              </span>
            </>
          ) : (
            <span className="w-full"></span>
          )}
        </div>

        <div className="flex items-center justify-end flex-1 sm:flex-none w-full sm:w-auto mt-2 sm:mt-0">
          {actionType === "open" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenAudit) onOpenAudit();
              }}
              className="flex items-center justify-center sm:justify-end gap-2 text-[#0038F8] font-bold text-[12px] sm:text-[13px] hover:text-[#002ECC] transition-colors w-full sm:w-[120px] shrink-0"
            >
              Otwórz audyt <ExternalLink size={14} />
            </button>
          ) : (
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center sm:justify-end gap-2 text-slate-600 font-bold text-[12px] sm:text-[13px] hover:text-slate-800 transition-colors w-full sm:w-[120px] shrink-0"
            >
              <Link2 size={14} /> Przypisz audyt
            </button>
          )}
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 sm:w-10 sm:h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0 ml-3 sm:ml-4"
          >
            <Pencil size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// RAPORTY Z AUDYTÓW (Wyszukiwarka)
// ==========================================

function RaportyView({ setView }) {
  const mockAuditsList = [
    {
      id: 1,
      date: "12.03.2026",
      status: "Zakończony",
      tag: "ING",
      title: "Strona ing.pl - wybrane podstrony",
      devices: "Desktop, Android, iOS",
      priority: "3",
      score: "77.55%",
      icon: MonitorSmartphone,
      statusVariant: "success",
    },
    {
      id: 2,
      date: "04.03.2026",
      status: "Zakończony",
      tag: "ING",
      title: "Aplikacja MING Android - wybrane elementy",
      devices: "Android",
      priority: "2",
      score: "83.67%",
      icon: Smartphone,
      statusVariant: "success",
    },
    {
      id: 3,
      date: "15.04.2026",
      status: "W trakcie",
      tag: "mBank",
      title: "Serwis transakcyjny - Nowy Dashboard",
      devices: "Desktop",
      priority: "5",
      score: "62.10%",
      icon: MonitorSmartphone,
      statusVariant: "warning",
    },
    {
      id: 4,
      date: "22.04.2026",
      status: "W trakcie",
      tag: "Santander",
      title: "Aplikacja mobilna - moduł inwestycji",
      devices: "iOS, Android",
      priority: "1",
      score: "89.40%",
      icon: Smartphone,
      statusVariant: "warning",
    },
    {
      id: 5,
      date: "10.05.2026",
      status: "Zakończony",
      tag: "PKO BP",
      title: "Dokumenty PDF - Regulaminy kart",
      devices: "Dokumenty",
      priority: "0",
      score: "95.00%",
      icon: FileText,
      statusVariant: "success",
    },
    {
      id: 6,
      date: "05.06.2026",
      status: "Nowy",
      tag: "ING",
      title: "Proces reklamacyjny - formularze",
      devices: "Desktop, Mobile Web",
      priority: "8",
      score: "45.20%",
      icon: LayoutGrid,
      statusVariant: "info",
    },
  ];

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState("all");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const getMobileHeaderText = () => {
    if (isMobileFiltersOpen) return "Filtrowanie wyników";
    if (filtersApplied) return "Filtry zastosowane";
    return "Ustaw filtry";
  };

  return (
    <div data-testid="raporty-view" className="flex flex-col md:flex-row h-full w-full relative">
      {/* Sidebar filtrów */}
      <div
        className={`
        bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300 z-20 shadow-sm md:shadow-none overflow-visible relative
        ${isSidebarCollapsed ? "md:w-0" : "w-full md:w-[320px]"}
      `}
      >
        {/* Przycisk rozwijania - widoczny tylko na desktop */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSidebarCollapsed(!isSidebarCollapsed);
          }}
          className={`hidden md:flex items-center justify-center w-8 h-8 transition-all duration-300 z-50
            ${isSidebarCollapsed 
              ? "absolute left-0 top-[23px] bg-slate-900 text-white hover:bg-slate-800 rounded-r-lg rounded-l-none" 
              : "absolute right-[15px] top-[23px] bg-slate-100 text-slate-700 hover:bg-[#0038F8] hover:text-white rounded-lg"
            }
          `}
          title={isSidebarCollapsed ? "Rozwiń filtry" : "Zwiń filtry"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>

        <div
          className={`p-4 md:p-6 flex items-center ${
            isSidebarCollapsed ? "md:hidden" : "justify-between"
          } cursor-pointer md:cursor-default transition-colors duration-200 w-[320px]
            ${
              isMobileFiltersOpen
                ? "bg-slate-900 text-white border-b border-slate-800"
                : "bg-[#0038F8] text-white md:bg-white md:text-slate-900 border-b border-[#002ECC] md:border-slate-100 md:border-r md:border-r-slate-200"
            }
          `}
          onClick={() => {
            if (window.innerWidth < 768) {
              setIsMobileFiltersOpen(!isMobileFiltersOpen);
            }
          }}
        >
          <div
            className={`flex items-center gap-2 md:gap-3 min-w-0 pr-2 ${
              isSidebarCollapsed && !isMobileFiltersOpen ? "md:hidden" : ""
            }`}
          >
            <Filter
              size={20}
              className={`flex-shrink-0 ${
                isMobileFiltersOpen
                  ? "text-slate-400 md:text-white"
                  : "text-white md:text-[#0038F8]"
              }`}
            />
            <h2 className="text-[15px] md:text-lg font-bold min-w-0 truncate">
              <span className="md:hidden flex items-center gap-2 truncate">
                {filtersApplied && !isMobileFiltersOpen && (
                  <CheckCircle2 size={16} className="text-white flex-shrink-0" />
                )}
                <span className="truncate">{getMobileHeaderText()}</span>
              </span>
              <span className="hidden md:block">Filtry</span>
            </h2>
          </div>
          <button
            className={`md:hidden p-1.5 transition-colors rounded-lg flex-shrink-0 ${
              isMobileFiltersOpen
                ? "bg-slate-800 text-slate-400 hover:text-white"
                : "bg-white/20 text-white"
            }`}
          >
            {isMobileFiltersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div
          className={`md:flex-1 overflow-y-auto p-4 space-y-3 max-h-[65vh] md:max-h-none ${
            isSidebarCollapsed || isMobileFiltersOpen ? "md:hidden" : ""
          } ${
            isMobileFiltersOpen ? "block" : "hidden md:block"
          } bg-slate-50 md:bg-white`}
        >
          <FilterAccordion title="1. Audytor" count={0}>
            <div className="pt-1">
              <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 font-medium shadow-sm">
                <option value="">Wszyscy audytorzy</option>
                <option value="1">Jan Kowalski</option>
                <option value="2">Piotr Smułkowski</option>
                <option value="3">Anna Nowak</option>
              </select>
            </div>
          </FilterAccordion>

          <FilterAccordion title="3. Status audytu" count={0}>
            <FilterCheckbox label="Zakończony" />
            <FilterCheckbox label="W trakcie" />
            <FilterCheckbox label="Nowy" />
          </FilterAccordion>

          <FilterAccordion title="4. Kanał" count={0}>
            <FilterCheckbox label="Desktop" />
            <FilterCheckbox label="Mobile Web" />
            <FilterCheckbox label="iOS" />
            <FilterCheckbox label="Android" />
            <FilterCheckbox label="Dokumenty" />
          </FilterAccordion>

          <FilterAccordion title="5. Czas" count={0}>
            <div className="space-y-4 pt-1">
              <div>
                <div className="text-xs text-slate-500 mb-2 font-semibold">
                  Szybki wybór okresu
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTimeRange("30d")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                      activeTimeRange === "30d"
                        ? "bg-[#0038F8] text-white border-[#0038F8]"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                    }`}
                  >
                    30 dni
                  </button>
                  <button
                    onClick={() => setActiveTimeRange("60d")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                      activeTimeRange === "60d"
                        ? "bg-[#0038F8] text-white border-[#0038F8]"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                    }`}
                  >
                    60 dni
                  </button>
                  <button
                    onClick={() => setActiveTimeRange("1y")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                      activeTimeRange === "1y"
                        ? "bg-[#0038F8] text-white border-[#0038F8]"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                    }`}
                  >
                    1 Rok
                  </button>
                  <button
                    onClick={() => setActiveTimeRange("all")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                      activeTimeRange === "all"
                        ? "bg-[#0038F8] text-white border-[#0038F8]"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                    }`}
                  >
                    Wszystkie
                  </button>
                </div>
              </div>
              <div className="h-px bg-slate-100 my-1 mx-1"></div>
              <FilterDateRange label="Data realizacji" />
            </div>
          </FilterAccordion>

          <FilterAccordion title="6. Błędy" count={0}>
            <FilterCheckbox label={<><AlertOctagon size={12} className="text-red-500 inline mr-1.5" />Tylko krytyczne błędy</>} />
          </FilterAccordion>
        </div>

        <div
          className={`p-4 border-t border-slate-100 bg-slate-50 shrink-0 gap-2 ${
            isSidebarCollapsed || isMobileFiltersOpen ? "md:hidden" : ""
          } ${isMobileFiltersOpen ? "flex flex-col" : "hidden md:flex md:flex-col"}`}
        >
          <button
            onClick={() => {
              setFiltersApplied(true);
              if (window.innerWidth < 768) setIsMobileFiltersOpen(false);
            }}
            className="w-full bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-3 rounded-xl font-bold shadow-sm transition-colors text-sm"
          >
            Zastosuj filtry
          </button>
          <button
            onClick={() => {
              setActiveTimeRange("all");
              setFiltersApplied(false);
              if (window.innerWidth < 768) setIsMobileFiltersOpen(false);
            }}
            className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-3 rounded-xl font-bold transition-colors text-sm shadow-sm"
          >
            Wyczyść
          </button>
        </div>
      </div>

      {/* Główny obszar */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-12 bg-white z-10 flex-shrink-0 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
              Raporty z audytów
            </h1>
            <p className="text-slate-500 text-sm">
              Przeglądaj i wyszukuj szczegółowe wyniki przeprowadzonych audytów.
            </p>
          </div>

          <div className="mb-4">
            <Input
              icon={Search}
              placeholder="Wyszukaj audyt..."
              className="w-full bg-white"
            />
          </div>
          <div className="flex items-center justify-between mb-4 gap-3">
            <span className="text-sm font-bold text-slate-500">
              Znaleziono: {mockAuditsList.length} audytów
            </span>
            <select className="bg-transparent border border-slate-200 p-2 rounded-xl w-auto text-sm font-bold text-slate-500 focus:outline-none cursor-pointer">
              <option>Sortuj: Od najnowszych</option>
              <option>Sortuj: Od najstarszych</option>
              <option>Sortuj: Alfabetycznie (A-Z)</option>
            </select>
          </div>
        </div>

          <div className="flex-1 overflow-auto p-4 sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {mockAuditsList.map((audit) => (
              <ReportCard
                key={audit.id}
                date={audit.date}
                status={audit.status}
                statusVariant={audit.statusVariant}
                tag={audit.tag}
                title={audit.title}
                devices={audit.devices}
                priority={audit.priority}
                score={audit.score}
                icon={audit.icon}
                onClick={() => setView("raport-szczegoly")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportCard({
  date,
  status,
  statusVariant = "neutral",
  tag,
  title,
  devices,
  priority,
  score,
  icon: DeviceIcon,
  onClick,
}) {
  return (
    <Card
      data-testid="report-card"
      className="p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer group flex flex-col"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="lightBlue" className="!text-[10px] sm:!text-xs">
            <Calendar size={10} className="text-[#0038F8] w-3 h-3" />
            {date}
          </Badge>
          <Badge variant="info" className="!text-[10px] sm:!text-xs px-1.5">
            {tag}
          </Badge>
        </div>
        <Badge variant={statusVariant} className="!text-[10px] sm:!text-xs">
          {statusVariant === "success" && (
            <CheckCircle2 size={10} className="w-3 h-3" />
          )}
          {statusVariant === "warning" && (
            <Activity size={10} className="w-3 h-3" />
          )}
          {statusVariant === "info" && (
            <Eye size={10} className="w-3 h-3" />
          )}
          {status}
        </Badge>
      </div>
      <div className="mb-3 sm:mb-4 flex-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mb-1.5 sm:mb-2 pr-2">
          {title}
        </h3>
      </div>
      <hr className="border-slate-100 mb-3" />
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col w-16 sm:w-20 shrink-0">
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Krytyczne
            </span>
            <span className="text-base sm:text-lg font-bold text-red-500 leading-none">
              {priority}
            </span>
          </div>
          <div className="flex flex-col w-16 sm:w-20 shrink-0">
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Zgodność
            </span>
            <span
              className={`text-base sm:text-lg font-bold leading-none ${
                parseFloat(score) >= 80 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {score}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] sm:text-xs font-medium">
            <DeviceIcon size={16} className="w-4 h-4" />
            {devices}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0038F8] hover:bg-[#002ECC] text-white rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-sm"
        >
          <ArrowRight size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>
      </div>
    </Card>
  );
}

function ReportSummaryView({ setView }) {
  const mockReaudits = [
    {
      id: "re1",
      name: "Reaudyt 1: Weryfikacja po poprawkach",
      date: "15.04.2026",
      auditor: "P. Smułkowski",
      score: 85.2,
      brokenCriteria: 5,
      criticalErrors: 1,
      status: "Zakończony",
    },
    {
      id: "re2",
      name: "Reaudyt 2: Błędy krytyczne",
      date: "20.05.2026",
      auditor: "A. Nowak",
      score: 92.4,
      brokenCriteria: 2,
      criticalErrors: 0,
      status: "W trakcie",
    },
  ];

  return (
    <div data-testid="report-summary-view" className="max-w-[1200px] w-full">
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        <ClipboardCheck size={14} className="text-slate-400" />
        <span>RAPORTY Z AUDYTÓW</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="success" className="px-3 py-1 text-xs">
              <CheckCircle2 size={14} /> Zakończony
            </Badge>
            <Badge
              variant="info"
              className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
            >
              ING
            </Badge>
          </div>
          <h1 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Strona ing.pl - wybrane podstrony
          </h1>
        </div>
        <div className="flex flex-row items-center gap-3 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
          <button
            onClick={() => setView("raporty")}
            className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Powrót
          </button>
          <button className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-sm">
            <Download size={16} /> Pobierz raport (.pdf)
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[12px] sm:text-[13px] font-bold text-slate-600 mb-5 bg-white border border-slate-200 p-3 sm:px-4 sm:py-3 rounded-xl w-max shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#0038F8]" />{" "}
          <span>01.03.2026 - 12.03.2026</span>
        </div>
        <div className="w-px h-4 bg-slate-200 hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <User size={16} className="text-[#0038F8]" />{" "}
          <span>Audytor: Piotr Smułkowski</span>
        </div>
        <div className="w-px h-4 bg-slate-200 hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#0038F8]" />{" "}
          <span>WCAG 2.1 Poziom AA</span>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 p-4 sm:p-5 rounded-2xl w-full mb-8">
        <h3 className="text-xs font-bold text-[#0038F8] uppercase tracking-widest mb-2 flex items-center gap-2">
          <Info size={14} /> Podsumowanie audytu
        </h3>
        <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed font-medium">
          Audyt obejmował kluczowe ścieżki użytkownika na stronie głównej oraz w
          formularzach kontaktowych. Zidentyfikowano głównie problemy związane z
          niewystarczającym kontrastem elementów interaktywnych oraz brakiem
          odpowiednich etykiet dla czytników ekranu w procesie logowania. Mimo
          relatywnie wysokiego ogólnego wyniku dostępności, wdrożenie
          rekomendacji dla 3 błędów krytycznych (tzw. blokerów) jest
          bezwzględnie wymagane do spełnienia normy ustawowej.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 text-center sm:text-left">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} className="sm:w-7 sm:h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Dostępność
            </span>
            <span className="text-xl sm:text-3xl font-extrabold text-slate-900">
              77.5%
            </span>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 text-center sm:text-left">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <AlertOctagon size={24} className="sm:w-7 sm:h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Krytyczne
            </span>
            <span className="text-xl sm:text-3xl font-extrabold text-slate-900">
              3
            </span>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 text-center sm:text-left">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} className="sm:w-7 sm:h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Ważne
            </span>
            <span className="text-xl sm:text-3xl font-extrabold text-slate-900">
              1
            </span>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 text-center sm:text-left">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#0038F8]/10 text-[#0038F8] flex items-center justify-center shrink-0">
            <ListChecks size={24} className="sm:w-7 sm:h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Kryteria Złamane
            </span>
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-xl sm:text-3xl font-extrabold text-slate-900">
                11
              </span>
              <span className="text-sm sm:text-lg font-bold text-slate-400">
                / 49
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-8 p-4 sm:p-6 border-blue-100 bg-blue-50/30">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <History size={20} className="text-[#0038F8]" />
            <h2 className="text-[16px] sm:text-[18px] font-bold text-slate-900">
              Historia i Reaudyty ({mockReaudits.length})
            </h2>
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-white border border-[#0038F8]/20 text-[#0038F8] hover:bg-[#0038F8]/5 px-4 py-2 rounded-xl font-bold transition-colors text-sm shadow-sm">
            <Plus size={16} /> Zleć reaudyt
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {mockReaudits.map((reaudit) => (
            <div
              key={reaudit.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer gap-4 group"
              onClick={() => setView("raport-szczegoly")}
            >
              <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038F8] group-hover:bg-[#0038F8] group-hover:text-white transition-colors flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck size={18} />
                </div>
                <div className="min-w-0 pr-4">
                  <div className="text-[15px] font-bold text-slate-800 leading-snug group-hover:text-[#0038F8] transition-colors truncate">
                    {reaudit.name}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium mt-1 truncate">
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
                <div className="flex flex-col hidden sm:flex shrink-0 items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Złamane Kryt.
                  </span>
                  <span className="text-[16px] font-extrabold text-slate-700 text-center">
                    {reaudit.brokenCriteria}
                  </span>
                </div>

                <div className="hidden sm:flex shrink-0 items-center justify-center">
                  <Badge
                    variant={
                      reaudit.status === "Zakończony" ? "success" : "warning"
                    }
                    className="!py-1 !px-3 !text-[11px] w-max"
                  >
                    {reaudit.status}
                  </Badge>
                </div>

                <div className="flex shrink-0 items-center justify-end">
                  <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <div
                      className="flex items-center gap-1.5 border-r border-slate-200 pr-3"
                      title={`Błędy krytyczne: ${reaudit.criticalErrors}`}
                    >
                      <AlertOctagon size={14} className="text-red-500" />
                      <span className="text-[15px] font-black text-slate-800">
                        {reaudit.criticalErrors}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
                        Zgodność:
                      </span>
                      <span
                        className={`text-[15px] font-black ${
                          reaudit.score >= 80
                            ? "text-emerald-600"
                            : "text-amber-500"
                        }`}
                      >
                        {reaudit.score}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-10 flex justify-end shrink-0 hidden sm:flex ml-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 group-hover:text-[#0038F8] group-hover:bg-blue-50 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 flex sm:hidden items-center justify-center gap-2 bg-white border border-[#0038F8]/20 text-[#0038F8] hover:bg-[#0038F8]/5 px-4 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm">
          <Plus size={16} /> Zleć reaudyt
        </button>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-[16px] sm:text-[18px] font-bold text-slate-900 mb-4 sm:mb-6">
          Przetestowane Elementy
        </h2>
        <div className="flex flex-col gap-3 sm:gap-4">
          <TestedElementItem
            title="Strona główna"
            priorities={1}
            warnings={1}
            marginals={2}
            channel="WWW"
            onReportClick={() => setView("raport-bledy")}
          />
          <TestedElementItem
            title='Podstrona "konta"'
            priorities={2}
            warnings={0}
            marginals={1}
            channel="Aplikacja"
            onReportClick={() => setView("raport-bledy")}
          />
          <TestedElementItem
            title='Podstrona "karty"'
            priorities={0}
            warnings={0}
            marginals={0}
            channel="Dokumenty"
            onReportClick={() => setView("raport-bledy")}
          />
        </div>
      </Card>
    </div>
  );
}

function TestedElementItem({
  title,
  priorities,
  warnings,
  marginals = 0,
  channel,
  onReportClick,
}) {
  return (
    <div
      data-testid="tested-element-item"
      className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4 sm:gap-0"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
          <Layout size={18} />
        </div>
        <span className="font-bold text-slate-800 text-[15px] truncate">
          {title}
        </span>
      </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end flex-shrink-0 border-t border-slate-100 sm:border-none pt-3 sm:pt-0 w-full sm:w-auto">
          <div className="flex items-center gap-1 sm:gap-0 sm:pr-4 w-32 sm:w-40 justify-center">
            <div className="flex items-center gap-1.5 w-10 sm:w-12 shrink-0 justify-center" title={`Błędy krytyczne: ${priorities}`}>
              <AlertOctagon
                size={16}
                className={priorities > 0 ? "text-red-500" : "text-slate-400"}
              />
              <span
                className={`font-bold text-sm ${
                  priorities > 0 ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {priorities}
              </span>
            </div>
            <div className="flex items-center gap-1.5 w-10 sm:w-12 shrink-0 justify-center" title={`Błędy ważne: ${warnings}`}>
              <AlertTriangle
                size={16}
                className={warnings > 0 ? "text-amber-500" : "text-slate-400"}
              />
              <span
                className={`font-bold text-sm ${
                  warnings > 0 ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {warnings}
              </span>
            </div>
            <div className="flex items-center gap-1.5 w-10 sm:w-12 shrink-0 justify-center" title={`Błędy marginalne: ${marginals}`}>
              <Info
                size={16}
                className={marginals > 0 ? "text-blue-500" : "text-slate-400"}
              />
              <span
                className={`font-bold text-sm ${
                  marginals > 0 ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {marginals}
              </span>
            </div>
          </div>

        <div className="flex items-center gap-2 sm:border-l border-slate-200 sm:pl-6 w-auto sm:w-32 shrink-0 justify-start sm:justify-start">
          {channel && (
            <>
              {getChannelIcon(channel)}
              <span className="text-[12px] sm:text-[13px] font-medium text-slate-500 whitespace-nowrap">
                {channel}
              </span>
            </>
          )}
        </div>

        <div className="w-full sm:w-[130px] shrink-0 mt-3 sm:mt-0 flex justify-end ml-2">
          <button
            onClick={onReportClick}
            className="flex justify-center items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm w-full"
          >
            Raport <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportErrorsView({ setView }) {
  return (
    <div data-testid="report-errors-view" className="max-w-[1200px] w-full">
      <button
        onClick={() => setView("raport-szczegoly")}
        className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mb-4"
      >
        <ArrowLeft size={16} /> Wróć do przeglądu
      </button>

      <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-200 gap-4">
        <div className="flex flex-col pr-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="info"
              className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
            >
              ING
            </Badge>
            <Badge variant="neutral" className="px-3 py-1 text-xs">
              <User size={14} className="mr-1.5 text-slate-400" /> Piotr
              Smułkowski
            </Badge>
          </div>
          <h1 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Edytor elementu: Podstrona "konta"
          </h1>
        </div>
        <Card className="flex flex-wrap items-center p-3 sm:p-2 sm:pl-5 sm:pr-6 gap-4 sm:gap-0 mt-2 md:mt-0">
          <div className="flex items-center gap-2 sm:gap-3 sm:mr-6">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Kanał
            </span>
            <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold">
              WWW
            </span>
          </div>
          <div className="w-px h-6 sm:h-8 bg-slate-100 hidden sm:block sm:mr-6"></div>
          <div className="flex items-center gap-2 sm:gap-3 sm:mr-6">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Krytyczne
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-red-500 leading-none">
              2
            </span>
          </div>
          <div className="w-px h-6 sm:h-8 bg-slate-100 hidden sm:block sm:mr-6"></div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Zgodność WCAG
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-500 leading-none">
              89%
            </span>
          </div>
        </Card>
      </div>

      <Card className="mb-6 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Numer, problem lub rekomendacja
            </label>
            <Input
              icon={Search}
              placeholder="Wpisz frazę..."
              className="w-full bg-slate-50"
            />
          </div>
          <div className="w-full lg:w-[220px] shrink-0">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Priorytet
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 transition-shadow appearance-none">
              <option value="">Wszystkie priorytety</option>
              <option value="krytyczny">🔴 Krytyczne (Blokery)</option>
              <option value="wazny">🟠 Ważne</option>
              <option value="marginalny">🔵 Marginalne</option>
            </select>
          </div>
          <div className="w-full lg:w-[280px] shrink-0">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Kryterium WCAG
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 transition-shadow appearance-none">
              <option value="">Wszystkie kryteria</option>
              <option value="1.1.1">1.1.1 Treść nietekstowa</option>
              <option value="1.4.3">1.4.3 Kontrast (Minimalny)</option>
              <option value="2.4.7">2.4.7 Widoczny fokus</option>
              <option value="3.3.2">3.3.2 Etykiety lub instrukcje</option>
            </select>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0 shrink-0">
            <button className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-3 rounded-xl font-bold shadow-sm transition-colors text-sm">
              Szukaj
            </button>
            <button
              className="flex justify-center items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-5 py-3 rounded-xl font-bold transition-colors text-sm shrink-0 shadow-sm"
              title="Wyczyść filtry"
            >
              <X size={16} className="text-slate-400" />
              <span className="hidden sm:inline">Wyczyść</span>
            </button>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-[16px] sm:text-lg font-bold text-slate-900">
            Zgłoszone błędy (5)
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            Znaleziono: 5 wyników
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4">
          <ErrorAccordionItem
            id="#001"
            title="Brak alternatywy tekstowej dla obrazka promocyjnego."
            subtext="1.1.1 Treść nietekstowa, 1.4.3 Kontrast"
            initialExpanded={true}
          />
          <ErrorAccordionItem
            id="#002"
            title="Zbyt niski kontrast tekstu w stopce."
            subtext="1.4.3 Kontrast (Minimalny)"
            initialExpanded={false}
          />
          <ErrorAccordionItem
            id="#003"
            title="Brak widocznego fokusa na przycisku"
            subtext="2.4.7 Widoczny fokus"
            initialExpanded={false}
          />
        </div>
      </div>
    </div>
  );
}

function ErrorAccordionItem({ id, title, subtext, initialExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <Card
      data-testid="error-accordion-item"
      className={`overflow-hidden transition-all duration-300 ${
        isExpanded
          ? "border-[#0038F8]/30 shadow-md ring-1 ring-[#0038F8]/10"
          : "hover:border-slate-300"
      }`}
    >
      <div
        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer bg-white gap-3"
        onClick={handleToggle}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5">
            {id}
          </span>
          <div className="flex flex-col pr-4 sm:pr-0">
            <span className="font-bold text-slate-900 text-[14px] sm:text-[16px] mb-1 leading-snug">
              {title}
            </span>
            <span className="text-[11px] sm:text-sm text-slate-500">
              {subtext}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 border-t border-slate-100 sm:border-none pt-3 sm:pt-0 mt-1 sm:mt-0">
          <div className="flex items-center gap-2 text-slate-400 hidden lg:flex">
            <MonitorSmartphone size={16} />
            <span className="text-xs sm:text-sm font-medium">
              Desktop, Android, iOS
            </span>
          </div>
          <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-3 py-1 sm:py-1.5 rounded-md">
            Krytyczny
          </span>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isExpanded
                ? "bg-[#0038F8]/10 text-[#0038F8]"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 sm:p-6 pt-2 bg-white flex flex-col gap-4 border-t border-slate-50 mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="border border-slate-200 rounded-xl p-4 sm:p-6 h-full">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 sm:mb-4">
                  Opis problemu
                </h3>
                <p className="text-[12px] sm:text-sm text-slate-600 leading-relaxed">
                  Etykieta pola "Zapisz" na stronie internetowej nie spełnia
                  wymagań dotyczących kontrastu określonych w WCAG 2.1. Brak
                  odpowiedniego kontrastu (co najmniej 4.5:1) między tekstem
                  etykiety a tłem może prowadzić do trudności w odczycie tekstu
                  przez osoby z deficytem wzroku. Osoby te mogą napotykać
                  trudności w korzystaniu ze strony internetowej oraz w
                  skutecznym wypełnianiu formularzy. Poprawienie kontrastu
                  etykiety "Zapisz" jest niezbędne dla zapewnienia pełnej
                  dostępności strony dla wszystkich użytkowników, niezależnie od
                  ich umiejętności wzrokowych.
                </p>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="border border-slate-200 rounded-xl p-4 sm:p-6 h-full bg-slate-50/50">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 sm:mb-4">
                  Zrzuty ekranu
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[1, 2].map((imgIdx) => (
                    <div
                      key={imgIdx}
                      className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative group cursor-pointer flex items-center justify-center transition-shadow hover:shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(
                          `https://placehold.co/1200x800/f8fafc/64748b?text=Zrzut+Ekranu+Problemu+WCAG+00${imgIdx}`
                        );
                      }}
                    >
                      <div className="w-full h-full bg-slate-50 flex flex-col p-3 gap-2 opacity-70 group-hover:opacity-20 transition-opacity">
                        <div className="w-full h-2.5 bg-slate-200 rounded"></div>
                        <div className="w-2/3 h-2.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-10 bg-slate-200 rounded mt-auto"></div>
                      </div>
                      <div className="absolute inset-0 bg-[#0038F8]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <Search size={28} className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 sm:mb-3">
              Rekomendacja
            </h3>
            <p className="text-[12px] sm:text-sm text-slate-600 leading-relaxed">
              Zaleca się weryfikację i zmianę koloru tła przycisku lub samego
              tekstu, tak aby stosunek kontrastu spełniał normy WCAG.
            </p>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={handleToggle}
              className="text-[#0038F8] hover:text-[#002ECC] font-bold text-[12px] flex items-center gap-1.5 bg-[#0038F8]/5 hover:bg-[#0038F8]/10 px-4 py-2 rounded-lg transition-colors"
            >
              <ChevronUp size={16} /> Zwiń szczegóły błędu
            </button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 p-4 sm:p-8 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImage(null);
          }}
        >
          <div
            className="relative max-w-5xl w-full max-h-full flex items-center justify-center animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 sm:-right-12 text-slate-400 hover:text-white p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              title="Zamknij powiększenie"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Powiększenie zrzutu ekranu"
              className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain bg-white border border-slate-800"
            />
          </div>
        </div>
      )}
    </Card>
  );
}

// ==========================================
// RAPORTOWANIE (MODUŁY I ANALIZY)
// ==========================================

function ReportingModuleView() {
  const [activeGroup, setActiveGroup] = useState("audyty");
  const [activeAudytyTab, setActiveAudytyTab] = useState("raport");
  const [activeUslugiTab, setActiveUslugiTab] = useState("dostepnosc");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div data-testid="reporting-module-view" className="flex flex-col md:flex-row h-full w-full">
      <FiltersSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-12 bg-white z-10 flex-shrink-0 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-[24px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
              Raportowanie i Analizy
            </h1>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-sm">
                <FileText size={16} className="text-red-500" />{" "}
                <span className="hidden sm:inline">Eksportuj do PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-sm">
                <FileSpreadsheet size={16} className="text-emerald-500" />{" "}
                <span className="hidden sm:inline">Eksportuj do XLS</span>
                <span className="sm:hidden">XLS</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-hide">
            <TabButton
              isActive={activeGroup === "audyty"}
              onClick={() => setActiveGroup("audyty")}
              icon={ClipboardList}
            >
              Raporty z Audytów
            </TabButton>
            <TabButton
              isActive={activeGroup === "uslugi"}
              onClick={() => setActiveGroup("uslugi")}
              icon={Layout}
            >
              Dostępność Usług
            </TabButton>
            <TabButton
              disabled
              disabledLabel="W budowie"
              isActive={activeGroup === "zarzadcze"}
              onClick={() => setActiveGroup("zarzadcze")}
              icon={PieChart}
            >
              Zarządcze
            </TabButton>
            <TabButton
              disabled
              disabledLabel="W budowie"
              isActive={activeGroup === "regulacyjne"}
              onClick={() => setActiveGroup("regulacyjne")}
              icon={Scale}
            >
              Regulacyjne (PAD)
            </TabButton>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[#f8fafc] flex flex-col">
          {activeGroup === "audyty" && (
            <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-2 flex-shrink-0 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-xl w-max border border-slate-200/50">
                <SubNavButton
                  isActive={activeAudytyTab === "raport"}
                  onClick={() => setActiveAudytyTab("raport")}
                >
                  Raport Audytów
                </SubNavButton>
                <SubNavButton
                  isActive={activeAudytyTab === "bledy"}
                  onClick={() => setActiveAudytyTab("bledy")}
                >
                  Błędy z Audytów
                </SubNavButton>
              </div>
            </div>
          )}

          {activeGroup === "uslugi" && (
            <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-2 flex-shrink-0 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-xl w-max border border-slate-200/50">
                <SubNavButton
                  isActive={activeUslugiTab === "dostepnosc"}
                  onClick={() => setActiveUslugiTab("dostepnosc")}
                >
                  Dostępność Usług
                </SubNavButton>
                <SubNavButton
                  isActive={activeUslugiTab === "postepy"}
                  onClick={() => setActiveUslugiTab("postepy")}
                >
                  Postępy
                </SubNavButton>
                <SubNavButton
                  isActive={activeUslugiTab === "bledy"}
                  onClick={() => setActiveUslugiTab("bledy")}
                >
                  Błędy w Usługach
                </SubNavButton>
              </div>
            </div>
          )}

          <div
            className={`flex-1 ${
              activeGroup === "zarzadcze" || activeGroup === "regulacyjne"
                ? "p-4 sm:p-8 lg:p-12"
                : "px-4 sm:px-8 lg:px-12 pb-16 pt-6"
            }`}
          >
            {activeGroup === "audyty" && activeAudytyTab === "raport" && (
              <AuditReportView />
            )}
            {activeGroup === "audyty" && activeAudytyTab === "bledy" && (
              <AuditErrorsReportView />
            )}
            {activeGroup === "uslugi" && activeUslugiTab === "dostepnosc" && (
              <OperationalReport />
            )}
            {activeGroup === "uslugi" && activeUslugiTab === "postepy" && (
              <ProgressReport />
            )}
            {activeGroup === "uslugi" && activeUslugiTab === "bledy" && (
              <ServicesErrorReport />
            )}
            {activeGroup === "zarzadcze" && <ManagementReport />}
            {activeGroup === "regulacyjne" && <RegulatoryReportView />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  isActive,
  onClick,
  icon: Icon,
  disabled,
  disabledLabel,
  children,
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`flex items-center gap-2 pb-4 border-b-2 font-bold text-[13px] sm:text-[15px] transition-colors whitespace-nowrap flex-shrink-0 
        ${
          disabled
            ? "opacity-50 cursor-not-allowed border-transparent text-slate-500"
            : isActive
            ? "border-[#0038F8] text-[#0038F8]"
            : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
        }
      `}
    >
      <Icon size={18} />
      {children}
      {disabledLabel && (
        <span className="bg-slate-200 text-slate-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest ml-1">
          {disabledLabel}
        </span>
      )}
    </button>
  );
}

function SubNavButton({ isActive, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 sm:px-5 py-2 text-[12px] sm:text-[13px] font-bold rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-white text-[#0038F8] shadow-sm"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
      }`}
    >
      {children}
    </button>
  );
}

function FiltersSidebar({ isCollapsed, setIsCollapsed }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("all");
  const [isServiceAccOpen, setIsServiceAccOpen] = useState(true);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState("all");

  const serviceShortNames = {
    s1: "Usługi płatnicze...",
    s2: "Kredyt hipoteczny",
  };

  const accordionTitle =
    !isServiceAccOpen && selectedService !== "all"
      ? `Wybrano: ${serviceShortNames[selectedService]}`
      : "1. Wybór usługi i procesu";

  const getMobileHeaderText = () => {
    if (isMobileOpen) return "Filtrowanie wyników";
    if (selectedService !== "all" && filtersApplied)
      return `Wybrano: ${serviceShortNames[selectedService]} (+ filtry)`;
    if (selectedService !== "all")
      return `Wybrano: ${serviceShortNames[selectedService]}`;
    if (filtersApplied) return "Filtry zastosowane";
    return "Ustaw filtry i wybierz usługę";
  };

  return (
    <div
      className={`
      bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300 z-20 shadow-sm md:shadow-none overflow-visible relative
      ${isCollapsed ? "md:w-0" : "w-full md:w-[320px]"}
    `}
    >
      {/* Przycisk rozwijania - widoczny tylko na desktop */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsCollapsed(!isCollapsed);
        }}
        className={`hidden md:flex items-center justify-center w-8 h-8 transition-all duration-300 z-50
          ${isCollapsed
            ? "absolute left-0 top-[23px] bg-slate-900 text-white hover:bg-slate-800 rounded-r-lg rounded-l-none"
            : "absolute right-[15px] top-[23px] bg-slate-100 text-slate-700 hover:bg-[#0038F8] hover:text-white rounded-lg"
          }
        `}
        title={isCollapsed ? "Rozwiń filtry" : "Zwiń filtry"}
      >
        {isCollapsed ? (
          <ChevronRight size={20} />
        ) : (
          <ChevronLeft size={20} />
        )}
      </button>

      <div
        className={`p-4 md:p-6 flex items-center ${
          isCollapsed ? "md:justify-center px-2" : "justify-between"
        } cursor-pointer md:cursor-default transition-colors duration-200
          ${
            isMobileOpen
              ? "bg-slate-900 text-white border-b border-slate-800"
              : "bg-[#0038F8] text-white md:bg-white md:text-slate-900 border-b border-[#002ECC] md:border-slate-100"
          }
        `}
        onClick={() => {
          if (window.innerWidth < 768) {
            setIsMobileOpen(!isMobileOpen);
          }
        }}
      >
        <div
          className={`flex items-center gap-2 md:gap-3 min-w-0 pr-2 ${
            isCollapsed ? "md:hidden" : ""
          }`}
        >
          <Filter
            size={20}
            className={`flex-shrink-0 ${
              isMobileOpen
                ? "text-slate-400 md:text-[#0038F8]"
                : "text-white md:text-[#0038F8]"
            }`}
          />
          <h2 className="text-[15px] md:text-lg font-bold min-w-0 truncate">
            <span className="md:hidden flex items-center gap-2 truncate">
              {(selectedService !== "all" || filtersApplied) &&
              !isMobileOpen ? (
                <CheckCircle2 size={16} className="text-white flex-shrink-0" />
              ) : null}
              <span className="truncate">{getMobileHeaderText()}</span>
            </span>
            <span className="hidden md:block">Filtry</span>
          </h2>
        </div>
        <button
          className={`md:hidden p-1.5 transition-colors rounded-lg flex-shrink-0 ${
            isMobileOpen
              ? "bg-slate-800 text-slate-400 hover:text-white"
              : "bg-white/20 text-white"
          }`}
        >
          {isMobileOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div
        className={`md:flex-1 overflow-y-auto p-4 space-y-3 max-h-[65vh] md:max-h-none ${
          isCollapsed ? "md:hidden" : ""
        } ${
          isMobileOpen ? "block" : "hidden md:block"
        } bg-slate-50 md:bg-white`}
      >
        <FilterAccordion
          title={accordionTitle}
          count={0}
          controlledExpanded={isServiceAccOpen}
          onControlledToggle={setIsServiceAccOpen}
          titleBadge={
            selectedService !== "all" && !isServiceAccOpen ? (
              <CheckCircle2
                size={16}
                className="text-emerald-500 flex-shrink-0"
              />
            ) : null
          }
        >
          <div className="space-y-4 pt-1">
            <div>
              <div className="text-xs text-slate-500 mb-1.5 font-semibold">
                Usługi
              </div>
              <select
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  if (e.target.value !== "all") {
                    setIsServiceAccOpen(false);
                  }
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 font-medium shadow-sm"
              >
                <option value="all">Wszystkie usługi</option>
                <option value="s1">
                  Usługi płatnicze i powiązane z rachunkiem
                </option>
                <option value="s2">Kredyt hipoteczny</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1.5 font-semibold">
                Procesy
              </div>
              <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 font-medium shadow-sm">
                <option value="all">Wszystkie procesy</option>
                <option value="p1">Otwarcie ROR</option>
                <option value="p2">Przelew krajowy</option>
              </select>
            </div>
          </div>
        </FilterAccordion>

        <FilterAccordion title="2. Źródło wykrycia błędu" count={0}>
          <FilterCheckbox label="Audyt" />
          <FilterCheckbox label="Reaudyt" />
          <FilterCheckbox label="Zgłoszenie użytkownika" />
          <FilterCheckbox label="Skarga" />
        </FilterAccordion>

        <FilterAccordion title="3. Błąd" count={0}>
          <FilterCheckbox label={<><AlertOctagon size={12} className="text-red-500 inline mr-1.5" />Priorytet: Krytyczny</>} />
          <FilterCheckbox label={<><AlertTriangle size={12} className="text-orange-500 inline mr-1.5" />Priorytet: Ważny</>} />
          <FilterCheckbox label={<><Info size={12} className="text-blue-500 inline mr-1.5" />Priorytet: Marginalny</>} />
          <FilterCheckbox label="Status: Nowy" />
          <FilterCheckbox label="Status: Naprawiony" />
        </FilterAccordion>

        <FilterAccordion title="4. Kanał" count={0}>
          <FilterCheckbox label="WWW" />
          <FilterCheckbox label="Aplikacja" />
          <FilterCheckbox label="Dokument" />
        </FilterAccordion>

        <FilterAccordion title="5. Audyty i Wyniki" count={0}>
          <div className="space-y-4 pt-1">
            <div>
              <div className="text-xs text-slate-500 mb-1.5 font-semibold">
                Audytor
              </div>
              <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 font-medium shadow-sm">
                <option value="">Wszyscy audytorzy</option>
                <option value="1">Jan Kowalski</option>
                <option value="2">Piotr Smułkowski</option>
              </select>
            </div>
            <FilterNumberRange
              label="Zakres % dostępności"
              placeholderOd="Min %"
              placeholderDo="Max %"
            />
          </div>
        </FilterAccordion>

        <FilterAccordion title="6. Czas">
          <div className="space-y-4 pt-1">
            <div>
              <div className="text-xs text-slate-500 mb-2 font-semibold">
                Szybki wybór okresu
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTimeRange("30d")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                    activeTimeRange === "30d"
                      ? "bg-[#0038F8] text-white border-[#0038F8]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                  }`}
                >
                  30 dni
                </button>
                <button
                  onClick={() => setActiveTimeRange("60d")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                    activeTimeRange === "60d"
                      ? "bg-[#0038F8] text-white border-[#0038F8]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                  }`}
                >
                  60 dni
                </button>
                <button
                  onClick={() => setActiveTimeRange("1y")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                    activeTimeRange === "1y"
                      ? "bg-[#0038F8] text-white border-[#0038F8]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                  }`}
                >
                  1 Rok
                </button>
                <button
                  onClick={() => setActiveTimeRange("all")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                    activeTimeRange === "all"
                      ? "bg-[#0038F8] text-white border-[#0038F8]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                  }`}
                >
                  Wszystkie
                </button>
              </div>
            </div>
            <div className="h-px bg-slate-100 my-1 mx-1"></div>
            <FilterDateRange label="Data audytu" />
            <div className="h-px bg-slate-100 my-1 mx-1"></div>
            <FilterDateRange label="Data wykrycia błędów" />
          </div>
        </FilterAccordion>
      </div>

      <div
        className={`p-4 border-t border-slate-100 bg-slate-50 shrink-0 gap-2 ${
          isCollapsed ? "md:hidden" : ""
        } ${isMobileOpen ? "flex flex-col" : "hidden md:flex md:flex-col"}`}
        >
          <button
            onClick={() => {
              setFiltersApplied(true);
              if (window.innerWidth < 768) setIsMobileOpen(false);
            }}
            className="w-full bg-[#0038F8] hover:bg-[#002ECC] text-white px-5 py-3 rounded-xl font-bold shadow-sm transition-colors text-sm"
          >
            Zastosuj filtry
          </button>
          <button
            onClick={() => {
              setSelectedService("all");
              setIsServiceAccOpen(true);
              setFiltersApplied(false);
              setActiveTimeRange("all");
            }}
            className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-3 rounded-xl font-bold transition-colors text-sm shadow-sm"
          >
            Wyczyść
          </button>
        </div>
    </div>
  );
}

function FilterAccordion({
  title,
  count,
  isOpen = false,
  controlledExpanded,
  onControlledToggle,
  children,
  titleBadge,
}) {
  const [internalExpanded, setInternalExpanded] = useState(isOpen);
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isControlled) {
      onControlledToggle(!isExpanded);
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  return (
    <div
      data-testid="filter-accordion"
      className={`border rounded-xl bg-white overflow-hidden transition-colors ${
        isControlled && !isExpanded && titleBadge
          ? "border-[#0038F8]/40 shadow-sm"
          : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span
            className={`font-bold text-sm text-left truncate transition-colors ${
              isControlled && !isExpanded && titleBadge
                ? "text-[#0038F8]"
                : "text-slate-800"
            }`}
          >
            {title}
          </span>
          {titleBadge}
          {count > 0 && (
            <span className="bg-[#0038F8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0">
              {count}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
        )}
      </button>
      {isExpanded && (
        <div className="p-3 border-t border-slate-100 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function FilterCheckbox({ label }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <label
      data-testid="filter-checkbox"
      className="flex items-center gap-3 cursor-pointer group"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        className="hidden"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
          isChecked
            ? "bg-[#0038F8] border-[#0038F8]"
            : "bg-white border-slate-300 group-hover:border-[#0038F8]"
        }`}
      >
        {isChecked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <polyline points="2.5 6 5 8.5 9.5 3"></polyline>
          </svg>
        )}
      </div>
      <span
        className={`text-sm transition-colors flex items-center ${
          isChecked
            ? "font-bold text-slate-900"
            : "font-medium text-slate-600 group-hover:text-slate-900"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function FilterDateRange({ label }) {
  return (
    <div
      data-testid="filter-date-range"
    >
      <div className="text-xs text-slate-500 mb-1.5 font-semibold">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 shadow-sm"
        />
        <span className="text-slate-400 text-xs">-</span>
        <input
          type="date"
          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 shadow-sm"
        />
      </div>
    </div>
  );
}

function FilterNumberRange({
  label,
  placeholderOd = "Od",
  placeholderDo = "Do",
}) {
  return (
    <div
      data-testid="filter-number-range"
    >
      <div className="text-xs text-slate-500 mb-1.5 font-semibold">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={placeholderOd}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 shadow-sm"
        />
        <span className="text-slate-400 text-xs">-</span>
        <input
          type="number"
          placeholder={placeholderDo}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50 shadow-sm"
        />
      </div>
    </div>
  );
}

// ==========================================
// RAPORT AUDYTÓW (Odświeżona Pełna Wersja)
// ==========================================

function AuditReportView() {
  const [detailLevel, setDetailLevel] = useState(2);
  const [sortBy, setSortBy] = useState("date_desc");

  const mockAudits = [
    {
      id: "a1",
      name: "Strona ing.pl - wybrane podstrony",
      startDate: "01.03.2024",
      endDate: "12.03.2024",
      wcagVersion: "WCAG 2.1 Poziom AA",
      channels: ["WWW", "Aplikacja"],
      auditor: "P. Smułkowski",
      score: 77.5,
      brokenCriteria: 11,
      totalErrors: 45,
      priorities: { c: 3, w: 12, m: 20 },
      reaudits: [
        {
          id: "re1",
          name: "Reaudyt 1: Weryfikacja po poprawkach",
          date: "15.04.2024",
          auditor: "P. Smułkowski",
          score: 85.2,
          brokenCriteria: 5,
          critical: 1,
          status: "Zakończony",
        },
        {
          id: "re2",
          name: "Reaudyt 2: Błędy krytyczne",
          date: "20.05.2024",
          auditor: "A. Nowak",
          score: 92.4,
          brokenCriteria: 2,
          critical: 0,
          status: "W trakcie",
        },
      ],
      views: [
        {
          id: "v1",
          name: "Strona główna - modal logowania",
          score: 65.0,
          brokenCriteria: 4,
          totalErrors: 15,
          priorities: { c: 1, w: 5, m: 6 },
          errors: [
            {
              id: "e1",
              title: "Brak powiązania etykiety z polem PESEL.",
              criteria: "3.3.2 Etykiety",
              priority: "Ważny",
              status: "Nowy",
            },
            {
              id: "e2",
              title: 'Brak fokusa na przycisku "Zaloguj".',
              criteria: "2.4.7 Widoczny fokus",
              priority: "Krytyczny",
              status: "Nowy",
            },
          ],
        },
        ...genViews(12, "aud-1-gen"),
      ],
    },
    {
      id: "a2",
      name: "Aplikacja MING Android - Kredyty",
      startDate: "10.02.2024",
      endDate: "28.02.2024",
      wcagVersion: "WCAG 2.1 Poziom AA",
      channels: ["Aplikacja"],
      auditor: "J. Kowalski",
      score: 83.6,
      brokenCriteria: 6,
      totalErrors: 18,
      priorities: { c: 0, w: 8, m: 5 },
      reaudits: [],
      views: genViews(8, "aud-2-gen"),
    },
  ];

  return (
    <div
      data-testid="audit-report-view"
      className="max-w-[1200px]"
    >
      <Card className="mb-6 p-4 flex flex-col md:flex-row items-end md:items-center gap-4 sm:gap-6 bg-white border-slate-200">
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Sortowanie audytów
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
          >
            <option value="date_desc">Dacie rozpoczęcia (Najnowsze)</option>
            <option value="name_asc">Nazwie audytu (A-Z)</option>
            <option value="score_desc">Procencie dostępności (Malejąco)</option>
            <option value="score_asc">Procencie dostępności (Rosnąco)</option>
            <option value="errors_desc">Ilości błędów (Od największej)</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Forma wyniku (Zagnieżdżenie)
          </label>
          <select
            value={detailLevel}
            onChange={(e) => setDetailLevel(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
          >
            <option value={1}>
              1. Tylko Raporty (Ogólne statystyki audytów)
            </option>
            <option value={2}>2. Raporty + Widoki w audycie</option>
            <option value={3}>3. Raporty + Widoki + Błędy</option>
          </select>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        {mockAudits.map((audit) => (
          <AuditNode key={audit.id} audit={audit} detailLevel={detailLevel} />
        ))}
      </div>
    </div>
  );
}

function AuditNode({ audit, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const visibleViews = expanded ? audit.views : audit.views.slice(0, 3);

  return (
    <Card
      data-testid="audit-node"
      className="overflow-hidden border border-slate-200 shadow-sm"
    >
      <div className="bg-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex flex-col flex-1 min-w-[280px]">
          <div className="flex items-center gap-2 mb-1.5">
            <ClipboardCheck
              size={18}
              className="text-[#0038F8] flex-shrink-0"
            />
            <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
              {audit.name}
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {audit.startDate} - {audit.endDate}
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {audit.auditor}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral" className="!py-0.5 !px-2 !text-[10px]">
              {audit.wcagVersion}
            </Badge>
            {audit.channels.map((ch) => (
              <Badge
                key={ch}
                variant="lightBlue"
                className="!py-0.5 !px-2 !text-[10px]"
              >
                {ch}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 md:mt-0">
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-24 sm:w-28 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Złamane Kryteria
            </span>
            <span className="text-xl font-extrabold text-slate-700">
              {audit.brokenCriteria}
            </span>
          </div>
          <div className="flex flex-col pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Liczna błędów
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold text-slate-700">
                {audit.totalErrors}
              </span>
              <PriorityStats {...audit.priorities} />
            </div>
          </div>
          <div className="w-auto sm:w-28 flex justify-end shrink-0">
            <div className="flex flex-col items-end w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
                Zgodność
              </span>
              <span className={`text-lg font-bold ${
                audit.score >= 80 ? 'text-emerald-600' : 'text-amber-500'
              }`}>
                {audit.score.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {audit.reaudits && audit.reaudits.length > 0 && (
        <div className="bg-[#f0f5ff] border-b border-[#dbeafe] p-4 sm:px-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <span title="Historia wyników">
              <History size={16} className="text-[#0038F8]" />
            </span>
            <h4 className="text-[11px] font-extrabold text-[#0038F8] uppercase tracking-widest">
              Historia i Reaudyty ({audit.reaudits.length})
            </h4>
          </div>
          <div className="flex flex-col gap-2.5">
            {audit.reaudits.map((reaudit) => (
              <div
                key={reaudit.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-[#bfdbfe] rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer gap-3 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0038F8] group-hover:bg-[#0038F8] group-hover:text-white transition-colors flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck size={16} />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-[#0038F8] transition-colors">
                      {reaudit.name}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {reaudit.date}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1">
                        <User size={12} /> {reaudit.auditor}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-none">
                  <div className="flex flex-col hidden sm:flex shrink-0 items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Złamane Kryt.
                    </span>
                    <span className="text-[16px] font-extrabold text-slate-700 text-center">
                      {reaudit.brokenCriteria}
                    </span>
                  </div>

                  <div className="hidden sm:flex shrink-0 items-center justify-center">
                    <Badge
                      variant={
                        reaudit.status === "Zakończony" ? "success" : "warning"
                      }
                      className="!py-1 !px-3 !text-[11px]"
                    >
                      {reaudit.status}
                    </Badge>
                  </div>

                  <div className="flex shrink-0 items-center justify-end">
                    <div className="flex items-center gap-4 bg-white px-3 py-1.5 rounded-lg border border-blue-100/50">
                      <div
                        className="flex items-center gap-1.5"
                        title={`Błędy krytyczne: ${reaudit.critical || 0}`}
                      >
                        <AlertOctagon size={14} className="text-red-500" />
                        <span className="text-[15px] font-black text-slate-800">
                          {reaudit.critical || 0}
                        </span>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
                          Zgodność:
                        </span>
                        <span
                          className={`text-[15px] font-black ${
                            reaudit.score >= 80
                              ? "text-emerald-600"
                              : "text-amber-500"
                          }`}
                        >
                          {reaudit.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 flex justify-end shrink-0 hidden sm:flex ml-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 group-hover:text-[#0038F8] group-hover:bg-blue-50 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {detailLevel >= 2 && audit.views.length > 0 && (
        <div className="bg-slate-50/50 flex flex-col p-4 gap-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 mb-1">
            Widoki w audycie
          </h4>
          {visibleViews.map((view) => (
            <AuditViewNode
              key={view.id}
              view={view}
              detailLevel={detailLevel}
            />
          ))}
          <ShowMoreToggle
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            total={audit.views.length}
            visibleCount={3}
            label="widoków"
          />
        </div>
      )}
    </Card>
  );
}

function AuditViewNode({ view, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const visibleErrors = view.errors
    ? expanded
      ? view.errors
      : view.errors.slice(0, 2)
    : [];

  return (
    <div
      data-testid="audit-view-node"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
    >
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3 flex-1">
          <ChevronRightSquare
            size={16}
            className="text-slate-400 flex-shrink-0"
          />
          <div>
            <h3 className="text-[14px] font-bold text-slate-800 leading-snug">
              {view.name}
            </h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-24 sm:w-28 hidden sm:flex shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Złamane Kryt.
            </span>
            <span className="text-sm font-extrabold text-slate-700">
              {view.errors?.length || 0}
            </span>
          </div>
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Błędy w widoku
            </span>
            <PriorityStats {...view.priorities} />
          </div>
          <div className="w-auto sm:w-28 flex justify-end shrink-0">
            <div className="flex flex-col items-end w-full">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
                Dostępność
              </span>
              <span
                className={`text-sm font-extrabold ${
                  view.score >= 80
                    ? "text-emerald-600"
                    : view.score >= 60
                    ? "text-amber-500"
                    : "text-red-500"
                }`}
              >
                {view.score.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {detailLevel >= 3 && view.errors && view.errors.length > 0 && (
        <div className="bg-slate-50/80 border-t border-slate-100 p-3 pl-4 sm:pl-12 flex flex-col gap-2">
          {visibleErrors.map((err) => (
            <div
              key={err.id}
              className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-start gap-3 shadow-sm"
            >
              <Bug
                size={14}
                className="text-slate-400 mt-1 flex-shrink-0 hidden sm:block"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13px] text-slate-900 mb-0.5 truncate leading-snug">
                  {err.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Kryterium:{" "}
                  <span className="font-semibold">{err.criteria}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-end sm:items-center">
                <Badge variant="neutral" className="!py-0.5 !text-[10px]">
                  Status: {err.status}
                </Badge>
                <PriorityBadge priority={err.priority} size="small" />
              </div>
            </div>
          ))}
          <ShowMoreToggle
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            total={view.errors.length}
            visibleCount={2}
            label="błędów"
          />
        </div>
      )}
    </div>
  );
}

function AuditErrorsReportView() {
  const [sortBy, setSortBy] = useState("date_desc");
  const [visibleCount, setVisibleCount] = useState(10);

  const data = useMemo(() => genFlatErrors(30, "AUD_ERR_"), []);

  return (
    <div
      data-testid="audit-errors-report-view"
      className="max-w-[1400px]"
    >
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4 border-slate-200">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bug size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Znalezionych błędów
            </div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {data.length}
            </div>
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-center border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Rozbicie na priorytety
          </div>
          <PriorityStats c={12} w={48} m={60} />
        </Card>
        <Card className="p-4 flex flex-col justify-center border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Najczęstsze kryterium
          </div>
          <div className="text-sm font-bold text-slate-800 truncate">
            1.4.3 Kontrast (Minimalny)
          </div>
        </Card>
        <Card className="p-4 flex flex-col justify-center border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Kanały z błędami
          </div>
          <div className="flex gap-2 mt-1">
            <Badge variant="neutral" className="!text-[10px] !py-0.5">
              WWW: 80%
            </Badge>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-4 py-4 w-[5%]"></th>
                <th className="px-4 py-4 w-[25%]">Błąd i Kryterium</th>
                <th className="px-4 py-4 w-[25%]">
                  Pochodzenie (Audyt / Widok)
                </th>
                <th className="px-4 py-4 w-[10%]">Priorytet</th>
                <th className="px-4 py-4 w-[10%]">Kanały</th>
                <th className="px-4 py-4 w-[10%]">Znaleziono</th>
                <th className="px-4 py-4 w-[15%]">Status Audytu</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {data.slice(0, visibleCount).map((err) => (
                <AuditErrorTableRow key={err.id} data={err} />
              ))}
            </tbody>
          </table>

          {visibleCount < data.length && (
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setVisibleCount((v) => v + 10)}
                className="w-full py-3 text-[13px] font-bold text-[#0038F8] bg-white border border-[#0038F8]/20 hover:bg-[#0038F8]/5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Wczytaj więcej błędów ({data.length - visibleCount} z{" "}
                {data.length} ukrytych)
                <ChevronDown size={16} />
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function AuditErrorTableRow({ data }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <tr
        data-testid="audit-error-table-row"
        onClick={handleToggle}
        className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
      >
        <td className="px-4 py-4 text-slate-400 group-hover:text-[#0038F8]">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </td>
        <td className="px-4 py-4">
          <div className="font-bold text-slate-900 mb-1 leading-snug pr-4 line-clamp-2">
            {data.problem}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded">
            {data.criteria}
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <ClipboardCheck
                size={12}
                className="text-[#0038F8] flex-shrink-0"
              />
              <span className="font-bold text-slate-700 truncate">
                {data.auditName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pl-3 mt-1">
              <ChevronRightSquare
                size={10}
                className="text-slate-400 flex-shrink-0"
              />
              <span className="font-medium text-slate-600 truncate">
                {data.auditViewName}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">{PriorityBadge({ priority: data.priority })}</td>
        <td className="px-4 py-4">
          <div className="flex flex-wrap gap-1">
            {data.channels.map((ch, i) => (
              <span
                key={i}
                className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm"
              >
                {ch}
              </span>
            ))}
          </div>
        </td>
        <td className="px-4 py-4 font-semibold text-slate-700 whitespace-nowrap">
          {data.dateFound}
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-col gap-1.5">
            <Badge
              variant={
                data.auditStatus === "Zakończony" ? "success" : "warning"
              }
              className="!py-0.5 !text-[10px] w-max"
            >
              Status: {data.auditStatus}
            </Badge>
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <Calendar size={10} /> {data.auditStart}
            </span>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50 border-b-2 border-[#0038F8]/20">
          <td></td>
          <td colSpan={6} className="px-4 py-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" /> Opis
                  Problemu
                </h4>
                <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  {data.problem}
                </p>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                  Rekomendacja / Wskazówki
                </h4>
                <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                  {data.recommendation}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-[#0038F8]/10">
              <button
                type="button"
                onClick={handleToggle}
                className="text-[#0038F8] hover:text-[#002ECC] font-bold text-[12px] flex items-center gap-1.5 bg-[#0038F8]/5 hover:bg-[#0038F8]/10 px-4 py-2 rounded-lg transition-colors"
              >
                <ChevronUp size={16} /> Zwiń szczegóły błędu
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ==========================================
// RAPORT OPERACYJNY (DOSTĘPNOŚĆ USŁUG)
// ==========================================

function OperationalReport() {
  const [detailLevel, setDetailLevel] = useState(3);
  const [sortBy, setSortBy] = useState("name");
  const data = mockSharedServicesData;

  return (
    <div
      data-testid="operational-report"
      className="max-w-[1200px]"
    >
      <Card className="mb-6 p-4 flex flex-col md:flex-row items-end md:items-center gap-4 sm:gap-6 bg-white border-slate-200">
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Sortowanie wyników
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
          >
            <option value="name">Alfabetycznie po nazwie usługi</option>
            <option value="score_desc">
              Dostępność usług malejąco (Najlepsze)
            </option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Forma wyniku (Poziom szczegółowości)
          </label>
          <select
            value={detailLevel}
            onChange={(e) => setDetailLevel(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
          >
            <option value={1}>1. Tylko Usługi (Ogólne podsumowanie)</option>
            <option value={2}>2. Usługi + Procesy</option>
            <option value={3}>3. Usługi + Procesy + Widoki</option>
            <option value={4}>
              4. Pełen wykaz (wraz ze szczegółami błędów)
            </option>
          </select>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        {data.map((service) => (
          <ServiceNode
            key={service.id}
            service={service}
            detailLevel={detailLevel}
          />
        ))}
      </div>
    </div>
  );
}

function ServiceNode({ service, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const visibleProcesses = expanded
    ? service.processes
    : service.processes.slice(0, 2);

  return (
    <Card
      data-testid="service-node"
      className="overflow-hidden border border-slate-200 shadow-sm"
    >
      <div className="bg-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
            <Library size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Usługa
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
              {service.name}
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 md:mt-0">
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Struktura
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {service.stats.processes} procesów • {service.stats.views}/
              {service.stats.totalViews} widoków
            </span>
          </div>
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Błędy w usłudze
            </span>
            <PriorityStats {...service.stats.priorities} />
          </div>
          <div className="w-auto sm:w-28 flex justify-end shrink-0">
            <div className="flex flex-col items-end w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
                Dostępność Usługi
              </span>
              <span className={`text-sm font-bold ${
                service.stats.score >= 80 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {service.stats.score.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {detailLevel >= 2 && service.processes.length > 0 && (
        <div className="bg-slate-50/50 flex flex-col p-4 gap-4">
          {visibleProcesses.map((p) => (
            <ProcessNode key={p.id} process={p} detailLevel={detailLevel} />
          ))}
          <ShowMoreToggle
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            total={service.processes.length}
            visibleCount={2}
            label="procesy"
          />
        </div>
      )}
    </Card>
  );
}

function ProcessNode({ process, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const visibleViews = expanded ? process.views : process.views.slice(0, 3);

  return (
    <div
      data-testid="process-node"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
    >
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <ChevronRightSquare size={16} className="text-[#0038F8]" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Proces
            </span>
            <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-800 leading-snug">
              {process.name}
            </h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Widoki
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {process.views.length} przypisanych
            </span>
          </div>
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Błędy
            </span>
            <PriorityStats {...process.stats.priorities} />
          </div>
          <div className="w-auto sm:w-28 flex justify-end shrink-0">
            <div className="flex flex-col items-end w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
                Dostępność
              </span>
              <span className="text-xs font-bold text-amber-600">
                {process.stats.score.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {detailLevel >= 3 && process.views.length > 0 && (
        <div className="flex flex-col divide-y divide-slate-100 bg-slate-50/30">
          {visibleViews.map((v) => (
            <ViewNode key={v.id} view={v} detailLevel={detailLevel} />
          ))}
          <ShowMoreToggle
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            total={process.views.length}
            visibleCount={3}
            label="widoków"
          />
        </div>
      )}
    </div>
  );
}

function ViewNode({ view, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const visibleErrors = view.errors
    ? expanded
      ? view.errors
      : view.errors.slice(0, 2)
    : [];

  return (
    <div
      data-testid="view-node"
      className="flex flex-col"
    >
      <div className="p-3 pl-4 sm:pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
        <div className="flex flex-col flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span title={`Widok: ${view.name}`}>
              <Layout size={14} className="text-slate-400 flex-shrink-0" />
            </span>
            <span className="font-bold text-[14px] text-slate-800 leading-snug">
              {view.name}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium" title={`Kanał: ${view.channel}`}>
            Kanał: {view.channel}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            {/* Pusta kolumna dla utrzymania siatki */}
          </div>
          <div className="flex flex-col border-r border-slate-100 pr-4 sm:pr-6 w-32 sm:w-40 hidden sm:flex shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Błędy
            </span>
            <PriorityStats {...view.priorities} />
          </div>
          <div className="w-auto sm:w-28 flex justify-end shrink-0">
            <div className="flex flex-col items-end w-full">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
                Dostępność
              </span>
              <span className="text-sm font-extrabold text-emerald-600">
                {view.score.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {detailLevel >= 4 && view.errors && view.errors.length > 0 && (
        <div className="pl-4 sm:pl-[52px] pr-4 pb-3 flex flex-col gap-2">
          {visibleErrors.map((err) => (
            <div
              key={err.id}
              className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-start gap-3 shadow-sm"
            >
              <span className="text-xs font-bold text-slate-400 mt-0.5 hidden sm:block">
                {err.id}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13px] text-slate-900 mb-0.5 truncate leading-snug">
                  {err.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Kryterium: {err.criteria}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-end sm:items-center">
                <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-1 rounded">
                  {err.status}
                </span>
                <PriorityBadge priority={err.priority} size="small" />
              </div>
            </div>
          ))}
          <ShowMoreToggle
            isExpanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            total={view.errors.length}
            visibleCount={2}
            label="błędów"
          />
        </div>
      )}
    </div>
  );
}

// ==========================================
// RAPORT POSTĘPÓW
// ==========================================

function ProgressReport() {
  const data = mockSharedServicesData;

  return (
    <div
      data-testid="progress-report"
      className="max-w-[1200px]"
    >
      <Card className="mb-6 p-4 flex flex-col md:flex-row items-end md:items-center gap-4 sm:gap-6 bg-white border-slate-200">
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Filtruj po usłudze
          </label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50">
            <option value="all">Wszystkie usługi</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Filtruj po procesie
          </label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50">
            <option value="all">Wszystkie procesy</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Sortowanie wyników
          </label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50">
            <option value="service_asc">
              Alfabetycznie po nazwie usługi (A-Z)
            </option>
          </select>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        {data.map((service) => (
          <ProgressServiceNode key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

function ProgressServiceNode({ service }) {
  return (
    <Card
      data-testid="progress-service-node"
      className="overflow-hidden border border-slate-200 shadow-sm"
    >
      <div className="bg-slate-50 p-4 sm:p-5 sm:pr-8 lg:pr-10 flex items-center gap-3 border-b border-slate-200">
        <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
          <Library size={16} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
            Usługa
          </span>
          <h2 className="text-[15px] sm:text-[16px] font-extrabold text-slate-900 leading-snug">
            {service.name}
          </h2>
        </div>
      </div>
      <div className="flex flex-col divide-y divide-slate-100 bg-white">
        {service.processes.map((p) => (
          <ProgressProcessNode key={p.id} process={p} />
        ))}
      </div>
    </Card>
  );
}

function ProgressProcessNode({ process }) {
  return (
    <div
      data-testid="progress-process-node"
      className="p-4 sm:p-5 sm:pr-8 lg:pr-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
    >
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-[250px]">
        <ChevronRightSquare
          size={16}
          className="text-[#0038F8] flex-shrink-0 mt-0.5 sm:mt-0"
        />
        <div>
          <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-800 leading-snug mb-0.5">
            {process.name}
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            {process.views.length} przypisanych widoków
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-8 w-full lg:w-auto mt-2 lg:mt-0 pt-3 lg:pt-0 border-t border-slate-100 lg:border-none">
        <div className="flex items-center gap-4 sm:gap-6">
          {process.history.map((h, i) => {
            const colorClass =
              h.score >= 80
                ? "text-emerald-600"
                : h.score >= 60
                ? "text-amber-500"
                : "text-red-500";
            return (
              <div key={i} className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  {h.date}
                </span>
                <span
                  className={`text-[13px] sm:text-[15px] font-extrabold ${colorClass}`}
                >
                  {h.score.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-[120px] hidden sm:flex justify-center border-l border-slate-100 pl-6 ml-2">
          <SparklineChart data={process.history} />
        </div>
      </div>
    </div>
  );
}

function SparklineChart({ data }) {
  if (!data || data.length === 0) return null;
  const width = 120;
  const height = 40;
  const min = 0;
  const max = 100;
  const stepX = width / Math.max(data.length - 1, 1);
  const points = data
    .map(
      (d, i) =>
        `${i * stepX},${height - ((d.score - min) / (max - min)) * height}`
    )
    .join(" ");

  return (
    <div
      data-testid="sparkline-chart"
      className="flex flex-col items-center justify-center relative group"
      title="Trend zmian w czasie"
    >
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke="#0038F8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70 group-hover:opacity-100 transition-opacity"
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={i * stepX}
            cy={height - ((d.score - min) / (max - min)) * height}
            r="4"
            fill="white"
            stroke="#0038F8"
            strokeWidth="2"
            className="transition-all duration-300 hover:r-[6px] hover:fill-[#0038F8] cursor-pointer"
          >
            <title>
              {d.date}: {d.score.toFixed(1)}%
            </title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

// ==========================================
// RAPORT BŁĘDÓW W USŁUGACH
// ==========================================

function ServicesErrorReport() {
  const [sortBy, setSortBy] = useState("priority_desc");
  const [visibleCount, setVisibleCount] = useState(10);

  const data = useMemo(() => genFlatErrors(40, "SRV_ERR_"), []);

  return (
    <div className="max-w-[1400px]">
      <Card className="mb-6 p-4 flex flex-col md:flex-row items-end md:items-center gap-4 sm:gap-6 bg-white border-slate-200">
        <div className="flex-1 w-full max-w-sm">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Sortowanie wyników
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
          >
            <option value="priority_desc">Od najwyższego priorytetu</option>
            <option value="date_desc">Data dodania (najnowsze)</option>
            <option value="service_asc">Alfabetycznie po nazwie usługi</option>
          </select>
        </div>
        <div className="flex-1 text-sm text-slate-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-start sm:items-center gap-2 w-full mt-2 md:mt-0">
          <AlertCircle
            size={16}
            className="text-[#0038F8] flex-shrink-0 mt-0.5 sm:mt-0"
          />
          <span>
            Szczegółowe filtry znajdziesz w lewym panelu. Kliknij wiersz w
            tabeli, aby przeczytać pełną rekomendację.
          </span>
        </div>
      </Card>

      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="p-4 w-[5%]"></th>
                <th className="p-4 w-[25%]">Błąd i Kryterium</th>
                <th className="p-4 w-[25%]">
                  Lokalizacja (Usługa / Proces / Widok)
                </th>
                <th className="p-4 w-[15%]">Audyt</th>
                <th className="p-4 w-[10%]">Kanał</th>
                <th className="p-4 w-[10%]">Priorytet</th>
                <th className="p-4 w-[10%]">Data wykrycia</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {data.slice(0, visibleCount).map((err) => (
                <ServiceErrorTableRow key={err.id} data={err} />
              ))}
            </tbody>
          </table>

          {visibleCount < data.length && (
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setVisibleCount((v) => v + 15)}
                className="w-full py-3 text-[13px] font-bold text-[#0038F8] bg-white border border-[#0038F8]/20 hover:bg-[#0038F8]/5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Pokaż kolejne 15 błędów (Łącznie: {data.length})
                <ChevronDown size={16} />
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function ServiceErrorTableRow({ data }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <tr
        onClick={handleToggle}
        className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
      >
        <td className="p-4 text-slate-400 group-hover:text-[#0038F8]">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </td>
        <td className="p-4">
          <div className="font-bold text-slate-900 mb-1 leading-snug pr-4 line-clamp-2">
            {data.problem}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">
            {data.criteria}
          </div>
        </td>
        <td className="p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Library size={12} className="text-slate-400 flex-shrink-0" />
              <span className="font-semibold text-slate-700 truncate">
                {data.serviceName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pl-3">
              <div className="w-px h-3 bg-slate-300"></div>
              <ChevronRightSquare
                size={10}
                className="text-slate-400 flex-shrink-0"
              />
              <span className="font-medium text-slate-600 truncate">
                {data.processName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pl-6">
              <div className="w-px h-3 bg-slate-300"></div>
              <Layout size={10} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-500 truncate">
                {data.serviceViewName}
              </span>
            </div>
          </div>
        </td>
        <td className="px-5 py-4">
          <div className="text-slate-600 font-medium truncate mb-1">
            {data.auditViewName}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Nazwa z audytu
          </div>
        </td>
        <td className="px-5 py-4">
          <div className="flex flex-col gap-1">
            {data.channels.map((ch, i) => (
              <span
                key={i}
                className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm w-max"
              >
                {ch}
              </span>
            ))}
          </div>
        </td>
        <td className="px-5 py-4">{PriorityBadge({ priority: data.priority })}</td>
        <td className="px-5 py-4 font-semibold text-slate-700 whitespace-nowrap">
          {data.dateFound}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50 border-b-2 border-[#0038F8]/20">
          <td></td>
          <td colSpan={6} className="px-5 py-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" /> Opis
                  Problemu
                </h4>
                <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  {data.problem}
                </p>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                  Rekomendacja / Wskazówki
                </h4>
                <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                  {data.recommendation}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-[#0038F8]/10">
              <button
                type="button"
                onClick={handleToggle}
                className="text-[#0038F8] hover:text-[#002ECC] font-bold text-[12px] flex items-center gap-1.5 bg-[#0038F8]/5 hover:bg-[#0038F8]/10 px-4 py-2 rounded-lg transition-colors"
              >
                <ChevronUp size={16} /> Zwiń szczegóły błędu
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ==========================================
// RAPORT ZARZĄDCZY (DASHBOARD)
// ==========================================

function ManagementReport() {
  return (
    <div className="max-w-[1400px] flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-slate-600 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#0038F8] flex-shrink-0" />
          <span className="font-medium whitespace-nowrap">Kontekst:</span>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-2">
          <Badge variant="lightBlue" className="!py-0.5 !text-[11px]">
            Wszystkie Usługi
          </Badge>
          <Badge variant="lightBlue" className="!py-0.5 !text-[11px]">
            Kanał: WWW, Aplikacja
          </Badge>
          <Badge variant="lightBlue" className="!py-0.5 !text-[11px]">
            Okres: Ostatnie 12 miesięcy
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <Badge variant="success" className="text-[10px]">
              +2.4% r/r
            </Badge>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Średnia Dostępność
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              86.2%
            </span>
            <span className="text-sm font-semibold text-slate-400">
              Cel: 90%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0038F8]/10 text-[#0038F8] flex items-center justify-center">
              <ListChecks size={24} />
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 bg-slate-100 px-2 py-0.5 rounded">
              142 procesy
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Pokrycie Audytowe
          </span>
          <span className="text-3xl font-extrabold text-slate-900">92.0%</span>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <AlertOctagon size={24} />
            </div>
            <Badge variant="danger" className="text-[10px]">
              +12 m/m
            </Badge>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Krytyczne Błędy Otwarte
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">47</span>
            <span className="text-sm font-semibold text-red-500">
              Wymaga akcji!
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded mt-1">
              SLA -15%
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Błędy po terminie naprawy
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">24</span>
            <span className="text-sm font-semibold text-slate-400">
              Śr. opóźnienie: 12 dni
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 sm:p-6 flex flex-col h-[340px] sm:h-[380px] lg:col-span-2">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Trend dostępności vs Błędy w czasie
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Ostatnie 12 miesięcy
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="flex flex-1 min-h-0 mt-2">
            <div className="w-8 shrink-0 flex flex-col justify-between items-end pb-8 pt-12 pr-2 text-[10px] font-bold text-slate-400 border-r border-slate-200 z-10 bg-white">
              <span className="leading-none">100</span>
              <span className="leading-none">50</span>
              <span className="leading-none translate-y-1">0</span>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-end gap-1 sm:gap-2 border-b border-slate-200 pt-12 px-2 sm:px-4">
                {chartTrendData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 flex justify-center items-end h-full relative group"
                  >
                    <div
                      className="w-full max-w-[32px] bg-[#0038F8]/20 group-hover:bg-[#0038F8]/30 transition-colors rounded-t-md relative z-10 flex items-start justify-center"
                      style={{ height: `${val.s}%` }}
                    >
                      <div className="absolute -top-1.5 w-2 h-2 rounded-full bg-[#0038F8] border-2 border-white"></div>
                    </div>
                    <div
                      className="absolute bottom-0 w-1/2 max-w-[16px] bg-red-100 group-hover:bg-red-200 transition-colors rounded-t-sm"
                      style={{ height: `${val.e}%` }}
                    ></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded z-20 whitespace-nowrap pointer-events-none hidden sm:block shadow-lg">
                      Dostępność: {val.s}% | Błędy: {val.e}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-8 flex items-start gap-1 sm:gap-2 w-full shrink-0 pt-2 px-2 sm:px-4">
                {chartTrendData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-[10px] sm:text-[11px] font-bold text-slate-500"
                  >
                    {val.m}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-2 shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <div className="w-3 h-3 rounded-full bg-[#0038F8]"></div> %
              Dostępności
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <div className="w-3 h-3 rounded bg-red-200"></div> Liczba nowych
              błędów
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">
              Zgodność według kanałów
            </h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>WWW</span> <span>94%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: "94%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Aplikacja mobilna (iOS)</span> <span>82%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#0038F8] h-full rounded-full"
                  style={{ width: "82%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Aplikacja mobilna (Android)</span> <span>78%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#0038F8] h-full rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Dokumenty (PDF/DOC)</span> <span>45%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Status błędów według zespołów
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Kto odpowiada za wdrożenia poprawek?
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { team: "Frontend Squad A", done: 60, inProg: 20, open: 5 },
              { team: "Mobile Team (iOS)", done: 30, inProg: 40, open: 15 },
              { team: "Vendor: E-Dokumenty", done: 10, inProg: 10, open: 50 },
              { team: "Vendor: Platforma X", done: 40, inProg: 15, open: 20 },
            ].map((t, i) => {
              const total = t.done + t.inProg + t.open;
              const pDone = (t.done / total) * 100;
              const pProg = (t.inProg / total) * 100;
              const pOpen = (t.open / total) * 100;

              return (
                <div key={i}>
                  <div className="flex justify-between text-[13px] font-bold text-slate-700 mb-1.5">
                    <span>{t.team}</span>
                    <span className="text-slate-500">Suma: {total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 flex overflow-hidden group cursor-pointer">
                    <div
                      className="bg-emerald-500 h-full transition-opacity group-hover:opacity-90"
                      style={{ width: `${pDone}%` }}
                      title={`Naprawione: ${t.done}`}
                    ></div>
                    <div
                      className="bg-amber-400 h-full transition-opacity group-hover:opacity-90 border-l border-white"
                      style={{ width: `${pProg}%` }}
                      title={`W naprawie: ${t.inProg}`}
                    ></div>
                    <div
                      className="bg-red-500 h-full transition-opacity group-hover:opacity-90 border-l border-white"
                      style={{ width: `${pOpen}%` }}
                      title={`Nowe/Do podjęcia: ${t.open}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-start gap-4 mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <div className="w-2.5 h-2.5 rounded bg-emerald-500"></div>{" "}
              Naprawione
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <div className="w-2.5 h-2.5 rounded bg-amber-400"></div> W
              naprawie
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <div className="w-2.5 h-2.5 rounded bg-red-500"></div> Nowe
              (Otwarte)
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Usługi wymagające uwagi (Top 5)
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Usługi o najniższym procencie dostępności
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { name: "Kredyt hipoteczny (Kalkulator)", score: 42.5, err: 54 },
              { name: "Otwarcie rachunku firmowego", score: 58.2, err: 32 },
              { name: "Panel wymiany walut (Kantor)", score: 64.0, err: 28 },
              { name: "Proces reklamacyjny", score: 68.5, err: 21 },
              { name: "Usługi płatnicze - BLIK", score: 72.1, err: 15 },
            ].map((u, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-800">
                      {u.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">
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
                  className="w-16 justify-center !py-1"
                >
                  {u.score}%
                </Badge>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-[13px] font-bold text-[#0038F8] hover:bg-[#0038F8]/5 py-2.5 rounded-xl transition-colors">
            Zobacz pełny ranking
          </button>
        </Card>
      </div>

      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Rejestr Ryzyka: Błędy Krytyczne po terminie SLA
            </h3>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              Błędy najwyższego priorytetu, które przekroczyły deklarowany czas
              naprawy.
            </span>
          </div>
          <button className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold transition-colors text-sm border border-red-100 w-full sm:w-auto">
            <ShieldAlert size={16} /> Eskaluj do właścicieli
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Opis błędu</th>
                <th className="px-6 py-4">Lokalizacja</th>
                <th className="px-6 py-4">Zespół / Właściciel</th>
                <th className="px-6 py-4">Termin SLA</th>
                <th className="px-6 py-4 text-right">Opóźnienie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              <tr className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">
                  Brak możliwości przejścia formularza za pomocą klawiatury.
                  (Krok 2)
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  Kredyt hipoteczny / Wniosek
                </td>
                <td className="px-6 py-4">
                  <Badge variant="neutral" className="!py-0.5">
                    Vendor: Platforma X
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-600">10.02.2024</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-red-600 font-extrabold bg-red-50 px-2 py-1 rounded">
                    -34 dni
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">
                  Dokument PDF z regulaminem nie jest tagowany (całkowicie
                  niedostępny).
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  Otwarcie ROR / Dokumenty
                </td>
                <td className="px-6 py-4">
                  <Badge variant="neutral" className="!py-0.5">
                    Vendor: E-Dokumenty
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-600">01.03.2024</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-red-600 font-extrabold bg-red-50 px-2 py-1 rounded">
                    -16 dni
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">
                  Pola do wpisania kodu SMS nie mają przypisanych etykiet dla
                  czytników.
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  Przelew krajowy / Autoryzacja
                </td>
                <td className="px-6 py-4">
                  <Badge variant="neutral" className="!py-0.5">
                    Mobile Team (iOS)
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-600">10.03.2024</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-red-600 font-extrabold bg-red-50 px-2 py-1 rounded">
                    -7 dni
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ==========================================
// NOWY RAPORT: RAPORT REGULACYJNY (PAD)
// ==========================================

function RegulatoryReportView() {
  const [sortBy, setSortBy] = useState("compliance_desc");

  const mockRegulatoryData = [
    {
      id: "r1",
      name: "Strona główna i serwis informacyjny (ing.pl)",
      type: "Serwis WWW",
      compliance: "Częściowo zgodna",
      lastAudit: "12.03.2024",
      declarationStatus: "Aktualna",
    },
    {
      id: "r2",
      name: "Aplikacja mobilna Moje ING (Android)",
      type: "Aplikacja mobilna",
      compliance: "Częściowo zgodna",
      lastAudit: "15.02.2024",
      declarationStatus: "Wymaga aktualizacji",
    },
    {
      id: "r3",
      name: "Kalkulator Kredytowy",
      type: "Moduł WWW",
      compliance: "Zgodna",
      lastAudit: "05.01.2024",
      declarationStatus: "Aktualna",
    },
    {
      id: "r4",
      name: "Platforma Wymiany Walut (Kantor)",
      type: "Serwis WWW",
      compliance: "Niezgodna",
      lastAudit: "10.11.2023",
      declarationStatus: "Przeterminowana",
    },
  ];

  return (
    <div className="max-w-[1400px] flex flex-col gap-6">
      {/* Pasek Informacyjny EAA / PAD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-slate-700 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0038F8] flex items-center justify-center flex-shrink-0">
          <Scale size={20} />
        </div>
        <div>
          <span className="font-bold block mb-0.5">
            Wymogi Ustawy o dostępności cyfrowej i EAA
          </span>
          <span className="text-slate-500 hidden sm:inline">
            Raport ten służy do monitorowania statusu formalno-prawnego usług,
            terminów ustawowych audytów oraz aktualności Deklaracji Dostępności
            (wymaganej aktualizacji do 31 marca każdego roku).
          </span>
        </div>
      </div>

      {/* RZĄD 1: KPI Ustawowe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 bg-slate-100 px-2 py-0.5 rounded">
              Suma: 24
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Usługi W Pełni Zgodne
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">8</span>
            <span className="text-sm font-semibold text-slate-400">(33%)</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Częściowo Zgodne
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">12</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <XCircle size={24} />
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Niezgodne Ustawowo
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">4</span>
            <span className="text-sm font-semibold text-red-500 hidden sm:block">
              Ryzyko kar!
            </span>
          </div>
        </Card>
      </div>

      {/* RZĄD 2: Deklaracje Dostępności */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deklaracje - Status */}
        <Card className="p-4 sm:p-6 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">
              Deklaracje Dostępności
            </h3>
            <FileSignature size={20} className="text-slate-400" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>{" "}
                Aktualne (2024)
              </div>
              <span className="font-extrabold text-slate-900">15</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div> Do
                aktualizacji
              </div>
              <span className="font-extrabold text-slate-900">5</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Brak /
                Stare
              </div>
              <span className="font-extrabold text-slate-900">4</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 mt-6 flex overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-opacity hover:opacity-90"
              style={{ width: "62.5%" }}
            ></div>
            <div
              className="bg-amber-500 h-full transition-opacity hover:opacity-90 border-l border-white"
              style={{ width: "20.8%" }}
            ></div>
            <div
              className="bg-red-500 h-full transition-opacity hover:opacity-90 border-l border-white"
              style={{ width: "16.7%" }}
            ></div>
          </div>
        </Card>

        {/* Informacje Ostrzegawcze / Akcje */}
        <Card className="p-4 sm:p-6 lg:col-span-2 flex flex-col justify-center bg-blue-50/50 border-blue-100">
          <div className="flex items-start gap-4 mb-6">
            <Landmark size={24} className="text-[#0038F8] mt-1 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-[#0038F8] mb-2">
                Raportowanie do ministerstwa
              </h3>
              <p className="text-[13px] sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                Zgodnie z obowiązującym prawem, do końca I kwartału należy
                zaktualizować status Deklaracji Dostępności dla wszystkich domen
                i aplikacji mobilnych.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto">
            <button className="flex justify-center items-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm">
              <Download size={16} /> Pobierz raport prawny
            </button>
            <button className="flex justify-center items-center gap-2 bg-white border border-[#0038F8]/20 text-[#0038F8] hover:bg-[#0038F8]/5 w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm">
              <FileText size={16} /> Generuj XML Deklaracji
            </button>
          </div>
        </Card>
      </div>

      {/* RZĄD 3: Wykaz Zgodności (Tabela) */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between bg-white gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Rejestr Zgodności Usług
            </h3>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              Oficjalny status prawny w odniesieniu do Ustawy o dostępności
              cyfrowej.
            </span>
          </div>
          <div className="w-full sm:w-[300px]">
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0038F8]/50"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="compliance_desc">Od Niezgodnych</option>
              <option value="name_asc">Nazwa Usługi (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-4 sm:px-6 py-4">Nazwa Usługi / Kanał</th>
                <th className="px-4 sm:px-6 py-4">Zgodność z Ustawą</th>
                <th className="px-4 sm:px-6 py-4 text-center">Ostatni Audyt</th>
                <th className="px-4 sm:px-6 py-4">Deklaracja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {mockRegulatoryData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="font-bold text-slate-900 mb-1">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">
                      {item.type}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <Badge
                      variant={
                        item.compliance === "Zgodna"
                          ? "success"
                          : item.compliance === "Częściowo zgodna"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {item.compliance}
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <div className="font-semibold text-slate-700 mb-0.5">
                      {item.lastAudit}
                    </div>
                    {item.compliance === "Niezgodna" && (
                      <span className="text-[10px] text-red-500 font-bold block">
                        Nowy przegląd!
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.declarationStatus === "Aktualna" ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                      <span
                        className={`font-bold ${
                          item.declarationStatus === "Aktualna"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.declarationStatus}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
