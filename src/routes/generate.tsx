import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Camera,
  Eraser,
  Gauge,
  ImagePlus,
  Layers,
  ListOrdered,
  Lock,
  Palette,
  Shuffle,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard } from "@/components/ui-kit";
import { ImageCard, ImageDetailModal } from "@/components/image-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { generations, models, randomPrompts, styles, type Generation } from "@/lib/mock-data";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Image Generator — PixelForge AI Studio" },
      { name: "description", content: "Professional AI generation studio: models, styles, camera controls, references and a live generation queue." },
      { property: "og:title", content: "Image Generator — PixelForge AI Studio" },
      { property: "og:description", content: "Prompt, configure and generate with studio-grade controls." },
    ],
  }),
  component: GeneratePage,
});

const MODES = [
  "Text to Image", "Image to Image", "Sketch to Image", "Pose to Image",
  "Image Remix", "Inpainting", "Outpainting", "ControlNet", "Style Transfer",
];
const ASPECTS = ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "Custom"];
const DIMENSIONS: Record<string, string> = {
  "1:1": "1024 × 1024", "4:3": "1152 × 864", "3:4": "864 × 1152", "16:9": "1536 × 864",
  "9:16": "864 × 1536", "3:2": "1344 × 896", "2:3": "896 × 1344", Custom: "Set manually",
};
const RESOLUTIONS = ["512 × 512", "768 × 768", "1024 × 1024", "1536 × 1024", "2048 × 2048", "4K"];
const QUALITIES = [
  { name: "Draft", time: "~2s", credits: 1 },
  { name: "Standard", time: "~5s", credits: 3 },
  { name: "High", time: "~11s", credits: 6 },
  { name: "Ultra", time: "~24s", credits: 12 },
];
const REFERENCE_TYPES = ["Composition", "Style", "Character", "Color", "Face", "Product"];

type QueueItem = {
  id: string;
  prompt: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  model: string;
  credits: number;
};

function Guidance({ label, hint, value, min, max, step, onChange }: {
  label: string; hint: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help font-medium text-muted-foreground underline decoration-dotted underline-offset-4">{label}</span>
          </TooltipTrigger>
          <TooltipContent>{hint}</TooltipContent>
        </Tooltip>
        <span className="font-medium">{value}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v!)} aria-label={label} />
    </div>
  );
}

