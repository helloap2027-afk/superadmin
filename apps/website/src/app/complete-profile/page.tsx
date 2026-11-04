"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Globe, MapPin, Building, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("English");

  // Dynamic Location state loaded from database
  const [states, setStates] = useState<any[]>([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [localities, setLocalities] = useState<any[]>([]);
  const [selectedLocalityId, setSelectedLocalityId] = useState("");

  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load States on mount
  useEffect(() => {
    fetch("http://localhost:4000/api/v1/locations/states")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStates(json.data);
          if (json.data.length > 0) {
            setSelectedStateId(json.data[0].id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingLocations(false));
  }, []);

  // Load Cities when state changes
  useEffect(() => {
    if (!selectedStateId) return;
    fetch(`http://localhost:4000/api/v1/locations/cities`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCities(json.data);
          if (json.data.length > 0) {
            setSelectedCityId(json.data[0].id);
          }
        }
      })
      .catch(() => {});
  }, [selectedStateId]);

  // Load Localities when city changes
  useEffect(() => {
    if (!selectedCityId) {
      setLocalities([]);
      return;
    }
    fetch(`http://localhost:4000/api/v1/locations/cities/${selectedCityId}/localities`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setLocalities(json.data);
          if (json.data.length > 0) {
            setSelectedLocalityId(json.data[0].id);
          }
        }
      })
      .catch(() => {});
  }, [selectedCityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch("http://localhost:4000/api/v1/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update profile.");
      }

      // Update local storage
      const userStr = localStorage.getItem("hello_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        u.fullName = fullName.trim();
        u.email = email.trim();
        localStorage.setItem("hello_user", JSON.stringify(u));
      }

      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Failed to save profile. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
        
        {/* Header */}
        <div className="space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF6B35] flex items-center justify-center mb-4 shadow-2xs">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Tell us your name and neighborhood to personalize your local discovery experience.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-[#0076D7] bg-white transition shadow-2xs">
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Ramesh Varma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-2xl"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Email Address <span className="text-slate-400 font-normal">(Optional for quote invoices)</span>
            </label>
            <div className="relative flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-[#0076D7] bg-white transition shadow-2xs">
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-2xl"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label htmlFor="language" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Preferred Language
            </label>
            <div className="relative flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-[#0076D7] bg-white transition shadow-2xs">
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm font-semibold text-slate-900 bg-transparent focus:outline-none rounded-2xl cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
              </select>
              <Globe className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
            </div>
          </div>

          {/* Dynamic Geographic Selectors */}
          <div className="pt-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Your Primary City &amp; Neighborhood
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* City Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">City</label>
                <select
                  value={selectedCityId}
                  onChange={(e) => setSelectedCityId(e.target.value)}
                  disabled={isSubmitting || cities.length === 0}
                  className="w-full px-3 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#0076D7] focus:outline-none"
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Locality Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Locality</label>
                <select
                  value={selectedLocalityId}
                  onChange={(e) => setSelectedLocalityId(e.target.value)}
                  disabled={isSubmitting || localities.length === 0}
                  className="w-full px-3 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#0076D7] focus:outline-none"
                >
                  {localities.length === 0 ? (
                    <option value="">Select locality</option>
                  ) : (
                    localities.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !fullName.trim()}
            className="w-full mt-4 bg-[#0076D7] hover:bg-[#005FAE] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <span>Save &amp; Start Exploring</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
