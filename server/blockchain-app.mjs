import http from 'node:http';

// The API publishes deployment details and proxies the local RPC only. It holds no wallet keys.
export function createBlockchainApp({ config, provider }) {
  return http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const send = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    };
    try {
      if (req.method === 'GET' && req.url === '/api/chain') return send(200, config);
      if (req.method === 'GET' && req.url === '/api/health') {
        const chainId = Number(await provider.send('eth_chainId', []));
        if (chainId !== config.chainId || await provider.getCode(config.address) === '0x') return send(503, { error: 'Chain or deployment mismatch.' });
        return send(200, { status: 'ok', chainId, contract: config.address });
      }
      if (req.method === 'POST' && req.url === '/api/rpc') {
        // Reject cross-origin web requests. Development writes are only available on loopback.
        const origin = req.headers.origin;
        if (origin && !['http://127.0.0.1:4030', 'http://localhost:4030'].includes(origin)) return send(403, { error: 'Origin not allowed.' });
        if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'Expected JSON.' });
        let body = '';
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 128 * 1024) return send(413, { error: 'Request too large.' });
        }
        let requests;
        try { requests = JSON.parse(body); } catch { return send(400, { error: 'Invalid JSON.' }); }
        const batch = Array.isArray(requests) ? requests : [requests];
        if (batch.length < 1 || batch.length > 50) return send(400, { error: 'Invalid batch size.' });
        const allowed = new Set(['eth_chainId', 'eth_blockNumber', 'eth_call', 'eth_getCode', 'eth_getBalance', 'eth_getLogs', 'eth_getTransactionReceipt', 'eth_getTransactionByHash', 'eth_getBlockByNumber', 'eth_getTransactionCount', 'eth_estimateGas', 'eth_gasPrice', 'eth_maxPriorityFeePerGas', 'eth_feeHistory', 'net_version', 'eth_accounts', 'eth_sendTransaction']);
        const responses = [];
        for (const request of batch) {
          if (!request || request.jsonrpc !== '2.0' || !allowed.has(request.method) || (request.params != null && !Array.isArray(request.params))) {
            responses.push({ jsonrpc: '2.0', id: request?.id ?? null, error: { code: -32601, message: 'RPC method not allowed.' } });
            continue;
          }
          if (request.method === 'eth_sendTransaction') {
            const tx = request.params?.[0];
            if (!config.local || !tx || tx.to?.toLowerCase() !== config.address.toLowerCase() || !config.accounts.some(a => a.toLowerCase() === tx.from?.toLowerCase())) {
              responses.push({ jsonrpc: '2.0', id: request.id, error: { code: -32602, message: 'Only local test-account calls to this contract are allowed.' } });
              continue;
            }
          }
          try { responses.push({ jsonrpc: '2.0', id: request.id, result: await provider.send(request.method, request.params || []) }); }
          catch (error) { responses.push({ jsonrpc: '2.0', id: request.id, error: { code: error.info?.error?.code || -32000, message: error.shortMessage || error.message } }); }
        }
        return send(200, Array.isArray(requests) ? responses : responses[0]);
      }
      return send(404, { error: 'This backend uses smart contracts. Use /api/chain and /api/rpc.' });
    } catch { if (!res.headersSent) send(503, { error: 'Blockchain unavailable. Start npm run dev:blockchain.' }); }
  });
}
