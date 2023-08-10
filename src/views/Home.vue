<template>
  <div>
    <pre class="bg mg-0 cl-8">

    <h1>设计思想</h1>
  写的更少，做的更多。这是react的哲学，也是我想做的。
  OOCSS、自动导入、众多逻辑的封装、以及没有使用ts都是为了实现这一点，是为了让我们在开发过程中关注逻辑即可，
  而不需要开发时在文件内或文件之间跳来跳去。
    <h1>特点</h1>
  Vite
  Vue3
  文件路由
  Api 自动引入
  组件自动引入
  图标自动引入
  VueUse 支持
  oocss
  Purgecss支持
  暗黑模式支持
  pinia 状态管理
  pnpm 包管理器
  Vitest 单元测试支持
  路径别名支持
  i18n 国际化支持
  tsx 支持
  环境变量配置支持
  统一的代码规范与风格支持
  echarts 支持
  全局通用 axios 请求封装
  通用表格业务组件封装
  通用composables函数封装
  tauri支持
    </pre>
  </div>
</template>
<script setup>
definePage({
  meta: {
    title: '首页',
    public: true,
    affix: true,
  },
})
</script>
