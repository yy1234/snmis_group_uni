import { mount } from '@vue/test-utils'
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import WorkHeaderCarousel from './WorkHeaderCarousel.vue'

describe('workHeaderCarousel', () => {
  it('renders 3 slides', () => {
    const wrapper = mount(WorkHeaderCarousel, {
      props: {
        items: [1, 2, 3],
        metrics: [
          { value: '12.3', unit: 't', percent: 45.6 },
          { value: '8.9', unit: 't', percent: 33.3 },
        ],
      },
    })
    expect(wrapper.findAll('.work-header-slide')).toHaveLength(3)
  })
})
