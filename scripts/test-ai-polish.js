// Simple test script for AI text polishing endpoint
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
function loadEnv() {
  const envFiles = [".env", ".env.local"];
  envFiles.forEach(file => {
    const envPath = path.join(__dirname, "..", file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      content.split("\n").forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["'](.*)["']$/, "$1");
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  });
}

loadEnv();

const testText = `Dit is een kot in Leuven. Het heeft een bed en een bureau. Er is ook een keuken. Goede locatie dicht bij de campus.`;

console.log('\n🧪 Testing AI Text Polishing API\n');
console.log('Input text:', testText);
console.log('Length:', testText.length, 'characters\n');

async function testAPI() {
  try {
    console.log('Calling endpoint: http://localhost:3000/api/ai/polish-description');
    
    const response = await fetch('http://localhost:3000/api/ai/polish-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In real app, this would include auth cookies
      },
      body: JSON.stringify({
        text: testText,
        language: 'nl-BE',
        tone: 'professioneel-wervend',
        maxLength: 900,
        kotMeta: {
          title: 'Test Kot',
          city: 'Leuven'
        }
      })
    });

    console.log('Status:', response.status, response.statusText);

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error response:', error);
      return;
    }

    const data = await response.json();
    
    console.log('\n✅ Success!\n');
    console.log('Polished Text:');
    console.log('─'.repeat(80));
    console.log(data.polishedText);
    console.log('─'.repeat(80));
    console.log('\nMetadata:');
    console.log('  Model:', data.model);
    console.log('  Cached:', data.cached);
    console.log('  Input tokens:', data.usage?.inputTokens || 0);
    console.log('  Output tokens:', data.usage?.outputTokens || 0);
    console.log('  Total tokens:', (data.usage?.inputTokens || 0) + (data.usage?.outputTokens || 0));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
  }
}

testAPI();
