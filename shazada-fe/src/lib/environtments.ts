// AMAN diimpor dari client component ('use client') maupun server.
// Hanya berisi variabel ber-prefix NEXT_PUBLIC_ yang memang boleh
// terekspos ke browser.
//
// Secret/service-role key ada di environtment.server.ts — JANGAN
// pernah import file itu dari sini atau dari komponen client manapun.

export const BASE_API_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const NEXT_PUBLIC_SUPABASE_URL: string =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "";

export const NEXT_PUBLIC_SUPABASE_ANON_KEY: string =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const NEXT_PUBLIC_CALLBACK_URL: string =
  process.env.NEXT_PUBLIC_CALLBACK_URL || "";
