const fs = require('fs');
const path = require('path');

const files = [
  "total_reset.sql",
  "src/types.ts",
  "src/shared/ui/vestiging-card.tsx",
  "src/shared/ui/site-nav.tsx",
  "src/shared/ui/lead-capture-modal.tsx",
  "src/shared/ui/detail-components.tsx",
  "src/shared/ui/contact-view.tsx",
  "src/shared/lib/queries.ts",
  "src/shared/lib/email.ts",
  "src/shared/emails/contact-template.ts",
  "src/app/api/send-email/route.tsx",
  "src/app/api/r2/upload/route.ts",
  "src/app/api/cms/settings/route.ts",
  "src/app/admin/vestigingen/page.tsx",
  "src/app/admin/vestigingen/[id]/page.tsx",
  "src/app/admin/settings/page.tsx",
  "src/app/admin/koten/new/page.tsx"
];

let changedFiles = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to match git conflict markers and keep HEAD:
  // Using [\s\S]*? to lazily match multiline contents
  const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [a-f0-9]+\r?\n/g;
  
  const newContent = content.replace(regex, '$1');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Resolved: ${file}`);
    changedFiles++;
  }
});

console.log(`Finished. Resolved conflicts in ${changedFiles} files.`);
