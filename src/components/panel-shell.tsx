type PanelShellProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function PanelShell({ title, onClose, children }: PanelShellProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div className="pointer-events-auto fixed bottom-0 left-0 h-[50dvh] w-full rounded-t-3xl border-t border-white/10 bg-zinc-950/85 p-6 text-white shadow-2xl backdrop-blur md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:w-[26rem] md:rounded-none md:border-l md:border-t-0">
        <div className="text-xl font-semibold">{title}</div>

        <div className="mt-6">{children}</div>

        <button
          type="button"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-black"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

