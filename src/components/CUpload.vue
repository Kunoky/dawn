<template>
  <el-upload
    v-model:file-list="fileList"
    ref="upload"
    :action="url + obj2params(params)"
    :headers="headers"
    drag
    :on-error="handleError"
    :on-preview="handlePreview"
    :before-upload="beforeUpload"
    v-bind="$attrs"
  >
    <template #trigger>
      <slot name="trigger">
        <el-icon class="el-icon--upload"><i-ep-upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件至此 或
          <em>点击上传</em>
        </div>
      </slot>
    </template>
    <slot></slot>
    <template #file>
      <slot name="file"></slot>
    </template>
    <template #tip>
      <slot name="tip"><div class="el-upload__tip">不超过20MB</div></slot>
    </template>
  </el-upload>
</template>
<script setup>
import { getToken } from '@/utils/auth'
import { watch } from 'vue'

defineProps({
  params: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])
const { obj2params } = utils
const url = import.meta.env.VITE_SERVER_PATH + '/attachment/upload?'
const headers = {
  Authorization: 'Bearer ' + getToken(),
  'Call-Source': 'WEB',
  'Api-Version': 1.0,
}
const upload = ref()
const fileList = ref([])

watch(
  fileList,
  v => {
    const ids = []
    v.forEach(i => {
      if (i.status === 'success') {
        const { id } = i.response.data
        ids.push(id)
      }
    })
    emit('update:modelValue', ids)
  },
  { deep: true }
)
function handleError(e) {
  let msg = e.message
  try {
    msg = JSON.parse(e.message).msg
  } catch (e) {
    console.error(e)
  }
  ElMessage.error(msg)
}

const handlePreview = file => {
  window.open(import.meta.env.VITE_SERVER_PATH + file.response?.data.path)
}

function beforeUpload(file) {
  if (file.size > 20 * 1024 * 1024) {
    ElMessage.error('附件最大20MB!')
    return false
  }
  return true
}
defineExpose({
  upload,
  fileList,
})
</script>
