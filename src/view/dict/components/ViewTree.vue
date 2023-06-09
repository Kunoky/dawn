<template>
  <el-dialog :model-value="modelValue" @close="handleClose" title="Dictionary Tree" width="40%" v-bind="$attrs">
    <el-tree :data="data.tree" node-key="id" v-loading="loading || deleting" default-expand-all>
      <template #default="{ node }">
        <span class="dict-tree-item">
          <span>{{ node.data.val }}</span>
          <span class="actions">
            <i-ep-edit v-permission:settingDict="1" @click.stop="handleEdit(node)" />
            <i-ep-plus v-permission:settingDict="0" @click.stop="handleAdd(node)" />
            <i-ep-delete v-permission:settingDict="2" v-if="node.data.pId" @click.stop="handleDel(node)" />
          </span>
        </span>
      </template>
    </el-tree>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.close') }}</el-button>
      </span>
    </template>
  </el-dialog>
  <FormDialog :data="current" v-model="visible.form" @success="refresh"></FormDialog>
</template>

<script setup>
import { listDict, delDict } from '@/services/dict'
import FormDialog from './FormDialog.vue'

const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  root: Object,
  modelValue: Boolean,
})

const i18n = useI18n()
const current = ref(null)
const visible = reactive({
  form: false,
})

const {
  data,
  loading,
  run: refresh,
} = useAsync(
  async () => {
    const res = await listDict({ category: props.root.category })
    const [tree, idNode] = utils.arr2tree(res.list)
    return {
      tree,
      idNode,
    }
  },
  { initialData: {} }
)

const { loading: deleting, run: del } = useAsync(async id => {
  await delDict(id)
  ElMessage.success(i18n.t('tip.success'))
  refresh()
})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      refresh()
    }
  },
  { immediate: true }
)
const handleClose = () => {
  emit('update:modelValue', false)
}
const handleEdit = node => {
  current.value = node.data
  visible.form = true
}
const handleAdd = node => {
  const { id, category, children } = node.data
  current.value = {
    pId: id,
    category,
    sort: (children || []).length + 1,
  }
  visible.form = true
}
const handleDel = async node => {
  ElMessageBox.confirm(i18n.t('tip.delete'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  }).then(() => del(utils.tree2arr([node.data], 'id')))
}
</script>
<style lang="scss">
.dict-tree-item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .actions {
    margin-left: var(--size-l);
    color: var(--primary-color);
    cursor: pointer;
    svg {
      vertical-align: bottom;
      & + svg {
        margin-left: var(--size-s);
      }
    }
  }
}
</style>
