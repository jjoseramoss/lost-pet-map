function Icon({
  name,
}: {
  name: "map" | "report" | "filters" | "about";
}) {
  const common = "h-6 w-6";

  switch (name) {
    case "map":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path
            d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M9 3v15" stroke="currentColor" strokeWidth="2" />
          <path d="M15 6v15" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "report":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path
            d="M12 5v14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "filters":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path
            d="M4 6h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7 6v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 12h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17 12v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 18h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "about":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 7h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
  }
}

const items = [
  { id: "map", label: "Map", icon: "map" },
  { id: "report", label: "Report", icon: "report" },
  { id: "filters", label: "Filters", icon: "filters" },
  { id: "about", label: "About", icon: "about" },
] as const;

export type NavItemId = (typeof items)[number]["id"];

type NavBarProps = {
  onSelect: (id: NavItemId) => void;
  activeId: NavItemId;
  panelOpen?: boolean;
};

export default function NavBar({ onSelect, activeId, panelOpen }: NavBarProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <nav
        className={
          panelOpen
            ? "pointer-events-auto fixed bottom-[calc(50dvh+1rem)] left-1/2 w-[min(26rem,calc(100%-2rem))] -translate-x-1/2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] p-2 shadow-2xl backdrop-blur md:bottom-auto md:left-4 md:top-1/2 md:w-20 md:-translate-x-0 md:-translate-y-1/2 md:rounded-2xl"
            : "pointer-events-auto fixed bottom-4 left-1/2 w-[min(26rem,calc(100%-2rem))] -translate-x-1/2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] p-2 shadow-2xl backdrop-blur md:bottom-auto md:left-4 md:top-1/2 md:w-20 md:-translate-x-0 md:-translate-y-1/2 md:rounded-2xl"
        }
      >
        <ul className="flex items-center justify-between gap-2 md:flex-col md:justify-center">
          {items.map((item) => (
            <li key={item.id} className="flex-1 md:flex-none">
              <button
                type="button"
                className={
                  item.id === activeId
                    ? "flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-3 py-3 text-sm font-semibold text-white shadow md:h-14 md:w-14 md:gap-0 md:px-0"
                    : "flex w-full items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-semibold text-zinc-900 hover:bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] md:h-14 md:w-14 md:gap-0 md:px-0"
                }
                onClick={() => onSelect(item.id)}
                aria-label={item.label}
              >
                <Icon name={item.icon} />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
