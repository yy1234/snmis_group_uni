import { mount } from '@vue/test-utils'
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import WorkEnvironmentalProtection from './WorkEnvironmentalProtection.vue'

describe('workEnvironmentalProtection', () => {
  it('renders ep metrics', () => {
    const wrapper = mount(WorkEnvironmentalProtection, {
      props: {
        items: [{
          equName: '锅炉',
          equStatus: '运行',
          metrics: [
            { name: 'DUST(mg/Nm³)', standard: '国标30', value: '10' },
            { name: 'HCL(mg/Nm³)', standard: '国标60', value: '20' },
            { name: 'CO(mg/Nm³)', standard: '国标100', value: '30' },
            { name: 'SO2(mg/Nm³)', standard: '国标100', value: '40' },
            { name: 'NOx(mg/Nm³)', standard: '国标300', value: '50' },
            { name: '炉温(℃)', standard: '国标≥850', value: '850' },
          ],
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
    expect(wrapper.findAll('.ep-metric')).toHaveLength(6)
    expect(wrapper.text()).toContain('环保指标')
  })
})
