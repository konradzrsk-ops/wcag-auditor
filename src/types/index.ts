// ==========================================
// Audit & Report Types
// ==========================================

export interface AuditError {
  id: string;
  title: string;
  criteria: string;
  priority: "Krytyczny" | "Ważny" | "Marginalny";
  status: "Nowy" | "W trakcie" | "Rozwiązany";
}

export interface AuditView {
  id: string;
  name: string;
  channel: string;
  score: number;
  priorities: PriorityCounts;
  errors: AuditError[];
  history: HistoryPoint[];
}

export interface AuditProcess {
  id: string;
  name: string;
  stats: {
    views: number;
    totalViews: number;
    score: number;
    priorities: PriorityCounts;
  };
  views: AuditView[];
  history: HistoryPoint[];
}

export interface AuditService {
  id: string;
  name: string;
  stats: {
    processes: number;
    views: number;
    totalViews: number;
    score: number;
    priorities: PriorityCounts;
  };
  history: HistoryPoint[];
  processes: AuditProcess[];
}

export interface AuditReport {
  id: string;
  clientName: string;
  title: string;
  status: "Zakończony" | "W trakcie" | "Nowy";
  auditor: string;
  wcagLevel: string;
  startDate: string;
  endDate: string;
  score: number;
  criticalErrors: number;
  totalCriteria: number;
  brokenCriteria: number;
  channel: string;
}

// ==========================================
// Service / Process Types
// ==========================================

export interface ServiceTreeItem {
  id: string;
  name: string;
  processCount: number;
  processes?: ServiceTreeProcess[];
}

export interface ServiceTreeProcess {
  id: string;
  name: string;
}

// ==========================================
// Complaint / Ticket Types
// ==========================================

export type ComplaintStatus =
  | "Nowy"
  | "W analizie"
  | "Rekomendacja"
  | "W naprawie"
  | "Weryfikacja"
  | "Zamknięty"
  | "Odrzucony";

export type ComplaintPriority = "Krytyczny" | "Ważny" | "Marginalny";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  reporter: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline?: string;
  serviceName: string;
  processName?: string;
  viewName?: string;
  auditId?: string;
  wcagCriteria?: string;
  attachments?: Attachment[];
  recommendation?: Recommendation;
  activities: Activity[];
}

export interface Recommendation {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  estimatedFixTime?: string;
  relatedCriteria: string[];
}

export interface Activity {
  id: string;
  type: "status_change" | "comment" | "recommendation" | "attachment";
  author: string;
  createdAt: string;
  content: string;
  oldValue?: string;
  newValue?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// ==========================================
// Shared Types
// ==========================================

export interface PriorityCounts {
  c: number; // Krytyczny
  w: number; // Ważny
  m: number; // Marginalny
}

export interface HistoryPoint {
  date: string;
  score: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface ChartDataPoint {
  month: string;
  score: number;
  errors: number;
}

export interface ChannelData {
  name: string;
  percentage: number;
  icon: string;
}

export interface RegulatoryService {
  id: string;
  name: string;
  type: string;
  compliance: "Zgodna" | "Częściowo zgodna" | "Niezgodna";
  lastAuditDate: string;
  declarationStatus: "Aktualna" | "Wymaga aktualizacji" | "Przeterminowana";
  needsReview: boolean;
}

export interface FlatError {
  id: string;
  problem: string;
  recommendation: string;
  priority: "Krytyczny" | "Ważny" | "Marginalny";
  channels: string[];
  dateFound: string;
  criteria: string;
  auditViewName: string;
  serviceViewName: string;
  processName: string;
  serviceName: string;
  auditName: string;
  auditStatus: string;
  auditStart: string;
  auditEnd: string;
}

// ==========================================
// Client Profile & Organization Types
// ==========================================

export interface ClientProfile {
  // Profil organizacji & Branding
  orgName: string;
  orgShortName: string;
  orgLogo: string;
  orgAltText: string;
  taxId: string;
  sector: string;
  domain: string;
  accountTier: string;

  // Ustawienia audytowe & WCAG
  wcagStandard: string;
  targetScore: number;
  auditCoordinatorName: string;
  auditCoordinatorEmail: string;
  auditCoordinatorPhone: string;
  department: string;
  declarationDate: string;
  declarationUrl: string;

  // Profil użytkownika
  userName: string;
  userRole: string;
  userEmail: string;
  userPhone: string;
  userAvatar: string;
  twoFactorEnabled: boolean;

  // Powiadomienia & Subskrypcje
  notifyCriticalErrors: boolean;
  notifyAuditorReplies: boolean;
  weeklyDigest: boolean;
  declarationReminders: boolean;
}

