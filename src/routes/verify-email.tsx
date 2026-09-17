import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email — PixelForge AI" },
      { name: "description", content: "Enter the six-digit code we sent to activate your PixelForge AI studio." },
      { property: "og:title", content: "Verify your email — PixelForge AI" },
      { property: "og:description", content: "One code away from your first generation." },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We sent a 6-digit code to your inbox."
      footer={<button className="text-primary hover:underline" onClick={() => toast.success("Code resent")}>Resend code</button>}
    >
      <div className="space-y-5">
        <div className="flex justify-center">
          <span className="grid size-14 place-items-center rounded-2xl gradient-brand text-white"><MailCheck className="size-6" /></span>
        </div>
        <div className="flex justify-center">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button asChild className="w-full gradient-brand text-white"><Link to="/onboarding">Verify and continue</Link></Button>
      </div>
    </AuthLayout>
  );
}
