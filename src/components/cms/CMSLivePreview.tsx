"use client";

import React, { useState } from "react";
import { Monitor, Tablet, Smartphone, ExternalLink, ShieldCheck } from "lucide-react";
import { FAQItem } from "./CMSFAQEditor";

interface CMSLivePreviewProps {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  faqItems?: FAQItem[];
  language: string;
  updatedAt?: string;
}

export function CMSLivePreview({
  title,
  slug,
  shortDescription,
  content,
  faqItems,
  language,
  updatedAt,
}: CMSLivePreviewProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const containerWidth =
    device === "desktop"
      ? "w-full max-w-4xl"
      : device === "tablet"
      ? "w-[720px]"
      : "w-[360px]";

  return (
    <div className="space-y-4">
      {/* Device Viewport Selector Bar */}
      <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              device === "desktop"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              device === "tablet"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (720px)</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              device === "mobile"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (360px)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
            Live Preview Mode
          </span>
        </div>
      </div>

      {/* Device Frame Display */}
      <div className="flex justify-center p-4 bg-slate-800/10 rounded-2xl min-h-[500px] border border-slate-200 overflow-x-auto">
        <div
          className={`${containerWidth} bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all flex flex-col`}
        >
          {/* Mock Browser URL Bar */}
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-500">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <div className="flex-1 bg-white px-3 py-1 rounded-md text-[11px] border border-slate-200 truncate flex items-center justify-between">
              <span>https://www.hello-hi.com/{slug}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Website Header Mock */}
          <div className="bg-[#0B1220] px-6 py-3.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-1 font-black text-sm">
              <span className="text-[#0076D7]">HE</span>
              <span className="text-[#FF6B35]">LLO</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Andhra Pradesh Hyperlocal
            </div>
          </div>

          {/* Page Body */}
          <div className="p-6 md:p-8 flex-1 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-[#0076D7] uppercase tracking-wider">
                Official Platform Documentation
              </span>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                {title || "Untitled Page"}
              </h1>
              {shortDescription && (
                <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">
                  {shortDescription}
                </p>
              )}
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-3">
                <span>Last Updated: {updatedAt || "Just now"}</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">Verified Official</span>
              </div>
            </div>

            {/* Render FAQs if available */}
            {faqItems && faqItems.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-2">
                  {faqItems.map((f) => (
                    <div
                      key={f.id}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaqId(openFaqId === f.id ? null : f.id)
                        }
                        className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition"
                      >
                        <span>{f.question}</span>
                        <span className="text-slate-400">
                          {openFaqId === f.id ? "−" : "+"}
                        </span>
                      </button>
                      {openFaqId === f.id && (
                        <div className="px-4 py-3 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-200">
                          {f.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rich Text Content */}
            <div
              className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-800"
              dangerouslySetInnerHTML={{ __html: content || "<p>No content written yet.</p>" }}
            />
          </div>

          {/* Website Footer Mock */}
          <div className="bg-[#0B1220] px-6 py-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
            <span>© 2026 HELLO Technologies Pvt. Ltd. (hello-hi.in)</span>
            <div className="flex items-center gap-1 text-emerald-400 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
