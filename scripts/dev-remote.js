import fs from 'fs';
import { spawn } from 'child_process';

const configPath = 'wrangler.toml';
const backupPath = 'wrangler.toml.bak';

const originalContent = fs.readFileSync(configPath, 'utf8');

// Ensure remote = true and R2 is present
const remoteContent = `name = "mijnkot"
compatibility_date = "2024-11-18"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

[[d1_databases]]
binding = "DB"
database_name = "mijnkot"
database_id = "b9ac4fff-b149-406e-9d20-92865e77cd11"
remote = true

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "mijnkot"
`;

// Backup
fs.writeFileSync(backupPath, originalContent);

// Swap to remote
fs.writeFileSync(configPath, remoteContent);

console.log('Switched to PRODUCTION database configuration.');

// Create dummy worker if needed
const workerDir = '.vercel/output/static/_worker.js';
const workerFile = `${workerDir}/index.js`;
if (!fs.existsSync(workerDir)) {
    fs.mkdirSync(workerDir, { recursive: true });
}
if (!fs.existsSync(workerFile)) {
    fs.writeFileSync(workerFile, 'export default { fetch: (r) => fetch(r) };');
}

const child = spawn('npx', ['wrangler', 'pages', 'dev', '.vercel/output/static', '--d1=DB=mijnkot', '--r2=BUCKET=mijnkot', '--port', '3000', '--proxy', '3001'], {
    stdio: 'inherit',
    shell: true
});

const restore = () => {
    if (fs.existsSync(backupPath)) {
        const backup = fs.readFileSync(backupPath, 'utf8');
        fs.writeFileSync(configPath, backup);
        fs.unlinkSync(backupPath);
        console.log('\nRestored local configuration.');
    }
};

process.on('SIGINT', () => {
    restore();
    process.exit();
});

process.on('SIGTERM', () => {
    restore();
    process.exit();
});

child.on('exit', (code) => {
    restore();
    process.exit(code || 0);
});
