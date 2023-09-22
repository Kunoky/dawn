<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="title"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="155" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="仪器序列号" prop="serialNo">
            <el-select
              v-model="form.serialNo"
              placeholder="请输入仪器序列号"
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
            <!-- <el-select v-model="form.serialNo" placeholder="请输入仪器序列号" style="width: 100%" clearable>
              <el-option label="A" value="shanghai" />
              <el-option label="B" value="beijing" />
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="modelNo" class="form_flex">
            <el-input v-model="form.modelNo" disabled placeholder="自动填入" style="width: 83%" />

            <!-- <el-select v-model="form.modelNo" placeholder="请选择型号" class="mgr-m" style="width: 83%" clearable>
              <el-option label="A" value="shanghai" />
              <el-option label="B" value="beijing" />
            </el-select> -->
            <el-button style="width: 11%" type="primary" @click="handleNum(row)">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器SAP Equip编号" prop="eqId">
            <el-input v-model="form.eqId" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保修期" prop="warrantyTime" class="date-box">
            <el-date-picker
              v-model="form.warrantyTime"
              type="date"
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
              :options="options"
              filterable
              clearable
              style="width: 100%"
              @change="changeOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器地址" prop="equipAddress">
            <el-input v-model="form.equipAddress" placeholder="请输入仪器地址" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户单位名称" prop="contact.customerId">
            <el-select
              v-model="form2.custDesc"
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
            <el-input disabled v-model="form2.blockFlag" placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="客户编号" prop="ggg">
            <el-input disabled v-model="form.ggg" placeholder="请输入客户编号" clearable />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="客户联系人" prop="contact.name">
            <el-input v-model="form.contact.name" placeholder="请输入客户联系人" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户联系人拼音" prop="contact.lastName" class="form_flex">
            <el-input v-model="form.contact.lastName" placeholder="请输入客户联系人拼音(姓)" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="contact.firstName" class="item">
            <el-input v-model="form.contact.firstName" placeholder="请输入客户联系人拼音(名)" clearable />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="客户联系人拼音(名)" prop="zzz">
            <el-input v-model="form.zzz" placeholder="请输入客户联系人拼音(名)" clearable />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="客户联系人电话" prop="contact.mobile">
            <el-input v-model="form.contact.mobile" placeholder="请输入客户联系人电话" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人邮箱" prop="contact.email">
            <el-input v-model="form.contact.email" placeholder="请输入客户联系人邮箱" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代理商" prop="vendor">
            <el-input v-model="form.vendor" placeholder="请输入代理商" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="FSE工程师名称" prop="engineerId">
            <el-input v-model="form.engineerId" placeholder="请输入FSE工程师名称">
              <template #append>
                <el-button @click="searchFSE"><i-ep-Search /></el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="FSE work center" prop="center">
            <el-input v-model="form2.center" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="FSE storage location" prop="location">
            <el-input v-model="form2.location" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报修来源" prop="source">
            <el-select v-model="form.source" placeholder="请输入报修来源" style="width: 100%" clearable>
              <el-option label="FSE" value="fse" />
              <el-option label="其他" value="qt" />
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
              type="datetime"
              placeholder="请选择报修时间"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属区域" prop="area">
            <el-input v-model="form.area" placeholder="请输入所属区域" clearable />
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
        <el-col :span="24">
          <el-form-item label="报修内容" prop="content">
            <el-input type="textarea" v-model="form.content" placeholder="请输入报修内容" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传附件" prop="attaIds">
            <!-- <el-upload
              style="width: 100%"
              class="upload-demo"
              drag
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              multiple
            >
              <i-ep-UploadFilled class="fs-1" />
              <div class="el-upload__text">
                将文件拖到此处
                <em>或点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">只能上传PDF, 单个文件 ≤10MB</div>
              </template>
            </el-upload> -->
            <CUpload
              style="width: 100%"
              :params="params"
              v-model="list"
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
      <el-table-column prop="serialNo" label="客户名称" />
      <el-table-column prop="modelNo" label="状态" />
      <el-table-column prop="eqId" label="维修类型" />
      <el-table-column prop="ddd" label="创建人" />
      <el-table-column prop="equipAddress" label="创建人时间" width="130" />
      <el-table-column prop="custDesc" label="报修时间" width="130" />
      <el-table-column prop="ggg" label="FSE工程师名称" width="120" />
      <el-table-column prop="hhh" label="FSE work center" width="150" />
      <el-table-column prop="mobile" label="FSE storage location" width="150" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseSo">取消</el-button>
        <!-- <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button> -->
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})

const title = computed(() => (props.data ? '完善信息' : '新建维修申请'))

