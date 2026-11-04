"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Bell, CheckCheck, Trash2, RefreshCw, Filter, Search, 
  CheckCircle2, AlertCircle, ShieldCheck, Zap, Sparkles, 
  Tag, Star, Clock, ChevronRight, Home, Phone, ExternalLink,
  MessageSquare, User, Building2, Store, ArrowRight, X
} from "lucide-react";
import { DesktopFooter } from "@/components/DesktopFooter";

const API_BASE = "http://localhost:4000/api/v1";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  recipient: string;
  is_read: number;
  related_entity: string | null;
  related_id: string | null;
  created_at: string;
  read_at: string | null;
}

interface NotificationCounts {
  customerUnread: number;
  merchantUnread: number;
  adminUnread: number;
  totalUnread: number;
}

export default function NotificationsPage() {
  const [activeRole, setActiveRole] = useState<"customer" | "merchant">("customer");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [counts, setCounts] = useState<NotificationCounts>({
    customerUnread: 0,
    merchantUnread: 0,
    adminUnread: 0,
    totalUnread: 0,
  });
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch counts
  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications/counts`);
      const json = await res.json();
      if (json.success && json.data) {
        setCounts(json.data);
      }
    } catch (err) {
      console.warn("Could not fetch notification counts:", err);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const params = new URLSearchParams({
        role: activeRole,
        status: statusFilter,
        page: page.toString(),
        pageSize: "10",
      });
      if (typeFilter !== "ALL") params.append("type", typeFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`${API_BASE}/notifications?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data || []);
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages || 1);
          setTotalRecords(json.pagination.totalRecords || 0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeRole, statusFilter, typeFilter, searchQuery, page]);

  useEffect(() => {
    fetchCounts();
    fetchNotifications();
  }, [fetchCounts, fetchNotifications]);

  // Mark single notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: 1, read_at: new Date().toISOString() } : n))
        );
        fetchCounts();
        showToast("Notification marked as read in database");
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // Mark all as read for active role
  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: activeRole }),
      });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: 1, read_at: new Date().toISOString() }))
        );
        fetchCounts();
        showToast(`All ${activeRole} notifications marked as read!`);
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Delete notification
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        fetchCounts();
        showToast("Notification deleted from database");
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Seed sample data if empty
  const handleSeedSamples = async () => {
    try {
      setIsRefreshing(true);
      await fetch(`${API_BASE}/notifications/seed-sample`, { method: "POST" });
      await fetchCounts();
      await fetchNotifications();
      showToast("Fresh dynamic sample alerts seeded successfully!");
    } catch (err) {
      console.error("Failed to seed notifications:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Relative time helper
  const getRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      return new Date(isoString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "Recent";
    }
  };

  // Icon and badge styling by notification type
  const getTypeMeta = (type: string) => {
    switch (type) {
      case "LEAD_RECEIVED":
        return {
          icon: Zap,
          bg: "bg-amber-50 text-amber-600 border-amber-200",
          tagText: "New Buyer Lead",
          tagBg: "bg-amber-100 text-amber-800",
        };
      case "QUOTE_RECEIVED":
        return {
          icon: Sparkles,
          bg: "bg-blue-50 text-blue-600 border-blue-200",
          tagText: "15-Min Fast Quote",
          tagBg: "bg-blue-100 text-blue-800",
        };
      case "KYC_VERIFICATION":
        return {
          icon: ShieldCheck,
          bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
          tagText: "KYC Verified",
          tagBg: "bg-emerald-100 text-emerald-800",
        };
      case "OFFER_ALERT":
      case "SPECIAL_OFFER":
        return {
          icon: Tag,
          bg: "bg-rose-50 text-rose-600 border-rose-200",
          tagText: "Exclusive Deal",
          tagBg: "bg-rose-100 text-rose-800",
        };
      case "REVIEW_RECEIVED":
        return {
          icon: Star,
          bg: "bg-yellow-50 text-yellow-600 border-yellow-200",
          tagText: "Customer Review",
          tagBg: "bg-yellow-100 text-yellow-800",
        };
      case "SUBSCRIPTION_UPDATE":
        return {
          icon: Building2,
          bg: "bg-indigo-50 text-indigo-600 border-indigo-200",
          tagText: "Plan Update",
          tagBg: "bg-indigo-100 text-indigo-800",
        };
      default:
        return {
          icon: Bell,
          bg: "bg-slate-100 text-slate-600 border-slate-200",
          tagText: "System Alert",
          tagBg: "bg-slate-100 text-slate-800",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 select-none group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0076D7] to-sky-500 text-white flex items-center justify-center font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                HELLO<span className="text-[#FF6B35]">-Hi</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                HYPERLOCAL NOTIFICATION HUB
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-[#0076D7] flex items-center gap-1 transition"
            >
              <Home className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 bg-blue-50 text-[#0076D7] px-2.5 py-1 rounded-full text-xs font-bold border border-blue-200">
              <Bell className="w-3.5 h-3.5" />
              <span>{counts.totalUnread} Unread Total</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Toast Notification */}
        {actionSuccess && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-md text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Breadcrumb & Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold mb-1">
              <Link href="/" className="hover:text-slate-600 transition">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-700 font-bold">Notifications</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#0076D7] capitalize">{activeRole}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              Notifications & Alerts
              {counts[activeRole === "customer" ? "customerUnread" : "merchantUnread"] > 0 && (
                <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {counts[activeRole === "customer" ? "customerUnread" : "merchantUnread"]} New
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time updates directly persisted in MySQL database for instant quotes, customer leads, and KYC badges.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => fetchNotifications(true)}
              disabled={isRefreshing}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
              title="Refresh notifications from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#0076D7]" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#0076D7] hover:bg-[#005FAE] rounded-xl transition flex items-center gap-1.5 shadow-xs"
              title="Mark all notifications for this role as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          </div>
        </div>

        {/* Dual Mode Role Switcher Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-2 gap-2">
          {/* Customer Tab */}
          <button
            onClick={() => {
              setActiveRole("customer");
              setTypeFilter("ALL");
              setPage(1);
            }}
            className={`flex items-center justify-between p-3 rounded-xl transition font-bold text-left ${
              activeRole === "customer"
                ? "bg-gradient-to-r from-blue-600 to-[#0076D7] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg ${activeRole === "customer" ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"}`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black leading-tight">Customer Alerts</div>
                <div className={`text-[10px] ${activeRole === "customer" ? "text-blue-100" : "text-slate-400"}`}>
                  15-min quotes & special offers
                </div>
              </div>
            </div>
            {counts.customerUnread > 0 && (
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                activeRole === "customer" ? "bg-white text-blue-700" : "bg-red-500 text-white"
              }`}>
                {counts.customerUnread}
              </span>
            )}
          </button>

          {/* Merchant Tab */}
          <button
            onClick={() => {
              setActiveRole("merchant");
              setTypeFilter("ALL");
              setPage(1);
            }}
            className={`flex items-center justify-between p-3 rounded-xl transition font-bold text-left ${
              activeRole === "merchant"
                ? "bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg ${activeRole === "merchant" ? "bg-white/20 text-white" : "bg-orange-50 text-orange-600"}`}>
                <Store className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black leading-tight">Merchant & Vendor Hub</div>
                <div className={`text-[10px] ${activeRole === "merchant" ? "text-orange-100" : "text-slate-400"}`}>
                  Buyer leads, KYC & review alerts
                </div>
              </div>
            </div>
            {counts.merchantUnread > 0 && (
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                activeRole === "merchant" ? "bg-white text-orange-700" : "bg-red-500 text-white"
              }`}>
                {counts.merchantUnread}
              </span>
            )}
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none pb-1 md:pb-0">
            {(["ALL", "UNREAD", "READ"] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {st === "ALL" ? "All Status" : st === "UNREAD" ? "Unread Only" : "Read Only"}
              </button>
            ))}

            <span className="text-slate-300 mx-1">|</span>

            {/* Type Specific Dropdown / Filters */}
            {activeRole === "customer" ? (
              <>
                <button
                  onClick={() => { setTypeFilter("ALL"); setPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    typeFilter === "ALL" ? "bg-[#0076D7] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => { setTypeFilter("QUOTE_RECEIVED"); setPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    typeFilter === "QUOTE_RECEIVED" ? "bg-[#0076D7] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  ⚡ Fast Quotes
                </button>
                <button
                  onClick={() => { setTypeFilter("OFFER_ALERT"); setPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    typeFilter === "OFFER_ALERT" ? "bg-[#0076D7] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  🏷️ Offers
                </button>
                <button
                  onClick={() => { setTypeFilter("KYC_VERIFICATION"); setPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    typeFilter === "KYC_VERIFICATION" ? "bg-[#0076D7] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  🛡️ KYC
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setTypeFilter("ALL"); setPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    typeFilter === "ALL" ? "bg-[#FF6B35] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => { setTypeFilter("LEAD_RECEIVED"); setPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    typeFilter === "LEAD_RECEIVED" ? "bg-[#FF6B35] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  🔥 Buyer Leads
                </button>
                <button
                  onClick={() => { setTypeFilter("KYC_VERIFICATION"); setPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    typeFilter === "KYC_VERIFICATION" ? "bg-[#FF6B35] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  🛡️ Approvals
                </button>
                <button
                  onClick={() => { setTypeFilter("REVIEW_RECEIVED"); setPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    typeFilter === "REVIEW_RECEIVED" ? "bg-[#FF6B35] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  ⭐ Reviews
                </button>
              </>
            )}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={`Search in ${activeRole} alerts...`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0076D7] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List Container */}
        <div className="space-y-3">
          {isLoading ? (
            /* Loading Skeletons */
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse flex items-start gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-4/5" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  No {activeRole === "customer" ? "Customer" : "Merchant"} Notifications Found
                </h3>
                <p className="text-xs text-slate-500">
                  {searchQuery || statusFilter !== "ALL" || typeFilter !== "ALL"
                    ? "Try adjusting your filters or search terms."
                    : "You're completely caught up! New inquiries, deals, and KYC verification notices will appear here automatically."}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleSeedSamples}
                  className="px-4 py-2 bg-blue-50 text-[#0076D7] hover:bg-blue-100 font-bold text-xs rounded-xl border border-blue-200 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Sample Live Alerts</span>
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl transition"
                >
                  Browse Directory
                </Link>
              </div>
            </div>
          ) : (
            /* Notifications Stream */
            notifications.map((item) => {
              const meta = getTypeMeta(item.type);
              const IconComp = meta.icon;
              const isUnread = item.is_read === 0;

              return (
                <div
                  key={item.id}
                  className={`group bg-white rounded-2xl border transition-all p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-2xs hover:shadow-xs ${
                    isUnread
                      ? "border-blue-200 bg-gradient-to-r from-blue-50/40 via-white to-white"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Icon Badge */}
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${meta.bg}`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#0076D7] animate-pulse" title="Unread" />
                        )}
                        <h4 className={`text-sm tracking-tight ${isUnread ? "font-black text-slate-900" : "font-bold text-slate-800"}`}>
                          {item.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.tagBg}`}>
                          {meta.tagText}
                        </span>
                        {item.related_id && (
                          <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                            #{item.related_id}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed break-words">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {getRelativeTime(item.created_at)}
                        </span>
                        <span>•</span>
                        <span className="capitalize font-medium text-slate-500">
                          {item.recipient} Channel
                        </span>
                        {item.read_at && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Read
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="flex items-center gap-1.5">
                      {/* Contextual CTAs */}
                      {item.type === "LEAD_RECEIVED" && (
                        <a
                          href="tel:+919848012345"
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold rounded-lg border border-emerald-200 transition flex items-center gap-1"
                          title="Call Lead Phone"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Lead</span>
                        </a>
                      )}

                      {item.type === "QUOTE_RECEIVED" && (
                        <Link
                          href="/"
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold rounded-lg border border-blue-200 transition flex items-center gap-1"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>View Quote</span>
                        </Link>
                      )}

                      {/* Mark Read Button */}
                      {isUnread ? (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          className="p-1.5 text-slate-400 hover:text-[#0076D7] hover:bg-blue-50 rounded-lg transition"
                          title="Mark as read"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-medium px-1">Done</span>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Row */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 shadow-2xs">
            <div>
              Showing page {page} of {totalPages} ({totalRecords} total alerts)
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <DesktopFooter />
    </div>
  );
}

