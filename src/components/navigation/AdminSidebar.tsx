"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
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

  // Expandable parent states
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isCmsExpanded, setIsCmsExpanded] = useState(true);
  const [isReportsExpanded, setIsReportsExpanded] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  const handleNavClick = (tabName: string, path?: string) => {
    if (onSelectTab) {
      onSelectTab(tabName);
    }
    if (path) {
      router.push(path);
    } else if (tabName === "Dashboard") {
      router.push("/");
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
    `w-full flex items-center ${
      isCollapsed ? "justify-center px-2" : "justify-between px-3"
    } py-2 rounded-[8px] text-[13.5px] font-medium transition-colors select-none ${
      isActive
        ? "bg-[#0076D7] text-white shadow-xs font-semibold"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  const sidebarContent = (
    <div
      className={`h-screen max-h-screen flex flex-col bg-[#0B1220] text-white select-none transition-all duration-300 ${
        isCollapsed ? "w-[76px]" : "w-[270px]"
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

        {/* 2. Listings */}
        <button
          type="button"
          onClick={() => handleNavClick("Listings")}
          className={navItemClass(isCurrentActive("Listings"))}
          title={isCollapsed ? "Listings" : undefined}
        >
          <div className="flex items-center gap-3">
            <Building2 className="w-[19px] h-[19px] shrink-0" />
            {!isCollapsed && <span>Listings</span>}
          </div>
        </button>

        {/* 3. Categories (Expandable) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              setIsCategoriesExpanded(!isCategoriesExpanded);
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
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                  isCategoriesExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {!isCollapsed && isCategoriesExpanded && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-1 py-1 text-[13px]">
              <div
                onClick={() => handleNavClick("Categories")}
                className="py-1.5 px-2 text-white/70 hover:text-white cursor-pointer rounded-md hover:bg-white/5"
              >
                All Categories
              </div>
              <div
                onClick={() => handleNavClick("Categories")}
                className="py-1.5 px-2 text-white/70 hover:text-white cursor-pointer rounded-md hover:bg-white/5"
              >
                Subcategories & Tags
              </div>
            </div>
          )}
        </div>

        {/* 4. Users */}
        <button
          type="button"
          onClick={() => handleNavClick("Users")}
          className={navItemClass(isCurrentActive("Users"))}
          title={isCollapsed ? "Users" : undefined}
        >
          <div className="flex items-center gap-3">
            <Users className="w-[19px] h-[19px] shrink-0" />
            {!isCollapsed && <span>Users</span>}
          </div>
        </button>

        {/* 5. Merchants */}
        <button
          type="button"
          onClick={() => handleNavClick("Merchants")}
          className={navItemClass(isCurrentActive("Merchants"))}
          title={isCollapsed ? "Merchants" : undefined}
        >
          <div className="flex items-center gap-3">
            <Store className="w-[19px] h-[19px] shrink-0" />
            {!isCollapsed && <span>Merchants</span>}
          </div>
        </button>

        {/* 6. Suppliers */}
        <button
          type="button"
          onClick={() => handleNavClick("Suppliers")}
          className={navItemClass(isCurrentActive("Suppliers"))}
          title={isCollapsed ? "Suppliers" : undefined}
        >
          <div className="flex items-center gap-3">
            <Truck className="w-[19px] h-[19px] shrink-0" />
            {!isCollapsed && <span>Suppliers</span>}
          </div>
        </button>

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

        {/* 8. Bookings */}
        <button
          type="button"
          onClick={() => handleNavClick("Bookings")}
          className={navItemClass(isCurrentActive("Bookings"))}
          title={isCollapsed ? "Bookings" : undefined}
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-[19px] h-[19px] shrink-0" />
            {!isCollapsed && <span>Bookings</span>}
          </div>
        </button>

        {/* 9. Payments */}
        <button
          type="button"
          onClick={() => handleNavClick("Payments")}
          className={navItemClass(isCurrentActive("Payments"))}
          title={isCollapsed ? "Payments" : undefined}
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-[19px] h-[19px] shrink-0" />
            {!isCollapsed && <span>Payments</span>}
          </div>
        </button>

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
              setIsCmsExpanded(!isCmsExpanded);
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
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                  isCmsExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {/* CMS Submenus matching reference design */}
          {!isCollapsed && isCmsExpanded && (
            <div className="ml-7 pl-3.5 mt-1 border-l border-white/20 space-y-0.5 py-1 text-[13px]">
              {CMS_SUBMENUS.map((sub) => {
                const isSubActive =
                  (isCurrentActive("CMS") && activeCmsSlug === sub.slug) ||
                  pathname === `/cms/${sub.slug}`;

                return (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => handleCmsSubmenuClick(sub.slug)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-md transition-colors block truncate ${
                      isSubActive
                        ? "text-white font-semibold bg-white/15"
                        : "text-white/75 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {sub.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 12. Notifications */}
        <button
          type="button"
          onClick={() => handleNavClick("Notifications")}
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
              setIsReportsExpanded(!isReportsExpanded);
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
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                  isReportsExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {!isCollapsed && isReportsExpanded && (
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
              setIsSettingsExpanded(!isSettingsExpanded);
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
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                  isSettingsExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {!isCollapsed && isSettingsExpanded && (
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
          className={`w-full flex items-center ${
            isCollapsed ? "justify-center px-2" : "justify-start px-3.5"
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
