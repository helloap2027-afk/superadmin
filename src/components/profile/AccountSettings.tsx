"use client";

import React, { useState, useEffect } from "react";
import { useAdminProfile } from "@/context/AdminProfileContext";
import {
  User,
  ShieldCheck,
  Sliders,
  Mail,
  Phone,
  Camera,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bell,
  Globe,
  Smartphone
} from "lucide-react";

export function AccountSettings() {
  const { profile, isLoading, updateProfile, changePassword } = useAdminProfile();

  const [activeTab, setActiveTab] = useState<"personal" | "security" | "preferences">("personal");

  // Personal Account Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [personalSuccess, setPersonalSuccess] = useState<string | null>(null);
  const [personalError, setPersonalError] = useState<string | null>(null);

  // Security / Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  // Preferences Form State
  const [language, setLanguage] = useState("English");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [prefsSuccess, setPrefsSuccess] = useState<string | null>(null);
  const [prefsError, setPrefsError] = useState<string | null>(null);

  // Sync state from profile
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setPhoneNumber(profile.phoneNumber || "");
      setAvatarUrl(profile.avatarUrl || "");
      if (profile.preferences) {
        setLanguage(profile.preferences.language || "English");
        setEmailNotifications(profile.preferences.emailNotifications !== false);
        setSmsAlerts(profile.preferences.smsAlerts !== false);
        setTwoFactorAuth(!!profile.preferences.twoFactorAuth);
      }
    }
  }, [profile]);

  // Handle Personal Account Submit
  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalSuccess(null);
    setPersonalError(null);

    if (!fullName.trim()) {
      setPersonalError("Full name is required.");
      return;
    }

    try {
      setIsSavingPersonal(true);
      const res = await updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        avatarUrl: avatarUrl.trim() || null
      });

      if (res.success) {
        setPersonalSuccess("Personal account details updated successfully!");
        setTimeout(() => setPersonalSuccess(null), 5000);
      } else {
        setPersonalError(res.error || "Failed to update personal account details.");
      }
    } catch {
      setPersonalError("An unexpected error occurred while saving account details.");
    } finally {
      setIsSavingPersonal(false);
    }
  };

  // Handle Change Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySuccess(null);
    setSecurityError(null);

    if (!currentPassword) {
      setSecurityError("Please enter your current administrator password.");
      return;
    }

    if (newPassword.length < 8) {
      setSecurityError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError("New password and confirmation password do not match.");
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (res.success) {
        setSecuritySuccess("Administrator password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSecuritySuccess(null), 5000);
      } else {
        setSecurityError(res.error || "Failed to change password.");
      }
    } catch {
      setSecurityError("An unexpected error occurred while updating password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle Preferences Save
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefsSuccess(null);
    setPrefsError(null);

    try {
      setIsSavingPrefs(true);
      const res = await updateProfile({
        preferences: {
          language,
          emailNotifications,
          smsAlerts,
          twoFactorAuth
        }
      });

      if (res.success) {
        setPrefsSuccess("Console preferences saved successfully!");
        setTimeout(() => setPrefsSuccess(null), 5000);
      } else {
        setPrefsError(res.error || "Failed to save preferences.");
      }
    } catch {
      setPrefsError("An unexpected error occurred while saving preferences.");
    } finally {
      setIsSavingPrefs(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium">
          <span>Super Admin Console</span>
          <span>/</span>
          <span className="text-[#0076D7]">Account Settings</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] tracking-tight">
          Super Admin Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Configure personal details, security credentials, and platform console preferences.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto select-none">
        <button
          type="button"
          onClick={() => setActiveTab("personal")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === "personal"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Account</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === "security"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security &amp; Password</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === "preferences"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Console Preferences</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: PERSONAL ACCOUNT
         ========================================================================= */}
      {activeTab === "personal" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-[#0B1220]">Personal Account Profile</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Update your primary display name, contact phone, or profile avatar link.
            </p>
          </div>

          {personalSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{personalSuccess}</div>
            </div>
          )}

          {personalError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{personalError}</div>
            </div>
          )}

          <form onSubmit={handlePersonalSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1220] mb-1.5">
                  Display Name <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Admin User"
                    className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 text-xs sm:text-sm text-[#0B1220] focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/10 transition font-medium"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1220] mb-1.5">
                  Phone Number <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    placeholder="e.g. +91 98480 12345"
                    className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 text-xs sm:text-sm text-[#0B1220] focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/10 transition font-medium"
                  />
                </div>
              </div>

              {/* Avatar URL */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#0B1220] mb-1.5">
                  Avatar Photo URL
                </label>
                <div className="relative">
                  <Camera className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 text-xs sm:text-sm text-[#0B1220] focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/10 transition font-medium"
                  />
                </div>
              </div>

              {/* Email Address (Read-Only) */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1220] mb-1.5 flex items-center justify-between">
                  <span>Registered Email</span>
                  <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="w-3 h-3" /> System Locked
                  </span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={profile?.email || "admin@hello-hi.in"}
                    disabled
                    className="w-full h-11 bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 text-xs sm:text-sm text-slate-500 cursor-not-allowed font-medium select-none"
                  />
                </div>
              </div>

              {/* Administrative Privilege */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1220] mb-1.5 flex items-center justify-between">
                  <span>Administrative Role</span>
                  <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Root Access
                  </span>
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={profile?.role || "SUPER_ADMIN"}
                    disabled
                    className="w-full h-11 bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 text-xs sm:text-sm text-slate-500 cursor-not-allowed font-medium select-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSavingPersonal}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0076D7] to-[#0067CA] hover:from-[#0067CA] hover:to-[#0056B8] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.99] transition disabled:opacity-50"
              >
                {isSavingPersonal ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Personal Details</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SECURITY & CHANGE PASSWORD
         ========================================================================= */}
      {activeTab === "security" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-[#0B1220]">Security &amp; Password Management</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Change your administrator credentials. Choose a strong password of at least 8 characters.
            </p>
          </div>

          {securitySuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{securitySuccess}</div>
            </div>
          )}

          {securityError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{securityError}</div>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-[#0B1220] mb-1.5">
                Current Password <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                  className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-10 text-xs sm:text-sm text-[#0B1220] focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/10 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-[#0B1220] mb-1.5">
                New Password <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-10 text-xs sm:text-sm text-[#0B1220] focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/10 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-[#0B1220] mb-1.5">
                Confirm New Password <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Re-enter new password"
                  className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-10 text-xs sm:text-sm text-[#0B1220] focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/10 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0076D7] to-[#0067CA] hover:from-[#0067CA] hover:to-[#0056B8] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.99] transition disabled:opacity-50"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Change Password</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PREFERENCES
         ========================================================================= */}
      {activeTab === "preferences" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-[#0B1220]">Console Preferences</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Customize language, alert notifications, and security options for your session.
            </p>
          </div>

          {prefsSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{prefsSuccess}</div>
            </div>
          )}

          {prefsError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{prefsError}</div>
            </div>
          )}

          <form onSubmit={handlePreferencesSubmit} className="space-y-6 max-w-xl">
            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-semibold text-[#0B1220] mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0076D7]" />
                <span>Console Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 text-xs sm:text-sm text-[#0B1220] focus:outline-none focus:border-[#0076D7] transition font-medium"
              >
                <option value="English">English (Default)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
              </select>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Notifications &amp; Alerts
              </h4>

              <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-[#0076D7]" />
                  <div>
                    <p className="text-xs font-semibold text-[#0B1220]">Email Notifications</p>
                    <p className="text-[11px] text-[#64748B]">Receive notifications on new merchant KYC submissions</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 accent-[#0076D7] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-[#0076D7]" />
                  <div>
                    <p className="text-xs font-semibold text-[#0B1220]">SMS Priority Alerts</p>
                    <p className="text-[11px] text-[#64748B]">Receive critical SMS alerts for security and threshold breaches</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#0076D7] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#0076D7]" />
                  <div>
                    <p className="text-xs font-semibold text-[#0B1220]">Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] text-[#64748B]">Require OTP authentication on every super admin login</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                  className="w-4 h-4 accent-[#0076D7] cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSavingPrefs}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0076D7] to-[#0067CA] hover:from-[#0067CA] hover:to-[#0056B8] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.99] transition disabled:opacity-50"
              >
                {isSavingPrefs ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Preferences</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
