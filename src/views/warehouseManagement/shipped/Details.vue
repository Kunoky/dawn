<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="详情"
    width="50%"
    v-bind="$attrs"
    :close-on-click-modal="false"
    class="query-detail-dialog"
  >
    <div class="demo-collapse" v-loading="dataLoading">
      <div>
        <el-table
          size="small"
          :data="itemList"
          style="width: 100%; margin-bottom: 20px"
          max-height="250"
          :header-cell-style="{ background: '#f5f7fa' }"
        >
          <el-table-column prop="soNo" label="SO NO" />
          <el-table-column prop="storage" label="FSE storage location" width="140" />
          <el-table-column prop="materialNo" label="物料号" />
          <el-table-column prop="itemName" label="配件名称" width="150" />
          <el-table-column prop="quantity" label="数量" />
          <!-- <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <span>
                {{ row.status === 1 ? '领用' : '收货' }}
              </span>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})

const itemList = ref([])
watch(
  () => props.modelValue,
  v => {
    if (v) {
      props.data?.id && getInfo()
    }
  },
  { immediate: true }
)
const { run: getInfo, loading: dataLoading } = useAsync(
  async () => {
    return req.get(`/spareParts/getInfo/${props.data.id}`)
  },
  {
    onSuccess(res) {
      itemList.value = res.data
      itemList.value.map(val => {
        val.storage = props.data.fseStorageLocation
      })
    },
  }
)

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
<style scoped>
.demo-collapse :deep(.el-collapse-item__header) {
  font-size: 14px;
  font-weight: bold;
}

.p {
  margin: 20px 0 0;
}
</style>
