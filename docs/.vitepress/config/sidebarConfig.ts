import { SidebarConfig } from './sidebar-config'

export default declareSidebarConfig({
    pathMap: {
        'know_jvm': '深入理解Java虚拟机',
        'notes\\bloom-filter': '布隆过滤器',
        'notes\\jni-practice': "JNI实践",
        'notes\\nodejs': 'Node.js',
        'notes\\redis': 'Redis'
    }
})

function declareSidebarConfig(config: SidebarConfig): SidebarConfig {
    return config
}


