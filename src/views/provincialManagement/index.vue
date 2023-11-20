<template>
  <div>
    <CTable
      :page-conf="{
        action: '/request/myList',
      }"
      ref="tableRef"
      id="repairRequest"
    >
      <el-table-column label="省份编码" prop="reg" />
      <el-table-column label="省份" prop="province" />
      <el-table-column label="省份(拼音)" prop="province_py" />
      <el-table-column label="区域" prop="region">
        <template #default="{ row }">
          {{ regionalStatus.kv[row.region] }}
        </template>
      </el-table-column>
      <el-table-column label="FSE Leader邮箱" prop="fse_leader" />
      <el-table-column label="service sales邮箱" prop="service_sales" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="80">
        <template #default="{ row }">
          <div v-if="row.status === 2">
            <el-button type="info" link @click="handleEdit(row)">修改</el-button>
          </div>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd">
          <i-ep-plus />
          新增
        </el-button>
      </template>
      <template #form="{ form }">
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
</script>
