"use client";

import { Suspense } from "react";
import { AuthRedirect } from "@core/components/auth/auth-redirect";
import { AuthShell } from "@core/components/auth/auth-shell";
import { OAuthButtons } from "@core/components/oauth-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@core/components/ui/card";
import { getBrandConfig } from "@core/lib/brand-config";

function LoginContent() {
  const brand = getBrandConfig();
  return (
    <AuthShell>
      <AuthRedirect />
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{brand.productName}</CardTitle>
          <CardDescription>Sign in with GitHub to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthButtons mode="signin" />
        </CardContent>
      </Card>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
