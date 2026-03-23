import { type NextRequest, NextResponse } from "next/server";
import { HOLYSHIP_API_TOKEN, HOLYSHIP_API_URL, WOPR_TENANT_ID } from "@/lib/config";

/**
 * Fetch open issues for a repo via the holyship engine's GitHub App installation.
 * Falls back to empty array if the engine doesn't support this endpoint yet.
 */
export async function GET(req: NextRequest) {
  const repoFullName = req.nextUrl.searchParams.get("repo");
  if (!repoFullName) {
    return NextResponse.json({ issues: [], error: "Missing repo parameter" }, { status: 400 });
  }

  const [owner, repo] = repoFullName.split("/");
  if (!owner || !repo) {
    return NextResponse.json({ issues: [], error: "Invalid repo format" }, { status: 400 });
  }

  try {
    // Try engine's GitHub issues proxy
    const url = `${HOLYSHIP_API_URL}/api/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?state=open&per_page=50`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Id": WOPR_TENANT_ID,
        ...(HOLYSHIP_API_TOKEN ? { Authorization: `Bearer ${HOLYSHIP_API_TOKEN}` } : {}),
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const data = await res.json();
      const issues = Array.isArray(data) ? data : (data.issues ?? []);
      return NextResponse.json({ issues });
    }

    // Engine doesn't have this endpoint yet
    // TODO: Add /api/github/repos/:owner/:repo/issues to holyship engine
    return NextResponse.json({
      issues: [],
      _note: "engine_github_issues_not_implemented",
    });
  } catch {
    return NextResponse.json({ issues: [] });
  }
}
