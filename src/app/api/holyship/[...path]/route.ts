import { type NextRequest, NextResponse } from "next/server";
import { HOLYSHIP_API_TOKEN, HOLYSHIP_API_URL, WOPR_TENANT_ID } from "@/lib/config";

function holyshipHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Tenant-Id": WOPR_TENANT_ID,
    ...(HOLYSHIP_API_TOKEN ? { Authorization: `Bearer ${HOLYSHIP_API_TOKEN}` } : {}),
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const search = req.nextUrl.search;
  const url = `${HOLYSHIP_API_URL}/api/${path.map(encodeURIComponent).join("/")}${search}`;

  try {
    const res = await fetch(url, { headers: holyshipHeaders(), next: { revalidate: 0 } });
    const body = await res.json();
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const url = `${HOLYSHIP_API_URL}/api/${path.map(encodeURIComponent).join("/")}`;

  try {
    const body = await req.text();
    const res = await fetch(url, {
      method: "POST",
      headers: holyshipHeaders(),
      body: body || undefined,
    });
    if (res.status === 204 || !res.headers.get("content-type")?.includes("application/json")) {
      return new NextResponse(null, { status: res.status });
    }
    const responseBody = await res.json();
    return NextResponse.json(responseBody, { status: res.status });
  } catch {
    return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const url = `${HOLYSHIP_API_URL}/api/${path.map(encodeURIComponent).join("/")}`;

  try {
    const body = await req.text();
    const res = await fetch(url, {
      method: "PATCH",
      headers: holyshipHeaders(),
      body: body || undefined,
    });
    if (res.status === 204 || !res.headers.get("content-type")?.includes("application/json")) {
      return new NextResponse(null, { status: res.status });
    }
    const responseBody = await res.json();
    return NextResponse.json(responseBody, { status: res.status });
  } catch {
    return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const url = `${HOLYSHIP_API_URL}/api/${path.map(encodeURIComponent).join("/")}`;

  try {
    const res = await fetch(url, { method: "DELETE", headers: holyshipHeaders() });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const responseBody = await res.json();
    return NextResponse.json(responseBody, { status: res.status });
  } catch {
    return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
  }
}
