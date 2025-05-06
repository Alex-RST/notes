import { defineConfig } from 'vitepress'
import sidebar from './generate-sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Alex的知识库",
    description: "Alex的知识库",
    base: '/notes/',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' }
        ],
        sidebar: sidebar.sidebarMulti('/'),
        socialLinks: [
            { icon: 'github', link: 'https://github.com/Alex-RST/notes' }
        ],
        outline: {
            level: [2, 3],
            label: '目录'
        },
        search: {
            provider: 'local'
        },
        docFooter: {
            prev: '上一篇',
            next: '下一篇'
        },
        lightModeSwitchTitle: '开灯',
        darkModeSwitchTitle: '关灯',
    },
    markdown: {
        lineNumbers: true,
        math: true,
        image: {
            //开启图片懒加载
            lazyLoading: true
        }
    },
    lastUpdated: true,
    srcDir: "src",
    cleanUrls: true,
    head: [
        ['script', { src: '/live2d.js' }],
        ['link', { rel: 'icon', href: '/notes/favicon.svg' }]
    ]
})
