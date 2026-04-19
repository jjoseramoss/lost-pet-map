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
  postType: PostType | "all";
  breed: string;
  color: string;
  petName: string;
  radius: RadiusFilter;
};

const postTypeOptions: Array<FiltersState["postType"]> = [
  "all",
  "lost",
  "found",
  "shelter",
];

export const defaultFilters: FiltersState = {
  postType: "all",
  breed: "",
  color: "",
  petName: "",
  radius: {
    enabled: false,
    miles: 3,
    center: null,
    picking: false,
  },
};

type FilterOptions = {
  breeds: string[];
  colors: string[];
};

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
      <span className="text-[11px] font-medium text-black">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-lg border border-zinc-200 bg-white px-2 text-sm text-black placeholder:text-black/80 outline-none focus:border-zinc-400"
      />
    </label>
  );
}

function ComboField({
  label,
  value,
  onChange,
  placeholder,
  options,
  listId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  listId: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-black">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        list={listId}
        className="h-8 w-full rounded-lg border border-zinc-200 bg-white px-2 text-sm text-black placeholder:text-black/80 outline-none focus:border-zinc-400"
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </label>
  );
}

function FiltersPanel({
  value,
  onChange,
  options,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  options: FilterOptions;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const breedOptions = useMemo(() => {
    const query = value.breed.trim().toLowerCase();
    if (!query) return options.breeds;
    return options.breeds.filter((b) => b.toLowerCase().includes(query));
  }, [options.breeds, value.breed]);

  const colorOptions = useMemo(() => {
    const query = value.color.trim().toLowerCase();
    if (!query) return options.colors;
    return options.colors.filter((c) => c.toLowerCase().includes(query));
  }, [options.colors, value.color]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-black">Type</span>
          <select
            value={value.postType}
            onChange={(event) =>
              onChange({
                ...value,
                postType: event.target.value as FiltersState["postType"],
              })
            }
            className="h-8 w-full rounded-lg border border-zinc-200 bg-white px-2 text-sm text-black outline-none focus:border-zinc-400"
          >
            {postTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <ComboField
          label="Breed"
          value={value.breed}
          onChange={(breed) => onChange({ ...value, breed })}
          placeholder="type to search"
          options={breedOptions}
          listId="breed-options"
        />

        <ComboField
          label="Color"
          value={value.color}
          onChange={(color) => onChange({ ...value, color })}
          placeholder="type to search"
          options={colorOptions}
          listId="color-options"
        />

        <Field
          label="Name"
          value={value.petName}
          onChange={(petName) => onChange({ ...value, petName })}
          placeholder="e.g., Luna"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-sm"
          onClick={() => setAdvancedOpen((open) => !open)}
        >
          {advancedOpen ? "Hide advanced" : "Advanced"}
        </button>

        <button
          type="button"
          className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-sm"
          onClick={() => onChange(defaultFilters)}
        >
          Reset
        </button>
      </div>

      {!advancedOpen ? null : (
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Radius</div>
            <label className="flex items-center gap-2 text-xs text-black">
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
            <span className="text-[11px] font-medium text-black">
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
            <div className="text-[11px] font-medium text-black">Center</div>
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
            className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-sm"
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
        </div>
      </div>
      )}
    </div>
  );
}

export default function FilterBar({
  value,
  onChange,
  options,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  options: FilterOptions;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute right-4 top-4 z-20">
      <div className="flex items-start justify-end gap-3">
        <div className="pointer-events-auto hidden w-[360px] rounded-2xl border border-zinc-200 bg-white/95 p-2 text-black shadow md:block">
          <FiltersPanel value={value} onChange={onChange} options={options} />
        </div>

        <div className="pointer-events-auto md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 rounded-full bg-black px-4 text-sm font-semibold text-white shadow"
          >
            Filters
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="pointer-events-auto fixed inset-0 z-30 bg-black/40"
          onClick={() => setOpen(false)}
        >
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
              <FiltersPanel value={value} onChange={onChange} options={options} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
