import { createClient } from "@supabase/supabase-js";
import {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../env.client";

const supabaseAdmin = createClient(
  NEXT_PUBLIC_SUPABASE_URL as string,
  SUPABASE_SERVICE_ROLE_KEY as string,
);

const seededTitles = [
  "Elektronik",
  "Pakaian",
  "Makanan & Minuman",
  "Olahraga",
  "Buku",
];

export async function rollbackCategories() {
  const { error, count } = await supabaseAdmin
    .from("categories")
    .delete({ count: "exact" })
    .in("title", seededTitles);

  if (error) {
    console.error("Gagal rollback categories:", error.message);
    return;
  }

  console.log(`${count} categories berhasil dihapus`);
}
