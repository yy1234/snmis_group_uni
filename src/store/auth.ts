import type { AuthState, LoginModel } from '@/types/auth'
import { Buffer } from 'node:buffer'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'snmis_auth'

export function buildAuthorization(loginModel?: LoginModel): string {
  if (!loginModel)
    return ''
  const payload = {
    userId: loginModel.userId,
    userName: loginModel.userName,
    orgId: loginModel.userOrgId,
    userOrgParId: loginModel.userOrgParId,
    companyId: loginModel.userCompanyId,
  }
  const json = JSON.stringify(payload)
  const base64 = typeof btoa === 'function'
    ? btoa(unescape(encodeURIComponent(json)))
    : Buffer.from(json, 'utf8').toString('base64')
  return `Bearer ${base64}`
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    cookie: '',
    loginAddress: '',
    serverAddress: '',
    newServer: '',
    todoWebViewIP: '',
    loginModel: undefined,
  }),
  getters: {
    legacyBaseUrl: state =>
      state.loginAddress && state.serverAddress
        ? `${state.loginAddress}/${state.serverAddress}/`
        : '',
    newBaseUrl: (state) => {
      if (!state.newServer)
        return ''
      return state.newServer.endsWith('/') ? state.newServer : `${state.newServer}/`
    },
    authorization: state => buildAuthorization(state.loginModel),
  },
  actions: {
    hydrate() {
      const raw = uni.getStorageSync(STORAGE_KEY)
      if (raw)
        Object.assign(this, raw)
    },
    persist() {
      uni.setStorageSync(STORAGE_KEY, { ...this.$state })
    },
    setAuth(payload: Partial<AuthState>) {
      Object.assign(this.$state, payload)
      this.persist()
    },
    clearAuth() {
      this.$reset()
      uni.removeStorageSync(STORAGE_KEY)
    },
  },
})
