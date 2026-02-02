
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { hashPassword } from "./hash-password.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { execSync } from "child_process";

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

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

const accountId = process.env.R2_ACCOUNT_ID ?? "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
const r2Bucket = process.env.R2_BUCKET ?? "";
const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? "";

const hasR2Config = accountId && accessKeyId && secretAccessKey && r2Bucket && r2PublicBaseUrl;

const r2Client = hasR2Config ? new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
}) : null;

// UUID v4 generator
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'number') return str;
  return `'${str.replace(/'/g, "''")}'`;
}

// Store SQL commands to batch execute later or execute one by one
const sqlCommands = [];

function addSql(sql) {
  sqlCommands.push(sql);
}

// We will write SQL to a temporary file
const tempSqlFile = path.join(__dirname, "temp_seed.sql");

async function executeSqlBatch(isLocal = true) {
  console.log(`Executing ${sqlCommands.length} SQL commands...`);
  const sqlContent = sqlCommands.join(";\n") + ";";
  fs.writeFileSync(tempSqlFile, sqlContent);

  try {
    const flag = isLocal ? "--local" : "--remote";
    // We assume the DB name is "mijnkot" based on wrangler.toml
    const dbName = "mijnkot"; 
    // Execute using wrangler
    execSync(`npx wrangler d1 execute ${dbName} ${flag} --file="${tempSqlFile}"`, { stdio: 'inherit' });
    console.log("SQL executed successfully.");
  } catch (error) {
    console.error("Failed to execute SQL:", error.message);
  } finally {
    if (fs.existsSync(tempSqlFile)) {
      fs.unlinkSync(tempSqlFile);
    }
  }
}

async function uploadFile(kotId, filePath, orderIndex, mediaAssetId) {
    if (!r2Client) {
      console.log(`Skipping upload for ${path.basename(filePath)} (R2 not configured)`);
      return;
    }
  
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath);
    const ext = path.extname(fileName).toLowerCase();
    let mimeType = "application/octet-stream";
    if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
    if (ext === ".png") mimeType = "image/png";
    if (ext === ".webp") mimeType = "image/webp";

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
  
      // Generate SQL for media asset and kot photo
      addSql(`INSERT INTO media_assets (id, r2_key, public_url, file_name, mime_type, size_bytes) VALUES ('${mediaAssetId}', '${key}', '${publicUrl}', '${fileName}', '${mimeType}', ${sizeBytes})`);
      addSql(`INSERT INTO kot_photos (kot_id, image_url, order_index, media_asset_id) VALUES ('${kotId}', '${publicUrl}', ${orderIndex}, '${mediaAssetId}')`);
      
    } catch (err) {
      console.error(`Failed to upload ${fileName}:`, err.message);
    }
  }

