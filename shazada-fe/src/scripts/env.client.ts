import dotenv from "dotenv";

dotenv.config();

export const BASE_API_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const NEXT_AUTH_SECRET: string = process.env.NEXTAUTH_SECRET || "";

export const NEXT_PUBLIC_SUPABASE_URL: string =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "";

export const NEXT_PUBLIC_CALLBACK_URL: string =
  process.env.NEXT_PUBLIC_CALLBACK_URL || "";

export const NEXT_PUBLIC_SUPABASE_ANON_KEY: string =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const SUPABASE_SERVICE_ROLE_KEY: string =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const SMTP_USER: string = process.env.SMTP_USER || "";

export const SMTP_PASS: string = process.env.SMTP_PASS || "";
