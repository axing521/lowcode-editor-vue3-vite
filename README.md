# tdp-editor-vue3-vite
使用pnpm+vue3+vite+typescript搭建的，一个通过拖拽生成可运行页面的editor。

### 项目介绍
1. tdp-app-runtime: app运行时，负责将editor生成的app运行起来
2. tdp-editor: 设计器，通过用户拖拽页面生成一个完整的app，可作为第三方包提供给开发者使用，生成app的描述文件(json)
3. tdp-editor-common: runtime和editor公用逻辑的封装，例如controller和store
4. tdp-editor-components: 组件库
5. tdp-editor-types: 常量、interface和enum的定义 
### 使用步骤
```
1. pnpm i  // 安装依赖包
2. pnpm editor dev // 运行editor dev环境
3. pnpm app dev // 运行runtime dev环境
4. pnpm editor build:web // 打包editor为web应用
5. pnpm editor build:lib // 打包editor为第三方库，提供其他开发者使用
```
