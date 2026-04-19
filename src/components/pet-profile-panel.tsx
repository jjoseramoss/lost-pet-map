"use client";

import Image from "next/image";
import type { PetPost } from "@/lib/posts/types";
import { getPublicStorageUrl } from "@/lib/storage/public-url";

function pillClasses(variant: "neutral" | "lost" | "found" | "shelter") {
  switch (variant) {
    case "lost":
      return "bg-amber-100 text-amber-900 ring-1 ring-amber-200";
    case "found":
      return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200";
    case "shelter":
      return "bg-sky-100 text-sky-900 ring-1 ring-sky-200";
    default:
      return "bg-zinc-100 text-zinc-900 ring-1 ring-zinc-200";
  }
}

function Pill({ children, variant }: { children: React.ReactNode; variant?: "neutral" | "lost" | "found" | "shelter" }) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${pillClasses(
        variant ?? "neutral",
      )}`}
    >
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="col-span-2 text-sm text-zinc-900">{value}</div>
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
        <Image
          src={photoUrl}
          alt="Pet photo"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 420px"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-zinc-900">
              {post.pet_name ?? "Unknown pet"}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Pill variant={post.post_type}>{post.post_type.toUpperCase()}</Pill>
              <Pill>{post.species}</Pill>
              <Pill>{post.status}</Pill>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-3">
          <Field label="Breed" value={post.breed ?? "Unknown"} />
          <Field label="Color" value={post.color ?? "Unknown"} />
        </div>

        <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3">
          <Field label="Details" value={post.description ?? "—"} />
        </div>

        <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3">
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
      <div className="hidden md:fixed md:inset-y-0 md:right-0 md:z-30 md:block md:w-[440px] md:p-5">
        <div className="h-full overflow-hidden rounded-[2.25rem] border border-[var(--panel-border)] bg-white/95 shadow-2xl backdrop-blur">
          <div className="h-full overflow-auto">{body}</div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} />
        <div className="fixed bottom-0 left-0 right-0 z-40 max-h-[85vh] overflow-auto rounded-t-[2.25rem] bg-white shadow-2xl">
          {body}
        </div>
      </div>
    </>
  );
}
