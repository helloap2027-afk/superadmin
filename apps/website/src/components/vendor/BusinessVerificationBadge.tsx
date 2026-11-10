"use client";

import React from "react";
import { ShieldCheck, Clock, AlertTriangle, AlertCircle, XCircle } from "lucide-react";

export type KycVerificationStatus =
  | "NOT_SUBMITTED"
  | "PENDING"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REJECTED"
  | "RESUBMISSION_REQUIRED"
  | "VERIFIED"
  | "APPROVED"
  | "EXPIRED"
  | "SUSPENDED";

interface BusinessVerificationBadgeProps {
  status?: string | null;
  isVerified?: boolean | number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

/**
 * Normalizes any backend or database status string into the authoritative KYC state
 * Strict Precedence Order:
 * 1. SUSPENDED (Highest precedence - restriction overrides stale is_verified)
 * 2. REJECTED / RESUBMISSION_REQUIRED (Administrative decision overrides stale is_verified)
 * 3. EXPIRED (Revocation/expiration overrides is_verified)
 * 4. UNDER_REVIEW / PENDING / SUBMITTED (Active re-submission overrides stale is_verified)
 * 5. VERIFIED / APPROVED (Only if status is APPROVED/VERIFIED and not restricted)
 * 6. NOT_SUBMITTED (Default / Unverified)
 */
export function normalizeKycStatus(
  status?: string | null,
  isVerified?: boolean | number
): KycVerificationStatus {
  const s = String(status || "").toUpperCase().trim();

  // 1. Suspension
  if (s === "SUSPENDED") return "SUSPENDED";

  // 2. Rejection / Action Required
  if (s === "REJECTED") return "REJECTED";
  if (s === "RESUBMISSION_REQUIRED") return "RESUBMISSION_REQUIRED";

  // 3. Expiration
  if (s === "EXPIRED") return "EXPIRED";

  // 4. Pending / Under Review (A newly submitted/pending KYC cannot show verified even if stale is_verified is true)
  if (s === "UNDER_REVIEW") return "UNDER_REVIEW";
  if (s === "PENDING" || s === "SUBMITTED") return "PENDING";

  // 5. Verified / Approved
  if (s === "VERIFIED" || s === "APPROVED" || isVerified === true || isVerified === 1) {
    return "VERIFIED";
  }

  // 6. Default Unverified
  return "NOT_SUBMITTED";
}

/**
 * Authoritative Business Verification Badge
 * NEVER renders green Verified unless status === 'VERIFIED' / 'APPROVED' or isVerified === true
 */
export function BusinessVerificationBadge({
  status,
  isVerified,
  size = "sm",
  className = "",
  showIcon = true,
}: BusinessVerificationBadgeProps) {
  const normalized = normalizeKycStatus(status, isVerified);

  let label = "Unverified";
  let colorClasses = "bg-slate-100 text-slate-600 border-slate-200";
  let IconComp = ShieldCheck;

  switch (normalized) {
    case "VERIFIED":
      label = "Verified";
      colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      IconComp = ShieldCheck;
      break;

    case "PENDING":
      label = "Pending Verification";
      colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
      IconComp = Clock;
      break;

    case "UNDER_REVIEW":
      label = "Under Review";
      colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
      IconComp = Clock;
      break;

    case "REJECTED":
      label = "Action Required";
      colorClasses = "bg-red-50 text-red-700 border-red-200";
      IconComp = AlertTriangle;
      break;

    case "RESUBMISSION_REQUIRED":
      label = "Resubmission Required";
      colorClasses = "bg-red-50 text-red-700 border-red-200";
      IconComp = AlertTriangle;
      break;

    case "EXPIRED":
      label = "Verification Expired";
      colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
      IconComp = AlertCircle;
      break;

    case "SUSPENDED":
      label = "Suspended";
      colorClasses = "bg-red-100 text-red-800 border-red-300";
      IconComp = XCircle;
      break;

    case "NOT_SUBMITTED":
    default:
      label = "Unverified";
      colorClasses = "bg-slate-100 text-slate-600 border-slate-200";
      IconComp = ShieldCheck;
      break;
  }

  const sizeClasses =
    size === "lg"
      ? "text-xs px-3 py-1 gap-1.5"
      : size === "md"
      ? "text-[11px] px-2.5 py-0.5 gap-1.5"
      : "text-[10px] px-2 py-0.5 gap-1";

  const iconSizes = size === "lg" ? "w-3.5 h-3.5" : size === "md" ? "w-3 h-3" : "w-2.5 h-2.5";

  return (
    <span
      className={`border font-bold rounded-full inline-flex items-center shadow-2xs select-none ${sizeClasses} ${colorClasses} ${className}`}
      title={`Business KYC Status: ${label}`}
      aria-label={`Business KYC Status: ${label}`}
    >
      {showIcon && <IconComp className={`${iconSizes} shrink-0`} />}
      <span>{label}</span>
    </span>
  );
}

