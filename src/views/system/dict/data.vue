<template>
  <div>
    <CTable
      :page-conf="{
        action: 'system/dict/data/list',
      }"
      :params="params"
      ref="tableRef"
      id="systemDictData"
    >
      <el-table-column label="字典编码" prop="dictCode" />
      <el-table-column label="字典标签" prop="dictLabel">
        <template #default="{ row }">
          <span v-if="row.listClass == '' || row.listClass == 'default'">{{ row.dictLabel }}</span>
          <el-tag v-else :type="row.listClass == 'primary' ? '' : row.listClass">{{ row.dictLabel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="字典键值" prop="dictValue" />
      <el-table-column label="字典排序" prop="dictSort" />
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
        <RouterLink to="/system/dict">
          <el-button type="warning" plain>
            <i-ep-close />
            {{ $t('common.close') }}
          </el-button>
        </RouterLink>
      </template>
      <template #form="{ form }">
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入字典标签" clearable />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="字典状态" clearable>
            <el-option v-for="i in sys_normal_disable.options" :key="i.value" :label="i.label" :value="i.value" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <FormDialog
      :data="current"
      v-model="visible.form"
      :type="params.dictType"
      @success="handleFormSuccess"
    ></FormDialog>
  </div>
</template>
<script setup name="SystemDictData">
import FormDialog from './components/DataDialog.vue'

const { parseTime } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
})

const route = useRoute()
const params = ref({
  dictType: route.query.type,
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
