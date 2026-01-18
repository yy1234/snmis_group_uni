import { mount } from '@vue/test-utils'
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import TodoPage from './index.vue'

describe('todo page', () => {
  it('renders tabs', () => {
    const wrapper = mount(TodoPage)
    expect(wrapper.text()).toContain('待处理')
    expect(wrapper.text()).toContain('已完成')
  })
})
