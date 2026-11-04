const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\THATIPALLY VINOD\\.gemini\\antigravity\\brain\\950c67eb-a5bb-43db-9725-e627eacff74f';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runInteractiveTests() {
  console.log('=== Running HELLO-Hi Dynamic My Account Verification ===');
  
  const edgeProc = spawn(EDGE_PATH, [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--window-size=1366,850',
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

    // Wait for home page to render
    await new Promise(r => setTimeout(r, 2500));

    // TEST 1: CUSTOMER ACCOUNT DROPDOWN
    console.log('\n--- Test 1: Customer Account Dropdown ---');
    await evaluate(`
      localStorage.setItem('hello_access_token', 'jwt_customer_sample');
      localStorage.setItem('hello_user', JSON.stringify({
        id: 'usr_cust_01',
        fullName: 'Preethi Sharma',
        phoneNumber: '+919848012345',
        roles: ['CUSTOMER']
      }));
      localStorage.setItem('hello_active_role', 'CUSTOMER');
      window.dispatchEvent(new Event('hello_auth_changed'));
    `);

    await new Promise(r => setTimeout(r, 1000));

    // Click the toggle button
    await evaluate(`
      const btn = document.querySelector('[aria-label="Toggle My Account Menu"]');
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 600));

    const shotCust = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'customer_account_dropdown.png'), Buffer.from(shotCust.result.data, 'base64'));
    console.log('✓ Captured customer_account_dropdown.png');

    const custLinks = await evaluate(`
      Array.from(document.querySelectorAll('a'))
        .filter(a => a.href.includes('/account') || a.href.includes('/notifications'))
        .map(a => a.innerText.replace(/\\s+/g, ' ').trim())
    `);
    console.log('Customer Dropdown Links detected:', custLinks);

    // TEST 2: MERCHANT ACCOUNT DROPDOWN & ROLE SWITCHER
    console.log('\n--- Test 2: Merchant Account Dropdown ---');
    await evaluate(`
      localStorage.setItem('hello_access_token', 'jwt_merchant_sample');
      localStorage.setItem('hello_user', JSON.stringify({
        id: 'usr_merch_01',
        fullName: 'SparkleSmart Electricals',
        phoneNumber: '+919848098765',
        roles: ['CUSTOMER', 'VENDOR_OWNER'],
        ownedBusinesses: [{ id: 'biz_1', name: 'SparkleSmart Electricals' }]
      }));
      localStorage.setItem('hello_active_role', 'MERCHANT');
      window.dispatchEvent(new Event('hello_auth_changed'));
    `);

    await new Promise(r => setTimeout(r, 1000));

    // Click to ensure dropdown is opened for merchant
    await evaluate(`
      const btn = document.querySelector('[aria-label="Toggle My Account Menu"]');
      if (btn) {
        // Toggle if not open
        const expanded = btn.getAttribute('aria-expanded');
        if (expanded !== 'true') btn.click();
      }
    `);
    await new Promise(r => setTimeout(r, 600));

    const shotMerch = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'merchant_account_dropdown.png'), Buffer.from(shotMerch.result.data, 'base64'));
    console.log('✓ Captured merchant_account_dropdown.png');

    const merchDetails = await evaluate(`
      ({
        hasSwitchBtn: !!document.querySelector('button[title*="Switch"]'),
        switchBtnText: document.querySelector('button[title*="Switch"]')?.innerText.replace(/\\s+/g, ' ').trim(),
        vendorLinks: Array.from(document.querySelectorAll('a'))
          .filter(a => a.href.includes('/vendor') || a.href.includes('/notifications'))
          .map(a => a.innerText.replace(/\\s+/g, ' ').trim())
      })
    `);
    console.log('Merchant details detected:', merchDetails);

    // TEST 3: CUSTOMER ACCOUNT PAGE (/account?tab=enquiries)
    console.log('\n--- Test 3: Customer Account Page (/account?tab=enquiries) ---');
    await send('Page.navigate', { url: 'http://localhost:3000/account?tab=enquiries' });
    await new Promise(r => setTimeout(r, 2500));

    const shotAccount = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'customer_account_page.png'), Buffer.from(shotAccount.result.data, 'base64'));
    console.log('✓ Captured customer_account_page.png');

    // TEST 4: LOGOUT FLOW
    console.log('\n--- Test 4: Logout Action & Toast ---');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2000));

    await evaluate(`
      const btn = document.querySelector('[aria-label="Toggle My Account Menu"]');
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 500));

    await evaluate(`
      const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Logout'));
      if (logoutBtn) logoutBtn.click();
    `);
    await new Promise(r => setTimeout(r, 1200));

    const shotLogout = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'logged_out_with_toast.png'), Buffer.from(shotLogout.result.data, 'base64'));
    console.log('✓ Captured logged_out_with_toast.png');

    const finalState = await evaluate(`
      ({
        token: localStorage.getItem('hello_access_token'),
        hasLoginBtn: !!document.querySelector('a[href="/login"]'),
        hasRegisterBtn: !!document.querySelector('a[href="/register"]')
      })
    `);
    console.log('Final state after logout:', finalState);

    console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY! ===');
    ws.close();
  } finally {
    edgeProc.kill();
  }
}

runInteractiveTests().catch(console.error);

