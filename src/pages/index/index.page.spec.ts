import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const content = readFileSync(new URL('./index.vue', import.meta.url), 'utf8')

describe('index page', () => {
  it('includes EP and EO sections', () => {
    expect(content).toMatch(/WorkEnvironmentalProtection/)
    expect(content).toMatch(/WorkEquipmentOperation/)
  })
})
