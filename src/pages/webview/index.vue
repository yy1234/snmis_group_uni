<template>
  <web-view v-if="url" :src="url" @message="handleMessage" />
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { buildTodoUrl } from '@/utils/webview'

const auth = useAuthStore()
const url = ref('')

onLoad((query) => {
  const rawUrl = query?.url ? decodeURIComponent(String(query.url)) : ''
  const rawTitle = query?.title ? decodeURIComponent(String(query.title)) : ''
  const rawParams = query?.params ? decodeURIComponent(String(query.params)) : ''

  if (rawTitle) {
    uni.setNavigationBarTitle({ title: rawTitle })
  }

  if (rawUrl) {
    url.value = rawUrl
    return
  }

  if (!auth.todoWebViewIP) {
    uni.showToast({ title: 'Web config missing', icon: 'none' })
    uni.reLaunch({ url: '/pages/index/index' })
    return
  }

  let params: Record<string, unknown> = {}
  if (rawParams) {
    try {
      params = JSON.parse(rawParams) as Record<string, unknown>
    }
    catch (error) {
      params = {}
    }
  }
  url.value = buildTodoUrl(params)
})

function handleMessage(event: any) {
  const data = event?.detail?.data?.[0] || {}
  if (data?.name === 'sessionExpiredLayout') {
    auth.clearAuth()
    uni.reLaunch({ url: '/pages/login/index' })
  }
}
</script>
