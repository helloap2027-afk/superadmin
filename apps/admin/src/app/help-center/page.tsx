"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCenterAdminModule } from "@/components/cms/HelpCenterAdminModule";
import { AdminSidebar, AdminNavbar } from "@/components/navigation";

export default function HelpCenterAdminPage() {
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
        activeTab="CMS"
        onSelectTab={(tab) => {
          if (tab === "Dashboard") router.push("/");
        }}
        activeCmsSlug="help-center"
        onSelectCmsSlug={(slug) => router.push(`/cms/${slug}`)}
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
          unreadNotifications={12}
          selectedLocation="Hyderabad"
          adminName="Admin User"
          adminRole="Super Admin"
        />

        <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
          <HelpCenterAdminModule />
        </div>
      </div>
    </div>
  );
}

