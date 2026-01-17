<script setup lang="ts">
import type { LoginType } from '@/utils/login'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { computed, reactive, ref } from 'vue'
import { fetchEncryptedParameter, login } from '@/api/legacy/auth'
import { fetchMobileListParams } from '@/api/legacy/config'
import { useAuthStore } from '@/store/auth'
import { encryptPassword } from '@/utils/crypto'
import { legacyRequest } from '@/utils/http'
import {
  buildLoginPayload,
  extractSessionCookie,

  normalizeTodoWebViewIP,
  parseLegacyResponse,
  resolveLegacyConfig,
} from '@/utils/login'

const auth = useAuthStore()
const loginType = ref<LoginType>('password')
const isLoading = ref(false)
const errorMessage = ref('')
const sendCooldown = ref(0)
const form = reactive({
  loginName: '',
  password: '',
  mobile: '',
  captcha: '',
})

const isCaptchaLogin = computed(() => loginType.value === 'captcha')
const accountValue = computed({
  get: () => (isCaptchaLogin.value ? form.mobile : form.loginName),
  set: (value: string) => {
    if (isCaptchaLogin.value) {
      form.mobile = value
    }
    else {
      form.loginName = value
    }
  },
})
const secretValue = computed({
  get: () => (isCaptchaLogin.value ? form.captcha : form.password),
  set: (value: string) => {
    if (isCaptchaLogin.value) {
      form.captcha = value
    }
    else {
      form.password = value
    }
  },
})
const canSubmit = computed(() => {
  if (isCaptchaLogin.value) {
    return form.mobile.trim().length > 0 && form.captcha.trim().length > 0
  }
  return form.loginName.trim().length > 0 && form.password.trim().length > 0
})
const sendLabel = computed(() => (sendCooldown.value > 0 ? `${sendCooldown.value}s` : 'Send Code'))

let sendTimer: number | null = null

onLoad(() => {
  if (auth.cookie && auth.loginModel) {
    uni.reLaunch({ url: '/pages/index/index' })
  }
})

onUnload(() => {
  if (sendTimer) {
    clearInterval(sendTimer)
    sendTimer = null
  }
})

function getDeviceName() {
  try {
    const info = uni.getSystemInfoSync()
    return info.model || info.deviceId || info.platform || 'unknown'
  }
  catch (error) {
    return 'unknown'
  }
}

function applyLegacyConfig(loginName?: string) {
  const config = resolveLegacyConfig(loginName)
  auth.setAuth(config)
  return config
}

function startCooldown(seconds = 60) {
  if (sendTimer)
    clearInterval(sendTimer)
  sendCooldown.value = seconds
  sendTimer = setInterval(() => {
    sendCooldown.value -= 1
    if (sendCooldown.value <= 0) {
      clearInterval(sendTimer!)
      sendTimer = null
    }
  }, 1000) as unknown as number
}

async function handleSendCode() {
  errorMessage.value = ''
  if (!form.mobile.trim()) {
    uni.showToast({ title: 'Mobile required', icon: 'none' })
    return
  }
  if (sendCooldown.value > 0)
    return

  applyLegacyConfig(form.mobile.trim())

  try {
    isLoading.value = true
    const response = await legacyRequest('mobileAppBasicMgmt/sendVerificationCode.do', {
      data: { mobile: form.mobile.trim(), type: '2' },
    })
    const parsed = parseLegacyResponse(response.data)
    if (!parsed.success) {
      const message = parsed.message || 'Send failed'
      errorMessage.value = message
      uni.showToast({ title: message, icon: 'none' })
      return
    }
    startCooldown(60)
    uni.showToast({ title: 'Code sent', icon: 'none' })
  }
  catch (error) {
    errorMessage.value = 'Send failed'
    uni.showToast({ title: 'Send failed', icon: 'none' })
  }
  finally {
    isLoading.value = false
  }
}

