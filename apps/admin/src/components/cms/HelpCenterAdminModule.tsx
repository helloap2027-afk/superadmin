"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Users,
  Store,
  Phone,
  Mail,
  MessageSquare,
  Ticket,
  Eye,
  RefreshCw,
  FolderPlus,
  FileText,
  Check,
  X,
  AlertCircle
} from "lucide-react";

const API_BASE = "http://localhost:4000/api/v1";

export function HelpCenterAdminModule() {
  const [activeTab, setActiveTab] = useState<"articles" | "categories" | "channels" | "tickets">("articles");
  const [audienceFilter, setAudienceFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Data states
  const [categories, setCategories] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  // Modal / Form states
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, artRes, chanRes, tktRes] = await Promise.all([
        fetch(`${API_BASE}/admin/help-center/categories`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/admin/help-center/articles`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/admin/help-center/support-channels`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/admin/help-center/tickets`).then((r) => r.json()).catch(() => null),
      ]);

      if (catRes?.success) setCategories(catRes.data || []);
      if (artRes?.success) setArticles(artRes.data || []);
      if (chanRes?.success) setChannels(chanRes.data || []);
      if (tktRes?.success) setTickets(tktRes.data || []);
    } catch {
      setFeedback({ type: "error", text: "Failed to load Help Center data from backend." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.title) return;

    try {
      const url = editingCategory.id
        ? `${API_BASE}/admin/help-center/categories/${editingCategory.id}`
        : `${API_BASE}/admin/help-center/categories`;
      const method = editingCategory.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: "success", text: "Category saved successfully!" });
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        fetchData();
      } else {
        setFeedback({ type: "error", text: "Error saving category." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error saving category." });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All associated articles will also be removed.")) return;
    try {
      await fetch(`${API_BASE}/admin/help-center/categories/${id}`, { method: "DELETE" });
      setFeedback({ type: "success", text: "Category deleted." });
      fetchData();
    } catch {
      setFeedback({ type: "error", text: "Failed to delete category." });
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle?.categoryId) return;

    try {
      const url = editingArticle.id
        ? `${API_BASE}/admin/help-center/articles/${editingArticle.id}`
        : `${API_BASE}/admin/help-center/articles`;
      const method = editingArticle.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArticle),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: "success", text: "Article saved successfully!" });
        setIsArticleModalOpen(false);
        setEditingArticle(null);
        fetchData();
      } else {
        setFeedback({ type: "error", text: "Error saving article." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error saving article." });
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await fetch(`${API_BASE}/admin/help-center/articles/${id}`, { method: "DELETE" });
      setFeedback({ type: "success", text: "Article deleted." });
      fetchData();
    } catch {
      setFeedback({ type: "error", text: "Failed to delete article." });
    }
  };

  const handleToggleArticleStatus = async (art: any) => {
    const nextStatus = art.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await fetch(`${API_BASE}/admin/help-center/articles/${art.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchData();
    } catch {}
  };

  const handleUpdateTicketStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_BASE}/admin/help-center/tickets/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setFeedback({ type: "success", text: `Ticket status updated to ${status}.` });
      fetchData();
    } catch {}
  };

  const filteredArticles = articles.filter((a) => {
    const matchesAudience = audienceFilter === "ALL" || a.audience === audienceFilter;
    const matchesQuery = !searchQuery || a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.categoryTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAudience && matchesQuery;
  });

  const filteredCategories = categories.filter((c) => {
    const matchesAudience = audienceFilter === "ALL" || c.audience === audienceFilter;
    const matchesQuery = !searchQuery || c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAudience && matchesQuery;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-[#0076D7] rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Help Center CMS &amp; Support Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centrally manage Customer and Business Partner help topics, articles, contact channels, and tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingCategory({ audience: "CUSTOMER", status: "PUBLISHED", displayOrder: categories.length + 1 });
              setIsCategoryModalOpen(true);
            }}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs"
          >
            <FolderPlus className="w-4 h-4 text-[#0076D7]" />
            <span>New Category</span>
          </button>
          <button
            onClick={() => {
              setEditingArticle({ audience: "CUSTOMER", status: "PUBLISHED", categoryId: categories[0]?.id || "", isPopular: true, displayOrder: articles.length + 1 });
              setIsArticleModalOpen(true);
            }}
            className="bg-[#0076D7] hover:bg-[#005FAE] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${feedback.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("articles")}
          className={`pb-3 flex items-center gap-2 transition ${activeTab === "articles" ? "border-b-2 border-[#0076D7] text-[#0076D7]" : "text-slate-500 hover:text-slate-800"}`}
        >
          <FileText className="w-4 h-4" />
          <span>Articles ({articles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 flex items-center gap-2 transition ${activeTab === "categories" ? "border-b-2 border-[#0076D7] text-[#0076D7]" : "text-slate-500 hover:text-slate-800"}`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("channels")}
          className={`pb-3 flex items-center gap-2 transition ${activeTab === "channels" ? "border-b-2 border-[#0076D7] text-[#0076D7]" : "text-slate-500 hover:text-slate-800"}`}
        >
          <Phone className="w-4 h-4" />
          <span>Support Channels ({channels.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("tickets")}
          className={`pb-3 flex items-center gap-2 transition ${activeTab === "tickets" ? "border-b-2 border-[#0076D7] text-[#0076D7]" : "text-slate-500 hover:text-slate-800"}`}
        >
          <Ticket className="w-4 h-4" />
          <span>Support Tickets ({tickets.length})</span>
        </button>
      </div>

      {/* Audience Filter & Search Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 mr-1">Audience:</span>
          {["ALL", "CUSTOMER", "BUSINESS_PARTNER"].map((aud) => (
            <button
              key={aud}
              onClick={() => setAudienceFilter(aud)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                audienceFilter === aud
                  ? "bg-[#0076D7] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {aud === "ALL" ? "All Audiences" : aud === "CUSTOMER" ? "Customer" : "Business Partner"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#0076D7]"
          />
        </div>
      </div>

      {/* TAB 1: ARTICLES */}
      {activeTab === "articles" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Article</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Audience</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Views</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No articles found matching filters.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div className="flex flex-col">
                        <span>{art.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal truncate max-w-sm">
                          {art.summary}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {art.categoryTitle || "General"}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        art.audience === "BUSINESS_PARTNER"
                          ? "bg-orange-50 text-[#FF6B35] border border-orange-200"
                          : "bg-blue-50 text-[#0076D7] border border-blue-200"
                      }`}>
                        {art.audience}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleArticleStatus(art)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          art.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {art.status}
                      </button>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                      {art.views_count || art.viewsCount || 0}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingArticle(art);
                          setIsArticleModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1.5 hover:bg-red-50 rounded text-red-600 transition"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Category Title</th>
                <th className="p-3.5">Slug</th>
                <th className="p-3.5">Audience</th>
                <th className="p-3.5">Articles</th>
                <th className="p-3.5">Order</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 font-bold text-slate-900">
                    <div className="flex flex-col">
                      <span>{c.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{c.subtitle}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">{c.slug}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.audience === "BUSINESS_PARTNER"
                        ? "bg-orange-50 text-[#FF6B35] border border-orange-200"
                        : "bg-blue-50 text-[#0076D7] border border-blue-200"
                    }`}>
                      {c.audience}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 font-bold">{c.articleCount || 0}</td>
                  <td className="p-3.5 text-slate-500 font-mono">{c.display_order || c.displayOrder || 0}</td>
                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => {
                        setEditingCategory(c);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1.5 hover:bg-red-50 rounded text-red-600 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: SUPPORT CHANNELS */}
      {activeTab === "channels" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <p className="text-xs text-slate-500">
            Configure live contact channels displayed in the Help Center contact panels. Phone numbers, WhatsApp, and Emails are retrieved dynamically by clients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((chan) => (
              <div key={chan.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800">{chan.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded uppercase">
                      {chan.channelType || chan.channel_type}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#0076D7] mt-1 font-mono">{chan.value}</p>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    Audience: {chan.audience}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const newVal = prompt(`Update ${chan.label} destination:`, chan.value);
                    if (newVal && newVal.trim()) {
                      fetch(`${API_BASE}/admin/help-center/support-channels/${chan.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ value: newVal.trim() }),
                      }).then(() => fetchData());
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-bold text-slate-700 shadow-2xs"
                >
                  Edit Value
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT TICKETS */}
      {activeTab === "tickets" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Ticket #</th>
                <th className="p-3.5">User / Contact</th>
                <th className="p-3.5">Category &amp; Subject</th>
                <th className="p-3.5">Audience</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Created</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No support tickets submitted yet.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-bold font-mono text-[#0076D7]">{t.ticket_number || t.ticketNumber}</td>
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{t.userName || "Guest / Anonymous"}</span>
                        <span className="text-[10px] text-slate-400">{t.userPhone || t.userEmail || "No Contact"}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{t.subject}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-xs">{t.description}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.audience === "BUSINESS_PARTNER" ? "bg-orange-50 text-[#FF6B35]" : "bg-blue-50 text-[#0076D7]"
                      }`}>
                        {t.audience}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateTicketStatus(t.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded border ${
                          t.status === "OPEN"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : t.status === "RESOLVED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-slate-400 text-[10px]">
                      {new Date(t.created_at || t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <a
                        href={`/support/tickets/${t.id}`}
                        className="px-2.5 py-1 text-xs bg-blue-50 hover:bg-blue-600 hover:text-white rounded font-bold text-blue-700 transition"
                      >
                        Open Workspace →
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: CATEGORY EDIT */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-black text-slate-900 mb-4">
              {editingCategory?.id ? "Edit Category" : "Create New Category"}
            </h2>
            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingCategory?.title || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#0076D7]"
                  placeholder="e.g. Booking & Service Enquiries"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingCategory?.subtitle || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, subtitle: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#0076D7]"
                  placeholder="e.g. Book a service, track requests & get updates"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Audience</label>
                  <select
                    value={editingCategory?.audience || "CUSTOMER"}
                    onChange={(e) => setEditingCategory({ ...editingCategory, audience: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="BUSINESS_PARTNER">BUSINESS_PARTNER</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingCategory?.displayOrder || editingCategory?.display_order || 0}
                    onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value, 10) })}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#005FAE] text-white rounded-xl font-bold shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ARTICLE EDIT */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <h2 className="text-base font-black text-slate-900 mb-4">
              {editingArticle?.id ? "Edit Article" : "Create New Article"}
            </h2>
            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={editingArticle?.title || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#0076D7]"
                  placeholder="e.g. How to track my booking status?"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Category</label>
                  <select
                    value={editingArticle?.categoryId || editingArticle?.category_id || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, categoryId: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.audience}] {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Audience</label>
                  <select
                    value={editingArticle?.audience || "CUSTOMER"}
                    onChange={(e) => setEditingArticle({ ...editingArticle, audience: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="BUSINESS_PARTNER">BUSINESS_PARTNER</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Summary (Short preview)</label>
                <textarea
                  rows={2}
                  value={editingArticle?.summary || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#0076D7]"
                  placeholder="Brief 1-2 sentence overview shown in article listings..."
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Article Content (HTML / Text)</label>
                <textarea
                  rows={6}
                  required
                  value={editingArticle?.content || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 font-mono text-xs focus:outline-none focus:border-[#0076D7]"
                  placeholder="<h2>Heading</h2><p>Article body content...</p>"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Search Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={editingArticle?.searchKeywords || editingArticle?.search_keywords || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, searchKeywords: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2"
                    placeholder="booking, refund, cancel"
                  />
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingArticle?.isPopular || !!editingArticle?.is_popular}
                      onChange={(e) => setEditingArticle({ ...editingArticle, isPopular: e.target.checked })}
                      className="rounded text-[#0076D7]"
                    />
                    <span>Mark as Popular</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#005FAE] text-white rounded-xl font-bold shadow-xs"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

