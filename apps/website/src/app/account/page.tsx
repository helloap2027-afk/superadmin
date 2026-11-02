"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Shield, LogOut, Laptop, Smartphone, Trash2, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Store } from "lucide-react";

export default function CustomerAccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    // Load User Profile
    fetch("http://localhost:4000/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setUser(json.data);
          localStorage.setItem("hello_user", JSON.stringify(json.data));
        } else {
          router.replace("/login");
        }
      })
      .catch(() => router.replace("/login"))
      .finally(() => setIsLoading(false));

    // Load Active Sessions
    fetch("http://localhost:4000/api/v1/auth/sessions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSessions(json.data);
        }
      })
      .catch(() => {});
  }, [router]);

  const handleRevokeSession = async (sessionId: string) => {
    const token = localStorage.getItem("hello_access_token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/auth/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setActionMessage("Session revoked successfully.");
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch {}
  };

  const handleLogoutAll = async () => {
    const token = localStorage.getItem("hello_access_token");
    if (!token) return;

    try {
      await fetch("http://localhost:4000/api/v1/auth/logout-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      router.replace("/login");
    } catch {}
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("hello_access_token");
    const refreshToken = localStorage.getItem("hello_refresh_token") || undefined;
    if (token) {
      try {
        await fetch("http://localhost:4000/api/v1/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {}
    }
    localStorage.clear();
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin text-[#0076D7]" />
          <span>Loading Account...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0076D7] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery Home</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {actionMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0076D7] to-sky-400 flex items-center justify-center text-white font-black text-2xl shadow-md">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {user?.fullName || "HELLO Customer"}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-200">
                    Verified in Database
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {user?.phoneNumber}
                  </span>
                  {user?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {user.email}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {user?.roles?.includes("VENDOR_OWNER") ? (
                <Link
                  href="/vendor/login"
                  className="px-4 py-2.5 rounded-2xl bg-[#FF6B35] hover:bg-[#E5531E] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Store className="w-4 h-4" />
                  <span>Vendor Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/vendor/register"
                  className="px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#FF6B35] border border-orange-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Store className="w-4 h-4" />
                  <span>Register a Business</span>
                </Link>
              )}
            </div>
          </div>

          {/* Real Database Fields Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Database User ID</span>
              <span className="font-mono text-slate-800 font-bold text-[11px] truncate block" title={user?.id}>{user?.id || "N/A"}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">City & Locality</span>
              <span className="font-bold text-slate-800 block truncate">
                {user?.locality?.name ? `${user.locality.name}, ${user.locality.cityName}` : "Primary Pilot Region"}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Preferred Language</span>
              <span className="font-bold text-slate-800 block">{user?.preferredLanguage || "English"}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Registered In DB</span>
              <span className="font-bold text-slate-800 block">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Just now"}
              </span>
            </div>
          </div>

          {/* Live DB SQL Record Viewer */}
          <div className="pt-2">
            <details className="group rounded-2xl bg-slate-900 text-slate-100 p-4 border border-slate-800 transition">
              <summary className="text-xs font-bold font-mono text-sky-400 cursor-pointer select-none flex items-center justify-between">
                <span>▶ View Live Relational DB Record (`users` table)</span>
                <span className="text-[10px] text-slate-400 font-sans font-normal">Stored in SQLite / MariaDB</span>
              </summary>
              <pre className="mt-3 p-3 bg-slate-950 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-400 border border-slate-800 leading-relaxed">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Quick Portal Switcher Banner */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-blue-900 font-bold">Quick Auth Links:</span>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 bg-white border border-blue-200 rounded-xl font-bold text-[#0076D7] hover:bg-blue-50 transition shadow-xs">
              Show Login Page
            </Link>
            <Link href="/register" className="px-3 py-1.5 bg-white border border-blue-200 rounded-xl font-bold text-[#0076D7] hover:bg-blue-50 transition shadow-xs">
              Show Registration Page
            </Link>
            <Link href="/complete-profile" className="px-3 py-1.5 bg-white border border-blue-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs">
              Edit Complete Profile
            </Link>
          </div>
        </div>

        {/* Active Sessions & Security */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0076D7]" />
                <span>Active Login Sessions</span>
              </h2>
              <p className="text-xs text-slate-500">
                Manage all authorized devices currently authenticated with your account.
              </p>
            </div>

            {sessions.length > 1 && (
              <button
                onClick={handleLogoutAll}
                className="text-xs font-bold text-red-600 hover:text-red-700 transition hover:underline"
              >
                Revoke All Other Devices
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {sessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active session records found.
              </div>
            ) : (
              sessions.map((sess) => (
                <div key={sess.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      {sess.deviceInfo?.toLowerCase().includes("phone") ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {sess.deviceInfo || "Web Browser"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        IP: {sess.ipAddress || "127.0.0.1"} • Connected: {new Date(sess.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Revoke Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
