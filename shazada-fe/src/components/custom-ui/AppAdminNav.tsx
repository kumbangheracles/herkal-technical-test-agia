"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import SwitchThemeButton from "./SwitchThemeButton";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/motor": "Motor",
  "/admin/settings": "Settings",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/conversations": "Conversations",
};

export function AppNavbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Admin";

  return (
    <header className="flex sticky z-10 bg-background w-full top-0 h-14 items-center gap-3 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-full" />
      <div className="flex items-center justify-between w-full">
        <h1 className="text-sm font-semibold tracking-wide font-mono">
          {title}
        </h1>

        <SwitchThemeButton />
      </div>
    </header>
  );
}
