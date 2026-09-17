import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — PixelForge AI" },
      { name: "description", content: "REST endpoints, parameters and examples for the PixelForge image generation API." },
      { property: "og:title", content: "Documentation — PixelForge AI" },
      { property: "og:description", content: "Build PixelForge generation into your own product." },
    ],
  }),
  component: DocsPage,
});

const ENDPOINTS = [
  ["POST", "/v1/images/generate", "Generate 1–16 images from a prompt."],
  ["POST", "/v1/images/batch", "Queue a batch job from a CSV or prompt list."],
  ["GET", "/v1/jobs/{id}", "Poll job status, progress and results."],
  ["POST", "/v1/images/upscale", "Upscale an image 2×, 4× or 8×."],
  ["POST", "/v1/images/background", "Remove or replace a background."],
  ["GET", "/v1/models", "List available models and pricing."],
];

function DocsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Documentation" subtitle="PixelForge REST API v1." />
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <GlassCard className="space-y-3">
              <h2 className="font-display text-sm font-semibold">Authentication</h2>
              <p className="text-sm text-muted-foreground">Send your API key as a bearer token on every request.</p>
              <pre className="overflow-x-auto rounded-xl border border-border/60 bg-background/60 p-4 text-xs text-muted-foreground">
                <code>{`curl https://api.pixelforge.ai/v1/models \\
  -H "Authorization: Bearer pf_live_…"`}</code>
              </pre>
            </GlassCard>
            <GlassCard className="space-y-2">
              <h2 className="font-display text-sm font-semibold">Endpoints</h2>
              {ENDPOINTS.map(([m, p, d]) => (
                <div key={p} className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 p-3">
                  <Badge className="gradient-brand text-white">{m}</Badge>
                  <code className="text-xs">{p}</code>
                  <span className="text-xs text-muted-foreground">{d}</span>
                </div>
              ))}
            </GlassCard>
          </div>
          <GlassCard className="space-y-2 self-start">
            <h2 className="font-display text-sm font-semibold">On this page</h2>
            {["Authentication", "Endpoints", "Rate limits", "Webhooks", "Errors"].map((s) => (
              <p key={s} className="text-xs text-muted-foreground">{s}</p>
            ))}
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
