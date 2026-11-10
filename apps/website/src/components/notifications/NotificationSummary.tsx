"use client";

import React from "react";
import { MessageSquare, Store, Tag, ShieldCheck, Star, Bell } from "lucide-react";

interface NotificationSummaryProps {
  role: "customer" | "merchant" | "all";
  counts: {
    customerUnread: number;
    merchantUnread: number;
    totalUnread: number;
    enquiries?: number;
    replies?: number;
    offers?: number;
    security?: number;
    leads?: number;
    kyc?: number;
    reviews?: number;
    system?: number;
  };
  totalRecords: number;
}

export function NotificationSummary({ role, counts, totalRecords }: NotificationSummaryProps) {
  if (role === "customer") {
    // 4 Pastel Cards matching customer reference image:
    // 1. Enquiry Updates — Blue
    // 2. Business Replies — Orange
    // 3. Offers & Deals — Amber
    // 4. Account & Security — Green
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Enquiry Updates */}
        <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-sky-100 text-[#0076D7] flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {counts.enquiries ?? 0}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Enquiry Updates</div>
          </div>
        </div>

        {/* 2. Business Replies */}
        <div className="bg-orange-50/70 border border-orange-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {counts.replies ?? 0}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Business Replies</div>
          </div>
        </div>

        {/* 3. Offers & Deals */}
        <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {counts.offers ?? 0}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Offers &amp; Deals</div>
          </div>
        </div>

        {/* 4. Account & Security */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {counts.security ?? 0}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Account &amp; Security</div>
          </div>
        </div>
      </div>
    );
  }

  // Business Partner:
  // 1. Enquiries & Leads — Blue
  // 2. KYC & Verification — Green
  // 3. Reviews & Ratings — Amber
  // 4. System Alerts — Purple
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Enquiries & Leads */}
      <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
        <div className="w-11 h-11 rounded-xl bg-sky-100 text-[#0076D7] flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
            {counts.leads ?? 0}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Enquiries &amp; Leads</div>
        </div>
      </div>

      {/* 2. KYC & Verification */}
      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
        <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
            {counts.kyc ?? 0}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">KYC &amp; Verification</div>
        </div>
      </div>

      {/* 3. Reviews & Ratings */}
      <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
        <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <Star className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
            {counts.reviews ?? 0}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Reviews &amp; Ratings</div>
        </div>
      </div>

      {/* 4. System Alerts */}
      <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
        <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
            {counts.system ?? 0}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">System Alerts</div>
        </div>
      </div>
    </div>
  );
}

