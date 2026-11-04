async function check() {
  const r = await fetch('http://127.0.0.1:3000');
  const text = await r.text();
  const match = text.match(/href="(\/_next\/static\/css\/[^"]+)"/);
  console.log('CSS match:', match ? match[1] : 'NONE');
  if (match) {
    const cssRes = await fetch('http://127.0.0.1:3000' + match[1]);
    console.log('Status:', cssRes.status, 'Type:', cssRes.headers.get('content-type'));
    const cssBody = await cssRes.text();
    console.log('Length:', cssBody.length, 'Preview:', cssBody.slice(0, 100));
  }
}
check().catch(console.error);

