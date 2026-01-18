function ensureTrailingSlash(value: string) {
  return value.endsWith('/') ? value : `${value}/`
}

export function resolveLegacyRequestUrl(
  baseUrl: string,
  path: string,
  useRelativeBase: boolean,
) {
  if (!useRelativeBase)
    return `${ensureTrailingSlash(baseUrl)}${path}`

  try {
    const pathname = new URL(baseUrl).pathname
    const normalized = ensureTrailingSlash(pathname)
    return `${normalized}${path}`
  }
  catch (error) {
    return `${ensureTrailingSlash(baseUrl)}${path}`
  }
}
