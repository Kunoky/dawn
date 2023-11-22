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
// import purgecss from '@mojojoejo/vite-plugin-purgecss'
import { VueRouterAutoImports, getPascalCaseRouteName } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
// import { viteMockServe } from 'vite-plugin-mock'
import basicSsl from '@vitejs/plugin-basic-ssl'
import DepsCache from './plugin/optimizeDepsCache'

const plugins = [
  // https://www.npmjs.com/package/unplugin-vue-router
  VueRouter({
    routesFolder: 'src/views',
    exclude: ['**/components/**', 'user/login.vue'],
    getRouteName: routeNode => getPascalCaseRouteName(routeNode),
  }),
  vue(),
  vueJsx(),
  DepsCache(),
  basicSsl(),
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
      '@vueuse/core',
      {
        '@/utils/common': [['*', 'utils']],
      },
      {
        '@/utils/dict': ['useDict'],
      },
      {
        '@/utils/request': [['default', 'req']],
      },
      {
        dayjs: [['default', 'dayjs']],
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
  // {
  //   // # Using the default output directory: "dist/"
  //   // vite build
  //   // purgecss --css 'dist/**/*.css' --content 'dist/**/*.!(css)'
  //   //
  //   // 该插件实际是针对编译后的dist目录进行加工，所以针对项目文件和目录的配置无法起到预期效果
  //   ...purgecss({
  //     // css: ['oocss/src/index.css'],
  //     // skippedContentGlobs: ['node_modules/**'],
  //     safelist: {
  //       standard: [/^var-/, /^el-/, /^is-/, ],
  //     },
  //   }),
  //   apply: 'build',
  // },
  {
    ...visualizer(),
    apply: () => process.env.stats,
  },

  // ------------------
  // {
  //   ...viteMockServe({
  //     mockPath: 'mock',
  //   }),
  //   apply: 'serve',
  // },
  // {
  //   ...viteMockServe({
  //     mockPath: 'mock',
  //     prodEnabled: true,
  //     localEnabled: true,
  //     injectCode: `
  //         import { setupProdMockServer } from './mockProdServer';
  //         setupProdMockServer();
  //       `,
  //   }),
  //   apply: 'build',
  // },
  // ---------------------
]
// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  base: '/',
  server: {
    host: '0.0.0.0',
    port: '443',
    // strictPort: true,
    proxy: {
      '^/api': {
        // target: 'http://10.71.4.66:5006',
        // target: 'http://10.71.15.61:8090',
        // target: 'http://10.71.9.16:8090',
        target: 'http://10.71.9.27:8090',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
      '/sso/login': {
        // target: 'http://10.71.4.66:5006',
        target: 'http://10.71.9.27:8090/api',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, '/api'),
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
    __APP_NAME__: '"GSS"', // 项目名
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
