import sidebar from './generate-sidebar'
import { DefaultTheme } from 'vitepress/types/default-theme'

let item: DefaultTheme.SidebarMulti = sidebar.sidebarMulti('/', false)
console.log(item)

let items: DefaultTheme.SidebarMulti = sidebar.sidebarMulti('/', true)
console.log(items)

console.log('stop')