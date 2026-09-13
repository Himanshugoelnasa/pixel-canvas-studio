import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function GlassCard({
  className,
  children,
  glow,
}: {
  className?: string;
  children: ReactNode;
  glow?: boolean;
}) {
  return (
    <Card
      className={cn(
        "glass rounded-2xl border-border/60 p-5 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] transition-all",
        glow && "glow-brand",
        className,
      )}
    >
      {children}
    </Card>
  );
}

export function StatCard({
  label,
  value,
  change,
  icon,
  accent = "from-violet-500/25 to-cyan-400/20",
}: {
  label: string;
  value: string;
  change?: number;
  icon?: ReactNode;
  accent?: string;
}) {
  const up = (change ?? 0) >= 0;
  return (
    <GlassCard className="group relative overflow-hidden p-5 hover:-translate-y-0.5">
      <div
        className={cn(
          "pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl opacity-70 transition-opacity group-hover:opacity-100",
          accent,
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold sm:text-[1.7rem]">{value}</p>
        </div>
        {icon ? (
          <span className="rounded-xl border border-border/60 bg-background/40 p-2 text-primary">{icon}</span>
        ) : null}
      </div>
      {change !== undefined ? (
        <p
          className={cn(
            "relative mt-3 inline-flex items-center gap-1 text-xs font-medium",
            up ? "text-[color:var(--success)]" : "text-destructive",
          )}
        >
          {up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
          {up ? "+" : ""}
          {change}% vs last month
        </p>
      ) : null}
    </GlassCard>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/30 px-6 py-16 text-center">
      <div className="relative mb-5 flex size-20 items-center justify-center rounded-3xl gradient-brand text-white shadow-lg">
        <div className="absolute inset-0 rounded-3xl gradient-brand blur-xl opacity-60 animate-float-glow" />
        <span className="relative">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl shimmer" />
      ))}
    </div>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}
