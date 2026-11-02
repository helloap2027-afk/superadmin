"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar, AdminNavbar } from "@/components/navigation";
import { CouponsManagementModule } from "@/components/advertisements/CouponsManagementModule";

export default function CouponsPage() {
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
        activeTab="Advertisement Management"
        onSelectTab={(tab) => {
          if (tab === "Dashboard") router.push("/");
          else if (tab === "Notifications") router.push("/notifications");
          else if (tab === "CMS") router.push("/cms/terms-and-conditions");
          else if (tab === "Payments") router.push("/payments");
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

        <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
          <CouponsManagementModule />
        </div>
      </div>
    </div>
  );
}

