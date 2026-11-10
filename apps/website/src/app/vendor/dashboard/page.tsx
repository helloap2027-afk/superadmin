"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  Home,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Phone,
  Star,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Settings,
  Edit3,
  FileText,
  FileCheck,
  Check,
  Building,
  User,
  LogOut,
  ChevronDown,
  RefreshCw,
  Crown
} from "lucide-react";
import { DesktopFooter } from "@/components/DesktopFooter";
import { BusinessPartnerHeader } from "@/components/vendor/BusinessPartnerHeader";
import { BusinessVerificationBadge, normalizeKycStatus } from "@/components/vendor/BusinessVerificationBadge";
import { PartnerPortalSidebar } from "@/components/vendor/PartnerPortalSidebar";
const API_BASE = "http://localhost:4000/api/v1";

export default function MerchantMyBusinessDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("My Business");
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  // Authenticated Profile Fetch
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
      const userStr = typeof window !== "undefined" ? localStorage.getItem("hello_user") : null;
      let uid = "";
      if (userStr) {
        try {
          uid = JSON.parse(userStr).id || "";
        } catch {}
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (uid) headers["x-user-id"] = uid;

      const res = await fetch(`${API_BASE}/merchant/profile`, { headers });
      const json = await res.json();
      if (json?.success && json.data) {
        setProfile(json.data);
      }

      // Notification counts for merchant
      try {
        const countRes = await fetch(`${API_BASE}/notifications/counts`);
        const countJson = await countRes.json();
        if (countJson?.success && countJson.data) {
          setUnreadNotifs(countJson.data.merchantUnread || 0);
        }
      } catch {}
    } catch (err) {
      console.error("Failed to load business dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const business = profile?.business;
  const completion = profile?.completion;
  const user = profile?.user;
  const subscription = profile?.subscription;
  const enquiries = profile?.enquiries || [];

  // Derived Analytics Values
  const liveQuotes = business?.analytics?.liveQuotes ?? business?.totalEnquiries ?? 28;
  const profileViews = business?.analytics?.profileViews ?? 1246;
  const profileViewsGrowth = business?.analytics?.profileViewsGrowth ?? "+18% vs last 7 days";
  const callsReceived = business?.analytics?.callsReceived ?? 96;
  const rating = business?.analytics?.rating ?? business?.averageRating ?? 4.8;
  const reviewsCount = business?.analytics?.reviewsCount ?? business?.totalReviews ?? 326;

  // Verification & Status checks (Bound to authoritative database state)
  const normalizedKyc = normalizeKycStatus(business?.status, business?.isVerified);
  const isKycApproved = normalizedKyc === "VERIFIED" || normalizedKyc === "APPROVED";
  const statusDisplay = isKycApproved
    ? "Active (Live)"
    : normalizedKyc === "UNDER_REVIEW" || normalizedKyc === "PENDING"
    ? "Under Review"
    : normalizedKyc === "REJECTED"
    ? "Action Required"
    : normalizedKyc === "SUSPENDED"
    ? "Suspended"
    : "Pending Verification";

  // Formatted Listed Since Date
  const listedSince = business?.createdAt
    ? new Date(business.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Mar 2024";

  // Profile completion score (Independent from document status and KYC verification)
  const completionPercent = completion?.percentage ?? (isKycApproved ? 100 : 50);

  // Dynamic Document & Tax Status (Distinguishing Submission vs Verification)
  const docsList: any[] = Array.isArray(business?.documents) ? business.documents : [];
  const hasGst = Boolean(business?.gstNumber && business.gstNumber.trim().length > 0);
  const hasMsme = Boolean(business?.udyamNumber && business.udyamNumber.trim().length > 0);

  // Check if GST document is verified vs provided
  const gstDoc = docsList.find((d) => d.documentType?.includes("GST") || d.documentCategory === "BUSINESS_PROOF");
  const isGstVerified = gstDoc?.status === "VERIFIED" && isKycApproved;

  // Check if MSME document is verified vs provided
  const msmeDoc = docsList.find((d) => d.documentType?.includes("MSME") || d.documentType?.includes("Udyam"));
  const isMsmeVerified = msmeDoc?.status === "VERIFIED" && isKycApproved;

  // Granular Document Status:
  // Not Uploaded | Uploaded — Pending Review | Under Review | Verified | Rejected / Action Required | Expired
  const getDocumentStatusInfo = () => {
    if (docsList.length === 0) {
      return {
        label: "Not Uploaded",
        badgeClass: "bg-slate-100 text-slate-500 border-slate-200",
        iconClass: "bg-slate-100 text-slate-400",
        iconType: "ALERT",
      };
    }
    const hasRejected = docsList.some((d) => d.status === "REJECTED" || d.status === "RESUBMISSION_REQUIRED");
    if (hasRejected) {
      return {
        label: "Action Required",
        badgeClass: "bg-red-50 text-red-600 border-red-200",
        iconClass: "bg-red-50 text-red-600",
        iconType: "ALERT",
      };
    }
    const hasExpired = docsList.some((d) => d.status === "EXPIRED");
    if (hasExpired) {
      return {
        label: "Expired",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
        iconClass: "bg-rose-50 text-rose-600",
        iconType: "ALERT",
      };
    }
    const allApproved = docsList.length > 0 && docsList.every((d) => d.status === "VERIFIED") && isKycApproved;
    if (allApproved) {
      return {
        label: "Documents Verified",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        iconClass: "bg-emerald-50 text-emerald-600",
        iconType: "CHECK",
      };
    }
    const hasUnderReview = docsList.some((d) => d.status === "UNDER_REVIEW") || business?.status === "UNDER_REVIEW";
    if (hasUnderReview) {
      return {
        label: "Under Review",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
        iconClass: "bg-amber-50 text-amber-600",
        iconType: "CLOCK",
      };
    }
    return {
      label: "Uploaded — Pending Review",
      badgeClass: "bg-sky-50 text-[#0076D7] border-sky-200",
      iconClass: "bg-sky-50 text-[#0076D7]",
      iconType: "CLOCK",
    };
  };

  const docStatusInfo = getDocumentStatusInfo();

  // Helper for Enquiry Status Pill styling
  const getStatusBadge = (status: string) => {
    const s = (status || "NEW").toUpperCase();
    if (s === "NEW" || s === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#0076D7] border border-sky-100">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0076D7]"></span>
          New
        </span>
      );
    }
    if (s === "IN_PROGRESS" || s === "IN PROGRESS") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          In Progress
        </span>
      );
    }
    if (s === "CONTACTED" || s === "RESPONDED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Responded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] flex flex-col justify-between font-sans text-slate-800">
      
      {/* ============================================================== */}
      {/* 1. SHARED BUSINESS PARTNER HEADER */}
      {/* ============================================================== */}
      <BusinessPartnerHeader activeNav="My Business" />

      {/* ============================================================== */}
      {/* 2. MAIN DASHBOARD CONTENT CONTAINER WITH SIDEBAR */}
      {/* ============================================================== */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col md:flex-row items-start gap-6">
        <PartnerPortalSidebar activeKey="my-business" />

        <main className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* Page Title Block */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F3FC] text-[#0076D7] flex items-center justify-center shadow-xs">
              <Store className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                My Business
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Manage your business listing, performance, profile, and verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-[#0076D7] bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-2xs"
            >
              Exit to Customer
            </Link>
            <button
              onClick={() => fetchDashboardData()}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition shadow-2xs"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0076D7]" : ""}`} />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. FOUR BUSINESS ANALYTICS METRIC CARDS */}
        {/* ============================================================== */}
        <div id="performance" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 scroll-mt-20">
          
          {/* Card 1: Live Quotes */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-blue-200 transition">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center font-bold">
                <span className="text-lg">❝</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 block">Live Quotes ⓘ</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
                  {liveQuotes}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                ▲ +12% <span className="text-[11px] text-slate-400 font-normal">vs last 7 days</span>
              </span>
              <svg className="w-16 h-6 text-blue-100" viewBox="0 0 100 30" fill="none" stroke="currentColor">
                <path d="M0 25 Q 25 20, 50 15 T 100 5 L 100 30 L 0 30 Z" fill="#EBF5FF" stroke="#0076D7" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 2: Profile Views */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-purple-200 transition">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 block">Profile Views ⓘ</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
                  {profileViews.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                ▲ +18% <span className="text-[11px] text-slate-400 font-normal">vs last 7 days</span>
              </span>
              <svg className="w-16 h-6 text-purple-100" viewBox="0 0 100 30" fill="none" stroke="currentColor">
                <path d="M0 25 Q 35 22, 60 12 T 100 4 L 100 30 L 0 30 Z" fill="#F5F3FF" stroke="#9333EA" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 3: Calls Received */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-emerald-200 transition">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 block">Calls Received ⓘ</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
                  {callsReceived}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                ▲ +14% <span className="text-[11px] text-slate-400 font-normal">vs last 7 days</span>
              </span>
              <svg className="w-16 h-6 text-emerald-100" viewBox="0 0 100 30" fill="none" stroke="currentColor">
                <path d="M0 28 Q 20 25, 55 18 T 100 8 L 100 30 L 0 30 Z" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 4: Rating & Trust */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-amber-200 transition">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 block">Rating & Trust</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
                  {rating} <span className="text-base font-bold text-slate-400">/ 5</span>
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                ★★★★★
              </div>
              <span className="text-xs text-slate-500 font-medium">
                ({reviewsCount} reviews)
              </span>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* 4. SINGLE BUSINESS PROFILE CARD (HERO RECTANGLE) */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            
            {/* Left: Storefront Photo */}
            <div className="w-full lg:w-72 h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 relative group">
              {business?.coverImageUrl ? (
                <img
                  src={
                    business.coverImageUrl.startsWith("http") || business.coverImageUrl.startsWith("data:")
                      ? business.coverImageUrl
                      : `http://localhost:4000${business.coverImageUrl}`
                  }
                  alt={business?.name || "Business Storefront"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 to-blue-50 text-slate-400 gap-2">
                  <Store className="w-10 h-10 text-[#0076D7]" />
                  <span className="text-xs font-bold text-slate-500">Storefront Photo</span>
                </div>
              )}
            </div>

            {/* Center: Business Details */}
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {business?.name || "Vinod Tech Mobile Hub"}
                </h2>
                <BusinessVerificationBadge
                  status={business?.status}
                  isVerified={business?.isVerified === true || business?.is_verified === 1 || business?.status === "APPROVED"}
                  size="md"
                />
              </div>

              {/* Location & Category Pills */}
              <div className="flex items-center gap-3 flex-wrap text-xs text-slate-600">
                <div className="flex items-center gap-1 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    {business?.localityName || "Benz Circle"}, {business?.cityName || "Vijayawada"}, Andhra Pradesh
                  </span>
                </div>
                <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-lg border border-slate-200 text-[11px]">
                  {business?.categoryName || "Mobiles & Accessories"}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 max-w-3xl">
                {business?.description ||
                  "Mobiles, accessories, and mobile services including sales, repairs, and genuine accessories at Benz Circle, Vijayawada."}
              </p>

              {/* Quick Summary Pill Bar */}
              <div className="pt-2 flex items-center gap-5 flex-wrap text-xs border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Listed Since</span>
                  <span className="font-bold text-slate-800">{listedSince}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-400">Status</span>
                  <span className="font-bold text-slate-800">{statusDisplay}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Listing Views</span>
                  <span className="font-bold text-slate-800">{profileViews.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">(Last 7 days)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-slate-400">Customer Rating</span>
                  <span className="font-bold text-slate-800">{rating}</span>
                  <span className="text-[10px] text-slate-400">({reviewsCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Right: Manage Business Button */}
            <div className="w-full lg:w-56 shrink-0 flex items-center justify-end">
              <Link
                href="/vendor/manage-business"
                className="w-full bg-[#0076D7] hover:bg-[#005FAE] text-white py-3 px-5 rounded-2xl text-xs font-bold transition flex items-center justify-between shadow-md shadow-blue-500/20 group"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-black">Manage Business</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* 5. TWO-COLUMN SECTION: LEADS (65%) & COMPLIANCE (35%) */}
        {/* ============================================================== */}
        <div id="leads" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-20">
          
          {/* Left Column (Approx 65% / col-span-8): Enquiries & Customer Leads */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-none">
                      Enquiries &amp; Customer Leads
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Recent customer enquiries and leads from your HELLO-Hi listing.
                    </p>
                  </div>
                </div>

                <Link
                  href="/vendor/dashboard#leads"
                  className="text-xs font-bold text-[#0076D7] hover:underline flex items-center gap-1"
                >
                  <span>View All Leads</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Leads Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pl-2">Customer / Lead</th>
                      <th className="pb-3 px-3">Enquiry</th>
                      <th className="pb-3 px-3">Received On</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 pr-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {enquiries && enquiries.length > 0 ? (
                      enquiries.slice(0, 5).map((lead: any, idx: number) => {
                        const custInitials = lead.customerName
                          ? lead.customerName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()
                          : "C";
                        return (
                          <tr key={lead.id || idx} className="hover:bg-slate-50/80 transition">
                            {/* Customer Avatar & Contact */}
                            <td className="py-3 pl-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0076D7] font-bold text-xs flex items-center justify-center shrink-0">
                                  {custInitials}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 truncate">
                                    {lead.customerName || "Customer Lead"}
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                                    <Phone className="w-2.5 h-2.5 text-slate-400" />
                                    <span>
                                      {lead.customerPhone
                                        ? `${lead.customerPhone.slice(0, 6)} •••${lead.customerPhone.slice(-2)}`
                                        : "+91 98480 •••45"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Enquiry Message */}
                            <td className="py-3 px-3 text-slate-700 font-medium max-w-[200px] truncate">
                              {lead.message || "iPhone 15 price & availability"}
                            </td>

                            {/* Received On Date/Time */}
                            <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                              {lead.createdAt
                                ? new Date(lead.createdAt).toLocaleDateString([], {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })
                                : "Today, 11:24 AM"}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3">
                              {getStatusBadge(lead.status)}
                            </td>

                            {/* Actions: Call Customer & View Lead */}
                            <td className="py-3 pr-2 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                <a
                                  href={`tel:${lead.customerPhone || "+919848012345"}`}
                                  className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>Call Customer</span>
                                </a>
                                <Link
                                  href="/vendor/dashboard#leads"
                                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition"
                                >
                                  View Lead
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                          No customer enquiries received yet. Speed quote requests will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* Right Column (Approx 35% / col-span-4): Merchant Profile & Compliance */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-none">
                    Merchant Profile &amp; Compliance
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Your business profile, verification, and document compliance.
                  </p>
                </div>
              </div>

              {/* Progress Bar with Percentage */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Profile Completion</span>
                  <span className="text-emerald-600 font-black text-sm">{completionPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              {/* Compliance Checklist Rows */}
              <div className="space-y-2.5">
                
                {/* 1. KYC Verification */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isKycApproved
                        ? "bg-emerald-50 text-emerald-600"
                        : normalizedKyc === "UNDER_REVIEW" || normalizedKyc === "PENDING"
                        ? "bg-amber-50 text-amber-600"
                        : normalizedKyc === "REJECTED" || normalizedKyc === "SUSPENDED"
                        ? "bg-red-50 text-red-600"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {isKycApproved ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800">KYC Verification</span>
                  </div>
                  <BusinessVerificationBadge status={business?.status} isVerified={business?.isVerified} size="sm" />
                </div>

                {/* 2. GST (GSTIN) */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isGstVerified
                        ? "bg-emerald-50 text-emerald-600"
                        : hasGst
                        ? "bg-blue-50 text-[#0076D7]"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {isGstVerified ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : hasGst ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800">GST (GSTIN)</span>
                  </div>
                  {isGstVerified ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Verified
                    </span>
                  ) : hasGst ? (
                    <span className="text-xs font-bold text-[#0076D7] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      Provided (Pending Doc Check)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      Not Provided (Optional)
                    </span>
                  )}
                </div>

                {/* 3. MSME (Udyam) */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isMsmeVerified
                        ? "bg-emerald-50 text-emerald-600"
                        : hasMsme
                        ? "bg-blue-50 text-[#0076D7]"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {isMsmeVerified ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : hasMsme ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800">MSME (Udyam)</span>
                  </div>
                  {isMsmeVerified ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Verified
                    </span>
                  ) : hasMsme ? (
                    <span className="text-xs font-bold text-[#0076D7] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      Provided (Pending Doc Check)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      Not Provided (Optional)
                    </span>
                  )}
                </div>

                {/* 4. Business Documents */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${docStatusInfo.iconClass}`}>
                      {docStatusInfo.iconType === "CHECK" ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : docStatusInfo.iconType === "CLOCK" ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800">Business Documents</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${docStatusInfo.badgeClass}`}>
                    {docStatusInfo.label}
                  </span>
                </div>

              </div>

            </div>

            {/* Primary Action: Open Merchant Profile */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <Link
                href="/vendor/profile"
                className="w-full bg-[#0076D7] hover:bg-[#005FAE] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs shadow-blue-500/20"
              >
                <User className="w-4 h-4" />
                <span>Open Merchant Profile</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

        {/* ============================================================== */}
        {/* 6. BOTTOM FULL-WIDTH CARD: OPERATING HOURS & SUBSCRIPTION */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Left: Operating Hours */}
            <div className="flex items-center justify-between md:pr-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Operating Hours</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {business?.todayHoursSummary || "Mon – Sun, 10:00 AM – 9:00 PM"}
                  </p>
                </div>
              </div>

              <Link
                href="/vendor/profile#business"
                className="text-xs font-bold text-[#0076D7] hover:underline flex items-center gap-1 shrink-0 ml-4"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
            </div>

            {/* Right: HELLO-Hi Subscription */}
            <div className="flex items-center justify-between md:pl-6 pt-4 md:pt-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Crown className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">HELLO-Hi Subscription</span>
                    <span className="bg-orange-100 text-[#FF6B35] text-[10px] font-black px-2 py-0.5 rounded-full">
                      {subscription?.planName || "Business Plus"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {subscription?.status === "ACTIVE" ? "Active" : subscription?.status || "Active"}
                    </span>
                    <span>•</span>
                    <span>
                      Valid till{" "}
                      {subscription?.expiryDate
                        ? new Date(subscription.expiryDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })
                        : "31 Mar 2026"}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/vendor/profile#kyc"
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5 shrink-0 ml-4"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Manage Subscription</span>
              </Link>
            </div>

          </div>
        </div>

      </main>
      </div>

      {/* Footer */}
      <DesktopFooter />
    </div>
  );
}
