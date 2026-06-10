// handleSummary factory.
//
// Writes the full k6 metrics JSON to /results/<phase>-summary.json (parsed by
// run-phase scripts — they append the CSV, we don't) and prints a structured
// one-line digest to stdout so you can eyeball each run at a glance:
//
//   === light | target RPS=50 duration=30s ===
//     achieved RPS : 48.3
//     P95 TTFB     : 87ms
//     P95 duration : 91ms  (PASS<500)
//     errors       : 0.20%

function trend(data, metric, stat) {
  const m = data.metrics[metric];
  if (!m || !m.values || m.values[stat] === undefined) return null;
  return m.values[stat];
}

export function makeHandleSummary(phase) {
  return function handleSummary(data) {
    const mode = (__ENV.MODE || 'iterations').toLowerCase();

    const header = mode === 'rps'
      ? `=== ${phase} | target RPS=${__ENV.RPS || '?'} duration=${__ENV.DURATION || '?'} ===`
      : `=== ${phase} | iterations VUS=${__ENV.VUS || '5'} x${__ENV.ITERATIONS || '10'} ===`;

    const ttfbP95  = trend(data, 'http_req_waiting',  'p(95)');
    const durP95   = trend(data, 'http_req_duration', 'p(95)');
    const achRps   = data.metrics.http_reqs ? data.metrics.http_reqs.values.rate : 0;
    const failRate = data.metrics.http_req_failed
      ? data.metrics.http_req_failed.values.rate : 0;

    const pass    = durP95 !== null && durP95 < 500;
    const passStr = pass
      ? 'PASS<500'
      : `FAIL (${durP95 !== null ? Math.round(durP95) : '?'}ms)`;

    const fmt = (v, unit) => v !== null ? `${Math.round(v)}${unit}` : 'n/a';

    const digest = [
      header,
      `  achieved RPS : ${achRps !== null ? Number(achRps).toFixed(1) : 'n/a'}`,
      `  P95 TTFB     : ${fmt(ttfbP95, 'ms')}`,
      `  P95 duration : ${fmt(durP95, 'ms')}  (${passStr})`,
      `  errors       : ${(failRate * 100).toFixed(2)}%`,
    ].join('\n');

    const out = {};
    out[`/results/${phase}-summary.json`] = JSON.stringify(data, null, 2);
    out.stdout = `\n${digest}\n`;
    return out;
  };
}
