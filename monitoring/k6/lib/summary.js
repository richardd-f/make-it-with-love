// handleSummary factory.
//
// Writes the FULL k6 metrics JSON to /results/<phase>-summary.json (parsed later
// by run-phase.ps1, which is what appends the CSV — we deliberately do not append
// here) and prints a one-line digest to stdout. No remote jslib imports, so this
// works even if the k6 container has no outbound internet.

function trend(data, metric, stat) {
  const m = data.metrics[metric];
  if (!m || !m.values || m.values[stat] === undefined) return null;
  return m.values[stat];
}

function fmt(v) {
  return v === null ? 'n/a' : Number(v).toFixed(1);
}

export function makeHandleSummary(phase) {
  return function handleSummary(data) {
    const ttfbP95 = trend(data, 'http_req_waiting', 'p(95)'); // P95 TTFB
    const durP95 = trend(data, 'http_req_duration', 'p(95)');
    const reqs = data.metrics.http_reqs ? data.metrics.http_reqs.values.count : 0;
    const failRate = data.metrics.http_req_failed
      ? data.metrics.http_req_failed.values.rate
      : 0;

    const digest =
      `[${phase}] reqs=${reqs} ` +
      `ttfb_p95=${fmt(ttfbP95)}ms ` +
      `dur_p95=${fmt(durP95)}ms ` +
      `fail=${(failRate * 100).toFixed(2)}%`;

    const out = {};
    out[`/results/${phase}-summary.json`] = JSON.stringify(data, null, 2);
    out.stdout = `\n${digest}\n`;
    return out;
  };
}
