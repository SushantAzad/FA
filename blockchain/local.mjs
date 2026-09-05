import ganache from 'ganache';
import { ContractFactory, Contract, JsonRpcProvider, parseEther } from 'ethers';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildArtifact, projectRoot } from './compile.mjs';

export async function startLocalChain({ dataDir = resolve(projectRoot, 'blockchain/data'), port = 8545 } = {}) {
  const artifact = buildArtifact();
  mkdirSync(dataDir, { recursive: true });
  // Public development accounts. Never use these accounts on a public network.
  const chain = ganache.server({
    chain: { chainId: 31337, networkId: 31337, hardfork: 'shanghai' },
    wallet: { deterministic: true, totalAccounts: 5, defaultBalance: 1000 },
    database: { dbPath: resolve(dataDir, 'chain') },
    logging: { quiet: true },
    server: { ws: false },
  });
  await chain.listen(port, '127.0.0.1');
  const provider = new JsonRpcProvider(`http://127.0.0.1:${chain.address().port}`, undefined, { cacheTimeout: -1 });
  provider.pollingInterval = 200;
  try {
    const admin = await provider.getSigner(0);
    const deploymentFile = resolve(dataDir, 'deployment.json');
    let deployment = existsSync(deploymentFile) ? JSON.parse(readFileSync(deploymentFile, 'utf8')) : null;
    if (deployment && deployment.bytecode !== artifact.bytecode) {
      throw new Error('Contract source changed. Use a new blockchain/data directory (back up the existing local chain first) to deploy the updated contract.');
    }
    if (deployment && await provider.getCode(deployment.address) === '0x') throw new Error('Saved deployment is missing from the chain. Restore its matching chain data.');
    if (!deployment) {
      const contract = await new ContractFactory(artifact.abi, artifact.bytecode, admin).deploy(await admin.getAddress());
      await contract.waitForDeployment();
      const receipt = await contract.deploymentTransaction().wait();
      deployment = { address: await contract.getAddress(), blockNumber: receipt.blockNumber, bytecode: artifact.bytecode };
      writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2));
      console.log('Deployed FractionalProperty: ' + deployment.address);
    }
    const contract = new Contract(deployment.address, artifact.abi, admin);
    // Seed a real on-chain demonstration listing once, never fabricated holdings or transactions.
    if (await contract.propertyCount() === 0n) {
      await (await contract.listProperty('Demo property — local chain', 'Sample location, New Delhi', '', 1000, parseEther('0.01'))).wait();
      await (await contract.setApproved(1, true)).wait();
    }
    const accounts = await provider.send('eth_accounts', []);
    return {
      config: { chainId: 31337, chainName: 'FractionalAsset Local', currency: 'ETH', local: true, address: deployment.address, deploymentBlock: deployment.blockNumber, admin: await contract.owner(), accounts, abi: artifact.abi },
      provider,
      close: async () => { provider.destroy(); await chain.close(); },
    };
  } catch (error) { provider.destroy(); await chain.close(); throw error; }
}
