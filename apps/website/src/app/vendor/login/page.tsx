"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, Phone, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Building, ChevronRight } from "lucide-react";

export default function VendorLoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp" | "select_business">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otp, setOtp] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fullPhone = `+91${phoneNumber}`;
      const res = await fetch("http://localhost:4000/api/v1/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: fullPhone,
          purpose: "VENDOR_LOGIN",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to send verification code.");
      }

      setChallengeId(json.data.challengeId);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to dispatch code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter all 6 digits of the OTP code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/api/v1/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId,
          otp,
          deviceInfo: "Vendor Partner Portal",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Invalid verification code.");
      }

      const { accessToken, refreshToken, user } = json.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("hello_access_token", accessToken);
        localStorage.setItem("hello_refresh_token", refreshToken);
        localStorage.setItem("hello_user", JSON.stringify(user));
      }

      setUserProfile(user);

      // Check owned businesses
      const owned = user.ownedBusinesses || [];
      if (owned.length === 0) {
        // No businesses registered yet -> prompt registration
        router.push("/vendor/register");
      } else if (owned.length === 1) {
        // Direct entry to single business
        sessionStorage.setItem("hello_active_business", JSON.stringify(owned[0]));
        alert(`Welcome to ${owned[0].name} workspace! Status: ${owned[0].status}`);
        router.push("/account");
      } else {
        // Multiple businesses -> select business
        setBusinesses(owned);
        setStep("select_business");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBusiness = (biz: any) => {
    sessionStorage.setItem("hello_active_business", JSON.stringify(biz));
    alert(`Selected business: ${biz.name}`);
    router.push("/account");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0B1220] text-slate-100">
      {/* Brand Visual Left Column */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0B1220] via-[#111C30] to-[#1A2E4C] border-r border-slate-800">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF6B35]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 select-none">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B35] flex items-center justify-center text-white font-black text-xl shadow-lg">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight leading-none text-white">HELLO</span>
              <span className="text-[10px] text-orange-300 font-semibold tracking-wider uppercase mt-1">
                Vendor Business Portal
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-400">
            <Store className="w-3.5 h-3.5" />
            <span>Dedicated Merchant Center</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-white">
            Welcome Back,<br />
            <span className="text-[#FF6B35]">Business Partner.</span>
          </h1>

          <p className="text-slate-300 text-sm xl:text-base leading-relaxed">
            Manage your verified listing, answer real customer leads instantly via WhatsApp, update your working hours, and grow your local presence with 0% commission.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Real-time customer enquiries with direct phone & WhatsApp access",
              "Verified trust badge for maximum customer conversion",
              "Multi-branch and staff delegation management"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 border-t border-slate-800 pt-6 flex items-center justify-between">
          <span>HELLO Hyperlocal Business Network</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> 100% Verified Partners
          </span>
        </div>
      </div>

      {/* Auth Card Right Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100">
          
          {step === "phone" && (
            <>
              <div className="space-y-2 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF6B35] flex items-center justify-center mb-4 shadow-2xs">
                  <Store className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Partner Sign In
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Enter your registered business owner mobile number.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div>
                  <label htmlFor="vendor-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Registered Mobile Number
                  </label>
                  <div className="relative flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-[#FF6B35] bg-white transition shadow-2xs">
                    <div className="px-4 py-3 border-r border-slate-200 bg-slate-50 text-slate-700 font-bold text-sm flex items-center gap-1.5 shrink-0 rounded-l-2xl select-none">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      id="vendor-phone"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      autoFocus
                      disabled={isLoading}
                      className="w-full px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-r-2xl"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length !== 10}
                  className="w-full bg-[#FF6B35] hover:bg-[#E5531E] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue with OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-2 text-center text-xs">
                <span className="text-slate-500">New to HELLO Platform?</span>
                <Link href="/vendor/register" className="font-bold text-[#FF6B35] hover:underline">
                  Register Your Business (Free) →
                </Link>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="space-y-2 mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Enter 6-Digit OTP
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Verification code sent to <span className="font-bold text-slate-800">+91{phoneNumber}</span>.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    autoFocus
                    disabled={isLoading}
                    className="w-full text-center tracking-[0.5em] text-3xl font-black text-slate-900 py-3.5 border-2 border-slate-200 rounded-2xl focus:border-[#FF6B35] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-[#FF6B35] hover:bg-[#E5531E] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Enter Partner Workspace</span>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setStep("phone")}
                className="mt-6 text-xs text-slate-500 hover:text-slate-800 text-center w-full"
              >
                ← Back to Mobile Input
              </button>
            </>
          )}

          {step === "select_business" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Select Business
                </h2>
                <p className="text-xs text-slate-500">
                  Your account is authorized to manage multiple business profiles:
                </p>
              </div>

              <div className="space-y-3">
                {businesses.map((biz) => (
                  <div
                    key={biz.id}
                    onClick={() => handleSelectBusiness(biz)}
                    className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#FF6B35] hover:bg-orange-50/40 cursor-pointer transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{biz.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">Status: {biz.status}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
