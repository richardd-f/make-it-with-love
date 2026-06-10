// Env-driven k6 options builder.
//
//   MODE=rps         -> constant-arrival-rate. Env: RPS, DURATION.
//                       Used for Max RPS binary-search sweeps.
//   MODE=iterations  -> per-vu-iterations (default). Env: VUS, ITERATIONS.
//                       Used for the 10-run P95 TTFB average.
//
// VUs are HARD-CAPPED at 10 in both modes. Without this cap k6 can spin up
// 40+ VUs, starve the app container, and freeze the VPS (observed on Laravel
// rig before the cap was added). If you need higher throughput, run k6 from a
// separate machine and remove the cap.
//
// A `http_req_duration: p(95)<500` threshold is ALWAYS attached. Non-aborting
// so the run still writes its summary JSON even when it breaches 500ms — the
// RPS sweep needs that data to binary-search the saturation point.

const MAX_VUS = 10;
const TREND_STATS = ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'];

export function buildOptions(extraThresholds) {
  const mode = (__ENV.MODE || 'iterations').toLowerCase();
  const thresholds = Object.assign(
    { http_req_duration: ['p(95)<500'] },
    extraThresholds || {}
  );

  if (mode === 'rps') {
    const rps = Number(__ENV.RPS || 10);
    const duration = __ENV.DURATION || '30s';
    return {
      scenarios: {
        bench: {
          executor: 'constant-arrival-rate',
          rate: rps,
          timeUnit: '1s',
          duration: duration,
          // Pre-allocate conservatively; hard ceiling at MAX_VUS.
          preAllocatedVUs: Math.min(MAX_VUS, Math.max(2, Math.ceil(rps / 5))),
          maxVUs: MAX_VUS,
        },
      },
      thresholds,
      summaryTrendStats: TREND_STATS,
    };
  }

  // iterations mode (default)
  const vus = Math.min(MAX_VUS, Number(__ENV.VUS || 5));
  return {
    scenarios: {
      bench: {
        executor: 'per-vu-iterations',
        vus: vus,
        iterations: Number(__ENV.ITERATIONS || 10),
        maxDuration: __ENV.MAX_DURATION || '120s',
      },
    },
    thresholds,
    summaryTrendStats: TREND_STATS,
  };
}
