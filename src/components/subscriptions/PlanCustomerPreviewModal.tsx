"use client";

import React, { useState } from "react";
import {
  X,
  Smartphone,
  Globe,
  Check,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  Star,
  Info,
} from "lucide-react";
import { SubscriptionPlan, BenefitDefinition } from "./types";

interface PlanCustomerPreviewModalProps {
  plan: SubscriptionPlan;
  benefitsLibrary: BenefitDefinition[];
  onClose: () => void;
}

export function PlanCustomerPreviewModal({
  plan,
  benefitsLibrary,
  onClose,
}: PlanCustomerPreviewModalProps) {
  const [device, setDevice] = useState<"MOBILE" | "WEB">("WEB");
  const isPopular = plan.id === "plan_growth";

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#0076D7]/10 text-[#0076D7] tracking-wider">
                Live Simulation
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Customer-Facing Plan Presentation
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mt-1">
              Preview: {plan.name}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Device Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
              <button
                type="button"
                onClick={() => setDevice("WEB")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  device === "WEB"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#0076D7]" />
                <span>Web Portal</span>
              </button>

              <button
                type="button"
                onClick={() => setDevice("MOBILE")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  device === "MOBILE"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Merchant App</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60 flex items-center justify-center">
          {device === "WEB" ? (
            /* Web View Simulation */
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative overflow-hidden transition-all">
              {isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#0076D7] text-white text-[11px] font-extrabold uppercase tracking-wider py-1 px-8 rotate-45 translate-x-7 translate-y-3 shadow-sm">
                    Popular
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-[#0076D7] uppercase tracking-wider">
                    Merchant Tier
                  </span>
                  <h4 className="text-2xl font-black text-slate-900 mt-1">{plan.name}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="py-4 border-y border-slate-100 flex items-baseline gap-1.5">
                  <span className="text-3.5xl font-black text-slate-900 tracking-tight">
                    ₹{plan.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    /{plan.billing_interval?.toLowerCase()}
                  </span>
                  <span className="ml-auto text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Includes GST invoice
                  </span>
                </div>

                {/* Features & Benefits List */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {Array.isArray(plan.features) &&
                      plan.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-[#0076D7] hover:bg-blue-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <span>Upgrade to {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-center text-slate-400 mt-2 block">
                    Cancel or change tier anytime from the merchant dashboard
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Mobile Device Frame Simulation */
            <div className="w-[340px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 relative">
              {/* Camera Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] mr-3" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
              </div>

              {/* Mobile Screen */}
              <div className="bg-white rounded-[36px] overflow-hidden pt-8 pb-6 px-4 space-y-4">
                <div className="text-center pt-2">
                  <span className="text-[10px] font-bold text-[#0076D7] uppercase tracking-wider">
                    HELLO Partner Pro
                  </span>
                  <h4 className="text-lg font-black text-slate-900 mt-0.5">{plan.name}</h4>
                  <div className="mt-2 flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      /{plan.billing_interval?.toLowerCase()}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center px-2 leading-relaxed">
                  {plan.description}
                </p>

                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Entitlements
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-700">
                    {Array.isArray(plan.features) &&
                      plan.features.slice(0, 5).map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 bg-[#0076D7] text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Select Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

