<template>
  <el-upload
    ref="upload"
    :action="url + obj2params(params)"
    :headers="headers"
    drag
    :on-error="handleError"
    :on-preview="handlePreview"
    :before-upload="beforeUpload"
    :on-remove="handleRemove"
    :accept="accept"
    v-bind="$attrs"
    v-model:file-list="fileList"
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

const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  accept: {
    type: String,
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
    v.forEach(i => {
      if (i.status === 'success') {
        Object.assign(i, i.response.data)
      }
    })
    emit('update:modelValue', v)
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
  window.open(import.meta.env.VITE_SERVER_PATH + file.path)
}

function beforeUpload(file) {
  if (!utils.mimeTypeMatch(file.type, props.accept)) {
    ElMessage.error('无效的文件类型!')
    return false
  }
  if (file.size > 20 * 1024 * 1024) {
    ElMessage.error('附件最大20MB!')
    return false
  }
  return true
}

function handleRemove(file) {
  file.id && req.delete('attachment/' + file.id)
}
defineExpose({
  upload,
})
</script>
