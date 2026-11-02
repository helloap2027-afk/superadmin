"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Sparkles, MapPin } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    const mockUser = {
      id: "usr_google_" + Date.now(),
      fullName: "Verified Google User",
      email: "google.user@gmail.com",
      phoneNumber: "+91 98480 12345",
      status: "ACTIVE",
      preferredLanguage: "English",
      roles: ["CUSTOMER"]
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("hello_access_token", "jwt_google_oauth_" + Date.now());
      localStorage.setItem("hello_user", JSON.stringify(mockUser));
    }
    router.push("/account");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) {
      setPhoneNumber(val);
      if (error) setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions to proceed.");
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
          purpose: "LOGIN",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to dispatch verification code.");
      }

      const challengeId = json.data?.challengeId;
      sessionStorage.setItem("hello_auth_phone", fullPhone);
      sessionStorage.setItem("hello_auth_challenge_id", challengeId);

      router.push(`/verify-otp?phone=${encodeURIComponent(fullPhone)}&challengeId=${encodeURIComponent(challengeId)}`);
    } catch (err: any) {
      setError(err.message || "Unable to send verification code. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* LEFT: Brand & Discovery Visual Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B1220] via-[#0A2540] to-[#0076D7] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#FF6B35]/20 blur-3xl pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 select-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#0076D7] flex items-center justify-center text-white font-black text-xl shadow-lg">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight leading-none text-white">
                HELLO
              </span>
              <span className="text-[10px] text-sky-200 font-semibold tracking-wider uppercase mt-1">
                Discover Local. Connect Instantly.
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Headline & Visual Value Props */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Hyperlocal Consumer Discovery</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight">
            Your City.<br />
            Your Services.<br />
            <span className="text-[#FF6B35]">One HELLO.</span>
          </h1>

          <p className="text-slate-200 text-sm xl:text-base leading-relaxed">
            Discover trusted local clinics, food spots, home services, and professionals nearby. Direct WhatsApp and phone connections with 0% middleman fees.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Verified local businesses with real photos & hours",
              "Direct 1-tap WhatsApp chat & phone dialer",
              "Zero spam, zero brokers, transparent community reviews"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-sky-100 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Footer Trust */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Serving Vijayawada, Guntur & Expanding Cities</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bank-Grade Encryption</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Floating Auth Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
          
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#0076D7] flex items-center justify-center text-white font-black text-lg">
              H
            </div>
            <span className="text-xl font-black text-[#0076D7]">HELLO</span>
          </div>

          {/* Dual Toggle Pill */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-6">
            <Link
              href="/login"
              className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-white text-[#0076D7] shadow-xs transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 py-2 text-center text-xs font-bold rounded-xl text-slate-500 hover:text-slate-900 transition"
            >
              Register Account
            </Link>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome to HELLO
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sign in or create your customer account using your mobile number.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input Box matching screenshot (+91 | Enter Mobile Number) */}
            <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-[#0070E0] focus-within:ring-2 focus-within:ring-blue-100 bg-white transition px-4 py-3.5 shadow-2xs">
              <span className="text-base text-slate-700 font-semibold select-none pr-3">
                +91
              </span>
              <span className="text-slate-300 select-none pr-3">|</span>
              <input
                id="phone"
                type="tel"
                placeholder="Enter Mobile Number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                autoFocus
                disabled={isLoading}
                className="w-full text-base font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* Checkbox: I Agree to Terms and Conditions */}
            <div className="flex flex-col items-center justify-center text-center space-y-1 select-none pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0070E0] accent-[#0070E0] cursor-pointer"
                />
                <span>I Agree to Terms and Conditions</span>
              </label>
              <Link
                href="/terms"
                className="text-xs sm:text-sm text-slate-500 underline hover:text-slate-800 transition"
              >
                T&amp;C&apos;s Privacy Policy
              </Link>
            </div>

            {/* Primary Action Button: Login with OTP */}
            <button
              type="submit"
              disabled={isLoading || phoneNumber.length !== 10 || !agreedToTerms}
              className="w-full bg-[#0070E0] hover:bg-[#005bb5] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-base transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <span>Login with OTP</span>
              )}
            </button>

            {/* Divider: Or Login Using */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full absolute" />
              <span className="bg-slate-100 text-slate-500 text-xs px-3.5 py-1 rounded-full relative z-10 font-medium">
                Or Login Using
              </span>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-xl py-3 px-4 flex items-center justify-center gap-3 text-sm font-semibold text-slate-700 shadow-2xs transition hover:shadow-xs"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>
          </form>

          {/* Business Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3 text-center">
            <span className="text-xs text-slate-500">
              Are you a local business owner or service provider?
            </span>
            <Link
              href="/vendor/login"
              className="text-xs font-bold text-[#FF6B35] hover:text-[#E5531E] transition hover:underline"
            >
              Login to Business Partner Center →
            </Link>
          </div>

          {/* Legal note */}
          <div className="mt-6 text-center text-[10px] text-slate-400 leading-relaxed">
            By continuing, you agree to HELLO’s Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
