import fs from 'fs'
import path from 'path'
import { DefaultTheme } from 'vitepress/types/default-theme'
import { config } from './sidebarConfig'

export default generateSidebarMulti
export { SidebarConfig, generateSidebarItem as generateItems }

const ROOT_ABSOLUTE_PATH = path.resolve()
const SRC_PATH = config.srcPath

const itemInfoMap: Map<string, SidebarItemInfo> = new Map;
if(config.pathMap !== undefined) {
    parseInfoMap('', config.pathMap)
}
let sidebar = generateSidebarMulti('')
console.log(sidebar)

function generateSidebarMulti(curPath: string): DefaultTheme.SidebarMulti {
    //侧边栏
    let sidebar: DefaultTheme.SidebarMulti = {}
    //resPath的绝对路径
    let curPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath)
    //resPath下的子路径名
    let subFileNames: string[] = fs.readdirSync(curPathAb)
    for (let index in subFileNames) {
        let subFileName: string = subFileNames[index]
        let subPath: string = path.join(curPath, subFileName)
        let subPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, subPath)
        if (isDirectory(subPathAb) && !ignored(subPath)) {
            let mapName = pathName(subPath)
            sidebar[subFileName] = [{
                text: mapName !== undefined ? mapName : subFileName,
                link: subPath,
                items: generateSidebarItem(subPath)
            }]
        }
    }
    return sidebar
}

function generateSidebarItem(curPath: string): DefaultTheme.SidebarItem[] {
    let items: DefaultTheme.SidebarItem[] = []

    let curPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath)
    let subFileNames: string[] = fs.readdirSync(curPathAb)
    for (let index in subFileNames) {
        let subFileName: string = subFileNames[index]
        let subPath: string = path.join(curPath, subFileName)
        let subPathAb: string = path.join(ROOT_ABSOLUTE_PATH, SRC_PATH, subPath)
        if (ignored(subPath)) {
            continue
        }
        if (isDirectory(subPathAb)) {
            let mapName = pathName(subPath)
            items.push({
                text: mapName !== undefined ? mapName : subFileName,
                collapsed: false,
                items: generateSidebarItem(subPath),
            })
        } else {
            let subFileNameNoExt: string = subFileName.substring(0, subFileName.lastIndexOf('.'))
            let subPathNoExt: string = subPath.substring(0, subPath.lastIndexOf('.'))
            let mapName = pathName(subPathNoExt)
            items.push({
                text: mapName !== undefined ? mapName : subFileNameNoExt,
                link: subPathNoExt
            })
        }
    }
    return items
}

function isDirectory(pathStr: string): boolean {
    return fs.lstatSync(pathStr).isDirectory()
}

/**
 * 目录信息映射解析
 * @param curDir 当前目录
 * @param subItemMap 当前目录下子目录映射关系
 */
function parseInfoMap(curDir: string, subItemMap: SidebarItemMap): void {
    for(let key in subItemMap) {
        let subItemInfo: SidebarItemInfo | string  = subItemMap[key];
        let subDir: string = path.join(curDir, key)
        if(typeof subItemInfo === 'string') {
            itemInfoMap.set(subDir, {name: subItemInfo})
        } else {
            itemInfoMap.set(subDir, subItemInfo)
            if(subItemInfo.subItems !== undefined) {
                parseInfoMap(subDir, subItemInfo.subItems)
            }
        }
    }
}

function ignored(resPath: string): boolean {
    let ignoreUri: string[] | undefined = config.ignoredPath
    if(ignoreUri !== undefined && ignoreUri.includes(resPath)) {
        return true
    } else {
        return false
    }
}

function pathName(uri: string): string | undefined {
    let info: SidebarItemInfo | undefined= itemInfoMap.get(uri)
    if(info === undefined) return undefined
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

