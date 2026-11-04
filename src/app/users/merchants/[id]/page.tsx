"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Store, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Edit3, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Navigation, 
  RefreshCw, 
  AlertCircle,
  ShieldCheck,
  Building2,
  Trash2,
  User,
  FileText,
  ExternalLink,
  Globe,
  Upload
} from "lucide-react";
import { AdminLayout } from "@/components/shared";

interface MerchantDetailData {
  id: string;
  name: string;
  legal_name?: string;
  business_type?: string;
  slug?: string;
  description?: string;
  logo_url?: string;
  cover_image_url?: string;
  primary_phone: string;
  whatsapp_number?: string;
  support_email?: string;
  status: string;
  is_verified: number;
  user_id?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  preferred_language?: string;
  identity_proof_type?: string;
  identity_proof_number?: string;
  identity_proof_file_url?: string;
  city_id?: string;
  city_name?: string;
  locality_id?: string;
  locality_name?: string;
  address?: string;
  landmark?: string;
  pincode?: string;
  category_id?: string;
  category_name?: string;
  joined?: string;
  created_at?: string;
  updated_at?: string;
  documents?: any[];
}

const API_BASE = "http://localhost:4000/api/v1";

export default function MerchantViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<MerchantDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingKyc, setIsProcessingKyc] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchMerchant = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/admin/merchants/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setError(json.message || "Failed to load merchant record");
      }
    } catch (err: any) {
      setError(err?.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMerchant();
  }, [id]);

  const handleApproveKyc = async () => {
    if (!data) return;
    const recipientInfo = data.owner_email || data.support_email || "the partner";
    if (!confirm(`Are you sure you want to approve KYC for "${data.name}"? This will verify documents, activate the Verified Trust Badge, and automatically trigger an approval confirmation email to ${recipientInfo}.`)) {
      return;
    }
    try {
      setIsProcessingKyc(true);
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccessMsg(`KYC Approved successfully! Verified trust badge activated and notification email dispatched.`);
        await fetchMerchant();
        setTimeout(() => setActionSuccessMsg(null), 6000);
      } else {
        alert(json.message || "Approval failed");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsProcessingKyc(false);
    }
  };

  const handleRejectKyc = async () => {
    if (!data) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason explaining what documents need correction.");
      return;
    }
    try {
      setIsProcessingKyc(true);
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason.trim() })
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccessMsg(`KYC marked as Rejected. Notification email sent to partner with corrections required.`);
        setIsRejectModalOpen(false);
        setRejectionReason("");
        await fetchMerchant();
        setTimeout(() => setActionSuccessMsg(null), 6000);
      } else {
        alert(json.message || "Rejection failed");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsProcessingKyc(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete merchant "${data?.name}" (${id})? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/merchants/${id}/delete`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        router.push("/users/merchants");
      } else {
        alert(json.message || "Delete failed");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const calculateCompletion = () => {
    if (!data) return 0;
    let score = 0;
    if (data.owner_name && data.owner_name !== "Not Provided") score += 15;
    if (data.owner_phone) score += 15;
    if (data.name && data.name !== "Business Setup Pending") score += 20;
    if (data.legal_name && data.legal_name !== "Not Provided") score += 10;
    if (data.category_name) score += 10;
    if (data.city_name && data.city_name !== "Location Pending") score += 10;
    if (data.address && data.address !== "Address Not Provided") score += 10;
    if (data.documents && data.documents.length > 0) score += 10;
    return Math.min(100, score);
  };

  const completionPct = calculateCompletion();
  const reviewRemark = data?.documents?.find((d) => d.rejection_reason)?.rejection_reason || null;

  return (
    <AdminLayout activeTab="Users">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        
        {/* Navigation Breadcrumb / Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/users/merchants"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Merchants Directory
          </Link>

          {data && (
            <div className="flex items-center gap-2">
              <Link
                href={`/users/merchants/${id}/edit`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading merchant profile details...</p>
          </div>
        ) : error || !data ? (
          <div className="bg-white rounded-3xl p-8 border border-red-200 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Merchant Not Found</h3>
            <p className="text-xs text-slate-500">{error || "Unable to locate this merchant record in the database."}</p>
            <Link
              href="/users/merchants"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
            >
              Return to Merchants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {/* TOP PROFILE HEADER HERO CARD (MATCHING USER PROFILE SCREENSHOT) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-md">
                  {data.owner_name ? data.owner_name.charAt(0).toUpperCase() : "M"}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {data.owner_name}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        data.is_verified === 1
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {data.is_verified === 1 ? "VERIFIED BUSINESS" : "PENDING VERIFICATION"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Store className="w-3.5 h-3.5 text-blue-600" /> {data.name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {data.primary_phone || data.owner_phone}
                    </span>
                  </div>
                  {reviewRemark && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] bg-red-50 text-red-700 px-3 py-1 rounded-xl border border-red-200 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                      <span><strong>Super Admin Review Remark:</strong> {reviewRemark}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Completion Widget */}
              <div className="w-full md:w-64 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shrink-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Profile Completion</span>
                  <span className="font-extrabold text-[#0076D7]">{completionPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">
                  {completionPct >= 80 
                    ? "Great job! Profile requirements are satisfied and ready for verified badge." 
                    : "Complete all storefront and statutory KYC sections to achieve verified status."}
                </p>
              </div>
            </div>

            {/* TWO-COLUMN GRID: 1. PERSONAL INFORMATION & 2. BUSINESS INFORMATION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ========================================================= */}
              {/* SECTION 1: PERSONAL INFORMATION                            */}
              {/* ========================================================= */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">1. Personal Information</h3>
                      <p className="text-[11px] text-slate-400">Registered business owner credentials</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                    Owner Identity
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Full Legal Name *</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold">
                      {data.owner_name || "Not Provided"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Verified Mobile Number</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono">
                        {data.owner_phone || data.primary_phone || "Not Provided"}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ Verified via OTP Authentication</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Business Email Address (Optional)</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 truncate">
                        {data.owner_email || data.support_email || "Not Provided"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Preferred Language</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900">
                        {data.preferred_language || "English"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Voluntary ID Proof Type</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900">
                        {data.identity_proof_type || "None / Will Provide Later"}
                      </div>
                    </div>
                  </div>

                  {data.identity_proof_type && data.identity_proof_type !== "None / Will Provide Later" && (
                    <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {data.identity_proof_type} Document
                        </span>
                        {data.identity_proof_file_url ? (
                          <a
                            href={data.identity_proof_file_url.startsWith("http") ? data.identity_proof_file_url : `http://localhost:4000${data.identity_proof_file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#0076D7] hover:underline flex items-center gap-1"
                          >
                            View Document <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">No File Uploaded</span>
                        )}
                      </div>

                      {/* Image / File Preview */}
                      {data.identity_proof_file_url && (
                        <div className="w-full h-36 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2 relative shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={data.identity_proof_file_url.startsWith("http") ? data.identity_proof_file_url : `http://localhost:4000${data.identity_proof_file_url}`}
                            alt="Identity Document Preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // If PDF or broken image, fallback gracefully
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      {data.identity_proof_number && (
                        <div className="text-[11px] text-slate-600 font-mono">
                          ID Number: <span className="font-bold text-slate-900">{data.identity_proof_number}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION 2: BUSINESS INFORMATION                            */}
              {/* ========================================================= */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center font-bold">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">2. Business Information</h3>
                      <p className="text-[11px] text-slate-400">Public storefront &amp; entity profile</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-orange-50 text-[#FF6B35] px-2.5 py-0.5 rounded-full font-bold">
                    Directory Profile
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Business / Shop Name *</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold">
                        {data.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Legal Entity Name (As in Documents)</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium">
                        {data.legal_name || "Not Provided"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Business Type / Constitution</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900">
                        {data.business_type || "Individual / Sole Proprietor"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Primary Category *</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-blue-700 font-bold">
                        {data.category_name || "General Merchant"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Business Description</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 leading-relaxed min-h-[60px]">
                      {data.description || "No description provided."}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Customer Calling Line</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono">
                        {data.primary_phone || "Not Provided"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">WhatsApp Enquiry Number</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono">
                        {data.whatsapp_number || data.primary_phone || "Not Provided"}
                      </div>
                    </div>
                  </div>

                  {/* Business Logo & Cover Banner */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="block text-[11px] font-bold text-slate-700 mb-2">Business Logo &amp; Cover Banner</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Logo (Square)</span>
                        <div className="w-full h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                          {data.logo_url ? (
                            <img 
                              src={data.logo_url.startsWith("http") ? data.logo_url : `http://localhost:4000${data.logo_url}`} 
                              alt="Logo" 
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">No Logo Uploaded</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Cover Banner (16:9)</span>
                        <div className="w-full h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                          {data.cover_image_url ? (
                            <img 
                              src={data.cover_image_url.startsWith("http") ? data.cover_image_url : `http://localhost:4000${data.cover_image_url}`} 
                              alt="Cover Banner" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">No Banner Uploaded</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* TWO-COLUMN GRID: 3. BUSINESS ADDRESS & 4. BUSINESS REGISTRATION PROOF */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ========================================================= */}
              {/* SECTION 3: BUSINESS ADDRESS                                */}
              {/* ========================================================= */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">3. Business Address</h3>
                      <p className="text-[11px] text-slate-400">Shop premises &amp; customer navigation</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
                    Hyperlocal Hub
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">State / Jurisdiction</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900">
                        Andhra Pradesh &amp; Telangana
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">City Hub *</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold">
                        {data.city_name || "Vijayawada"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Locality / Area *</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium">
                        {data.locality_name || "Benz Circle"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">PIN Code *</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono">
                        {data.pincode || "520010"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Premises / Street Address</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900">
                      {data.address || "Address Not Provided"}
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION 4: BUSINESS REGISTRATION PROOF                     */}
              {/* ========================================================= */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">4. Business Registration Proof</h3>
                      <p className="text-[11px] text-slate-400">Primary legal establishment documentation</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">
                    KYC Level 1
                  </span>
                </div>

                {(() => {
                  const proofDocs = data.documents ? data.documents.filter((d: any) => d.document_category === "BUSINESS_PROOF" || (!d.document_category && !d.document_type?.includes("License") && !d.document_type?.includes("FSSAI") && !d.document_type?.includes("NOC"))) : [];
                  if (proofDocs.length === 0) {
                    return (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 space-y-1">
                        <p className="font-bold text-slate-700">No primary business proof uploaded yet.</p>
                        <p className="text-[11px]">Merchant can upload GST, MSME, or Municipal Trade License.</p>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {proofDocs.map((doc: any) => (
                        <div key={doc.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Document Option</label>
                            <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900">
                              {doc.document_type || "GST Registration Certificate"}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Registration / Document Number</label>
                              <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900">
                                {doc.document_number || "Self-declared / In Review"}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Expiry Date</label>
                              <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900">
                                {doc.expiry_date || "Permanent / No Expiry"}
                              </div>
                            </div>
                          </div>

                          {/* Document Thumbnail / Image Preview */}
                          {doc.file_url && (
                            <div className="w-full h-36 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2 relative shadow-2xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={doc.file_url.startsWith("http") ? doc.file_url : `http://localhost:4000${doc.file_url}`}
                                alt="Registration Document Preview"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </div>
                          )}

                          <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              doc.verification_status === "VERIFIED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}>
                              <CheckCircle2 className="w-3 h-3" /> {doc.verification_status || "PENDING"}
                            </span>
                            {doc.file_url && (
                              <a
                                href={doc.file_url.startsWith("http") ? doc.file_url : `http://localhost:4000${doc.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-[#0076D7] hover:underline flex items-center gap-1"
                              >
                                View File <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* ========================================================= */}
            {/* ROW 3: SECTIONS 5 & 6 SIDE BY SIDE                        */}
            {/* ========================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

              {/* SECTION 5: CATEGORY-SPECIFIC STATUTORY LICENSES */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 h-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">5. Category-Specific Statutory Licenses</h3>
                      <p className="text-[11px] text-slate-500">
                        Sector regulations dynamically required for <span className="font-bold text-[#0076D7]">{data.category_name}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-[#0076D7] px-2.5 py-0.5 rounded-full font-bold">
                    Dynamic Statutory Rules
                  </span>
                </div>

                {data.documents && data.documents.filter((d) => d.document_category === "CATEGORY_LICENSE" || d.document_type?.includes("License") || d.document_type?.includes("FSSAI") || d.document_type?.includes("NOC")).length > 0 ? (
                  <div className="space-y-3">
                    {data.documents
                      .filter((d) => d.document_category === "CATEGORY_LICENSE" || d.document_type?.includes("License") || d.document_type?.includes("FSSAI") || d.document_type?.includes("NOC"))
                      .map((lic: any) => (
                        <div key={lic.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-bold text-slate-900">{lic.document_type}</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              {lic.verification_status || "PENDING"}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-600">License Number: {lic.document_number || "—"}</div>
                          {lic.file_url && (
                            <div className="w-full h-32 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2 relative shadow-2xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={lic.file_url.startsWith("http") ? lic.file_url : `http://localhost:4000${lic.file_url}`}
                                alt="Statutory License Preview"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          {lic.file_url && (
                            <a
                              href={lic.file_url.startsWith("http") ? lic.file_url : `http://localhost:4000${lic.file_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              Inspect License <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500">
                    No mandatory statutory sector licenses are required for this general category. General business proof is sufficient.
                  </div>
                )}
              </div>

              {/* SECTION 6: UPLOADED DOCUMENTS & VERIFICATION STATUS */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 h-full">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">6. Uploaded Documents &amp; Verification Status</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">Active documents audited by Super Admin</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                    {data.documents?.length || 0} {(data.documents?.length || 0) === 1 ? "Doc" : "Docs"} On File
                  </span>
                </div>

                {data.documents && data.documents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Document</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.documents.map((doc: any) => (
                          <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-900">{doc.document_type}</div>
                              <div className="font-mono text-[10px] text-slate-500">{doc.document_number || "—"}</div>
                              {doc.rejection_reason && (
                                <div className="text-[10px] text-slate-400 mt-0.5 italic">{doc.rejection_reason}</div>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              {doc.verification_status === "VERIFIED" ? (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                                </span>
                              ) : doc.verification_status === "REJECTED" ? (
                                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-rose-600" /> Rejected
                                </span>
                              ) : (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-600" /> Under Review
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              {doc.file_url && (
                                <a
                                  href={doc.file_url.startsWith("http") ? doc.file_url : `http://localhost:4000${doc.file_url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0076D7] hover:underline font-bold inline-flex items-center gap-1 text-[11px]"
                                >
                                  View <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500 space-y-1">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-700">No verification documents uploaded yet.</p>
                    <p className="text-[11px]">Merchant has not submitted registration proof documents.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}


        {/* Success Action Notification Banner */}
        {actionSuccessMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 max-w-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs font-semibold">{actionSuccessMsg}</p>
          </div>
        )}

        {/* KYC Rejection Modal with Dynamic Remarks & Email Notice */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Reject KYC Verification</h3>
                    <p className="text-[11px] text-slate-500">{data?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Rejection Reason / Required Corrections:
                </label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. GST certificate mismatch with trade name; please upload legible copy of PAN card and recent electricity bill."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  📧 <strong>Dynamic Email Notice:</strong> This remark will be formatted into the <em>Merchant KYC Verification Requires Attention</em> email template and automatically sent to <strong>{data?.owner_email || data?.support_email || "the merchant"}</strong> with a link to re-upload documents.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectKyc}
                  disabled={isProcessingKyc || !rejectionReason.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl shadow-xs"
                >
                  {isProcessingKyc ? "Processing..." : "Confirm Rejection & Dispatch Email"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
