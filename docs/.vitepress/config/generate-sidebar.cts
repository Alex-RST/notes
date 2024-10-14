import * as fs from 'fs'
import * as path from 'path'

function isDirectory(path: string): boolean {
    return fs.lstatSync(path).isDirectory()
}

let ignorePath: string[] = ['public']
const ROOT_DIR = path.resolve()

generateSidebar(ROOT_DIR)

export default function generateSidebar(srcDir: string): {[path: string]: any} {
    // 获取pathname的路径
    let dirPath: string = path.join(ROOT_DIR, srcDir)
    // 读取pathname下的所有文件或者文件夹
    let curDirFiles: string[] = fs.readdirSync(dirPath)
    let sidebar: {[path: string]: any} = {}
    for (let file in curDirFiles) {
        let curName: string = curDirFiles[file]
        let cur: string = path.join(dirPath, curName)
        if(isDirectory(cur) && !ignorePath.includes(curName)) {
            sidebar[curName] = [{
                text: curName,
                link: cur,
                items: generateItems(cur)
            }]
        }
    }
    return sidebar
}

export function generateItems(dirPath: string): any[] {
    // 读取pathname下的所有文件或者文件夹
    let curDirFiles: string[] = fs.readdirSync(dirPath)
    let items: any[] = []
    for (let file in curDirFiles) {
        if(ignorePath.includes(dirPath)) {
            continue
        }
        if(isDirectory(file)) {
            items.push({
                text: path.basename(file),
                items: generateItems(file),
            })
            generateItems(file)
        } else {
            items.push({
                text: file,
                link: file 
            })
        }
    }
    return items
}

