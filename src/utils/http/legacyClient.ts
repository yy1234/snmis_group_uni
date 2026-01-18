import { useAuthStore } from '@/store/auth'
import { buildRequestGson } from './builders'
import { buildLegacyHeaders } from './legacyHeaders'
import { resolveLegacyRequestUrl } from './legacyUrl'

export async function legacyRequest<T>(
  path: string,
  input: Parameters<typeof buildRequestGson>[0],
) {
  const auth = useAuthStore()
  const useRelativeBase = import.meta.env.VITE_LEGACY_PROXY_ENABLE === 'true'
  const url = resolveLegacyRequestUrl(auth.legacyBaseUrl, path, useRelativeBase)
  const data = buildRequestGson({
    ...input,
    loginName: input.loginName ?? auth.loginModel?.userName,
  })
  const includeCookie = typeof window === 'undefined'

  return uni.request<T>({
    url,
    method: 'POST',
    data,
    header: buildLegacyHeaders(auth.cookie ?? '', includeCookie),
  })
}
