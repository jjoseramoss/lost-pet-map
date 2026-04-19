import Image from "next/image";
import logo from "@/app/logo-transparent.png";

export default function AppTitle() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 md:left-4 md:translate-x-0">
      <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-zinc-900 shadow-xl backdrop-blur">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white p-1 ring-1 ring-[var(--panel-border)]">
          <Image src={logo} alt="Pet Scout logo" width={28} height={28} className="h-7 w-7 object-contain" />
        </div>
        <div className="text-sm font-semibold tracking-wide">Pet Scout</div>
      </div>
    </div>
  );
}
