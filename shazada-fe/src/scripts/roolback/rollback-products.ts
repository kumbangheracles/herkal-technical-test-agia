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
  "Sepatu Lari Pro X",
  "Matras Yoga Premium",
  "Botol Minum Stainless 1L",
  "Kemeja Flanel Pria",
  "Dress Casual Wanita",
  "Jaket Hoodie Unisex",
  "Earphone Bluetooth",
  "Power Bank 10000mAh",
  "Mouse Wireless",
  "Kopi Arabika 250g",
  "Granola Bar Box",
  "Madu Hutan Asli 500ml",
  "Novel Fiksi Best Seller",
  "Buku Pengembangan Diri",
  "Komik Strip Lokal",
];

export async function rollbackProducts() {
  const { error, count } = await supabaseAdmin
    .from("products")
    .delete({ count: "exact" })
    .in("title", seededTitles);

  if (error) {
    console.error("Gagal rollback products:", error.message);
    return;
  }

  console.log(`${count} products berhasil dihapus`);
}

// rollback();
