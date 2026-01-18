import { mount } from '@vue/test-utils'
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import WorkFunctionGrid from './WorkFunctionGrid.vue'

describe('workFunctionGrid', () => {
  it('renders items', () => {
    const wrapper = mount(WorkFunctionGrid, {
      props: { items: [{ title: '经营计划', icon: '/static/work/functions/经营计划.png' }] },
    })
    expect(wrapper.findAll('.work-function-item')).toHaveLength(1)
    expect(wrapper.text()).toContain('经营计划')
  })
})
