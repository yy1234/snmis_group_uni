import { vi } from 'vitest'

globalThis.uni = {
  navigateTo: vi.fn(),
  reLaunch: vi.fn(),
  showToast: vi.fn(),
  setNavigationBarTitle: vi.fn(),
  switchTab: vi.fn(),
  request: vi.fn(),
  getStorageSync: vi.fn(),
  setStorageSync: vi.fn(),
  removeStorageSync: vi.fn(),
  hideTabBar: vi.fn(),
} as any
