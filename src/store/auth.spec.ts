import { describe, expect, it } from 'vitest'
import { buildAuthorization } from '@/store/auth'

const mockLogin = {
  userId: 1,
  userName: 'user',
  userOrgId: 2,
  userCompanyId: 3,
  userOrgParId: 4,
}

describe('buildAuthorization', () => {
  it('builds Bearer token from login model', () => {
    const token = buildAuthorization(mockLogin)
    expect(token.startsWith('Bearer ')).toBe(true)
    expect(token.length).toBeGreaterThan('Bearer '.length)
  })
})
