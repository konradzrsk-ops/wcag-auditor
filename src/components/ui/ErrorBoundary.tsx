import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public handleHardReset = () => {
    try {
      localStorage.removeItem("wally_reaudits_list_v2");
      localStorage.removeItem("wally_pinned_audits");
      localStorage.removeItem("wcag_auditor_client_profile");
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-['Figtree',_sans-serif]"
        >
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Pasek nagłówka */}
            <div className="bg-red-50 border-b border-red-100 p-5 sm:p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
                <AlertTriangle size={26} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-200/60 px-2 py-0.5 rounded">
                  W-ally • Odzyskiwanie po błędzie
                </span>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  {this.props.fallbackTitle || "Wystąpił problem z wyświetleniem widoku"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Aplikacja napotkała nieoczekiwany stan podczas renderowania. Twoje dane są bezpieczne.
                </p>
              </div>
            </div>

            {/* Treść i szczegóły techniczne */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
                <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>Komunikat błędu:</span>
                  <span className="text-[10px] text-slate-400 font-mono">React ErrorBoundary</span>
                </div>
                <code className="block font-mono text-[11px] text-red-700 break-all bg-white p-2 rounded border border-slate-200">
                  {this.state.error?.message || "Nieznany błąd wykonania"}
                </code>
              </div>

              {this.state.error?.stack && (
                <details className="text-xs text-slate-500">
                  <summary className="cursor-pointer font-bold hover:text-slate-800 transition-colors py-1">
                    Pokaż szczegóły techniczne (dla deweloperów)
                  </summary>
                  <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg text-[10px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              {/* Rekomendowane akcje */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0038F8] hover:bg-[#002ECC] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Spróbuj ponownie</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Odśwież stronę</span>
                </button>
                <button
                  type="button"
                  onClick={this.handleHardReset}
                  className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-600 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
                  title="Czyści dane pamięci podręcznej i przywraca stan początkowy"
                >
                  <Home size={14} />
                  <span>Wyczyść cache</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
