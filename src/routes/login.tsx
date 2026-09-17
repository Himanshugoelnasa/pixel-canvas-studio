import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — PixelForge AI" },
      { name: "description", content: "Sign in to your PixelForge AI studio and keep creating." },
      { property: "og:title", content: "Sign in — PixelForge AI" },
      { property: "og:description", content: "Turn imagination into pixels." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your PixelForge studio."
      oauth
      footer={<>New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link></>}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => { e.preventDefault(); toast.success("Signed in to demo workspace"); navigate({ to: "/onboarding" }); }}
      >
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="himanshu@pixelforge.ai" required /></div>
        <div className="space-y-1.5"><Label htmlFor="pass">Password</Label><Input id="pass" type="password" defaultValue="demo-password" required /></div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground"><Checkbox defaultChecked aria-label="Remember me" />Remember me</label>
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full gradient-brand text-white">Sign in</Button>
      </form>
    </AuthLayout>
  );
}
