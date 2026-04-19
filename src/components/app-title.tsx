import Image from "next/image";
import petScoutLogo from "@/app/PetScoutLogo.png";

export default function AppTitle() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2">
      <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-[#345AC0] px-3 py-2 text-white shadow-lg">
        <div className="relative h-14 w-72">
          <Image src={petScoutLogo} alt="Pet Scout" fill sizes="288px" className="object-contain" />
        </div>
      </div>
    </div>
  );
}
