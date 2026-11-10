const http = require('http');

const routes = [
  '/',
  '/notifications',
  '/about',
  '/faq',
  '/contact',
  '/terms',
  '/account',
  '/vendor/dashboard',
  '/vendor/profile',
  '/vendor/manage-business'
];

async function checkRoute(path) {
  return new Promise((resolve) => {
    http.get({
      host: 'localhost',
      port: 3000,
      path: path,
      headers: { 'User-Agent': 'Node-Checker' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasDesktopHeader = data.includes('Search Local. Connect Instant.') || data.includes('DesktopHeader');
        const hasPartnerHeader = data.includes('Business Partner Center') || data.includes('BusinessPartnerHeader');
        resolve({
          path,
          status: res.statusCode,
          hasDesktopHeader,
          hasPartnerHeader,
          htmlLength: data.length
        });
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function main() {
  console.log('Testing Header Standardization Across All Routes:');
  for (const r of routes) {
    const result = await checkRoute(r);
    console.log(result);
  }
}

main();

