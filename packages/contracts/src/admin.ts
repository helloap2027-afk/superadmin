export interface AdminDashboardMetrics {
  kpiSummary: {
    totalRegisteredUsers: number;
    usersWeeklyGrowthPercent: number;
    totalBusinesses: number;
    pendingVerificationAlertCount: number;
    liveEnquiries: number;
    enquiriesRespondedRatePercent: number;
    revenueCurrentMonthInr: number;
    activeSubscriptions: {
      helloPlus: number;
      helloPro: number;
    };
  };
  verificationStatusBreakdown: {
    approvedPercent: number;
    pendingPercent: number;
    draftIncompletePercent: number;
  };
  pendingQueuePreview: Array<{
    id: string;
    name: string;
    category: string;
    city: string;
    documentsUploaded: string[];
    status: string;
    submittedAt: string;
  }>;
}

export interface VerificationDecisionRequest {
  businessId: string;
  action: "APPROVE" | "REJECT";
  rejectionReason?: string;
  adminRemarks?: string;
}
