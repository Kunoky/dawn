<template>
  <div>
    <CTable
      :page-conf="{
        action: 'so/getSoList',
      }"
      ref="tableRef"
      id="quotation"
    >
      <el-table-column label="SO NO" prop="so" width="120" />
      <el-table-column label="维修任务号" prop="TaskID" width="120" />
      <el-table-column label="设备序列号" prop="aaa" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="设备型号" prop="bbb" :show-overflow-tooltip="true" width="100" />
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
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="180">
        <template #default="{ row }">
          <div>
            <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
            <el-button type="info" link @click="handleUploadFile(row)">上传附件</el-button>
          </div>
          <div>
            <el-button type="danger" link @click="handleAddRecord(row)">添加沟通记录</el-button>
            <el-button type="primary" link @click="handleExamine(row)">发起流程</el-button>
          </div>
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
        <el-form-item label="设备序列号" prop="serialNo">
          <el-select v-model="form.serialNo" placeholder="请输入设备序列号" style="width: 100%" clearable>
            <el-option label="A" value="shanghai" />
            <el-option label="B" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="modelNo">
          <el-input v-model="form.modelNo" placeholder="请输入设备型号" clearable />
        </el-form-item>
        <el-form-item label="CRC" prop="modelNo">
          <el-select v-model="form.serialNo" placeholder="请选择CRC" style="width: 100%" clearable>
            <el-option label="是" value="shanghai" />
            <el-option label="否" value="beijing" />
          </el-select>
          <!-- <el-input v-model="form.modelNo" placeholder="请输入CRC" clearable /> -->
        </el-form-item>
        <el-form-item label="区域" prop="modelNo">
          <el-input v-model="form.modelNo" placeholder="请输入区域" clearable />
        </el-form-item>
        <el-form-item label="客户名称" prop="custDesc">
          <el-input v-model="form.custDesc" placeholder="请输入客户名称" clearable />
        </el-form-item>
        <el-form-item label="工程师名称">
          <el-input v-model="form.ppp" placeholder="请输入FSE工程师名称">
            <template #append>
              <el-button><i-ep-Search /></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="SO类型" prop="orderType">
          <el-cascader
            v-model="orderType"
            :options="options"
            filterable
            clearable
            @change="changeOptions"
            :props="{
              label: 'name',
              value: 'id',
              checkStrictly: true,
            }"
          />
        </el-form-item>
        <el-form-item label="报价货号" prop="orderType">
          <el-input v-model="orderType" />
        </el-form-item>
        <el-form-item label="维修描述" prop="orderType">
          <el-input v-model="orderType" />
        </el-form-item>
        <el-form-item label="未更新时长" prop="serialNo">
          <el-select v-model="form.serialNo" placeholder="请选择未更新时长" style="width: 100%" clearable>
            <el-option label="3天" value="shanghai" />
            <el-option label="5天" value="beijing" />
            <el-option label="超过7天" value="beijing" />
            <el-option label="超过15天" value="beijing" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <Details :data="current" v-model="visible.detail" @success="handleFormSuccess"></Details>

    <el-dialog title="上传附件" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form ref="formRefDetails" label-width="80" class="item">
        <el-form-item prop="attaIds">
          <CUpload
            style="width: 100%"
            :params="params"
            v-model="list"
            accept="image/png,image/jpg,image/jpeg,application/pdf"
          ></CUpload>
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
      <el-form :model="addForm" ref="addRefForm" label-width="130" :rules="AddRules">
        <el-form-item label="沟通人" prop="aaa">
          <el-input v-model="addForm.aaa" placeholder="请输入沟通人" clearable />
        </el-form-item>
        <el-form-item label="时间" prop="bbb" class="form_picker">
          <el-date-picker v-model="addForm.bbb" type="datetime" placeholder="请选择时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结果" prop="ccc">
          <el-input type="textarea" v-model="addForm.ccc" placeholder="请输入结果" clearable />
        </el-form-item>
        <el-form-item label="Pending具体状态" prop="hhh">
          <el-select v-model="addForm.hhh" placeholder="请选择Pending具体状态" clearable style="width: 100%">
            <el-option label="客户内部流程申请" value="1" />
            <el-option label="与客户议价中" value="2" />
            <el-option label="待付款" value="3" />
            <el-option label="线下合同审批" value="4" />
            <el-option label="其他" value="5" />
          </el-select>
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
//   import Quotation from './components/quotation.vue'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()
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
const orderType = ref([])
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
const handleExamine = () => {
  ElMessageBox.confirm('确定后无法修改，是否继续？', i18n.t('common.warning'), {
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

// 上传附件
const detailVisible = ref(false)
const formRefDetails = ref(null)
// const formDetails = ref({
//     details: '',
// })
const handleUploadFile = () => {
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
const addRecordVisible = ref(false)
const addRefForm = ref(null)
const addForm = ref({
  aaa: '',
  bbb: '',
  ccc: '',
  hhh: '',
})
const AddRules = {
  aaa: [{ required: true, message: '沟通人不能为空', trigger: 'blur' }],
  bbb: [{ required: true, message: '时间不能为空', trigger: 'blur' }],
  ccc: [{ required: true, message: '结果不能为空', trigger: 'blur' }],
  hhh: [{ required: true, message: 'pending具体状态不能为空', trigger: 'change' }],
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
// 上传附件参数
const list = ref([])
const params = {
  type: 1,
}
</script>
<style scoped>
.form_picker :deep(.el-input__wrapper) {
  width: 95%;
}

.item :deep(.el-form-item__content) {
  margin-left: 0px !important;
}
</style>
