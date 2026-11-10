import React from "react";
import { Check, ShieldCheck } from "lucide-react";

export interface PlanData {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_interval: string;
  features: string[];
  status: string;
  audience: "CUSTOMER" | "BUSINESS";
  is_popular: boolean;
  annual_price?: number;
  display_order: number;
  button_text?: string;
}

interface PlanCardProps {
  plan: PlanData;
  billingCycle: "MONTHLY" | "YEARLY";
  onSelect: (plan: PlanData) => void;
  isLoading?: boolean;
}

export function PlanCard({ plan, billingCycle, onSelect, isLoading }: PlanCardProps) {
  const isBusiness = plan.audience === "BUSINESS";
  const isPopular = plan.is_popular;
  
  // Calculate displayed price
  let displayPrice = plan.price;
  let periodLabel = "/month";
  let yearlyBadge = null;

  if (isBusiness) {
    if (billingCycle === "YEARLY" && plan.annual_price && plan.annual_price > 0) {
      displayPrice = Math.round(plan.annual_price / 12);
      periodLabel = "/month";
    }
    if (plan.annual_price && plan.annual_price > 0 && plan.price > 0) {
      const fullAnnual = plan.price * 12;
      const savingsPercent = Math.max(0, Math.round(((fullAnnual - plan.annual_price) / fullAnnual) * 100));
      yearlyBadge = (
        <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md mt-1">
          ₹{plan.annual_price.toLocaleString("en-IN")}/year{" "}
          {savingsPercent > 0 && (
            <span className="text-amber-600 font-bold">(Save {savingsPercent}%)</span>
          )}
        </span>
      );
    }
  }

  const defaultBtnText = plan.button_text || (plan.price === 0 ? "Get Started" : `Choose ${plan.name}`);

  return (
    <div
      className={`relative rounded-2xl transition-all duration-200 flex flex-col justify-between ${
        isPopular
          ? "border-2 border-[#FF6B35] bg-white shadow-xl shadow-orange-500/10 ring-1 ring-[#FF6B35]/20 -translate-y-1.5 md:-translate-y-2 z-10"
          : "border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300"
      }`}
    >
      {/* Most Popular Top Ribbon Badge */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1">
          <span>👑</span> Most Popular
        </div>
      )}

      {/* Card Header Content */}
      <div className="p-6 md:p-7">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{plan.name}</h3>
        <p className="text-xs text-slate-500 mt-1 min-h-[32px] leading-relaxed">{plan.description}</p>

        {/* Pricing Area */}
        <div className="mt-5 pb-5 border-b border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-semibold text-slate-500">{periodLabel}</span>
          </div>
          {yearlyBadge && <div className="mt-1">{yearlyBadge}</div>}
        </div>

        {/* Features List */}
        <div className="mt-5 space-y-3">
          {plan.features.map((feature, idx) => {
            const isVerifiedFeature = feature.toLowerCase().includes("verified business badge");
            return (
              <div key={idx} className="flex items-start gap-2.5">
                <div
                  className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                    isPopular ? "bg-orange-100 text-[#FF6B35]" : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs font-medium text-slate-700 leading-snug flex items-center gap-1.5">
                  {feature}
                  {isVerifiedFeature && (
                    <span className="inline-flex items-center text-blue-600" title="Independent Super Admin KYC Required">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Button Bottom */}
      <div className="p-6 md:p-7 pt-2">
        <button
          type="button"
          onClick={() => onSelect(plan)}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
            isPopular
              ? "bg-[#FF6B35] hover:bg-[#e85a25] text-white shadow-orange-500/25 hover:shadow-orange-500/35"
              : "bg-slate-900 hover:bg-slate-800 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {defaultBtnText}
        </button>
      </div>
    </div>
  );
}

