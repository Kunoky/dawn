<template>
  <div>
    <CTable
      :page-conf="{
        action: 'system/dict/type/list',
      }"
      ref="tableRef"
      id="systemDict"
    >
      <el-table-column label="字典编号" prop="dictId" />
      <el-table-column label="字典名称" prop="dictName" :show-overflow-tooltip="true" />
      <el-table-column label="字典类型" prop="dictType" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <el-tag>{{ sys_normal_disable.kv[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" prop="createTime" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)" v-hasPermi="['system:dict:edit']">
            {{ $t('common.edit') }}
          </el-button>
          <RouterLink :to="'/system/dict/data?type=' + row.dictType">
            <el-button type="primary" link>{{ $t('common.config') }}</el-button>
          </RouterLink>
          <el-button link type="danger" @click="handleDel(row)" v-hasPermi="['system:dict:remove']">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:dict:add']">
          <i-ep-plus />
          {{ $t('common.add') }}
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" clearable />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="字典状态" clearable>
            <el-option v-for="i in sys_normal_disable.options" :key="i.value" :label="i.label" :value="i.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <RangePicker v-model="form.params" />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>
<script setup name="SystemDict">
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
      return req.delete('system/dict/' + row.dictId)
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
