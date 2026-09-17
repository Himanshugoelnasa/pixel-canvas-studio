import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, Upload, ZoomIn } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { CompareSlider } from "@/components/compare-slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { generations } from "@/lib/mock-data";

export const Route = createFileRoute("/upscaler")({
  head: () => ({
    meta: [
      { title: "AI Image Upscaler — PixelForge AI" },
      { name: "description", content: "Upscale images up to 8× with face enhancement, detail recovery and noise reduction." },
      { property: "og:title", content: "AI Image Upscaler — PixelForge AI" },
      { property: "og:description", content: "Up to 8× upscaling with detail recovery." },
    ],
  }),
  component: UpscalerPage,
});

function UpscalerPage() {
  const [scale, setScale] = useState("4×");
  const [busy, setBusy] = useState(false);
  const src = generations[1]!;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="AI Image Upscaler" subtitle="Rescue detail, print at poster size." />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <GlassCard className="space-y-4">
            <CompareSlider before={src.image} after={generations[2]!.image} labelBefore="Original 1024px" labelAfter={`Upscaled ${scale}`} />
            {busy ? <Progress value={64} className="h-2" /> : null}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => toast.success("Image uploaded")}><Upload className="mr-2 size-4" />Upload image</Button>
              <Button
                className="gradient-brand text-white"
                onClick={() => { setBusy(true); toast.success(`Upscaling ${scale}…`); setTimeout(() => { setBusy(false); toast.success("Upscale complete"); }, 1800); }}
              >
                <ZoomIn className="mr-2 size-4" />Upscale {scale}
              </Button>
              <Button variant="secondary" onClick={() => toast.success("Download started")}><Download className="mr-2 size-4" />Download</Button>
            </div>
          </GlassCard>

          <GlassCard className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Scale factor</Label>
              <div className="grid grid-cols-3 gap-2">
                {["2×", "4×", "8×"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={cn("rounded-xl border py-3 text-sm font-medium transition-all", scale === s ? "border-primary/60 bg-primary/15" : "border-border/60 text-muted-foreground hover:border-primary/30")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Enhancement</Label>
              {["Face enhancement", "Detail recovery", "Noise reduction", "Sharpening"].map((o, i) => (
                <div key={o} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{o}</span>
                  <Switch defaultChecked={i < 2} aria-label={o} />
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-3 text-xs text-muted-foreground">
              Output: <span className="text-foreground">{scale === "2×" ? "2048 × 2048" : scale === "4×" ? "4096 × 4096" : "8192 × 8192"}</span>
              <Badge className="ml-2 gradient-brand text-white">{scale === "2×" ? 4 : scale === "4×" ? 8 : 16} credits</Badge>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
