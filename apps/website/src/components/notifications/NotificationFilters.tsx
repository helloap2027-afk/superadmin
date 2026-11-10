"use client";

import React from "react";
import { Search, X, Zap, Tag, ShieldCheck, Star, Bell } from "lucide-react";

interface NotificationFiltersProps {
  role: "customer" | "merchant" | "all";
  statusFilter: "ALL" | "UNREAD" | "READ";
  onStatusChange: (status: "ALL" | "UNREAD" | "READ") => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  counts: {
    total: number;
    unread: number;
    read: number;
  };
}

export function NotificationFilters({
  role,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  searchQuery,
  onSearchChange,
  counts,
}: NotificationFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-2xs">
      
      {/* Status Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none pb-1 md:pb-0">
        
        {/* All Status */}
        <button
          onClick={() => onStatusChange("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === "ALL"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <span>All Status</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
            statusFilter === "ALL" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
          }`}>
            {counts.total}
          </span>
        </button>

        {/* Unread */}
        <button
          onClick={() => onStatusChange("UNREAD")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === "UNREAD"
              ? "bg-[#0076D7] text-white shadow-2xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <span>Unread</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
            statusFilter === "UNREAD" ? "bg-white/20 text-white" : "bg-blue-100 text-[#0076D7]"
          }`}>
            {counts.unread}
          </span>
        </button>

        {/* Read */}
        <button
          onClick={() => onStatusChange("READ")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === "READ"
              ? "bg-slate-800 text-white shadow-2xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <span>Read</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
            statusFilter === "READ" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
          }`}>
            {counts.read}
          </span>
        </button>

        <span className="text-slate-200 mx-1">|</span>

        {/* Category Filter Pills: Customer vs Business Partner */}
        {role === "customer" ? (
          <>
            {/* Fast Quotes */}
            <button
              onClick={() => onTypeChange(typeFilter === "QUOTE_RECEIVED" ? "ALL" : "QUOTE_RECEIVED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                typeFilter === "QUOTE_RECEIVED"
                  ? "bg-amber-500 text-white shadow-2xs"
                  : "bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Fast Quotes</span>
            </button>

            {/* Special Offers */}
            <button
              onClick={() => onTypeChange(typeFilter === "OFFER_ALERT" ? "ALL" : "OFFER_ALERT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                typeFilter === "OFFER_ALERT"
                  ? "bg-rose-500 text-white shadow-2xs"
                  : "bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Special Offers</span>
            </button>

            {/* Account Alerts (NOT KYC - KYC removed from Customer) */}
            <button
              onClick={() => onTypeChange(typeFilter === "SUBSCRIPTION_UPDATE" ? "ALL" : "SUBSCRIPTION_UPDATE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                typeFilter === "SUBSCRIPTION_UPDATE"
                  ? "bg-sky-600 text-white shadow-2xs"
                  : "bg-sky-50 text-[#0076D7] border border-sky-200/80 hover:bg-sky-100"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Account Alerts</span>
            </button>
          </>
        ) : (
          <>
            {/* Buyer Leads */}
            <button
              onClick={() => onTypeChange(typeFilter === "LEAD_RECEIVED" ? "ALL" : "LEAD_RECEIVED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                typeFilter === "LEAD_RECEIVED"
                  ? "bg-[#FF6B35] text-white shadow-2xs"
                  : "bg-orange-50 text-[#FF6B35] border border-orange-200/80 hover:bg-orange-100"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buyer Leads</span>
            </button>

            {/* Approvals (KYC) */}
            <button
              onClick={() => onTypeChange(typeFilter === "KYC_VERIFICATION" ? "ALL" : "KYC_VERIFICATION")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                typeFilter === "KYC_VERIFICATION"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approvals (KYC)</span>
            </button>

            {/* Reviews */}
            <button
              onClick={() => onTypeChange(typeFilter === "REVIEW_RECEIVED" ? "ALL" : "REVIEW_RECEIVED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                typeFilter === "REVIEW_RECEIVED"
                  ? "bg-amber-500 text-white shadow-2xs"
                  : "bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100"
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Reviews</span>
            </button>

            {/* System */}
            <button
              onClick={() => onTypeChange(typeFilter === "SYSTEM" ? "ALL" : "SYSTEM")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                typeFilter === "SYSTEM"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "bg-purple-50 text-purple-700 border border-purple-200/80 hover:bg-purple-100"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>System</span>
            </button>
          </>
        )}
      </div>

      {/* Search Input Box */}
      <div className="relative min-w-[240px] sm:w-64">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notifications..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-8 py-1.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0076D7] focus:bg-white transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}