const rules = {
  serialNo: [{ required: true, message: '仪器序列号不能为空', trigger: 'blur' }],
  modelNo: [{ required: true, message: '型号不能为空', trigger: 'blur' }],
  // eqId: [{ required: true, message: '仪器SAP Equip编号不能为空', trigger: 'blur' }],
  dataOptions: [{ required: true, message: '维修类型不能为空', trigger: 'change' }],
  equipAddress: [{ required: true, message: '仪器地址不能为空', trigger: 'blur' }],
  'contact.customerId': [{ required: true, message: '客户单位名称不能为空', trigger: 'change' }],
  // ggg: [{ required: true, message: '客户编号不能为空', trigger: 'blur' }],
  'contact.name': [{ required: true, message: '客户联系人不能为空', trigger: 'blur' }],
  'contact.lastName': [{ required: true, message: '客户联系人拼音(姓)不能为空', trigger: 'blur' }],
  'contact.firstName': [{ required: true, message: '客户联系人拼音(名)不能为空', trigger: 'blur' }],
  'contact.mobile': [{ required: true, message: '客户联系人电话不能为空', trigger: 'blur' }],
  'contact.email': [{ required: true, message: '客户联系人邮箱不能为空', trigger: 'blur' }],
  // vendor: [{ required: true, message: '代理商不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '报修内容不能为空', trigger: 'blur' }],
  // source: [{ required: true, message: '报修来源不能为空', trigger: 'blur' }],
  repairTime: [{ required: true, message: '报修时间不能为空', trigger: 'blur' }],
  // warrantyTime: [{ required: true, message: '保修期不能为空', trigger: 'blur' }],
  engineerId: [{ required: true, message: 'FSE工程师名称不能为空', trigger: 'blur' }],
  // center: [{ required: true, message: 'FSE work cente不能为空', trigger: 'blur' }],
  // location: [{ required: true, message: 'FSE storage location不能为空', trigger: 'blur' }],
  area: [{ required: true, message: '所属区域不能为空', trigger: 'blur' }],
}
const options = [
  {
    value: 'SM01',
    label: 'SM01',
  },
  {
    value: 'SM02',
    label: 'SM02',
  },
  {
    value: 'SM03',
    label: 'SM03',
    children: [
      {
        value: 'xxx',
        label: '111',
      },
      {
        value: 'xxx',
        label: '222',
      },
      {
        value: 'xxx',
        label: '333',
      },
      {
        value: 'xxx',
        label: '444',
      },
    ],
  },
  {
    value: 'SM04',
    label: 'SM04',
    children: [
      {
        value: 'xxx',
        label: '111',
      },
      {
        value: 'xxx',
        label: '222',
      },
    ],
  },
  {
    value: 'SM05',
    label: 'SM05',
    children: [
      {
        value: 'xxx',
        label: '111',
      },
      {
        value: 'xxx',
        label: '222',
      },
      {
        value: 'xxx',
        label: '333',
      },
    ],
  },
]
const loading = ref(false)
const formRef = ref()
const form = ref({})
const form2 = ref({
  custDesc: '',
  location: '',
  center: '',
  blockFlag: '',
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
        contact: {
          customerId: '',
          name: '',
          lastName: '',
          firstName: '',
          mobile: '',
          email: '',
        },
        vendor: '',
        content: '',
        source: '',
        repairTime: '',
        warrantyTime: '',
        engineerId: '',
        relationSourceNo: '',
        isCrc: false,
        area: '',
        orderType: '', // 维修类型
        subType: '', //维修子类型
        isConsistentSap: true,
      }
      if (props.data) {
        for (let k in form.value) {
          form.value[k] = props.data[k]
        }
      }
      nextTick(() => {
        formRef.value.clearValidate()
      })
    }
  },
  { immediate: true }
)
// 暂存数据，为提交校验数据
const staging = ref({
  aaa: '',
  bbb: '',
})
// 查询仪器序列号
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
  staging.value.aaa = val.customer.companyName1
  staging.value.bbb = val.customer.companyName1
  form2.value.custDesc = val.customer.companyName1
  form.value.contact.customerId = val.customer.kunnr
  form.value.contact.name = val.customer.name3
  form2.value.blockFlag = val.customer.blockFlag !== null ? val.customer.blockFlag : '无'
  form.value.contact.lastName = val.customer.lastName
  form.value.contact.firstName = val.customer.namev
  form.value.contact.mobile = val.customer.tel
  form.value.contact.email = val.customer.smtpAddr
}

// 客户单位名称
const custDescLoading = ref(false)
const custDescList = ref([])
const custDescOptions = ref([])
async function getCustomer(v) {
  return req.get('/data/customer', { params: { name: v } }).then(res => {
    custDescList.value = res.data.map(item => {
      return { value: item, label: `${item.companyName1}` }
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
  form.value.serialNo = val.sernr
  form2.value.blockFlag = val.blockFlag !== null ? val.blockFlag : '无'
  form.value.contact.name = val.name3
  form.value.contact.customerId = val.kunnr
  form.value.contact.lastName = val.lastName
  form.value.contact.firstName = val.namev
  form.value.contact.mobile = val.tel
  form.value.contact.email = val.smtpAddr
}

// 取消
const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      // if (staging.value.aaa !== form2.value.custDesc) {
      //   form.value.isConsistentSap = false
      // } else {
      //   form.value.isConsistentSap = true
      // }
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

// 查询
const visibleSo = ref(false)
const tableData = [
  {
    serialNo: 'xxxxx',
    modelNo: '待创建',
    eqId: 'SM02',
    ddd: '李四',
    equipAddress: '2023-08-22 10:20:23',
    custDesc: '2023-08-25 15:24:23',
    ggg: '一号工程师',
    hhh: '详情',
    mobile: 'xxxxxx',
  },
  {
    serialNo: 'xxxxx',
    modelNo: '待维修',
    eqId: 'SM02',
    ddd: '李四',
    equipAddress: '2023-08-22 10:20:23',
    custDesc: '2023-08-25 15:24:23',
    ggg: '一号工程师',
    hhh: '详情',
    mobile: 'xxxxxx',
  },
]
const handleNum = () => {
  visibleSo.value = true
}
const handleCloseSo = () => {
  visibleSo.value = false
}
// 上传附件参数
const list = ref([])
const params = {
  type: 1,
}

const searchFSE = () => {}
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
