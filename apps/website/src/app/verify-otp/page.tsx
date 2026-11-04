"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck, CheckCircle2, AlertCircle, Loader2, Sparkles,
  ArrowRight, RefreshCw, KeyRound, User, Store
} from "lucide-react";
import { toast } from "@/components/Toast";

const API_BASE = "http://localhost:4000/api/v1";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phoneParam       = searchParams.get("phone") || "";
  const challengeIdParam = searchParams.get("challengeId") || "";
  const devOtpParam      = searchParams.get("devOtp") || "";
  const returnToParam    = searchParams.get("returnTo") || "/";
  // intent: "CUSTOMER" | "VENDOR_OWNER"  — passed from login page
  const intentParam      = searchParams.get("intent") || "";
  // mode: "login" | "register"
  const modeParam        = searchParams.get("mode") || "login";

  const [phoneNumber, setPhoneNumber]   = useState(phoneParam);
  const [challengeId, setChallengeId]   = useState(challengeIdParam);
  const [otp, setOtp]                   = useState(["", "", "", "", "", ""]);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState<string | null>(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [isResending, setIsResending]   = useState(false);
  const [timer, setTimer]               = useState(45);
  const [devOtpHint, setDevOtpHint]     = useState<string | null>(devOtpParam || "123456");

  // Restore from sessionStorage if URL params are missing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPhone  = sessionStorage.getItem("hello_auth_phone");
      const storedChl    = sessionStorage.getItem("hello_auth_challenge_id");
      const storedDevOtp = sessionStorage.getItem("hello_auth_dev_otp");
      if (!phoneParam && storedPhone)   setPhoneNumber(storedPhone);
      if (!challengeIdParam && storedChl) setChallengeId(storedChl);
      if (storedDevOtp)      setDevOtpHint(storedDevOtp);
      else if (devOtpParam)  setDevOtpHint(devOtpParam);
    }
  }, [phoneParam, challengeIdParam, devOtpParam]);

  // Countdown timer for resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const next = [...otp]; next[index] = ""; setOtp(next); return;
    }
    const next = [...otp]; next[index] = clean.slice(-1); setOtp(next);
    if (index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-input-${index - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  };

  const handleAutoFill = () => {
    const code = devOtpHint || "123456";
    setOtp(code.split("").slice(0, 6));
    if (error) setError(null);
  };

  // Determine role context from intent param or sessionStorage
  const resolvedIntent = intentParam ||
    (typeof window !== "undefined" ? sessionStorage.getItem("hello_auth_intent") || "" : "");
  const isPartnerIntent = resolvedIntent === "VENDOR_OWNER";

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challengeId || "chl_dev_session",
          otp: fullOtp,
          deviceInfo: "Chrome Browser (Windows 10)",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Invalid or expired verification code.");
      }

      const { accessToken, user } = json.data;

      // If registered with Name/Email, update backend profile
      if (modeParam === "register" && typeof window !== "undefined") {
        const regName = sessionStorage.getItem("hello_auth_name");
        const regEmail = sessionStorage.getItem("hello_auth_email");
        if (regName) {
          try {
            await fetch(`${API_BASE}/users/me`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                fullName: regName,
                email: regEmail || undefined,
              }),
            });
            user.fullName = regName;
            if (regEmail) user.email = regEmail;
          } catch (patchErr) {
            console.warn("Profile sync error after register:", patchErr);
          }
        }
      }

      // Persist auth to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("hello_access_token", accessToken);
        localStorage.setItem("hello_user", JSON.stringify(user));

        // Set active role based on intent
        const userRoles: string[] = Array.isArray(user.roles) ? user.roles : [];
        const hasMerchantRole =
          userRoles.includes("VENDOR_OWNER") ||
          userRoles.includes("VENDOR_STAFF") ||
          (Array.isArray(user.ownedBusinesses) && user.ownedBusinesses.length > 0);

        if (isPartnerIntent && hasMerchantRole) {
          localStorage.setItem("hello_active_role", "MERCHANT");
        } else if (isPartnerIntent && !hasMerchantRole) {
          // New merchant — set role as MERCHANT optimistically; dashboard shows profile reminder
          localStorage.setItem("hello_active_role", "MERCHANT");
        } else {
          localStorage.setItem("hello_active_role", "CUSTOMER");
        }

        // Dispatch session change event so header updates immediately
        window.dispatchEvent(new Event("hello_auth_changed"));

        // Clean up OTP session data
        sessionStorage.removeItem("hello_auth_phone");
        sessionStorage.removeItem("hello_auth_challenge_id");
        sessionStorage.removeItem("hello_auth_dev_otp");
        sessionStorage.removeItem("hello_auth_intent");
        sessionStorage.removeItem("hello_auth_mode");
        sessionStorage.removeItem("hello_auth_name");
        sessionStorage.removeItem("hello_auth_email");
      }

      // Determine correct destination
      const destination = isPartnerIntent ? "/vendor/dashboard" : (returnToParam || "/");

      setSuccess(
        isPartnerIntent
          ? "Verified! Loading your Merchant Dashboard..."
          : "Verification successful! Redirecting to HELLO Homepage..."
      );

      // Queue welcome toast on the destination page
      toast.queueCrossPage({
        type: isPartnerIntent ? "brand" : "success",
        title: isPartnerIntent ? "Welcome, Business Partner!" : "Welcome to HELLO!",
        message: isPartnerIntent
          ? `Partner Center ready for ${user.fullName || phoneNumber}. Complete your profile to go live!`
          : `Logged in successfully as ${user.fullName || phoneNumber}.`,
        duration: 5000,
      });

      setTimeout(() => {
        router.push(destination);
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          purpose: modeParam === "register" ? "REGISTRATION" : "LOGIN",
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setChallengeId(json.data.challengeId);
        if (json.data.devOtp) setDevOtpHint(json.data.devOtp);
        setTimer(45);
        setSuccess("New verification code dispatched!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* LEFT: Branding Panel — unchanged */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B1220] via-[#0A2540] to-[#0076D7] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 select-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#0076D7] flex items-center justify-center text-white font-black text-xl shadow-lg">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight leading-none text-white">HELLO</span>
              <span className="text-[10px] font-bold text-sky-300 tracking-wider">HYPERLOCAL SECURE AUTH</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-400/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DPDP Act 2023 Two-Factor Authentication</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight leading-tight">
            {isPartnerIntent
              ? "Verify your identity to access your Merchant Dashboard."
              : "Verify your mobile identity for instant quotes and business access."}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your session is secured with military-grade JWT tokens and real-time MySQL persistence.
          </p>

          {/* Context badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border mt-4 ${
            isPartnerIntent
              ? "bg-orange-500/20 text-orange-200 border-orange-400/30"
              : "bg-blue-500/20 text-blue-200 border-blue-400/30"
          }`}>
            {isPartnerIntent
              ? <Store className="w-3.5 h-3.5" />
              : <User className="w-3.5 h-3.5" />}
            <span>{isPartnerIntent ? "Business Partner Verification" : "Customer Verification"}</span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          © 2026 HELLO Technologies Pvt. Ltd. Verified SMS Gateway.
        </div>
      </div>

      {/* RIGHT: OTP Verification Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 space-y-6">

          {/* Header */}
          <div className="space-y-2 text-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border shadow-sm ${
              isPartnerIntent
                ? "bg-orange-50 border-orange-200"
                : "bg-blue-50 border-blue-200"
            }`}>
              <KeyRound className={`w-6 h-6 ${isPartnerIntent ? "text-[#FF6B35]" : "text-[#0076D7]"}`} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enter 6-Digit Code</h1>
            <p className="text-xs text-slate-500">
              We dispatched an authentication code to{" "}
              <span className="font-bold text-slate-900">{phoneNumber || "+91 Mobile"}</span>
            </p>
            {/* Role context chip */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
              isPartnerIntent
                ? "bg-orange-50 text-[#FF6B35] border border-orange-200"
                : "bg-blue-50 text-[#0076D7] border border-blue-200"
            }`}>
              {isPartnerIntent ? <Store className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {isPartnerIntent ? "Business Partner" : "Customer"} •{" "}
              {modeParam === "register" ? "Registration" : "Login"}
            </div>
          </div>

          {/* Dev OTP hint */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-amber-900 font-semibold text-[11px]">
                Test Code: <span className="font-mono font-black">{devOtpHint || "123456"}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[10px] shadow-xs transition shrink-0"
            >
              Auto-fill Code
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-700 px-3.5 py-2.5 rounded-xl border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-emerald-50 text-emerald-800 px-3.5 py-2.5 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* 6-digit OTP inputs */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-between gap-2 sm:gap-2.5">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-12 h-14 text-center text-xl font-black bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 transition shadow-2xs ${
                    isPartnerIntent
                      ? "focus:border-[#FF6B35] focus:ring-orange-100"
                      : "focus:border-[#0076D7] focus:ring-blue-100"
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
              className={`w-full disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm ${
                isPartnerIntent
                  ? "bg-[#FF6B35] hover:bg-[#E5531E]"
                  : "bg-[#0076D7] hover:bg-[#005FAE]"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify &amp; Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center pt-2 border-t border-slate-100">
            {timer > 0 ? (
              <span className="text-xs text-slate-400 font-medium">
                Resend code in <span className="font-bold text-slate-700">{timer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-xs font-bold text-[#0076D7] hover:underline flex items-center justify-center gap-1.5 mx-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                <span>Resend OTP Code</span>
              </button>
            )}
          </div>

          {/* Back to role selection */}
          <div className="text-center text-xs text-slate-500">
            Wrong account type?{" "}
            <Link
              href={`/login?mode=${modeParam}`}
              className="font-bold text-[#0076D7] hover:underline"
            >
              Go back to account selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
