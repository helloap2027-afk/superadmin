export interface CreateEnquiryRequest {
  businessId: string;
  customerName: string;
  customerPhone: string;
  message: string;
  priority?: "NORMAL" | "HIGH" | "URGENT";
}

export interface EnquiryItem {
  id: string;
  referenceNo: string;
  businessId: string;
  businessName?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  message: string;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CONVERTED" | "CLOSED_LOST";
  priority: "NORMAL" | "HIGH" | "URGENT";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEnquiryStatusRequest {
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CONVERTED" | "CLOSED_LOST";
  notes?: string;
}
