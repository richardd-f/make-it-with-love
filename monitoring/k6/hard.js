// HARD phase: browse the home page then run a full, self-cleaning CRUD cycle
// against the bench API endpoint (no session auth required).
//
//   default(VU)  -> GET / then POST -> GET -> PUT -> DELETE /api/benchmark
//
// The CRUD cycle deletes what it creates, so the run is repeatable with no
// leftover rows. ENABLE_BENCHMARK_API=1 must be set on the web container.
import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './lib/config.js';
import { buildOptions } from './lib/options.js';
import { makeHandleSummary } from './lib/summary.js';

export const options = buildOptions();

export default function () {
  // Browse home page
  const home = http.get(`${BASE_URL}/`);
  check(home, { 'home 200': (r) => r.status === 200 });

  // CREATE
  const created = http.post(`${BASE_URL}/api/benchmark`, null);
  const okCreate = check(created, { 'create 201': (r) => r.status === 201 });
  if (!okCreate) return;
  const id = created.json('id');

  // READ
  const read = http.get(`${BASE_URL}/api/benchmark?id=${id}`);
  check(read, { 'read 200': (r) => r.status === 200 });

  // UPDATE
  const updated = http.put(`${BASE_URL}/api/benchmark?id=${id}`, null);
  check(updated, { 'update 200': (r) => r.status === 200 });

  // DELETE (self-cleaning)
  const deleted = http.del(`${BASE_URL}/api/benchmark?id=${id}`, null);
  check(deleted, { 'delete 200': (r) => r.status === 200 });
}

export const handleSummary = makeHandleSummary('hard');
