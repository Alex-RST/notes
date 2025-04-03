import { SidebarConfig } from "./generate-sidebar"

export let config: SidebarConfig = {
    pathMap: {
        'notes': {name: '随手记',withIndex: true},
        'maven': 'Maven',
        'juc': 'Java 多线程与并发',
        'database': '数据库',
        'spring': {
            name: 'Spring',
            withIndex: true,
            subItems: {
                'spring-framework': {name: 'Spring Framework',collapsed: false},
                'spring-boot': {name: 'Spring Boot',collapsed: false},
                'spring-mvc': {name: 'Spring MVC',collapsed: false}
            }
        },
        'know_jvm': {
            name: '深入理解Java虚拟机',
            withIndex: true,
            subItems: {
                'part-1': {name: '第一部分 走进Java', collapsed: false},
                'part-2': {name: '第二部分 自动内存管理', collapsed: false},
                'part-3': {name: '第三部分 虚拟机执行子系统', collapsed: false},
                'part-4': {name: '第四部分 程序编译与代码优化', collapsed: false},
                'part-5': {name: '第五部分 高效并发', collapsed: false}
            }
        }
    },
    ignoredPath: [
        '/config',
        '/public',
        '/**/index.md',
    ],
    srcPath: '/src'
}


