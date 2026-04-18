type IntroOverlayProps = {
  onContinue: () => void;
};

export default function IntroOverlay({ onContinue }: IntroOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex w-full items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-white/95 p-10 shadow-sm backdrop-blur">
        <div className="text-center text-2xl font-bold text-black">
          Lost Pet Map
        </div>
        <div className="mt-4 text-center text-sm text-zinc-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
        <button
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

