import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — PixelForge AI" },
      { name: "description", content: "Choose a new password to secure your PixelForge AI studio." },
      { property: "og:title", content: "Set a new password — PixelForge AI" },
      { property: "og:description", content: "Choose a new password." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout title="Set a new password" subtitle="Make it long, make it strange.">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); navigate({ to: "/login" }); }}>
        <div className="space-y-1.5"><Label htmlFor="p1">New password</Label><Input id="p1" type="password" required /></div>
        <div className="space-y-1.5"><Label htmlFor="p2">Confirm password</Label><Input id="p2" type="password" required /></div>
        <Button type="submit" className="w-full gradient-brand text-white">Update password</Button>
      </form>
    </AuthLayout>
  );
}
