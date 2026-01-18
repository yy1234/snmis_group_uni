import { mount } from '@vue/test-utils'
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import MessageDetail from './detail.vue'

describe('message detail page', () => {
  it('renders default title', () => {
    const wrapper = mount(MessageDetail)
    expect(wrapper.text()).toContain('消息详情')
  })
})
