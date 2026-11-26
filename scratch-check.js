async function run() {
  const res = await fetch('https://pizza-hub-client-psi.vercel.app');
  const html = await res.text();
  const regex = /src="(\/_next\/static\/chunks\/[^"]+)"/g;
  let match;
  const scripts = [];
  while ((match = regex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  console.log('Scripts found:', scripts.length);
  for (const s of scripts) {
    const sRes = await fetch('https://pizza-hub-client-psi.vercel.app' + s);
    const code = await sRes.text();
    if (code.includes('localhost:5000')) {
      console.log('⚠️ ALERT: Found localhost:5000 in', s);
    }
    if (code.includes('pizza-hub-server-blond')) {
      console.log('✅ Found live server in', s);
    }
  }
}
run().catch(console.error);
