<script setup lang="ts">
import type { LoginType } from '@/utils/login'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { computed, reactive, ref } from 'vue'
import { fetchEncryptedParameter, login } from '@/api/legacy/auth'
import { fetchMobileListParams } from '@/api/legacy/config'
import { useAuthStore } from '@/store/auth'
import { hasLegacySession } from '@/utils/authGuard'
import { encryptPassword } from '@/utils/crypto'
import { legacyRequest } from '@/utils/http'
import {
  buildLoginPayload,
  extractSessionCookie,
  normalizeTodoWebViewIP,
  parseLegacyResponse,
  resolveLegacyConfig,
} from '@/utils/login'
import { loadRemember, saveRemember } from '@/utils/remember'

const auth = useAuthStore()
const loginType = ref<LoginType>('password')
const showSmsToggle = false
const rememberPassword = ref(false)
const isLoading = ref(false)
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
const accountPlaceholder = computed(() => (isCaptchaLogin.value ? '手机号' : '用户账号'))
const secretPlaceholder = computed(() => (isCaptchaLogin.value ? '请输入验证码' : '请输入密码'))
const canSubmit = computed(() => {
  if (isCaptchaLogin.value) {
    return form.mobile.trim().length > 0 && form.captcha.trim().length > 0
  }
  return form.loginName.trim().length > 0 && form.password.trim().length > 0
})
const sendLabel = computed(() => (sendCooldown.value > 0 ? `${sendCooldown.value}s` : '免费获取'))

let sendTimer: number | null = null
let logoTapTimer: number | null = null
let logoTapCount = 0

onLoad(() => {
  const rememberState = loadRemember()
  rememberPassword.value = rememberState.remember
  form.loginName = rememberState.loginName
  if (rememberState.remember) {
    form.password = rememberState.password
  }

  if (hasLegacySession(auth)) {
    uni.reLaunch({ url: '/pages/index/index' })
  }
})

