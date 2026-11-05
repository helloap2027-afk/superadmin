"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Palette,
  Layout,
  Smartphone,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Save,
  CheckCircle,
  Eye,
  Sliders,
  Image as ImageIcon,
  Share2,
  DownloadCloud
} from "lucide-react";

// Platform-accurate branded SVG icons for email footer & preview
const SocialBrandIcon = ({ platform, className = "w-4 h-4" }: { platform: string; className?: string }) => {
  const p = platform.toUpperCase();
  if (p.includes("FACEBOOK") || p === "FB") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    );
  }
  if (p.includes("INSTAGRAM") || p === "IG") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    );
  }
  if (p.includes("TWITTER") || p.includes("X") || p === "X") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  if (p.includes("LINKEDIN")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    );
  }
  if (p.includes("YOUTUBE") || p === "YT") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  if (p.includes("WHATSAPP") || p === "WA") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    );
  }
  return <Share2 className={className} />;
};


export function EmailBrandingModule() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Layout form states
  const [logoUrl, setLogoUrl] = useState("https://hello-hi.in/logo.png");
  const [headerTagline, setHeaderTagline] = useState("Discover Local. Connect Instantly.");
  const [websiteUrl, setWebsiteUrl] = useState("https://hello-hi.in");
  const [contentWidth, setContentWidth] = useState(600);
  const [primaryAccentColor, setPrimaryAccentColor] = useState("#0076D7");
  const [headerBgColor, setHeaderBgColor] = useState("#FFFFFF");
  const [bodyBgColor, setBodyBgColor] = useState("#F8FAFC");
  const [footerBgColor, setFooterBgColor] = useState("#0B1220");
  const [footerTextColor, setFooterTextColor] = useState("#94A3B8");
  const [footerAboutText, setFooterAboutText] = useState(
    "HELLO connects millions of consumers with verified local businesses, stores, and home service providers across Andhra Pradesh."
  );
  const [copyrightText, setCopyrightText] = useState("© 2026 HELLO. All rights reserved.");

  // Badges & Social lists
  const [appBadges, setAppBadges] = useState<any[]>([]);
  const [socialIcons, setSocialIcons] = useState<any[]>([]);

  // Editing Badges / Socials
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editAppUrl, setEditAppUrl] = useState("");
  const [editAppEnabled, setEditAppEnabled] = useState(true);

  const [editingSocId, setEditingSocId] = useState<string | null>(null);
  const [editSocUrl, setEditSocUrl] = useState("");
  const [editSocEnabled, setEditSocEnabled] = useState(true);

  // New Social Form
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [newSocPlatform, setNewSocPlatform] = useState("CUSTOM");
  const [newSocName, setNewSocName] = useState("");
  const [newSocUrl, setNewSocUrl] = useState("");

  const logoFileRef = useRef<HTMLInputElement>(null);

  const fetchBranding = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/email/branding");
      if (!res.ok) throw new Error("Failed to load branding layout");
      const json = await res.json();
      if (json.success && json.data) {
        const l = json.data.layout || {};
        setData(json.data);
        setLogoUrl(l.logo_url || "https://hello-hi.in/logo.png");
        setHeaderTagline(l.header_tagline || "Discover Local. Connect Instantly.");
        setWebsiteUrl(l.website_url || "https://hello-hi.in");
        setContentWidth(l.content_width || 600);
        setPrimaryAccentColor(l.primary_accent_color || "#0076D7");
        setHeaderBgColor(l.header_bg_color || "#FFFFFF");
        setBodyBgColor(l.body_bg_color || "#F8FAFC");
        setFooterBgColor(l.footer_bg_color || "#0B1220");
        setFooterTextColor(l.footer_text_color || "#94A3B8");
        setFooterAboutText(l.footer_about_text || "");
        setCopyrightText(l.copyright_text || "© 2026 HELLO. All rights reserved.");

        setAppBadges(json.data.appBadges || []);
        setSocialIcons(json.data.socialIcons || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) setLogoUrl(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);
      const res = await fetch("http://localhost:4000/api/v1/admin/email/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoUrl,
          headerTagline,
          websiteUrl,
          contentWidth,
          primaryAccentColor,
          headerBgColor,
          bodyBgColor,
          footerBgColor,
          footerTextColor,
          footerAboutText,
          copyrightText,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback("Email branding & global footer updated successfully!");
        fetchBranding();
      }
    } catch (err: any) {
      alert(err.message || "Failed to save branding");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAppBadge = async (badge: any) => {
    try {
      await fetch(`http://localhost:4000/api/v1/admin/email/footer/apps/${badge.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeUrl: editAppUrl,
          isEnabled: editAppEnabled,
        }),
      });
      setEditingAppId(null);
      fetchBranding();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSocial = async (soc: any) => {
    try {
      await fetch(`http://localhost:4000/api/v1/admin/email/footer/socials/${soc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationUrl: editSocUrl,
          isEnabled: editSocEnabled,
        }),
      });
      setEditingSocId(null);
      fetchBranding();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:4000/api/v1/admin/email/footer/socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: newSocPlatform,
          displayName: newSocName || newSocPlatform,
          destinationUrl: newSocUrl,
        }),
      });
      setIsAddingSocial(false);
      setNewSocName("");
      setNewSocUrl("");
      fetchBranding();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    if (!window.confirm("Remove this social media link from email footers?")) return;
    try {
      await fetch(`http://localhost:4000/api/v1/admin/email/footer/socials/${id}`, {
        method: "DELETE",
      });
      fetchBranding();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={logoFileRef}
        onChange={handleLogoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
            <Palette className="w-4 h-4" />
            <span>Master Email Architecture</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
            Email Branding, Header & Footer
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure the global email layout, official App Store badges, and social media icons with live preview.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-white border border-slate-300 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                previewDevice === "desktop" ? "bg-[#0076D7] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                previewDevice === "mobile" ? "bg-[#0076D7] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mobile
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 2-Column Split: Controls on Left, Live Responsive Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: EDIT CONTROLS */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSaveBranding} className="space-y-6">
            {/* Header & Brand Identity */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layout className="w-4 h-4 text-[#0076D7]" />
                <h3 className="font-extrabold text-slate-900 text-sm">Header Branding</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Logo</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                    <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={() => logoFileRef.current?.click()}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Image</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={headerTagline}
                    onChange={(e) => setHeaderTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Accent Color</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-2 py-1.5 rounded-xl">
                    <input
                      type="color"
                      value={primaryAccentColor}
                      onChange={(e) => setPrimaryAccentColor(e.target.value)}
                      className="w-6 h-6 border-0 rounded cursor-pointer p-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-slate-800 uppercase">{primaryAccentColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: APP STORE & GOOGLE PLAY DOWNLOAD BADGES */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <DownloadCloud className="w-4 h-4 text-[#0076D7]" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Mobile App Download Badges (Section B)</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Google Play & Apple Store</span>
              </div>

              <div className="space-y-3">
                {appBadges.map((badge) => {
                  const isEditing = editingAppId === badge.id;
                  return (
                    <div key={badge.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            {badge.platform === "GOOGLE_PLAY" ? (
                              <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.609 1.814L13.793 12 3.61 22.186a1.996 1.996 0 0 1-.61-.994V2.808c.15-.38.375-.72.609-.994zM15.207 13.414l2.293 2.293-11.891 6.862 9.598-9.155zm0-2.828L5.609 1.431 17.5 8.293l-2.293 2.293zm1.414 1.414l3.195 1.844c.943.545.943 1.434 0 1.979l-3.195 1.844-2.121-2.121 2.121-5.546z"/>
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.69-1.13 1.83-1.01 2.92 1.07.08 2.16-.52 2.82-1.32z"/>
                              </svg>
                            )}
                          </div>
                          <span>{badge.display_name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              badge.is_enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {badge.is_enabled ? "Active in Footer" : "Hidden"}
                          </span>
                        </div>
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAppId(badge.id);
                              setEditAppUrl(badge.store_url);
                              setEditAppEnabled(Boolean(badge.is_enabled));
                            }}
                            className="text-[#0076D7] font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit URL</span>
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <input
                            type="url"
                            value={editAppUrl}
                            onChange={(e) => setEditAppUrl(e.target.value)}
                            placeholder="Store download URL..."
                            className="w-full px-3 py-1.5 bg-white border border-[#0076D7] rounded-lg text-xs font-mono"
                          />
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 font-medium text-slate-700">
                              <input
                                type="checkbox"
                                checked={editAppEnabled}
                                onChange={(e) => setEditAppEnabled(e.target.checked)}
                                className="w-4 h-4 rounded text-[#0076D7]"
                              />
                              <span>Display this badge in outgoing emails</span>
                            </label>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateAppBadge(badge)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Apply</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingAppId(null)}
                                className="px-2 py-1 text-slate-500 hover:text-slate-800"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] font-mono text-slate-500 truncate">{badge.store_url}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION C: SOCIAL MEDIA ICONS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#0076D7]" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Social Media Channels (Section C)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingSocial(!isAddingSocial)}
                  className="text-xs text-[#0076D7] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Social Link</span>
                </button>
              </div>

              {isAddingSocial && (
                <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs space-y-3">
                  <div className="font-bold text-slate-900">Add Social Platform</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Platform Name (e.g. Threads)"
                      value={newSocName}
                      onChange={(e) => setNewSocName(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="url"
                      placeholder="Destination URL (https://...)"
                      value={newSocUrl}
                      onChange={(e) => setNewSocUrl(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingSocial(false)}
                      className="px-3 py-1 text-slate-600 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="px-3.5 py-1 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-lg text-xs font-bold"
                    >
                      Add Platform
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {socialIcons.map((soc) => {
                  const isEditing = editingSocId === soc.id;
                  return (
                    <div key={soc.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between gap-3">
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="url"
                            value={editSocUrl}
                            onChange={(e) => setEditSocUrl(e.target.value)}
                            className="flex-1 px-2.5 py-1 bg-white border border-[#0076D7] rounded-lg text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateSocial(soc)}
                            className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSocId(null)}
                            className="p-1 text-slate-400"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                              <SocialBrandIcon platform={soc.platform || soc.display_name} className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-800">{soc.display_name}</span>
                            <span className="text-[10px] font-mono text-slate-400 truncate">({soc.destination_url})</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSocId(soc.id);
                                setEditSocUrl(soc.destination_url);
                                setEditSocEnabled(Boolean(soc.is_enabled));
                              }}
                              className="text-slate-500 hover:text-[#0076D7] font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSocial(soc.id)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Text & Legal */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-[#0076D7]" />
                <h3 className="font-extrabold text-slate-900 text-sm">Footer Content & Legal Text</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Description</label>
                <textarea
                  rows={2}
                  value={footerAboutText}
                  onChange={(e) => setFooterAboutText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Copyright Line</label>
                <input
                  type="text"
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Master Layout & Footer"}</span>
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIVE REALISTIC EMAIL PREVIEW */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 sticky top-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-blue-400">
              <Eye className="w-4 h-4" />
              <span>Live Rendered Email Layout ({previewDevice})</span>
            </span>
            <span className="text-[11px] font-mono">600px Responsive Canvas</span>
          </div>

          {/* Email Container Simulation */}
          <div
            className={`mx-auto bg-white text-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              previewDevice === "mobile" ? "max-w-[340px]" : "max-w-full"
            }`}
            style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
          >
            {/* Header */}
            <div
              className="p-6 text-center border-b border-slate-100"
              style={{ backgroundColor: headerBgColor }}
            >
              <img
                src={logoUrl || "https://hello-hi.in/logo.png"}
                alt="Brand Logo"
                className="h-9 mx-auto object-contain"
                onError={(e) => {
                  (e.target as any).src = "https://placehold.co/140x44/0076D7/ffffff?text=HELLO";
                }}
              />
              <p className="text-[11px] text-slate-400 mt-1 font-semibold tracking-wide uppercase">
                {headerTagline}
              </p>
            </div>

            {/* Mock Message Body */}
            <div className="p-6 space-y-4" style={{ backgroundColor: bodyBgColor }}>
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
                <h2 className="text-base font-extrabold text-slate-900">Welcome to HELLO, Vijay!</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your account is verified. Discover verified local businesses, connect directly with top merchants in Vijayawada, and explore daily discounts.
                </p>
                <div className="pt-2">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: primaryAccentColor }}
                  >
                    Explore HELLO
                  </a>
                </div>
              </div>
            </div>

            {/* GLOBAL FOOTER (SECTIONS A, B, C, D, E) */}
            <div
              className="p-6 text-center space-y-5"
              style={{ backgroundColor: footerBgColor, color: footerTextColor }}
            >
              {/* Brand Summary */}
              <div className="space-y-1">
                <div className="font-extrabold text-sm text-white tracking-tight">HELLO</div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  {headerTagline}
                </div>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed pt-1">
                  {footerAboutText}
                </p>
              </div>

              {/* SECTION B: APP STORE BADGES */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Get the HELLO App
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {appBadges
                    .filter((b) => b.is_enabled)
                    .map((badge) => (
                      <a
                        key={badge.id}
                        href={badge.store_url}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 px-3.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 flex items-center gap-2.5 transition shadow-2xs group"
                        title={badge.display_name}
                      >
                        {badge.platform === "GOOGLE_PLAY" ? (
                          <svg className="w-4 h-4 text-emerald-400 group-hover:scale-105 transition" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3.609 1.814L13.793 12 3.61 22.186a1.996 1.996 0 0 1-.61-.994V2.808c.15-.38.375-.72.609-.994zM15.207 13.414l2.293 2.293-11.891 6.862 9.598-9.155zm0-2.828L5.609 1.431 17.5 8.293l-2.293 2.293zm1.414 1.414l3.195 1.844c.943.545.943 1.434 0 1.979l-3.195 1.844-2.121-2.121 2.121-5.546z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-slate-200 group-hover:scale-105 transition" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.69-1.13 1.83-1.01 2.92 1.07.08 2.16-.52 2.82-1.32z"/>
                          </svg>
                        )}
                        <div className="text-left">
                          <div className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                            {badge.platform === "GOOGLE_PLAY" ? "GET IT ON" : "Download on the"}
                          </div>
                          <div className="text-[11px] font-bold text-white tracking-tight leading-tight">
                            {badge.display_name}
                          </div>
                        </div>
                      </a>
                    ))}
                </div>
              </div>

              {/* SECTION C: SOCIAL MEDIA ICONS */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Connect with us
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {socialIcons
                    .filter((s) => s.is_enabled)
                    .map((soc) => (
                      <a
                        key={soc.id}
                        href={soc.destination_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition shadow-2xs group"
                        title={soc.display_name}
                      >
                        <SocialBrandIcon
                          platform={soc.platform || soc.display_name}
                          className="w-3.5 h-3.5 text-slate-300 group-hover:text-white"
                        />
                        <span className="text-[11px] font-semibold tracking-tight">
                          {soc.display_name}
                        </span>
                      </a>
                    ))}
                </div>
              </div>

              {/* Support & Legal Links */}
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 space-y-1.5">
                <div className="flex items-center justify-center gap-3 font-semibold text-slate-400">
                  <a href="#" className="hover:underline">Support</a>
                  <span>•</span>
                  <a href="#" className="hover:underline">Privacy Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:underline">Terms & Conditions</a>
                </div>
                <div>{copyrightText}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

