<template>
  <div>
    <CTable
      :page-conf="{
        action: '/region/page',
      }"
      ref="tableRef"
      id="provincialManagement"
    >
      <el-table-column label="省份编码" prop="reg" />
      <el-table-column label="省份" prop="province" />
      <el-table-column label="省份(拼音)" prop="provincePy" />
      <el-table-column label="区域" prop="region">
        <template #default="{ row }">
          {{ regionalStatus.kv[row.region] }}
        </template>
      </el-table-column>
      <el-table-column label="FSE Leader邮箱" prop="fseLeader" />
      <el-table-column label="service sales邮箱" prop="serviceSales" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="100">
        <template #default="{ row }">
          <el-button type="info" link @click="handleEdit(row)">修改</el-button>
          <el-button type="primary" link @click="handleDel(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd">
          <i-ep-plus />
          新增
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="省份" prop="province">
          <el-input v-model="form.province" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="所属区域" prop="region">
          <el-select v-model="form.region" placeholder="请选择所属区域" style="width: 100%" clearable>
            <el-option
              v-for="(item, index) in regionalStatus.options"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormDialog from './components/FormDialog.vue'

const regionalStatus = useDict('regionalStatus') // 区域

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
})
const handleAdd = () => {
  current.value = null
  visible.form = true
}

const handleEdit = row => {
  current.value = row
  visible.form = true
}

const handleFormSuccess = () => {
  refresh()
}

const handleDel = row => {
  ElMessageBox.confirm('数据删除后无法恢复，确定继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      return req.delete(`/region/${row.reg}`)
    })
    .then(({ code }) => {
      if (code === 200) {
        refresh()
      }
    })
}
</script>
