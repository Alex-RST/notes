import { SidebarConfig } from "./generate-sidebar"

export let config: SidebarConfig = {
    pathMap: {
        'other': '随手记',
        'maven': { name: 'Maven', withIndex: false },
        'juc': { name: 'Java 多线程与并发', withIndex: false },
        'database': { name: '数据库', withIndex: false },
        'spring': {
            name: 'Spring',
            subItems: {
                'spring-framework': 'Spring Framework',
                'spring-boot': 'Spring Boot',
                'spring-mvc': 'Spring MVC'
            }
        },
        'know_jvm': {
            name: '深入理解Java虚拟机',
            subItems: {
                'part-1': '第一部分 走进Java',
                'part-2': '第二部分 自动内存管理',
                'part-3': '第三部分 虚拟机执行子系统',
                'part-4': '第四部分 程序编译与代码优化',
                'part-5': '第五部分 高效并发',
                'part-6': '附录'
            }
        },
        'design_pattern': { name: '设计模式', withIndex: false }
    },
    ignoredPath: [
        '/config',
        '/js',
        '/public',
        '/**/index.md',
    ],
    srcPath: '/docs/src'
}


