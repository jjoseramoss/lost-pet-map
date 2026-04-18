"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, { type MapRef, Marker, Popup } from "react-map-gl/mapbox";
import lostDogPhoto from "@/app/lostdog.png";

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
      <div className="relative flex h-14 w-14 flex-col items-center">
        <div className="relative z-10 h-12 w-12 overflow-hidden rounded-full bg-white shadow-sm">
          <Image
            src={lostDogPhoto}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
            priority={false}
          />
        </div>
        <div className="absolute top-10 h-0 w-0 border-l-[12px] border-r-[12px] border-t-[18px] border-l-transparent border-r-transparent border-t-red-500" />
      </div>
    </div>
  );
}

export default function MapView({
  mapboxToken,
  initialViewState,
  interactive,
}: MapViewProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(initialViewState.zoom);

  const selected = useMemo(
    () => demoPins.find((pin) => pin.id === selectedId) ?? null,
    [selectedId],
  );

  useEffect(() => {
    if (!interactive) return;
    if (!selected) return;

    mapRef.current?.flyTo({
      center: [selected.lng, selected.lat],
      zoom: Math.max(14, zoom),
      duration: 800,
    });
  }, [interactive, selected, zoom]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const updateZoom = () => setZoom(map.getZoom());
    const rafId = requestAnimationFrame(updateZoom);

    map.on("zoom", updateZoom);
    return () => {
      cancelAnimationFrame(rafId);
      map.off("zoom", updateZoom);
    };
  }, []);

  const minZoom = 5;
  const maxZoom = 18;
  const minScale = 0.75;
  const maxScale = 2.2;

  const zoomT = Math.min(1, Math.max(0, (zoom - minZoom) / (maxZoom - minZoom)));
  const scale = minScale + zoomT * (maxScale - minScale);

  return (
    <div
      className={
        interactive ? "h-full w-full" : "h-full w-full pointer-events-none blur-sm"
      }
    >
      <Map
        ref={mapRef}
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
              if (zoom < 14) {
                mapRef.current?.flyTo({
                  center: [pin.lng, pin.lat],
                  zoom: 14,
                  duration: 800,
                });
              }
              setSelectedId(pin.id);
            }}
          >
            <div
              className="origin-bottom"
              style={{ transform: `scale(${scale})` }}
            >
              <PinIcon title={pin.title} />
            </div>
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
