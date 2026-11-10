"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Store, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Edit3, 
  Trash2,
  Mail, 
  RefreshCw, 
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { 
  SearchInput, 
  MetricCard, 
  PageHeader, 
  AdminLayout, 
  PaginationControls, 
  TableSkeleton 
} from "@/components/shared";

interface MerchantRecord {
  id: string;
  business: string;
  owner: string;
  phone: string;
  email?: string;
  city: string;
  category: string;
  kyc: string;
  plan: string;
  status: string;
  rating?: number;
  reviews?: number;
  enquiries?: number;
  joined: string;
}

const API_BASE = "http://localhost:4000/api/v1";

export default function MerchantsPage() {
  const [data, setData] = useState<MerchantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side query state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [kycFilter, setKycFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [summary, setSummary] = useState({
    totalMerchants: 0,
    activeMerchants: 0,
    verifiedMerchants: 0,
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [kycModalItem, setKycModalItem] = useState<MerchantRecord | null>(null);
  const [kycUpdating, setKycUpdating] = useState(false);
  const [kycRejectReason, setKycRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleApproveKycQuick = async (id: string, name: string) => {
    try {
      setKycUpdating(true);
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/approve`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setFeedbackToast(`KYC for "${name}" approved & verified!`);
        setTimeout(() => setFeedbackToast(null), 4000);
        setKycModalItem(null);
        fetchMerchants();
      } else {
        alert(json.message || "Failed to approve KYC.");
      }
    } catch (e: any) {
      alert("Error approving KYC: " + e.message);
    } finally {
      setKycUpdating(false);
    }
  };

  const handleRejectKycQuick = async (id: string, name: string) => {
    if (!kycRejectReason.trim()) {
      alert("Please enter a reason for KYC rejection.");
      return;
    }
    try {
      setKycUpdating(true);
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: kycRejectReason.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedbackToast(`KYC for "${name}" marked as REJECTED.`);
        setTimeout(() => setFeedbackToast(null), 4000);
        setKycModalItem(null);
        setShowRejectInput(false);
        setKycRejectReason("");
        fetchMerchants();
      } else {
        alert(json.message || "Failed to reject KYC.");
      }
    } catch (e: any) {
      alert("Error rejecting KYC: " + e.message);
    } finally {
      setKycUpdating(false);
    }
  };

  const handleSendKycReminder = async (item: MerchantRecord) => {
    const recipient = item.email && item.email !== "Not Provided" ? item.email : item.phone;
    if (!confirm(`Send an official KYC verification reminder email to "${item.business}" (${recipient})?`)) {
      return;
    }
    try {
      setSendingReminderId(item.id);
      const res = await fetch(`${API_BASE}/admin/businesses/${item.id}/kyc-reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const json = await res.json();
      if (json.success) {
        setFeedbackToast(json.message || "KYC reminder email dispatched!");
        setTimeout(() => setFeedbackToast(null), 5000);
      } else {
        alert(json.message || "Failed to send reminder");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setSendingReminderId(null);
    }
  };

  // Fetch merchants from backend API
  const fetchMerchants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search: search.trim(),
        status: statusFilter,
        kyc: kycFilter,
      });

      const res = await fetch(`${API_BASE}/admin/merchants?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        const mapped = (json.data || []).map((b: any) => ({
          id: b.id,
          business: b.name || "Untitled Business",
          owner: b.owner_name && b.owner_name !== "Not Provided" ? b.owner_name : (b.legal_name || "Not Provided"),
          phone: b.primary_phone || b.owner_phone || "Not Provided",
          email: b.support_email || b.owner_email || "Not Provided",
          city: b.city_name || "Andhra Pradesh",
          category: b.category_name || "Local Services",
          kyc: b.is_verified ? "VERIFIED" : "PENDING",
          plan: "Growth Merchant",
          status: b.status || "APPROVED",
          joined: b.joined || b.created_at || new Date().toISOString(),
        }));
        setData(mapped);
        if (json.pagination) {
          setPagination(json.pagination);
        }
        if (json.summary) {
          setSummary(json.summary);
        }
      } else {
        setError(json.message || "Failed to load merchants from database");
      }
    } catch (err: any) {
      setError(err?.message || "Error connecting to backend server");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, kycFilter]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  // Handle Search Input Change (reset to page 1)
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // Handle Status Filter Change
  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  // Handle KYC Filter Change
  const handleKycChange = (val: string) => {
    setKycFilter(val);
    setPage(1);
  };

  // Row selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Delete single merchant
  const handleDeleteMerchant = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/merchants/${id}/delete`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirmId(null);
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        fetchMerchants();
      } else {
        alert(json.message || "Delete failed");
      }
    } catch (err: any) {
      alert("Error deleting merchant: " + err.message);
    }
  };

  // Bulk delete selected
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected merchant(s)?`)) return;
    try {
      setIsDeletingBulk(true);
      const res = await fetch(`${API_BASE}/admin/merchants/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds([]);
        fetchMerchants();
      } else {
        alert(json.message || "Bulk delete failed");
      }
    } catch (err: any) {
      alert("Error performing bulk delete: " + err.message);
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <AdminLayout activeTab="Users">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        
        {/* Header */}
        <PageHeader
          icon={Store}
          title="Business Partners"
          description="Complete storefront profiles, physical location verification, and registration details stored in MySQL."
          actions={
            <button
              onClick={() => fetchMerchants()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
              Refresh
            </button>
          }
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Total Onboarded Partners"
            value={summary.totalMerchants.toLocaleString("en-IN")}
            subtext="Live storefronts in MySQL"
            subtextColor="text-blue-600"
          />
          <MetricCard
            label="Active Approved Businesses"
            value={summary.activeMerchants.toLocaleString("en-IN")}
            subtext="Publicly discoverable"
            subtextColor="text-emerald-600"
          />
          <MetricCard
            label="Verified Business Badges"
            value={summary.verifiedMerchants.toLocaleString("en-IN")}
            subtext="Physical inspection / KYC verified"
            subtextColor="text-purple-600"
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by business name, owner, city, or phone..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">KYC:</span>
              <select
                value={kycFilter}
                onChange={(e) => handleKycChange(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Verification</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending KYC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Selection Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl text-xs font-medium text-blue-900 animate-in fade-in">
            <span>
              <strong>{selectedIds.length}</strong> merchant(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={isDeletingBulk}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeletingBulk ? "Deleting..." : "Delete Selected"}
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-4">
              <TableSkeleton rows={pageSize} />
            </div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">No Business Partners Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {search || statusFilter !== "ALL" || kycFilter !== "ALL"
                  ? "No business partners match your active filters."
                  : "No business partner storefronts in the database yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4">Business &amp; Category</th>
                      <th className="py-3 px-4">Owner &amp; Phone</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">KYC Badge</th>
                      <th className="py-3 px-4">Registered Date &amp; Time</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {data.map((item) => {
                      const isSelected = selectedIds.includes(item.id);
                      return (
                        <tr 
                          key={item.id} 
                          className={`hover:bg-slate-50/80 transition-colors ${isSelected ? "bg-blue-50/40" : ""}`}
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                              className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Link 
                              href={`/users/merchants/${item.id}`} 
                              className="font-bold text-slate-900 hover:text-blue-600 transition-colors block"
                            >
                              {item.business}
                            </Link>
                            <div className="text-[11px] text-slate-500 font-medium">{item.email && item.email !== "Not Provided" ? item.email : item.phone} • {item.category}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">{item.owner}</div>
                            <div className="text-[11px] text-slate-500">{item.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                              <MapPin className="w-3 h-3 text-slate-400" /> {item.city}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md border text-[11px] ${
                                item.kyc === "VERIFIED"
                                  ? "text-blue-700 bg-blue-50 border-blue-200"
                                  : "text-amber-700 bg-amber-50 border-amber-200"
                              }`}
                            >
                              {item.kyc === "VERIFIED" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              {item.kyc}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">
                              {item.joined ? new Date(item.joined).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {item.joined ? new Date(item.joined).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setKycModalItem(item);
                                  setShowRejectInput(false);
                                  setKycRejectReason("");
                                }}
                                title="Manage Partner KYC Verification Status"
                                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-block"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </button>
                              <Link
                                href={`/users/merchants/${item.id}`}
                                title="View Complete Business Partner Details (Full Page)"
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                              <Link
                                href={`/users/merchants/${item.id}/edit`}
                                title="Edit All Business Partner Fields (Full Page)"
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => setDeleteConfirmId(item.id)}
                                title="Delete Business Partner Listing"
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Server-Side Pagination */}
              <PaginationControls
                page={pagination.totalRecords === 0 ? 1 : page}
                pageSize={pageSize}
                totalRecords={pagination.totalRecords}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setPage(1);
                }}
                pageSizeOptions={[5, 10, 20, 50]}
              />
            </>
          )}
        </div>

        {/* KYC Management Modal */}
        {kycModalItem && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Manage Partner KYC</h3>
                    <p className="text-[11px] text-slate-500 truncate max-w-[240px]">{kycModalItem.business}</p>
                  </div>
                </div>
                <button
                  onClick={() => setKycModalItem(null)}
                  disabled={kycUpdating}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Status Info Box */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Current KYC Badge:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    kycModalItem.kyc === "VERIFIED"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {kycModalItem.kyc}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Owner Contact:</span>
                  <span className="font-semibold text-slate-800">{kycModalItem.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Registered Email:</span>
                  <span className="font-semibold text-slate-800">{kycModalItem.email || "N/A"}</span>
                </div>
              </div>

              {/* Quick Actions */}
              {!showRejectInput ? (
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => handleApproveKycQuick(kycModalItem.id, kycModalItem.business)}
                    disabled={kycUpdating || kycModalItem.kyc === "VERIFIED"}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve &amp; Grant Verified Badge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRejectInput(true)}
                    disabled={kycUpdating}
                    className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Reject Partner KYC Verification</span>
                  </button>

                  <Link
                    href={`/users/merchants/${kycModalItem.id}`}
                    onClick={() => setKycModalItem(null)}
                    className="w-full py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Inspect Full Uploaded Proofs &amp; Licenses</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Reason for Rejection *
                    </label>
                    <textarea
                      rows={3}
                      value={kycRejectReason}
                      onChange={(e) => setKycRejectReason(e.target.value)}
                      placeholder="e.g. GST certificate mismatch or blurry trade license proof"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(false)}
                      disabled={kycUpdating}
                      className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectKycQuick(kycModalItem.id, kycModalItem.business)}
                      disabled={kycUpdating}
                      className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      {kycUpdating ? "Rejecting..." : "Confirm Rejection"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Delete Merchant Business?</h4>
                <p className="text-xs text-slate-500">
                  This will permanently delete merchant storefront <code className="font-mono text-red-600">{deleteConfirmId}</code> and unpublish its catalog. This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMerchant(deleteConfirmId)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Dynamic Action Toast */}
        {feedbackToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-indigo-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-indigo-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-xs font-semibold">{feedbackToast}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
