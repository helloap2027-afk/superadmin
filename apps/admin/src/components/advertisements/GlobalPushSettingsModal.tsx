"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Smartphone,
  Sliders,
  Volume2,
  Clock,
  ShieldAlert,
  Send,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Palette,
  Image as ImageIcon,
  Zap,
  Power,
  Upload,
  Trash2,
  Camera
} from "lucide-react";

interface PushSettingsData {
  id: string;
  app_name: string;
  app_logo_url: string;
  small_icon_name: string;
  accent_color: string;
  default_banner_url: string | null;
  sound_mode: string;
  vibration_enabled: number;
  quiet_hours_enabled: number;
  quiet_hours_start: string;
  quiet_hours_end: string;
  promotional_frequency_cap: number;
  campaign_ttl_hours: number;
  normal_push_ttl_hours: number;
  default_deep_link: string;
  kill_switch_promotional: number;
  provider_mode: string;
  updated_at: string;
}

interface GlobalPushSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalPushSettingsModal({ isOpen, onClose }: GlobalPushSettingsModalProps) {
  const [settings, setSettings] = useState<PushSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"BRANDING" | "CHANNELS" | "TIMING" | "EMERGENCY">("BRANDING");

  // Form states
  const [appName, setAppName] = useState("HELLO — Hyperlocal Discovery");
  const [appLogoUrl, setAppLogoUrl] = useState("https://hello-hi.in/logo.png");
  const [smallIconName, setSmallIconName] = useState("ic_stat_hello");
  const [accentColor, setAccentColor] = useState("#0076D7");
  const [defaultBannerUrl, setDefaultBannerUrl] = useState("");
  const [soundMode, setSoundMode] = useState("DEFAULT");
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("07:00");
  const [frequencyCap, setFrequencyCap] = useState(2);
  const [campaignTtl, setCampaignTtl] = useState(24);
  const [normalTtl, setNormalTtl] = useState(4);
  const [defaultDeepLink, setDefaultDeepLink] = useState("hello://home");
  const [killSwitch, setKillSwitch] = useState(false);
  const [providerMode, setProviderMode] = useState("SIMULATION");

