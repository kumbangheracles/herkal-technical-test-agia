import { createClient } from "@supabase/supabase-js";
import {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../env.client";

const supabaseAdmin = createClient(
  NEXT_PUBLIC_SUPABASE_URL as string,
  SUPABASE_SERVICE_ROLE_KEY as string,
);

const categories = [
  {
    title: "Elektronik",
    description: "Perangkat elektronik dan gadget",
    icon_url: null,
  },
  {
    title: "Pakaian",
    description: "Fashion pria dan wanita",
    icon_url: null,
  },
  {
    title: "Makanan & Minuman",
    description: "Produk konsumsi dan minuman",
    icon_url: null,
  },
  {
    title: "Olahraga",
    description: "Peralatan dan perlengkapan olahraga",
    icon_url: null,
  },
  {
    title: "Buku",
    description: "Buku fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test1",
    description: "test1 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test2",
    description: "test2 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test3",
    description: "test3 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test4",
    description: "test4 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test6",
    description: "test6 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test7",
    description: "test7 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test8",
    description: "test8 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test9",
    description: "test9 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test10",
    description: "test10 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test11",
    description: "test11 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test12",
    description: "test12 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test13",
    description: "test13 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test14",
    description: "test14 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test15",
    description: "test15 fisik dan media cetak",
    icon_url: null,
  },
  {
    title: "test16",
    description: "test16 fisik dan media cetak",
    icon_url: null,
  },
];

export async function seedCategories() {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert(categories)
    .select();

  if (error) {
    console.error("Gagal seed categories:", error.message);
    return;
  }

  console.log(`${data.length} categories berhasil dibuat:`);
  data.forEach((c) => console.log(`- ${c.title} (id: ${c.id})`));
}