function SettingsPanel(props: ReturnType<typeof useStudio>) {
  const {
    model, setModel, aspect, setAspect, resolution, setResolution, quality, setQuality,
    count, setCount, seed, setSeed, randomSeed, setRandomSeed, negative, setNegative,
    guidance, setGuidance, style, setStyle, refs, setRefs, credits,
  } = props;

  return (
    <div className="space-y-5">
      <div className="space-y-2.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Model</Label>
        <div className="grid gap-2">
          {models.slice(0, 5).map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.name)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all",
                model === m.name ? "border-primary/60 bg-primary/10" : "border-border/60 hover:border-primary/30",
              )}
            >
              <img src={m.preview} alt="" className="size-10 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  {m.recommended ? <Badge className="gradient-brand h-4 px-1.5 text-[9px] text-white">Best</Badge> : null}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Quality {m.quality}/5 · Speed {m.speed}/5 · {m.cost} cr
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Reference images</Label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); toast.success("Reference image added"); }}
          className="rounded-xl border border-dashed border-border/70 bg-background/30 p-4 text-center"
        >
          <Upload className="mx-auto size-5 text-muted-foreground" />
          <p className="mt-1.5 text-xs text-muted-foreground">Drag & drop, paste, or</p>
          <Button variant="ghost" size="sm" onClick={() => toast.success("Reference image added")}>browse gallery</Button>
        </div>
        <div className="space-y-2">
          {refs.map((r, i) => (
            <div key={r.id} className="flex items-center gap-2.5 rounded-xl border border-border/60 p-2">
              <img src={r.image} alt="" className="size-12 rounded-lg object-cover" />
              <div className="flex-1 space-y-1.5">
                <Select value={r.type} onValueChange={(v) => setRefs(refs.map((x, j) => (j === i ? { ...x, type: v } : x)))}>
                  <SelectTrigger className="h-7 text-xs" aria-label="Reference type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REFERENCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Slider
                  value={[r.weight]} min={0} max={100} step={5}
                  onValueChange={([v]) => setRefs(refs.map((x, j) => (j === i ? { ...x, weight: v! } : x)))}
                  aria-label="Reference weight"
                />
              </div>
              <Button size="icon" variant="ghost" aria-label="Remove reference" onClick={() => setRefs(refs.filter((_, j) => j !== i))}>
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Aspect ratio</Label>
        <div className="grid grid-cols-4 gap-2">
          {ASPECTS.map((a) => (
            <button
              key={a}
              onClick={() => setAspect(a)}
              className={cn(
                "rounded-lg border py-2 text-xs font-medium transition-all",
                aspect === a ? "border-primary/60 bg-primary/15 text-foreground" : "border-border/60 text-muted-foreground hover:border-primary/30",
              )}
            >
              {a}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">Output preview: {DIMENSIONS[aspect]}</p>
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Resolution</Label>
        <div className="grid grid-cols-3 gap-2">
          {RESOLUTIONS.map((r, i) => (
            <button
              key={r}
              onClick={() => setResolution(r)}
              className={cn(
                "rounded-lg border px-2 py-2 text-[11px] font-medium transition-all",
                resolution === r ? "border-primary/60 bg-primary/15" : "border-border/60 text-muted-foreground hover:border-primary/30",
              )}
            >
              {r}
              <span className="block text-[10px] text-muted-foreground">{2 + i * 3} cr</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Quality</Label>
        <div className="grid grid-cols-4 gap-2">
          {QUALITIES.map((q) => (
            <button
              key={q.name}
              onClick={() => setQuality(q.name)}
              className={cn(
                "rounded-lg border py-2 text-[11px] font-medium transition-all",
                quality === q.name ? "border-primary/60 bg-primary/15" : "border-border/60 text-muted-foreground hover:border-primary/30",
              )}
            >
              {q.name}
              <span className="block text-[10px] text-muted-foreground">{q.time}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Number of images</Label>
          <span className="font-medium">{count}</span>
        </div>
        <Slider value={[count]} min={1} max={16} step={1} onValueChange={([v]) => setCount(v!)} aria-label="Number of images" />
        <p className="text-[11px] text-muted-foreground">Generate {count} images · ~{credits} credits</p>
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Seed</Label>
        <div className="flex items-center gap-2">
          <Input
            value={randomSeed ? "" : seed}
            placeholder={randomSeed ? "Random" : ""}
            onChange={(e) => setSeed(Number(e.target.value) || 0)}
            disabled={randomSeed}
            aria-label="Seed"
            className="h-9"
          />
          <Button size="icon" variant="outline" aria-label="Randomize seed" onClick={() => setSeed(Math.floor(Math.random() * 999999))}>
            <Shuffle className="size-4" />
          </Button>
          <Button size="icon" variant={randomSeed ? "outline" : "secondary"} aria-label="Lock seed" onClick={() => setRandomSeed(!randomSeed)}>
            <Lock className="size-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Random seed</span>
          <Switch checked={randomSeed} onCheckedChange={setRandomSeed} aria-label="Random seed" />
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="negative">
          <AccordionTrigger className="text-sm">Negative prompt</AccordionTrigger>
          <AccordionContent>
            <Textarea value={negative} onChange={(e) => setNegative(e.target.value)} className="min-h-20 text-xs" aria-label="Negative prompt" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="guidance">
          <AccordionTrigger className="text-sm"><Gauge className="mr-2 size-4" />Guidance</AccordionTrigger>
          <AccordionContent className="space-y-4">
            {([
              ["CFG Scale", "How strictly the model follows your prompt", 0, 20, 0.5],
              ["Prompt Strength", "Weight of the text prompt vs references", 0, 100, 5],
              ["Image Strength", "How much of the reference image is preserved", 0, 100, 5],
              ["Creativity", "Freedom to deviate from the prompt", 0, 100, 5],
              ["Detail", "Fine detail synthesis", 0, 100, 5],
              ["Sharpness", "Edge contrast in the final render", 0, 100, 5],
            ] as const).map(([label, hint, min, max, step]) => (
              <Guidance
                key={label}
                label={label}
                hint={hint}
                min={min}
                max={max}
                step={step}
                value={guidance[label] ?? 50}
                onChange={(v) => setGuidance({ ...guidance, [label]: v })}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="advanced">
          <AccordionTrigger className="text-sm">Advanced settings</AccordionTrigger>
          <AccordionContent className="space-y-4 text-xs">
            <div className="space-y-2">
              <p className="font-medium">Sampling</p>
              <Select defaultValue="dpmpp"><SelectTrigger className="h-8" aria-label="Sampler"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dpmpp">DPM++ 2M Karras</SelectItem>
                  <SelectItem value="euler">Euler a</SelectItem>
                  <SelectItem value="ddim">DDIM</SelectItem>
                </SelectContent>
              </Select>
              <Guidance label="Steps" hint="Denoising steps" value={guidance["Steps"] ?? 34} min={10} max={80} step={1} onChange={(v) => setGuidance({ ...guidance, Steps: v })} />
              <Select defaultValue="karras"><SelectTrigger className="h-8" aria-label="Scheduler"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="karras">Karras</SelectItem>
                  <SelectItem value="exponential">Exponential</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Face</p>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Face restoration</span><Switch defaultChecked aria-label="Face restoration" /></div>
              <Guidance label="Face similarity" hint="Match reference identity" value={guidance["Face similarity"] ?? 70} min={0} max={100} step={5} onChange={(v) => setGuidance({ ...guidance, "Face similarity": v })} />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Color</p>
              {(["Color balance", "Saturation", "Contrast"] as const).map((k) => (
                <Guidance key={k} label={k} hint={`Adjust ${k.toLowerCase()}`} value={guidance[k] ?? 50} min={0} max={100} step={5} onChange={(v) => setGuidance({ ...guidance, [k]: v })} />
              ))}
            </div>
            <div className="space-y-2">
              <p className="font-medium">Output format</p>
              <div className="grid grid-cols-3 gap-2">
                {["PNG", "JPG", "WebP"].map((f) => (
                  <button key={f} onClick={() => toast.success(`Output set to ${f}`)} className="rounded-lg border border-border/60 py-1.5 text-[11px] hover:border-primary/40">{f}</button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="camera">
          <AccordionTrigger className="text-sm"><Camera className="mr-2 size-4" />Camera & lighting</AccordionTrigger>
          <AccordionContent className="space-y-2.5 text-xs">
            {[
              ["Camera angle", ["Eye level", "Low angle", "High angle", "Dutch tilt", "Top down"]],
              ["Lens", ["24mm", "35mm", "50mm", "85mm", "135mm"]],
              ["Aperture", ["f/1.4", "f/2.8", "f/4", "f/8", "f/16"]],
              ["Shutter speed", ["1/8000", "1/500", "1/60", "1/8"]],
              ["Depth of field", ["Shallow", "Medium", "Deep"]],
              ["Lighting", ["Studio", "Golden Hour", "Neon", "Dramatic", "Soft", "Rim Light", "Volumetric"]],
            ].map(([label, opts]) => (
              <div key={label as string} className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">{label as string}</Label>
                <Select defaultValue={(opts as string[])[0]!}>
                  <SelectTrigger className="h-8" aria-label={label as string}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(opts as string[]).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="style">
          <AccordionTrigger className="text-sm"><Palette className="mr-2 size-4" />Style</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.name)}
                  className={cn(
                    "group overflow-hidden rounded-xl border text-left transition-all",
                    style === s.name ? "border-primary ring-2 ring-primary/40" : "border-border/60 hover:border-primary/40",
                  )}
                >
                  <img src={s.thumb} alt="" className="h-16 w-full object-cover transition-transform group-hover:scale-105" />
                  <span className="block truncate px-1.5 py-1 text-[10px]">{s.name}</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function useStudio() {
  const [model, setModel] = useState("PixelForge Pro");
  const [aspect, setAspect] = useState("16:9");
  const [resolution, setResolution] = useState("1536 × 1024");
  const [quality, setQuality] = useState("High");
  const [count, setCount] = useState(4);
  const [seed, setSeed] = useState(482913);
  const [randomSeed, setRandomSeed] = useState(true);
  const [negative, setNegative] = useState("blurry, low quality, distorted hands, extra fingers, artifacts");
  const [guidance, setGuidance] = useState<Record<string, number>>({ "CFG Scale": 7, Steps: 34 });
  const [style, setStyle] = useState("Cinematic");
  const [refs, setRefs] = useState(
    generations.slice(0, 2).map((g, i) => ({ id: g.id, image: g.image, type: i === 0 ? "Style" : "Composition", weight: 60 })),
  );
  const credits = count * (QUALITIES.find((q) => q.name === quality)?.credits ?? 6);
  return {
    model, setModel, aspect, setAspect, resolution, setResolution, quality, setQuality,
    count, setCount, seed, setSeed, randomSeed, setRandomSeed, negative, setNegative,
    guidance, setGuidance, style, setStyle, refs, setRefs, credits,
  };
}

function GeneratePage() {
  const studio = useStudio();
  const [mode, setMode] = useState(MODES[0]!);
  const [prompt, setPrompt] = useState(
    "Futuristic cyberpunk city at night, rain-slick streets, neon reflections, cinematic lighting, ultra detailed",
  );
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: "q1", prompt: "Editorial portrait in emerald silk", status: "processing", progress: 62, model: "Realistic Vision", credits: 12 },
    { id: "q2", prompt: "Isometric cozy bookstore, clay render", status: "queued", progress: 0, model: "PixelForge Fast", credits: 4 },
    { id: "q3", prompt: "Neon arcade pixel art", status: "failed", progress: 100, model: "SDXL 1.5", credits: 3 },
  ]);
  const [results, setResults] = useState<Generation[]>(generations.slice(4, 12));
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<Generation | null>(null);
  const [history] = useState(randomPrompts.slice(0, 6));
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setQueue((q) =>
        q.map((item) =>
          item.status === "processing"
            ? { ...item, progress: item.progress >= 100 ? 100 : item.progress + 4, status: item.progress >= 96 ? "completed" : "processing" }
            : item,
        ),
      );
    }, 900);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const generate = () => {
    setLoading(true);
    const id = `q${Date.now()}`;
    setQueue((q) => [
      { id, prompt: prompt.slice(0, 60), status: "processing", progress: 5, model: studio.model, credits: studio.credits },
      ...q,
    ]);
    toast.success(`Generation queued — ${studio.count} images`);
    setTimeout(() => {
      const start = Math.floor(Math.random() * 20);
      setResults(generations.slice(start, start + studio.count));
      setLoading(false);
      toast.success("Image generated successfully");
    }, 2200);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">Create Image</h1>
            <p className="text-sm text-muted-foreground">Studio-grade control over every pixel.</p>
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary"><ListOrdered className="mr-2 size-4" />Queue<Badge className="ml-2" variant="outline">{queue.length}</Badge></Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader><SheetTitle>Generation queue</SheetTitle></SheetHeader>
                <ScrollArea className="h-[calc(100vh-6rem)] px-4 pb-6">
                  <div className="space-y-3">
                    {queue.map((item) => (
                      <div key={item.id} className="rounded-xl border border-border/60 p-3">
                        <div className="flex items-start gap-3">
                          <img src={generations[0]!.image} alt="" className="size-12 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{item.prompt}</p>
                            <p className="text-[11px] text-muted-foreground">{item.model} · {item.credits} credits</p>
                          </div>
                          <Badge
                            variant={item.status === "failed" ? "destructive" : "secondary"}
                            className={cn("capitalize", item.status === "completed" && "bg-[color:var(--success)]/20 text-[color:var(--success)]")}
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <Progress value={item.progress} className="mt-2.5 h-1.5" />
                        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{item.status === "processing" ? `ETA ${Math.max(1, Math.round((100 - item.progress) / 12))}s` : "—"}</span>
                          <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setQueue((q) => q.filter((x) => x.id !== item.id))}>
                            {item.status === "failed" ? "Retry" : "Cancel"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="xl:hidden"><Layers className="mr-2 size-4" />Settings</Button>
              </SheetTrigger>
              <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader><SheetTitle>Generation settings</SheetTitle></SheetHeader>
                <div className="p-4"><SettingsPanel {...studio} /></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <GlassCard className="space-y-4" glow>
              <Tabs value={mode} onValueChange={setMode}>
                <ScrollArea className="w-full">
                  <TabsList className="w-max bg-background/50">
                    {MODES.map((m) => <TabsTrigger key={m} value={m} className="text-xs">{m}</TabsTrigger>)}
                  </TabsList>
                </ScrollArea>
              </Tabs>

              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  aria-label="Prompt"
                  placeholder="Describe the image you want to create…"
                  className="min-h-36 resize-y rounded-2xl bg-background/50 p-4 text-sm leading-relaxed"
                />
                <span className="absolute bottom-3 right-4 text-[11px] text-muted-foreground">
                  {prompt.length} chars · ~{Math.ceil(prompt.length / 4)} tokens
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="secondary" onClick={() => { setPrompt((p) => `${p}, hyper-detailed, volumetric lighting, 8k`); toast.success("Prompt enhanced"); }}>
                  <Wand2 className="mr-2 size-4" />Enhance Prompt
                </Button>
                <Button variant="outline" onClick={() => setPrompt(randomPrompts[Math.floor(Math.random() * randomPrompts.length)]!)}>
                  <Shuffle className="mr-2 size-4" />Random Prompt
                </Button>
                <Button variant="ghost" onClick={() => setPrompt("")}><Eraser className="mr-2 size-4" />Clear</Button>
                <Button variant="ghost" onClick={() => toast("Drop or paste an image to use as reference")}>
                  <ImagePlus className="mr-2 size-4" />Add reference
                </Button>
                <Button className="ml-auto gradient-brand px-6 text-white" onClick={generate}>
                  <Sparkles className="mr-2 size-4" />Generate · {studio.credits} cr
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-muted-foreground">Prompt history:</span>
                {history.map((h) => (
                  <button key={h} onClick={() => setPrompt(h)} className="max-w-[220px] truncate rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground">
                    {h}
                  </button>
                ))}
              </div>
            </GlassCard>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Results</h2>
                <Button variant="ghost" size="sm" onClick={() => { setResults([]); toast("Results cleared"); }}>
                  <Trash2 className="mr-2 size-4" />Clear
                </Button>
              </div>
              {loading ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {Array.from({ length: studio.count }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-2xl shimmer" />
                  ))}
                </div>
              ) : results.length ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {results.map((g) => <ImageCard key={g.id} gen={g} onOpen={setActive} />)}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center">
                  <p className="text-sm font-medium">No results yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Write a prompt and hit generate to fill this space.</p>
                </div>
              )}
            </section>
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl">
              <SettingsPanel {...studio} />
            </div>
          </aside>
        </div>
      </div>
      <ImageDetailModal gen={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
