import { describe, expect, it } from 'vitest'
import { buildFunctionEntries, normalizeHeaderMetrics, normalizeMainIndicators } from './work.models'

describe('work models', () => {
  it('filters function entries by menuLevel', () => {
    const input = [
      { menuText: '经营计划', menuLevel: 2 },
      { menuText: '忽略我', menuLevel: 3 },
    ]
    expect(buildFunctionEntries(input as any)).toEqual([
      { title: '经营计划', icon: '/static/work/functions/经营计划.png' },
    ])
  })

  it('normalizes indicator values', () => {
    const input = [{ indicatorName: '蒸汽', value: '12.3', unit: 't' }]
    expect(normalizeMainIndicators(input as any)).toEqual([
      { name: '蒸汽', value: '12.3', unit: 't' },
    ])
  })

  it('normalizes header metrics', () => {
    const input = [
      { actualData: 12.3, company: 't', proportion: 45.6 },
      { actualData: 8.9, company: 't', proportion: 33.3 },
    ]
    expect(normalizeHeaderMetrics(input as any)).toEqual([
      { value: '12.3', unit: 't', percent: 45.6 },
      { value: '8.9', unit: 't', percent: 33.3 },
    ])
  })
})
