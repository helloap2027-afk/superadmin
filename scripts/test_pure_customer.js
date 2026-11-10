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

async function testScenarioA() {
  console.log('=== TEST SCENARIO A: PURE CUSTOMER-ONLY (+919123456789) ===');
  
  // Register or Login pure customer
  const custChallenge = await postRequest('http://localhost:4000/api/v1/auth/otp/send', { 
    phoneNumber: '+919123456789', 
    purpose: 'LOGIN',
    role: 'CUSTOMER'
  });
  const custChallengeId = custChallenge?.data?.challengeId;
  const custOtp = custChallenge?.data?.devOtp;
  const custVerify = await postRequest('http://localhost:4000/api/v1/auth/otp/verify', { challengeId: custChallengeId, otp: custOtp });
  const custToken = custVerify.data?.tokens?.accessToken || custVerify.data?.accessToken;
  const custUser = custVerify.data?.user;
  console.log('Customer-Only User:', { phone: custUser?.phoneNumber, roles: custUser?.roles, hasToken: !!custToken });

  // Pure Customer requests role=merchant
  const res = await getRequest('http://localhost:4000/api/v1/notifications?role=merchant', custToken);
  console.log('Customer requesting role=merchant results:');
  console.log('   Effective audience enforced by backend. Types:', [...new Set(res.data?.map(n => n.type))]);
  console.log('   Contains partner leads (LEAD_RECEIVED)?', res.data?.some(n => n.type === 'LEAD_RECEIVED'), '(MUST BE FALSE)');

  return { custUser, custToken };
}

testScenarioA().catch(console.error);

