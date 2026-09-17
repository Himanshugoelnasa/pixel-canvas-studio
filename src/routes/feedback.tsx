import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — PixelForge AI" },
      { name: "description", content: "Share bugs, ideas and feature requests with the PixelForge team." },
      { property: "og:title", content: "Feedback — PixelForge AI" },
      { property: "og:description", content: "Help shape the roadmap." },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader title="Feedback" subtitle="We read every message." />
        <GlassCard className="space-y-4" glow>
          <div className="space-y-1.5">
            <Label htmlFor="type">Type</Label>
            <Select defaultValue="idea">
              <SelectTrigger id="type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Feature idea</SelectItem>
                <SelectItem value="bug">Bug report</SelectItem>
                <SelectItem value="model">Model quality</SelectItem>
                <SelectItem value="other">Something else</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="subj">Subject</Label><Input id="subj" placeholder="Batch variable mapping could remember columns" /></div>
          <div className="space-y-1.5"><Label htmlFor="msg">Details</Label><Textarea id="msg" className="min-h-40" placeholder="Tell us what happened or what you'd like to see…" /></div>
          <Button className="gradient-brand text-white" onClick={() => toast.success("Feedback sent — thank you!")}>
            <Send className="mr-2 size-4" />Send feedback
          </Button>
        </GlassCard>
      </div>
    </AppShell>
  );
}
