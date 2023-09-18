import { existsSync } from 'fs'
import fse from 'fs-extra'
import chokidar from 'chokidar'
var cacheDir = './node_modules/.vite'
var metadataPath = `${cacheDir}/deps/_metadata.json`
function VitePluginDepsCache({ delay = 2e3, field = 'vite-deps-cache' } = {}) {
  let pkgJson
  let server
  async function handleDeps() {
    if (!existsSync(metadataPath)) return
    const metadataJson = await fse.readJSON(metadataPath, 'utf-8')
    pkgJson[field] = Array.from(new Set([...pkgJson[field], ...Object.keys(metadataJson.optimized || {})]))
    setTimeout(() => {
      if (server) server.watcher.unwatch('./package.json')
      fse.writeJSON('./package.json', pkgJson, { spaces: 2 })
      if (server) server.watcher.add('./package.json')
    }, delay)
  }
  return {
    name: 'vite-plugin-deps-cache',
    apply: 'serve',
    async config(config) {
      pkgJson = await fse.readJSON('./package.json', 'utf-8')
      config.optimizeDeps = {
        ...config.optimizeDeps,
        include: [...(config?.optimizeDeps?.include || []), ...pkgJson[field]],
      }
    },
    configResolved(config) {
      const watcher = chokidar.watch(cacheDir, {
        cwd: config.root,
      })
      const timer = setInterval(() => {
        if (existsSync(cacheDir)) {
          watcher.on('change', path => {
            if (path.endsWith('_metadata.json')) handleDeps()
          })
          clearInterval(timer)
          handleDeps()
        }
      }, 1e3)
    },
    configureServer(_server) {
      server = _server
    },
  }
}
export { VitePluginDepsCache as default }
