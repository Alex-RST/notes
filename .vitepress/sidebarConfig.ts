import { SidebarConfig } from "./generate-sidebar"

export let config: SidebarConfig = {
    pathMap: {
        'notes': {
            name: '随手记',
            withIndex: true,
            subItems: {
                'bloom-filter.md': '布隆过滤器',
                'jni-practice.md': 'JNI实践',
                'nodejs.md': 'Node.js',
                'redis.md': 'Redis',
                'regex.md': '正则表达式',
                'tomcat.md': 'Tomcat',
                'jackson.md': 'Jackson',
                'java-collection.md': 'Java集合框架',
                'es6-standard.md': 'ES6标准入门',
                'vue-quick-start.md': 'VUE快速开发',
                'gsap.md': 'GSAP',
                'compass.md': 'Compass',
                'css.md': 'CSS',
                'grafana.md': 'Grafana',
                'dynamictp-fast-guide.md': 'DynamicTp快速上手指南',
                'juc': {
                    name: 'Java 多线程与并发',
                    collapsed: false,
                    subItems: {
                        'java-thread-pool.md': 'Java线程池的原理与实践',
                        'concurrency-base.md': '并发基础'
                    }
                },
                'spring': {
                    name: 'Spring',
                    collapsed: false,
                    subItems: {
                        'spring-aop.md': 'Spring AOP',
                        'spring-ioc.md': 'Spring IOC',
                        'task-executor-scheduler.md': '任务执行与调度',
                        'springboot-profiles.md': 'Spring Boot 配置文件'
                    }
                },
            }
        },
        'know_jvm': {
            name: '深入理解Java虚拟机',
            withIndex: true,
            subItems: {
                'part-1': {
                    name: '第一部分 走进Java',
                    collapsed: false,
                    subItems: {
                        'unit-01.md': '第1章 走进Java'
                    }
                },
                'part-2': {
                    name: '第二部分 自动内存管理',
                    collapsed: false,
                    subItems: {
                        'unit-02.md': '第2章 Java内存区域与内存移除异常',
                        'unit-03.md': '第3章 垃圾收集器与内存分配策略',
                        'unit-04.md': '第4章 虚拟机性能监控和故障处理工具',
                        'unit-05.md': '第5章 调优案例分析与实战'
                    }
                },
                'part-3': {
                    name: '第三部分 虚拟机执行子系统',
                    collapsed: false,
                    subItems: {
                        'unit-06.md': '第6章 类文件结构',
                        'unit-07.md': '第7章 虚拟机类加载机制',
                        'unit-08.md': '第8章 虚拟机字节码执行引擎',
                        'unit-09.md': '第9章 类加载及执行子系统的案例与实战'
                    }
                },
                'part-4': {
                    name: '第四部分 程序编译与代码优化',
                    collapsed: false,
                    subItems: {
                        'unit-10.md': '第10章 前端编译与优化',
                        'unit-11.md': '第11章 后端编译与优化'
                    }
                },
                'part-5': {
                    name: '第五部分 高效并发',
                    collapsed: false,
                    subItems: {
                        'unit-12.md': '第12章 Java内存模型与线程',
                        'unit-13.md': '第13章 线程安全与锁优化',
                    }
                }
            }
        }
    },
    ignoredPath: [
        '/config',
        '/public',
        '/index.md',
        '/notes/index.md',
        '/know_jvm/index.md',
        '/component'
    ],
    srcPath: '/src'
}


