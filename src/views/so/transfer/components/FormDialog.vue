<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="转移审批"
    width="30%"
    v-bind="$attrs"
    :close-on-click-modal="false"
    modal-class="sssss"
  >
    <!-- <div class="detail">
      <p class="center"><span class="label">FSE工程师名称：</span> {{ form.ppp }}</p>
      <p class="center"><span class="label">FSE work center：</span> {{ form.qqq }}</p>
      <p class="center"><span class="label">FSE storage location：</span> {{ form.rrr }}</p>
    </div> -->
    <el-form :model="formData" ref="formRef" label-width="142" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="FSE工程师名称" prop="aaa">
            <el-input v-model="formData.aaa" placeholder="请输入FSE工程师名称">
              <template #append>
                <el-button><i-ep-Search /></el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="FSE work center" prop="bbb">
            <el-input v-model="formData.bbb" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="FSE storage location" prop="ccc">
            <el-input v-model="formData.ccc" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
      </el-row>
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

const rules = {
  aaa: [{ required: true, message: 'FSE工程师名称不能为空', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})
const formData = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        ppp: '',
        qqq: '',
        rrr: '',
      }
      if (props.data) {
        for (let k in form.value) {
          form.value[k] = props.data[k]
        }
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      // console.log(formData.value)
      // form.value.value = form.value.category
      // loading.value = true
      // req[form.value.dictId ? 'put' : 'post']('/dict', form.value)
      //   .then(({ code }) => {
      //     if (code === 200) {
      //       emit('success')
      //       emit('update:modelValue', false)
      //     }
      //   })
      //   .finally(() => {
      //     loading.value = false
      //   })
    }
  })
}
</script>
<style scoped lang="scss">
.sssss {
  // .el-overlay-dialog {
  //   .el-dialog {
  .el-dialog__body {
    padding: calc(var(--el-dialog-padding-primary) + -20px) var(--el-dialog-padding-primary);
  }
  // }
}
// }
.detail {
  margin-bottom: 20px;
  .center {
    font-size: 14px;
    .label {
      font-weight: bold;
    }
  }
}
</style>
