"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronRight, Home, HelpCircle, Search, ChevronDown, 
  MessageSquare, Phone, ShieldCheck, CheckCircle2, Sparkles, Building2, Zap 
} from "lucide-react";
import { DesktopHeader } from "@/components/DesktopHeader";
import { DesktopFooter } from "@/components/DesktopFooter";

interface FAQItem {
  id: string;
  category: "consumers" | "merchants" | "quotes" | "kyc";
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "quotes",
    categoryLabel: "Quotes & Deals",
    question: "How does the 15-minute quote guarantee work?",
    answer: "When you submit an enquiry through our Instant Best Deal form or from any verified merchant card, our hyperlocal match engine immediately notifies top-rated local providers in your locality (e.g. Hitec City, Benz Circle, Brodipet) via SMS and WhatsApp. Providers typically respond with pricing, availability, and consultation slots within 15 minutes."
  },
  {
    id: "faq-2",
    category: "merchants",
    categoryLabel: "Free Business Listing",
    question: "Is adding my business listing really 100% free?",
    answer: "Yes, completely free. We never charge setup fees, registration costs, or hidden listing fees. You can list your business name, category, phone number, WhatsApp, full address, working hours, and upload a storefront cover photo or enter an image URL with zero charges."
  },
  {
    id: "faq-3",
    category: "merchants",
    categoryLabel: "Free Business Listing",
    question: "Can I upload storefront photos or enter an image URL?",
    answer: "Yes! Our Add Business Free form supports both: you can directly upload an image file from your device (JPG, PNG, WebP up to 5MB) with instant local preview, or paste any image URL from the web. The photo will immediately appear on your listing card."
  },
  {
    id: "faq-4",
    category: "kyc",
    categoryLabel: "KYC & Verification",
    question: "What documents are required to get the HELLO Verified badge?",
    answer: "To earn the trusted HELLO Verified checkmark, businesses upload their trade credential (GSTIN, FSSAI Food Safety License for dining, State Dental/Medical Council Certificate for clinics, or Trade License for home services). Our Super Admin team audits the submission and verifies checksums before issuing the green verification badge."
  },
  {
    id: "faq-5",
    category: "merchants",
    categoryLabel: "Free Business Listing",
    question: "Can I receive customer leads directly on WhatsApp?",
    answer: "Yes. Customers can tap the 'WhatsApp' button on your profile to initiate an instant chat with your verified WhatsApp number. In addition, when quotes are requested, lead summaries are delivered directly to your registered number."
  },
  {
    id: "faq-6",
    category: "consumers",
    categoryLabel: "For Consumers",
    question: "Which cities are currently supported on Hello-Hi?",
    answer: "We currently cover three active regional hubs: Hyderabad (including Hitec City, Madhapur, Jubilee Hills, Banjara Hills, Gachibowli, Kukatpally, Secunderabad, Begumpet), Vijayawada (Nahamar, Benz Circle, MG Road, One Town), and Guntur (Brodipet, Arundelpet, Lakshmipuram). Expansion to Visakhapatnam, Tirupati, Kurnool, and Rajahmundry is underway."
  },
  {
    id: "faq-7",
    category: "consumers",
    categoryLabel: "For Consumers",
    question: "How is my personal phone number protected under DPDP Act 2023?",
    answer: "We strictly adhere to India's Digital Personal Data Protection (DPDP) Act 2023. Your contact number is only shared with verified merchants matching your explicit quote request. We never sell your number to telemarketers or third-party advertising brokers."
  },
  {
    id: "faq-8",
    category: "merchants",
    categoryLabel: "Free Business Listing",
    question: "How do I edit my business operating hours and contact numbers?",
    answer: "You can update your business profile at any time by switching to 'Vendor Mode' in the mobile app simulator or contacting support with your verified phone number. Changes reflect across the platform within seconds."
  },
  {
    id: "faq-9",
    category: "kyc",
    categoryLabel: "KYC & Verification",
    question: "Are reviews and ratings on Hello-Hi moderated?",
    answer: "Yes. Every review undergoes automated spam filtering and admin verification to ensure it originates from genuine local consumers. Merchants cannot pay to delete negative feedback or fabricate artificial 5-star ratings."
  },
  {
    id: "faq-10",
    category: "quotes",
    categoryLabel: "Quotes & Deals",
    question: "Is there any obligation to hire a provider after receiving a quote?",
    answer: "None at all. All quotes generated through Hello-Hi are 100% free and come with zero obligation. You are completely free to compare prices, verify credentials, and decide which local provider best fits your requirements."
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((item) => {
      const matchesCat = activeCategory === "all" || item.category === activeCategory;
      const matchesQ = 
        !searchQuery.trim() || 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQ;
    });
  }, [activeCategory, searchQuery]);

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
          <span>Help</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">Frequently Asked Questions</span>
        </div>

        {/* Hero Title & Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0076D7] bg-blue-50 px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help &amp; Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Find fast answers to common questions about searching local services, free business listings, 15-minute quotes, and KYC verifications.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative pt-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search questions (e.g., free listing, quotes, verification)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0076D7] focus:bg-white shadow-2xs transition"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none py-1">
          {[
            { id: "all", label: "All Questions" },
            { id: "merchants", label: "For Business Owners" },
            { id: "consumers", label: "For Consumers" },
            { id: "quotes", label: "Quotes & Deals" },
            { id: "kyc", label: "KYC & Verification" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                activeCategory === cat.id
                  ? "bg-[#0076D7] text-white border-[#0076D7] shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No matching questions found</h3>
              <p className="text-xs text-slate-500">Try searching for keywords like "quote", "verification", or "free".</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-[#0076D7] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                        {faq.categoryLabel}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-[#0076D7]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-gradient-to-r from-[#0076D7] to-[#005FAE] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold">Still have questions?</h3>
            <p className="text-xs text-blue-100">
              Our regional customer and merchant support specialists are here to assist you.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/contact"
              className="bg-white text-[#0076D7] hover:bg-blue-50 font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs"
            >
              Contact Support
            </Link>
            <a
              href="https://wa.me/919848012345"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#16A34A] hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </main>

      <DesktopFooter />
    </div>
  );
}

