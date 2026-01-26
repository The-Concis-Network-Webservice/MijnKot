import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../../lib/cms/server";
import { query } from "../../../../../lib/db";

export async function GET(request: Request) {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const data = await query(
    "select * from availability_history where kot_id = $1 order by changed_at desc",
    [id]
  );
  return NextResponse.json({ data });
}

