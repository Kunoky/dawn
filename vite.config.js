import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

const plugins = [vue()]
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
    },
  },
  define: {
    __APP_NAME__: '"破晓"', // 项目名
    __TOKEN_KEY__: '"satoken"', // token键名，localStorage和header均使用此名
  },
  test: {
    globals: true,
    environment: 'jsdom',
    alias: [{ find: /^vue$/, replacement: 'vue/dist/vue.runtime.common.js' }],
  },
})
