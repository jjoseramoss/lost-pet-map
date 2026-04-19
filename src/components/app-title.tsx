import Image from "next/image";
import logo from "@/app/logo-transparent.png";

export default function AppTitle() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 md:left-4 md:translate-x-0">
      <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/70 px-3 py-2 text-white shadow-lg backdrop-blur">
        <div className="relative h-7 w-7 overflow-hidden rounded-lg bg-white/5">
          <Image src={logo} alt="" fill sizes="28px" className="object-contain" />
        </div>
        <div className="text-sm font-semibold tracking-wide">Pet Scout</div>
      </div>
    </div>
  );
}
