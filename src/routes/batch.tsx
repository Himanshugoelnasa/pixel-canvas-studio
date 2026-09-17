import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Boxes,
  CheckCircle2,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Pause,
  Play,
  RefreshCw,
  Rocket,
  Save,
  Table as TableIcon,
  Trash2,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, StatCard } from "@/components/ui-kit";
import { ImageCard, ImageDetailModal } from "@/components/image-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { batchJobs, generations, models, type Generation } from "@/lib/mock-data";

export const Route = createFileRoute("/batch")({
  head: () => ({
    meta: [
      { title: "Batch Studio — PixelForge AI" },
      { name: "description", content: "Generate hundreds of AI images at once from CSV, JSON or prompt lists with variable mapping." },
      { property: "og:title", content: "Batch Studio — PixelForge AI" },
      { property: "og:description", content: "Generate hundreds of images at once." },
    ],
  }),
  component: BatchPage,
});

const INPUTS = [
  { id: "prompts", label: "Prompt list", icon: FileText, hint: "Paste one prompt per line" },
  { id: "csv", label: "CSV upload", icon: FileSpreadsheet, hint: "Columns become variables" },
  { id: "json", label: "JSON upload", icon: FileJson, hint: "Array of prompt objects" },
  { id: "catalog", label: "Product catalog", icon: Boxes, hint: "Sync a product feed" },
  { id: "folder", label: "Image folder", icon: FolderOpen, hint: "Image-to-image batch" },
];

const VARIABLES = [
  { name: "product_name", value: "column: product", example: "Aurora Ceramic Mug" },
  { name: "background", value: "column: backdrop", example: "travertine podium" },
  { name: "lighting", value: "static", example: "soft studio strobes" },
  { name: "angle", value: "column: angle", example: "three-quarter view" },
];

function statusColor(s: string) {
  return s === "completed"
    ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
    : s === "processing"
      ? "bg-primary/15 text-primary"
      : s === "failed"
        ? "bg-destructive/15 text-destructive"
        : "bg-muted text-muted-foreground";
}

