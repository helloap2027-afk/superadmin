import React from "react";
import { ShieldCheck, RefreshCw, Zap, Headphones, Coins, Calendar, Sparkles } from "lucide-react";

interface PlanTrustBarProps {
  audience: "CUSTOMER" | "BUSINESS";
}

export function PlanTrustBar({ audience }: PlanTrustBarProps) {
  if (audience === "BUSINESS") {
    const items = [
      {
        icon: ShieldCheck,
        iconBg: "bg-blue-50 text-blue-600 border-blue-100",
        title: "Secure & Trusted Billing",
        desc: "Safe, encrypted payments",
      },
      {
        icon: Calendar,
        iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
        title: "Flexible Renewals",
        desc: "Choose monthly or yearly",
      },
      {
        icon: Coins,
        iconBg: "bg-amber-50 text-amber-600 border-amber-100",
        title: "Lead Credits",
        desc: "Get more value with higher lead limits",
      },
      {
        icon: Headphones,
        iconBg: "bg-sky-50 text-sky-600 border-sky-100",
        title: "Dedicated Partner Support",
        desc: "Get help whenever you need it",
      },
    ];

    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 my-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${it.iconBg}`}>
                <it.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">{it.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Customer Trust Bar
  const customerItems = [
    {
      icon: ShieldCheck,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      title: "Secure Payments",
      desc: "Safe, encrypted and trusted",
    },
    {
      icon: RefreshCw,
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
      title: "Flexible Plans",
      desc: "Upgrade or change anytime",
    },
    {
      icon: Zap,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      title: "Instant Activation",
      desc: "Start enjoying benefits right away",
    },
    {
      icon: Headphones,
      iconBg: "bg-sky-50 text-sky-600 border-sky-100",
      title: "Reliable Support",
      desc: "We're here to help you always",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 my-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerItems.map((it, idx) => (
          <div key={idx} className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${it.iconBg}`}>
              <it.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">{it.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

