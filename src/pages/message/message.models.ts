export function groupByType(
  raw: Array<{ classifyDesc?: string, readUserMessageCount?: number, classifyValue?: number }>,
) {
  return raw.map(item => ({
    title: item.classifyDesc ?? '',
    count: item.readUserMessageCount ?? 0,
    classifyValue: item.classifyValue ?? -1,
  }))
}
