import { NextResponse } from "next/server";

export const runtime = 'edge';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { canManageVestigingen } from "@/shared/lib/cms/permissions";
import { query, queryOne } from "@/shared/lib/db";
import { logAudit } from "@/shared/lib/audit";

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
    contact_address,
    company_name,
<<<<<<< HEAD
    company_legal_name
=======
    company_legal_name,
    notice_active,
    notice_text,
    popup_active,
    popup_title,
    popup_text
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
  } = body;
  if (
    !hero_title ||
    !hero_subtitle ||
    !hero_cta_label ||
    !hero_cta_href ||
    !contact_email ||
    !contact_address ||
    !company_name ||
    !company_legal_name
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const inserted = await queryOne<any>(
<<<<<<< HEAD
    "insert into site_settings (hero_title, hero_subtitle, hero_cta_label, hero_cta_href, contact_email, contact_phone, contact_address, company_name, company_legal_name) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *",
=======
    "insert into site_settings (hero_title, hero_subtitle, hero_cta_label, hero_cta_href, contact_email, contact_phone, contact_address, company_name, company_legal_name, notice_active, notice_text, popup_active, popup_title, popup_text) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning *",
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
    [
      hero_title,
      hero_subtitle,
      hero_cta_label,
      hero_cta_href,
      contact_email,
      contact_phone,
      contact_address,
      company_name,
<<<<<<< HEAD
      company_legal_name
=======
      company_legal_name,
      notice_active ? 1 : 0,
      notice_text,
      popup_active ? 1 : 0,
      popup_title,
      popup_text
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
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
<<<<<<< HEAD
    "update site_settings set hero_title = $1, hero_subtitle = $2, hero_cta_label = $3, hero_cta_href = $4, contact_email = $5, contact_phone = $6, contact_address = $7, company_name = $8, company_legal_name = $9 where id = $10 returning *",
=======
    "update site_settings set hero_title = $1, hero_subtitle = $2, hero_cta_label = $3, hero_cta_href = $4, contact_email = $5, contact_phone = $6, contact_address = $7, company_name = $8, company_legal_name = $9, notice_active = $10, notice_text = $11, popup_active = $12, popup_title = $13, popup_text = $14 where id = $15 returning *",
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
    [
      body.hero_title,
      body.hero_subtitle,
      body.hero_cta_label,
      body.hero_cta_href,
      body.contact_email,
      body.contact_phone,
      body.contact_address,
      body.company_name,
      body.company_legal_name,
<<<<<<< HEAD
=======
      body.notice_active ? 1 : 0,
      body.notice_text,
      body.popup_active ? 1 : 0,
      body.popup_title,
      body.popup_text,
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
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


