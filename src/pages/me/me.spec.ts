import { mount } from '@vue/test-utils'
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import MePage from './me.vue'

describe('me page', () => {
  it('renders title', () => {
    const wrapper = mount(MePage)
    expect(wrapper.text()).toContain('我的')
  })
})
