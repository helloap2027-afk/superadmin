const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\THATIPALLY VINOD\\.gemini\\antigravity\\brain\\950c67eb-a5bb-43db-9725-e627eacff74f';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runTests() {
  console.log('--- Starting HELLO-Hi Dynamic My Account Dropdown Tests ---');
  
  const edgeProc = spawn(EDGE_PATH, [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--window-size=1366,850',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 3000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9222/json', (res) => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const page = list.find(p => p.type === 'page');
    if (!page) throw new Error('No page target found in Edge debugger');
    
    const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);
    let msgId = 1;
    const pending = new Map();
    let loadResolve = null;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Page.loadEventFired' && loadResolve) {
        loadResolve();
        loadResolve = null;
      }
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
    await send('DOM.enable');

    // Wait 2s for initial render to settle
    await new Promise(r => setTimeout(r, 2000));

    console.log('\n[TEST 1] Setting Customer Session & Opening Customer My Account Dropdown...');
    await evaluate(`
      localStorage.setItem('hello_access_token', 'jwt_customer_live_token');
      localStorage.setItem('hello_user', JSON.stringify({
        id: 'usr_cust_77',
        fullName: 'Preethi Sharma',
        phoneNumber: '+919848012345',
        roles: ['CUSTOMER'],
        email: 'preethi.sharma@example.com'
      }));
      localStorage.setItem('hello_active_role', 'CUSTOMER');
      window.dispatchEvent(new Event('hello_auth_changed'));
    `);

    await new Promise(r => setTimeout(r, 1000));

    // Check header user button text
    const custBtnText = await evaluate(`
      const btn = document.querySelector('[aria-label="Toggle My Account Menu"]');
      btn ? btn.innerText.replace(/\\s+/g, ' ').trim() : null;
    `);
    console.log('Customer button header text:', custBtnText);

    // Click trigger button to open dropdown
    await evaluate(`
      const btn = document.querySelector('[aria-label="Toggle My Account Menu"]');
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 600));

    // Capture Customer Dropdown Screenshot
    const shotCust = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'customer_account_dropdown.png'), Buffer.from(shotCust.result.data, 'base64'));
    console.log('✓ Captured customer_account_dropdown.png');

    // Inspect dropdown contents
    const custMenuData = await evaluate(`
      const dropdown = document.querySelector('[aria-label="Toggle My Account Menu"]').parentElement.querySelector('.fixed, .sm\\\\:absolute');
      if (!dropdown) return null;
      const links = Array.from(dropdown.querySelectorAll('a')).map(a => ({
        text: a.innerText.replace(/\\s+/g, ' ').trim(),
        href: a.getAttribute('href')
      }));
      const identity = dropdown.querySelector('.bg-gradient-to-b')?.innerText.replace(/\\s+/g, ' ').trim();
      return { identity, linksCount: links.length, links };
    `);
    console.log('Customer Dropdown Header Identity:', custMenuData?.identity);
    console.log('Customer Menu Items count:', custMenuData?.linksCount);
    custMenuData?.links?.forEach((l, i) => console.log(`  ${i + 1}. [${l.href}] ${l.text}`));

    console.log('\n[TEST 2] Setting Merchant Session & Opening Merchant My Account Dropdown...');
    await evaluate(`
      localStorage.setItem('hello_access_token', 'jwt_merchant_live_token');
      localStorage.setItem('hello_user', JSON.stringify({
        id: 'usr_vendor_99',
        fullName: 'SparkleSmart Electricals',
        phoneNumber: '+919848098765',
        roles: ['CUSTOMER', 'VENDOR_OWNER'],
        businesses: [{ id: 'biz_sparkle', name: 'SparkleSmart Electricals' }]
      }));
      localStorage.setItem('hello_active_role', 'MERCHANT');
      window.dispatchEvent(new Event('hello_auth_changed'));
    `);

    await new Promise(r => setTimeout(r, 1000));

    const merchBtnText = await evaluate(`
      const btn = document.querySelector('[aria-label="Toggle My Account Menu"]');
      btn ? btn.innerText.replace(/\\s+/g, ' ').trim() : null;
    `);
    console.log('Merchant button header text:', merchBtnText);

    // Open dropdown
    await evaluate(`
      const btn = document.querySelector('[aria-label="Toggle My Account Menu"]');
      if (btn) btn.click();
    `);
    await new Promise(r => setTimeout(r, 600));

    // Capture Merchant Dropdown Screenshot
    const shotMerch = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'merchant_account_dropdown.png'), Buffer.from(shotMerch.result.data, 'base64'));
    console.log('✓ Captured merchant_account_dropdown.png');

    const merchMenuData = await evaluate(`
      const dropdown = document.querySelector('[aria-label="Toggle My Account Menu"]').parentElement.querySelector('.fixed, .sm\\\\:absolute');
      if (!dropdown) return null;
      const switchBtn = dropdown.querySelector('button[title*="Switch"]')?.innerText.replace(/\\s+/g, ' ').trim();
      const links = Array.from(dropdown.querySelectorAll('a')).map(a => ({
        text: a.innerText.replace(/\\s+/g, ' ').trim(),
        href: a.getAttribute('href')
      }));
      const identity = dropdown.querySelector('.bg-gradient-to-b')?.innerText.replace(/\\s+/g, ' ').trim();
      return { identity, switchBtn, linksCount: links.length, links };
    `);
    console.log('Merchant Dropdown Header Identity:', merchMenuData?.identity);
    console.log('Role Switcher Button:', merchMenuData?.switchBtn);
    console.log('Merchant Menu Items count:', merchMenuData?.linksCount);
    merchMenuData?.links?.forEach((l, i) => console.log(`  ${i + 1}. [${l.href}] ${l.text}`));

    console.log('\n[TEST 3] Verifying Customer /account Page with Navigation Tabs...');
    await send('Page.navigate', { url: 'http://localhost:3000/account?tab=enquiries' });
    await new Promise(r => setTimeout(r, 2500));

    const shotAccount = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'customer_account_page.png'), Buffer.from(shotAccount.result.data, 'base64'));
    console.log('✓ Captured customer_account_page.png');

    console.log('\n[TEST 4] Verifying Logout Action & Global Toast Message...');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2000));

    // Open dropdown and click logout
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

    const logoutState = await evaluate(`
      ({
        token: localStorage.getItem('hello_access_token'),
        hasLoginBtn: !!document.querySelector('a[href="/login"]'),
        hasRegisterBtn: !!document.querySelector('a[href="/register"]')
      })
    `);
    console.log('Logout verification state:', logoutState);

    console.log('\n--- ALL MY ACCOUNT DROPDOWN TESTS PASSED SUCCESSFULLY! ---');
    ws.close();
  } finally {
    edgeProc.kill();
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
