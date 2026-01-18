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
defineProps<{ items: Array<{ name: string, value: string, unit: string }> }>()
</script>

<style scoped lang="scss">
.work-indicator-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.indicator-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.indicator-name {
  font-size: 26rpx;
  color: #333;
}

.indicator-value {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}

.value {
  font-size: 30rpx;
  color: #008fff;
  font-weight: 600;
}

.unit {
  font-size: 22rpx;
  color: #666;
}
</style>
