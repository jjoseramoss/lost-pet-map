import Image from "next/image";
import logo from "@/app/projectLogo.png";
import PanelShell from "@/components/panel-shell";

type ReportPanelProps = {
  onClose: () => void;
};

export default function ReportPanel({ onClose }: ReportPanelProps) {
  return (
    <PanelShell title="Report" onClose={onClose}>
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/5">
          <Image src={logo} alt="" fill sizes="40px" className="object-contain" />
        </div>
        <div className="text-sm text-white/80">Pet Scout</div>
      </div>

      <div className="mt-5 space-y-3">
        <input
          className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none"
          placeholder="Input 1"
        />
        <input
          className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none"
          placeholder="Input 2"
        />
        <input
          className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none"
          placeholder="Input 3"
        />
      </div>
    </PanelShell>
  );
}

