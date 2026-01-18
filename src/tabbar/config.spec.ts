import { describe, expect, it } from 'vitest'
import { customTabbarList, tabBar } from './config'

describe('custom tabbar list', () => {
  it('matches iOS tab order', () => {
    const labels = customTabbarList.map(item => item.text)
    expect(labels).toEqual(['工作', '消息', '待办', '通讯录', '我的'])
  })

  it('uses image icons for all items', () => {
    customTabbarList.forEach((item) => {
      expect(item.iconType).toBe('image')
      expect(item.icon.startsWith('/static/tabbar/')).toBe(true)
      expect(item.iconActive.startsWith('/static/tabbar/')).toBe(true)
    })
  })

  it('has tabbar styling aligned to iOS', () => {
    expect(tabBar?.selectedColor).toBe('#008FFF')
  })
})
