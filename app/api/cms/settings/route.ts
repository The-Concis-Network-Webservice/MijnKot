import { NextResponse } from "next/server";

export const runtime = 'edge';

import { getUserFromRequest } from "../../../../lib/cms/server";
import { canManageVestigingen } from "../../../../lib/cms/permissions";
import { query, queryOne } from "../../../../lib/db";
import { logAudit } from "../../../../lib/audit";

export async function GET() {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await queryOne("select * from site_settings limit 1");
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageVestigingen(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const {
    hero_title,
    hero_subtitle,
    hero_cta_label,
    hero_cta_href,
    contact_email,
    contact_phone,
    contact_address
  } = body;
  if (
    !hero_title ||
    !hero_subtitle ||
    !hero_cta_label ||
    !hero_cta_href ||
    !contact_email ||
    !contact_phone ||
    !contact_address
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const inserted = await queryOne<any>(
    "insert into site_settings (hero_title, hero_subtitle, hero_cta_label, hero_cta_href, contact_email, contact_phone, contact_address) values ($1, $2, $3, $4, $5, $6, $7) returning *",
    [
      hero_title,
      hero_subtitle,
      hero_cta_label,
      hero_cta_href,
      contact_email,
      contact_phone,
      contact_address
    ]
  );
  if (!inserted) {
    return NextResponse.json({ error: "Failed to create settings." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "site_settings",
    entityId: String(inserted.id),
    changes: inserted
  });
  return NextResponse.json({ data: inserted });
}

export async function PATCH(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageVestigingen(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const updated = await queryOne<any>(
    "update site_settings set hero_title = $1, hero_subtitle = $2, hero_cta_label = $3, hero_cta_href = $4, contact_email = $5, contact_phone = $6, contact_address = $7 where id = $8 returning *",
    [
      body.hero_title,
      body.hero_subtitle,
      body.hero_cta_label,
      body.hero_cta_href,
      body.contact_email,
      body.contact_phone,
      body.contact_address,
      id
    ]
  );
  if (!updated) {
    return NextResponse.json({ error: "Failed to update settings." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "update",
    entityType: "site_settings",
    entityId: String(id),
    changes: updated
  });
  return NextResponse.json({ data: updated });
}

