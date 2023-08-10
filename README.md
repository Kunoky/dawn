## 设计思想

写的更少，做的更多。这是 react 的哲学，也是我想做的。
OOCSS、自动导入、众多逻辑的封装、以及没有使用 ts 都是为了实现这一点，是为了让我们在开发过程中关注逻辑即可，
而不需要开发时在文件内或文件之间跳来跳去，耗费过多与逻辑无关的精力。

## 实例

demo: 默认 devlop，基于 indexeddb 模拟了一个项目，如果数据改乱了，请删除缓存的 indexeddb 数据

ruoyi：请切换至 ruoyi 分支

## 特点

1.  Vite
2.  Vue3
3.  文件路由
4.  Api 自动引入
5.  组件自动引入
6.  图标自动引入
7.  VueUse 支持
8.  oocss
9.  Purgecss 支持
10. 暗黑模式支持
11. pinia 状态管理
12. pnpm 包管理器
13. Vitest 单元测试支持
14. 路径别名支持
15. i18n 国际化支持
16. jsx 支持
17. 环境变量配置支持
18. 统一的代码规范与风格支持
19. echarts 支持
20. 全局通用 axios 请求封装
21. 通用表格业务组件封装
22. 通用 composables 函数封装
23. tauri 支持

## 使用

使用 `pnpm` 包管理器 👉 [安装教程](https://pnpm.io/zh/installation)

1. 安装依赖

```shell
pnpm install
```

2. 开发

```shell
pnpm dev
```

3. 打包

```shell
pnpm build

# 打包体积分析
pnpm build:stats
```

4. 单元测试

```shell
pnpm test
```

5. 单元测试报告生成

```shell
pnpm coverage
```

6. 代码规范校验

```shell
# pnpm lint [path]
pnpm lint src

# 代码格式化 pnpm format [path]
pnpm format src
```

<br />

## 详情

### [1. Vite 的](https://cn.vitejs.dev/)

采用 **[vite](https://cn.vitejs.dev/)** 作为构建工具，你可以在根目录下的
`vite.config.js` 对项目的构建进行配置。
<br />

### [2. Vue3 的](https://v3.cn.vuejs.org/)

### [3. 文件路由](https://github.com/posva/unplugin-vue-router)

目录结构即路由。

eg:

- `src/pages/index.vue` => `/`
- `src/pages/about.vue` => `/about`
- `src/pages/users/index.vue` => `/users`
- `src/pages/users/profile.vue` => `/users/profile`
- `src/pages/users/[id].vue` => `/users/:id`
- `src/pages/[user]/settings.vue` => `/:user/settings`
- `src/pages/[...path].vue` => 404 路由

具体可见 👉 [unplugin-vue-router](https://github.com/posva/unplugin-vue-router)

### [4. Api 自动引入](https://github.com/antfu/unplugin-auto-import)

原本 `vue` 的 `api` 需要自行 `import`。

```js
import { computed, ref } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

现在可以直接使用。

```js
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

而且上边的 `api` 是按需自动引入的。

目前模板支持自动引入 `api` 的库列表 👉

- `vue`
- `pinia`
- `vue-i18n`
- `vue-router`
- `vueuse/core`

只要确保已经安装依赖即可，具体可见 👉
[vite-auto-import-resolvers](https://github.com/dishait/vite-auto-import-resolvers#%E9%BB%98%E8%AE%A4%E6%94%AF%E6%8C%81%E5%88%97%E8%A1%A8)，

当然还有项目中的自动引入，只需要满足以下规范即可。

1. `src/composables` 的导出将被按需自动引入。

例如有个 `src/composables/foo.js`

```js
// 导出
export const FOO = 'Foo'
```

此时就不再需要 `import`了

```html
<script setup lang="js">
  console.log(FOO) // 输出 Foo
</script>
```

2. `src/store` 的导出将被按需自动引入。

例如有个 `src/store/user.js`

```js
// 导出
export const useUserStore = defineStore('user', () => {
  const { data, loading, run: listData, refresh, error, params } = useAsync(params => req.get('user', params))

  return {
    data,
    loading,
    listData,
    refresh,
    error,
    params,
  }
})
```

此时就不再需要 `import`了

```html
<script setup lang="js">
  const userStore = useUserStore()
  userStore.listData({
    page: 1,
    size: 10,
  })
</script>

<template>
  <ul v-loading="userStore.loading">
    <li v-for="i in userStore.data" :key="i.id">{{ i.name }}</li>
  </ul>
</template>
```

### [5. 组件自动引入](https://github.com/antfu/unplugin-vue-components)

原来需要 `import`

```html
<!-- src/pages/index.vue -->
<script setup lang="js">
  import Hello from '../components/Hello.vue'
</script>

<template>
  <Hello />
</template>
```

现在只要在 `src/components` 下定义的组件都将会按需引入，即 `import` 是不需要的。

```html
<!-- src/pages/index.vue -->
<template>
  <Hello />
</template>
```

当然也支持嵌套组件，例如 `src/components/foo/bar.vue` 👇

```html
<!-- src/pages/index.vue -->
<template>
  <FooBar />
</template>
```

同时流行组件库自动引入也是支持的。

目前支持的组件库有:

- [vant](https://github.com/youzan/vant)
- [idux](https://github.com/IDuxFE/idux)
- [devui](https://github.com/DevCloudFE/vue-devui)
- [quasar](https://github.com/quasarframework/quasar)
- [varlet](https://github.com/varletjs/varlet)
- [inkline](https://github.com/inkline/inkline)
- [vuetify](https://github.com/vuetifyjs/vuetify)
- [naive-ui](https://github.com/TuSimple/naive-ui)
- [primevue](https://github.com/primefaces/primevue)
- [layui-vue](https://gitee.com/layui/layui-vue)
- [view-design](https://iviewui.com/)
- [arco-design](https://github.com/arco-design/arco-design)
- [element-plus](https://github.com/element-plus/element-plus)
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue)
- [@headlessui/vue](https://github.com/tailwindlabs/headlessui)
- [tdesign-vue-next](https://github.com/Tencent/tdesign-vue-next)
- [@vueuse/components](https://github.com/vueuse/vueuse/tree/main/packages/components)

具体可见 👉
[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)

### [6. VueUse 支持](https://vueuse.org/)

`VueUse` 是一个超级强的 `hooks` 库，例如你要获取鼠标位置，只需要这样 👇

```html
<script setup lang="js">
  // useMouse 被自动按需引入了，不需要import
  const { x, y } = useMouse()
</script>

<template>
  <div>x坐标 {{x}}</div>
  <div>y坐标 {{y}}</div>
</template>
```

具体可见 👉 [VueUse](https://vueuse.org/)

### [7. oocss 的](https://www.npmjs.com/package/oocss)

`oocss` 是一个使用成本极低的 `原子css` 库, 预定义变量：

```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --gray-1: #ffffff;
  --gray-2: #fafafa;
  --gray-3: #f5f5f5;
  --gray-4: #e8e8e8;
  --gray-5: #d9d9d9;
  --gray-6: #bfbfbf;
  --gray-7: #8c8c8c;
  --gray-8: #595959;
  --gray-9: #262626;
  --gray-10: #000000;
  --size-s: 8px;
  --size-m: 16px;
  --size-l: 24px;
}
/*
 五色之变，不可胜观也。oocss的类基本上只有一个样式，通过组合实现效果，力图做到极致的简洁
命名规则：属性简写-值简写-伪类简写
属性一般2个字母，个别例外：margin -> mg, color -> cl, flex -> fx, object-fit -> of， background-color -> bgc
值和伪类一般都是首字母
*/

.cl-p,
.cl-p-h:hover {
  color: var(--primary-color);
}
```

直接在代码中使用

```html
<template>
  <div class="bgc-p cl-1 pd-s ta-c">我是主题色背景1号色文本小边距</div>
</template>
```

上述模板将渲主题色背景 1 号色的字小内边距居中。

### 8. 暗黑模式支持

```html
<script setup>
  const { isDark, toggle } = useTheme()
</script>

<template>
  <el-button link @click="toggle()">
    <i-ep-sunny v-if="isDark"></i-ep-sunny>
    <i-ep-moon v-else></i-ep-moon>
  </el-button>
</template>
```

### [9. Vitest 单元测试支持](https://vitest.dev/guide/#configuring-vitest)

在 `src/test` 目录中可以书写单元测试。

```js
import { assert, describe, expect, it } from 'vitest'

describe('suite name', () => {
  it('foo', () => {
    expect(1 + 1).toEqual(2)
    expect(true).to.be.true
  })

  it('bar', () => {
    assert.equal(Math.sqrt(4), 2)
  })

  it('snapshot', () => {
    expect({ foo: 'bar' }).toMatchSnapshot()
  })
})
```

然后在终端中输入命令即可测试

```shell
pnpm test
```

或者生成报告

```shell
pnpm coverage
```

具体可见 👉 [Vitest](https://vitest.dev/guide/#configuring-vitest)

### [10. i18n 国际化支持](https://github.com/intlify/vue-i18n-next/tree/master/packages/vue-i18n#readme)

在日常的业务当中，可能会存在一些需要国际化的场景。那么只需要在根目录下的
`locales` 中定义不同语言的 `js` 即可在项目中做到开箱即用的国际化支持。

比如 `locales/en.js` 中用来定义需要国际化支持的英文内容。

```js
// locales/en.js
// English
{
  lang: 'English'
}
```

又如 `locales/zh-CN.js` 中用来定义需要国际化支持的中文内容。

```js
// locales/zh-CN.js
// 简体中文
{
  lang: '简体中文'
}
```

此时在组件中即可这样用 👇

```html
<script setup>
  const { t } = useI18n()

  const handleClick = () => {
    alert('当前语言是：' + t('lang'))
  }
</script>

<template>
  <div class="cs-p cl-p" @click="handleClick">language: {{ $t('lang') }} click me!!</div>
</template>
```

### 11. [环境变量配置支持](https://cn.vitejs.dev/guide/env-and-mode.html)

根目录下的 `.env` 用来对项目进行环境变量配置。

### 12. 统一的代码规范与风格支持

由 [eslint](https://github.com/eslint/eslint) 提供的代码规范校验，使用
[prettier](https://github.com/prettier/prettier) 统一代码风格。

由 [husky](https://github.com/typicode/husky) +
[lint-staged](https://github.com/okonet/lint-staged) 提供的 `commit` 时校验。

### 13. [全局通用 axios 请求封装](https://www.axios-http.cn/)

封装了 [axios](https://www.axios-http.cn/)，你可以在 `src`
目录下所有文件中使用它 👇

```js
// src 下任何文件都是可用的
req.get('...')
req.post('...', { name: '张三', age: 20 })
// ... 以此类推
```

上述 `req` 是 `axios`
单独创建的实例，具有简单错误提示，以及响应数据转换。具体可见
`src/utils/request.js`。

该 `req` 实例的 `baseURL` 取自环境变量文件 `.env` 的
`VITE_SERVER_PATH`，默认为 `/`，可以按自己需求更改。

具体可见 👉 [axios](https://www.axios-http.cn/)

### 14. [TAURI 构建桌面应用](https://tauri.app/zh-cn/)

tauri 可以构建跨平台的快速、安全、前端隔离应用，构建体积只有数兆

```shell
# 启动tauri开发模式
pnpm dev:tauri

# 构建tauri应用
pnpm build:tauri
```

### 15. 强大的业务组件封装

以 CTable 通用表格为例

```html
<template>
  <CTable
    :page-conf="{
      action: 'user',
    }"
  >
    <el-table-column label="昵称" prop="operId" />
    <template #form="{ form }">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称" clearable />
      </el-form-item>
    </template>
  </CTable>
</template>
```

如此一个具有条件搜索的分页表格就完成了

### 16. [IconFont](https://www.iconfont.cn/help/detail?spm=a313x.manage_type_myprojects.1998910419.d8cf4382a.27633a81kEThG6&helptype=code)

从 IconFont 市场添加自己的 icon 后

```html
<template>
  <IconFont icon="user" />
</template>
```

## License

Made with [markthree](./LICENSE)

Published under [MIT License](./LICENSE).

<br />
