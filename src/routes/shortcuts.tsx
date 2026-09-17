import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/shortcuts")({
  head: () => ({
    meta: [
      { title: "Keyboard Shortcuts — PixelForge AI" },
      { name: "description", content: "Every keyboard shortcut in the PixelForge studio, editor and gallery." },
      { property: "og:title", content: "Keyboard Shortcuts — PixelForge AI" },
      { property: "og:description", content: "Work at studio speed." },
    ],
  }),
  component: ShortcutsPage,
});

const GROUPS: Array<[string, Array<[string, string]>]> = [
  ["Global", [["⌘ K", "Open global search"], ["G then D", "Go to dashboard"], ["G then B", "Go to Batch Studio"], ["?", "Show shortcuts"]]],
  ["Studio", [["⌘ ⏎", "Generate"], ["⌘ E", "Enhance prompt"], ["R", "Random prompt"], ["⌘ ⌫", "Clear prompt"], ["Q", "Toggle queue"]]],
  ["Editor", [["B", "Brush"], ["M", "Mask"], ["I", "Inpaint"], ["⌘ Z", "Undo"], ["⇧ ⌘ Z", "Redo"], ["⌘ S", "Save"]]],
  ["Gallery", [["V", "Switch view"], ["F", "Favorite"], ["⌘ A", "Select all"], ["⌘ D", "Download selected"]]],
];

function ShortcutsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Keyboard Shortcuts" subtitle="Hands on the keys, eyes on the canvas." />
        <div className="grid gap-4 sm:grid-cols-2">
          {GROUPS.map(([group, items]) => (
            <GlassCard key={group} className="space-y-2">
              <h2 className="font-display text-sm font-semibold">{group}</h2>
              {items.map(([k, d]) => (
                <div key={k} className="flex items-center justify-between rounded-lg px-1 py-1.5 text-sm">
                  <span className="text-muted-foreground">{d}</span>
                  <kbd className="rounded-md border border-border/60 bg-background/60 px-2 py-0.5 text-[11px]">{k}</kbd>
                </div>
              ))}
            </GlassCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
