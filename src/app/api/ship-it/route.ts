import { NextResponse } from "next/server";
import { HOLYSHIP_API_TOKEN, HOLYSHIP_API_URL, WOPR_TENANT_ID } from "@/lib/config";

export async function POST(req: Request) {
  try {
    const { owner, repo, issueNumber, issueUrl } = await req.json();

    let resolvedOwner = owner;
    let resolvedRepo = repo;
    let resolvedIssueNumber = issueNumber;

    // Parse from URL if provided
    if (issueUrl && !owner) {
      const match = issueUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
      if (!match) {
        return NextResponse.json({ ok: false, error: "Invalid issue URL" }, { status: 400 });
      }
      [, resolvedOwner, resolvedRepo, resolvedIssueNumber] = match;
      resolvedIssueNumber = Number(resolvedIssueNumber);
    }

    if (!resolvedOwner || !resolvedRepo || !resolvedIssueNumber) {
      return NextResponse.json(
        { ok: false, error: "Missing owner, repo, or issueNumber" },
        { status: 400 },
      );
    }

    const repoFullName = `${resolvedOwner}/${resolvedRepo}`;

    const res = await fetch(`${HOLYSHIP_API_URL}/api/entities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Id": WOPR_TENANT_ID,
        ...(HOLYSHIP_API_TOKEN ? { Authorization: `Bearer ${HOLYSHIP_API_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        flow: "engineering",
        refs: { github: { repo: repoFullName } },
        payload: {
          issueNumber: resolvedIssueNumber,
          issueTitle: `Issue #${resolvedIssueNumber}`,
          repoFullName,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: `Engine ${res.status}: ${text.slice(0, 200)}` },
        { status: res.status },
      );
    }

    const entity = await res.json();
    return NextResponse.json({ ok: true, entityId: entity.id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
