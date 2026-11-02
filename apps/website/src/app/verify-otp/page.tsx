"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, RefreshCw, ShieldCheck } from "lucide-react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const phone = searchParams.get("phone") || sessionStorage.getItem("hello_auth_phone") || "";
    const chl = searchParams.get("challengeId") || sessionStorage.getItem("hello_auth_challenge_id") || "";

    if (!phone || !chl) {
      router.replace("/login");
      return;
    }

    setPhoneNumber(phone);
    setChallengeId(chl);
    inputRefs.current[0]?.focus();
  }, [searchParams, router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const updated = [...digits];
      updated[index] = "";
      setDigits(updated);
      return;
    }

    // Single digit input
    const char = clean.slice(-1);
    const updated = [...digits];
    updated[index] = char;
    setDigits(updated);
    setError(null);

    // Auto-focus next input
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const updated = [...digits];
      for (let i = 0; i < 6; i++) {
        updated[i] = pasted[i] || "";
      }
      setDigits(updated);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      setError(null);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== 6) {
      setError("Please enter all 6 digits of the verification code.");
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
          deviceInfo: "HELLO Web Browser",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Invalid or expired OTP code.");
      }

      const { accessToken, refreshToken, user } = json.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("hello_access_token", accessToken);
        localStorage.setItem("hello_refresh_token", refreshToken);
        localStorage.setItem("hello_user", JSON.stringify(user));
      }

      // Check if profile completion is required
      if (user.isNewUser || !user.fullName) {
        router.push("/complete-profile");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Please check the code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      const res = await fetch("http://localhost:4000/api/v1/auth/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to resend code.");
      }

      setResendCooldown(json.data?.resendCooldownSeconds || 45);
      setResendSuccess(true);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setResendSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Unable to resend OTP. Please wait and try again.");
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
        
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0076D7] transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Mobile Number</span>
        </Link>

        {/* Header */}
        <div className="space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[#0076D7] flex items-center justify-center mb-4 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verify Mobile Number
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            We sent a 6-digit verification code to{" "}
            <span className="font-bold text-slate-800">{phoneNumber}</span>.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>A new verification code has been dispatched to your phone!</span>
          </div>
        )}

        {/* 6-Digit OTP Inputs */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                disabled={isLoading}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#0076D7] focus:bg-white focus:outline-none transition shadow-2xs"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isComplete}
            className="w-full bg-[#0076D7] hover:bg-[#005FAE] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Secure Code...</span>
              </>
            ) : (
              <span>Verify &amp; Continue</span>
            )}
          </button>
        </form>

        {/* Resend Cooldown Counter */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Didn't receive the code?</span>
          {resendCooldown > 0 ? (
            <span className="font-semibold text-slate-400">
              Resend in <span className="text-[#0076D7] font-bold">{resendCooldown}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-bold text-[#0076D7] hover:text-[#005FAE] transition flex items-center gap-1 hover:underline"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Resending...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Code</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="text-sm font-bold text-slate-500">Loading verification...</div>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
