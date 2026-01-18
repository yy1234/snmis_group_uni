export function buildLegacyHeaders(cookie: string, includeCookie: boolean) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  if (includeCookie && cookie) {
    headers.Cookie = cookie
  }
  return headers
}
