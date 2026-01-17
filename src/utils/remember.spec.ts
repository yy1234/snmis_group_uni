import { describe, expect, it } from 'vitest'
import { loadRemember, saveRemember } from './remember'

type Store = Record<string, unknown>

function createStorage(store: Store = {}) {
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: unknown) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
  }
}

describe('remember storage', () => {
  it('returns empty defaults when nothing stored', () => {
    const storage = createStorage()
    const result = loadRemember(storage)
    expect(result).toEqual({ remember: false, loginName: '', password: '' })
  })

  it('stores and restores remember data', () => {
    const storage = createStorage()
    saveRemember({ remember: true, loginName: 'user', password: 'secret' }, storage)
    const result = loadRemember(storage)
    expect(result).toEqual({ remember: true, loginName: 'user', password: 'secret' })
  })

  it('clears password when remember is disabled', () => {
    const storage = createStorage({
      ISREMIND_PASSWORD: true,
      LOGIN_USER_NAME: 'user',
      ISREMIND: 'secret',
    })
    saveRemember({ remember: false, loginName: 'user', password: 'secret' }, storage)
    const result = loadRemember(storage)
    expect(result).toEqual({ remember: false, loginName: 'user', password: '' })
  })
})
