# Uni iOS Home + Tabs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current uni-app homepage with the iOS “工作” layout and add a 5‑tab bar (工作/消息/待办/通讯录/我的) with visual parity to the existing iOS + Flutter app while keeping WebView flows.

**Architecture:** Keep file‑based routing + custom tabbar. Build “工作” as `pages/index/index.vue` with section components (header carousel, function grid, main indicators, 环保指标, 设备运行). Message/Todo/Contacts/Me are separate pages. Data fetch uses existing `legacyRequest/newRequest` and transforms through pure model helpers (testable).

**Tech Stack:** uni-app (Vue 3), Pinia, Vitest, legacy/new HTTP clients, custom tabbar.

---

### Task 0: Add component test tooling

**Files:**
- Modify: `package.json`
- Modify: `vitest.config.ts`
- Create: `src/tests/setup.ts`

**Step 1: Enable Vue SFC testing in Vitest**

```ts
import Vue from '@vitejs/plugin-vue'
import * as compiler from 'vue/compiler-sfc'

export default defineConfig({
  root: rootDir,
  plugins: [Vue({ compiler })],
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/tests/setup.ts'],
  },
  // keep existing resolve config
})
```

`src/tests/setup.ts`
```ts
import { vi } from 'vitest'

globalThis.uni = {
  navigateTo: vi.fn(),
  reLaunch: vi.fn(),
  showToast: vi.fn(),
  setNavigationBarTitle: vi.fn(),
  switchTab: vi.fn(),
  request: vi.fn(),
  getStorageSync: vi.fn(),
  setStorageSync: vi.fn(),
  removeStorageSync: vi.fn(),
  hideTabBar: vi.fn(),
} as any
```

**Step 2: Add dev dependency for component tests**

```bash
pnpm add -D @vue/test-utils
```

**Step 3: Verify install**

