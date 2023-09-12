<template>
  <div>
    <CTable
      :page-conf="{
        action: 'so/getSoList',
      }"
      ref="tableRef"
      id="systemRole"
    >
      <!-- <el-table-column label="维修任务号" prop="TaskID" width="120" /> -->
      <el-table-column label="仪器序列号" prop="aaa" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="型号" prop="bbb" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="ccc" width="128" />
      <el-table-column label="维修类型" prop="ddd" width="100" />
      <el-table-column label="仪器地址" prop="eee" width="100" />
      <el-table-column label="创建人" prop="www" width="100" />
      <el-table-column label="创建时间" prop="nnn" width="100" />
      <el-table-column label="未关闭so数量" prop="TaskID" width="100">
        <template #default="{ row }">
          <span class="cs-p fw-b" style="color: #1890ff" @click="handleNum(row)">{{ row.TaskID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户单位名称" prop="fff" width="100" />
      <el-table-column label="客户编号" prop="ggg" width="100" />
      <el-table-column label="客户联系人" prop="hhh" width="100" />
      <el-table-column label="客户联系人电话" prop="iii" width="120" />
      <el-table-column label="客户联系人邮箱" prop="jjj" width="130" />
      <el-table-column label="代理商" prop="kkk" width="100" />
      <el-table-column label="报修内容" prop="lll" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="报修来源" prop="mmm" width="100" />
      <el-table-column label="报修时间" prop="yyy" width="100" />
      <el-table-column label="保修期" prop="ooo" width="100" />
      <el-table-column label="FSE工程师名称" prop="ppp" width="100" />
      <el-table-column label="FSE work center" prop="qqq" width="115" />
      <el-table-column label="FSE storage location" prop="rrr" width="140" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="230">
        <template #default="{ row }">
          <el-button type="info" link @click="handleEdit(row)">完善信息</el-button>
          <el-button type="danger" link @click="handleDel(row)">RPA创建SO</el-button>
          <el-button type="danger" link @click="handleClose(row)">关闭</el-button>
        </template>
      </el-table-column>
      <template #actions>
        <!-- <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:user:add']">
          <i-ep-plus />
          新增
        </el-button> -->
      </template>
      <template #form="{ form }">
        <el-form-item label="仪器序列号" prop="TaskID">
          <el-select v-model="form.aaa" placeholder="请输入仪器序列号" style="width: 100%" clearable>
            <el-option label="A" value="shanghai" />
            <el-option label="B" value="beijing" />
          </el-select>
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
        <el-form-item label="SO" prop="so">
          <el-input v-model="formDetails.so" placeholder="请输入SO" clearable />
        </el-form-item>
        <el-form-item label="关闭原因" prop="details">
          <el-input type="textarea" v-model="formDetails.details" placeholder="请输入关闭原因" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDetail">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
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
          <!-- <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button> -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import FormDialog from './components/FormDialog.vue'

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
})

// const status = useDict('status')

// const handleAdd = () => {
//   current.value = null
//   visible.form = true
// }

const handleEdit = row => {
  current.value = row
  visible.form = true
}

const handleDel = () => {
  ElMessageBox.confirm('确定RPA创建SO后无法修改，是否继续？', i18n.t('common.warning'), {
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
  so: '',
  details: '',
})
const rules = {
  so: [{ required: true, message: 'so不能为空', trigger: 'blur' }],
  details: [{ required: true, message: '关闭原因不能为空', trigger: 'blur' }],
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

const visibleSo = ref(false)
const tableData = [
  {
    aaa: 'xxxxx',
    bbb: '待创建',
    ccc: 'SM02',
    ddd: '李四',
    eee: '2023-08-22 10:20:23',
    fff: '2023-08-25 15:24:23',
    ggg: '一号工程师',
    hhh: '详情',
    iii: 'xxxxxx',
  },
  {
    aaa: 'xxxxx',
    bbb: '待维修',
    ccc: 'SM02',
    ddd: '李四',
    eee: '2023-08-22 10:20:23',
    fff: '2023-08-25 15:24:23',
    ggg: '一号工程师',
    hhh: '详情',
    iii: 'xxxxxx',
  },
]
const handleNum = () => {
  visibleSo.value = true
}
const handleCloseSo = () => {
  visibleSo.value = false
}
</script>
