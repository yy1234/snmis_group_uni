import { describe, expect, it } from 'vitest'
import { groupByType } from './message.models'

describe('message models', () => {
  it('groups messages by type name', () => {
    const input = [
      { classifyDesc: '系统消息', readUserMessageCount: 2, classifyValue: 25 },
      { classifyDesc: '缺陷管理', readUserMessageCount: 1, classifyValue: 5 },
    ]
    expect(groupByType(input as any)).toEqual([
      { title: '系统消息', count: 2, classifyValue: 25 },
      { title: '缺陷管理', count: 1, classifyValue: 5 },
    ])
  })
})
