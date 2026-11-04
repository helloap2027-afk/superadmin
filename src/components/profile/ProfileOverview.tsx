"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminProfile } from "@/context/AdminProfileContext";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  Loader2,
  Lock,
  RefreshCw,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";

export function ProfileOverview({ onBack }: { onBack?: () => void }) {
  const { profile, isLoading, updateProfile, changePassword, refetchProfile } = useAdminProfile();

  // Horizontal Tab State
  const [activeTab, setActiveTab] = useState<"personal" | "password">("personal");

  // Tab 1: Personal Information State
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Tab 2: Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state from profile
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setAvatarUrl(profile.avatarUrl || "");
    }
  }, [profile]);

  // Compute initials fallback
  const getInitials = (name?: string) => {
    if (!name) return "AU";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // =========================================================================
  // LOGO / AVATAR FILE UPLOAD HANDLER
  // =========================================================================
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("Please select a valid image file (PNG, JPG, SVG, or WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Image file size should be less than 5MB.");
      return;
    }

    setProfileError(null);
    setProfileSuccess(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);

      try {
        setIsUploadingPhoto(true);
        const res = await updateProfile({
          avatarUrl: dataUrl,
          fullName: fullName.trim() || profile?.fullName || "Admin User"
        });

        if (res.success) {
          setProfileSuccess("Logo / Profile photo updated and saved successfully! Top navbar has been synchronized.");
          setTimeout(() => setProfileSuccess(null), 5000);
        } else {
          setProfileError(res.error || "Failed to save profile photo.");
        }
      } catch {
        setProfileError("An unexpected error occurred while uploading profile photo.");
      } finally {
        setIsUploadingPhoto(false);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = async () => {
    setProfileError(null);
    setProfileSuccess(null);
    setAvatarUrl("");

    try {
      setIsSavingProfile(true);
      const res = await updateProfile({
        avatarUrl: null,
        fullName: fullName.trim() || profile?.fullName || "Admin User"
      });

      if (res.success) {
        setProfileSuccess("Logo removed. Default initials avatar is now active.");
        setTimeout(() => setProfileSuccess(null), 5000);
      } else {
        setProfileError(res.error || "Failed to remove photo.");
      }
    } catch {
      setProfileError("An error occurred while removing photo.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // =========================================================================
  // TAB 1: PERSONAL INFORMATION SUBMIT
  // =========================================================================
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!fullName.trim()) {
      setProfileError("Administrator full name cannot be blank.");
      return;
    }

    try {
      setIsSavingProfile(true);
      const res = await updateProfile({
        fullName: fullName.trim(),
        avatarUrl: avatarUrl || null
      });

      if (res.success) {
        setProfileSuccess("Personal information updated successfully! Changes reflected immediately across the console.");
        setTimeout(() => setProfileSuccess(null), 5000);
      } else {
        setProfileError(res.error || "Failed to update administrator profile.");
      }
    } catch {
      setProfileError("An unexpected error occurred while saving profile changes.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // =========================================================================
  // TAB 2: PASSWORD CHANGE SUBMIT
  // =========================================================================
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current administrator password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation password do not match.");
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
        setPasswordSuccess("Administrator password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(null), 5000);
      } else {
        setPasswordError(res.error || "Failed to change password.");
      }
    } catch {
      setPasswordError("An unexpected error occurred while updating password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 animate-pulse" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="h-8 bg-slate-200 rounded w-64 mb-4" />
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-200 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-slate-200 rounded w-48" />
            <div className="h-4 bg-slate-200 rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hidden File Input for Logo/Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload administrator logo or photo"
      />

      {/* Top Header / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium">
            <span>Super Admin Console</span>
            <span>/</span>
            <span className="text-[#0076D7]">Profile Overview</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] tracking-tight">
            Administrator Profile Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage your personal profile identity, logo, and security password credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetchProfile()}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0076D7] bg-blue-50 hover:bg-blue-100 rounded-xl transition border border-blue-200 shrink-0 self-start sm:self-auto cursor-pointer"
          title="Refresh Profile from Database"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Hero Profile Overview Card with Working Upload Logo */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar with gradient ring and camera upload trigger */}
          <div className="flex flex-col items-center gap-2.5 shrink-0">
            <div className="relative group">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#0076D7] to-[#1689ED] p-1 shadow-md flex items-center justify-center cursor-pointer hover:scale-[1.02] transition"
                title="Click to upload new logo / photo"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName || "Administrator"}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarUrl("")}
                    />
                  ) : (
                    <span className="font-bold text-2xl sm:text-3xl text-[#0076D7]">
                      {getInitials(fullName)}
                    </span>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-semibold">Upload</span>
                  </div>
                </div>
              </div>

              {/* Functional Camera Upload Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={isUploadingPhoto}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#0076D7] text-white flex items-center justify-center shadow-md hover:bg-[#0067CA] active:scale-95 transition cursor-pointer"
                title="Upload profile photo or logo"
                aria-label="Upload profile photo or logo"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Direct Upload & Remove Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#0076D7] rounded-lg text-xs font-semibold border border-blue-200 transition cursor-pointer"
              >
                {isUploadingPhoto ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                  </>
                )}
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isSavingProfile || isUploadingPhoto}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Remove current logo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* User Details & Status */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1220]">
                {profile?.fullName || "Admin User"}
              </h2>
              
              <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-[#0076D7] rounded-full text-xs font-semibold">
                {profile?.role || "SUPER_ADMIN"}
              </span>

              <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {profile?.status || "ACTIVE"}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#64748B] flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile?.email || "admin@hello-hi.in"}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Created: <strong className="text-slate-700">{formatDate(profile?.createdAt)}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Last Session: <strong className="text-slate-700">{formatDate(profile?.lastLoginAt)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HORIZONTAL TABS BAR: PERSONAL INFORMATION & PASSWORD CHANGE
         ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 select-none">
        {/* Tab 1: Personal Information */}
        <button
          type="button"
          onClick={() => setActiveTab("personal")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "personal"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-[#64748B] hover:text-[#0B1220] hover:border-slate-300"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Information</span>
        </button>

        {/* Tab 2: Password Change */}
        <button
          type="button"
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "password"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-[#64748B] hover:text-[#0B1220] hover:border-slate-300"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Password Change</span>
        </button>
      </div>

      {/* =========================================================================
          TAB CONTENT 1: PERSONAL INFORMATION
         ========================================================================= */}
      {activeTab === "personal" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B1220] flex items-center gap-2">
                <User className="w-4 h-4 text-[#0076D7]" />
                <span>Personal Information</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Update your administrator display name.
              </p>
            </div>
          </div>

          {profileSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{profileSuccess}</div>
            </div>
          )}

          {profileError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-rose-800 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{profileError}</div>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#0B1220] mb-1.5">
                  Administrator Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Admin User"
                    required
                    className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 text-xs sm:text-sm text-[#0B1220] focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/10 transition font-medium"
                  />
                </div>
              </div>

              {/* Email (Read-Only) */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1220] mb-1.5 flex items-center justify-between">
                  <span>Email Address</span>
                  <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Read-Only
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

              {/* Role (Read-Only) */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1220] mb-1.5 flex items-center justify-between">
                  <span>Assigned Role</span>
                  <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#0076D7]" /> Root Privileges
                  </span>
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={profile?.role || "SUPER_ADMIN"}
                    disabled
                    className="w-full h-11 bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 text-xs sm:text-sm text-slate-500 cursor-not-allowed font-medium select-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSavingProfile || isUploadingPhoto}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0076D7] to-[#0067CA] hover:from-[#0067CA] hover:to-[#0056B8] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <span>Save Profile Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB CONTENT 2: PASSWORD CHANGE
         ========================================================================= */}
      {activeTab === "password" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#0B1220] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#0076D7]" />
              <span>Password Change</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Update your administrator security credentials. Password must be at least 8 characters.
            </p>
          </div>

          {passwordSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{passwordSuccess}</div>
            </div>
          )}

          {passwordError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-rose-800 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{passwordError}</div>
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0076D7] to-[#0067CA] hover:from-[#0067CA] hover:to-[#0056B8] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
