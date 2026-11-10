"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Bell, CheckCheck, RefreshCw, ChevronRight, Home, ShieldCheck, 
  Settings as SettingsIcon, Store, CheckCircle2, X
} from "lucide-react";
import { DesktopHeader } from "@/components/DesktopHeader";
import { BusinessPartnerHeader } from "@/components/vendor/BusinessPartnerHeader";
import { DesktopFooter } from "@/components/DesktopFooter";
import { NotificationCard, NotificationItem } from "./NotificationCard";
import { NotificationSummary } from "./NotificationSummary";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationRoleTabs } from "./NotificationRoleTabs";
import { NotificationPagination } from "./NotificationPagination";
import { NotificationEmptyState } from "./NotificationEmptyState";

const API_BASE = "http://localhost:4000/api/v1";

interface NotificationCounts {
  customerUnread: number;
  merchantUnread: number;
  adminUnread: number;
  totalUnread: number;
  summary?: {
    customer?: {
      enquiries: number;
      replies: number;
      offers: number;
      security: number;
    };
    merchant?: {
      leads: number;
      kyc: number;
      reviews: number;
      system: number;
    };
  };
}

// Synchronously determine role from localStorage on initial render to prevent UI flashing
function getInitialRole(): {
  initialRole: "customer" | "merchant";
  hasCustomer: boolean;
  hasMerchant: boolean;
  roles: string[];
} {
  if (typeof window === "undefined") {
    return { initialRole: "customer", hasCustomer: true, hasMerchant: false, roles: [] };
  }
  const userStr = localStorage.getItem("hello_user");
  const savedActive = localStorage.getItem("hello_active_role");
  let roles: string[] = [];
  let userObj: any = null;
  if (userStr) {
    try {
      userObj = JSON.parse(userStr);
      if (Array.isArray(userObj?.roles)) roles = userObj.roles;
    } catch {}
  }
  const hasMerchant =
    roles.includes("VENDOR_OWNER") ||
    roles.includes("VENDOR_STAFF") ||
    roles.includes("MERCHANT") ||
    (Array.isArray(userObj?.ownedBusinesses) && userObj.ownedBusinesses.length > 0) ||
    (Array.isArray(userObj?.businesses) && userObj.businesses.length > 0) ||
    savedActive === "MERCHANT";

  const hasCustomer = roles.includes("CUSTOMER") || (!hasMerchant && roles.length === 0) || savedActive === "CUSTOMER";

  let role: "customer" | "merchant" = "customer";
  if (hasMerchant && !hasCustomer) {
    role = "merchant";
  } else if (hasCustomer && !hasMerchant) {
    role = "customer";
  } else if (hasMerchant && hasCustomer) {
    role = savedActive === "MERCHANT" ? "merchant" : "customer";
  }
  return { initialRole: role, hasCustomer, hasMerchant, roles };
}

