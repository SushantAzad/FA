import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Contract, formatEther, isAddress, parseEther, ZeroAddress } from 'ethers';
import NavigationBar from '../../components/ui/NavigationBar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { connectBrowserWallet, errorMessage, loadChain, readState } from '../../lib/blockchain';

const short = value => value ? `${value.slice(0, 6)}…${value.slice(-4)}` : '';
const same = (a, b) => a && b && a.toLowerCase() === b.toLowerCase();
const eth = value => formatEther(value || 0n);
const empty = { properties: [], events: [], ethBalance: 0n, proceeds: 0n, admin: '', block: 0, historyFrom: 0 };
const initialForm = { title: '', location: '', metadataURI: '', shareCap: '1000', price: '0.01' };
function quantity(value) {
  if (!/^[1-9]\d*$/.test(String(value))) throw new Error('Enter a positive whole number of shares.');
  const result = BigInt(value);
  if (result > 1000000000n) throw new Error('Maximum quantity is 1,000,000,000 shares.');
  return result;
}

function PropertyCard({ property: p, children }) {
  return <article className="rounded-xl border border-border bg-card p-5 space-y-4">
    <div className="flex justify-between items-start gap-3"><span className="text-xs text-muted-foreground">PROPERTY #{p.id}</span><span className={`text-xs rounded-full px-2 py-1 ${p.approved ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{!p.approved ? 'Pending approval' : !p.active ? 'Sale paused' : p.remaining === 0n ? 'Sold out' : 'Sale open'}</span></div>
    <h2 className="text-xl font-semibold"><Link to={`/asset-details?id=${p.id}`}>{p.title}</Link></h2>
    <p className="text-muted-foreground">{p.location}</p>
    <dl className="grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted-foreground">Price per share</dt><dd className="font-semibold">{eth(p.priceWei)} ETH</dd></div><div><dt className="text-muted-foreground">Shares available</dt><dd>{p.remaining.toString()} / {p.shareCap.toString()}</dd></div><div><dt className="text-muted-foreground">Your shares</dt><dd>{p.balance.toString()}</dd></div><div><dt className="text-muted-foreground">Seller</dt><dd title={p.seller}>{short(p.seller)}</dd></div></dl>
    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${Number(p.supply * 10000n / p.shareCap) / 100}%` }} /></div>
    {children}
  </article>;
}

export default function BlockchainApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [chain, setChain] = useState(null);
  const [session, setSession] = useState(null);
  const [data, setData] = useState(empty);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [loading, setLoading] = useState(true);
  const [localAccount, setLocalAccount] = useState('');
  const [search, setSearch] = useState('');
  const [shares, setShares] = useState('1');
  const [transactionHash, setTransactionHash] = useState('');
  const [form, setForm] = useState(initialForm);
  const lock = useRef(false);
  const revision = useRef(0);
  const activeSession = useRef(null);
  const path = location.pathname;
  const isAdmin = same(session?.address, data.admin);
  const selectedId = new URLSearchParams(location.search).get('id');
  const selected = data.properties.find(p => String(p.id) === selectedId);

  useEffect(() => {
    let closed = false, connected;
    loadChain().then(value => { connected = value; if (!closed) setChain(value); else value.provider.destroy(); })
      .catch(e => { if (!closed) { setError(errorMessage(e)); setLoading(false); } });
    return () => { closed = true; connected?.provider.destroy(); };
  }, []);

  async function refresh(currentChain = chain, currentSession = activeSession.current) {
    if (!currentChain) return;
    const request = ++revision.current;
    setLoading(true);
    try {
      const next = await readState(currentChain, currentSession?.address);
      if (revision.current === request) setData(next);
    } finally { if (revision.current === request) setLoading(false); }
  }

  useEffect(() => {
    activeSession.current = session;
    if (chain) refresh(chain, session).catch(e => setError(errorMessage(e)));
  }, [chain, session]);

  useEffect(() => {
    const changed = () => {
      activeSession.current = null; revision.current++;
      setSession(null); setData(empty);
      setNotice('Wallet account or network changed. Reconnect to continue.');
    };
    window.ethereum?.on?.('accountsChanged', changed);
    window.ethereum?.on?.('chainChanged', changed);
    return () => { window.ethereum?.removeListener?.('accountsChanged', changed); window.ethereum?.removeListener?.('chainChanged', changed); };
  }, []);
  useEffect(() => { setShares('1'); }, [selectedId, path]);
  useEffect(() => () => session?.walletProvider?.destroy(), [session]);

  async function connect(mode) {
    if (lock.current || !chain) return;
    lock.current = true; setBusy('Connecting wallet'); setError(''); setNotice(''); setTransactionHash('');
    try {
      let result;
      if (mode === 'local') {
        if (!chain.config.local || chain.config.chainId !== 31337 || !chain.config.accounts.includes(localAccount)) throw new Error('Select a local development account.');
        result = { signer: await chain.provider.getSigner(localAccount), mode: 'local' };
      } else result = { ...await connectBrowserWallet(chain), mode: 'browser' };
      const address = await result.signer.getAddress();
      if (await result.signer.provider.getCode(chain.config.address) !== await chain.provider.getCode(chain.config.address)) throw new Error('Wallet is connected to a different deployment.');
      setData(empty);
      setSession({ ...result, address });
    } catch (e) { setError(errorMessage(e)); }
    finally { lock.current = false; setBusy(''); }
  }

  async function transact(label, operation, after) {
    if (lock.current) return;
    if (!session || !chain) { setError('Connect a wallet or select a local test account first.'); return; }
    lock.current = true; setBusy(label); setError(''); setNotice(''); setTransactionHash('');
    const current = session;
    try {
      const network = await current.signer.provider.getNetwork();
      if (Number(network.chainId) !== chain.config.chainId || !same(await current.signer.getAddress(), current.address) || activeSession.current !== current) throw new Error('Wallet changed. Reconnect before sending.');
      const contract = new Contract(chain.config.address, chain.config.abi, current.signer);
      const tx = await operation(contract);
      setTransactionHash(tx.hash); setBusy('Waiting for blockchain confirmation');
      const receipt = await tx.wait();
      if (!receipt || receipt.status !== 1) throw new Error('Transaction was not confirmed successfully.');
      setNotice(`${label} confirmed in block ${receipt.blockNumber}.`);
      if (activeSession.current === current) {
        after?.();
        try { await refresh(chain, current); }
        catch { setError('Transaction confirmed, but refreshing data failed. Use Refresh before making another transaction.'); }
      }
    } catch (e) { setError(errorMessage(e)); }
    finally { lock.current = false; setBusy(''); }
  }

  const updateForm = e => setForm(current => ({ ...current, [e.target.name]: e.target.value }));
  const listProperty = e => {
    e.preventDefault();
    transact('Property listing', contract => {
      const title = form.title.trim(), address = form.location.trim(), uri = form.metadataURI.trim();
      if (!title || !address || new TextEncoder().encode(title).length > 120 || new TextEncoder().encode(address).length > 240) throw new Error('Title and location are required (maximum 120 and 240 UTF-8 bytes).');
      if (uri && !/^(ipfs:\/\/|https:\/\/)/i.test(uri)) throw new Error('Metadata URI must start with ipfs:// or https://.');
      const price = parseEther(form.price);
      if (price <= 0n) throw new Error('Share price must be greater than zero.');
      return contract.listProperty(title, address, uri, quantity(form.shareCap), price);
    }, () => { setForm(initialForm); navigate('/asset-browser'); });
  };

  const titles = { '/': 'Property marketplace', '/asset-browser': 'Property marketplace', '/asset-details': 'Property details', '/property-upload': 'List a property on-chain', '/portfolio-management': 'Your on-chain portfolio', '/transaction-history': 'Blockchain activity', '/dashboard': 'Wallet dashboard', '/authentication': 'Connect your wallet' };
  const holdings = data.properties.filter(p => p.balance > 0n);
  const owned = data.properties.filter(p => same(p.seller, session?.address));
  const disabled = !!busy || !session || loading;

  return <div className="min-h-screen bg-background text-foreground">
    <NavigationBar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm">Local blockchain development environment · Test ETH has no monetary value. These tokens are a software prototype and do not convey legal property ownership.</div>
      <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">FractionalAsset · Blockchain</p><h1 className="text-3xl font-bold">{titles[path] || 'Page not found'}</h1><p className="text-muted-foreground mt-2">Listings and balances read from the deployed ERC-1155 contract.</p></div><Button variant="outline" disabled={!chain || !!busy || loading} onClick={() => { setError(''); refresh().catch(e => setError(errorMessage(e))); }}>Refresh</Button></header>
      <section aria-label="Wallet connection" className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={!chain || !!busy} onClick={() => connect('browser')}>Connect browser wallet</Button>
          {chain?.config.local && <><label htmlFor="local-account" className="text-sm">Local test account</label><select id="local-account" className="bg-background border border-border rounded-md p-2 max-w-full" value={localAccount} disabled={!!busy} onChange={e => setLocalAccount(e.target.value)}><option value="">Select a test account</option>{chain.config.accounts.map((address, index) => <option key={address} value={address}>Account {index + 1}{same(address, chain.config.admin) ? ' (administrator)' : ''} · {short(address)}</option>)}</select><Button variant="secondary" disabled={!localAccount || !!busy} onClick={() => connect('local')}>Use test account</Button></>}
          {session && <Button variant="ghost" disabled={!!busy} onClick={() => { activeSession.current = null; setSession(null); setData(empty); }}>Disconnect</Button>}
        </div>
        {session ? <p className="text-sm break-all">{session.mode === 'local' ? 'Local test wallet' : 'Browser wallet'}: <strong>{session.address}</strong> · {eth(data.ethBalance)} ETH {isAdmin && '· Administrator'}</p> : <p className="text-sm text-muted-foreground">Browse without connecting. Connect to list, buy, transfer shares, or withdraw proceeds. Local accounts use valueless development funds.</p>}
        {chain && <p className="text-xs text-muted-foreground break-all">Chain {chain.config.chainId} · Contract {chain.config.address} · Read at block {data.block}</p>}
      </section>
      {error && <div role="alert" className="border border-error/30 bg-error/10 text-error rounded-lg p-4 break-words">{error}</div>}
      {(busy || notice || transactionHash) && <div role="status" aria-live="polite" className="border border-primary/20 bg-primary/5 rounded-lg p-4 space-y-1"><p>{busy || notice}</p>{transactionHash && <p className="text-xs break-all">Transaction: {transactionHash}</p>}</div>}
      {loading && <p role="status">Reading blockchain state…</p>}

      {['/', '/asset-browser'].includes(path) && <><Input label="Search properties" placeholder="Search title or location" value={search} onChange={e => setSearch(e.target.value)} /><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{data.properties.filter(p => `${p.title} ${p.location}`.toLowerCase().includes(search.toLowerCase())).map(p => <PropertyCard key={p.id} property={p}><Link className="text-primary font-medium" to={`/asset-details?id=${p.id}`}>View property →</Link></PropertyCard>)}</div>{!loading && !data.properties.length && <p>No properties have been listed on this contract.</p>}</>}

      {path === '/property-upload' && <form onSubmit={listProperty} className="max-w-2xl bg-card border border-border rounded-xl p-6 space-y-5">
        <p className="text-sm text-muted-foreground">Your wallet becomes the seller. A listing requires administrator approval before shares can be purchased. Supply and price cannot be changed after listing.</p>
        <Input label="Property title" name="title" required maxLength={120} value={form.title} onChange={updateForm} />
        <Input label="Location" name="location" required maxLength={240} value={form.location} onChange={updateForm} />
        <Input label="Metadata URI (optional)" description="An ipfs:// or https:// URI for public property metadata. The URI is stored on-chain; files remain off-chain. Do not include private documents." name="metadataURI" maxLength={512} value={form.metadataURI} onChange={updateForm} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input label="Total shares" name="shareCap" type="number" min="1" max="1000000000" step="1" required value={form.shareCap} onChange={updateForm} /><Input label="Price per share (test ETH)" name="price" inputMode="decimal" required value={form.price} onChange={updateForm} /></div>
        <Button type="submit" disabled={disabled}>List property on blockchain</Button>
      </form>}

      {path === '/asset-details' && (selected ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><PropertyCard property={selected}>
        <p className="text-sm break-all">Seller: {selected.seller}</p>{selected.metadataURI && <p className="text-sm break-all">Metadata URI: {selected.metadataURI}</p>}
        {same(session?.address, selected.seller) && <Button variant="outline" disabled={disabled} onClick={() => transact(selected.active ? 'Pause sale' : 'Resume sale', c => c.setSaleActive(selected.id, !selected.active))}>{selected.active ? 'Pause sale' : 'Resume sale'}</Button>}
        {isAdmin && <Button variant="secondary" disabled={disabled} onClick={() => transact(selected.approved ? 'Revoke approval' : 'Approve property', c => c.setApproved(selected.id, !selected.approved))}>{selected.approved ? 'Revoke approval' : 'Approve property'}</Button>}
      </PropertyCard><section className="bg-card rounded-xl border border-border p-6 space-y-5"><h2 className="text-xl font-semibold">Buy fractional shares</h2><p className="text-sm text-muted-foreground">Payment uses test ETH. Purchased ERC-1155 shares are minted directly to your connected wallet.</p><Input label="Number of shares" type="number" min="1" max={selected.remaining.toString()} step="1" value={shares} onChange={e => setShares(e.target.value)} /><p>Total: <strong>{/^[1-9]\d{0,9}$/.test(shares) ? eth(BigInt(shares) * selected.priceWei) : '—'} ETH</strong> plus network gas</p><Button disabled={disabled || !selected.approved || !selected.active || selected.remaining === 0n} onClick={() => transact('Share purchase', c => { const amount = quantity(shares); if (amount > selected.remaining) throw new Error('Not enough shares remain.'); return c.buyShares(selected.id, amount, { value: amount * selected.priceWei }); })}>Buy shares</Button>{!selected.approved && <p className="text-sm text-warning">Waiting for administrator approval.</p>}</section></div> : !loading && <p>Property not found. <Link className="text-primary" to="/asset-browser">Return to marketplace</Link></p>)}

      {path === '/portfolio-management' && <>{!session && <p>Connect an account to read its on-chain holdings.</p>}{session && !loading && !holdings.length && <p>This wallet does not own any property shares yet.</p>}<div className="grid grid-cols-1 md:grid-cols-2 gap-5">{holdings.map(p => <PropertyCard key={p.id} property={p}><p className="text-sm">{(Number(p.balance * 10000n / p.shareCap) / 100).toFixed(2)}% of the maximum share supply</p><TransferForm key={`${session?.address}-${p.id}`} property={p} disabled={disabled} onTransfer={(to, amount) => transact('Share transfer', c => { if (!isAddress(to) || to === ZeroAddress) throw new Error('Enter a valid nonzero recipient address.'); const count = quantity(amount); if (count > p.balance) throw new Error('Transfer exceeds your share balance.'); return c.safeTransferFrom(session.address, to, p.id, count, '0x'); })} /></PropertyCard>)}</div></>}

      {path === '/dashboard' && <><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[['Wallet balance', `${eth(data.ethBalance)} ETH`], ['Properties held', String(holdings.length)], ['Withdrawable sale proceeds', `${eth(data.proceeds)} ETH`]].map(([label, value]) => <div key={label} className="bg-card border border-border rounded-xl p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-semibold mt-2">{value}</p></div>)}</div><Button disabled={disabled || data.proceeds === 0n} onClick={() => transact('Proceeds withdrawal', c => c.withdrawProceeds())}>Withdraw sale proceeds to wallet</Button><h2 className="text-xl font-semibold">Your listings</h2>{!owned.length && <p className="text-muted-foreground">No listings from the connected wallet.</p>}<div className="grid grid-cols-1 md:grid-cols-2 gap-5">{owned.map(p => <PropertyCard key={p.id} property={p}><Link className="text-primary" to={`/asset-details?id=${p.id}`}>Manage listing →</Link></PropertyCard>)}</div>{isAdmin && <section className="space-y-3"><h2 className="text-xl font-semibold">Pending approval</h2><p className="text-sm text-muted-foreground">Administrator approval enables the on-chain sale. It is not a legal verification.</p>{data.properties.filter(p => !p.approved).map(p => <div key={p.id} className="flex flex-wrap justify-between gap-4 bg-card border border-border rounded-lg p-4"><Link to={`/asset-details?id=${p.id}`}>{p.title} · {short(p.seller)}</Link><Button disabled={disabled} onClick={() => transact('Property approval', c => c.setApproved(p.id, true))}>Approve property #{p.id}</Button></div>)}</section>}</>}

      {path === '/transaction-history' && <section className="space-y-4"><p className="text-sm text-muted-foreground">Latest 100 relevant events from blocks {data.historyFrom}–{data.block}. {session ? 'Includes this wallet’s activity and property approval/status changes.' : 'Connect a wallet to filter activity by account.'}</p>{!loading && !data.events.length && <p>No matching on-chain activity.</p>}{data.events.map(event => <article key={event.key} className="bg-card border border-border rounded-lg p-4 space-y-2"><p className="break-words">{event.description}</p><p className="text-xs text-muted-foreground break-all">Block {event.block} · Transaction {event.hash}</p></article>)}</section>}
      {path === '/authentication' && <p>Use the wallet controls above. Your wallet authorizes each transaction; this app never asks for your seed phrase or private key.</p>}
      {!(path in titles) && <Link to="/asset-browser" className="text-primary">Return to marketplace</Link>}
    </main>
  </div>;
}

function TransferForm({ property, disabled, onTransfer }) {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('1');
  return <form className="space-y-3 border-t border-border pt-4" onSubmit={e => { e.preventDefault(); onTransfer(to.trim(), amount); }}><Input label={`Recipient address for property #${property.id}`} placeholder="0x…" value={to} onChange={e => setTo(e.target.value)} required /><Input label={`Shares to transfer for property #${property.id}`} type="number" min="1" max={property.balance.toString()} step="1" value={amount} onChange={e => setAmount(e.target.value)} required /><Button type="submit" variant="outline" disabled={disabled}>Transfer shares</Button></form>;
}
