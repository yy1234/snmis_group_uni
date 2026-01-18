import { useAuthStore } from '@/store/auth'
import { buildRequestGson } from './builders'
import { buildLegacyRequestOptions } from './legacyRequestOptions'
import { resolveLegacyRequestUrl } from './legacyUrl'

export async function legacyRequest<T>(
  path: string,
  input: Parameters<typeof buildRequestGson>[0],
) {
  const auth = useAuthStore()
  let isH5 = false
  // #ifdef H5
  isH5 = true
  // #endif

  const useRelativeBase = isH5 && import.meta.env.VITE_LEGACY_PROXY_ENABLE === 'true'
  const url = resolveLegacyRequestUrl(auth.legacyBaseUrl, path, useRelativeBase)
  const data = buildRequestGson({
    ...input,
    loginName: input.loginName ?? auth.loginModel?.userName,
  })
  const response = await uni.request<T>(buildLegacyRequestOptions({
    url,
    data,
    cookie: auth.cookie ?? '',
    isH5,
  }))

  if (import.meta.env.DEV) {
    const payload = response.data
    const dataType = typeof payload
    const sample = dataType === 'string' ? payload.slice(0, 200) : payload
    console.warn('[legacyRequest]', {
      path,
      url,
      statusCode: response.statusCode,
      dataType,
      sample,
      isH5,
      legacyProxyEnabled: import.meta.env.VITE_LEGACY_PROXY_ENABLE,
      hasCookie: Boolean(auth.cookie),
    })
  }

  return response
}
