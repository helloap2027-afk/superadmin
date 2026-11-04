"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Store, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  Save,
  Mail, 
  CheckCircle2,
  User,
  MapPin,
  FileText,
  ShieldCheck,
  Upload,
  ExternalLink,
  Image as ImageIcon,
  Camera,
  X,
  Loader2
} from "lucide-react";
import { AdminLayout } from "@/components/shared";

const API_BASE = "http://localhost:4000/api/v1";

export default function MerchantEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [sendingReminder, setSendingReminder] = useState(false);

  const handleSendKycReminder = async () => {
    const recipient = form.ownerEmail || "the merchant";
    if (!confirm(`Send an official KYC verification reminder email to "${form.businessName}" (${recipient})?`)) {
      return;
    }
    try {
      setSendingReminder(true);
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/kyc-reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg(json.message || "KYC Reminder email sent successfully!");
        setTimeout(() => setSuccessMsg(null), 6000);
      } else {
        alert(json.message || "Failed to send reminder");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setSendingReminder(false);
    }
  };

  // Lookups
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const [merchantDocs, setMerchantDocs] = useState<any[]>([]);

  // Exact fields matching Business Partner Profile on website
  const [form, setForm] = useState({
    // Section 1: Personal Information
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    preferredLanguage: "English",
    identityProofType: "None / Will Provide Later",
    identityProofNumber: "",
    identityProofFileUrl: "",

    // Section 2: Business Information
    businessName: "",
    legalEntityName: "",
    businessType: "Individual / Sole Proprietor",
    categoryId: "",
    categoryName: "",
    description: "",
    customerCallingLine: "",
    whatsappNumber: "",
    logoUrl: "",
    coverImageUrl: "",

    // Section 3: Business Address
    state: "Andhra Pradesh & Telangana",
    cityId: "",
    cityName: "",
    localityName: "",
    pincode: "",
    streetAddress: "",

    // Verification & Admin Status
    status: "APPROVED",
    isVerified: true,
  });

  useEffect(() => {
    // 1. Fetch categories
    fetch(`${API_BASE}/categories`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) setCategories(json.data);
      })
      .catch(() => {});

    // 2. Fetch cities
    fetch(`${API_BASE}/locations/cities`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) setCities(json.data);
      })
      .catch(() => {});

    // 3. Fetch current merchant data
    if (id) {
      setLoading(true);
      fetch(`${API_BASE}/admin/merchants/${id}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            const d = json.data;
            if (Array.isArray(d.documents)) {
              setMerchantDocs(d.documents);
            }
            setForm({
              ownerName: d.owner_name && d.owner_name !== "Not Provided" ? d.owner_name : "",
              ownerPhone: d.owner_phone || d.primary_phone || "",
              ownerEmail: d.owner_email && d.owner_email !== "Not Provided" ? d.owner_email : "",
              preferredLanguage: d.preferred_language || "English",
              identityProofType: d.identity_proof_type || "None / Will Provide Later",
              identityProofNumber: d.identity_proof_number || "",
              identityProofFileUrl: d.identity_proof_file_url || "",

              businessName: d.name && d.name !== "Business Setup Pending" ? d.name : "",
              legalEntityName: d.legal_name && d.legal_name !== "Not Provided" ? d.legal_name : "",
              businessType: d.business_type || "Individual / Sole Proprietor",
              categoryId: d.category_id || "",
              categoryName: d.category_name || "",
              description: d.description && !d.description.startsWith("New partner registered") ? d.description : "",
              customerCallingLine: d.primary_phone || "",
              whatsappNumber: d.whatsapp_number || d.primary_phone || "",
              logoUrl: d.logo_url || "",
              coverImageUrl: d.cover_image_url || "",

              state: "Andhra Pradesh & Telangana",
              cityId: d.city_id || "",
              cityName: d.city_name && d.city_name !== "Location Pending" ? d.city_name : "Vijayawada",
              localityName: d.locality_name && d.locality_name !== "Pending" ? d.locality_name : "",
              pincode: d.pincode && d.pincode !== "Pending" ? d.pincode : "520010",
              streetAddress: d.address && d.address !== "Address Not Provided" ? d.address : "",

              status: d.status || "APPROVED",
              isVerified: d.is_verified === 1,
            });
          } else {
            setError(json.message || "Could not load merchant details");
          }
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Load localities whenever cityName changes
  useEffect(() => {
    if (form.cityName) {
      fetch(`${API_BASE}/locations/localities?city=${encodeURIComponent(form.cityName)}`)
        .then((r) => r.json())
        .then((json) => {
          if (json?.success && Array.isArray(json.data)) {
            setLocalities(json.data);
          }
        })
        .catch(() => {});
    }
  }, [form.cityName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg(null);
      setError(null);

      const res = await fetch(`${API_BASE}/admin/merchants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Personal Info
          owner_name: form.ownerName,
          owner_phone: form.ownerPhone,
          owner_email: form.ownerEmail,
          preferred_language: form.preferredLanguage,
          identity_proof_type: form.identityProofType,
          identity_proof_number: form.identityProofNumber,
          identity_proof_file_url: form.identityProofFileUrl,

          // Business Info
          name: form.businessName,
          legal_name: form.legalEntityName,
          business_type: form.businessType,
          category_id: form.categoryId,
          category_name: form.categoryName,
          description: form.description,
          primary_phone: form.customerCallingLine || form.ownerPhone,
          whatsapp_number: form.whatsappNumber || form.customerCallingLine || form.ownerPhone,
          logo_url: form.logoUrl,
          cover_image_url: form.coverImageUrl,

          // Business Address
          city_id: form.cityId,
          city_name: form.cityName,
          locality_name: form.localityName,
          pincode: form.pincode,
          address: form.streetAddress,

          // Status
          status: form.status,
          is_verified: form.isVerified,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg("Merchant details updated successfully in database!");
        setTimeout(() => {
          router.push(`/users/merchants/${id}`);
        }, 1200);
      } else {
        setError(json.message || "Failed to update merchant");
      }
    } catch (err: any) {
      setError(err?.message || "Error saving merchant");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout activeTab="Users">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href={`/users/merchants/${id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Merchant View
          </Link>
          <span className="text-xs text-slate-400 font-mono">ID: {id}</span>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading merchant profile form...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Notification Alerts */}
            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-800 font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TOP ACTIONS BAR */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Edit Business Partner Profile
                </h1>
                <p className="text-xs text-slate-500">
                  Update owner credentials, storefront details, address, and verification status.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/users/merchants/${id}`)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: PERSONAL INFORMATION & SECTION 2: BUSINESS INFORMATION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ========================================================= */}
              {/* 1. PERSONAL INFORMATION                                    */}
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={form.ownerName}
                      onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Verified Mobile Number *</label>
                      <input
                        type="text"
                        required
                        value={form.ownerPhone}
                        onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
                        placeholder="+919848012345"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Business Email Address (Optional)</label>
                      <input
                        type="email"
                        value={form.ownerEmail}
                        onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                        placeholder="owner@business.in"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
                      <select
                        value={form.preferredLanguage}
                        onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      >
                        <option value="English">English</option>
                        <option value="Telugu">Telugu (తెలుగు)</option>
                        <option value="Hindi">Hindi (हिन्दी)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Voluntary ID Proof Type</label>
                      <select
                        value={form.identityProofType}
                        onChange={(e) => setForm({ ...form, identityProofType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      >
                        <option value="None / Will Provide Later">None / Will Provide Later</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Passport">Passport</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Offline Aadhaar">Offline Masked Aadhaar</option>
                        <option value="PAN Card">PAN Card</option>
                      </select>
                    </div>
                  </div>

                  {form.identityProofType && form.identityProofType !== "None / Will Provide Later" && (
                    <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {form.identityProofType} Document
                        </span>
                        {form.identityProofFileUrl && (
                          <a
                            href={form.identityProofFileUrl.startsWith("http") ? form.identityProofFileUrl : `http://localhost:4000${form.identityProofFileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#0076D7] hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View Current Document
                          </a>
                        )}
                      </div>

                      {/* Live Document Preview Card */}
                      {form.identityProofFileUrl && (
                        <div className="space-y-1.5">
                          <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                            Document Preview
                          </span>
                          <div className="w-full h-32 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2 relative shadow-2xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={form.identityProofFileUrl.startsWith("http") || form.identityProofFileUrl.startsWith("data:") ? form.identityProofFileUrl : `http://localhost:4000${form.identityProofFileUrl}`}
                              alt="Document Preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {form.identityProofType} Number
                          </label>
                          <input
                            type="text"
                            value={form.identityProofNumber}
                            onChange={(e) => setForm({ ...form, identityProofNumber: e.target.value })}
                            placeholder="e.g. XXXX-XXXX-9999 / ABCDE1234F"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Replace / Upload Document File
                          </label>
                          <div className="relative border border-dashed border-blue-300 rounded-xl py-2 px-3 text-center bg-white cursor-pointer hover:border-[#0076D7] transition">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setForm({ ...form, identityProofFileUrl: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <span className="text-xs text-slate-600 truncate block">
                              {form.identityProofFileUrl?.startsWith("data:") ? "New document selected" : form.identityProofFileUrl ? "Change Document File" : "Select Document File (PDF/Image)"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================= */}
              {/* 2. BUSINESS INFORMATION                                    */}
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Business / Shop Name *</label>
                      <input
                        type="text"
                        required
                        value={form.businessName}
                        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                        placeholder="e.g. Amravati Grand Restaurant"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Legal Entity Name</label>
                      <input
                        type="text"
                        value={form.legalEntityName}
                        onChange={(e) => setForm({ ...form, legalEntityName: e.target.value })}
                        placeholder="e.g. Amravati Hospitality Pvt Ltd"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Business Type / Constitution</label>
                      <select
                        value={form.businessType}
                        onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Individual / Sole Proprietor">Individual / Sole Proprietor</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Private Limited Company">Private Limited Company</option>
                        <option value="LLP">Limited Liability Partnership (LLP)</option>
                        <option value="Society / Trust / NGO">Society / Trust / NGO</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Primary Category *</label>
                      <select
                        required
                        value={form.categoryId}
                        onChange={(e) => {
                          const cat = categories.find((c) => c.id === e.target.value);
                          setForm({ ...form, categoryId: e.target.value, categoryName: cat?.name || form.categoryName });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Business Description</label>
                    <textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Brief summary of offerings, cuisine, services..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Customer Calling Line</label>
                      <input
                        type="text"
                        value={form.customerCallingLine}
                        onChange={(e) => setForm({ ...form, customerCallingLine: e.target.value })}
                        placeholder="+919848011111"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Enquiry Number</label>
                      <input
                        type="text"
                        value={form.whatsappNumber}
                        onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                        placeholder="+919848011111"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Business Logo & Cover Banner Upload with Live Previews */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#FF6B35]" />
                      Business Logo &amp; Cover Banner
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* LOGO */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                          LOGO <span className="text-slate-400 font-normal normal-case">(Square · max 2MB)</span>
                        </label>

                        <label className="block cursor-pointer group relative">
                          <div className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-[#FF6B35] bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition relative">
                            {form.logoUrl ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={form.logoUrl.startsWith("http") || form.logoUrl.startsWith("data:") ? form.logoUrl : `http://localhost:4000${form.logoUrl}`}
                                  alt="Business logo"
                                  className="w-full h-full object-contain p-2"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <Camera className="w-5 h-5 text-white" />
                                  <span className="text-white text-[10px] font-bold ml-1">Change Logo</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <Camera className="w-6 h-6 text-slate-400 group-hover:text-[#FF6B35] transition" />
                                <span className="text-[10px] text-slate-500 mt-1 font-semibold">Upload Logo</span>
                                <span className="text-[9px] text-slate-400">PNG, JPG, SVG</span>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 2 * 1024 * 1024) {
                                alert("Logo image exceeds 2MB limit.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setForm({ ...form, logoUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>

                        {form.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, logoUrl: "" })}
                            className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
                          >
                            <X className="w-3 h-3" /> Remove logo
                          </button>
                        )}
                      </div>

                      {/* COVER BANNER */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                          COVER BANNER <span className="text-slate-400 font-normal normal-case">(16:9 · max 5MB)</span>
                        </label>

                        <label className="block cursor-pointer group relative">
                          <div className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-[#FF6B35] bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition relative">
                            {form.coverImageUrl ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={form.coverImageUrl.startsWith("http") || form.coverImageUrl.startsWith("data:") ? form.coverImageUrl : `http://localhost:4000${form.coverImageUrl}`}
                                  alt="Cover banner"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <ImageIcon className="w-5 h-5 text-white" />
                                  <span className="text-white text-[10px] font-bold ml-1">Change Banner</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-[#FF6B35] transition" />
                                <span className="text-[10px] text-slate-500 mt-1 font-semibold">Upload Cover Banner</span>
                                <span className="text-[9px] text-slate-400">PNG, JPG, WebP</span>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                alert("Cover banner image exceeds 5MB limit.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setForm({ ...form, coverImageUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>

                        {form.coverImageUrl && (
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, coverImageUrl: "" })}
                            className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
                          >
                            <X className="w-3 h-3" /> Remove banner
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      Tip: A high-quality logo and banner improve your business listing visibility and build customer trust on HELLO-Hi.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* SECTION 3: BUSINESS ADDRESS & SECTION 4: SUPER ADMIN STATUS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ========================================================= */}
              {/* 3. BUSINESS ADDRESS                                        */}
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">State / Jurisdiction</label>
                      <input
                        type="text"
                        disabled
                        value="Andhra Pradesh & Telangana"
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 font-medium cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City Hub *</label>
                      <select
                        required
                        value={form.cityId}
                        onChange={(e) => {
                          const city = cities.find((c) => c.id === e.target.value);
                          setForm({ ...form, cityId: e.target.value, cityName: city?.name || form.cityName });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select City</option>
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Area *</label>
                      {localities.length > 0 ? (
                        <select
                          value={form.localityName}
                          onChange={(e) => setForm({ ...form, localityName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Select Locality</option>
                          {localities.map((loc) => (
                            <option key={loc.id} value={loc.name}>{loc.name}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={form.localityName}
                          onChange={(e) => setForm({ ...form, localityName: e.target.value })}
                          placeholder="e.g. Benz Circle / Hitec City"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        placeholder="520010"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Premises / Street Address</label>
                    <input
                      type="text"
                      value={form.streetAddress}
                      onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                      placeholder="e.g. MG Road, Benz Circle, Beside Grand Hotel"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* 4. SUPER ADMIN REVIEW & BADGING                           */}
              {/* ========================================================= */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Super Admin Governance &amp; Badging</h3>
                      <p className="text-[11px] text-slate-400">KYC approval and visibility governance</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">
                    Super Admin Controls
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Storefront Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="APPROVED">APPROVED (Publicly Discoverable)</option>
                      <option value="PENDING">PENDING (Awaiting Review)</option>
                      <option value="REJECTED">REJECTED (Suspended / Non-compliant)</option>
                    </select>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">KYC Verified Partner Badge</span>
                      <span className="text-[11px] text-slate-500 block">
                        Displays green verified badge on discovery cards &amp; profile page.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isVerified}
                        onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl text-[11px] text-blue-900 leading-relaxed space-y-1">
                    <p className="font-bold">Admin Synchronization Note:</p>
                    <p className="text-slate-600">
                      Saving this form directly updates both the merchant&apos;s owner profile (`users` table) and the business storefront (`businesses` table). Any changes will instantly reflect on the Partner Dashboard and public discovery app.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* TWO-COLUMN GRID: 4. BUSINESS REGISTRATION PROOF & 5. STATUTORY LICENSES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

              {/* ========================================================= */}
              {/* 4. BUSINESS REGISTRATION PROOF                            */}
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
                  const proofDocs = merchantDocs.filter(
                    (d) => d.document_category === "BUSINESS_PROOF" || (!d.document_category && !d.document_type?.includes("License") && !d.document_type?.includes("FSSAI") && !d.document_type?.includes("NOC"))
                  );
                  if (proofDocs.length === 0) {
                    return (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 space-y-1">
                        <p className="font-bold text-slate-700">No primary business registration proof uploaded yet.</p>
                        <p className="text-[11px]">Merchant can upload GST, MSME, or Municipal Trade License.</p>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {proofDocs.map((doc: any) => (
                        <div key={doc.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Document Type</label>
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
                              <label className="block text-xs font-bold text-slate-600 mb-1">Verification Status</label>
                              <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold">
                                {doc.verification_status || "PENDING"}
                              </div>
                            </div>
                          </div>

                          {/* Document Image Preview */}
                          {doc.file_url && (
                            <div className="space-y-1.5">
                              <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                                Document Preview
                              </span>
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
                                View Current Document <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* ========================================================= */}
              {/* 5. CATEGORY-SPECIFIC STATUTORY LICENSES                   */}
              {/* ========================================================= */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">5. Category-Specific Statutory Licenses</h3>
                      <p className="text-[11px] text-slate-400">
                        Sector regulations dynamically required for <span className="font-bold text-[#0076D7]">{form.categoryName}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-[#0076D7] px-2.5 py-0.5 rounded-full font-bold">
                    Dynamic Statutory Rules
                  </span>
                </div>

                {(() => {
                  const licenseDocs = merchantDocs.filter(
                    (d) => d.document_category === "CATEGORY_LICENSE" || d.document_type?.includes("License") || d.document_type?.includes("FSSAI") || d.document_type?.includes("NOC")
                  );
                  if (licenseDocs.length === 0) {
                    return (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500">
                        No mandatory statutory sector licenses uploaded yet. General business proof is sufficient.
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {licenseDocs.map((lic: any) => (
                        <div key={lic.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-bold text-slate-900">{lic.document_type}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              lic.verification_status === "VERIFIED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}>
                              {lic.verification_status || "PENDING"}
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-slate-600">
                            License Number: {lic.document_number || "Self-declared / In Review"}
                          </div>

                          {/* License Document Preview */}
                          {lic.file_url && (
                            <div className="space-y-1.5">
                              <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                                Document Preview
                              </span>
                              <div className="w-full h-36 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2 relative shadow-2xs">
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
                            </div>
                          )}

                          {lic.file_url && (
                            <a
                              href={lic.file_url.startsWith("http") ? lic.file_url : `http://localhost:4000${lic.file_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-[#0076D7] hover:underline inline-flex items-center gap-1"
                            >
                              View Current Document <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* BOTTOM SAVE BUTTON */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/users/merchants/${id}`)}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Merchant Profile</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
}
