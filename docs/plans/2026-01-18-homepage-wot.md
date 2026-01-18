# Home Page Wot Sections Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the Environmental Protection and Equipment Operation sections on the home page using Wot Design Uni components and legacy APIs, matching Flutter UI/behavior.

**Architecture:** Keep existing home data flow, add EP/EO model normalization in `work.models.ts`, render with two new Wot-based components, and fetch EP/EO data via `legacyRequest` in `index.vue`. Assets are copied from the Flutter project into `src/static/work`.

**Tech Stack:** Vue 3 + uni-app, Wot Design Uni, Vitest.

### Task 1: Add EP/EO model normalization + status color mapping

**Files:**
- Modify: `src/pages/index/work.models.ts`
- Modify: `src/pages/index/work.models.spec.ts`

**Step 1: Write the failing test**

```ts
// src/pages/index/work.models.spec.ts (append)
import { normalizeEnvironmentalItems, normalizeEquipmentItems, resolveEquipmentStatusColor } from './work.models'

it('normalizes environmental protection items', () => {
  const input = [{
    equName: '锅炉',
    equStatus: '运行',
    dustHour: '10',
    hclHour: '20',
    coHour: '30',
    so2Hour: '40',
    noxHour: '50',
    ltwdHour: '850',
  }]
  const [item] = normalizeEnvironmentalItems(input as any)
  expect(item.equName).toBe('锅炉')
  expect(item.equStatus).toBe('运行')
  expect(item.metrics).toHaveLength(6)
  expect(item.metrics[0]).toEqual({ name: 'DUST(mg/Nm³)', standard: '国标30', value: '10' })
})

it('normalizes equipment operation items', () => {
  const input = [{
    equName: '1号炉',
    statusName: '投运',
    equipmentType: 1,
    annualRunTime: 12.5,
    stopTimes: 3,
    pjwd: '900',
    zclws: '1',
    cclws: '2',
    yclws: '3',
    zclwz: '4',
    zclwzh: '5',
    zclwy: '6',
    zclwx: '7',
    cclwx: '8',
    yclwx: '9',
  }]
  const [item] = normalizeEquipmentItems(input as any)
  expect(item.equName).toBe('1号炉')
  expect(item.metrics).toHaveLength(12)
  expect(item.metrics[0].label).toBe('年度运行时长')
})

it('maps status to colors', () => {
  expect(resolveEquipmentStatusColor('运行')).toBe('#19C419')
  expect(resolveEquipmentStatusColor('投运')).toBe('#19C419')
  expect(resolveEquipmentStatusColor('检修')).toBe('#FF9000')
  expect(resolveEquipmentStatusColor('备用')).toBe('#008FFF')
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test -- src/pages/index/work.models.spec.ts`  
Expected: FAIL with missing exports.

**Step 3: Write minimal implementation**

```ts
// src/pages/index/work.models.ts (add)
export interface EpMetric { name: string, standard: string, value: string }
export interface EpItem { equId?: number, equName: string, equStatus: string, metrics: EpMetric[] }
export interface EoMetric { label: string, value: string, empty?: boolean }
export interface EoItem { equId?: number, equName: string, statusName: string, equipmentType?: number, metrics: EoMetric[] }

const EMPTY_TEXT = '--'
const toText = (value: unknown) => (value === null || value === undefined || value === '' ? EMPTY_TEXT : String(value))

export function resolveEquipmentStatusColor(status?: string) {
  if (status === '运行' || status === '投运') return '#19C419'
  if (status === '检修') return '#FF9000'
  return '#008FFF'
}

export function normalizeEnvironmentalItems(raw: Array<Record<string, unknown>>): EpItem[] {
  return raw.map((item) => ({
    equId: item.equId as number | undefined,
    equName: (item.equName as string) || '锅炉',
    equStatus: (item.equStatus as string) || EMPTY_TEXT,
    metrics: [
      { name: 'DUST(mg/Nm³)', standard: '国标30', value: toText(item.dustHour) },
      { name: 'HCL(mg/Nm³)', standard: '国标60', value: toText(item.hclHour) },
      { name: 'CO(mg/Nm³)', standard: '国标100', value: toText(item.coHour) },
      { name: 'SO2(mg/Nm³)', standard: '国标100', value: toText(item.so2Hour) },
      { name: 'NOx(mg/Nm³)', standard: '国标300', value: toText(item.noxHour) },
      { name: '炉温(℃)', standard: '国标≥850', value: toText(item.ltwdHour) },
    ],
  }))
}

export function normalizeEquipmentItems(raw: Array<Record<string, unknown>>): EoItem[] {
  return raw.map((item) => {
    const equipmentType = (item.equipmentType as number | undefined) ?? 0
    const boilerMetrics: EoMetric[] = [
      { label: '年度运行时长', value: toText(item.annualRunTime) },
      { label: '年度停炉次数', value: toText(item.stopTimes) },
      { label: '炉膛平均温度', value: toText(item.pjwd) },
      { label: '左侧温度上', value: toText(item.zclws) },
      { label: '中侧温度上', value: toText(item.cclws) },
      { label: '右侧温度上', value: toText(item.yclws) },
      { label: '左侧温度中', value: toText(item.zclwz) },
      { label: '中侧温度中', value: toText(item.zclwzh) },
      { label: '右侧温度中', value: toText(item.zclwy) },
      { label: '左侧温度下', value: toText(item.zclwx) },
      { label: '中侧温度下', value: toText(item.cclwx) },
      { label: '右侧温度下', value: toText(item.yclwx) },
    ]
    const turbineMetrics: EoMetric[] = [
      { label: '年度运行时长', value: toText(item.annualRunTime) },
      { label: '年度停机次数', value: toText(item.stopTimes) },
      { label: '主汽温度', value: toText(item.qjmainSteamTemperature) },
      { label: '负荷', value: toText(item.jzfh) },
      { label: '主汽压力', value: toText(item.qjmainSteamPressure) },
      { label: '真空', value: toText(item.qjvacuum) },
      { label: '', value: '', empty: true },
      { label: '', value: '', empty: true },
      { label: '', value: '', empty: true },
      { label: '', value: '', empty: true },
      { label: '', value: '', empty: true },
      { label: '', value: '', empty: true },
    ]

    return {
      equId: item.equId as number | undefined,
      equName: (item.equName as string) || '锅炉',
      statusName: (item.statusName as string) || EMPTY_TEXT,
      equipmentType,
      metrics: equipmentType === 1 ? boilerMetrics : turbineMetrics,
    }
  })
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test -- src/pages/index/work.models.spec.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/index/work.models.ts src/pages/index/work.models.spec.ts
git commit -m "feat(home): add EP/EO model normalization"
```

