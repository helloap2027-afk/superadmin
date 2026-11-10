"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Mail,
  Ticket,
  Building2,
  LayoutGrid,
  Users,
  Store,
  Truck,
  Inbox,
  Calendar,
  CreditCard,
  ShieldCheck,
  FileText,
  Bell,
  BarChart2,
  Settings,
  ChevronDown,
  ChevronRight,
  Headphones,
  LogOut,
  X
} from "lucide-react";
import { HelloLogo } from "@/components/brand/HelloLogo";
import { useAdminProfile } from "@/context/AdminProfileContext";
import { CMS_SUBMENUS } from "@/data/cmsData";

export interface AdminSidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  activeCmsSlug?: string;
  onSelectCmsSlug?: (slug: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  activeTab = "Dashboard",
  onSelectTab,
  activeCmsSlug = "terms-and-conditions",
  onSelectCmsSlug,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAdminProfile();

  // Expandable parent states (Single active accordion menu)
  type OpenMenuType = "categories" | "users" | "payments" | "cms" | "ads" | "email" | "support" | "reports" | "settings" | null;

  // Derive initial active menu from current route
  const getInitialOpenMenu = (): OpenMenuType => {
    if (pathname?.startsWith("/support")) return "support";
    if (pathname?.startsWith("/email-management")) return "email";
    if (pathname?.startsWith("/advertisements")) return "ads";
    if (pathname?.startsWith("/cms")) return "cms";
    if (pathname?.startsWith("/payments")) return "payments";
    if (pathname?.startsWith("/users")) return "users";
    if (activeTab === "Support Management") return "support";
    if (activeTab === "Email Management") return "email";
    if (activeTab === "Advertisement Management") return "ads";
    if (activeTab === "CMS") return "cms";
    if (activeTab === "Payments") return "payments";
    if (activeTab === "Users") return "users";
    return null;
  };

  const [openMenu, setOpenMenu] = useState<OpenMenuType>(getInitialOpenMenu());

  // Auto-sync accordion when pathname changes
  useEffect(() => {
    if (pathname?.startsWith("/email-management")) setOpenMenu("email");
    else if (pathname?.startsWith("/advertisements")) setOpenMenu("ads");
    else if (pathname?.startsWith("/cms")) setOpenMenu("cms");
    else if (pathname?.startsWith("/payments")) setOpenMenu("payments");
    else if (pathname?.startsWith("/users")) setOpenMenu("users");
  }, [pathname]);

  const toggleMenu = (menu: OpenMenuType) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleNavClick = (tabName: string, path?: string) => {
    if (onSelectTab) {
      onSelectTab(tabName);
    }
    if (path) {
      router.push(path);
    } else if (tabName === "Dashboard") {
      router.push("/");
    } else if (tabName === "Notifications") {
      router.push("/notifications");
    } else if (tabName === "Payments") {
      router.push("/payments");
    } else if (tabName === "Subscriptions") {
      router.push("/subscriptions");
    }
    onCloseMobile();
  };

  const handleCmsSubmenuClick = (slug: string) => {
    if (onSelectTab) {
      onSelectTab("CMS");
    }
    if (onSelectCmsSlug) {
      onSelectCmsSlug(slug);
    }
    router.push(`/cms/${slug}`);
    onCloseMobile();
  };

  const isCurrentActive = (itemTab: string) => {
    if (activeTab === itemTab) return true;
    if (itemTab === "Dashboard" && pathname === "/") return true;
    if (itemTab === "CMS" && pathname?.startsWith("/cms")) return true;
    return false;
  };

  const navItemClass = (isActive: boolean) =>
    `w-full flex items-center ${isCollapsed ? "justify-center px-2" : "justify-between px-3"
    } py-2 rounded-[8px] text-[13.5px] font-medium transition-colors select-none ${isActive
      ? "bg-[#0076D7] text-white shadow-xs font-semibold"
      : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  const sidebarContent = (
    <div
      className={`h-screen max-h-screen flex flex-col bg-[#0B1220] text-white select-none transition-all duration-300 ${isCollapsed ? "w-[76px]" : "w-[270px]"
        }`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* 1. Sidebar Header with Original Hello Logo */}
      <div className="h-[76px] flex items-center justify-between px-6 border-b border-white/10 shrink-0">
        {!isCollapsed ? (
          <div
            onClick={() => handleNavClick("Dashboard", "/")}
            className="cursor-pointer flex items-center"
            title="Hello Super Admin"
          >
            <HelloLogo variant="dark" size="sm" />
          </div>
        ) : (
          <div
            onClick={() => handleNavClick("Dashboard", "/")}
            className="cursor-pointer mx-auto font-black text-2xl tracking-tight"
            title="Hello Super Admin"
          >
            <span className="text-[#0076D7]">H</span>
            <span className="text-[#FF6B35]">o</span>
          </div>
        )}

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Scrollable Navigation List with visible sleek scrollbar */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto overflow-x-hidden admin-sidebar-scroll">
        {/* 1. Dashboard */}
        <button
          type="button"
          onClick={() => handleNavClick("Dashboard", "/")}
          className={navItemClass(isCurrentActive("Dashboard"))}
          title={isCollapsed ? "Dashboard" : undefined}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </div>
        </button>

        {/* 3. Categories (Expandable) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              toggleMenu("categories");
            }}
            className={navItemClass(isCurrentActive("Categories"))}
            title={isCollapsed ? "Categories" : undefined}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-[19px] h-[19px] shrink-0" />
              {!isCollapsed && <span>Categories</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${openMenu === "categories" ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>
          {!isCollapsed && openMenu === "categories" && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-1 py-1 text-[13px]">
              <div
                onClick={() => handleNavClick("Categories", "/categories")}
                className="py-1.5 px-2 text-white/70 hover:text-white cursor-pointer rounded-md hover:bg-white/5"
              >
                All Categories
              </div>
              <div
                onClick={() => handleNavClick("Categories", "/categories/subcategories")}
                className="py-1.5 px-2 text-white/70 hover:text-white cursor-pointer rounded-md hover:bg-white/5"
              >
                Subcategories & Services
              </div>
            </div>
          )}
        </div>

        {/* 4. Users (Expandable with Customers & Merchants Subtitles) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              toggleMenu("users");
              handleNavClick("Users", "/users/customers");
            }}
            className={navItemClass(isCurrentActive("Users") || pathname?.startsWith("/users"))}
            title={isCollapsed ? "Users" : undefined}
          >
            <div className="flex items-center gap-3">
              <Users className="w-[19px] h-[19px] shrink-0" />
              {!isCollapsed && <span>Users</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${openMenu === "users" ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>
          {!isCollapsed && openMenu === "users" && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-0.5 py-1 text-[13px]">
              <Link
                href="/users/customers"
                prefetch={true}
                onClick={() => {
                  if (onSelectTab) onSelectTab("Users");
                  onCloseMobile();
                }}
                className={`py-1.5 px-2.5 rounded-md transition-colors block cursor-pointer truncate ${pathname === "/users/customers"
                  ? "text-white font-semibold bg-white/15"
                  : "text-white/75 hover:text-white hover:bg-white/5"
                  }`}
              >
                Customers
              </Link>
              <Link
                href="/users/merchants"
                prefetch={true}
                onClick={() => {
                  if (onSelectTab) onSelectTab("Users");
                  onCloseMobile();
                }}
                className={`py-1.5 px-2.5 rounded-md transition-colors block cursor-pointer truncate ${pathname === "/users/merchants"
                  ? "text-white font-semibold bg-white/15"
                  : "text-white/75 hover:text-white hover:bg-white/5"
                  }`}
              >
                Business Partners
              </Link>
            </div>
          )}
        </div>



        {/* 7. Leads & Enquiries */}
        <button
          type="button"
          onClick={() => handleNavClick("Leads & Enquiries")}
          className={navItemClass(isCurrentActive("Leads & Enquiries"))}
          title={isCollapsed ? "Leads & Enquiries" : undefined}
        >
          <div className="flex items-center gap-3">
            <Inbox className="w-[19px] h-[19px] shrink-0" />
            {!isCollapsed && <span>Leads &amp; Enquiries</span>}
          </div>
        </button>



        {/* 9. Payments (Expandable Subtitles) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              toggleMenu("payments");
            }}
            className={navItemClass(isCurrentActive("Payments"))}
            title={isCollapsed ? "Payments" : undefined}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-[19px] h-[19px] shrink-0" />
              {!isCollapsed && <span>Payments</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${openMenu === "payments" ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>
          {!isCollapsed && openMenu === "payments" && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-0.5 py-1 text-[13px]">
              <Link
                href="/payments/wallet-transactions"
                prefetch={true}
                onClick={() => {
                  if (onSelectTab) onSelectTab("Payments");
                  onCloseMobile();
                }}
                className={`py-1.5 px-2.5 rounded-md transition-colors block cursor-pointer truncate ${pathname === "/payments/wallet-transactions" ? "text-white font-semibold bg-white/15" : "text-white/75 hover:text-white hover:bg-white/5"}`}
              >
                Wallet Transactions
              </Link>
              <Link
                href="/payments/withdrawals"
                prefetch={true}
                onClick={() => {
                  if (onSelectTab) onSelectTab("Payments");
                  onCloseMobile();
                }}
                className={`py-1.5 px-2.5 rounded-md transition-colors block cursor-pointer truncate ${pathname === "/payments/withdrawals" ? "text-white font-semibold bg-white/15" : "text-white/75 hover:text-white hover:bg-white/5"}`}
              >
                Withdrawals
              </Link>
              <Link
                href="/payments/plans-purchased"
                prefetch={true}
                onClick={() => {
                  if (onSelectTab) onSelectTab("Payments");
                  onCloseMobile();
                }}
                className={`py-1.5 px-2.5 rounded-md transition-colors block cursor-pointer truncate ${pathname === "/payments/plans-purchased" ? "text-white font-semibold bg-white/15" : "text-white/75 hover:text-white hover:bg-white/5"}`}
              >
                Plans Purchased
              </Link>
            </div>
          )}
        </div>

        {/* 10. Subscriptions */}
        <button
          type="button"
          onClick={() => handleNavClick("Subscriptions")}
          className={navItemClass(isCurrentActive("Subscriptions"))}
          title={isCollapsed ? "Subscriptions" : undefined}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-[19px] h-[19px] shrink-0" />
            {!isCollapsed && <span>Subscriptions</span>}
          </div>
        </button>

        {/* 11. CMS (Expandable Parent with 8 Nested Pages) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              toggleMenu("cms");
            }}
            className={navItemClass(isCurrentActive("CMS"))}
            title={isCollapsed ? "CMS" : undefined}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-[19px] h-[19px] shrink-0" />
              {!isCollapsed && <span>CMS</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${openMenu === "cms" ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>

          {/* CMS Submenus matching reference design */}
          {!isCollapsed && openMenu === "cms" && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-0.5 py-1 text-[13px]">
              {CMS_SUBMENUS.map((sub) => {
                const isSubActive =
                  (isCurrentActive("CMS") && activeCmsSlug === sub.slug) ||
                  pathname === `/cms/${sub.slug}`;

                return (
                  <Link
                    key={sub.slug}
                    href={`/cms/${sub.slug}`}
                    prefetch={true}
                    onClick={() => {
                      if (onSelectTab) onSelectTab("CMS");
                      if (onSelectCmsSlug) onSelectCmsSlug(sub.slug);
                      onCloseMobile();
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-md transition-colors block truncate ${isSubActive
                      ? "text-white font-semibold bg-white/15"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {sub.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 11a. Coupons Direct Navigation */}
        <button
          type="button"
          onClick={() => handleNavClick("Coupons", "/coupons")}
          className={navItemClass(isCurrentActive("Coupons") || pathname === "/coupons" || pathname === "/advertisements/coupons")}
          title={isCollapsed ? "Coupons" : undefined}
        >
          <div className="flex items-center gap-3">
            <Ticket className="w-[19px] h-[19px] shrink-0 text-amber-400" />
            {!isCollapsed && <span>Coupons</span>}
          </div>
        </button>

        {/* 11b. Advertisement Management (Expandable) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              toggleMenu("ads");
            }}
            className={navItemClass(
              activeTab === "Advertisement Management" || pathname?.startsWith("/advertisements")
            )}
            title={isCollapsed ? "Advertisement Management" : undefined}
          >
            <div className="flex items-center gap-3">
              <Megaphone className="w-[19px] h-[19px] shrink-0 text-[#FF6B35]" />
              {!isCollapsed && <span>Advertisement</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${openMenu === "ads" ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>

          {!isCollapsed && openMenu === "ads" && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-0.5 py-1 text-[13px]">
              {[
                { title: "Overview", path: "/advertisements/overview" },
                { title: "Campaign Push", path: "/advertisements/campaigns" },
                { title: "Normal Push", path: "/advertisements/normal-push" },
                { title: "Coupons Management", path: "/advertisements/coupons" },
                { title: "In-App Notifications", path: "/advertisements/in-app" },
                { title: "Campaign Reports", path: "/advertisements/reports" },
              ].map((sub) => {
                const isSubActive = pathname === sub.path;
                return (
                  <Link
                    key={sub.path}
                    href={sub.path}
                    prefetch={true}
                    onClick={() => {
                      if (onSelectTab) onSelectTab("Advertisement Management");
                      onCloseMobile();
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-md transition-colors block truncate ${isSubActive
                      ? "text-white font-semibold bg-white/15"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {sub.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>


        {/* 11c. Email Management (Expandable) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              toggleMenu("email");
            }}
            className={navItemClass(
              activeTab === "Email Management" || pathname?.startsWith("/email-management")
            )}
            title={isCollapsed ? "Email Management" : undefined}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-[19px] h-[19px] shrink-0 text-[#0076D7]" />
              {!isCollapsed && <span>Email Management</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${openMenu === "email" ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {!isCollapsed && openMenu === "email" && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-0.5 py-1 text-[13px]">
              {[
                { title: "Email Overview", path: "/email-management/overview" },
                { title: "Global Email Settings", path: "/email-management/settings" },
                { title: "Email Branding & Layouts", path: "/email-management/branding" },
                { title: "Email Templates", path: "/email-management/templates" },
                { title: "Automated Email Events", path: "/email-management/events" },
                { title: "Email Campaigns", path: "/email-management/campaigns" },
                { title: "Email Logs & Delivery", path: "/email-management/logs" },
                { title: "Email Reports", path: "/email-management/reports" },
              ].map((sub) => {
                const isSubActive = pathname === sub.path;
                return (
                  <Link
                    key={sub.path}
                    href={sub.path}
                    prefetch={true}
                    onClick={() => {
                      if (onSelectTab) onSelectTab("Email Management");
                      onCloseMobile();
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-md transition-colors block truncate ${isSubActive
                      ? "text-white font-semibold bg-white/15"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {sub.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 11d. Support Management (Enterprise Case Desk) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              toggleMenu("support");
            }}
            className={navItemClass(
              activeTab === "Support Management" || pathname?.startsWith("/support")
            )}
            title={isCollapsed ? "Support Management" : undefined}
          >
            <div className="flex items-center gap-3">
              <Headphones className="w-[19px] h-[19px] shrink-0 text-[#0076D7]" />
              {!isCollapsed && <span>Support Desk</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${openMenu === "support" ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {!isCollapsed && openMenu === "support" && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-0.5 py-1 text-[13px]">
              {[
                { title: "Overview & SLA", path: "/support/overview" },
                { title: "All Support Tickets", path: "/support/tickets" },
                { title: "Unassigned Queue", path: "/support/unassigned" },
                { title: "Assigned to Me", path: "/support/assigned" },
                { title: "Escalated Cases", path: "/support/escalations" },
                { title: "Canned Responses", path: "/support/canned-responses" },
                { title: "Support Settings", path: "/support/settings" },
              ].map((sub) => {
                const isSubActive = pathname === sub.path;
                return (
                  <Link
                    key={sub.path}
                    href={sub.path}
                    prefetch={true}
                    onClick={() => {
                      if (onSelectTab) onSelectTab("Support Management");
                      onCloseMobile();
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-md transition-colors block truncate ${isSubActive
                      ? "text-white font-semibold bg-white/15"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {sub.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 12. Notifications */}
        <button
          type="button"
          onClick={() => handleNavClick("Notifications", "/notifications")}
          className={navItemClass(isCurrentActive("Notifications"))}
          title={isCollapsed ? "Notifications" : undefined}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-[19px] h-[19px] shrink-0" />
            {!isCollapsed && <span>Notifications</span>}
          </div>
        </button>

        {/* 13. Reports (Expandable) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              toggleMenu("reports");
            }}
            className={navItemClass(isCurrentActive("Reports"))}
            title={isCollapsed ? "Reports" : undefined}
          >
            <div className="flex items-center gap-3">
              <BarChart2 className="w-[19px] h-[19px] shrink-0" />
              {!isCollapsed && <span>Reports</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${openMenu === "reports" ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>
          {!isCollapsed && openMenu === "reports" && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-1 py-1 text-[13px]">
              <div
                onClick={() => handleNavClick("Reports")}
                className="py-1.5 px-2 text-white/70 hover:text-white cursor-pointer rounded-md hover:bg-white/5"
              >
                Analytics &amp; KPI
              </div>
              <div
                onClick={() => handleNavClick("Reports")}
                className="py-1.5 px-2 text-white/70 hover:text-white cursor-pointer rounded-md hover:bg-white/5"
              >
                Financial Reports
              </div>
            </div>
          )}
        </div>

        {/* 14. Settings (Expandable) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              toggleMenu("settings");
            }}
            className={navItemClass(isCurrentActive("Settings"))}
            title={isCollapsed ? "Settings" : undefined}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-[19px] h-[19px] shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${openMenu === "settings" ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>
          {!isCollapsed && openMenu === "settings" && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-1 py-1 text-[13px]">
              <div
                onClick={() => handleNavClick("Settings")}
                className="py-1.5 px-2 text-white/70 hover:text-white cursor-pointer rounded-md hover:bg-white/5"
              >
                Platform Config
              </div>
              <div
                onClick={() => handleNavClick("Settings")}
                className="py-1.5 px-2 text-white/70 hover:text-white cursor-pointer rounded-md hover:bg-white/5"
              >
                Roles &amp; Permissions
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 3. Bottom Logout Action */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <button
          type="button"
          onClick={async () => {
            await logout();
          }}
          className={`w-full flex items-center ${isCollapsed ? "justify-center px-2" : "justify-start px-3.5"
            } py-2 rounded-lg text-xs text-white/70 hover:text-rose-400 hover:bg-white/5 transition-colors`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Full Height) */}
      <aside className="hidden lg:block h-screen max-h-screen shrink-0 z-40 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative z-50 h-full w-[270px] shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
