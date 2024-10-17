"use strict";
// export default declareSidebarConfig({
//     pathMap: {
//         'notes': '随手记',
//         'notes\\bloom-filter': '布隆过滤器',
//         'notes\\jni-practice': "JNI实践",
//         'notes\\nodejs': 'Node.js',
//         'notes\\redis': 'Redis',
//         'notes\\regex': '正则表达式',
//         'notes\\spring-aop': 'Spring AOP',
//         'notes\\spring-ioc': 'Spring IOC',
//         'notes\\tomcat': 'Tomcat',
//         'notes\\jackson': 'Jackson',
//         'notes\\notes': 'Notes',
//         'know_jvm': '深入理解Java虚拟机',
//         'know_jvm\\part-1': '第一部分 走进Java',
//         'know_jvm\\part-1\\unit-01': '第一章 走进Java',
//         'know_jvm\\part-2': '第二部分 自动内存管理',
//         'know_jvm\\part-2\\unit-02': '第2章 Java内存区域与内存移除异常',
//         'know_jvm\\part-2\\unit-03': '第3章 垃圾收集器与内存分配策略',
//         'know_jvm\\part-2\\unit-04': '第4章 虚拟机性能监控和故障处理工具',
//         'know_jvm\\part-2\\unit-05': '第5章 调优案例分析与实战',
//         'know_jvm\\part-3': '第三部分 虚拟机执行子系统',
//         'know_jvm\\part-3\\unit-06': '第6章 类文件结构',
//         'know_jvm\\part-3\\unit-07': '第7章 虚拟机类加载机制',
//         'know_jvm\\part-3\\unit-08': '第8章 虚拟机字节码执行引擎',
//         'know_jvm\\part-3\\unit-09': '第9章 类加载及执行子系统的案例与实战',
//         'know_jvm\\part-4': '第四部分 程序编译与代码优化',
//         'know_jvm\\part-4\\unit-10': '第10章 前端编译与优化',
//         'know_jvm\\part-4\\unit-11': '第11章 后端编译与优化',
//         'know_jvm\\part-5': '第五部分 高效并发',
//         'know_jvm\\part-5\\unit-12': '第12章 Java内存模型与线程',
//         'know_jvm\\part-5\\unit-13': '第13章 线程安全与锁优化',
//     },
//     ignorePath: [
//         'public',
//         'index.md'
//     ]
// })
// interface SidebarConfig {
//     pathMap?: {[path: string]: string},
//     ignorePath?: string[]
// }
// function declareSidebarConfig(config: SidebarConfig): SidebarConfig {
//     return config
// }
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var config = {
    pathMap: {
        'notes': {
            name: '随手记',
            subItems: {
                'bloom-filter': '布隆过滤器',
                'jni-practice': 'JNI实践',
                'nodejs': 'Node.js',
                'redis': 'Redis',
                'regex': '正则表达式',
                'spring-aop': 'Spring AOP',
                'spring-ioc': 'Spring IOC',
                'tomcat': 'Tomcat',
                'jackson': 'Jackson',
                'notes': 'Notes',
            }
        },
        'know_jvm': {
            name: '深入理解Java虚拟机',
            subItems: {
                'part-1': {
                    name: '第一部分',
                    subItems: {
                        'unit-01': '第1章 走进Java'
                    }
                },
                'part-2': {
                    name: '第二部分',
                    subItems: {
                        'unit-02': '第2章 Java内存区域与内存移除异常',
                        'unit-03': '第3章 垃圾收集器与内存分配策略',
                        'unit-04': '第4章 虚拟机性能监控和故障处理工具',
                        'unit-05': '第5章 调优案例分析与实战'
                    }
                },
                'part-3': {
                    name: '第三部分',
                    subItems: {
                        'unit-06': '第6章 类文件结构',
                        'unit-07': '第7章 虚拟机类加载机制',
                        'unit-08': '第8章 虚拟机字节码执行引擎',
                        'unit-09': '第9章 类加载及执行子系统的案例与实战'
                    }
                },
                'part-4': {
                    name: '第四部分',
                    subItems: {
                        'unit-10': '第10章 前端编译与优化',
                        'unit-11': '第11章 后端编译与优化'
                    }
                },
                'part-5': {
                    name: '第五部分',
                    subItems: {
                        'unit-12': '第12章 Java内存模型与线程',
                        'unit-13': '第13章 线程安全与锁优化',
                    }
                }
            }
        }
    }
};
var itemInfoMap = new Map;
if (config.pathMap !== undefined) {
    parseInfoMap('../', config.pathMap);
}
console.log(itemInfoMap);
/**
 * 目录信息映射解析
 * @param dir 当前目录
 * @param itemMap 当前目录下子目录映射关系
 */
function parseInfoMap(parent, itemMap) {
    for (var key in itemMap) {
        var itemInfo = itemMap[key];
        var curDir = path.join(parent, key);
        if (typeof itemInfo === 'string') {
            itemInfoMap.set(curDir, { name: itemInfo });
        }
        else {
            itemInfoMap.set(curDir, itemInfo);
            if (itemInfo.subItems !== undefined) {
                parseInfoMap(curDir, itemInfo.subItems);
            }
        }
    }
}
