import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bell, Boxes, CreditCard, Download, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — PixelForge AI" },
      { name: "description", content: "Batch completions, generation updates, credit alerts and billing events in one feed." },
      { property: "og:title", content: "Notifications — PixelForge AI" },
      { property: "og:description", content: "Everything happening in your workspace." },
    ],
  }),
  component: NotificationsPage,
});

const ICONS = { batch: Boxes, generation: Sparkles, credits: Zap, model: Bell, export: Download, billing: CreditCard };

function NotificationsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Notifications"
          subtitle={`${notifications.filter((n) => n.unread).length} unread`}
          actions={<Button variant="outline" onClick={() => toast.success("All marked as read")}>Mark all read</Button>}
        />
        <GlassCard className="space-y-1 p-2">
          {notifications.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <div key={n.id} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent/50">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl gradient-brand text-white"><Icon className="size-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {n.unread ? <Badge className="h-4 gradient-brand px-1.5 text-[9px] text-white">New</Badge> : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
              </div>
            );
          })}
        </GlassCard>
      </div>
    </AppShell>
  );
}
