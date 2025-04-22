import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue';

import MyLayout from './component/MyLayout.vue'
import Confetti from './component/Confetti.vue'
import BlogIndex from './component/BlogIndex.vue';

import './style/index.css'

// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined

export default {
  extends: DefaultTheme,
  Layout: MyLayout,

  enhanceApp({ app, router }) {
    // 彩虹背景动画样式
    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === '/'),
        { immediate: true },
      )
    } 
    //注册全局组件
    app.component("Confetti", Confetti);
    app.component("BlogIndex", BlogIndex);
  },
}

// 彩虹背景动画样式
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}