Run: `pnpm vitest run`
Expected: existing tests still pass.

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts src/tests/setup.ts
git commit -m "chore(test): add vue test utils"
```

---

### Task 1: Add asset presence tests + copy iOS assets

**Files:**
- Create: `src/utils/assets.spec.ts`
- Add: `src/static/tabbar/*`
- Add: `src/static/work/header/*`

**Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const staticRoot = path.resolve(root, '../static')

const required = [
  'tabbar/work.png',
  'tabbar/work-active.png',
  'tabbar/message.png',
  'tabbar/message-active.png',
  'tabbar/todo.png',
  'tabbar/todo-active.png',
  'tabbar/contacts.png',
  'tabbar/contacts-active.png',
  'tabbar/profile.png',
  'tabbar/profile-active.png',
  'work/header/work_waste_incineration.png',
  'work/header/work_garbage_power.png',
  'work/header/work_main_thirdPhoto.jpg',
  'work/header/work_currentDot.png',
  'work/header/work_otherDot.png',
  'work/functions/经营计划.png',
]

describe('static assets', () => {
  required.forEach((relPath) => {
    it(`has ${relPath}`, () => {
      expect(existsSync(path.join(staticRoot, relPath))).toBe(true)
    })
  })
})
```

**Step 2: Run test to verify failure**

Run: `pnpm vitest run src/utils/assets.spec.ts`
Expected: FAIL (missing files).

**Step 3: Copy iOS assets**

From the worktree root:

```bash
mkdir -p src/static/tabbar src/static/work/header

cp "../../../snmis_group/XYMis/Assets.xcassets/Tabbar/tabbar_work.imageset/gongzuo.png@3x.png" \
  "src/static/tabbar/work.png"
cp "../../../snmis_group/XYMis/Assets.xcassets/Tabbar/tabbar_work_select.imageset/gongzuo.png@3x.png" \
  "src/static/tabbar/work-active.png"

cp "../../../snmis_group/XYMis/Assets.xcassets/Tabbar/tabbar_message.imageset/圆角矩形 40@3x.png" \
  "src/static/tabbar/message.png"
cp "../../../snmis_group/XYMis/Assets.xcassets/Tabbar/tabbar_message_select.imageset/圆角矩形 40@3x.png" \
  "src/static/tabbar/message-active.png"

cp "../../../snmis_group/XYMis/Assets.xcassets/Tabbar/tabbar_upcoming.imageset/圆角矩形 40@3x.png" \
  "src/static/tabbar/todo.png"
cp "../../../snmis_group/XYMis/Assets.xcassets/Tabbar/tabbar_upcoming_select.imageset/圆角矩形 40@3x.png" \
  "src/static/tabbar/todo-active.png"

cp "../../../snmis_group/XYMis/Assets.xcassets/Tabbar/tabbar_contacts.imageset/lianxiren.png@3x.png" \
  "src/static/tabbar/contacts.png"
cp "../../../snmis_group/XYMis/Assets.xcassets/Tabbar/tabbar_contacts_select.imageset/lianxiren.png@3x.png" \
  "src/static/tabbar/contacts-active.png"

cp "../../../snmis_group/XYMis/Assets.xcassets/Tabbar/tabbar_profile.imageset/wo.png@3x.png" \
  "src/static/tabbar/profile.png"
cp "../../../snmis_group/XYMis/Assets.xcassets/Tabbar/tabbar_profile_select.imageset/wo.png@3x.png" \
  "src/static/tabbar/profile-active.png"

cp "../../../snmis_group/XYMis/Assets.xcassets/Work/work_waste_incineration.imageset/垃圾焚烧@3x.png" \
  "src/static/work/header/work_waste_incineration.png"
cp "../../../snmis_group/XYMis/Assets.xcassets/Work/work_garbage_power.imageset/发电@3x.png" \
  "src/static/work/header/work_garbage_power.png"
cp "../../../snmis_group/XYMis/Assets.xcassets/Work/work_main_thirdPhoto.imageset/banner.jpg" \
  "src/static/work/header/work_main_thirdPhoto.jpg"
cp "../../../snmis_group/XYMis/Assets.xcassets/Work/work_currentDot.imageset/椭圆2@3x.png" \
  "src/static/work/header/work_currentDot.png"
cp "../../../snmis_group/XYMis/Assets.xcassets/Work/work_otherDot.imageset/椭圆2拷贝@3x.png" \
  "src/static/work/header/work_otherDot.png"

mkdir -p src/static/work/functions
for dir in "../../../snmis_group/XYMis/Assets.xcassets/Work/"*.imageset; do \
  name=$(basename "$dir" .imageset); \
  file=$(ls "$dir"/*@3x.png 2>/dev/null | head -n 1); \
  if [ -n "$file" ]; then \
    cp "$file" "src/static/work/functions/${name}.png"; \
  fi; \
done
```

Note: function icon names are kept in Chinese to match `menuText` (same as iOS).

**Step 4: Run test to verify pass**

Run: `pnpm vitest run src/utils/assets.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/static src/utils/assets.spec.ts
git commit -m "chore(assets): add tabbar and work header images"
```

---

### Task 2: Update tabbar config to 5 tabs

**Files:**
- Create: `src/tabbar/config.spec.ts`
- Modify: `src/tabbar/config.ts`
- Modify: `src/tabbar/index.vue` (colors, sizes)

**Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest'
import { customTabbarList, tabBar } from './config'

describe('custom tabbar list', () => {
  it('matches iOS tab order', () => {
    const labels = customTabbarList.map(item => item.text)
    expect(labels).toEqual(['工作', '消息', '待办', '通讯录', '我的'])
  })

  it('uses image icons for all items', () => {
    customTabbarList.forEach((item) => {
      expect(item.iconType).toBe('image')
      expect(item.icon).toMatch(/^\\/static\\/tabbar\\//)
      expect(item.iconActive).toMatch(/^\\/static\\/tabbar\\//)
    })
  })

  it('has tabbar styling aligned to iOS', () => {
    expect(tabBar?.selectedColor).toBe('#008FFF')
  })
})
```

**Step 2: Run test to verify failure**

Run: `pnpm vitest run src/tabbar/config.spec.ts`
Expected: FAIL.

**Step 3: Implement config changes**

```ts
export const customTabbarList: CustomTabBarItem[] = [
  { text: '工作', pagePath: 'pages/index/index', iconType: 'image', icon: '/static/tabbar/work.png', iconActive: '/static/tabbar/work-active.png' },
  { text: '消息', pagePath: 'pages/message/index', iconType: 'image', icon: '/static/tabbar/message.png', iconActive: '/static/tabbar/message-active.png' },
  { text: '待办', pagePath: 'pages/todo/index', iconType: 'image', icon: '/static/tabbar/todo.png', iconActive: '/static/tabbar/todo-active.png' },
  { text: '通讯录', pagePath: 'pages/contacts/index', iconType: 'image', icon: '/static/tabbar/contacts.png', iconActive: '/static/tabbar/contacts-active.png' },
  { text: '我的', pagePath: 'pages/me/me', iconType: 'image', icon: '/static/tabbar/profile.png', iconActive: '/static/tabbar/profile-active.png' },
]

const _tabbar: TabBar = {
  custom: selectedTabbarStrategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR,
  color: '#8C8C8C',
  selectedColor: '#008FFF',
  backgroundColor: '#FFFFFF',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
  list: _tabbarList as unknown as TabBar['list'],
}
```

Update `src/tabbar/index.vue` to align colors:
```ts
const activeColor = '#008FFF'
const inactiveColor = '#8C8C8C'
```

**Step 4: Run test to verify pass**

Run: `pnpm vitest run src/tabbar/config.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/tabbar/config.ts src/tabbar/config.spec.ts src/tabbar/index.vue
git commit -m "feat(tabbar): align with iOS tabs"
```

---

### Task 3: Work page data models

**Files:**
- Create: `src/pages/index/work.models.ts`
- Create: `src/pages/index/work.models.spec.ts`

**Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest'
import { buildFunctionEntries, normalizeHeaderMetrics, normalizeMainIndicators } from './work.models'

describe('work models', () => {
  it('filters function entries by menuLevel', () => {
    const input = [
      { menuText: '经营计划', menuLevel: 2 },
      { menuText: '忽略我', menuLevel: 3 },
    ]
    expect(buildFunctionEntries(input as any)).toEqual([
      { title: '经营计划', icon: '/static/work/functions/经营计划.png' },
    ])
  })

  it('normalizes indicator values', () => {
    const input = [{ indicatorName: '蒸汽', value: '12.3', unit: 't' }]
    expect(normalizeMainIndicators(input as any)).toEqual([
      { name: '蒸汽', value: '12.3', unit: 't' },
    ])
  })

  it('normalizes header metrics', () => {
    const input = [
      { actualData: 12.3, company: 't', proportion: 45.6 },
      { actualData: 8.9, company: 't', proportion: 33.3 },
    ]
    expect(normalizeHeaderMetrics(input as any)).toEqual([
      { value: '12.3', unit: 't', percent: 45.6 },
      { value: '8.9', unit: 't', percent: 33.3 },
    ])
  })
})
```

**Step 2: Run test to verify failure**

Run: `pnpm vitest run src/pages/index/work.models.spec.ts`
Expected: FAIL.

**Step 3: Implement models**

```ts
export type FunctionEntry = { title: string; icon: string }
export type HeaderMetric = { value: string; unit: string; percent: number }
export type MainIndicator = { name: string; value: string; unit: string }

export function buildFunctionEntries(raw: Array<{ menuText?: string; menuLevel?: number }>): FunctionEntry[] {
  return raw
    .filter(item => item.menuLevel === 2 && item.menuText)
    .map(item => ({
      title: item.menuText as string,
      icon: `/static/work/functions/${item.menuText}.png`,
    }))
}

export function normalizeMainIndicators(raw: Array<{ indicatorName?: string; value?: string; unit?: string }>): MainIndicator[] {
  return raw.map(item => ({
    name: item.indicatorName ?? '',
    value: item.value ?? '',
    unit: item.unit ?? '',
  }))
}

export function normalizeHeaderMetrics(raw: Array<{ actualData?: number; company?: string; proportion?: number }>): HeaderMetric[] {
  return raw.map(item => ({
    value: (item.actualData ?? 0).toFixed(1),
    unit: item.company ?? '',
    percent: Number(item.proportion ?? 0),
  }))
}
```

**Step 4: Run test to verify pass**

Run: `pnpm vitest run src/pages/index/work.models.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/index/work.models.ts src/pages/index/work.models.spec.ts
git commit -m "feat(work): add model helpers"
```

---

### Task 4: Build Work page layout (iOS parity)

**Files:**
- Modify: `src/pages/index/index.vue`
- Add: `src/pages/index/components/WorkHeaderCarousel.vue`
- Add: `src/pages/index/components/WorkFunctionGrid.vue`
- Add: `src/pages/index/components/WorkIndicatorList.vue`

**Step 1: Write failing component tests**

Create `src/pages/index/components/WorkHeaderCarousel.spec.ts`,
`src/pages/index/components/WorkFunctionGrid.spec.ts`,
`src/pages/index/components/WorkIndicatorList.spec.ts`.

`src/pages/index/components/WorkHeaderCarousel.spec.ts`
```ts
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WorkHeaderCarousel from './WorkHeaderCarousel.vue'

describe('WorkHeaderCarousel', () => {
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
```

`src/pages/index/components/WorkFunctionGrid.spec.ts`
```ts
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WorkFunctionGrid from './WorkFunctionGrid.vue'

describe('WorkFunctionGrid', () => {
  it('renders items', () => {
    const wrapper = mount(WorkFunctionGrid, {
      props: { items: [{ title: '经营计划', icon: '/static/work/functions/经营计划.png' }] },
    })
    expect(wrapper.findAll('.work-function-item')).toHaveLength(1)
    expect(wrapper.text()).toContain('经营计划')
  })
})
```

`src/pages/index/components/WorkIndicatorList.spec.ts`
```ts
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WorkIndicatorList from './WorkIndicatorList.vue'

describe('WorkIndicatorList', () => {
  it('renders indicators', () => {
    const wrapper = mount(WorkIndicatorList, {
      props: { items: [{ name: '蒸汽', value: '12.3', unit: 't' }] },
    })
    expect(wrapper.findAll('.indicator-card')).toHaveLength(1)
    expect(wrapper.text()).toContain('蒸汽')
  })
})
```

**Step 2: Run test to verify failure**

Run: `pnpm vitest run src/pages/index/components/WorkHeaderCarousel.spec.ts src/pages/index/components/WorkFunctionGrid.spec.ts src/pages/index/components/WorkIndicatorList.spec.ts`
Expected: FAIL.

**Step 3: Implement components**

`src/pages/index/components/WorkHeaderCarousel.vue`
```vue
<template>
  <view class="work-header">
    <swiper class="work-header-swiper" circular autoplay interval="5000">
      <swiper-item class="work-header-slide" v-for="(item, idx) in items" :key="idx">
        <image v-if="idx === 0" class="work-header-bg" src="/static/work/header/work_waste_incineration.png" mode="aspectFill" />
        <image v-else-if="idx === 1" class="work-header-bg" src="/static/work/header/work_garbage_power.png" mode="aspectFill" />
        <image v-else class="work-header-bg" src="/static/work/header/work_main_thirdPhoto.jpg" mode="aspectFill" />
        <view v-if="idx !== 2" class="work-header-wave">
          <view class="wave-circle">
            <text class="wave-title">{{ idx === 0 ? '年度进厂量' : '年度处理量' }}</text>
            <text class="wave-value">{{ firstMetric?.value ?? '--' }}{{ firstMetric?.unit ?? '' }}</text>
            <text class="wave-desc">完成{{ formatPercent(firstMetric?.percent) }}%</text>
          </view>
          <view class="wave-circle">
            <text class="wave-title">{{ idx === 0 ? '年度处理量' : '年度进厂量' }}</text>
            <text class="wave-value">{{ secondMetric?.value ?? '--' }}{{ secondMetric?.unit ?? '' }}</text>
            <text class="wave-desc">完成{{ formatPercent(secondMetric?.percent) }}%</text>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="work-header-dots">
      <image v-for="index in 3" :key="index" class="dot" :src="index === 1 ? '/static/work/header/work_currentDot.png' : '/static/work/header/work_otherDot.png'" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  items: unknown[]
  metrics: Array<{ value: string; unit: string; percent: number }>
}>()

const firstMetric = computed(() => props.metrics?.[0])
const secondMetric = computed(() => props.metrics?.[1])
const formatPercent = (value?: number) => (typeof value === 'number' ? value.toFixed(1) : '--')
</script>

<style scoped lang="scss">
.work-header { position: relative; }
.work-header-swiper { height: 320rpx; border-radius: 24rpx; overflow: hidden; }
.work-header-bg { width: 100%; height: 100%; }
.work-header-wave { position: absolute; left: 0; right: 0; top: 0; bottom: 0; display: flex; align-items: center; justify-content: space-around; }
.wave-circle { width: 220rpx; height: 220rpx; border-radius: 999rpx; border: 6rpx solid #e9b176; background: rgba(255,255,255,0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.wave-title { font-size: 24rpx; color: #813d05; }
.wave-value { font-size: 28rpx; color: #ffffff; margin-top: 6rpx; }
.wave-desc { font-size: 22rpx; color: #9b7a3f; margin-top: 4rpx; }
.work-header-dots { position: absolute; bottom: 12rpx; left: 50%; transform: translateX(-50%); display: flex; gap: 8rpx; }
.dot { width: 16rpx; height: 16rpx; }
</style>
```

`src/pages/index/components/WorkFunctionGrid.vue`
```vue
<template>
  <view class="work-function-grid">
    <view
      v-for="item in items"
      :key="item.title"
      class="work-function-item"
      @tap="emit('select', item)"
    >
      <image class="work-function-icon" :src="item.icon" mode="aspectFit" />
      <text class="work-function-title">{{ item.title }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{ items: Array<{ title: string; icon: string }> }>()
const emit = defineEmits<{ (event: 'select', item: { title: string; icon: string }): void }>()
</script>

<style scoped lang="scss">
.work-function-grid { display: flex; flex-wrap: wrap; gap: 16rpx; background: #fff; border-radius: 20rpx; padding: 20rpx; }
.work-function-item { width: calc(25% - 12rpx); display: flex; flex-direction: column; align-items: center; gap: 8rpx; }
.work-function-icon { width: 70rpx; height: 70rpx; }
.work-function-title { font-size: 22rpx; color: #6c6c6c; text-align: center; }
</style>
```

`src/pages/index/components/WorkIndicatorList.vue`
```vue
<template>
  <view class="work-indicator-list">
    <view v-for="item in items" :key="item.name" class="indicator-card">
      <text class="indicator-name">{{ item.name }}</text>
      <view class="indicator-value">
        <text class="value">{{ item.value }}</text>
        <text class="unit">{{ item.unit }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{ items: Array<{ name: string; value: string; unit: string }> }>()
</script>

<style scoped lang="scss">
.work-indicator-list { display: flex; flex-direction: column; gap: 12rpx; }
.indicator-card { background: #fff; border-radius: 16rpx; padding: 20rpx; display: flex; justify-content: space-between; align-items: center; }
.indicator-name { font-size: 26rpx; color: #333; }
.indicator-value { display: flex; align-items: baseline; gap: 6rpx; }
.value { font-size: 30rpx; color: #008fff; font-weight: 600; }
.unit { font-size: 22rpx; color: #666; }
</style>
```

**Step 4: Integrate Work page layout**

`src/pages/index/index.vue` (replace existing content)
```vue
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { legacyRequest } from '@/utils/http/legacyClient'
import { parseLegacyResponse } from '@/utils/login'
import { parseLegacyResponse } from '@/utils/login'
import { parseLegacyResponse } from '@/utils/login'
import WorkHeaderCarousel from './components/WorkHeaderCarousel.vue'
import WorkFunctionGrid from './components/WorkFunctionGrid.vue'
import WorkIndicatorList from './components/WorkIndicatorList.vue'
import { buildFunctionEntries, normalizeMainIndicators } from './work.models'

definePage({ style: { navigationBarTitleText: '工作' } })

const auth = useAuthStore()
const headerItems = ref([1, 2, 3])
const headerMetrics = ref([])
const functionEntries = ref([])
const indicators = ref([])

onLoad(async () => {
  if (!auth.cookie || !auth.loginModel) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  functionEntries.value = buildFunctionEntries(auth.loginModel.permInstanceDtos || [])
  const headerRes = await legacyRequest('mobileAppAnalysisMgmt/monthQuotaDataAnalysis.do', {
    userId: auth.loginModel.userId,
  })
  const headerPayload = parseLegacyResponse<any>(headerRes.data)
  headerMetrics.value = normalizeHeaderMetrics(headerPayload.data ?? [])
  const res = await legacyRequest('mobileAppAnalysisMgmt/listMainIndicatorShow.do', {
    userId: auth.loginModel.userId,
  })
  const indicatorPayload = parseLegacyResponse<any>(res.data)
  indicators.value = normalizeMainIndicators(indicatorPayload.data ?? [])
})
</script>

<template>
  <scroll-view scroll-y class="work-page">
    <work-header-carousel :items="headerItems" :metrics="headerMetrics" />
    <view class="work-section">
      <text class="work-section-title">功能入口</text>
      <work-function-grid :items="functionEntries" />
    </view>
    <view class="work-section">
      <text class="work-section-title">主要指标</text>
      <work-indicator-list :items="indicators" />
    </view>
    <view class="work-section">
      <text class="work-section-title">环保指标</text>
      <view class="work-card placeholder">环保指标内容（按 Flutter UI 复刻）</view>
    </view>
    <view class="work-section">
      <text class="work-section-title">设备运行</text>
      <view class="work-card placeholder">设备运行内容（按 Flutter UI 复刻）</view>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.work-page { min-height: 100vh; background: #f2f2f2; padding: 20rpx; }
.work-section { margin-top: 24rpx; }
.work-section-title { font-size: 28rpx; font-weight: 600; color: #333; margin-bottom: 16rpx; }
.work-card { background: #fff; border-radius: 20rpx; padding: 24rpx; box-shadow: 0 12rpx 30rpx rgba(0,0,0,0.08); }
.placeholder { color: #999; font-size: 24rpx; }
</style>
```

**Step 5: Run tests to verify pass**

Run: `pnpm vitest run src/pages/index/components/WorkHeaderCarousel.spec.ts src/pages/index/components/WorkFunctionGrid.spec.ts src/pages/index/components/WorkIndicatorList.spec.ts src/pages/index/work.models.spec.ts`
Expected: PASS.

**Step 6: Commit**

```bash
git add src/pages/index/index.vue src/pages/index/components src/pages/index/work.models.ts
git commit -m "feat(work): build work page layout"
```

---

### Task 5: Message page (Flutter parity)

**Files:**
- Create: `src/pages/message/index.vue`
- Create: `src/pages/message/detail.vue`
- Create: `src/pages/message/message.models.ts`
- Create: `src/pages/message/message.models.spec.ts`
- Create: `src/pages/message/index.spec.ts`
- Create: `src/pages/message/detail.spec.ts`

**Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest'
import { groupByType } from './message.models'

describe('message models', () => {
  it('groups messages by type name', () => {
    const input = [
      { classifyDesc: '系统消息', readUserMessageCount: 2, classifyValue: 25 },
      { classifyDesc: '缺陷管理', readUserMessageCount: 1, classifyValue: 5 },
    ]
    expect(groupByType(input as any)).toEqual([
      { title: '系统消息', count: 2, classifyValue: 25 },
      { title: '缺陷管理', count: 1, classifyValue: 5 },
    ])
  })
})
```

`src/pages/message/index.spec.ts`
```ts
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MessagePage from './index.vue'

describe('Message page', () => {
  it('renders toggle labels', () => {
    const wrapper = mount(MessagePage)
    expect(wrapper.text()).toContain('分类')
    expect(wrapper.text()).toContain('时间')
  })
})
```

`src/pages/message/detail.spec.ts`
```ts
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MessageDetail from './detail.vue'

describe('Message detail page', () => {
  it('renders default title', () => {
    const wrapper = mount(MessageDetail)
    expect(wrapper.text()).toContain('消息详情')
  })
})
```

**Step 2: Run test to verify failure**

Run: `pnpm vitest run src/pages/message/message.models.spec.ts src/pages/message/index.spec.ts src/pages/message/detail.spec.ts`
Expected: FAIL.

**Step 3: Implement models + page**

`src/pages/message/message.models.ts`
```ts
export function groupByType(raw: Array<{ classifyDesc?: string; readUserMessageCount?: number; classifyValue?: number }>) {
  return raw.map(item => ({
    title: item.classifyDesc ?? '',
    count: item.readUserMessageCount ?? 0,
    classifyValue: item.classifyValue ?? -1,
  }))
}
```

`src/pages/message/index.vue`
```vue
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import { legacyRequest } from '@/utils/http/legacyClient'
import { groupByType } from './message.models'

definePage({ style: { navigationBarTitleText: '消息' } })

const mode = ref<'type' | 'time'>('type')
const typeList = ref([])
const timeList = ref([])
const activeClassify = ref(-1)

async function loadTypeList() {
  const typeRes = await legacyRequest('mobileAppMessageMgmt/queryUserMessageByCustomClassify.do', {})
  const typePayload = parseLegacyResponse<any>(typeRes.data)
  typeList.value = groupByType(typePayload.data ?? [])
}

async function loadTimeList(classifyValue = -1) {
  const timeRes = await legacyRequest('mobileAppMessageMgmt/listMessageByCustomClassifyValue.do', {
    parentClassify: classifyValue,
  })
  const timePayload = parseLegacyResponse<any>(timeRes.data)
  timeList.value = timePayload.data ?? []
}

async function openType(item: { classifyValue: number }) {
  activeClassify.value = item.classifyValue
  mode.value = 'time'
  await loadTimeList(item.classifyValue)
}

function openDetail(item: { dataId?: number; messageTitle?: string }) {
  if (!item.dataId)
    return
  uni.navigateTo({
    url: `/pages/message/detail?id=${item.dataId}&title=${encodeURIComponent(item.messageTitle || '消息详情')}`,
  })
}

onLoad(async () => {
  await loadTypeList()
})

watch(mode, async (next) => {
  if (next === 'time' && timeList.value.length === 0) {
    await loadTimeList(activeClassify.value)
  }
})
</script>

<template>
  <view class="message-page">
    <view class="message-toggle">
      <text :class="['toggle-item', mode === 'type' && 'active']" @tap="mode = 'type'">分类</text>
      <text :class="['toggle-item', mode === 'time' && 'active']" @tap="mode = 'time'">时间</text>
    </view>
    <view v-if="mode === 'type'" class="message-list">
      <view v-for="item in typeList" :key="item.title" class="message-card" @tap="openType(item)">
        <text class="message-title">{{ item.title }}</text>
        <text class="message-count">{{ item.count }}</text>
      </view>
    </view>
    <view v-else class="message-list">
      <view v-for="item in timeList" :key="item.dataId" class="message-card" @tap="openDetail(item)">
        <text class="message-title">{{ item.messageTitle }}</text>
        <text class="message-sub">{{ item.messageContent }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.message-page { min-height: 100vh; background: #f2f2f2; padding: 20rpx; }
.message-toggle { display: flex; gap: 12rpx; margin-bottom: 20rpx; }
.toggle-item { padding: 10rpx 24rpx; border-radius: 16rpx; background: #fff; color: #666; }
.toggle-item.active { background: #008fff; color: #fff; }
.message-card { background: #fff; border-radius: 16rpx; padding: 20rpx; margin-bottom: 12rpx; }
.message-title { font-size: 26rpx; color: #333; }
.message-count { font-size: 22rpx; color: #999; margin-top: 6rpx; }
.message-sub { font-size: 22rpx; color: #666; margin-top: 6rpx; }
</style>
```

`src/pages/message/detail.vue`
```vue
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { legacyRequest } from '@/utils/http/legacyClient'

definePage({ style: { navigationBarTitleText: '消息详情' } })

const detail = ref<any>(null)

onLoad(async (query) => {
  const id = Number(query?.id || 0)
  const title = query?.title ? decodeURIComponent(String(query.title)) : '消息详情'
  if (title)
    uni.setNavigationBarTitle({ title })
  if (!id)
    return
  const res = await legacyRequest('mobileAppuserMessageMgmt/toAnnounce.do', { dataId: id })
  const payload = parseLegacyResponse<any>(res.data)
  detail.value = payload.data ?? null
})
</script>

<template>
  <view class="message-detail">
    <text class="detail-title">{{ detail?.messageTitle }}</text>
    <text class="detail-time">{{ detail?.createTime }}</text>
    <rich-text class="detail-content" :nodes="detail?.messageContent || ''" />
  </view>
</template>

<style scoped lang="scss">
.message-detail { padding: 24rpx; }
.detail-title { font-size: 30rpx; font-weight: 600; color: #333; }
.detail-time { font-size: 22rpx; color: #999; margin-top: 8rpx; }
.detail-content { margin-top: 20rpx; font-size: 24rpx; color: #444; }
</style>
```

**Step 4: Run test to verify pass**

Run: `pnpm vitest run src/pages/message/message.models.spec.ts src/pages/message/index.spec.ts src/pages/message/detail.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/message
git commit -m "feat(message): add message page"
```

---

### Task 6: Todo page (Flutter parity)

**Files:**
- Create: `src/pages/todo/index.vue`
- Create: `src/pages/todo/todo.models.ts`
- Create: `src/pages/todo/todo.models.spec.ts`
- Create: `src/pages/todo/index.spec.ts`

**Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest'
import { buildTodoQuery, resolveTodoRoute } from './todo.models'

describe('todo models', () => {
  it('uses webview for default todo', () => {
    expect(resolveTodoRoute({ dataId: 1 })).toEqual({ type: 'webview' })
  })

  it('builds todo query params', () => {
    expect(buildTodoQuery({ content: '设备', categoryIds: '1,2' })).toEqual({
      content: '设备',
      categoryIds: '1,2',
    })
  })
})
```

`src/pages/todo/index.spec.ts`
```ts
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoPage from './index.vue'

describe('Todo page', () => {
  it('renders tabs', () => {
    const wrapper = mount(TodoPage)
    expect(wrapper.text()).toContain('待处理')
    expect(wrapper.text()).toContain('已完成')
  })
})
```

**Step 2: Run test to verify failure**

Run: `pnpm vitest run src/pages/todo/todo.models.spec.ts src/pages/todo/index.spec.ts`
Expected: FAIL.

**Step 3: Implement model + page**

`src/pages/todo/todo.models.ts`
```ts
export function resolveTodoRoute(_item: { dataId?: number }) {
  return { type: 'webview' as const }
}

export function buildTodoQuery(params: { content?: string; categoryIds?: string }) {
  return {
    content: params.content ?? '',
    categoryIds: params.categoryIds ?? '',
  }
}
```

`src/pages/todo/index.vue`
```vue
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { newRequest } from '@/utils/http/newClient'
import { buildTodoUrl } from '@/utils/webview'
import { buildTodoQuery } from './todo.models'

definePage({ style: { navigationBarTitleText: '待办' } })

const tab = ref<'pending' | 'done'>('pending')
const items = ref([])
const filtersOpen = ref(false)
const processList = ref<any[]>([])
const activeCategoryIds = ref('')
const searchContent = ref('')

onLoad(async () => {
  const processRes = await newRequest('workflowCategoryMgmt/queryWorkflowCategory.do')
  processList.value = (processRes.data as any)?.data ?? []
  await loadTodos()
})

async function loadTodos() {
  const route = tab.value === 'pending'
    ? 'mobileOrderMgmt/listMobileToDoOrderStep.do'
    : 'mobileOrderMgmt/listMobileFinishOrderStep.do'
  const params = buildTodoQuery({
    content: searchContent.value,
    categoryIds: activeCategoryIds.value,
  })
  const res = await newRequest(route, params)
  items.value = (res.data as any)?.data ?? []
}

function openTodo(item: any) {
  const url = buildTodoUrl({
    workflowId: item.workflowId,
    cellModel: item,
    isFinished: tab.value === 'done',
  })
  uni.navigateTo({ url: `/pages/webview/index?title=${encodeURIComponent(item.title || '待办')}&url=${encodeURIComponent(url)}` })
}
</script>

<template>
  <view class="todo-page">
    <view class="todo-tabs">
      <text :class="['todo-tab', tab === 'pending' && 'active']" @tap="tab = 'pending'">待处理</text>
      <text :class="['todo-tab', tab === 'done' && 'active']" @tap="tab = 'done'">已完成</text>
      <text class="todo-filter" @tap="filtersOpen = true">筛选</text>
    </view>
    <view class="todo-list">
      <view v-for="item in items" :key="item.dataId" class="todo-card" @tap="openTodo(item)">
        <text class="todo-title">{{ item.title || item.processName }}</text>
        <text class="todo-sub">{{ item.createTime }}</text>
      </view>
    </view>

    <view v-if="filtersOpen" class="todo-overlay" @tap="filtersOpen = false">
      <view class="todo-drawer" @tap.stop>
        <view class="drawer-title">流程筛选</view>
        <view class="drawer-list">
          <view
            v-for="item in processList"
            :key="item.categoryId"
            class="drawer-item"
            @tap="activeCategoryIds = String(item.categoryId)"
          >
            {{ item.categoryName }}
          </view>
        </view>
        <button class="drawer-submit" @tap="filtersOpen = false; loadTodos()">应用</button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.todo-page { min-height: 100vh; background: #f2f2f2; padding: 20rpx; }
.todo-tabs { display: flex; gap: 12rpx; margin-bottom: 20rpx; }
.todo-tab { padding: 10rpx 24rpx; border-radius: 16rpx; background: #fff; color: #666; }
.todo-tab.active { background: #008fff; color: #fff; }
.todo-filter { margin-left: auto; color: #008fff; font-size: 24rpx; align-self: center; }
.todo-card { background: #fff; border-radius: 16rpx; padding: 20rpx; margin-bottom: 12rpx; }
.todo-title { font-size: 26rpx; color: #333; }
.todo-sub { font-size: 22rpx; color: #666; margin-top: 6rpx; }
.todo-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; justify-content: flex-end; }
.todo-drawer { width: 70%; height: 100%; background: #fff; padding: 24rpx; }
.drawer-title { font-size: 26rpx; font-weight: 600; margin-bottom: 16rpx; }
.drawer-list { display: flex; flex-direction: column; gap: 12rpx; }
.drawer-item { padding: 12rpx; background: #f6f6f6; border-radius: 12rpx; }
.drawer-submit { margin-top: 20rpx; background: #008fff; color: #fff; }
</style>
```

**Step 4: Run test to verify pass**

Run: `pnpm vitest run src/pages/todo/todo.models.spec.ts src/pages/todo/index.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/todo
git commit -m "feat(todo): add todo page"
```

---

### Task 7: Contacts + Me pages (iOS parity)

**Files:**
- Create: `src/pages/contacts/index.vue`
- Modify: `src/pages/me/me.vue`
- Create: `src/pages/contacts/contacts.spec.ts`
- Create: `src/pages/me/me.spec.ts`

**Step 1: Write failing tests**

```ts
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactsPage from './index.vue'

describe('Contacts page', () => {
  it('renders title', () => {
    const wrapper = mount(ContactsPage)
    expect(wrapper.text()).toContain('通讯录')
  })
})
```

`src/pages/me/me.spec.ts`
```ts
/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MePage from './me.vue'

describe('Me page', () => {
  it('renders title', () => {
    const wrapper = mount(MePage)
    expect(wrapper.text()).toContain('我的')
  })
})
```

**Step 2: Run test to verify failure**

Run: `pnpm vitest run src/pages/contacts/contacts.spec.ts src/pages/me/me.spec.ts`
Expected: FAIL.

**Step 3: Implement pages**

`src/pages/contacts/index.vue`
```vue
<script setup lang="ts">
definePage({ style: { navigationBarTitleText: '通讯录' } })
</script>

<template>
  <view class="contacts-page">
    <view class="contacts-card">通讯录内容（按 iOS 复刻）</view>
  </view>
</template>

<style scoped lang="scss">
.contacts-page { min-height: 100vh; background: #f2f2f2; padding: 20rpx; }
.contacts-card { background: #fff; border-radius: 16rpx; padding: 24rpx; }
</style>
```

`src/pages/me/me.vue`
```vue
<script setup lang="ts">
definePage({ style: { navigationBarTitleText: '我的' } })
</script>

<template>
  <view class="me-page">
    <view class="me-card">我的页面（按 iOS 复刻）</view>
  </view>
</template>

<style scoped lang="scss">
.me-page { min-height: 100vh; background: #f2f2f2; padding: 20rpx; }
.me-card { background: #fff; border-radius: 16rpx; padding: 24rpx; }
</style>
```

**Step 4: Run tests to verify pass**

Run: `pnpm vitest run src/pages/contacts/contacts.spec.ts src/pages/me/me.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/contacts src/pages/me
git commit -m "feat(pages): add contacts and me pages"
```

---

### Task 8: Final verification

**Step 1: Run full tests**

Run: `pnpm test`
Expected: PASS.

**Step 2: Manual smoke**

Run: `pnpm dev:h5` and verify:
- tabbar has 5 items with correct icons
- login redirects to 工作
- 工作页 5 个分区渲染
- 消息/待办/通讯录/我的可进入

**Step 3: Commit (if any remaining)**

```bash
git add .
git commit -m "feat(home): complete iOS parity pages"
```
