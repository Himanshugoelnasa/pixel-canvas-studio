import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — PixelForge AI" },
      { name: "description", content: "Request a secure password reset link for your PixelForge AI account." },
      { property: "og:title", content: "Reset your password — PixelForge AI" },
      { property: "og:description", content: "We'll email you a reset link." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="We'll email you a secure reset link."
      footer={<Link to="/login" className="text-primary hover:underline">Back to sign in</Link>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Reset link sent"); navigate({ to: "/reset-password" }); }}>
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@studio.com" required /></div>
        <Button type="submit" className="w-full gradient-brand text-white">Send reset link</Button>
      </form>
    </AuthLayout>
  );
}
