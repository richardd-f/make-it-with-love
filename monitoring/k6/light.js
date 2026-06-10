// LIGHT phase: a single static page, no auth, no data access.
// Target: /privacy (a pure server-rendered static page in this app).
import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './lib/config.js';
import { buildOptions } from './lib/options.js';
import { makeHandleSummary } from './lib/summary.js';

export const options = buildOptions();

export default function () {
  const res = http.get(`${BASE_URL}/privacy`);
  check(res, { 'privacy 200': (r) => r.status === 200 });
}

export const handleSummary = makeHandleSummary('light');
