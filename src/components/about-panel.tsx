import Image from "next/image";
import logo from "@/app/projectLogo.png";
import PanelShell from "@/components/panel-shell";

type AboutPanelProps = {
  onClose: () => void;
};

export default function AboutPanel({ onClose }: AboutPanelProps) {
  return (
    <PanelShell title="About" onClose={onClose}>
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/5">
          <Image src={logo} alt="" fill sizes="40px" className="object-contain" />
        </div>
        <div className="text-sm text-white/80">Pet Scout</div>
      </div>

      <div className="mt-5 text-sm text-white/80">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </PanelShell>
  );
}

