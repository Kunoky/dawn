<template>
  <div>
    <CTable
      :page-conf="{
        action: 'so/getSoList',
      }"
      ref="tableRef"
      id="systemRole"
    >
      <el-table-column label="SO NO" prop="so" width="130" />
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
      <el-table-column label="转移原因" prop="sss" width="140" :show-overflow-tooltip="true" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="100">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">转移</el-button>
          <el-button type="primary" link @click="handleClose(row)">拒绝</el-button>
          <!-- <el-button type="danger" link @click="handleDel(row)">
              确定申请
            </el-button> -->
        </template>
      </el-table-column>
      <template #actions>
        <!-- <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:user:add']">
            <i-ep-plus />
            新增
          </el-button> -->
      </template>
      <template #form="{ form }">
        <!-- <el-form-item label="仪器序列号" prop="TaskID">
                    <el-select v-model="form.TaskID" placeholder="请输入维修任务号" clearable>
                        <el-option label="A" value="shanghai" />
                        <el-option label="B" value="beijing" />
                    </el-select>
                </el-form-item>
                <el-form-item label="型号" prop="ddd">
                    <el-select v-model="form.ddd" placeholder="请选择维修类型" clearable>
                        <el-option label="A" value="shanghai" />
                        <el-option label="B" value="beijing" />
                    </el-select>
                </el-form-item> -->
        <el-form-item label="客户单位名称" prop="fff">
          <!-- <el-input v-model="form.fff" placeholder="请输入客户单位名称" clearable /> -->
          <el-select v-model="form.fff" placeholder="请输入客户单位名称" style="width: 100%" clearable>
            <el-option label="A" value="shanghai" />
            <el-option label="B" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="SO NO" prop="so">
          <el-input v-model="form.so" placeholder="请输入联系人" clearable />
        </el-form-item>
        <el-form-item label="工程师名称">
          <el-input v-model="form.ppp" placeholder="请输入FSE工程师名称">
            <template #append>
              <el-button><i-ep-Search /></el-button>
            </template>
          </el-input>
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>

    <el-dialog title="拒绝" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form :model="formDetails" ref="formRefDetails" label-width="80" :rules="rules">
        <el-form-item label="拒绝原因" prop="details">
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

const tableRef = ref()
const refresh = () => tableRef.value.refresh()

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

//   const handleDel = row => {
//     ElMessageBox.confirm(i18n.t('tip.determine'), i18n.t('common.warning'), {
//       confirmButtonText: i18n.t('common.confirm'),
//       cancelButtonText: i18n.t('common.cancel'),
//       type: 'warning',
//     })
//       .then(() => {
//         // current.value = {
//         //   ...row,
//         //   deleting: true,
//         // }
//         // return req.delete('system/user/' + row.userId)
//       })
//     // .then(({ code }) => {
//     // if (code === 200) {
//     //   ElMessage.success(i18n.t('tip.success'))
//     //   refresh()
//     // }
//     // })
//   }
const handleFormSuccess = () => {
  refresh()
}

const detailVisible = ref(false)
const formRefDetails = ref(null)
const formDetails = ref({
  details: '',
})
const rules = {
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
