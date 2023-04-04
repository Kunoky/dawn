<template>
  <el-dialog :model-value="modelValue" @close="handleClose" title="User Configuration" width="60%" v-bind="$attrs">
    <el-transfer v-model="role" :data="source" :props="{ key: 'name', label: 'name' }" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.close') }}</el-button>
        <el-button v-permission:settingUser="2" type="primary" @click="handleSave">{{ $t('common.save') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { listRole } from '@/services/role'
import { putUser } from '@/services/user'
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})

const loading = reactive({
  get: false,
  save: false,
})

const source = ref([])
const role = ref([])
const init = async () => {
  role.value = props.data.role
  loading.get = true
  const res = await listRole({})
  source.value = res.list
  loading.get = false
}

watch(
  () => props.modelValue,
  v => {
    if (v) {
      init()
    }
  },
  { immediate: true }
)
const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSave = async () => {
  await putUser({
    id: props.data.id,
    role: toRaw(role.value),
  })
  handleClose()
}
</script>
<style lang="scss"></style>
