"use client";

import Image from "next/image";
import type { PetPost } from "@/lib/posts/types";
import { getPublicStorageUrl } from "@/lib/storage/public-url";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 py-3">
      <div className="text-sm font-medium text-black">{label}</div>
      <div className="text-sm text-black/80">{value}</div>
    </div>
  );
}

export default function PetProfilePanel({
  post,
  onClose,
}: {
  post: PetPost;
  onClose: () => void;
}) {
  const photoUrl = getPublicStorageUrl("pet-photos", post.photo_path);

  const body = (
    <div className="w-full bg-white text-black">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <Image src={photoUrl} alt="Pet photo" fill className="object-cover" sizes="(max-width: 768px) 100vw, 420px" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-black shadow"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        <div className="text-lg font-semibold">
          {post.pet_name ?? "Unknown pet"}
        </div>
        <div className="mt-1 text-sm text-black/70">
          {post.post_type.toUpperCase()} • {post.species}
        </div>

        <div className="mt-4">
          <Field label="Report Type" value={post.post_type} />
          <Field label="Species" value={post.species} />
          <Field label="Breed" value={post.breed ?? "Unknown"} />
          <Field label="Color" value={post.color ?? "Unknown"} />
          <Field label="Status" value={post.status} />
          <Field label="Details" value={post.description ?? "—"} />
          <Field
            label="Contact"
            value={
              [post.contact_name, post.contact_phone, post.contact_email]
                .filter(Boolean)
                .join(" • ") || "—"
            }
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:right-0 md:z-30 md:block md:w-[420px] md:border-l md:border-zinc-200 md:bg-white md:shadow-xl">
        <div className="h-full overflow-auto">{body}</div>
      </div>

      <div className="md:hidden">
        <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} />
        <div className="fixed bottom-0 left-0 right-0 z-40 max-h-[85vh] overflow-auto rounded-t-3xl bg-white shadow-xl">
          {body}
        </div>
      </div>
    </>
  );
}
