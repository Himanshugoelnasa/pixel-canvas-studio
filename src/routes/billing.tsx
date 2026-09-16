import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, CreditCard, Download } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { invoices, user } from "@/lib/mock-data";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Billing & Plans — PixelForge AI" },
      { name: "description", content: "Manage your PixelForge plan, credits, payment method and invoices." },
      { property: "og:title", content: "Billing & Plans — PixelForge AI" },
      { property: "og:description", content: "Plans from free to enterprise, billed by credits." },
    ],
  }),
  component: BillingPage,
});

const PLANS = [
  { name: "Free", price: "$0", credits: "1,000 credits", features: ["Standard models", "Watermark-free", "5 GB storage"] },
  { name: "Pro", price: "$99", credits: "10,000 credits", features: ["All models", "Batch up to 500", "100 GB storage", "Priority queue"], current: true },
  { name: "Business", price: "$399", credits: "50,000 credits", features: ["Team seats", "Batch up to 5,000", "1 TB storage", "API access"] },
  { name: "Enterprise", price: "Custom", credits: "Custom credits", features: ["Dedicated capacity", "SSO & SCIM", "SLA & support", "Private models"] },
];

function BillingPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Billing"
          subtitle="Plan, credits and payment history."
          actions={<Button variant="outline" onClick={() => toast("Opening billing portal")}><CreditCard className="mr-2 size-4" />Manage billing</Button>}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <GlassCard className="space-y-3 lg:col-span-2" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Current plan</p>
                <h2 className="font-display text-2xl font-semibold text-gradient">{user.plan}</h2>
              </div>
              <Badge className="gradient-brand text-white">Renews 14 Oct 2026</Badge>
            </div>
            <div className="flex items-end justify-between text-sm">
              <span className="text-muted-foreground">Credits remaining</span>
              <span className="font-medium">{user.credits.toLocaleString()} / {user.creditsTotal.toLocaleString()}</span>
            </div>
            <Progress value={84} className="h-2" />
            <p className="text-xs text-muted-foreground">Payment method: Visa •••• 4242 · Expires 08/29</p>
          </GlassCard>
          <GlassCard className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Need more?</p>
            <p className="text-sm">Top up 10,000 credits instantly without changing your plan.</p>
            <Button className="w-full gradient-brand text-white" onClick={() => toast.success("Credits added")}>Buy credits</Button>
          </GlassCard>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => (
            <GlassCard key={p.name} className={cn("space-y-3", p.current && "border-primary/60 glow-brand")}>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">{p.name}</h3>
                {p.current ? <Badge className="gradient-brand text-white">Current</Badge> : null}
              </div>
              <p className="font-display text-3xl font-semibold">{p.price}<span className="text-xs text-muted-foreground">/mo</span></p>
              <p className="text-xs text-muted-foreground">{p.credits}</p>
              <ul className="space-y-1.5 text-xs">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="size-3.5 text-[color:var(--success)]" />{f}</li>
                ))}
              </ul>
              <Button
                variant={p.current ? "secondary" : "default"}
                className={cn("w-full", !p.current && "gradient-brand text-white")}
                disabled={p.current}
                onClick={() => toast.success(`Upgrading to ${p.name}`)}
              >
                {p.current ? "Your plan" : p.name === "Enterprise" ? "Contact sales" : "Upgrade"}
              </Button>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-0">
          <div className="border-b border-border/60 p-4"><h2 className="font-display text-sm font-semibold">Billing history</h2></div>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Plan</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead /></TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell className="text-xs">{i.date}</TableCell>
                  <TableCell className="text-xs">{i.plan}</TableCell>
                  <TableCell className="text-xs">{i.amount}</TableCell>
                  <TableCell><Badge variant={i.status === "Paid" ? "secondary" : "outline"}>{i.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.success("Invoice downloaded")}><Download className="size-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>
      </div>
    </AppShell>
  );
}
