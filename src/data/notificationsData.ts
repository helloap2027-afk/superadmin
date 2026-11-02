export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "KYC_VERIFICATION" | "FINANCIAL" | "CMS_UPDATE" | "SYSTEM_ALERT" | "SECURITY";
  recipient: string;
  is_read: number;
  related_entity?: string;
  related_id?: string;
  created_at: string;
  read_at?: string;
}

export const INITIAL_MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_001",
    title: "4 New Merchant KYC Submissions",
    message: "Vijayawada & Guntur vendors submitted GSTIN and Trade License documents for root verification.",
    type: "KYC_VERIFICATION",
    recipient: "Super Admin",
    is_read: 0,
    related_entity: "businesses",
    related_id: "queue-1",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "notif_002",
    title: "Monthly Revenue Milestone Crossed",
    message: "Platform subscription collections crossed ₹18,45,200 benchmark target for Andhra Pradesh & Telangana regions.",
    type: "FINANCIAL",
    recipient: "Super Admin",
    is_read: 0,
    related_entity: "subscriptions",
    related_id: "sub_101",
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif_003",
    title: "CMS Page Published: Terms & Conditions",
    message: "Terms & Conditions published to v2.4 by Root Administrator.",
    type: "CMS_UPDATE",
    recipient: "Super Admin",
    is_read: 0,
    related_entity: "cms_pages",
    related_id: "terms-and-conditions",
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "notif_004",
    title: "Priority Lead Surge in Visakhapatnam",
    message: "Over 128 customer enquiries registered in Hitec & Benz Circle commercial sectors.",
    type: "SYSTEM_ALERT",
    recipient: "Super Admin",
    is_read: 0,
    related_entity: "enquiries",
    related_id: "enq_surge_vsp",
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: "notif_005",
    title: "Vendor Subscription Renewed",
    message: "Amravati Grand Restaurant renewed Growth Merchant Pro tier successfully via UPI AutoPay.",
    type: "FINANCIAL",
    recipient: "Super Admin",
    is_read: 0,
    related_entity: "payments",
    related_id: "pay_101",
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
  {
    id: "notif_006",
    title: "License Expiry Reminder",
    message: "Siri Dental Clinic Medical Council License is due for annual renewal in 15 days.",
    type: "KYC_VERIFICATION",
    recipient: "Super Admin",
    is_read: 1,
    related_entity: "businesses",
    related_id: "queue-3",
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: "notif_007",
    title: "Dispute Clearance Processed",
    message: "Dispute #8492 resolved for Lead Credit refund of ₹2,999 to Sri Balaji Pure Ghee Sweets.",
    type: "FINANCIAL",
    recipient: "Super Admin",
    is_read: 1,
    related_entity: "payments",
    related_id: "pay_107",
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    read_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "notif_008",
    title: "Security Credential Updated",
    message: "Super Administrator session password credentials refreshed with SHA-256 rotation.",
    type: "SECURITY",
    recipient: "Super Admin",
    is_read: 1,
    related_entity: "users",
    related_id: "usr_super_admin",
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    read_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  }
];

