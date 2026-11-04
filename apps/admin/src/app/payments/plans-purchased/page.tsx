"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  RotateCcw,
  AlertCircle,
  Building,
  Mail,
  Phone
} from "lucide-react";
import { 
  SearchInput, 
  MetricCard, 
  PageHeader, 
  AdminLayout, 
  TableSkeleton, 
  PaginationControls 
} from "@/components/shared";

interface PlanRecord {
  id: string;
  subscriber_name: string;
  subscriber_email: string;
  subscriber_phone: string;
  plan_id: string;
  plan_name: string;
  status: string;
  amount: number;
  currency: string;
  start_date: string;
  expiry_date: string;
  auto_renew: number;
  payment_status: string;
  created_at: string;
}

interface SummaryData {
  activeCount: number;
  mrr: number;
  totalPurchased: number;
}

export default function PlansPurchasedPage() {
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side query state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination meta
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setPages] = useState(1);

  // Summary meta
  const [summary, setSummary] = useState<SummaryData>({
    activeCount: 0,
    mrr: 0,
    totalPurchased: 0,
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`http://localhost:4000/api/v1/admin/payments/plans-purchased?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch plans purchased (HTTP ${res.status})`);
      }

      const json = await res.json();
      if (json.success) {
        setPlans(json.data || []);
        if (json.pagination) {
          setTotalRecords(json.pagination.totalRecords || 0);
          setPages(json.pagination.totalPages || 1);
        }
        if (json.summary) {
          setSummary(json.summary);
        }
      } else {
        throw new Error(json.message || "Failed to load purchased plans");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while loading subscriptions");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(plans.map((p) => p.id));
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

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    const confirmMessage = `Are you sure you want to permanently delete ${selectedIds.length} selected subscription record(s)?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setIsDeleting(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/payments/plans-purchased/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) throw new Error("Bulk deletion failed on server");
      const json = await res.json();
      if (json.success) {
        setSelectedIds([]);
        fetchPlans();
      } else {
        alert(json.message || "Could not delete subscriptions");
      }
    } catch (err: any) {
      alert(err?.message || "Error during deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this plan record?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/payments/plans-purchased/${id}/delete`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        fetchPlans();
      } else {
        alert(json.message || "Failed to delete plan record");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete plan record");
    }
  };

  return (
    <AdminLayout activeTab="Payments">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader
          icon={ShieldCheck}
          title="Plans Purchased"
          description="Live database registry of vendor subscriptions, contract plans, payment status, and renewal billing."
        />

        {/* Real Dynamic Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Active Subscriptions"
            value={summary.activeCount.toLocaleString("en-IN")}
            subtext="Currently running packages"
            subtextColor="text-emerald-600"
          />
          <MetricCard
            label="Monthly Recurring (MRR)"
            value={`₹${summary.mrr.toLocaleString("en-IN")}`}
            subtext="Active vendor tier value"
            subtextColor="text-emerald-600"
          />
          <MetricCard
            label="Total Plans Purchased"
            value={summary.totalPurchased.toLocaleString("en-IN")}
            subtext="Direct DB ledger registry"
            subtextColor="text-blue-600"
          />
        </div>

        {/* Action Header & Server-Side Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <SearchInput
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                placeholder="Search by Subscriber, Plan Name, or Phone..."
              />
            </div>

            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition shadow-2xs disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  Delete Selected ({selectedIds.length})
                </button>
              )}

              <button
                onClick={fetchPlans}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition shadow-2xs"
                title="Refresh database records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Server Filter Selectors */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {(search || statusFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setPage(1);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 ml-auto"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="flex-1">{error}</p>
            <button
              onClick={fetchPlans}
              className="px-3 py-1 bg-rose-600 text-white font-medium text-xs rounded-lg hover:bg-rose-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table Content */}
        {loading ? (
          <TableSkeleton rows={pageSize} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={plans.length > 0 && selectedIds.length === plans.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Sub ID</th>
                    <th className="py-3.5 px-4">Subscriber / Merchant</th>
                    <th className="py-3.5 px-4">Plan Name</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Start Date</th>
                    <th className="py-3.5 px-4">Expiry Date</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-sans">
                  {plans.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-500">
                        <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No purchased plans found</p>
                        <p className="text-xs text-slate-400 mt-1">
                          No database records match your search or filter condition.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    plans.map((item) => {
                      const isChecked = selectedIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isChecked ? "bg-blue-50/40" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {item.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-slate-400" />
                              {item.subscriber_name}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                              {item.subscriber_email && (
                                <span className="inline-flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-400" /> {item.subscriber_email}
                                </span>
                              )}
                              {item.subscriber_phone && (
                                <span className="inline-flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400" /> {item.subscriber_phone}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                              {item.plan_name}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            {item.start_date ? new Date(item.start_date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            }) : "—"}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                            {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            }) : "—"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                item.payment_status === "PAID"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {item.payment_status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {item.status === "ACTIVE" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            ) : item.status === "PENDING" ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            ) : item.status === "EXPIRED" ? (
                              <span className="inline-flex items-center gap-1 text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-xs">
                                <AlertCircle className="w-3 h-3" /> Expired
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs">
                                <AlertTriangle className="w-3 h-3" /> {item.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteOne(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Server-Side Pagination */}
            {totalRecords > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                <PaginationControls
                  currentPage={page}
                  totalPages={totalPages}
                  totalRecords={totalRecords}
                  pageSize={pageSize}
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
    </AdminLayout>
  );
}
