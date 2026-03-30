import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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
    hero_title_en,
    hero_subtitle,
    hero_subtitle_en,
    hero_cta_label,
    hero_cta_label_en,
    hero_cta_href,
    contact_email,
    contact_phone,
    contact_address,
    company_name,
    company_legal_name,
    notice_active,
    notice_text,
    popup_active,
    popup_title,
    popup_text,
    booking_url
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
  // Step 1: Create record with core fields
  let inserted;
  try {
    inserted = await queryOne<any>(
      "insert into site_settings (hero_title, hero_subtitle, hero_cta_label, hero_cta_href, contact_email, contact_phone, contact_address, company_name, company_legal_name) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *",
      [
        hero_title,
        hero_subtitle,
        hero_cta_label,
        hero_cta_href,
        contact_email,
        contact_phone,
        contact_address,
        company_name,
        company_legal_name
      ]
    );
  } catch (err: any) {
    console.error("Core settings creation failed:", err);
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }

  if (!inserted) {
    return NextResponse.json({ error: "Failed to create settings." }, { status: 400 });
  }

  // Step 2: Update new/optional columns individually (gracefully skip if missing)
  const optionalFields = [
    { name: 'hero_title_en', value: hero_title_en },
    { name: 'hero_subtitle_en', value: hero_subtitle_en },
    { name: 'hero_cta_label_en', value: hero_cta_label_en },
    { name: 'notice_active', value: notice_active !== undefined ? (notice_active ? 1 : 0) : undefined },
    { name: 'notice_text', value: notice_text },
    { name: 'popup_active', value: popup_active !== undefined ? (popup_active ? 1 : 0) : undefined },
    { name: 'popup_title', value: popup_title },
    { name: 'popup_text', value: popup_text },
    { name: 'booking_url', value: booking_url }
  ];

  for (const field of optionalFields) {
    if (field.value !== undefined) {
      try {
        await queryOne(
          `update site_settings set ${field.name} = $1 where id = $2`,
          [field.value ?? null, inserted.id]
        );
        inserted[field.name] = field.value;
      } catch (err) {
        console.warn(`Optional column ${field.name} missing or update failed during POST, skipping.`);
      }
    }
  }

  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "site_settings",
    entityId: String(inserted.id),
    changes: inserted
  });
  revalidatePath('/');
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

  // Step 1: Update core fields (most likely to exist)
  let updated;
  try {
    updated = await queryOne<any>(
      `update site_settings set 
        hero_title = $1, 
        hero_subtitle = $2, 
        hero_cta_label = $3, 
        hero_cta_href = $4, 
        contact_email = $5, 
        contact_phone = $6, 
        contact_address = $7, 
        company_name = $8, 
        company_legal_name = $9
      where id = $10 returning *`,
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
        id
      ]
    );
  } catch (err: any) {
    console.error("Core settings update failed:", err);
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }

  if (!updated) {
    return NextResponse.json({ error: "Settings record not found." }, { status: 404 });
  }

  // Step 2: Update new/optional columns individually (gracefully skip if missing)
  const optionalFields = [
    { name: 'hero_title_en', value: body.hero_title_en },
    { name: 'hero_subtitle_en', value: body.hero_subtitle_en },
    { name: 'hero_cta_label_en', value: body.hero_cta_label_en },
    { name: 'notice_active', value: body.notice_active !== undefined ? (body.notice_active ? 1 : 0) : undefined },
    { name: 'notice_text', value: body.notice_text },
    { name: 'popup_active', value: body.popup_active !== undefined ? (body.popup_active ? 1 : 0) : undefined },
    { name: 'popup_title', value: body.popup_title },
    { name: 'popup_text', value: body.popup_text },
    { name: 'booking_url', value: body.booking_url }
  ];

  for (const field of optionalFields) {
    if (field.value !== undefined) {
      try {
        await queryOne(
          `update site_settings set ${field.name} = $1 where id = $2`,
          [field.value ?? null, id]
        );
        // Update our local 'updated' object to reflect the change
        updated[field.name] = field.value;
      } catch (err) {
        // Silently skip if column doesn't exist
        console.warn(`Optional column ${field.name} missing or update failed, skipping.`);
      }
    }
  }

  await logAudit({
    actorId: user.id,
    action: "update",
    entityType: "site_settings",
    entityId: String(id),
    changes: updated
  });

  revalidatePath('/');
  return NextResponse.json({ data: updated });
}


