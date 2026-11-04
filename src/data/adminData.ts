export interface PendingVerificationItem {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  category: string;
  city: string;
  locality?: string;
  documents: string[];
  status: "UNDER REVIEW" | "RE-SUBMITTED" | "NEW REQ" | "APPROVED" | "REJECTED";
}

export interface AuditLogItem {
  id: string;
  type: "success" | "warning" | "info";
  message: string;
  timestamp: string;
}
