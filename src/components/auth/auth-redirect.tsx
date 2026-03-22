"use client";

import { getBrandConfig } from "@core/lib/brand-config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export function AuthRedirect() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      router.replace(getBrandConfig().homePath);
    }
  }, [isPending, session, router]);

  return null;
}
