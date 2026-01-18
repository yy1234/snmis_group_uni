import { describe, expect, it } from 'vitest'
import { hasLegacySession } from './authGuard'

describe('hasLegacySession', () => {
  const loginModel = { userId: '1' } as any

  it('returns false when login model is missing', () => {
    expect(hasLegacySession({ cookie: 'JSESSIONID=abc' }, { isWeb: true })).toBe(false)
  })

  it('allows login model without cookie on web', () => {
    expect(hasLegacySession({ loginModel }, { isWeb: true })).toBe(true)
  })

  it('requires cookie on native', () => {
    expect(hasLegacySession({ loginModel }, { isWeb: false })).toBe(false)
    expect(hasLegacySession({ loginModel, cookie: 'JSESSIONID=abc' }, { isWeb: false })).toBe(true)
  })
})
