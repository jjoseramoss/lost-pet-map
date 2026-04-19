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
            ? "pointer-events-none fixed bottom-0 left-0 flex h-[82dvh] w-full translate-y-full flex-col rounded-t-[2.25rem] border border-[var(--panel-border)] bg-white/95 px-5 pb-6 pt-3 text-zinc-900 opacity-0 shadow-2xl backdrop-blur transition-all md:bottom-auto md:left-auto md:right-6 md:top-20 md:h-[calc(100dvh-7rem)] md:w-[24rem] md:translate-x-0 md:translate-y-0 md:rounded-[2.25rem]"
            : "pointer-events-auto fixed bottom-0 left-0 flex h-[82dvh] w-full flex-col rounded-t-[2.25rem] border border-[var(--panel-border)] bg-white/95 px-5 pb-6 pt-3 text-zinc-900 shadow-2xl backdrop-blur transition-all md:bottom-auto md:left-auto md:right-6 md:top-20 md:h-[calc(100dvh-7rem)] md:w-[24rem] md:rounded-[2.25rem]"
        }
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-300" />

        <div className="mt-4 flex items-center justify-between">
          <div className="text-base font-semibold tracking-tight">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
