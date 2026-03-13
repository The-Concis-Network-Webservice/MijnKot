import fs from 'fs';
import path from 'path';

async function testUpload() {
  try {
    const filePath = 'large-file.bin';
    const fileContent = fs.readFileSync(filePath);

    // Send the raw binary file content directly in the body
    const res = await fetch('http://127.0.0.1:3001/api/r2/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Pretend it's json mime type for this specific file
        'X-File-Name': encodeURIComponent('test-package.json'),
        'X-Mime-Type': 'application/json',
        'X-Bypass-Auth': 'true'
      },
      body: fileContent
    });
    
    console.log('Status:', res.status);
    console.log('Headers:', res.headers.get('content-type'));
    const text = await res.text();
    console.log('Raw Body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testUpload();
