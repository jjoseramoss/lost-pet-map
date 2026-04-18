"use client";

import { useMemo, useState } from "react";
import type { PostType } from "@/lib/posts/types";

export type RadiusFilter = {
  enabled: boolean;
  miles: number;
  center: { lat: number; lng: number } | null;
  picking: boolean;
};

export type FiltersState = {
  postTypes: PostType[];
  breed: string;
  color: string;
  radius: RadiusFilter;
};

const defaultPostTypes: PostType[] = ["lost", "found", "shelter"];

export const defaultFilters: FiltersState = {
  postTypes: defaultPostTypes,
  breed: "",
  color: "",
  radius: {
    enabled: false,
    miles: 3,
    center: null,
    picking: false,
  },
};

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-black px-3 py-1 text-xs font-medium text-white"
          : "rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-800"
      }
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-zinc-600">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
      />
    </label>
  );
}

function FiltersPanel({
  value,
  onChange,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}) {
  const activeSet = useMemo(() => new Set(value.postTypes), [value.postTypes]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {defaultPostTypes.map((postType) => (
          <Chip
            key={postType}
            active={activeSet.has(postType)}
            onClick={() => {
              const next = new Set(value.postTypes);
              if (next.has(postType)) next.delete(postType);
              else next.add(postType);
              onChange({ ...value, postTypes: Array.from(next) as PostType[] });
            }}
          >
            {postType}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field
          label="Breed"
          value={value.breed}
          onChange={(breed) => onChange({ ...value, breed })}
          placeholder="e.g., husky"
        />
        <Field
          label="Color"
          value={value.color}
          onChange={(color) => onChange({ ...value, color })}
          placeholder="e.g., black"
        />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Radius</div>
          <label className="flex items-center gap-2 text-xs text-zinc-700">
            <input
              type="checkbox"
              checked={value.radius.enabled}
              onChange={(event) =>
                onChange({
                  ...value,
                  radius: { ...value.radius, enabled: event.target.checked },
                })
              }
            />
            Enable
          </label>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-zinc-600">
              Miles: {value.radius.miles}
            </span>
            <input
              type="range"
              min={1}
              max={25}
              value={value.radius.miles}
              onChange={(event) =>
                onChange({
                  ...value,
                  radius: {
                    ...value.radius,
                    miles: Number(event.target.value),
                  },
                })
              }
              className="w-full"
              disabled={!value.radius.enabled}
            />
          </label>

          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-medium text-zinc-600">Center</div>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  radius: {
                    ...value.radius,
                    enabled: true,
                    picking: !value.radius.picking,
                  },
                })
              }
              className={
                value.radius.picking
                  ? "h-9 rounded-lg bg-amber-500 px-3 text-sm font-medium text-white"
                  : "h-9 rounded-lg bg-black px-3 text-sm font-medium text-white"
              }
            >
              {value.radius.picking ? "Click map to set center" : "Set center on map"}
            </button>
            <div className="text-xs text-zinc-600">
              {value.radius.center
                ? `${value.radius.center.lat.toFixed(4)}, ${value.radius.center.lng.toFixed(4)}`
                : "Not set"}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
            onClick={() =>
              onChange({
                ...value,
                radius: {
                  enabled: false,
                  miles: value.radius.miles,
                  center: null,
                  picking: false,
                },
              })
            }
          >
            Clear radius
          </button>

          <button
            type="button"
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
            onClick={() => onChange(defaultFilters)}
          >
            Reset all
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FilterBar({
  value,
  onChange,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute left-0 top-0 z-20 w-full p-3">
      <div className="mx-auto flex w-full max-w-5xl items-start justify-end gap-3">
        <div className="pointer-events-auto hidden w-full rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow md:block">
          <FiltersPanel value={value} onChange={onChange} />
        </div>

        <div className="pointer-events-auto md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 rounded-full bg-white/95 px-4 text-sm font-medium shadow"
          >
            Filters
          </button>
        </div>
      </div>

      {open ? (
        <div className="pointer-events-auto fixed inset-0 z-30 bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-auto rounded-t-3xl bg-white p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">Filters</div>
              <button
                type="button"
                className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
                onClick={() => setOpen(false)}
              >
                Done
              </button>
            </div>
            <div className="mt-4">
              <FiltersPanel value={value} onChange={onChange} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
