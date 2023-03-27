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

const plugins = [
  vue(),
  vueJsx(),
  AutoImport({
    resolvers: [
      ElementPlusResolver(),
      IconsResolver({
        prefix: 'Icon',
      }),
    ],
    imports: [
      'vue',
      'vue-router',
      'vue-i18n',
      'pinia',
      {
        '@/utils/common': [['*', 'utils']],
      },
      {
        '@/utils/dict': ['useDict'],
      },
      {
        '@/utils/request': [['default', 'axios']],
      },
    ],
    dirs: ['./src/hooks'],
    eslintrc: {
      enabled: true,
    },
  }),
  Components({
    resolvers: [
      ElementPlusResolver(),
      IconsResolver({
        enabledCollections: ['ep'],
      }),
    ],
  }),
  Icons({
    autoInstall: true,
  }),
]
if (process.env.stats) {
  plugins.push(visualizer())
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  base: '/',
  server: {
    host: '0.0.0.0',
    port: '8000',
    proxy: {
      '^/api': {
        target: 'http://jsonplaceholder.typicode.com/',
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
    __TOKEN_KEY__: '"satoken"', // token键名，localStorage和header均使用此名
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
