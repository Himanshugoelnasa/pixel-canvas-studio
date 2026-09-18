import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Download, FolderKanban, Share2, Sparkles, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState, GlassCard, PageHeader, StatCard } from "@/components/ui-kit";
import { ImageCard, ImageDetailModal } from "@/components/image-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generations, projects, type Generation } from "@/lib/mock-data";

export const Route = createFileRoute("/projects/$projectId")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.id === params.projectId);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project not found — PixelForge AI" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.project.name} — PixelForge AI`;
    return {
      meta: [
        { title },
        { name: "description", content: `Browse every asset, batch and collaborator inside the ${loaderData.project.name} project.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `Assets and activity for ${loaderData.project.name}.` },
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectDetailPage,
});

function ProjectNotFound() {
  return (
    <AppShell>
      <EmptyState
        title="Project not found"
        description="This project may have been deleted or renamed."
        icon={<FolderKanban className="size-8" />}
        action={<Button asChild className="gradient-brand text-white"><Link to="/projects">Back to projects</Link></Button>}
      />
    </AppShell>
  );
}

function ProjectDetailPage() {
  const { project } = Route.useLoaderData();
  const [active, setActive] = useState<Generation | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const assets = generations.filter((g) => g.project === project.name);
  const list = assets.length ? assets : generations.slice(0, 10);
  const credits = list.reduce((n, g) => n + g.credits, 0);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <AppShell>
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link to="/projects"><ArrowLeft className="mr-2 size-4" />All projects</Link>
        </Button>

        <section className="relative overflow-hidden rounded-3xl border border-border/60">
          <img src={project.cover} alt="" className="h-48 w-full object-cover sm:h-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-8">
            <div className="space-y-2">
              <Badge variant="secondary" className="rounded-full">Project</Badge>
              <h1 className="font-display text-3xl font-semibold sm:text-4xl">{project.name}</h1>
              <p className="text-sm text-muted-foreground">
                Owner {project.owner} · updated {project.updated} · {project.storage}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => toast.success("Share link copied")}><Share2 className="mr-2 size-4" />Share</Button>
              <Button variant="outline" onClick={() => toast.success("Preparing ZIP download")}><Download className="mr-2 size-4" />Export</Button>
              <Button asChild className="gradient-brand text-white">
                <Link to="/generate"><Sparkles className="mr-2 size-4" />Generate into project</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Assets" value={project.assets.toLocaleString()} change={8.4} />
          <StatCard label="Storage" value={project.storage} change={3.1} />
          <StatCard label="Credits used" value={credits.toLocaleString()} change={-2.6} />
          <StatCard label="Collaborators" value="4" change={0} />
        </section>

        <GlassCard className="space-y-4">
          <PageHeader title="Recent activity" subtitle="Everything that happened inside this project." />
          <Separator />
          <ul className="space-y-3 text-sm">
            {[
              ["Aria Chen", "generated 24 new product shots", "2 hours ago"],
              ["Marcus Webb", "upscaled 6 hero images to 4K", "Yesterday"],
              ["Himanshu Goel", "started a batch of 128 variations", "2 days ago"],
              ["Sofia Almeida", "shared the project with the client", "Last week"],
            ].map(([who, what, when]) => (
              <li key={what} className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <span className="font-medium text-foreground">{who}</span>
                <span>{what}</span>
                <span className="ml-auto text-xs">{when}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Project assets</h2>
            {selected.length ? (
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant="secondary" onClick={() => toast.success(`${selected.length} images downloaded`)}>Download</Button>
                <Button size="sm" variant="secondary" onClick={() => toast.success("Moved to another project")}>Move</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { toast.success("Selection deleted"); setSelected([]); }}>
                  <Trash2 className="mr-1.5 size-3.5" />Delete
                </Button>
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {list.map((g) => (
              <ImageCard key={g.id} gen={g} onOpen={setActive} selectable selected={selected.includes(g.id)} onSelect={toggle} />
            ))}
          </div>
        </section>
      </div>
      <ImageDetailModal gen={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
