import React, { useState } from "react";
import Link from "next/link";
import { 
  Percent, 
  Zap, 
  Crown, 
  MapPin, 
  ChevronDown, 
  User, 
  Bell, 
  LogOut,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { BusinessPartnerHeader } from "@/components/vendor/BusinessPartnerHeader";
import { DesktopFooter } from "@/components/DesktopFooter";
import { PlanCard, PlanData } from "./PlanCard";
import { PlanTrustBar } from "./PlanTrustBar";
import { PlanFaqAccordion, FaqItem } from "./PlanFaqAccordion";

interface CustomerPlansViewProps {
  plans: PlanData[];
  faqs: FaqItem[];
  userSession?: any;
  onSelectPlan: (plan: PlanData) => void;
  isLoading?: boolean;
  onLogout?: () => void;
}

export function CustomerPlansView({
  plans,
  faqs,
  userSession,
  onSelectPlan,
  isLoading,
  onLogout,
}: CustomerPlansViewProps) {
  const [selectedCity, setSelectedCity] = useState("Bengaluru, KA");
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = userSession?.fullName || "Rahul Sharma";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* 1. Customer Header matching media_1793880738920_e242de4c.jpg */}
      <BusinessPartnerHeader activeNav="Plans" />

      {/* 2. Customer Hero Banner matching media_1793880738920_e242de4c.jpg */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#EBF5FF] via-[#F4F9FD] to-[#F8FAFC] pt-10 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Choose the Best <span className="text-[#FF6B35]">Customer Plan</span> for You
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
              Get more value, bigger savings, and a smoother service experience with HELLO-Hi customer plans.
            </p>

            {/* Three Value Proposition Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                <span className="text-orange-500 font-black">🏷️</span>
                <span>Save More on Services</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Faster &amp; Easier Bookings</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Exclusive Customer Offers</span>
              </div>
            </div>
          </div>

          {/* 3. Three Pricing Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle="MONTHLY"
                onSelect={(p) => onSelectPlan(p)}
                isLoading={isLoading}
              />
            ))}
          </div>

          {/* 4. Trust Bar */}
          <PlanTrustBar audience="CUSTOMER" />

          {/* 5. FAQs Accordion */}
          <PlanFaqAccordion
            faqs={faqs}
            title="Frequently Asked Questions"
            subtitle="Quick answers about HELLO-Hi customer plans."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <DesktopFooter />
      </div>
    </div>
  );
}

