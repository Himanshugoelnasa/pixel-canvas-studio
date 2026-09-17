import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { generations } from "@/lib/mock-data";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  oauth,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  oauth?: boolean;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={generations[0]!.image} alt="AI generated artwork" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700/70 via-background/60 to-cyan-500/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link to="/"><Wordmark /></Link>
          <div className="max-w-sm space-y-3">
            <h2 className="font-display text-4xl font-semibold leading-tight text-white">Turn imagination into pixels.</h2>
            <p className="text-sm text-white/70">
              12,842 images generated this month by creators building campaigns, characters and catalogs with PixelForge AI.
            </p>
            <div className="flex -space-x-2 pt-2">
              {generations.slice(1, 6).map((g) => (
                <img key={g.id} src={g.image} alt="" className="size-10 rounded-full border-2 border-background object-cover" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden px-5 py-12">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full gradient-brand opacity-25 blur-3xl animate-float-glow" />
        <div className="relative w-full max-w-sm space-y-6">
          <div className="lg:hidden"><Wordmark /></div>
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          {oauth ? (
            <>
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" />or continue with<span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" asChild><Link to="/onboarding">Google</Link></Button>
                <Button variant="outline" asChild><Link to="/onboarding">GitHub</Link></Button>
              </div>
            </>
          ) : null}
          {footer ? <div className="text-center text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
