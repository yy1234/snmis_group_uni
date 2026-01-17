import { describe, expect, it } from 'vitest'
import { encryptPassword } from '@/utils/crypto'

describe('encryptPassword', () => {
  it('returns a non-empty string for a valid public key', () => {
    const key = '-----BEGIN PUBLIC KEY-----\n'
      + 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANM1sQ1bN5UG2RgxN6E466+vWXTjhBMW'
      + 'rMUR3pvN8MPmMXxMvmP0xSg6u40qCMgfHdCqkfNNpJBWlAbIYW/W2tMCAwEAAQ=='
      + '\n-----END PUBLIC KEY-----'
    const encrypted = encryptPassword('password', key)
    expect(typeof encrypted).toBe('string')
    expect(encrypted.length).toBeGreaterThan(0)
  })
})
