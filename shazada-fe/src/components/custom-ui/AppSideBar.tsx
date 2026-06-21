"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronUp,
  LogOut,
  Loader2,
  ShoppingBag,
  Package,
  LucideIcon,
  ChartBarStacked,
  MonitorCog,
  LayoutDashboardIcon,
  ChartBarBig,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { useState } from "react";
import { useStateContext } from "@/hooks/useStateContext";
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

type SingleMenu = MenuItem;

type SidebarMenuType = MenuGroup | SingleMenu;

export default function AppSidebar() {
  const pathname = usePathname();
  const menus: SidebarMenuType[] = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: ShoppingBag,
    },
    {
      title: "Conversations",
      url: `/admin/conversations`,
      icon: ChartBarBig,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: ChartBarStacked,
    },
  ];
  const { dataProfile } = useStateContext();
  const { state } = useSidebar();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [username, setUsername] = useState<string>("");
  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await logoutAction();

      if (res) {
        toast.success("Logout success.");
      }
    } catch (error) {
      toast.success("Logout failed, pls try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="min-h-screen">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <MonitorCog className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">
                    {/* {session?.user?.username} */}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {menus?.map((menu: SidebarMenuType) =>
          "items" in menu ? (
            <SidebarGroup key={menu?.label}>
              <SidebarGroupLabel>{menu?.label}</SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {menu?.items?.map((item: SingleMenu) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <SidebarMenu
              className={`px-4 ${cn(state === "collapsed" && "px-2")}`}
              key={menu.title}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === menu.url}
                  tooltip={menu.title}
                  className="flex items-center justify-center"
                >
                  <Link href={menu.url} className="relative">
                    <div
                      className={`flex items-center w-full gap-2 ${cn(state === "collapsed" ? "ml-0" : "ml-2")}`}
                    >
                      <menu.icon />
                      <span>{menu.title}</span>
                    </div>
                    {pathname === menu.url && state !== "collapsed" && (
                      <div className="rounded-r-sm p-4 bg-foreground/50 absolute -left-5 w-5 h-5"></div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          ),
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8 rounded-lg overflow-hidden">
                    <AvatarFallback className="rounded-lg uppercase">
                      {dataProfile?.username?.slice(0, 2) ?? "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none text-left">
                    <span className="font-medium text-sm">
                      {dataProfile?.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Administrator
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  <LogOut className="size-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <Dialog open={isOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Out</DialogTitle>
          </DialogHeader>
          <DialogDescription>Are you sure want to log out?</DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant={"destructive"}>
              {loading ? <Loader2 className="animate-spin" /> : "Cancel"}
            </Button>
            <Button onClick={() => handleLogout()} variant={"secondary"}>
              {loading ? <Loader2 className="animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
