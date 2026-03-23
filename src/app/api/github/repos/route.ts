import { NextResponse } from "next/server";
import { HOLYSHIP_API_TOKEN, HOLYSHIP_API_URL } from "@/lib/config";

export async function GET() {
  try {
    const res = await fetch(`${HOLYSHIP_API_URL}/api/github/repos`, {
      headers: {
        ...(HOLYSHIP_API_TOKEN ? { Authorization: `Bearer ${HOLYSHIP_API_TOKEN}` } : {}),
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ repositories: [] });
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ repositories: [] });
  }
}
