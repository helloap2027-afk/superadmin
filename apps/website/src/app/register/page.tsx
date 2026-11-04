"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * /register now unifies into /login?mode=register
 * This redirect preserves any direct links to /register without breaking them.
 */
export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?mode=register");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#0076D7] flex items-center justify-center text-white font-black text-xl shadow-lg">
          H
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-[#0076D7]" />
        <p className="text-xs text-slate-500 font-medium">Loading registration...</p>
      </div>
    </div>
  );
}
