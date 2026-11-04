"use client";

import React, { useState } from "react";
import { X, Smartphone, Globe, Apple, CheckCircle2, ShieldCheck, MapPin, Tag, Calendar, ExternalLink } from "lucide-react";

export type PreviewMode = "ANDROID" | "IOS" | "WEB";

interface UnifiedPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "CAMPAIGN" | "NORMAL_PUSH" | "COUPON" | "IN_APP";
  data: any;
}

export function UnifiedPreviewModal({
  isOpen,
  onClose,
  title,
  type,
  data,
}: UnifiedPreviewModalProps) {
  const [mode, setMode] = useState<PreviewMode>(type === "COUPON" || type === "IN_APP" ? "WEB" : "ANDROID");

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#0076D7]/10 text-[#0076D7] tracking-wider">
                {type.replace("_", " ")} PREVIEW
              </span>
              <span className="text-xs text-slate-400 font-medium">Read-only Simulation</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mt-1 truncate max-w-sm">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Device Switcher Tabs */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {(type === "CAMPAIGN" || type === "NORMAL_PUSH") && (
              <>
                <button
                  type="button"
                  onClick={() => setMode("ANDROID")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    mode === "ANDROID"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Android Lockscreen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("IOS")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    mode === "IOS"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Apple className="w-3.5 h-3.5 text-slate-800" />
                  <span>iOS Banner</span>
                </button>
              </>
            )}

            {(type === "COUPON" || type === "IN_APP") && (
              <>
                <button
                  type="button"
                  onClick={() => setMode("WEB")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    mode === "WEB"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#0076D7]" />
                  <span>Customer Website</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("ANDROID")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    mode === "ANDROID"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-800" />
                  <span>Mobile App Card</span>
                </button>
              </>
            )}
          </div>

          <div className="text-[11px] font-semibold text-slate-400">
            {data.target_city || data.applicable_city || "All Andhra Pradesh"}
          </div>
        </div>

        {/* Modal Scrollable Canvas */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/60 flex flex-col items-center justify-center min-h-[300px]">
          {/* 1. CAMPAIGN & NORMAL PUSH */}
          {(type === "CAMPAIGN" || type === "NORMAL_PUSH") && (
            <div className="w-full max-w-md space-y-4">
              {mode === "ANDROID" ? (
                /* Android Dark Style Lockscreen Notification */
                <div className="bg-[#121B2B] text-white p-4 rounded-2xl shadow-xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#0076D7] flex items-center justify-center font-black text-[9px] text-white">
                        H
                      </div>
                      <span className="font-bold text-slate-200">HELLO</span>
                      <span>•</span>
                      <span>Just now</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{data.target_city || "AP"}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white tracking-wide">
                    {data.notification_title || data.title || data.title_template}
                  </h4>

                  <p className="text-[11.5px] text-slate-300 leading-relaxed">
                    {data.notification_body || data.message || data.body_template}
                  </p>

                  {data.banner_url && (
                    <div className="mt-2 h-32 rounded-xl bg-slate-800 overflow-hidden relative">
                      <img src={data.banner_url} alt="Banner" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Tap to view in HELLO App</span>
                    <span className="text-[#0076D7] font-semibold">Priority: {data.priority || "NORMAL"}</span>
                  </div>
                </div>
              ) : (
                /* iOS Translucent Glass Style Banner */
                <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200/80 space-y-2 text-slate-900">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-md bg-[#0076D7] flex items-center justify-center font-black text-[9px] text-white">
                        H
                      </div>
                      <span className="font-bold text-slate-900">HELLO</span>
                    </div>
                    <span>now</span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900">
                    {data.notification_title || data.title || data.title_template}
                  </h4>

                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    {data.notification_body || data.message || data.body_template}
                  </p>
                </div>
              )}

              {/* Resolution Note */}
              <div className="text-center text-[11px] text-slate-400">
                Operating-system rendering may vary slightly based on user font scaling and device theme.
              </div>
            </div>
          )}

          {/* 2. COUPON PREVIEW */}
          {type === "COUPON" && (
            <div className="w-full max-w-md space-y-4">
              {mode === "WEB" ? (
                /* Website Coupon Badge Card */
                <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-[#0076D7] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0076D7]">
                      <Tag className="w-4 h-4" />
                      <span>{data.applicable_city || "All Andhra Pradesh"}</span>
                    </div>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      {data.status || "ACTIVE"}
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-black text-[#0B1220]">
                      {data.discount_type === "FIXED" ? `₹${data.discount_value} OFF` : `${data.discount_value}% OFF`}
                    </div>
                    <div className="font-bold text-sm text-slate-800 mt-0.5">{data.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{data.description}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Use Code</div>
                      <div className="font-mono font-black text-sm text-[#0076D7] tracking-wider">{data.code}</div>
                    </div>
                    <div className="text-right text-[11px] text-slate-500 font-semibold">
                      Min order: ₹{data.min_order_value}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                    Terms: {data.terms || "Standard platform coupon terms apply."}
                  </div>
                </div>
              ) : (
                /* Mobile App Gradient Coupon Card */
                <div className="bg-gradient-to-br from-[#0076D7] to-[#0B1220] text-white p-5 rounded-2xl shadow-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-white/20 px-2 py-0.5 rounded-md font-bold text-[10px]">
                      {data.applicable_city || "AP"}
                    </span>
                    <span className="text-white/80 font-medium">Single Use</span>
                  </div>

                  <div>
                    <div className="text-3xl font-black tracking-tight">
                      {data.discount_type === "FIXED" ? `₹${data.discount_value} OFF` : `${data.discount_value}% OFF`}
                    </div>
                    <div className="font-bold text-sm text-white/95 mt-0.5">{data.title}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <div className="bg-white text-[#0076D7] px-3 py-1 rounded-lg font-mono font-extrabold text-xs">
                      {data.code}
                    </div>
                    <div className="text-[11px] text-white/80 font-medium">
                      Min: ₹{data.min_order_value}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. IN-APP NOTIFICATION */}
          {type === "IN_APP" && (
            <div className="w-full max-w-md space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-[#0076D7] uppercase tracking-wider text-[10px]">
                    {data.category || "ANNOUNCEMENT"}
                  </span>
                  <span>Just now</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{data.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{data.message}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Location: {data.target_city || "All Cities"}</span>
                  <span className="text-emerald-600 font-semibold">{data.status || "PUBLISHED"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Simulated view for verified administrators.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

