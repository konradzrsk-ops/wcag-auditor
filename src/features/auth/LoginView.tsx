import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';

// ==========================================
// Types
// ==========================================

interface LoginViewProps {
  onLogin: () => void;
}

// ==========================================
// LoginView Component
// ==========================================

export function LoginView({ onLogin }: LoginViewProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div
      data-testid="login-view"
      className="flex h-screen w-full bg-white text-slate-900 overflow-hidden"
    >
      {/* LEFT SIDE — LOGIN FORM */}
      <div
        data-testid="login-form-container"
        className="w-full lg:w-[500px] xl:w-[600px] flex flex-col p-8 sm:p-12 lg:p-16 relative z-10 bg-white overflow-y-auto"
      >
        <div className="w-full max-w-[400px] mx-auto flex flex-col h-full min-h-[500px]">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-500/20 flex-shrink-0">
              <Eye size={24} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-slate-900 font-extrabold text-2xl leading-none tracking-tight">
                W-ally
              </span>
              <span className="text-brand-500 text-tiny font-black tracking-[0.2em] mt-1 uppercase">
                Accessibility Platform
              </span>
            </div>
          </div>

          {/* Main form area */}
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

            <form
              data-testid="login-form"
              onSubmit={handleLogin}
              className="space-y-5"
            >
              {/* Email field */}
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="block text-[13px] font-bold text-slate-700"
                >
                  Adres e-mail
                </label>
                <div className="relative flex items-center group">
                  <Mail
                    className="absolute left-4 text-slate-400 group-focus-within:text-brand-500 transition-colors"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="login-email"
                    data-testid="login-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jan.kowalski@firma.pl"
                    className="w-full bg-white border border-slate-200 rounded-control pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-[13px] font-bold text-slate-700"
                  >
                    Hasło
                  </label>
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="text-[13px] font-bold text-brand-500 hover:text-brand-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
                  >
                    Zapomniałeś hasła?
                  </button>
                </div>
                <div className="relative flex items-center group">
                  <Lock
                    className="absolute left-4 text-slate-400 group-focus-within:text-brand-500 transition-colors"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    data-testid="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-slate-200 rounded-control pl-12 pr-12 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded focus:text-brand-500"
                    aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                  >
                    {showPassword ? (
                      <EyeOff size={20} aria-hidden="true" />
                    ) : (
                      <Eye size={20} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox — uses design system Checkbox */}
              <div className="mt-2">
                <Checkbox
                  label="Zapamiętaj mnie na tym urządzeniu"
                  checked={rememberMe}
                  onChange={setRememberMe}
                />
              </div>

              {/* Submit button — uses design system Button */}
              <Button
                data-testid="login-submit-button"
                type="submit"
                variant="primary"
                size="lg"
                rightIcon={
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                }
                className="w-full mt-6 shadow-[0_4px_14px_rgba(0,56,248,0.25)] hover:shadow-[0_6px_20px_rgba(0,56,248,0.3)] group"
              >
                Zaloguj się do panelu
              </Button>
            </form>

            {/* Social login divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-100" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Lub kontynuuj przez
              </span>
              <div className="flex-1 h-px bg-slate-100" aria-hidden="true" />
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="secondary" size="md" className="gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
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
              </Button>
              <Button variant="secondary" size="md" className="gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M10 0H0V10H10V0Z" fill="#F25022" />
                  <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
                  <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
                  <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
                </svg>
                Microsoft
              </Button>
            </div>

            {/* Security notice */}
            <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-control flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="text-brand-500 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Logowanie objęte jest korporacyjnymi zasadami bezpieczeństwa.
                Wpisując dane potwierdzasz zgodność z{' '}
                <button
                  type="button"
                  onClick={(e) => e.preventDefault()}
                  className="text-brand-500 font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
                >
                  Polityką Bezpieczeństwa
                </button>
                .
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-400 gap-4 shrink-0">
            <span>© 2026 Widzialni.eu</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
              >
                Pomoc
              </button>
              <button
                type="button"
                className="hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
              >
                Polityka Prywatności
              </button>
              <button
                type="button"
                className="hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
              >
                Zgłoś problem
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — MARKETING / BRANDING */}
      <div className="hidden lg:flex lg:flex-1 relative bg-brand-500 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-[#001766]"
          aria-hidden="true"
        />
        <div
          className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-white/10 blur-3xl mix-blend-overlay"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#00D4FF]/20 blur-3xl mix-blend-overlay"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16 h-full text-white">
          <div className="max-w-[500px] w-full">
            {/* Decorative illustration — hidden from assistive tech */}
            <div
              className="w-full bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-6 mb-12 transform rotate-2 hover:rotate-0 transition-transform duration-500"
              aria-hidden="true"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-end gap-4 mb-8">
                <div className="w-1/3 bg-white/10 h-24 rounded-lg border border-white/5 relative overflow-hidden">
                  <div className="absolute bottom-0 w-full h-1/2 bg-[#00D4FF]/30" />
                </div>
                <div className="w-1/3 bg-white/10 h-32 rounded-lg border border-white/5 relative overflow-hidden">
                  <div className="absolute bottom-0 w-full h-3/4 bg-[#00D4FF]/50" />
                </div>
                <div className="w-1/3 bg-white/20 h-40 rounded-lg border border-white/20 relative overflow-hidden shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                  <div className="absolute bottom-0 w-full h-[90%] bg-[#00D4FF]" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="w-full h-3 bg-white/10 rounded-full" />
                <div className="w-4/5 h-3 bg-white/10 rounded-full" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#00D4FF] mb-6 uppercase tracking-widest backdrop-blur-sm">
              <CheckCircle2 size={14} aria-hidden="true" /> Pełne wsparcie WCAG
              2.2
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

            {/* Testimonial */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <div className="flex gap-1 text-amber-400 mb-3" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <p className="italic text-white/90 text-sm mb-4">
                &ldquo;Wdrożenie platformy W-ally pozwoliło nam skrócić czas
                naprawy błędów krytycznych o 40% i uporządkować współpracę z
                dostawcami.&rdquo;
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
  );
}
