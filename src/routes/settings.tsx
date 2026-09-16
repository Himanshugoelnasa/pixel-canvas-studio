import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { models, user } from "@/lib/mock-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PixelForge AI" },
      { name: "description", content: "Profile, default generation settings, notifications, appearance, security and API preferences." },
      { property: "og:title", content: "Settings — PixelForge AI" },
      { property: "og:description", content: "Tune PixelForge to the way you work." },
    ],
  }),
  component: SettingsPage,
});

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="w-56">{children}</div>
    </div>
  );
}

function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader title="Settings" subtitle="Workspace and account preferences." actions={<Button className="gradient-brand text-white" onClick={() => toast.success("Settings saved")}>Save changes</Button>} />
        <Tabs defaultValue="general">
          <TabsList className="flex-wrap">
            {["general", "generation", "notifications", "appearance", "security", "api"].map((t) => (
              <TabsTrigger key={t} value={t} className="text-xs capitalize">{t}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="general">
            <GlassCard className="space-y-2">
              <div className="flex items-center gap-4 pb-2">
                <Avatar className="size-16"><AvatarImage src={user.avatar} alt="" /><AvatarFallback>HG</AvatarFallback></Avatar>
                <Button variant="outline" size="sm" onClick={() => toast.success("Avatar updated")}>Change avatar</Button>
              </div>
              <Separator />
              <Row label="Full name"><Input defaultValue={user.name} aria-label="Full name" /></Row>
              <Row label="Email"><Input defaultValue={user.email} aria-label="Email" /></Row>
              <Row label="Language">
                <Select defaultValue="en"><SelectTrigger aria-label="Language"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="hi">हिन्दी</SelectItem><SelectItem value="de">Deutsch</SelectItem></SelectContent>
                </Select>
              </Row>
              <Row label="Timezone">
                <Select defaultValue="ist"><SelectTrigger aria-label="Timezone"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="ist">Asia/Kolkata (UTC+5:30)</SelectItem><SelectItem value="utc">UTC</SelectItem></SelectContent>
                </Select>
              </Row>
            </GlassCard>
          </TabsContent>

          <TabsContent value="generation">
            <GlassCard className="space-y-2">
              <Row label="Default model">
                <Select defaultValue={models[0].name}><SelectTrigger aria-label="Default model"><SelectValue /></SelectTrigger>
                  <SelectContent>{models.map((m) => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                </Select>
              </Row>
              <Row label="Default resolution">
                <Select defaultValue="1024"><SelectTrigger aria-label="Default resolution"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="1024">1024 × 1024</SelectItem><SelectItem value="1536">1536 × 1024</SelectItem><SelectItem value="4k">4K</SelectItem></SelectContent>
                </Select>
              </Row>
              <Row label="Default aspect ratio">
                <Select defaultValue="16:9"><SelectTrigger aria-label="Default aspect ratio"><SelectValue /></SelectTrigger>
                  <SelectContent>{["1:1", "16:9", "9:16", "4:3"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </Row>
              <Row label="Default quality">
                <Select defaultValue="high"><SelectTrigger aria-label="Default quality"><SelectValue /></SelectTrigger>
                  <SelectContent>{["draft", "standard", "high", "ultra"].map((q) => <SelectItem key={q} value={q} className="capitalize">{q}</SelectItem>)}</SelectContent>
                </Select>
              </Row>
            </GlassCard>
          </TabsContent>

          <TabsContent value="notifications">
            <GlassCard className="space-y-1">
              {["Generation completed", "Batch completed", "Failed jobs", "Billing updates", "Product updates"].map((n, i) => (
                <Row key={n} label={n}><div className="flex justify-end"><Switch defaultChecked={i < 3} aria-label={n} /></div></Row>
              ))}
            </GlassCard>
          </TabsContent>

          <TabsContent value="appearance">
            <GlassCard className="space-y-1">
              <Row label="Theme">
                <Select defaultValue="dark"><SelectTrigger aria-label="Theme"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="dark">Dark</SelectItem><SelectItem value="light">Light</SelectItem><SelectItem value="system">System</SelectItem></SelectContent>
                </Select>
              </Row>
              <Row label="UI density">
                <Select defaultValue="comfortable"><SelectTrigger aria-label="UI density"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="compact">Compact</SelectItem><SelectItem value="comfortable">Comfortable</SelectItem></SelectContent>
                </Select>
              </Row>
              <Row label="Animations"><div className="flex justify-end"><Switch defaultChecked aria-label="Animations" /></div></Row>
              <Row label="Gradient intensity"><Slider defaultValue={[70]} max={100} aria-label="Gradient intensity" /></Row>
            </GlassCard>
          </TabsContent>

          <TabsContent value="security">
            <GlassCard className="space-y-1">
              <Row label="Current password"><Input type="password" defaultValue="password" aria-label="Current password" /></Row>
              <Row label="New password"><Input type="password" placeholder="••••••••" aria-label="New password" /></Row>
              <Row label="Two-factor authentication"><div className="flex justify-end"><Switch defaultChecked aria-label="Two-factor authentication" /></div></Row>
              <Separator />
              <div className="pt-3">
                <Label className="text-xs text-muted-foreground">Active sessions</Label>
                <div className="mt-2 space-y-2 text-xs">
                  {[["MacBook Pro · Mumbai", "Current session"], ["iPhone 17 · Mumbai", "2 hours ago"], ["Chrome · Berlin", "3 days ago"]].map(([d, t]) => (
                    <div key={d} className="flex items-center justify-between rounded-lg border border-border/60 p-2.5">
                      <span>{d}</span><span className="text-muted-foreground">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="api">
            <GlassCard className="space-y-3">
              <p className="text-sm text-muted-foreground">Manage keys, quotas and webhooks from the API keys page.</p>
              <Button variant="secondary" onClick={() => toast("Opening API keys")}>Go to API keys</Button>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
