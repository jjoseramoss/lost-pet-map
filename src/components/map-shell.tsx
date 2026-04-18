"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useMemo, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";

type DemoPin = {
  id: string;
  type: "lost" | "found";
  title: string;
  description: string;
  lat: number;
  lng: number;
};

const demoPins: DemoPin[] = [
  {
    id: "1",
    type: "lost",
    title: "Lost dog",
    description: "Last seen near UTRGV (demo)",
    lat: 26.3066,
    lng: -98.1746,
  },
  {
    id: "2",
    type: "found",
    title: "Found cat",
    description: "Spotted near McAllen (demo)",
    lat: 26.2034,
    lng: -98.2300,
  },
];

export default function MapShell() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => demoPins.find((pin) => pin.id === selectedId) ?? null,
    [selectedId],
  );

  if (!mapboxToken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-100 p-6">
        <div className="max-w-lg rounded-xl border bg-white p-6">
          <div className="text-base font-semibold">Mapbox token missing</div>
          <div className="mt-2 text-sm text-zinc-700">
            Add <span className="font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</span> to
            <span className="font-mono"> .env.local</span> to render the map.
          </div>
          <div className="mt-4 text-xs text-zinc-500">
            This template currently renders demo pins once the map loads.
          </div>
        </div>
      </div>
    );
  }

  return (
    <Map
      mapboxAccessToken={mapboxToken}
      initialViewState={{
        longitude: -98.23,
        latitude: 26.20,
        zoom: 10,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: "100%", height: "100%" }}
      onClick={() => setSelectedId(null)}
    >
      {demoPins.map((pin) => (
        <Marker
          key={pin.id}
          longitude={pin.lng}
          latitude={pin.lat}
          anchor="bottom"
          onClick={(event) => {
            event.originalEvent.stopPropagation();
            setSelectedId(pin.id);
          }}
        >
          <div
            className={
              pin.type === "lost"
                ? "h-3 w-3 rounded-full bg-red-600 ring-4 ring-red-200"
                : "h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-emerald-200"
            }
            title={pin.title}
          />
        </Marker>
      ))}

      {selected ? (
        <Popup
          longitude={selected.lng}
          latitude={selected.lat}
          anchor="top"
          closeOnClick={false}
          onClose={() => setSelectedId(null)}
        >
          <div className="min-w-56">
            <div className="text-sm font-semibold">{selected.title}</div>
            <div className="mt-1 text-xs text-zinc-700">
              {selected.description}
            </div>
            <div className="mt-2 text-[11px] text-zinc-500">
              Type: {selected.type}
            </div>
          </div>
        </Popup>
      ) : null}
    </Map>
  );
}
