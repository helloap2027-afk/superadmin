"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar, AdminNavbar } from "@/components/navigation";

interface EmailLayoutShellProps {
  children: React.ReactNode;
  activeSubmenu?: string;
}

export function EmailLayoutShell({ children, activeSubmenu }: EmailLayoutShellProps) {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      <AdminSidebar
        activeTab="EMAIL MANAGEMENT"
        onSelectTab={(tab) => {
          if (tab === "Dashboard") router.push("/");
          else if (tab === "Notifications") router.push("/notifications");
          else if (tab === "CMS") router.push("/cms/terms-and-conditions");
          else if (tab === "Payments") router.push("/payments");
          else if (tab === "Advertisement Management") router.push("/advertisements/campaigns");
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 h-screen max-h-screen flex flex-col min-w-0 overflow-hidden">
        <AdminNavbar
          onToggleSidebar={handleToggleSidebar}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          unreadNotifications={5}
          selectedLocation="Vijayawada"
        />

        <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