  // Hidden File input refs for image upload
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Test push dispatch state
  const [testPhone, setTestPhone] = useState("+91 98480 22338");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/push-settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setSettings(d);
        setAppName(d.app_name || "HELLO — Hyperlocal Discovery");
        setAppLogoUrl(d.app_logo_url || "https://hello-hi.in/logo.png");
        setSmallIconName(d.small_icon_name || "ic_stat_hello");
        setAccentColor(d.accent_color || "#0076D7");
        setDefaultBannerUrl(d.default_banner_url || "");
        setSoundMode(d.sound_mode || "DEFAULT");
        setVibrationEnabled(Boolean(d.vibration_enabled));
        setQuietHoursEnabled(Boolean(d.quiet_hours_enabled));
        setQuietHoursStart(d.quiet_hours_start || "22:00");
        setQuietHoursEnd(d.quiet_hours_end || "07:00");
        setFrequencyCap(d.promotional_frequency_cap || 2);
        setCampaignTtl(d.campaign_ttl_hours || 24);
        setNormalTtl(d.normal_push_ttl_hours || 4);
        setDefaultDeepLink(d.default_deep_link || "hello://home");
        setKillSwitch(Boolean(d.kill_switch_promotional));
        setProviderMode(d.provider_mode || "SIMULATION");
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
      setFeedback(null);
      setTestResult(null);
    }
  }, [isOpen]);

  // Image Upload Handlers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("Image size should be below 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setAppLogoUrl(base64);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Banner image size should be below 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setDefaultBannerUrl(base64);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);
      const res = await fetch("http://localhost:4000/api/v1/admin/push-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          appLogoUrl,
          smallIconName,
          accentColor,
          defaultBannerUrl: defaultBannerUrl.trim() || null,
          soundMode,
          vibrationEnabled,
          quietHoursEnabled,
          quietHoursStart,
          quietHoursEnd,
          promotionalFrequencyCap: frequencyCap,
          campaignTtlHours: campaignTtl,
          normalPushTtlHours: normalTtl,
          defaultDeepLink,
          killSwitchPromotional: killSwitch,
          providerMode,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback("Global push settings & images saved successfully! Applied across all push broadcasts.");
        await fetchSettings();
      } else {
        alert(json.message || "Failed to update settings");
      }
    } catch (err: any) {
      alert(err.message || "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestPush = async () => {
    try {
      setIsSendingTest(true);
      setTestResult(null);
      const res = await fetch("http://localhost:4000/api/v1/admin/push-settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: testPhone,
          title: `[TEST] ${appName}`,
          message: "Industry-standard push notification delivered with global accent color & logo.",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTestResult(`Test notification sent successfully to ${testPhone} (Ref: ${json.data.reference})`);
      } else {
        setTestResult(`Failed: ${json.message}`);
      }
    } catch (err: any) {
      setTestResult(`Network error: ${err.message}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={logoInputRef}
          onChange={handleLogoUpload}
          accept="image/*"
          className="hidden"
          aria-label="Upload App Brand Logo"
        />
        <input
          type="file"
          ref={bannerInputRef}
          onChange={handleBannerUpload}
          accept="image/*"
          className="hidden"
          aria-label="Upload Default Fallback Banner"
        />

        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0076D7]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">Global Push Notification Settings</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#0076D7]">
                  Campaign & Normal Push
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized branding, direct image upload, quiet hours, sound channels, and emergency switches.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold p-1.5 rounded-lg cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-5 gap-2 pt-2">
          {[
            { id: "BRANDING", label: "Branding & Visuals", icon: Palette },
            { id: "CHANNELS", label: "Sound & Channels", icon: Volume2 },
            { id: "TIMING", label: "Quiet Hours & Caps", icon: Clock },
            { id: "EMERGENCY", label: "Kill Switch & Testing", icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                  isActive
                    ? "border-[#0076D7] text-[#0076D7]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {feedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#0076D7]" />
              <span>Loading global push settings...</span>
            </div>
          ) : (
            <form id="global-push-form" onSubmit={handleSave} className="space-y-6">
              {/* TAB 1: BRANDING & VISUALS */}
              {activeTab === "BRANDING" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    {/* App Brand Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Application Brand Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0076D7]"
                        placeholder="HELLO — Hyperlocal Discovery"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Displayed as notification header on Android & iOS device lockscreens.
                      </span>
                    </div>

                    {/* App Logo Image Upload */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800">
                          App Brand Logo / Avatar
                        </label>
                        <span className="text-[10px] text-slate-400">PNG, JPG, SVG up to 3MB</span>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Logo Thumbnail */}
                        <div className="relative group shrink-0">
                          <img
                            src={appLogoUrl || "https://hello-hi.in/logo.png"}
                            alt="Brand Logo"
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs bg-white"
                            onError={(e) => {
                              (e.target as any).src = "https://placehold.co/64x64/0076D7/ffffff?text=LOGO";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition cursor-pointer"
                            title="Change Logo"
                          >
                            <Camera className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Upload Controls */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => logoInputRef.current?.click()}
                              className="px-3.5 py-1.5 bg-[#0076D7] hover:bg-[#0062b3] text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload New Logo</span>
                            </button>

                            {appLogoUrl && appLogoUrl !== "https://hello-hi.in/logo.png" && (
                              <button
                                type="button"
                                onClick={() => setAppLogoUrl("https://hello-hi.in/logo.png")}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                                title="Reset to Default Logo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Square 1:1 image displayed next to all push notification titles on user devices.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Accent Color & Status Icon */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Accent Color</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-2 py-1.5 rounded-xl">
                          <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-6 h-6 border-0 rounded cursor-pointer p-0 bg-transparent"
                          />
                          <span className="text-xs font-mono font-bold text-slate-800 uppercase">{accentColor}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Status Bar Icon Name</label>
                        <input
                          type="text"
                          value={smallIconName}
                          onChange={(e) => setSmallIconName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0076D7]"
                          placeholder="ic_stat_hello"
                        />
                      </div>
                    </div>

                    {/* Default Fallback Banner Upload */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800">
                          Default Fallback Banner (Optional)
                        </label>
                        <span className="text-[10px] text-slate-400">16:9 banner up to 5MB</span>
                      </div>

                      {defaultBannerUrl ? (
                        <div className="space-y-2">
                          <div className="relative rounded-xl overflow-hidden max-h-32 border border-slate-300 bg-white">
                            <img
                              src={defaultBannerUrl}
                              alt="Default Banner"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).style.display = "none";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setDefaultBannerUrl("")}
                              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg transition cursor-pointer"
                              title="Remove Default Banner"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => bannerInputRef.current?.click()}
                            className="text-xs text-[#0076D7] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Replace Banner Image</span>
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => bannerInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 hover:border-[#0076D7] rounded-xl p-4 text-center cursor-pointer bg-white transition space-y-1.5"
                        >
                          <ImageIcon className="w-6 h-6 text-slate-400 mx-auto" />
                          <div className="text-xs font-bold text-slate-700">Click to upload fallback banner</div>
                          <div className="text-[10px] text-slate-400">
                            Auto-applied to campaigns when no custom creative is uploaded.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live Mobile Realistic Notification Preview */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                        <span className="flex items-center gap-1 font-semibold">
                          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                          <span>Live Lockscreen Preview</span>
                        </span>
                        <span className="text-[10px]">Just now</span>
                      </div>

                      {/* Mock Phone Notification Banner */}
                      <div className="mt-4 bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow-md backdrop-blur-sm space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={appLogoUrl || "https://hello-hi.in/logo.png"}
                            alt="Uploaded Logo"
                            className="w-7 h-7 rounded-full object-cover border border-slate-600 bg-white"
                            onError={(e) => {
                              (e.target as any).src = "https://placehold.co/40x40/0076D7/ffffff?text=H";
                            }}
                          />
                          <span className="text-xs font-bold text-slate-200 tracking-tight">{appName}</span>
                          <span
                            className="w-2.5 h-2.5 rounded-full ml-auto shadow-xs"
                            style={{ backgroundColor: accentColor }}
                          />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-white">Flat 30% Off on Home Services</div>
                          <div className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                            Verified plumbers and electricians ready in Vijayawada & Guntur. Tap to book instantly!
                          </div>
                        </div>

                        {defaultBannerUrl && (
                          <div className="mt-2 rounded-xl overflow-hidden max-h-32 border border-slate-700">
                            <img
                              src={defaultBannerUrl}
                              alt="Uploaded Banner"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                      ⚡ Any uploaded brand logo or fallback banner automatically persists to the database and applies across all Campaign and Normal Push dispatches.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SOUND & CHANNELS */}
              {activeTab === "CHANNELS" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Default Notification Sound
                      </label>
                      <select
                        value={soundMode}
                        onChange={(e) => setSoundMode(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      >
                        <option value="DEFAULT">Default OS Notification Chime</option>
                        <option value="SOFT_BELL">Soft Ding / Bell (Gentle)</option>
                        <option value="URGENT_CHIME">Urgent Multi-tone Alert (Leads & Enquiries)</option>
                        <option value="SILENT">Mute / Silent Push</option>
                      </select>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Determines the audio tone played on customer lockscreens.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Default Deep-Link Fallback
                      </label>
                      <input
                        type="text"
                        value={defaultDeepLink}
                        onChange={(e) => setDefaultDeepLink(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0076D7]"
                        placeholder="hello://home"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Deep-link screen opened if no specific destination is defined.
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Haptic Vibration on Delivery</div>
                        <div className="text-[11px] text-slate-500">
                          Enable short vibration pattern when notifications arrive on physical devices.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={vibrationEnabled}
                        onChange={(e) => setVibrationEnabled(e.target.checked)}
                        className="w-5 h-5 rounded text-[#0076D7] border-slate-300 focus:ring-[#0076D7] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
                    <div className="text-xs font-bold text-slate-800">Android 8.0+ Notification Channels</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <div className="font-bold text-[#0076D7]">Channel: promotional_channel</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Assigned to: Campaign Push Notifications (Importance: Default, no heads-up intrusion).
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <div className="font-bold text-emerald-700">Channel: transactional_channel</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Assigned to: Normal Push (Enquiries, OTP, Security). Importance: High / Heads-up banner.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: QUIET HOURS & FREQUENCY CAPPING */}
              {activeTab === "TIMING" && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Enable Quiet Hours / Do Not Disturb (DND)</div>
                        <div className="text-[11px] text-slate-500">
                          Automatically suppress or queue promotional pushes during night hours.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={quietHoursEnabled}
                        onChange={(e) => setQuietHoursEnabled(e.target.checked)}
                        className="w-5 h-5 rounded text-[#0076D7] border-slate-300 focus:ring-[#0076D7] cursor-pointer"
                      />
                    </div>

                    {quietHoursEnabled && (
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Quiet Hours Start Time (Night)
                          </label>
                          <input
                            type="time"
                            value={quietHoursStart}
                            onChange={(e) => setQuietHoursStart(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Quiet Hours End Time (Morning)
                          </label>
                          <input
                            type="time"
                            value={quietHoursEnd}
                            onChange={(e) => setQuietHoursEnd(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                      <label className="block text-xs font-bold text-slate-800">
                        Promotional Frequency Cap
                      </label>
                      <div className="text-[11px] text-slate-400 mb-2">Max broadcasts per user per day</div>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={frequencyCap}
                        onChange={(e) => setFrequencyCap(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-400">Protects users from marketing spam.</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                      <label className="block text-xs font-bold text-slate-800">
                        Campaign TTL (Hours)
                      </label>
                      <div className="text-[11px] text-slate-400 mb-2">Promotional time-to-live</div>
                      <input
                        type="number"
                        min="1"
                        max="72"
                        value={campaignTtl}
                        onChange={(e) => setCampaignTtl(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-400">Discard if device offline after TTL.</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                      <label className="block text-xs font-bold text-slate-800">
                        Normal Push TTL (Hours)
                      </label>
                      <div className="text-[11px] text-slate-400 mb-2">Transactional time-to-live</div>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={normalTtl}
                        onChange={(e) => setNormalTtl(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-400">Lead inquiries & account updates.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EMERGENCY KILL SWITCH & TESTING */}
              {activeTab === "EMERGENCY" && (
                <div className="space-y-6">
                  {/* Emergency Kill Switch */}
                  <div
                    className={`p-4 rounded-2xl border transition ${
                      killSwitch
                        ? "bg-rose-50 border-rose-200 text-rose-900"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            killSwitch ? "bg-rose-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          <Power className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">
                            Global Promotional Push Kill Switch {killSwitch && "(ACTIVE - PAUSED)"}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Instantly pause all scheduled & automated promotional marketing broadcasts. Transactional alerts remain active.
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={killSwitch}
                        onChange={(e) => setKillSwitch(e.target.checked)}
                        className="w-5 h-5 rounded text-rose-600 border-slate-300 focus:ring-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Provider Mode Selection */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Gateway Provider Engine
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs ${
                          providerMode === "SIMULATION"
                            ? "bg-blue-50 border-[#0076D7] text-[#0076D7] font-bold"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="providerMode"
                          value="SIMULATION"
                          checked={providerMode === "SIMULATION"}
                          onChange={() => setProviderMode("SIMULATION")}
                        />
                        <span>Simulation & Local Test Engine</span>
                      </label>

                      <label
                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs ${
                          providerMode === "FIREBASE_FCM"
                            ? "bg-blue-50 border-[#0076D7] text-[#0076D7] font-bold"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="providerMode"
                          value="FIREBASE_FCM"
                          checked={providerMode === "FIREBASE_FCM"}
                          onChange={() => setProviderMode("FIREBASE_FCM")}
                        />
                        <span>Production Firebase Cloud Messaging (FCM)</span>
                      </label>
                    </div>
                  </div>

                  {/* Test Push Dispatcher Box */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Send className="w-4 h-4 text-[#0076D7]" />
                      <span>Send Admin Test Push Notification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                        placeholder="+91 98480 22338"
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                      <button
                        type="button"
                        onClick={handleSendTestPush}
                        disabled={isSendingTest}
                        className="px-4 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {isSendingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                        <span>Dispatch Test</span>
                      </button>
                    </div>

                    {testResult && (
                      <div className="text-[11px] p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700">
                        {testResult}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/75">
          <div className="text-[11px] text-slate-400">
            Last saved: {settings?.updated_at ? new Date(settings.updated_at).toLocaleString() : "Never"}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="global-push-form"
              disabled={saving}
              className="px-5 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
