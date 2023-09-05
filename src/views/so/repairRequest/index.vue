<template>
  <div>
    <CTable
      :page-conf="{
        action: 'so/getSoList',
      }"
      ref="tableRef"
      id="systemRole"
    >
      <el-table-column label="维修任务号" prop="TaskID" width="120" />
      <el-table-column label="仪器序列号" prop="aaa" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="仪器物料号" prop="bbb" :show-overflow-tooltip="true" width="100" />
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
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="180">
        <template #default="{ row }">
          <el-button type="info" link @click="handleEdit(row)">完善信息</el-button>
          <el-button type="danger" link @click="handleDel(row)">确定申请</el-button>
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
          <el-input v-model="form.TaskID" placeholder="请输入联系人" clearable />
        </el-form-item>
        <el-form-item label="维修类型" prop="ddd">
          <el-select v-model="form.ddd" placeholder="请选择维修类型" clearable>
            <el-option label="SM01" value="SM01" />
            <el-option label="SM02" value="SM02" />
            <el-option label="SM03" value="SM03" />
            <el-option label="SM04" value="SM04" />
            <el-option label="SM05" value="SM05" />
          </el-select>
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
</script>
