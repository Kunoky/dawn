<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="title"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="155" :rules="rules" v-loading="dataLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备序列号" prop="serialNo">
            <el-select
              v-model="form.serialNo"
              placeholder="请输入设备序列号"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethod"
              :loading="selectlLoading"
              @change="changeSeriaNo"
              style="width: 100%"
            >
              <el-option v-for="item in serialNoOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备型号" prop="modelNo" class="form_flex">
            <el-input v-model="form.modelNo" disabled placeholder="自动填入" style="width: 83%" />
            <el-button style="width: 11%" type="primary" @click="handleNum(row)">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器SAP Equip编号" prop="eqId">
            <el-input v-model="form.eqId" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器地址" prop="equipAddress">
            <el-input v-model="form.equipAddress" placeholder="请输入仪器地址" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户单位名称" prop="custDesc">
            <el-select
              v-model="form.custDesc"
              placeholder="请输入客户单位名称"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethodCustDesc"
              :loading="custDescLoading"
              @change="changeCustDesc"
              style="width: 100%"
            >
              <el-option v-for="item in custDescOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户锁信息" prop="blockFlag">
            <el-input disabled v-model="form.blockFlag" placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人" prop="name">
            <el-input v-model="form.name" placeholder="请输入客户联系人" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="客户联系人拼音" prop="lastName" class="form_flex">
            <el-input v-model="form.lastName" placeholder="请输入客户联系人拼音(姓)" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="firstName" class="item">
            <el-input v-model="form.firstName" placeholder="请输入客户联系人拼音(名)" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人电话" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入客户联系人电话" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入客户联系人邮箱" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保修期" prop="warrantyTime" class="date-box">
            <el-date-picker
              v-model="form.warrantyTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择保修期"
              style="width: 100%"
              clearabl
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维修类型" prop="dataOptions">
            <el-cascader
              v-model="form.dataOptions"
              :options="props.options"
              filterable
              clearable
              style="width: 100%"
              @change="changeOptions"
              :props="{
                label: 'name',
                value: 'name',
              }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代理商" prop="vendor">
            <el-input v-model="form.vendor" placeholder="请输入代理商" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="FSE工程师名称" prop="fseName">
            <el-select
              v-model="form.fseName"
              placeholder="请输入FSE工程师名称"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethodEngineerName"
              :loading="engineerNameLoading"
              @change="changeEngineerName"
              style="width: 100%"
            >
              <el-option
                v-for="item in engineerNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="FSE work center" prop="fseWorkCenter">
            <el-input v-model="form.fseWorkCenter" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="FSE storage location" prop="fseStorageLocation">
            <el-input v-model="form.fseStorageLocation" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报修来源" prop="source">
            <el-select v-model="form.source" placeholder="请输入报修来源" style="width: 100%" clearable>
              <el-option
                v-for="(item, index) in repairSource.options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联来源编号" prop="relationSourceNo">
            <el-input v-model="form.relationSourceNo" placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报修时间" prop="repairTime" class="date-box">
            <el-date-picker
              v-model="form.repairTime"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              type="datetime"
              placeholder="请选择报修时间"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否CRC" prop="isCrc">
            <el-switch
              v-model="form.isCrc"
              class="ml-2"
              style="--el-switch-on-color: #ff4949"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="PO号" prop="po">
            <el-input v-model="form.po" placeholder="请输入PO号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否Promotion" prop="isPromotion">
            <el-switch
              v-model="form.isPromotion"
              class="ml-2"
              style="--el-switch-on-color: #ff4949"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.isPromotion">
          <el-form-item label="promotionCode" prop="promotionCode">
            <el-input v-model="form.promotionCode" placeholder="请输入promotionCode" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="报修内容(填写英文)" prop="content">
            <el-input type="textarea" v-model="form.content" placeholder="请输入报修内容" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传附件" prop="attaIds">
            <CUpload
              style="width: 100%"
              :params="params"
              v-model="attachmentsList"
              accept="image/png,image/jpg,image/jpeg,application/pdf"
            ></CUpload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog title="未关闭SO数量" width="50%" v-model="visibleSo" :close-on-click-modal="false">
    <el-table
      size="small"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      max-height="190"
      :header-cell-style="{ background: '#f5f7fa' }"
    >
      <el-table-column prop="custName" label="客户名称" width="150" fixed="left" />
      <el-table-column prop="modelNo" label="状态">
        <template #default="{ row }">
          <span class="cs-p fw-b">{{ soStatus.kv[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修类型">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column prop="createTime" label="创建人时间" width="130" />
      <el-table-column prop="repairTime" label="报修时间" width="130" />
      <el-table-column prop="fseName" label="FSE工程师名称" width="120" />
      <el-table-column prop="fseWorkCenter" label="FSE work center" width="150" />
      <el-table-column prop="fseStorageLocation" label="FSE storage location" width="150" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseSo">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
  options: Array,
})

const title = computed(() => (props.data ? '修改维修申请' : '新增维修申请'))
const repairSource = useDict('repairSource') // 报修来源
const regionalStatus = useDict('regionalStatus') // 区域

const rules = {
  serialNo: [{ required: true, message: '设备序列号不能为空', trigger: 'blur' }],
  modelNo: [{ required: true, message: '设备型号不能为空', trigger: 'blur' }],
  dataOptions: [{ required: true, message: '维修类型不能为空', trigger: 'change' }],
  equipAddress: [{ required: true, message: '仪器地址不能为空', trigger: 'blur' }],
  custDesc: [{ required: true, message: '客户单位名称不能为空', trigger: 'change' }],
  name: [{ required: true, message: '客户联系人不能为空', trigger: 'blur' }],
  lastName: [{ required: true, message: '客户联系人拼音(姓)不能为空', trigger: 'blur' }],
  firstName: [{ required: true, message: '客户联系人拼音(名)不能为空', trigger: 'blur' }],
  mobile: [{ required: true, message: '客户联系人电话不能为空', trigger: 'blur' }],
  email: [{ required: true, message: '客户联系人邮箱不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '报修内容不能为空', trigger: 'blur' }],
  repairTime: [{ required: true, message: '报修时间不能为空', trigger: 'blur' }],
  fseName: [{ required: true, message: 'FSE工程师名称不能为空', trigger: 'blur' }],
}
const loading = ref(false)
const formRef = ref()
const form = ref({})
watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        id: undefined,
        serialNo: '',
        modelNo: '',
        eqId: '',
        dataOptions: '',
        equipAddress: '',
        custDesc: '',
        customerId: '',
        blockFlag: '',
        name: '',
        lastName: '',
        firstName: '',
        mobile: '',
        email: '',
        vendor: '',
        content: '',
        source: '',
        repairTime: '',
        warrantyTime: '',
        fseName: '',
        fseWorkCenter: '',
        fseStorageLocation: '',
        relationSourceNo: '',
        isCrc: false,
        po: '',
        area: '',
        orderType: '', // 维修类型
        subType: '', //维修子类型
        isConsistentSap: true,
        isPromotion: false,
        promotionCode: '',
        attaIds: '',
      }
      nextTick(() => {
        formRef.value.clearValidate()
      })
      props.data?.id && getRequestInfo()
    }
  },
  { immediate: true }
)

