import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight, Home, HelpCircle } from "lucide-react";
import { DesktopFooter } from "@/components/DesktopFooter";

const CMS_ALLOWED_SLUGS = [
  "terms-and-conditions",
  "privacy-policy",
  "faqs",
  "about-us",
  "refund-cancellation-policy",
  "contact-support"
];

async function getCMSPage(slug: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/v1/cms/public/${slug}?lang=en`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  if (!CMS_ALLOWED_SLUGS.includes(params.slug)) {
    return { title: "Page Not Found | Hello-Hi" };
  }
  const page = await getCMSPage(params.slug);
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
  if (!CMS_ALLOWED_SLUGS.includes(params.slug)) {
    notFound();
  }

  const page = await getCMSPage(params.slug);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Minimal Top Brand Bar */}
      <header className="bg-[#0B1220] border-b border-slate-800 py-3.5 px-4 sm:px-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 font-black text-xl tracking-tight">
            <span className="text-[#0076D7]">HE</span>
            <span className="text-[#FF6B35]">LLO</span>
            <span className="text-white text-xs font-semibold ml-2 pl-2 border-l border-slate-700 hidden sm:inline">
              Hyperlocal Discovery
            </span>
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/explore" className="text-slate-300 hover:text-white font-medium transition">
              Explore Andhra Pradesh
            </Link>
            <Link
              href="/"
              className="bg-[#0076D7] hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg transition"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Article */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex-1 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-800 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span>Policies &amp; Legal</span>
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
              <span>Official Public Documentation</span>
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
              <span>Last updated: {page?.updatedAt ? new Date(page.updatedAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }) : "October 2024"}</span>
            </div>
          </div>

          {/* If page has FAQ items, render as accessible accordion */}
          {page?.faqItems && Array.isArray(page.faqItems) && page.faqItems.length > 0 && (
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0076D7]" />
                <span>Frequently Asked Questions</span>
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
            className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-800"
            dangerouslySetInnerHTML={{
              __html: page?.content || "<p>Please visit the Super Admin console to publish content for this section.</p>"
            }}
          />
        </div>
      </main>

      {/* Website Footer */}
      <DesktopFooter />
    </div>
  );
}
