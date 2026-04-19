import Image from "next/image";
import petScoutLogo from "@/app/PetScoutLogo.png";

type IntroOverlayProps = {
  onContinue: () => void;
};

export default function IntroOverlay({ onContinue }: IntroOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex w-full items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#345AC0] p-10 text-white shadow-sm">
        <div className="flex items-center justify-center gap-3">
          <div className="relative h-24 w-[min(28rem,90vw)]">
            <Image src={petScoutLogo} alt="Pet Scout" fill sizes="448px" className="object-contain" />
          </div>
        </div>

        <div className="mt-3 text-center text-sm font-medium text-white/80">
          A neighborhood map to help pets find their way home.
        </div>

        <div className="mt-5 rounded-lg bg-white/5 p-4 text-sm text-white/90 ring-1 ring-white/10">
          <div className="font-semibold text-white">Quick how-to</div>
          <ol className="mt-2 list-decimal space-y-2 pl-4">
            <li>
              <span className="font-medium text-white">Search</span> the map for recent sightings and reports.
            </li>
            <li>
              <span className="font-medium text-white">Report</span> a lost pet or a sighting by dropping a pin.
            </li>
            <li>
              <span className="font-medium text-white">Connect</span> with neighbors and share updates quickly.
            </li>
          </ol>
        </div>
        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          onClick={onContinue}
        >
          Enter the map
        </button>
      </div>
    </div>
  );
}
