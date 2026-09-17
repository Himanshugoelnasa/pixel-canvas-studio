import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, Sparkles } from "lucide-react";
import { Wordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { generations, styles } from "@/lib/mock-data";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started — PixelForge AI" },
      { name: "description", content: "Tell PixelForge what you create, pick your styles and generate your first image." },
      { property: "og:title", content: "Get started — PixelForge AI" },
      { property: "og:description", content: "Three steps to your first generation." },
    ],
  }),
  component: OnboardingPage,
});

const GOALS = ["Marketing", "E-commerce", "Social Media", "YouTube", "Design", "Photography", "Personal"];

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [goals, setGoals] = useState<string[]>(["E-commerce"]);
  const [picked, setPicked] = useState<string[]>(["Cinematic", "Product Photography"]);
  const [done, setDone] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 size-[30rem] rounded-full bg-violet-600/20 blur-[120px] animate-float-glow" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[28rem] rounded-full bg-cyan-400/15 blur-[120px] animate-float-glow" />
      <div className="relative mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <Wordmark />
          <Button variant="ghost" size="sm" asChild><Link to="/">Skip</Link></Button>
        </div>
        <Progress value={(step / 3) * 100} className="h-1.5" />

        {step === 1 ? (
          <section className="space-y-5">
            <div>
              <Badge variant="secondary">Step 1 of 3</Badge>
              <h1 className="mt-3 font-display text-3xl font-semibold">What will you create?</h1>
              <p className="text-sm text-muted-foreground">We'll tune default models and templates to match.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => toggle(goals, setGoals, g)}
                  className={cn("rounded-2xl border p-4 text-sm font-medium transition-all", goals.includes(g) ? "border-primary/60 bg-primary/15" : "border-border/60 text-muted-foreground hover:border-primary/30")}
                >
                  {g}
                </button>
              ))}
            </div>
            <Button className="gradient-brand text-white" onClick={() => setStep(2)}>Continue</Button>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="space-y-5">
            <div>
              <Badge variant="secondary">Step 2 of 3</Badge>
              <h1 className="mt-3 font-display text-3xl font-semibold">Pick your styles</h1>
              <p className="text-sm text-muted-foreground">Choose as many as you like — you can change these later.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggle(picked, setPicked, s.name)}
                  className={cn("group overflow-hidden rounded-xl border text-left transition-all", picked.includes(s.name) ? "border-primary ring-2 ring-primary/40" : "border-border/60 hover:border-primary/40")}
                >
                  <img src={s.thumb} alt="" className="h-20 w-full object-cover transition-transform group-hover:scale-105" />
                  <span className="block truncate px-2 py-1.5 text-[11px]">{s.name}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button className="gradient-brand text-white" onClick={() => setStep(3)}>Continue</Button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="space-y-5">
            <div>
              <Badge variant="secondary">Step 3 of 3</Badge>
              <h1 className="mt-3 font-display text-3xl font-semibold">Generate your first image</h1>
              <p className="text-sm text-muted-foreground">We pre-filled a prompt tuned to your choices.</p>
            </div>
            <Textarea
              className="min-h-28"
              aria-label="First prompt"
              defaultValue="Premium product photography of a ceramic mug on travertine, soft studio strobes, cinematic color"
            />
            {done ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/40 bg-primary/10 p-8 text-center animate-reveal">
                <span className="grid size-16 place-items-center rounded-full gradient-brand text-white glow-brand"><Check className="size-7" /></span>
                <div>
                  <h2 className="font-display text-xl font-semibold">Your first image is ready</h2>
                  <p className="text-sm text-muted-foreground">Welcome to PixelForge AI.</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {generations.slice(0, 4).map((g) => <img key={g.id} src={g.image} alt="" className="size-20 rounded-xl object-cover animate-reveal" />)}
                </div>
                <Button className="gradient-brand text-white" onClick={() => navigate({ to: "/" })}>Enter the studio</Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button className="gradient-brand text-white" onClick={() => { setDone(true); toast.success("Image generated successfully"); }}>
                  <Sparkles className="mr-2 size-4" />Generate
                </Button>
              </div>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}