### Task 2: Add EP/EO components (Wot Design Uni)

**Files:**
- Create: `src/pages/index/components/WorkEnvironmentalProtection.vue`
- Create: `src/pages/index/components/WorkEnvironmentalProtection.spec.ts`
- Create: `src/pages/index/components/WorkEquipmentOperation.vue`
- Create: `src/pages/index/components/WorkEquipmentOperation.spec.ts`

**Step 1: Write the failing tests**

```ts
// WorkEnvironmentalProtection.spec.ts
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
    })
    expect(wrapper.findAll('.ep-metric')).toHaveLength(6)
    expect(wrapper.text()).toContain('环保指标')
  })
})
```

```ts
// WorkEquipmentOperation.spec.ts
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
          metrics: new Array(12).fill(0).map((_, i) => ({ label: `指标${i}`, value: '1' })),
        }],
      },
    })
    expect(wrapper.findAll('.eo-metric')).toHaveLength(12)
    expect(wrapper.text()).toContain('设备运行')
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm test -- src/pages/index/components/WorkEnvironmentalProtection.spec.ts`  
Expected: FAIL (component missing).  

Run: `pnpm test -- src/pages/index/components/WorkEquipmentOperation.spec.ts`  
Expected: FAIL (component missing).

**Step 3: Write minimal implementation**

```vue
<!-- WorkEnvironmentalProtection.vue (outline) -->
<template>
  <wd-card custom-class="ep-card" custom-content-class="ep-content">
    <template #title>
      <view class="section-header">
        <view class="header-mark" />
        <text class="header-title">环保指标</text>
      </view>
    </template>
    <wd-divider custom-class="section-divider" />
    <wd-swiper
      :list="items"
      height="300rpx"
      :autoplay="items.length > 1"
      :loop="items.length > 1"
      indicator
      indicator-position="bottom"
      :previous-margin="20"
      :next-margin="20"
    >
      <template #default="{ item }">
        <view class="ep-slide">
          <view class="ep-header">
            <image class="ep-icon" src="/static/work/home_boiler.png" mode="aspectFit" />
            <text class="ep-name">{{ item.equName }}</text>
            <wd-tag round color="#fff" :bg-color="statusColor(item.equStatus)" custom-class="status-tag">
              {{ item.equStatus }}
            </wd-tag>
          </view>
          <view class="ep-grid">
            <view v-for="metric in item.metrics" :key="metric.name" class="ep-metric">
              <text class="metric-name">{{ metric.name }}</text>
              <view class="metric-row">
                <text class="metric-value">{{ metric.value }}</text>
                <text class="metric-standard">{{ metric.standard }}</text>
              </view>
            </view>
          </view>
        </view>
      </template>
    </wd-swiper>
  </wd-card>
</template>
```

