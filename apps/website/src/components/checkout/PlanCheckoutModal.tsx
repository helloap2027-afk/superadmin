"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  HelpCircle,
  Check,
  Sparkles
} from "lucide-react";

interface PlanCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    price: number;
    annual_price?: number;
    currency?: string;
  };
  billingCycle: "MONTHLY" | "YEARLY";
  userRole: "CUSTOMER" | "BUSINESS";
  onPaymentSuccess: (result: any) => void;
}

export function PlanCheckoutModal({
  isOpen,
  onClose,
  plan,
  billingCycle,
  userRole,
  onPaymentSuccess,
}: PlanCheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"WALLET" | "ONLINE">("WALLET");
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletStatus, setWalletStatus] = useState<string>("ACTIVE");
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successResult, setSuccessResult] = useState<any>(null);

  // Compute Authoritative Plan Amount
  const planAmount =
    billingCycle === "YEARLY" && plan.annual_price && plan.annual_price > 0
      ? Number(plan.annual_price)
      : Number(plan.price);

  const isWalletSufficient = walletBalance >= planAmount;
  const balanceDifference = Math.max(0, planAmount - walletBalance);

  // Fetch Live Authoritative Wallet Balance
  useEffect(() => {
    if (!isOpen) return;

    const fetchWallet = async () => {
      try {
        setWalletLoading(true);
        setErrorMessage("");
        setSuccessResult(null);

        const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
        const userStr = typeof window !== "undefined" ? localStorage.getItem("hello_user") : null;
        let uid = "";
        if (userStr) {
          try { uid = JSON.parse(userStr).id || ""; } catch {}
        }

        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        if (uid) headers["x-user-id"] = uid;

        // Route by role
        const endpoint =
          userRole === "BUSINESS"
            ? "http://localhost:4000/api/v1/merchant/wallet"
            : "http://localhost:4000/api/v1/wallet/me/summary";

        const res = await fetch(endpoint, { headers });
        const json = await res.json();
        if (json?.success && json.data) {
          const bal = json.data.wallet?.balance ?? json.data.balance ?? 0;
          setWalletBalance(bal);
          setWalletStatus(json.data.wallet?.status ?? json.data.status ?? "ACTIVE");

          // Auto-select Online Payment if wallet balance is insufficient
          if (bal < planAmount) {
            setSelectedMethod("ONLINE");
          } else {
            setSelectedMethod("WALLET");
          }
        }
      } catch (err) {
        console.error("Failed to fetch wallet for checkout:", err);
      } finally {
        setWalletLoading(false);
      }
    };

    fetchWallet();
  }, [isOpen, planAmount, userRole]);

  if (!isOpen) return null;

  // Process Subscription Purchase
  const handleProceedPayment = async () => {
    try {
      setProcessing(true);
      setErrorMessage("");

      const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
      const userStr = typeof window !== "undefined" ? localStorage.getItem("hello_user") : null;
      let user: any = null;
      if (userStr) {
        try { user = JSON.parse(userStr); } catch {}
      }

      // 1. Double Click / Idempotency Key
      const idempotencyKey = `plan_sub_${plan.id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // 2A. WALLET PAYMENT FLOW
      if (selectedMethod === "WALLET") {
        if (!isWalletSufficient) {
          setErrorMessage("Insufficient wallet balance. Please use online payment or top-up your wallet.");
          setProcessing(false);
          return;
        }

        const res = await fetch("http://localhost:4000/api/v1/plans/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(user?.id ? { "x-user-id": user.id } : {}),
            "x-active-role": userRole,
          },
          body: JSON.stringify({
            planId: plan.id,
            billingInterval: billingCycle,
            userId: user?.id,
            userName: user?.fullName || "Subscriber",
            userEmail: user?.email,
            userPhone: user?.phoneNumber,
            paymentMethod: "WALLET",
            idempotencyKey,
          }),
        });

        const json = await res.json();
        if (json?.success) {
          setSuccessResult(json);
          setTimeout(() => {
            onPaymentSuccess(json);
            onClose();
          }, 1500);
        } else {
          setErrorMessage(json?.message || "Failed to process wallet payment.");
        }
        return;
      }

      // 2B. ONLINE PAYMENT GATEWAY FLOW
      // Create Gateway Order
      const orderRes = await fetch("http://localhost:4000/api/v1/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(user?.id ? { "x-user-id": user.id } : {}),
        },
        body: JSON.stringify({
          amount: planAmount,
          currency: "INR",
          purpose: "PLAN_SUBSCRIPTION",
          userType: userRole === "BUSINESS" ? "MERCHANT" : "CUSTOMER",
          idempotencyKey,
          metadata: {
            planId: plan.id,
            billingInterval: billingCycle,
          },
        }),
      });

      const orderJson = await orderRes.json();
      if (!orderJson?.success) {
        setErrorMessage(orderJson?.message || "Failed to initialize payment gateway order.");
        setProcessing(false);
        return;
      }

      // Simulate Real Gateway Execution via Webhook Sandbox
      const simRes = await fetch("http://localhost:4000/api/v1/payments/sandbox/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderJson.data.orderId,
          outcome: "SUCCESS",
        }),
      });

      const simJson = await simRes.json();
      if (!simJson?.success) {
        setErrorMessage("Payment was declined by payment gateway.");
        setProcessing(false);
        return;
      }

      // Finalize subscription with verified gateway reference
      const subRes = await fetch("http://localhost:4000/api/v1/plans/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(user?.id ? { "x-user-id": user.id } : {}),
          "x-active-role": userRole,
        },
        body: JSON.stringify({
          planId: plan.id,
          billingInterval: billingCycle,
          userId: user?.id,
          userName: user?.fullName || "Subscriber",
          userEmail: user?.email,
          userPhone: user?.phoneNumber,
          paymentMethod: "ONLINE",
          paymentReference: orderJson.data.orderId,
          paymentGateway: "RAZORPAY_SANDBOX",
          idempotencyKey,
        }),
      });

      const subData = await subRes.json();
      if (subData?.success) {
        setSuccessResult(subData);
        setTimeout(() => {
          onPaymentSuccess(subData);
          onClose();
        }, 1500);
      } else {
        setErrorMessage(subData?.message || "Payment verified but subscription activation failed.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Network error while completing transaction.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Choose Payment Method</h3>
              <p className="text-xs text-slate-500">
                Subscribing to <span className="font-bold text-slate-800">{plan.name}</span> ({billingCycle.toLowerCase()})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Plan Summary Order Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Payable</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              ₹ {planAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-[#FF6B35] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              {billingCycle} Billing
            </span>
          </div>
        </div>

        {/* 2 Payment Options: Wallet vs Online */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-black text-slate-800 uppercase tracking-wider">Select Payment Option</div>

          {/* OPTION 1: HELLO-HI WALLET */}
          <div
            onClick={() => setSelectedMethod("WALLET")}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
              selectedMethod === "WALLET"
                ? "border-[#FF6B35] bg-orange-50/40 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedMethod === "WALLET" ? "bg-[#FF6B35] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">HELLO-Hi Wallet</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Instant · Zero Fees
                    </span>
                  </div>
                  
                  {/* Balance Status Line */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-slate-600">
                      Available Balance:{" "}
                      <strong className="text-slate-900">
                        ₹ {walletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </strong>
                    </span>

                    {walletLoading ? (
                      <span className="text-[11px] text-slate-400">Loading...</span>
                    ) : isWalletSufficient ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Sufficient
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Insufficient (Short by ₹{balanceDifference.toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                  selectedMethod === "WALLET" ? "border-[#FF6B35]" : "border-slate-300"
                }`}
              >
                {selectedMethod === "WALLET" && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />}
              </div>
            </div>

            {/* Quick Top-up Prompt if Insufficient */}
            {!isWalletSufficient && !walletLoading && (
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Add funds to activate with your wallet:</span>
                <Link
                  href={userRole === "BUSINESS" ? "/vendor/wallet" : "/account?tab=wallet"}
                  onClick={onClose}
                  className="font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Top-up Wallet</span>
                </Link>
              </div>
            )}
          </div>

          {/* OPTION 2: ONLINE PAYMENT GATEWAY */}
          <div
            onClick={() => setSelectedMethod("ONLINE")}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
              selectedMethod === "ONLINE"
                ? "border-[#FF6B35] bg-orange-50/40 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedMethod === "ONLINE" ? "bg-[#FF6B35] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">Online Payment Gateway</span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      UPI · Cards · NetBanking
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Pay securely using Google Pay, PhonePe, Paytm, Debit/Credit Card or NetBanking.
                  </p>
                </div>
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                  selectedMethod === "ONLINE" ? "border-[#FF6B35]" : "border-slate-300"
                }`}
              >
                {selectedMethod === "ONLINE" && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successResult && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Subscription activated successfully! Redirecting...</span>
          </div>
        )}

        {/* Footer Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleProceedPayment}
            disabled={processing || (selectedMethod === "WALLET" && !isWalletSufficient)}
            className="flex-1 py-3 rounded-xl bg-[#FF6B35] text-white text-xs font-black hover:bg-[#e05623] shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : selectedMethod === "WALLET" && !isWalletSufficient ? (
              <span>Insufficient Wallet Balance</span>
            ) : (
              <>
                <span>Pay ₹{planAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Safe Checkout Guarantee Notice */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit Bank-grade Encryption · Instant Activation</span>
        </div>
      </div>
    </div>
  );
}

