"use client";

import React, { useState } from "react";
import { Check, X, Shield, AlertTriangle, Info, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { BenefitDefinition, SubscriptionPlan } from "./types";

interface PlanWizardProps {
  initialPlan?: SubscriptionPlan | null;
  benefitsLibrary: BenefitDefinition[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function PlanWizardModal({
  initialPlan,
  benefitsLibrary,
  onClose,
  onSuccess,
}: PlanWizardProps) {
  const isEditing = Boolean(initialPlan);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1: Details
  const [details, setDetails] = useState({
    name: initialPlan?.name || "",
    plan_code: initialPlan?.id || "plan_" + Date.now().toString().slice(-6),
    description: initialPlan?.description || "",
    category: "MERCHANT_TIER",
    audience: "BUSINESS",
    status: initialPlan?.status || "DRAFT",
    is_popular: initialPlan?.id === "plan_growth",
  });

  // Step 2: Pricing & Eligibility
  const [pricing, setPricing] = useState({
    price: initialPlan?.price ?? 999,
    currency: initialPlan?.currency || "INR",
    billing_interval: initialPlan?.billing_interval || "MONTHLY",
    trial_days: 0,
    min_commitment_months: 1,
  });

  // Step 3: Benefits Configuration
  const [selectedBenefits, setSelectedBenefits] = useState<
    Array<{
      benefit_id: string;
      assigned_value: any;
      display_order: number;
      is_visible: number;
      is_highlighted: number;
    }>
  >([]);

  // Step 3 state: add benefit selector
  const [benefitToAdd, setBenefitToAdd] = useState("");

  // Initialize benefits if editing
  React.useEffect(() => {
    if (initialPlan) {
      // Fetch plan details to populate existing benefits
      fetch(`http://localhost:4000/api/v1/admin/subscriptions/plans/${initialPlan.id}/details`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data?.benefits) {
            setSelectedBenefits(
              json.data.benefits.map((b: any, idx: number) => ({
                benefit_id: b.benefit_id,
                assigned_value: b.assigned_value,
                display_order: b.display_order ?? idx + 1,
                is_visible: b.is_visible ?? 1,
                is_highlighted: b.is_highlighted ?? 0,
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [initialPlan]);

  const handleAddBenefit = () => {
    if (!benefitToAdd) return;
    const def = benefitsLibrary.find((b) => b.id === benefitToAdd);
    if (!def) return;
    if (selectedBenefits.some((b) => b.benefit_id === def.id)) {
      alert("This benefit is already assigned to the plan.");
      return;
    }

    let defaultVal: any = true;
    if (def.data_type === "INTEGER" || def.data_type === "QUOTA") {
      defaultVal = def.default_value ? Number(def.default_value) : 10;
    } else if (def.data_type === "BOOLEAN") {
      defaultVal = true;
    } else if (def.data_type === "ENUM") {
      const allowed = Array.isArray(def.allowed_values)
        ? def.allowed_values
        : typeof def.allowed_values === "string"
        ? JSON.parse(def.allowed_values || "[]")
        : [];
      defaultVal = allowed[0] || "STANDARD";
    }

    setSelectedBenefits((prev) => [
      ...prev,
      {
        benefit_id: def.id,
        assigned_value: defaultVal,
        display_order: prev.length + 1,
        is_visible: 1,
        is_highlighted: 0,
      },
    ]);
    setBenefitToAdd("");
  };

  const handleRemoveBenefit = (benefitId: string) => {
    setSelectedBenefits((prev) => prev.filter((b) => b.benefit_id !== benefitId));
  };

  const handleUpdateBenefitValue = (benefitId: string, val: any) => {
    setSelectedBenefits((prev) =>
      prev.map((b) => (b.benefit_id === benefitId ? { ...b, assigned_value: val } : b))
    );
  };

  const handleSaveDraft = async () => {
    await submitPlan(false);
  };

  const handlePublish = async () => {
    await submitPlan(true);
  };

  const submitPlan = async (andPublish: boolean) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Prepare legacy features array snapshot from benefits
      const legacyFeatures: string[] = selectedBenefits.map((sb) => {
        const def = benefitsLibrary.find((b) => b.id === sb.benefit_id);
        const name = def?.name || sb.benefit_id;
        if (def?.data_type === "BOOLEAN") return name;
        return `${name}: ${sb.assigned_value} ${def?.unit || ""}`.trim();
      });

      const planPayload = {
        name: details.name.trim(),
        description: details.description.trim(),
        price: Number(pricing.price) || 0,
        currency: pricing.currency,
        billing_interval: pricing.billing_interval,
        features: legacyFeatures.length > 0 ? legacyFeatures : ["Standard Merchant Access"],
        status: andPublish ? "ACTIVE" : isEditing ? details.status : "DRAFT",
      };

      const url = isEditing
        ? `http://localhost:4000/api/v1/admin/subscriptions/plans/${initialPlan!.id}`
        : "http://localhost:4000/api/v1/admin/subscriptions/plans";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planPayload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save plan details");
      }

      const planId = isEditing ? initialPlan!.id : json.data?.id || details.plan_code;

      // 2. Assign dynamic benefits
      if (selectedBenefits.length > 0 && planId) {
        const assignRes = await fetch(
          `http://localhost:4000/api/v1/admin/subscriptions/plans/${planId}/benefits`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ benefits: selectedBenefits }),
          }
        );
        const assignJson = await assignRes.json();
        if (!assignRes.ok || !assignJson.success) {
          throw new Error(assignJson.message || "Failed to link benefits to plan");
        }
      }

      // 3. Publish if requested
      if (andPublish && planId) {
        const pubRes = await fetch(
          `http://localhost:4000/api/v1/admin/subscriptions/plans/${planId}/publish`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              change_summary: isEditing ? "Published revised plan version" : "First publication",
            }),
          }
        );
        const pubJson = await pubRes.json();
        if (!pubRes.ok || !pubJson.success) {
          throw new Error(pubJson.message || "Plan saved but publish validation failed");
        }
      }

      onSuccess(
        andPublish
          ? `Plan '${details.name}' successfully published as active version!`
          : `Plan '${details.name}' saved as draft!`
      );
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Wizard Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {isEditing ? `Edit Plan — ${initialPlan?.name}` : "Create Subscription Plan"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              4-Step Guided Configuration: Details &rarr; Pricing &rarr; Benefits &rarr; Review
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 border-b border-slate-100 text-xs font-semibold">
          {[
            { step: 1, label: "1. Details" },
            { step: 2, label: "2. Pricing" },
            { step: 3, label: "3. Benefits" },
            { step: 4, label: "4. Review" },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className={`py-3 px-2 text-center transition border-b-2 flex items-center justify-center gap-1.5 ${
                currentStep === s.step
                  ? "border-[#0076D7] text-[#0076D7] bg-blue-50/40"
                  : currentStep > s.step
                  ? "border-emerald-500 text-emerald-700 bg-emerald-50/20"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <span>{s.label}</span>
              {currentStep > s.step && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>

        {/* Wizard Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-xs font-medium">{errorMsg}</div>
            </div>
          )}

          {/* STEP 1: Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Plan Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    placeholder="e.g. Growth Merchant Pro"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0076D7] outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Unique Plan Code
                  </label>
                  <input
                    type="text"
                    disabled={isEditing}
                    value={details.plan_code}
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        plan_code: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                      })
                    }
                    placeholder="e.g. plan_growth"
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Permanent system identifier for API and billing bindings.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Plan Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={details.description}
                  onChange={(e) => setDetails({ ...details, description: e.target.value })}
                  placeholder="Describe target merchant tier, typical outlet size, and expected benefits..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-[#0076D7] outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Target Audience</label>
                  <select
                    value={details.audience}
                    onChange={(e) => setDetails({ ...details, audience: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="BUSINESS">Business / Merchants</option>
                    <option value="PROFESSIONAL">Independent Doctors / Pros</option>
                    <option value="ENTERPRISE">Multi-Outlet Enterprises</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Initial Status</label>
                  <select
                    value={details.status}
                    onChange={(e) => setDetails({ ...details, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Badge Highlight</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={details.is_popular}
                      onChange={(e) => setDetails({ ...details, is_popular: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-[#0076D7] focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-700">Display "Popular" Tag</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Pricing & Eligibility */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Price in INR (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={pricing.price}
                      onChange={(e) => setPricing({ ...pricing, price: Number(e.target.value) })}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:border-[#0076D7] outline-none transition"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Gross rate before GST (GST handling follows central tax settings).
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Billing Interval <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={pricing.billing_interval}
                    onChange={(e) => setPricing({ ...pricing, billing_interval: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="MONTHLY">Monthly (30 days)</option>
                    <option value="QUARTERLY">Quarterly (90 days)</option>
                    <option value="ANNUAL">Annual (365 days)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-900 flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Subscriber Protection Policy:</strong> Changing the price will not alter the contracted billing amount of the 8 currently active subscribers. Price updates will only apply upon renewal or to new merchants.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Benefits Configuration */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex-1">
                  <select
                    value={benefitToAdd}
                    onChange={(e) => setBenefitToAdd(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-xs focus:border-[#0076D7] outline-none cursor-pointer"
                  >
                    <option value="">Select a benefit from Library to attach...</option>
                    {benefitsLibrary.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.data_type} · {b.enforcement_status})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  disabled={!benefitToAdd}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0076D7] hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Benefit</span>
                </button>
              </div>

              {selectedBenefits.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No dynamic benefits attached yet</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Select a reusable capability from the library dropdown above to configure its limits.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedBenefits.map((sb, idx) => {
                    const def = benefitsLibrary.find((b) => b.id === sb.benefit_id);
                    const isEnforced = def?.enforcement_status === "ENFORCED";
                    const isUnverified = def?.enforcement_status === "UNVERIFIED";

                    return (
                      <div
                        key={sb.benefit_id}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{def?.name || sb.benefit_id}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isEnforced
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : isUnverified
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {def?.enforcement_status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {def?.benefit_key} · {def?.data_type}
                          </p>
                        </div>

                        {/* Value Input */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-500">Value:</span>
                            {def?.data_type === "BOOLEAN" ? (
                              <input
                                type="checkbox"
                                checked={Boolean(sb.assigned_value === true || sb.assigned_value === "true")}
                                onChange={(e) =>
                                  handleUpdateBenefitValue(sb.benefit_id, e.target.checked)
                                }
                                className="w-4 h-4 rounded border-slate-300 text-[#0076D7] focus:ring-blue-500"
                              />
                            ) : def?.data_type === "ENUM" ? (
                              <select
                                value={String(sb.assigned_value)}
                                onChange={(e) =>
                                  handleUpdateBenefitValue(sb.benefit_id, e.target.value)
                                }
                                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                              >
                                {(() => {
                                  const allowed = Array.isArray(def.allowed_values)
                                    ? def.allowed_values
                                    : typeof def.allowed_values === "string"
                                    ? JSON.parse(def.allowed_values || "[]")
                                    : [];
                                  return allowed.map((v: string) => (
                                    <option key={v} value={v}>
                                      {v}
                                    </option>
                                  ));
                                })()}
                              </select>
                            ) : (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min={def?.min_value ?? 0}
                                  max={def?.max_value ?? 999999}
                                  value={sb.assigned_value}
                                  onChange={(e) =>
                                    handleUpdateBenefitValue(sb.benefit_id, Number(e.target.value))
                                  }
                                  className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-center text-xs"
                                />
                                {def?.unit && (
                                  <span className="text-[10px] text-slate-400 font-medium">{def.unit}</span>
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(sb.benefit_id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Remove Benefit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Review & Publish */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{details.name || "Untitled Plan"}</h3>
                    <p className="text-[11px] font-mono text-slate-500">{details.plan_code}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-slate-900">
                      ₹{pricing.price.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      /{pricing.billing_interval.toLowerCase()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 border-t border-slate-200 pt-2.5">
                  {details.description || "No description provided."}
                </p>
              </div>

              {/* Benefits summary */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Attached Benefits ({selectedBenefits.length})</h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {selectedBenefits.map((sb) => {
                    const def = benefitsLibrary.find((b) => b.id === sb.benefit_id);
                    return (
                      <div key={sb.benefit_id} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-slate-800">{def?.name}</span>
                          <span className="text-[10px] text-slate-400">({def?.enforcement_status})</span>
                        </div>
                        <div className="font-bold text-slate-900">
                          {String(sb.assigned_value)} {def?.unit || ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedBenefits.some((sb) => {
                const def = benefitsLibrary.find((b) => b.id === sb.benefit_id);
                return def?.enforcement_status === "UNVERIFIED";
              }) && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong>Notice:</strong> One or more attached benefits have an <em>UNVERIFIED</em> enforcement status in the backend registry. They will be displayed accurately with notice tags and will not be advertised as guaranteed operational handlers until backend service testing is confirmed.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting || !details.name.trim()}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Draft"}
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={currentStep === 1 && !details.name.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0076D7] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 shadow-xs"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting || !details.name.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? "Publishing..." : "Publish Plan"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
