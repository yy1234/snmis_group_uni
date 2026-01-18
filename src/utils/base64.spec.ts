import { describe, expect, it } from 'vitest'
import { encodeBase64 } from './base64'

describe('encodeBase64', () => {
  it('encodes utf8 input without btoa', () => {
    const originalBtoa = globalThis.btoa
    try {
      ;(globalThis as { btoa?: typeof btoa }).btoa = undefined
      const result = encodeBase64('\u4F60\u597D')
      expect(result).toBe('5L2g5aW9')
    }
    finally {
      ;(globalThis as { btoa?: typeof btoa }).btoa = originalBtoa
    }
  })
})
