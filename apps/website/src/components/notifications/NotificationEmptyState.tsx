"use client";

import React from "react";
import { Bell, RefreshCw, Layers } from "lucide-react";

interface NotificationEmptyStateProps {
  role: "customer" | "merchant" | "all";
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function NotificationEmptyState({
  role,
  hasFilters,
  onClearFilters,
}: NotificationEmptyStateProps) {
  const roleLabel =
    role === "customer"
      ? "Customer"
      : role === "merchant"
      ? "Business Partner"
      : "Account";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-14 text-center space-y-4 shadow-2xs">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
        <Bell className="w-8 h-8" />
      </div>
      <div className="max-w-md mx-auto space-y-1.5">
        <h3 className="text-base font-black text-slate-800">
          No {roleLabel} Notifications Found
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {hasFilters
            ? "No notifications match your active search terms or status filters. Try clearing your filters to see all alerts."
            : `You're completely caught up! New inquiries, 15-min quote updates, and ${
                role === "customer" ? "exclusive deals" : "verification approvals"
              } will appear here in real time.`}
        </p>
      </div>

      {hasFilters && (
        <div className="pt-2">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}

