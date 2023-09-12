<template>
  <div>
    <CTable :page-conf="{ action: 'inventory/getInventoryList' }" ref="tableRef" id="systemRole">
      <el-table-column label="SO订单编号" prop="bbb" />
      <el-table-column label="移库凭证号" prop="ccc" :show-overflow-tooltip="true" />
      <el-table-column label="快递单号" prop="kkk" />
      <el-table-column label="是否有异常" prop="lll" />
      <el-table-column label="创建人" prop="mmm" />
      <el-table-column label="创建时间" prop="jjj" />
      <!-- <el-table-column label="Storage location" prop="ddd" />
      <el-table-column label="配件料号" prop="eee" />
      <el-table-column label="数量" prop="fff" />
      <el-table-column label="数量借/贷" prop="ggg" />
      <el-table-column label="单位" prop="hhh" />
      <el-table-column label="批次号" prop="iii" />
      <el-table-column label="时间" prop="jjj" :show-overflow-tooltip="true" />
      <el-table-column label="序列号" prop="aaa" /> -->
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="120">
        <template #default="{ row }">
          <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
          <el-button type="primary" link @click="handleDel(row)">删除</el-button>
          <!-- <el-button type="primary" link @click="handleExamine(row)">
            审批
          </el-button> -->
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:user:add']">
          <i-ep-plus />
          新增
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="SO订单编号" prop="bbb">
          <el-input v-model="form.bbb" placeholder="请输入SO订单编号" clearable />
        </el-form-item>
        <el-form-item label="移库凭证号" prop="ccc">
          <el-input v-model="form.ccc" placeholder="请输入移库凭证号" clearable />
        </el-form-item>
        <!-- <el-form-item label="批次号" prop="iii">
          <el-input v-model="form.iii" placeholder="请输入批次号" clearable />
        </el-form-item> -->
        <!-- <el-form-item label="配件料号" prop="eee">
          <el-input v-model="form.eee" placeholder="请输入配件料号" clearable />
        </el-form-item> -->
        <el-form-item label="时间" prop="jjj">
          <range-picker v-model="form.jjj" />
        </el-form-item>
        <el-form-item label="是否有异常" prop="lll">
          <el-select v-model="form.lll" placeholder="请选择是否有异常" clearable>
            <el-option label="是" value="SM01" />
            <el-option label="否" value="SM02" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import FormDialog from './components/FormDialog.vue'
const i18n = useI18n()
const tableRef = ref()
const refresh = () => tableRef.value.refresh()

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
const handleDeatil = row => {
  current.value = row
  visible.form = true
}

// const handleEdit = row => {
//   current.value = row
//   visible.form = true
// }

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
