import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { KeyRound, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiKeys } from "@/lib/mock-data";

export const Route = createFileRoute("/api-keys")({
  head: () => ({
    meta: [
      { title: "API Keys — PixelForge AI" },
      { name: "description", content: "Create and revoke API keys and integrate PixelForge generation into your own stack." },
      { property: "og:title", content: "API Keys — PixelForge AI" },
      { property: "og:description", content: "Developer access to generation and batch endpoints." },
    ],
  }),
  component: ApiKeysPage,
});

const SNIPPET = `POST /v1/images/generate
{
  "model": "pixelforge-pro",
  "prompt": "Futuristic cyberpunk city at night",
  "aspect_ratio": "16:9",
  "n": 4
}

POST /v1/images/batch
{
  "template_id": "tpl_1",
  "rows_url": "https://cdn.example.com/products.csv"
}

GET /v1/jobs/{id}`;

function ApiKeysPage() {
  const [open, setOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="API Keys"
          subtitle="Programmatic access to the PixelForge engine."
          actions={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button className="gradient-brand text-white"><Plus className="mr-2 size-4" />Create key</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create API key</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1.5"><Label htmlFor="kname">Key name</Label><Input id="kname" placeholder="production-server" /></div>
                  <div className="space-y-1.5"><Label htmlFor="kscope">Scope</Label><Input id="kscope" defaultValue="Full access" /></div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button className="gradient-brand text-white" onClick={() => { setOpen(false); toast.success("API key created"); }}>Create key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />
        <GlassCard className="p-0">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Name</TableHead><TableHead>Key</TableHead><TableHead>Scope</TableHead><TableHead>Created</TableHead><TableHead>Last used</TableHead><TableHead /></TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="text-sm font-medium"><KeyRound className="mr-2 inline size-3.5 text-primary" />{k.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{k.prefix}</TableCell>
                  <TableCell><Badge variant="secondary">{k.scope}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{k.created}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{k.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.success("Key revoked")}>Revoke</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>
        <GlassCard className="space-y-3">
          <h2 className="font-display text-sm font-semibold">Quick start</h2>
          <pre className="overflow-x-auto rounded-xl border border-border/60 bg-background/60 p-4 text-xs leading-relaxed text-muted-foreground">
            <code>{SNIPPET}</code>
          </pre>
        </GlassCard>
      </div>
    </AppShell>
  );
}
