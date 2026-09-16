import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { LayoutTemplate, Plus, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { templates } from "@/lib/mock-data";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — PixelForge AI" },
      { name: "description", content: "Reusable prompt and settings templates for product shots, thumbnails, campaigns and more." },
      { property: "og:title", content: "Templates — PixelForge AI" },
      { property: "og:description", content: "Ship consistent AI imagery with reusable templates." },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Templates"
          subtitle={`${templates.length} reusable generation presets`}
          actions={<Button className="gradient-brand text-white" onClick={() => toast.success("Template saved")}><Plus className="mr-2 size-4" />New template</Button>}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((t) => (
            <article key={t.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40">
              <div className="relative h-32 overflow-hidden">
                <img src={t.cover} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-white backdrop-blur">
                  <LayoutTemplate className="mr-1 inline size-3" />{t.uses} uses
                </span>
              </div>
              <div className="space-y-2.5 p-4">
                <h3 className="font-display font-semibold">{t.name}</h3>
                <p className="line-clamp-2 text-xs text-muted-foreground">{t.prompt}</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.settings.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                </div>
                <Button size="sm" className="w-full gradient-brand text-white" onClick={() => toast.success(`Loaded “${t.name}” into the studio`)}>
                  <Sparkles className="mr-2 size-3.5" />Use template
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
