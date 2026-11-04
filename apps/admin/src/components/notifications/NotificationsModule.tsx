"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  CheckCheck,
  RefreshCw,
  Clock,
  ShieldAlert,
  CreditCard,
  Building2,
  FileText,
  Info,
  Filter,
  Check,
  Trash2,
  AlertCircle
} from "lucide-react";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/StateComponents";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { PaginationControls } from "@/components/shared/PaginationControls";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  recipient?: string;
  is_read: number;
  related_entity?: string;
  related_id?: string;
  created_at: string;
  read_at?: string | null;
}

interface NotificationsModuleProps {
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationsModule({ onUnreadCountChange }: NotificationsModuleProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side query state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Server-side meta
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  // Selection state for dynamic delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (typeFilter !== "ALL") params.append("type", typeFilter);

      const res = await fetch(`http://localhost:4000/api/v1/admin/notifications?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch notifications (HTTP ${res.status})`);
      }

      const json = await res.json();
      if (json.success) {
        setNotifications(json.data || []);
        if (json.pagination) {
          setTotalRecords(json.pagination.totalRecords || 0);
          setTotalPages(json.pagination.totalPages || 1);
        }
        if (json.summary && typeof json.summary.unreadCount === "number") {
          setUnreadCount(json.summary.unreadCount);
          if (onUnreadCountChange) {
            onUnreadCountChange(json.summary.unreadCount);
          }
        }
      } else {
        throw new Error(json.message || "Failed to load notifications");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while fetching notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, typeFilter, onUnreadCountChange]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(notifications.map((n) => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Bulk Delete Dynamic Action
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    const confirmMsg = `Are you sure you want to permanently delete ${selectedIds.length} selected notification(s) from the database?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setIsDeleting(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/notifications/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const json = await res.json();
      if (json.success) {
        setSelectedIds([]);
        fetchNotifications();
      } else {
        alert(json.message || "Failed to delete notifications");
      }
    } catch (err: any) {
      alert(err?.message || "Error deleting notifications");
    } finally {
      setIsDeleting(false);
    }
  };

  // Single Record Delete Dynamic Action
  const handleDeleteOne = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this notification?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/notifications/${id}/delete`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        fetchNotifications();
      } else {
        alert(json.message || "Failed to delete notification");
      }
    } catch (err: any) {
      alert(err?.message || "Error deleting notification");
    }
  };

  // Handle Mark Single Read
  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/notifications/${id}/read`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // Handle Mark All Read
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/admin/notifications/mark-all-read", {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  
  const handleNavigateToRelated = (n: NotificationItem) => {
    if (n.related_entity === "businesses" && n.related_id) {
      router.push("/users/merchants/" + n.related_id);
    } else if (n.related_entity === "users" && n.related_id) {
      router.push("/users/customers/" + n.related_id);
    } else if (n.related_entity === "subscriptions") {
      router.push("/payments/plans-purchased");
    } else if (n.related_entity === "payments") {
      router.push("/payments/wallet-transactions");
    } else if (n.related_entity === "cms_pages" && n.related_id) {
      router.push("/cms/" + n.related_id);
    }
  };

  // Helper Icon Resolver
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "KYC_VERIFICATION":
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case "FINANCIAL":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "CMS_UPDATE":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "SYSTEM_ALERT":
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case "SECURITY":
        return <ShieldAlert className="w-4 h-4 text-indigo-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "KYC_VERIFICATION":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            KYC Verification
          </span>
        );
      case "FINANCIAL":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Financial
          </span>
        );
      case "CMS_UPDATE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            CMS Page
          </span>
        );
      case "SYSTEM_ALERT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            System Alert
          </span>
        );
      case "SECURITY":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Security
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            General
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* 1. Header with Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Notifications Center</h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live database audit feed of merchant KYC alerts, subscription renewals, CMS changes, and security events.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              Delete Selected ({selectedIds.length})
            </button>
          )}

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark All as Read
            </button>
          )}

          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer shadow-2xs"
            title="Refresh database feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* 2. Server-Side Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="Search notifications by title or message..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => {
                  setStatusFilter("ALL");
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setStatusFilter("UNREAD");
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  statusFilter === "UNREAD"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Unread</span>
                {unreadCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => {
                  setStatusFilter("READ");
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === "READ"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Read
              </button>
            </div>
          </div>
        </div>

        {/* Server Type Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-600 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-slate-400" /> Filter Type:
          </span>
          {[
            { id: "ALL", label: "All Categories" },
            { id: "KYC_VERIFICATION", label: "KYC Submissions" },
            { id: "FINANCIAL", label: "Financial / Subscriptions" },
            { id: "CMS_UPDATE", label: "CMS Pages" },
            { id: "SYSTEM_ALERT", label: "System Leads" },
            { id: "SECURITY", label: "Security" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setTypeFilter(type.id);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg border transition ${
                typeFilter === type.id
                  ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="flex-1">{error}</p>
          <button
            onClick={fetchNotifications}
            className="px-3 py-1 bg-rose-600 text-white font-medium text-xs rounded-lg hover:bg-rose-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4. Notification List Content with Skeleton Structure */}
      {loading ? (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <TableSkeleton rows={pageSize} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8">
          <EmptyState
            title="No Notifications Found"
            description={
              search || statusFilter !== "ALL" || typeFilter !== "ALL"
                ? "No live database notifications matched your search or category filters."
                : "Your notification inbox is completely up to date. No new database alerts recorded."
            }
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch("");
              setStatusFilter("ALL");
              setTypeFilter("ALL");
              setPage(1);
            }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header Select All Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-600 font-medium">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifications.length > 0 && selectedIds.length === notifications.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>Select all on page ({notifications.length})</span>
            </label>

            {selectedIds.length > 0 && (
              <span className="font-semibold text-blue-600">
                {selectedIds.length} item(s) selected
              </span>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {notifications.map((n) => {
              const isUnread = n.is_read === 0;
              const isChecked = selectedIds.includes(n.id);
              return (
                <div
                  key={n.id}
                  onClick={() => handleNavigateToRelated(n)}
                  className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                    isChecked
                      ? "bg-blue-50/60"
                      : isUnread
                      ? "bg-blue-50/20 hover:bg-blue-50/35"
                      : "bg-white hover:bg-slate-50/70"
                  }`}
                >
                  {/* Select Checkbox */}
                  <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleSelectOne(n.id, e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {/* Left Type Icon Box */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0 mt-0.5">
                    {getTypeIcon(n.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {getTypeBadge(n.type)}
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Unread" />
                      )}
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3 text-slate-300" />
                        {n.created_at ? new Date(n.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : "Just now"}
                      </span>
                    </div>

                    <h3 className={`text-sm tracking-tight ${isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                      {n.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    {n.related_entity && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          Ref: <span className="font-semibold text-slate-600">{n.related_entity}</span> #{n.related_id || "global"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="shrink-0 flex items-center gap-1 self-center" onClick={(e) => e.stopPropagation()}>
                    {isUnread ? (
                      <button
                        onClick={(e) => handleMarkAsRead(n.id, e)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition shadow-2xs"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                        Mark Read
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 px-2 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
                        Read
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteOne(n.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Server-Side Pagination Controls */}
          {totalRecords > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <PaginationControls
                page={page}
                pageSize={pageSize}
                totalRecords={totalRecords}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setPage(1);
                }}
                pageSizeOptions={[5, 10, 20, 50]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
