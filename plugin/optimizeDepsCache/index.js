import { existsSync } from 'fs'
import fse from 'fs-extra'
import chokidar from 'chokidar'
var cacheDir = './node_modules/.vite'
var metadataPath = `${cacheDir}/deps/_metadata.json`

function exists(path) {
  if (existsSync('./node_modules/' + path) || existsSync('./node_modules/' + path.slice(0, path.lastIndexOf('/')))) {
    return true
  }
  return false
}
function VitePluginDepsCache({ delay = 2e3, file = './.vite-deps-cache.json' } = {}) {
  let cache = []
  let server
  async function handleDeps() {
    if (!existsSync(metadataPath)) return
    const metadataJson = await fse.readJSON(metadataPath, 'utf-8')
    cache = Array.from(new Set([...cache, ...Object.keys(metadataJson.optimized || {})]))
    cache = cache.filter(i => exists(i))
    cache.sort()
    setTimeout(() => {
      if (server) server.watcher.unwatch(file)
      fse.writeJSON(file, cache, { spaces: 2 })
      if (server) server.watcher.add(file)
    }, delay)
  }
  return {
    name: 'vite-plugin-deps-cache',
    apply: 'serve',
    async config(config) {
      if (!existsSync(file)) return
      cache = await fse.readJSON(file, 'utf-8')
      cache = cache.filter(i => exists(i))
      config.optimizeDeps = {
        ...config.optimizeDeps,
        include: [...(config?.optimizeDeps?.include || []), ...cache],
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
