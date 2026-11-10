const http = require('http');

function postRequest(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { resolve(body); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getRequest(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    http.get({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      headers
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { resolve(body); }
      });
    }).on('error', reject);
  });
}

async function testAuthAndNotifications() {
  console.log('=== 1. REAL AUTHENTICATION WITH REAL DEV OTP ===');
  
  // A. Customer-Only Account: +919876543210
  const custChallenge = await postRequest('http://localhost:4000/api/v1/auth/otp/send', { phoneNumber: '+919876543210', purpose: 'LOGIN' });
  const custChallengeId = custChallenge?.data?.challengeId;
  const custOtp = custChallenge?.data?.devOtp;
  const custVerify = await postRequest('http://localhost:4000/api/v1/auth/otp/verify', { challengeId: custChallengeId, otp: custOtp });
  const custToken = custVerify.data?.tokens?.accessToken || custVerify.data?.accessToken;
  const custUser = custVerify.data?.user;
  console.log('CUSTOMER USER:', { phone: custUser?.phoneNumber, roles: custUser?.roles, hasToken: !!custToken });

  // B. Partner-Only Account: +919988776655
  const partChallenge = await postRequest('http://localhost:4000/api/v1/auth/otp/send', { phoneNumber: '+919988776655', purpose: 'LOGIN' });
  const partChallengeId = partChallenge?.data?.challengeId;
  const partOtp = partChallenge?.data?.devOtp;
  const partVerify = await postRequest('http://localhost:4000/api/v1/auth/otp/verify', { challengeId: partChallengeId, otp: partOtp });
  const partToken = partVerify.data?.tokens?.accessToken || partVerify.data?.accessToken;
  const partUser = partVerify.data?.user;
  console.log('PARTNER USER:', { phone: partUser?.phoneNumber, roles: partUser?.roles, hasToken: !!partToken });

  console.log('\n=== 2. STRICT BACKEND ROLE-BASED ISOLATION TEST ===');
  
  // Test 1: Customer requests merchant notifications -> Backend security must override to customer feed
  const custTryMerch = await getRequest('http://localhost:4000/api/v1/notifications?role=merchant', custToken);
  console.log('Test 1: Customer requests role=merchant:');
  console.log('   Effective role enforced by API. Items count:', custTryMerch.data?.length);
  console.log('   Notification types:', [...new Set(custTryMerch.data?.map(n => n.type))]);
  const containsPartnerLeads = custTryMerch.data?.some(n => n.type === 'LEAD_RECEIVED');
  console.log('   Contains partner leads (LEAD_RECEIVED)?', containsPartnerLeads, '(MUST BE FALSE)');

  // Test 2: Partner requests customer notifications -> Backend security must override to merchant feed
  const partTryCust = await getRequest('http://localhost:4000/api/v1/notifications?role=customer', partToken);
  console.log('\nTest 2: Partner requests role=customer:');
  console.log('   Effective role enforced by API. Items count:', partTryCust.data?.length);
  console.log('   Notification types:', [...new Set(partTryCust.data?.map(n => n.type))]);
  const containsCustomerPromos = partTryCust.data?.some(n => n.type === 'QUOTE_RECEIVED' || n.type === 'OFFER_ALERT');
  console.log('   Contains customer quotes/offers?', containsCustomerPromos, '(MUST BE FALSE)');

  console.log('\n=== 3. UNREAD COUNTS & DATABASE PERSISTENCE ===');
  const custCounts = await getRequest('http://localhost:4000/api/v1/notifications/counts', custToken);
  console.log('Customer Unread Counts from Database:', custCounts.data);

  const partCounts = await getRequest('http://localhost:4000/api/v1/notifications/counts', partToken);
  console.log('Partner Unread Counts from Database:', partCounts.data);

  if (partTryCust.data && partTryCust.data[0]) {
    const itemToMark = partTryCust.data[0];
    console.log(`\nTesting mark read on partner notification: ${itemToMark.id} (Initial is_read: ${itemToMark.is_read})`);
    const markRes = await postRequest(`http://localhost:4000/api/v1/notifications/${itemToMark.id}/read`, {});
    console.log('Mark Read API Response:', markRes);
  }

  return { custUser, custToken, partUser, partToken };
}

testAuthAndNotifications().catch(console.error);
