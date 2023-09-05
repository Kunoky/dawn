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
      <el-table-column label="转移原因" prop="sss" width="140" :show-overflow-tooltip="true" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="80">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">转移</el-button>
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
          <el-input v-model="form.fff" placeholder="请输入客户单位名称" clearable />
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
</script>
