import { createClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env";

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicEnv();

  return createClient(supabaseUrl, supabaseAnonKey);
}
