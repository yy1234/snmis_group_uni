<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import { newRequest } from '@/utils/http/newClient'
import { buildTodoUrl } from '@/utils/webview'
import { buildTodoQuery } from './todo.models'

definePage({
  style: {
    navigationBarTitleText: '待办',
  },
})

const tab = ref<'pending' | 'done'>('pending')
const items = ref<any[]>([])
const filtersOpen = ref(false)
const processList = ref<any[]>([])
const activeCategoryIds = ref('')
const searchContent = ref('')

onLoad(async () => {
  const processRes = await newRequest('workflowCategoryMgmt/queryWorkflowCategory.do')
  processList.value = (processRes.data as any)?.data ?? []
  await loadTodos()
})

watch(tab, () => {
  loadTodos()
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
  uni.navigateTo({
    url: `/pages/webview/index?title=${encodeURIComponent(item.title || '待办')}&url=${encodeURIComponent(url)}`,
  })
}

function applyFilter() {
  filtersOpen.value = false
  loadTodos()
}
</script>

<template>
  <view class="todo-page">
    <view class="todo-tabs">
      <text class="todo-tab" :class="[tab === 'pending' && 'active']" @tap="tab = 'pending'">待处理</text>
      <text class="todo-tab" :class="[tab === 'done' && 'active']" @tap="tab = 'done'">已完成</text>
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
        <view class="drawer-title">
          待办筛选
        </view>
        <view class="drawer-field">
          <text class="drawer-label">关键字</text>
          <input v-model="searchContent" class="drawer-input" placeholder="请输入关键字">
        </view>
        <view class="drawer-field">
          <text class="drawer-label">流程类型</text>
          <view class="drawer-list">
            <view class="drawer-item" @tap="activeCategoryIds = ''">
              全部
            </view>
            <view
              v-for="item in processList"
              :key="item.dataId"
              class="drawer-item"
              @tap="activeCategoryIds = String(item.dataId)"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
        <button class="drawer-submit" @tap="applyFilter">
          应用
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.todo-page {
  min-height: 100vh;
  background: #f2f2f2;
  padding: 20rpx;
}

.todo-tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.todo-tab {
  padding: 10rpx 24rpx;
  border-radius: 16rpx;
  background: #fff;
  color: #666;
}

.todo-tab.active {
  background: #008fff;
  color: #fff;
}

.todo-filter {
  margin-left: auto;
  color: #008fff;
  font-size: 24rpx;
  align-self: center;
}

.todo-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 12rpx;
}

.todo-title {
  font-size: 26rpx;
  color: #333;
}

.todo-sub {
  font-size: 22rpx;
  color: #666;
  margin-top: 6rpx;
}

.todo-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: flex-end;
}

.todo-drawer {
  width: 70%;
  height: 100%;
  background: #fff;
  padding: 24rpx;
}

.drawer-title {
  font-size: 26rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.drawer-field {
  margin-bottom: 16rpx;
}

.drawer-label {
  display: block;
  font-size: 22rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.drawer-input {
  background: #f6f6f6;
  border-radius: 12rpx;
  padding: 12rpx;
  font-size: 22rpx;
}

.drawer-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.drawer-item {
  padding: 12rpx;
  background: #f6f6f6;
  border-radius: 12rpx;
  font-size: 22rpx;
}

.drawer-submit {
  margin-top: 20rpx;
  background: #008fff;
  color: #fff;
}
</style>
