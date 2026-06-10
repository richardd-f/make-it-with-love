// Shared config, driven entirely by env so the same scripts run in-container
// (BASE_URL=http://web:3000) or against a published port (http://localhost:3000).
export const BASE_URL = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const CREDS = {
  email: __ENV.BENCH_EMAIL || 'bench@makeitwithlove.com',
  password: __ENV.BENCH_PASSWORD || 'Bench@12345',
};
