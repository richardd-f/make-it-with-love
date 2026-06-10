// Env-driven k6 options builder.
//
//   MODE=rps   -> constant-arrival-rate (the real benchmark). Env: RPS, DURATION.
//   MODE=smoke -> a quick per-VU iteration run for sanity checks (the default).
//
// A `http_req_duration: p(95)<500` threshold is ALWAYS attached, per the rig
// spec. Thresholds do not abort the run (abortOnFail omitted) so a phase still
// completes and writes its summary even when it breaches 500ms — the runner
// needs that data to find the max sustainable RPS.

const TREND_STATS = ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'];

export function buildOptions(extraThresholds) {
  const mode = (__ENV.MODE || 'smoke').toLowerCase();
  const thresholds = Object.assign(
    { http_req_duration: ['p(95)<500'] },
    extraThresholds || {}
  );

  if (mode === 'rps') {
    const rps = Number(__ENV.RPS || 50);
    const duration = __ENV.DURATION || '30s';
    return {
      scenarios: {
        bench: {
          executor: 'constant-arrival-rate',
          rate: rps,
          timeUnit: '1s',
          duration: duration,
          preAllocatedVUs: Number(__ENV.PRE_VUS || Math.max(20, rps)),
          maxVUs: Number(__ENV.MAX_VUS || Math.max(50, rps * 5)),
        },
      },
      thresholds: thresholds,
      summaryTrendStats: TREND_STATS,
    };
  }

  return {
    scenarios: {
      smoke: {
        executor: 'per-vu-iterations',
        vus: Number(__ENV.VUS || 1),
        iterations: Number(__ENV.ITERATIONS || 1),
        maxDuration: __ENV.MAX_DURATION || '60s',
      },
    },
    thresholds: thresholds,
    summaryTrendStats: TREND_STATS,
  };
}
