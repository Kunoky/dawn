<template>
  <div>
    <CTable
      :page-conf="{
        action: '/request/toBeCreatedList',
      }"
      ref="tableRef"
      id="repairRequest"
    >
      <!-- <el-table-column label="维修任务号" prop="TaskID" width="120" /> -->
      <el-table-column label="仪器序列号" prop="serialNo" width="100" />
      <el-table-column label="型号" prop="modelNo" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="eqId" width="128" />
      <el-table-column label="维修类型" width="100">
        <template #default="{ row }">{{ row.orderType }} / {{ row.subType }}</template>
      </el-table-column>
      <el-table-column label="仪器地址" prop="equipAddress" width="130" />
      <el-table-column label="创建人" prop="createBy" width="100" />
      <el-table-column label="创建时间" prop="updateTime" width="100" />
      <!-- <el-table-column label="未关闭so数量" width="100">
        <template #default="{ row }">
          <span class="cs-p fw-b" style="color: #1890ff" @click="handleNum(row)">{{ row.ttt }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" prop="status" width="100">
        <template #default="{ row }">
          <span
            v-if="getStatus(row.status) === '创建失败'"
            class="cs-p fw-b"
            style="color: #e71316"
            @click="handleState(row)"
          >
            {{ getStatus(row.status) }}
          </span>
          <span class="cs-p fw-b" style="color: #909399">{{ getStatus(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户单位名称" prop="custDesc" width="120" />
      <el-table-column label="客户编号" prop="customerId" width="100" />
      <el-table-column label="客户联系人" width="100">
        <template #default="{ row }">
          <span>{{ row.contact?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户联系人电话" width="120">
        <template #default="{ row }">
          <span>{{ row.contact?.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户联系人邮箱" width="130">
        <template #default="{ row }">
          <span>{{ row.contact?.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理商" prop="vendor" width="100" />
      <el-table-column label="报修内容" prop="content" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="报修来源" prop="source" width="100" />
      <el-table-column label="报修时间" prop="repairTime" width="130" />
      <el-table-column label="保修期" prop="warrantyTime" width="130" />
      <el-table-column label="FSE工程师名称" prop="ppp" width="100" />
      <el-table-column label="FSE work center" prop="qqq" width="115" />
      <el-table-column label="FSE storage location" prop="rrr" width="140" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="80">
        <template #default="{ row }">
          <div v-if="getStatus(row.status) == '已退回'">
            <el-button type="info" link @click="handleEdit(row)">修改</el-button>
          </div>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd">
          <i-ep-plus />
          新增
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="仪器序列号" prop="serialNo">
          <el-select v-model="form.serialNo" placeholder="请输入仪器序列号" style="width: 100%" clearable>
            <el-option label="A" value="shanghai" />
            <el-option label="B" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="维修类型" prop="orderType">
          <el-cascader v-model="form.orderType" :options="options" filterable clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="创建中" value="创建中" />
            <el-option label="创建失败" value="创建失败" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户联系人" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户联系人" clearable />
        </el-form-item>
        <el-form-item label="客户联系人电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入客户联系人电话" clearable />
        </el-form-item>
        <el-form-item label="报修来源" prop="source">
          <el-select v-model="form.source" placeholder="请选择报修来源" clearable>
            <el-option label="FSE" value="fse" />
            <el-option label="其他" value="qt" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="客户单位名称" prop="fff">
          <el-input v-model="form.fff" placeholder="请输入客户单位名称" clearable />
        </el-form-item> -->
        <el-form-item label="工程师名称">
          <el-input v-model="form.ppp" placeholder="请输入FSE工程师名称">
            <template #append>
              <el-button><i-ep-Search /></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="报修时间">
          <el-date-picker
            v-model="form.params"
            placeholder="请选择时间"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>

    <el-dialog title="关闭" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form :model="formDetails" ref="formRefDetails" label-width="80" :rules="rules">
        <el-form-item label="SO NO" prop="soNo">
          <el-input v-model="formDetails.soNo" placeholder="请输入SO" clearable />
        </el-form-item>
        <el-form-item label="关闭原因" prop="reason">
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

    <!--<el-dialog title="未关闭SO数量" width="50%" v-model="visibleSo" :close-on-click-modal="false">
       <el-table
        size="small"
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        max-height="190"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column prop="aaa" label="客户名称" />
        <el-table-column prop="bbb" label="状态" />
        <el-table-column prop="ccc" label="维修类型" />
        <el-table-column prop="ddd" label="创建人" />
        <el-table-column prop="eee" label="创建人时间" width="130" />
        <el-table-column prop="fff" label="报修时间" width="130" />
        <el-table-column prop="ggg" label="FSE工程师名称" width="120" />
        <el-table-column prop="hhh" label="FSE work center" width="150" />
        <el-table-column prop="iii" label="FSE storage location" width="150" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseSo">{{ $t('common.cancel') }}</el-button>
        </span>
      </template>
    </el-dialog> -->

    <el-dialog title="失败原因" width="30%" v-model="visibleState" :close-on-click-modal="false">
      <el-descriptions class="margin-top" :column="1" border size="small">
        <el-descriptions-item>
          <template #label>失败原因</template>
          {{ record.state }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseState">{{ $t('common.cancel') }}</el-button>
          <!-- <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button> -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormDialog from './components/FormDialog.vue'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
// const i18n = useI18n()
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
const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
})

// const status = useDict('status')

const handleAdd = () => {
  current.value = null
  visible.form = true
}

const handleEdit = row => {
  current.value = row
  visible.form = true
}

// const handleDel = () => {
//   ElMessageBox.confirm('确定RPA创建SO后无法修改，是否继续？', i18n.t('common.warning'), {
//     confirmButtonText: i18n.t('common.confirm'),
//     cancelButtonText: i18n.t('common.cancel'),
//     type: 'warning',
//   }).then(() => {
//     // current.value = {
//     //   ...row,
//     //   deleting: true,
//     // }
//     // return req.delete('system/user/' + row.userId)
//   })
//   // .then(({ code }) => {
//   // if (code === 200) {
//   //   ElMessage.success(i18n.t('tip.success'))
//   //   refresh()
//   // }
//   // })
// }
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
// const handleBack = row => {
//   formBack.value.id = row.id
//   backVisible.value = true
// }

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
      req.put('/request/rollback', formBack.value).then(({ code }) => {
        if (code === 200) {
          ElMessage.success('退回成功')
        }
        backVisible.value = false
      })
    }
  })
}

// 关闭
const formRefDetails = ref(null)
const detailVisible = ref(false)
const formDetails = ref({
  soNo: '',
  reason: '',
  id: '',
})
const rules = {
  reason: [{ required: true, message: '关闭原因不能为空', trigger: 'blur' }],
}
// const handleClose = row => {
//   formDetails.value.id = row.id
//   detailVisible.value = true
// }
const handleCloseDetail = () => {
  detailVisible.value = false
  formDetails.value.soNo = ''
  formDetails.value.reason = ''
  nextTick(() => {
    formRefDetails.value.clearValidate()
  })
}
const handleConfirm = () => {
  formRefDetails.value.validate(valid => {
    if (valid) {
      req.put('/request/close', formDetails.value).then(({ code }) => {
        if (code === 200) {
          ElMessage.success('关闭成功')
        }
        backVisible.value = false
      })
    }
  })
}

// so数量
// const visibleSo = ref(false)
// const tableData = [
//   {
//     aaa: 'xxxxx',
//     bbb: '待创建',
//     ccc: 'SM02',
//     ddd: '李四',
//     eee: '2023-08-22 10:20:23',
//     fff: '2023-08-25 15:24:23',
//     ggg: '一号工程师',
//     hhh: '详情',
//     iii: 'xxxxxx',
//   },
//   {
//     aaa: 'xxxxx',
//     bbb: '待维修',
//     ccc: 'SM02',
//     ddd: '李四',
//     eee: '2023-08-22 10:20:23',
//     fff: '2023-08-25 15:24:23',
//     ggg: '一号工程师',
//     hhh: '详情',
//     iii: 'xxxxxx',
//   },
// ]
// const handleNum = () => {
//   visibleSo.value = true
// }
// const handleCloseSo = () => {
//   visibleSo.value = false
// }

// 状态字典
const dddddd = [
  { label: '保存草稿', value: 0 },
  { label: '已提交', value: 1 },
  { label: '已退回', value: 2 },
  { label: '创建中', value: 3 },
  { label: '创建成功', value: 5 },
  { label: '创建失败', value: 6 },
  { label: '已关闭', value: 7 },
]
const getStatus = val => {
  let name = dddddd.find(o => o.value === val).label
  return name
}

// 状态失败原因
const visibleState = ref(false)
const record = ref({
  state: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
})

const handleState = row => {
  record.value.state = row.backReason
  visibleState.value = true
}
const handleCloseState = () => {
  visibleState.value = false
}
</script>
