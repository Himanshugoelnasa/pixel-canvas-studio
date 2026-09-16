import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projects, team } from "@/lib/mock-data";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — PixelForge AI" },
      { name: "description", content: "Invite teammates, assign roles and share projects across your creative workspace." },
      { property: "og:title", content: "Team — PixelForge AI" },
      { property: "og:description", content: "Roles, permissions and shared assets." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Team"
          subtitle="5 members · Business features enabled"
          actions={<Button className="gradient-brand text-white" onClick={() => toast.success("Invitation sent")}><UserPlus className="mr-2 size-4" />Invite member</Button>}
        />
        <GlassCard className="p-0">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Member</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {team.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9"><AvatarImage src={m.avatar} alt="" /><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={m.role}>
                      <SelectTrigger className="w-32" aria-label={`Role for ${m.name}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{["Owner", "Admin", "Editor", "Viewer"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Badge variant={m.status === "Active" ? "secondary" : "outline"}>{m.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.success("Permissions updated")}>Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard className="space-y-3">
            <h2 className="font-display text-sm font-semibold">Shared projects</h2>
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-2.5">
                <img src={p.cover} alt="" className="size-10 rounded-lg object-cover" />
                <div className="flex-1"><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.assets} assets</p></div>
                <Badge variant="outline">Shared</Badge>
              </div>
            ))}
          </GlassCard>
          <GlassCard className="space-y-3">
            <h2 className="font-display text-sm font-semibold">Role permissions</h2>
            {[["Owner", "Full access, billing and deletion"], ["Admin", "Manage members, projects, API keys"], ["Editor", "Generate, edit and export assets"], ["Viewer", "View and download shared assets"]].map(([r, d]) => (
              <div key={r} className="rounded-xl border border-border/60 p-3">
                <p className="text-sm font-medium">{r}</p><p className="text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
