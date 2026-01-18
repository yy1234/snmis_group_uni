import { describe, expect, it } from 'vitest'
import { buildTodoQuery, resolveTodoRoute } from './todo.models'

describe('todo models', () => {
  it('uses webview for default todo', () => {
    expect(resolveTodoRoute({ dataId: 1 })).toEqual({ type: 'webview' })
  })

  it('builds todo query params', () => {
    expect(buildTodoQuery({ content: '设备', categoryIds: '1,2' })).toEqual({
      content: '设备',
      categoryIds: '1,2',
    })
  })
})
