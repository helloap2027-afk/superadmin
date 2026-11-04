"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  RefreshCw, 
  RotateCcw,
  AlertCircle
} from "lucide-react";
import { 
  SearchInput, 
  MetricCard, 
  PageHeader, 
  AdminLayout, 
  TableSkeleton, 
  PaginationControls 
} from "@/components/shared";

interface WalletRecord {
  id: string;
  wallet_id: string;
  user_name: string;
  user_type: string;
  type: string;
  amount: number;
  balance_after: number;
  reference: string;
  status: string;
  created_at: string;
}

interface SummaryData {
  totalRecharges: number;
  creditsConsumed: number;
  totalTransactions: number;
}

export default function WalletTransactionsPage() {
  const [transactions, setTransactions] = useState<WalletRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side query state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [userTypeFilter, setUserTypeFilter] = useState("ALL");

  // Pagination meta
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setPages] = useState(1);

  // Summary meta
  const [summary, setSummary] = useState<SummaryData>({
    totalRecharges: 0,
    creditsConsumed: 0,
    totalTransactions: 0,
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (search.trim()) params.append("search", search.trim());
      if (typeFilter !== "ALL") params.append("type", typeFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (userTypeFilter !== "ALL") params.append("userType", userTypeFilter);

      const res = await fetch(`http://localhost:4000/api/v1/admin/payments/wallet-transactions?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch transactions (HTTP ${res.status})`);
      }

      const json = await res.json();
      if (json.success) {
        setTransactions(json.data || []);
        if (json.pagination) {
          setTotalRecords(json.pagination.totalRecords || 0);
          setPages(json.pagination.totalPages || 1);
        }
        if (json.summary) {
          setSummary(json.summary);
        }
      } else {
        throw new Error(json.message || "Failed to load wallet transactions");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while loading wallet data");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, typeFilter, statusFilter, userTypeFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(transactions.map((tx) => tx.id));
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
    const confirmMessage = `Are you sure you want to permanently delete ${selectedIds.length} selected transaction(s)?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setIsDeleting(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/payments/wallet-transactions/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) throw new Error("Bulk deletion failed on server");
      const json = await res.json();
      if (json.success) {
        setSelectedIds([]);
        fetchTransactions();
      } else {
        alert(json.message || "Could not delete transactions");
      }
    } catch (err: any) {
      alert(err?.message || "Error during deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this transaction record?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/payments/wallet-transactions/${id}/delete`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        fetchTransactions();
      } else {
        alert(json.message || "Failed to delete transaction");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete transaction");
    }
  };

  return (
    <AdminLayout activeTab="Payments">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader
          icon={Wallet}
          title="Wallet Transactions"
          description="Customer & merchant prepaid wallet balances, top-ups, deductions, and refunds fetched directly from the database."
        />

        {/* Real Dynamic Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Total Wallet Recharges"
            value={`₹${summary.totalRecharges.toLocaleString("en-IN")}`}
            subtext="Prepaid funds loaded"
            subtextColor="text-emerald-600"
          />
          <MetricCard
            label="Credits Consumed"
            value={`₹${summary.creditsConsumed.toLocaleString("en-IN")}`}
            subtext="Lead & promotion debits"
            subtextColor="text-blue-600"
          />
          <MetricCard
            label="Total Recorded Transactions"
            value={summary.totalTransactions.toLocaleString("en-IN")}
            subtext="Direct DB ledger audit"
            subtextColor="text-purple-600"
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
                placeholder="Search by ID, User Name, or Reference..."
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
                onClick={fetchTransactions}
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
              <span className="font-semibold text-slate-600">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="CREDIT">Top-up (Credit)</option>
                <option value="DEBIT">Deduction (Debit)</option>
                <option value="REFUND">Refund</option>
                <option value="WITHDRAWAL">Withdrawal</option>
              </select>
            </div>

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
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">User Type:</span>
              <select
                value={userTypeFilter}
                onChange={(e) => {
                  setUserTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Users</option>
                <option value="CUSTOMER">Customer</option>
                <option value="MERCHANT">Merchant</option>
              </select>
            </div>

            {(search || typeFilter !== "ALL" || statusFilter !== "ALL" || userTypeFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearch("");
                  setTypeFilter("ALL");
                  setStatusFilter("ALL");
                  setUserTypeFilter("ALL");
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
              onClick={fetchTransactions}
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
                        checked={transactions.length > 0 && selectedIds.length === transactions.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Txn ID / Ref</th>
                    <th className="py-3.5 px-4">User / Entity</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Balance After</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-sans">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-500">
                        <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No wallet transactions found</p>
                        <p className="text-xs text-slate-400 mt-1">
                          No database records match the selected search or filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => {
                      const isChecked = selectedIds.includes(tx.id);
                      return (
                        <tr
                          key={tx.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isChecked ? "bg-blue-50/40" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleSelectOne(tx.id, e.target.checked)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-slate-900">{tx.id}</div>
                            <div className="text-xs font-mono text-slate-400">{tx.reference || "N/A"}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{tx.user_name}</div>
                            <div className="text-xs text-slate-500 font-mono">{tx.wallet_id}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                tx.user_type === "MERCHANT"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {tx.user_type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {tx.type === "CREDIT" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                                <ArrowDownRight className="w-3 h-3" /> Top-up
                              </span>
                            ) : tx.type === "DEBIT" ? (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs">
                                <ArrowUpRight className="w-3 h-3" /> Debit
                              </span>
                            ) : tx.type === "REFUND" ? (
                              <span className="inline-flex items-center gap-1 text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 text-xs">
                                <RotateCcw className="w-3 h-3" /> Refund
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs">
                                <ArrowUpRight className="w-3 h-3" /> Withdrawal
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            ₹{Number(tx.amount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-600 font-mono text-xs">
                            ₹{Number(tx.balance_after || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            {tx.created_at ? new Date(tx.created_at).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }) : "N/A"}
                          </td>
                          <td className="py-3.5 px-4">
                            {tx.status === "SUCCESS" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                                <CheckCircle2 className="w-3 h-3" /> Success
                              </span>
                            ) : tx.status === "PENDING" ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs">
                                <AlertCircle className="w-3 h-3" /> {tx.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteOne(tx.id)}
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
