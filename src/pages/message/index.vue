<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import { legacyRequest } from '@/utils/http/legacyClient'
import { parseLegacyResponse } from '@/utils/login'
import { groupByType } from './message.models'

definePage({
  style: {
    navigationBarTitleText: '消息',
  },
})

const mode = ref<'type' | 'time'>('type')
const typeList = ref<Array<{ title: string, count: number, classifyValue: number }>>([])
const timeList = ref<Array<{ dataId?: number, messageTitle?: string, messageContent?: string }>>([])
const activeClassify = ref(-1)

async function loadTypeList() {
  const typeRes = await legacyRequest('mobileAppMessageMgmt/queryUserMessageByCustomClassify.do', {})
  const typePayload = parseLegacyResponse<any[]>(typeRes.data)
  if (typePayload.success === false) {
    uni.showToast({ title: typePayload.message || '加载失败', icon: 'none' })
  }
  typeList.value = groupByType(typePayload.data ?? [])
}

async function loadTimeList(classifyValue = -1) {
  const timeRes = await legacyRequest('mobileAppMessageMgmt/listMessageByCustomClassifyValue.do', {
    parentClassify: classifyValue,
  })
  const timePayload = parseLegacyResponse<any[]>(timeRes.data)
  if (timePayload.success === false) {
    uni.showToast({ title: timePayload.message || '加载失败', icon: 'none' })
  }
  timeList.value = timePayload.data ?? []
}

function openType(item: { classifyValue: number }) {
  activeClassify.value = item.classifyValue
  mode.value = 'time'
  loadTimeList(item.classifyValue)
}

function openDetail(item: { dataId?: number, messageTitle?: string }) {
  if (!item.dataId)
    return
  uni.navigateTo({
    url: `/pages/message/detail?id=${item.dataId}&title=${encodeURIComponent(item.messageTitle || '消息详情')}`,
  })
}

onLoad(() => {
  loadTypeList()
})

watch(mode, (next) => {
  if (next === 'time' && timeList.value.length === 0) {
    loadTimeList(activeClassify.value)
  }
})
</script>

<template>
  <view class="message-page">
    <view class="message-toggle">
      <text class="toggle-item" :class="[mode === 'type' && 'active']" @tap="mode = 'type'">分类</text>
      <text class="toggle-item" :class="[mode === 'time' && 'active']" @tap="mode = 'time'">时间</text>
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
.message-page {
  min-height: 100vh;
  background: #f2f2f2;
  padding: 20rpx;
}

.message-toggle {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.toggle-item {
  padding: 10rpx 24rpx;
  border-radius: 16rpx;
  background: #fff;
  color: #666;
}

.toggle-item.active {
  background: #008fff;
  color: #fff;
}

.message-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 12rpx;
}

.message-title {
  font-size: 26rpx;
  color: #333;
}

.message-count {
  font-size: 22rpx;
  color: #999;
  margin-top: 6rpx;
}

.message-sub {
  font-size: 22rpx;
  color: #666;
  margin-top: 6rpx;
}
</style>
