<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '通讯录',
  },
})
</script>

<template>
  <view class="contacts-page">
    <view class="contacts-card">
      通讯录内容（按 iOS 复刻）
    </view>
  </view>
</template>

<style scoped lang="scss">
.contacts-page {
  min-height: 100vh;
  background: #f2f2f2;
  padding: 20rpx;
}

.contacts-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}
</style>
