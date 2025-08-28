<p align="center"><img src="./static/icon.png"
        alt="Logo" width="128" height="128" style="max-width: 100%;"></p>
<h1 align="center">Miku Tools</h1>
<p align="center">一个轻量的工具集合</p>
<p align="center">
    <a href="https://github.com/Ice-Hazymoon/MikuTools/blob/master/LICENSE">
        <img src="https://img.shields.io/github/license/Ice-Hazymoon/MikuTools.svg" alt="MIT License" />
    </a>
    <a href="https://vuejs.org/">
        <img src="https://img.shields.io/badge/nuxt.js-v5.x-green.svg" alt="for Nuxt.js 5">
    </a>
    <a href="http://imiku.me/">
        <img src="https://badgen.net/badge/author/Ice-Hazymoon/f2a" alt="Author">
    </a>
    <a href="https://miku.tools/">
        <img src="https://img.shields.io/badge/%F0%9F%9A%80-open--in--browser-e10079.svg" alt="Live Demo">
    </a>
</p>

## 备用域名

如网站出现无法访问的情况，可尝试使用备用域名

> [https://tools.huhaha.vip/](https://tools.huhaha.vip/)

## 介绍

本项目是 [https://miku.tools](https://miku.tools) 的开源版本，保留了部分无需后端的功能。

> [https://miku.tools](https://miku.tools)

## 预览

![preview](./static/preview.png)

## 开发

```bash
yarn install
yarn dev
```

## 构建

```bash
yarn install
yarn generate
```

## 工具列表
* 编程开发
    - [x] CSS 兼容性处理
    - [x] 时间戳转换
    - [x] URL 格式化
    - [x] 文本加密解密
    - [x] Linux 命令查询
    - [x] 文本编码解码
    - [x] 执行 Cron 表达式
    - [x] 进制转换
    - [x] CIDR 计算
    - [x] UserAgent 解析
    - [x] 前端 CDN 查询
    - [x] JSON 编辑器
    - [x] 正则大全
- [x] URL 编码/解码
- [x] 随机密码生成
* 图片相关
    - [x] 格式转换
    - [x] 九宫格切图
    - [x] Anime 4K
    - [x] Cyberpunk 2077 图片制作
    - [x] 令和举牌生成
    - [x] ACG 表情包制作
    - [x] Pornhub 风格Logo
    - [x] YouTube 风格Logo
    - [x] 视频转 GIF    
    - [x] GIF 图片分解
    - [x] 微博生成器
    - [x] 抖音风格文字生成
    - [x] 图片编辑
    - [x] 身份证加水印
* 文字处理
    - [x] 文本对比
    - [x] 文本去重
    - [x] 数字转大写中文
    - [x] 富文本编辑器
    - [x] Markdown 编辑器
    - [x] 摩斯电码转换
    - [x] 盲人摸象加解密
    - [x] 中英文加空格
* 其他工具
    - [x] 屏幕录制
    - [x] 番茄时钟
    - [x] 人生小格
    - [x] 随机数生成
    - [x] 图片加包浆
    - [x] LINE 贴纸下载
    - [x] 帮你百度
    - [x] SS/R/V2ray 配置解析
    - [x] 亲戚关系计算器
    - [x] 二维码生成/解析
    - [x] 这是什么动漫
    - [x] 中国传统色
    - [x] 日本传统色
    - [x] 颜色处理
    - [x] 收款码合并
    - [x] 温度单位转换

## 其他

Q: 我应该如何添加新功能？  
A: 参考 `/pages/*.vue` 中的文件新建页面，善用 **CTRL+F** 进行相关模块的查找，然后在 `/tools/index.js` 里添加相关的工具信息。

Q: 我可以参与开发 MikuTools 吗？  
A: 当然可以，随时欢迎提交 PR，会视情况添加到 [MikuTools](https://miku.tools) 主站

Q: 我能给 MikuTools 提新功能吗？  
A: issues 区随时欢迎你。

Q: MikuTools 的主要技术栈是什么？  
A: Vue 全家桶 + [Nuxt.js](https://zh.nuxtjs.org/)

## 更新

本仓库仅供一个开源版本的备份，并不用于纪录提交纪录等，当[主站](https://miku.tools)更新到一定程度上的稳定版本时，才会重新更新该仓库

## License

[MIT](https://github.com/Ice-Hazymoon/MikuTools/blob/master/LICENSE)
