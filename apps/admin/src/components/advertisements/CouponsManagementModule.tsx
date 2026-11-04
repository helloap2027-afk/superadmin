"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Ticket,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Percent,
  IndianRupee,
  Calendar,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Tag,
  Eye,
  Edit3,
  CheckSquare
} from "lucide-react";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/StateComponents";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { BulkActionToolbar } from "@/components/shared/BulkActionToolbar";
import { UnifiedPreviewModal } from "@/components/shared/UnifiedPreviewModal";

interface CouponItem {
  id: string;
  code: string;
  title: string;
  description: string;
  terms: string;
  category: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_discount: number;
  usage_limit: number;
  per_user_limit: number;
  redemption_count: number;
  applicable_city: string;
  valid_from: string;
  valid_until: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  created_at: string;
}

export function CouponsManagementModule() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("ALL");

  // Meta
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Selection & Bulk State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [previewCoupon, setPreviewCoupon] = useState<CouponItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [formCode, setFormCode] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formTerms, setFormTerms] = useState("");
  const [formType, setFormType] = useState<"FIXED" | "PERCENTAGE">("FIXED");
  const [formValue, setFormValue] = useState<number>(100);
  const [formMinOrder, setFormMinOrder] = useState<number>(499);
  const [formMaxDiscount, setFormMaxDiscount] = useState<number>(100);
  const [formUsageLimit, setFormUsageLimit] = useState<number>(500);
  const [formCity, setFormCity] = useState("Vijayawada");

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (discountTypeFilter !== "ALL") params.append("discountType", discountTypeFilter);

      const res = await fetch(`http://localhost:4000/api/v1/admin/coupons?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setCoupons(json.data || []);
        if (json.pagination) {
          setTotalRecords(json.pagination.totalRecords || 0);
          setTotalPages(json.pagination.totalPages || 1);
        }
      } else {
        throw new Error(json.message || "Failed to load coupons");
      }
    } catch (err: any) {
      setError(err?.message || "Error loading coupons");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, discountTypeFilter]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(coupons.map((c) => c.id));
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
    if (selectedIds.length === 0) return;
    const confirmMsg = `Are you sure you want to delete ${selectedIds.length} selected coupon(s)? Coupons with historical customer redemptions will be protected from deletion.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setIsProcessingBulk(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/coupons/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds([]);
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/coupons/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (cpn: CouponItem) => {
    setEditingCoupon(cpn);
    setFormCode(cpn.code);
    setFormTitle(cpn.title);
    setFormDesc(cpn.description || "");
    setFormTerms(cpn.terms || "");
    setFormType((cpn.discount_type as any) || "FIXED");
    setFormValue(cpn.discount_value || 100);
    setFormMinOrder(cpn.min_order_value || 0);
    setFormMaxDiscount(cpn.max_discount || 100);
    setFormUsageLimit(cpn.usage_limit || 500);
    setFormCity(cpn.applicable_city || "Vijayawada");
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const isEdit = !!editingCoupon;
      const url = isEdit
        ? `http://localhost:4000/api/v1/admin/coupons/${editingCoupon.id}`
        : "http://localhost:4000/api/v1/admin/coupons";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-user": "Super Admin" },
        body: JSON.stringify({
          code: formCode.toUpperCase().trim(),
          title: formTitle,
          description: formDesc,
          terms: formTerms,
          discountType: formType,
          discountValue: formValue,
          minOrderValue: formMinOrder,
          maxDiscount: formType === "PERCENTAGE" ? formMaxDiscount : formValue,
          usageLimit: formUsageLimit,
          applicableCity: formCity,
          status: editingCoupon ? editingCoupon.status : "ACTIVE",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsCreateOpen(false);
        setEditingCoupon(null);
        fetchCoupons();
      } else {
        alert(json.message || "Failed to save coupon");
      }
    } catch (err: any) {
      alert(err?.message || "Error saving coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAllSelected = coupons.length > 0 && selectedIds.length === coupons.length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
            <Ticket className="w-4 h-4" />
            <span>Discount & Promotional Codes</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
            Coupons Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure promotional discount codes in INR (₹) with usage limits for Andhra Pradesh customers.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCoupon(null);
            setFormCode("");
            setFormTitle("");
            setFormDesc("");
            setFormTerms("Valid on bookings above min order. One redemption per registered customer.");
            setFormValue(100);
            setFormMinOrder(499);
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#0062b3] text-white font-bold text-sm shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedIds.length}
        totalVisibleCount={coupons.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        entityName="coupons"
        isProcessing={isProcessingBulk}
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, title, description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="EXPIRED">Expired</option>
        </select>

        <select
          value={discountTypeFilter}
          onChange={(e) => {
            setDiscountTypeFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold"
        >
          <option value="ALL">All Discount Types</option>
          <option value="FIXED">Flat Amount (₹)</option>
          <option value="PERCENTAGE">Percentage (%)</option>
        </select>

        <button
          onClick={fetchCoupons}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
          title="Refresh Coupons"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0076D7]" : ""}`} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={8} />
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <button
              onClick={fetchCoupons}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
            >
              Try Again
            </button>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="No promotional coupons found"
              description="Create discount coupons to reward new users or incentivize high-value enquiry bookings."
              actionLabel="Create Coupon"
              onAction={() => setIsCreateOpen(true)}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0076D7] border-slate-300 focus:ring-[#0076D7] cursor-pointer"
                    />
                  </th>
                  <th className="px-5 py-3.5">Coupon Code</th>
                  <th className="px-4 py-3.5">Title & Terms</th>
                  <th className="px-4 py-3.5">Discount Value</th>
                  <th className="px-4 py-3.5">Min Order / City</th>
                  <th className="px-4 py-3.5">Redemption Usage</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {coupons.map((cpn) => {
                  const isSelected = selectedIds.includes(cpn.id);
                  return (
                    <tr key={cpn.id} className={`transition ${isSelected ? "bg-blue-50/40" : "hover:bg-slate-50/60"}`}>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(cpn.id, e.target.checked)}
                          className="w-4 h-4 rounded text-[#0076D7] border-slate-300 focus:ring-[#0076D7] cursor-pointer"
                        />
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg font-mono font-bold text-xs text-[#0076D7]">
                          <Tag className="w-3.5 h-3.5" />
                          <span>{cpn.code}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 max-w-[280px]">
                        <div className="font-bold text-slate-900">{cpn.title}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{cpn.description}</div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-extrabold text-slate-900">
                          {cpn.discount_type === "FIXED" ? `₹${cpn.discount_value}` : `${cpn.discount_value}%`}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {cpn.discount_type === "FIXED" ? "Flat Instant Off" : `Max ₹${cpn.max_discount}`}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">Min: ₹{cpn.min_order_value}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{cpn.applicable_city}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">
                          {cpn.redemption_count} / {cpn.usage_limit}
                        </div>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-[#0076D7] h-full rounded-full"
                            style={{
                              width: `${Math.min(100, Math.round((cpn.redemption_count / cpn.usage_limit) * 100))}%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            cpn.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {cpn.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewCoupon(cpn)}
                            className="p-1.5 text-slate-500 hover:text-[#0076D7] rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Preview Customer Coupon"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(cpn)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Coupon"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(cpn.id, cpn.status)}
                            className={`inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-bold transition border cursor-pointer ${
                              cpn.status === "ACTIVE"
                                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                : "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {cpn.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-slate-100">
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
            totalRecords={totalRecords}
          />
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isCreateOpen || editingCoupon) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {editingCoupon ? "Edit Discount Coupon" : "Create Discount Coupon"}
                </h3>
                <p className="text-xs text-slate-500">Configure promotional rules and discount values in INR (₹)</p>
              </div>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingCoupon(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Coupon Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GUNTUR50"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  disabled={!!editingCoupon}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 uppercase font-mono font-bold focus:outline-none focus:border-[#0076D7] disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Coupon Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guntur Inaugural Saver Offer"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Flat ₹100 off on first home service booking"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="FIXED">Flat Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Value {formType === "FIXED" ? "(₹)" : "(%)"} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={formUsageLimit}
                    onChange={(e) => setFormUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target City</label>
                <select
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="All">All Cities</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingCoupon(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingCoupon ? "Update Coupon" : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNIFIED REALISTIC PREVIEW MODAL */}
      <UnifiedPreviewModal
        isOpen={!!previewCoupon}
        onClose={() => setPreviewCoupon(null)}
        title={previewCoupon?.title || "Coupon Preview"}
        type="COUPON"
        data={previewCoupon}
      />
    </div>
  );
}
