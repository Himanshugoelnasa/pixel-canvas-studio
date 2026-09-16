import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Copy, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generations } from "@/lib/mock-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Generation History — PixelForge AI" },
      { name: "description", content: "Every prompt, model and setting your workspace has run, ready to re-run." },
      { property: "og:title", content: "Generation History — PixelForge AI" },
      { property: "og:description", content: "Re-run any past generation in one click." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="History" subtitle="Everything generated in this workspace." />
        <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Prompt</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>Seed</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generations.slice(0, 24).map((g) => (
                <TableRow key={g.id}>
                  <TableCell><img src={g.image} alt="" className="size-10 rounded-md object-cover" /></TableCell>
                  <TableCell className="max-w-[320px] truncate text-sm">{g.prompt}</TableCell>
                  <TableCell><Badge variant="outline">{g.model}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{g.resolution}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{g.seed}</TableCell>
                  <TableCell className="text-xs">{g.credits}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(g.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.success("Prompt copied")}><Copy className="size-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => toast.success("Re-running generation")}><RotateCcw className="size-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
