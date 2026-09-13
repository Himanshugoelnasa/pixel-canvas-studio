import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bot,
  Boxes,
  ChevronLeft,
  CreditCard,
  Eraser,
  FolderKanban,
  Images,
  LayoutDashboard,
  LayoutTemplate,
  LifeBuoy,
  Menu,
  Moon,
  Pencil,
  Search,
  Sparkles,
  Star,
  Sun,
  Layers,
  ZoomIn,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Wordmark, Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { notifications, user, projects, templates, models, batchJobs } from "@/lib/mock-data";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/generate", label: "Generate", icon: Sparkles },
  { to: "/batch", label: "Batch Studio", icon: Boxes },
  { to: "/editor", label: "Editor", icon: Pencil },
  { to: "/upscaler", label: "Upscaler", icon: ZoomIn },
  { to: "/background-remover", label: "Background Remover", icon: Eraser },
  { to: "/variations", label: "Variations", icon: Layers },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/favorites", label: "Favorites", icon: Star },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/models", label: "Models", icon: Bot },
] as const;

const MOBILE_NAV = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/generate", label: "Generate", icon: Sparkles },
  { to: "/batch", label: "Batch", icon: Boxes },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/settings", label: "Settings", icon: CreditCard },
] as const;

function useTheme() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);
  return { light, toggle: () => setLight((l) => !l) };
}

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-1" aria-label="Main">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        const link = (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "gradient-brand text-white shadow-[0_12px_30px_-16px_rgba(139,92,246,0.9)]"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <Icon className="size-[18px] shrink-0" />
            {!collapsed ? <span className="truncate">{label}</span> : null}
          </Link>
        );
        return collapsed ? (
          <Tooltip key={to}>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ) : (
          link
        );
      })}
    </nav>
  );
}

function SidebarFooter({ collapsed }: { collapsed?: boolean }) {
  const pct = Math.round((user.credits / user.creditsTotal) * 100);
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 pb-2">
        <Link to="/billing" className="rounded-xl border border-border/60 p-2 text-primary" aria-label="Credits">
          <Zap className="size-4" />
        </Link>
        <Avatar className="size-8"><AvatarImage src={user.avatar} alt="" /><AvatarFallback>HG</AvatarFallback></Avatar>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/60 bg-background/40 p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium"><Zap className="size-3.5 text-primary" />Credits</span>
          <span className="text-muted-foreground">{user.credits.toLocaleString()} left</span>
        </div>
        <Progress value={pct} className="mt-2.5 h-1.5" />
        <Button asChild size="sm" className="mt-3 w-full gradient-brand text-white">
          <Link to="/billing">Upgrade plan</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button asChild variant="ghost" size="sm" className="justify-start text-muted-foreground">
          <Link to="/notifications"><Bell className="mr-2 size-4" />Alerts</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="justify-start text-muted-foreground">
          <Link to="/help"><LifeBuoy className="mr-2 size-4" />Help</Link>
        </Button>
      </div>
      <Separator />
      <Link to="/profile" className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-sidebar-accent">
        <Avatar className="size-9"><AvatarImage src={user.avatar} alt="" /><AvatarFallback>HG</AvatarFallback></Avatar>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.plan} plan</p>
        </div>
      </Link>
    </div>
  );
}

