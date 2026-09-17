import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security — PixelForge AI" },
      { name: "description", content: "Password, two-factor authentication, active sessions and login history for your workspace." },
      { property: "og:title", content: "Security — PixelForge AI" },
      { property: "og:description", content: "Keep your creative workspace locked down." },
    ],
  }),
  component: SecurityPage,
});

const SESSIONS = [
  ["MacBook Pro · Mumbai", "Chrome 141", "Current session"],
  ["iPhone 17 Pro · Mumbai", "PixelForge iOS", "2 hours ago"],
  ["Windows PC · Berlin", "Edge 140", "3 days ago"],
];

const LOGINS = [
  ["14 Sep 2026, 23:12", "Mumbai, IN", "Success"],
  ["13 Sep 2026, 09:04", "Mumbai, IN", "Success"],
  ["11 Sep 2026, 21:47", "Berlin, DE", "Success"],
  ["09 Sep 2026, 03:18", "Unknown", "Blocked"],
];

function SecurityPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Security" subtitle="Account protection and access log." />
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard className="space-y-4">
            <h2 className="font-display text-sm font-semibold">Password</h2>
            <div className="space-y-1.5"><Label htmlFor="cur">Current password</Label><Input id="cur" type="password" defaultValue="password" /></div>
            <div className="space-y-1.5"><Label htmlFor="new">New password</Label><Input id="new" type="password" placeholder="••••••••" /></div>
            <Button className="gradient-brand text-white" onClick={() => toast.success("Password updated")}>Update password</Button>
          </GlassCard>
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold">Two-factor authentication</h2>
              <Badge className="gradient-brand text-white"><ShieldCheck className="mr-1 size-3" />Enabled</Badge>
            </div>
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Authenticator app</span><Switch defaultChecked aria-label="Authenticator app" /></div>
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">SMS backup</span><Switch aria-label="SMS backup" /></div>
            <Button variant="outline" onClick={() => toast.success("Recovery codes generated")}>Generate recovery codes</Button>
          </GlassCard>
          <GlassCard className="space-y-2">
            <h2 className="font-display text-sm font-semibold">Active sessions</h2>
            {SESSIONS.map(([d, b, t]) => (
              <div key={d} className="flex items-center justify-between rounded-xl border border-border/60 p-3 text-xs">
                <div><p className="text-sm">{d}</p><p className="text-muted-foreground">{b}</p></div>
                <span className="text-muted-foreground">{t}</span>
              </div>
            ))}
            <Button variant="ghost" className="text-destructive" onClick={() => toast.success("Other sessions revoked")}>Revoke other sessions</Button>
          </GlassCard>
          <GlassCard className="space-y-2">
            <h2 className="font-display text-sm font-semibold">Login history</h2>
            {LOGINS.map(([t, loc, s]) => (
              <div key={t} className="flex items-center justify-between rounded-xl border border-border/60 p-3 text-xs">
                <span>{t}</span><span className="text-muted-foreground">{loc}</span>
                <Badge variant={s === "Success" ? "secondary" : "destructive"}>{s}</Badge>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
