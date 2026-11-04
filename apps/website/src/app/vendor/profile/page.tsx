"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Upload,
  ArrowRight,
  ChevronDown,
  Loader2,
  Trash2,
  RefreshCw,
  ExternalLink,
  Camera,
  Image as ImageIcon,
  Sparkles,
  HelpCircle,
  X,
  Compass
} from "lucide-react";
import { toast } from "@/components/Toast";
import { DesktopFooter } from "@/components/DesktopFooter";

const API_BASE = "http://localhost:4000/api/v1";

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return { "Content-Type": "application/json" };
  const token = localStorage.getItem("hello_access_token");
  const userStr = localStorage.getItem("hello_user");
  let userId = "";
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      userId = u.id || "";
    } catch {}
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) headers["Authorization"] = "Bearer " + token;
  if (userId) headers["x-user-id"] = userId;
  return headers;
};


export default function MerchantProfilePage() {
  const router = useRouter();

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [submittingKyc, setSubmittingKyc] = useState(false);

  // Profile Data States
  const [user, setUser] = useState<any>({
    fullName: "",
    phoneNumber: "",
    email: "",
    avatarUrl: "",
    preferredLanguage: "English",
    identityProofType: "",
    identityProofNumber: "",
    identityProofFileUrl: "",
  });

  const [idProofFileBase64, setIdProofFileBase64] = useState<string | null>(null);
  const [idProofFileName, setIdProofFileName] = useState("");
  const [uploadingIdProof, setUploadingIdProof] = useState(false);

  const [business, setBusiness] = useState<any>({
    id: "",
    name: "",
    legalName: "",
    businessType: "Sole Proprietor",
    description: "",
    primaryPhone: "",
    whatsappNumber: "",
    supportEmail: "",
    website: "",
    logoUrl: "",
    coverImageUrl: "",
    categoryId: "",
    categoryName: "Restaurants & Dining",
    categorySlug: "restaurants",
    cityName: "Hyderabad",
    cityId: "city-hyderabad",
    localityName: "Hitec City",
    localityId: "loc-hitec-city",
    addressLine1: "",
    landmark: "",
    pincode: "500081",
    status: "PENDING",
    isVerified: false,
    adminRemarks: null,
  });

  const [completion, setCompletion] = useState<any>({
    percentage: 20,
    isComplete: false,
    isVerified: false,
    kycStatus: "NOT_SUBMITTED",
    adminRemarks: null,
    missingFields: [],
    sections: {
      personal: { completed: false, missing: [] },
      business: { completed: false, missing: [] },
      address: { completed: false, missing: [] },
      proof: { completed: false, missing: [] },
      licenses: { completed: false, missing: [] },
    },
  });

  // Dynamic Options from Backend
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const [kycRequirements, setKycRequirements] = useState<any>({
    registrationProofs: [],
    categoryLicenses: [],
  });
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);

  // Selected Upload States
  const [selectedProofType, setSelectedProofType] = useState("GST Registration Certificate");
  const [docNumber, setDocNumber] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [hasNoDocument, setHasNoDocument] = useState(false);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  // Category License Upload State
  const [selectedLicenseType, setSelectedLicenseType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
  const [licenseFileBase64, setLicenseFileBase64] = useState<string | null>(null);
  const [licenseFileName, setLicenseFileName] = useState("");

  // Active Tab/Accordion
  const [activeSection, setActiveSection] = useState<string>("all");

  // Fetch initial profile & options
  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      // Sync from local session user immediately
      if (typeof window !== "undefined") {
        const localUserStr = localStorage.getItem("hello_user");
        if (localUserStr) {
          try {
            const lu = JSON.parse(localUserStr);
            if (lu) {
              setUser((prev: any) => ({
                ...prev,
                fullName: lu.fullName || lu.name || prev.fullName,
                phoneNumber: lu.phoneNumber || lu.phone || prev.phoneNumber,
                email: lu.email || prev.email,
              }));
            }
          } catch {}
        }
      }

      const [profRes, catRes, cityRes] = await Promise.all([
        fetch(`${API_BASE}/merchant/profile`, { headers: getAuthHeaders() }).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/categories`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/locations/cities`).then((r) => r.json()).catch(() => null),
      ]);

      if (catRes?.success && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
      }
      if (cityRes?.success && Array.isArray(cityRes.data)) {
        setCities(cityRes.data);
      }

      if (profRes?.success && profRes.data) {
        if (profRes.data.user) {
          setUser(profRes.data.user);
        }
        if (profRes.data.business) {
          setBusiness(profRes.data.business);
          if (profRes.data.business.documents) {
            setUploadedDocs(profRes.data.business.documents);
          }
          // Fetch dynamic KYC license requirements based on category
          const reqRes = await fetch(`${API_BASE}/kyc/requirements?category=${profRes.data.business.categorySlug || "restaurants"}`).then((r) => r.json()).catch(() => null);
          if (reqRes?.success && reqRes.data) {
            setKycRequirements(reqRes.data);
          }
        }
        if (profRes.data.completion) {
          setCompletion(profRes.data.completion);
        }
      }
    } catch (err) {
      console.error("Error loading merchant profile:", err);
      toast.error("Failed to load merchant profile from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // When city changes, load localities
  useEffect(() => {
    if (business.cityName) {
      fetch(`${API_BASE}/locations/localities?city=${encodeURIComponent(business.cityName)}`)
        .then((r) => r.json())
        .then((json) => {
          if (json?.success && Array.isArray(json.data)) {
            setLocalities(json.data);
          }
        })
        .catch(() => {});
    }
  }, [business.cityName]);

  // When category changes, refresh license requirements
  const handleCategoryChange = async (catSlug: string) => {
    const selected = categories.find((c) => c.slug === catSlug);
    setBusiness((prev: any) => ({
      ...prev,
      categorySlug: catSlug,
      categoryName: selected?.name || catSlug,
      categoryId: selected?.id || prev.categoryId,
    }));

    try {
      const res = await fetch(`${API_BASE}/kyc/requirements?category=${catSlug}`);
      const json = await res.json();
      if (json?.success && json.data) {
        setKycRequirements(json.data);
      }
    } catch {
      // Non-fatal
    }
  };

  // 1. SAVE PERSONAL INFORMATION
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.fullName || user.fullName.trim().length < 2) {
      toast.error("Full Name is required (minimum 2 characters).");
      return;
    }

    setSavingPersonal(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/profile`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fullName: user.fullName.trim(),
          email: user.email.trim(),
          preferredLanguage: user.preferredLanguage,
          identityProofType: user.identityProofType,
          identityProofNumber: user.identityProofNumber,
          identityProofDataUri: idProofFileBase64 || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to save personal details.");

      toast.success("Personal details and ID proof saved successfully!");
      if (json.data?.user) {
        setUser(json.data.user);
      }
      setIdProofFileBase64(null);
      setIdProofFileName("");
      if (json.data?.completion) setCompletion(json.data.completion);
    } catch (err: any) {
      toast.error(err.message || "Could not save personal details.");
    } finally {
      setSavingPersonal(false);
    }
  };

  // 2. SAVE BUSINESS INFORMATION
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business.name || business.name.trim().length < 2) {
      toast.error("Business/Shop Name is required.");
      return;
    }

    setSavingBusiness(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/businesses/${business.id || "biz_primary"}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: business.name.trim(),
          legalName: business.legalName?.trim(),
          businessType: business.businessType,
          description: business.description?.trim(),
          primaryPhone: business.primaryPhone,
          whatsappNumber: business.whatsappNumber,
          supportEmail: business.supportEmail,
          categoryId: business.categoryId,
          categoryName: business.categoryName,
          categorySlug: business.categorySlug,
          logoUrl: business.logoUrl,
          coverImageUrl: business.coverImageUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to save business details.");

      toast.success("Business details updated successfully!");
      fetchProfileData();
    } catch (err: any) {
      toast.error(err.message || "Could not save business details.");
    } finally {
      setSavingBusiness(false);
    }
  };

  // 3. SAVE BUSINESS ADDRESS
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/businesses/${business.id || "biz_primary"}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          cityName: business.cityName,
          localityName: business.localityName,
          addressLine1: business.addressLine1,
          landmark: business.landmark,
          pincode: business.pincode,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to save address.");

      toast.success("Business location and address saved!");
      fetchProfileData();
    } catch (err: any) {
      toast.error(err.message || "Could not save business address.");
    } finally {
      setSavingAddress(false);
    }
  };

  // Image upload state for logo & banner
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Handle Business Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo image exceeds 2MB limit. Please use a smaller image.");
      return;
    }
    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch(`${API_BASE}/merchant/businesses/${business.id || "biz_primary"}/logo`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ fileDataUri: base64, fileName: file.name }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Logo upload failed.");
        const newUrl = json.data?.logoUrl || base64;
        setBusiness((prev: any) => ({ ...prev, logoUrl: newUrl }));
        toast.success("Business logo uploaded successfully!");
      } catch {
        // Fallback: store as local preview until API is ready
        setBusiness((prev: any) => ({ ...prev, logoUrl: base64 }));
        toast.info("Logo preview set locally. Save Business Profile to persist.");
      } finally {
        setUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Business Banner / Cover Image Upload
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Banner image exceeds 5MB limit. Please use a smaller image.");
      return;
    }
    setUploadingBanner(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch(`${API_BASE}/merchant/businesses/${business.id || "biz_primary"}/cover`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ fileDataUri: base64, fileName: file.name }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Banner upload failed.");
        const newUrl = json.data?.coverImageUrl || base64;
        setBusiness((prev: any) => ({ ...prev, coverImageUrl: newUrl }));
        toast.success("Business banner uploaded successfully!");
      } catch {
        // Fallback: store as local preview until API is ready
        setBusiness((prev: any) => ({ ...prev, coverImageUrl: base64 }));
        toast.info("Banner preview set locally. Save Business Profile to persist.");
      } finally {
        setUploadingBanner(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle File Upload (Convert to Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isLicense = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Document size exceeds maximum 5MB limit. Please upload a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isLicense) {
        setLicenseFileBase64(reader.result as string);
        setLicenseFileName(file.name);
      } else {
        setFileBase64(reader.result as string);
        setFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // 4. UPLOAD BUSINESS REGISTRATION PROOF
  const handleUploadBusinessProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasNoDocument && !fileBase64) {
      toast.error("Please select a document file to upload, or declare that you don't have one.");
      return;
    }

    setUploadingDoc(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/businesses/${business.id || "biz_primary"}/documents`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          documentCategory: "BUSINESS_PROOF",
          documentType: selectedProofType,
          documentNumber: docNumber,
          issuingAuthority,
          issueDate,
          expiryDate,
          hasNoDocument,
          fileDataUri: fileBase64,
          fileName: fileName || "business_proof.pdf",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to save document.");

      toast.success(
        hasNoDocument
          ? "Declaration saved: Alternative verification review assigned."
          : "Business Registration Proof uploaded and saved to MySQL!"
      );
      setFileBase64(null);
      setFileName("");
      fetchProfileData();
    } catch (err: any) {
      toast.error(err.message || "Could not upload document.");
    } finally {
      setUploadingDoc(false);
    }
  };

  // 5. UPLOAD CATEGORY-SPECIFIC LICENSE
  const handleUploadCategoryLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseFileBase64) {
      toast.error("Please select the required statutory license file to upload.");
      return;
    }

    setUploadingDoc(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/businesses/${business.id || "biz_primary"}/documents`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          documentCategory: "CATEGORY_LICENSE",
          documentType: selectedLicenseType || kycRequirements.categoryLicenses?.[0]?.name || "Statutory License",
          documentNumber: licenseNumber,
          expiryDate: licenseExpiryDate,
          fileDataUri: licenseFileBase64,
          fileName: licenseFileName || "category_license.pdf",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to upload license.");

      toast.success("Category License uploaded successfully!");
      setLicenseFileBase64(null);
      setLicenseFileName("");
      fetchProfileData();
    } catch (err: any) {
      toast.error(err.message || "Could not upload license.");
    } finally {
      setUploadingDoc(false);
    }
  };

  // 6. DELETE A DOCUMENT
  const handleDeleteDoc = async (docId: string) => {
    if (!confirm("Are you sure you want to remove this document?")) return;
    try {
      const res = await fetch(`${API_BASE}/merchant/businesses/${business.id || "biz_primary"}/documents/${docId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        toast.info("Document deleted.");
        fetchProfileData();
      }
    } catch {
      toast.error("Failed to delete document.");
    }
  };

  // 7. SUBMIT COMPLETE KYC PACKAGE FOR SUPER ADMIN VERIFICATION
  const handleSubmitKycPackage = async () => {
    setSubmittingKyc(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/businesses/${business.id || "biz_primary"}/kyc/submit`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to submit KYC.");

      toast.brand("KYC Dossier submitted! Super Admin has been notified for inspection.");
      fetchProfileData();
    } catch (err: any) {
      toast.error(err.message || "Could not submit KYC dossier.");
    } finally {
      setSubmittingKyc(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0076D7] animate-spin" />
        <p className="text-xs font-bold text-slate-700">Loading HELLO Merchant Profile &amp; KYC Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 select-none">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    HELLO<span className="text-[#FF6B35]">-Hi</span>
                  </span>
                  <span className="bg-[#FF6B35]/15 text-[#FF6B35] text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-[#FF6B35]/30">
                    Partner Center
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  Merchant Profile &amp; Business KYC
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-[#0076D7] transition hidden sm:inline-flex"
            >
              Back to Home
            </Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[120px] truncate">{user.fullName || "Merchant"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        
        {/* ========================================================= */}
        {/* SECTION 1: PROFILE OVERVIEW & PROGRESS HERO               */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-bl from-blue-500/10 via-orange-500/5 to-transparent blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            {/* Left: Merchant Avatar & Information */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0B1220] via-slate-800 to-[#0076D7] text-white flex items-center justify-center text-3xl font-black shadow-md shrink-0 border border-slate-700">
                {user.fullName ? user.fullName.charAt(0) : "M"}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {user.fullName || "Merchant Partner"}
                  </h1>
                  {business.isVerified ? (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      VERIFIED BUSINESS
                    </span>
                  ) : business.status === "PENDING" || business.status === "UNDER_REVIEW" ? (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      KYC UNDER REVIEW
                    </span>
                  ) : business.status === "REJECTED" ? (
                    <span className="bg-rose-100 text-rose-800 border border-rose-300 font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      ACTION REQUIRED: RESUBMISSION
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                      PROFILE INCOMPLETE
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                  <span>🏪 {business.name || "Business Setup Incomplete"}</span>
                  <span>•</span>
                  <span>📱 {user.phoneNumber}</span>
                </p>

                {business.adminRemarks && (
                  <div className="mt-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-2.5 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Super Admin Review Remark: </span>
                      {business.adminRemarks}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Dynamic Profile Completion Progress */}
            <div className="w-full lg:w-80 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Profile Completion</span>
                <span className="font-black text-[#0076D7] text-sm">{completion.percentage}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0076D7] to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                {completion.percentage >= 80
                  ? "Great job! Profile requirements are satisfied and ready for verified badge."
                  : "Complete required business and license details to earn customer trust and top ranking."}
              </p>

              {/* Quick Submit KYC Button */}
              {business.status !== "APPROVED" && (
                <button
                  type="button"
                  onClick={handleSubmitKycPackage}
                  disabled={submittingKyc || completion.percentage < 40}
                  className="w-full mt-2 bg-[#0076D7] hover:bg-[#005FAE] disabled:opacity-50 text-white py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  {submittingKyc ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>Submit KYC for Admin Review</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TWO-COLUMN WORKFLOW GRID                                  */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ======================================================= */}
          {/* SECTION 2: PERSONAL INFORMATION                         */}
          {/* ======================================================= */}
          <div id="personal" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5 scroll-mt-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">1. Personal Information</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Registered business owner credentials</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                Owner Identity
              </span>
            </div>

            <form onSubmit={handleSavePersonal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Legal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra / Sandeep Kumar"
                  value={user.fullName}
                  onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verified Mobile Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.phoneNumber}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-mono cursor-not-allowed"
                    title="Mobile number is protected and verified via OTP"
                  />
                  <span className="text-[9px] text-emerald-600 font-bold mt-0.5 block">
                    ✓ Read-only &amp; OTP Authenticated
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="partner@yourbusiness.in"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={user.preferredLanguage || "English"}
                    onChange={(e) => setUser({ ...user, preferredLanguage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  >
                    <option value="English">English</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Voluntary ID Proof Type
                  </label>
                  <select
                    value={user.identityProofType || ""}
                    onChange={(e) => {
                      setUser({ ...user, identityProofType: e.target.value });
                      if (!e.target.value) {
                        setIdProofFileBase64(null);
                        setIdProofFileName("");
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  >
                    <option value="">None / Will Provide Later</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Passport">Indian Passport</option>
                    <option value="Voter ID">Election Voter ID (EPIC)</option>
                    <option value="Offline Aadhaar">Offline Masked Aadhaar</option>
                    <option value="PAN Card">PAN Card</option>
                  </select>
                </div>
              </div>

              {/* DYNAMIC UPLOAD FIELD: When user selects a Voluntary ID Proof Type */}
              {user.identityProofType && user.identityProofType !== "" && (
                <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        Upload {user.identityProofType} Document
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Upload front copy or scan (PDF/JPG/PNG up to 5MB)
                      </p>
                    </div>
                    {user.identityProofFileUrl && (
                      <a
                        href={user.identityProofFileUrl.startsWith("http") ? user.identityProofFileUrl : `http://localhost:4000${user.identityProofFileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#0076D7] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Uploaded File
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {user.identityProofType} Number (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter ${user.identityProofType} number`}
                        value={user.identityProofNumber || ""}
                        onChange={(e) => setUser({ ...user, identityProofNumber: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Select Document File
                      </label>
                      <div className="relative border border-dashed border-blue-300 rounded-xl py-2 px-3 text-center bg-white cursor-pointer hover:border-[#0076D7] transition">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error("File exceeds 5MB limit. Please upload a smaller file.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setIdProofFileBase64(reader.result as string);
                              setIdProofFileName(file.name);
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <span className="text-xs text-slate-600 truncate block">
                          {idProofFileName ? idProofFileName : user.identityProofFileUrl ? "Change Uploaded Document" : `Click to select ${user.identityProofType} file`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPersonal}
                  className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  {savingPersonal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Personal Details</span>
                </button>
              </div>
            </form>
          </div>

          {/* ======================================================= */}
          {/* SECTION 3: BUSINESS INFORMATION                         */}
          {/* ======================================================= */}
          <div id="services" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5 scroll-mt-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">2. Business Information</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Public shop brand &amp; entity profile</p>
                </div>
              </div>
              <span className="text-[10px] bg-orange-50 text-[#FF6B35] px-2 py-0.5 rounded-full font-bold">
                Directory Profile
              </span>
            </div>

            <form onSubmit={handleSaveBusiness} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business / Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SparkleSmart Electronics"
                    value={business.name}
                    onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Legal Entity Name (As in Documents)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SparkleSmart India Pvt. Ltd."
                    value={business.legalName || ""}
                    onChange={(e) => setBusiness({ ...business, legalName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Type / Constitution
                  </label>
                  <select
                    value={business.businessType || "Sole Proprietor"}
                    onChange={(e) => setBusiness({ ...business, businessType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  >
                    <option value="Sole Proprietor">Individual / Sole Proprietor</option>
                    <option value="Partnership">Partnership Firm</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                    <option value="Private Limited">Private Limited Company</option>
                    <option value="Public Limited">Public Limited Company</option>
                    <option value="Society / Trust">Registered Trust / Society</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={business.categorySlug || "restaurants"}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your services, products, authorized brands, and warranty support..."
                  value={business.description || ""}
                  onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Calling Line
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98480 12345"
                    value={business.primaryPhone || user.phoneNumber}
                    onChange={(e) => setBusiness({ ...business, primaryPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Enquiry Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98480 12345"
                    value={business.whatsappNumber || user.phoneNumber}
                    onChange={(e) => setBusiness({ ...business, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
              </div>

              {/* ─── LOGO & BANNER UPLOAD ─── */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#FF6B35]" />
                  Business Logo &amp; Cover Banner
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Business Logo */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                      Logo <span className="text-slate-400 font-normal normal-case">(Square · max 2MB)</span>
                    </label>

                    <label className="block cursor-pointer group relative">
                      {/* Preview or placeholder */}
                      <div className="w-full h-28 rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-[#FF6B35] bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition relative">
                        {business.logoUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={business.logoUrl.startsWith("http") ? business.logoUrl : `http://localhost:4000${business.logoUrl}`}
                              alt="Business logo"
                              className="w-full h-full object-contain p-2"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <Camera className="w-5 h-5 text-white" />
                              <span className="text-white text-[10px] font-bold ml-1">Change</span>
                            </div>
                          </>
                        ) : (
                          <>
                            {uploadingLogo ? (
                              <Loader2 className="w-6 h-6 text-[#FF6B35] animate-spin" />
                            ) : (
                              <>
                                <Camera className="w-6 h-6 text-slate-400 group-hover:text-[#FF6B35] transition" />
                                <span className="text-[10px] text-slate-400 mt-1 font-semibold">Upload Logo</span>
                                <span className="text-[9px] text-slate-300">PNG, JPG, SVG</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                        className="sr-only"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                      />
                    </label>

                    {business.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setBusiness((prev: any) => ({ ...prev, logoUrl: "" }))}
                        className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
                      >
                        <X className="w-3 h-3" /> Remove logo
                      </button>
                    )}
                  </div>

                  {/* Cover Banner */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                      Cover Banner <span className="text-slate-400 font-normal normal-case">(16:9 · max 5MB)</span>
                    </label>

                    <label className="block cursor-pointer group relative">
                      <div className="w-full h-28 rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-[#FF6B35] bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition relative">
                        {business.coverImageUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={business.coverImageUrl.startsWith("http") ? business.coverImageUrl : `http://localhost:4000${business.coverImageUrl}`}
                              alt="Business banner"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-white" />
                              <span className="text-white text-[10px] font-bold ml-1">Change Banner</span>
                            </div>
                          </>
                        ) : (
                          <>
                            {uploadingBanner ? (
                              <Loader2 className="w-6 h-6 text-[#FF6B35] animate-spin" />
                            ) : (
                              <>
                                <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-[#FF6B35] transition" />
                                <span className="text-[10px] text-slate-400 mt-1 font-semibold">Upload Cover Banner</span>
                                <span className="text-[9px] text-slate-300">PNG, JPG, WebP · Recommended 1200×630</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="sr-only"
                        onChange={handleBannerUpload}
                        disabled={uploadingBanner}
                      />
                    </label>

                    {business.coverImageUrl && (
                      <button
                        type="button"
                        onClick={() => setBusiness((prev: any) => ({ ...prev, coverImageUrl: "" }))}
                        className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
                      >
                        <X className="w-3 h-3" /> Remove banner
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  <span className="font-bold text-slate-500">Tip:</span> A high-quality logo and banner improve your business listing visibility and build customer trust on HELLO-Hi.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingBusiness}
                  className="bg-[#FF6B35] hover:bg-[#E5531E] text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  {savingBusiness ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Business Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* ======================================================= */}
          {/* SECTION 4: BUSINESS ADDRESS & LOCATION                  */}
          {/* ======================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">3. Business Address</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Shop premises &amp; customer navigation</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                Hyperlocal Hub
              </span>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State / Jurisdiction
                  </label>
                  <select
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 cursor-not-allowed"
                  >
                    <option>Andhra Pradesh &amp; Telangana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City Hub <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={business.cityName || "Hyderabad"}
                    onChange={(e) => setBusiness({ ...business, cityName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  >
                    {cities.length > 0 ? (
                      cities.map((ct) => (
                        <option key={ct.id} value={ct.name}>
                          {ct.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Vijayawada">Vijayawada</option>
                        <option value="Guntur">Guntur</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Locality / Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={business.localityName || "Hitec City"}
                    onChange={(e) => setBusiness({ ...business, localityName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  >
                    {localities.length > 0 ? (
                      localities.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))
                    ) : (
                      <option value="Hitec City">Hitec City</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="500081"
                    maxLength={6}
                    value={business.pincode || "500081"}
                    onChange={(e) => setBusiness({ ...business, pincode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Premises / Street Address
                </label>
                <input
                  type="text"
                  placeholder="Plot 42, Silicon Towers, Opp. Cyber Gateway"
                  value={business.addressLine1 || ""}
                  onChange={(e) => setBusiness({ ...business, addressLine1: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  {savingAddress ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Address</span>
                </button>
              </div>
            </form>
          </div>

          {/* ======================================================= */}
          {/* SECTION 5: BUSINESS REGISTRATION PROOF                  */}
          {/* ======================================================= */}
          <div id="kyc" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5 scroll-mt-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">4. Business Registration Proof</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Upload 1 proof establishing legal existence</p>
                </div>
              </div>
              <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                KYC Level 1
              </span>
            </div>

            <form onSubmit={handleUploadBusinessProof} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Document Option
                </label>
                <select
                  value={selectedProofType}
                  onChange={(e) => {
                    setSelectedProofType(e.target.value);
                    setHasNoDocument(e.target.value === "I Don't Have a Business Registration Document");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                >
                  <option value="Shop & Establishment Registration Certificate">1. Shop &amp; Establishment Registration Certificate</option>
                  <option value="GST Registration Certificate">2. GST Registration Certificate</option>
                  <option value="Udyam / MSME Registration Certificate">3. Udyam / MSME Registration Certificate</option>
                  <option value="Municipal Trade License">4. Municipal Trade License</option>
                  <option value="Certificate of Incorporation">5. Certificate of Incorporation</option>
                  <option value="Partnership Deed / Registration">6. Partnership Deed / Registration</option>
                  <option value="Other Government-Issued Business Registration Proof">7. Other Government-Issued Business Registration Proof</option>
                  <option value="I Don't Have a Business Registration Document">8. I Don't Have a Business Registration Document (Alternative Review)</option>
                </select>
              </div>

              {!hasNoDocument ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Registration / Document Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 36AAACH7409R1ZZ / TS-HYD-10294"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Expiry Date (If applicable)
                      </label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                  </div>

                  {/* Document Upload Box with Preview */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                      Document File <span className="text-slate-400 font-normal normal-case">(PDF, PNG, JPG · max 5MB)</span>
                    </label>

                    <label className="block cursor-pointer group relative">
                      <div className="w-full min-h-[120px] rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-[#0076D7] bg-slate-50 flex flex-col items-center justify-center p-3 overflow-hidden transition relative">
                        {fileBase64 ? (
                          <div className="flex flex-col items-center justify-center w-full space-y-2">
                            {fileBase64.startsWith("data:image/") ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={fileBase64}
                                alt="Selected document preview"
                                className="max-h-36 object-contain rounded-lg border border-slate-200 shadow-2xs"
                              />
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-bold text-xs">
                                <FileText className="w-5 h-5 text-[#0076D7]" />
                                <span>{fileName || "Document file selected"}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-700">{fileName}</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Ready to upload</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#0076D7] transition mb-1" />
                            <span className="text-xs font-bold text-slate-700">Click to select or drag document file</span>
                            <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Max 5MB)</span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, false)}
                        className="sr-only"
                      />
                    </label>

                    {fileBase64 && (
                      <button
                        type="button"
                        onClick={() => { setFileBase64(null); setFileName(""); }}
                        className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
                      >
                        <X className="w-3 h-3" /> Remove selected file
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Alternative Micro-Merchant Verification Assigned</span>
                  </div>
                  <p className="leading-relaxed">
                    Small neighborhood shops and solo proprietors without GST or trade licenses can still list for free. Super Admin will verify via physical location check and verified customer telephone confirmation.
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={uploadingDoc}
                  className="bg-[#0B1220] hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  {uploadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{hasNoDocument ? "Save Declaration" : "Upload Document"}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* ========================================================= */}
        {/* ROW 3: SECTIONS 5 & 6 SIDE BY SIDE                        */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ========================================================= */}
          {/* SECTION 5: CATEGORY-SPECIFIC STATUTORY LICENSES           */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">5. Category-Specific Statutory Licenses</h3>
                  <p className="text-xs text-slate-500">
                    Sector regulations dynamically required for <span className="font-bold text-[#0076D7]">{business.categoryName}</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-blue-50 text-[#0076D7] px-2.5 py-1 rounded-full font-bold">
                Dynamic Statutory Rules
              </span>
            </div>

            {kycRequirements.categoryLicenses && kycRequirements.categoryLicenses.length > 0 ? (
              <div className="space-y-4">
                {kycRequirements.categoryLicenses.map((lic: any) => (
                  <div key={lic.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{lic.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{lic.description}</p>
                      </div>
                      {lic.required ? (
                        <span className="text-[9px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full shrink-0">
                          Optional
                        </span>
                      )}
                    </div>

                    <form onSubmit={handleUploadCategoryLicense} className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="License Number"
                          value={licenseNumber}
                          onChange={(e) => {
                            setSelectedLicenseType(lic.name);
                            setLicenseNumber(e.target.value);
                          }}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                        />
                        <input
                          type="date"
                          value={licenseExpiryDate}
                          onChange={(e) => setLicenseExpiryDate(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block cursor-pointer group relative">
                          <div className="w-full min-h-[96px] rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-[#0076D7] bg-white flex flex-col items-center justify-center p-3 overflow-hidden transition relative">
                            {licenseFileBase64 ? (
                              <div className="flex flex-col items-center justify-center w-full space-y-1.5">
                                {licenseFileBase64.startsWith("data:image/") ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={licenseFileBase64}
                                    alt="Category license preview"
                                    className="max-h-28 object-contain rounded-lg border border-slate-200 shadow-2xs"
                                  />
                                ) : (
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-bold text-xs">
                                    <FileText className="w-4 h-4 text-[#0076D7]" />
                                    <span>{licenseFileName || "License document selected"}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-slate-700">{licenseFileName}</span>
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Ready to upload</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#0076D7] transition mb-1" />
                                <span className="text-xs font-bold text-slate-700">Select License File (PDF/Image)</span>
                                <span className="text-[9px] text-slate-400">PDF, JPG, PNG (Max 5MB)</span>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, true)}
                            className="sr-only"
                          />
                        </label>

                        {licenseFileBase64 && (
                          <button
                            type="button"
                            onClick={() => { setLicenseFileBase64(null); setLicenseFileName(""); }}
                            className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
                          >
                            <X className="w-3 h-3" /> Remove selected license file
                          </button>
                        )}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          disabled={uploadingDoc}
                          className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                        >
                          {uploadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <span>Upload License</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Upload Optional Category / Trade Document</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      No mandatory statutory license is strictly enforced for this category, but you can optionally upload any trade authorization, rent agreement, or local NOC to strengthen your verification.
                    </p>
                  </div>
                  <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full shrink-0">
                    Optional
                  </span>
                </div>
                <form onSubmit={handleUploadCategoryLicense} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Document / License Name (e.g. Trade NOC, Police Acknowledgment)"
                      value={licenseNumber}
                      onChange={(e) => {
                        setSelectedLicenseType(e.target.value || "Category Trade Document");
                        setLicenseNumber(e.target.value);
                      }}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                    />
                    <input
                      type="date"
                      value={licenseExpiryDate}
                      onChange={(e) => setLicenseExpiryDate(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block cursor-pointer group relative">
                      <div className="w-full min-h-[96px] rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-[#0076D7] bg-white flex flex-col items-center justify-center p-3 overflow-hidden transition relative">
                        {licenseFileBase64 ? (
                          <div className="flex flex-col items-center justify-center w-full space-y-1.5">
                            {licenseFileBase64.startsWith("data:image/") ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={licenseFileBase64}
                                alt="Category license preview"
                                className="max-h-28 object-contain rounded-lg border border-slate-200 shadow-2xs"
                              />
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-bold text-xs">
                                <FileText className="w-4 h-4 text-[#0076D7]" />
                                <span>{licenseFileName || "License document selected"}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-700">{licenseFileName}</span>
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Ready to upload</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#0076D7] transition mb-1" />
                            <span className="text-xs font-bold text-slate-700">Select Document File (PDF/Image)</span>
                            <span className="text-[9px] text-slate-400">PDF, JPG, PNG (Max 5MB)</span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, true)}
                        className="sr-only"
                      />
                    </label>

                    {licenseFileBase64 && (
                      <button
                        type="button"
                        onClick={() => { setLicenseFileBase64(null); setLicenseFileName(""); }}
                        className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
                      >
                        <X className="w-3 h-3" /> Remove selected license file
                      </button>
                    )}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={uploadingDoc}
                      className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                    >
                      {uploadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>Upload Document</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* SECTION 6: KYC DOSSIER & VERIFICATION STATUS              */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 h-full">
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
              <div className="flex items-center gap-2">
                <a
                  href="#kyc"
                  className="bg-blue-50 hover:bg-blue-100 text-[#0076D7] px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Document
                </a>
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                  {uploadedDocs.length} {uploadedDocs.length === 1 ? "Doc" : "Docs"}
                </span>
              </div>
            </div>

            {uploadedDocs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Document Type</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {uploadedDocs.map((doc: any) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{doc.documentType}</div>
                          <div className="font-mono text-[10px] text-slate-500">{doc.documentNumber || "No ID"}</div>
                          {doc.adminRemarks && (
                            <div className="text-[10px] text-slate-400 mt-0.5 italic">{doc.adminRemarks}</div>
                          )}
                          {doc.hasNoDocument && (
                            <span className="block text-[10px] text-amber-600 font-normal">
                              Declaration of Unavailable Document
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {doc.status === "VERIFIED" ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          ) : doc.status === "REJECTED" ? (
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
                          <div className="flex items-center justify-end gap-2">
                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl.startsWith("http") ? doc.fileUrl : `http://localhost:4000${doc.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0076D7] hover:underline font-bold flex items-center gap-1 text-[11px]"
                              >
                                View <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="text-slate-400 hover:text-red-600 transition p-1"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500 space-y-3">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-700">No verification documents uploaded yet.</p>
                <p className="text-[11px] max-w-sm mx-auto">
                  Upload your business registration proof (GST, Trade License, MSME) or statutory category licenses above to earn your verified partner badge.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <a
                    href="#kyc"
                    className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-4 py-2 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Business Proof (Section 4)
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

      </main>

      <DesktopFooter />
    </div>
  );
}

