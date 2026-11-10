"use client";

import React from "react";
import { User, Store, Layers } from "lucide-react";

interface NotificationRoleTabsProps {
  activeRole: "all" | "customer" | "merchant";
  onRoleChange: (role: "all" | "customer" | "merchant") => void;
  counts: {
    totalUnread: number;
    customerUnread: number;
    merchantUnread: number;
  };
}

export function NotificationRoleTabs({
  activeRole,
  onRoleChange,
  counts,
}: NotificationRoleTabsProps) {
  return (
    <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-3 gap-2">
      {/* 1. All Notifications Tab */}
      <button
        onClick={() => onRoleChange("all")}
        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition font-bold text-left ${
          activeRole === "all"
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg shrink-0 ${activeRole === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-black leading-tight truncate">All Notifications</div>
            <div className={`text-[10px] hidden sm:block truncate ${activeRole === "all" ? "text-slate-300" : "text-slate-400"}`}>
              Combined account activity
            </div>
          </div>
        </div>
        {counts.totalUnread > 0 && (
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
            activeRole === "all" ? "bg-white text-slate-900" : "bg-red-500 text-white"
          }`}>
            {counts.totalUnread}
          </span>
        )}
      </button>

      {/* 2. Customer Tab */}
      <button
        onClick={() => onRoleChange("customer")}
        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition font-bold text-left ${
          activeRole === "customer"
            ? "bg-gradient-to-r from-blue-600 to-[#0076D7] text-white shadow-sm"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg shrink-0 ${activeRole === "customer" ? "bg-white/20 text-white" : "bg-blue-50 text-[#0076D7]"}`}>
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-black leading-tight truncate">Customer</div>
            <div className={`text-[10px] hidden sm:block truncate ${activeRole === "customer" ? "text-blue-100" : "text-slate-400"}`}>
              Quotes, replies &amp; offers
            </div>
          </div>
        </div>
        {counts.customerUnread > 0 && (
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
            activeRole === "customer" ? "bg-white text-blue-700" : "bg-red-500 text-white"
          }`}>
            {counts.customerUnread}
          </span>
        )}
      </button>

      {/* 3. Business Partner Tab */}
      <button
        onClick={() => onRoleChange("merchant")}
        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition font-bold text-left ${
          activeRole === "merchant"
            ? "bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white shadow-sm"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg shrink-0 ${activeRole === "merchant" ? "bg-white/20 text-white" : "bg-orange-50 text-[#FF6B35]"}`}>
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-black leading-tight truncate">Business Partner</div>
            <div className={`text-[10px] hidden sm:block truncate ${activeRole === "merchant" ? "text-orange-100" : "text-slate-400"}`}>
              Buyer leads &amp; KYC alerts
            </div>
          </div>
        </div>
        {counts.merchantUnread > 0 && (
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
            activeRole === "merchant" ? "bg-white text-orange-700" : "bg-red-500 text-white"
          }`}>
            {counts.merchantUnread}
          </span>
        )}
      </button>
    </div>
  );
}

