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
      :list="props.items"
      height="310rpx"
      :autoplay="props.items.length > 1"
      :loop="props.items.length > 1"
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
            <view class="status-wrap">
              <wd-tag round color="#fff" :bg-color="statusColor(item.statusName)" custom-class="status-tag">
                {{ item.statusName }}
              </wd-tag>
            </view>
          </view>
          <view class="eo-grid">
            <view
              v-for="(metric, index) in item.metrics"
              :key="`${index}-${metric.label}`"
              class="eo-metric"
              :class="{ empty: metric.empty }"
            >
              <template v-if="!metric.empty">
                <text class="metric-name">{{ metric.label }}</text>
                <text class="metric-value">{{ metric.value }}</text>
              </template>
            </view>
          </view>
        </view>
      </template>
    </wd-swiper>
  </wd-card>
</template>

<script setup lang="ts">
import type { EoItem } from '../work.models'
import { resolveEquipmentStatusColor } from '../work.models'

const props = withDefaults(defineProps<{ items?: EoItem[] }>(), {
  items: () => [],
})

const statusColor = (status?: string) => resolveEquipmentStatusColor(status)
</script>

<style scoped lang="scss">
.section-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 12rpx 0 0;
}

.header-mark {
  width: 6rpx;
  height: 24rpx;
  border-radius: 4rpx;
  background: #008fff;
}

.header-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
}

:deep(.section-divider) {
  margin: 12rpx 0 8rpx;
}

.eo-slide {
  padding: 0 8rpx 8rpx;
}

.eo-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 4rpx 12rpx 8rpx;
}

.eo-icon {
  width: 36rpx;
  height: 36rpx;
}

.eo-name {
  font-size: 26rpx;
  color: #222;
  font-weight: 600;
}

.status-wrap {
  margin-left: auto;
}

:deep(.status-tag) {
  padding: 2rpx 8rpx;
  font-size: 22rpx;
}

.eo-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 10rpx;
  row-gap: 10rpx;
  padding: 0 16rpx;
}

.eo-metric {
  min-height: 62rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f6f8fb;
  border-radius: 12rpx;
}

.eo-metric.empty {
  background: transparent;
}

.metric-name {
  font-size: 22rpx;
  color: #8a94a6;
}

.metric-value {
  font-size: 24rpx;
  color: #2f3133;
  font-weight: 600;
  margin-top: 4rpx;
}
</style>