async function main() {
    // Check if we are running local or remote
    const isLocal = !process.argv.includes("--remote");
    console.log(`Seeding ${isLocal ? "LOCAL" : "REMOTE"} D1 database...`);

    // Clean up old data
    const tables = ["availability_history", "kot_photos", "media_assets", "koten", "user_vestigingen", "vestigingen", "faq_items", "site_settings", "users"];
    // Reversed order of deletion to avoid FK constraints issues if any
    for (const t of tables) {
        // D1 doesn't support "TRUNCATE", use DELETE
        addSql(`DELETE FROM ${t}`); 
    }

    // Admin
    const adminId = uuidv4();
    const hash = await hashPassword(adminPassword);
    // Since we cleared users, we just insert.
    addSql(`INSERT INTO users (id, email, full_name, password_hash, role) VALUES ('${adminId}', '${adminEmail}', 'Admin', '${hash}', 'super_admin')`);
    
    // Site Settings
    const settingsId = uuidv4();
    addSql(`INSERT INTO site_settings (id, hero_title, hero_title_en, hero_subtitle, hero_subtitle_en, hero_cta_label, hero_cta_label_en, hero_cta_href, contact_email, contact_phone, contact_address) VALUES 
      ('${settingsId}', 
      'Vind een studentenkot dat voelt als thuis', 
      'Find a student room that feels like home', 
      'Wij selecteren kwalitatieve koten in heel België met transparante prijzen, geverifieerde verhuurders en locaties dicht bij het campusleven.', 
      'We curate high-quality koten across Belgium with transparent pricing, verified landlords, and locations that keep you close to campus life.', 
      'Bekijk vestigingen', 
      'Explore locations', 
      '/vestigingen', 
      'hello@mijn-kot.be', 
      '+32 2 555 1234', 
      'Wetstraat 88, 1040 Brussel')`);

    // Vestigingen
    const vestigingenData = [
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

    const vestigingIds = [];
    for(const v of vestigingenData) {
        const vid = uuidv4();
        vestigingIds.push({ ...v, id: vid });
        addSql(`INSERT INTO vestigingen (id, name, address, city, postal_code, description, description_en) VALUES ('${vid}', ${escapeSql(v.name)}, ${escapeSql(v.address)}, ${escapeSql(v.city)}, ${escapeSql(v.postal_code)}, ${escapeSql(v.description)}, ${escapeSql(v.description_en)})`);
        // Link to admin
        const uvId = uuidv4();
        addSql(`INSERT INTO user_vestigingen (id, user_id, vestiging_id) VALUES ('${uvId}', '${adminId}', '${vid}')`);
    }

    // Koten
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
    
      let counter = 1;
      const createdKoten = [];

      for (const vestiging of vestigingIds) {
        for (let i = 0; i < 5; i += 1) {
          const tpl = kotTemplates[(counter - 1) % kotTemplates.length];
          const price = 360 + (counter % 8) * 35;
          const kId = uuidv4();
          
          const kotTitle = `${tpl.title} ${counter}`;
          const k = {
            id: kId,
            vestiging_id: vestiging.id,
            title: kotTitle,
            title_en: `${tpl.title_en} ${counter}`,
            description: tpl.description,
            description_en: tpl.description_en,
            price,
            availability_status: availability[counter % availability.length],
            status: statuses[counter % statuses.length]
          };
          createdKoten.push(k);
          
          addSql(`INSERT INTO koten (id, vestiging_id, title, title_en, description, description_en, price, availability_status, status) VALUES 
            ('${k.id}', '${k.vestiging_id}', ${escapeSql(k.title)}, ${escapeSql(k.title_en)}, ${escapeSql(k.description)}, ${escapeSql(k.description_en)}, ${k.price}, '${k.availability_status}', '${k.status}')`);
          
          counter += 1;
        }
      }

      // FAQs
      const faqs = [
        { q: "Hoe boek ik een bezichtiging?", q_en: "How do I book a viewing?", a: "Ga naar de detailpagina...", a_en: "Go to the detail page...", cat: "Beginnen" },
        { q: "Is internet inbegrepen?", q_en: "Is internet included?", a: "Ja, elk kot heeft snel internet.", a_en: "Yes, every room has fast internet.", cat: "Betalingen" },
      ];
      
      for (let i=0; i<faqs.length; i++) {
          const f = faqs[i];
          addSql(`INSERT INTO faq_items (id, question, question_en, answer, answer_en, category, order_index) VALUES ('${uuidv4()}', ${escapeSql(f.q)}, ${escapeSql(f.q_en)}, ${escapeSql(f.a)}, ${escapeSql(f.a_en)}, '${f.cat}', ${i})`);
      }

      // Execute SQL before uploading photos to ensure FKs exist?
      // Actually D1 via wrangler might be slow if we do it in two batches, but R2 upload takes time.
      // We can upload photos first, generate SQL, then execute all SQL.
      
      // Images
      const kot1 = createdKoten.find(k => k.title === "Zonnige Studio 1");
      const kot2 = createdKoten.find(k => k.title === "Moderne Loft 2"); // Based on logic above

      if (kot1) {
         const kot1Dir = path.join(__dirname, "kot1");
         if (fs.existsSync(kot1Dir)) {
             const files = fs.readdirSync(kot1Dir);
             for (let i=0; i<files.length; i++) {
                 const mediaAssetId = uuidv4();
                 await uploadFile(kot1.id, path.join(kot1Dir, files[i]), i, mediaAssetId);
             }
         }
      }

       if (kot2) {
         const kot2Dir = path.join(__dirname, "kot2");
         if (fs.existsSync(kot2Dir)) {
             const files = fs.readdirSync(kot2Dir);
             for (let i=0; i<files.length; i++) {
                 const mediaAssetId = uuidv4();
                 await uploadFile(kot2.id, path.join(kot2Dir, files[i]), i, mediaAssetId);
             }
         }
      }

    // Now execute all SQL
    await executeSqlBatch(isLocal);
}

main();
