// ============================================
// ADMIN SHARED TYPES
// ============================================

export type TabId =
  | "overview"
  | "users"
  | "disputes"
  | "providers"
  | "bookings"
  | "transactions"
  | "services"
  | "categories"
  | "reports"
  | "analytics"
  | "team"
  | "settings";

export type AdminRole =
  | "super_admin"
  | "moderator"
  | "support_agent"
  | "data_analyst"
  | "finance_manager"
  | "content_manager";

export type DisputeStatus = "open" | "in-review" | "resolved" | "escalated";
export type DisputePriority = "high" | "medium" | "low";

export interface Dispute {
  id: string;
  status: DisputeStatus;
  priority: DisputePriority;
  client: string;
  provider: string;
  service: string;
  amount: string;
  date: string;
  category: string;
  description: string;
  providerResponse: string;
  resolution?: string;
}
