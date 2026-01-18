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
      :list="props.items"
      height="300rpx"
      :autoplay="props.items.length > 1"
      :loop="props.items.length > 1"
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
            <view class="status-wrap">
              <wd-tag round color="#fff" :bg-color="statusColor(item.equStatus)" custom-class="status-tag">
                {{ item.equStatus }}
              </wd-tag>
            </view>
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

<script setup lang="ts">
import type { EpItem } from '../work.models'
import { resolveEquipmentStatusColor } from '../work.models'

const props = withDefaults(defineProps<{ items?: EpItem[] }>(), {
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

.ep-slide {
  padding: 0 8rpx 8rpx;
}

.ep-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 4rpx 12rpx 8rpx;
}

.ep-icon {
  width: 36rpx;
  height: 36rpx;
}

.ep-name {
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

.ep-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 10rpx;
  row-gap: 10rpx;
  padding: 0 36rpx;
}

.ep-metric {
  background: #f6f8fb;
  border-radius: 12rpx;
  padding: 10rpx 12rpx;
  min-height: 64rpx;
}

.metric-name {
  font-size: 22rpx;
  color: #8a94a6;
}

.metric-row {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
  margin-top: 4rpx;
}

.metric-value {
  font-size: 26rpx;
  color: #2f3133;
  font-weight: 600;
}

.metric-standard {
  font-size: 20rpx;
  color: #9aa3b2;
}
</style>
