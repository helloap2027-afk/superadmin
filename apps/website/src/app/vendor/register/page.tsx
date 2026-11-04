"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft, Building, MapPin, FileText, Check, Phone } from "lucide-react";

export default function VendorRegisterWizard() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedBiz, setSubmittedBiz] = useState<any>(null);

  // Form State
  // Step 1: Owner Identity
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  // Step 2: Business Info
  const [businessName, setBusinessName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Step 3: Location
  const [cities, setCities] = useState<any[]>([]);
  const [cityId, setCityId] = useState("");
  const [localities, setLocalities] = useState<any[]>([]);
  const [localityId, setLocalityId] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");

  // Step 4: KYC & Verification
  const [gstin, setGstin] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [tradeLicenseNo, setTradeLicenseNo] = useState("");

  // Dynamic Data
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Load Categories
    fetch("http://localhost:4000/api/v1/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCategories(json.data);
          if (json.data.length > 0) setCategoryId(json.data[0].id);
        }
      })
      .catch(() => {});

    // Load Cities
    fetch("http://localhost:4000/api/v1/locations/cities")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCities(json.data);
          if (json.data.length > 0) setCityId(json.data[0].id);
        }
      })
      .catch(() => {});

    // Check pre-filled user if logged in
    const userStr = typeof window !== "undefined" ? localStorage.getItem("hello_user") : null;
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.fullName) setOwnerName(u.fullName);
        if (u.phoneNumber) setOwnerPhone(u.phoneNumber.replace("+91", ""));
        if (u.email) setOwnerEmail(u.email);
      } catch {}
    }
  }, []);

  // When city changes, load localities
  useEffect(() => {
    if (!cityId) return;
    fetch(`http://localhost:4000/api/v1/locations/cities/${cityId}/localities`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setLocalities(json.data);
          if (json.data.length > 0) setLocalityId(json.data[0].id);
        }
      })
      .catch(() => {});
  }, [cityId]);

  const validateStep = (step: number) => {
    setError(null);
    if (step === 1) {
      if (!ownerName.trim()) {
        setError("Owner full name is required.");
        return false;
      }
      if (ownerPhone.replace(/\D/g, "").length !== 10) {
        setError("Please enter a valid 10-digit mobile number.");
        return false;
      }
    }
    if (step === 2) {
      if (!businessName.trim()) {
        setError("Business name is required.");
        return false;
      }
      if (!categoryId) {
        setError("Please select a primary category.");
        return false;
      }
    }
    if (step === 3) {
      if (!cityId) {
        setError("Please select a city.");
        return false;
      }
      if (!addressLine1.trim()) {
        setError("Address line is required.");
        return false;
      }
      if (!pincode.trim() || pincode.length !== 6) {
        setError("Please enter a valid 6-digit PIN code.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("hello_access_token");
      if (!token) {
        // Quick session bootstrap for registration if not logged in
        throw new Error("Please log in with your phone number to complete business ownership verification.");
      }

      const res = await fetch("http://localhost:4000/api/v1/vendors/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: businessName.trim(),
          legalName: legalName.trim() || undefined,
          categoryId,
          description: description.trim() || undefined,
          cityId,
          localityId: localityId || undefined,
          addressLine1: addressLine1.trim(),
          landmark: landmark.trim() || undefined,
          pincode: pincode.trim(),
          primaryPhone: primaryPhone ? `+91${primaryPhone}` : `+91${ownerPhone}`,
          whatsappNumber: whatsappNumber ? `+91${whatsappNumber}` : undefined,
          gstin: gstin.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to submit business registration.");
      }

      setSubmittedBiz(json.data);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Registration Submitted!
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your business <span className="font-bold text-slate-800">{submittedBiz?.name}</span> has been received and assigned reference ID <span className="font-mono text-xs font-bold text-[#FF6B35]">{submittedBiz?.businessId}</span>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>Status: PENDING MODERATION</span>
            </div>
            <p className="text-amber-800/90 text-[11px] leading-relaxed">
              Our operations team verifies Trade Licenses, FSSAI certificates, and GST numbers to maintain 100% authenticity on the platform. Review typically completes within 24 business hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition text-center"
            >
              Return Home
            </Link>
            <Link
              href="/account"
              className="flex-1 px-4 py-3 rounded-2xl bg-[#0076D7] hover:bg-[#005FAE] text-white text-xs font-bold transition text-center shadow-sm"
            >
              View in My Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/70 border border-orange-200 text-[#FF6B35] text-xs font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>HELLO Partner Network Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Register Your Local Business
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Digitize your shop, clinic, or service in 5 simple steps. Receive direct customer leads via WhatsApp and Phone with zero commission.
          </p>
        </div>

        {/* Stepper Wizard Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between">
          {[
            { num: 1, label: "Owner" },
            { num: 2, label: "Business" },
            { num: 3, label: "Location" },
            { num: 4, label: "KYC" },
            { num: 5, label: "Review" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                  currentStep === s.num
                    ? "bg-[#FF6B35] text-white shadow-xs"
                    : currentStep > s.num
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={`text-xs font-bold hidden sm:inline ${currentStep === s.num ? "text-slate-900" : "text-slate-400"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
          
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Owner Identity */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-slate-900">Step 1 — Business Owner Identity</h2>
                <p className="text-xs text-slate-500">Provide the authorized owner details for verification.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Owner Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Lakshmi Devi"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Owner Mobile Number *</label>
                <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-[#FF6B35]">
                  <span className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-600">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full px-4 py-2.5 text-sm rounded-r-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="owner@business.com"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Business Info */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-slate-900">Step 2 — Basic Business Information</h2>
                <p className="text-xs text-slate-500">What is the public name and category of your establishment?</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Shop / Business Display Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Amravati Grand Multicuisine Restaurant"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Legal Business Name (if different)</label>
                <input
                  type="text"
                  placeholder="e.g. Amravati Foods & Hospitality Pvt Ltd"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Primary Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none bg-white font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Description / Services Overview</label>
                <textarea
                  rows={3}
                  placeholder="Tell local customers about your specialties, seating capacity, doctor timings, or services..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Customer Enquiry Phone</label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">WhatsApp Enquiry Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit WhatsApp number"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-slate-900">Step 3 — Business Physical Location</h2>
                <p className="text-xs text-slate-500">Provide accurate address details for customer distance calculation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">City *</label>
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none bg-white font-semibold"
                  >
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Locality / Neighborhood</label>
                  <select
                    value={localityId}
                    onChange={(e) => setLocalityId(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none bg-white font-semibold"
                  >
                    {localities.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Street Address Line 1 *</label>
                <input
                  type="text"
                  placeholder="Shop No, Building Name, Road"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    placeholder="Near Metro / Mall"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    placeholder="6-digit PIN"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: KYC Verification */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-slate-900">Step 4 — Business Verification &amp; Tax Identifiers</h2>
                <p className="text-xs text-slate-500">Provide official trade details to earn the verified trust badge.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">GSTIN Number (If registered)</label>
                <input
                  type="text"
                  placeholder="e.g. 37AAAAA0000A1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Business PAN Number</label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Trade License / FSSAI No.</label>
                  <input
                    type="text"
                    placeholder="License registration no."
                    value={tradeLicenseNo}
                    onChange={(e) => setTradeLicenseNo(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                ℹ️ Sensitive documents are stored with private cryptographic access. They are never published or made available to the public.
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-slate-900">Step 5 — Review &amp; Submit Registration</h2>
                <p className="text-xs text-slate-500">Please review all submitted information before final confirmation.</p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Business Name</span>
                  <span className="font-bold text-slate-900">{businessName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Primary Category</span>
                  <span className="font-bold text-slate-900">
                    {categories.find((c) => c.id === categoryId)?.name || categoryId}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Address</span>
                  <span className="font-bold text-slate-900 text-right max-w-xs">{addressLine1}, {pincode}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Owner Name</span>
                  <span className="font-bold text-slate-900">{ownerName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">GSTIN</span>
                  <span className="font-bold text-slate-900">{gstin || "Not provided (Unregistered)"}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed">
                By submitting this form, you certify that all business information is accurate and authorized. Submission initiates the standard verification procedure.
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E5531E] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold transition flex items-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Business Registration</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