export function SharedNotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isCustomerRole, setIsCustomerRole] = useState<boolean>(true);
  const [isMerchantRole, setIsMerchantRole] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<"all" | "customer" | "merchant">("customer");

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Sync authentication and exact role assignments with backend /auth/me
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("hello_access_token");
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    setIsAuthenticated(true);

    const syncRolesFromUser = (userObj: any) => {
      const roles: string[] = Array.isArray(userObj?.roles) ? userObj.roles : [];
      const hasMerchant =
        roles.includes("VENDOR_OWNER") ||
        roles.includes("VENDOR_STAFF") ||
        roles.includes("MERCHANT") ||
        (Array.isArray(userObj?.ownedBusinesses) && userObj.ownedBusinesses.length > 0) ||
        (Array.isArray(userObj?.businesses) && userObj.businesses.length > 0);

      // Strict role validation:
      const hasCustomer = roles.includes("CUSTOMER") || (!hasMerchant && roles.length === 0);

      setUserRoles(roles);
      setIsCustomerRole(hasCustomer);
      setIsMerchantRole(hasMerchant);

      const savedActive = localStorage.getItem("hello_active_role");

      // Scenario A: Customer Only -> Strictly "customer"
      // Scenario B: Business Partner Only -> Strictly "merchant"
      // Scenario C: Dual Role -> Default to saved active or customer
      if (hasMerchant && !hasCustomer) {
        setActiveRole("merchant");
      } else if (hasCustomer && !hasMerchant) {
        setActiveRole("customer");
      } else if (hasMerchant && hasCustomer) {
        setActiveRole(savedActive === "MERCHANT" ? "merchant" : "customer");
      }
    };

    const userStr = localStorage.getItem("hello_user");
    if (userStr) {
      try {
        syncRolesFromUser(JSON.parse(userStr));
      } catch {}
    }

    // Backend verification
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          localStorage.setItem("hello_user", JSON.stringify(json.data));
          syncRolesFromUser(json.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch counts from database
  const fetchCounts = useCallback(async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("hello_access_token")) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/counts`);
      const json = await res.json();
      if (json.success && json.data) {
        setCounts(json.data);
      }
    } catch {}
  }, []);

  // Fetch dynamic notifications with server-side pagination, search & filtering
  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (typeof window !== "undefined" && !localStorage.getItem("hello_access_token")) {
      setIsLoading(false);
      return;
    }
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const token = localStorage.getItem("hello_access_token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const params = new URLSearchParams({
        role: activeRole,
        status: statusFilter,
        page: page.toString(),
        pageSize: "10",
      });
      if (typeFilter !== "ALL") params.append("type", typeFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`${API_BASE}/notifications?${params.toString()}`, { headers });
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
    } catch {}
  };

  // Mark all as read for active audience
  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: activeRole === "all" ? "all" : activeRole }),
      });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: 1, read_at: new Date().toISOString() }))
        );
        fetchCounts();
        showToast(`All ${activeRole} notifications marked as read!`);
      }
    } catch {}
  };

  // Delete notification from database
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        fetchCounts();
        showToast("Notification deleted from database");
      }
    } catch {}
  };

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Decide which authoritative header to display:
  // - If user is exclusively a Business Partner, render BusinessPartnerHeader
  // - If user is Dual-Role, render BusinessPartnerHeader when activeRole === "merchant", DesktopHeader when activeRole === "customer" or "all"
  // - If user is a Customer, render DesktopHeader (Homepage Header)
  const isMerchantView = (isMerchantRole && !isCustomerRole) || (isCustomerRole && isMerchantRole && activeRole === "merchant");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      
      {/* 1. AUTHORITATIVE HEADER (NO INDEPENDENT HEADER VARIANTS) */}
      {isMerchantView ? (
        <BusinessPartnerHeader activeNav="Notifications" />
      ) : (
        <DesktopHeader
          selectedCity="Hyderabad"
          onSelectCity={() => {}}
          selectedCategory={null}
          onSelectCategory={() => {}}
          searchQuery=""
          onSearchChange={() => {}}
          onOpenAddBusiness={() => {}}
          onOpenLogin={() => {}}
          isLoggedIn={isAuthenticated === true}
        />
      )}

      {/* 2. MAIN CONTENT (NO LEFT-SIDE ACCOUNT SIDEBAR) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-6">
        
        {/* Unauthenticated Login Barrier */}
        {isAuthenticated === false ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm space-y-5 my-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0076D7] flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Login Required</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Please sign in to your HELLO account to view your private notifications, live customer leads, and instant quote updates.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0076D7] hover:bg-[#005bb5] text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Sign In to View Notifications
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Action Feedback Banner */}
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

            {/* Breadcrumb & Page Title (Matching Approved Mockup Image) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                  <Link href="/" className="hover:text-slate-600 transition flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-slate-700 font-bold">Notifications</span>
                  {activeRole !== "all" && (
                    <>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-[#0076D7] capitalize">{activeRole}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0076D7] flex items-center justify-center border border-blue-100 shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                      {activeRole === "merchant" ? "Notifications & Alerts" : "Notifications"}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      {activeRole === "merchant"
                        ? "Real-time updates on enquiries, quotes, verification, approvals, and customer reviews."
                        : "Stay updated on your enquiries, business replies, offers, and account activity."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Refresh, Mark All Read, Notification Settings */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  onClick={() => fetchNotifications(true)}
                  disabled={isRefreshing}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                  title="Refresh notifications from database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#0076D7]" : ""}`} />
                  <span>Refresh</span>
                </button>

                {activeRole === "merchant" && (
                  <Link
                    href="/vendor/profile#settings"
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Notification Settings</span>
                  </Link>
                )}

                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0076D7] hover:bg-[#005FAE] rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              </div>
            </div>

            {/* Role Segmentation Tabs: Rendered ONLY for Dual-Role accounts after client mount */}
            {mounted && isCustomerRole && isMerchantRole && (
              <NotificationRoleTabs
                activeRole={activeRole}
                onRoleChange={(newRole) => {
                  setActiveRole(newRole);
                  setTypeFilter("ALL");
                  setPage(1);
                }}
                counts={{
                  totalUnread: counts.totalUnread,
                  customerUnread: counts.customerUnread,
                  merchantUnread: counts.merchantUnread,
                }}
              />
            )}

            {/* 4 Pastel Summary Cards Matching Reference Design */}
            <NotificationSummary
              role={activeRole}
              counts={{
                customerUnread: counts.customerUnread,
                merchantUnread: counts.merchantUnread,
                totalUnread: counts.totalUnread,
                enquiries: counts.summary?.customer?.enquiries,
                replies: counts.summary?.customer?.replies,
                offers: counts.summary?.customer?.offers,
                security: counts.summary?.customer?.security,
                leads: counts.summary?.merchant?.leads,
                kyc: counts.summary?.merchant?.kyc,
                reviews: counts.summary?.merchant?.reviews,
                system: counts.summary?.merchant?.system,
              }}
              totalRecords={totalRecords}
            />

            {/* Filter Pills & Server-Side Search */}
            <NotificationFilters
              role={activeRole}
              statusFilter={statusFilter}
              onStatusChange={(st) => {
                setStatusFilter(st);
                setPage(1);
              }}
              typeFilter={typeFilter}
              onTypeChange={(tp) => {
                setTypeFilter(tp);
                setPage(1);
              }}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setPage(1);
              }}
              counts={{
                total: totalRecords,
                unread: activeRole === "merchant" ? counts.merchantUnread : counts.customerUnread,
                read: Math.max(0, totalRecords - (activeRole === "merchant" ? counts.merchantUnread : counts.customerUnread)),
              }}
            />

            {/* Stream of Notifications */}
            <div className="space-y-3">
              {isLoading ? (
                /* Skeleton Loader */
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
                <NotificationEmptyState
                  role={activeRole}
                  hasFilters={searchQuery.trim().length > 0 || statusFilter !== "ALL" || typeFilter !== "ALL"}
                  onClearFilters={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                    setTypeFilter("ALL");
                    setPage(1);
                  }}
                />
              ) : (
                notifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    item={item}
                    activeRole={activeRole}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>

            {/* Server-Side Pagination */}
            <NotificationPagination
              page={page}
              totalPages={totalPages}
              totalRecords={totalRecords}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}

      </main>

      {/* 3. SHARED FOOTER */}
      <DesktopFooter />

    </div>
  );
}

