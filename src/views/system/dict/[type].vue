<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
      }"
      ref="tableRef"
      id="systemDictData"
    >
      <el-table-column label="字典编码" prop="id" />
      <el-table-column label="字典标签" prop="label" />
      <el-table-column label="字典键值" prop="value" />
      <el-table-column label="字典排序" prop="orderNum" />
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <span>{{ row.status ? '启用' : '禁用' }}</span>
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
          <el-button link type="danger" @click="handleDel(row)" v-hasPermi="['system:dict:del']">
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
        <el-form-item label="字典标签" prop="label">
          <el-input v-model="form.label" placeholder="请输入字典标签" clearable />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>
<script setup name="SystemDictType">
import FormDialog from './components/DataDialog.vue'
import { source, init } from '@/utils/dict'

definePage({
  meta: {
    title: '字典数据',
    permission: ['system:dict:list'],
  },
})

const { parseTime } = utils

const i18n = useI18n()
const route = useRoute()

const tableRef = ref()
const refresh = async force => {
  if (!source.value.length || force) {
    await init()
  }
  setTimeout(() => {
    tableRef.value.refresh()
  }, 100)
}
onActivated(() => {
  refresh()
})
const type = useDict('type')
const dicts = computed(() => source.value.filter(i => i.pid === type.value.ko[route.params.type].id))
async function listData(params) {
  let list = dicts.value.filter(i => {
    if (params.label && !i.label.match(params.label)) return false
    return true
  })
  const limit = params.pageNum * params.pageSize
  const records = list.slice(limit - params.pageSize, limit)
  return {
    records,
    totalRow: list.length,
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
      return req.delete('dict/' + row.id)
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
