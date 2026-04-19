import Image from "next/image";
import logo from "@/app/logo-transparent.png";
import PanelShell from "@/components/panel-shell";

type AboutPanelProps = {
  onClose: () => void;
};

export default function AboutPanel({ onClose }: AboutPanelProps) {
  return (
    <PanelShell title="About" onClose={onClose}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1 ring-1 ring-white/15">
          <Image
            src={logo}
            alt="Pet Scout logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        </div>
        <div className="text-sm text-white/80">Pet Scout</div>
      </div>

      <div className="mt-5 space-y-3 text-sm text-white/80">
        <div>
          Pet Scout is a community-powered map for lost pets and stray sightings.
          We combine reports from people in the area with listings from local
          shelters, so it’s easier to spot patterns and connect the right people
          quickly.
        </div>
        <div>
          The problem: posts are scattered across social media, group chats, and
          shelter pages. By putting reports on a single map, we reduce duplicate
          effort and help reunite pets faster.
        </div>
      </div>
    </PanelShell>
  );
}
