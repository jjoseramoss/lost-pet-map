"use client";

import { useEffect, useState } from "react";
import IntroOverlay from "@/components/intro-overlay";
import MapView from "@/components/map-view";
import AppTitle from "@/components/app-title";
import AboutPanel from "@/components/about-panel";
import ReportPanel from "@/components/report-panel";
import NavBar, { type NavItemId } from "@/components/nav-bar";
import FiltersPanel, { defaultFilters, type FiltersState } from "@/components/filters/filter-bar";
import PetProfilePanel from "@/components/pet-profile-panel";
import type { PetPost } from "@/lib/posts/types";

const fallbackViewState = {
  longitude: -98.23,
  latitude: 26.2,
  zoom: 14,
  bearing: 0,
  pitch: 0,
};

export default function MapShell() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [showIntro, setShowIntro] = useState(true);
  const [activePanel, setActivePanel] = useState<Exclude<NavItemId, "map"> | null>(null);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [selectedPost, setSelectedPost] = useState<PetPost | null>(null);
  const [filterOptions, setFilterOptions] = useState({ breeds: [], colors: [] } as {
    breeds: string[];
    colors: string[];
  });
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [reportLat, setReportLat] = useState("");
  const [reportLng, setReportLng] = useState("");
  const [initialViewState, setInitialViewState] = useState<
    typeof fallbackViewState | null
  >(() => {
    if (typeof window === "undefined") return fallbackViewState;
    return navigator.geolocation ? null : fallbackViewState;
  });

  useEffect(() => {
    if (initialViewState) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setInitialViewState({
          ...fallbackViewState,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
      },
      () => {
        setInitialViewState(fallbackViewState);
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 7_000 },
    );
  }, [initialViewState]);

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
    <div className="relative h-full w-full">
      {initialViewState ? (
        <MapView
          mapboxToken={mapboxToken}
          initialViewState={initialViewState}
          interactive={!showIntro && (!activePanel || isPickingLocation)}
          filters={filters}
          onFiltersChange={setFilters}
          onFilterOptionsChange={setFilterOptions}
          onSelectPost={setSelectedPost}
          showPins={!isPickingLocation}
          onPickLocation={
            isPickingLocation
              ? (coords) => {
                  setReportLat(String(coords.lat));
                  setReportLng(String(coords.lng));
                  setIsPickingLocation(false);
                }
              : undefined
          }
        />
      ) : (
        <div className="h-full w-full bg-[var(--map-bg)]" />
      )}

      {!showIntro ? <AppTitle /> : null}

      {selectedPost ? (
        <PetProfilePanel post={selectedPost} onClose={() => setSelectedPost(null)} />
      ) : null}

      {showIntro ? <IntroOverlay onContinue={() => setShowIntro(false)} /> : null}
      {activePanel === "report" ? (
        <ReportPanel
          onClose={() => {
            setActivePanel(null);
            setIsPickingLocation(false);
          }}
          lat={reportLat}
          lng={reportLng}
          onLatChange={setReportLat}
          onLngChange={setReportLng}
          onStartPickLocation={() => {
            setIsPickingLocation(true);
          }}
          hidden={isPickingLocation}
        />
      ) : null}
      {activePanel === "about" ? (
        <AboutPanel onClose={() => setActivePanel(null)} />
      ) : null}

      {activePanel === "filters" ? (
        <FiltersPanel
          value={filters}
          onChange={setFilters}
          options={filterOptions}
          onClose={() => setActivePanel(null)}
        />
      ) : null}
      {!showIntro ? (
        <NavBar
          panelOpen={Boolean(activePanel) && !isPickingLocation}
          activeId={activePanel ?? "map"}
          onSelect={(id) => {
            if (id === "map") {
              setActivePanel(null);
              setIsPickingLocation(false);
              return;
            }
            setActivePanel(id);
          }}
        />
      ) : null}
    </div>
  );
}
