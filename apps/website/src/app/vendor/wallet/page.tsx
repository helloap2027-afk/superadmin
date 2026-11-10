"use client";

import React, { useState, useEffect, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUpDown,
  History,
  Gift,
  PlusCircle,
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Calendar,
  MoreVertical,
  Store,
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Users,
  FileText,
  LogOut,
  ChevronDown,
  RefreshCw,
  Search,
  Check
} from "lucide-react";
import { BusinessPartnerHeader } from "@/components/vendor/BusinessPartnerHeader";
import { PartnerPortalSidebar } from "@/components/vendor/PartnerPortalSidebar";

const API_BASE = "http://localhost:4000/api/v1";

interface WalletSummary {
  walletId: string;
  balance: number;
  balancePaise: number;
  currency: string;
  status: string;
  totalCredits: number;
  totalDebits: number;
  totalRewards?: number;
  lastTransactionAt?: string | null;
}

interface WalletTxn {
  id: string;
  type: string;
  category: string;
  amount: number;
  amountPaise: number;
  balanceAfter: number;
  balanceAfterPaise: number;
  reference: string;
  reason: string;
  status: string;
  createdAt: string;
}

export default function BusinessPartnerWalletPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = useState<WalletTxn[]>([]);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"ALL" | "TOPUP" | "REWARD">("ALL");
  const [profile, setProfile] = useState<any>(null);

  // Add Money Modal State
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<string>("2000");
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupStatus, setTopupStatus] = useState<"IDLE" | "SUCCESS" | "FAILED">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
      const userStr = typeof window !== "undefined" ? localStorage.getItem("hello_user") : null;
      let uid = "";
      if (userStr) {
        try {
          uid = JSON.parse(userStr).id || "";
        } catch {}
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (uid) headers["x-user-id"] = uid;

      // 1. Fetch Merchant Profile
      const profRes = await fetch(`${API_BASE}/merchant/profile`, { headers });
      const profJson = await profRes.json();
      if (profJson?.success && profJson.data) {
        setProfile(profJson.data);
      }

      // 2. Fetch Wallet Summary & Transactions
      const res = await fetch(`${API_BASE}/merchant/wallet`, { headers });
      const json = await res.json();
      if (json?.success && json.data) {
        setWallet(json.data.wallet);
        setTransactions(json.data.transactions || []);
      }
    } catch (err) {
      console.error("Failed to load business partner wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const businessName = profile?.business?.name || "Vinod Tech Mobile Hub";
  const verified = profile?.business?.isVerified ?? true;
  const partnerInitial = businessName.charAt(0).toUpperCase();

  // Financial Stats
  const liveBalance = wallet?.balance ?? 5750;
  const totalAdded = wallet?.totalCredits ?? 12000;
  const totalSpent = wallet?.totalDebits ?? 6250;
  const totalRewards = wallet?.totalRewards ?? 500;
  const lastTxnDate = wallet?.lastTransactionAt
    ? new Date(wallet.lastTransactionAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "02 Nov 2026, 04:21 PM";

  // Filtered List
  const filteredList = transactions.filter((t) => {
    if (activeTab === "TOPUP") {
      return t.type === "TOPUP" || t.category === "TOPUP";
    }
    if (activeTab === "REWARD") {
      return t.type === "CREDIT" && (t.category === "REWARD" || t.reason?.toLowerCase().includes("reward"));
    }
    if (filterType !== "ALL") {
      return t.type === filterType;
    }
    return true;
  });

  // Handle Online Top-up Payment with Idempotency Key
  const handleInitiateTopup = async () => {
    const amt = parseFloat(topupAmount);
    if (isNaN(amt) || amt < 100) {
      alert("Minimum top-up amount is ₹100");
      return;
    }

    try {
      setTopupLoading(true);
      setErrorMessage("");
      setTopupStatus("IDLE");

      const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
      const userStr = typeof window !== "undefined" ? localStorage.getItem("hello_user") : null;
      let uid = "";
      if (userStr) {
        try { uid = JSON.parse(userStr).id || ""; } catch {}
      }

      // Generate Idempotency Key
      const idempotencyKey = `topup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await fetch(`${API_BASE}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(uid ? { "x-user-id": uid } : {})
        },
        body: JSON.stringify({
          amount: amt,
          currency: "INR",
          purpose: "WALLET_TOPUP",
          userType: "MERCHANT",
          idempotencyKey
        })
      });

      const json = await res.json();
      if (!json?.success) {
        setTopupStatus("FAILED");
        setErrorMessage(json?.message || "Failed to initiate payment");
        return;
      }

      // Execute Simulated Gateway Webhook Fulfillment
      const simulateRes = await fetch(`${API_BASE}/payments/sandbox/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: json.data.orderId,
          outcome: "SUCCESS"
        })
      });

      const simJson = await simulateRes.json();
      if (simJson?.success) {
        setTopupStatus("SUCCESS");
        await fetchWalletData();
        setTimeout(() => {
          setIsAddMoneyOpen(false);
          setTopupStatus("IDLE");
        }, 1500);
      } else {
        setTopupStatus("FAILED");
        setErrorMessage(simJson?.message || "Payment simulation failed");
      }
    } catch (err: any) {
      setTopupStatus("FAILED");
      setErrorMessage(err?.message || "Network error while completing transaction");
    } finally {
      setTopupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-800 font-sans flex flex-col">
      {/* Top Header */}
      <BusinessPartnerHeader activeNav="Wallet" />

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col md:flex-row items-start gap-6">
        
        {/* ======================================================== */}
        {/* LEFT SIDEBAR (Identical to Approved Master Design)        */}
        {/* ======================================================== */}
        <PartnerPortalSidebar activeKey="wallet" />

        {/* ======================================================== */}
        {/* RIGHT MAIN CONTENT AREA                                   */}
        {/* ======================================================== */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B35]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">My Wallet</h1>
                <p className="text-xs text-slate-500">Manage your wallet balance, add funds, and view transaction history.</p>
              </div>
            </div>

            <Link
              href="/contact-support"
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Wallet Help</span>
            </Link>
          </div>

          {/* Top Banner Row: Live Balance Card + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Primary Blue Card: Wallet Balance */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#0062D2] via-[#0076D7] to-[#0A85EA] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[190px]">
              {/* Background wallet graphic decoration */}
              <div className="absolute right-4 bottom-2 opacity-95 pointer-events-none select-none">
                <div className="relative w-36 h-28 flex items-center justify-center">
                  <div className="w-28 h-20 bg-amber-400 rounded-2xl shadow-xl flex items-center justify-center relative">
                    <div className="w-6 h-6 rounded-full bg-amber-200 border-2 border-amber-500" />
                  </div>
                  <div className="absolute -left-3 bottom-0 flex gap-1">
                    <div className="w-7 h-5 bg-yellow-300 rounded-md shadow border border-yellow-400" />
                    <div className="w-7 h-5 bg-yellow-300 rounded-md shadow border border-yellow-400 -mt-2" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-blue-100 text-xs font-semibold">
                  <span>Wallet Balance</span>
                  <HelpCircle className="w-3 h-3 text-blue-200" />
                </div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight mt-2 flex items-baseline gap-1">
                  <span>₹</span>
                  <span>{liveBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active</span>
                </span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">Quick Actions</h2>
              <div className="grid grid-cols-4 gap-2 mt-3">
                
                {/* Add Money Button */}
                <button
                  onClick={() => setIsAddMoneyOpen(true)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl hover:bg-orange-50/80 transition group border border-transparent hover:border-orange-100"
                >
                  <div className="w-10 h-10 rounded-2xl bg-orange-100/70 text-[#FF6B35] flex items-center justify-center group-hover:scale-105 transition shadow-sm">
                    <PlusCircle className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-2 group-hover:text-[#FF6B35]">Add Money</span>
                </button>

                {/* Transfer Button */}
                <button
                  onClick={() => alert("Bank withdrawal / transfer requests are processed via Super Admin compliance.")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl hover:bg-sky-50/80 transition group border border-transparent hover:border-sky-100"
                >
                  <div className="w-10 h-10 rounded-2xl bg-sky-100/70 text-[#0076D7] flex items-center justify-center group-hover:scale-105 transition shadow-sm">
                    <ArrowUpDown className="w-5 h-5 text-[#0076D7]" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-2 group-hover:text-[#0076D7]">Transfer</span>
                </button>

                {/* History Button */}
                <button
                  onClick={() => {
                    setActiveTab("ALL");
                    setFilterType("ALL");
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl hover:bg-slate-50 transition group border border-transparent hover:border-slate-200"
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-105 transition shadow-sm">
                    <History className="w-5 h-5 text-slate-600" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-2">History</span>
                </button>

                {/* Offers & Rewards Button */}
                <button
                  onClick={() => setActiveTab("REWARD")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl hover:bg-purple-50/80 transition group border border-transparent hover:border-purple-100"
                >
                  <div className="w-10 h-10 rounded-2xl bg-purple-100/70 text-purple-600 flex items-center justify-center group-hover:scale-105 transition shadow-sm">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-2 group-hover:text-purple-600">Offers &amp; Rewards</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Summary Metrics Stat Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Added */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Added</span>
                <div className="text-base font-black text-slate-900 truncate">
                  ₹ {totalAdded.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Total Spent */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Spent</span>
                <div className="text-base font-black text-slate-900 truncate">
                  ₹ {totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Total Rewards */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Rewards</span>
                <div className="text-base font-black text-slate-900 truncate">
                  ₹ {totalRewards.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Last Transaction */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Last Transaction</span>
                <div className="text-xs font-bold text-slate-800 truncate">{lastTxnDate}</div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TABBED TRANSACTION LEDGER TABLE                          */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            
            {/* Header / Tabs Row */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Tabs */}
              <div className="flex items-center gap-6 border-b sm:border-b-0 border-slate-200 pb-2 sm:pb-0">
                <button
                  onClick={() => { setActiveTab("ALL"); setFilterType("ALL"); }}
                  className={`text-xs font-bold pb-2 relative transition ${
                    activeTab === "ALL" ? "text-slate-900 font-black" : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <span>Transaction History</span>
                  {activeTab === "ALL" && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FF6B35] rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => { setActiveTab("TOPUP"); setFilterType("ALL"); }}
                  className={`text-xs font-bold pb-2 relative transition ${
                    activeTab === "TOPUP" ? "text-slate-900 font-black" : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <span>Add Money History</span>
                  {activeTab === "TOPUP" && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FF6B35] rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => { setActiveTab("REWARD"); setFilterType("ALL"); }}
                  className={`text-xs font-bold pb-2 relative transition ${
                    activeTab === "REWARD" ? "text-slate-900 font-black" : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <span>Rewards History</span>
                  {activeTab === "REWARD" && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FF6B35] rounded-full" />
                  )}
                </button>
              </div>

              {/* Controls: Filter dropdown + Date picker */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="ALL">All Transactions</option>
                  <option value="CREDIT">Credits Only</option>
                  <option value="DEBIT">Debits Only</option>
                </select>

                <div className="flex items-center gap-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>01 Oct 2026 - 02 Nov 2026</span>
                </div>
              </div>
            </div>

            {/* Table / Records View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Date &amp; Time</th>
                    <th className="py-3 px-4 sm:px-6">Transaction Details</th>
                    <th className="py-3 px-4 text-center">Type</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-right">Balance</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                        No transactions recorded in this period.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((txn) => {
                      const isCredit = txn.type === "CREDIT" || txn.type === "TOPUP";
                      const dateObj = new Date(txn.createdAt);
                      const formattedDate = dateObj.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      });
                      const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit"
                      });

                      return (
                        <tr key={txn.id} className="hover:bg-slate-50/80 transition">
                          {/* Date & Time */}
                          <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{formattedDate}</div>
                            <div className="text-[11px] text-slate-400">{formattedTime}</div>
                          </td>

                          {/* Transaction Details */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  isCredit
                                    ? txn.category === "REWARD"
                                      ? "bg-purple-100 text-purple-600"
                                      : "bg-emerald-100 text-emerald-600"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {txn.category === "REWARD" ? (
                                  <Gift className="w-4 h-4" />
                                ) : isCredit ? (
                                  <PlusCircle className="w-4 h-4" />
                                ) : (
                                  <ArrowDownLeft className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">
                                  {txn.reason || (isCredit ? "Wallet Top-up" : "Service Payment")}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  Ref: {txn.reference}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Type Pill */}
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                isCredit
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                  : "bg-rose-50 text-rose-700 border border-rose-200/60"
                              }`}
                            >
                              {txn.type}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <span
                              className={`font-black ${
                                isCredit ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {isCredit ? "+ " : "- "}₹ {txn.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                          </td>

                          {/* Balance After */}
                          <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-slate-800">
                            ₹ {txn.balanceAfter.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Success</span>
                            </span>
                          </td>

                          {/* Options dots */}
                          <td className="py-4 px-4 text-right whitespace-nowrap text-slate-400 hover:text-slate-600">
                            <button className="p-1 rounded-lg hover:bg-slate-100">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* ADD MONEY ONLINE PAYMENT MODAL                           */}
      {/* ======================================================== */}
      {isAddMoneyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add Money to Wallet</h3>
                  <p className="text-xs text-slate-500">Secure instant top-up via UPI or Card</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddMoneyOpen(false)}
                disabled={topupLoading}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Top-up Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {["500", "1000", "2000", "5000", "10000"].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition ${
                      topupAmount === amt
                        ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    ₹{parseInt(amt).toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Or Enter Custom Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* Status alerts */}
            {topupStatus === "FAILED" && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-rose-700">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage || "Payment processing failed. Please try again."}</span>
              </div>
            )}

            {topupStatus === "SUCCESS" && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Wallet credited successfully!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddMoneyOpen(false)}
                disabled={topupLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInitiateTopup}
                disabled={topupLoading}
                className="flex-1 py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-black hover:bg-[#e05623] shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {topupLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Proceed to Pay</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

