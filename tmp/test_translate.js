
async function test() {
    try {
        const res = await fetch('http://localhost:3001/api/cms/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Hallo Wereld' })
        });
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response text:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}
test();
