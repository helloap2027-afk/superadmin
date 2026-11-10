"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";
import { HelpCategoryIcon } from "@/components/help/HelpCategoryIcon";
import { ArrowLeft, Search, ThumbsUp, ThumbsDown, CheckCircle2, ChevronRight, Phone, MessageSquare, Mail, HelpCircle, ShieldCheck } from "lucide-react";
import { SupportTicketModal } from "@/components/help/SupportTicketModal";

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = params.slug;

  const [role, setRole] = useState<"GUEST" | "CUSTOMER" | "BUSINESS_PARTNER">("GUEST");
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<"CUSTOMER" | "MERCHANT">("CUSTOMER");
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<"yes" | "no" | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("hello_access_token") || localStorage.getItem("access_token");
      const savedRole = (localStorage.getItem("hello_active_role") || "CUSTOMER") as "CUSTOMER" | "MERCHANT";
      const userStr = localStorage.getItem("hello_user");

      if (token) {
        if (savedRole === "MERCHANT") {
          setRole("BUSINESS_PARTNER");
          setActiveRole("MERCHANT");
        } else {
          setRole("CUSTOMER");
          setActiveRole("CUSTOMER");
        }
      } else {
        setRole("GUEST");
      }

      if (userStr) {
        try {
          setSessionUser(JSON.parse(userStr));
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:4000/api/v1/help-center/articles/${slug}`);
        if (!res.ok) {
          throw new Error("Article not found");
        }
        const data = await res.json();
        setArticle(data.article);
        setRelatedArticles(data.related || []);
      } catch (err: any) {
        setError(err.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const handleFeedback = async (type: "yes" | "no") => {
    if (feedbackGiven) return;
    setFeedbackGiven(type);
    try {
      await fetch(`http://localhost:4000/api/v1/help-center/articles/${slug}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHelpful: type === "yes" }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Header */}
      <DesktopHeader
        selectedCity="Hyderabad"
        onSelectCity={() => {}}
        selectedLocality="Hitec City"
        onSelectLocality={() => {}}
        selectedCategory={null}
        onSelectCategory={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        onOpenAddBusiness={() => router.push("/login?mode=register&role=PARTNER")}
        onOpenLogin={() => router.push("/login")}
        isLoggedIn={role !== "GUEST"}
        userName={sessionUser?.fullName || "User"}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 mb-6">
          <Link href="/help-center" className="hover:text-blue-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-4 h-4" /> Help Center
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {article?.category_name && (
            <>
              <span className="font-medium text-slate-600">
                {article.category_name}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </>
          )}
          <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-md">
            {article?.title || slug}
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Loading article details...</p>
          </div>
        ) : error || !article ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Article Not Found</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              The article you are looking for doesn't exist or is not available for your current account view.
            </p>
            <Link
              href="/help-center"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Help Center
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Article Content - Left 8 columns */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {article.category_name || "General Guide"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Updated {new Date(article.updated_at || article.created_at || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
                  {article.title}
                </h1>

                {/* Body Content */}
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line border-t border-slate-100 pt-6">
                  {article.content}
                </div>

                {/* Helpful Feedback Box */}
                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/70 p-5 rounded-xl">
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-bold text-slate-800">Was this article helpful?</p>
                    <p className="text-xs text-slate-500">Your feedback helps us improve our help articles.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleFeedback("yes")}
                      disabled={!!feedbackGiven}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                        feedbackGiven === "yes"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" /> Yes
                    </button>
                    <button
                      onClick={() => handleFeedback("no")}
                      disabled={!!feedbackGiven}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                        feedbackGiven === "no"
                          ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" /> No
                    </button>
                  </div>
                </div>

                {feedbackGiven && (
                  <p className="mt-3 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Thank you for your feedback!
                  </p>
                )}
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Related Articles</h3>
                  <div className="space-y-3">
                    {relatedArticles.map((rel: any) => (
                      <Link
                        key={rel.id}
                        href={`/help-center/articles/${rel.slug}`}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <HelpCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {rel.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                              {rel.category_name || "Help Guide"}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Contact & Actions - Right 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              {/* Need More Assistance Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-2">Need More Help?</h3>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  Can't find what you are looking for? Our dedicated 24×7 support specialists are ready to assist you.
                </p>

                <div className="space-y-3">
                  <a
                    href="tel:+918047100727"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all text-slate-700 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Call Us 24x7</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700">+91 80 4710 0727</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/918047100727"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all text-slate-700 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">WhatsApp</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700">Chat with an Agent</p>
                    </div>
                  </a>

                  <a
                    href="mailto:support@hello-hi.in"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-slate-700 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Email Us</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700">support@hello-hi.in</p>
                    </div>
                  </a>

                  <button
                    onClick={() => setTicketModalOpen(true)}
                    className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" /> Raise a Support Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Support Ticket Modal Dialog */}
      <SupportTicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        audience={role}
        defaultCategory={article?.category_name || "General Support"}
      />
    </div>
  );
}
