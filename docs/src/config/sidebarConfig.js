"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignored = ignored;
exports.pathName = pathName;
const path_1 = __importDefault(require("path"));
const config = {
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
    },
    ignoredPath: [
        'config',
        'public',
        'index.md'
    ]
};
const itemInfoMap = new Map;
if (config.pathMap !== undefined) {
    parseInfoMap('', config.pathMap);
}
console.log(itemInfoMap);
/**
 * 目录信息映射解析
 * @param curDir 当前目录
 * @param subItemMap 当前目录下子目录映射关系
 */
function parseInfoMap(curDir, subItemMap) {
    for (let key in subItemMap) {
        let subItemInfo = subItemMap[key];
        let subDir = path_1.default.join(curDir, key);
        if (typeof subItemInfo === 'string') {
            itemInfoMap.set(subDir, { name: subItemInfo });
        }
        else {
            itemInfoMap.set(subDir, subItemInfo);
            if (subItemInfo.subItems !== undefined) {
                parseInfoMap(subDir, subItemInfo.subItems);
            }
        }
    }
}
function ignored(resPath) {
    let ignoreUri = config.ignoredPath;
    if (ignoreUri !== undefined && ignoreUri.includes(resPath)) {
        return true;
    }
    else {
        return false;
    }
}
function pathName(uri) {
    let info = itemInfoMap.get(uri);
    if (info === undefined)
        return undefined;
    else
        return info.name;
}
//# sourceMappingURL=sidebarConfig.js.map