<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
      }"
      ref="tableRef"
      id="quotation"
    >
      <el-table-column label="SO NO" prop="soNo" width="130" />
      <el-table-column label="设备序列号" prop="serialNo" width="140" />
      <el-table-column label="设备型号" prop="modelNo" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="eqId" width="128" />
      <el-table-column label="维修类型" width="100">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column label="仪器地址" prop="equipAddress" width="100" />
      <el-table-column label="状态" prop="status" width="100">
        <template #default="{ row }">
          <span class="cs-p fw-b" style="color: #909399">{{ soStatus.kv[row.status] }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="150">
        <template #default="{ row }">
          <div>
            <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
            <el-button type="info" link @click="handleQuotation(row)">报价</el-button>
            <el-button type="danger" link @click="handleBack(row)">退回</el-button>
          </div>
          <!-- <div> -->
          <!-- <el-button type="primary" link @click="handleExamine(row)">已报价</el-button> -->
          <!-- </div> -->
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
          <el-select v-model="form.isCrc" placeholder="请选择CRC" style="width: 100%" clearable>
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
        <el-form-item label="报价货号" prop="materialNo">
          <el-input v-model="form.materialNo" clearable placeholder="请输入报价货号" />
        </el-form-item>
        <el-form-item label="维修描述" prop="repairDescription">
          <el-input v-model="form.repairDescription" clearable placeholder="请输入维修描述" />
        </el-form-item>
      </template>
    </CTable>
    <CDetails :data="current" v-model="visible.detail" @success="handleFormSuccess"></CDetails>

    <Quotation :data="currentQuotation" v-model="quotation.visible" @success="handleQuotationSuccess"></Quotation>

    <el-dialog title="退回" width="30%" v-model="backVisible" :close-on-click-modal="false">
      <el-form :model="formBack" ref="formRefBack" label-width="80" :rules="backRules">
        <el-form-item label="退回原因" prop="reason">
          <el-input type="textarea" v-model="formBack.reason" placeholder="请输入退回原因" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseBack">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleBackConfirm">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Quotation from './components/quotation.vue'

// 状态字典
const repairSource = useDict('repairSource')
const soStatus = useDict('soStatus')
const regionalStatus = useDict('regionalStatus')

const listData = params => {
  delete params.options
  params.soStatus = 3 // TODO: SO状态 待报价
  return req.get('/so/page', { params }).then(res => {
    return { data: res.data }
  })
}

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
// const i18n = useI18n()
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
  detail: false,
})

const handleDeatil = row => {
  current.value = row
  visible.detail = true
}
// const handleExamine = row => {
//   ElMessageBox.confirm('确定后无法修改，是否继续？', i18n.t('common.warning'), {
//     confirmButtonText: i18n.t('common.confirm'),
//     cancelButtonText: i18n.t('common.cancel'),
//     type: 'warning',
//   })
//     .then(() => {
//       return req.put(`/quote/quoteConfirm/${row.soNo}`)
//     })
//     .then(({ code }) => {
//       if (code === 200) {
//         refresh()
//       }
//     })
// }
const handleFormSuccess = () => {
  refresh()
}

// 退回
const backVisible = ref(false)
const formRefBack = ref(null)
const formBack = ref({
  reason: '',
  soNo: '',
})
const backRules = {
  reason: [{ required: true, message: '退回原因不能为空', trigger: 'blur' }],
}
const handleBack = row => {
  formBack.value.soNo = row.soNo
  backVisible.value = true
}

const handleCloseBack = () => {
  backVisible.value = false
  formBack.value.reason = ''
  nextTick(() => {
    formRefBack.value.clearValidate()
  })
}
const handleBackConfirm = () => {
  formRefBack.value.validate(valid => {
    if (valid) {
      req.put('/so/rollback', formBack.value).then(() => {
        backVisible.value = false
        refresh()
      })
    }
  })
}

const currentQuotation = ref(null)
const quotation = reactive({
  permission: false,
  visible: false,
})

const handleQuotation = row => {
  currentQuotation.value = row
  quotation.visible = true
}
const handleQuotationSuccess = () => {
  refresh()
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
</script>
<style scoped>
.form_picker :deep(.el-input__wrapper) {
  width: 95%;
}
</style>
