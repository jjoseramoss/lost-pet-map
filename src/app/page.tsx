import MapShell from "@/components/map-shell";

export default function Home() {
  return (
    <div className="flex h-dvh w-full flex-col">
      <header className="flex items-center justify-between border-b bg-white px-4 py-3">
        <div className="flex flex-col">
          <div className="text-base font-semibold">Lost Pet Map</div>
          <div className="text-xs text-zinc-600">
            Live lost/found pins (Mapbox template)
          </div>
        </div>
        <div className="text-xs text-zinc-600">MVP: map + dummy pins</div>
      </header>

      <main className="flex min-h-0 flex-1">
        <aside className="hidden w-80 shrink-0 border-r bg-white p-4 md:block">
          <div className="text-sm font-semibold">Next steps</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
            <li>Add `NEXT_PUBLIC_MAPBOX_TOKEN`</li>
            <li>Connect Supabase for real pins + realtime</li>
            <li>Add report form + photo upload</li>
          </ul>
        </aside>

        <div className="min-h-0 flex-1">
          <div className="h-full w-full">
            <MapShell />
          </div>
        </div>
      </main>
    </div>
  );
}
