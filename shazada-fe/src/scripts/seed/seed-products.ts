import { createClient } from "@supabase/supabase-js";
import {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "../env.client";

const supabaseAdmin = createClient(
  NEXT_PUBLIC_SUPABASE_URL as string,
  SUPABASE_SERVICE_ROLE_KEY as string,
);

const productTemplates = [
  {
    title: "Sepatu Lari Pro X",
    price: 450000,
    stock: 25,
    categoryTitle: "Olahraga",
  },
  {
    title: "Matras Yoga Premium",
    price: 120000,
    stock: 40,
    categoryTitle: "Olahraga",
  },
  {
    title: "Botol Minum Stainless 1L",
    price: 85000,
    stock: 60,
    categoryTitle: "Olahraga",
  },
  {
    title: "Kemeja Flanel Pria",
    price: 175000,
    stock: 30,
    categoryTitle: "Pakaian",
  },
  {
    title: "Dress Casual Wanita",
    price: 220000,
    stock: 18,
    categoryTitle: "Pakaian",
  },
  {
    title: "Jaket Hoodie Unisex",
    price: 195000,
    stock: 22,
    categoryTitle: "Pakaian",
  },
  {
    title: "Earphone Bluetooth",
    price: 350000,
    stock: 15,
    categoryTitle: "Elektronik",
  },
  {
    title: "Power Bank 10000mAh",
    price: 165000,
    stock: 35,
    categoryTitle: "Elektronik",
  },
  {
    title: "Mouse Wireless",
    price: 95000,
    stock: 50,
    categoryTitle: "Elektronik",
  },
  {
    title: "Kopi Arabika 250g",
    price: 65000,
    stock: 45,
    categoryTitle: "Makanan & Minuman",
  },
  {
    title: "Granola Bar Box",
    price: 38000,
    stock: 70,
    categoryTitle: "Makanan & Minuman",
  },
  {
    title: "Madu Hutan Asli 500ml",
    price: 110000,
    stock: 28,
    categoryTitle: "Makanan & Minuman",
  },
  {
    title: "Novel Fiksi Best Seller",
    price: 89000,
    stock: 33,
    categoryTitle: "Buku",
  },
  {
    title: "Buku Pengembangan Diri",
    price: 75000,
    stock: 27,
    categoryTitle: "Buku",
  },
  {
    title: "Komik Strip Lokal",
    price: 45000,
    stock: 55,
    categoryTitle: "Buku",
  },
];

export async function seedProducts() {
  const { data: categories, error: catError } = await supabaseAdmin
    .from("categories")
    .select("id, title");

  if (catError || !categories) {
    console.error("Gagal ambil categories:", catError?.message);
    return;
  }

  const categoryMap = new Map(categories.map((c) => [c.title, c.id]));

  const products = productTemplates
    .map((p) => {
      const category_id = categoryMap.get(p.categoryTitle);

      if (!category_id) {
        console.warn(
          `Kategori "${p.categoryTitle}" tidak ditemukan, skip produk "${p.title}"`,
        );
        return null;
      }

      return {
        title: p.title,
        description: `${p.title} - produk berkualitas dengan harga terbaik`,
        price: p.price,
        stock: p.stock,
        category_id,
        image_url: null,
      };
    })
    .filter((p) => p !== null);

  if (products.length === 0) {
    console.error(
      "Tidak ada produk valid untuk di-seed. Pastikan categories sudah di-seed duluan.",
    );
    return;
  }

  // 3. Insert semua sekaligus
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(products)
    .select();

  if (error) {
    console.error("Gagal seed products:", error.message);
    return;
  }

  console.log(`${data.length} products berhasil dibuat:`);
  data.forEach((p) =>
    console.log(`- ${p.title} (Rp${p.price.toLocaleString("id-ID")})`),
  );
}

// seed();
