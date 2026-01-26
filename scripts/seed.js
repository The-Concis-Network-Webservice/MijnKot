import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env manually if needed
function loadEnv() {
  const envFiles = [".env", ".env.local"];
  envFiles.forEach(file => {
    const envPath = path.join(__dirname, "..", file);
    if (fs.existsSync(envPath)) {
      console.log(`Loading env from ${file}`);
      const content = fs.readFileSync(envPath, "utf-8");
      content.split("\n").forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^"(.*)"$/, "$1");
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  });
}
loadEnv();

const dbPath =
  process.env.DB_PATH ?? path.join(__dirname, "..", "db", "local.sqlite");
const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

const accountId = process.env.R2_ACCOUNT_ID ?? "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
const r2Bucket = process.env.R2_BUCKET ?? "";
const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? "";

const hasR2Config = accountId && accessKeyId && secretAccessKey && r2Bucket && r2PublicBaseUrl;

if (!hasR2Config) {
  console.warn("⚠️ R2 credentials not found in .env file. Photo uploads will be skipped.");
  console.warn("   To enable photo uploads, add R2 configuration to your .env file.");
  console.warn("   See .env.example for required variables.");
} else {
  console.log("✅ R2 configuration found. Photo uploads enabled.");
}

// Cloudflare R2 client configuration
// Using 'us-east-1' as region is the recommended configuration for R2
const r2Client = hasR2Config ? new S3Client({
  region: "us-east-1",  // R2 recommends using us-east-1
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
}) : null;

const db = new Database(dbPath);

function insertOne(sql, params) {
  const stmt = db.prepare(sql);
  return stmt.get(params);
}

function insertMany(sql, rows) {
  const stmt = db.prepare(sql);
  const tx = db.transaction((items) => {
    for (const row of items) stmt.run(row);
  });
  tx(rows);
}

function insertRun(sql, params) {
  const stmt = db.prepare(sql);
  return stmt.run(params);
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function uploadFile(kotId, filePath, orderIndex) {
  if (!r2Client) {
    console.log(`Skipping ${path.basename(filePath)} (R2 not configured)`);
    return false;
  }

  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath);
  const mimeType = getMimeType(fileName);
  const key = `koten/${kotId}/${fileName}`;
  const sizeBytes = fileContent.length;

  console.log(`Uploading ${fileName} to ${key}...`);

  try {
    await r2Client.send(new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      Body: fileContent,
      ContentType: mimeType
    }));

    const publicUrl = `${r2PublicBaseUrl}/${key}`;

    // Insert into media_assets
    const mediaAsset = insertOne(
      "insert into media_assets (r2_key, public_url, file_name, mime_type, size_bytes, created_by) values (?, ?, ?, ?, ?, ?) returning id",
      [key, publicUrl, fileName, mimeType, sizeBytes, null] // created_by null for system seed
    );

    // Insert into kot_photos
    insertRun(
      "insert into kot_photos (kot_id, image_url, order_index, media_asset_id) values (?, ?, ?, ?)",
      [kotId, publicUrl, orderIndex, mediaAsset.id]
    );
    return true;
  } catch (err) {
    console.error(`Failed to upload ${fileName}:`, err.message);
    return false;
  }
}

