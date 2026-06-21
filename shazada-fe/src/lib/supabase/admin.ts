import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY } from "../environtment.server";
import { NEXT_PUBLIC_SUPABASE_URL } from "../environtments";

export function createSupabaseAdminClient() {
  return createClient(
    NEXT_PUBLIC_SUPABASE_URL as string,
    SUPABASE_SERVICE_ROLE_KEY as string,
  );
}
