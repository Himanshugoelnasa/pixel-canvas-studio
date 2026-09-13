import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-9 items-center justify-center rounded-xl gradient-brand", className)}>
      <span className="absolute inset-0 rounded-xl gradient-brand blur-md opacity-70" />
      <svg viewBox="0 0 24 24" className="relative size-5 text-white" fill="none" aria-hidden="true">
        <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3.1" fill="currentColor" />
        <path d="M12 2.5v6M12 15.2v6.3M3.5 7l5.2 3M15.3 14l5.2 3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </span>
  );
}

export function Wordmark({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo />
      {!collapsed ? (
        <div className="leading-tight">
          <p className="font-display text-[0.95rem] font-semibold">PixelForge AI</p>
          <p className="text-[10px] text-muted-foreground">Create more. Generate faster.</p>
        </div>
      ) : null}
    </div>
  );
}
