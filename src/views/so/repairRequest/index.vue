<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
      }"
      ref="tableRef"
      id="repairRequest"
      row-key="repairRequestId"
    >
      <el-table-column label="设备序列号" prop="serialNo" width="130" />
      <el-table-column label="设备型号" prop="modelNo" width="130" />
      <el-table-column label="仪器SAP Equip编号" prop="eqId" width="128" />
      <el-table-column label="维修类型" width="100">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column label="仪器地址" prop="equipAddress" width="130" />
      <el-table-column label="创建人" prop="createByName" width="100" />
      <el-table-column label="创建时间" prop="updateTime" width="100" />
      <el-table-column label="未关闭so数量" width="100">
        <template #default="{ row }">
          <span class="cs-p fw-b" style="color: #1890ff" @click="handleNum(row)">{{ row.soNum + row.mrNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="100">
        <template #default="{ row }">
          <el-popover
            v-if="row.status === 4"
            placement="top-start"
            title="创建失败"
            :width="200"
            trigger="hover"
            :content="row.backReason"
          >
            <template #reference>
              <span class="cs-p fw-b" style="color: #e71316">{{ request_status.kv[row.status] }}</span>
            </template>
          </el-popover>
          <span v-else class="cs-p fw-b" style="color: #909399">{{ request_status.kv[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" prop="custDesc" width="160" />
      <el-table-column label="客户编号" prop="customerId" width="100" />
      <el-table-column label="客户联系人" prop="name" width="100" />
      <el-table-column label="客户联系人电话" prop="mobile" width="120" />
      <el-table-column label="客户联系人邮箱" prop="email" width="130" />
      <el-table-column label="代理商" prop="vendor" width="100" />
      <el-table-column label="报修内容" prop="content" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="报修来源" prop="source" width="120">
        <template #default="{ row }">
          {{ repairSource.kv[row.source] }}
        </template>
      </el-table-column>
      <el-table-column label="报修时间" prop="repairTime" width="130" />
      <el-table-column label="保修期" prop="warrantyTime" width="130" />
      <el-table-column label="工程师名称" prop="fseName" width="100" />
      <el-table-column label="FSE work center" prop="fseWorkCenter" width="115" />
      <el-table-column label="FSE storage location" prop="fseStorageLocation" width="140" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="180">
        <template #default="{ row }">
          <div v-if="row.status !== 3">
            <div>
              <el-button type="info" link @click="handleEdit(row)">完善信息</el-button>
              <el-button type="danger" link @click="handleRPA(row)">RPA创建SO</el-button>
            </div>
            <div>
              <el-button type="danger" link @click="handleBack(row)">退回</el-button>
              <el-button type="danger" link @click="handleClose(row)">手工处理</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <template #form="{ form }">
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
        <el-form-item label="客户名称" prop="custDesc">
          <el-input v-model="form.custDesc" placeholder="请输入客户名称" clearable />
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
        <el-form-item label="报修时间" prop="timeScope">
          <el-date-picker
            v-model="form.timeScope"
            value-format="YYYY-MM-DD"
            placeholder="请选择时间"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
          <!-- @change="getDatePicker" -->
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
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess" :options="options"></FormDialog>

    <el-dialog title="手工处理" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form :model="formDetails" ref="formRefDetails" label-width="80" :rules="rules">
        <el-form-item label="处理方式" prop="status">
          <el-select
            v-model="formDetails.status"
            style="width: 100%"
            @change="handelA"
            placeholder="请选择处理方式"
            clearable
          >
            <el-option label="创建成功" value="1" />
            <el-option label="重复SO" value="2" />
            <el-option label="关闭SO" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formDetails.status === '1' || formDetails.status === '2'" label="SO NO" prop="soNo">
          <el-input v-model="formDetails.soNo" placeholder="请输入SO" clearable />
        </el-form-item>
        <el-form-item v-if="formDetails.status === '3'" label="关闭原因" prop="reason">
          <el-input type="textarea" v-model="formDetails.reason" placeholder="请输入关闭原因" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDetail">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>

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

    <el-dialog title="未关闭SO数量" width="50%" v-model="visibleSo" :close-on-click-modal="false">
      <el-table
        v-loading="loading"
        size="small"
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        max-height="190"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column prop="soNo" label="so No" width="100" fixed="left" />
        <el-table-column prop="custName" label="客户名称" width="150" />
        <el-table-column prop="modelNo" label="状态">
          <template #default="{ row }">
            <span class="cs-p fw-b">{{ soStatus.kv[row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="维修类型">
          <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
        </el-table-column>
        <el-table-column prop="createByName" label="创建人" />
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormDialog from './components/FormDialog.vue'
const regionalStatus = useDict('regionalStatus') // 区域
const repairSource = useDict('repairSource') // 报修来源

const tableRef = ref()
const refresh = () => tableRef.value.refresh()

const listData = params => {
  // delete params.params
  delete params.options
  return req.get('/request/toBeCreatedList', { params }).then(res => {
    return { data: res.data }
  })
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

// 获取时间
// const getDatePicker = val => {
//   console.log(val);
//   tableRef.value.form.timeScope = val+''
// //   // if (!val) {
// //   //   tableRef.value.form.beginDate = ''
// //   //   tableRef.value.form.endDate = ''
// //   // } else {
// //   //   tableRef.value.form.beginDate = val[0]
// //   //   tableRef.value.form.endDate = val[1]
// //   // }
// }

const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
})

const handleEdit = row => {
  current.value = row
  visible.form = true
}

const handleRPA = row => {
  ElMessageBox.confirm('确定RPA创建SO后无法修改，是否继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      return req.put(`/request/rpa/${row.id}`)
    })
    .then(({ code }) => {
      if (code === 200) {
        refresh()
      }
    })
}
const handleFormSuccess = () => {
  refresh()
}

// 退回
const backVisible = ref(false)
const formRefBack = ref(null)
const formBack = ref({
  reason: '',
  id: '',
})
const backRules = {
  reason: [{ required: true, message: '退回原因不能为空', trigger: 'blur' }],
}
const handleBack = row => {
  formBack.value.id = row.id
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
      req.put('/request/rollback', formBack.value).then(() => {
        backVisible.value = false
        refresh()
      })
    }
  })
}

// 手工处理
const formRefDetails = ref(null)
const detailVisible = ref(false)
const handleClose = row => {
  formDetails.value.id = row.id
  detailVisible.value = true
}
const formDetails = ref({
  status: '',
  soNo: '',
  reason: '',
  id: '',
})
const rules = {
  status: [{ required: true, message: '处理方式不能为空', trigger: 'blur' }],
  soNo: [{ required: true, message: 'SO NO不能为空', trigger: 'blur' }],
  reason: [{ required: true, message: '关闭原因不能为空', trigger: 'blur' }],
}
const handelA = () => {
  formDetails.value.soNo = ''
  formDetails.value.reason = ''
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
      req.put('/request/close', formDetails.value).then(() => {
        detailVisible.value = false
        refresh()
      })
    }
  })
}

// 状态字典
const request_status = useDict('request_status')

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

// 查询未关闭SO数量
const soStatus = useDict('soStatus')
const visibleSo = ref(false)
const loading = ref(false)
const tableData = ref([])
const getNotCloseSo = (requestId, eqId) => {
  loading.value = true
  req
    .get('/so/notCloseSo', { params: { requestId: requestId, eqId: eqId } })
    .then(res => {
      tableData.value = res.data
      loading.value = false
    })
    .finally(() => (loading.value = false))
}
const handleNum = row => {
  getNotCloseSo(row.id, row.eqId)
  visibleSo.value = true
}
const handleCloseSo = () => {
  visibleSo.value = false
}
</script>
