const { spawn } = require('child_process');

console.log('[Mobile] Starting Next.js Web Simulator (3002) and Expo Metro Bundler (8081) in parallel...');

const nextProc = spawn('npx', ['next', 'dev', '-p', '3002'], {
  stdio: 'inherit',
  shell: true
});

const expoProc = spawn('npx', ['expo', 'start', '-c'], {
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  try { nextProc.kill(); } catch (e) {}
  try { expoProc.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
