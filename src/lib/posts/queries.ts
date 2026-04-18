import type { RealtimeChannel } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { PetPost, PostStatus, PostType, Species } from "@/lib/posts/types";

export type ListPostsFilters = {
  postType?: PostType;
  species?: Species;
  status?: PostStatus;
  limit?: number;
};

export async function listPosts(filters: ListPostsFilters = {}) {
  const supabase = createSupabaseBrowserClient();

  let query = supabase
    .from("pet_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.postType) query = query.eq("post_type", filters.postType);
  if (filters.species) query = query.eq("species", filters.species);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;

  if (error) throw error;
  return data as PetPost[];
}

export type RealtimeHandlers = {
  onInsert?: (post: PetPost) => void;
  onUpdate?: (post: PetPost) => void;
  onDelete?: (post: Pick<PetPost, "id">) => void;
};

export function subscribeToPostChanges(handlers: RealtimeHandlers) {
  const supabase = createSupabaseBrowserClient();

  const channel: RealtimeChannel = supabase
    .channel("pet-posts")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "pet_posts" },
      (payload) => {
        handlers.onInsert?.(payload.new as PetPost);
      },
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "pet_posts" },
      (payload) => {
        handlers.onUpdate?.(payload.new as PetPost);
      },
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "pet_posts" },
      (payload) => {
        handlers.onDelete?.(payload.old as Pick<PetPost, "id">);
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
