import { describe, expect, it } from 'vitest'
import {
  buildLoginPayload,
  extractSessionCookie,
  normalizeTodoWebViewIP,
  parseLegacyResponse,
  resolveLegacyConfig,
  resolveLoginNameForRequest,
} from './login'

describe('resolveLegacyConfig', () => {
  it('uses staging config for root', () => {
    expect(resolveLegacyConfig('root')).toEqual({
      loginAddress: 'http://192.168.20.248:8080',
      serverAddress: 'snmis',
    })
  })

  it('uses production config for other accounts', () => {
    expect(resolveLegacyConfig('demo')).toEqual({
      loginAddress: 'http://114.55.201.191:8989',
      serverAddress: 'snmis',
    })
  })
})

describe('buildLoginPayload', () => {
  it('builds password login payload', () => {
    const payload = buildLoginPayload({
      loginType: 'password',
      loginName: 'demo',
      password: 'secret',
      deviceName: 'ios',
    })
    expect(payload).toEqual({
      versionType: '3',
      deviceName: 'ios',
      type: '1',
      loginName: 'demo',
      password: 'secret',
    })
  })

  it('builds captcha login payload', () => {
    const payload = buildLoginPayload({
      loginType: 'captcha',
      mobile: '13800138000',
      captcha: '1234',
      deviceName: 'android',
    })
    expect(payload).toEqual({
      versionType: '3',
      deviceName: 'android',
      type: '2',
      mobile: '13800138000',
      captcha: '1234',
    })
  })
})

describe('resolveLoginNameForRequest', () => {
  it('prefers loginName when present', () => {
    const payload = buildLoginPayload({
      loginType: 'password',
      loginName: 'root',
      password: 'secret',
      deviceName: 'ios',
    })
    expect(resolveLoginNameForRequest(payload)).toBe('root')
  })

  it('falls back to mobile for captcha login', () => {
    const payload = buildLoginPayload({
      loginType: 'captcha',
      mobile: '13800138000',
      captcha: '1234',
      deviceName: 'android',
    })
    expect(resolveLoginNameForRequest(payload)).toBe('13800138000')
  })
})

describe('normalizeTodoWebViewIP', () => {
  it('adds trailing slash', () => {
    expect(normalizeTodoWebViewIP('http://example.com/ui')).toBe('http://example.com/ui/')
  })

  it('keeps existing slash', () => {
    expect(normalizeTodoWebViewIP('http://example.com/ui/')).toBe('http://example.com/ui/')
  })
})

describe('extractSessionCookie', () => {
  it('extracts JSESSIONID from headers', () => {
    const cookie = extractSessionCookie({
      'set-cookie': 'JSESSIONID=abc123; Path=/; HttpOnly',
    })
    expect(cookie).toBe('JSESSIONID=abc123')
  })
})

describe('parseLegacyResponse', () => {
  it('parses JSON string payloads', () => {
    const parsed = parseLegacyResponse<{ ok: boolean }>(
      '{"success":true,"data":{"ok":true},"message":"ok"}',
    )
    expect(parsed.success).toBe(true)
    expect(parsed.data?.ok).toBe(true)
  })
})
