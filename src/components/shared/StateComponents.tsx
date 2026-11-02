"use client";

import React from "react";
import { AlertCircle, RefreshCw, FolderSearch, Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  isSearch?: boolean;
  onClearSearch?: () => void;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  isSearch = false,
  onClearSearch,
  actionText,
  onAction,
}: EmptyStateProps) {
  const defaultTitle = isSearch ? "No matching records found" : "No records available";
  const defaultDesc = isSearch
    ? "Try refining your search terms or clearing active filters to see more results."
    : "There are currently no records stored in this section.";

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
        {isSearch ? <FolderSearch className="w-7 h-7" /> : <Inbox className="w-7 h-7" />}
      </div>

      <div className="max-w-sm space-y-1">
        <h3 className="text-base font-bold text-slate-900">{title || defaultTitle}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description || defaultDesc}</p>
      </div>

      {isSearch && onClearSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0076D7] text-white text-xs font-semibold rounded-xl hover:bg-[#0060b0] transition shadow-xs"
        >
          Clear Filters
        </button>
      )}

      {!isSearch && actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0076D7] text-white text-xs font-semibold rounded-xl hover:bg-[#0060b0] transition shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An unexpected error occurred while communicating with the database server.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-rose-200 p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-rose-600 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const norm = (status || "").toUpperCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";

  if (["COMPLETED", "ACTIVE", "PUBLISHED", "APPROVED", "SUCCESS", "PAID"].includes(norm)) {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (["PENDING", "UNDER_REVIEW", "IN_REVIEW", "DRAFT"].includes(norm)) {
    styles = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (["FAILED", "REJECTED", "CANCELLED"].includes(norm)) {
    styles = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (["EXPIRED", "ARCHIVED", "UNLISTED"].includes(norm)) {
    styles = "bg-slate-100 text-slate-600 border-slate-200";
  } else if (["UPI", "CARD", "NET_BANKING", "WALLET"].includes(norm)) {
    styles = "bg-blue-50 text-[#0076D7] border-blue-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles} ${className}`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
