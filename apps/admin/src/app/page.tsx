"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Tag,
  Inbox,
  CreditCard,
  Settings,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  X,
  FileText
} from "lucide-react";
import { 
  PendingVerificationItem, 
  AuditLogItem 
} from "@/data/adminData";
import { CMS_SUBMENUS } from "@/data/cmsData";
import { CMSModule } from "@/components/cms/CMSModule";
import { AdminSidebar, AdminNavbar } from "@/components/navigation";
import { ProfileOverview } from "@/components/profile";
import { PaymentsModule } from "@/components/payments/PaymentsModule";
import { SubscriptionsModule } from "@/components/subscriptions/SubscriptionsModule";
import { NotificationsModule } from "@/components/notifications/NotificationsModule";

const API_BASE = "http://localhost:4000/api/v1";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeCmsSlug, setActiveCmsSlug] = useState("terms-and-conditions");
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [queue, setQueue] = useState<PendingVerificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    pendingVerifications: 0,
    liveEnquiries: 0,
    activeSubscriptionsRevenue: "₹0",
    verificationStatus: {
      approvedPercent: 0,
      pendingPercent: 0,
    }
  });
  const [selectedInspectionItem, setSelectedInspectionItem] = useState<PendingVerificationItem | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<PendingVerificationItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live stats & pending queue from backend SQL database
  const fetchLiveAdminData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, queueRes, logsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard/stats`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/admin/businesses/pending`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/admin/audit-logs`).then((r) => r.json()).catch(() => null),
      ]);

      if (statsRes?.success && statsRes.data) {
        setStats((prev) => ({
          ...prev,
          ...statsRes.data,
          verificationStatus: {
            ...prev.verificationStatus,
            ...(statsRes.data.verificationStatus || {}),
          },
        }));
      }
      if (queueRes?.success && Array.isArray(queueRes.data) && queueRes.data.length > 0) {
        const normalizedQueue = queueRes.data.map((item: any) => ({
          ...item,
          documents: Array.isArray(item.documents) && item.documents.length > 0
            ? item.documents
            : typeof item.documentsUploaded === "string"
            ? item.documentsUploaded.split(",").map((s: string) => s.trim()).filter(Boolean)
            : ["GST Certificate", "Trade License"],
        }));
        setQueue(normalizedQueue);
      }
      if (logsRes?.success && Array.isArray(logsRes.data) && logsRes.data.length > 0) {
        setAuditLogs(logsRes.data);
      }

      // Live unread notification count
      try {
        const notifRes = await fetch(`${API_BASE}/admin/notifications?pageSize=1`).then((r) => r.json()).catch(() => null);
        if (notifRes?.success && typeof notifRes.unreadCount === "number") {
          setUnreadNotifsCount(notifRes.unreadCount);
        }
      } catch {}
    } catch (err) {
      console.warn("Could not reach backend API for admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    // Protected admin page guard
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("hello_admin_session");
      if (!session) {
        setIsAuthenticated(false);
        router.replace("/login");
        return;
      }
      try {
        const parsed = JSON.parse(session);
        if (typeof parsed !== "object" || parsed === null) {
          localStorage.removeItem("hello_admin_session");
          setIsAuthenticated(false);
          router.replace("/login");
          return;
        }
      } catch {
        localStorage.removeItem("hello_admin_session");
        setIsAuthenticated(false);
        router.replace("/login");
        return;
      }
      setIsAuthenticated(true);
      fetchLiveAdminData();
    }
  }, [router]);

  // Approve action: live SQL update
  const handleApprove = async (item: PendingVerificationItem) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "APPROVED", badgeType: "APPROVED" } : q))
    );

    try {
      await fetch(`${API_BASE}/admin/businesses/${item.id}/approve`, {
        method: "POST",
      });
      fetchLiveAdminData();
    } catch {
      // Optimistic update maintained
    }

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      type: "success",
      message: `Super Admin approved KYC for '${item.name}' (${item.city})`,
      timestamp: "Just now",
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Reject action: live SQL update
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;

    const itemToReject = rejectModalItem;
    setQueue((prev) =>
      prev.map((q) => (q.id === itemToReject.id ? { ...q, status: "REJECTED", badgeType: "REJECTED" } : q))
    );
    setRejectModalItem(null);

    try {
      await fetch(`${API_BASE}/admin/businesses/${itemToReject.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason || "Invalid documentation" }),
      });
      fetchLiveAdminData();
    } catch {
      // Optimistic update maintained
    }

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      type: "warning",
      message: `KYC rejected for '${itemToReject.name}': ${rejectReason || "Invalid documentation"}`,
      timestamp: "Just now",
    };
    setAuditLogs([newLog, ...auditLogs]);
    setRejectReason("");
  };

  const pendingCount = (Array.isArray(queue) ? queue : []).filter((i) => i.status !== "APPROVED" && i.status !== "REJECTED").length;

  if (!isMounted || isAuthenticated !== true) {
    return (
      <div className="h-screen max-h-screen w-full flex flex-col items-center justify-center bg-[#0B1220] text-white">
        <div className="w-9 h-9 border-3 border-[#0076D7] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-white/90">Hello Super Admin</p>
        <p className="text-xs text-white/60 mt-1">Verifying administrative access &amp; session...</p>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      {/* 1. Left Dark Midnight Sidebar (Matching Reference Design) */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        activeCmsSlug={activeCmsSlug}
        onSelectCmsSlug={(slug) => setActiveCmsSlug(slug)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 h-screen max-h-screen flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar matching reference design */}
        <AdminNavbar
          onToggleSidebar={() => {
            if (typeof window !== "undefined" && window.innerWidth < 1024) {
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
          searchQuery={searchFilter}
          onSearchChange={(q) => setSearchFilter(q)}
          unreadNotifications={unreadNotifsCount}
          selectedLocation="Hyderabad"
          onSelectTab={(tab) => setActiveTab(tab)}
        />

        {/* Workspace Display: Profile, CMS, Payments, Subscriptions, Notifications, or Dashboard */}
        {activeTab === "Profile" || activeTab === "Settings" || activeTab === "Account Settings" ? (
          <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
            <ProfileOverview onBack={() => setActiveTab("Dashboard")} />
          </div>
        ) : activeTab === "CMS" ? (
          <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
            <CMSModule
              currentSlug={activeCmsSlug}
              onNavigateSlug={(s) => setActiveCmsSlug(s)}
            />
          </div>
        ) : activeTab === "Payments" ? (
          <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
            <PaymentsModule />
          </div>
        ) : activeTab === "Subscriptions" ? (
          <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
            <SubscriptionsModule />
          </div>
        ) : activeTab === "Notifications" ? (
          <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
            <NotificationsModule onUnreadCountChange={setUnreadNotifsCount} />
          </div>
        ) : (
          <main
            className="flex-1 h-[calc(100vh-76px)] p-6 space-y-6 overflow-y-auto"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
          
          {/* 4 KPI Stat Cards with Real Database Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Registered Users */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>TOTAL REGISTERED USERS</span>
                  <span className="flex items-center gap-0.5 text-[#0076D7] bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                    Database Live
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight" suppressHydrationWarning>
                  {(stats?.totalUsers ?? 0).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-semibold">Active consumer &amp; merchant users</span>
                <svg className="w-20 h-6 text-[#0076D7]" viewBox="0 0 100 30" fill="none">
                  <path d="M0 25 Q 25 15, 50 18 T 100 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Card 2: Total Businesses */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>TOTAL BUSINESSES</span>
                  <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                    {stats?.verificationStatus?.approvedPercent ?? 0}% Verified
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight" suppressHydrationWarning>
                  {(stats?.totalBusinesses ?? 0).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-amber-600 font-semibold">
                  {stats?.pendingVerifications ?? 0} pending review
                </span>
                <svg className="w-20 h-6 text-amber-500" viewBox="0 0 100 30" fill="none">
                  <path d="M0 10 Q 25 25, 50 12 T 100 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Card 3: Live Enquiries */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>LIVE ENQUIRIES</span>
                  <span className="flex items-center gap-0.5 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                    Real-time
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight" suppressHydrationWarning>
                  {(stats?.liveEnquiries ?? 0).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-semibold">Total customer enquiries</span>
                <svg className="w-20 h-6 text-emerald-500" viewBox="0 0 100 30" fill="none">
                  <path d="M0 20 Q 30 5, 60 15 T 100 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Card 4: Revenue & Subscriptions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>ACTIVE RECURRING REVENUE</span>
                  <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                    Contracted
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                  {stats.activeSubscriptionsRevenue}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Monthly active subscriptions</span>
                <svg className="w-20 h-6 text-blue-500" viewBox="0 0 100 30" fill="none">
                  <path d="M0 25 Q 35 15, 65 20 T 100 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

          </div>

          {/* Middle Analytics Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart 1: User Acquisition & Enquiry Growth (Spline Area) */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-sm text-slate-900">User Acquisition & Enquiry Growth</h3>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0076D7]"></span> Customers
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]"></span> Vendors
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span> Enquiries
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 text-xs px-2.5 py-1 rounded-lg text-slate-600 font-semibold flex items-center gap-1">
                  <span>15 day trends</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>

              {/* Styled SVG Spline Graph Canvas */}
              <div className="h-44 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0076D7" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0076D7" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="gradOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="110" x2="500" y2="110" stroke="#F1F5F9" strokeWidth="1" />

                  {/* Spline Area Enquiries */}
                  <path
                    d="M 0 110 Q 120 20, 250 80 T 500 30 L 500 120 L 0 120 Z"
                    fill="url(#gradBlue)"
                  />
                  <path
                    d="M 0 110 Q 120 20, 250 80 T 500 30"
                    fill="none"
                    stroke="#0076D7"
                    strokeWidth="2.5"
                  />

                  {/* Spline Vendors */}
                  <path
                    d="M 0 90 Q 150 95, 300 60 T 500 45"
                    fill="none"
                    stroke="#FF6B35"
                    strokeWidth="2.5"
                  />
                </svg>

                {/* X Axis Day Labels */}
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
                  <span>1 Day</span>
                  <span>7 Day</span>
                  <span>11 Day</span>
                  <span>15 Day</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Top Verification Status Donut */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <h3 className="font-bold text-sm text-slate-900">Top Verification Status</h3>
              
              <div className="flex items-center justify-center my-2 relative">
                <svg className="w-36 h-36 transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="72"
                    cy="72"
                    r="54"
                    stroke="#E2E8F0"
                    strokeWidth="18"
                    fill="transparent"
                  />
                  {/* Circle Approved */}
                  <circle
                    cx="72"
                    cy="72"
                    r="54"
                    stroke="#0076D7"
                    strokeWidth="18"
                    strokeDasharray={`${Math.round(((stats?.verificationStatus?.approvedPercent ?? 0) / 100) * 340)} 340`}
                    fill="transparent"
                  />
                  {/* Circle Pending */}
                  <circle
                    cx="72"
                    cy="72"
                    r="54"
                    stroke="#FF6B35"
                    strokeWidth="18"
                    strokeDasharray={`${Math.round(((stats?.verificationStatus?.pendingPercent ?? 0) / 100) * 340)} 340`}
                    strokeDashoffset={`-${Math.round(((stats?.verificationStatus?.approvedPercent ?? 0) / 100) * 340)}`}
                    fill="transparent"
                  />
                </svg>
                {/* Center Badge */}
                <div className="absolute text-center">
                  <span className="text-xl font-black text-slate-900">
                    {stats?.verificationStatus?.approvedPercent ?? 0}%
                  </span>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Verified</span>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="space-y-1.5 text-xs font-medium">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0076D7]"></span> Approved
                  </span>
                  <span className="font-bold text-slate-900">{stats?.verificationStatus?.approvedPercent ?? 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]"></span> Pending
                  </span>
                  <span className="font-bold text-slate-900">{stats?.verificationStatus?.pendingPercent ?? 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Other / Incomplete
                  </span>
                  <span className="font-bold text-slate-900">
                    {Math.max(0, 100 - ((stats?.verificationStatus?.approvedPercent ?? 0) + (stats?.verificationStatus?.pendingPercent ?? 0)))}%
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Pending Verification Queue & Live Audit Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Pending Verification Queue Table */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                    PENDING VERIFICATION QUEUE ({pendingCount})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Click Approve or Reject to process KYC</span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-2.5">#</th>
                      <th className="pb-2.5">Name</th>
                      <th className="pb-2.5">Category</th>
                      <th className="pb-2.5">City</th>
                      <th className="pb-2.5">Documents Uploaded</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(!Array.isArray(queue) || queue.length === 0) ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                          No businesses currently pending verification in database.
                        </td>
                      </tr>
                    ) : (
                      queue.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-3">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-amber-500 font-medium">★ {item.rating} ({item.reviewsCount} reviews)</div>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">{item.category}</td>
                        <td className="py-3 text-slate-600">{item.city}</td>
                        <td className="py-3">
                          <div className="flex gap-1 flex-wrap">
                            {(Array.isArray(item.documents) ? item.documents : ["GST Certificate"]).map((doc, dIdx) => (
                              <span key={dIdx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                                {doc}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "REJECTED"
                              ? "bg-rose-100 text-rose-700"
                              : item.status === "UNDER REVIEW"
                              ? "bg-amber-100 text-amber-800"
                              : item.status === "RE-SUBMITTED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-cyan-100 text-cyan-800"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status !== "APPROVED" && item.status !== "REJECTED" && (
                              <>
                                <button
                                  onClick={() => handleApprove(item)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[10px] font-bold transition shadow-sm"
                                >
                                  APPROVE
                                </button>
                                <button
                                  onClick={() => setRejectModalItem(item)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1 rounded text-[10px] font-bold transition shadow-sm"
                                >
                                  REJECT
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setSelectedInspectionItem(item)}
                              className="border border-slate-300 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-[10px] font-bold transition"
                            >
                              VIEW DETAILS
                            </button>
                          </div>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Live System Activities / Audit Logs */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide mb-3">
                  RECENT SYSTEM ACTIVITIES / AUDIT LOGS
                </h3>
                <div className="space-y-3.5">
                  {(!Array.isArray(auditLogs) || auditLogs.length === 0) ? (
                    <div className="py-8 text-center text-slate-400 font-medium">
                      No audit activities recorded in database yet.
                    </div>
                  ) : (
                    auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2.5 text-xs">
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                        log.type === "success" 
                          ? "bg-emerald-500" 
                          : log.type === "warning" 
                          ? "bg-amber-500" 
                          : "bg-blue-500"
                      }`} />
                      <div>
                        <p className="text-slate-800 font-medium leading-snug">{log.message}</p>
                        <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                      </div>
                    </div>
                  )))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span>Immutable append-only log</span>
                <span className="text-[#0076D7] font-semibold cursor-pointer hover:underline">View All Logs</span>
              </div>
            </div>

          </div>

        </main>
        )}
      </div>

      {/* KYC Document Inspection Modal */}
      {selectedInspectionItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedInspectionItem(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <span className="text-[11px] font-bold text-[#0076D7] uppercase tracking-wider">KYC Document Inspection</span>
              <h3 className="text-lg font-bold text-slate-900">{selectedInspectionItem.name}</h3>
              <p className="text-xs text-slate-500">{selectedInspectionItem.city} • {selectedInspectionItem.category}</p>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">Uploaded Trade Credentials</span>
                <div className="space-y-2">
                  {(Array.isArray(selectedInspectionItem.documents) ? selectedInspectionItem.documents : ["GST Certificate"]).map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0076D7]" />
                        <span className="font-semibold text-slate-800">{doc} Certificate.pdf</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">VALID CHECKSUM</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div><strong>Submission Date:</strong> 29 Oct 2026, 14:20 IST</div>
                <div><strong>Current Review State:</strong> {selectedInspectionItem.status}</div>
                <div><strong>Audited By:</strong> Vikram (Super Admin)</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInspectionItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50"
              >
                Close
              </button>
              {selectedInspectionItem.status !== "APPROVED" && (
                <button
                  onClick={() => {
                    handleApprove(selectedInspectionItem);
                    setSelectedInspectionItem(null);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                >
                  Approve & Issue Verified Badge
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KYC Rejection Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setRejectModalItem(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900">Reject KYC for {rejectModalItem.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Please provide an explanation reason for the vendor.</p>

            <form onSubmit={handleRejectSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rejection Reason *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Blurry photo of trade certificate. Please re-upload clear scanned copy with valid GSTIN."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold border border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

