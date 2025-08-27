// 测试路由配置文件是否能正常工作
console.log('开始测试路由配置文件...');

try {
  // 测试 CommonJS 格式导入
  const { toolRoutes } = require('./utils/routes');
  console.log('CommonJS 导入成功！');
  console.log(`共定义了 ${toolRoutes.length} 个路由`);
  console.log('前5个路由示例:', toolRoutes.slice(0, 5));
  
  // 测试是否包含所有必要的路由
  const requiredRoutes = ['/', '/autoprefixer', '/timestamp'];
  requiredRoutes.forEach(route => {
    if (toolRoutes.includes(route)) {
      console.log(`✓ 路由 "${route}" 已包含在配置中`);
    } else {
      console.error(`✗ 路由 "${route}" 未包含在配置中`);
    }
  });
  
  console.log('测试成功完成！');
} catch (error) {
  console.error('测试失败:', error);
}

console.log('测试完成');