function BatchPage() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("csv");
  const [active, setActive] = useState<Generation | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [jobs, setJobs] = useState(batchJobs);
  const [filter, setFilter] = useState("all");

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const setStatus = (id: string, status: (typeof batchJobs)[number]["status"], msg: string) => {
    setJobs((j) => j.map((job) => (job.id === id ? { ...job, status } : job)));
    toast.success(msg);
  };

  const results = generations.filter((g) =>
    filter === "favorites" ? g.favorite : true,
  );

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute -left-20 -bottom-24 size-72 rounded-full gradient-brand opacity-25 blur-3xl animate-float-glow" />
          <div className="relative max-w-2xl space-y-3">
            <Badge variant="secondary" className="rounded-full">Batch Studio</Badge>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">
              Generate <span className="text-gradient">hundreds of images</span> at once.
            </h1>
            <p className="text-muted-foreground">
              Upload a spreadsheet, map your variables and let PixelForge render the whole campaign while you sleep.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Active jobs" value="2" change={12} icon={<Rocket className="size-4" />} />
          <StatCard label="Images queued" value="1,712" change={22.5} icon={<Boxes className="size-4" />} />
          <StatCard label="Credits reserved" value="6,848" change={-4.2} icon={<Download className="size-4" />} />
          <StatCard label="Success rate" value="97.4%" change={1.1} icon={<CheckCircle2 className="size-4" />} />
        </section>

        <GlassCard className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                  step === s ? "gradient-brand border-transparent text-white" : "border-border/60 text-muted-foreground",
                )}
              >
                <span className="grid size-5 place-items-center rounded-full bg-black/25 text-[10px]">{s}</span>
                {["Input", "Configuration", "Variables"][s - 1]}
              </button>
            ))}
            <Badge variant="outline" className="ml-auto">New batch job</Badge>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {INPUTS.map(({ id, label, icon: Icon, hint }) => (
                  <button
                    key={id}
                    onClick={() => setInput(id)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all",
                      input === id ? "border-primary/60 bg-primary/10" : "border-border/60 hover:border-primary/30",
                    )}
                  >
                    <Icon className="size-5 text-primary" />
                    <p className="mt-2.5 text-sm font-medium">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{hint}</p>
                  </button>
                ))}
              </div>
              {input === "prompts" ? (
                <Textarea
                  aria-label="Prompt list"
                  className="min-h-40 font-mono text-xs"
                  defaultValue={"Product photo of Aurora mug on travertine\nProduct photo of Aurora mug on linen\nProduct photo of Aurora mug on marble"}
                />
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); toast.success("products.csv uploaded — 128 rows"); }}
                  className="rounded-2xl border border-dashed border-border/70 bg-background/30 p-10 text-center"
                >
                  <FileSpreadsheet className="mx-auto size-8 text-primary" />
                  <p className="mt-3 text-sm font-medium">Drop your file here</p>
                  <p className="text-xs text-muted-foreground">CSV, JSON or XLSX up to 50 MB</p>
                  <Button className="mt-4" variant="secondary" onClick={() => toast.success("products.csv uploaded — 128 rows")}>Browse files</Button>
                  <p className="mt-3 text-xs text-[color:var(--success)]">products.csv · 128 rows · 4 columns detected</p>
                </div>
              )}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Model", models.map((m) => m.name)],
                ["Style", ["Product Photography", "Cinematic", "Photorealistic", "Illustration"]],
                ["Resolution", ["1024 × 1024", "1536 × 1024", "2048 × 2048", "4K"]],
                ["Aspect ratio", ["1:1", "16:9", "4:5", "3:2"]],
                ["Outputs per prompt", ["1", "2", "4", "8"]],
                ["Quality", ["Draft", "Standard", "High", "Ultra"]],
              ].map(([label, opts]) => (
                <div key={label as string} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{label as string}</Label>
                  <Select defaultValue={(opts as string[])[0]!}>
                    <SelectTrigger aria-label={label as string}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(opts as string[]).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Seed</Label>
                <Input placeholder="Random" aria-label="Seed" />
              </div>
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <Label className="text-xs text-muted-foreground">Negative prompt</Label>
                <Input defaultValue="blurry, watermark, text artifacts" aria-label="Negative prompt" />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-background/40 p-4 font-mono text-xs">
                Create a product photo of <span className="text-gradient">{"{{product_name}}"}</span> on{" "}
                <span className="text-gradient">{"{{background}}"}</span> with{" "}
                <span className="text-gradient">{"{{lighting}}"}</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Variable</TableHead><TableHead>Value</TableHead><TableHead>Example</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {VARIABLES.map((v) => (
                    <TableRow key={v.name}>
                      <TableCell className="font-mono text-xs">{`{{${v.name}}}`}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{v.value}</TableCell>
                      <TableCell className="text-xs">{v.example}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}

          <Separator />

          <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[["Prompts", "128"], ["Images", "512"], ["Est. credits", "2,048"], ["Est. time", "18 min"]].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</p>
                  <p className="font-display text-lg font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast.success("Template saved")}><Save className="mr-2 size-4" />Save as Template</Button>
              <Button className="gradient-brand text-white" onClick={() => toast.success("Batch job started")}>
                <Rocket className="mr-2 size-4" />Start Batch
              </Button>
            </div>
          </div>
        </GlassCard>

        <section className="space-y-4">
          <PageHeader title="Batch jobs" subtitle="Monitor, pause and export every run." />
          <div className="space-y-3">
            {jobs.map((job) => (
              <GlassCard key={job.id} className="space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{job.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.model} · started {job.started} · {job.credits.toLocaleString()} credits
                    </p>
                  </div>
                  <Badge className={cn("capitalize", statusColor(job.status))}>{job.status}</Badge>
                </div>
                <Progress value={(job.completed / job.total) * 100} className="h-2" />
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span>{job.completed} / {job.total} completed</span>
                  <span className="text-destructive">{job.failed} failed</span>
                  <span>ETA {job.eta}</span>
                  <div className="ml-auto flex flex-wrap gap-1.5">
                    {job.status === "processing" ? (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(job.id, "paused", "Batch paused")}><Pause className="mr-1.5 size-3.5" />Pause</Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(job.id, "processing", "Batch resumed")}><Play className="mr-1.5 size-3.5" />Resume</Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => toast.success("Retrying failed items")}><RefreshCw className="mr-1.5 size-3.5" />Retry failed</Button>
                    <Button size="sm" variant="ghost" onClick={() => toast.success("Preparing ZIP download")}><Download className="mr-1.5 size-3.5" />Download</Button>
                    <Button size="sm" variant="ghost" onClick={() => toast("Export queued — CSV")}><TableIcon className="mr-1.5 size-3.5" />Export CSV</Button>
                    <Button size="sm" variant="ghost" onClick={() => toast("Opening logs")}>Logs</Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setStatus(job.id, "failed", "Batch cancelled")}><XCircle className="mr-1.5 size-3.5" />Cancel</Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Batch results</h2>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                {["all", "completed", "failed", "processing", "favorites"].map((f) => (
                  <TabsTrigger key={f} value={f} className="text-xs capitalize">{f}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={filter} />
            </Tabs>
          </div>
          {selected.length ? (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm">
              <span className="font-medium">{selected.length} selected</span>
              <div className="ml-auto flex flex-wrap gap-1.5">
                <Button size="sm" variant="secondary" onClick={() => toast.success(`${selected.length} images downloaded`)}>Download</Button>
                <Button size="sm" variant="secondary" onClick={() => toast.success("Regenerating selection")}>Regenerate</Button>
                <Button size="sm" variant="secondary" onClick={() => toast.success("Upscaling selection")}>Upscale</Button>
                <Button size="sm" variant="secondary" onClick={() => toast.success("Metadata exported")}>Export metadata</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { toast.success("Selection deleted"); setSelected([]); }}>
                  <Trash2 className="mr-1.5 size-3.5" />Delete
                </Button>
              </div>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {results.slice(0, 20).map((g) => (
              <ImageCard key={g.id} gen={g} onOpen={setActive} selectable selected={selected.includes(g.id)} onSelect={toggle} />
            ))}
          </div>
        </section>
      </div>
      <ImageDetailModal gen={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
