import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/shared/lib/cms/server";

export const runtime = "edge";

export async function GET() {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = process.env.FLOOR_PLAN_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Token not configured" }, { status: 500 });
  }
  return NextResponse.json({ token });
}
