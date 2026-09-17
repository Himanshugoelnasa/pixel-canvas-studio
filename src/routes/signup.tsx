import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — PixelForge AI" },
      { name: "description", content: "Start generating AI images free with 1,000 credits on PixelForge AI." },
      { property: "og:title", content: "Create account — PixelForge AI" },
      { property: "og:description", content: "Create more. Generate faster." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Create your studio"
      subtitle="1,000 free credits, no card required."
      oauth
      footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => { e.preventDefault(); toast.success("Account created — check your email"); navigate({ to: "/verify-email" }); }}
      >
        <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" placeholder="Himanshu Goel" required /></div>
        <div className="space-y-1.5"><Label htmlFor="email">Work email</Label><Input id="email" type="email" placeholder="you@studio.com" required /></div>
        <div className="space-y-1.5"><Label htmlFor="pass">Password</Label><Input id="pass" type="password" placeholder="At least 10 characters" required /></div>
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <Checkbox required aria-label="Accept terms" className="mt-0.5" />
          I agree to the Terms of Service and Privacy Policy.
        </label>
        <Button type="submit" className="w-full gradient-brand text-white">Create account</Button>
      </form>
    </AuthLayout>
  );
}
