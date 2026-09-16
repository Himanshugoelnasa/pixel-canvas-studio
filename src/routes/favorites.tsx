import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState, PageHeader } from "@/components/ui-kit";
import { ImageCard, ImageDetailModal } from "@/components/image-card";
import { Button } from "@/components/ui/button";
import { generations, type Generation } from "@/lib/mock-data";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — PixelForge AI" },
      { name: "description", content: "Your starred AI generations, always one click away." },
      { property: "og:title", content: "Favorites — PixelForge AI" },
      { property: "og:description", content: "Your best AI generations, curated." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const [active, setActive] = useState<Generation | null>(null);
  const favs = generations.filter((g) => g.favorite);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Favorites" subtitle={`${favs.length} starred generations`} />
        {favs.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {favs.map((g) => <ImageCard key={g.id} gen={g} onOpen={setActive} />)}
          </div>
        ) : (
          <EmptyState
            title="No favorites yet"
            description="Tap the heart on any generation to keep your best work here."
            icon={<Star className="size-8" />}
            action={<Button asChild className="gradient-brand text-white"><Link to="/gallery">Browse gallery</Link></Button>}
          />
        )}
      </div>
      <ImageDetailModal gen={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
