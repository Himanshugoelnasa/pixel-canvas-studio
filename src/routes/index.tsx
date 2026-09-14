import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Boxes,
  HardDrive,
  Image as ImageIcon,
  ImagePlus,
  Settings2,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, SectionTitle, StatCard } from "@/components/ui-kit";
import { ImageCard, ImageDetailModal } from "@/components/image-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { batchJobs, generations, user, type Generation } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — PixelForge AI Studio" },
      { name: "description", content: "Your AI image generation dashboard: credits, recent generations, batch jobs and quick create." },
      { property: "og:title", content: "Dashboard — PixelForge AI Studio" },
      { property: "og:description", content: "Create more. Generate faster." },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Images Generated", value: "12,842", change: 18.2, icon: <ImageIcon className="size-4" /> },
  { label: "This Month", value: "2,418", change: 12.6, icon: <Sparkles className="size-4" /> },
  { label: "Batch Jobs", value: "86", change: 7.4, icon: <Boxes className="size-4" /> },
  { label: "Credits Remaining", value: "8,420", change: -9.1, icon: <Zap className="size-4" /> },
  { label: "Storage Used", value: "38.4 GB", change: 4.8, icon: <HardDrive className="size-4" /> },
  { label: "Success Rate", value: "98.7%", change: 0.6, icon: <CheckCircle2 className="size-4" /> },
];

function Dashboard() {
  const [active, setActive] = useState<Generation | null>(null);
  const [prompt, setPrompt] = useState(
    "Futuristic cyberpunk city at night, cinematic lighting, ultra detailed",
  );
  const running = batchJobs.filter((b) => b.status === "processing");

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full gradient-brand opacity-30 blur-3xl animate-float-glow" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-3">
              <Badge variant="secondary" className="rounded-full">Pro workspace</Badge>
              <h1 className="font-display text-3xl font-semibold sm:text-4xl">
                Good evening, {user.firstName} <span className="align-middle">👋</span>
              </h1>
              <p className="text-muted-foreground">Ready to turn your ideas into images?</p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                <Button asChild size="lg" className="gradient-brand text-white shadow-lg">
                  <Link to="/generate"><ImagePlus className="mr-2 size-4" />Create Image</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link to="/batch"><Boxes className="mr-2 size-4" />Batch Generate</Link>
                </Button>
              </div>
            </div>
            <div className="grid w-full max-w-sm gap-3 rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Monthly credits</p>
              <div className="flex items-end justify-between">
                <p className="font-display text-3xl font-semibold text-gradient">{user.credits.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">of {user.creditsTotal.toLocaleString()}</p>
              </div>
              <Progress value={84} className="h-2" />
              <p className="text-xs text-muted-foreground">Renews 14 Oct 2026 · Pro plan</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <GlassCard className="space-y-4" glow>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold">Quick generate</h2>
                <p className="text-xs text-muted-foreground">Describe it once — we handle the rest.</p>
              </div>
              <Badge className="gradient-brand text-white">8 credits</Badge>
            </div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label="Prompt"
              className="min-h-28 resize-none rounded-xl bg-background/50 text-sm"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Select defaultValue="flux-pro">
                <SelectTrigger aria-label="Model"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="flux-pro">PixelForge Flux Pro</SelectItem>
                  <SelectItem value="pf-pro">PixelForge Pro</SelectItem>
                  <SelectItem value="cinematic">Cinematic XL</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="16:9">
                <SelectTrigger aria-label="Aspect ratio"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["1:1", "16:9", "9:16", "4:3", "3:2"].map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="high">
                <SelectTrigger aria-label="Quality"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["draft", "standard", "high", "ultra"].map((q) => (
                    <SelectItem key={q} value={q} className="capitalize">{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Settings2 className="mr-2 size-4" />Advanced settings
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 grid gap-3 sm:grid-cols-2">
                <Input placeholder="Negative prompt" aria-label="Negative prompt" />
                <Input placeholder="Seed (random)" aria-label="Seed" />
              </CollapsibleContent>
            </Collapsible>
            <div className="flex flex-wrap items-center gap-2">
              <Button className="gradient-brand text-white" onClick={() => toast.success("Generation queued — 4 images")}>
                <Sparkles className="mr-2 size-4" />Generate
              </Button>
              <Button variant="outline" onClick={() => toast("Choose a reference image")}>
                <Upload className="mr-2 size-4" />Upload image
              </Button>
              <Button asChild variant="ghost" className="ml-auto text-muted-foreground">
                <Link to="/generate">Open studio <ArrowUpRight className="ml-1 size-4" /></Link>
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="space-y-4">
            <SectionTitle
              title="Running batches"
              action={<Button asChild variant="ghost" size="sm"><Link to="/batch">All jobs</Link></Button>}
            />
            {running.map((b) => (
              <div key={b.id} className="rounded-xl border border-border/60 bg-background/40 p-3.5">
                <p className="truncate text-sm font-medium">{b.name}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{b.completed} / {b.total} completed</span>
                  <span>ETA {b.eta}</span>
                </div>
                <Progress value={(b.completed / b.total) * 100} className="mt-2.5 h-1.5" />
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-border/70 p-3.5 text-xs text-muted-foreground">
              86 batch jobs completed this quarter · 34,112 images delivered.
            </div>
          </GlassCard>
        </section>

        <section className="space-y-4">
          <SectionTitle
            title="Recent generations"
            action={<Button asChild variant="ghost" size="sm"><Link to="/gallery">View gallery</Link></Button>}
          />
          <div className="columns-2 gap-4 [column-fill:_balance] md:columns-3 xl:columns-4">
            {generations.slice(0, 16).map((g) => (
              <div key={g.id} className="mb-4 break-inside-avoid">
                <ImageCard gen={g} onOpen={setActive} />
              </div>
            ))}
          </div>
        </section>
      </div>
      <ImageDetailModal gen={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
