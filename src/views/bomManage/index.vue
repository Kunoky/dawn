<template>
  <div>
    <CTable
      :page-conf="{
        action: 'getBomManage/list',
      }"
      ref="tableRef"
      id="customerLock"
    >
      <el-table-column label="料号" prop="aaa" />
      <el-table-column label="名称" prop="bbb" />
      <el-table-column label="单位" prop="ccc" />
      <el-table-column label="价格" prop="ddd" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="120">
        <template #default="{ row }">
          <el-button type="info" link @click="handleEdit(row)">修改</el-button>
          <el-button type="danger" link @click="handleDel(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd">
          <i-ep-plus />
          新增
        </el-button>
        <!-- <el-button type="primary" plain>
            <i-ep-Download />
            导入
          </el-button> -->
      </template>
      <!-- <template #form="{ form }">
          <el-form-item label="客户编码" prop="">
            <el-input v-model="form.aaa" placeholder="请输入客户编码" clearable />
          </el-form-item>
          <el-form-item label="客户锁信息" prop="">
            <el-select v-model="form.bbb" placeholder="请选择客户锁信息" multiple clearable>
              <el-option label="TC锁" value="TC锁" />
              <el-option label="Block" value="Block" />
              <el-option label="财务锁" value="财务锁" />
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="">
            <el-input v-model="form.rrr" placeholder="请输入电话" clearable />
          </el-form-item>
          <el-form-item label="创建时间" prop="">
            <el-date-picker
              v-model="form.ddd"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
        </template> -->
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>

<script setup>
import FormDialog from './components/FormDialog.vue'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()
const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
})

const handleAdd = () => {
  current.value = null
  visible.form = true
}

const handleEdit = row => {
  current.value = row
  visible.form = true
}

const handleDel = () => {
  ElMessageBox.confirm(i18n.t('tip.delete'), i18n.t('common.warning'), {
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
</script>
