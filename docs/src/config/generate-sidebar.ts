import fs from 'fs'
import path from 'path'
import { DefaultTheme } from 'vitepress/types/default-theme'
import { config } from './sidebarConfig'

export default { sidebarItems, sidebarItem, sidebarMulti }
export { SidebarConfig }

const ROOT_ABSOLUTE_PATH = path.resolve()
const SRC_PATH = config.srcPath

const itemInfoMap: Map<string, SidebarItemInfo> = new Map;
if (config.pathMap !== undefined) {
    parseInfoMap('', config.pathMap)
}

function sidebarMulti(curPath: string): DefaultTheme.SidebarMulti {
    //侧边栏
    let sidebar: DefaultTheme.SidebarMulti = {}
    //curPath的绝对路径
    let curPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath)
    //curPath下的子路径名
    let subNames: string[] = fs.readdirSync(curPathAb)
    for (let index in subNames) {
        let subName: string = subNames[index]
        let subPath: string = curPath.endsWith('/') ? curPath + subName : curPath + '/' + subName
        let subPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, subPath)
        if (isDirectory(subPathAb) && !ignored(subPath)) {
            sidebar[subName] = sidebarItems(subPath)
        }
    }
    return sidebar
}

function sidebarItems(curPath: string): DefaultTheme.SidebarItem[] {
    let items: DefaultTheme.SidebarItem[] = []
    let curPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath)
    let subNames: string[] = fs.readdirSync(curPathAb)
    for (let index in subNames) {
        let subName: string = subNames[index]
        let subPath: string = curPath + '/' + subName
        if (ignored(subPath)) {
            continue
        }
        items.push(sidebarItem(subPath, subName))
    }
    return items
}

function sidebarItem(curPath: string, curName: string): DefaultTheme.SidebarItem {
    let curPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath)
    if (isDirectory(curPathAb)) {
        let items: DefaultTheme.SidebarItem[] = []
        let subNames: string[] = fs.readdirSync(curPathAb)
        for (let index in subNames) {
            let subName: string = subNames[index]
            let subPath: string = curPath + '/' + subName
            let item: DefaultTheme.SidebarItem = sidebarItem(subPath, subName)
            items.push(item)
        }
        let mapName = pathName(curPath)
        return {
            text: mapName !== undefined ? mapName : curName,
            collapsed: false,
            items: items
        }
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

function isDirectory(pathStr: string): boolean {
    return fs.lstatSync(pathStr).isDirectory()
}

/**
 * 目录信息映射解析
 * @param curPath 当前目录
 * @param subItemMap 当前目录下子目录映射关系
 */
function parseInfoMap(curPath: string, subItemMap: SidebarItemMap): void {
    for (let subItemName in subItemMap) {
        let subItemInfo: SidebarItemInfo | string = subItemMap[subItemName];
        let subDir: string = curPath.endsWith('/') ? curPath + subItemName : curPath + '/' + subItemName
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

function ignored(resPath: string): boolean {
    let ignoreUri: string[] | undefined = config.ignoredPath
    if (ignoreUri !== undefined && ignoreUri.includes(resPath)) {
        return true
    } else {
        return false
    }
}

function pathName(uri: string): string | undefined {
    let info: SidebarItemInfo | undefined = itemInfoMap.get(uri)
    if (info === undefined) return undefined
    else return info.name
}

interface SidebarConfig {
    pathMap?: SidebarItemMap,
    ignoredPath?: string[],
    srcPath: string
}

interface SidebarItemMap {
    [path: string]: SidebarItemInfo | string
}

interface SidebarItemInfo {
    name: string,
    collapsed?: boolean,
    subItems?: SidebarItemMap
}

