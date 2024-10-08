import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Notes",
    description: "Notes",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' }
        ],
        sidebar: {
            '/notes': [
                {
                    text: '随手记',
                    link: '/notes',
                    items: [
                        { text: '布隆过滤器', link: '/notes/bloom-filter' },
                        { text: 'JNI实践', link: '/notes/jni-practice' },
                        { text: 'Redis', link: '/notes/redis' },
                        { text: 'Note', link: '/notes/notes' },
                        { text: 'Tomcat', link: '/notes/tomcat' },
                        { text: 'Spring Bean的生命周期', link: '/notes/spring-bean-lifecycle'},
                        { text: 'Spring AOP', link: '/notes/spring-aop' }
                    ]
                }
            ],
            '/know_jvm': [
                {
                    text: '第一部分 走进Java',
                    collapsed: false,
                    items: [
                        { text: '第1章 走进Java', link: '/know_jvm/第1章_走进Java' }
                    ]
                },
                {
                    text: '第二部分 自动内存管理',
                    collapsed: false,
                    items: [
                        { text: '第2章 Java内存区域与内存移除异常', link: '/know_jvm/第2章_Java内存区域与内存移除异常' },
                        { text: '第3章 垃圾收集器与内存分配策略', link: '/know_jvm/第3章_垃圾收集器与内存分配策略' },
                        { text: '第4章 虚拟机性能监控和故障处理工具', link: '/know_jvm/第4章_虚拟机性能监控和故障处理工具' },
                        { text: '第5章 调优案例分析与实战', link: '/know_jvm/第5章_调优案例分析与实战' },
                    ]
                },
                {
                    text: '第三部分 虚拟机执行子系统',
                    collapsed: false,
                    items: [
                        { text: '第6章 类文件结构', link: '/know_jvm/第6章_类文件结构' },
                        { text: '第7章 虚拟机类加载机制', link: '/know_jvm/第7章_虚拟机类加载机制' },
                        { text: '第8章 虚拟机字节码执行引擎', link: '/know_jvm/第8章_虚拟机字节码执行引擎' },
                        { text: '第9章 类加载及执行子系统的案例与实战', link: '/know_jvm/第9章_类加载及执行子系统的案例与实战' },
                    ]
                },
                {
                    text: '第四部分 程序编译与代码优化',
                    collapsed: false,
                    items: [
                        { text: '第10章 前端编译与优化', link: '/know_jvm/第10章_前端编译与优化' },
                        { text: '第11章 后端编译与优化', link: '/know_jvm/第11章_后端编译与优化' },
                    ]
                },
                {
                    text: '第五部分 高效并发',
                    collapsed: false,
                    items: [
                        { text: '第12章 Java内存模型与线程', link: '/know_jvm/第12章_Java内存模型与线程' },
                        { text: '第13章 线程安全与锁优化', link: '/know_jvm/第13章_线程安全与锁优化' },
                    ]
                }
            ]
        },
        socialLinks: [
            { icon: { svg: 'Gitee' }, link: 'https://gitee.com/pxslin/notes' }
        ],
        outline: {
            level: [2, 3],
            label: '目录'
        },
        search: {
            provider: 'local'
        },
    },
    markdown: {
        lineNumbers: true,
        math: true
    },
    lastUpdated: true,
    srcDir: "src",
    cleanUrls: true,
    // ignoreDeadLinks: true
})
