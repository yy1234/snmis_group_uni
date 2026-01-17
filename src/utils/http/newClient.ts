import { useAuthStore } from '@/store/auth'

export async function newRequest<T>(path: string, data?: Record<string, unknown>) {
  const auth = useAuthStore()
  const url = `${auth.newBaseUrl}${path}`
  return uni.request<T>({
    url,
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': auth.authorization,
    },
  })
}
