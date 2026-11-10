"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FolderKanban,
  FileCheck2,
  Building,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Save,
  X,
  Layers,
  ListTree
} from "lucide-react";

const API_BASE = "http://localhost:4000/api/v1";

type MasterTab = "categories" | "subcategories" | "business-types" | "document-types";

export function MasterDataModule({ initialTab = "categories" }: { initialTab?: MasterTab }) {
  const [activeTab, setActiveTab] = useState<MasterTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Data lists
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [businessTypes, setBusinessTypes] = useState<any[]>([]);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    slug: "",
    categoryId: "",
    description: "",
    iconName: "Layers",
    sortOrder: 0,
    isActive: true,
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const [catRes, subcatRes, btypeRes, docRes] = await Promise.all([
        fetch(`${API_BASE}/admin/categories`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/admin/subcategories`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/admin/business-types`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/admin/document-types`).then((r) => r.json()).catch(() => null),
      ]);

      if (catRes?.success && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
      }
      if (subcatRes?.success && Array.isArray(subcatRes.data)) {
        setSubcategories(subcatRes.data);
      }
      if (btypeRes?.success && Array.isArray(btypeRes.data)) {
        setBusinessTypes(btypeRes.data);
      }
      if (docRes?.success && Array.isArray(docRes.data)) {
        setDocumentTypes(docRes.data);
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: "Failed to load master records from backend." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      code: "",
      slug: "",
      categoryId: categories[0]?.id || "",
      description: "",
      iconName: "Layers",
      sortOrder: (getCurrentList().length + 1) * 10,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      code: item.code || item.slug || "",
      slug: item.slug || "",
      categoryId: item.categoryId || item.category_id || categories[0]?.id || "",
      description: item.description || item.metaDescription || "",
      iconName: item.iconName || "Layers",
      sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : 0,
      isActive: item.isActive === 1 || item.isActive === true,
    });
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFeedback({ type: "error", message: "Name is required." });
      return;
    }
    if (activeTab === "subcategories" && !formData.categoryId) {
      setFeedback({ type: "error", message: "Parent Category is required for subcategory." });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      let endpoint = "";
      if (activeTab === "categories") endpoint = `${API_BASE}/admin/categories`;
      else if (activeTab === "subcategories") endpoint = `${API_BASE}/admin/subcategories`;
      else if (activeTab === "business-types") endpoint = `${API_BASE}/admin/business-types`;
      else if (activeTab === "document-types") endpoint = `${API_BASE}/admin/document-types`;

      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;

      const payload: any = {
        name: formData.name.trim(),
        code: formData.code.trim() || formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        iconName: formData.iconName,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive,
      };

      if (activeTab === "subcategories") {
        payload.categoryId = formData.categoryId;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        setIsModalOpen(false);
        setFeedback({
          type: "success",
          message: `${editingItem ? "Updated" : "Added"} "${formData.name}" successfully!`,
        });
        fetchData();
      } else {
        setFeedback({ type: "error", message: json.message || "Operation failed." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to save record." });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete / Deactivate
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete or deactivate "${name}"?`)) return;

    setActionLoading(true);
    setFeedback(null);
    try {
      let endpoint = "";
      if (activeTab === "categories") endpoint = `${API_BASE}/admin/categories`;
      else if (activeTab === "subcategories") endpoint = `${API_BASE}/admin/subcategories`;
      else if (activeTab === "business-types") endpoint = `${API_BASE}/admin/business-types`;
      else if (activeTab === "document-types") endpoint = `${API_BASE}/admin/document-types`;

      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: "success", message: `"${name}" removed successfully!` });
        fetchData();
      } else {
        setFeedback({ type: "error", message: json.message || "Deletion failed." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: "Failed to delete item." });
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle active status directly
  const handleToggleActive = async (item: any) => {
    try {
      let endpoint = "";
      if (activeTab === "categories") endpoint = `${API_BASE}/admin/categories`;
      else if (activeTab === "subcategories") endpoint = `${API_BASE}/admin/subcategories`;
      else if (activeTab === "business-types") endpoint = `${API_BASE}/admin/business-types`;
      else if (activeTab === "document-types") endpoint = `${API_BASE}/admin/document-types`;

      const newStatus = !(item.isActive === 1 || item.isActive === true);
      const res = await fetch(`${endpoint}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helpers
  const getCurrentList = () => {
    if (activeTab === "categories") return categories;
    if (activeTab === "subcategories") {
      if (selectedCategoryFilter !== "ALL") {
        return subcategories.filter(s => s.categoryId === selectedCategoryFilter || s.categorySlug === selectedCategoryFilter);
      }
      return subcategories;
    }
    if (activeTab === "business-types") return businessTypes;
    return documentTypes;
  };

  const filteredList = getCurrentList().filter((item) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = item.name?.toLowerCase().includes(q);
    const codeMatch = (item.code || item.slug)?.toLowerCase().includes(q);
    const descMatch = (item.metaDescription || item.description)?.toLowerCase().includes(q);
    const catMatch = item.categoryName?.toLowerCase().includes(q);
    return nameMatch || codeMatch || descMatch || catMatch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-[#0076D7]">
              Master Management
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Categories, Subcategories &amp; Dropdown Configurations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin can create, update, and delete Categories, Subcategories, and Business Constitutions. Changes auto-reflect on Website and Mobile App.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Sync
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0076D7] hover:bg-[#0062b3] rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab === "categories" ? "Category" : activeTab === "subcategories" ? "Subcategory" : activeTab === "business-types" ? "Business Type" : "Document Proof"}
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => { setActiveTab("categories"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "categories"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          Primary Categories ({categories.length})
        </button>
        <button
          onClick={() => { setActiveTab("subcategories"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "subcategories"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <ListTree className="w-4 h-4" />
          Subcategories / Services ({subcategories.length})
        </button>
        <button
          onClick={() => { setActiveTab("business-types"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "business-types"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Building className="w-4 h-4" />
          Business Types / Constitution ({businessTypes.length})
        </button>
        <button
          onClick={() => { setActiveTab("document-types"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "document-types"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Business Registration Proofs ({documentTypes.length})
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab.replace("-", " ")}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0076D7]"
            />
          </div>

          {activeTab === "subcategories" && (
            <div className="shrink-0">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#0076D7]"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="text-[11px] font-semibold text-slate-500">
          Showing <span className="font-bold text-slate-800">{filteredList.length}</span> records
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Name &amp; Slug</th>
                {activeTab === "subcategories" && <th className="py-3 px-4">Parent Category</th>}
                {activeTab === "categories" && <th className="py-3 px-4">Businesses</th>}
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Sort Order</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0076D7]" />
                    Loading master records from database...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No records found matching your search.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {item.slug || item.code}
                      </div>
                    </td>

                    {activeTab === "subcategories" && (
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0076D7] border border-blue-100">
                          {item.categoryName || "General"}
                        </span>
                      </td>
                    )}

                    {activeTab === "categories" && (
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800">{item.businessesCount || 0}</span>
                        <span className="text-[10px] text-slate-400 ml-1">listings</span>
                      </td>
                    )}

                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                      {item.description || item.metaDescription || "—"}
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {item.sortOrder ?? item.sort_order ?? 0}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          item.isActive === 1 || item.isActive === true
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        {item.isActive === 1 || item.isActive === true ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Record"
                          className="p-1.5 text-slate-500 hover:text-[#0076D7] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          title="Delete Record"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {editingItem ? "Edit" : "Add New"}{" "}
                  {activeTab === "categories"
                    ? "Category"
                    : activeTab === "subcategories"
                    ? "Subcategory"
                    : activeTab === "business-types"
                    ? "Business Type"
                    : "Registration Proof"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Record will automatically sync with database, website, and mobile app.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Restaurants & Dining"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              {activeTab === "subcategories" && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Parent Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#0076D7]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Code / Slug
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. dining-restaurant"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value, slug: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed description or context for partner profile..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#0076D7] rounded border-slate-300 focus:ring-0"
                />
                <label htmlFor="isActiveToggle" className="font-bold text-slate-700 cursor-pointer">
                  Active (visible in Website &amp; Mobile dropdowns)
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-4 py-2 font-bold text-white bg-[#0076D7] hover:bg-[#0062b3] rounded-xl transition-all shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  {actionLoading ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
