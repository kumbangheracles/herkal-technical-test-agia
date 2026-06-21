"use server";

import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/supabase/uploadImage";
import { ProductProps } from "@/types/product.type";
import { revalidatePath } from "next/cache";

export type GetProductsResult = {
  data: ProductProps[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  error?: string;
  sortOrder: "newest" | "oldest";
  categoryId?: string;
};

export async function getProductsAction(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortOrder: "newest" | "oldest" = "newest",
  categoryId?: string,
): Promise<GetProductsResult> {
  const supabase = await createSupabaseServerClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: sortOrder === "oldest" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
      error: error.message,
      sortOrder,
      categoryId,
    };
  }

  return {
    data: data as ProductProps[],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize),
    currentPage: page,
    sortOrder,
    categoryId,
  };
}

export async function createProductAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category_id = formData.get("category_id") as string;
  const image_file = formData.get("image_file") as File | null;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);

  if (!title) {
    return { error: "Title wajib diisi" };
  }

  let image_url: string | null = null;

  if (image_file && image_file.size > 0) {
    if (!ALLOWED_TYPES.includes(image_file.type)) {
      return { error: "File harus berupa gambar (JPG, PNG, WEBP, atau GIF)" };
    }

    if (image_file.size > MAX_FILE_SIZE) {
      return { error: "Ukuran file maksimal 2MB" };
    }

    try {
      image_url = await uploadImage(image_file, "products");
    } catch (err) {
      console.error("Upload error:", err);
      return { error: "Gagal upload icon" };
    }
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      title,
      description: description || null,
      image_url,
      stock,
      price,
      category_id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { message: "Product berhasil dibuat", data: data as ProductProps };
}

export async function updateProductAction(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category_id = formData.get("category_id") as string;
  const image_file = formData.get("image_file") as File | null;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);

  if (!title) {
    return { error: "Title wajib diisi" };
  }

  const supabase = await createSupabaseServerClient();

  const updatePayload: Partial<ProductProps> = {
    title,
    description: description || null,
    category_id,
    price: Number(price),
    stock: Number(stock),
  };

  if (image_file && image_file.size > 0) {
    try {
      updatePayload.image_url = await uploadImage(image_file, "products");
    } catch (err) {
      console.error("upload error:", err);
      return { error: "Gagal upload image baru" };
    }
  }

  const { data, error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { message: "product berhasil diupdate", data: data as ProductProps };
}

export async function deleteProductAction(id: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { message: "product berhasil dihapus" };
}
