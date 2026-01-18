import type { TabBar } from '@uni-helper/vite-plugin-uni-pages'
import type { CustomTabBarItem, NativeTabBarItem } from './types'

/**
 * tabbar 选择的策略，更详细的介绍见 tabbar.md 文件
 * 0: 'NO_TABBAR' `无 tabbar`
 * 1: 'NATIVE_TABBAR'  `原生 tabbar`
 * 2: 'CUSTOM_TABBAR' `自定义 tabbar`
 *
 * 温馨提示：本文件的任何代码更改了之后，都需要重新运行，否则 pages.json 不会更新导致配置不生效
 */
export const TABBAR_STRATEGY_MAP = {
  NO_TABBAR: 0,
  NATIVE_TABBAR: 1,
  CUSTOM_TABBAR: 2,
}

// TODO: 1/3. 通过这里切换使用tabbar的策略
// 如果是使用 NO_TABBAR(0)，nativeTabbarList 和 customTabbarList 都不生效
// 如果是使用 NATIVE_TABBAR(1)，只需要配置 nativeTabbarList，customTabbarList 不生效
// 如果是使用 CUSTOM_TABBAR(2)，只需要配置 customTabbarList，nativeTabbarList 不生效
export const selectedTabbarStrategy = TABBAR_STRATEGY_MAP.CUSTOM_TABBAR

// TODO: 2/3. 使用 NATIVE_TABBAR 时，更新下面的 tabbar 配置
export const nativeTabbarList: NativeTabBarItem[] = [
  {
    iconPath: 'static/tabbar/work.png',
    selectedIconPath: 'static/tabbar/work-active.png',
    pagePath: 'pages/index/index',
    text: '工作',
  },
  {
    iconPath: 'static/tabbar/message.png',
    selectedIconPath: 'static/tabbar/message-active.png',
    pagePath: 'pages/message/index',
    text: '消息',
  },
  {
    iconPath: 'static/tabbar/todo.png',
    selectedIconPath: 'static/tabbar/todo-active.png',
    pagePath: 'pages/todo/index',
    text: '待办',
  },
  {
    iconPath: 'static/tabbar/contacts.png',
    selectedIconPath: 'static/tabbar/contacts-active.png',
    pagePath: 'pages/contacts/index',
    text: '通讯录',
  },
  {
    iconPath: 'static/tabbar/profile.png',
    selectedIconPath: 'static/tabbar/profile-active.png',
    pagePath: 'pages/me/me',
    text: '我的',
  },
]

// TODO: 3/3. 使用 CUSTOM_TABBAR 时，更新下面的 tabbar 配置
// 如果需要配置鼓包，需要在 'tabbar/store.ts' 里面设置，最后在 `tabbar/index.vue` 里面更改鼓包的图片
export const customTabbarList: CustomTabBarItem[] = [
  {
    text: '工作',
    pagePath: 'pages/index/index',
    iconType: 'image',
    icon: '/static/tabbar/work.png',
    iconActive: '/static/tabbar/work-active.png',
  },
  {
    text: '消息',
    pagePath: 'pages/message/index',
    iconType: 'image',
    icon: '/static/tabbar/message.png',
    iconActive: '/static/tabbar/message-active.png',
  },
  {
    text: '待办',
    pagePath: 'pages/todo/index',
    iconType: 'image',
    icon: '/static/tabbar/todo.png',
    iconActive: '/static/tabbar/todo-active.png',
  },
  {
    text: '通讯录',
    pagePath: 'pages/contacts/index',
    iconType: 'image',
    icon: '/static/tabbar/contacts.png',
    iconActive: '/static/tabbar/contacts-active.png',
  },
  {
    text: '我的',
    pagePath: 'pages/me/me',
    iconType: 'image',
    icon: '/static/tabbar/profile.png',
    iconActive: '/static/tabbar/profile-active.png',
  },
]

/**
 * 是否启用 tabbar 缓存
 * NATIVE_TABBAR(1) 和 CUSTOM_TABBAR(2) 时，需要tabbar缓存
 */
export const tabbarCacheEnable
  = [TABBAR_STRATEGY_MAP.NATIVE_TABBAR, TABBAR_STRATEGY_MAP.CUSTOM_TABBAR].includes(selectedTabbarStrategy)

/**
 * 是否启用自定义 tabbar
 * CUSTOM_TABBAR(2) 时，启用自定义tabbar
 */
export const customTabbarEnable = [TABBAR_STRATEGY_MAP.CUSTOM_TABBAR].includes(selectedTabbarStrategy)

/**
 * 是否需要隐藏原生 tabbar
 * CUSTOM_TABBAR(2) 时，需要隐藏原生tabbar
 */
export const needHideNativeTabbar = selectedTabbarStrategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR

const _tabbarList = customTabbarEnable ? customTabbarList.map(item => ({ text: item.text, pagePath: item.pagePath })) : nativeTabbarList
export const tabbarList = customTabbarEnable ? customTabbarList : nativeTabbarList

const _tabbar: TabBar = {
  // 只有微信小程序支持 custom。App 和 H5 不生效
  custom: selectedTabbarStrategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR,
  color: '#8C8C8C',
  selectedColor: '#008FFF',
  backgroundColor: '#FFFFFF',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
  list: _tabbarList as unknown as TabBar['list'],
}

export const tabBar = tabbarCacheEnable ? _tabbar : undefined
