<template>
  <section class="dp-f1">
    <el-card>
      <template #header>
        <div class="pt-r">
          <i-ep-collection class="va-m mgr-s" />
          <span>缓存列表</span>
          <i-ep-refresh class="pt-a rt-0 cl-p cs-p va-m" @click="refreshCache" />
        </div>
      </template>
      <el-table
        v-loading="cacheLoading"
        :data="cacheData"
        highlight-current-row
        @row-click="listKey"
        :height="tableHeight"
      >
        <el-table-column label="序号" width="60" type="index"></el-table-column>
        <el-table-column
          label="缓存名称"
          prop="cacheName"
          :show-overflow-tooltip="true"
          :formatter="nameFormatter"
        ></el-table-column>

        <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
        <el-table-column label="操作" width="60">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleClearCacheName(row)"><i-ep-delete /></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="mgl-m">
      <template #header>
        <div class="pt-r">
          <i-ep-key class="va-m mgr-s" />
          <span>键名列表</span>
          <i-ep-refresh class="pt-a rt-0 cl-p cs-p va-m" @click="refreshKey" />
        </div>
      </template>
      <el-table
        v-loading="keyLoading"
        :data="keyData"
        highlight-current-row
        @row-click="getContent"
        :height="tableHeight"
      >
        <el-table-column label="序号" width="60" type="index"></el-table-column>
        <el-table-column label="缓存键名" :show-overflow-tooltip="true" prop="key"></el-table-column>
        <el-table-column label="操作" width="60">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleClearKey(row)"><i-ep-delete /></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="mgl-m">
      <template #header>
        <div class="pt-r">
          <i-ep-document class="va-m mgr-s" />
          <span>缓存内容</span>
          <el-button link type="primary" class="pt-a rt-0">
            <i-ep-refresh @click="handleClearAll" />
            清理全部
          </el-button>
        </div>
      </template>
      <ul class="cl-8" v-loading="contentLoading">
        <li>
          <b>缓存名称:</b>
          <div class="pd-m">{{ contentData.cacheName }}</div>
        </li>
        <li>
          <b>缓存键名:</b>
          <div class="pd-m">{{ contentData.cacheKey }}</div>
        </li>
        <li>
          <b>缓存内容:</b>
          <div class="pd-m wb-ba">{{ contentData.cacheValue }}</div>
        </li>
      </ul>
    </el-card>
  </section>
</template>
<script setup name="MonitorCacheList">
const tableHeight = ref(window.innerHeight - 240)

const {
  data: cacheData,
  loading: cacheLoading,
  refresh: refreshCache,
} = useAsync(() => req.get('monitor/cache/getNames').then(res => res.data), { manual: false })
const {
  data: keyData,
  loading: keyLoading,
  run: listKey,
  refresh: refreshKey,
} = useAsync(row =>
  req.get('monitor/cache/getKeys/' + row.cacheName).then(res => res.data.map(i => ({ key: i, name: row.cacheName })))
)
const {
  data: contentData,
  loading: contentLoading,
  run: getContent,
} = useAsync(row => req.get(`monitor/cache/getValue/${row.name}/${row.key}`).then(res => res.data), { initialData: {} })

/** 列表前缀去除 */
function nameFormatter(row) {
  return row.cacheName.replace(':', '')
}

const handleClearCacheName = row => {
  req.delete('monitor/cache/clearCacheName/' + row.cacheName).then(refreshCache)
}

const handleClearKey = row => {
  req.delete('monitor/cache/clearCacheKey/' + row.key).then(refreshKey)
}

const handleClearAll = () => {
  req.delete('monitor/cache/clearCacheAll')
}
</script>
