export interface SendOtpRequest {
  phoneNumber: string; // E.164 e.g. +919848012345
  purpose: "LOGIN" | "CLAIM_BIZ" | "SENSITIVE_ACTION";
}

export interface SendOtpResponse {
  challengeId: string;
  expiresInSeconds: number;
  resendCooldownSeconds: number;
  maskedPhone: string;
}

export interface VerifyOtpRequest {
  challengeId: string;
  otp: string; // 6 digits
  deviceInfo?: string;
}

export interface UserSessionPayload {
  id: string;
  phoneNumber: string;
  fullName?: string;
  avatarUrl?: string;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  roles: Array<"CUSTOMER" | "VENDOR_OWNER" | "VENDOR_STAFF" | "ADMIN_MODERATOR" | "SUPER_ADMIN">;
  ownedBusinesses?: Array<{
    id: string;
    name: string;
    slug: string;
    isVerified: boolean;
    status: string;
  }>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: UserSessionPayload;
}
