import { describe, expect, it } from 'vitest'
import { isDoubleTokenRes, isSingleTokenRes } from '@/api/types/login'

describe('login token type guards', () => {
  it('detects single token responses', () => {
    expect(isSingleTokenRes({ token: 't', expiresIn: 60 })).toBe(true)
    expect(isSingleTokenRes({
      accessToken: 'a',
      refreshToken: 'r',
      accessExpiresIn: 60,
      refreshExpiresIn: 3600,
    })).toBe(false)
  })

  it('detects double token responses', () => {
    expect(isDoubleTokenRes({
      accessToken: 'a',
      refreshToken: 'r',
      accessExpiresIn: 60,
      refreshExpiresIn: 3600,
    })).toBe(true)
    expect(isDoubleTokenRes({ token: 't', expiresIn: 60 })).toBe(false)
  })
})
