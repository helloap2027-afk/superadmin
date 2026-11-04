"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CMSModule } from "@/components/cms/CMSModule";
import { AdminSidebar, AdminNavbar } from "@/components/navigation";

export default function CMSDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const slugParam = (params?.slug as string) || "terms-and-conditions";
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
      {/* 1. Shared Left Sidebar (Matching Reference Design) */}
      <AdminSidebar
        activeTab="CMS"
        onSelectTab={(tab) => {
          if (tab === "Dashboard") router.push("/");
        }}
        activeCmsSlug={slugParam}
        onSelectCmsSlug={(slug) => router.push(`/cms/${slug}`)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 h-screen max-h-screen flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar matching reference design */}
        <AdminNavbar
          onToggleSidebar={handleToggleSidebar}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          unreadNotifications={12}
          selectedLocation="Hyderabad"
          adminName="Admin User"
          adminRole="Super Admin"
        />

        {/* CMS Isolated Workspace */}
        <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
          <CMSModule
            currentSlug={slugParam}
            onNavigateSlug={(s) => router.push(`/cms/${s}`)}
          />
        </div>
      </div>
    </div>
  );
}
