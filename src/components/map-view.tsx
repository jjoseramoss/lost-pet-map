"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, {
  type MapLayerMouseEvent,
  type MapRef,
  Marker,
  Popup,
} from "react-map-gl/mapbox";
import lostDogPhoto from "@/app/lostdog.png";
import { getPublicStorageUrl } from "@/lib/storage/public-url";
import { listPosts, subscribeToPostChanges } from "@/lib/posts/queries";
import type { PetPost } from "@/lib/posts/types";

const photoBucket = "pet-photos";

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
  showPins?: boolean;
  onPickLocation?: (coords: { lat: number; lng: number }) => void;
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

function PinIcon({ title, photoUrl }: { title: string; photoUrl?: string }) {
  return (
    <div title={title} className="drop-shadow">
      <div className="relative flex h-14 w-14 flex-col items-center">
        <div className="relative z-10 h-12 w-12 overflow-hidden rounded-full bg-white shadow-sm">
          <Image
            src={photoUrl ?? lostDogPhoto}
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
  showPins = true,
  onPickLocation,
}: MapViewProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(initialViewState.zoom);
  const [posts, setPosts] = useState<PetPost[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const selected = useMemo(
    () => posts.find((pin) => pin.id === selectedId) ?? null,
    [posts, selectedId],
  );

  useEffect(() => {
    let active = true;

    void listPosts({ status: "active" })
      .then((data) => {
        if (!active) return;
        setPosts(data);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : "Failed to load");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPostChanges({
      onInsert: (post) => {
        setPosts((current) => {
          if (current.some((existing) => existing.id === post.id)) return current;
          return [post, ...current];
        });
      },
      onUpdate: (post) => {
        setPosts((current) => current.map((existing) => (existing.id === post.id ? post : existing)));
      },
      onDelete: (post) => {
        setPosts((current) => current.filter((existing) => existing.id !== post.id));
      },
    });

    return unsubscribe;
  }, []);

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
        onClick={(event: MapLayerMouseEvent) => {
          setSelectedId(null);
          if (!interactive) return;
          if (!onPickLocation) return;
          onPickLocation({ lat: event.lngLat.lat, lng: event.lngLat.lng });
        }}
      >
        {loadError ? (
          <div className="absolute left-4 top-4 z-10 rounded-lg bg-white/90 px-3 py-2 text-xs text-red-700 shadow">
            {loadError}
          </div>
        ) : null}

        {showPins
          ? posts.map((pin) => (
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
                  <PinIcon
                    title={pin.pet_name ?? `${pin.post_type} ${pin.species}`}
                    photoUrl={getPublicStorageUrl(photoBucket, pin.photo_path)}
                  />
                </div>
              </Marker>
            ))
          : null}

        {showPins && selected ? (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            anchor="top"
            closeOnClick={false}
            onClose={() => setSelectedId(null)}
          >
            <div className="min-w-56">
              <div className="text-sm font-semibold">
                {selected.pet_name ?? "Unknown"}
              </div>
              <div className="mt-1 text-xs text-zinc-700">
                {selected.description ?? "No description"}
              </div>
              <div className="mt-2 text-[11px] text-zinc-500">
                Type: {selected.post_type}
              </div>
            </div>
          </Popup>
        ) : null}
      </Map>
    </div>
  );
}
