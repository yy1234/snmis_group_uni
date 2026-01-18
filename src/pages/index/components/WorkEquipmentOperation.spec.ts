import { mount } from '@vue/test-utils'
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import WorkEquipmentOperation from './WorkEquipmentOperation.vue'

describe('workEquipmentOperation', () => {
  it('renders equipment metrics', () => {
    const wrapper = mount(WorkEquipmentOperation, {
      props: {
        items: [{
          equName: '1号炉',
          statusName: '投运',
          metrics: Array.from({ length: 12 }).fill(0).map((_, index) => ({
            label: `指标${index + 1}`,
            value: '1',
          })),
        }],
      },
      global: {
        stubs: {
          'wd-card': { template: '<div><slot name="title" /><slot /></div>' },
          'wd-divider': { template: '<div />' },
          'wd-tag': { template: '<span><slot /></span>' },
          'wd-swiper': {
            props: ['list'],
            template: '<div><slot v-for="(item, index) in list" :item="item" :index="index" /></div>',
          },
        },
      },
    })
    expect(wrapper.findAll('.eo-metric')).toHaveLength(12)
    expect(wrapper.text()).toContain('设备运行')
  })
})
