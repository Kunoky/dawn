<template>
  <div>
    <CTable
      :page-conf="{
        action: '/so/page',
      }"
      ref="tableRef"
      id="query"
    >
      <el-table-column label="SO NO" prop="soNo" width="130" />
      <el-table-column label="维修任务号" prop="TaskID" width="120" />
      <el-table-column label="设备序列号" prop="serialNo" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="设备型号" prop="modelNo" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="ccc" width="128" />
      <el-table-column label="维修类型" width="100">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column label="仪器地址" prop="eee" width="100" />
      <el-table-column label="创建人" prop="createBy" width="100" />
      <el-table-column label="客户单位名称" prop="custDesc" width="100" />
      <el-table-column label="客户编号" prop="customerId" width="100" />
      <el-table-column label="客户联系人" prop="name" width="100" />
      <el-table-column label="客户联系人电话" prop="mobile" width="120" />
      <el-table-column label="客户联系人邮箱" prop="email" width="130" />
      <el-table-column label="代理商" prop="vendor" width="100" />
      <el-table-column label="报修内容" prop="content" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="报修来源" prop="mmm" width="100" />
      <el-table-column label="报修时间" prop="repairTime" width="130" />
      <el-table-column label="保修期" prop="ooo" width="100" />
      <el-table-column label="FSE工程师名称" prop="transferFseName" width="100" />
      <el-table-column label="FSE work center" prop="workCenter" width="115" />
      <el-table-column label="FSE storage location" prop="storageLocation" width="140" />
      <el-table-column label="状态" prop="status" width="100">
        <template #default="{ row }">
          <span class="cs-p fw-b" style="color: #909399">{{ soStatus.kv[row.status] }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="审批结果" prop="uuu" width="140" /> -->
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="100">
        <template #default="{ row }">
          <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
          <el-button v-if="row.status !== 0" type="primary" link @click="handleClose(row)">关闭</el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handelFile">
          <i-ep-bottom />
          导出
        </el-button>
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
          <el-select v-model="form.isCrc" placeholder="请选择CRC" style="width: 100%" clearable>
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
        <el-form-item label="SO类型" prop="orderType">
          <el-cascader
            v-model="orderType"
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
    <CDetails :data="current" v-model="visible.detail" @success="handleFormSuccess" :only="'query'"></CDetails>

    <el-dialog title="关闭" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form :model="formDetails" ref="formRefDetails" label-width="80" :rules="rules">
        <el-form-item label="原因" prop="reason">
          <el-select v-model="formDetails.reason" placeholder="请选择原因" clearable style="width: 100%">
            <el-option label="超客户预算" value="1" />
            <el-option label="经费审批未通过" value="2" />
            <el-option label="第三方维修" value="3" />
            <el-option label="未中标" value="4" />
            <el-option label="暂不维修" value="5" />
            <el-option label="仪器报废" value="6" />
            <el-option label="转延保" value="7" />
            <el-option label="客户无反馈" value="8" />
            <el-option label="其他" value="9" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formDetails.reason === '9'" label="其他原因" prop="details">
          <el-input type="textarea" v-model="formDetails.details" placeholder="请输入其他原因" clearable />
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
import CDetails from './../../../components/CDetails.vue'
// import Details from './components/details.vue'
// 状态字典
const soStatus = useDict('soStatus')
const tableRef = ref()
const refresh = () => tableRef.value.refresh()
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
const orderType = ref([])
// 获取so类型
const changeOptions = val => {
  if (!val) {
    tableRef.value.form.orderType = ''
    tableRef.value.form.subType = ''
  } else {
    tableRef.value.form.orderType = val[0]
    tableRef.value.form.subType = val[1]
  }
}
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

// 关闭
const detailVisible = ref(false)
const formRefDetails = ref(null)
const formDetails = ref({
  soNo: '',
  reason: '',
  details: '',
})
const rules = {
  reason: [{ required: true, message: '原因不能为空', trigger: 'change' }],
  details: [{ required: true, message: '其他原因不能为空', trigger: 'blur' }],
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
      if (formDetails.value.reason !== '9') {
        delete formDetails.value.details
      }
      req.put('/so/close', formDetails.value).then(() => {
        detailVisible.value = false
      })
    }
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
    // setTimeout(() => {
    // }, 200)
  } else {
    engineerNameOptions.value = []
  }
}

// 导出
const handelFile = () => {
  req.post('/so/export', tableRef.value.form, { responseType: 'blob' }).then(response => {
    if (response) {
      const elink = document.createElement('a')
      elink.style.display = 'none'
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const blobUrl = URL.createObjectURL(blob)
      elink.href = blobUrl
      elink.download = 'so数据'
      document.body.appendChild(elink)
      elink.click()
      document.body.removeChild(elink)
    }
  })
}
</script>
