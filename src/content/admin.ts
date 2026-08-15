import type { LeadStatusValue } from "@/types/submission";

export const adminContent = {
  metadata: {
    title: "FRAMIO Lead Desk",
    description: "Secure FRAMIO project-submission management."
  },
  login: {
    heading: { prefix: "Ops ", accent: "Desk" },
    description: "Sign in with your admin account to review project briefs, update lead status, and export submissions.",
    emailLabel: "Email",
    emailPlaceholder: "admin@framio.in",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    submitLabel: "Sign in →",
    submittingLabel: "Signing in…",
    invalidMessage: "Invalid email or password.",
    unavailableMessage: "Sign-in is unavailable. Check the server configuration."
  },
  header: {
    brandName: "Ops Desk / Admin",
    refresh: "Refresh",
    logout: "Sign out",
    website: "View Website ↗"
  },
  hero: {
    kicker: "FRAMIO / Project Pipeline",
    heading: { prefix: "Lead ", accent: "intelligence" },
    description: "Every submitted project brief is stored securely in the database and available across authorized devices."
  },
  stats: {
    total: "Total Leads",
    new: "New",
    qualified: "Qualified",
    month: "This Month"
  },
  controls: {
    searchPlaceholder: "Search name, brand, email, service…",
    allStatuses: "All Statuses",
    export: "Export CSV ↓"
  },
  formatting: {
    emptyValue: "-",
    leadSeparator: " · ",
    itemSeparator: ", ",
    detailSeparator: " • "
  },
  statusLabels: {
    NEW: "New",
    CONTACTED: "Contacted",
    QUALIFIED: "Qualified",
    CLOSED: "Closed"
  } satisfies Record<LeadStatusValue, string>,
  tableHeadings: ["Lead", "Services", "Budget", "Submitted", "Status", "Actions"],
  actions: {
    view: "View",
    viewBrief: "View Brief",
    email: "Email",
    close: "Close ✕",
    delete: "Delete Lead",
    save: "Save Changes",
    saving: "Saving…"
  },
  empty: {
    heading: "No project briefs yet",
    description: "New website submissions will appear here automatically."
  },
  modal: {
    fallbackTitle: "Project Brief",
    notePlaceholder: "Internal note…",
    details: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      contact: "Contact",
      budget: "Budget",
      services: "Services",
      goal: "Goal",
      timeline: "Timeline",
      projectDetails: "Project Details"
    }
  },
  messages: {
    loadFailed: "Couldn’t load submissions. Please refresh.",
    saveFailed: "Couldn’t save the changes. Please try again.",
    deleteFailed: "Couldn’t delete the submission. Please try again.",
    deleteConfirm: "Delete this project brief? This action cannot be undone.",
    noExport: "No leads to export yet."
  }
} as const;
