import { mount } from '@vue/test-utils'
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import WorkIndicatorList from './WorkIndicatorList.vue'

describe('workIndicatorList', () => {
  it('renders indicators', () => {
    const wrapper = mount(WorkIndicatorList, {
      props: { items: [{ name: '蒸汽', value: '12.3', unit: 't' }] },
    })
    expect(wrapper.findAll('.indicator-card')).toHaveLength(1)
    expect(wrapper.text()).toContain('蒸汽')
  })
})
