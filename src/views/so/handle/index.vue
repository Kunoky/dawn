<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
      }"
      ref="tableRef"
      id="handle"
    >
      <el-table-column label="SO NO" prop="soNo" width="120" />
      <el-table-column label="维修类型" prop="ddd" />
      <el-table-column label="物料号" prop="kkk" />
      <el-table-column label="批次号" prop="lll" />
      <el-table-column label="数量" prop="mmm" />
      <el-table-column label="失败原因" prop="state" width="200" />
      <el-table-column label="FSE ID" prop="ooo" width="100" />
      <el-table-column label="FSE工程师名称" prop="transferFseName" width="100" />
      <el-table-column label="FSE work center" prop="workCenter" width="115" />
      <el-table-column label="FSE storage location" prop="storageLocation" width="140" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="110">
        <template #default="{ row }">
          <el-button type="info" link @click="handleEdit(row)">详情</el-button>
          <el-button type="primary" link @click="handleClose(row)">已处理</el-button>
          <!-- <el-button type="primary" link @click="handleWanderAbout(row)">再次流转</el-button>
          <el-button type="primary" link @click="handleMovement(row)">手动跳过</el-button> -->
        </template>
      </el-table-column>
      <template #actions>
        <!-- <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:user:add']">
          <i-ep-plus />
          新增
        </el-button> -->
      </template>
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
        <el-form-item label="工程师名称">
          <el-input v-model="form.ppp" placeholder="请输入FSE工程师名称">
            <template #append>
              <el-button><i-ep-Search /></el-button>
            </template>
          </el-input>
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
              value: 'id',
              checkStrictly: true,
            }"
          />
        </el-form-item>
        <el-form-item label="错误原因" prop="errorReason">
          <el-input v-model="form.errorReason" />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>

    <el-dialog title="已处理" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form :model="formDetails" ref="formRefDetails" label-width="80" :rules="rules">
        <el-form-item label="处理方式" prop="aaa">
          <el-select v-model="formDetails.aaa" placeholder="请选择处理方式" style="width: 100%" clearable>
            <el-option label="忽略此条失败" value="1" />
            <el-option label="移除此条Lock记录" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="details">
          <el-input type="textarea" v-model="formDetails.details" placeholder="请输入拒绝原因" clearable />
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

const tableRef = ref()
const refresh = () => tableRef.value.refresh()

const listData = params => {
  delete params.options
  return req.get('/lockSo/page', { params }).then(res => {
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
const handleFormSuccess = () => {
  refresh()
}
// const handleWanderAbout = () => {
//   ElMessageBox.confirm('是否将该so再次流转到物料核算流程', i18n.t('common.warning'), {
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
// const handleMovement = () => {
//   ElMessageBox.confirm('是否确认跳过物料核算流程', i18n.t('common.warning'), {
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
const detailVisible = ref(false)
const formRefDetails = ref(null)
const formDetails = ref({
  aaa: '',
  details: '',
})

const rules = {
  aaa: [{ required: true, message: '含处理方式不能为空', trigger: 'change' }],
  details: [{ required: true, message: '拒绝原因不能为空', trigger: 'blur' }],
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
</script>
