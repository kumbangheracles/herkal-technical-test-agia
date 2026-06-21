"use server";

import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/supabase/uploadImage";
import { CategoryProps } from "@/types/category.type";
import { revalidatePath } from "next/cache";

export type GetCategoriesResult = {
  data: CategoryProps[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  error?: string;
  sortOrder: "newest" | "oldest";
};

export async function getCategoriesAction(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortOrder: "newest" | "oldest" = "newest",
): Promise<GetCategoriesResult> {
  const supabase = await createSupabaseServerClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("categories")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: sortOrder === "oldest" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
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
    };
  }

  return {
    data: data as CategoryProps[],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize),
    currentPage: page,
    sortOrder,
  };
}

export async function getCategoryByIdAction(id: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  return { data: data as CategoryProps };
}

export async function createCategoryAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const iconFile = formData.get("icon_file") as File | null;

  if (!title) {
    return { error: "Title wajib diisi" };
  }

  let icon_url: string | null = null;

  if (iconFile && iconFile.size > 0) {
    if (!ALLOWED_TYPES.includes(iconFile.type)) {
      return { error: "File harus berupa gambar (JPG, PNG, WEBP, atau GIF)" };
    }

    if (iconFile.size > MAX_FILE_SIZE) {
      return { error: "Ukuran file maksimal 2MB" };
    }

    try {
      icon_url = await uploadImage(iconFile, "categories");
    } catch (err) {
      console.error("Upload error:", err);
      return { error: "Gagal upload icon" };
    }
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("categories")
    .insert({ title, description: description || null, icon_url })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  return { message: "Kategori berhasil dibuat", data: data as CategoryProps };
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const iconFile = formData.get("icon_file") as File | null;

  if (!title) {
    return { error: "Title wajib diisi" };
  }

  const supabase = await createSupabaseServerClient();

  const updatePayload: Partial<CategoryProps> = {
    title,
    description: description || null,
  };

  if (iconFile && iconFile.size > 0) {
    try {
      updatePayload.icon_url = await uploadImage(iconFile, "categories");
    } catch (err) {
      console.error(" upload error:", err);
      return { error: "Gagal upload icon baru" };
    }
  }

  const { data, error } = await supabase
    .from("categories")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  return { message: "Kategori berhasil diupdate", data: data as CategoryProps };
}

// src/app/actions/categories.ts

export async function deleteCategoryAction(id: string) {
  const supabase = await createSupabaseServerClient();

  const { count, error: checkError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (checkError) {
    return { error: checkError.message };
  }

  if (count && count > 0) {
    return {
      error: `Kategori tidak bisa dihapus karena masih digunakan oleh ${count} produk`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  return { message: "Kategori berhasil dihapus" };
}
