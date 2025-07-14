"use client"; // Mark this as a client component

import React, { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar"; // Assuming Sidebar is a separate component
import Header from "../header/Header";

const SidebarToggle = ({ children }: { children: React.ReactNode }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full lg:w-10/12 bg-slate-100 text-white p-4 flex items-center justify-between h-14 lg:max-h-20 z-10  rounded-xl lg:left-52">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <div
          className={`flex-1 p-4 ${
            isMobileSidebarOpen ? "blur-sm bg-gray-50 lg:blur-none" : ""
          } lg:ml-56 lg:mr-40`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarToggle;
