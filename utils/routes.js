// 工具路由配置文件
// 这个文件同时供 store 和 sitemap 使用，避免模块导入问题

// 使用 CommonJS 语法定义和导出路由列表
// 这样可以确保在 Node.js 和 Nuxt.js 环境中都能正常工作

// 定义所有工具路由 - 与 store/tools.js 中的路径保持一致
const toolRoutes = [
  '/',
  '/acg_meme',
  '/anime4k',
  '/autoprefixer',
  '/cdnjs',
  '/china_colors',
  '/chinese_id',
  '/cidr',
  '/color',
  '/crontab',
  '/crypto',
  '/cyberpunk2077',
  '/douyin_text',
  '/encoding',
  '/ffmpeg',
  '/gif_splitter',
  '/hexconvert',
  '/image-cropper',
  '/image-compressor',
  '/image-converter',
  '/image-rotate-flip',
  '/image-change-bg',
  '/image-to-pdf',
  '/image_editor',
  '/image_patina',
  '/img_jiugongge',
  '/japan_colors',
  '/json-format',
  '/json-convert-code',
  '/json-convert-format',
  '/json-convert-yaml',
  '/json-to-csv',
  '/json-to-sql',
  '/jwt-tool',
  '/lifecount',
  '/line_sticker_download',
  '/linghe',
  '/linux_command',
  '/markdown',
  '/meme-weibo',
  '/morse',
  '/number_to_zh',
  '/o/search_help',
  '/password',
  '/pdf-to-image',
  '/pomodoro_technique',
  '/pornhub_logo',
  '/qrcode_generation',
  '/random',
  '/relatives_name',
  '/remove_duplicate',
  '/rich_text_editor',
  '/screen_record',
  '/search_help',
  '/setting',
  '/sot1_encrypt',
  '/sql-to-json',
  '/ssr_decode',
  '/temperature_conversion',
  '/text_autospace',
  '/textdiff',
  '/time_change',
  '/timestamp',
  '/ua_parser',
  '/universal_pay',
  '/url_format',
  '/urlencode',
  '/uuid',
  '/video2gif',
  '/watermark',
  '/what_anime_is_this',
  '/youtube_logo',
  '/links'
];

// 导出 CommonJS 格式
module.exports = {
  toolRoutes
};

// 为了兼容 ES 模块导入（在支持的环境中）
if (typeof module !== 'undefined' && typeof window !== 'undefined') {
  // 在浏览器环境中，我们可以将其挂载到全局对象上
  window.__toolRoutes = toolRoutes;
}