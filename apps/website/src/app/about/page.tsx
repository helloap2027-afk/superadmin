"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, ChevronRight, Home, Building2, Zap, Users, 
  MapPin, CheckCircle2, ArrowRight, Award, Clock, Star, Sparkles 
} from "lucide-react";
import { DesktopHeader } from "@/components/DesktopHeader";
import { DesktopFooter } from "@/components/DesktopFooter";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
            {/* Authoritative Homepage Header */}
      <DesktopHeader
        selectedCity="Hyderabad"
        onSelectCity={() => {}}
        selectedCategory={null}
        onSelectCategory={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        onOpenAddBusiness={() => {}}
        onOpenLogin={() => {}}
        isLoggedIn={false}
      />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-800 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span>Company</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">About Us</span>
        </div>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#0B1220] via-[#101D35] to-[#0B1220] text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-white/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Andhra Pradesh &amp; Telangana Premier Hyperlocal Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Search Local. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-amber-300">
                Connect Instant.
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Hello-Hi is built to revolutionize hyperlocal discovery across Hyderabad, Vijayawada, and Guntur. We eliminate middlemen fees, protect consumer privacy under DPDP Act 2023, and empower local merchants with 100% free business listings and automated 15-minute lead routing.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/"
                className="bg-[#FF6B35] hover:bg-[#E5531E] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md"
              >
                Browse 14 Categories
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition border border-white/20"
              >
                Meet Our Team
              </Link>
            </div>
          </div>

          {/* Decorative Background Circles */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#0076D7]/20 blur-3xl" />
          <div className="absolute right-20 -bottom-16 w-64 h-64 rounded-full bg-[#FF6B35]/20 blur-3xl" />
        </div>

        {/* 4 Pillars Grid */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0076D7]">Why We Are Different</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Built for Trust, Speed &amp; Accuracy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Hyperlocal Precision</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search right down to Cyber Towers in Hitec City, Benz Circle in Vijayawada, or Brodipet in Guntur with real walking/driving distances.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">100% Free Listing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero commissions and zero hidden setup fees for local merchants. Micro and small businesses get equal visibility next to large chains.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">KYC Verified Badges</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trade licenses, FSSAI food safety permits, GST certificates, and clinic licenses are vetted before granting the HELLO Verified checkmark.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">15-Min Fast Quotes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct WhatsApp and automated dispatch routes customer requirements to live service providers in under 15 minutes guaranteed.
              </p>
            </div>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#0076D7]">6.2 Cr+</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Services Searched</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#FF6B35]">75,000+</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Verified Providers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">14</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Commercial Verticals</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-500">&lt; 15 Mins</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Average Response Time</div>
            </div>
          </div>
        </div>

        {/* Regional Hubs Banner */}
        <div className="bg-slate-100/80 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">Active Regional Hubs</h3>
            <p className="text-xs text-slate-600">
              Hyderabad (Cyber Towers, Hitec City) • Vijayawada (Benz Circle) • Guntur (Brodipet)
            </p>
            <span className="text-[11px] text-slate-400 block">
              Expansion upcoming in Visakhapatnam, Tirupati, Kurnool, and Rajahmundry.
            </span>
          </div>
          <Link
            href="/contact"
            className="bg-[#0076D7] hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <span>Contact Regional Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <DesktopFooter />
    </div>
  );
}

