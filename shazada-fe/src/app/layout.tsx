import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { StateProvider } from "@/context/StateProvider";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import QueryProvider from "@/context/QueryProvider";
// import { Providers } from "@/components/custom-ui/SessionProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const poppinsSans = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: "400",
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Selamat Datang di Shazada | Welcome",
  description: "Selamat Datang di Shazada",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppinsSans.variable} antialiased`}
      >
        <QueryProvider>
          <StateProvider currentDataProfile={profile}>
            {/* <Providers> */}
            <Toaster position="top-right" closeButton />
            <TooltipProvider>{children}</TooltipProvider>
            {/* </Providers> */}
          </StateProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
