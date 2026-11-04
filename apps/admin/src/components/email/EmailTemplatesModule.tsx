"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Send,
  Code,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  ChevronLeft,
  Layers,
  Sparkles,
  Smartphone,
  Monitor,
  RotateCcw,
  Check,
  Archive,
  RefreshCw,
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  template_key: string;
  category: string;
  subject_template: string;
  preheader_text?: string;
  heading_text?: string;
  greeting_text?: string;
  body_html: string;
  cta_label?: string;
  cta_url?: string;
  banner_image_url?: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  version: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export function EmailTemplatesModule() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Global Branding Data for Unified Preview
  const [globalBranding, setGlobalBranding] = useState<any>(null);

  // Modals & Panels
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [testEmailModal, setTestEmailModal] = useState<EmailTemplate | null>(null);
  const [testEmailRecipient, setTestEmailRecipient] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSendResult, setTestSendResult] = useState<string | null>(null);
  const [versionHistoryModal, setVersionHistoryModal] = useState<EmailTemplate | null>(null);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formTemplateKey, setFormTemplateKey] = useState("");
  const [formCategory, setFormCategory] = useState("TRANSACTIONAL");
  const [formSubject, setFormSubject] = useState("");
  const [formPreheader, setFormPreheader] = useState("");
  const [formHeading, setFormHeading] = useState("");
  const [formGreeting, setFormGreeting] = useState("Hello {{first_name}},");
  const [formBody, setFormBody] = useState("");
  const [formCtaLabel, setFormCtaLabel] = useState("");
  const [formCtaUrl, setFormCtaUrl] = useState("");
  const [formStatus, setFormStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [isSaving, setIsSaving] = useState(false);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search.trim()) params.append("search", search.trim());
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`http://localhost:4000/api/v1/admin/email/templates?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTemplates(json.data);
        if (json.pagination) {
          setTotalRecords(json.pagination.totalRecords || 0);
          setTotalPages(json.pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error("Failed to load email templates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [page, pageSize, categoryFilter, statusFilter]);

  // Load global layout & footer settings to match Branding Preview exactly
  useEffect(() => {
    fetch("http://localhost:4000/api/v1/admin/email/branding")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setGlobalBranding(json.data);
        }
      })
      .catch((err) => console.error("Error loading branding for email preview", err));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTemplates();
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormTemplateKey("");
    setFormCategory("TRANSACTIONAL");
    setFormSubject("");
    setFormPreheader("");
    setFormHeading("Notification from HELLO");
    setFormGreeting("Hello {{first_name}},");
    setFormBody("<p>Your notification content goes here. Discover verified businesses near you.</p>");
    setFormCtaLabel("View Details");
    setFormCtaUrl("https://hello-hi.in");
    setFormStatus("PUBLISHED");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (tpl: EmailTemplate) => {
    setEditingId(tpl.id);
    setFormName(tpl.name);
    setFormTemplateKey(tpl.template_key);
    setFormCategory(tpl.category);
    setFormSubject(tpl.subject_template);
    setFormPreheader(tpl.preheader_text || "");
    setFormHeading(tpl.heading_text || "");
    setFormGreeting(tpl.greeting_text || "Hello,");
    setFormBody(tpl.body_html || "");
    setFormCtaLabel(tpl.cta_label || "");
    setFormCtaUrl(tpl.cta_url || "");
    setFormStatus(tpl.status === "DRAFT" ? "DRAFT" : "PUBLISHED");
    setIsEditorOpen(true);
  };

  const handleDuplicate = async (tpl: EmailTemplate) => {
    try {
      const payload = {
        name: `${tpl.name} (Copy)`,
        templateKey: `${tpl.template_key}_COPY_${Date.now().toString().slice(-4)}`,
        category: tpl.category,
        subjectTemplate: tpl.subject_template,
        preheaderText: tpl.preheader_text,
        headingText: tpl.heading_text,
        greetingText: tpl.greeting_text,
        bodyHtml: tpl.body_html,
        ctaLabel: tpl.cta_label,
        ctaUrl: tpl.cta_url,
        status: "DRAFT",
      };

      const res = await fetch("http://localhost:4000/api/v1/admin/email/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        fetchTemplates();
      } else {
        alert(json.message || "Could not duplicate template");
      }
    } catch (err: any) {
      alert(err.message || "Error duplicating template");
    }
  };

  const handleTogglePublish = async (tpl: EmailTemplate) => {
    const newStatus = tpl.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/email/templates/${tpl.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === tpl.id ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      alert("Error toggling template status");
    }
  };

  const handleRollbackVersion = async (tpl: EmailTemplate, targetVersion: string) => {
    if (!window.confirm(`Roll back template to ${targetVersion}?`)) return;
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/email/templates/${tpl.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: targetVersion }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`Template restored to ${targetVersion}`);
        setVersionHistoryModal(null);
        fetchTemplates();
      }
    } catch (err) {
      alert("Error restoring version");
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSubject.trim()) return;

    try {
      setIsSaving(true);
      const payload = {
        name: formName.trim(),
        templateKey: formTemplateKey.trim() || formName.toUpperCase().replace(/[^A-Z0-9_]+/g, "_"),
        category: formCategory,
        subjectTemplate: formSubject.trim(),
        preheaderText: formPreheader.trim(),
        headingText: formHeading.trim(),
        greetingText: formGreeting.trim(),
        bodyHtml: formBody,
        ctaLabel: formCtaLabel.trim(),
        ctaUrl: formCtaUrl.trim(),
        status: formStatus,
      };

      const url = editingId
        ? `http://localhost:4000/api/v1/admin/email/templates/${editingId}`
        : "http://localhost:4000/api/v1/admin/email/templates";

      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setIsEditorOpen(false);
        fetchTemplates();
      } else {
        alert(json.message || "Failed to save template");
      }
    } catch (err: any) {
      alert(err.message || "Error saving template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailModal || !testEmailRecipient.trim()) return;

    try {
      setIsSendingTest(true);
      setTestSendResult(null);
      const res = await fetch("http://localhost:4000/api/v1/admin/email/test-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: testEmailRecipient.trim(),
          templateKey: testEmailModal.template_key,
          subject: testEmailModal.subject_template,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTestSendResult(`Success: Provider Accepted (ref: ${json.reference}). Dispatched to ${testEmailRecipient.trim()}`);
      } else {
        setTestSendResult(`Error: ${json.message || "Failed to dispatch test email"}`);
      }
    } catch (err: any) {
      setTestSendResult(`Error: ${err.message || "Network error"}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleCopyVariable = (varName: string) => {
    navigator.clipboard.writeText(`{{${varName.trim()}}}`);
    setCopiedVar(varName.trim());
    setTimeout(() => setCopiedVar(null), 1800);
  };

  // Safe Variable interpolation for preview
  const renderInterpolatedBody = (body: string) => {
    return body
      .replace(/{{first_name}}/g, "Vijay")
      .replace(/{{business_name}}/g, "Siri Dental Clinic")
      .replace(/{{city}}/g, "Vijayawada")
      .replace(/{{locality}}/g, "Benz Circle")
      .replace(/{{service_name}}/g, "Dental Cleaning")
      .replace(/{{enquiry_reference}}/g, "ENQ-9081")
      .replace(/{{amount}}/g, "₹2,499");
  };

  // Extract layout and brand items from global branding database
  const layout = globalBranding?.layout || {};
  const activeAppBadges = (globalBranding?.appBadges || []).filter((b: any) => b.is_enabled);
  const activeSocials = (globalBranding?.socialIcons || []).filter((s: any) => s.is_enabled);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Master Email Templates</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
            Dynamic Email Templates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage reusable, responsive HTML transactional & promotional email bodies with merge tags and version control.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates by name, key, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0076D7]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0076D7]"
          >
            <option value="ALL">All Categories</option>
            <option value="TRANSACTIONAL">Transactional</option>
            <option value="ONBOARDING">Onboarding</option>
            <option value="BILLING">Billing & Payments</option>
            <option value="PROMOTIONAL">Promotional</option>
            <option value="SYSTEM">System Alerts</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0076D7]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Templates Records Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700">Template Directory & Merge Schema</div>
          <div className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-800">{templates.length}</strong> of{" "}
            <strong className="text-slate-800">{totalRecords}</strong> template records
          </div>
        </div>

        {loading ? (
          /* Content-aware skeleton loader matching table rows */
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between gap-4 py-3 border-b border-slate-100">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-slate-100 rounded-full w-20"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-8 bg-slate-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No templates match your filters in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Template Name & Key</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Subject Template</th>
                  <th className="px-5 py-3.5">Version</th>
                  <th className="px-5 py-3.5">Lifecycle Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {templates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="font-extrabold text-slate-900 text-sm">{tpl.name}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">{tpl.template_key}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-50 text-[#0076D7] border border-blue-100">
                        {tpl.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-medium text-slate-800 truncate" title={tpl.subject_template}>
                        {tpl.subject_template}
                      </div>
                      {tpl.preheader_text && (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5" title={tpl.preheader_text}>
                          {tpl.preheader_text}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 font-mono text-xs">
                      <button
                        onClick={() => setVersionHistoryModal(tpl)}
                        className="text-[#0076D7] font-bold hover:underline flex items-center gap-1"
                        title="View Version History & Rollback"
                      >
                        <span>{tpl.version || "v1.0"}</span>
                        <RotateCcw className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleTogglePublish(tpl)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition ${
                          tpl.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle Draft / Published"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tpl.status === "PUBLISHED" ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{tpl.status}</span>
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewTemplate(tpl)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition"
                          title="Preview Desktop / Mobile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        <button
                          onClick={() => handleDuplicate(tpl)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-[#0076D7] rounded-lg transition"
                          title="Duplicate Template"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setTestEmailModal(tpl);
                            setTestSendResult(null);
                          }}
                          className="p-1.5 hover:bg-blue-50 text-slate-600 hover:text-[#0076D7] rounded-lg transition"
                          title="Send Authorized Test Email"
                        >
                          <Send className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(tpl)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-[#0076D7] rounded-lg transition"
                          title="Edit Template"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0076D7]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* VERSION HISTORY & ROLLBACK MODAL */}
      {versionHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Version History & Rollback</h3>
                <p className="text-xs text-slate-500">{versionHistoryModal.name}</p>
              </div>
              <button
                onClick={() => setVersionHistoryModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Current: {versionHistoryModal.version || "v1.0"}</div>
                  <div className="text-[10px] text-slate-500">Updated: {new Date(versionHistoryModal.updated_at).toLocaleDateString()}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">Active</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-700">v0.9 (Pre-release)</div>
                  <div className="text-[10px] text-slate-400">Baseline schema initialization</div>
                </div>
                <button
                  onClick={() => handleRollbackVersion(versionHistoryModal, "v0.9")}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#0076D7] hover:bg-white rounded-lg border border-slate-200"
                >
                  Rollback
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setVersionHistoryModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DUAL DESKTOP / MOBILE RESPONSIVE PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Email Template Preview</h3>
                <p className="text-xs text-slate-500">
                  {previewTemplate.name} • {previewTemplate.category} • {previewTemplate.status}
                </p>
              </div>

              {/* Desktop / Mobile Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    previewDevice === "desktop" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    previewDevice === "mobile" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Email Canvas with optimized compact widths */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 md:p-5 flex justify-center">
              <div
                className={`bg-white rounded-2xl shadow-md border border-slate-200 transition-all duration-300 overflow-hidden ${
                  previewDevice === "mobile" ? "w-[300px]" : "w-[440px]"
                }`}
                style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
              >
                {/* Header matching Global Branding */}
                <div 
                  className="p-4 text-center border-b border-slate-100"
                  style={{ backgroundColor: layout.header_bg_color || "#FFFFFF" }}
                >
                  <img
                    src={layout.logo_url || "https://hello-hi.in/logo.png"}
                    alt="Brand Logo"
                    className="h-8 mx-auto object-contain"
                    onError={(e) => {
                      (e.target as any).src = "https://placehold.co/140x44/0076D7/ffffff?text=HELLO";
                    }}
                  />
                  <div className="text-[10px] text-slate-400 mt-1 font-semibold tracking-wide uppercase">
                    {layout.header_tagline || "Discover Local. Connect Instantly."}
                  </div>
                </div>

                {/* Email Body with dynamic variable interpolation & background */}
                <div 
                  className="p-4 space-y-3"
                  style={{ backgroundColor: layout.body_bg_color || "#F8FAFC" }}
                >
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5">
                    <div className="text-sm font-extrabold text-[#0B1220]">
                      {previewTemplate.heading_text || "Welcome to HELLO"}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      {previewTemplate.greeting_text || "Hello,"}
                    </div>
                    <div
                      className="text-xs text-slate-700 leading-relaxed space-y-1.5"
                      dangerouslySetInnerHTML={{
                        __html: renderInterpolatedBody(previewTemplate.body_html),
                      }}
                    />

                    {previewTemplate.cta_label && (
                      <div className="pt-2 text-center">
                        <a
                          href={previewTemplate.cta_url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block px-5 py-2 text-white text-xs font-bold rounded-xl shadow-xs"
                          style={{ backgroundColor: layout.cta_button_bg || "#0076D7" }}
                        >
                          {previewTemplate.cta_label}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Footer matching Global Branding & Layouts */}
                <div 
                  className="p-5 text-center space-y-4"
                  style={{ 
                    backgroundColor: layout.footer_bg_color || "#0B1220",
                    color: layout.footer_text_color || "#94A3B8" 
                  }}
                >
                  {/* Brand Summary */}
                  <div className="space-y-1">
                    <div className="font-extrabold text-sm text-white tracking-tight">HELLO</div>
                    <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                      {layout.header_tagline || "Discover Local. Connect Instantly."}
                    </div>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed pt-0.5">
                      {layout.footer_about_text || "HELLO connects millions of consumers with verified local businesses across Andhra Pradesh."}
                    </p>
                  </div>

                  {/* Section B: App Store Badges */}
                  {activeAppBadges.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                        Get the HELLO App
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {activeAppBadges.map((badge: any) => (
                          <div
                            key={badge.id}
                            className="h-8 px-2.5 rounded-lg border border-slate-700 bg-slate-800/90 flex items-center gap-2"
                          >
                            {badge.platform === "GOOGLE_PLAY" ? (
                              <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.609 1.814L13.793 12 3.61 22.186a1.996 1.996 0 0 1-.61-.994V2.808c.15-.38.375-.72.609-.994zM15.207 13.414l2.293 2.293-11.891 6.862 9.598-9.155zm0-2.828L5.609 1.431 17.5 8.293l-2.293 2.293zm1.414 1.414l3.195 1.844c.943.545.943 1.434 0 1.979l-3.195 1.844-2.121-2.121 2.121-5.546z"/>
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 text-slate-200" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.69-1.13 1.83-1.01 2.92 1.07.08 2.16-.52 2.82-1.32z"/>
                              </svg>
                            )}
                            <span className="text-[10px] font-bold text-white tracking-tight">
                              {badge.display_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section C: Social Media Icons */}
                  {activeSocials.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Connect with us
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {activeSocials.map((soc: any) => (
                          <span
                            key={soc.id}
                            className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800/90 text-[10px] font-medium text-slate-300 border border-slate-700"
                          >
                            {soc.display_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Support & Legal Links */}
                  <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 space-y-1">
                    <div className="flex items-center justify-center gap-2 font-semibold text-slate-400">
                      <a href="#" className="hover:underline">Support</a>
                      <span>•</span>
                      <a href="#" className="hover:underline">Privacy Policy</a>
                      <span>•</span>
                      <a href="#" className="hover:underline">Terms & Conditions</a>
                    </div>
                    <div>{layout.copyright_text || "© 2026 HELLO. All rights reserved."}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEST SEND MODAL */}
      {testEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Send Authorized Test Email</h3>
                <p className="text-xs text-slate-500">{testEmailModal.name}</p>
              </div>
              <button
                onClick={() => setTestEmailModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Test Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin.qa@hello-hi.in"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              {testSendResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    testSendResult.startsWith("Success")
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border border-rose-200 text-rose-800"
                  }`}
                >
                  {testSendResult}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestEmailModal(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingTest ? "Sending..." : "Dispatch Test"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT TEMPLATE MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {editingId ? "Edit Email Template" : "Create New Email Template"}
                </h3>
                <p className="text-xs text-slate-500">Configure subject, HTML content, and variables.</p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Template Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Merchant Welcome"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Template Key</label>
                  <input
                    type="text"
                    placeholder="MERCHANT_WELCOME"
                    value={formTemplateKey}
                    onChange={(e) => setFormTemplateKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="TRANSACTIONAL">Transactional</option>
                    <option value="ONBOARDING">Onboarding</option>
                    <option value="BILLING">Billing & Payments</option>
                    <option value="PROMOTIONAL">Promotional</option>
                    <option value="SYSTEM">System Alerts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Subject Line <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Welcome to HELLO, {{first_name}}!"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preheader Snippet</label>
                <input
                  type="text"
                  placeholder="Preview text shown in inbox snippet..."
                  value={formPreheader}
                  onChange={(e) => setFormPreheader(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heading Title</label>
                  <input
                    type="text"
                    placeholder="Welcome to HELLO"
                    value={formHeading}
                    onChange={(e) => setFormHeading(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salutation / Greeting</label>
                  <input
                    type="text"
                    placeholder="Hello {{first_name}},"
                    value={formGreeting}
                    onChange={(e) => setFormGreeting(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  HTML Body Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Button Label</label>
                  <input
                    type="text"
                    placeholder="e.g. View My Dashboard"
                    value={formCtaLabel}
                    onChange={(e) => setFormCtaLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Destination URL</label>
                  <input
                    type="text"
                    placeholder="https://hello-hi.in/dashboard"
                    value={formCtaUrl}
                    onChange={(e) => setFormCtaUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lifecycle Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="PUBLISHED">Published (Available for automated triggers)</option>
                  <option value="DRAFT">Draft (Under review)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
