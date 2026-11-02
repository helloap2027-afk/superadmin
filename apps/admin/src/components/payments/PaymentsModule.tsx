"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  Eye,
  X,
  Filter,
  RefreshCw,
} from "lucide-react";
import { SearchInput } from "@/components/shared/SearchInput";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { TableSkeleton, CardSkeleton } from "@/components/shared/Skeletons";
import { EmptyState, ErrorState, StatusBadge } from "@/components/shared/StateComponents";

interface PaymentItem {
  id: string;
  transaction_ref: string;
  payer_name: string;
  payer_email: string;
  payer_type: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  gateway_ref: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface PaymentSummary {
  totalVolume: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
}

export function PaymentsModule() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>({
    totalVolume: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side controls
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC");

  // Detail Modal
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);

  // Request race condition prevention
  const activeRequestId = useRef(0);

  const fetchPayments = useCallback(async () => {
    const reqId = ++activeRequestId.current;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search: search.trim(),
        status: statusFilter,
        paymentMethod: methodFilter,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`http://localhost:4000/api/v1/admin/payments?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      if (reqId === activeRequestId.current) {
        if (json.success) {
          setPayments(json.data || []);
          if (json.pagination) {
            setTotalPages(json.pagination.totalPages || 1);
            setTotalRecords(json.pagination.totalRecords || 0);
            setHasNextPage(Boolean(json.pagination.hasNextPage));
            setHasPreviousPage(Boolean(json.pagination.hasPreviousPage));
          }
          if (json.summary) {
            setSummary(json.summary);
          }
        } else {
          throw new Error(json.message || "Failed to retrieve payments");
        }
      }
    } catch (err: any) {
      if (reqId === activeRequestId.current) {
        setError(err.message || "Failed to connect to payments service");
      }
    } finally {
      if (reqId === activeRequestId.current) {
        setLoading(false);
      }
    }
  }, [page, pageSize, search, statusFilter, methodFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Handle Search Change -> reset page to 1
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // Handle Filter Change -> reset page to 1
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethodFilter(e.target.value);
    setPage(1);
  };

  // Toggle sort
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");
    } else {
      setSortBy(field);
      setSortOrder("DESC");
    }
    setPage(1);
  };

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1220] tracking-tight">
            Payments &amp; Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time database records of merchant subscriptions, verification fees, and lead purchases.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchPayments()}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 shadow-2xs transition"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. KPI Summary Cards */}
      {loading && payments.length === 0 ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Volume */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Settled Volume
              </span>
              <div className="text-2xl font-black text-[#0B1220] mt-1.5">
                ₹{summary.totalVolume.toLocaleString("en-IN")}
              </div>
              <span className="text-[11px] font-medium text-emerald-600 mt-1 block">
                Database Verified
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0076D7] flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>

          {/* Completed Transactions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Completed
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1.5">
                {summary.completedCount}
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                Successful captures
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Pending Clearance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pending Clearance
              </span>
              <div className="text-2xl font-black text-amber-700 mt-1.5">
                {summary.pendingCount}
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                Awaiting bank confirmation
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Failed Attempts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Failed Attempts
              </span>
              <div className="text-2xl font-black text-rose-700 mt-1.5">
                {summary.failedCount}
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                Declined or dropped
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Search and Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Txn ID, Payer, Email, Gateway Ref..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          {/* Method Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={methodFilter}
              onChange={handleMethodChange}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Methods</option>
              <option value="UPI">UPI (PhonePe/GPay)</option>
              <option value="CARD">Debit / Credit Card</option>
              <option value="NET_BANKING">Net Banking</option>
              <option value="WALLET">Wallet</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Table / Content Section */}
      {error ? (
        <ErrorState
          title="Unable to load payment records"
          message={error}
          onRetry={() => fetchPayments()}
        />
      ) : loading && payments.length === 0 ? (
        <TableSkeleton rows={6} columns={7} />
      ) : payments.length === 0 ? (
        <EmptyState
          isSearch={Boolean(search || statusFilter !== "ALL" || methodFilter !== "ALL")}
          onClearSearch={() => {
            setSearch("");
            setStatusFilter("ALL");
            setMethodFilter("ALL");
            setPage(1);
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Transaction Ref</th>
                  <th className="py-3.5 px-4">Payer</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer select-none hover:text-[#0076D7]"
                    onClick={() => toggleSort("amount")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Amount (INR)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer select-none hover:text-[#0076D7]"
                    onClick={() => toggleSort("created_at")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Date &amp; Time</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPayment(p)}
                    className="hover:bg-slate-50/70 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      {p.transaction_ref}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{p.payer_name}</div>
                      <div className="text-[11px] text-slate-400">{p.payer_email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.payment_method} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} />
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      <span className="text-[11px] text-slate-400">
                        {new Date(p.created_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPayment(p);
                        }}
                        className="p-1.5 text-slate-400 hover:text-[#0076D7] hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* 5. Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Payment Details</h3>
                  <p className="text-[11px] font-mono text-slate-400">{selectedPayment.transaction_ref}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Amount hero */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Charged
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    ₹{selectedPayment.amount.toLocaleString("en-IN")}
                  </div>
                </div>
                <StatusBadge status={selectedPayment.status} />
              </div>

              {/* Grid info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-medium">Payer Name</span>
                  <p className="font-semibold text-slate-800 text-[13px] mt-0.5">{selectedPayment.payer_name}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Payer Email</span>
                  <p className="font-semibold text-slate-800 text-[13px] mt-0.5">{selectedPayment.payer_email}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Payer Type</span>
                  <p className="font-semibold text-slate-800 text-[13px] mt-0.5">{selectedPayment.payer_type}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Payment Method</span>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedPayment.payment_method} />
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Gateway Reference</span>
                  <p className="font-mono text-slate-700 text-[11px] mt-0.5">{selectedPayment.gateway_ref}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Timestamp</span>
                  <p className="text-slate-700 text-[11px] mt-0.5">
                    {new Date(selectedPayment.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {selectedPayment.description && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-medium">Description</span>
                  <p className="text-slate-700 mt-1 leading-relaxed">{selectedPayment.description}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
