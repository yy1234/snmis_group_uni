import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const content = readFileSync(new URL('./index.vue', import.meta.url), 'utf8')

describe('login layout', () => {
  it('matches iOS spacing for header and form', () => {
    expect(content).toMatch(/\.login-logo[\s\S]*?margin:\s*200rpx auto 0;/)
    expect(content).toMatch(/\.login-form[\s\S]*?margin-top:\s*100rpx;/)
  })

  it('prevents scroll indicator on the login page', () => {
    expect(content).toMatch(/\.login-page[\s\S]*?height:\s*100vh;/)
    expect(content).toMatch(/\.login-page[\s\S]*?overflow:\s*hidden;/)
  })
})
