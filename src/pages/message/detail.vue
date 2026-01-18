<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { legacyRequest } from '@/utils/http/legacyClient'
import { parseLegacyResponse } from '@/utils/login'

definePage({
  style: {
    navigationBarTitleText: '消息详情',
  },
})

const detail = ref<Record<string, any> | null>(null)

onLoad((query) => {
  const id = Number(query?.id || 0)
  const title = query?.title ? decodeURIComponent(String(query.title)) : '消息详情'
  if (title) {
    uni.setNavigationBarTitle({ title })
  }
  if (!id) {
    return
  }
  loadDetail(id)
})

async function loadDetail(id: number) {
  const res = await legacyRequest('mobileAppuserMessageMgmt/toAnnounce.do', { dataId: id })
  const payload = parseLegacyResponse<Record<string, any>>(res.data)
  if (payload.success === false) {
    uni.showToast({ title: payload.message || '加载失败', icon: 'none' })
  }
  detail.value = payload.data ?? null
}
</script>

<template>
  <view class="message-detail">
    <text class="detail-title">{{ detail?.messageTitle || '消息详情' }}</text>
    <text class="detail-time">{{ detail?.createTime || '' }}</text>
    <rich-text class="detail-content" :nodes="detail?.messageContent || ''" />
  </view>
</template>

<style scoped lang="scss">
.message-detail {
  padding: 24rpx;
}

.detail-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.detail-time {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

.detail-content {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #444;
}
</style>
