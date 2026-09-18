import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Boxes, Download, Pause, Play, RefreshCw, Table as TableIcon, XCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState, GlassCard, PageHeader, StatCard } from "@/components/ui-kit";
import { ImageCard, ImageDetailModal } from "@/components/image-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { batchJobs, generations, type BatchJob, type Generation } from "@/lib/mock-data";

export const Route = createFileRoute("/batch_/$jobId")({
  loader: ({ params }) => {
    const job = batchJobs.find((b) => b.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Batch job not found — PixelForge AI" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.job.name} — PixelForge AI`;
    return {
      meta: [
        { title },
        { name: "description", content: `Progress, logs and results for the batch job ${loaderData.job.name}.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `Live progress and results for ${loaderData.job.name}.` },
      ],
    };
  },
  notFoundComponent: JobNotFound,
  component: BatchJobPage,
});

function JobNotFound() {
  return (
    <AppShell>
      <EmptyState
        title="Batch job not found"
        description="This run may have been cleared from the queue."
        icon={<Boxes className="size-8" />}
        action={<Button asChild className="gradient-brand text-white"><Link to="/batch">Back to Batch Studio</Link></Button>}
      />
    </AppShell>
  );
}

function statusColor(s: string) {
  return s === "completed"
    ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
    : s === "processing"
      ? "bg-primary/15 text-primary"
      : s === "failed"
        ? "bg-destructive/15 text-destructive"
        : "bg-muted text-muted-foreground";
}

function BatchJobPage() {
  const { job: initial } = Route.useLoaderData();
  const [job, setJob] = useState<BatchJob>(initial);
  const [active, setActive] = useState<Generation | null>(null);

  const results = generations.slice(0, 15);
  const logs = [
    ["12:04:02", "info", `Job ${initial.id} accepted — ${initial.total} prompts queued`],
    ["12:04:05", "info", `Model ${initial.model} warmed up on 8 workers`],
    ["12:06:41", "info", "Batch 1/16 rendered (32 images)"],
    ["12:09:12", "warn", "Rate limit backoff — retrying in 4s"],
    ["12:11:30", "info", "Batch 6/16 rendered (192 images)"],
    ["12:14:58", "error", `${initial.failed} items failed content moderation`],
    ["12:18:22", "info", `${initial.completed} of ${initial.total} images completed`],
  ] as const;

  const setStatus = (status: BatchJob["status"], msg: string) => {
    setJob((j) => ({ ...j, status }));
    toast.success(msg);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link to="/batch"><ArrowLeft className="mr-2 size-4" />Batch Studio</Link>
        </Button>

        <PageHeader
          title={job.name}
          subtitle={`${job.model} · started ${job.started} · ${job.credits.toLocaleString()} credits reserved`}
          actions={
            <>
              <Badge className={cn("capitalize", statusColor(job.status))}>{job.status}</Badge>
              {job.status === "processing" ? (
                <Button variant="outline" onClick={() => setStatus("paused", "Batch paused")}><Pause className="mr-2 size-4" />Pause</Button>
              ) : (
                <Button variant="outline" onClick={() => setStatus("processing", "Batch resumed")}><Play className="mr-2 size-4" />Resume</Button>
              )}
              <Button variant="outline" onClick={() => toast.success("Retrying failed items")}><RefreshCw className="mr-2 size-4" />Retry failed</Button>
              <Button className="gradient-brand text-white" onClick={() => toast.success("Preparing ZIP download")}><Download className="mr-2 size-4" />Download all</Button>
            </>
          }
        />

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Completed" value={job.completed.toLocaleString()} change={6.2} />
          <StatCard label="Total images" value={job.total.toLocaleString()} />
          <StatCard label="Failed" value={job.failed.toLocaleString()} change={-1.4} />
          <StatCard label="ETA" value={job.eta} />
        </section>

        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">{Math.round((job.completed / job.total) * 100)}%</span>
          </div>
          <Progress value={(job.completed / job.total) * 100} className="h-2" />
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>{job.completed} / {job.total} rendered</span>
            <span className="text-destructive">{job.failed} failed</span>
            <span>Queue priority: high</span>
            <Button size="sm" variant="ghost" className="ml-auto text-destructive" onClick={() => setStatus("failed", "Batch cancelled")}>
              <XCircle className="mr-1.5 size-3.5" />Cancel job
            </Button>
          </div>
        </GlassCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard className="space-y-3">
            <h2 className="font-display text-lg font-semibold">Run logs</h2>
            <Separator />
            <ScrollArea className="h-64 pr-3">
              <ul className="space-y-2 font-mono text-xs">
                {logs.map(([time, level, msg]) => (
                  <li key={msg} className="flex gap-2">
                    <span className="text-muted-foreground">{time}</span>
                    <span
                      className={cn(
                        "uppercase",
                        level === "error" ? "text-destructive" : level === "warn" ? "text-[color:var(--warning,#f59e0b)]" : "text-primary",
                      )}
                    >
                      {level}
                    </span>
                    <span className="flex-1">{msg}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <Button variant="outline" size="sm" onClick={() => toast("Logs exported")}><TableIcon className="mr-2 size-4" />Export logs</Button>
          </GlassCard>

          <GlassCard className="space-y-3">
            <h2 className="font-display text-lg font-semibold">Configuration</h2>
            <Separator />
            <Table>
              <TableHeader>
                <TableRow><TableHead>Setting</TableHead><TableHead>Value</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Model", job.model],
                  ["Resolution", "1536 × 1024"],
                  ["Outputs per prompt", "4"],
                  ["Quality", "High"],
                  ["Seed", "Random"],
                  ["Negative prompt", "blurry, watermark, text artifacts"],
                ].map(([k, v]) => (
                  <TableRow key={k}>
                    <TableCell className="text-xs text-muted-foreground">{k}</TableCell>
                    <TableCell className="text-xs">{v}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Results</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {results.map((g) => (
              <ImageCard key={g.id} gen={g} onOpen={setActive} />
            ))}
          </div>
        </section>
      </div>
      <ImageDetailModal gen={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
