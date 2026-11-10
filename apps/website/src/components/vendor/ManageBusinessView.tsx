"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Store,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Upload,
  Eye,
  Trash2,
  HelpCircle,
  FileText,
  ShieldCheck,
  Building2,
  MapPin,
  Award,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Check,
  CheckSquare,
  ArrowRight,
  Loader2,
  Camera,
  Image as ImageIcon,
  X
} from "lucide-react";
import { BusinessPartnerHeader } from "@/components/vendor/BusinessPartnerHeader";

export interface ManageBusinessViewProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  business: any;
  setBusiness: React.Dispatch<React.SetStateAction<any>>;
  completion: any;
  categories: any[];
  cities: any[];
  localities: any[];
  kycRequirements: any;
  uploadedDocs: any[];
  
  // Section states & handlers
  savingPersonal: boolean;
  savingBusiness: boolean;
  savingAddress: boolean;
  uploadingDoc: boolean;
  submittingKyc: boolean;
  
  handleSavePersonal: (e: React.FormEvent) => void;
  handleSaveBusiness: (e: React.FormEvent) => void;
  handleSaveAddress: (e: React.FormEvent) => void;
  handleUploadProof: (e: React.FormEvent) => void;
  handleUploadLicense: (e: React.FormEvent) => void;
  handleSubmitKyc: () => void;
  handleDeleteDoc: (id: string) => void;
  
  // Upload inputs
  selectedProofType: string;
  setSelectedProofType: (val: string) => void;
  docNumber: string;
  setDocNumber: (val: string) => void;
  issuingAuthority: string;
  setIssuingAuthority: (val: string) => void;
  issueDate: string;
  setIssueDate: (val: string) => void;
  expiryDate: string;
  setExpiryDate: (val: string) => void;
  hasNoDocument: boolean;
  setHasNoDocument: (val: boolean) => void;
  fileName: string;
  fileBase64?: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  selectedLicenseType: string;
  setSelectedLicenseType: (val: string) => void;
  licenseNumber: string;
  setLicenseNumber: (val: string) => void;
  licenseExpiryDate: string;
  setLicenseExpiryDate: (val: string) => void;
  licenseFileName: string;
  licenseFileBase64?: string | null;
  handleLicenseFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  idProofFileName: string;
  idProofFileBase64?: string | null;
  uploadingIdProof: boolean;
  handleIdProofFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingLogo?: boolean;
  uploadingBanner?: boolean;
  handleUploadLogo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadCover: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ManageBusinessView(props: ManageBusinessViewProps) {
  const {
    user,
    setUser,
    business,
    setBusiness,
    completion,
    categories,
    cities,
    localities,
    kycRequirements,
    uploadedDocs,
    savingPersonal,
    savingBusiness,
    savingAddress,
    uploadingDoc,
    submittingKyc,
    handleSavePersonal,
    handleSaveBusiness,
    handleSaveAddress,
    handleUploadProof,
    handleUploadLicense,
    handleSubmitKyc,
    handleDeleteDoc,
    selectedProofType,
    setSelectedProofType,
    docNumber,
    setDocNumber,
    issuingAuthority,
    setIssuingAuthority,
    issueDate,
    setIssueDate,
    expiryDate,
    setExpiryDate,
    hasNoDocument,
    setHasNoDocument,
    fileName,
    fileBase64,
    handleFileChange,
    selectedLicenseType,
    setSelectedLicenseType,
    licenseNumber,
    setLicenseNumber,
    licenseExpiryDate,
    setLicenseExpiryDate,
    licenseFileName,
    licenseFileBase64,
    handleLicenseFileChange,
    idProofFileName,
    idProofFileBase64,
    uploadingIdProof,
    handleIdProofFileChange,
    uploadingLogo,
    uploadingBanner,
    handleUploadLogo,
    handleUploadCover,
  } = props;

  // Active step in the horizontal stepper (1 to 6)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Accordion expanded states (all independent or single-open)
  const [expandedSection, setExpandedSection] = useState<number | null>(1);

  // Document modal viewer state
  const [viewingDoc, setViewingDoc] = useState<{ url: string; title: string } | null>(null);

  const toggleSection = (sectionIndex: number) => {
    setExpandedSection(prev => (prev === sectionIndex ? null : sectionIndex));
    setActiveStep(sectionIndex);
  };

  const openDocumentViewer = (url: string, title: string) => {
    if (!url) return;
    const finalUrl = url.startsWith("data:") || url.startsWith("http") ? url : `http://localhost:4000${url}`;
    setViewingDoc({ url: finalUrl, title });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* 1. Midnight Navy Business Partner Header */}
      <BusinessPartnerHeader activeNav="My Business" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/vendor/dashboard" className="hover:text-slate-600 transition flex items-center gap-1">
            <span className="text-sm">🏠</span>
          </Link>
          <span>&gt;</span>
          <Link href="/vendor/dashboard" className="hover:text-slate-600 transition">
            My Business
          </Link>
          <span>&gt;</span>
          <span className="text-slate-700 font-semibold">Manage Business</span>
        </nav>

        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0076D7] shadow-xs shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Manage Business
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your business information, location, services, and verification documents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={business.id ? `/${business.slug || business.id}` : "/vendor/dashboard"}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>View Public Listing</span>
            </Link>
            <Link
              href="/vendor/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#C05621] bg-[#FFFAF0] border border-[#FEEBC8] rounded-xl hover:bg-[#FEEBC8]/60 shadow-xs transition"
            >
              <span>← Back to My Business</span>
            </Link>
          </div>
        </div>

        {/* Business Summary Card (Storefront + Quick Stats) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full lg:w-auto">
            {/* Storefront Image */}
            <div className="w-32 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
              {business.coverImageUrl || business.logoUrl ? (
                <img
                  src={
                    (business.coverImageUrl || business.logoUrl).startsWith("http") || (business.coverImageUrl || business.logoUrl).startsWith("data:")
                      ? (business.coverImageUrl || business.logoUrl)
                      : `http://localhost:4000${business.coverImageUrl || business.logoUrl}`
                  }
                  alt={business.name || "Business"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                  <Store className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold">Storefront</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {business.name || "Vinod Tech Mobile Hub"}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified &amp; Active
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-[#0076D7] border border-sky-100">
                  <Store className="w-3 h-3" />
                  {business.categoryName || "Mobiles & Accessories"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {business.localityName ? `${business.localityName}, ${business.cityName}` : "Benz Circle, Vijayawada"}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {business.primaryPhone || user.phoneNumber || "+91 63027 59527"}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Pastel Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="bg-[#FAF5FF] border border-[#E9D8FD] rounded-xl px-4 py-3 text-center min-w-[95px]">
              <Eye className="w-4 h-4 text-[#805AD5] mx-auto mb-1" />
              <div className="text-base font-black text-slate-900">2,840</div>
              <div className="text-[10px] font-medium text-slate-500">Profile Views</div>
            </div>
            <div className="bg-[#EBF8FF] border border-[#BEE3F8] rounded-xl px-4 py-3 text-center min-w-[95px]">
              <FileText className="w-4 h-4 text-[#0076D7] mx-auto mb-1" />
              <div className="text-base font-black text-slate-900">32</div>
              <div className="text-[10px] font-medium text-slate-500">Enquiries</div>
            </div>
            <div className="bg-[#F0FFF4] border border-[#C6F6D5] rounded-xl px-4 py-3 text-center min-w-[95px]">
              <Phone className="w-4 h-4 text-[#38A169] mx-auto mb-1" />
              <div className="text-base font-black text-slate-900">142</div>
              <div className="text-[10px] font-medium text-slate-500">Calls</div>
            </div>
            <div className="bg-[#FFFDF0] border border-[#FEFCBF] rounded-xl px-4 py-3 text-center min-w-[95px]">
              <span className="text-[#D69E2E] text-xs font-black block mb-0.5">★</span>
              <div className="text-base font-black text-slate-900">4.8</div>
              <div className="text-[10px] font-medium text-slate-500">Rating</div>
            </div>
          </div>
        </div>

        {/* 6-Section Horizontal Step Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-semibold text-slate-600">
          {[
            { id: 1, label: "1. Personal Details", icon: User },
            { id: 2, label: "2. Business Info", icon: Store },
            { id: 3, label: "3. Address", icon: MapPin },
            { id: 4, label: "4. Registration & KYC", icon: ShieldCheck },
            { id: 5, label: "5. Licenses", icon: Award },
            { id: 6, label: "6. Documents & Status", icon: CheckCircle2 }
          ].map(tab => {
            const isActive = activeStep === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveStep(tab.id);
                  setExpandedSection(tab.id);
                }}
                className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition whitespace-nowrap ${
                  isActive
                    ? "bg-[#0076D7] text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (65% width / 8 cols) - 6 Expandable Accordions */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* 1. Personal Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
              <button
                type="button"
                onClick={() => toggleSection(1)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0076D7] flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                    <p className="text-[11px] text-slate-400">Registration details and owner identity</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Completed
                  </span>
                  {expandedSection === 1 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedSection === 1 && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  <form onSubmit={handleSavePersonal} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Legal Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={user.fullName || ""}
                          onChange={e => setUser({ ...user, fullName: e.target.value })}
                          placeholder="Vinod Mobile Verified Partner"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Verified Mobile Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={user.phoneNumber || "+91 63027 59527"}
                            disabled
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium"
                          />
                          <span className="absolute right-3 top-2.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-100">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Business Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={user.email || ""}
                          onChange={e => setUser({ ...user, email: e.target.value })}
                          placeholder="merchant@hello-hi.in"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Preferred Language
                        </label>
                        <select
                          value={user.preferredLanguage || "English"}
                          onChange={e => setUser({ ...user, preferredLanguage: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7] bg-white"
                        >
                          <option value="English">English</option>
                          <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                          <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                          <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Voluntary ID Proof Type
                        </label>
                        <select
                          value={user.identityProofType || "Aadhaar Card"}
                          onChange={e => setUser({ ...user, identityProofType: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7] bg-white"
                        >
                          <option value="Aadhaar Card">Aadhaar Card</option>
                          <option value="PAN Card">PAN Card</option>
                          <option value="Voter ID">Voter ID</option>
                          <option value="Driving License">Driving License</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          ID Proof Number
                        </label>
                        <input
                          type="text"
                          value={user.identityProofNumber || ""}
                          onChange={e => setUser({ ...user, identityProofNumber: e.target.value })}
                          placeholder="1234 5678 9012"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                        />
                      </div>
                    </div>

                    {/* Aadhaar Card Document Preview Box */}
                    <div className="mt-4 p-4 rounded-xl border border-dashed border-sky-200 bg-sky-50/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0076D7]" />
                          <span className="text-xs font-bold text-slate-800">
                            {user.identityProofType || "Aadhaar Card"} Document
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Upload front side (PDF/JPG/PNG, up to 5MB)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {/* Drag & drop upload button */}
                        <label className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#0076D7] transition text-center bg-white/60">
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-slate-700">
                            {idProofFileName ? idProofFileName : "Drag & drop or click to upload"}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            PDF, JPG, PNG (Max 5MB)
                          </span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleIdProofFileChange}
                            className="hidden"
                          />
                        </label>

                        {/* Document visual preview card */}
                        <div className="border border-slate-200 rounded-xl p-3 bg-white flex items-center justify-between shadow-2xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-9 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
                              🪪 ID
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 truncate">
                                {idProofFileName || `${user.identityProofType || "Aadhaar Card"}`}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono truncate">
                                {user.identityProofNumber || "1234 5678 9012"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                const targetUrl = idProofFileBase64 || user.identityProofFileUrl;
                                if (targetUrl) {
                                  openDocumentViewer(targetUrl, `${user.identityProofType || "ID Proof"} Document`);
                                } else {
                                  alert("Please select or upload a document file to view.");
                                }
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center gap-1 shadow-2xs"
                            >
                              <Eye className="w-3 h-3 text-slate-500" /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setUser({ ...user, identityProofFileUrl: "", identityProofNumber: "" });
                              }}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                              title="Clear selection"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={savingPersonal}
                        className="px-5 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#005FAE] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        {savingPersonal && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Save Personal Details
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* 2. Business Information + LOGO & BANNER UPLOAD */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
              <button
                type="button"
                onClick={() => toggleSection(2)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Business Information</h3>
                    <p className="text-[11px] text-slate-400">Business name, category, branding logo, cover banner, and description</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Completed
                  </span>
                  {expandedSection === 2 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedSection === 2 && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  <form onSubmit={handleSaveBusiness} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Trading / Display Business Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={business.name || ""}
                          onChange={e => setBusiness({ ...business, name: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Registered Legal Entity Name
                        </label>
                        <input
                          type="text"
                          value={business.legalName || ""}
                          onChange={e => setBusiness({ ...business, legalName: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Primary Business Category <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={business.categoryId || ""}
                          onChange={e => {
                            const sel = categories.find(c => c.id === e.target.value);
                            setBusiness({
                              ...business,
                              categoryId: e.target.value,
                              categoryName: sel?.name || business.categoryName
                            });
                          }}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7] bg-white"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((c: any) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Business Entity Type
                        </label>
                        <select
                          value={business.businessType || "Sole Proprietor"}
                          onChange={e => setBusiness({ ...business, businessType: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7] bg-white"
                        >
                          <option value="Sole Proprietor">Sole Proprietor</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Private Limited (Pvt Ltd)">Private Limited (Pvt Ltd)</option>
                          <option value="LLP">Limited Liability Partnership (LLP)</option>
                        </select>
                      </div>

                      {/* Contact Phone & WhatsApp */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Business Primary Phone
                        </label>
                        <input
                          type="text"
                          value={business.primaryPhone || ""}
                          onChange={e => setBusiness({ ...business, primaryPhone: e.target.value })}
                          placeholder="+91 63027 59527"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          WhatsApp Enquiry Number
                        </label>
                        <input
                          type="text"
                          value={business.whatsappNumber || ""}
                          onChange={e => setBusiness({ ...business, whatsappNumber: e.target.value })}
                          placeholder="+91 63027 59527"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Business Description
                        </label>
                        <textarea
                          rows={3}
                          value={business.description || ""}
                          onChange={e => setBusiness({ ...business, description: e.target.value })}
                          placeholder="Mobiles, accessories, and mobile services including sales, repairs, and genuine accessories..."
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                        />
                      </div>
                    </div>

                    {/* Logo & Banner Upload Controls Inside Section 2 */}
                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#0076D7]" />
                        <h4 className="text-xs font-bold text-slate-800">
                          Business Branding Media (Logo &amp; Cover Banner)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        {/* Logo Upload Box */}
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Business Logo</span>
                            <span className="text-[10px] text-slate-400">Square (Max 2MB)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                              {business.logoUrl ? (
                                <img
                                  src={business.logoUrl.startsWith("http") || business.logoUrl.startsWith("data:") ? business.logoUrl : `http://localhost:4000${business.logoUrl}`}
                                  alt="Logo"
                                  className="w-full h-full object-contain p-1"
                                />
                              ) : (
                                <Camera className="w-6 h-6 text-slate-300" />
                              )}
                            </div>
                            <div className="space-y-1.5 flex-1">
                              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs">
                                {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                <span>{business.logoUrl ? "Change Logo" : "Upload Logo"}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleUploadLogo}
                                  className="hidden"
                                />
                              </label>
                              {business.logoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setBusiness({ ...business, logoUrl: "" })}
                                  className="block text-[10px] text-rose-500 hover:underline"
                                >
                                  Remove Logo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Banner Upload Box */}
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Cover Banner</span>
                            <span className="text-[10px] text-slate-400">16:9 Banner (Max 5MB)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                              {business.coverImageUrl ? (
                                <img
                                  src={business.coverImageUrl.startsWith("http") || business.coverImageUrl.startsWith("data:") ? business.coverImageUrl : `http://localhost:4000${business.coverImageUrl}`}
                                  alt="Banner"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-slate-300" />
                              )}
                            </div>
                            <div className="space-y-1.5 flex-1">
                              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs">
                                {uploadingBanner ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                <span>{business.coverImageUrl ? "Change Banner" : "Upload Banner"}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleUploadCover}
                                  className="hidden"
                                />
                              </label>
                              {business.coverImageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setBusiness({ ...business, coverImageUrl: "" })}
                                  className="block text-[10px] text-rose-500 hover:underline"
                                >
                                  Remove Banner
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={savingBusiness}
                        className="px-5 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#005FAE] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        {savingBusiness && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Save Business Info
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* 3. Business Address */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
              <button
                type="button"
                onClick={() => toggleSection(3)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0076D7] flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Business Address</h3>
                    <p className="text-[11px] text-slate-400">Location, address, and service area</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Completed
                  </span>
                  {expandedSection === 3 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedSection === 3 && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Street Address / Shop No / Floor <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={business.addressLine1 || ""}
                          onChange={e => setBusiness({ ...business, addressLine1: e.target.value })}
                          placeholder="Shop #12, Ground Floor, Sai Complex, Benz Circle"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          City <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={business.cityId || ""}
                          onChange={e => {
                            const c = cities.find(item => item.id === e.target.value);
                            setBusiness({ ...business, cityId: e.target.value, cityName: c?.name || business.cityName });
                          }}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7] bg-white"
                          required
                        >
                          <option value="">Select City</option>
                          {cities.map((city: any) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Locality / Area <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={business.localityId || ""}
                          onChange={e => {
                            const l = localities.find(item => item.id === e.target.value);
                            setBusiness({ ...business, localityId: e.target.value, localityName: l?.name || business.localityName });
                          }}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7] bg-white"
                          required
                        >
                          <option value="">Select Locality</option>
                          {localities.map((loc: any) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Pincode <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={business.pincode || ""}
                          onChange={e => setBusiness({ ...business, pincode: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Prominent Landmark
                        </label>
                        <input
                          type="text"
                          value={business.landmark || ""}
                          onChange={e => setBusiness({ ...business, landmark: e.target.value })}
                          placeholder="Opposite Metro Pillar / Near Bus Stop"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={savingAddress}
                        className="px-5 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#005FAE] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        {savingAddress && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* 4. Business Registration & KYC */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
              <button
                type="button"
                onClick={() => toggleSection(4)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Business Registration &amp; KYC</h3>
                    <p className="text-[11px] text-slate-400">GST, MSME, and business registration proof</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    In Review
                  </span>
                  {expandedSection === 4 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedSection === 4 && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  <form onSubmit={handleUploadProof} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Document Type
                        </label>
                        <select
                          value={selectedProofType}
                          onChange={e => setSelectedProofType(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7] bg-white"
                        >
                          <option value="GST Registration Certificate">GST Registration Certificate</option>
                          <option value="Udyam / MSME Certificate">Udyam / MSME Certificate</option>
                          <option value="Shop & Establishment Certificate">Shop &amp; Establishment Certificate</option>
                          <option value="Trade License">Trade License</option>
                          <option value="Business Bank Statement / Cheque">Business Bank Statement / Cheque</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Document / Registration Number
                        </label>
                        <input
                          type="text"
                          value={docNumber}
                          onChange={e => setDocNumber(e.target.value)}
                          placeholder="e.g. 36AABCU9603R1ZM"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Issuing Authority
                        </label>
                        <input
                          type="text"
                          value={issuingAuthority}
                          onChange={e => setIssuingAuthority(e.target.value)}
                          placeholder="e.g. Govt of India / Municipal Corp"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Expiry Date (If Applicable)
                        </label>
                        <input
                          type="date"
                          value={expiryDate}
                          onChange={e => setExpiryDate(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7] bg-white"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-700">
                          {fileName ? fileName : "Attach proof file (PDF/JPG/PNG, up to 5MB)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(fileBase64 || fileName) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (fileBase64) openDocumentViewer(fileBase64, `${selectedProofType} Preview`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-slate-500" /> View
                          </button>
                        )}
                        <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs">
                          Browse File
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={uploadingDoc}
                        className="px-5 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#005FAE] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        {uploadingDoc && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Upload Registration Document
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* 5. Statutory Licenses */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
              <button
                type="button"
                onClick={() => toggleSection(5)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Category-Specific Statutory Licenses</h3>
                    <p className="text-[11px] text-slate-400">FSSAI, Drug License, RERA, Medical, etc. (as applicable)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Optional
                  </span>
                  {expandedSection === 5 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedSection === 5 && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  <form onSubmit={handleUploadLicense} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          License Type
                        </label>
                        <select
                          value={selectedLicenseType}
                          onChange={e => setSelectedLicenseType(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7] bg-white"
                        >
                          <option value="">Select Statutory License</option>
                          <option value="FSSAI Food License">FSSAI Food License</option>
                          <option value="Drug License (Form 20/21)">Drug License (Form 20/21)</option>
                          <option value="RERA Real Estate Registration">RERA Real Estate Registration</option>
                          <option value="Pollution Control Board Consent">Pollution Control Board Consent</option>
                          <option value="Fire Safety NOC">Fire Safety NOC</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          License / Registration Number
                        </label>
                        <input
                          type="text"
                          value={licenseNumber}
                          onChange={e => setLicenseNumber(e.target.value)}
                          placeholder="e.g. 10019042001234"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076D7]/20 focus:border-[#0076D7]"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-700">
                          {licenseFileName ? licenseFileName : "Attach license file (PDF/JPG/PNG)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(licenseFileBase64 || licenseFileName) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (licenseFileBase64) openDocumentViewer(licenseFileBase64, `${selectedLicenseType || "License"} Preview`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-slate-500" /> View
                          </button>
                        )}
                        <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs">
                          Browse File
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleLicenseFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={uploadingDoc}
                        className="px-5 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#005FAE] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        {uploadingDoc && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Upload License Document
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* 6. Uploaded Documents & Verification Status */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
              <button
                type="button"
                onClick={() => toggleSection(6)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0076D7] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Uploaded Documents &amp; Verification Status</h3>
                    <p className="text-[11px] text-slate-400">All uploaded documents and admin verification status</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {uploadedDocs.length} Document{uploadedDocs.length !== 1 ? "s" : ""}
                  </span>
                  {expandedSection === 6 ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedSection === 6 && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  {uploadedDocs.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {uploadedDocs.map((doc: any) => (
                        <div key={doc.id} className="py-3 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{doc.documentType}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{doc.documentNumber || "No ID"}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            {doc.status === "VERIFIED" ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Verified</span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Under Review</span>
                            )}
                            {doc.fileUrl && (
                              <button
                                type="button"
                                onClick={() => openDocumentViewer(doc.fileUrl, `${doc.documentType} Document`)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-[#0076D7] hover:bg-sky-50 rounded-lg flex items-center gap-1 border border-sky-100"
                              >
                                <Eye className="w-3 h-3" /> View
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="text-slate-400 hover:text-rose-600 transition p-1"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-3 text-center">No documents uploaded yet.</p>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (35% width / 4 cols) - Cards */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1. Profile Completion Ring Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-4">
                {/* 100% SVG Circular Ring */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="100, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-slate-900">100%</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">Profile Completion</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    All required information is completed.
                  </p>
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                {[
                  { title: "Personal Information", sub: "Owner details and identity", done: true },
                  { title: "Business Information", sub: "Business, category, and contact details", done: true },
                  { title: "Business Address", sub: "Location and service area", done: true },
                  { title: "Registration & KYC", sub: "GST, MSME and business proof", done: true },
                  { title: "Statutory Licenses", sub: "Category-specific licenses (if required)", done: true },
                  { title: "Documents & Verification", sub: "Document uploads and admin review", done: true }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Business Media (Logo & Cover) with Upload Triggers */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#0076D7]" />
                  <h4 className="text-xs font-bold text-slate-900">Business Media</h4>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Click tile to upload</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Logo Tile */}
                <div>
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5">Business Logo</div>
                  <label className="cursor-pointer block relative rounded-xl overflow-hidden border border-slate-200 bg-[#0B2545] h-20 flex flex-col items-center justify-center p-2 text-white hover:opacity-90 transition group">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white absolute top-1.5 right-1.5 flex items-center justify-center text-[9px] z-10">
                      ✓
                    </span>
                    {business.logoUrl ? (
                      <img
                        src={business.logoUrl.startsWith("http") || business.logoUrl.startsWith("data:") ? business.logoUrl : `http://localhost:4000${business.logoUrl}`}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <>
                        <Store className="w-5 h-5 mb-0.5 text-sky-300" />
                        <span className="text-[10px] font-bold text-center leading-tight truncate px-1">
                          {business.name || "VINOD TECH"}
                        </span>
                      </>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] font-bold text-white">
                      Change Logo
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadLogo}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Cover Banner Tile */}
                <div>
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5">Cover Banner</div>
                  <label className="cursor-pointer block relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-20 hover:opacity-90 transition group">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white absolute top-1.5 right-1.5 flex items-center justify-center text-[9px] z-10">
                      ✓
                    </span>
                    {business.coverImageUrl ? (
                      <img
                        src={business.coverImageUrl.startsWith("http") || business.coverImageUrl.startsWith("data:") ? business.coverImageUrl : `http://localhost:4000${business.coverImageUrl}`}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-200">
                        <span className="text-[9px] font-bold">Storefront Banner</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] font-bold text-white">
                      Change Banner
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadCover}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-500 text-sm">⚡</span>
                <h4 className="text-xs font-bold text-slate-900">Quick Actions</h4>
              </div>

              <Link
                href={business.id ? `/${business.slug || business.id}` : "/vendor/dashboard"}
                target="_blank"
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center justify-between text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Public Listing</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  toggleSection(2);
                  const el = document.getElementById("operating-hours");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center justify-between text-xs font-semibold text-slate-700 text-left"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Update Operating Hours</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => toggleSection(2)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center justify-between text-xs font-semibold text-slate-700 text-left"
              >
                <div className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5 text-slate-500" />
                  <span>Manage Services &amp; Gallery</span>
                </div>
              </button>
            </div>

            {/* 4. Need Help? Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-orange-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Need Help?</h4>
                  <p className="text-[10px] text-slate-400">
                    Get support for profile, verification, or document uploads.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-2xs"
              >
                Contact Support
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Full-Width Sticky/Fixed Save Action Bar */}
        <div className="sticky bottom-4 z-20 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-800">
                All required details completed
              </div>
              <div className="text-[11px] text-slate-500">
                Your business profile is ready for verification (if not already verified).
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              href="/vendor/dashboard"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition text-center"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSubmitKyc}
              disabled={submittingKyc}
              className="px-6 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#005FAE] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
            >
              {submittingKyc ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

      </main>

      {/* Document View Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0076D7]" />
                <h3 className="text-sm font-bold text-slate-800">{viewingDoc.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={viewingDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
                  title="Open in new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setViewingDoc(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-slate-100/60 min-h-[350px]">
              {viewingDoc.url.startsWith("data:application/pdf") || viewingDoc.url.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={viewingDoc.url}
                  className="w-full h-[600px] rounded-lg border border-slate-200 bg-white"
                  title={viewingDoc.title}
                />
              ) : (
                <img
                  src={viewingDoc.url}
                  alt={viewingDoc.title}
                  className="max-h-[600px] w-auto max-w-full object-contain rounded-lg shadow-sm"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
