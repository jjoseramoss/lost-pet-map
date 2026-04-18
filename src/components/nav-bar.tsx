const items = [
  { id: "map", label: "Map" },
  { id: "report", label: "Report" },
  { id: "about", label: "About" },
] as const;

export type NavItemId = (typeof items)[number]["id"];

type NavBarProps = {
  onSelect: (id: NavItemId) => void;
  panelOpen?: boolean;
};

export default function NavBar({ onSelect, panelOpen }: NavBarProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <nav
        className={
          panelOpen
            ? "pointer-events-auto fixed bottom-[calc(50dvh+1rem)] left-1/2 w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-950/70 p-2 shadow-lg backdrop-blur md:bottom-auto md:left-4 md:top-1/2 md:w-20 md:-translate-x-0 md:-translate-y-1/2"
            : "pointer-events-auto fixed bottom-4 left-1/2 w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-950/70 p-2 shadow-lg backdrop-blur md:bottom-auto md:left-4 md:top-1/2 md:w-20 md:-translate-x-0 md:-translate-y-1/2"
        }
      >
        <ul className="flex items-center justify-between gap-2 md:flex-col md:justify-center">
          {items.map((item) => (
            <li key={item.id} className="flex-1 md:flex-none">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-xl px-3 py-3 text-sm font-medium text-sky-100 hover:bg-sky-500/10 hover:text-sky-50 md:h-14 md:w-14 md:px-0 md:text-xs"
                onClick={() => onSelect(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
