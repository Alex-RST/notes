import * as fs from 'fs'
import * as path from 'path'
import { DefaultTheme } from 'vitepress/types/default-theme'
import sidebarConfig from './sidebarConfig'

function isDirectory(pathStr: string): boolean {
    return fs.lstatSync(pathStr).isDirectory()
}

const IGNORE_PATH: string[] = ['public','index.md']
const ROOT_ABSOLUTE_PATH = path.resolve()

let sidebar = generateSidebar('/docs/src')
console.log(sidebar)

export default function generateSidebar(srcDir: string): DefaultTheme.SidebarMulti {
    // 获取srcRp的绝对路径
    let srcAp: string = path.join(ROOT_ABSOLUTE_PATH, srcDir)
    // 读取srcAp下的所有文件或者文件夹
    let curPathFileNames: string[] = fs.readdirSync(srcAp)
    let sidebar: {[path: string]: any} = {}
    for (let index in curPathFileNames) {
        let curFileName: string = curPathFileNames[index]
        let curFileRp: string = path.join(srcDir, curFileName)
        let curFileAp: string = path.join(ROOT_ABSOLUTE_PATH, curFileRp)
        if(isDirectory(curFileAp) && !IGNORE_PATH.includes(curFileName)) {
            let mapName: string = sidebarConfig.pathMap[curFileName]
            sidebar[curFileName] = [{
                text: mapName != null ? mapName : curFileName,
                link: curFileName,
                items: generateItems(srcDir, curFileName)
            }]
        }
    }
    return sidebar
}

export function generateItems(srcDir: string, dirRp: string): DefaultTheme.SidebarItem[] {
    // 获取dirRp的绝对路径
    let dirAp: string = path.join(ROOT_ABSOLUTE_PATH, srcDir, dirRp)
    let curPathFileNames: string[] = fs.readdirSync(dirAp)
    let items: DefaultTheme.SidebarItem[] = []
    for (let index in curPathFileNames) {
        let curFileName: string = curPathFileNames[index]
        let curFileRp: string = path.join(dirRp, curFileName)
        let curFileAp: string = path.join(ROOT_ABSOLUTE_PATH, srcDir, curFileRp)
        if(IGNORE_PATH.includes(curFileName)) {
            continue
        }
        let mapName: string = sidebarConfig.pathMap[curFileName.substring(0, curFileName.lastIndexOf("."))]
        if(isDirectory(curFileAp)) {
            items.push({
                text: mapName != null ? mapName : curFileName,
                items: generateItems(srcDir, curFileRp),
            })
        } else {
            items.push({
                text: mapName != null ? mapName : curFileName,
                link: curFileRp.substring(0, curFileRp.lastIndexOf("."))
            })
        }
    }
    return items
}

