/**
 * Phusion Passenger Startup Entrypoint for cPanel / WHM
 * Application: HELLO Public Website (hello-hi.in)
 */

if (typeof (PhusionPassenger) !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
}

// When Next.js builds with `output: 'standalone'`, it creates `.next/standalone/server.js`
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 3000;

try {
  require('./.next/standalone/server.js');
} catch (e) {
  // Development fallback
  const next = require('next');
  const http = require('http');
  const app = next({ dev: false });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    http.createServer((req, res) => handle(req, res)).listen(process.env.PORT);
  });
}