function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Search everything">
      <CommandInput placeholder="Search images, projects, templates, models, batch jobs…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Projects">
          {projects.slice(0, 4).map((p) => (
            <CommandItem key={p.id} onSelect={() => setOpen(false)}>{p.name}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Templates">
          {templates.slice(0, 4).map((t) => (
            <CommandItem key={t.id} onSelect={() => setOpen(false)}>{t.name}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Models">
          {models.slice(0, 4).map((m) => (
            <CommandItem key={m.id} onSelect={() => setOpen(false)}>{m.name}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Batch jobs">
          {batchJobs.slice(0, 3).map((b) => (
            <CommandItem key={b.id} onSelect={() => setOpen(false)}>{b.name}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { light, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumb =
    NAV.find((n) => n.to === pathname)?.label ??
    (pathname === "/" ? "Dashboard" : pathname.replace("/", "").replace(/-/g, " "));
  const unread = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-[32rem] rounded-full bg-violet-600/20 blur-[120px] animate-float-glow" />
        <div className="absolute -right-32 top-1/3 size-[28rem] rounded-full bg-cyan-400/15 blur-[120px] animate-float-glow" />
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-all duration-300 lg:flex",
          collapsed ? "w-[76px]" : "w-[260px]",
        )}
      >
        <div className={cn("flex items-center justify-between px-4 py-5", collapsed && "justify-center px-2")}>
          <Link to="/" aria-label="PixelForge AI home">{collapsed ? <Logo /> : <Wordmark />}</Link>
          {!collapsed ? (
            <Button variant="ghost" size="icon" className="size-8" aria-label="Collapse sidebar" onClick={() => setCollapsed(true)}>
              <ChevronLeft className="size-4" />
            </Button>
          ) : null}
        </div>
        {collapsed ? (
          <Button variant="ghost" size="icon" className="mx-auto mb-2 size-8" aria-label="Expand sidebar" onClick={() => setCollapsed(false)}>
            <Menu className="size-4" />
          </Button>
        ) : null}
        <ScrollArea className="flex-1 px-3">
          <NavList collapsed={collapsed} />
        </ScrollArea>
        <div className={cn("p-3", collapsed && "px-2")}>
          <SidebarFooter collapsed={collapsed} />
        </div>
      </aside>

      <div className={cn("transition-all duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]")}>
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="px-4 py-5"><Wordmark /></div>
                <ScrollArea className="h-[calc(100vh-14rem)] px-3">
                  <NavList onNavigate={() => setMobileOpen(false)} />
                </ScrollArea>
                <div className="p-3"><SidebarFooter /></div>
              </SheetContent>
            </Sheet>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 flex-1 items-center gap-2.5 rounded-xl border border-border/60 bg-card/40 px-3.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 md:flex md:max-w-md"
            >
              <Search className="size-4" />
              <span>Search everything…</span>
              <kbd className="ml-auto rounded-md border border-border/60 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>

            <nav aria-label="Breadcrumb" className="hidden flex-1 text-sm text-muted-foreground xl:block">
              <span className="capitalize">PixelForge AI / <span className="text-foreground">{crumb}</span></span>
            </nav>

            <div className="ml-auto flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <Search className="size-5" />
              </Button>
              <Link
                to="/billing"
                className="hidden items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-1.5 text-sm sm:flex"
              >
                <Zap className="size-4 text-primary" />
                <span className="font-medium">{user.credits.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">credits</span>
              </Link>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="size-5" />
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="flex items-center justify-between border-b border-border/60 p-3">
                    <p className="text-sm font-semibold">Notifications</p>
                    <Badge variant="secondary">{unread} new</Badge>
                  </div>
                  <ScrollArea className="h-80">
                    {notifications.slice(0, 8).map((n) => (
                      <div key={n.id} className="border-b border-border/40 p-3 text-sm last:border-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium">{n.title}</p>
                          {n.unread ? <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" /> : null}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">{n.time}</p>
                      </div>
                    ))}
                  </ScrollArea>
                  <div className="p-2">
                    <Button asChild variant="ghost" size="sm" className="w-full"><Link to="/notifications">View all</Link></Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Help">
                <Link to="/help"><LifeBuoy className="size-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
                {light ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
                    <Avatar className="size-9"><AvatarImage src={user.avatar} alt="" /><AvatarFallback>HG</AvatarFallback></Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/usage">Usage</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/billing">Billing</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/api-keys">API keys</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/team">Team</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/shortcuts">Keyboard shortcuts</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Signed out of demo workspace")}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="relative mx-auto w-full max-w-[1600px] px-4 pb-28 pt-6 sm:px-6 lg:pb-12">{children}</main>
      </div>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {MOBILE_NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </div>
  );
}
