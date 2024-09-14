import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "notes",
  description: "notes",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '目录',
        items: [
          { text: '布隆过滤器', link: '/布隆过滤器' },
          { text: '深入理解Java虚拟机', link: '/深入理解Java虚拟机' },
          { text: 'JNI实践', link: '/JNI实践' },
          { text: 'Redis', link: '/Redis' },
          { text: 'note', link: '/note' }
        ]
      }
    ],
    socialLinks: [
      { icon: {svg: 'gitee'}, link: 'https://gitee.com/pxslin/notes' }
    ]
  },
  srcDir:"src",
  cleanUrls: true
})
