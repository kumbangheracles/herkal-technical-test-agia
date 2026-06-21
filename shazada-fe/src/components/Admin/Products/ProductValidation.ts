import { z } from "zod";

export const ProductSchema = z.object({
  category_id: z.string().min(1, "Kategori wajib dipilih."),

  title: z
    .string()
    .trim()
    .min(3, "Nama produk minimal 3 karakter.")
    .max(100, "Nama produk maksimal 100 karakter."),

  description: z
    .string()
    .trim()
    .max(1000, "Deskripsi maksimal 1000 karakter.")
    .nullable()
    .optional(),

  image_url: z.string().url("URL gambar tidak valid.").nullable().optional(),

  price: z
    .number({
      error: "Harga harus berupa angka.",
    })
    .positive("Harga harus lebih dari 0."),

  stock: z
    .number({
      error: "Stok harus berupa angka.",
    })
    .int("Stok harus bilangan bulat.")
    .min(0, "Stok tidak boleh negatif."),
});

export type TProduct = z.infer<typeof ProductSchema>;
