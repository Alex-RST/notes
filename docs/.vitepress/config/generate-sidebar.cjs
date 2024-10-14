"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateSidebar;
exports.generateItems = generateItems;
var fs = require("fs");
var path = require("path");
function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}
var ignorePath = ['public'];
var DIR_PATH = path.resolve();
generateSidebar('/docs/src');
function generateSidebar(srcDir) {
    // 获取pathname的路径
    var dirPath = path.join(DIR_PATH, srcDir);
    // 读取pathname下的所有文件或者文件夹
    var curDirFiles = fs.readdirSync(dirPath);
    var sidebar = {};
    for (var file in curDirFiles) {
        if (isDirectory(file) && !ignorePath.includes(dirPath)) {
            sidebar[file] = [{
                    text: file,
                    link: file,
                    items: generateItems(file)
                }];
        }
    }
    return sidebar;
}
function generateItems(dirPath) {
    // 读取pathname下的所有文件或者文件夹
    var curDirFiles = fs.readdirSync(dirPath);
    var items = [];
    for (var file in curDirFiles) {
        if (ignorePath.includes(dirPath)) {
            continue;
        }
        if (isDirectory(file)) {
            items.push({
                text: path.basename(file),
                items: generateItems(file),
            });
            generateItems(file);
        }
        else {
            items.push({
                text: file,
                link: file
            });
        }
    }
    return items;
}
