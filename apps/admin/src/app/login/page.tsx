"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  ShoppingCart,
  Users,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2
} from "lucide-react";
import { HelloLogo } from "@/components/brand/HelloLogo";
import { PhoneMockup } from "@/components/login/PhoneMockup";
import { CityIllustration } from "@/components/login/CityIllustration";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@hello-hi.in");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isMfaStep, setIsMfaStep] = useState(false);
  const [mfaChallengeId, setMfaChallengeId] = useState("");
  const [mfaCode, setMfaCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("http://localhost:4000/api/v1/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          deviceInfo: "Super Admin Desktop Console",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Invalid administrator credentials.");
      }

      if (json.data?.requiresMfa) {
        setMfaChallengeId(json.data.mfaChallengeId);
        setIsMfaStep(true);
        setIsLoading(false);
        return;
      }

      // Store authentic admin session
      if (typeof window !== "undefined") {
        localStorage.setItem("hello_admin_token", json.data.accessToken);
        localStorage.setItem("hello_admin_refresh_token", json.data.refreshToken);
        localStorage.setItem("hello_admin_session", JSON.stringify({
          email: json.data.user.email,
          role: json.data.user.role || "SUPER_ADMIN",
          name: json.data.user.fullName || "Super Admin",
          token: json.data.accessToken,
        }));
      }

      // Navigate to Super Admin Console
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication failed. Please verify your administrator credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length !== 6) {
      setErrorMessage("Please enter the 6-digit MFA verification code.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const res = await fetch("http://localhost:4000/api/v1/admin/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mfaChallengeId,
          code: mfaCode.trim(),
          deviceInfo: "Super Admin Desktop Console",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Invalid MFA code.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("hello_admin_token", json.data.accessToken);
        localStorage.setItem("hello_admin_refresh_token", json.data.refreshToken);
        localStorage.setItem("hello_admin_session", JSON.stringify({
          email: json.data.user.email,
          role: json.data.user.role || "SUPER_ADMIN",
          name: json.data.user.fullName || "Super Admin",
          token: json.data.accessToken,
        }));
      }

      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "MFA verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-screen max-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] overflow-hidden select-none selection:bg-[#0076D7]/20"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* =========================================================================
          LEFT BRANDING PANEL (~56.6% width on Desktop, matching reference design)
         ========================================================================= */}
      <div className="w-full lg:w-[56.6%] h-full max-h-screen bg-gradient-to-br from-[#0056B8] via-[#0076D7] to-[#1689ED] relative text-white p-5 sm:p-7 lg:p-9 xl:p-12 flex flex-col justify-between overflow-hidden shrink-0">
        
        {/* Soft Translucent Concentric Glow Rings */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-sky-300/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-blue-900/30 blur-2xl pointer-events-none" />

        {/* Top Hello Brand Logo */}
        <div className="relative z-20">
          <HelloLogo variant="light" size="lg" />
        </div>

        {/* Main Content Area (Headline, Description, 4 Features, and 3D Phone) */}
        <div className="relative z-20 my-auto py-2 lg:py-4 flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-8">
          
          {/* Left Text Column (~480px) */}
          <div className="max-w-[460px] w-full space-y-4 lg:space-y-5">
            {/* Headline (3 lines at reference desktop width) */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold text-white tracking-tight leading-[1.16]">
              India’s Hyperlocal<br />
              B2C Discovery &amp;<br />
              B2B Wholesale Super-App.
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-base text-white/95 font-normal leading-relaxed max-w-[440px]">
              Connect people, businesses and opportunities in every city and town.
            </p>

            {/* 4 Feature Highlights */}
            <div className="space-y-2.5 sm:space-y-3 pt-1">
              {/* Feature 1: Local Business Discovery */}
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white shrink-0 shadow-sm transition group-hover:scale-105">
                  <Store className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-white tracking-wide leading-snug">
                    Local Business Discovery
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/80 font-normal">
                    Shops, services, doctors, restaurants and more
                  </p>
                </div>
              </div>

              {/* Feature 2: B2B Wholesale Marketplace */}
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white shrink-0 shadow-sm transition group-hover:scale-105">
                  <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-white tracking-wide leading-snug">
                    B2B Wholesale Marketplace
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/80 font-normal">
                    Manufacturers, suppliers and bulk buyers
                  </p>
                </div>
              </div>

              {/* Feature 3: Empowering Local Businesses */}
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white shrink-0 shadow-sm transition group-hover:scale-105">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-white tracking-wide leading-snug">
                    Empowering Local Businesses
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/80 font-normal">
                    Grow with digital listings and leads
                  </p>
                </div>
              </div>

              {/* Feature 4: India's Hyperlocal Network */}
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white shrink-0 shadow-sm transition group-hover:scale-105">
                  <Smartphone className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-white tracking-wide leading-snug">
                    India&apos;s Hyperlocal Network
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/80 font-normal">
                    From metros to every growing city
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Smartphone 3D Angled Mockup */}
          <div className="hidden xl:flex items-center justify-center relative z-20 shrink-0 self-center pr-1">
            <PhoneMockup />
          </div>
        </div>

        {/* Decorative Cityscape Silhouette along Bottom */}
        <CityIllustration />
      </div>

      {/* =========================================================================
          RIGHT AUTHENTICATION PANEL (~43.4% width on Desktop, matching reference)
         ========================================================================= */}
      <div className="w-full lg:w-[43.4%] h-full max-h-screen bg-white flex flex-col justify-center items-center px-4 sm:px-8 lg:px-10 xl:px-12 py-3 lg:py-6 relative overflow-hidden shrink-0">
        
        {/* Subtle Pastel Corner Decorative Blushes (Matching Reference Screenshot) */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/40 via-sky-50/30 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-orange-100/35 via-rose-50/20 to-transparent rounded-tl-full pointer-events-none" />

        <div className="w-full max-w-[440px] xl:max-w-[460px] z-10 flex flex-col items-center">
          
          {/* Centered Brand Logo */}
          <div className="mb-2 sm:mb-3 lg:mb-4 flex justify-center">
            <HelloLogo variant="dark" size="lg" />
          </div>

          {/* Welcome Heading & Subtitle */}
          <div className="text-center mb-4 sm:mb-5 lg:mb-6 space-y-0.5 sm:space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#0B1220] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] font-normal">
              Sign in to your Hello-Hi Admin Panel
            </p>
          </div>

          {/* Login Form Card */}
          <div className="w-full bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl p-5 sm:p-6 lg:p-7 space-y-3.5 sm:space-y-4">
            {errorMessage && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isMfaStep ? (
              <form onSubmit={handleMfaSubmit} className="space-y-4">
                <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl">
                  <strong>Two-Factor Verification Required</strong>
                  <p className="mt-0.5 text-sky-700">Enter the 6-digit MFA security token generated for your administrator account.</p>
                </div>

                <div className="space-y-1 text-left">
                  <label className="block text-xs font-semibold text-[#0B1220]">
                    6-Digit Security Token
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="••••••"
                    className="w-full h-12 text-center text-2xl font-black tracking-widest bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#0076D7] focus:bg-white focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || mfaCode.length !== 6}
                  className="w-full h-11 bg-gradient-to-r from-[#0076D7] to-[#0067CA] hover:from-[#0067CA] hover:to-[#0056B8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <span>Verify &amp; Enter Console</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMfaStep(false)}
                  className="w-full text-xs text-slate-500 hover:text-slate-800 text-center pt-2"
                >
                  ← Back to Password Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                {/* Email Address Field */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-semibold text-[#0B1220]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full h-10 sm:h-11 bg-white border border-slate-200 rounded-xl pl-10 pr-3 text-xs sm:text-sm text-[#0B1220] placeholder-[#94A3B8] focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/10 transition font-normal"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-semibold text-[#0B1220]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-10 sm:h-11 bg-white border border-slate-200 rounded-xl pl-10 pr-10 text-xs sm:text-sm text-[#0B1220] placeholder-[#94A3B8] focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/10 transition font-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0B1220] transition"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#0076D7] focus:ring-[#0076D7] border-slate-300 accent-[#0076D7]"
                    />
                    <span className="text-slate-600 font-medium">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert("Please contact platform root administration to reset Super Admin access credentials.")}
                    className="text-xs font-medium text-[#0076D7] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 sm:h-12 mt-1 bg-gradient-to-r from-[#0076D7] to-[#0067CA] hover:from-[#0067CA] hover:to-[#0056B8] text-white rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.99] transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* OR Divider */}
            <div className="relative my-2 sm:my-3 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
                OR
              </span>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={() => alert("Google Single Sign-On is configured for authorized corporate Google Workspace accounts.")}
              className="w-full h-10 sm:h-11 bg-white hover:bg-slate-50 border border-slate-200 rounded-full font-medium text-xs sm:text-sm text-slate-700 flex items-center justify-center gap-2.5 shadow-2xs hover:border-slate-300 active:scale-[0.99] transition"
            >
              {/* Google 4-Color SVG Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.14 0 9.99 0 12s.45 3.86 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-3 sm:mt-4 lg:mt-5 text-center text-[10px] sm:text-[11px] text-[#94A3B8]">
            <span>© 2026 HELLO Technologies Pvt. Ltd. • Super Admin Console</span>
          </div>
        </div>
      </div>
    </div>
  );
}
