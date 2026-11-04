"use client";

import React from "react";
import { Globe, Search, Share2 } from "lucide-react";

export interface CMSSEOSettingsData {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

interface CMSSEOSettingsProps {
  seo: CMSSEOSettingsData;
  slug: string;
  onChange: (seo: CMSSEOSettingsData) => void;
}

export function CMSSEOSettings({ seo, slug, onChange }: CMSSEOSettingsProps) {
  const updateField = (field: keyof CMSSEOSettingsData, val: any) => {
    onChange({
      ...seo,
      [field]: val,
    });
  };

  const titleLength = (seo.metaTitle || "").length;
  const descLength = (seo.metaDescription || "").length;

  return (
    <div className="space-y-6">
      {/* Search Engine Snippet Preview Card */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Search className="w-3.5 h-3.5 text-blue-600" />
          <span>Google Search SERP Preview</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>https://www.hello-hi.com &gt; {slug}</span>
          </div>
          <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
            {seo.metaTitle || `${slug} | Hello-Hi Hyperlocal`}
          </div>
          <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {seo.metaDescription ||
              "Read official policies and platform documentation for Hello-Hi discovery engine."}
          </div>
        </div>
      </div>

      {/* Primary Meta Fields */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Meta Title *
            </label>
            <span
              className={`text-[10px] font-bold ${
                titleLength > 60 ? "text-amber-600" : "text-slate-400"
              }`}
            >
              {titleLength}/60
            </span>
          </div>
          <input
            type="text"
            value={seo.metaTitle}
            onChange={(e) => updateField("metaTitle", e.target.value)}
            placeholder="e.g. Terms & Conditions | Hello-Hi"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Optimal length between 50-60 characters for maximum search visibility.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Meta Description *
            </label>
            <span
              className={`text-[10px] font-bold ${
                descLength > 160 ? "text-amber-600" : "text-slate-400"
              }`}
            >
              {descLength}/160
            </span>
          </div>
          <textarea
            rows={3}
            value={seo.metaDescription}
            onChange={(e) => updateField("metaDescription", e.target.value)}
            placeholder="Write an informative summary for search results..."
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Optimal length between 150-160 characters. Avoid keyword stuffing.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Canonical URL
          </label>
          <input
            type="url"
            value={seo.canonicalUrl || ""}
            onChange={(e) => updateField("canonicalUrl", e.target.value)}
            placeholder={`https://www.hello-hi.com/${slug}`}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
          />
        </div>

        {/* Robots Indexing */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Search Indexing (robots.txt)
            </span>
            <span className="text-[11px] text-slate-500">
              Allow search engine spiders (Googlebot, Bingbot) to index this page.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={seo.robotsIndex}
              onChange={(e) => updateField("robotsIndex", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0076D7]"></div>
          </label>
        </div>

        {/* Social Sharing (Open Graph) */}
        <div className="pt-2 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Share2 className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Social Share (Open Graph Tags)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                OG Title
              </label>
              <input
                type="text"
                value={seo.ogTitle || ""}
                onChange={(e) => updateField("ogTitle", e.target.value)}
                placeholder={seo.metaTitle}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                OG Image URL
              </label>
              <input
                type="url"
                value={seo.ogImage || ""}
                onChange={(e) => updateField("ogImage", e.target.value)}
                placeholder="https://hello-hi.in/og-image.jpg"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
