import { test, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import ganache from 'ganache';
import { BrowserProvider, ContractFactory, parseEther, ZeroAddress } from 'ethers';
import { compile } from './compile.mjs';
import { createBlockchainApp } from '../server/blockchain-app.mjs';

let rpc, provider, contract, admin, seller, buyer, recipient, outsider, snapshot, abi, attackArtifact;
const price = parseEther('0.01');
const attackSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
interface IMarket { function buyShares(uint256,uint256) external payable; }
contract ReentrantBuyer {
  IMarket public market; bool public reentered;
  constructor(address m) { market = IMarket(m); }
  function attack() external payable { market.buyShares{value: 0.01 ether}(1,1); }
  function onERC1155Received(address,address,uint256,uint256,bytes calldata) external returns(bytes4) {
    try market.buyShares{value: 0.01 ether}(1,1) { reentered = true; } catch {}
    return this.onERC1155Received.selector;
  }
}`;

before(async () => {
  const compiled = compile({ 'ReentrantBuyer.sol': { content: attackSource } });
  const artifact = compiled['FractionalProperty.sol'].FractionalProperty;
  attackArtifact = compiled['ReentrantBuyer.sol'].ReentrantBuyer;
  abi = artifact.abi;
  rpc = ganache.provider({ chain: { chainId: 31337, hardfork: 'shanghai' }, wallet: { deterministic: true }, logging: { quiet: true } });
  provider = new BrowserProvider(rpc, undefined, { cacheTimeout: -1 });
  provider.pollingInterval = 20;
  [admin, seller, buyer, recipient, outsider] = await Promise.all([0, 1, 2, 3, 4].map(i => provider.getSigner(i)));
  contract = await new ContractFactory(abi, '0x' + artifact.evm.bytecode.object, admin).deploy(await admin.getAddress());
  await contract.waitForDeployment();
});
beforeEach(async () => { snapshot = await rpc.request({ method: 'evm_snapshot', params: [] }); });
afterEach(async () => { await rpc.request({ method: 'evm_revert', params: [snapshot] }); });
after(async () => { provider?.destroy(); await rpc?.disconnect(); });
async function list(approve = true) {
  await (await contract.connect(seller).listProperty('Delhi test property', 'New Delhi', 'ipfs://test-metadata', 10, price)).wait();
  if (approve) await (await contract.setApproved(1, true)).wait();
}
async function buy(shares = 3) { await (await contract.connect(buyer).buyShares(1, shares, { value: price * BigInt(shares) })).wait(); }

test('listing stores seller, immutable metadata, share cap and pending approval', async () => {
  await list(false);
  const p = await contract.getProperty(1);
  assert.equal(p.seller, await seller.getAddress());
  assert.equal(p.shareCap, 10n);
  assert.equal(p.priceWei, price);
  assert.equal(p.approved, false);
  assert.equal(await contract.uri(1), 'ipfs://test-metadata');
  assert.equal(await contract['totalSupply(uint256)'](1), 0n);
  assert.equal(await contract.supportsInterface('0xd9b67a26'), true);
});

test('rejects invalid listings and missing property IDs', async () => {
  for (const args of [['', 'Delhi', '', 10, price], ['Title', '', '', 10, price], ['Title', 'Delhi', '', 0, price], ['Title', 'Delhi', '', 10, 0], ['x'.repeat(121), 'Delhi', '', 10, price], ['Title', 'Delhi', 'x'.repeat(513), 10, price]]) {
    await assert.rejects(contract.connect(seller).listProperty(...args));
  }
  await assert.rejects(contract.getProperty(0));
  await assert.rejects(contract.getProperty(99));
  assert.equal(await contract.propertyCount(), 0n);
});

test('only administrator approves; unapproved, paused and revoked sales reject purchases', async () => {
  await list(false);
  await assert.rejects(contract.connect(seller).setApproved(1, true));
  await assert.rejects(buy());
  await (await contract.setApproved(1, true)).wait();
  await assert.rejects(contract.connect(outsider).setSaleActive(1, false));
  await (await contract.connect(seller).setSaleActive(1, false)).wait();
  await assert.rejects(buy());
  await (await contract.connect(seller).setSaleActive(1, true)).wait();
  await buy();
  await (await contract.setApproved(1, false)).wait();
  await assert.rejects(buy(1));
});

test('purchase mints exact quantity, records proceeds and emits paid amount', async () => {
  await list();
  const receipt = await (await contract.connect(buyer).buyShares(1, 3, { value: price * 3n })).wait();
  assert.equal(await contract.balanceOf(await buyer.getAddress(), 1), 3n);
  assert.equal(await contract['totalSupply(uint256)'](1), 3n);
  assert.equal(await contract.proceeds(await seller.getAddress()), price * 3n);
  const event = receipt.logs.map(log => { try { return contract.interface.parseLog(log); } catch { return null; } }).find(log => log?.name === 'SharesPurchased');
  assert.equal(event.args.paidWei, price * 3n);
});

test('rejects zero quantities, overpayments, underpayments and overselling', async () => {
  await list();
  for (const [shares, value] of [[0, 0n], [1, price - 1n], [1, price + 1n], [11, price * 11n]]) {
    await assert.rejects(contract.connect(buyer).buyShares(1, shares, { value }));
  }
  await buy(10);
  await assert.rejects(buy(1));
  assert.equal(await contract['totalSupply(uint256)'](1), 10n);
});

test('ERC1155 transfers update balances without increasing supply; strangers cannot transfer', async () => {
  await list(); await buy(4);
  const from = await buyer.getAddress(), to = await recipient.getAddress();
  await assert.rejects(contract.connect(outsider).safeTransferFrom(from, to, 1, 1, '0x'));
  await assert.rejects(contract.connect(buyer).safeTransferFrom(from, to, 1, 5, '0x'));
  await assert.rejects(contract.connect(buyer).safeTransferFrom(from, ZeroAddress, 1, 1, '0x'));
  await (await contract.connect(buyer).safeTransferFrom(from, to, 1, 2, '0x')).wait();
  assert.equal(await contract.balanceOf(from, 1), 2n);
  assert.equal(await contract.balanceOf(to, 1), 2n);
  assert.equal(await contract['totalSupply(uint256)'](1), 4n);
});

test('seller can withdraw once; another account cannot take proceeds', async () => {
  await list(); await buy(2);
  await assert.rejects(contract.connect(outsider).withdrawProceeds());
  const before = await provider.getBalance(await seller.getAddress());
  const receipt = await (await contract.connect(seller).withdrawProceeds()).wait();
  assert.equal(await contract.proceeds(await seller.getAddress()), 0n);
  assert.equal(await provider.getBalance(await seller.getAddress()), before + 2n * price - receipt.fee);
  assert.equal(await provider.getBalance(await contract.getAddress()), 0n);
  await assert.rejects(contract.connect(seller).withdrawProceeds());
});

test('ERC1155 callback cannot reenter a purchase', async () => {
  await list();
  const attacker = await new ContractFactory(attackArtifact.abi, '0x' + attackArtifact.evm.bytecode.object, buyer).deploy(await contract.getAddress());
  await attacker.waitForDeployment();
  await (await attacker.attack({ value: price * 2n })).wait();
  assert.equal(await attacker.reentered(), false);
  assert.equal(await contract.balanceOf(await attacker.getAddress(), 1), 1n);
  assert.equal(await contract.proceeds(await seller.getAddress()), price);
});

test('read-only configuration API and restricted local RPC work with ethers transactions', async () => {
  await list();
  const accounts = await provider.send('eth_accounts', []);
  const config = { local: true, chainId: 31337, address: await contract.getAddress(), accounts, abi };
  const server = createBlockchainApp({ config, provider });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (method, params = [], origin) => fetch(base + '/api/rpc', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
  try {
    assert.equal((await fetch(base + '/api/health')).status, 200);
    assert.equal((await (await fetch(base + '/api/chain')).json()).address, config.address);
    assert.equal((await request('eth_chainId', [], 'https://untrusted.example')).status, 403);
    assert.equal((await (await request('evm_mine')).json()).error.code, -32601);
    assert.equal((await (await request('eth_sendTransaction', [{ from: accounts[0], to: accounts[1], value: '0x1' }])).json()).error.code, -32602);
    const { JsonRpcProvider, Contract } = await import('ethers');
    const proxy = new JsonRpcProvider(base + '/api/rpc', undefined, { cacheTimeout: -1 });
    proxy.pollingInterval = 20;
    try {
      const signer = await proxy.getSigner(accounts[2]);
      const connected = new Contract(config.address, abi, signer);
      await (await connected.buyShares(1, 1, { value: price })).wait();
      assert.equal(await connected.balanceOf(accounts[2], 1), 1n);
    } finally { proxy.destroy(); }
  } finally { await new Promise(resolve => server.close(resolve)); }
});
