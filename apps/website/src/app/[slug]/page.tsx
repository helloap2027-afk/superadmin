import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight, Home, HelpCircle, FileText, Phone, Info } from "lucide-react";
import { WebsiteHeaderWrapper } from "@/components/WebsiteHeaderWrapper";
import { DesktopFooter } from "@/components/DesktopFooter";
import { ContactForm } from "@/components/ContactForm";

const CMS_ALLOWED_SLUGS = [
  "terms",
  "terms-and-conditions",
  "privacy",
  "privacy-policy",
  "faq",
  "faqs",
  "about",
  "about-us",
  "refund",
  "refund-cancellation-policy",
  "contact",
  "contact-us",
  "contact-support",
  "cookie-policy",
  "community-guidelines"
];

function resolveSlug(slug: string): string {
  const map: Record<string, string> = {
    contact: "contact-support",
    "contact-us": "contact-support",
    terms: "terms-and-conditions",
    faq: "faqs",
    about: "about-us",
    privacy: "privacy-policy",
    refund: "refund-cancellation-policy",
  };
  return map[slug.toLowerCase()] || slug;
}

async function getCMSPage(slug: string) {
  try {
    const canonical = resolveSlug(slug);
    const res = await fetch(`http://localhost:4000/api/v1/cms/public/${canonical}?lang=en`, {
      next: { revalidate: 30 }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const target = resolveSlug(params.slug);
  if (!CMS_ALLOWED_SLUGS.includes(params.slug) && !CMS_ALLOWED_SLUGS.includes(target)) {
    return { title: "Page Not Found | Hello-Hi" };
  }
  const page = await getCMSPage(target);
  if (!page) {
    return {
      title: `${params.slug.replace(/-/g, " ")} | Hello-Hi`,
      description: "Official Hello-Hi Platform Documentation"
    };
  }
  return {
    title: page.seo?.metaTitle || `${page.title} | Hello-Hi`,
    description: page.seo?.metaDescription || page.shortDescription,
    robots: page.seo?.robotsIndex ? "index, follow" : "noindex, nofollow",
  };
}

export default async function PublicCMSPage({ params }: { params: { slug: string } }) {
  const canonical = resolveSlug(params.slug);
  if (!CMS_ALLOWED_SLUGS.includes(params.slug) && !CMS_ALLOWED_SLUGS.includes(canonical)) {
    notFound();
  }

  const page = await getCMSPage(canonical);
  const isContactPage = canonical === "contact-support";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Official Sticky Desktop Header & Categories Ribbon */}
      <WebsiteHeaderWrapper />

      {/* Main Content Article */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-800 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span>Policies & Information</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">
            {page?.title || params.slug.replace(/-/g, " ")}
          </span>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          <div className="border-b border-slate-100 pb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Database Record • hello_db</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {page?.title || params.slug.replace(/-/g, " ")}
            </h1>
            {page?.shortDescription && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {page.shortDescription}
              </p>
            )}
            <div className="text-[11px] text-slate-400 pt-1">
              <span>Last updated: {page?.updatedAt ? new Date(page.updatedAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }) : "October 2026"}</span>
            </div>
          </div>

          {/* If page has FAQ items, render as accessible accordion */}
          {page?.faqItems && Array.isArray(page.faqItems) && page.faqItems.length > 0 && (
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0076D7]" />
                <span>Frequently Asked Questions ({page.faqItems.length})</span>
              </h2>
              <div className="space-y-3">
                {page.faqItems.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900">
                      {idx + 1}. {item.question}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed pl-4 border-l-2 border-[#0076D7]/40">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article HTML Body */}
          <article
            className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-800 space-y-3"
            dangerouslySetInnerHTML={{
              __html: page?.content || "<p>Please visit the Super Admin console to publish content for this section.</p>"
            }}
          />

          {/* If Contact Page, render Interactive Contact Form */}
          {isContactPage && <ContactForm />}
        </div>
      </main>

      {/* Website Footer */}
      <DesktopFooter />
    </div>
  );
}
