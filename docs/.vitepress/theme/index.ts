import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue';
import mediumZoom from 'medium-zoom';
import { useRoute } from 'vitepress';
import { useLive2d } from 'vitepress-theme-website'

//组件
import MyLayout from './component/MyLayout.vue'
import Confetti from './component/Confetti.vue'
import BlogIndex from './component/BlogIndex.vue';

//样式
import './style/index.css'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,

  enhanceApp({ app, router }) {
    // 彩虹背景动画样式
    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === '/' || location.pathname === '/notes/'),
        { immediate: true },
      )
    } 
    //注册全局组件
    app.component("Confetti", Confetti);
    app.component("BlogIndex", BlogIndex);
  },

  setup() {
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );

    //看板娘
    // useLive2d({
    //   enable: true,
    //   model: {
    //     url: 'https://raw.githubusercontent.com/iCharlesZ/vscode-live2d-models/master/model-library/shizuku-pajama/index.json'
    //   },
    //   display: {
    //     position: 'right',
    //     width: '270px',
    //     height: '320px',
    //     xOffset: '35px',
    //     yOffset: '0px',
    //   },
    //   mobile: {
    //     show: true
    //   },
    //   react: {
    //     opacity: 0.8
    //   }
    // })
  },
}

// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined
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