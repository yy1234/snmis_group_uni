export type LoginType = 'password' | 'captcha'

export interface LoginPayloadOptions {
  loginType: LoginType
  loginName?: string
  password?: string
  mobile?: string
  captcha?: string
  deviceName: string
  versionType?: string
}

export interface LegacyConfig {
  loginAddress: string
  serverAddress: string
}

export interface LegacyResponse<T> {
  success?: boolean
  message?: string
  data?: T
  total?: number
}

const STAGING_CONFIG: LegacyConfig = {
  loginAddress: 'http://192.168.20.248:8080',
  serverAddress: 'snmis',
}

const PRODUCTION_CONFIG: LegacyConfig = {
  loginAddress: 'http://114.55.201.191:8989',
  serverAddress: 'snmis',
}

export function resolveLegacyConfig(loginName?: string): LegacyConfig {
  if (loginName === 'root')
    return { ...STAGING_CONFIG }
  return { ...PRODUCTION_CONFIG }
}

export function buildLoginPayload(options: LoginPayloadOptions) {
  const base = {
    versionType: options.versionType ?? '3',
    deviceName: options.deviceName,
  }

  if (options.loginType === 'captcha') {
    return {
      ...base,
      type: '2',
      mobile: options.mobile ?? '',
      captcha: options.captcha ?? '',
    }
  }

  return {
    ...base,
    type: '1',
    loginName: options.loginName ?? '',
    password: options.password ?? '',
  }
}

export function resolveLoginNameForRequest(payload: Record<string, unknown>) {
  if (typeof payload.loginName === 'string' && payload.loginName.trim()) {
    return payload.loginName.trim()
  }
  if (typeof payload.mobile === 'string' && payload.mobile.trim()) {
    return payload.mobile.trim()
  }
  return ''
}

export function normalizeTodoWebViewIP(value?: string) {
  if (!value)
    return ''
  return value.endsWith('/') ? value : `${value}/`
}

export function extractSessionCookie(headers: Record<string, string | string[] | undefined>) {
  const raw = headers['set-cookie'] ?? headers['Set-Cookie'] ?? ''
  const cookieLine = Array.isArray(raw) ? raw.join(';') : raw
  const match = cookieLine.match(/JSESSIONID=([^;]+)/)
  return match ? `JSESSIONID=${match[1]}` : ''
}

export function parseLegacyResponse<T>(payload: unknown): LegacyResponse<T> {
  if (!payload)
    return { success: false, message: 'Empty response' }
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload) as LegacyResponse<T>
    }
    catch (error) {
      return { success: false, message: 'Invalid JSON response' }
    }
  }
  if (typeof payload === 'object')
    return payload as LegacyResponse<T>
  return { success: false, message: 'Invalid response payload' }
}
