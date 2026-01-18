import { describe, expect, it } from 'vitest'
import { resolveLegacyRequestUrl } from './legacyUrl'

describe('resolveLegacyRequestUrl', () => {
  it('uses relative base path when proxy enabled', () => {
    const baseUrl = 'http://114.55.201.191:8989/snmis/'
    const result = resolveLegacyRequestUrl(baseUrl, 'mobileAppBasicMgmt/login.do', true)
    expect(result).toBe('/snmis/mobileAppBasicMgmt/login.do')
  })

  it('uses absolute base when proxy disabled', () => {
    const baseUrl = 'http://114.55.201.191:8989/snmis/'
    const result = resolveLegacyRequestUrl(baseUrl, 'mobileAppBasicMgmt/login.do', false)
    expect(result).toBe('http://114.55.201.191:8989/snmis/mobileAppBasicMgmt/login.do')
  })
})
