import { describe, expect, it } from 'vitest'
import { buildLegacyRequestOptions } from './legacyRequestOptions'

describe('buildLegacyRequestOptions', () => {
  it('includes cookie headers for non-H5', () => {
    const options = buildLegacyRequestOptions({
      url: '/snmis/test.do',
      data: { a: 1 },
      cookie: 'JSESSIONID=abc',
      isH5: false,
    })
    expect(options.header).toEqual({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'JSESSIONID=abc',
    })
    expect(options.withCredentials).toBeUndefined()
  })

  it('enables credentials for H5 requests', () => {
    const options = buildLegacyRequestOptions({
      url: '/snmis/test.do',
      data: { a: 1 },
      cookie: 'JSESSIONID=abc',
      isH5: true,
    })
    expect(options.header).toEqual({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
    expect(options.withCredentials).toBe(true)
  })
})
