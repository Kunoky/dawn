<template>
  <div>
    <CTable
      :page-conf="{
        action: 'so/getSoList',
      }"
      ref="tableRef"
      id="systemRole"
    >
      <el-table-column label="SO NO" prop="so" width="120" />
      <el-table-column label="维修任务号" prop="TaskID" width="120" />
      <el-table-column label="仪器序列号" prop="aaa" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="型号" prop="bbb" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="ccc" width="128" />
      <el-table-column label="维修类型" prop="ddd" width="100" />
      <el-table-column label="仪器地址" prop="eee" width="100" />
      <el-table-column label="客户单位名称" prop="fff" width="100" />
      <el-table-column label="客户编号" prop="ggg" width="100" />
      <el-table-column label="客户联系人" prop="hhh" width="100" />
      <el-table-column label="客户联系人电话" prop="iii" width="120" />
      <el-table-column label="客户联系人邮箱" prop="jjj" width="130" />
      <el-table-column label="代理商" prop="kkk" width="100" />
      <el-table-column label="报修内容" prop="lll" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="报修来源" prop="mmm" width="100" />
      <el-table-column label="报修时间" prop="nnn" width="100" />
      <el-table-column label="保修期" prop="ooo" width="100" />
      <el-table-column label="FSE工程师名称" prop="ppp" width="100" />
      <el-table-column label="FSE work center" prop="qqq" width="115" />
      <el-table-column label="FSE storage location" prop="rrr" width="140" />
      <el-table-column label="SO状态" prop="ttt" width="140">
        <template #default="{ row }">
          {{ row.ttt === '3' ? '待报价' : '' }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="审批结果" prop="uuu" width="140" /> -->
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="220">
        <template #default="{ row }">
          <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
          <el-button type="info" link @click="handleQuotation(row)">报价</el-button>
          <el-button type="primary" link @click="handleExamine(row)">发起流程</el-button>
          <el-button type="danger" link @click="handleAddRecord(row)">添加沟通记录</el-button>
          <el-button type="danger" link @click="handleClose(row)">退回</el-button>
        </template>
      </el-table-column>
      <!-- <template #actions>
          <el-button type="primary" plain>
            <i-ep-bottom />
            导出
          </el-button>
        </template> -->
      <template #form="{ form }">
        <el-form-item label="SO NO" prop="so">
          <el-input v-model="form.so" placeholder="请输入SO NO" clearable />
        </el-form-item>
        <el-form-item label="仪器序列号" prop="TaskID">
          <el-input v-model="form.TaskID" placeholder="请输入仪器序列号" clearable />
        </el-form-item>
        <el-form-item label="维修类型" prop="ddd">
          <el-cascader v-model="form.ddd" :options="options" filterable clearable />
        </el-form-item>
        <el-form-item label="客户联系人" prop="hhh">
          <el-input v-model="form.hhh" placeholder="请输入客户联系人" clearable />
        </el-form-item>
        <el-form-item label="客户联系人电话" prop="iii">
          <el-input v-model="form.iii" placeholder="请输入客户联系人电话" clearable />
        </el-form-item>
        <el-form-item label="报修来源" prop="mmm">
          <el-select v-model="form.mmm" placeholder="请输入报修来源" clearable>
            <el-option label="FSE" value="fse" />
            <el-option label="其他" value="qt" />
          </el-select>
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
        <el-form-item label="工程师名称">
          <el-input v-model="form.ppp" placeholder="请输入FSE工程师名称">
            <template #append>
              <el-button><i-ep-Search /></el-button>
            </template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="审批结果" prop="mmm">
            <el-select v-model="form.mmm" placeholder="请选择审批结果" clearable>
              <el-option label="A" value="shanghai" />
              <el-option label="B" value="beijing" />
            </el-select>
          </el-form-item> -->
      </template>
    </CTable>
    <Details :data="current" v-model="visible.detail" @success="handleFormSuccess"></Details>

    <Quotation :data="currentQuotation" v-model="quotation.visible" @success="handleQuotationSuccess"></Quotation>

    <el-dialog title="退回" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form :model="formDetails" ref="formRefDetails" label-width="80" :rules="rules">
        <el-form-item label="退回原因" prop="details">
          <el-input type="textarea" v-model="formDetails.details" placeholder="请输入退回原因" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDetail">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="添加沟通记录" width="30%" v-model="addRecordVisible" :close-on-click-modal="false">
      <el-form :model="addForm" ref="addRefForm" label-width="80" :rules="AddRules">
        <el-form-item label="沟通人" prop="aaa">
          <el-input v-model="addForm.aaa" placeholder="请输入沟通人" clearable />
        </el-form-item>
        <el-form-item label="时间" prop="bbb" class="form_picker">
          <el-date-picker v-model="addForm.bbb" type="datetime" placeholder="请选择时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结果" prop="ccc">
          <el-input type="textarea" v-model="addForm.ccc" placeholder="请输入结果" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseAddRecord">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleConfirmAddRecord">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Details from './components/details.vue'
import Quotation from './components/quotation.vue'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()
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
  detail: false,
})

