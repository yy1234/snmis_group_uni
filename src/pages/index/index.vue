<script setup lang="ts">
import type { EoItem, EpItem, FunctionEntry, HeaderMetric, MainIndicator } from './work.models'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { hasLegacySession } from '@/utils/authGuard'
import { legacyRequest } from '@/utils/http/legacyClient'
import { parseLegacyResponse } from '@/utils/login'
import WorkEnvironmentalProtection from './components/WorkEnvironmentalProtection.vue'
import WorkEquipmentOperation from './components/WorkEquipmentOperation.vue'
import WorkFunctionGrid from './components/WorkFunctionGrid.vue'
import WorkHeaderCarousel from './components/WorkHeaderCarousel.vue'
import WorkIndicatorList from './components/WorkIndicatorList.vue'
import {
  buildFunctionEntries,
  normalizeEnvironmentalItems,
  normalizeEquipmentItems,
  normalizeHeaderMetrics,
  normalizeMainIndicators,
} from './work.models'

definePage({
  style: {
    navigationBarTitleText: '工作',
  },
})

const auth = useAuthStore()

const headerItems = ref([1, 2, 3])
const headerMetrics = ref<HeaderMetric[]>([])
const functionEntries = ref<FunctionEntry[]>([])
const indicators = ref<MainIndicator[]>([])
const epItems = ref<EpItem[]>([])
const eoItems = ref<EoItem[]>([])
const loading = ref(false)

onLoad(() => {
  if (!hasLegacySession(auth)) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  fetchWorkData()
})

async function fetchWorkData() {
  loading.value = true
  functionEntries.value = buildFunctionEntries(auth.loginModel?.permInstanceDtos ?? [])
  try {
    const headerRes = await legacyRequest('mobileAppAnalysisMgmt/monthQuotaDataAnalysis.do', {
      userId: auth.loginModel?.userId,
    })
    const headerPayload = parseLegacyResponse<any[]>(headerRes.data)
    if (headerPayload.success === false) {
      uni.showToast({ title: headerPayload.message || '加载失败', icon: 'none' })
    }
    headerMetrics.value = normalizeHeaderMetrics(headerPayload.data ?? [])

    const indicatorRes = await legacyRequest('mobileAppAnalysisMgmt/listMainIndicatorShow.do', {
      userId: auth.loginModel?.userId,
    })
    const indicatorPayload = parseLegacyResponse<any[]>(indicatorRes.data)
    if (indicatorPayload.success === false) {
      uni.showToast({ title: indicatorPayload.message || '加载失败', icon: 'none' })
    }
    indicators.value = normalizeMainIndicators(indicatorPayload.data ?? [])

    const epRes = await legacyRequest('mobileAppMainMgmt/listRealTimeFlueGas.do', {})
    const epPayload = parseLegacyResponse<any[]>(epRes.data)
    if (epPayload.success === false) {
      uni.showToast({ title: epPayload.message || '加载失败', icon: 'none' })
    }
    epItems.value = normalizeEnvironmentalItems(epPayload.data ?? [])

    const eoRes = await legacyRequest('mobileAppMainMgmt/listEquipmentOperation.do', {})
    const eoPayload = parseLegacyResponse<any[]>(eoRes.data)
    if (eoPayload.success === false) {
      uni.showToast({ title: eoPayload.message || '加载失败', icon: 'none' })
    }
    eoItems.value = normalizeEquipmentItems(eoPayload.data ?? [])
  }
  catch (error) {
    uni.showToast({ title: '网络异常', icon: 'none' })
  }
  finally {
    loading.value = false
  }
}

function handleFunction(entry: FunctionEntry) {
  uni.showToast({ title: `${entry.title} 暂未开放`, icon: 'none' })
}
</script>

<template>
  <scroll-view scroll-y class="work-page">
    <work-header-carousel :items="headerItems" :metrics="headerMetrics" />

    <view class="work-section">
      <text class="work-section-title">功能入口</text>
      <work-function-grid :items="functionEntries" @select="handleFunction" />
    </view>

    <view class="work-section">
      <text class="work-section-title">主要指标</text>
      <work-indicator-list :items="indicators" />
    </view>

    <view class="work-section">
      <work-environmental-protection :items="epItems" />
    </view>

    <view class="work-section">
      <work-equipment-operation :items="eoItems" />
    </view>

    <view v-if="loading" class="work-loading">
      加载中...
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.work-page {
  min-height: 100vh;
  background: #f2f2f2;
  padding: 20rpx;
}

.work-section {
  margin-top: 24rpx;
}

.work-section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.work-loading {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  padding: 16rpx 0 32rpx;
}
</style>
