"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw, LogIn, ArrowLeft } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Super Admin Console caught client error:", error);
  }, [error]);

  const handleResetSession = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("hello_admin_session");
        localStorage.removeItem("hello_admin_token");
        localStorage.removeItem("hello_admin_refresh_token");
      } catch {}
    }
    router.replace("/login");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#0B1220] text-white p-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Super Admin Console Notice</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The administrative workspace encountered a display exception during rendering. You can retry the current view or return to the authenticated login portal.
          </p>
        </div>

        {error?.message && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-left">
            <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold mb-1">
              Diagnostic Detail
            </span>
            <p className="text-[11px] font-mono text-rose-400 break-all leading-snug">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0076D7] hover:bg-[#005bb0] text-white transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <button
            type="button"
            onClick={handleResetSession}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Go to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