const handleDeatil = row => {
  current.value = row
  visible.detail = true
}
const handleExamine = () => {
  ElMessageBox.confirm(i18n.t('tip.determine'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  }).then(() => {
    // current.value = {
    //   ...row,
    //   deleting: true,
    // }
    // return req.delete('system/user/' + row.userId)
  })
  // .then(({ code }) => {
  // if (code === 200) {
  //   ElMessage.success(i18n.t('tip.success'))
  //   refresh()
  // }
  // })
}
const handleFormSuccess = () => {
  refresh()
}

const detailVisible = ref(false)
const formRefDetails = ref(null)
const formDetails = ref({
  details: '',
})
const rules = {
  details: [{ required: true, message: '退回原因不能为空', trigger: 'blur' }],
}
const handleClose = () => {
  detailVisible.value = true
}
const handleCloseDetail = () => {
  detailVisible.value = false
  nextTick(() => {
    formRefDetails.value.clearValidate()
  })
}
const handleConfirm = () => {
  formRefDetails.value.validate(valid => {
    if (valid) {
      // form.value.value = form.value.category
      // loading.value = true
      // req[form.value.dictId ? 'put' : 'post']('/dict', form.value)
      //   .then(({ code }) => {
      //     if (code === 200) {
      //       emit('success')
      //       emit('update:modelValue', false)
      //     }
      //   })
      //   .finally(() => {
      //     loading.value = false
      //   })
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

const addRecordVisible = ref(false)
const addRefForm = ref(null)
const addForm = ref({
  aaa: '',
  bbb: '',
  ccc: '',
})
const AddRules = {
  aaa: [{ required: true, message: '沟通人不能为空', trigger: 'blur' }],
  bbb: [{ required: true, message: '时间不能为空', trigger: 'blur' }],
  ccc: [{ required: true, message: '结果不能为空', trigger: 'blur' }],
}
const handleAddRecord = () => {
  addRecordVisible.value = true
}
const handleCloseAddRecord = () => {
  addRecordVisible.value = false
  nextTick(() => {
    addRefForm.value.clearValidate()
  })
}
const handleConfirmAddRecord = () => {
  addRefForm.value.validate(valid => {
    if (valid) {
      // form.value.value = form.value.category
      // loading.value = true
      // req[form.value.dictId ? 'put' : 'post']('/dict', form.value)
      //   .then(({ code }) => {
      //     if (code === 200) {
      //       emit('success')
      //       emit('update:modelValue', false)
      //     }
      //   })
      //   .finally(() => {
      //     loading.value = false
      //   })
    }
  })
}
</script>
<style scoped>
.form_picker :deep(.el-input__wrapper) {
  width: 95%;
}
</style>
