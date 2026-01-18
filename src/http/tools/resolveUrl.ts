interface ResolveRequestUrlOptions {
  url: string
  baseUrl: string
  proxyEnabled: boolean
  proxyPrefix: string
  legacyProxyEnabled: boolean
  legacyProxyPrefix: string
}

export function resolveRequestUrl(options: ResolveRequestUrlOptions) {
  const {
    url,
    baseUrl,
    proxyEnabled,
    proxyPrefix,
    legacyProxyEnabled,
    legacyProxyPrefix,
  } = options

  if (url.startsWith('http'))
    return url

  if (legacyProxyEnabled && url.startsWith(legacyProxyPrefix))
    return url

  if (proxyEnabled)
    return `${proxyPrefix}${url}`

  return `${baseUrl}${url}`
}
