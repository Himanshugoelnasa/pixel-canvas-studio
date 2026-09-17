import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Layers, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { ImageCard, ImageDetailModal } from "@/components/image-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { generations, type Generation } from "@/lib/mock-data";

export const Route = createFileRoute("/variations")({
  head: () => ({
    meta: [
      { title: "Variations — PixelForge AI" },
      { name: "description", content: "Explore alternative takes on any generation with similarity, creativity and style controls." },
      { property: "og:title", content: "Variations — PixelForge AI" },
      { property: "og:description", content: "Explore alternative takes on any image." },
    ],
  }),
  component: VariationsPage,
});

function VariationsPage() {
  const [count, setCount] = useState(6);
  const [active, setActive] = useState<Generation | null>(null);
  const source = generations[5]!;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Variations" subtitle="Same idea, new directions." />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <GlassCard className="space-y-5">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Source image</Label>
              <img src={source.image} alt={source.prompt} className="mt-2 w-full rounded-xl object-cover" />
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{source.prompt}</p>
            </div>
            {[["Similarity", 72], ["Creativity", 45], ["Style strength", 60]].map(([label, val]) => (
              <div key={label as string} className="space-y-2">
                <Label className="text-xs text-muted-foreground">{label as string}</Label>
                <Slider defaultValue={[val as number]} max={100} aria-label={label as string} />
              </div>
            ))}
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><Label className="text-muted-foreground">Variations</Label><span>{count}</span></div>
              <Slider value={[count]} min={2} max={12} step={2} onValueChange={([v]) => setCount(v!)} aria-label="Number of variations" />
            </div>
            <Button className="w-full gradient-brand text-white" onClick={() => toast.success(`${count} variations queued`)}>
              <Sparkles className="mr-2 size-4" />Generate variations
            </Button>
          </GlassCard>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">Comparison grid</h2>
              <Badge variant="outline" className="ml-auto">{count} results</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {generations.slice(6, 6 + count).map((g) => <ImageCard key={g.id} gen={g} onOpen={setActive} />)}
            </div>
          </div>
        </div>
      </div>
      <ImageDetailModal gen={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
