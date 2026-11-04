"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  FileText,
} from "lucide-react";

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template_id?: string;
  target_audience: string;
  target_city: string;
  scheduled_at?: string;
  status: string;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  created_at: string;
}

interface TemplateOption {
  id: string;
  name: string;
}

export function EmailCampaignsModule() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formTemplateId, setFormTemplateId] = useState("");
  const [formAudience, setFormAudience] = useState("ALL");
  const [formCity, setFormCity] = useState("All");
  const [formScheduledAt, setFormScheduledAt] = useState("");
  const [formStatus, setFormStatus] = useState("DRAFT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campRes, tplRes] = await Promise.all([
        fetch("http://localhost:4000/api/v1/admin/email/campaigns"),
        fetch("http://localhost:4000/api/v1/admin/email/templates"),
      ]);
      const campJson = await campRes.json();
      const tplJson = await tplRes.json();

      if (campJson.success && Array.isArray(campJson.data)) {
        setCampaigns(campJson.data);
      }
      if (tplJson.success && Array.isArray(tplJson.data)) {
        setTemplates(tplJson.data);
        if (tplJson.data.length > 0 && !formTemplateId) {
          setFormTemplateId(tplJson.data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSubject.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/email/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          subject: formSubject.trim(),
          template_id: formTemplateId,
          target_audience: formAudience,
          target_city: formCity,
          scheduled_at: formScheduledAt || null,
          status: formStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsCreateOpen(false);
        setFormName("");
        setFormSubject("");
        setFormScheduledAt("");
        fetchData();
      } else {
        alert(json.message || "Failed to create campaign");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            <span>Outbound Marketing Broadcasts</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
            Email Campaigns
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Schedule promotional newsletters and targeted email announcements across Andhra Pradesh customers and merchants.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Email Campaign</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns by name or subject line..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0076D7]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0076D7]"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="SENDING">Sending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading campaigns...</div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No campaigns match your query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Campaign Name</th>
                  <th className="px-5 py-3.5">Audience & City</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Recipients</th>
                  <th className="px-5 py-3.5">Delivered</th>
                  <th className="px-5 py-3.5">Schedule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="font-extrabold text-slate-900 text-sm">{camp.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{camp.subject}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{camp.target_audience}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{camp.target_city}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                          camp.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : camp.status === "SCHEDULED"
                            ? "bg-blue-50 text-[#0076D7] border border-blue-200"
                            : camp.status === "SENDING"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-800">
                      {camp.total_recipients.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-emerald-600">
                        {camp.delivered_count.toLocaleString()}
                      </div>
                      {camp.failed_count > 0 && (
                        <div className="text-[10px] text-rose-500 font-medium">
                          {camp.failed_count} failed
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {camp.scheduled_at ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(camp.scheduled_at).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Immediate / Draft</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE CAMPAIGN MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Create Promotional Email Campaign</h3>
                <p className="text-xs text-slate-500">Target segments across Andhra Pradesh user groups.</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Campaign Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sankranti Home Services 2026 Blast"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Subject Line <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Festive Discounts on Local Home Services!"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Email Template</label>
                <select
                  value={formTemplateId}
                  onChange={(e) => setFormTemplateId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                  {templates.length === 0 && <option value="">No templates available</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formAudience}
                    onChange={(e) => setFormAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="ALL">All Registered Users</option>
                    <option value="CUSTOMERS">Customers Only</option>
                    <option value="MERCHANTS">Merchants Only</option>
                    <option value="SUBSCRIBERS">Active Subscribers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target City</label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="All">All Cities</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Schedule Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formScheduledAt}
                    onChange={(e) => setFormScheduledAt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="DRAFT">Save as Draft</option>
                    <option value="SCHEDULED">Schedule for Broadcast</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

