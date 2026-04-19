"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function PhotoField({
  value,
  previewUrl,
  onChange,
  onGenerate,
  isGenerating,
}: {
  value: File | null;
  previewUrl: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!previewUrl) return;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <label className="grid gap-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="text-zinc-800">Photo</div>
        <div className="text-xs text-zinc-500">Optional AI autofill</div>
      </div>

      <label
        className="relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            onChange(file, file ? URL.createObjectURL(file) : null);
          }}
        />

        <span className="relative inline-flex h-40 w-full items-center justify-center overflow-hidden rounded-[1.25rem] border border-zinc-200 bg-sky-50 px-4 text-sm font-semibold text-zinc-900 shadow-sm">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 26rem"
              className="object-cover"
            />
          ) : (
            "Choose file"
          )}

          <button
            type="button"
            disabled={!value || isGenerating}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onGenerate();
            }}
            title="Generate species/breed/color from image"
            className={
              value
                ? "absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-black shadow disabled:opacity-60"
                : "absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow opacity-60"
            }
          >
            {isGenerating ? (
              <span className="text-xs font-semibold">…</span>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.33H5v-.92l9.06-9.06.92.92L5.92 19.58zM20.71 7.04a1.003 1.003 0 0 0 0-1.42L18.37 3.29a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z"
                />
                <path
                  fill="currentColor"
                  d="M12 2l.9 2.7L16 6l-3.1 1.3L12 10l-.9-2.7L8 6l3.1-1.3L12 2z"
                />
              </svg>
            )}
          </button>

          {hover && value ? (
            <div className="absolute right-14 top-5 hidden rounded-lg bg-zinc-900 px-3 py-2 text-xs text-white md:block">
              Autofill breed/color/species
            </div>
          ) : null}
        </span>
      </label>
    </label>
  );
}
