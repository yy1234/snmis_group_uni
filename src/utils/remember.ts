export interface StorageLike {
  getItem: (key: string) => unknown
  setItem: (key: string, value: unknown) => void
  removeItem?: (key: string) => void
}

export const REMEMBER_KEYS = {
  remember: 'ISREMIND_PASSWORD',
  loginName: 'LOGIN_USER_NAME',
  password: 'ISREMIND',
} as const

function getDefaultStorage(): StorageLike {
  return {
    getItem: (key: string) => uni.getStorageSync(key),
    setItem: (key: string, value: unknown) => uni.setStorageSync(key, value),
    removeItem: (key: string) => uni.removeStorageSync(key),
  }
}

function toStringValue(value: unknown) {
  return typeof value === 'string' ? value : ''
}

export function loadRemember(storage: StorageLike = getDefaultStorage()) {
  const remember = Boolean(storage.getItem(REMEMBER_KEYS.remember))
  const loginName = toStringValue(storage.getItem(REMEMBER_KEYS.loginName))
  const password = remember
    ? toStringValue(storage.getItem(REMEMBER_KEYS.password))
    : ''
  return { remember, loginName, password }
}

export function saveRemember(
  payload: { remember: boolean, loginName: string, password: string },
  storage: StorageLike = getDefaultStorage(),
) {
  storage.setItem(REMEMBER_KEYS.remember, payload.remember)
  storage.setItem(REMEMBER_KEYS.loginName, payload.loginName)
  if (payload.remember) {
    storage.setItem(REMEMBER_KEYS.password, payload.password)
  }
  else if (storage.removeItem) {
    storage.removeItem(REMEMBER_KEYS.password)
  }
  else {
    storage.setItem(REMEMBER_KEYS.password, '')
  }
}

export function loadLoginRemember(storage: StorageLike = getDefaultStorage()) {
  const loginName = toStringValue(storage.getItem(REMEMBER_KEYS.loginName))
  saveRemember({ remember: false, loginName, password: '' }, storage)
  return { loginName }
}
