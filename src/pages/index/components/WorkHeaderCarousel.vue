<template>
  <view class="work-header">
    <swiper
      class="work-header-swiper"
      circular
      autoplay
      interval="5000"
      @change="handleChange"
    >
      <swiper-item
        v-for="(_, idx) in items"
        :key="idx"
        class="work-header-slide"
      >
        <image
          v-if="idx === 0"
          class="work-header-bg"
          src="/static/work/header/work_waste_incineration.png"
          mode="aspectFill"
        />
        <image
          v-else-if="idx === 1"
          class="work-header-bg"
          src="/static/work/header/work_garbage_power.png"
          mode="aspectFill"
        />
        <image
          v-else
          class="work-header-bg"
          src="/static/work/header/work_main_thirdPhoto.jpg"
          mode="aspectFill"
        />
        <view v-if="idx !== 2" class="work-header-wave">
          <view class="wave-circle">
            <text class="wave-title">{{ idx === 0 ? '年度进厂量' : '年度处理量' }}</text>
            <text class="wave-value">{{ firstMetric?.value ?? '--' }}{{ firstMetric?.unit ?? '' }}</text>
            <text class="wave-desc">完成{{ formatPercent(firstMetric?.percent) }}%</text>
          </view>
          <view class="wave-circle">
            <text class="wave-title">{{ idx === 0 ? '年度处理量' : '年度进厂量' }}</text>
            <text class="wave-value">{{ secondMetric?.value ?? '--' }}{{ secondMetric?.unit ?? '' }}</text>
            <text class="wave-desc">完成{{ formatPercent(secondMetric?.percent) }}%</text>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="work-header-dots">
      <image
        v-for="(_, index) in items"
        :key="index"
        class="dot"
        :src="currentIndex === index ? '/static/work/header/work_currentDot.png' : '/static/work/header/work_otherDot.png'"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  items: unknown[]
  metrics: Array<{ value: string, unit: string, percent: number }>
}>()

const currentIndex = ref(0)
const firstMetric = computed(() => props.metrics?.[0])
const secondMetric = computed(() => props.metrics?.[1])

const formatPercent = (value?: number) => (typeof value === 'number' ? value.toFixed(1) : '--')

function handleChange(event: { detail?: { current?: number } }) {
  currentIndex.value = event?.detail?.current ?? 0
}
</script>

<style scoped lang="scss">
.work-header {
  position: relative;
}

.work-header-swiper {
  height: 320rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.work-header-bg {
  width: 100%;
  height: 100%;
}

.work-header-wave {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.wave-circle {
  width: 220rpx;
  height: 220rpx;
  border-radius: 999rpx;
  border: 6rpx solid #e9b176;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wave-title {
  font-size: 24rpx;
  color: #813d05;
}

.wave-value {
  font-size: 28rpx;
  color: #ffffff;
  margin-top: 6rpx;
}

.wave-desc {
  font-size: 22rpx;
  color: #9b7a3f;
  margin-top: 4rpx;
}

.work-header-dots {
  position: absolute;
  bottom: 12rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8rpx;
}

.dot {
  width: 16rpx;
  height: 16rpx;
}
</style>
