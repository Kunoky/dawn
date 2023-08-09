import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import purgecss from '@mojojoejo/vite-plugin-purgecss'
import { VueRouterAutoImports, getPascalCaseRouteName } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'

const plugins = [
  // https://www.npmjs.com/package/unplugin-vue-router
  VueRouter({
    routesFolder: 'src/views',
    exclude: ['**/components/**', 'user/login.vue'],
    getRouteName: routeNode => getPascalCaseRouteName(routeNode),
  }),
  vue(),
  vueJsx(),
  AutoImport({
    resolvers: [
      ElementPlusResolver({
        importStyle: 'sass',
      }),
      IconsResolver({
        prefix: 'Icon',
      }),
    ],
    imports: [
      'vue',
      // 'vue-router',
      VueRouterAutoImports,
      'vue-i18n',
      'pinia',
      {
        '@/utils/common': [['*', 'utils']],
      },
      {
        '@/utils/dict': ['useDict'],
      },
      {
        '@/utils/request': [['default', 'req']],
      },
    ],
    dirs: ['./src/composables', './src/store'],
    eslintrc: {
      enabled: true,
    },
  }),
  Components({
    resolvers: [
      ElementPlusResolver({
        importStyle: 'sass',
      }),
      IconsResolver({
        enabledCollections: ['ep'],
      }),
    ],
  }),
  Icons({
    autoInstall: true,
  }),
  {
    ...purgecss(),
    apply: 'build',
  },
  {
    ...visualizer(),
    apply: () => process.env.stats,
  },
]

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  base: '/',
  server: {
    host: '0.0.0.0',
    port: '8000',
    strictPort: true,
    proxy: {
      '^/api': {
        target: 'http://vue.ruoyi.vip/prod-api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },
  define: {
    __APP_NAME__: '"破晓"', // 项目名
    __TOKEN_KEY__: '"satoken"', // token键名，localStorage
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
  // https://tauri.app/zh-cn/v1/guides/getting-started/prerequisites/
  // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
  // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
  // env variables
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // 为调试构建生成源代码映射 (sourcemap)
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
