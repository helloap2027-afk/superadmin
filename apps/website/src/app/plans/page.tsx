"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BusinessPlansView } from "@/components/plans/BusinessPlansView";
import { CustomerPlansView } from "@/components/plans/CustomerPlansView";
import { PlanData } from "@/components/plans/PlanCard";
import { FaqItem } from "@/components/plans/PlanFaqAccordion";
import { PlanCheckoutModal } from "@/components/checkout/PlanCheckoutModal";
import { toast } from "@/components/Toast";

const API_BASE = "http://localhost:4000/api/v1";

export default function PlansPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<"CUSTOMER" | "BUSINESS">("CUSTOMER");
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  // Industry-Standard Checkout Modal State
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{
    plan: PlanData;
    cycle: "MONTHLY" | "YEARLY";
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    // Resolve current authenticated session and active role
    let role: "CUSTOMER" | "BUSINESS" = "CUSTOMER";
    let user = null;

    if (typeof window !== "undefined") {
      try {
        const uStr = localStorage.getItem("hello_user");
        if (uStr) user = JSON.parse(uStr);
        const storedRole = localStorage.getItem("hello_active_role");
        const queryRole = new URLSearchParams(window.location.search).get("role");

        if (queryRole?.toLowerCase() === "business" || queryRole?.toLowerCase() === "merchant") {
          role = "BUSINESS";
        } else if (storedRole) {
          if (storedRole.toUpperCase().includes("MERCHANT") || storedRole.toUpperCase().includes("VENDOR") || storedRole.toUpperCase() === "BUSINESS") {
            role = "BUSINESS";
          } else {
            // If the user's account has merchant / vendor roles or owns businesses, default to BUSINESS
            const userRoles = Array.isArray(user?.roles) ? user.roles : (user?.role ? [user.role] : []);
            const isMerchantUser = userRoles.some((r: string) => 
              r?.toUpperCase().includes("MERCHANT") || 
              r?.toUpperCase().includes("VENDOR") || 
              r?.toUpperCase() === "BUSINESS"
            ) || (Array.isArray(user?.businesses) && user.businesses.length > 0);

            if (isMerchantUser) {
              role = "BUSINESS";
            } else {
              role = "CUSTOMER";
            }
          }
        } else if (user?.role || user?.roles || user?.businesses) {
          const userRoles = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : []);
          if (
            userRoles.some((r: string) => r?.toUpperCase().includes("MERCHANT") || r?.toUpperCase().includes("VENDOR") || r?.toUpperCase() === "BUSINESS") ||
            (Array.isArray(user?.businesses) && user.businesses.length > 0)
          ) {
            role = "BUSINESS";
          }
        }
      } catch {}
    }

    setUserSession(user);
    setActiveRole(role);
    loadPlansAndFaqs(role, user);
  }, []);

  const loadPlansAndFaqs = async (role: "CUSTOMER" | "BUSINESS", user: any) => {
    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-user-role": role,
        "x-active-role": role,
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (user?.id) headers["x-user-id"] = user.id;

      // 1. Fetch Available Plans
      const plansRes = await fetch(`${API_BASE}/plans/available?role=${role}`, { headers });
      if (plansRes.ok) {
        const plansJson = await plansRes.json();
        if (plansJson?.success && Array.isArray(plansJson.data)) {
          setPlans(plansJson.data);
        }
      }

      // 2. Fetch FAQs
      const faqsRes = await fetch(`${API_BASE}/plans/faqs?role=${role}`, { headers });
      if (faqsRes.ok) {
        const faqsJson = await faqsRes.json();
        if (faqsJson?.success && Array.isArray(faqsJson.data)) {
          setFaqs(faqsJson.data);
        }
      }

      // 3. Fetch Active Sub
      if (user?.id) {
        const subRes = await fetch(`${API_BASE}/plans/me?userId=${user.id}`, { headers });
        if (subRes.ok) {
          const subJson = await subRes.json();
          if (subJson?.success) {
            setActiveSubscription(subJson.data);
          }
        }
      }
    } catch (e) {
      console.error("Error loading plans data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan: PlanData, cycle: "MONTHLY" | "YEARLY" = "MONTHLY") => {
    // If not logged in, route to login with redirect back
    const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
    if (!token && plan.price > 0) {
      toast.info("Please log in to activate this plan.");
      router.push("/login?redirect=/plans");
      return;
    }

    // For paid plans, open the industry-standard dual checkout modal (Wallet vs Online)
    if (plan.price > 0) {
      setSelectedPlanForCheckout({ plan, cycle });
      return;
    }

    try {
      setSubscribing(true);
      const res = await fetch(`${API_BASE}/plans/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userSession?.id ? { "x-user-id": userSession.id } : {}),
          "x-active-role": activeRole,
        },
        body: JSON.stringify({
          planId: plan.id,
          billingInterval: cycle,
          userId: userSession?.id,
          userName: userSession?.fullName || "Subscriber",
          userEmail: userSession?.email,
          userPhone: userSession?.phoneNumber,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success(`Success! Subscribed to ${plan.name}`);
        setActiveSubscription({
          plan_id: plan.id,
          plan_name: plan.name,
          status: "ACTIVE",
        });
      } else {
        toast.error(data?.message || "Subscription could not be processed.");
      }
    } catch {
      toast.error("Network error while activating plan.");
    } finally {
      setSubscribing(false);
    }
  };

  const handleLogout = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {}
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("hello_access_token");
      localStorage.removeItem("hello_user");
      localStorage.removeItem("hello_active_role");
      window.dispatchEvent(new Event("hello_auth_changed"));
    }
    router.push("/");
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Loading Plans &amp; Benefits...
          </span>
        </div>
      </div>
    );
  }

  // Render role-scoped view strictly (NO customer/partner toggle switch)
  return (
    <>
      {activeRole === "BUSINESS" ? (
        <BusinessPlansView
          plans={plans}
          faqs={faqs}
          activeSubscription={activeSubscription}
          onSelectPlan={handleSelectPlan}
          isLoading={subscribing}
        />
      ) : (
        <CustomerPlansView
          plans={plans}
          faqs={faqs}
          userSession={userSession}
          onSelectPlan={handleSelectPlan}
          isLoading={subscribing}
          onLogout={handleLogout}
        />
      )}

      {/* Dual Option Payment Modal: Wallet vs Online with Balance Validation */}
      {selectedPlanForCheckout && (
        <PlanCheckoutModal
          isOpen={true}
          onClose={() => setSelectedPlanForCheckout(null)}
          plan={selectedPlanForCheckout.plan}
          billingCycle={selectedPlanForCheckout.cycle}
          userRole={activeRole}
          onPaymentSuccess={(result) => {
            toast.success(`Success! Subscribed to ${selectedPlanForCheckout.plan.name}`);
            setActiveSubscription({
              plan_id: selectedPlanForCheckout.plan.id,
              plan_name: selectedPlanForCheckout.plan.name,
              status: "ACTIVE",
            });
            setSelectedPlanForCheckout(null);
          }}
        />
      )}
    </>
  );
}

