import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const raw = readFileSync(new URL('../pages.json', import.meta.url), 'utf8')

describe('pages.json', () => {
  it('defines a non-empty pages array', () => {
    const parsed = JSON.parse(raw) as { pages?: unknown[] }
    expect(Array.isArray(parsed.pages)).toBe(true)
    expect((parsed.pages ?? []).length).toBeGreaterThan(0)
  })
})
