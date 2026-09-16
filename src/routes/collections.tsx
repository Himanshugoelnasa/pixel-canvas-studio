import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/ui-kit";
import { Badge } from "@/components/ui/badge";
import { generations } from "@/lib/mock-data";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — PixelForge AI" },
      { name: "description", content: "Curated moodboards and themed collections built from your AI generations." },
      { property: "og:title", content: "Collections — PixelForge AI" },
      { property: "og:description", content: "Moodboards for every creative direction." },
    ],
  }),
  component: CollectionsPage,
});

const COLLECTIONS = [
  "Neon Nights", "Soft Studio Light", "Editorial Portraits", "Product Minimalism",
  "Fantasy Worlds", "Retro Futurism", "Food & Texture", "Architectural Forms",
];

function CollectionsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Collections" subtitle="Curated moodboards from your library." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {COLLECTIONS.map((name, i) => {
            const imgs = generations.slice(i * 3, i * 3 + 4);
            return (
              <article key={name} className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-3 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40">
                <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-xl">
                  {imgs.map((g) => <img key={g.id} src={g.image} alt="" className="aspect-square w-full object-cover" />)}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <h3 className="font-display text-sm font-semibold">{name}</h3>
                  <Badge variant="secondary" className="text-[10px]">{12 + i * 7}</Badge>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
