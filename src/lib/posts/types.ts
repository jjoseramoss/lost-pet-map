export type PostType = "lost" | "found" | "shelter";
export type Species = "dog" | "cat" | "other";
export type PostStatus = "active" | "reunited" | "expired";

export type PetPost = {
  id: string;
  post_type: PostType;
  species: Species;
  pet_name: string | null;
  breed: string | null;
  color: string | null;
  description: string | null;
  event_time: string | null;
  lat: number;
  lng: number;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  photo_path: string;
  source: "user" | "scrape";
  source_url: string | null;
  status: PostStatus;
  created_at: string;
};
