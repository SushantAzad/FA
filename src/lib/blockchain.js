import { BrowserProvider, Contract, JsonRpcProvider, formatEther, ZeroAddress } from 'ethers';

export function errorMessage(error) {
  if (error.code === 'ACTION_REJECTED' || error.code === 4001) return 'Transaction cancelled in your wallet. No action was confirmed.';
  return error.reason || error.shortMessage || error.message || 'Blockchain request failed.';
}

export async function loadChain() {
  const response = await fetch('/api/chain');
  if (!response.ok) throw new Error('Blockchain backend is not running. Start npm run dev:blockchain.');
  const config = await response.json();
  if (!config.address || !config.abi) throw new Error('Invalid deployment configuration. Start npm run dev:blockchain.');
  const provider = new JsonRpcProvider(new URL('/api/rpc', window.location.origin).href, undefined, { cacheTimeout: -1 });
  provider.pollingInterval = 500;
  try {
    if (Number((await provider.getNetwork()).chainId) !== config.chainId || await provider.getCode(config.address) === '0x') throw new Error('The configured contract is not deployed on this network.');
    return { config, provider, contract: new Contract(config.address, config.abi, provider) };
  } catch (error) { provider.destroy(); throw error; }
}

export async function connectBrowserWallet(chain) {
  if (!window.ethereum) throw new Error('No browser wallet found. Open this app in a browser with MetaMask, or use a local test account below.');
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new BrowserProvider(window.ethereum);
  if (Number((await provider.getNetwork()).chainId) !== chain.config.chainId) {
    provider.destroy();
    throw new Error(`Switch your wallet to chain ${chain.config.chainId}. Local RPC: http://127.0.0.1:8545.`);
  }
  return { signer: await provider.getSigner(), walletProvider: provider };
}

export async function readState(chain, account) {
  const { contract, provider, config } = chain;
  const blockTag = await provider.getBlockNumber();
  const count = Number(await contract.propertyCount({ blockTag }));
  if (count > 500) throw new Error('This development reader supports up to 500 properties. Add a paginated indexer for a larger deployment.');
  const properties = [];
  for (let first = 1; first <= count; first += 20) {
    properties.push(...await Promise.all(Array.from({ length: Math.min(20, count - first + 1) }, async (_, offset) => {
      const id = first + offset;
      const [p, supply, balance] = await Promise.all([
        contract.getProperty(id, { blockTag }), contract['totalSupply(uint256)'](id, { blockTag }),
        account ? contract.balanceOf(account, id, { blockTag }) : Promise.resolve(0n),
      ]);
      return { id, seller: p.seller, title: p.title, location: p.location, metadataURI: p.metadataURI, shareCap: p.shareCap, priceWei: p.priceWei, approved: p.approved, active: p.active, supply, balance, remaining: p.shareCap - supply };
    })));
  }
  const [ethBalance, proceeds, admin] = await Promise.all([
    account ? provider.getBalance(account, blockTag) : Promise.resolve(0n),
    account ? contract.proceeds(account, { blockTag }) : Promise.resolve(0n), contract.owner({ blockTag }),
  ]);
  const events = [];
  const historyFrom = Math.max(config.deploymentBlock, blockTag - 10000);
  for (let from = historyFrom; from <= blockTag; from += 2000) {
    const logs = await provider.getLogs({ address: config.address, fromBlock: from, toBlock: Math.min(from + 1999, blockTag) });
    for (const log of logs) {
      let event;
      try { event = contract.interface.parseLog(log); } catch { continue; }
      if (!event) continue;
      const a = event.args;
      if (event.name === 'TransferSingle' && a.from === ZeroAddress) continue;
      const actors = [a.buyer, a.seller, a.from, a.to].filter(Boolean);
      if (account && actors.length && !actors.some(value => value.toLowerCase() === account.toLowerCase())) continue;
      const descriptions = {
        PropertyListed: () => `Listed property #${a.id}: ${a.title}`,
        PropertyApprovalChanged: () => `Property #${a.id} ${a.approved ? 'approved' : 'approval revoked'}`,
        SaleStatusChanged: () => `Property #${a.id} sale ${a.active ? 'opened' : 'paused'}`,
        SharesPurchased: () => `Bought ${a.shares} shares of #${a.id} for ${formatEther(a.paidWei)} ETH`,
        TransferSingle: () => `Transferred ${a.value} shares of #${a.id} from ${a.from} to ${a.to}`,
        ProceedsWithdrawn: () => `Withdrew ${formatEther(a.amountWei)} ETH`,
      };
      if (!descriptions[event.name]) continue;
      events.push({ key: `${log.transactionHash}-${log.index}`, hash: log.transactionHash, block: log.blockNumber, description: descriptions[event.name]() });
    }
  }
  return { properties, ethBalance, proceeds, admin, block: blockTag, events: events.reverse().slice(0, 100), historyFrom };
}
