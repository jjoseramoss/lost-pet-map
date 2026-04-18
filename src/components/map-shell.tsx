"use client";

import { useEffect, useState } from "react";
import IntroOverlay from "@/components/intro-overlay";
import MapView from "@/components/map-view";
import AppTitle from "@/components/app-title";
import AboutPanel from "@/components/about-panel";
import ReportPanel from "@/components/report-panel";
import NavBar, { type NavItemId } from "@/components/nav-bar";

export default function MapShell() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [showIntro, setShowIntro] = useState(true);
  const [activePanel, setActivePanel] = useState<Exclude<NavItemId, "map"> | null>(null);
  const [initialViewState, setInitialViewState] = useState({
    longitude: -98.23,
    latitude: 26.2,
    zoom: 14, 
    bearing: 0,
    pitch: 0,
  });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setInitialViewState((current) => ({
          ...current,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          zoom: Math.max(current.zoom, 14),
        }));
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 5_000 },
    );
  }, []);

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
      <MapView
        mapboxToken={mapboxToken}
        initialViewState={initialViewState}
        interactive={!showIntro && !activePanel}
      />

      {!showIntro ? <AppTitle /> : null}

      {showIntro ? <IntroOverlay onContinue={() => setShowIntro(false)} /> : null}
      {activePanel === "report" ? (
        <ReportPanel onClose={() => setActivePanel(null)} />
      ) : null}
      {activePanel === "about" ? (
        <AboutPanel onClose={() => setActivePanel(null)} />
      ) : null}
      {!showIntro ? (
        <NavBar
          panelOpen={Boolean(activePanel)}
          onSelect={(id) => {
            if (id === "map") {
              setActivePanel(null);
              return;
            }
            setActivePanel(id);
          }}
        />
      ) : null}
    </div>
  );
}
