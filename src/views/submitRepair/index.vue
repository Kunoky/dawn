<template>
  <div>
    <CTable
      :page-conf="{
        action: '/request/myList',
      }"
      ref="tableRef"
      id="repairRequest"
    >
      <el-table-column label="设备序列号" prop="serialNo" width="100" />
      <el-table-column label="设备型号" prop="modelNo" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="eqId" width="128" />
      <el-table-column label="维修类型" width="100">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column label="仪器地址" prop="equipAddress" width="130" />
      <el-table-column label="创建人" prop="createByName" width="100" />
      <el-table-column label="创建时间" prop="updateTime" width="140" />
      <el-table-column label="状态" prop="status" width="100">
        <template #default="{ row }">
          <el-popover
            v-if="row.status === 2"
            placement="top-start"
            title="退回原因"
            :width="200"
            trigger="hover"
            :content="row.backReason"
          >
            <template #reference>
              <span class="cs-p fw-b" style="color: #e71316">{{ request_status.kv[row.status] }}</span>
            </template>
          </el-popover>
          <el-popover
            v-else-if="row.status === 6"
            placement="top-start"
            title="关闭原因"
            :width="200"
            trigger="hover"
            :content="row.closeReason"
          >
            <template #reference>
              <span class="cs-p fw-b" style="color: #e71316">{{ request_status.kv[row.status] }}</span>
            </template>
          </el-popover>
          <span v-else class="cs-p fw-b" style="color: #909399">{{ request_status.kv[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" prop="custDesc" width="120" />
      <el-table-column label="客户编号" prop="customerId" width="100" />
      <el-table-column label="客户联系人" prop="name" width="100" />
      <el-table-column label="客户联系人电话" prop="mobile" width="120" />
      <el-table-column label="客户联系人邮箱" prop="email" width="130" />
      <el-table-column label="代理商" prop="vendor" width="100" />
      <el-table-column label="报修内容" prop="content" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="报修来源" prop="source" width="100">
        <template #default="{ row }">
          <span>{{ repairSource.kv[row.source] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报修时间" prop="repairTime" width="140" />
      <el-table-column label="保修期" prop="warrantyTime" width="130" />
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
        <el-form-item label="设备序列号" prop="serialNo">
          <el-input v-model="form.serialNo" placeholder="请输入设备序列号" clearable />
        </el-form-item>
        <el-form-item label="设备型号" prop="modelNo">
          <el-input v-model="form.modelNo" placeholder="请输入设备型号" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="(item, index) in request_status.options"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="custDesc">
          <el-input v-model="form.custDesc" placeholder="请输入客户名称" clearable />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" :options="options" @success="handleFormSuccess"></FormDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormDialog from './components/FormDialog.vue'

const tableRef = ref()
// 状态字典
const request_status = useDict('request_status')
// 报修来源
const repairSource = useDict('repairSource')
const refresh = () => tableRef.value.refresh()
const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
})
onMounted(() => {
  getMaintenanceType()
})
const options = ref([])
const getMaintenanceType = async () => {
  return req.get('/data/maintenanceType').then(res => {
    const [tree] = utils.arr2tree(res.data, 'id', 'pid')
    options.value = tree
  })
}
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
