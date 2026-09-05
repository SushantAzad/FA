import { startLocalChain } from '../blockchain/local.mjs';
import { createBlockchainApp } from './blockchain-app.mjs';

const chain = await startLocalChain();
const server = createBlockchainApp(chain);
server.on('error', async error => { console.error(error.message); await chain.close(); process.exitCode = 1; });
server.listen(4029, '127.0.0.1', () => console.log('Blockchain API listening on http://127.0.0.1:4029. Start the frontend on port 4030.'));
process.on('SIGINT', () => server.close(async () => { await chain.close(); process.exit(0); }));
