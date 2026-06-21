import HomeIndex from "@/components/Home";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shazada | Welcome, Selamat Datang",
  description: "Selamat Datang di Shazada",
};
export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email_confirmed_at")
      .eq("id", user.id)
      .single();
    fullName = profile?.email_confirmed_at ?? "";

    console.log(fullName);
  }

  console.log("User customer: ", user);
  return <HomeIndex />;
}
