"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  type MapMouseEvent,
  type MapRef,
  Marker,
  Source,
} from "react-map-gl/mapbox";
import lostDogPhoto from "@/app/lostdog.png";
import { getPublicStorageUrl } from "@/lib/storage/public-url";
import { listPosts, subscribeToPostChanges } from "@/lib/posts/queries";
import type { PetPost } from "@/lib/posts/types";
import type { FiltersState } from "@/components/filters/filter-bar";
import { distanceMiles } from "@/lib/geo/distance";
import { circlePolygonGeoJson } from "@/lib/geo/circle";

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
  filters: FiltersState;
  onFiltersChange: (next: FiltersState) => void;
  onFilterOptionsChange: (next: { breeds: string[]; colors: string[] }) => void;
  onSelectPost: (post: PetPost | null) => void;
  showPins?: boolean;
  onPickLocation?: (coords: { lat: number; lng: number }) => void;
};

const mapConfig: { basemap: Record<string, string | boolean> } = {
  basemap: {
    lightPreset: "day",
    colorMotorways: "#a7d7f3",
    colorTrunks: "#b2dbf5",
    colorRoads: "#c9e8f9",
    showPointOfInterestLabels: false,
    showTransitLabels: false,
    showAdminBoundaries: false,
    colorAdminBoundaries: "#d9d9d9",
    show3dObjects: false,
    show3dBuildings: true,
    show3dTrees: false,
    show3dLandmarks: false,
    showLandmarkIconLabels: false,
    showIndoorLabels: false,
    colorCommercial: "#e7f3fa",
    colorEducation: "#e7f3fa",
    colorMedical: "#f3eef1",
    colorGreenspace: "#e8f5ef",
    colorWater: "#cdeeff",
    colorLand: "#f5f6f7",
  },
};

function PinIcon({ title, photoUrl }: { title: string; photoUrl?: string }) {
  return (
    <div title={title} className="drop-shadow">
      <div className="relative flex h-14 w-14 flex-col items-center">
        <div className="relative z-10 h-12 w-12 overflow-hidden rounded-full border-2 border-red-500 bg-white shadow-sm">
          <Image
            src={photoUrl ?? lostDogPhoto}
            alt=""
            fill
            sizes="64px"
            quality={90}
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
  filters,
  onFiltersChange,
  onFilterOptionsChange,
  onSelectPost,
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
    onSelectPost(selected);
  }, [onSelectPost, selected]);

  const filteredPosts = useMemo(() => {
    const breedQuery = filters.breed.trim().toLowerCase();
    const colorQuery = filters.color.trim().toLowerCase();
    const nameQuery = filters.petName.trim().toLowerCase();

    return posts.filter((post) => {
      if (filters.postType !== "all" && post.post_type !== filters.postType) return false;

      if (breedQuery) {
        const value = (post.breed ?? "").toLowerCase();
        if (!value.includes(breedQuery)) return false;
      }

      if (colorQuery) {
        const value = (post.color ?? "").toLowerCase();
        if (!value.includes(colorQuery)) return false;
      }

      if (nameQuery) {
        const value = (post.pet_name ?? "").toLowerCase();
        if (!value.includes(nameQuery)) return false;
      }

      if (filters.radius.enabled && filters.radius.center) {
        const miles = distanceMiles(
          { lat: filters.radius.center.lat, lng: filters.radius.center.lng },
          { lat: post.lat, lng: post.lng },
        );

        if (miles > filters.radius.miles) return false;
      }

      return true;
    });
  }, [filters, posts]);

  const radiusGeoJson = useMemo(() => {
    if (!filters.radius.enabled) return null;
    if (!filters.radius.center) return null;

    return circlePolygonGeoJson(filters.radius.center, filters.radius.miles);
  }, [filters.radius.center, filters.radius.enabled, filters.radius.miles]);

  const radiusCenter = filters.radius.enabled ? filters.radius.center : null;

  useEffect(() => {
    let active = true;

    void listPosts({ status: "active" })
      .then((data) => {
        if (!active) return;
        setPosts(data);

        const breeds = Array.from(
          new Set(data.map((post) => post.breed).filter((breed): breed is string => Boolean(breed))),
        ).sort((a, b) => a.localeCompare(b));

        const colors = Array.from(
          new Set(data.map((post) => post.color).filter((color): color is string => Boolean(color))),
        ).sort((a, b) => a.localeCompare(b));

        onFilterOptionsChange({ breeds, colors });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : "Failed to load");
      });

    return () => {
      active = false;
    };
  }, [onFilterOptionsChange]);

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
        onClick={(event: MapMouseEvent) => {
          setSelectedId(null);

          if (!interactive) return;

          if (onPickLocation) {
            onPickLocation({ lat: event.lngLat.lat, lng: event.lngLat.lng });
            return;
          }

          if (filters.radius.picking) {
            onFiltersChange({
              ...filters,
              radius: {
                ...filters.radius,
                enabled: true,
                picking: false,
                center: { lat: event.lngLat.lat, lng: event.lngLat.lng },
              },
            });
          }
        }}
      >
        {loadError ? (
          <div className="absolute left-4 top-4 z-10 rounded-lg bg-white/90 px-3 py-2 text-xs text-red-700 shadow">
            {loadError}
          </div>
        ) : null}

        {showPins && radiusGeoJson ? (
          <Source id="radius" type="geojson" data={radiusGeoJson}>
            <Layer
              id="radius-fill"
              type="fill"
              paint={{
                "fill-color": "#89D4FF",
                "fill-opacity": 0.18,
              }}
            />
            <Layer
              id="radius-line"
              type="line"
              paint={{
                "line-color": "#89D4FF",
                "line-width": 2,
              }}
            />
          </Source>
        ) : null}

        {showPins && radiusCenter ? (
          <Marker longitude={radiusCenter.lng} latitude={radiusCenter.lat} anchor="center">
            <div className="h-4 w-4 rounded-full bg-blue-300 ring-4 ring-blue-100" />
          </Marker>
        ) : null}

        {showPins
          ? filteredPosts.map((pin) => (
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
      </Map>
    </div>
  );
}
