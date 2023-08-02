<template>
  <div>
    <CTable
      :page-conf="{
        action: 'system/post/list',
      }"
      ref="tableRef"
      id="systemPost"
    >
      <el-table-column label="岗位编号" prop="postId" />
      <el-table-column label="岗位编码" prop="postCode" />
      <el-table-column label="岗位名称" prop="postName" />
      <el-table-column label="岗位排序" prop="postSort" />
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <el-tag>{{ sys_normal_disable.kv[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)" v-hasPermi="['system:post:edit']">
            {{ $t('common.edit') }}
          </el-button>
          <el-button link type="danger" @click="handleDel(row)" v-hasPermi="['system:post:remove']">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:post:add']">
          <i-ep-plus />
          {{ $t('common.add') }}
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入岗位编码" clearable />
        </el-form-item>
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="岗位状态" clearable>
            <el-option v-for="i in sys_normal_disable.options" :key="i.value" :label="i.label" :value="i.value" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>
<script setup name="SystemPost">
import FormDialog from './components/FormDialog.vue'

const { parseTime } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
})

const sys_normal_disable = useDict('sys_normal_disable')

const handleAdd = () => {
  current.value = null
  visible.form = true
}

const handleEdit = row => {
  current.value = row
  visible.form = true
}
const handleDel = row => {
  ElMessageBox.confirm(i18n.t('tip.delete'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      current.value = {
        ...row,
        deleting: true,
      }
      return req.delete('system/post/' + row.postId)
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}
const handleFormSuccess = () => {
  refresh()
}
</script>
