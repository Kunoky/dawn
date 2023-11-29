<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
      }"
      ref="tableRef"
      id="billing"
    >
      <el-table-column label="SO NO" prop="soNo" width="130" />
      <el-table-column label="设备序列号" prop="serialNo" width="140" />
      <el-table-column label="设备型号" prop="modelNo" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="eqId" width="128" />
      <el-table-column label="维修类型" width="100">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column label="仪器地址" prop="equipAddress" width="100" />
      <el-table-column label="客户编号" prop="customerId" width="100" />
      <el-table-column label="客户名称" prop="custDesc" width="160" />
      <el-table-column label="payer客户编号" prop="payer" width="100" />
      <el-table-column label="payer客户名称" prop="payerName" width="160" />
      <el-table-column label="客户联系人" prop="name" width="100" />
      <el-table-column label="客户联系人电话" prop="mobile" width="120" />
      <el-table-column label="客户联系人邮箱" prop="email" width="130" />
      <el-table-column label="代理商" prop="vendor" width="100" />
      <el-table-column label="报修内容" prop="content" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="报修来源" prop="source" width="120">
        <template #default="{ row }">
          {{ repairSource.kv[row.source] }}
        </template>
      </el-table-column>
      <el-table-column label="报修时间" prop="repairTime" width="130" />
      <el-table-column label="保修期" prop="warrantyTime" width="100" />
      <el-table-column label="工程师名称" prop="fseName" width="100" />
      <el-table-column label="FSE work center" prop="fseWorkCenter" width="115" />
      <el-table-column label="FSE storage location" prop="fseStorageLocation" width="140" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="110">
        <template #default="{ row }">
          <div>
            <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
            <el-button type="primary" link @click="handleBilling(row)">Billing</el-button>
          </div>
          <el-button type="primary" link @click="handleBack(row)">退回</el-button>
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
        <el-form-item label="CRC" prop="isCrc">
          <el-select v-model="form.isCrc" placeholder="请选择CRC" clearable>
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域" prop="area">
          <el-select v-model="form.area" placeholder="请选择所属区域" style="width: 100%" clearable>
            <el-option
              v-for="(item, index) in regionalStatus.options"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入客户名称" clearable />
        </el-form-item>
        <el-form-item label="客户锁信息" prop="blockFlag">
          <el-input v-model="form.blockFlag" placeholder="请输入客户锁信息" clearable />
        </el-form-item>
        <el-form-item label="工程师名称" prop="fseWorkCenter">
          <el-select
            clearable
            v-model="form.fseWorkCenter"
            placeholder="请输入FSE工程师名称"
            filterable
            remote
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
              value: 'name',
              checkStrictly: true,
            }"
          />
        </el-form-item>
        <el-form-item label="开票申请提交时间段">
          <el-date-picker
            value-format="YYYY-MM-DD"
            v-model="form.timeScope"
            placeholder="请选择时间"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
      </template>
    </CTable>
    <CDetails :data="current" v-model="visible.formDialog" @success="handleFormSuccess"></CDetails>

    <el-dialog title="添加Billing号" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form :model="formDetails" ref="formRefDetails" label-width="80" :rules="rules">
        <el-form-item label="Billing号" prop="billingNo">
          <el-input v-model="formDetails.billingNo" placeholder="请输入Billing号" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDetail">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="退回" width="30%" v-model="backVisible" :close-on-click-modal="false">
      <el-form :model="formBack" ref="formRefBack" label-width="120" :rules="backRules">
        <el-form-item label="Billing退回原因" prop="reason">
          <el-select
            v-model="formBack.reason"
            placeholder="请选择Billing退回原因"
            clearable
            style="width: 100%"
            @change="handleReason"
          >
            <el-option
              v-for="(item, index) in billingReason.options"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formBack.reason === '其他'" label="其他原因" prop="remark">
          <el-input type="textarea" v-model="formBack.remark" placeholder="请输入其他原因" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseBack">取消</el-button>
          <el-button type="primary" @click="handleBackConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const regionalStatus = useDict('regionalStatus') // 区域
const repairSource = useDict('repairSource')
const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const listData = params => {
  delete params.options
  params.soStatus = 9 // TODO: SO状态 待billing
  return req.get('/so/page', { params }).then(res => {
    return { data: res.data }
  })
}

// 工程师名称
const engineerNameLoading = ref(false)
const engineerNameList = ref([])
const engineerNameOptions = ref([])
async function getEngineerName(v) {
  return req.get('/user/fse', { params: { fseName: v } }).then(res => {
    engineerNameList.value = res.data.map(item => {
      return { value: item.fseWorkCenter, label: `${item.fseWorkCenter}_${item.fseName}` }
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

const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
  formDialog: false,
})

const handleDeatil = row => {
  current.value = row
  visible.formDialog = true
}
const handleFormSuccess = () => {
  refresh()
}

// 添加Billing号
const detailVisible = ref(false)
const formRefDetails = ref(null)
const formDetails = ref({
  soNo: '',
  billingNo: '',
})
const rules = {
  billingNo: [{ required: true, message: 'Billing号不能为空', trigger: 'blur' }],
}
const handleBilling = row => {
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
      req.put('/so/billing', formDetails.value).then(({ code }) => {
        if (code === 200) {
          detailVisible.value = false
          refresh()
          nextTick(() => {
            formRefDetails.value.resetFields()
          })
        }
      })
    }
  })
}

// 退回
const billingReason = useDict('billingReason')
const backVisible = ref(false)
const formRefBack = ref(null)
const formBack = ref({
  reason: '',
  remark: '',
  soNo: '',
})
const backRules = {
  reason: [{ required: true, message: 'Billing退回原因不能为空', trigger: 'change' }],
  remark: [{ required: true, message: '其他原因不能为空', trigger: 'blur' }],
}
const handleBack = row => {
  formBack.value.soNo = row.soNo
  backVisible.value = true
}
function handleReason(val) {
  if (val !== '其他') {
    formBack.value.remark = ''
  }
}
const handleCloseBack = () => {
  backVisible.value = false
  nextTick(() => {
    formRefBack.value.resetFields()
  })
}
const handleBackConfirm = () => {
  formRefBack.value.validate(valid => {
    if (valid) {
      req.put('/so/billingBack', formBack.value).then(() => {
        backVisible.value = false
        refresh()
      })
    }
  })
}
</script>
