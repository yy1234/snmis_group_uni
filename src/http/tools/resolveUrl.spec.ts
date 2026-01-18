import { describe, expect, it } from 'vitest'
import { resolveRequestUrl } from './resolveUrl'

describe('resolveRequestUrl', () => {
  it('keeps legacy proxy path when enabled', () => {
    const result = resolveRequestUrl({
      url: '/snmis/mobileAppBasicMgmt/login.do',
      baseUrl: 'https://ukw0y1.laf.run',
      proxyEnabled: false,
      proxyPrefix: '/fg-api',
      legacyProxyEnabled: true,
      legacyProxyPrefix: '/snmis',
    })
    expect(result).toBe('/snmis/mobileAppBasicMgmt/login.do')
  })

  it('uses app proxy when enabled', () => {
    const result = resolveRequestUrl({
      url: '/api/user',
      baseUrl: 'https://ukw0y1.laf.run',
      proxyEnabled: true,
      proxyPrefix: '/fg-api',
      legacyProxyEnabled: false,
      legacyProxyPrefix: '/snmis',
    })
    expect(result).toBe('/fg-api/api/user')
  })

  it('falls back to base url when no proxy enabled', () => {
    const result = resolveRequestUrl({
      url: '/api/user',
      baseUrl: 'https://ukw0y1.laf.run',
      proxyEnabled: false,
      proxyPrefix: '/fg-api',
      legacyProxyEnabled: false,
      legacyProxyPrefix: '/snmis',
    })
    expect(result).toBe('https://ukw0y1.laf.run/api/user')
  })
})