const { run: getRequestInfo, loading: dataLoading } = useAsync(
  async () => {
    return req.get(`/request/info/${props.data.id}`)
  },
  {
    onSuccess(res) {
      form.value = res.data
      form.value.dataOptions = [res.data.orderType, res.data.subType]
      attachmentsList.value = res.data.attachments

      // 暂存用做数据对比
      staging.value.aaa = res.data.custDesc
      staging.value.bbb = res.data.equipAddress
      nextTick(() => {
        formRef.value.clearValidate()
      })
    },
  }
)
// 暂存数据，为提交校验数据
const staging = ref({
  aaa: '',
  bbb: '',
})
// 查询设备序列号
const selectlLoading = ref(false)
const serialNoList = ref([])
const serialNoOptions = ref([])
function getEquipment(s) {
  return req.get('/data/equipment', { params: { serialNo: s } }).then(res => {
    serialNoList.value = res.data.map(item => {
      return { value: item, label: `${item.sernr}/${item.typbz}` }
    })
  })
}
const remoteMethod = query => {
  if (query) {
    selectlLoading.value = true
    getEquipment(query).then(() => {
      selectlLoading.value = false
      serialNoOptions.value = serialNoList.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    })
    // setTimeout(() => {
    //   console.log(111);
    // }, 2000)
  } else {
    serialNoOptions.value = []
  }
}
const changeSeriaNo = val => {
  form.value.serialNo = val.sernr
  form.value.modelNo = val.typbz
  form.value.eqId = val.matnr

  form.value.customerId = val.customer.customerId
  form.value.custDesc = val.customer.name === '' ? val.customer.enName : val.customer.name
  form.value.equipAddress = val.customer.address === '' ? val.customer.enAddress : val.customer.address
  form.value.area = val.customer.region
  form.value.blockFlag = val.customer.blockFlag !== null ? val.customer.blockFlag : '无'

  // 暂存用做数据对比
  staging.value.aaa = val.customer.name === '' ? val.customer.enName : val.customer.name
  staging.value.bbb = val.customer.address === '' ? val.customer.enAddress : val.customer.address
}

