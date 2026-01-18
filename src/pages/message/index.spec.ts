import { mount } from '@vue/test-utils'
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import MessagePage from './index.vue'

describe('message page', () => {
  it('renders toggle labels', () => {
    const wrapper = mount(MessagePage)
    expect(wrapper.text()).toContain('分类')
    expect(wrapper.text()).toContain('时间')
  })
})
