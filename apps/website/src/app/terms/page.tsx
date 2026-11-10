"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ChevronRight, Home, FileText, CheckCircle2, ArrowLeft, PhoneCall, HelpCircle } from "lucide-react";
import { DesktopHeader } from "@/components/DesktopHeader";
import { DesktopFooter } from "@/components/DesktopFooter";

export default function TermsAndConditionsPage() {
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
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-800 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span>Legal</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">Terms &amp; Conditions</span>
        </div>

        {/* Hero Title Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DPDP Act 2023 Compliant • Updated November 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Terms &amp; Conditions of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Welcome to <strong>Hello-Hi</strong> (“Platform”, “we”, “our”, “us”). These Terms and Conditions govern your access to and use of our hyperlocal search portal, merchant directories, fast quote generators, and mobile application across Hyderabad (Telangana), Vijayawada, and Guntur (Andhra Pradesh).
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-2 border-b border-slate-100 pb-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-50 text-[#0076D7] flex items-center justify-center text-xs font-black">1</span>
              Acceptance &amp; Platform Role
            </h2>
            <p>
              By browsing, searching, submitting enquiries, or listing a business on Hello-Hi, you unconditionally agree to comply with and be bound by these Terms. Hello-Hi acts as an intermediary discovery platform connecting consumers with independent local service providers, merchants, healthcare clinics, and commercial businesses.
            </p>
          </section>

          <section className="space-y-2 border-b border-slate-100 pb-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-50 text-[#0076D7] flex items-center justify-center text-xs font-black">2</span>
              100% Free Business Listing &amp; Merchant Responsibilities
            </h2>
            <p>
              Business owners can register their establishment on Hello-Hi completely free of charge. Merchants agree that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>All submitted business details (legal name, phone number, physical address, operating hours, and trade credentials) are accurate and legally authentic.</li>
              <li>Uploads of storefront photos or image URLs must not infringe on third-party copyrights or contain misleading or offensive content.</li>
              <li>Hello-Hi reserves the right to verify licenses (GSTIN, FSSAI, Medical Council registration, Fire NOC) before awarding the <strong>HELLO Verified</strong> badge.</li>
            </ul>
          </section>

          <section className="space-y-2 border-b border-slate-100 pb-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-50 text-[#0076D7] flex items-center justify-center text-xs font-black">3</span>
              Instant 15-Minute Quote Guarantee &amp; Customer Leads
            </h2>
            <p>
              Our automated match engine routes consumer requests directly to verified vendors within the selected locality (e.g., Hitec City, Banjara Hills, Benz Circle, Brodipet). We facilitate initial contact through WhatsApp, direct calling, and SMS notifications. Hello-Hi is not responsible for pricing disputes, contract terms, or direct offline service delivery between customers and vendors.
            </p>
          </section>

          <section className="space-y-2 border-b border-slate-100 pb-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-50 text-[#0076D7] flex items-center justify-center text-xs font-black">4</span>
              Data Protection &amp; DPDP Act 2023 Compliance
            </h2>
            <p>
              In strict accordance with the Digital Personal Data Protection (DPDP) Act 2023 of India:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Customer contact details are shared only with relevant service providers matching the customer’s explicit search or quote submission.</li>
              <li>We never sell, trade, or distribute your phone numbers to unauthorized third-party advertisers.</li>
              <li>Users retain full rights to request deletion of their data or revoke account consent at any time.</li>
            </ul>
          </section>

          <section className="space-y-2 border-b border-slate-100 pb-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-50 text-[#0076D7] flex items-center justify-center text-xs font-black">5</span>
              Genuine Reviews &amp; Anti-Spam Policy
            </h2>
            <p>
              All ratings and reviews must reflect genuine customer experiences. Hello-Hi employs automated spam filters and manual moderation audits. Merchants attempting to inflate ratings through artificial means, paid bot reviews, or fake submissions will have their verified badge permanently revoked and profile delisted.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-50 text-[#0076D7] flex items-center justify-center text-xs font-black">6</span>
              Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms are governed by the laws of India. Any legal disputes or actions arising out of platform use shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana, or Vijayawada, Andhra Pradesh.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Questions regarding our terms?</span>
                <span className="text-[11px] text-slate-500">Contact our Legal &amp; Compliance team anytime.</span>
              </div>
              <Link
                href="/contact"
                className="bg-[#0076D7] hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
              >
                Contact Support
              </Link>
            </div>
          </section>

        </div>
      </main>

      <DesktopFooter />
    </div>
  );
}

