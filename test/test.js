"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_pattern_1 = __importDefault(require("url-pattern"));
function isPathMatch(patternStr, urlStr) {
    const pattern = new url_pattern_1.default(patternStr);
    const result = pattern.match(urlStr);
    return result !== null;
}
// 测试通配符
console.log(isPathMatch('/index.md', '/index.md')); // true（* 匹配单级）
//# sourceMappingURL=test.js.map