"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";
import { ArrowLeft, Search, ChevronRight, HelpCircle, FileText } from "lucide-react";

function ArticlesContent() {
  const searchParams = useSearchParams();
  const audienceQuery = searchParams.get("audience");

  const [role, setRole] = useState<"GUEST" | "CUSTOMER" | "BUSINESS_PARTNER">("GUEST");
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<"CUSTOMER" | "MERCHANT">("CUSTOMER");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");

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
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let aud = role === "GUEST" ? "GUEST" : role;
        if (role === "GUEST" && audienceQuery) {
          aud = audienceQuery;
        }
        const res = await fetch(`http://localhost:4000/api/v1/help-center/articles?audience=${aud}`);
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [role, audienceQuery]);

  const filtered = articles.filter((a) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return a.title?.toLowerCase().includes(q) || a.content?.toLowerCase().includes(q) || a.category_name?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <DesktopHeader
        selectedCity="Hyderabad"
        onSelectCity={() => {}}
        selectedLocality="Hitec City"
        onSelectLocality={() => {}}
        selectedCategory={null}
        onSelectCategory={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        onOpenAddBusiness={() => {}}
        onOpenLogin={() => {}}
        isLoggedIn={role !== "GUEST"}
        userName={sessionUser?.fullName || "User"}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 mb-6">
          <Link href="/help-center" className="hover:text-blue-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-4 h-4" /> Help Center
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">All Articles</span>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              All Help Articles & Guides
            </h1>
            <p className="text-slate-500 text-sm mb-6">
              Browse through our comprehensive library of step-by-step guides, troubleshooting documentation, and answers.
            </p>

            {/* Filter Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter articles by keyword or category..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Loading articles...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No Articles Found</h3>
            <p className="text-xs text-slate-500">
              {filterQuery ? `No articles matched "${filterQuery}". Try a different keyword.` : "No articles available at this time."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((art: any) => (
              <Link
                key={art.id}
                href={`/help-center/articles/${art.slug}`}
                className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
                      {art.category_name || "Guide"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {art.view_count || 0} views
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {art.content}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Read Article</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ArticlesListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <ArticlesContent />
    </Suspense>
  );
}
