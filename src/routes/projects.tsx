import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FolderKanban, MoreHorizontal, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projects } from "@/lib/mock-data";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — PixelForge AI" },
      { name: "description", content: "Organise AI generations into campaigns, shoots and client projects." },
      { property: "og:title", content: "Projects — PixelForge AI" },
      { property: "og:description", content: "Campaign-level organisation for your AI assets." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const [list] = useState(projects);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Projects"
          subtitle={`${list.length} active projects`}
          actions={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-brand text-white"><Plus className="mr-2 size-4" />New project</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create project</DialogTitle>
                  <DialogDescription>Group generations, templates and batch jobs together.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1.5"><Label htmlFor="pname">Project name</Label><Input id="pname" placeholder="Autumn Campaign 2026" /></div>
                  <div className="space-y-1.5"><Label htmlFor="pdesc">Description</Label><Input id="pdesc" placeholder="Optional" /></div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button className="gradient-brand text-white" onClick={() => { setOpen(false); toast.success("Project created"); }}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        {list.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => (
              <article key={p.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40">
                <div className="relative h-36 overflow-hidden">
                  <img src={p.cover} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold">{p.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="size-7" aria-label="Project actions"><MoreHorizontal className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.success("Project renamed")}>Rename</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Project shared")}>Share</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Export queued")}>Export</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => toast.success("Project deleted")}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{p.assets} assets</Badge>
                    <span>{p.storage}</span>
                    <span>·</span>
                    <span>Updated {p.updated}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Owner: {p.owner}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No projects yet" description="Create your first project to organise generations by campaign." icon={<FolderKanban className="size-8" />} action={<Button className="gradient-brand text-white">New project</Button>} />
        )}
      </div>
    </AppShell>
  );
}
