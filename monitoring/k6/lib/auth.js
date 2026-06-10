// NextAuth (Auth.js v5) Credentials login helper — the fragile part of the rig.
//
// Flow this app actually uses (JWT session strategy, http so non-secure cookie):
//   1. GET  /api/auth/csrf                  -> { csrfToken } + sets csrf cookie
//   2. POST /api/auth/callback/credentials  -> 302 + sets the session cookie
//   3. reuse the `authjs.session-token` cookie on every later request
//
// Because k6 cookie jars are per-execution-context, call login() inside setup()
// and hand the returned "name=value" string to VUs, which attach it as a manual
// Cookie header. Returns null on failure so the caller can fail fast.
import http from 'k6/http';
import { BASE_URL, CREDS } from './config.js';

const SESSION_COOKIE_NAMES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
];

export function login() {
  const csrfRes = http.get(`${BASE_URL}/api/auth/csrf`);
  if (csrfRes.status !== 200) {
    console.error(`login: csrf fetch failed (status ${csrfRes.status})`);
    return null;
  }
  const csrfToken = csrfRes.json('csrfToken');
  if (!csrfToken) {
    console.error('login: no csrfToken in response');
    return null;
  }

  // Form-encoded credentials POST. redirects:0 keeps the 302 (with Set-Cookie)
  // from being followed into a page render we do not need.
  const res = http.post(
    `${BASE_URL}/api/auth/callback/credentials`,
    {
      csrfToken: csrfToken,
      email: CREDS.email,
      password: CREDS.password,
      callbackUrl: `${BASE_URL}/`,
    },
    { redirects: 0 }
  );

  if (res.status !== 302 && res.status !== 200) {
    console.error(`login: credentials callback unexpected status ${res.status}`);
    return null;
  }

  const jar = http.cookieJar();
  const cookies = jar.cookiesForURL(`${BASE_URL}/`);
  for (const name of SESSION_COOKIE_NAMES) {
    if (cookies[name] && cookies[name].length > 0) {
      return `${name}=${cookies[name][0]}`;
    }
  }
  console.error('login: no session cookie set (check AUTH_SECRET / credentials)');
  return null;
}
