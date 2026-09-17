import { useState } from "react";
import { toast } from "sonner";
import {
  Copy,
  Download,
  Eraser,
  Heart,
  Layers,
  MoreHorizontal,
  Pencil,
  Share2,
  Sparkles,
  Trash2,
  Wand2,
  ZoomIn,
} from "lucide-react";
import type { Generation } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function ImageCard({
  gen,
  onOpen,
  selectable,
  selected,
  onSelect,
}: {
  gen: Generation;
  onOpen?: (gen: Generation) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}) {
  const [fav, setFav] = useState(gen.favorite);
  const act = (label: string) => toast.success(label);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <figure
          className={cn(
            "group relative animate-reveal overflow-hidden rounded-2xl border border-border/60 bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_30px_80px_-40px_rgba(139,92,246,0.8)]",
            selected && "ring-2 ring-primary",
          )}
        >
          <button
            type="button"
            aria-label={`Open image: ${gen.prompt.slice(0, 48)}`}
            onClick={() => onOpen?.(gen)}
            className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src={gen.image}
              alt={gen.prompt}
              loading="lazy"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>

          {selectable ? (
            <div className="absolute left-3 top-3 z-10">
              <Checkbox
                checked={selected}
                onCheckedChange={() => onSelect?.(gen.id)}
                aria-label="Select image"
                className="size-5 border-white/60 bg-black/40"
              />
            </div>
          ) : null}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="line-clamp-2 text-xs text-white/90">{gen.prompt}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-white/70">
              <Badge variant="secondary" className="bg-white/15 text-white">{gen.model}</Badge>
              <span>{gen.resolution}</span>
              <span>·</span>
              <span>{gen.timeSec.toFixed(1)}s</span>
            </div>
            <div className="pointer-events-auto mt-2.5 flex items-center gap-1">
              {[
                { icon: Download, label: "Download started" },
                { icon: Pencil, label: "Opening editor" },
                { icon: ZoomIn, label: "Upscaling image" },
                { icon: Layers, label: "Creating variations" },
              ].map(({ icon: Icon, label }) => (
                <Button
                  key={label}
                  size="icon"
                  variant="secondary"
                  className="size-8 rounded-lg bg-white/15 text-white hover:bg-white/25"
                  aria-label={label}
                  onClick={() => act(label)}
                >
                  <Icon className="size-4" />
                </Button>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="size-8 rounded-lg bg-white/15 text-white hover:bg-white/25"
                    aria-label="More actions"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => act("Remix queued")}><Wand2 className="mr-2 size-4" />Remix</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => act("Background removed")}><Eraser className="mr-2 size-4" />Remove background</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => act("Prompt copied")}><Copy className="mr-2 size-4" />Copy prompt</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => act("Share link copied")}><Share2 className="mr-2 size-4" />Share</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => act("Image deleted")}><Trash2 className="mr-2 size-4" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </figcaption>

          <Button
            size="icon"
            variant="ghost"
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            onClick={() => {
              setFav((f) => !f);
              toast.success(fav ? "Removed from favorites" : "Image added to favorites");
            }}
            className="absolute right-3 top-3 size-8 rounded-lg bg-black/35 text-white backdrop-blur hover:bg-black/55"
          >
            <Heart className={cn("size-4", fav && "fill-pink-500 text-pink-500")} />
          </Button>
        </figure>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem onClick={() => onOpen?.(gen)}>Open</ContextMenuItem>
        <ContextMenuItem onClick={() => act("Opening editor")}>Edit</ContextMenuItem>
        <ContextMenuItem onClick={() => act("Variations queued")}>Generate variation</ContextMenuItem>
        <ContextMenuItem onClick={() => act("Upscaling image")}>Upscale</ContextMenuItem>
        <ContextMenuItem onClick={() => act("Background removed")}>Remove background</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => act("Download started")}>Download</ContextMenuItem>
        <ContextMenuItem onClick={() => act("Prompt copied")}>Copy prompt</ContextMenuItem>
        <ContextMenuItem onClick={() => act("Moved to project")}>Move to project</ContextMenuItem>
        <ContextMenuItem onClick={() => act("Image added to favorites")}>Add to favorites</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onClick={() => act("Image deleted")}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function ImageDetailModal({
  gen,
  onClose,
}: {
  gen: Generation | null;
  onClose: () => void;
}) {
  const act = (label: string) => toast.success(label);
  if (!gen) return null;
  const meta: Array<[string, string]> = [
    ["Model", gen.model],
    ["Style", gen.style],
    ["Seed", String(gen.seed)],
    ["Steps", String(gen.steps)],
    ["CFG scale", gen.cfg.toFixed(1)],
    ["Resolution", gen.resolution],
    ["Aspect ratio", gen.aspect],
    ["Generated", new Date(gen.createdAt).toLocaleString()],
    ["Credits used", String(gen.credits)],
  ];

  return (
    <Dialog open={!!gen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-6xl overflow-hidden border-border/60 bg-card/90 p-0 backdrop-blur-2xl"
      >
        <div className="grid max-h-[85vh] grid-cols-1 overflow-y-auto lg:grid-cols-[1.5fr_1fr]">
          <div className="flex items-center justify-center bg-black/50 p-4">
            <img src={gen.image} alt={gen.prompt} className="max-h-[78vh] w-full rounded-xl object-contain" />
          </div>
          <div className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Prompt</p>
              <p className="mt-1.5 text-sm leading-relaxed">{gen.prompt}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Negative prompt</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{gen.negativePrompt}</p>
            </div>
            <Separator />
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              <Button className="gradient-brand text-white" onClick={() => act("Download started")}>
                <Download className="mr-2 size-4" />Download
              </Button>
              <Button variant="secondary" onClick={() => act("Opening editor")}><Pencil className="mr-2 size-4" />Edit</Button>
              <Button variant="secondary" onClick={() => act("Variations queued")}><Sparkles className="mr-2 size-4" />Variation</Button>
              <Button variant="secondary" onClick={() => act("Upscaling image")}><ZoomIn className="mr-2 size-4" />Upscale</Button>
              <Button variant="outline" onClick={() => act("Share link copied")}><Share2 className="mr-2 size-4" />Share</Button>
              <Button variant="outline" onClick={() => act("Settings copied")}><Copy className="mr-2 size-4" />Copy settings</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
