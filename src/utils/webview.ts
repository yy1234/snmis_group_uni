import { useAuthStore } from '@/store/auth'

export function buildTodoConfig(params: Record<string, unknown>) {
  const auth = useAuthStore()
  const config = {
    ...params,
    snmis_path: auth.legacyBaseUrl.replace(/\/$/, ''),
    Authorization: auth.authorization,
    plate_group_path: auth.newBaseUrl,
  }
  return encodeURIComponent(JSON.stringify(config))
}

export function buildTodoUrl(params: Record<string, unknown>) {
  const auth = useAuthStore()
  const base = auth.todoWebViewIP || ''
  const config = buildTodoConfig(params)
  return `${base}?configuration=${config}&timeStr=${Date.now()}`
}
