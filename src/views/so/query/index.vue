<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
      }"
      ref="tableRef"
      id="query"
    >
      <el-table-column label="SO NO" prop="soNo" width="130" />
      <el-table-column label="维修任务编号" prop="soTaskNo" width="100" />
      <el-table-column label="设备序列号" prop="serialNo" width="140" />
      <el-table-column label="设备型号" prop="modelNo" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="eqId" width="128" />
      <el-table-column label="维修类型" width="100">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column label="仪器地址" prop="equipAddress" width="130" />
      <el-table-column label="创建时间" prop="createTime" width="130" />
      <el-table-column label="状态" prop="status" width="150" style="color: #909399">
        <template #default="{ row }">
          <!-- TODO SO状态 -->
          <span v-if="row.status === 4">
            {{ soStatus.kv[row.status] }}
            <a v-if="row.quoteConfirmPending">/ {{ pendingStatus.kv[row.quoteConfirmPending] }}</a>
          </span>
          <span v-else-if="row.status === 8">
            {{ soStatus.kv[row.status] }}
            <a v-if="row.invoicePending">/ {{ invoiceStatus.kv[row.invoicePending] }}</a>
          </span>
          <span v-else class="cs-p">{{ soStatus.kv[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户编号" prop="customerId" width="100" />
      <el-table-column label="客户名称" prop="custDesc" width="160" />
      <el-table-column label="payer客户编号" prop="payer" width="100" />
      <el-table-column label="payer客户名称" prop="payerName" width="160" />
      <el-table-column label="客户联系人" prop="name" width="100">
        <template #default="{ row }">
          {{ row.name === null || row.name === '' ? row.lastName + row.firstName : row.name }}
        </template>
      </el-table-column>
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
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="120">
        <template #default="{ row }">
          <div>
            <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
            <el-button type="primary" link @click="handleOperateSO(row)">
              {{ row.relationSo ? '解绑SO' : '关联SO' }}
            </el-button>
          </div>
          <el-button v-if="row.status !== 0 && row.status !== 12" type="primary" link @click="handleClose(row)">
            关闭
          </el-button>
          <div>
            <el-button
              v-if="row.billingNo !== null && row.billingNo !== ''"
              type="primary"
              link
              @click="handleBilling(row)"
            >
              修改Billing号
            </el-button>
          </div>
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
          <el-select v-model="form.isCrc" placeholder="请选择CRC" clearable>
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域" prop="area">
          <el-select v-model="form.area" placeholder="请选择所属区域" style="width: 100%" multiple clearable>
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
            :props="{
              label: 'name',
              value: 'name',
              checkStrictly: true,
            }"
          />
        </el-form-item>
        <el-form-item label="SO状态" prop="soStatus">
          <el-select v-model="form.soStatus" placeholder="请选择SO状态" clearable multiple>
            <el-option v-for="(item, index) in soStatus.options" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <CDetails :data="current" v-model="visible.detail" @success="handleFormSuccess"></CDetails>

    <el-dialog
      title="关闭"
      width="30%"
      v-model="detailVisible"
      :close-on-click-modal="false"
      @close="handleCloseDetail"
    >
      <el-form :model="formDetails" ref="formRefDetails" label-width="80" :rules="rules">
        <el-form-item label="原因" prop="closeStatus">
          <el-select v-model="formDetails.closeStatus" placeholder="请选择原因" clearable style="width: 100%">
            <el-option
              v-for="(item, index) in closedState.options"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formDetails.closeStatus === '9'" label="其他原因" prop="reason">
          <el-input type="textarea" v-model="formDetails.reason" placeholder="请输入其他原因" clearable />
        </el-form-item>
        <el-form-item label="上传附件" prop="attaIds">
          <CUpload
            style="width: 100%"
            :params="params"
            v-model="attachmentsList"
            accept="image/png,image/jpg,image/jpeg,application/pdf"
            ref="upload"
          ></CUpload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDetail">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :title="title"
      width="30%"
      v-model="visibleSO"
      :close-on-click-modal="false"
      @close="handleCloseDetailSO"
    >
      <el-form :model="formDetailsSO" ref="formRefSO" label-width="80" :rules="rulesSO">
        <el-form-item label="关联so号" prop="relationSo">
          <el-input
            :disabled="title === '解绑SO'"
            v-model="formDetailsSO.relationSo"
            placeholder="请输入关联so"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDetailSO">取消</el-button>
          <el-button type="primary" @click="handleConfirmSO">
            确定{{ title === '关联SO' ? '关联SO' : '解绑SO' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      title="修改Billing号"
      width="30%"
      v-model="detailVisibleb"
      :close-on-click-modal="false"
      @close="handleCloseDetailb"
    >
      <el-form :model="formDetailsb" ref="formRefDetailsb" label-width="80" :rules="rulesb">
        <el-form-item label="Billing号" prop="billingNo">
          <el-input v-model="formDetailsb.billingNo" placeholder="请输入Billing号" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDetailb">取消</el-button>
          <el-button type="primary" @click="handleConfirmb">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 状态字典
const soStatus = useDict('soStatus')
const closedState = useDict('closedState')
const repairSource = useDict('repairSource')
const regionalStatus = useDict('regionalStatus') // 区域
const pendingStatus = useDict('pendingStatus')
const invoiceStatus = useDict('invoiceStatus')

const tableRef = ref()

const listData = params => {
  return req
    .get('/so/page', {
      params: {
        ...params,
        orderType: params.options?.[0],
        subType: params.options?.[1],
        options: null,
      },
    })
    .then(res => {
      return { data: res.data }
    })
}

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
// 获取so类型
// const changeOptions = val => {
//   if (!val) {
//     tableRef.value.form.orderType = ''
//     tableRef.value.form.subType = ''
//   } else {
//     tableRef.value.form.orderType = val[0]
//     tableRef.value.form.subType = val[1]
//   }
// }
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
// 上传附件参数
const attachmentsList = ref([])
const params = ref({
  type: 9, // 异常关闭
  relationId: '',
})
const formDetails = ref({
  soNo: '',
  closeStatus: '',
  reason: '',
})
const rules = {
  closeStatus: [{ required: true, message: '原因不能为空', trigger: 'change' }],
  reason: [{ required: true, message: '其他原因不能为空', trigger: 'blur' }],
}
const handleClose = row => {
  formDetails.value.soNo = row.soNo
  params.value.relationId = row.soNo
  detailVisible.value = true
}
const upload = ref()
const handleCloseDetail = () => {
  detailVisible.value = false
  nextTick(() => {
    formRefDetails.value.resetFields()
    upload.value.say()
  })
}
const handleConfirm = () => {
  formRefDetails.value.validate(valid => {
    if (valid) {
      if (formDetails.value.closeStatus !== '9') {
        delete formDetails.value.reason
      }
      req.put('/so/close', formDetails.value).then(() => {
        detailVisible.value = false
        refresh()
        nextTick(() => {
          formRefDetails.value.resetFields()
          upload.value.say()
        })
      })
    }
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

// 操作so关联与解除
const title = ref('')
const visibleSO = ref(false)
const formRefSO = ref(null)
const formDetailsSO = ref({
  soNo: '',
  relationSo: '',
})
const rulesSO = {
  relationSo: [{ required: true, message: '关联so不能为空', trigger: 'blur' }],
}
const handleOperateSO = row => {
  if (row.relationSo) {
    title.value = '解绑SO'
  } else {
    title.value = '关联SO'
  }
  formDetailsSO.value.soNo = row.soNo
  formDetailsSO.value.relationSo = row.relationSo
  visibleSO.value = true
}
const handleCloseDetailSO = () => {
  visibleSO.value = false
  nextTick(() => {
    formRefSO.value.resetFields()
  })
}
const handleConfirmSO = () => {
  formRefSO.value.validate(valid => {
    if (valid) {
      if (title.value === '关联SO') {
        req.put('/so/relation', formDetailsSO.value).then(({ code }) => {
          if (code === 200) {
            refresh()
            visibleSO.value = false
            nextTick(() => {
              formRefSO.value.resetFields()
            })
          }
        })
      } else {
        req.put(`/so/unRelation/${formDetailsSO.value.soNo}`).then(({ code }) => {
          if (code === 200) {
            refresh()
            visibleSO.value = false
            nextTick(() => {
              formRefSO.value.resetFields()
            })
          }
        })
      }
    }
  })
}

// 修改billing
const detailVisibleb = ref(false)
const formRefDetailsb = ref(null)
const formDetailsb = ref({
  soNo: '',
  billingNo: '',
})
const rulesb = {
  billingNo: [{ required: true, message: 'Billing号不能为空', trigger: 'blur' }],
}
const handleBilling = row => {
  formDetailsb.value.soNo = row.soNo
  formDetailsb.value.billingNo = row.billingNo
  detailVisibleb.value = true
}
const handleCloseDetailb = () => {
  detailVisibleb.value = false
  nextTick(() => {
    formRefDetailsb.value.resetFields()
  })
}
const handleConfirmb = () => {
  formRefDetailsb.value.validate(valid => {
    if (valid) {
      req.put('/so/updateBillingNo', formDetailsb.value).then(({ code }) => {
        if (code === 200) {
          detailVisibleb.value = false
          refresh()
          nextTick(() => {
            formRefDetailsb.value.resetFields()
          })
        }
      })
    }
  })
}
</script>
