export interface FunctionEntry { title: string, icon: string }
export interface HeaderMetric { value: string, unit: string, percent: number }
export interface MainIndicator { name: string, value: string, unit: string }

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
