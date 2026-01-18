import { describe, expect, it } from 'vitest'
import { buildLegacyHeaders } from './legacyHeaders'

describe('buildLegacyHeaders', () => {
  it('omits cookie when disabled', () => {
    const headers = buildLegacyHeaders('', false)
    expect(headers).toEqual({ 'Content-Type': 'application/x-www-form-urlencoded' })
  })

  it('includes cookie when enabled', () => {
    const headers = buildLegacyHeaders('JSESSIONID=abc', true)
    expect(headers).toEqual({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'JSESSIONID=abc',
    })
  })
})
