import PanelShell from "@/components/panel-shell";

type AboutPanelProps = {
  onClose: () => void;
};

export default function AboutPanel({ onClose }: AboutPanelProps) {
  return (
    <PanelShell title="About" onClose={onClose}>
      <div className="mt-5 space-y-3 text-sm text-zinc-700">
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
