<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="完善信息"
    width="80%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <p v-if="!form.isConsistentSap" style="font-size: 12px; color: #e71316; margin: 0 50px 10px">与SAP信息不一致</p>
    <el-form :model="form" ref="formRef" label-width="120" :rules="rules" v-loading="dataLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备序列号" prop="serialNo" class="form_flex">
            <el-select
              v-model="form.serialNo"
              placeholder="请输入设备序列号"
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="selectlLoading"
              @change="changeSeriaNo"
              style="width: 86%"
            >
              <el-option v-for="item in serialNoOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button style="width: 12%" type="primary" @click="hanelCopy(form.serialNo)">复制</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备型号" prop="modelNo" class="form_flex">
            <el-input v-model="form.modelNo" disabled placeholder="自动填入" style="width: 86%" />
            <el-button style="width: 12%" type="primary" @click="handleNum">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器编号" prop="eqId">
            <el-input v-model="form.eqId" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器地址" prop="equipAddress">
            <el-input v-model="form.equipAddress" placeholder="请输入仪器地址" clearable />
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
          <el-form-item label="保修期" prop="warrantyTime" class="date-box">
            <el-date-picker
              v-model="form.warrantyTime"
              type="date"
              value-format="YYYY-MM-DD"
              disabled
              placeholder="自动填入"
              style="width: 100%"
              clearabl
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Ship to客户" prop="custDesc" class="form_flex">
            <el-input v-model="form.customerId" disabled placeholder="自动填入" style="width: 30%" />
            <el-select
              v-model="form.custDesc"
              placeholder="请输入Ship to客户"
              filterable
              remote
              @keyup.ctrl.c="hanelCopy(form.custDesc)"
              :remote-method="remoteMethodCustDesc"
              :loading="custDescLoading"
              @change="changeCustDesc"
              style="width: 68%"
              :title="getTitle(form.custDesc)"
            >
              <el-option
                v-for="item in custDescOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :title="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户锁" prop="blockFlag">
            <el-input disabled v-model="form.blockFlag" placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="payer客户" prop="payerName" class="form_flex">
            <el-input v-model="form.payer" disabled placeholder="自动填入" style="width: 30%" />
            <el-select
              v-model="form.payerName"
              placeholder="请输入payer客户"
              filterable
              remote
              @keyup.ctrl.c="hanelCopy(form.payerName)"
              :remote-method="remoteMethodCustDesc1"
              :loading="custDescLoading1"
              @change="changeCustDesc1"
              style="width: 68%"
              :title="getTitle(form.payerName)"
            >
              <el-option
                v-for="item in custDescOptions1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :title="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="payer客户锁" prop="payerBlockFlag">
            <el-input disabled v-model="form.payerBlockFlag" placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="name">
            <el-input v-model="form.name" placeholder="请输入联系人" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="联系人拼音" prop="lastName" class="form_flex">
            <el-input v-model="form.lastName" placeholder="拼音(姓)" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="firstName" class="item">
            <el-input v-model="form.firstName" placeholder="拼音(名)" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人电话" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入联系人电话" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入联系人邮箱" clearable />
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
          <el-form-item label="工程师名称" prop="fseName">
            <el-select
              v-model="form.fseName"
              placeholder="请输入FSE工程师名称"
              filterable
              remote
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
          <el-form-item label="work center" prop="fseWorkCenter">
            <el-input v-model="form.fseWorkCenter" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="storage location" prop="fseStorageLocation">
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
            <el-input v-model="form.relationSourceNo" placeholder="请输入关联来源编号" clearable />
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
          <el-form-item label="CRC" prop="isCrc">
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
          <el-form-item label="Promotion" prop="isPromotion">
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
          <el-form-item label="报修内容" prop="content">
            <el-input type="textarea" v-model="form.content" placeholder="请输入报修内容(填写英文)" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传附件" prop="attaIds" class="CUpload">
            <CUpload style="width: 60%" :params="params" v-model="attachmentsList" ref="upload"></CUpload>
            <!-- accept="image/png,image/jpg,image/jpeg,application/pdf" -->
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
      style="width: 100%"
      max-height="240px"
      :header-cell-style="{ background: '#f5f7fa' }"
    >
      <el-table-column prop="soNo" label="SO NO" width="100" fixed="left" />
      <el-table-column label="维修内容" prop="content" width="120" :show-overflow-tooltip="true" />
      <el-table-column prop="custName" label="客户名称" width="150" />
      <el-table-column prop="modelNo" label="状态">
        <template #default="{ row }">
          <span class="cs-p fw-b">{{ soStatus.kv[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修类型">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column prop="createByName" label="申请人" width="130" />
      <el-table-column prop="createTime" label="创建时间" width="130" />
      <el-table-column prop="repairTime" label="报修时间" width="130" />
      <el-table-column prop="fseName" label="工程师名称" width="120" />
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

const repairSource = useDict('repairSource') // 报修来源
const regionalStatus = useDict('regionalStatus') // 区域
const checkContent = (rule, value, callback) => {
  if (value) {
    if (!utils.regexp.en.test(value)) {
      callback(new Error('只能输入英文与英文符号!'))
    } else {
      callback()
    }
  }
  callback()
}
const rules = {
  serialNo: [{ required: true, message: '设备序列号不能为空', trigger: 'blur' }],
  modelNo: [{ required: true, message: '设备型号不能为空', trigger: 'blur' }],
  dataOptions: [{ required: true, message: '维修类型不能为空', trigger: 'change' }],
  equipAddress: [{ required: true, message: '仪器地址不能为空', trigger: 'blur' }],
  custDesc: [{ required: true, message: 'Ship to客户名称不能为空', trigger: 'blur' }],
  payerName: [{ required: true, message: 'payer客户名称不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '客户联系人不能为空', trigger: 'blur' }],
  lastName: [
    { required: true, message: '客户联系人拼音(姓)不能为空', trigger: 'blur' },
    { pattern: /^[A-Za-z]*$/, message: '请输入拼音', trigger: 'blur' },
  ],
  firstName: [
    { required: true, message: '客户联系人拼音(名)不能为空', trigger: 'blur' },
    { pattern: /^[A-Za-z]*$/, message: '请输入拼音', trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: '客户联系人电话不能为空', trigger: 'blur' },
    {
      pattern: /^((0\d{2,3}(-)?\d{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/,
      message: '请输入正确的电话格式',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '客户联系人邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur'] },
  ],
  content: [
    { required: true, message: '报修内容不能为空', trigger: 'blur' },
    { validator: checkContent, trigger: 'blur' },
  ],
  repairTime: [{ required: true, message: '报修时间不能为空', trigger: 'blur' }],
  fseName: [{ required: true, message: 'FSE工程师名称不能为空', trigger: 'blur' }],
}
const loading = ref(false)
const formRef = ref()
const form = ref({})
// 上传附件参数
const attachmentsList = ref([])
const params = ref({
  type: 5,
  relationId: '',
})

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
        payerName: '',
        payer: '',
        blockFlag: '',
        payerBlockFlag: '',
        name: '',
        lastName: '',
        firstName: '',
        mobile: '',
        email: '',
        vendor: '',
        content: '',
        remark: '',
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
        isConsistentSap: false,
        isPromotion: false,
        promotionCode: '',
        // attaIds: ''
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
      attachmentsList.value = res.data.attachments.map(val => {
        val.url = import.meta.env.VITE_SERVER_PATH + val.path
        val.name = val.fileName
        // val.uid = idx
        // val.status = 'success'
        return val
      })
      params.value.relationId = props.data.id
      // 暂存用做数据对比
      // staging.value.aaa = res.data.custDesc
      // staging.value.bbb = res.data.equipAddress
      nextTick(() => {
        formRef.value.clearValidate()
      })
    },
  }
)

// 暂存数据，为提交校验数据
// const staging = ref({
//   aaa: '',
//   bbb: '',
// })
// 查询设备序列号
const selectlLoading = ref(false)
const serialNoList = ref([])
const serialNoOptions = ref([])
function getEquipment(s) {
  return req.get('/data/equipment', { params: { serialNo: s } }).then(res => {
    serialNoList.value = res.data.map(item => {
      return { value: item, label: `${item.sernr}_${item.typbz}` }
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
  } else {
    serialNoOptions.value = []
  }
}
const changeSeriaNo = val => {
  form.value.serialNo = val.sernr
  form.value.modelNo = val.typbz
  form.value.eqId = val.equnr
  form.value.warrantyTime = val.validTo

  form.value.customerId = val.customer.customerId
  form.value.custDesc = val.customer.name === '' ? val.customer.enName : val.customer.name
  form.value.equipAddress = val.customer.address === '' ? val.customer.enAddress : val.customer.address
  form.value.area = val.customer.region
  form.value.blockFlag = val.customer.blockFlag !== null ? val.customer.blockFlag : '无'

  form.value.payer = val.payer.customerId
  form.value.payerName = val.payer.name === '' ? val.payer.enName : val.payer.name
  form.value.payerBlockFlag = val.payer.blockFlag !== null ? val.payer.blockFlag : '无'

  // 暂存用做数据对比
  // staging.value.aaa = val.customer.name === '' ? val.customer.enName : val.customer.name
  // staging.value.bbb = val.customer.address === '' ? val.customer.enAddress : val.customer.address
}

// 客户名称
const custDescLoading = ref(false)
const custDescList = ref([])
const custDescOptions = ref([])
async function getCustomer(v) {
  return req.get('/data/customer', { params: { name: v, type: 'WE' } }).then(res => {
    custDescList.value = res.data.map(item => {
      return { value: item, label: `${item.customerId}_${item.name === '' ? item.enName : item.name}` }
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

//下拉框鼠标移上显示提示文字
const getTitle = val => {
  if (val !== '') {
    return val
  }
}

// paye客户名称
const custDescLoading1 = ref(false)
const custDescList1 = ref([])
const custDescOptions1 = ref([])
async function getCustomer1(v) {
  return req.get('/data/customer', { params: { name: v, type: 'RG' } }).then(res => {
    custDescList1.value = res.data.map(item => {
      return { value: item, label: `${item.customerId}_${item.name === '' ? item.enName : item.name}` }
    })
  })
}
const remoteMethodCustDesc1 = query => {
  if (query) {
    custDescLoading1.value = true
    getCustomer1(query).then(() => {
      custDescLoading1.value = false
      custDescOptions1.value = custDescList1.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    })
  } else {
    custDescOptions1.value = []
  }
}
const changeCustDesc1 = val => {
  form.value.payer = val.customerId
  form.value.payerName = val.customerId + val.name === '' ? val.enName : val.name
  form.value.payerBlockFlag = val.blockFlag !== null ? val.blockFlag : '无'
}

// 工程师名称
const engineerNameLoading = ref(false)
const engineerNameList = ref([])
const engineerNameOptions = ref([])
async function getEngineerName(v) {
  return req.get('/user/fse', { params: { fseName: v } }).then(res => {
    engineerNameList.value = res.data.map(item => {
      return { value: item, label: `${item.fseWorkCenter}_${item.fseName}` }
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
const changeEngineerName = val => {
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
const getNotCloseSo = (requestId, eqId) => {
  req.get('/so/notCloseSo', { params: { requestId: requestId, eqId: eqId } }).then(res => {
    tableData.value = res.data
  })
}
const handleNum = () => {
  getNotCloseSo(props.data.id, props.data.eqId)
  visibleSo.value = true
}
const handleCloseSo = () => {
  visibleSo.value = false
}

const upload = ref()
// 取消
const handleClose = () => {
  emit('update:modelValue', false)
  if (attachmentsList.value.length > 0) {
    upload.value.say()
  }
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      // delete form.value.blockFlag
      // delete form.value.fseStorageLocation
      // delete form.value.dataOptions
      // form.value.attaIds = attachmentsList.value.map(item => item.id)
      // console.log(form.value)
      loading.value = true
      req[form.value.id ? 'put' : 'post']('/request', form.value)
        .then(({ code }) => {
          if (code === 200) {
            emit('success')
            emit('update:modelValue', false)
            if (attachmentsList.value.length > 0) {
              upload.value.say()
            }
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

// 复制客户名称
function hanelCopy(val) {
  utils.copy(val)
}

// 浏览
// const handleDownloadFile = row => {
//   if (row) {
//     window.open(import.meta.env.VITE_SERVER_PATH + row, '_blank')
//   }
// }
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

.files {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.files .ep_files {
  font-size: 40px;
}

.files span {
  color: #e71316;
  cursor: pointer;
  text-decoration: underline;
}
.CUpload :deep(.el-upload-dragger) {
  height: 100px;
  padding-top: 10px;
}
.CUpload :deep(.el-upload-dragger) .el-icon.el-icon--upload {
  font-size: 30px;
}
.CUpload :deep(.el-upload-dragger) .el-upload__text {
  font-size: 12px;
}
</style>
