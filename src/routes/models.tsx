import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Heart, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { models } from "@/lib/mock-data";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "Models — PixelForge AI" },
      { name: "description", content: "Compare PixelForge, Flux, SDXL and specialist AI image models by quality, speed and cost." },
      { property: "og:title", content: "Models — PixelForge AI" },
      { property: "og:description", content: "Nine production-ready image models in one studio." },
    ],
  }),
  component: ModelsPage,
});

function ModelsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Models" subtitle="Pick the right engine for every job." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {models.map((m) => (
            <article key={m.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40">
              <div className="relative h-36 overflow-hidden">
                <img src={m.preview} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                {m.recommended ? <Badge className="absolute right-3 top-3 gradient-brand text-white">Recommended</Badge> : null}
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold">{m.name}</h3>
                  <span className="text-xs text-muted-foreground">{m.version}</span>
                </div>
                <p className="text-xs text-muted-foreground">{m.description}</p>
                <div className="space-y-2">
                  {[["Quality", m.quality], ["Speed", m.speed]].map(([label, val]) => (
                    <div key={label as string}>
                      <div className="flex justify-between text-[11px] text-muted-foreground"><span>{label as string}</span><span>{val as number}/5</span></div>
                      <Progress value={(val as number) * 20} className="mt-1 h-1.5" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {m.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                  <span className="ml-auto inline-flex items-center gap-1 text-xs text-primary"><Zap className="size-3.5" />{m.cost} cr</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 gradient-brand text-white" onClick={() => toast.success(`${m.name} selected`)}><Sparkles className="mr-2 size-3.5" />Try model</Button>
                  <Button size="icon" variant="outline" aria-label="Favorite model" onClick={() => toast.success("Added to favorites")}><Heart className="size-4" /></Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
