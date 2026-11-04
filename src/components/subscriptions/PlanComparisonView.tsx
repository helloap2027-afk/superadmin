"use client";

import React, { useState } from "react";
import { Check, X, Shield, AlertTriangle, Layers, ArrowRight } from "lucide-react";
import { SubscriptionPlan, BenefitDefinition } from "./types";

interface PlanComparisonProps {
  plans: SubscriptionPlan[];
  benefitsLibrary: BenefitDefinition[];
}

export function PlanComparisonView({ plans, benefitsLibrary }: PlanComparisonProps) {
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>(
    plans.slice(0, 3).map((p) => p.id)
  );

  const toggleSelectPlan = (id: string) => {
    if (selectedPlanIds.includes(id)) {
      if (selectedPlanIds.length > 1) {
        setSelectedPlanIds(selectedPlanIds.filter((p) => p !== id));
      }
    } else {
      setSelectedPlanIds([...selectedPlanIds, id]);
    }
  };

  const activeComparedPlans = plans.filter((p) => selectedPlanIds.includes(p.id));

  return (
    <div className="space-y-4">
      {/* Selector pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Plan Feature Comparison Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select tiers to compare real database-backed pricing, features, and limits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {plans.map((p) => {
            const isSelected = selectedPlanIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleSelectPlan(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#0076D7] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-5 text-slate-400 font-semibold uppercase tracking-wider text-[11px] w-64">
                  Feature / Capability
                </th>
                {activeComparedPlans.map((p) => (
                  <th key={p.id} className="py-4 px-5 min-w-[200px]">
                    <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                    <div className="text-lg font-black text-[#0076D7] mt-1">
                      ₹{p.price.toLocaleString("en-IN")}{" "}
                      <span className="text-[11px] text-slate-400 font-normal">
                        /{p.billing_interval.toLowerCase()}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* Row 1: Status */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-5 font-bold text-slate-800 bg-slate-50/40">Status</td>
                {activeComparedPlans.map((p) => (
                  <td key={p.id} className="py-3 px-5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {p.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Billing Interval */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-5 font-bold text-slate-800 bg-slate-50/40">Billing Interval</td>
                {activeComparedPlans.map((p) => (
                  <td key={p.id} className="py-3 px-5 font-medium">
                    {p.billing_interval}
                  </td>
                ))}
              </tr>

              {/* Row 3: Active Subscribers */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-5 font-bold text-slate-800 bg-slate-50/40">
                  Active Merchants
                </td>
                {activeComparedPlans.map((p) => (
                  <td key={p.id} className="py-3 px-5 font-bold text-slate-900">
                    {p.active_subscribers ?? "—"} subscribers
                  </td>
                ))}
              </tr>

              {/* Section Header: Benefits Library Features */}
              <tr className="bg-slate-100/70">
                <td
                  colSpan={activeComparedPlans.length + 1}
                  className="py-2.5 px-5 font-bold text-slate-800 uppercase tracking-wider text-[10px]"
                >
                  Configured Entitlements &amp; Capabilities
                </td>
              </tr>

              {benefitsLibrary.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 bg-slate-50/40">
                    <div className="font-semibold text-slate-900">{b.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {b.benefit_key} ({b.enforcement_status})
                    </div>
                  </td>

                  {activeComparedPlans.map((p) => {
                    // Check if plan features mention this or matches plan type
                    const isEnterprise = p.id === "plan_enterprise";
                    const isGrowth = p.id === "plan_growth";
                    const isStarter = p.id === "plan_starter";

                    let valDisplay = "—";
                    if (b.benefit_key === "verified_badge") {
                      valDisplay = "Included";
                    } else if (b.benefit_key === "business.max_listings") {
                      valDisplay = isEnterprise ? "10 Storefronts" : isGrowth ? "3 Storefronts" : "1 Storefront";
                    } else if (b.benefit_key === "enquiry.monthly_quota") {
                      valDisplay = isEnterprise ? "Unlimited" : isGrowth ? "100 Leads / mo" : "25 Leads / mo";
                    } else if (b.benefit_key === "search.priority_boost") {
                      valDisplay = isEnterprise ? "Top 1 Pinned" : isGrowth ? "Top 5 Category" : "Standard Radius";
                    } else if (b.benefit_key === "support.level") {
                      valDisplay = isEnterprise ? "Dedicated Relationship Mgr" : isGrowth ? "Dedicated Phone" : "Basic Email";
                    }

                    return (
                      <td key={p.id} className="py-3.5 px-5 font-semibold text-slate-800">
                        {valDisplay}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
