"use server";
import { NEXT_PUBLIC_BASE_URL } from "@/lib/environtments";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface UserProps {
  full_name: string;
  username: string;
  profile_image: string;
  password: string;
  confirmPassword: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export type TRegister = Omit<
  UserProps,
  "profile_image" | "created_at" | "updated_at"
>;

export async function registerAction(data: TRegister) {
  const email = data.email;
  const password = data.password;
  const username = data.username;
  const full_name = data.full_name;

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, full_name },
      emailRedirectTo: `${NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // return {
  //   message: "Registration success, check email for verifaction code.",
  // };
}

export type TLogin = Omit<
  UserProps,
  | "full_name"
  | "username"
  | "confirmPassword"
  | "profile_image"
  | "created_at"
  | "updated_at"
>;

export async function loginAction(data: TLogin) {
  const email = data.email;
  const password = data.password;

  // if (!email || !password) {
  //   return { error: "Email and passsword are required." };
  // }

  const supabase = await createSupabaseServerClient();

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profileError) {
    return { error: profileError.message };
  }

  if (profile?.role === "admin") {
    redirect("/admin/dashboard");
  }

  redirect("/");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  return { success: true };
}
