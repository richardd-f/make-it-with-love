// HARD phase: authenticate, browse the image-heavy page, then run a full,
// self-cleaning CRUD cycle against the real (session-gated) API.
//
//   setup()      -> NextAuth credentials login once; hand the session cookie to VUs
//   default(VU)  -> GET / (browse) then POST -> GET -> PUT -> DELETE /api/benchmark
//
// The CRUD cycle deletes what it creates, so the run is repeatable with no
// leftover rows. Every request carries the real session cookie, so this
// exercises the genuine auth path on top of Prisma writes.
import http from 'k6/http';
import { check, fail } from 'k6';
import { BASE_URL } from './lib/config.js';
import { buildOptions } from './lib/options.js';
import { makeHandleSummary } from './lib/summary.js';
import { login } from './lib/auth.js';

export const options = buildOptions();

export function setup() {
  const cookie = login();
  if (!cookie) {
    fail('setup: login failed — cannot run hard phase (see auth errors above)');
  }
  return { cookie };
}

export default function (data) {
  const headers = { Cookie: data.cookie };

  // Browse the image-heavy page as an authenticated user.
  const home = http.get(`${BASE_URL}/`, { headers });
  check(home, { 'home 200': (r) => r.status === 200 });

  // CREATE
  const created = http.post(`${BASE_URL}/api/benchmark`, null, { headers });
  const okCreate = check(created, { 'create 201': (r) => r.status === 201 });
  if (!okCreate) return;
  const id = created.json('id');

  // READ
  const read = http.get(`${BASE_URL}/api/benchmark?id=${id}`, { headers });
  check(read, { 'read 200': (r) => r.status === 200 });

  // UPDATE
  const updated = http.put(`${BASE_URL}/api/benchmark?id=${id}`, null, { headers });
  check(updated, { 'update 200': (r) => r.status === 200 });

  // DELETE (self-cleaning)
  const deleted = http.del(`${BASE_URL}/api/benchmark?id=${id}`, null, { headers });
  check(deleted, { 'delete 200': (r) => r.status === 200 });
}

export const handleSummary = makeHandleSummary('hard');
