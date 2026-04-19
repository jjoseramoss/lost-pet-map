import Image from "next/image";
import logo from "@/app/logo-transparent.png";

type IntroOverlayProps = {
  onContinue: () => void;
};

export default function IntroOverlay({ onContinue }: IntroOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex w-full items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-white/95 p-10 shadow-sm backdrop-blur">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 p-1 ring-1 ring-black/10">
            <Image src={logo} alt="Pet Scout logo" width={32} height={32} className="h-8 w-8 object-contain" />
          </div>
          <div className="text-center text-2xl font-bold text-black">Lost Pet Map</div>
        </div>

        <div className="mt-3 text-center text-sm font-medium text-zinc-800">
          A neighborhood map to help pets find their way home.
        </div>

        <div className="mt-5 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-900 ring-1 ring-black/5">
          <div className="font-semibold">Quick how-to</div>
          <ol className="mt-2 list-decimal space-y-2 pl-4">
            <li>
              <span className="font-medium">Search</span> the map for recent sightings and reports.
            </li>
            <li>
              <span className="font-medium">Report</span> a lost pet or a sighting by dropping a pin.
            </li>
            <li>
              <span className="font-medium">Connect</span> with neighbors and share updates quickly.
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