async function handleLogin() {
  if (!canSubmit.value || isLoading.value)
    return
  errorMessage.value = ''

  const loginName = form.loginName.trim()
  const mobile = form.mobile.trim()
  const rawPassword = form.password.trim()
  const captcha = form.captcha.trim()

  applyLegacyConfig(isCaptchaLogin.value ? mobile : loginName)

  try {
    isLoading.value = true
    let password = rawPassword

    if (!isCaptchaLogin.value) {
      const encryptResponse = await fetchEncryptedParameter()
      const encryptParsed = parseLegacyResponse<string>(encryptResponse.data)
      const publicKey = encryptParsed.data
      if (encryptParsed.success && publicKey) {
        const encrypted = encryptPassword(rawPassword, publicKey)
        if (encrypted)
          password = encrypted
      }
    }

    const payload = buildLoginPayload({
      loginType: loginType.value,
      loginName,
      password,
      mobile,
      captcha,
      deviceName: getDeviceName(),
    })

    const response = await login(payload)
    const parsed = parseLegacyResponse(response.data)
    if (!parsed.success) {
      const message = parsed.message || 'Login failed'
      errorMessage.value = message
      uni.showToast({ title: message, icon: 'none' })
      return
    }

    const cookie = extractSessionCookie(response.header || {}) || auth.cookie || ''
    const model = {
      ...((parsed.data as Record<string, unknown>) || {}),
      password: isCaptchaLogin.value ? undefined : rawPassword,
      loginName: (parsed.data as any)?.loginName || loginName,
      type: isCaptchaLogin.value ? 2 : 1,
    }
    const normalized = resolveLegacyConfig(model.loginName as string | undefined)
    auth.setAuth({
      cookie,
      loginAddress: normalized.loginAddress,
      serverAddress: normalized.serverAddress,
      loginModel: model,
    })

    const configResponse = await fetchMobileListParams()
    const configParsed = parseLegacyResponse<Array<{ attribute?: string, value?: string }>>(
      configResponse.data,
    )
    if (configParsed.success && Array.isArray(configParsed.data)) {
      let newServer = auth.newServer
      let todoWebViewIP = auth.todoWebViewIP
      configParsed.data.forEach((item) => {
        if (item.attribute === 'NEW_WF_PROJECT_PATH') {
          newServer = item.value || ''
        }
        if (item.attribute === 'NEWPROJECTUI_PATH') {
          todoWebViewIP = normalizeTodoWebViewIP(item.value)
        }
      })
      auth.setAuth({ newServer: newServer || '', todoWebViewIP: todoWebViewIP || '' })
    }

    uni.reLaunch({ url: '/pages/index/index' })
  }
  catch (error) {
    errorMessage.value = 'Login failed'
    uni.showToast({ title: 'Login failed', icon: 'none' })
  }
  finally {
    isLoading.value = false
  }
}

function setLoginType(type: LoginType) {
  loginType.value = type
  errorMessage.value = ''
}
</script>

<template>
  <view class="login-screen">
    <view class="login-bg">
      <view class="orb orb-a" />
      <view class="orb orb-b" />
      <view class="orb orb-c" />
    </view>

    <view class="login-card">
      <view class="brand">
        <text class="brand-title">SNMIS Portal</text>
        <text class="brand-subtitle">Unified access for operations</text>
      </view>

      <view class="segmented">
        <view class="seg-item" :class="{ active: !isCaptchaLogin }" @tap="setLoginType('password')">
          Password
        </view>
        <view class="seg-item" :class="{ active: isCaptchaLogin }" @tap="setLoginType('captcha')">
          SMS Code
        </view>
      </view>

      <view class="field">
        <text class="label">{{ isCaptchaLogin ? 'Mobile' : 'Login Name' }}</text>
        <input
          v-model="accountValue"
          class="input"
          type="text"
          :placeholder="isCaptchaLogin ? 'e.g. 13800138000' : 'e.g. user01'"
          confirm-type="next"
        >
      </view>

      <view class="field">
        <text class="label">{{ isCaptchaLogin ? 'Code' : 'Password' }}</text>
        <view class="input-row">
          <input
            v-model="secretValue"
            class="input"
            :type="isCaptchaLogin ? 'number' : 'password'"
            :password="!isCaptchaLogin"
            :placeholder="isCaptchaLogin ? 'Verification code' : 'Your password'"
            confirm-type="done"
            @confirm="handleLogin"
          >
          <button
            v-if="isCaptchaLogin"
            class="ghost"
            :disabled="sendCooldown > 0"
            @tap="handleSendCode"
          >
            {{ sendLabel }}
          </button>
        </view>
      </view>

      <button class="primary" :loading="isLoading" :disabled="!canSubmit" @tap="handleLogin">
        Sign In
      </button>

      <text v-if="errorMessage" class="error">{{ errorMessage }}</text>
    </view>
  </view>
