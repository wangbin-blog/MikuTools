// 工具路由配置文件
// 这个文件同时供 store 和 sitemap 使用，避免模块导入问题

// 使用 CommonJS 语法定义和导出路由列表
// 这样可以确保在 Node.js 和 Nuxt.js 环境中都能正常工作

// 定义所有工具路由
const toolRoutes = [
  '/',
  '/autoprefixer',
  '/timestamp',
  '/url_format',
  '/crypto',
  '/linux_command',
  '/encoding',
  '/crontab',
  '/hexconvert',
  '/cidr',
  '/ua_parser',
  '/cdnjs',
  '/json_editor',
  '/json-to-csv',
    '/json-trans',
  '/any_rule',
   '/urlencode',
   '/uuid',
   '/password',
   '/ffmpeg',
  '/img_jiugongge',
  '/anime4k',
  '/cyberpunk2077',
  '/linghe',
  '/acg_meme',
  '/remove_duplicate',
  '/number_to_zh',
  '/rich_text_editor',
  '/markdown',
  '/morse',
  '/sot1_encrypt',
  '/text_autospace',
  '/screen_record',
  '/pomodoro_technique',
  '/lifecount',
  '/random',
  '/image_patina',
  '/line_sticker_download',
  '/search_help',
  '/ssr_decode',
  '/relatives_name',
  '/qrcode_generation',
  '/what_anime_is_this',
  '/china_colors',
  '/japan_colors',
  '/color',
  '/universal_pay',
  '/temperature_conversion',
  '/chinese_id',
  '/time_change',
  '/setting',
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