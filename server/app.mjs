import http from 'node:http';
import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomUUID, timingSafeEqual } from 'node:crypto';

export function createApp({ dataFile = resolve('server/data/properties.json'), writeToken = process.env.API_WRITE_TOKEN } = {}) {
  mkdirSync(dirname(dataFile), { recursive: true });
  let properties = existsSync(dataFile) ? JSON.parse(readFileSync(dataFile, 'utf8')) : [];
  return http.createServer(async (req, res) => {
    const send = (status, value) => {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(value));
    };
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      if (req.method === 'GET' && path === '/api/health') return send(200, { status: 'ok' });
      if (req.method === 'GET' && path === '/api/properties') return send(200, properties);
      if (req.method === 'GET' && path.startsWith('/api/properties/')) {
        const property = properties.find(p => p.id === path.split('/').pop());
        return send(property ? 200 : 404, property || { error: 'Property not found.' });
      }
      if (req.method !== 'POST' || path !== '/api/properties') return send(404, { error: 'Endpoint not found.' });
      if (!writeToken) return send(503, { error: 'Listing submissions require API_WRITE_TOKEN on the server.' });
      const received = Buffer.from(req.headers.authorization || '');
      const expected = Buffer.from(`Bearer ${writeToken}`);
      if (received.length !== expected.length || !timingSafeEqual(received, expected)) return send(401, { error: 'Invalid listing access token.' });
      if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'Expected application/json.' });
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 8 * 1024 * 1024) return send(413, { error: 'Images and form must total less than 8 MB.' });
      }
      let input;
      try { input = JSON.parse(body); } catch { return send(400, { error: 'Invalid JSON.' }); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) return send(400, { error: 'Invalid property.' });
      const { title, description, location, propertyType, images } = input;
      if (![title, description, location].every(v => typeof v === 'string' && v.trim() && v.length <= 10000) ||
          !['residential', 'commercial', 'industrial', 'land'].includes(propertyType) ||
          !Number.isFinite(Number(input.price)) || Number(input.price) <= 0 || Number(input.price) > 1e12 ||
          !Number.isSafeInteger(Number(input.totalTokens)) || Number(input.totalTokens) <= 0 ||
          !Array.isArray(images) || images.length < 1 || images.length > 6 ||
          !images.every(v => typeof v === 'string' && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(v))) {
        return send(400, { error: 'Provide valid property details, a positive price, whole tokens, and 1–6 PNG, JPEG or WebP images.' });
      }
      for (const key of ['bedrooms', 'bathrooms', 'squareFootage', 'yearBuilt']) {
        if (input[key] != null && input[key] !== '' && (!Number.isSafeInteger(Number(input[key])) || Number(input[key]) < 0)) return send(400, { error: `Invalid ${key}.` });
      }
      const hasCoordinates = input.lat != null || input.lng != null;
      if (hasCoordinates && (typeof input.lat !== 'number' || typeof input.lng !== 'number' || !Number.isFinite(input.lat) || !Number.isFinite(input.lng) || Math.abs(input.lat) > 90 || Math.abs(input.lng) > 180)) return send(400, { error: 'Invalid coordinates.' });
      // Existing UI amounts use USD internally and display INR at its demo rate of 83.
      const price = Number(input.price) / 83;
      const property = {
        id: randomUUID(), title: title.trim(), name: title.trim(), description: description.trim(),
        location: location.trim(), fullAddress: location.trim(), type: propertyType[0].toUpperCase() + propertyType.slice(1),
        image: images[0], images: images.map(url => ({ url, caption: title.trim() })),
        totalTokens: Number(input.totalTokens), availableTokens: Number(input.totalTokens),
        totalValue: price, targetAmount: price, tokenPrice: price / Number(input.totalTokens),
        minInvestment: price / Number(input.totalTokens), minimumInvestment: price / Number(input.totalTokens),
        expectedReturn: 0, dividendYield: 0, riskLevel: 'Unrated', status: 'Pending review',
        fundedPercentage: 0, raisedAmount: 0, investors: 0, timeLeft: 'Pending review', amenities: [],
        createdAt: new Date().toISOString(),
        ...Object.fromEntries(['bedrooms', 'bathrooms', 'squareFootage', 'yearBuilt'].map(k => [k, Number(input[k]) || 0])),
        ...(hasCoordinates ? { coordinates: { lat: input.lat, lng: input.lng } } : {}),
      };
      const next = [property, ...properties];
      writeFileSync(`${dataFile}.tmp`, JSON.stringify(next));
      renameSync(`${dataFile}.tmp`, dataFile);
      properties = next;
      return send(201, property);
    } catch (error) {
      console.error(error);
      if (!res.headersSent) send(500, { error: 'Unable to save or load property data.' });
    }
  });
}