```vue
<!-- WorkEquipmentOperation.vue (outline) -->
<template>
  <wd-card custom-class="eo-card" custom-content-class="eo-content">
    <template #title>
      <view class="section-header">
        <view class="header-mark" />
        <text class="header-title">设备运行</text>
      </view>
    </template>
    <wd-divider custom-class="section-divider" />
    <wd-swiper
      :list="items"
      height="310rpx"
      :autoplay="items.length > 1"
      :loop="items.length > 1"
      indicator
      indicator-position="bottom"
      :previous-margin="20"
      :next-margin="20"
    >
      <template #default="{ item }">
        <view class="eo-slide">
          <view class="eo-header">
            <image class="eo-icon" src="/static/work/home_boiler.png" mode="aspectFit" />
            <text class="eo-name">{{ item.equName }}</text>
            <wd-tag round color="#fff" :bg-color="statusColor(item.statusName)" custom-class="status-tag">
              {{ item.statusName }}
            </wd-tag>
          </view>
          <view class="eo-grid">
            <view v-for="(metric, idx) in item.metrics" :key="`${idx}-${metric.label}`" class="eo-metric" :class="{ empty: metric.empty }">
              <text v-if="!metric.empty" class="metric-name">{{ metric.label }}</text>
              <text v-if="!metric.empty" class="metric-value">{{ metric.value }}</text>
            </view>
          </view>
        </view>
      </template>
    </wd-swiper>
  </wd-card>
</template>
```

**Step 4: Run tests to verify they pass**

Run: `pnpm test -- src/pages/index/components/WorkEnvironmentalProtection.spec.ts`  
Expected: PASS.  

Run: `pnpm test -- src/pages/index/components/WorkEquipmentOperation.spec.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/index/components/WorkEnvironmentalProtection.vue \
  src/pages/index/components/WorkEnvironmentalProtection.spec.ts \
  src/pages/index/components/WorkEquipmentOperation.vue \
  src/pages/index/components/WorkEquipmentOperation.spec.ts
git commit -m "feat(home): add EP/EO sections with Wot components"
```

### Task 3: Copy Flutter assets + add asset test

**Files:**
- Modify: `src/utils/assets.spec.ts`
- Add: `src/static/work/home_boiler.png`

**Step 1: Write the failing test**

```ts
// src/utils/assets.spec.ts (append required asset)
  'work/home_boiler.png',
```

**Step 2: Run test to verify it fails**

Run: `pnpm test -- src/utils/assets.spec.ts`  
Expected: FAIL missing asset.

**Step 3: Copy asset**

Run:
```bash
cp /Users/yangyang/Documents/snmis_group/mis_gd_group_flutter_3.0/assets/images/home_boiler.png \
  src/static/work/home_boiler.png
```

**Step 4: Run test to verify it passes**

Run: `pnpm test -- src/utils/assets.spec.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/utils/assets.spec.ts src/static/work/home_boiler.png
git commit -m "feat(assets): add home boiler icon"
```

### Task 4: Wire EP/EO into home page

**Files:**
- Modify: `src/pages/index/index.vue`
- Modify: `src/pages/index/index.page.spec.ts`

**Step 1: Write the failing test**

```ts
// src/pages/index/index.page.spec.ts (append)
it('includes EP and EO sections', () => {
  const content = readFileSync(pageUrl, 'utf8')
  expect(content).toMatch(/WorkEnvironmentalProtection/)
  expect(content).toMatch(/WorkEquipmentOperation/)
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test -- src/pages/index/index.page.spec.ts`  
Expected: FAIL.

**Step 3: Implement minimal wiring**

```vue
<!-- src/pages/index/index.vue (outline) -->
<script setup lang="ts">
import WorkEnvironmentalProtection from './components/WorkEnvironmentalProtection.vue'
import WorkEquipmentOperation from './components/WorkEquipmentOperation.vue'
import { normalizeEnvironmentalItems, normalizeEquipmentItems } from './work.models'
// add refs: epItems, eoItems
// add legacyRequest for:
// mobileAppMainMgmt/listRealTimeFlueGas.do
// mobileAppMainMgmt/listEquipmentOperation.do
</script>

<template>
  <!-- replace placeholders -->
  <work-environmental-protection :items="epItems" />
  <work-equipment-operation :items="eoItems" />
</template>
```

**Step 4: Run test to verify it passes**

Run: `pnpm test -- src/pages/index/index.page.spec.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/index/index.vue src/pages/index/index.page.spec.ts
git commit -m "feat(home): wire EP/EO sections"
```

### Task 5: Verification

**Step 1: Run focused test suite**

Run: `pnpm test -- src/pages/index`  
Expected: PASS (component warnings allowed for swiper).

**Step 2: Manual check**

- Open app/h5 home page.
- Confirm EP/EO cards render, swiper works, and status tags colored.

