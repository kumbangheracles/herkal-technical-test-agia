"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppNavbar } from "./AppAdminNav";
import AppSidebar from "./AppSideBar";
import EcommerceBgPattern from "./EcommerceBgPattern";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div
        className="flex h-screen w-full overflow-hidden"
        style={{ background: "var(--background-gradient)" }}
      >
        <AppSidebar />

        <div className="flex relative flex-1 flex-col h-screen w-full min-w-0 overflow-y-auto">
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <EcommerceBgPattern />
          </div>

          <div className="relative z-10 flex flex-col flex-1 w-full min-w-0">
            <div className="sticky top-0 z-50 w-full global-navbar-wrapper">
              <AppNavbar />
            </div>

            <main className="flex-1 p-4 md:p-6 w-full min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
