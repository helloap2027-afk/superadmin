const puppeteer = require('puppeteer-core');
const outDir = 'C:/Users/THATIPALLY VINOD/.gemini/antigravity/brain/950c67eb-a5bb-43db-9725-e627eacff74f';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();

  // 1. Login mode — role selection
  await page.goto('http://localhost:3000/login?mode=login', { waitUntil: 'networkidle2', timeout: 20000 });
  await page.screenshot({ path: outDir + '/login_role_select.png' });
  console.log('Shot 1: login role select');

  // 2. Register mode — role selection
  await page.goto('http://localhost:3000/login?mode=register', { waitUntil: 'networkidle2', timeout: 20000 });
  await page.screenshot({ path: outDir + '/register_role_select.png' });
  console.log('Shot 2: register role select');

  // 3. Mobile — login mode
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/login?mode=login', { waitUntil: 'networkidle2', timeout: 20000 });
  await page.screenshot({ path: outDir + '/login_mobile_role.png' });
  console.log('Shot 3: mobile login role select');

  // 4. Click "Customer" card → OTP form step
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/login?mode=login', { waitUntil: 'networkidle2', timeout: 20000 });
  // Click first button with "Customer" text
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const customerBtn = btns.find(b => b.textContent.includes('Continue as Customer'));
    if (customerBtn) customerBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: outDir + '/login_customer_otp.png' });
  console.log('Shot 4: customer OTP form');

  // 5. Business Partner card → OTP form step
  await page.goto('http://localhost:3000/login?mode=login', { waitUntil: 'networkidle2', timeout: 20000 });
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const partnerBtn = btns.find(b => b.textContent.includes('Continue as Business Partner'));
    if (partnerBtn) partnerBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: outDir + '/login_partner_otp.png' });
  console.log('Shot 5: business partner OTP form');

  await browser.close();
  console.log('ALL DONE');
})().catch(e => { console.error(e); process.exit(1); });

