import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, Grid3x3, Images, LayoutList, Rows3, Search, Tag, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState, PageHeader } from "@/components/ui-kit";
import { ImageCard, ImageDetailModal } from "@/components/image-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { generations, models, projects, styles, type Generation } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — PixelForge AI" },
      { name: "description", content: "Browse, filter and bulk-manage every AI image your workspace has generated." },
      { property: "og:title", content: "Gallery — PixelForge AI" },
      { property: "og:description", content: "Your complete AI asset library." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [view, setView] = useState("masonry");
  const [query, setQuery] = useState("");
  const [model, setModel] = useState("all");
  const [style, setStyle] = useState("all");
  const [project, setProject] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [active, setActive] = useState<Generation | null>(null);

  const items = useMemo(
    () =>
      generations.filter(
        (g) =>
          (model === "all" || g.model === model) &&
          (style === "all" || g.style === style) &&
          (project === "all" || g.project === project) &&
          (query === "" || (g.prompt + g.tags.join(" ")).toLowerCase().includes(query.toLowerCase())),
      ),
    [model, style, project, query],
  );

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Gallery"
          subtitle={`${items.length} assets in your workspace library`}
          actions={
            <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)} variant="outline">
              <ToggleGroupItem value="grid" aria-label="Grid view"><Grid3x3 className="size-4" /></ToggleGroupItem>
              <ToggleGroupItem value="masonry" aria-label="Masonry view"><Rows3 className="size-4" /></ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view"><LayoutList className="size-4" /></ToggleGroupItem>
            </ToggleGroup>
          }
        />

        <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-border/60 bg-card/40 p-3 backdrop-blur-xl">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prompt, filename or tag…" className="pl-9" aria-label="Search gallery" />
          </div>
          {[
            ["Model", model, setModel, models.map((m) => m.name)],
            ["Style", style, setStyle, styles.map((s) => s.name)],
            ["Project", project, setProject, projects.map((p) => p.name)],
          ].map(([label, val, set, opts]) => (
            <Select key={label as string} value={val as string} onValueChange={set as (v: string) => void}>
              <SelectTrigger className="w-[160px]" aria-label={label as string}><SelectValue placeholder={label as string} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {(label as string).toLowerCase()}s</SelectItem>
                {(opts as string[]).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          ))}
          <Badge variant="outline" className="ml-auto">{items.length} results</Badge>
        </div>

        {selected.length ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm">
            <span className="font-medium">{selected.length} selected</span>
            <div className="ml-auto flex flex-wrap gap-1.5">
              <Button size="sm" variant="secondary" onClick={() => toast.success(`${selected.length} images downloaded`)}><Download className="mr-1.5 size-3.5" />Download</Button>
              <Button size="sm" variant="secondary" onClick={() => toast.success("Moved to project")}>Move to project</Button>
              <Button size="sm" variant="secondary" onClick={() => toast.success("Tags added")}><Tag className="mr-1.5 size-3.5" />Add tags</Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { toast.success("Images deleted"); setSelected([]); }}><Trash2 className="mr-1.5 size-3.5" />Delete</Button>
            </div>
          </div>
        ) : null}

        {items.length === 0 ? (
          <EmptyState
            title="No generations yet"
            description="Nothing matches these filters. Try clearing them, or create something new in the studio."
            icon={<Images className="size-8" />}
            action={<Button className="gradient-brand text-white" onClick={() => { setQuery(""); setModel("all"); setStyle("all"); setProject("all"); }}>Clear filters</Button>}
          />
        ) : view === "list" ? (
          <div className="overflow-hidden rounded-2xl border border-border/60">
            {items.map((g) => (
              <button
                key={g.id}
                onClick={() => setActive(g)}
                className="flex w-full items-center gap-4 border-b border-border/40 p-3 text-left transition-colors last:border-0 hover:bg-card/60"
              >
                <img src={g.image} alt="" className="size-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{g.prompt}</p>
                  <p className="text-xs text-muted-foreground">{g.model} · {g.resolution} · {g.project}</p>
                </div>
                <Badge variant="outline" className="hidden sm:inline-flex">{g.style}</Badge>
                <span className="hidden text-xs text-muted-foreground md:block">{new Date(g.createdAt).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        ) : view === "masonry" ? (
          <div className="columns-2 gap-4 md:columns-3 xl:columns-5">
            {items.map((g) => (
              <div key={g.id} className="mb-4 break-inside-avoid">
                <ImageCard gen={g} onOpen={setActive} selectable selected={selected.includes(g.id)} onSelect={toggle} />
              </div>
            ))}
          </div>
        ) : (
          <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5")}>
            {items.map((g) => (
              <ImageCard key={g.id} gen={g} onOpen={setActive} selectable selected={selected.includes(g.id)} onSelect={toggle} />
            ))}
          </div>
        )}
      </div>
      <ImageDetailModal gen={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