</template>

<style lang="scss">
.login-screen {
  position: relative;
  min-height: 100vh;
  padding: 48rpx 40rpx 80rpx;
  background: linear-gradient(160deg, #f2f5ff 0%, #fcefe8 40%, #f7f7f2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Helvetica Neue', sans-serif;
}

.login-bg .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0.7;
  animation: float 10s ease-in-out infinite;
}

.orb-a {
  width: 320rpx;
  height: 320rpx;
  background: radial-gradient(circle, rgba(93, 135, 255, 0.35), rgba(93, 135, 255, 0));
  top: 80rpx;
  left: -40rpx;
}

.orb-b {
  width: 260rpx;
  height: 260rpx;
  background: radial-gradient(circle, rgba(255, 164, 93, 0.4), rgba(255, 164, 93, 0));
  bottom: 120rpx;
  right: -60rpx;
  animation-delay: 1.2s;
}

.orb-c {
  width: 200rpx;
  height: 200rpx;
  background: radial-gradient(circle, rgba(75, 208, 170, 0.35), rgba(75, 208, 170, 0));
  top: 50%;
  right: 40rpx;
  animation-delay: 2.2s;
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 640rpx;
  padding: 48rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24rpx 60rpx rgba(28, 31, 52, 0.12);
  backdrop-filter: blur(10px);
  animation: fadeUp 0.6s ease;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 32rpx;
}

.brand-title {
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
  color: #1b1e2e;
}

.brand-subtitle {
  font-size: 24rpx;
  color: #586077;
}

.segmented {
  display: flex;
  background: #f2f4fa;
  border-radius: 18rpx;
  padding: 8rpx;
  margin-bottom: 32rpx;
}

.seg-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 24rpx;
  color: #586077;
  border-radius: 14rpx;
  transition: all 0.2s ease;
}

.seg-item.active {
  background: #1f2b5b;
  color: #fff;
  font-weight: 600;
}

.field {
  margin-bottom: 24rpx;
}

.label {
  display: block;
  font-size: 22rpx;
  color: #61697f;
  margin-bottom: 12rpx;
}

.input-row {
  display: flex;
  gap: 12rpx;
  align-items: center;
}

.input {
  flex: 1;
  background: #f7f8fb;
  border-radius: 16rpx;
  padding: 18rpx 20rpx;
  font-size: 26rpx;
  color: #1b1e2e;
}

.primary {
  margin-top: 16rpx;
  background: linear-gradient(120deg, #1f2b5b, #2d4bb8);
  color: #fff;
  border-radius: 16rpx;
  padding: 20rpx 0;
  font-size: 28rpx;
  font-weight: 600;
}

.primary[disabled] {
  opacity: 0.6;
}

.ghost {
  padding: 0 18rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 14rpx;
  background: #fff;
  border: 1rpx solid #d7dce8;
  font-size: 22rpx;
  color: #1f2b5b;
}

.error {
  margin-top: 16rpx;
  color: #c9473f;
  font-size: 22rpx;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-16rpx);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
