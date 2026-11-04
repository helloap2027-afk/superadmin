const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request('http://127.0.0.1:4000' + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(d) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function testOtp() {
  const phone = '+919848012345';
  console.log('Sending OTP to', phone);
  const sendRes = await post('/api/v1/auth/otp/send', { phoneNumber: phone });
  console.log('Send OTP res:', sendRes);

  const otp = sendRes.data.data?.devOtp;
  const challengeId = sendRes.data.data?.challengeId;
  console.log('Verifying challengeId:', challengeId, 'with code:', otp);
  const verifyRes = await post('/api/v1/auth/otp/verify', { challengeId, otp });
  console.log('Verify res:', verifyRes);
}

testOtp().catch(console.error);
