export function getPublicEnv() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!mapboxToken) throw new Error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseAnonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return { mapboxToken, supabaseUrl, supabaseAnonKey };
}

export function getServerEnv() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return { serviceRoleKey };
}