// 客户单位名称
const custDescLoading = ref(false)
const custDescList = ref([])
const custDescOptions = ref([])
async function getCustomer(v) {
  return req.get('/data/customer', { params: { name: v } }).then(res => {
    custDescList.value = res.data.map(item => {
      return { value: item, label: `${item.name === '' ? item.enName : item.name}` }
    })
  })
}
const remoteMethodCustDesc = query => {
  if (query) {
    custDescLoading.value = true
    getCustomer(query).then(() => {
      custDescLoading.value = false
      custDescOptions.value = custDescList.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    })
    // setTimeout(() => {
    // }, 200)
  } else {
    custDescOptions.value = []
  }
}
const changeCustDesc = val => {
  form.value.customerId = val.customerId
  form.value.custDesc = val.name === '' ? val.enName : val.name
  form.value.equipAddress = val.address === '' ? val.enAddress : val.address
  form.value.area = val.region
  form.value.blockFlag = val.blockFlag !== null ? val.blockFlag : '无'
}

// FSE工程师名称
const engineerNameLoading = ref(false)
const engineerNameList = ref([])
const engineerNameOptions = ref([])
async function getEngineerName(v) {
  return req.get('/user/fse', { params: { fseName: v } }).then(res => {
    engineerNameList.value = res.data.map(item => {
      return { value: item, label: `${item.fseWorkCenter} / ${item.fseName}` }
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
const changeEngineerName = val => {
  // form.value.engineerId = val.fseId
  form.value.fseName = val.fseName
  form.value.fseWorkCenter = val.fseWorkCenter
  form.value.fseStorageLocation = val.fseStorageLocation
}

const changeOptions = val => {
  if (!val) {
    form.value.orderType = ''
    form.value.subType = ''
  } else if (val.length === 1) {
    form.value.orderType = val[0]
    form.value.subType = ''
  } else {
    form.value.orderType = val[0]
    form.value.subType = val[1]
  }
}

// 查询未关闭SO数量
const soStatus = useDict('soStatus')

const visibleSo = ref(false)
const tableData = ref([])
const getNotCloseSo = () => {
  req.get('/so/notCloseSo', { params: { serialNo: form.value.serialNo, modelNo: form.value.modelNo } }).then(res => {
    tableData.value = res.data
  })
}
const handleNum = () => {
  getNotCloseSo()
  visibleSo.value = true
}
const handleCloseSo = () => {
  visibleSo.value = false
}
// 上传附件参数
const attachmentsList = ref([])
const params = {
  type: 5,
}
// 取消
const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      delete form.value.blockFlag
      delete form.value.fseStorageLocation
      delete form.value.dataOptions
      form.value.attaIds = attachmentsList.value.map(item => item.id)
      if (form.value.id) {
        if (staging.value.aaa !== form.value.custDesc || staging.value.bbb !== form.value.equipAddress) {
          form.value.isConsistentSap = false
        } else {
          form.value.isConsistentSap = true
        }
      }
      loading.value = true
      req[form.value.id ? 'put' : 'post']('/request', form.value)
        .then(({ code }) => {
          if (code === 200) {
            emit('success')
            emit('update:modelValue', false)
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}
</script>
<style scoped>
.date-box :deep(.el-input__wrapper) {
  width: 95%;
}

.form_flex :deep(.el-form-item__content) {
  display: flex;
  justify-content: space-between;
}

.item :deep(.el-form-item__content) {
  margin-left: 10px !important;
}
</style>
