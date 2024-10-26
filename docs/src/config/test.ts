import sidebar from './generate-sidebar'
import { DefaultTheme } from 'vitepress/types/default-theme'

let item: DefaultTheme.SidebarItem = sidebar.sidebarItem('notes')
console.log(item)

let items: DefaultTheme.SidebarItem[] = sidebar.sidebarItems('notes')
console.log(items)

console.log('stop')