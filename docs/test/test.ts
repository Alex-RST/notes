import UrlPattern from "url-pattern";

function isPathMatch(patternStr: string, urlStr: string): boolean {
    const pattern = new UrlPattern(patternStr);
    const result = pattern.match(urlStr);
    return result !== null
}

// 测试通配符
console.log(isPathMatch('/index.md', '/index.md'));