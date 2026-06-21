"use client";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SwitchThemeButton from "./SwitchThemeButton";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Copyright,
  Loader2,
  LogOut,
  MessageCircleMore,
  MonitorCog,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useStateContext } from "@/hooks/useStateContext";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { logoutAction } from "@/app/actions/auth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { ChatTooltip } from "./Chat/ChatToolTip";
import ChatIndex from "./Chat/ChatIndex";
import { useCart } from "@/hooks/useCart";
interface PropTypes {
  children: ReactNode;
}

export const LIST_NAVIGATION_ITEM = [
  {
    titleNavigation: "Services",
    list: [
      {
        title: "Service & Maintenance",
        href: "/services/maintenance",
        description: "Servis rutin dan tune up motor",
      },
      {
        title: "Electrical",
        href: "/services/electrical",
        description: "Perbaikan sistem kelistrikan motor",
      },
      {
        title: "Ban & Kaki-Kaki",
        href: "/services/ban-kaki",
        description: "Servis ban dan kaki-kaki motor",
      },
    ],
  },
  {
    titleNavigation: "Products",
    list: [
      {
        title: "Sparepart",
        href: "/products/sparepart",
        description: "Berbagai sparepart motor berkualitas",
      },
      {
        title: "Oli Motor",
        href: "/products/oil",
        description: "Oli motor original dan terpercaya",
      },
    ],
  },
];

