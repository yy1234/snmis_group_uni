import { useAuthStore } from '@/store/auth'
import { buildRequestGson } from './builders'

export async function legacyRequest<T>(
  path: string,
  input: Parameters<typeof buildRequestGson>[0],
) {
  const auth = useAuthStore()
  const url = `${auth.legacyBaseUrl}${path}`
  const data = buildRequestGson({
    ...input,
    loginName: input.loginName ?? auth.loginModel?.userName,
  })

  return uni.request<T>({
    url,
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': auth.cookie ?? '',
    },
  })
}
