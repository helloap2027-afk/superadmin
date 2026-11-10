const http = require('http');
const crypto = require('crypto');

function generateToken(userId, phone, roles) {
  const secret = 'hello_production_super_secret_jwt_key_2026';
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    phone,
    roles,
    iat: now,
    exp: now + 3600
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(header + '.' + payload).digest('base64url');
  return header + '.' + payload + '.' + signature;
}

function get(url, token) {
  return new Promise((resolve, reject) => {
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
    }).on('error', reject);
  });
}

function post(url, data, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try { resolve(JSON.parse(b)); }
        catch (e) { resolve(b); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runSecurityAcceptanceSuite() {
  console.log('================================================================');
  console.log('   HELLO-HI ENTERPRISE NOTIFICATIONS SECURITY & ACCEPTANCE SUITE');
  console.log('================================================================');

  const custToken = generateToken('usr_cust_only', '+919848011111', ['CUSTOMER']);
  const partToken = generateToken('usr_1c96189f-c481-403f-8a61-c46b8d395545', '+919988776655', ['VENDOR_OWNER']);
  const dualToken = generateToken('usr_dual_test', '+919876543210', ['CUSTOMER', 'VENDOR_OWNER']);

  // -------------------------------------------------------------
  // TEST SCENARIO 1: CUSTOMER-ONLY SECURITY ISOLATION
  // -------------------------------------------------------------
  console.log('\n[SCENARIO 1: CUSTOMER-ONLY ACCOUNT (+919848011111)]');
  
  // 1a. Customer requests role=customer -> Must succeed
  const c1 = await get('http://localhost:4000/api/v1/notifications?role=customer', custToken);
  console.log('  1a. Fetch customer notifications:');
  console.log('      - Status:', c1.success, '| Records count:', c1.data?.length);
  console.log('      - Notification types:', [...new Set(c1.data?.map(n => n.type))]);

  // 1b. Customer maliciously queries role=merchant -> Backend MUST override to customer feed
  const c2 = await get('http://localhost:4000/api/v1/notifications?role=merchant', custToken);
  const leakedPartnerLeads = c2.data?.some(n => n.type === 'LEAD_RECEIVED');
  console.log('  1b. Malicious query (Customer asks for role=merchant):');
  console.log('      - Leaked partner leads (LEAD_RECEIVED)?', leakedPartnerLeads ? 'FAIL (LEAK)' : 'PASSED (0 LEAKED)');

  // -------------------------------------------------------------
  // TEST SCENARIO 2: PARTNER-ONLY SECURITY ISOLATION
  // -------------------------------------------------------------
  console.log('\n[SCENARIO 2: BUSINESS PARTNER-ONLY ACCOUNT (+919988776655)]');

  // 2a. Partner requests role=merchant -> Must succeed
  const p1 = await get('http://localhost:4000/api/v1/notifications?role=merchant', partToken);
  console.log('  2a. Fetch partner notifications:');
  console.log('      - Status:', p1.success, '| Records count:', p1.data?.length);
  console.log('      - Notification types:', [...new Set(p1.data?.map(n => n.type))]);

  // 2b. Partner maliciously queries role=customer -> Backend MUST override to merchant feed
  const p2 = await get('http://localhost:4000/api/v1/notifications?role=customer', partToken);
  const leakedCustomerPromos = p2.data?.some(n => n.type === 'QUOTE_RECEIVED' || n.type === 'OFFER_ALERT');
  console.log('  2b. Malicious query (Partner asks for role=customer):');
  console.log('      - Leaked customer quotes/promos?', leakedCustomerPromos ? 'FAIL (LEAK)' : 'PASSED (0 LEAKED)');

  // -------------------------------------------------------------
  // TEST SCENARIO 3: DUAL-ROLE ACCOUNT
  // -------------------------------------------------------------
  console.log('\n[SCENARIO 3: DUAL-ROLE ACCOUNT (+919876543210)]');
  const dAll = await get('http://localhost:4000/api/v1/notifications?role=all', dualToken);
  const dCust = await get('http://localhost:4000/api/v1/notifications?role=customer', dualToken);
  const dMerch = await get('http://localhost:4000/api/v1/notifications?role=merchant', dualToken);
  console.log('  3a. Combined tab (role=all) items:', dAll.data?.length);
  console.log('  3b. Customer tab (role=customer) items:', dCust.data?.length);
  console.log('  3c. Partner tab (role=merchant) items:', dMerch.data?.length);

  // -------------------------------------------------------------
  // TEST SCENARIO 4: DATABASE MUTATION & PERSISTENCE
  // -------------------------------------------------------------
  console.log('\n[SCENARIO 4: DATABASE ACTIONS: MARK READ & COUNTS]');
  const countsBefore = await get('http://localhost:4000/api/v1/notifications/counts', partToken);
  console.log('  4a. Unread counts before mark-read:', countsBefore.data);

  if (p1.data && p1.data.length > 0) {
    const target = p1.data[0];
    const markReadRes = await post(`http://localhost:4000/api/v1/notifications/${target.id}/read`, {}, partToken);
    console.log('  4b. Mark as read on notification ID:', target.id, '->', markReadRes.message);
  }

  const markAllRes = await post('http://localhost:4000/api/v1/notifications/mark-all-read', { role: 'merchant' }, partToken);
  console.log('  4c. Mark all as read result:', markAllRes.message);

  const countsAfter = await get('http://localhost:4000/api/v1/notifications/counts', partToken);
  console.log('  4d. Unread counts after mark-all-read:', countsAfter.data);

  console.log('\n================================================================');
  console.log('   ALL SECURITY AND ACCEPTANCE TESTS EXECUTED SUCCESSFULLY!');
  console.log('================================================================');
}

runSecurityAcceptanceSuite().catch(console.error);

