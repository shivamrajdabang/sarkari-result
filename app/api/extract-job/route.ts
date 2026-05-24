import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prefilled } = await req.json();

  // Direct prefilled data accept karo (Claude Code se banaya hua)
  if (prefilled) {
    return NextResponse.json({ success: true, job: prefilled });
  }

  return NextResponse.json({ error: "No data provided" }, { status: 400 });
}
