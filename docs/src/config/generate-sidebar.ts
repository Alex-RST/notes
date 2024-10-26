import fs from 'fs'
import path from 'path'
import { DefaultTheme } from 'vitepress/types/default-theme'
import { config } from './sidebarConfig'

export default { sidebarItems, sidebarItem, sidebarMulti }
export { SidebarConfig }

const ROOT_ABSOLUTE_PATH = path.resolve()
const SRC_PATH = config.srcPath

const itemInfoMap: Map<string, SidebarItemInfo> = new Map;
parseConfig()

/**
 * 生成指定目录下的多侧边栏
 * @param curPath 从源码目录开始的相对路径
 * @returns 多侧边栏
 */
function sidebarMulti(curPath: string): DefaultTheme.SidebarMulti {
    //侧边栏
    let sidebar: DefaultTheme.SidebarMulti = {}
    //curPath的绝对路径
    let curPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath)
    //curPath下的子路径名
    let subNames: string[] = fs.readdirSync(curPathAb)
    for (let index in subNames) {
        let subName: string = subNames[index]
        let subPath: string = pathJoint(curPath, subName)
        let subPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, subPath)
        if (isDirectory(subPathAb) && !ignored(subPath)) {
            sidebar[subName] = sidebarItems(subPath)
        }
    }
    return sidebar
}

/**
 * 生成侧边栏
 * @param curPath 从源码目录开始的相对路径
 * @param hasIndex 是否生成包含index的目录
 * @returns 侧边栏
 */
function sidebarItems(curPath: string): DefaultTheme.SidebarItem[] {
    let items: DefaultTheme.SidebarItem[] = []
    let curPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath)
    let subNames: string[] = fs.readdirSync(curPathAb)
    let itemInfo: SidebarItemInfo | undefined = itemInfoMap.get(curPath)
    let withIndex = itemInfo !== undefined ? itemInfo.withIndex : false
    if (withIndex) {
        items.push(sidebarItem(curPath))
    } else {
        for (let index in subNames) {
            let subName: string = subNames[index]
            let subPath: string = pathJoint(curPath, subName)
            if (ignored(subPath)) {
                continue
            }
            items.push(sidebarItem(subPath))
        }
    }
    return items
}

/**
 * 生成指定目录下的侧边栏项
 * @param curPath 从源码目录开始的相对路径
 * @param hasIndex 如果curPath指向一个目录，是否生成带有index项
 * @returns 侧边栏项
 */
function sidebarItem(curPath: string): DefaultTheme.SidebarItem {
    let curName: string = curPath.substring(curPath.lastIndexOf('/') + 1)
    let curPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath)
    if (isDirectory(curPathAb)) {
        let items: DefaultTheme.SidebarItem[] = []
        let subNames: string[] = fs.readdirSync(curPathAb)
        for (let index in subNames) {
            let subName: string = subNames[index]
            let subPath: string = pathJoint(curPath, subName)
            if (ignored(subPath)) {
                continue
            }
            let item: DefaultTheme.SidebarItem = sidebarItem(subPath)
            items.push(item)
        }
        let mapName = pathName(curPath)
        let item: DefaultTheme.SidebarItem = {
            text: mapName !== undefined ? mapName : curName,
            items: items
        }
        let itemInfo: SidebarItemInfo | undefined = itemInfoMap.get(curPath)
        if (itemInfo !== undefined) {
            item['collapsed'] = itemInfo.collapsed
            if (itemInfo.withIndex) {
                item['link'] = curPath
            }
        }
        return item
    } else {
        let curNameNoExt: string = curName.substring(0, curName.lastIndexOf("."))
        let curPathNoExt: string = curPath.substring(0, curPath.lastIndexOf("."))
        let mapName = pathName(curPath)
        return {
            text: mapName !== undefined ? mapName : curNameNoExt,
            link: curPathNoExt
        }
    }
}

// **************************************** 工具函数 ****************************************
/**
 * 路径拼接
 * @param paths 路径数组
 * @returns 拼接好的路径
 */
function pathJoint(...paths: string[]): string {
    let result: string = ''
    for (let path of paths) {
        path = trim(path, '/')
        if (path === '') {
            continue
        } else {
            result += '/' + path
        }
    }
    return result.length === 0 ? '/' : result
}

/**
 * 判断当前路径是否为一个目录
 * @param pathStr 绝对路径
 * @returns true or false
 */
function isDirectory(pathStr: string): boolean {
    return fs.lstatSync(pathStr).isDirectory()
}

/**
 * 去掉字符串两端指定字符
 * @param str 需要修饰的字符串
 * @param char 需要去掉的字符
 * @returns 修饰后的字符串
 */
function trim(str: string, char: string): string {
    if (char) {
        str = str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return str.replace(/^\s+|\s+$/g, '');
};

// **************************************** 解析配置 ****************************************
/**
 * 配置解析
 */
function parseConfig(): void {
    if (config.pathMap !== undefined) {
        parseInfoMap('/', config.pathMap)
    }
}

/**
 * 目录信息映射解析
 * @param curPath 当前目录
 * @param subItemMap 当前目录下子目录映射关系
 */
function parseInfoMap(curPath: string, subItemMap: SidebarItemMap): void {
    for (let subItemName in subItemMap) {
        let subItemInfo: SidebarItemInfo | string = subItemMap[subItemName];
        let subDir: string = pathJoint(curPath, subItemName)
        if (typeof subItemInfo === 'string') {
            itemInfoMap.set(subDir, { name: subItemInfo })
        } else {
            itemInfoMap.set(subDir, subItemInfo)
            if (subItemInfo.subItems !== undefined) {
                parseInfoMap(subDir, subItemInfo.subItems)
            }
        }
    }
}

/**
 * 是否被忽略的路径
 * @param resPath 从源码目录开始的相对路径
 * @returns true or false
 */
function ignored(resPath: string): boolean {
    let ignoreUri: string[] | undefined = config.ignoredPath
    if (ignoreUri !== undefined && ignoreUri.includes(resPath)) {
        return true
    } else {
        return false
    }
}

/**
 * 
 * @param uri 
 * @returns 
 */
function pathName(uri: string): string | undefined {
    let info: SidebarItemInfo | undefined = itemInfoMap.get(uri)
    if (info === undefined) return undefined
    else return info.name
}

// **************************************** 配置类型 ****************************************
interface SidebarConfig {
    pathMap?: SidebarItemMap,
    ignoredPath?: string[],
    srcPath: string
}

interface SidebarItemMap {
    [path: string]: SidebarItemInfo | string
}

interface SidebarItemInfo {
    name: string
    collapsed?: boolean
    withIndex?: boolean
    subItems?: SidebarItemMap
}

