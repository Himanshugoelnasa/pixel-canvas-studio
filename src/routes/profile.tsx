import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, StatCard } from "@/components/ui-kit";
import { ImageCard, ImageDetailModal } from "@/components/image-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generations, user, type Generation } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — PixelForge AI" },
      { name: "description", content: "Your creator profile, plan details and best AI generations." },
      { property: "og:title", content: "Profile — PixelForge AI" },
      { property: "og:description", content: "Your creator profile on PixelForge." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [active, setActive] = useState<Generation | null>(null);
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Profile" subtitle="How your work appears to your team." />
        <GlassCard className="flex flex-col items-start gap-5 sm:flex-row sm:items-center" glow>
          <Avatar className="size-20"><AvatarImage src={user.avatar} alt="" /><AvatarFallback>HG</AvatarFallback></Avatar>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge className="gradient-brand text-white">{user.plan} plan</Badge>
              <Badge variant="secondary">Workspace owner</Badge>
              <Badge variant="outline">Joined Mar 2026</Badge>
            </div>
          </div>
          <Button variant="outline" onClick={() => toast.success("Profile updated")}>Edit profile</Button>
        </GlassCard>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Images generated" value="12,842" change={18.2} />
          <StatCard label="Projects" value="10" change={11} />
          <StatCard label="Batch jobs" value="86" change={7.4} />
          <StatCard label="Favorites" value="8" change={3.2} />
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Best work</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {generations.filter((g) => g.favorite).slice(0, 8).map((g) => <ImageCard key={g.id} gen={g} onOpen={setActive} />)}
          </div>
        </div>
      </div>
      <ImageDetailModal gen={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
