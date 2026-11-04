"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  UserCheck, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { 
  SearchInput, 
  MetricCard, 
  PageHeader, 
  AdminLayout, 
  PaginationControls, 
  TableSkeleton 
} from "@/components/shared";

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar_url?: string;
  enquiries: number;
  status: string;
  joined: string;
  updated_at?: string;
}

const API_BASE = "http://localhost:4000/api/v1";

export default function CustomersPage() {
  const [data, setData] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side query state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch customers from backend API
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search: search.trim(),
        status: statusFilter,
      });

      const res = await fetch(`${API_BASE}/admin/customers?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setData(json.data || []);
        if (json.pagination) {
          setPagination(json.pagination);
        }
        if (json.summary) {
          setSummary(json.summary);
        }
      } else {
        setError(json.message || "Failed to load customers from database");
      }
    } catch (err: any) {
      setError(err?.message || "Error connecting to backend server");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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

  // Delete single customer
  const handleDeleteCustomer = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/customers/${id}/delete`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirmId(null);
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        fetchCustomers();
      } else {
        alert(json.message || "Delete failed");
      }
    } catch (err: any) {
      alert("Error deleting customer: " + err.message);
    }
  };

  // Bulk delete selected
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected customer(s)?`)) return;
    try {
      setIsDeletingBulk(true);
      const res = await fetch(`${API_BASE}/admin/customers/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds([]);
        fetchCustomers();
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
          icon={UserCheck}
          title="Customer Directory"
          description="Verified B2C consumer accounts, mobile verifications, and enquiry search activity directly from database."
          actions={
            <button
              onClick={() => fetchCustomers()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
              Refresh
            </button>
          }
        />

        {/* Metric Cards connected to DB */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Total Registered Customers"
            value={summary.totalCustomers.toLocaleString("en-IN")}
            subtext="From MySQL database"
            subtextColor="text-blue-600"
          />
          <MetricCard
            label="Active Customers"
            value={summary.activeCustomers.toLocaleString("en-IN")}
            subtext="Ready for inquiries"
            subtextColor="text-emerald-600"
          />
          <MetricCard
            label="Verified Phone Numbers"
            value={summary.totalCustomers > 0 ? "100%" : "0%"}
            subtext="OTP authenticated"
            subtextColor="text-purple-600"
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by customer name, phone, or email..."
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-medium text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* Bulk Selection Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl text-xs font-medium text-blue-900 animate-in fade-in">
            <span>
              <strong>{selectedIds.length}</strong> record(s) selected
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

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-4">
              <TableSkeleton rows={pageSize} />
            </div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">No Customers Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {search || statusFilter !== "ALL"
                  ? "No customers match your active search filters."
                  : "No registered customer records in the database yet."}
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
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Enquiries</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Joined Date</th>
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
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {item.name ? item.name.charAt(0).toUpperCase() : "C"}
                              </div>
                              <div>
                                <Link 
                                  href={`/users/customers/${item.id}`}
                                  className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block"
                                >
                                  {item.name || "Customer Account"}
                                </Link>
                                <div className="font-mono text-[10px] text-slate-400">{item.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">{item.phone}</div>
                            <div className="text-[11px] text-slate-500">{item.email || "No email provided"}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                              <MessageSquare className="w-3 h-3 text-blue-500" />
                              {item.enquiries} Leads
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md border text-[11px] ${
                                item.status === "ACTIVE"
                                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                  : "text-amber-700 bg-amber-50 border-amber-200"
                              }`}
                            >
                              {item.status === "ACTIVE" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {item.joined ? new Date(item.joined).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/users/customers/${item.id}`}
                                title="View Customer Details (Full Page)"
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                              <Link
                                href={`/users/customers/${item.id}/edit`}
                                title="Edit Customer Profile (Full Page)"
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => setDeleteConfirmId(item.id)}
                                title="Delete Customer"
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

              {/* Server-Side Pagination Controls */}
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

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Delete Customer Account?</h4>
                <p className="text-xs text-slate-500">
                  This will permanently delete customer record <code className="font-mono text-red-600">{deleteConfirmId}</code>. This action cannot be undone.
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
                  onClick={() => handleDeleteCustomer(deleteConfirmId)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
