import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface PlanFaqAccordionProps {
  faqs: FaqItem[];
  title?: string;
  subtitle?: string;
}

export function PlanFaqAccordion({
  faqs,
  title = "Frequently Asked Questions",
  subtitle = "Quick answers to common questions about our plans.",
}: PlanFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Title Column */}
        <div className="lg:col-span-4">
          <div className="w-8 h-1 bg-[#FF6B35] rounded-full mb-3" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">{subtitle}</p>
        </div>

        {/* Right Accordion List */}
        <div className="lg:col-span-8 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/90 rounded-xl bg-white overflow-hidden transition-shadow duration-150 hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 hover:text-slate-950 transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#FF6B35]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

