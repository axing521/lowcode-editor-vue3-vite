## tdp-app-runtime 低代码平台运行环境
### 目录介绍
tdp-app-runtime

    --src
      |--assets     - 所有资源文件
      |--components - 复用逻辑
      |--runtime    - 运行环境入口配置
         |--TdpApp.vue  - 运行环境整体框架
      |--pages      - 编辑器页面
         |--TdpAppFooter.vue    - 页脚组件
         |--TdpAppHeader.vue    - 页头组件
         |--TdpAppIndex.vue     - 默认首页内容区
         |--TdpAppLeftSide.vue  - 页面左侧区域
         |--TdpAppRightSide.vue - 页面右侧区域
         |--TdpPage.vue         - 页面内容区渲染逻辑
         |--TdpPage404.vue      - 路由失败404页面
         |--rightPanel  - 编辑器右侧面板（包含各种组件配置）
      |--plugins    - 依赖的插件
      |--routers    - 路由配置
      |--styles     - 公共样式 (针对不同应用类型预置不同样式)
         |--var.less  - 所有变量定义
