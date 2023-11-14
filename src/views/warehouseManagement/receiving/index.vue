<template>
  <div>
    <CTable
      :page-conf="{
        action: '/spareParts/toBeReceived',
      }"
      ref="tableRef"
      id="shipped"
    >
      <el-table-column label="SO NO" prop="soNo" width="130" />
      <el-table-column label="设备序列号" prop="serialNo" width="120" />
      <el-table-column label="设备型号" prop="modelNo" width="100" />
      <el-table-column label="快递单号" prop="expressNo" width="140" />
      <el-table-column label="还库类型" prop="returnType" width="100">
        <template #default="{ row }">
          <span>{{ row.returnType === 1 ? '好件还库' : '坏件还库' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="领用时间" prop="repairTime" width="130" /> -->
      <el-table-column label="工程师名称" prop="fseName" />
      <el-table-column label="FSE work center" prop="fseWorkCenter" width="120" />
      <el-table-column label="FSE storage location" prop="fseStorageLocation" width="140" />
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="160">
        <template #default="{ row }">
          <el-button type="info" link @click="handleDeatil(row)">还库详情</el-button>
          <el-button type="primary" link @click="handleConfirm(row)">确认收货</el-button>
        </template>
      </el-table-column>
      <template #form="{ form }">
        <el-form-item label="SO NO" prop="soNo">
          <el-input v-model="form.soNo" placeholder="请输入SO NO" clearable />
        </el-form-item>
        <el-form-item label="设备序列号" prop="serialNo">
          <el-input v-model="form.serialNo" placeholder="请输入设备型号" clearable />
        </el-form-item>
        <el-form-item label="设备型号" prop="modelNo">
          <el-input v-model="form.modelNo" placeholder="请输入设备型号" clearable />
        </el-form-item>
        <el-form-item label="工程师名称" prop="fseWorkCenter">
          <el-select
            clearable
            v-model="form.fseWorkCenter"
            placeholder="请输入FSE工程师名称"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodEngineerName"
            :loading="engineerNameLoading"
          >
            <el-option v-for="item in engineerNameOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <Details :data="current" v-model="visible.detail" @success="handleFormSuccess"></Details>
  </div>
</template>

<script setup>
import Details from './Details.vue'
// 工程师名称
const engineerNameLoading = ref(false)
const engineerNameList = ref([])
const engineerNameOptions = ref([])
async function getEngineerName(v) {
  return req.get('/user/fse', { params: { fseName: v } }).then(res => {
    engineerNameList.value = res.data.map(item => {
      return { value: item.fseWorkCenter, label: `${item.fseWorkCenter} / ${item.fseName}` }
    })
  })
}
const remoteMethodEngineerName = query => {
  if (query) {
    engineerNameLoading.value = true
    getEngineerName(query).then(() => {
      engineerNameLoading.value = false
      engineerNameOptions.value = engineerNameList.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    })
    // setTimeout(() => {
    // }, 200)
  } else {
    engineerNameOptions.value = []
  }
}

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
  detail: false,
})

const handleDeatil = row => {
  current.value = row
  visible.detail = true
}
const handleFormSuccess = () => {
  refresh()
}

const handleConfirm = row => {
  ElMessageBox.confirm('确认收货后无法恢复，确定继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      return req.put(`/spareParts/confirmReceive/${row.id}`)
    })
    .then(({ code }) => {
      if (code === 200) {
        refresh()
      }
    })
}
</script>
