"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  RotateCcw,
  AlertCircle,
  Building,
  Edit,
  X
} from "lucide-react";
import { 
  SearchInput, 
  MetricCard, 
  PageHeader, 
  AdminLayout, 
  TableSkeleton, 
  PaginationControls 
} from "@/components/shared";

interface WithdrawalRecord {
  id: string;
  merchant_id: string;
  merchant_name: string;
  amount: number;
  bank_account: string;
  ifsc_code: string;
  status: string;
  payout_ref: string | null;
  requested_at: string;
  processed_at: string | null;
}

interface SummaryData {
  pendingAmount: number;
  pendingCount: number;
  disbursedAmount: number;
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
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
    pendingAmount: 0,
    pendingCount: 0,
    disbursedAmount: 0,
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update Status Modal State
  const [statusModalItem, setStatusModalItem] = useState<WithdrawalRecord | null>(null);
  const [newStatus, setNewStatus] = useState<string>("APPROVED");
  const [payoutRefInput, setPayoutRefInput] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchWithdrawals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`http://localhost:4000/api/v1/admin/payments/withdrawals?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch withdrawals (HTTP ${res.status})`);
      }

      const json = await res.json();
      if (json.success) {
        setWithdrawals(json.data || []);
        if (json.pagination) {
          setTotalRecords(json.pagination.totalRecords || 0);
          setPages(json.pagination.totalPages || 1);
        }
        if (json.summary) {
          setSummary(json.summary);
        }
      } else {
        throw new Error(json.message || "Failed to load withdrawals data");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while loading withdrawals");
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(withdrawals.map((w) => w.id));
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
    const confirmMessage = `Are you sure you want to permanently delete ${selectedIds.length} selected withdrawal record(s)?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setIsDeleting(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/payments/withdrawals/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) throw new Error("Bulk deletion failed on server");
      const json = await res.json();
      if (json.success) {
        setSelectedIds([]);
        fetchWithdrawals();
      } else {
        alert(json.message || "Could not delete withdrawals");
      }
    } catch (err: any) {
      alert(err?.message || "Error during deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this withdrawal record?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/payments/withdrawals/${id}/delete`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        fetchWithdrawals();
      } else {
        alert(json.message || "Failed to delete withdrawal record");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete withdrawal record");
    }
  };

  const handleOpenStatusModal = (item: WithdrawalRecord) => {
    setStatusModalItem(item);
    setNewStatus(item.status);
    setPayoutRefInput(item.payout_ref || "");
  };

  const handleSaveStatus = async () => {
    if (!statusModalItem) return;
    try {
      setIsUpdatingStatus(true);
      const res = await fetch(`http://localhost:4000/api/v1/admin/payments/withdrawals/${statusModalItem.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          payoutRef: payoutRefInput.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setStatusModalItem(null);
        fetchWithdrawals();
      } else {
        alert(json.message || "Failed to update withdrawal status");
      }
    } catch (err: any) {
      alert(err?.message || "Error updating withdrawal status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <AdminLayout activeTab="Payments">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader
          icon={ArrowUpRight}
          title="Merchant Withdrawals"
          description="Live database records of vendor payout requests, bank clearance status, and IMPS/NEFT disbursements."
        />

        {/* Real Dynamic Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Pending Payouts"
            value={`₹${summary.pendingAmount.toLocaleString("en-IN")}`}
            subtext={`${summary.pendingCount} request(s) awaiting approval`}
            subtextColor="text-amber-700"
          />
          <MetricCard
            label="Disbursed Funds"
            value={`₹${summary.disbursedAmount.toLocaleString("en-IN")}`}
            subtext="Total completed bank settlements"
            subtextColor="text-emerald-600"
          />
          <MetricCard
            label="Total Payout Requests"
            value={totalRecords.toLocaleString("en-IN")}
            subtext="Fetched dynamically from database"
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
                placeholder="Search by ID, Merchant, or Bank Account..."
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
                onClick={fetchWithdrawals}
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
                <option value="APPROVED">Approved / Completed</option>
                <option value="PENDING">Pending Approval</option>
                <option value="PROCESSING">Processing IMPS</option>
                <option value="REJECTED">Declined / Rejected</option>
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
              onClick={fetchWithdrawals}
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
                        checked={withdrawals.length > 0 && selectedIds.length === withdrawals.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Payout ID</th>
                    <th className="py-3.5 px-4">Merchant</th>
                    <th className="py-3.5 px-4">Bank Account</th>
                    <th className="py-3.5 px-4">IFSC</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Payout Ref</th>
                    <th className="py-3.5 px-4">Requested At</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-sans">
                  {withdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-500">
                        <ArrowUpRight className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No withdrawal records found</p>
                        <p className="text-xs text-slate-400 mt-1">
                          No database records match your search or status query.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    withdrawals.map((item) => {
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
                              {item.merchant_name}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">{item.merchant_id}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                            {item.bank_account}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                            {item.ifsc_code}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                            {item.payout_ref || "—"}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            {item.requested_at ? new Date(item.requested_at).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }) : "N/A"}
                          </td>
                          <td className="py-3.5 px-4">
                            {item.status === "APPROVED" || item.status === "COMPLETED" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                                <CheckCircle2 className="w-3 h-3" /> Transferred
                              </span>
                            ) : item.status === "PROCESSING" ? (
                              <span className="inline-flex items-center gap-1 text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 text-xs">
                                <Clock className="w-3 h-3" /> Processing
                              </span>
                            ) : item.status === "PENDING" ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs">
                                <AlertTriangle className="w-3 h-3" /> {item.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenStatusModal(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition shadow-2xs"
                                title="Update payout status"
                              >
                                <Edit className="w-3 h-3 text-blue-600" />
                                Status
                              </button>
                              <button
                                onClick={() => handleDeleteOne(item.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Delete record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

        {/* Update Status Dialog */}
        {statusModalItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Update Withdrawal Status</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {statusModalItem.id} • {statusModalItem.merchant_name}
                  </p>
                </div>
                <button
                  onClick={() => setStatusModalItem(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Withdrawal Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">Pending (Awaiting Approval)</option>
                    <option value="PROCESSING">Processing (IMPS In Progress)</option>
                    <option value="APPROVED">Approved / Transferred</option>
                    <option value="REJECTED">Declined / Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payout Reference / UTR Number
                  </label>
                  <input
                    type="text"
                    value={payoutRefInput}
                    onChange={(e) => setPayoutRefInput(e.target.value)}
                    placeholder="e.g. PAYOUT-HDFC-9912 or Bank UTR"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Bank confirmation reference or IMPS transaction ID.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Payout Amount:</span>
                    <span className="font-bold text-slate-900">
                      ₹{Number(statusModalItem.amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beneficiary Bank:</span>
                    <span className="font-mono text-slate-700">{statusModalItem.bank_account}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IFSC Code:</span>
                    <span className="font-mono text-slate-700">{statusModalItem.ifsc_code}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalItem(null)}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition disabled:opacity-50"
                >
                  {isUpdatingStatus ? "Updating..." : "Save Status"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
