import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, Eraser, Upload } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { CompareSlider } from "@/components/compare-slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { generations } from "@/lib/mock-data";

export const Route = createFileRoute("/background-remover")({
  head: () => ({
    meta: [
      { title: "Background Remover — PixelForge AI" },
      { name: "description", content: "Remove or replace image backgrounds in one click — transparent, white, custom or blurred." },
      { property: "og:title", content: "Background Remover — PixelForge AI" },
      { property: "og:description", content: "One-click background removal for product and portrait shots." },
    ],
  }),
  component: BgRemoverPage,
});

const OPTIONS = ["Transparent", "White", "Custom color", "Blur background"];

function BgRemoverPage() {
  const [opt, setOpt] = useState("Transparent");

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Background Remover" subtitle="Cut out subjects with clean, hair-level edges." />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <GlassCard className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); toast.success("Image uploaded"); }}
              className="rounded-2xl border border-dashed border-border/70 bg-background/30 p-6 text-center"
            >
              <Upload className="mx-auto size-6 text-primary" />
              <p className="mt-2 text-sm font-medium">Drag & drop an image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG or WebP up to 25 MB</p>
            </div>
            <CompareSlider before={generations[9]!.image} after={generations[14]!.image} labelBefore="Original" labelAfter={opt} />
            <div className="flex flex-wrap gap-2">
              <Button className="gradient-brand text-white" onClick={() => toast.success("Background removed")}><Eraser className="mr-2 size-4" />Remove background</Button>
              <Button variant="secondary" onClick={() => toast.success("Download started")}><Download className="mr-2 size-4" />Download PNG</Button>
            </div>
          </GlassCard>

          <GlassCard className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Background</Label>
              <div className="grid grid-cols-2 gap-2">
                {OPTIONS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setOpt(o)}
                    className={cn("rounded-xl border px-3 py-2.5 text-xs font-medium transition-all", opt === o ? "border-primary/60 bg-primary/15" : "border-border/60 text-muted-foreground hover:border-primary/30")}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Edge feather</Label>
              <Slider defaultValue={[24]} max={100} aria-label="Edge feather" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Blur strength</Label>
              <Slider defaultValue={[60]} max={100} aria-label="Blur strength" />
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-3 text-xs text-muted-foreground">
              Batch mode available — drop a folder to process up to 500 images.
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
