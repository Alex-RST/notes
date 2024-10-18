"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateSidebar;
exports.generateItems = generateItems;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sidebarConfig_js_1 = require("./sidebarConfig.js");
const ROOT_ABSOLUTE_PATH = path_1.default.resolve();
const SRC_PATH = 'docs/src';
let sidebar = generateSidebar('');
console.log(sidebar);
function generateSidebar(curPath) {
    //侧边栏
    let sidebar = {};
    //resPath的绝对路径
    let curPathAb = path_1.default.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath);
    //resPath下的子路径名
    let subFileNames = fs_1.default.readdirSync(curPathAb);
    for (let index in subFileNames) {
        let subFileName = subFileNames[index];
        let subPath = path_1.default.join(curPath, subFileName);
        let subPathAb = path_1.default.join(ROOT_ABSOLUTE_PATH, SRC_PATH, subPath);
        if (isDirectory(subPathAb) && !(0, sidebarConfig_js_1.ignored)(subPath)) {
            let mapName = (0, sidebarConfig_js_1.pathName)(subPath);
            sidebar[subFileName] = [{
                    text: mapName !== undefined ? mapName : subFileName,
                    link: subPath,
                    items: generateItems(subPath)
                }];
        }
    }
    return sidebar;
}
function generateItems(curPath) {
    let items = [];
    let curPathAb = path_1.default.join(ROOT_ABSOLUTE_PATH, SRC_PATH, curPath);
    let subFileNames = fs_1.default.readdirSync(curPathAb);
    for (let index in subFileNames) {
        let subFileName = subFileNames[index];
        let subPath = path_1.default.join(curPath, subFileName);
        let subPathAb = path_1.default.join(ROOT_ABSOLUTE_PATH, SRC_PATH, subPath);
        if ((0, sidebarConfig_js_1.ignored)(subPath)) {
            continue;
        }
        if (isDirectory(subPathAb)) {
            let mapName = (0, sidebarConfig_js_1.pathName)(subPath);
            items.push({
                text: mapName !== undefined ? mapName : subFileName,
                collapsed: false,
                items: generateItems(subPath),
            });
        }
        else {
            let subFileNameNoExt = subFileName.substring(0, subFileName.lastIndexOf('.'));
            let subPathNoExt = subPath.substring(0, subPath.lastIndexOf('.'));
            let mapName = (0, sidebarConfig_js_1.pathName)(subPathNoExt);
            items.push({
                text: mapName !== undefined ? mapName : subFileNameNoExt,
                link: subPathNoExt
            });
        }
    }
    return items;
}
function isDirectory(pathStr) {
    return fs_1.default.lstatSync(pathStr).isDirectory();
}
//# sourceMappingURL=generate-sidebar.js.map