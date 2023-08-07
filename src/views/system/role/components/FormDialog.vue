<template>
  <el-dialog :model-value="modelValue" @close="handleClose" :title="title" width="60%" v-bind="$attrs">
    <el-form :model="form" ref="formRef" label-width="120" :rules="rules" v-loading="dataLoading">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item prop="roleKey">
        <template #label>
          <span>
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
              <i-ep-question-filled />
            </el-tooltip>
            权限字符
          </span>
        </template>
        <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
      </el-form-item>
      <el-form-item label="角色顺序" prop="roleSort">
        <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio v-for="i in sys_normal_disable.options" :key="i.value" :label="i.value">{{ i.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-checkbox @change="handleCheckedTreeExpand">展开/折叠</el-checkbox>
        <el-checkbox @change="handleCheckedTreeNodeAll">全选/全不选</el-checkbox>
        <el-checkbox v-model="form.menuCheckStrictly">父子联动</el-checkbox>
        <!-- <el-tree-select
          class="wd-100"
          v-model="form.menuIds" 
          multiple
          show-checkbox
          :data="menuTree"
          node-key="id"
          collapse-tags
          :check-strictly="!form.menuCheckStrictly"
          empty-text="加载中，请稍候"
          :props="{ label: 'label', children: 'children' }"
        /> -->
        <el-tree
          class="wd-100 bd"
          :data="menuTree"
          show-checkbox
          ref="menuRef"
          node-key="id"
          :check-strictly="!form.menuCheckStrictly"
          empty-text="加载中，请稍候"
          :props="{ label: 'label', children: 'children' }"
        ></el-tree>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('common.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})

const title = computed(() => (props.data ? '编辑角色' : '新增角色'))

const rules = {
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

const sys_normal_disable = useDict('sys_normal_disable')

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        roleId: undefined,
        roleName: '',
        roleKey: '',
        roleSort: 0,
        status: '0',
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: '',
      }

      props.data && getData()
      getMenu()
      nextTick(() => {
        formRef.value.clearValidate()
      })
    }
  },
  { immediate: true }
)

const { run: getData, loading: dataLoading } = useAsync(() => req.get('system/role/' + (props.data?.roleId || '')), {
  onSuccess(res) {
    for (let k in form.value) {
      form.value[k] = res.data[k]
    }
    form.value.roleSort = +form.value.roleSort
    nextTick(() => {
      formRef.value.clearValidate()
    })
  },
})

const handleClose = () => {
  emit('update:modelValue', false)
}

const menuRef = ref()
const menuTree = ref([])
const getMenu = () => {
  const url = props.data ? 'system/menu/roleMenuTreeselect/' + props.data.roleId : 'system/menu/treeselect'
  req.get(url).then(res => {
    menuTree.value = res.data
    if (props.data) {
      menuTree.value = res.menus
      nextTick(() => {
        res.checkedKeys.forEach(i => menuRef.value.setChecked(i, true, false))
      })
    }
  })
}
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys()
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = menuTree.value
  for (let i = 0; i < treeList.length; i++) {
    menuRef.value.store.nodesMap[treeList[i].id].expanded = value
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value) {
  menuRef.value.setCheckedNodes(value ? menuTree.value : [])
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      form.value.menuIds = getMenuAllCheckedKeys()
      req[form.value.menuId ? 'put' : 'post']('system/role', form.value)
        .then(({ code }) => {
          if (code === 200) {
            emit('success')
            emit('update:modelValue', false)
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}
</script>
