import { createClient } from "@supabase/supabase-js";
import { seedCategories } from "./seed/seed-categories";
import { rollbackCategories } from "./roolback/rollback-categories";
import {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "./env.client";
import { seedProducts } from "./seed/seed-products";
import { rollbackProducts } from "./roolback/rollback-products";

const supabaseAdmin = createClient(
  NEXT_PUBLIC_SUPABASE_URL as string,
  SUPABASE_SERVICE_ROLE_KEY as string,
);

const testUsers = [
  {
    email: "herkal@admin.com",
    password: "admin123",
    username: "herkaladmin",
    full_name: "Herkal admin test",
    role: "admin" as const,
  },
  {
    email: "customer@test.com",
    password: "password123",
    username: "customer01",
    full_name: "Customer Test",
    role: "customer" as const,
  },
];

async function seed() {
  for (const u of testUsers) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: {
        username: u.username,
        full_name: u.full_name,
      },
    });

    console.log("Role key: ", NEXT_PUBLIC_SUPABASE_URL);
    console.log("Public: ", SUPABASE_SERVICE_ROLE_KEY);

    if (error) {
      console.error(`Gagal bikin ${u.email}:`, error.message);
      continue;
    }

    console.log(`User dibuat: ${u.email} (id: ${data.user.id})`);

    // kalo role-nya admin, update profiles setelah trigger jalan
    if (u.role === "admin") {
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", data.user.id);

      if (updateError) {
        console.error(`Gagal set admin untuk ${u.email}:`, updateError.message);
      } else {
        console.log(`Role admin diset untuk ${u.email}`);
      }
    }
  }
}

// seed();
// seedCategories();
// rollbackCategories();

seedProducts();
// rollbackProducts();
