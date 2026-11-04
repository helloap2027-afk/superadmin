const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\THATIPALLY VINOD\\.gemini\\antigravity\\brain\\950c67eb-a5bb-43db-9725-e627eacff74f';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testMobileViewport() {
  console.log('Testing mobile viewport for My Account dropdown...');
  const edgeProc = spawn(EDGE_PATH, [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9222/json', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = list.find(p => p.type === 'page');
    const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data);
        pending.delete(data.id);
      }
    };

    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        pending.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return res.result?.result?.value;
    }

    await send('Runtime.enable');
    await send('Page.enable');

    await new Promise(r => setTimeout(r, 2500));

    // Set Customer session
    await evaluate(`
      localStorage.setItem('hello_access_token', 'jwt_mobile_test');
      localStorage.setItem('hello_user', JSON.stringify({
        id: 'usr_mobile_01',
        fullName: 'Vinod Thatipally',
        phoneNumber: '+919848011111',
        roles: ['CUSTOMER']
      }));
      localStorage.setItem('hello_active_role', 'CUSTOMER');
      window.dispatchEvent(new Event('hello_auth_changed'));
    `);

    await new Promise(r => setTimeout(r, 800));

    // Open dropdown
    await evaluate(`
      const btn = document.querySelector('[aria-label="Toggle My Account Menu"]');
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 600));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'mobile_account_dropdown.png'), Buffer.from(shotMobile.result.data, 'base64'));
    console.log('✓ Captured mobile_account_dropdown.png');

    ws.close();
  } finally {
    edgeProc.kill();
  }
}

testMobileViewport().catch(console.error);

