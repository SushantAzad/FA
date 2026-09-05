import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './app.mjs';

test('listing API validates, authorizes, persists and retrieves listings', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'fa-test-'));
  const options = { dataFile: join(dir, 'properties.json'), writeToken: 'test-secret' };
  let server;
  const start = async () => {
    server = createApp(options);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    return `http://127.0.0.1:${server.address().port}`;
  };
  const stop = () => new Promise(resolve => server.close(resolve));
  try {
    let base = await start();
    const post = (body, token = 'test-secret') => fetch(base + '/api/properties', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
    assert.equal((await fetch(base + '/api/health')).status, 200);
    assert.equal((await post({}, 'incorrect')).status, 401);
    assert.equal((await post(null)).status, 400);
    const valid = { title: 'Test house', description: 'A house', location: 'Delhi', price: 83000, totalTokens: 10, propertyType: 'residential', images: ['data:image/png;base64,aGVsbG8='], lat: 0, lng: 0 };
    for (const invalid of [{ price: -1 }, { totalTokens: 1.5 }, { images: [] }, { images: ['javascript:alert(1)'] }, { bedrooms: -2 }, { lat: 91 }]) {
      assert.equal((await post({ ...valid, ...invalid })).status, 400);
    }
    const response = await post(valid);
    assert.equal(response.status, 201);
    const created = await response.json();
    assert.equal(created.tokenPrice, 100);
    assert.deepEqual(created.coordinates, { lat: 0, lng: 0 });
    assert.equal(created.status, 'Pending review');
    await stop();
    base = await start();
    assert.equal((await (await fetch(base + '/api/properties')).json()).length, 1);
    assert.equal((await (await fetch(base + '/api/properties/' + created.id)).json()).title, valid.title);
    assert.equal((await fetch(base + '/api/properties/missing')).status, 404);
  } finally {
    await stop();
    rmSync(dir, { recursive: true, force: true });
  }
});
