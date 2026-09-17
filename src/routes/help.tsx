import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Keyboard, LifeBuoy, MessageSquare, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — PixelForge AI" },
      { name: "description", content: "Guides, FAQs and support for generating, batching and managing AI images." },
      { property: "og:title", content: "Help Center — PixelForge AI" },
      { property: "og:description", content: "Answers to everything PixelForge." },
    ],
  }),
  component: HelpPage,
});

const FAQ = [
  ["How are credits calculated?", "Credits depend on model, resolution and quality. A High-quality 1024px render on PixelForge Pro costs 6 credits; Ultra 4K costs 24."],
  ["What is the largest batch I can run?", "Pro supports 500 items per batch, Business 5,000, and Enterprise is uncapped with dedicated capacity."],
  ["Can I use generated images commercially?", "Yes. All plans include a commercial licence for images you generate, including client work."],
  ["How do variables work in Batch Studio?", "Any {{variable}} in your prompt maps to a CSV column or a static value in step 3 of the wizard."],
  ["Why did a generation fail?", "Usually an unavailable model, a policy-blocked prompt, or insufficient credits. Failed items never consume credits."],
];

const LINKS = [
  { to: "/docs", icon: BookOpen, title: "Documentation", body: "API reference and integration guides." },
  { to: "/shortcuts", icon: Keyboard, title: "Keyboard shortcuts", body: "Work at studio speed." },
  { to: "/feedback", icon: MessageSquare, title: "Send feedback", body: "Tell us what to build next." },
  { to: "/changelog", icon: Sparkles, title: "Changelog", body: "What shipped recently." },
] as const;

function HelpPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Help Center" subtitle="Find an answer in seconds." />
        <GlassCard className="relative" glow>
          <Search className="absolute left-8 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-12 pl-11" placeholder="Search help articles…" aria-label="Search help" />
        </GlassCard>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {LINKS.map(({ to, icon: Icon, title, body }) => (
            <Link key={to} to={to}>
              <GlassCard className="h-full space-y-2 transition-all hover:-translate-y-1 hover:border-primary/40">
                <span className="grid size-10 place-items-center rounded-xl gradient-brand text-white"><Icon className="size-4" /></span>
                <h3 className="font-display text-sm font-semibold">{title}</h3>
                <p className="text-xs text-muted-foreground">{body}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
        <GlassCard>
          <h2 className="mb-2 font-display text-sm font-semibold"><LifeBuoy className="mr-2 inline size-4 text-primary" />Frequently asked</h2>
          <Accordion type="single" collapsible>
            {FAQ.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-sm">{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </GlassCard>
      </div>
    </AppShell>
  );
}
