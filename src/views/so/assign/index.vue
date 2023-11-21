<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
      }"
      ref="tableRef"
      id="assign"
    >
      <el-table-column label="SO NO" prop="soNo" width="130" />
      <el-table-column label="设备序列号" prop="serialNo" width="140" />
      <el-table-column label="设备型号" prop="modelNo" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="eqId" width="128" />
      <el-table-column label="维修类型" width="100">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column label="仪器地址" prop="equipAddress" width="100" />
      <el-table-column label="创建人" prop="createByName" width="100" />
      <el-table-column label="客户名称" prop="custDesc" width="160" />
      <el-table-column label="客户编号" prop="customerId" width="100" />
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
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="130">
        <template #default="{ row }">
          <el-button type="info" link @click="handleEdit(row)">详情</el-button>
          <el-button type="danger" link @click="handleAssign(row)">指派FSE</el-button>
        </template>
      </el-table-column>
      <template #actions></template>
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
        <el-form-item label="工程师名称" prop="fseWorkCenter">
          <el-select
            clearable
            v-model="form.fseWorkCenter"
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
              value: 'name',
              checkStrictly: true,
            }"
          />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>

    <el-dialog title="指派FSE" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form :model="formDetails" ref="formRefDetails" label-width="150" :rules="rules">
        <el-form-item label="工程师名称" prop="fseName">
          <el-select
            v-model="formDetails.fseName"
            placeholder="请输入FSE工程师名称"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodEngineerName1"
            :loading="engineerNameLoading1"
            @change="changeEngineerName"
            style="width: 100%"
          >
            <el-option v-for="item in engineerNameOptions1" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="FSE work center" prop="fseWorkCenter">
          <el-input v-model="formDetails.fseWorkCenter" disabled placeholder="自动填入" clearable />
        </el-form-item>
        <el-form-item label="FSE storage location" prop="fseStorageLocation">
          <el-input v-model="formDetails.fseStorageLocation" disabled placeholder="自动填入" clearable />
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
import FormDialog from './components/FormDialog.vue'
const regionalStatus = useDict('regionalStatus') // 区域
const repairSource = useDict('repairSource')

const tableRef = ref()
const refresh = () => tableRef.value.refresh()

const listData = params => {
  delete params.options
  params.assignStatus = true // TODO: 待指派
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
      return { value: item.fseWorkCenter, label: `${item.fseWorkCenter} / ${item.fseName}` }
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
})

const handleEdit = row => {
  current.value = row
  visible.form = true
}

const handleFormSuccess = () => {
  refresh()
}

// 指派FSE
const detailVisible = ref(false)
const formRefDetails = ref(null)
const formDetails = ref({})
const rules = {
  fseName: [{ required: true, message: 'FSE工程师名称不能为空', trigger: 'blur' }],
}
const handleAssign = row => {
  formDetails.value.soNo = row.soNo
  detailVisible.value = true
}

// 指派FSE工程师名称
const engineerNameLoading1 = ref(false)
const engineerNameList1 = ref([])
const engineerNameOptions1 = ref([])
async function getEngineerName1(v) {
  return req.get('/user/fse', { params: { fseName: v } }).then(res => {
    engineerNameList1.value = res.data.map(item => {
      return { value: item, label: `${item.fseWorkCenter} / ${item.fseName}` }
    })
  })
}
const remoteMethodEngineerName1 = query => {
  if (query) {
    engineerNameLoading1.value = true
    getEngineerName1(query).then(() => {
      engineerNameLoading1.value = false
      engineerNameOptions1.value = engineerNameList1.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    })
  } else {
    engineerNameOptions1.value = []
  }
}
const changeEngineerName = val => {
  formDetails.value.fseName = val.fseName
  formDetails.value.fseWorkCenter = val.fseWorkCenter
  formDetails.value.fseStorageLocation = val.fseStorageLocation
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
      req.put('/so/assign', formDetails.value).then(() => {
        detailVisible.value = false
        refresh()
      })
    }
  })
}
</script>
