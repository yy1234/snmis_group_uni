import { mount } from '@vue/test-utils'
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import ContactsPage from './index.vue'

describe('contacts page', () => {
  it('renders title', () => {
    const wrapper = mount(ContactsPage)
    expect(wrapper.text()).toContain('通讯录')
  })
})
