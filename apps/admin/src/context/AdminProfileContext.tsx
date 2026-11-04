"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface AdminPreferences {
  language: string;
  emailNotifications: boolean;
  smsAlerts: boolean;
  twoFactorAuth: boolean;
}

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string | null;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: AdminPreferences;
}

interface AdminProfileContextType {
  profile: AdminProfile | null;
  isLoading: boolean;
  error: string | null;
  refetchProfile: () => Promise<void>;
  updateProfile: (data: {
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string | null;
    preferences?: Partial<AdminPreferences>;
  }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const API_BASE = "http://localhost:4000/api/v1";

const AdminProfileContext = createContext<AdminProfileContextType | undefined>(undefined);

export function AdminProfileProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to load session from localStorage
  const getSession = useCallback(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("hello_admin_session");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return null;
      return parsed;
    } catch {
      return null;
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    const session = getSession();
    if (!session) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const email = session.email || "admin@hello-hi.in";
      const res = await fetch(`${API_BASE}/admin/profile?email=${encodeURIComponent(email)}`);
      
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProfile(json.data);
          // Sync localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("hello_admin_session", JSON.stringify({
              ...session,
              name: json.data.fullName,
              email: json.data.email,
              avatarUrl: json.data.avatarUrl,
              role: json.data.role || "SUPER_ADMIN"
            }));
          }
          return;
        } else {
          setError("Failed to retrieve administrator profile from database.");
          setProfile(null);
        }
      } else {
        setError("Failed to communicate with profile service.");
        setProfile(null);
      }
    } catch (err: any) {
      console.warn("Could not reach backend profile API:", err);
      setError("Unable to connect to profile service. Please verify database connection.");
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [getSession]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: {
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string | null;
    preferences?: Partial<AdminPreferences>;
  }) => {
    try {
      const email = profile?.email || "admin@hello-hi.in";
      const res = await fetch(`${API_BASE}/admin/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...data,
          preferences: data.preferences
            ? { ...(profile?.preferences || {}), ...data.preferences }
            : undefined
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update profile.");
      }

      const updated = json.data;
      setProfile(updated);

      // Instantly sync localStorage so all tabs / pages stay aligned
      if (typeof window !== "undefined") {
        const session = getSession() || {};
        localStorage.setItem("hello_admin_session", JSON.stringify({
          ...session,
          name: updated.fullName,
          email: updated.email,
          avatarUrl: updated.avatarUrl
        }));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error updating profile." };
    }
  };

  const changePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const email = profile?.email || "admin@hello-hi.in";
      const res = await fetch(`${API_BASE}/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...data
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to change password.");
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error updating password." };
    }
  };

  const logout = async () => {
    try {
      const session = getSession();
      await fetch(`${API_BASE}/admin/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.email || profile?.email || "admin@hello-hi.in",
          token: session?.token
        })
      }).catch(() => null);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hello_admin_session");
      }
      setProfile(null);
      router.push("/login");
    }
  };

  return (
    <AdminProfileContext.Provider
      value={{
        profile,
        isLoading,
        error,
        refetchProfile: fetchProfile,
        updateProfile,
        changePassword,
        logout
      }}
    >
      {children}
    </AdminProfileContext.Provider>
  );
}

export function useAdminProfile() {
  const context = useContext(AdminProfileContext);
  if (!context) {
    throw new Error("useAdminProfile must be used within an AdminProfileProvider");
  }
  return context;
}
