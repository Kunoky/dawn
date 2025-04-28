<template>
  <el-upload
    class="uploadList"
    ref="upload"
    :action="$baseUrl + path + '?' + $utils.obj2params(params)"
    :headers="headers"
    :drag="drag && !disabled"
    :disabled="disabled"
    :on-error="handleError"
    :on-exceed="handleExceed"
    :before-upload="beforeUpload"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-preview="onPreview"
    :accept="accept"
    v-bind="$attrs"
    v-model:file-list="fileList"
  >
    <template v-if="!disabled" #trigger>
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
    <template v-if="!disabled" #tip>
      <slot name="tip">
        <div class="el-upload__tip">文件大小不超过10MB</div>
      </slot>
    </template>
  </el-upload>
</template>
<script setup>
import { getToken } from '@/utils/auth'

const props = defineProps({
  params: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  accept: {
    type: String,
  },
  path: {
    type: String,
    default: '/attachment/upload',
  },
  onPreview: {
    type: Function,
    default: file => {
      window.open(import.meta.env.VITE_SERVER_PATH + (file.path || file.url))
    },
  },
  onExceed: {
    type: Function,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  drag: {
    type: Boolean,
    default: true,
  },
})

const attrs = useAttrs()

const emit = defineEmits(['update:modelValue', 'success'])
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
      if (i.status === 'success' && i.response) {
        // Object.assign(i, i.response?.data)
        i.url = i.response.data
      }
    })
    emit('update:modelValue', v)
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  v => {
    fileList.value = v
  },
  {
    immediate: true,
  }
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

function beforeUpload(file) {
  if (props.accept && !utils.mimeTypeMatch(file.type, props.accept)) {
    ElMessage.error('上传文件格式错误!')
    return false
  }
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件最大10MB!')
    return false
  }
  return true
}

function handleRemove(file) {
  file.id && req.delete('attachment/' + file.id).send()
}
function handleSuccess(res) {
  if (res.code === 200) {
    ElMessage.success('上传成功!')
    emit('success', res, fileList.value)
  }
}
function handleExceed(...args) {
  props.onExceed ? props.onExceed(...args) : ElMessage.error(`只能上传${attrs.limit} 个文件!`)
}

defineExpose({
  upload,
})
</script>

<style scoped>
.uploadList :deep(.el-upload-list__item.is-success) .el-icon--close-tip {
  display: none !important;
}
</style>
