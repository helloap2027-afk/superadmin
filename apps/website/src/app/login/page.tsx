"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Phone, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Sparkles,
  MapPin, ArrowLeft, User, Store, ArrowRight, Building2, Heart, Star,
  Inbox, ChevronRight
} from "lucide-react";
import { toast } from "@/components/Toast";

const API_BASE = "http://localhost:4000/api/v1";

// ─── Role type ───────────────────────────────────────────────────────────────
type AccountRole = "CUSTOMER" | "PARTNER" | null;
type AuthMode = "login" | "register";

// ─── Left branding panel (shared, unchanged) ─────────────────────────────────
function LeftBrandPanel({ mode }: { mode: AuthMode }) {
  const isRegister = mode === "register";
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B1220] via-[#0A2540] to-[#0076D7] text-white p-12 flex-col justify-between relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#FF6B35]/20 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#0076D7] flex items-center justify-center text-white font-black text-xl shadow-lg">
            H
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight leading-none text-white">HELLO</span>
            <span className="text-[10px] text-sky-200 font-semibold tracking-wider uppercase mt-1">
              Discover Local. Connect Instantly.
            </span>
          </div>
        </Link>
      </div>

      {/* Center content */}
      <div className="relative z-10 max-w-lg space-y-6 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-200">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>{isRegister ? "Join 100,000+ Local Members" : "Hyperlocal Consumer Discovery"}</span>
        </div>

        <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight">
          {isRegister ? (
            <>Create Your<br />HELLO Account<br /><span className="text-[#FF6B35]">in 30 Seconds.</span></>
          ) : (
            <>Your City.<br />Your Services.<br /><span className="text-[#FF6B35]">One HELLO.</span></>
          )}
        </h1>

        <p className="text-slate-200 text-sm xl:text-base leading-relaxed">
          {isRegister
            ? "Get instant quotes, bookmark top local service providers, and connect with verified community businesses."
            : "Discover trusted local clinics, food spots, home services, and professionals nearby. Direct WhatsApp and phone connections with 0% middleman fees."}
        </p>

        <div className="space-y-3 pt-2">
          {(isRegister
            ? ["Instant one-click WhatsApp chat with business owners", "Direct distance calculation and map navigation", "Exclusive local deals & verified pricing quotes"]
            : ["Verified local businesses with real photos & hours", "Direct 1-tap WhatsApp chat & phone dialer", "Zero spam, zero brokers, transparent community reviews"]
          ).map((text, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-sky-100 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer trust row */}
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
  );
}

// ─── Step 1: Role selection card ─────────────────────────────────────────────
function RoleSelectionStep({
  mode,
  onSelect,
}: {
  mode: AuthMode;
  onSelect: (role: AccountRole) => void;
}) {
  const isLogin = mode === "login";
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isLogin ? "How would you like to sign in?" : "How would you like to join HELLO?"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          {isLogin
            ? "Choose your account experience to continue."
            : "Choose how you want to use HELLO. You can access both experiences with one account."}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer card */}
        <button
          type="button"
          onClick={() => onSelect("CUSTOMER")}
          className="group relative text-left p-5 rounded-2xl border-2 border-slate-200 hover:border-[#0076D7] bg-white hover:bg-blue-50/40 transition-all duration-200 shadow-xs hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0076D7]/40"
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-[#0076D7] text-[#0076D7] group-hover:text-white flex items-center justify-center shadow-xs transition-colors duration-200 mb-3">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-900 mb-1">Customer</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Discover local businesses, services, shops, and professionals near you.
          </p>
          <ul className="space-y-1">
            {["Explore nearby businesses", "Save favorites", "Send enquiries", "Manage your account"].map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <CheckCircle2 className="w-3 h-3 text-[#16A34A] shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#0076D7] group-hover:gap-2 transition-all">
            <span>{isLogin ? "Continue as Customer" : "Join as Customer"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          {/* Accent bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0076D7] rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
        </button>

        {/* Business Partner card */}
        <button
          type="button"
          onClick={() => onSelect("PARTNER")}
          className="group relative text-left p-5 rounded-2xl border-2 border-slate-200 hover:border-[#FF6B35] bg-white hover:bg-orange-50/40 transition-all duration-200 shadow-xs hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40"
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-orange-50 group-hover:bg-[#FF6B35] text-[#FF6B35] group-hover:text-white flex items-center justify-center shadow-xs transition-colors duration-200 mb-3">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-900 mb-1">Business Partner</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            List your business, connect with customers, and manage enquiries.
          </p>
          <ul className="space-y-1">
            {["Free business listing", "Business dashboard", "Manage leads", "Profile & KYC verification"].map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <CheckCircle2 className="w-3 h-3 text-[#16A34A] shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#FF6B35] group-hover:gap-2 transition-all">
            <span>{isLogin ? "Continue as Business Partner" : "Join as Business Partner"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          {/* Accent bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35] rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
        </button>
      </div>

      {/* Legal */}
      <p className="text-center text-[10px] text-slate-400 leading-relaxed">
        By continuing, you agree to HELLO&apos;s{" "}
        <Link href="/terms" className="underline hover:text-slate-700 transition">Terms of Service</Link>{" "}
        and{" "}
        <Link href="/terms" className="underline hover:text-slate-700 transition">Privacy Policy</Link>.
      </p>
    </div>
  );
}

// ─── Step 2: OTP form (role-aware) ────────────────────────────────────────────
function OtpFormStep({
  mode,
  role,
  onBack,
  onSwitchToRegister,
}: {
  mode: AuthMode;
  role: AccountRole;
  onBack: () => void;
  onSwitchToRegister?: (role: AccountRole) => void;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isPartner = role === "PARTNER";
  const isRegister = mode === "register";

  // Context-aware copy
  const roleLabel = isPartner ? "Business Partner" : "Customer";
  const accentColor = isPartner ? "#FF6B35" : "#0076D7";
  const accentHover = isPartner ? "#E5531E" : "#005FAE";
  const accentRing = isPartner ? "focus-within:ring-orange-100 focus-within:border-[#FF6B35]" : "focus-within:ring-blue-100 focus-within:border-[#0070E0]";
  const btnBg = isPartner
    ? "bg-[#FF6B35] hover:bg-[#E5531E] disabled:bg-slate-300"
    : "bg-[#0070E0] hover:bg-[#005bb5] disabled:bg-slate-300";

  const contextTitle = isRegister
    ? (isPartner ? "Start Your Business Partner Account" : "Create Your Customer Account")
    : (isPartner ? "Welcome Back, Business Partner" : "Welcome Back");

  const contextSub = isRegister
    ? (isPartner ? "Start your free business partner account using your mobile number." : "Create your free HELLO customer account.")
    : (isPartner ? "Manage your business on HELLO." : "Sign in to discover local businesses and services.");

  const buttonLabel = isRegister
    ? (isPartner ? "Register as Business Partner" : "Register as Customer")
    : (isPartner ? "Partner Login with OTP" : "Login with OTP");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) {
      setPhoneNumber(val);
      if (error) setError(null);
    }
  };

  // Google mock sign-in — preserved from original (not functional OAuth)
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    const mockUser = {
      id: "usr_google_" + Date.now(),
      fullName: isPartner ? "SparkleSmart Electronics & Services" : "Verified Google User",
      email: isPartner ? "partner@sparklesmart.in" : "google.user@gmail.com",
      phoneNumber: "+91 98480 12345",
      status: "ACTIVE",
      preferredLanguage: "English",
      roles: isPartner ? ["VENDOR_OWNER", "CUSTOMER"] : ["CUSTOMER"],
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("hello_access_token", "jwt_google_oauth_" + Date.now());
      localStorage.setItem("hello_user", JSON.stringify(mockUser));
      localStorage.setItem("hello_active_role", isPartner ? "MERCHANT" : "CUSTOMER");
      window.dispatchEvent(new Event("hello_auth_changed"));
    }
    toast.queueCrossPage({
      type: isPartner ? "brand" : "success",
      title: isPartner ? "Partner Center Connected" : "Welcome to HELLO!",
      message: `Logged in successfully via Google as ${roleLabel}.`,
      duration: 4500,
    });
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!fullName.trim()) {
        setError(isPartner ? "Please enter Partner / Owner Full Name." : "Please enter your Full Name.");
        return;
      }
      if (!email.trim()) {
        setError("Please enter your Email Address.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address (e.g. name@example.com).");
        return;
      }
    }
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

      // ─── Step A: Enterprise Pre-OTP Registration & Role Check ─────────
      try {
        const checkRes = await fetch(`${API_BASE}/auth/check-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: fullPhone }),
        });
        const checkJson = await checkRes.json();

        if (checkRes.ok && checkJson.success && checkJson.data) {
          const uStatus = checkJson.data;

          if (isRegister) {
            // Register Mode checks
            if (uStatus.exists) {
              if (isPartner && uStatus.hasPartnerRole) {
                toast.warning(`Already this account was registered with Business Partner role. Please switch to Sign In.`);
                setError(`Already this account was registered with Business Partner role. Please switch to Sign In.`);
                setIsLoading(false);
                return;
              } else if (!isPartner && uStatus.hasCustomerRole) {
                toast.warning(`Already this account was registered with Customer role. Please switch to Sign In.`);
                setError(`Already this account was registered with Customer role. Please switch to Sign In.`);
                setIsLoading(false);
                return;
              } else if (isPartner && !uStatus.hasPartnerRole) {
                // Existing customer activating Business Partner role
                toast.info(`Welcome back ${uStatus.fullName || ""}! Upgrading your account to Business Partner.`);
              }
            } else {
              toast.info(`Welcome to HELLO! Creating your new ${roleLabel} account.`);
            }
          } else {
            // Login Mode checks
            if (!uStatus.exists) {
              toast.warning(`First you register the account before logging in.`);
              setIsLoading(false);
              if (onSwitchToRegister) {
                onSwitchToRegister(role);
              } else {
                router.push(`/login?mode=register`);
              }
              return;
            } else {
              if (isPartner && !uStatus.hasPartnerRole) {
                toast.warning(`This account is not registered as a Business Partner. First you register the Business Partner account.`);
                setIsLoading(false);
                if (onSwitchToRegister) {
                  onSwitchToRegister("PARTNER");
                } else {
                  router.push(`/login?mode=register`);
                }
                return;
              } else if (!isPartner && !uStatus.hasCustomerRole) {
                toast.warning(`This account is not registered as a Customer. First you register the Customer account.`);
                setIsLoading(false);
                if (onSwitchToRegister) {
                  onSwitchToRegister("CUSTOMER");
                } else {
                  router.push(`/login?mode=register`);
                }
                return;
              }
              toast.success(`Account verified! Sending verification OTP to +91 ${phoneNumber}...`);
            }
          }
        }
      } catch (checkErr) {
        console.warn("Pre-check endpoint non-blocking fallback:", checkErr);
      }

      // ─── Step B: Request OTP ───────────────────────────────────────────
      const res = await fetch(`${API_BASE}/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: fullPhone,
          purpose: isRegister ? "REGISTRATION" : "LOGIN",
          role: isPartner ? "PARTNER" : "CUSTOMER",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to dispatch verification code.");
      }

      const challengeId = json.data?.challengeId;
      const devOtp = json.data?.devOtp;

      // Persist for OTP page restore & profile update
      sessionStorage.setItem("hello_auth_phone", fullPhone);
      sessionStorage.setItem("hello_auth_challenge_id", challengeId);
      sessionStorage.setItem("hello_auth_intent", role === "PARTNER" ? "VENDOR_OWNER" : "CUSTOMER");
      sessionStorage.setItem("hello_auth_mode", mode);
      if (fullName.trim()) sessionStorage.setItem("hello_auth_name", fullName.trim());
      if (email.trim()) sessionStorage.setItem("hello_auth_email", email.trim());
      if (devOtp) sessionStorage.setItem("hello_auth_dev_otp", devOtp);

      // Navigate to verify-otp with intent & returnTo
      const returnTo = "/";
      router.push(
        `/verify-otp?phone=${encodeURIComponent(fullPhone)}&challengeId=${encodeURIComponent(challengeId)}${
          devOtp ? `&devOtp=${encodeURIComponent(devOtp)}` : ""
        }&returnTo=${encodeURIComponent(returnTo)}&intent=${role === "PARTNER" ? "VENDOR_OWNER" : "CUSTOMER"}&mode=${mode}`
      );
    } catch (err: any) {
      setError(err.message || "Unable to send verification code. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Back navigation & Role Badge in single compact row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          <span>Change Account Type</span>
        </button>

        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
          isPartner
            ? "bg-orange-50 text-[#FF6B35] border-orange-200"
            : "bg-blue-50 text-[#0076D7] border-blue-200"
        }`}>
          {isPartner ? <Store className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
          <span>{roleLabel} {isRegister ? "Registration" : "Login"}</span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-0.5">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {contextTitle}
        </h2>
        <p className="text-[11px] text-slate-500 leading-tight">{contextSub}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-2 rounded-lg bg-red-50 border border-red-200 flex items-start gap-1.5 text-red-700 text-[11px]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Registration-specific fields */}
        {isRegister && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                {isPartner ? "Partner / Owner Full Name *" : "Full Name *"}
              </label>
              <input
                type="text"
                required
                placeholder={isPartner ? "e.g. Ramesh Chandra (Proprietor)" : "e.g. Ramesh Kumar"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#0070E0] focus:bg-white rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder={isPartner ? "partner@yourbusiness.in" : "you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#0070E0] focus:bg-white rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* Phone input */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
            Mobile Number *
          </label>
          <div className={`flex items-center rounded-lg border border-slate-300 bg-white transition px-2.5 py-1.5 shadow-2xs ${accentRing} focus-within:ring-2`}>
            <span className="text-xs text-slate-700 font-semibold select-none pr-1.5">+91</span>
            <span className="text-slate-300 select-none pr-1.5">|</span>
            <input
              id="phone"
              type="tel"
              placeholder="Enter Mobile Number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              autoFocus
              disabled={isLoading}
              className="w-full text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex flex-col items-center justify-center text-center space-y-0.5 select-none pt-0.5">
          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-3 h-3 rounded cursor-pointer"
              style={{ accentColor }}
            />
            <span>I Agree to Terms and Conditions</span>
          </label>
          <Link href="/terms" className="text-[9px] text-slate-500 underline hover:text-slate-800 transition">
            T&amp;C&apos;s Privacy Policy
          </Link>
        </div>

        {/* OTP button */}
        <button
          type="submit"
          disabled={isLoading || phoneNumber.length !== 10 || !agreedToTerms}
          className={`w-full ${btnBg} disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-2 shadow-xs hover:shadow-md`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sending OTP...</span>
            </>
          ) : (
            <span>{buttonLabel}</span>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-1.5 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full absolute" />
          <span className="bg-white text-slate-500 text-[9px] px-2 py-0.5 rounded-full relative z-10 font-medium border border-slate-100">
            Or continue with
          </span>
        </div>

        {/* Google button — disabled until official backend OAuth */}
        <button
          type="button"
          disabled
          title="Google Sign-In is coming soon. Please sign in using verified Mobile OTP."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 cursor-not-allowed opacity-75 shadow-2xs"
        >
          <svg className="w-3.5 h-3.5 shrink-0 grayscale opacity-60" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google Sign-In (Coming Soon)</span>
        </button>
      </form>

      {/* Legal note */}
      <div className="text-center text-[9px] text-slate-400 leading-tight">
        By continuing, you agree to HELLO&apos;s Terms of Service and Privacy Policy.
      </div>
    </div>
  );
}

// ─── Main page content (reads ?mode= from URL) ────────────────────────────────
function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawMode = searchParams.get("mode");
  const rawRole = searchParams.get("role");
  const mode: AuthMode = rawMode === "register" ? "register" : "login";

  // step: "select" = role selection, "otp" = phone form
  const initialRole: AccountRole = rawRole?.toUpperCase() === "PARTNER" ? "PARTNER" : rawRole?.toUpperCase() === "CUSTOMER" ? "CUSTOMER" : null;
  const [step, setStep] = useState<"select" | "otp">(initialRole ? "otp" : "select");
  const [selectedRole, setSelectedRole] = useState<AccountRole>(initialRole);

  // Sync role if query param changes
  useEffect(() => {
    if (rawRole?.toUpperCase() === "PARTNER") {
      setSelectedRole("PARTNER");
      setStep("otp");
    } else if (rawRole?.toUpperCase() === "CUSTOMER") {
      setSelectedRole("CUSTOMER");
      setStep("otp");
    }
  }, [rawRole]);

  const handleRoleSelect = (role: AccountRole) => {
    setSelectedRole(role);
    setStep("otp");
  };

  const handleBack = () => {
    setStep("select");
    setSelectedRole(null);
  };

  const handleSwitchToRegister = (targetRole: AccountRole) => {
    setSelectedRole(targetRole);
    setStep("otp");
    router.replace(`/login?mode=register`);
  };

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      {/* LEFT: Unchanged brand panel */}
      <LeftBrandPanel mode={mode} />

      {/* RIGHT: Auth card */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-hidden">
        <div className="w-full max-w-md bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-100 flex flex-col justify-center">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#0076D7] flex items-center justify-center text-white font-black text-lg">H</div>
            <span className="text-xl font-black text-[#0076D7]">HELLO</span>
          </div>

          {/* Login / Register toggle pill */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-4">
            <Link
              href="/login?mode=login"
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
                mode === "login"
                  ? "bg-white text-[#0076D7] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/login?mode=register"
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
                mode === "register"
                  ? "bg-white text-[#0076D7] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Register Account
            </Link>
          </div>

          {/* Step content */}
          {step === "select" ? (
            <RoleSelectionStep mode={mode} onSelect={handleRoleSelect} />
          ) : (
            <OtpFormStep
              mode={mode}
              role={selectedRole}
              onBack={handleBack}
              onSwitchToRegister={handleSwitchToRegister}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Exported page with Suspense (required for useSearchParams) ───────────────
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#0076D7] flex items-center justify-center text-white font-black text-xl">H</div>
          <Loader2 className="w-5 h-5 animate-spin text-[#0076D7]" />
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
