// ==========================================
// Formatting Utilities
// ==========================================

/**
 * Format a number as percentage with one decimal
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format a date string for display
 */
export function formatDate(date: string): string {
  return date;
}

/**
 * Get compliance variant based on score threshold
 */
export function getComplianceVariant(
  score: number
): "success" | "warning" | "danger" {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

/**
 * Get compliance label based on score
 */
export function getComplianceLabel(score: number): string {
  if (score >= 80) return "Wysoka zgodność";
  if (score >= 60) return "Częściowa zgodność";
  return "Niska zgodność";
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==========================================
// Accessibility Utilities
// ==========================================

/**
 * Handle keyboard activation (Enter/Space) for custom interactive elements
 */
export function handleKeyboardActivation(
  callback: () => void
): (e: React.KeyboardEvent) => void {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };
}

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  const focusableElements = container.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  function handleTab(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable?.focus();
        e.preventDefault();
      }
    }
  }

  container.addEventListener("keydown", handleTab);
  firstFocusable?.focus();

  return () => container.removeEventListener("keydown", handleTab);
}

// ==========================================
// Constants
// ==========================================

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  AUDITS: "/audyty",
  AUDIT_DETAIL: "/audyty/:id",
  AUDIT_ERRORS: "/audyty/:id/bledy",
  SERVICES: "/uslugi",
  SERVICE_DETAIL: "/uslugi/:id",
  PROCESS_DETAIL: "/uslugi/:id/:pid",
  REPORTING: "/raportowanie",
  COMPLAINTS: "/reklamacje",
  COMPLAINT_NEW: "/reklamacje/nowy",
  COMPLAINT_DETAIL: "/reklamacje/:id",
} as const;

export const PRIORITY_CONFIG = {
  Krytyczny: {
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "AlertOctagon" as const,
  },
  Ważny: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "AlertTriangle" as const,
  },
  Marginalny: {
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "Info" as const,
  },
} as const;

export const COMPLAINT_STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Nowy: {
    color: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-200",
  },
  "W analizie": {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  Rekomendacja: {
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  "W naprawie": {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Weryfikacja: {
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  Zamknięty: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  Odrzucony: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};
