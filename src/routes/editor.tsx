import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Brush, Crop, Droplet, Eraser, FlipHorizontal, Focus, Layers, MoveDiagonal,
  PaintBucket, Redo2, RotateCw, Save, Scissors, Sparkles, SquareDashed, Type, Undo2, Wand2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { generations } from "@/lib/mock-data";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Image Editor — PixelForge AI" },
      { name: "description", content: "Browser-based AI editor with masking, inpainting, outpainting, object removal and layers." },
      { property: "og:title", content: "Image Editor — PixelForge AI" },
      { property: "og:description", content: "Mask, inpaint and retouch without leaving the studio." },
    ],
  }),
  component: EditorPage,
});

const TOOLS = [
  { icon: Crop, label: "Crop" }, { icon: MoveDiagonal, label: "Resize" }, { icon: RotateCw, label: "Rotate" },
  { icon: FlipHorizontal, label: "Flip" }, { icon: Brush, label: "Brush" }, { icon: Eraser, label: "Eraser" },
  { icon: SquareDashed, label: "Mask" }, { icon: Wand2, label: "Inpaint" }, { icon: Sparkles, label: "Outpaint" },
  { icon: Scissors, label: "Remove object" }, { icon: PaintBucket, label: "Replace object" },
  { icon: Layers, label: "Remove background" }, { icon: Type, label: "Add text" },
  { icon: Droplet, label: "Adjust colors" }, { icon: Focus, label: "Blur" },
];

const HISTORY = ["Opened image", "Mask created", "Inpaint — remove cable", "Color balance +8", "Sharpen 24%"];

function EditorPage() {
  const [tool, setTool] = useState("Mask");

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">Image Editor</h1>
            <p className="text-sm text-muted-foreground">Non-destructive AI retouching.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Undo" onClick={() => toast("Undo")}><Undo2 className="size-4" /></Button>
            <Button variant="outline" size="icon" aria-label="Redo" onClick={() => toast("Redo")}><Redo2 className="size-4" /></Button>
            <Button className="gradient-brand text-white" onClick={() => toast.success("Edit saved to project")}><Save className="mr-2 size-4" />Save</Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[76px_1fr_300px]">
          <GlassCard className="flex flex-row flex-wrap justify-center gap-1.5 p-2 xl:flex-col">
            {TOOLS.map(({ icon: Icon, label }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => { setTool(label); toast(`${label} tool`); }}
                    aria-label={label}
                    className={cn(
                      "grid size-11 place-items-center rounded-xl border transition-all",
                      tool === label ? "gradient-brand border-transparent text-white" : "border-transparent text-muted-foreground hover:bg-accent",
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ))}
          </GlassCard>

          <GlassCard className="flex items-center justify-center bg-black/30 p-3">
            <img src={generations[3].image} alt="Editing canvas" className="max-h-[70vh] w-auto rounded-xl object-contain" />
          </GlassCard>

          <GlassCard className="p-0">
            <Tabs defaultValue="properties">
              <TabsList className="w-full rounded-none rounded-t-2xl">
                <TabsTrigger value="properties" className="flex-1 text-xs">Properties</TabsTrigger>
                <TabsTrigger value="layers" className="flex-1 text-xs">Layers</TabsTrigger>
                <TabsTrigger value="history" className="flex-1 text-xs">History</TabsTrigger>
              </TabsList>
              <TabsContent value="properties" className="space-y-4 p-4">
                <Badge variant="secondary">{tool}</Badge>
                {["Brush size", "Hardness", "Opacity", "Feather"].map((k, i) => (
                  <div key={k} className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{k}</Label>
                    <Slider defaultValue={[30 + i * 15]} max={100} aria-label={k} />
                  </div>
                ))}
                <Separator />
                <Button size="sm" className="w-full gradient-brand text-white" onClick={() => toast.success("AI edit applied")}>Apply AI edit</Button>
              </TabsContent>
              <TabsContent value="layers" className="space-y-2 p-4">
                {["Text overlay", "Inpaint mask", "Color grade", "Base image"].map((l) => (
                  <div key={l} className="flex items-center gap-3 rounded-xl border border-border/60 p-2.5 text-sm">
                    <img src={generations[3].image} alt="" className="size-9 rounded-md object-cover" />
                    <span className="flex-1 truncate">{l}</span>
                    <Badge variant="outline" className="text-[10px]">100%</Badge>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="history" className="space-y-1.5 p-4 text-sm">
                {HISTORY.map((h, i) => (
                  <button key={h} onClick={() => toast(`Reverted to: ${h}`)} className={cn("w-full rounded-lg px-3 py-2 text-left text-xs", i === HISTORY.length - 1 ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-accent")}>
                    {h}
                  </button>
                ))}
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
