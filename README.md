# FractionalAsset — blockchain prototype

FractionalAsset runs a local Ethereum-compatible blockchain with an ERC-1155 smart contract for fractional property shares. The active app reads listings, holdings and activity from that contract. Wallets sign transactions; the API does not maintain ownership records in JSON.

## Run

Use Node.js 20 or newer. From this project folder:

```powershell
npm ci --legacy-peer-deps
npm run dev:blockchain
```

Open http://127.0.0.1:4030. This single command compiles Solidity, starts a persistent local chain, deploys the contract on first run, starts the API, and starts Vite. Keep the terminal open. Stop with Ctrl+C. On subsequent starts the same chain and deployment are reused.

- Frontend: http://127.0.0.1:4030
- API: http://127.0.0.1:4029/api/health
- Local Ethereum RPC: http://127.0.0.1:8545
- Chain ID: `31337`
- Currency: valueless local test ETH

Ports 4030, 4029 and 8545 must be available. Do not run the old frontend/API terminals at the same time. `npm run server` runs just the chain and API; if using separate terminals, start the frontend with `npm start -- --host 127.0.0.1 --port 4030`.

Ganache can print a native µWS compatibility warning on newer Node versions. It falls back to its JavaScript implementation; this does not prevent the chain from running.

## Try the complete flow

1. Choose **Account 2** under Local test account and click **Use test account**. These public development accounts start with test ETH and require no wallet extension.
2. Use **List Property**. Enter title, location, total shares and a price per share in test ETH. Metadata URI is optional. Submit and wait for the transaction confirmation.
3. Switch to **Account 1 (administrator)**, open **Dashboard**, and approve the new property.
4. Switch to **Account 3**, open **Investments**, select the property, and buy shares. A confirmation shows the transaction hash and block number.
5. Open **Portfolio** to see the contract balance and transfer shares to another test account address.
6. Switch back to the seller, open **Dashboard**, and withdraw the accumulated sale proceeds.
7. **History** displays confirmed contract events. Refresh reads the latest chain state; data also refreshes after each transaction and account change.

A sample property is created and approved on the first run. It is explicitly labeled as a demo and is an actual on-chain listing. No investor holdings or purchases are fabricated.

## Browser wallets

Use **Connect browser wallet** in a browser with an EIP-1193 extension such as MetaMask. Add a local network with RPC `http://127.0.0.1:8545`, chain ID `31337`, and currency symbol `ETH`. The wallet must use this exact deployment. The Codex in-app browser may not have a wallet extension; use local test accounts there.

A new browser-wallet address needs local test ETH before sending transactions. It can be funded from a development account using the local RPC or a wallet connected to this local chain. Never send real ETH to these development accounts. The application never requests or stores seed phrases/private keys. Its local-account mode deliberately uses unlocked development accounts and must remain loopback-only.

## Contract behavior

`contracts/FractionalProperty.sol` uses OpenZeppelin ERC1155Supply, Ownable, and ReentrancyGuard.

- `listProperty`: records the seller, title, location, metadata URI, maximum share supply and immutable price in wei. New listings are unapproved.
- `setApproved`: administrator-only approval or revocation of primary sales.
- `setSaleActive`: seller or administrator can pause/resume a primary sale.
- `buyShares`: requires approval, an active sale, positive shares within remaining supply, and exact ETH payment. Mints shares to the buyer and credits seller proceeds.
- `safeTransferFrom` / standard ERC-1155 transfers: move owned shares with normal holder/operator authorization. Approval revocation pauses new purchases, not existing-holder transfers.
- `withdrawProceeds`: pays the caller's proceeds using checks-effects-interactions and a reentrancy guard.

A property's cap describes its maximum token supply. Unpurchased shares are not minted. Portfolio percentages use the cap, not just currently minted supply. Token ownership does not confer legal title to a building.

Title/location/URI are public on-chain data. Large files remain off-chain, referenced by an optional `ipfs://` or `https://` URI. This implementation does not upload to IPFS, verify documents, or automatically fetch metadata. Do not put private information into immutable metadata or transaction input.

The API publishes `/api/chain`, checks `/api/health`, and provides a restricted `/api/rpc` proxy. Local test transactions are restricted to configured test senders and the deployed contract. Chain-management RPC calls and cross-origin browser requests are rejected by that proxy. Ganache itself is bound to loopback and remains a development-only node.

## Persistence and validation

- Chain state: `blockchain/data/chain/`
- Deployment address, first block and compiled-bytecode fingerprint: `blockchain/data/deployment.json`
- Generated ABI/bytecode: `blockchain/artifacts/FractionalProperty.json`

Runtime files are gitignored and excluded from Vite serving/watchers. Back up the entire `blockchain/data` directory while the app is stopped to preserve accounts, balances and deployment together. Contract source changes cause a clear mismatch error instead of silently reusing an incompatible deployment. To start a fresh local chain, stop the app and move the existing `blockchain/data` directory to a backup location before restarting.

```powershell
npm run contracts:compile
npm test
npm run build
```

Tests cover validation, administrator/seller authorization, exact payments, supply limits, ERC-1155 transfers, withdrawals, reentrancy, and the local RPC proxy. Contract tests use an isolated ephemeral chain and do not alter the running app's chain.

## Scope

This is a working local blockchain prototype, not a public-network deployment or audited financial product. The active routes now use on-chain data; old prototype components and the legacy JSON API implementation remain in source for reference but are not the active application. Old JSON listings are not automatically migrated.

Not implemented: legal ownership registration, KYC, compliance checks, rental dividends, fiat/stablecoin payments, resale orders, public-testnet deployment, production custody, or a production indexer. The activity reader shows the latest 100 matching events in a 10,000-block window and supports up to 500 listings. Expand indexing and pagination before scaling. Public deployment requires a separate deployment/configuration path without unlocked accounts, a contract/security review, and an appropriate legal/compliance design.

References: [OpenZeppelin ERC-1155 documentation](https://docs.openzeppelin.com/contracts/5.x/erc1155), [ethers provider documentation](https://docs.ethers.org/v6/api/providers/).
