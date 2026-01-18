import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const styleContent = readFileSync(new URL('./index.scss', import.meta.url), 'utf8')
const pagesConfig = readFileSync(new URL('../../pages.config.ts', import.meta.url), 'utf8')
const pkgJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  dependencies?: Record<string, string>
}

describe('wot design uni integration', () => {
  it('registers wot components in easycom', () => {
    expect(pagesConfig)
      .toMatch(/\^wd-\(\.\*\).*wot-design-uni\/components\/wd-\$1\/wd-\$1\.vue/)
  })

  it('sets the wot theme color to brand blue', () => {
    expect(styleContent).toMatch(/\n\s*--wot-color-theme:\s*#37a6f1;/)
  })

  it('declares wot-design-uni dependency', () => {
    expect(pkgJson.dependencies?.['wot-design-uni']).toBeTruthy()
  })
})
