import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, StatCard } from "@/components/ui-kit";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usageSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/usage")({
  head: () => ({
    meta: [
      { title: "Usage Analytics — PixelForge AI" },
      { name: "description", content: "Track images generated, credits consumed, batch throughput, storage and success rate." },
      { property: "og:title", content: "Usage Analytics — PixelForge AI" },
      { property: "og:description", content: "Understand how your workspace spends credits." },
    ],
  }),
  component: UsagePage,
});

const axis = { stroke: "var(--muted-foreground)", fontSize: 11 };

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard className="space-y-3">
      <h2 className="font-display text-sm font-semibold">{title}</h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">{children as never}</ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

function UsagePage() {
  const [range, setRange] = useState("30");
  const data = usageSeries.slice(-Number(range === "custom" ? 30 : range));

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Usage"
          subtitle="Workspace analytics for the current billing period."
          actions={
            <Tabs value={range} onValueChange={setRange}>
              <TabsList>
                {[["7", "7 days"], ["30", "30 days"], ["90", "90 days"], ["custom", "Custom"]].map(([v, l]) => (
                  <TabsTrigger key={v} value={v!} className="text-xs">{l}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          }
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Images generated" value="2,418" change={12.6} />
          <StatCard label="Credits consumed" value="9,612" change={8.4} />
          <StatCard label="Batch images" value="1,884" change={22.1} />
          <StatCard label="Success rate" value="98.7%" change={0.6} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Images generated">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-from)" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="var(--brand-to)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" {...axis} /><YAxis {...axis} />
              <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Area dataKey="images" stroke="var(--brand-from)" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ChartCard>
          <ChartCard title="Credits consumed">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" {...axis} /><YAxis {...axis} />
              <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="credits" fill="var(--brand-to)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartCard>
          <ChartCard title="Batch processing">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" {...axis} /><YAxis {...axis} />
              <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Line dataKey="batch" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartCard>
          <ChartCard title="Storage & success rate">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" {...axis} /><YAxis {...axis} />
              <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Area dataKey="storage" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.15} strokeWidth={2} />
              <Area dataKey="success" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ChartCard>
        </div>
      </div>
    </AppShell>
  );
}
