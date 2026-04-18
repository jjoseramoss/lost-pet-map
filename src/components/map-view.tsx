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
    lng: -98.23,
  },
];

type MapViewProps = {
  mapboxToken: string;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
    bearing: number;
    pitch: number;
  };
  interactive: boolean;
};

const mapConfig: { basemap: Record<string, string | boolean> } = {
  basemap: {
    lightPreset: "night",
    colorMotorways: "#b3d4ff",
    colorTrunks: "#b8bfff",
    colorRoads: "#b3d0ff",
    showPointOfInterestLabels: false,
    showTransitLabels: false,
    showAdminBoundaries: false,
    colorAdminBoundaries: "#d9d9d9",
    show3dObjects: false,
    show3dBuildings: false,
    show3dTrees: false,
    show3dLandmarks: false,
    showLandmarkIconLabels: false,
    showIndoorLabels: false,
    colorCommercial: "#d9d9d9",
    colorEducation: "#ababab",
    colorMedical: "#bfbbbb",
    colorGreenspace: "#cccccc",
    colorWater: "#85d6ff",
    colorLand: "#969696",
  },
};

function PinIcon({ title }: { title: string }) {
  return (
    <div title={title} className="drop-shadow">
      <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 0C6.477 0 2 4.477 2 10c0 6.5 10 14 10 14s10-7.5 10-14C22 4.477 17.523 0 12 0z"
          fill="#ef4444"
        />
        <circle cx="12" cy="10" r="6.2" fill="#ffffff" />
      </svg>
    </div>
  );
}

export default function MapView({
  mapboxToken,
  initialViewState,
  interactive,
}: MapViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => demoPins.find((pin) => pin.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <div
      className={
        interactive ? "h-full w-full" : "h-full w-full pointer-events-none blur-sm"
      }
    >
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/standard"
        config={mapConfig}
        attributionControl={false}
        logoPosition="bottom-right"
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
            <PinIcon title={pin.title} />
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
    </div>
  );
}

