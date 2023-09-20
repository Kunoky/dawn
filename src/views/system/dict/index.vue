<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
      }"
      ref="tableRef"
      id="systemDict"
    >
      <el-table-column label="字典编号" prop="id" />
      <el-table-column label="字典名称" prop="label" />
      <el-table-column label="字典类型" prop="type" />
      <el-table-column label="排序" prop="orderNum" />
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <span>{{ ['禁用', '启用'][row.status] }}</span>
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
          <el-button link type="info" @click="handleEdit(row)" v-hasPermi="['system:dict:edit']">
            {{ $t('common.edit') }}
          </el-button>
          <RouterLink :to="'/system/dict/' + row.type">
            <el-button link type="info">{{ $t('common.config') }}</el-button>
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
        <el-form-item label="字典名称" prop="label">
          <el-input v-model="form.label" placeholder="请输入字典名称" clearable />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入字典类型" clearable />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>
<script setup name="SystemDict">
import { onMounted } from 'vue'
import FormDialog from './components/FormDialog.vue'
import { source, init } from '@/utils/dict'
const { parseTime } = utils

const i18n = useI18n()
const tableRef = ref()
const refresh = async force => {
  if (!source.value.length || force) {
    await init()
  }
  tableRef.value.refresh()
}
onMounted(refresh)

const categories = computed(() => source.value.filter(i => !i.pid || i.pid === '0'))
async function listData(params) {
  let list = categories.value.filter(i => {
    if (params.label && !i.label.match(params.label)) return false
    if (params.type && !i.type.match(params.type)) return false
    return true
  })
  const limit = params.pageNum * params.pageSize
  const records = list.slice(limit - params.pageSize, limit)
  return {
    data: {
      records,
      totalRow: records.length,
    },
  }
}
const current = ref(null)
const visible = reactive({
  form: false,
})

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
      return req.delete('/dict/' + row.id)
    })
    .then(({ code }) => {
      if (code === 200) {
        refresh(true)
      }
    })
}
const handleFormSuccess = () => {
  refresh(true)
}
</script>
