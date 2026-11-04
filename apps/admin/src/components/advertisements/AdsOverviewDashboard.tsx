"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Send,
  Ticket,
  BellRing,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  Clock,
  Layers,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface AdsOverviewData {
  totalCampaigns: number;
  draftCampaigns: number;
  scheduledCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  cancelledCampaigns: number;
  totalCampaignPushNotifications: number;
  totalNormalPushNotifications: number;
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalInAppNotifications: number;
  notificationsSent: number;
  acceptedDeliveryAttempts: number;
  failedNotificationAttempts: number;
}

export function AdsOverviewDashboard() {
  const [data, setData] = useState<AdsOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:4000/api/v1/admin/ads/overview");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        throw new Error(json.message || "Failed to load overview data");
      }
    } catch (err: any) {
      setError(err?.message || "Error loading overview metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Promotion & Engagement Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
            Advertisement & Notification Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage promotional campaigns, customer discounts, push broadcasts, and in-app announcements for Andhra Pradesh.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0076D7]" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Campaigns */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Promotional Campaigns</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#0B1220]">
              {loading ? "--" : data?.totalCampaigns ?? 0}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="text-blue-600 font-semibold">{data?.scheduledCampaigns ?? 0} Scheduled</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">{data?.completedCampaigns ?? 0} Completed</span>
            </div>
          </div>
          <Link
            href="/advertisements/campaigns"
            className="flex items-center justify-between text-xs font-semibold text-[#0076D7] hover:underline pt-2 border-t border-slate-100"
          >
            <span>View All Campaigns</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2. Coupons */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coupons & Offers</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#0B1220]">
              {loading ? "--" : data?.totalCoupons ?? 0}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="text-emerald-600 font-semibold">{data?.activeCoupons ?? 0} Active</span>
              <span>•</span>
              <span className="text-slate-400 font-semibold">{data?.expiredCoupons ?? 0} Expired</span>
            </div>
          </div>
          <Link
            href="/advertisements/coupons"
            className="flex items-center justify-between text-xs font-semibold text-[#0076D7] hover:underline pt-2 border-t border-slate-100"
          >
            <span>Manage Coupons</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3. In-App Announcements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In-App Inbox Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#0B1220]">
              {loading ? "--" : data?.totalInAppNotifications ?? 0}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="text-purple-600 font-semibold">Active Announcements</span>
            </div>
          </div>
          <Link
            href="/advertisements/in-app"
            className="flex items-center justify-between text-xs font-semibold text-[#0076D7] hover:underline pt-2 border-t border-slate-100"
          >
            <span>In-App Messages</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4. Total Dispatches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Dispatches</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#0B1220]">
              {loading ? "--" : data?.notificationsSent ?? 0}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="text-emerald-600 font-semibold">{data?.acceptedDeliveryAttempts ?? 0} Accepted</span>
              <span>•</span>
              <span className="text-rose-500 font-semibold">{data?.failedNotificationAttempts ?? 0} Failed</span>
            </div>
          </div>
          <Link
            href="/advertisements/reports"
            className="flex items-center justify-between text-xs font-semibold text-[#0076D7] hover:underline pt-2 border-t border-slate-100"
          >
            <span>Delivery Reports</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link
          href="/advertisements/campaigns"
          className="group block p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#0076D7] hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center group-hover:bg-[#0076D7] group-hover:text-white transition">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-[#0076D7] transition">
                Campaign Push Notifications
              </h3>
              <p className="text-xs text-slate-500">Promotions, festivals, category specials</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Schedule broadcast marketing alerts to registered customers and businesses in Vijayawada and Guntur.
          </p>
        </Link>

        <Link
          href="/advertisements/coupons"
          className="group block p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#0076D7] hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-[#0076D7] transition">
                Coupons & Discount Codes
              </h3>
              <p className="text-xs text-slate-500">Flat/percent discounts & usage limits</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Create promotional coupon codes with minimum order values and city restrictions in INR (₹).
          </p>
        </Link>

        <Link
          href="/advertisements/in-app"
          className="group block p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#0076D7] hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-[#0076D7] transition">
                In-App Notifications
              </h3>
              <p className="text-xs text-slate-500">Persistent user inbox announcements</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Publish persistent notifications into the mobile application inbox for important service announcements.
          </p>
        </Link>
      </div>
    </div>
  );
}

