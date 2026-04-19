type PanelShellProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  hidden?: boolean;
};

export default function PanelShell({
  title,
  onClose,
  children,
  hidden,
}: PanelShellProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div
        className={
          hidden
            ? "pointer-events-none fixed bottom-0 left-0 flex h-[50dvh] w-full translate-y-full flex-col rounded-t-3xl border-t border-white/10 bg-zinc-950/85 p-6 text-white opacity-0 shadow-2xl backdrop-blur transition-all md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:w-[26rem] md:translate-x-full md:translate-y-0 md:rounded-none md:border-l md:border-t-0"
            : "pointer-events-auto fixed bottom-0 left-0 flex h-[50dvh] w-full flex-col rounded-t-3xl border-t border-white/10 bg-zinc-950/85 p-6 text-white shadow-2xl backdrop-blur transition-all md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:w-[26rem] md:rounded-none md:border-l md:border-t-0"
        }
      >
        <div className="text-xl font-semibold">{title}</div>

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto">{children}</div>

        <button
          type="button"
          className="mt-6 inline-flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-white text-sm font-semibold text-black"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
