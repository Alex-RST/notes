import fs from 'fs'
import path from 'path'
import UrlPattern from "url-pattern"
import { DefaultTheme } from 'vitepress/types/default-theme'
import { config } from './sidebarConfig'

export default { sidebarItems, sidebarItem, sidebarMulti }
export { SidebarConfig }

const ROOT_ABSOLUTE_PATH = path.resolve()
const SRC_PATH = config.srcPath

const itemInfoMap: Map<string, SidebarItemInfo> = parseInfoMap(config)

// **************************************** 生成侧边栏 ****************************************
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
            sidebar[subPath] = sidebarItems(subPath)
        }
    }
    return sidebar
}

/**
 * 生成侧边栏
 * @param curPath 从源码目录开始的相对路径
 * @returns 侧边栏
 */
function sidebarItems(curPath: string): DefaultTheme.SidebarItem[] {
    let items: DefaultTheme.SidebarItem[] = []
    let curPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath)
    let subNames: string[] = fs.readdirSync(curPathAb)
    let itemInfo: SidebarItemInfo | undefined = itemInfoMap.get(curPath)
    let withIndex = itemInfo !== undefined ? itemInfo.withIndex : false
    if (withIndex !== undefined) {
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
        let text: string | undefined = curName;
        let link: string | undefined = undefined;
        let collapsed: boolean | undefined = undefined;
        let itemInfo: SidebarItemInfo | undefined = itemInfoMap.get(curPath)
        if (itemInfo !== undefined) {
            text = itemInfo.name;
            collapsed = itemInfo.collapsed;
            if (itemInfo.withIndex) {
                link = curPath
            }
        }
        return {
            text,
            link,
            collapsed,
            items
        }
    } else {
        let curNameNoExt: string = curName.substring(0, curName.lastIndexOf("."))
        let curPathNoExt: string = curPath.substring(0, curPath.lastIndexOf("."))
        let mapName = pathName(curPath)
        let title: string | undefined = getFirstLevelTitle(curPathAb)
        return {
            text: mapName !== undefined ? mapName : (title !== undefined ? title : curNameNoExt),
            link: curPathNoExt
        }
    }
}

// **************************************** 解析配置 ****************************************
/**
 * 解析目录信息
 * @param config 配置信息
 * @returns 目录信息
 */
function parseInfoMap(config: SidebarConfig): Map<string, SidebarItemInfo> {
    let itemInfoMap: Map<string, SidebarItemInfo> = new Map;
    if (config.pathMap === undefined) {
        return itemInfoMap
    }
    parseInfoMapImpl('/', config.pathMap, itemInfoMap);
    return itemInfoMap;
}

/**
 * 目录信息映射解析具体实现
 * @param curPath 当前目录
 * @param subItemMap 当前目录下子目录映射关系
 * @param itemInfoMap 已解析出的内容
 */
function parseInfoMapImpl(curPath: string, subItemMap: SidebarItemMap, itemInfoMap: Map<string, SidebarItemInfo>): void {
    for (let subItemName in subItemMap) {
        let subItemInfo: SidebarItemInfo | string = subItemMap[subItemName];
        let subDir: string = pathJoint(curPath, subItemName)
        if (typeof subItemInfo === 'string') {
            itemInfoMap.set(subDir, { name: subItemInfo })
        } else {
            itemInfoMap.set(subDir, subItemInfo)
            if (subItemInfo.subItems !== undefined) {
                parseInfoMapImpl(subDir, subItemInfo.subItems, itemInfoMap)
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
    if (ignoreUri !== undefined) {
        for (let pattern in ignoreUri) {
            if (isPathMatch(ignoreUri[pattern], resPath)) return true
        }
        return false
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
}

/**
 * 获取 Markdown 文件中的一级标题内容
 * @param filePath Markdown 文件路径
 * @returns 第一个一级标题的内容（若无则返回 null）
 */
function getFirstLevelTitle(filePath: string): string | undefined {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // 正则解释：匹配以 # 开头，后接空格，然后捕获内容（允许标题前的空格）
    const regex = /^\s*#\s+(.+)/;

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            // 返回去除首尾空格的标题内容
            return match[1].trim().replaceAll('`', '');
        }
    }
    return undefined;
}

/**
 * 检查 URL 是否匹配指定模式
 * @param pattern 路径模式（如 "/user/:id"）
 * @param url 要检测的实际路径（如 "/user/123"）
 * @returns 是否匹配
 */
function isPathMatch(patternStr: string, urlStr: string): boolean {
    const pattern = new UrlPattern(patternStr)
    const result = pattern.match(urlStr)
    return result !== null
}

