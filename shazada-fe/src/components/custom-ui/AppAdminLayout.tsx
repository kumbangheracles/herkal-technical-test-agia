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
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex relative flex-1 flex-col">
          <div className="fixed top-0 right-0 w-full h-full">
            <EcommerceBgPattern />
          </div>
          <AppNavbar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
