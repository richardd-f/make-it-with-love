// MEDIUM phase: an image-heavy page plus every image it references.
// Target: / (home) — server-renders the carousel + featured cards, so the
// initial HTML contains the <img> tags (incl. Next's optimized /_next/image
// URLs). We parse them out and fetch them too, mimicking a real page load.
//
// NOTE: /courses fetches its cards client-side (no JS in k6), so its images are
// absent from the initial HTML — home is the correct image-heavy target here.
import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './lib/config.js';
import { buildOptions } from './lib/options.js';
import { makeHandleSummary } from './lib/summary.js';

export const options = buildOptions();

// Pull optimized image endpoints and raw local image assets out of the HTML.
function extractImageUrls(html) {
  const found = new Set();

  const optimized = html.match(/\/_next\/image\?[^"'\s)]+/g) || [];
  for (const u of optimized) found.add(u.replace(/&amp;/g, '&'));

  const raw = html.match(/\/images\/[^"'\s)]+?\.(?:webp|png|jpe?g|svg|gif|avif)/gi) || [];
  for (const u of raw) found.add(u);

  return Array.from(found);
}

export default function () {
  const page = http.get(`${BASE_URL}/`);
  check(page, { 'home 200': (r) => r.status === 200 });

  const urls = extractImageUrls(page.body || '');
  if (urls.length === 0) return;

  const requests = urls.map((u) => ['GET', `${BASE_URL}${u}`]);
  const responses = http.batch(requests);
  const ok = responses.filter((r) => r.status === 200).length;
  check(null, { 'all images 200': () => ok === responses.length });
}

export const handleSummary = makeHandleSummary('medium');
