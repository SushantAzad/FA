import { createServer } from 'vite';
import { startLocalChain } from './local.mjs';
import { createBlockchainApp } from '../server/blockchain-app.mjs';
import { projectRoot } from './compile.mjs';

let chain, api, frontend;
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await frontend?.close();
  if (api?.listening) await new Promise(resolve => api.close(resolve));
  await chain?.close();
}
try {
  chain = await startLocalChain();
  api = createBlockchainApp(chain);
  await new Promise((resolve, reject) => { api.once('error', reject); api.listen(4029, '127.0.0.1', resolve); });
  frontend = await createServer({ root: projectRoot, server: { host: '127.0.0.1', port: 4030, strictPort: true } });
  await frontend.listen();
  console.log('\nFractionalAsset blockchain app: http://127.0.0.1:4030');
  console.log('Local RPC: http://127.0.0.1:8545 | Chain ID: 31337');
  console.log('Local test accounts are public development accounts with valueless ETH.');
  process.on('SIGINT', () => stop().then(() => process.exit(0)));
  process.on('SIGTERM', () => stop().then(() => process.exit(0)));
} catch (error) {
  console.error(error.message);
  await stop();
  process.exitCode = 1;
}
