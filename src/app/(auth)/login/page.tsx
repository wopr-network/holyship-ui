"use client";

import { Github } from "lucide-react";
import { Suspense, useState } from "react";
import { AuthRedirect } from "@core/components/auth/auth-redirect";
import { Button } from "@core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@core/components/ui/card";
import { signIn } from "@core/lib/auth-client";
import { getBrandConfig } from "@core/lib/brand-config";

function LoginContent() {
  const brand = getBrandConfig();
  const [loading, setLoading] = useState(false);

  async function handleGitHubLogin() {
    setLoading(true);
    try {
      await signIn.social({ provider: "github", callbackURL: "/pipeline" });
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
        <CardContent>
          <Button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full"
            variant="outline"
            size="lg"
          >
            <Github className="mr-2 h-5 w-5" />
            {loading ? "Redirecting..." : "Continue with GitHub"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
