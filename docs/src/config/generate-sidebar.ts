import fs from 'fs'
import path from 'path'
import { DefaultTheme } from 'vitepress/types/default-theme'
import { pathName, ignored } from './sidebarConfig'

const ROOT_ABSOLUTE_PATH = path.resolve()
const SRC_PATH = 'docs/src'

export default function generateSidebar(curPath: string): DefaultTheme.SidebarMulti {
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
                items: generateItems(subPath)
            }]
        }
    }
    return sidebar
}

export function generateItems(curPath: string): DefaultTheme.SidebarItem[] {
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
                items: generateItems(subPath),
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

