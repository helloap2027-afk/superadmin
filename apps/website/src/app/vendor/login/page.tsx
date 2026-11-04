"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  Building2,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ExternalLink,
  HelpCircle,
  Check
} from "lucide-react";
import { toast } from "@/components/Toast";

export default function VendorLoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  
  // OTP Form States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  
  // Password Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & loading
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quick Demo fill
  const handleQuickDemoFill = () => {
    if (authMode === "otp") {
      setPhoneNumber("9848012345");
      setError(null);
    } else {
      setEmail("admin@hello-hi.in");
      setPassword("admin123");
      setError(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) {
      setPhoneNumber(val);
      if (error) setError(null);
    }
  };

  // Google Partner Sign-In
  const handleGooglePartnerSignIn = () => {
    setIsLoading(true);
    const mockVendorUser = {
      id: "usr_vendor_" + Date.now(),
      fullName: "SparkleSmart Electronics & Services",
      email: "partner@sparklesmart.in",
      phoneNumber: "+91 98480 12345",
      status: "ACTIVE",
      preferredLanguage: "English",
      roles: ["VENDOR_OWNER", "CUSTOMER"],
      ownedBusinesses: [
        {
          id: "biz_sparkle_01",
          name: "SparkleSmart Electronics",
          slug: "sparklesmart-electronics",
          isVerified: true,
          status: "APPROVED"
        }
      ]
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("hello_access_token", "jwt_vendor_google_oauth_" + Date.now());
      localStorage.setItem("hello_user", JSON.stringify(mockVendorUser));
    }

    toast.queueCrossPage({
      type: "brand",
      title: "Partner Center Connected",
      message: `Welcome, ${mockVendorUser.fullName}! Merchant console loaded.`,
      duration: 5000,
    });

    router.push("/vendor/dashboard");
  };

  // Submit Handler for OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit registered business mobile number.");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the HELLO Partner Terms and Conditions.");
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
        throw new Error(json.message || "Failed to dispatch partner verification code.");
      }

      const challengeId = json.data?.challengeId;
      const devOtp = json.data?.devOtp;
      sessionStorage.setItem("hello_auth_phone", fullPhone);
      sessionStorage.setItem("hello_auth_challenge_id", challengeId);
      if (devOtp) sessionStorage.setItem("hello_auth_dev_otp", devOtp);

      router.push(
        `/verify-otp?phone=${encodeURIComponent(fullPhone)}&challengeId=${encodeURIComponent(challengeId)}${
          devOtp ? `&devOtp=${encodeURIComponent(devOtp)}` : ""
        }&returnTo=${encodeURIComponent("/vendor/dashboard")}`
      );
    } catch (err: any) {
      setError(err.message || "Unable to send verification code. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Handler for Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both business email and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/api/v1/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          deviceInfo: "Partner Center Console",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Invalid business email or password credentials.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("hello_access_token", json.data.accessToken);
        localStorage.setItem("hello_admin_token", json.data.accessToken);
        localStorage.setItem(
          "hello_user",
          JSON.stringify({
            id: json.data.user.id || "usr_partner_admin",
            fullName: json.data.user.fullName || "Business Partner Admin",
            email: json.data.user.email,
            phoneNumber: "+91 98480 12345",
            roles: ["VENDOR_OWNER", "SUPER_ADMIN"],
            status: "ACTIVE"
          })
        );
      }

      toast.queueCrossPage({
        type: "brand",
        title: "Partner Administrator Authenticated",
        message: "Logged in successfully to Merchant Portal.",
        duration: 5000,
      });

      router.push("/vendor/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify your business credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* LEFT: Business Partner Visual Branding Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#1E293B] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow Effects with warm Partner Orange Accent */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF6B35]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        {/* Top: Logo & Partner Hub Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight leading-none text-white">
                  HELLO<span className="text-[#FF6B35]">-Hi</span>
                </span>
                <span className="bg-[#FF6B35]/20 text-[#FF6B35] text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-[#FF6B35]/40 tracking-wider">
                  Partner Center
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                Merchant &amp; Vendor Management Console
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Value Propositions for Local Businesses */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 backdrop-blur-md border border-orange-500/20 text-[#FF6B35] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powering Local Business Growth Across AP &amp; Telangana</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight text-white">
              Connect With Ready-to-Buy Local Customers Instantly.
            </h1>
            <p className="text-slate-300 text-sm xl:text-base leading-relaxed">
              HELLO routes high-intent customer requests directly to your mobile phone and WhatsApp. Zero commission, authentic inquiries, and real-time lead analytics.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1.5 hover:bg-white/10 transition">
              <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-[#FF6B35] flex items-center justify-center text-sm font-bold">
                ⚡
              </div>
              <div className="text-xs font-bold text-white">Direct WhatsApp Leads</div>
              <div className="text-[11px] text-slate-400 leading-snug">
                Receive customer RFQs and quote enquiries straight into your WhatsApp inbox.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1.5 hover:bg-white/10 transition">
              <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center text-sm font-bold">
                ₹0
              </div>
              <div className="text-xs font-bold text-white">Zero Commission</div>
              <div className="text-[11px] text-slate-400 leading-snug">
                Keep 100% of your earnings. No hidden transaction cuts or lead middleman fees.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1.5 hover:bg-white/10 transition">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                🛡️
              </div>
              <div className="text-xs font-bold text-white">DPDP 2023 Verified</div>
              <div className="text-[11px] text-slate-400 leading-snug">
                Masked customer phone calls and OTP-verified buyer profiles to eliminate spam.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1.5 hover:bg-white/10 transition">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">
                📈
              </div>
              <div className="text-xs font-bold text-white">Local SEO &amp; Reviews</div>
              <div className="text-[11px] text-slate-400 leading-snug">
                Rank top on hyperlocal search in Hitec City, Vijayawada, and Guntur.
              </div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span className="block text-lg font-black text-white">10,000+</span>
              <span>Verified Vendors</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="block text-lg font-black text-white">150K+</span>
              <span>Monthly Searches</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="block text-lg font-black text-[#FF6B35]">₹0 Cut</span>
              <span>100% Free Leads</span>
            </div>
          </div>
        </div>

        {/* Bottom: Support & Security */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Bank Grade SSL Encryption</span>
          </div>
          <Link href="/contact" className="hover:text-white transition">
            Merchant Support Hub →
          </Link>
        </div>
      </div>

      {/* RIGHT: Partner Authentication Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header (Shown on small screens) */}
          <div className="lg:hidden text-center space-y-2 mb-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900">
                HELLO<span className="text-[#FF6B35]">-Hi</span>
              </span>
            </Link>
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Business Partner Center
            </div>
          </div>

          {/* Card Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-[#FF6B35] border border-orange-200">
                <Store className="w-3 h-3" /> Partner Portal
              </span>
              {/* Quick Demo Fill button */}
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[11px] font-bold text-[#FF6B35] hover:text-[#E5531E] hover:underline flex items-center gap-1"
                title="Fill with test vendor number"
              >
                <Zap className="w-3 h-3" />
                <span>Quick Demo Fill</span>
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Business Partner Login
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sign in to manage your business profile, customer leads, and rate cards.
            </p>
          </div>

          {/* Mode Switcher Tabs: OTP vs Password */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("otp");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition text-center flex items-center justify-center gap-1.5 ${
                authMode === "otp"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("password");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition text-center flex items-center justify-center gap-1.5 ${
                authMode === "password"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Email &amp; Password</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* OTP FORM */}
          {authMode === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registered Business Mobile Number *
                </label>
                <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-orange-100 bg-white transition px-4 py-3.5 shadow-2xs">
                  <span className="text-base text-slate-700 font-semibold select-none pr-3">
                    +91
                  </span>
                  <span className="text-slate-300 select-none pr-3">|</span>
                  <input
                    id="partner-phone"
                    type="tel"
                    placeholder="Enter Business Mobile Number"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    autoFocus
                    disabled={isLoading}
                    className="w-full text-base font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Enter 10-digit mobile number linked to business</span>
                  {phoneNumber.length === 10 && (
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Valid
                    </span>
                  )}
                </div>
              </div>

              {/* Checkbox: Partner Terms */}
              <div className="flex flex-col items-center justify-center text-center space-y-1 select-none pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF6B35] accent-[#FF6B35] cursor-pointer"
                  />
                  <span>I agree to HELLO Partner Terms &amp; Conditions</span>
                </label>
                <Link
                  href="/terms"
                  className="text-[11px] text-slate-500 underline hover:text-slate-800 transition"
                >
                  Partner Policies &amp; DPDP Compliance
                </Link>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading || phoneNumber.length !== 10 || !agreedToTerms}
                className="w-full bg-[#FF6B35] hover:bg-[#E5531E] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-base transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Partner OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Business Login OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* PASSWORD FORM */}
          {authMode === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business Email Address *
                </label>
                <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-orange-100 bg-white transition px-4 py-3 shadow-2xs">
                  <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="email"
                    placeholder="partner@business.in or admin@hello-hi.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    disabled={isLoading}
                    className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-orange-100 bg-white transition px-4 py-3 shadow-2xs">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF6B35] accent-[#FF6B35]"
                  />
                  <span>Remember session</span>
                </label>
                <Link href="/contact" className="text-slate-500 hover:text-[#FF6B35]">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-[#FF6B35] hover:bg-[#E5531E] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-base transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Partner Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider: Or Login Using */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-slate-200 w-full absolute" />
            <span className="bg-[#F8FAFC] text-slate-400 text-xs px-3.5 py-1 rounded-full relative z-10 font-medium">
              Or Sign In With
            </span>
          </div>

          {/* Google Partner Sign In */}
          <button
            type="button"
            onClick={handleGooglePartnerSignIn}
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
            <span>Continue with Google Business</span>
          </button>

          {/* Quick Links & Switchers */}
          <div className="mt-8 pt-6 border-t border-slate-200/90 space-y-3 text-center">
            {/* Link back to Customer Login */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <span>Are you a customer seeking services?</span>
              <Link href="/login" className="font-bold text-[#0076D7] hover:underline">
                Customer Login →
              </Link>
            </div>

            {/* Link to Register New Business Free */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <span>New merchant without a listing?</span>
              <Link href="/?action=add-business" className="font-bold text-[#FF6B35] hover:underline">
                Add Your Business Free (₹0) →
              </Link>
            </div>

            {/* Link to Super Admin Console */}
            <div className="pt-2 text-[11px] text-slate-400">
              HELLO Platform Administrator?{" "}
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 font-semibold underline"
              >
                Super Admin Console (Port 3001) ↗
              </a>
            </div>
          </div>

          {/* Legal note */}
          <div className="text-center text-[10px] text-slate-400 leading-relaxed pt-2">
            By signing in, you agree to HELLO Partner Guidelines, Fair Pricing Standards, and DPDP Act 2023 regulations.
          </div>
        </div>
      </div>
    </div>
  );
}
