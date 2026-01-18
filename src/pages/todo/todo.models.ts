export function resolveTodoRoute(_item: { dataId?: number }) {
  return { type: 'webview' as const }
}

export function buildTodoQuery(params: { content?: string, categoryIds?: string }) {
  return {
    content: params.content ?? '',
    categoryIds: params.categoryIds ?? '',
  }
}
