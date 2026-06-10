// LIGHT phase: the landing page, no auth, no image fetching, no writes.
// Baseline: how fast is the app serving its main entry point under load.
// Equivalent to the Laravel rig's GET / light phase.
import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './lib/config.js';
import { buildOptions } from './lib/options.js';
import { makeHandleSummary } from './lib/summary.js';

export const options = buildOptions();

export default function () {
  const res = http.get(`${BASE_URL}/`);
  check(res, { 'home 200': (r) => r.status === 200 });
}

export const handleSummary = makeHandleSummary('light');
