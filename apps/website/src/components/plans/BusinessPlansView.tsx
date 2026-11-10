import React, { useState } from "react";
import { Store, TrendingUp, ShieldCheck, BarChart3, Rocket, CheckCircle2 } from "lucide-react";
import { BusinessPartnerHeader } from "@/components/vendor/BusinessPartnerHeader";
import { DesktopFooter } from "@/components/DesktopFooter";
import { PartnerPortalSidebar } from "@/components/vendor/PartnerPortalSidebar";
import { PlanCard, PlanData } from "./PlanCard";
import { PlanTrustBar } from "./PlanTrustBar";
import { PlanFaqAccordion, FaqItem } from "./PlanFaqAccordion";

interface BusinessPlansViewProps {
  plans: PlanData[];
  faqs: FaqItem[];
  activeSubscription?: any;
  onSelectPlan: (plan: PlanData, cycle: "MONTHLY" | "YEARLY") => void;
  isLoading?: boolean;
}

export function BusinessPlansView({
  plans,
  faqs,
  activeSubscription,
  onSelectPlan,
  isLoading,
}: BusinessPlansViewProps) {
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* 1. Official Business Partner Header */}
      <BusinessPartnerHeader activeNav="Plans" />

      {/* 2. Main Container with Dynamic Partner Sidebar */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col md:flex-row items-start gap-6">
        <PartnerPortalSidebar activeKey="subscription" />

        <main className="flex-1 min-w-0">
          <div className="relative overflow-hidden bg-gradient-to-b from-[#EBF5FF] via-[#F4F9FD] to-[#F8FAFC] pt-10 pb-16 px-4 sm:px-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="max-w-5xl mx-auto">
              {/* Main Hero Header */}
              <div className="text-center max-w-3xl mx-auto relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Choose a Business Plan That <span className="text-[#FF6B35]">Grows Your Business</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
              Get more enquiries, build a trusted brand, and reach the right customers on HELLO-Hi.
            </p>

            {/* Value Highlights Pill Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                <span className="text-orange-500 font-black">👥</span>
                <span>More Quality Leads</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Verified Business Identity</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                <span>Business Analytics &amp; Insights</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                <Rocket className="w-4 h-4 text-orange-600" />
                <span>Higher Visibility &amp; Growth</span>
              </div>
            </div>

            {/* Monthly / Yearly Billing Toggle with 17% savings badge */}
            <div className="mt-8 inline-flex items-center gap-2 p-1 bg-slate-200/80 rounded-full border border-slate-300/70">
              <button
                type="button"
                onClick={() => setBillingCycle("MONTHLY")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  billingCycle === "MONTHLY"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("YEARLY")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === "YEARLY"
                    ? "bg-[#FF6B35] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full font-black">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* 3. Three Pricing Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                onSelect={(p) => onSelectPlan(p, billingCycle)}
                isLoading={isLoading}
              />
            ))}
          </div>

          {/* 4. Trust Bar */}
          <PlanTrustBar audience="BUSINESS" />

          {/* 5. FAQs Accordion */}
          <PlanFaqAccordion
            faqs={faqs}
            title="Frequently Asked Questions"
            subtitle="Quick answers to common questions about our business plans."
          />
        </div>
      </div>
        </main>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <DesktopFooter />
      </div>
    </div>
  );
}

