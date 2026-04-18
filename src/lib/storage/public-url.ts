import { getPublicEnv } from "@/lib/env";

export function getPublicStorageUrl(bucket: string, path: string) {
  const { supabaseUrl } = getPublicEnv();

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
