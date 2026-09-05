import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Contract, parseEther } from 'ethers';
import { startLocalChain } from './local.mjs';

test('chain restart preserves deployed contract, purchased shares and seller proceeds', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'fa-chain-test-'));
  let chain;
  try {
    chain = await startLocalChain({ dataDir, port: 0 });
    const address = chain.config.address;
    const buyerAddress = chain.config.accounts[1];
    const contract = new Contract(address, chain.config.abi, await chain.provider.getSigner(buyerAddress));
    await (await contract.buyShares(1, 2, { value: parseEther('0.02') })).wait();
    const buyerBalance = await chain.provider.getBalance(buyerAddress);
    await chain.close(); chain = null;
    chain = await startLocalChain({ dataDir, port: 0 });
    const restored = new Contract(chain.config.address, chain.config.abi, chain.provider);
    assert.equal(chain.config.address, address);
    assert.equal(await restored.propertyCount(), 1n);
    assert.equal(await restored.balanceOf(buyerAddress, 1), 2n);
    assert.equal(await restored.proceeds(chain.config.admin), parseEther('0.02'));
    assert.equal(await chain.provider.getBalance(buyerAddress), buyerBalance);
  } finally {
    await chain?.close();
    rmSync(dataDir, { recursive: true, force: true });
  }
});
