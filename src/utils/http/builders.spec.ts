import { describe, expect, it } from 'vitest'
import { buildRequestGson } from '@/utils/http/builders'

describe('buildRequestGson', () => {
  it('wraps data with requestTime and loginName', () => {
    const result = buildRequestGson({
      data: { a: 1 },
      loginName: 'user',
    })
    expect(result.requestGson).toContain('"data"')
    expect(result.requestGson).toContain('"requestTime"')
    expect(result.requestGson).toContain('"loginName"')
  })
})
