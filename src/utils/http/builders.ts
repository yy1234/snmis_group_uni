import type { RequestGsonInput, RequestGsonPayload } from './types'
import dayjs from 'dayjs'

export function buildRequestGson(input: RequestGsonInput): RequestGsonPayload {
  const payload: Record<string, unknown> = {
    data: input.data ?? {},
    loginName: input.loginName ?? '',
    requestTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }
  if (input.pagination)
    payload.pagination = input.pagination
  if (input.extra)
    Object.assign(payload, input.extra)
  return { requestGson: JSON.stringify(payload) }
}
