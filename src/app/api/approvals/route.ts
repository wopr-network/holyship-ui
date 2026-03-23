import { NextResponse } from "next/server";
import { HOLYSHIP_API_TOKEN, HOLYSHIP_API_URL, WOPR_TENANT_ID } from "@/lib/config";

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Tenant-Id": WOPR_TENANT_ID,
    ...(HOLYSHIP_API_TOKEN ? { Authorization: `Bearer ${HOLYSHIP_API_TOKEN}` } : {}),
  };
}

interface Entity {
  id: string;
  flowId: string;
  state: string;
  artifacts: Record<string, unknown>;
  refs: {
    github?: { repo: string };
    linear?: { key: string; title: string };
  };
  createdAt: string;
  updatedAt: string;
}

// States that represent "awaiting human input" in the engineering flow
const APPROVAL_STATES = ["review", "stuck"];

export async function GET() {
  try {
    const pending = [];

    for (const state of APPROVAL_STATES) {
      const res = await fetch(
        `${HOLYSHIP_API_URL}/api/entities?flow=engineering&state=${encodeURIComponent(state)}`,
        { headers: authHeaders(), next: { revalidate: 0 } },
      );
      if (!res.ok) continue;
      const entities: Entity[] = await res.json();

      for (const entity of entities) {
        pending.push({
          entityId: entity.id,
          issueTitle: (entity.artifacts.issueTitle as string) ?? entity.id,
          issueNumber: (entity.artifacts.issueNumber as number) ?? 0,
          repoFullName: entity.refs?.github?.repo ?? "",
          currentStage: entity.state,
          waitingSince: entity.updatedAt,
          artifacts: entity.artifacts,
        });
      }
    }

    return NextResponse.json({ pending });
  } catch {
    return NextResponse.json({ pending: [] });
  }
}
