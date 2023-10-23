<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
      }"
      ref="tableRef"
      id="transfer"
    >
      <el-table-column label="SO NO" prop="soNo" width="130" />
      <el-table-column label="维修任务号" prop="TaskID" width="120" />
      <el-table-column label="设备序列号" prop="serialNo" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="设备型号" prop="modelNo" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="eqId" width="128" />
      <el-table-column label="维修类型" width="100">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column label="仪器地址" prop="eee" width="100" />
      <el-table-column label="客户单位名称" prop="custDesc" width="100" />
      <el-table-column label="客户编号" prop="customerId" width="100" />
      <el-table-column label="客户联系人" prop="name" width="100" />
      <el-table-column label="客户联系人电话" prop="mobile" width="120" />
      <el-table-column label="客户联系人邮箱" prop="email" width="130" />
      <el-table-column label="代理商" prop="vendor" width="100" />
      <el-table-column label="报修内容" prop="content" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="报修来源" prop="source" width="100" />
      <el-table-column label="报修时间" prop="repairTime" width="130" />
      <el-table-column label="保修期" prop="warrantyTime" width="100" />
      <el-table-column label="FSE工程师名称" prop="transferFseName" width="100" />
      <el-table-column label="FSE work center" prop="workCenter" width="115" />
      <el-table-column label="FSE storage location" prop="storageLocation" width="140" />
      <el-table-column label="转移原因" prop="transferReason" width="140" :show-overflow-tooltip="true" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="100">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleTransfer(row)">转移</el-button>
          <el-button type="primary" link @click="handleClose(row)">拒绝</el-button>
        </template>
      </el-table-column>
      <template #actions>
        <!-- <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:user:add']">
            <i-ep-plus />
            新增
          </el-button> -->
      </template>
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
        <el-form-item label="CRC" prop="isCrc">
          <el-select v-model="form.isCrc" placeholder="请选择CRC" clearable>
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <el-input v-model="form.area" placeholder="请输入区域" clearable />
        </el-form-item>
        <el-form-item label="客户名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入客户名称" clearable />
        </el-form-item>
        <el-form-item label="工程师名称" prop="fseId">
          <el-select
            clearable
            v-model="form.fseId"
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
        <el-form-item label="SO类型" prop="options">
          <el-cascader
            v-model="form.options"
            :options="options"
            filterable
            clearable
            @change="changeOptions"
            :props="{
              label: 'name',
              value: 'id',
              checkStrictly: true,
            }"
          />
        </el-form-item>
      </template>
    </CTable>

    <el-dialog title="转移" width="30%" v-model="transferVisible" :close-on-click-modal="false">
      <el-descriptions class="margin-top" :column="1" border size="small">
        <el-descriptions-item>
          <template #label>原FSE</template>
          {{ record.engineerName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>原FSE work center</template>
          {{ record.workCenter }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>原FSE storage location</template>
          {{ record.storageLocation }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>转移后FSE</template>
          {{ record.transferFseName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>转移后FSE work center</template>
          {{ record.transferWorkCenter }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>转移后FSE storage location</template>
          {{ record.transferStorageLocation }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>转移原因</template>
          {{ record.transferReason }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseTransfer">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="sssssssss">已完成SAP更新</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="拒绝" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form :model="formDetails" ref="formRefDetails" label-width="80" :rules="rules">
        <el-form-item label="拒绝原因" prop="reason">
          <el-input type="textarea" v-model="formDetails.reason" placeholder="请输入拒绝原因" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDetail">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const tableRef = ref()
const refresh = () => tableRef.value.refresh()

const listData = params => {
  delete params.options
  params.soStatus = 11 // TODO: SO状态 待转移
  return req.get('/so/page', { params }).then(res => {
    return { data: res.data }
  })
}

// FSE工程师名称
const engineerNameLoading = ref(false)
const engineerNameList = ref([])
const engineerNameOptions = ref([])
async function getEngineerName(v) {
  return req.get('/user/fse', { params: { fseName: v } }).then(res => {
    engineerNameList.value = res.data.map(item => {
      return { value: item.fseId, label: `${item.fseId} / ${item.fseName}` }
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
  } else {
    engineerNameOptions.value = []
  }
}

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

const changeOptions = val => {
  if (!val) {
    tableRef.value.form.orderType = ''
    tableRef.value.form.subType = ''
  } else {
    tableRef.value.form.orderType = val[0]
    tableRef.value.form.subType = val[1]
  }
}

// 转移
const record = ref({})
const transferVisible = ref(false)
const handleTransfer = row => {
  record.value = row
  // record.value.engineerName = row.engineerName
  // record.value.workCenter = row.workCenter
  // record.value.storageLocation = row.storageLocation
  // record.value.transferFseName = row.transferFseName
  // record.value.transferWorkCenter = row.transferWorkCenter
  // record.value.transferStorageLocation = row.transferStorageLocation
  // record.value.transferReason = row.transferReason

  transferVisible.value = true
}
const handleCloseTransfer = () => {
  transferVisible.value = false
}
const sssssssss = () => {}

// 拒绝
const detailVisible = ref(false)
const formRefDetails = ref(null)
const formDetails = ref({
  soNo: '',
  reason: '',
})
const rules = {
  reason: [{ required: true, message: '拒绝原因不能为空', trigger: 'blur' }],
}

const handleClose = row => {
  formDetails.value.soNo = row.soNo
  detailVisible.value = true
}
const handleCloseDetail = () => {
  detailVisible.value = false
  nextTick(() => {
    formRefDetails.value.resetFields()
  })
}
const handleConfirm = () => {
  formRefDetails.value.validate(valid => {
    if (valid) {
      req.post('/so/transfer/reject', formDetails.value).then(() => {
        detailVisible.value = false
        refresh()
      })
    }
  })
}
</script>
