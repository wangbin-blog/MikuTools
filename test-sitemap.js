// 测试sitemap路由生成逻辑
console.log('开始测试sitemap路由生成...');

try {
  // 直接导入tools store
  const { state } = require('./store/tools');
  const toolsState = state();
  
  // 模拟sitemap的routes函数逻辑
  const routes = ['/'];
  
  // 提取所有工具页面的路径
  toolsState.forEach(category => {
    category.list.forEach(tool => {
      if (tool.path && !routes.includes(tool.path)) {
        routes.push(tool.path);
      }
    });
  });
  
  console.log('成功生成路由列表！');
  console.log(`共生成 ${routes.length} 个路由`);
  console.log('前10个路由示例:');
  console.log(routes.slice(0, 10));
  
} catch (error) {
  console.error('测试失败:', error);
}

console.log('测试完成');