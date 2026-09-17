import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — PixelForge AI" },
      { name: "description", content: "New models, batch improvements and studio features shipped by PixelForge AI." },
      { property: "og:title", content: "Changelog — PixelForge AI" },
      { property: "og:description", content: "What shipped recently." },
    ],
  }),
  component: ChangelogPage,
});

const ENTRIES = [
  ["12 Sep 2026", "v3.2", "New", ["Cinematic XL v2.4 with improved night lighting", "Camera & lighting controls in the studio", "Prompt history chips"]],
  ["28 Aug 2026", "v3.1", "Improved", ["Batch Studio variable mapping table", "3× faster ZIP exports", "Queue drawer with live ETA"]],
  ["09 Aug 2026", "v3.0", "New", ["PixelForge Pro flagship model", "Layered image editor with inpainting", "Team roles and shared projects"]],
  ["21 Jul 2026", "v2.8", "Fixed", ["Face restoration artifacts at 8× upscale", "CSV parsing for quoted commas", "Gallery filter persistence"]],
];

function ChangelogPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader title="Changelog" subtitle="Everything new in PixelForge." />
        <div className="space-y-4">
          {ENTRIES.map(([date, ver, tag, items]) => (
            <GlassCard key={ver as string} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="gradient-brand text-white">{ver as string}</Badge>
                <Badge variant="secondary">{tag as string}</Badge>
                <span className="ml-auto text-xs text-muted-foreground">{date as string}</span>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {(items as string[]).map((i) => (
                  <li key={i} className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full gradient-brand" />{i}</li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
