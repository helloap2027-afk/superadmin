"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell,
  CheckCircle2,
  CheckCheck,
  Filter,
  RefreshCw,
  Clock,
  ShieldAlert,
  CreditCard,
  Building2,
  FileText,
  Info,
} from "lucide-react";
import { SearchInput } from "@/components/shared/SearchInput";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { NotificationSkeleton } from "@/components/shared/Skeletons";
import { EmptyState, ErrorState, StatusBadge } from "@/components/shared/StateComponents";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  recipient: string;
  is_read: number;
  related_entity?: string;
  related_id?: string;
  created_at: string;
  read_at?: string;
}

interface NotificationsModuleProps {
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationsModule({ onUnreadCountChange }: NotificationsModuleProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Server-side controls
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, UNREAD, READ
  const [typeFilter, setTypeFilter] = useState("ALL");

  const activeRequestId = useRef(0);

  const fetchNotifications = useCallback(async () => {
    const reqId = ++activeRequestId.current;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search: search.trim(),
        status: statusFilter,
        type: typeFilter,
      });

      const res = await fetch(`http://localhost:4000/api/v1/admin/notifications?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      if (reqId === activeRequestId.current) {
        if (json.success) {
          setNotifications(json.data || []);
          const count = json.unreadCount || 0;
          setUnreadCount(count);
          if (onUnreadCountChange) {
            onUnreadCountChange(count);
          }

          if (json.pagination) {
            setTotalPages(json.pagination.totalPages || 1);
            setTotalRecords(json.pagination.totalRecords || 0);
            setHasNextPage(Boolean(json.pagination.hasNextPage));
            setHasPreviousPage(Boolean(json.pagination.hasPreviousPage));
          }
        } else {
          throw new Error(json.message || "Failed to retrieve notifications");
        }
      }
    } catch (err: any) {
      if (reqId === activeRequestId.current) {
        setError(err.message || "Failed to communicate with notification service");
      }
    } finally {
      if (reqId === activeRequestId.current) {
        setLoading(false);
      }
    }
  }, [page, pageSize, search, statusFilter, typeFilter, onUnreadCountChange]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark single notification read
  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionInProgress(id);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/notifications/${id}/read`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        // Optimistically update
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: 1, read_at: new Date().toISOString() } : n))
        );
        const newUnread = json.unreadCount ?? Math.max(0, unreadCount - 1);
        setUnreadCount(newUnread);
        if (onUnreadCountChange) onUnreadCountChange(newUnread);
      }
    } catch {
      // Revert if error
    } finally {
      setActionInProgress(null);
    }
  };

  // Mark all notifications read
  const handleMarkAllRead = async () => {
    setActionInProgress("ALL");
    try {
      const res = await fetch("http://localhost:4000/api/v1/admin/notifications/mark-all-read", {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
        setUnreadCount(0);
        if (onUnreadCountChange) onUnreadCountChange(0);
      }
    } catch {
      // Ignore
    } finally {
      setActionInProgress(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "SECURITY":
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case "PAYMENT":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "BUSINESS":
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case "CMS":
        return <FileText className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1220] tracking-tight">
              Notifications &amp; Activity
            </h1>
            {unreadCount > 0 && (
              <span className="bg-[#DC2626] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-2xs">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time audit alerts, compliance submissions, and merchant payment notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={actionInProgress === "ALL"}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-[#0076D7] text-xs font-semibold rounded-xl hover:bg-blue-100 transition shadow-2xs cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => fetchNotifications()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 shadow-2xs transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Search and Tab Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by title or notification text..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setStatusFilter("ALL");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("UNREAD");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                statusFilter === "UNREAD" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("READ");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "READ" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Read
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="PAYMENT">Payment</option>
              <option value="SECURITY">Security</option>
              <option value="BUSINESS">Business</option>
              <option value="CMS">CMS</option>
              <option value="SYSTEM">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Notification List Section */}
      {error ? (
        <ErrorState
          title="Unable to load notifications"
          message={error}
          onRetry={() => fetchNotifications()}
        />
      ) : loading && notifications.length === 0 ? (
        <NotificationSkeleton count={5} />
      ) : notifications.length === 0 ? (
        <EmptyState
          isSearch={Boolean(search || statusFilter !== "ALL" || typeFilter !== "ALL")}
          onClearSearch={() => {
            setSearch("");
            setStatusFilter("ALL");
            setTypeFilter("ALL");
            setPage(1);
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => {
              const isUnread = n.is_read === 0;

              return (
                <div
                  key={n.id}
                  className={`p-4 sm:p-5 flex items-start gap-4 transition ${
                    isUnread ? "bg-blue-50/20 hover:bg-blue-50/40" : "bg-white hover:bg-slate-50/60"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isUnread
                        ? "bg-white border-blue-200 shadow-2xs"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {getTypeIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-xs sm:text-sm ${isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                          {n.title}
                        </h3>
                        <StatusBadge status={n.type} />
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#0076D7] shrink-0" />
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(n.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    {n.related_id && (
                      <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <span>Reference:</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-semibold">
                          {n.related_id}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  {isUnread && (
                    <button
                      type="button"
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      disabled={actionInProgress === n.id}
                      className="p-1.5 text-slate-400 hover:text-[#0076D7] hover:bg-blue-50 rounded-lg transition shrink-0"
                      title="Mark as Read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            page={page}
            pageSize={pageSize}
            totalRecords={totalRecords}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}
