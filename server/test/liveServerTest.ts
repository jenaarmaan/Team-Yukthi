import { startServer } from '../server.ts';
import { runPhase2Verification } from './verifyPhase2.ts';
import { runPhase3Verification } from './verifyPhase3.ts';

async function main() {
  console.log('Starting NIYOJAN test runner with in-process server...');
  const server = await startServer();
  console.log('Server started, running verification suites...');

  try {
    // 1. Health check probe
    const healthRes = await fetch('http://127.0.0.1:3000/api/v1/health');
    const healthJson = await healthRes.json();
    console.log('Health Endpoint:', JSON.stringify(healthJson, null, 2));

    const dbHealthRes = await fetch('http://127.0.0.1:3000/api/v1/health/database');
    const dbHealthJson = await dbHealthRes.json();
    console.log('Database Health Endpoint:', JSON.stringify(dbHealthJson, null, 2));

    // 2. Run Phase 2
    const p2 = await runPhase2Verification();
    console.log('Phase 2 Summary:', p2.summary);

    // 3. Run Phase 3
    const p3 = await runPhase3Verification();
    console.log('Phase 3 Summary:', p3.summary);
  } finally {
    server.close();
    console.log('Server gracefully closed.');
  }
}

main().catch((err) => {
  console.error('Error in runner:', err);
  process.exit(1);
});
