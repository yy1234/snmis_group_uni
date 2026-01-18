import { describe, expect, it, vi } from 'vitest'
import { hasLegacySession } from './authGuard'

describe('hasLegacySession', () => {
  const loginModel = { userId: '1' } as any

  it('returns false when login model is missing', () => {
    expect(hasLegacySession({ cookie: 'JSESSIONID=abc' }, { isWeb: true })).toBe(false)
  })

  it('allows login model without cookie on web', () => {
    expect(hasLegacySession({ loginModel }, { isWeb: true })).toBe(true)
  })

  it('requires cookie when explicitly non-web', () => {
    expect(hasLegacySession({ loginModel }, { isWeb: false })).toBe(false)
    expect(hasLegacySession({ loginModel, cookie: 'JSESSIONID=abc' }, { isWeb: false })).toBe(true)
  })
})

describe('hasLegacySession runtime defaults', () => {
  it('allows login model without cookie on app runtime', async () => {
    vi.resetModules()
    vi.doMock('@uni-helper/uni-env', () => ({
      isApp: true,
      isH5: false,
    }))
    const mod = await import('./authGuard')
    expect(mod.hasLegacySession({ loginModel: { userId: '1' } })).toBe(true)
  })
})
