# 工具路由管理说明

## 为什么需要这个配置

为了解决Nuxt.js项目中sitemap动态生成路由的问题，我们创建了一个通用的路由配置文件 `routes.js`。这样可以避免在 `nuxt.config.js` 中直接使用 `require()` 导入ES模块时出现的兼容性问题。

## 如何添加新工具

当你需要添加新的工具页面时，请按照以下步骤操作：

1. 在 `pages/` 目录下创建新的工具页面文件（例如：`my_new_tool.vue`）

2. 在 `store/tools.js` 文件中添加工具的元数据信息，包括：
   - title: 工具分类标题
   - icon: 工具分类图标
   - list: 工具列表，包含每个工具的：
     - name: 工具名称
     - path: 工具路径（需要与页面文件名对应）
     - head: 页面元数据（keywords, description等）

3. **最重要的一步**：在 `utils/routes.js` 文件中的 `toolRoutes` 数组中添加对应的路由路径（例如：`'/my_new_tool'`）

## 工作原理

1. `utils/routes.js` 文件同时支持ES模块和CommonJS模块格式的导出
2. `nuxt.config.js` 中的sitemap配置通过CommonJS的 `require()` 导入这个文件
3. 这样就实现了"一处定义，多处使用"的效果，避免了手动维护多个路由列表

## 注意事项

- 请确保 `store/tools.js` 中的 `path` 和 `utils/routes.js` 中的路由路径完全一致
- 如果忘记在 `utils/routes.js` 中添加路由，新工具将不会出现在sitemap中
- 如果你需要修改现有的工具路径，请确保同时更新这两个文件