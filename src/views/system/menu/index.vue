<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
        hidePage: true,
        dataKey: 'data',
      }"
      ref="tableRef"
      id="systemMenu"
      row-key="menuId"
    >
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template #default="{ row }">
          <IconFont :icon-class="row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag>{{ disableDict.kv[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)" v-hasPermi="['system:menu:edit']">修改</el-button>
          <el-button link type="primary" @click="handleAdd(row)" v-hasPermi="['system:menu:add']">新增</el-button>
          <el-button link type="danger" @click="handleDel(row)" v-hasPermi="['system:menu:remove']">删除</el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:menu:add']">新增</el-button>
        <el-button type="info" plain @click="toggleExpand">展开/折叠</el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="菜单名称">
          <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择菜单状态" clearable>
            <el-option v-for="i in disableDict.options" v-bind="i" :key="i.key" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <FormDialog
      :data="current"
      v-model="visible.form"
      @success="handleFormSuccess"
      :menus="menuTree"
      :parentId="parentId"
    ></FormDialog>
  </div>
</template>
<script setup name="SystemMenu">
import FormDialog from './components/FormDialog.vue'

const { parseTime, arr2tree } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const allExpandKeys = ref([])
const listData = params =>
  axios.get('/system/menu/list', { params }).then(res => {
    const [list, obj] = arr2tree(res.data, 'menuId', 'parentId')
    const keys = []
    Object.values(obj).forEach(i => {
      if (i.children) {
        keys.push(i.menuId)
      } else {
        i.children = []
      }
    })
    allExpandKeys.value = keys
    return { data: list }
  })
const isExpandAll = ref(false)
const toggleExpand = () => {
  const tRef = tableRef.value.tableRef
  isExpandAll.value = !isExpandAll.value
  allExpandKeys.value.forEach(i => {
    tRef.toggleRowExpansion({ menuId: i }, isExpandAll.value)
  })
}

const disableDict = useDict('sys_normal_disable')

const parentId = ref(0)
const current = ref(null)
const visible = reactive({
  form: false,
  config: false,
})

const menuTree = ref([])
const genMenuTree = () => {
  if (menuTree.value.length) return
  let tree = [
    {
      menuId: 0,
      menuName: '主类目',
      children: [],
    },
  ]
  listData().then(({ data }) => {
    tree[0].children = data
    menuTree.value = tree
  })
}

const handleAdd = row => {
  genMenuTree()
  parentId.value = row?.menuId || 0
  current.value = null
  visible.form = true
}

const handleEdit = row => {
  genMenuTree()
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
      return axios.delete('system/menu/' + row.menuId)
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
