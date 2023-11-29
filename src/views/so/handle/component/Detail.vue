<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="详情"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <div v-loading="dataLoading">
      <el-table
        size="small"
        :data="rpaLockMaterialList"
        style="width: 100%; margin-bottom: 20px"
        max-height="200"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column label="配件消耗情况" align="center">
          <el-table-column prop="material" label="物料号" />
          <el-table-column prop="batchNo" label="批次号" />
          <el-table-column prop="count" label="数量" />
          <el-table-column prop="message" label="异常信息" width="200" :show-overflow-tooltip="true" />
          <el-table-column prop="rpaUpdateTime" label="RPA执行的时间" />
        </el-table-column>
      </el-table>
      <el-table
        size="small"
        :data="rpaLockLaborList"
        style="width: 100%; margin-bottom: 20px"
        max-height="200"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column label="工时" align="center">
          <el-table-column prop="aty" label="工时种类" />
          <el-table-column prop="actWork" label="时长" />
          <el-table-column prop="errormessage" label="异常信息" width="200" :show-overflow-tooltip="true" />
          <el-table-column prop="workStartDate" label="开始日期" />
          <el-table-column prop="workFinishiDate" label="结束日期" />
          <el-table-column prop="workStartTime" label="开始时间" />
          <el-table-column prop="workFinishiTime" label="结束时间" />
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
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

const rpaLockMaterialList = ref([])
const rpaLockLaborList = ref([])

watch(
  () => props.modelValue,
  v => {
    if (v) {
      props.data?.soNo && getPayDemandNote()
    }
  },
  { immediate: true }
)
const { run: getPayDemandNote, loading: dataLoading } = useAsync(async () => {
  return req.get(`/lockSo/getInfo/${props.data.soNo}`).then(res => {
    rpaLockMaterialList.value = res.data.rpaLockMaterialList
    rpaLockLaborList.value = res.data.rpaLockLaborList
    return res
  })
})

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
