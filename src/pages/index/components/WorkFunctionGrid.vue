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
defineProps<{ items: Array<{ title: string, icon: string }> }>()
const emit = defineEmits<{ (event: 'select', item: { title: string, icon: string }): void }>()
</script>

<style scoped lang="scss">
.work-function-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
}

.work-function-item {
  width: calc(25% - 12rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.work-function-icon {
  width: 70rpx;
  height: 70rpx;
}

.work-function-title {
  font-size: 22rpx;
  color: #6c6c6c;
  text-align: center;
}
</style>