async function main() {
  // Clear existing data
  db.prepare("delete from availability_history").run();
  db.prepare("delete from kot_photos").run();
  db.prepare("delete from media_assets").run(); // Added to clear media assets
  db.prepare("delete from koten").run();
  db.prepare("delete from user_vestigingen").run();
  db.prepare("delete from vestigingen").run();
  db.prepare("delete from faq_items").run();
  db.prepare("delete from site_settings").run();
  db.prepare("delete from users where role = 'super_admin'").run();

  console.log("Cleared database.");

  const admin = insertOne(
    "select id from users where email = ?",
    [adminEmail]
  );
  let adminId = admin?.id;

  if (!adminId) {
    const hash = bcrypt.hashSync(adminPassword, 10);
    const created = insertOne(
      "insert into users (email, full_name, password_hash, role) values (?, ?, ?, ?) returning id",
      [adminEmail, "Admin", hash, "super_admin"]
    );
    adminId = created.id;
    console.log(`Created admin: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  const existingSettings = insertOne(
    "select id from site_settings limit 1",
    []
  );
  if (!existingSettings) {
    insertOne(
      "insert into site_settings (hero_title, hero_title_en, hero_subtitle, hero_subtitle_en, hero_cta_label, hero_cta_label_en, hero_cta_href, contact_email, contact_phone, contact_address) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) returning id",
      [
        "Vind een studentenkot dat voelt als thuis",
        "Find a student room that feels like home",
        "Wij selecteren kwalitatieve koten in heel België met transparante prijzen, geverifieerde verhuurders en locaties dicht bij het campusleven.",
        "We curate high-quality koten across Belgium with transparent pricing, verified landlords, and locations that keep you close to campus life.",
        "Bekijk vestigingen",
        "Explore locations",
        "/vestigingen",
        "hello@mijn-kot.be",
        "+32 2 555 1234",
        "Wetstraat 88, 1040 Brussel"
      ]
    );
  }

  const vestigingen = [
    {
      name: "Leuven Center",
      address: "Naamsestraat 10",
      city: "Leuven",
      postal_code: "3000",
      description: "Gelegen in het hart van Leuven, op wandelafstand van KU Leuven, bibliotheken en gezellige studentenpleinen.",
      description_en: "Located in the heart of Leuven, walking distance from KU Leuven, libraries, and cozy student squares."
    },
    {
      name: "Ghent Station",
      address: "Voskenslaan 120",
      city: "Gent",
      postal_code: "9000",
      description: "Direct bij Gent-Sint-Pieters, perfect voor studenten die vaak pendelen. Rustige straat met snelle toegang tot faculteiten.",
      description_en: "Directly near Ghent-Sint-Pieters, perfect for commuting students. Quiet street with fast access to faculties."
    },
    {
      name: "Antwerp Zuid",
      address: "Kronenburgstraat 55",
      city: "Antwerpen",
      postal_code: "2000",
      description: "Antwerpen Zuid combineert creatieve sfeer met praktische bereikbaarheid. Populair bij kunststudenten.",
      description_en: "Antwerp South combines creative atmosphere with practical accessibility. Popular with art students."
    },
    {
      name: "Brussels EU Quarter",
      address: "Rue de la Loi 88",
      city: "Brussel",
      postal_code: "1040",
      description: "Voor studenten in Brussel die een internationale vibe zoeken. Dicht bij de EU instellingen en parken.",
      description_en: "For students in Brussels looking for an international vibe. Close to EU institutions and parks."
    }
  ];

  const rows = vestigingen.map((v) => [
    v.name,
    v.address,
    v.city,
    v.postal_code,
    v.description,
    v.description_en
  ]);
  insertMany(
    "insert into vestigingen (name, address, city, postal_code, description, description_en) values (?, ?, ?, ?, ?, ?)",
    rows
  );

  const allVestigingen = db.prepare("select id from vestigingen").all();
  insertMany(
    "insert or ignore into user_vestigingen (user_id, vestiging_id) values (?, ?)",
    allVestigingen.map((v) => [adminId, v.id])
  );

  const kotTemplates = [
    {
      title: "Zonnige Studio",
      title_en: "Sunny Studio",
      description: "Zonnige studio met grote ramen, eigen badkamer en compacte kitchenette.",
      description_en: "Sunny studio with large windows, private bathroom and compact kitchenette."
    },
    {
      title: "Moderne Loft",
      title_en: "Modern Loft",
      description: "Ruime loft met hoge plafonds, moderne afwerking en privé-kitchenette.",
      description_en: "Spacious loft with high ceilings, modern finish and private kitchenette."
    },
    {
      title: "Gezellige Zolderkamer",
      title_en: "Cozy Attic Room",
      description: "Gezellige zolderkamer met veel daglicht en warme houten afwerking.",
      description_en: "Cozy attic room with lots of daylight and warm wooden finish."
    },
    {
      title: "Kamer Stadszicht",
      title_en: "City View Room",
      description: "Kamer met uitzicht op de stad en toegang tot gemeenschappelijke leefruimte.",
      description_en: "Room with city view and access to common living area."
    },
    {
      title: "Rustige Eenpersoonskamer",
      title_en: "Quiet Single Room",
      description: "Compacte kamer met gedeelde keuken en badkamer. Betaalbaar en rustig.",
      description_en: "Compact room with shared kitchen and bathroom. Affordable and quiet."
    }
  ];

  const availability = ["available", "available", "reserved", "hidden", "rented"];
  const statuses = ["published", "published", "published", "scheduled", "archived"];

  const kotRows = [];
  let counter = 1;
  for (const vestiging of allVestigingen) {
    for (let i = 0; i < 5; i += 1) {
      const tpl = kotTemplates[(counter - 1) % kotTemplates.length];
      const price = 360 + (counter % 8) * 35;
      kotRows.push({
        vestiging_id: vestiging.id,
        title: `${tpl.title} ${counter}`,
        title_en: `${tpl.title_en} ${counter}`,
        description: tpl.description,
        description_en: tpl.description_en,
        price,
        availability_status: availability[counter % availability.length],
        status: statuses[counter % statuses.length]
      });
      counter += 1;
    }
  }

  insertMany(
    "insert into koten (vestiging_id, title, title_en, description, description_en, price, availability_status, status) values (?, ?, ?, ?, ?, ?, ?, ?)",
    kotRows.map((k) => [
      k.vestiging_id,
      k.title,
      k.title_en,
      k.description,
      k.description_en,
      k.price,
      k.availability_status,
      k.status
    ])
  );

  insertMany(
    "insert into faq_items (question, question_en, answer, answer_en, category, order_index) values (?, ?, ?, ?, ?, ?)",
    [
      [
        "Hoe boek ik een bezichtiging?",
        "How do I book a viewing?",
        "Ga naar de detailpagina van een kot en klik op 'Bezoek aanvragen'.",
        "Go to the detail page of a room and click 'Request a visit'.",
        "Beginnen",
        1
      ],
      [
        "Is internet inbegrepen?",
        "Is internet included?",
        "Ja, elk kot heeft snel internet.",
        "Yes, every room has fast internet.",
        "Betalingen",
        1
      ],
      [
        "Wat is de waarborg?",
        "What is the deposit?",
        "De waarborg is 2 maanden huur.",
        "The deposit is 2 months rent.",
        "Betalingen",
        2
      ]
    ]
  );
  
  // Handle Photos for Kot 1
  const allKoten = db.prepare("select id, title from koten order by created_at asc").all();
  // Assuming the first inserted kot matches the first item.
  // We can find by title "Zonnige Studio 1"
  const kot1 = allKoten.find(k => k.title === "Zonnige Studio 1");
  const kot2 = allKoten.find(k => k.title === "Moderne Loft 2"); // Assuming counter 2

  if (kot1) {
    const kot1Dir = path.join(__dirname, "kot1");
    if (fs.existsSync(kot1Dir)) {
      const files = fs.readdirSync(kot1Dir);
      console.log(`Processing ${files.length} photos for Kot 1 (${kot1.id})...`);
      for (let i = 0; i < files.length; i++) {
        await uploadFile(kot1.id, path.join(kot1Dir, files[i]), i);
      }
    } else {
        console.log("Directory scripts/kot1 not found.");
    }
  }

  if (kot2) {
    const kot2Dir = path.join(__dirname, "kot2");
    if (fs.existsSync(kot2Dir)) {
      const files = fs.readdirSync(kot2Dir);
      console.log(`Processing ${files.length} photos for Kot 2 (${kot2.id})...`);
      for (let i = 0; i < files.length; i++) {
        await uploadFile(kot2.id, path.join(kot2Dir, files[i]), i);
      }
    } else {
        console.log("Directory scripts/kot2 not found.");
    }
  }

  console.log("Seed complete.");
}

main().catch(console.error);
