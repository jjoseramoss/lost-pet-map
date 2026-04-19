"use client";

import { useMemo, useState } from "react";
import type { PostType } from "@/lib/posts/types";
import PanelShell from "@/components/panel-shell";

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

function postTypeActiveClass(option: FiltersState["postType"]) {
  switch (option) {
    case "lost":
      return "bg-red-500 text-white";
    case "found":
      return "bg-emerald-500 text-white";
    case "shelter":
      return "bg-sky-500 text-white";
    default:
      return "bg-white text-zinc-900";
  }
}

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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-black">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full rounded-lg border border-zinc-200 bg-white px-2 text-sm text-black placeholder:text-black/80 outline-none focus:border-zinc-400"
      />
    </label>
  );
}

function ComboField({
  label,
  value,
  onChange,
  options,
  listId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  listId: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-black">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
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

function FiltersPanelBody({
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
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-medium text-black">Type</div>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 p-1 sm:grid-cols-4">
            {postTypeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange({ ...value, postType: option })}
                className={
                  value.postType === option
                    ? `h-9 rounded-lg text-sm font-semibold shadow ${postTypeActiveClass(option)}`
                    : "h-9 rounded-lg text-sm font-semibold text-zinc-700 hover:bg-white/70"
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ComboField
            label="Breed"
            value={value.breed}
            onChange={(breed) => onChange({ ...value, breed })}
            options={breedOptions}
            listId="breed-options"
          />

          <ComboField
            label="Color"
            value={value.color}
            onChange={(color) => onChange({ ...value, color })}
            options={colorOptions}
            listId="color-options"
          />

          <Field
            label="Name"
            value={value.petName}
            onChange={(petName) => onChange({ ...value, petName })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="h-9 rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold"
          onClick={() => setAdvancedOpen((open) => !open)}
        >
          {advancedOpen ? "Hide advanced" : "Advanced"}
        </button>

        <button
          type="button"
          className="h-9 rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold"
          onClick={() => onChange(defaultFilters)}
        >
          Reset
        </button>
      </div>

      {!advancedOpen ? null : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
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

export default function FiltersPanel({
  value,
  onChange,
  options,
  onClose,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  options: FilterOptions;
  onClose: () => void;
}) {
  return (
    <PanelShell title="Filters" onClose={onClose}>
      <div className="rounded-2xl bg-white/70 p-2 ring-1 ring-black/5">
        <FiltersPanelBody value={value} onChange={onChange} options={options} />
      </div>
    </PanelShell>
  );
}
