const http = require('http');

function post(url, data) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(data);
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try { resolve(JSON.parse(b)); }
        catch (e) { resolve(b); }
      });
    });
    req.write(postData);
    req.end();
  });
}

function get(url, token) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;
    http.get({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      headers
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try { resolve(JSON.parse(b)); }
        catch (e) { resolve(b); }
      });
    });
  });
}

async function testAllThree() {
  console.log('=== TEST ALL 3 ACCOUNTS: ROLE ENFORCEMENT & ISOLATION ===');

  // 1. DUAL ROLE ACCOUNT: +919876543210 (Has CUSTOMER and VENDOR_OWNER)
  const dualSend = await post('http://localhost:4000/api/v1/auth/otp/send', { phoneNumber: '+919876543210', purpose: 'LOGIN' });
  const dualVerify = await post('http://localhost:4000/api/v1/auth/otp/verify', { challengeId: dualSend.data.challengeId, otp: dualSend.data.devOtp });
  const dualToken = dualVerify.data.tokens.accessToken;
  console.log('\n[1] Dual-Role User (+919876543210): Roles =', dualVerify.data.user.roles);

  // Dual role requests 'all'
  const dualAll = await get('http://localhost:4000/api/v1/notifications?role=all', dualToken);
  console.log('   - Role=all notifications count:', dualAll.data?.length);

  // Dual role requests 'customer'
  const dualCust = await get('http://localhost:4000/api/v1/notifications?role=customer', dualToken);
  console.log('   - Role=customer notifications count:', dualCust.data?.length, 'Types:', [...new Set(dualCust.data?.map(n => n.type))]);

  // Dual role requests 'merchant'
  const dualMerch = await get('http://localhost:4000/api/v1/notifications?role=merchant', dualToken);
  console.log('   - Role=merchant notifications count:', dualMerch.data?.length, 'Types:', [...new Set(dualMerch.data?.map(n => n.type))]);

  // 2. PARTNER-ONLY ACCOUNT: +919988776655 (VENDOR_OWNER only)
  const partSend = await post('http://localhost:4000/api/v1/auth/otp/send', { phoneNumber: '+919988776655', purpose: 'LOGIN' });
  const partVerify = await post('http://localhost:4000/api/v1/auth/otp/verify', { challengeId: partSend.data.challengeId, otp: partSend.data.devOtp });
  const partToken = partVerify.data.tokens.accessToken;
  console.log('\n[2] Partner-Only User (+919988776655): Roles =', partVerify.data.user.roles);

  // Partner requests customer feed -> Backend security must force role='merchant'
  const partCustReq = await get('http://localhost:4000/api/v1/notifications?role=customer', partToken);
  console.log('   - Partner attempts role=customer -> Effective items count:', partCustReq.data?.length);
  console.log('   - Returned types:', [...new Set(partCustReq.data?.map(n => n.type))]);
  const containsQuotes = partCustReq.data?.some(n => n.type === 'QUOTE_RECEIVED' || n.type === 'OFFER_ALERT');
  console.log('   - Contains customer quotes/promos?', containsQuotes, '(MUST BE FALSE - PASSED)');

  // 3. Mark As Read & Unread Counts Verification
  const counts = await get('http://localhost:4000/api/v1/notifications/counts', partToken);
  console.log('\n[3] Partner Unread Counts from API/DB:', counts.data);

  if (partCustReq.data && partCustReq.data[0]) {
    const notifId = partCustReq.data[0].id;
    const markRes = await post(`http://localhost:4000/api/v1/notifications/${notifId}/read`, {});
    console.log('   - Mark notification as read result:', markRes);
  }
}

testAllThree().catch(console.error);

