export interface FunctionEntry { title: string, icon: string }
export interface HeaderMetric { value: string, unit: string, percent: number }
export interface MainIndicator { name: string, value: string, unit: string }
export interface EpMetric { name: string, standard: string, value: string }
export interface EpItem { equId?: number, equName: string, equStatus: string, metrics: EpMetric[] }
export interface EoMetric { label: string, value: string, empty?: boolean }
export interface EoItem { equId?: number, equName: string, statusName: string, equipmentType?: number, metrics: EoMetric[] }

const EMPTY_TEXT = '--'
const toText = (value: unknown) => (value === null || value === undefined || value === '' ? EMPTY_TEXT : String(value))

export function resolveEquipmentStatusColor(status?: string) {
  if (status === '运行' || status === '投运')
    return '#19C419'
  if (status === '检修')
    return '#FF9000'
  return '#008FFF'
}

export function buildFunctionEntries(
  raw: Array<{ menuText?: string, menuLevel?: number }>,
): FunctionEntry[] {
  return raw
    .filter(item => item.menuLevel === 2 && item.menuText)
    .map(item => ({
      title: item.menuText as string,
      icon: `/static/work/functions/${item.menuText}.png`,
    }))
}

export function normalizeMainIndicators(
  raw: Array<{ indicatorName?: string, value?: string, unit?: string }>,
): MainIndicator[] {
  return raw.map(item => ({
    name: item.indicatorName ?? '',
    value: item.value ?? '',
    unit: item.unit ?? '',
  }))
}

export function normalizeHeaderMetrics(
  raw: Array<{ actualData?: number, company?: string, proportion?: number }>,
): HeaderMetric[] {
  return raw.map(item => ({
    value: (item.actualData ?? 0).toFixed(1),
    unit: item.company ?? '',
    percent: Number(item.proportion ?? 0),
  }))
}

export function normalizeEnvironmentalItems(raw: Array<Record<string, unknown>>): EpItem[] {
  return raw.map(item => ({
    equId: item.equId as number | undefined,
    equName: (item.equName as string) || '锅炉',
    equStatus: (item.equStatus as string) || EMPTY_TEXT,
    metrics: [
      { name: 'DUST(mg/Nm³)', standard: '国标30', value: toText(item.dustHour) },
      { name: 'HCL(mg/Nm³)', standard: '国标60', value: toText(item.hclHour) },
      { name: 'CO(mg/Nm³)', standard: '国标100', value: toText(item.coHour) },
      { name: 'SO2(mg/Nm³)', standard: '国标100', value: toText(item.so2Hour) },
      { name: 'NOx(mg/Nm³)', standard: '国标300', value: toText(item.noxHour) },
      { name: '炉温(℃)', standard: '国标≥850', value: toText(item.ltwdHour) },
    ],
  }))
}

export function normalizeEquipmentItems(raw: Array<Record<string, unknown>>): EoItem[] {
  return raw.map((item) => {
    const equipmentType = (item.equipmentType as number | undefined) ?? 0
    const boilerMetrics: EoMetric[] = [
      { label: '年度运行时长', value: toText(item.annualRunTime) },
      { label: '年度停炉次数', value: toText(item.stopTimes) },
      { label: '炉膛平均温度', value: toText(item.pjwd) },
      { label: '左侧温度上', value: toText(item.zclws) },
      { label: '中侧温度上', value: toText(item.cclws) },
      { label: '右侧温度上', value: toText(item.yclws) },
      { label: '左侧温度中', value: toText(item.zclwz) },
      { label: '中侧温度中', value: toText(item.zclwzh) },
      { label: '右侧温度中', value: toText(item.zclwy) },
      { label: '左侧温度下', value: toText(item.zclwx) },
      { label: '中侧温度下', value: toText(item.cclwx) },
      { label: '右侧温度下', value: toText(item.yclwx) },
    ]
    const turbineMetrics: EoMetric[] = [
      { label: '年度运行时长', value: toText(item.annualRunTime) },
      { label: '年度停机次数', value: toText(item.stopTimes) },
      { label: '主汽温度', value: toText(item.qjmainSteamTemperature) },
      { label: '负荷', value: toText(item.jzfh) },
      { label: '主汽压力', value: toText(item.qjmainSteamPressure) },
      { label: '真空', value: toText(item.qjvacuum) },
      { label: '', value: '', empty: true },
      { label: '', value: '', empty: true },
      { label: '', value: '', empty: true },
      { label: '', value: '', empty: true },
      { label: '', value: '', empty: true },
      { label: '', value: '', empty: true },
    ]

    return {
      equId: item.equId as number | undefined,
      equName: (item.equName as string) || '锅炉',
      statusName: (item.statusName as string) || EMPTY_TEXT,
      equipmentType,
      metrics: equipmentType === 1 ? boilerMetrics : turbineMetrics,
    }
  })
}
