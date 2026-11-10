"use client";

import React from "react";
import {
  User,
  Calendar,
  Wallet,
  Layers,
  Tag,
  RefreshCw,
  Smartphone,
  Shield,
  BadgeCheck,
  Store,
  Users,
  Megaphone,
  BarChart3,
  UserCheck,
  HelpCircle,
} from "lucide-react";

interface HelpCategoryIconProps {
  name?: string;
  className?: string;
}

export function HelpCategoryIcon({ name, className = "w-6 h-6" }: HelpCategoryIconProps) {
  const norm = (name || "").toLowerCase().trim();

  if (norm.includes("account") || norm.includes("profile") || norm === "user") {
    return <User className={`${className} text-[#0076D7]`} />;
  }
  if (norm.includes("booking") || norm.includes("calendar")) {
    return <Calendar className={`${className} text-emerald-600`} />;
  }
  if (norm.includes("wallet") || norm.includes("payment")) {
    return <Wallet className={`${className} text-emerald-600`} />;
  }
  if (norm.includes("plan") || norm.includes("subscription") || norm.includes("layer")) {
    return <Layers className={`${className} text-purple-600`} />;
  }
  if (norm.includes("offer") || norm.includes("coupon") || norm.includes("tag")) {
    return <Tag className={`${className} text-pink-600`} />;
  }
  if (norm.includes("cancel") || norm.includes("refund") || norm.includes("refresh")) {
    return <RefreshCw className={`${className} text-amber-600`} />;
  }
  if (norm.includes("app") || norm.includes("website") || norm.includes("phone")) {
    return <Smartphone className={`${className} text-sky-600`} />;
  }
  if (norm.includes("safety") || norm.includes("policy") || norm.includes("shield")) {
    return <Shield className={`${className} text-indigo-600`} />;
  }
  if (norm.includes("registration") || norm.includes("verification") || norm.includes("badge")) {
    return <BadgeCheck className={`${className} text-amber-600`} />;
  }
  if (norm.includes("listing") || norm.includes("store")) {
    return <Store className={`${className} text-emerald-600`} />;
  }
  if (norm.includes("lead") || norm.includes("enquir") || norm.includes("users")) {
    return <Users className={`${className} text-purple-600`} />;
  }
  if (norm.includes("advertisement") || norm.includes("megaphone")) {
    return <Megaphone className={`${className} text-pink-600`} />;
  }
  if (norm.includes("performance") || norm.includes("report") || norm.includes("chart")) {
    return <BarChart3 className={`${className} text-indigo-600`} />;
  }
  if (norm.includes("team") || norm.includes("access")) {
    return <UserCheck className={`${className} text-amber-600`} />;
  }

  return <HelpCircle className={`${className} text-slate-500`} />;
}