const AppGuestLayout = ({ children }: PropTypes) => {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<boolean>(false);
  const { idSection, setIdSection } = useStateContext();
  const { dataProfile } = useStateContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [openChat, setOpenChat] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { cartCount } = useCart();
  useEffect(() => {
    if (!idSection) return;
    setIdSection(idSection);
    const el = document.getElementById(idSection);
    if (!el) return;

    const targetY = el.getBoundingClientRect().top + window.scrollY - 80;
    const duration = 1700;
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number | null = null;

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + diff * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [idSection]);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const res = await logoutAction();

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Logout success.");
      setIsOpen(false);
      router.refresh();
      router.push("/auth/login");
    } catch (error) {
      toast.error("Logout failed, pls try again later.");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };
  // useEffect(() => {
  //   if (idSection !== null) {
  //     setTimeout(() => {
  //       setIdSection(null);
  //     }, 500);
  //   }
  // }, [idSection]);
  return (
    <div className="sm:px-8 px-1">
      <nav className="sticky top-4 z-[50] left-0 w-full bg-card border border-border rounded-4xl">
        <div className="max-w-full mx-auto px-5 flex items-center py-1">
          <div className="flex items-center w-full justify-between">
            <div className="ml-[-10px] sm:hidden block">
              <SwitchThemeButton />
            </div>
            <div
              onClick={() => {
                (setIdSection("home"), router.push("/"));
              }}
              className="logo hidden font-mono bg-foreground hover:bg-foreground/80 transition-colors cursor-pointer rounded-3xl h-8 sm:flex items-center justify-center px-4 text-[12px] font-bold text-background"
            >
              <h4 className="hidden sm:block">SHAZADA</h4>
              <h4 className="sm:hidden block">SZA</h4>
            </div>
            <div
              onClick={() => setActiveNav((prev) => !prev)}
              role="button"
              aria-label={activeNav ? "Close menu" : "Open menu"}
              aria-expanded={activeNav}
              className="sm:hidden flex flex-col justify-center items-center gap-[5px] p-2 rounded-2xl w-9 h-9 hover:bg-muted transition-colors cursor-pointer"
            >
              <span
                className={cn(
                  "h-[2px] w-5 bg-foreground rounded-full transition-all duration-300 origin-center",
                  activeNav && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-[2px] w-5 bg-foreground rounded-full transition-all duration-300",
                  activeNav && "opacity-0 scale-x-0",
                )}
              />
              <span
                className={cn(
                  "h-[2px] w-5 bg-foreground rounded-full transition-all duration-300 origin-center",
                  activeNav && "-translate-y-[7px] -rotate-45",
                )}
              />
            </div>
            <div className="sm:flex hidden items-center gap-2">
              {/* <div
                className="text-[14px] text-muted-foreground cursor-pointer font-semibold rounded-4xl py-2 px-4 hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => {
                  router.push("/shop");
                }}
              >
                Shop
              </div> */}

              <div
                className="text-[14px] relative text-muted-foreground cursor-pointer font-semibold rounded-4xl py-2 px-4 hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => {
                  router.push("/collections");
                }}
              >
                Collection
                {cartCount !== 0 && (
                  <p className="text-[12px] absolute top-0 right-0 text-foreground bg-destructive h-5 w-5 flex items-center justify-center font-bold rounded-full p-1">
                    {cartCount}
                  </p>
                )}
              </div>
              <div
                className="text-[14px] text-muted-foreground cursor-pointer font-semibold rounded-4xl py-2 px-4 hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => {
                  router.push("/");
                }}
              >
                Explore
              </div>
            </div>
            <div className=" sm:flex hidden items-center gap-3">
              <div>
                {dataProfile ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-sm text-background tracking-wide font-mono py-1 px-2 bg-card-foreground rounded-3xl">
                          {dataProfile?.username}
                        </p>
                      </div>
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

                      {dataProfile?.role === "admin" && (
                        <DropdownMenuItem
                          className="text-foreground cursor-pointer"
                          onClick={() => router?.push("/admin/dashboard")}
                        >
                          <MonitorCog className="size-4 mr-2" />
                          Admin Panel
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => router.push("/auth/login")}
                  >
                    <p className="font-semibold text-sm text-background tracking-wide font-mono py-1 px-2 bg-card-foreground rounded-3xl">
                      Login
                    </p>
                  </div>
                )}
              </div>
              <SwitchThemeButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div
        className={`fixed block z-[9999999999999999] sm:hidden border border-border min-h-screen transition-all duration-300 max-w-1/2 w-full bg-card top-18 rounded-2xl right-0 p-4 ${cn(activeNav ? " -translate-x-2.5" : " translate-x-[300px]")}`}
      >
        <div>
          <div
            onClick={() => {
              (router.push("/"), setActiveNav(false), setIdSection("home"));
            }}
            className="logo  font-mono bg-foreground hover:bg-foreground/80 transition-colors cursor-pointer rounded-3xl h-8 flex items-center justify-center px-4 text-[12px] font-semibold text-background"
          >
            <h4>SHAZADA</h4>
          </div>
          <h4
            onClick={() => {
              (router.push("/"), setActiveNav(false));
            }}
            className="text-[10px] mt-3 bg-muted text-center text-muted-foreground font-semibold rounded-4xl py-2 px-4"
          >
            Explore
          </h4>

          <h4
            onClick={() => {
              (router.push("/collections"), setActiveNav(false));
            }}
            className="text-[10px] flex items-center justify-center gap-2 relative mt-3 bg-muted text-center text-muted-foreground font-semibold rounded-4xl py-2 px-4"
          >
            <p>Collection</p>

            {cartCount !== 0 && (
              <p
                className={`text-[8px] top-0 right-0 text-foreground bg-destructive h-5 w-5 flex items-center justify-center font-bold rounded-full p-1`}
              >
                {cartCount}
              </p>
            )}
          </h4>
          {dataProfile?.role === "admin" && (
            <h4
              onClick={() => router.push("/admin/dashboard")}
              className={`text-[10px] flex items-center justify-center gap-2 relative mt-3 bg-muted text-center text-muted-foreground font-semibold rounded-4xl py-2 px-4 `}
            >
              Admin Panel
            </h4>
          )}
          <h4
            onClick={() => {
              dataProfile
                ? (setIsOpen(true), setActiveNav(false))
                : router.push("/auth/login");
            }}
            className={` text-[10px] mt-3 text-center  ${cn(dataProfile ? "text-destructive" : "text-foreground")} bg-background font-semibold rounded-4xl py-2 px-4 `}
          >
            {dataProfile ? "Log Out" : "Log In"}
          </h4>

          {/* <h4
            onClick={() => {
              (router.push("/shop"), setActiveNav(false));
            }}
            className="text-[10px] mt-3 bg-muted text-center text-muted-foreground font-semibold rounded-4xl py-2 px-4"
          >
            Shop
          </h4> */}
        </div>
      </div>
      {/* Children */}

      <div className="mt-6">
        <>{children}</>

        <motion.div
          layout
          initial={false}
          animate={{
            height: openChat ? 500 : 48,
            borderRadius: openChat ? 16 : 9999,
          }}
          transition={{
            duration: 0.35,
            ease: [0.32, 0.72, 0, 1],
          }}
          style={{
            width: openChat ? "min(360px, calc(100vw - 16px))" : 48,
          }}
          className={cn(
            "fixed right-2 bottom-2 sm:right-10 sm:bottom-10",
            "border bg-background/90 backdrop-blur-sm",
            "flex items-center justify-center overflow-hidden",
            "z-[9999]",
            !openChat && "hover:bg-background hover:shadow-lg cursor-pointer",
          )}
        >
          <AnimatePresence mode="wait">
            {openChat ? (
              <motion.div
                key="chat"
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ChatIndex openChat={openChat} setOpenChat={setOpenChat} />
              </motion.div>
            ) : (
              <motion.button
                key="icon"
                type="button"
                onClick={() => setOpenChat(true)}
                className="flex items-center justify-center w-full h-full"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <MessageCircleMore size={22} />

                <ChatTooltip
                  text="Hi! are you looking for some help?"
                  delayMs={0}
                  durationMs={7000}
                  hideAnimationDurationMs={400}
                  intervalMs={7000}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <footer className="py-8 px-6 border bg-card border-border rounded-4xl">
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-0 justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-4 sm:max-w-[240px]">
            <div
              onClick={() => router.push("/")}
              className="font-mono bg-foreground hover:bg-foreground/80 transition-colors cursor-pointer rounded-2xl h-9 w-fit px-5 flex items-center justify-center text-xs font-semibold text-background tracking-widest"
            >
              SHAZADA
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Temukan semua yang kamu butuhkan dalam satu tempat — mudah, cepat,
              dan terpercaya.
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex gap-10 sm:gap-16 flex-wrap">
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold text-foreground tracking-widest uppercase">
                Belanja
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Semua Produk", desc: "Jelajahi koleksi lengkap" },
                  {
                    label: "Penawaran Terbaik",
                    desc: "Diskon & promo hari ini",
                  },
                  { label: "Produk Baru", desc: "Koleksi terbaru kami" },
                ].map(({ label, desc }) => (
                  <div key={label} className="group cursor-pointer">
                    <p className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                      {label}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold text-foreground tracking-widest uppercase">
                Bantuan
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Cara Pemesanan", desc: "Panduan belanja mudah" },
                  { label: "Pengiriman", desc: "Estimasi & tracking" },
                  { label: "Pengembalian", desc: "Kebijakan retur barang" },
                ].map(({ label, desc }) => (
                  <div key={label} className="group cursor-pointer">
                    <p className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                      {label}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold text-foreground tracking-widest uppercase">
                Akun
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Pesanan Saya", desc: "Cek status pesananmu" },
                  { label: "Wishlist", desc: "Produk yang kamu simpan" },
                ].map(({ label, desc }) => (
                  <div key={label} className="group cursor-pointer">
                    <p className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                      {label}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {desc}
                    </p>
                  </div>
                ))}
                <button
                  onClick={() =>
                    dataProfile ? setIsOpen(true) : router.push("/auth/login")
                  }
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors text-left mt-1 cursor-pointer"
                >
                  {dataProfile ? "Logout" : "Masuk / Daftar"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6 w-[95%] mx-auto" />

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <Copyright size={13} />
            <p>2026 SHAZADA. All rights reserved.</p>
          </div>
          <p className="text-[11px] text-muted-foreground hidden sm:block tracking-wide">
            Made with care ✦
          </p>
        </div>
      </footer>
      <Dialog open={isOpen}>
        <DialogContent showCloseButton={false}>
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
    </div>
  );
};
export default AppGuestLayout;
