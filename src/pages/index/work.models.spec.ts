import { describe, expect, it } from 'vitest'
import {
  buildFunctionEntries,
  normalizeEnvironmentalItems,
  normalizeEquipmentItems,
  normalizeHeaderMetrics,
  normalizeMainIndicators,
  resolveEquipmentStatusColor,
} from './work.models'

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

  it('normalizes environmental protection items', () => {
    const input = [{
      equName: '锅炉',
      equStatus: '运行',
      dustHour: '10',
      hclHour: '20',
      coHour: '30',
      so2Hour: '40',
      noxHour: '50',
      ltwdHour: '850',
    }]
    const [item] = normalizeEnvironmentalItems(input as any)
    expect(item.equName).toBe('锅炉')
    expect(item.equStatus).toBe('运行')
    expect(item.metrics).toHaveLength(6)
    expect(item.metrics[0]).toEqual({ name: 'DUST(mg/Nm³)', standard: '国标30', value: '10' })
  })

  it('normalizes equipment operation items', () => {
    const input = [{
      equName: '1号炉',
      statusName: '投运',
      equipmentType: 1,
      annualRunTime: 12.5,
      stopTimes: 3,
      pjwd: '900',
      zclws: '1',
      cclws: '2',
      yclws: '3',
      zclwz: '4',
      zclwzh: '5',
      zclwy: '6',
      zclwx: '7',
      cclwx: '8',
      yclwx: '9',
    }]
    const [item] = normalizeEquipmentItems(input as any)
    expect(item.equName).toBe('1号炉')
    expect(item.metrics).toHaveLength(12)
    expect(item.metrics[0].label).toBe('年度运行时长')
  })

  it('maps status to colors', () => {
    expect(resolveEquipmentStatusColor('运行')).toBe('#19C419')
    expect(resolveEquipmentStatusColor('投运')).toBe('#19C419')
    expect(resolveEquipmentStatusColor('检修')).toBe('#FF9000')
    expect(resolveEquipmentStatusColor('备用')).toBe('#008FFF')
  })
})
