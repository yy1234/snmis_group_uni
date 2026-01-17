<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { buildTodoUrl } from '@/utils/webview'

definePage({
  style: {
    navigationBarTitleText: 'Home',
  },
})

const auth = useAuthStore()

const displayName = computed(() => {
  return auth.loginModel?.userName || auth.loginModel?.loginName || 'User'
})

const entries = [
  {
    key: 'todo',
    title: 'Todo Center',
    description: 'Pending tasks and approvals',
    params: { isFinished: false },
  },
  {
    key: 'done',
    title: 'Completed',
    description: 'History and archived items',
    params: { isFinished: true },
  },
  {
    key: 'materials',
    title: 'Materials',
    description: 'Requests and inventory',
    params: { isMaterialRequisition: true },
  },
  {
    key: 'work',
    title: 'Work Tickets',
    description: 'Field execution workflows',
    params: {},
  },
]

const hasWebConfig = computed(() => Boolean(auth.todoWebViewIP))

onLoad(() => {
  if (!auth.cookie || !auth.loginModel) {
    uni.reLaunch({ url: '/pages/login/index' })
  }
})

function openEntry(entry: typeof entries[number]) {
  if (!hasWebConfig.value) {
    uni.showToast({ title: 'Web config missing', icon: 'none' })
    return
  }
  const url = buildTodoUrl(entry.params || {})
  const title = entry.title
  uni.navigateTo({
    url: `/pages/webview/index?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  })
}

function logout() {
  auth.clearAuth()
  uni.reLaunch({ url: '/pages/login/index' })
}
</script>

<template>
  <view class="portal">
    <view class="hero">
      <view class="hero-card">
        <text class="hero-title">Welcome back</text>
        <text class="hero-name">{{ displayName }}</text>
        <text class="hero-subtitle">Unified operations workspace</text>
      </view>
      <button class="ghost" @tap="logout">
        Sign Out
      </button>
    </view>

    <view class="section">
      <text class="section-title">WebView Launchpad</text>
      <text class="section-subtitle">All flows stay on the unified web stack.</text>
    </view>

    <view class="entry-grid">
      <view
        v-for="entry in entries"
        :key="entry.key"
        class="entry-card"
        @tap="openEntry(entry)"
      >
        <text class="entry-title">{{ entry.title }}</text>
        <text class="entry-desc">{{ entry.description }}</text>
        <view class="entry-footer">
          <text class="entry-link">Open</text>
        </view>
      </view>
    </view>

    <view v-if="!hasWebConfig" class="warning">
      <text>Web config not loaded. Please sign in again.</text>
    </view>
  </view>
</template>

<style lang="scss">
.portal {
  min-height: 100vh;
  padding: 32rpx 32rpx 80rpx;
  background: linear-gradient(180deg, #f4f7ff 0%, #f7f2ec 50%, #f4f4f2 100%);
  font-family: 'Noto Sans SC', 'PingFang SC', 'Helvetica Neue', sans-serif;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.hero-card {
  padding: 28rpx 32rpx;
  border-radius: 24rpx;
  background: #1b2345;
  color: #fff;
  box-shadow: 0 18rpx 48rpx rgba(27, 35, 69, 0.35);
}

.hero-title {
  font-size: 26rpx;
  opacity: 0.7;
}

.hero-name {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  margin-top: 8rpx;
}

.hero-subtitle {
  display: block;
  font-size: 22rpx;
  margin-top: 8rpx;
  opacity: 0.8;
}

.section {
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1b2345;
}

.section-subtitle {
  display: block;
  font-size: 22rpx;
  color: #6b7280;
  margin-top: 6rpx;
}

.entry-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.entry-card {
  width: calc(50% - 10rpx);
  padding: 24rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 14rpx 32rpx rgba(24, 31, 54, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  transition: transform 0.2s ease;
}

.entry-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #1b2345;
}

.entry-desc {
  font-size: 22rpx;
  color: #6b7280;
}

.entry-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.entry-link {
  font-size: 22rpx;
  color: #2f4bbd;
}

.ghost {
  align-self: flex-start;
  padding: 12rpx 24rpx;
  border-radius: 14rpx;
  border: 1rpx solid rgba(27, 35, 69, 0.2);
  background: #fff;
  color: #1b2345;
  font-size: 22rpx;
}

.warning {
  margin-top: 32rpx;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  background: rgba(255, 200, 120, 0.2);
  color: #8a4b13;
  font-size: 22rpx;
}
</style>
