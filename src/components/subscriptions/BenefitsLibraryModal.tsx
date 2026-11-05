"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Check,
  Info,
  Layers,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { BenefitDefinition, BackendCapability } from "./types";
import { StatusBadge } from "@/components/shared/StateComponents";

interface BenefitsLibraryProps {
  benefits: BenefitDefinition[];
  capabilities: BackendCapability[];
  onRefresh: () => void;
  onSuccess: (msg: string) => void;
}

export function BenefitsLibraryModal({
  benefits,
  capabilities,
  onRefresh,
  onSuccess,
}: BenefitsLibraryProps) {
  const [editingBenefit, setEditingBenefit] = useState<BenefitDefinition | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    benefit_key: "",
    name: "",
    description: "",
    category: "LISTING_CAPACITY",
    data_type: "INTEGER" as BenefitDefinition["data_type"],
    unit: "",
    default_value: "1",
    min_value: 0,
    max_value: 1000,
    allowed_values: "STANDARD, PRIORITY, EXCLUSIVE",
    reset_period: "MONTHLY",
    capability_binding: "",
    enforcement_status: "DISPLAY_ONLY" as BenefitDefinition["enforcement_status"],
  });

  const handleOpenCreate = () => {
    setEditingBenefit(null);
    setForm({
      benefit_key: "",
      name: "",
      description: "",
      category: "LISTING_CAPACITY",
      data_type: "INTEGER",
      unit: "listings",
      default_value: "5",
      min_value: 1,
      max_value: 1000,
      allowed_values: "",
      reset_period: "MONTHLY",
      capability_binding: "",
      enforcement_status: "DISPLAY_ONLY",
    });
    setIsFormOpen(true);
    setErrorMsg(null);
  };

  const handleOpenEdit = (b: BenefitDefinition) => {
    setEditingBenefit(b);
    let allowedStr = "";
    if (Array.isArray(b.allowed_values)) {
      allowedStr = b.allowed_values.join(", ");
    } else if (typeof b.allowed_values === "string") {
      try {
        const parsed = JSON.parse(b.allowed_values);
        allowedStr = Array.isArray(parsed) ? parsed.join(", ") : b.allowed_values;
      } catch {
        allowedStr = b.allowed_values;
      }
    }

    setForm({
      benefit_key: b.benefit_key,
      name: b.name,
      description: b.description || "",
      category: b.category || "LISTING_CAPACITY",
      data_type: b.data_type,
      unit: b.unit || "",
      default_value: b.default_value || "",
      min_value: b.min_value ?? 0,
      max_value: b.max_value ?? 1000,
      allowed_values: allowedStr,
      reset_period: b.reset_period || "MONTHLY",
      capability_binding: b.capability_binding || "",
      enforcement_status: b.enforcement_status,
    });
    setIsFormOpen(true);
    setErrorMsg(null);
  };

  const handleCapabilityChange = (capKey: string) => {
    const cap = capabilities.find((c) => c.capability_key === capKey);
    if (cap) {
      setForm((prev) => ({
        ...prev,
        capability_binding: capKey,
        enforcement_status: cap.enforcement_status,
        data_type: (cap.data_type as any) || prev.data_type,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        capability_binding: "",
        enforcement_status: "DISPLAY_ONLY",
      }));
    }
  };

  const handleSaveBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.benefit_key.trim()) {
      setErrorMsg("Benefit name and key are required.");
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const allowedArray = form.allowed_values
      ? form.allowed_values.split(",").map((s) => s.trim()).filter(Boolean)
      : null;

    const payload = {
      benefit_key: form.benefit_key.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      data_type: form.data_type,
      unit: form.unit.trim() || null,
      default_value: form.default_value || null,
      min_value: form.data_type === "INTEGER" || form.data_type === "QUOTA" ? Number(form.min_value) : null,
      max_value: form.data_type === "INTEGER" || form.data_type === "QUOTA" ? Number(form.max_value) : null,
      allowed_values: allowedArray,
      reset_period: form.data_type === "QUOTA" ? form.reset_period : null,
      capability_binding: form.capability_binding || null,
      enforcement_status: form.enforcement_status,
    };

    try {
      const url = editingBenefit
        ? `http://localhost:4000/api/v1/admin/subscriptions/benefits/${editingBenefit.id}`
        : "http://localhost:4000/api/v1/admin/subscriptions/benefits";
      const method = editingBenefit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save benefit definition");
      }

      onSuccess(
        editingBenefit
          ? `Benefit '${form.name}' updated successfully!`
          : `Benefit '${form.name}' created in library!`
      );
      setIsFormOpen(false);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save benefit");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Reusable Benefits Library
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strictly validated, reusable capabilities with backend enforcement bindings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0076D7] hover:bg-blue-700 rounded-xl transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Benefit</span>
        </button>
      </div>

      {/* Benefits Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Benefit Name &amp; Key</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Enforcement Level</th>
                <th className="py-3 px-4">Backend Capability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {benefits.map((b) => {
                const isEnforced = b.enforcement_status === "ENFORCED";
                const isUnverified = b.enforcement_status === "UNVERIFIED";
                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{b.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{b.benefit_key}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {b.data_type}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {b.category?.replace(/_/g, " ")}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isEnforced
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isUnverified
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {isEnforced && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isUnverified && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        <span>{b.enforcement_status}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] font-mono text-slate-500">
                      {b.capability_binding || (
                        <span className="text-slate-400 italic font-sans">No backend binding</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(b)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">
                {editingBenefit ? `Edit Benefit — ${editingBenefit.name}` : "Create Reusable Benefit"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBenefit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs font-medium">{errorMsg}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Instant Leads Quota"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Unique Key <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.benefit_key}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        benefit_key: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                      })
                    }
                    placeholder="e.g. enquiry.monthly_quota"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed explanation of how this benefit behaves and delivers value..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  >
                    <option value="LISTING_CAPACITY">Listing Capacity</option>
                    <option value="LEADS_AND_ENQUIRIES">Leads &amp; Enquiries</option>
                    <option value="DISCOVERY_BOOST">Discovery Boost</option>
                    <option value="TRUST_AND_VERIFICATION">Trust &amp; Verification</option>
                    <option value="SUPPORT_SLA">Support SLA</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Data Type</label>
                  <select
                    value={form.data_type}
                    onChange={(e) => setForm({ ...form, data_type: e.target.value as any })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  >
                    <option value="INTEGER">Integer Limit</option>
                    <option value="BOOLEAN">Boolean Toggle</option>
                    <option value="QUOTA">Quota (Periodic)</option>
                    <option value="ENUM">Enum Options</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Unit Label</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="e.g. leads / mo"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Backend Capability Binding */}
              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-2">
                <label className="block font-bold text-slate-800">
                  Backend Capability Binding (Optional)
                </label>
                <select
                  value={form.capability_binding}
                  onChange={(e) => handleCapabilityChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:border-[#0076D7] outline-none"
                >
                  <option value="">No Backend Capability (DISPLAY_ONLY)</option>
                  {capabilities.map((c) => (
                    <option key={c.capability_key} value={c.capability_key}>
                      {c.name} ({c.enforcement_status} · Handler: {c.enforcement_handler || "None"})
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
                  <span>Enforcement Status:</span>
                  <span className="font-bold text-slate-900">{form.enforcement_status}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white font-bold rounded-xl text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0076D7] hover:bg-blue-700 disabled:opacity-50 font-bold text-white rounded-xl transition shadow-xs"
                >
                  {isSaving ? "Saving..." : "Save Benefit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

