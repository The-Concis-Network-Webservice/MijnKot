/**
 * Extract floor plan data from architectural PDF
 * Usage: node scripts/extract-floor-plan.js
 */
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PDF_PATH = join(__dirname, '..', 'public', 'OMV_2024130246_vergunde_plannen (3).pdf');
const OUTPUT_PATH = join(__dirname, 'building_data.json');

async function main() {
  console.log('Reading PDF:', PDF_PATH);
  const buf = readFileSync(PDF_PATH);
  const uint8 = new Uint8Array(buf);
  const parser = new PDFParse({ data: uint8 });
  const data = await parser.getText();

  console.log('\n=== PDF INFO ===');
  console.log('Pages:', data.total);
  console.log('Text length:', data.text.length);

  console.log('\n=== FULL TEXT ===');
  console.log(data.text);

  // Write full text for manual inspection
  writeFileSync(join(__dirname, 'pdf_text.txt'), data.text, 'utf8');
  console.log('\nFull text saved to scripts/pdf_text.txt');
}

main().catch(console.error);