onUnload(() => {
  if (sendTimer) {
    clearInterval(sendTimer)
    sendTimer = null
  }
  if (logoTapTimer) {
    clearTimeout(logoTapTimer)
    logoTapTimer = null
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

function toggleRemember() {
  rememberPassword.value = !rememberPassword.value
  saveRemember({
    remember: rememberPassword.value,
    loginName: form.loginName.trim() || form.mobile.trim(),
    password: form.password,
  })
}

function handleLogoTap() {
  logoTapCount += 1
  if (logoTapTimer) {
    clearTimeout(logoTapTimer)
    logoTapTimer = null
  }
  if (logoTapCount >= 5) {
    logoTapCount = 0
    handleChangeIP()
    return
  }
  logoTapTimer = setTimeout(() => {
    logoTapCount = 0
    logoTapTimer = null
  }, 800) as unknown as number
}

function handleChangeIP() {
  console.log('change IP/port entry tapped')
}

async function handleSendCode() {
  if (!form.mobile.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
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
      uni.showToast({ title: parsed.message || '发送失败', icon: 'none' })
      return
    }
    startCooldown(60)
    uni.showToast({ title: '已发送', icon: 'none' })
  }
  catch (error) {
    uni.showToast({ title: '发送失败', icon: 'none' })
  }
  finally {
    isLoading.value = false
  }
}

async function handleLogin() {
  if (isLoading.value)
    return
  if (!canSubmit.value) {
    uni.showToast({
      title: isCaptchaLogin.value ? '请输入手机号或验证码' : '请输入账号或密码',
      icon: 'none',
    })
    return
  }

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
      uni.showToast({ title: parsed.message || '登录失败', icon: 'none' })
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

    const loginAccount = isCaptchaLogin.value ? mobile : loginName
    const shouldRemember = rememberPassword.value && !isCaptchaLogin.value
    saveRemember({ remember: shouldRemember, loginName: loginAccount, password: rawPassword })

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
    uni.showToast({ title: '登录失败', icon: 'none' })
  }
  finally {
    isLoading.value = false
  }
}

function setLoginType(type: LoginType) {
  loginType.value = type
}
</script>

<template>
  <view class="login-page">
    <image
      class="login-logo"
      src="/static/login/login_headerImage@2x.png"
      mode="aspectFit"
      alt="SNMIS"
      @tap="handleLogoTap"
    />

    <view class="login-form">
      <view class="input-group">
        <view class="input-row">
          <view class="input-icon-box">
            <image
              class="input-icon"
              src="/static/login/login_loginName_icon@2x.png"
              mode="aspectFit"
              alt="账号"
            />
          </view>
          <input
            v-model="accountValue"
            class="input-control"
            :type="isCaptchaLogin ? 'number' : 'text'"
            :placeholder="accountPlaceholder"
            confirm-type="next"
          >
          <view class="input-right" />
        </view>
        <view class="input-line" />
      </view>

      <view class="input-group">
        <view class="input-row">
          <view class="input-icon-box">
            <image
              class="input-icon"
              src="/static/login/login_security_icon@2x.png"
              mode="aspectFit"
              alt="密码"
            />
          </view>
          <input
            v-model="secretValue"
            class="input-control"
            :type="isCaptchaLogin ? 'number' : 'password'"
            :password="!isCaptchaLogin"
            :placeholder="secretPlaceholder"
            confirm-type="done"
            @confirm="handleLogin"
          >
          <view class="input-right">
            <button
              v-if="isCaptchaLogin"
              class="sms-btn"
              :disabled="sendCooldown > 0"
              @tap="handleSendCode"
            >
              {{ sendLabel }}
            </button>
          </view>
        </view>
        <view class="input-line" />
      </view>

      <view class="remember-row" @tap="toggleRemember">
        <image
          class="remember-icon"
          :src="rememberPassword
            ? '/static/login/login_check_box_select@2x.png'
            : '/static/login/login_check_box_unselect@2x.png'"
          mode="aspectFit"
          alt="记住密码"
        />
        <text class="remember-text">记住密码</text>
      </view>

      <button class="login-button" :loading="isLoading" :disabled="!canSubmit" @tap="handleLogin">
        登录
      </button>

      <button
        v-if="showSmsToggle"
        class="sms-toggle"
        @tap="setLoginType(isCaptchaLogin ? 'password' : 'captcha')"
      >
        {{ isCaptchaLogin ? '用账号密码登录' : '用短信验证码登录' }}
      </button>
    </view>

    <text class="login-footer">版权所有：南京信业</text>
  </view>
</template>

<style lang="scss">
.login-page {
  position: relative;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  font-family: 'PingFang SC', 'Helvetica Neue', sans-serif;
  color: #333;
}

.login-logo {
  width: 240rpx;
  height: 100rpx;
  margin: 200rpx auto 0;
  display: block;
}

.login-form {
  padding: 0 68rpx;
  margin-top: 100rpx;
}

.input-group {
  margin-bottom: 30rpx;
}

.input-row {
  display: flex;
  align-items: center;
  height: 86rpx;
}

.input-icon-box {
  width: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-icon {
  width: 30rpx;
  height: 30rpx;
}

.input-control {
  flex: 1;
  height: 86rpx;
  font-size: 30rpx;
  color: #333;
}

.input-right {
  min-width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.input-line {
  height: 1rpx;
  background-color: #cdcdcd;
}

.sms-btn {
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 16rpx;
  background: #fd863b;
  color: #fff;
  font-size: 24rpx;
  border-radius: 10rpx;
}

.remember-row {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
  gap: 12rpx;
}

.remember-icon {
  width: 34rpx;
  height: 34rpx;
}

.remember-text {
  font-size: 30rpx;
  color: #7f7f7f;
}

.login-button {
  margin-top: 54rpx;
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 12rpx;
  background: #37a6f1;
  color: #fff;
  font-size: 32rpx;
}

.login-button[disabled] {
  opacity: 0.6;
}

.sms-toggle {
  margin-top: 20rpx;
  background: transparent;
  color: #37a6f1;
  font-size: 26rpx;
}

.login-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20rpx;
  text-align: center;
  font-size: 22rpx;
  color: #7f7f7f;
}
</style>
