"use client";

import { Button } from "@core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@core/components/ui/card";
import { getBrandConfig } from "@core/lib/brand-config";
import { GithubIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthRedirect } from "@/components/auth/auth-redirect";
import { signIn } from "@/lib/auth-client";

const ERROR_MESSAGES: Record<string, string> = {
  email_not_found: "No account found for that email. Contact support to get started.",
  access_denied: "Access denied. You may not have permission to sign in.",
  default: "Something went wrong. Please try again.",
};

function LoginContent() {
  const brand = getBrandConfig();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const errorCode = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl");
  const errorMessage = errorCode ? (ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.default) : null;

  async function handleGitHubLogin() {
    setLoading(true);
    try {
      const origin = window.location.origin;
      await signIn.social({
        provider: "github",
        callbackURL: `${origin}${callbackUrl ?? brand.homePath}`,
        errorCallbackURL: `${origin}/login`,
      });
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AuthRedirect />
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{brand.productName}</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {errorMessage && <p className="text-sm text-destructive text-center">{errorMessage}</p>}
          <Button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full"
            variant="outline"
            size="lg"
          >
            <GithubIcon className="mr-2 h-5 w-5" />
            {loading ? "Redirecting..." : "Continue with GitHub"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center" />}>
      <LoginContent />
    </Suspense>
  );
}
