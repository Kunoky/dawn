<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="title"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="155" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户编码" prop="aaa">
            <el-input v-model="form.aaa" disabled placeholder="请输入客户编码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户锁信息" prop="bbb" class="date-box">
            <el-select v-model="form.bbb" multiple placeholder="请选择客户锁信息" style="width: 100%" clearable>
              <el-option label="TC锁" value="TC锁" />
              <el-option label="Block" value="Block" />
              <!-- <el-option label="Block+TC锁" value="Block+TC锁" /> -->
              <el-option label="财务锁" value="财务锁" />
              <!-- <el-option label="TC锁+财务锁" value="TC锁+财务锁" /> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建人" prop="ccc">
            <el-input v-model="form.ccc" placeholder="请输入创建人" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间" prop="ddd" class="date-box">
            <el-date-picker
              v-model="form.ddd"
              style="width: 100%"
              type="datetime"
              placeholder="请选择创建时间"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分组" prop="eee" class="data-box">
            <el-select v-model="form.eee" placeholder="请选择客户锁信息" style="width: 100%" clearable>
              <el-option label="AAA" value="1" />
              <el-option label="BBB" value="2" />
              <el-option label="ccc" value="3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称一" prop="fff">
            <el-input v-model="form.fff" placeholder="请输入名称一" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称二" prop="ggg">
            <el-input v-model="form.ggg" placeholder="请输入名称二" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称三" prop="hhh">
            <el-input v-model="form.hhh" placeholder="请输入名称三" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称四" prop="iii">
            <el-input v-model="form.iii" placeholder="请输入名称四" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="jjj">
            <el-input v-model="form.jjj" placeholder="请输入城市" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区" prop="kkk">
            <el-input v-model="form.kkk" placeholder="请输入区" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="县" prop="lll">
            <el-input v-model="form.lll" placeholder="请输入县" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="街道" prop="mmm">
            <el-input type="textarea" v-model="form.mmm" placeholder="请输入街道" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮政编码" prop="nnn">
            <el-input v-model="form.nnn" placeholder="请输入邮政编码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="税号一" prop="ooo">
            <el-input v-model="form.ooo" placeholder="请输入税号一" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="税号二" prop="ppp">
            <el-input v-model="form.ppp" placeholder="请输入税号二" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司" prop="qqq">
            <el-input v-model="form.qqq" placeholder="请输入公司" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="rrr">
            <el-input v-model="form.rrr" placeholder="请输入电话" clearable />
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

const title = computed(() => (props.data ? '修改客户锁信息' : '新增客户锁信息'))

const rules = {
  aaa: [{ required: true, message: '客户编号不能为空', trigger: 'blur' }],
  bbb: [{ required: true, message: '客户锁信息不能为空', trigger: 'blur' }],
  ccc: [{ required: true, message: '创建人不能为空', trigger: 'blur' }],
  ddd: [{ required: true, message: '创建时间不能为空', trigger: 'change' }],
  eee: [{ required: true, message: '分组不能为空', trigger: 'blur' }],
  fff: [{ required: true, message: '名称一不能为空', trigger: 'blur' }],
  ggg: [{ required: true, message: '名称二不能为空', trigger: 'blur' }],
  hhh: [{ required: true, message: '名称三不能为空', trigger: 'blur' }],
  iii: [{ required: true, message: '名称四不能为空', trigger: 'blur' }],
  jjj: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
  kkk: [{ required: true, message: '区不能为空', trigger: 'blur' }],
  lll: [{ required: true, message: '县不能为空', trigger: 'blur' }],
  mmm: [{ required: true, message: '街道不能为空', trigger: 'blur' }],
  nnn: [{ required: true, message: '邮政编码不能为空', trigger: 'blur' }],
  ooo: [{ required: true, message: '税号一不能为空', trigger: 'blur' }],
  ppp: [{ required: true, message: '税号二不能为空', trigger: 'blur' }],
  qqq: [{ required: true, message: '公司不能为空', trigger: 'blur' }],
  rrr: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
}
const loading = ref(false)
const formRef = ref()
const form = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        aaa: '',
        bbb: [],
        ccc: '',
        ddd: [],
        eee: '',
        fff: '',
        ggg: '',
        hhh: '',
        iii: '',
        jjj: '',
        kkk: '',
        lll: '',
        mmm: '',
        nnn: '',
        ooo: '',
        ppp: '',
        qqq: '',
        rrr: '',
      }
      if (props.data) {
        for (let k in form.value) {
          form.value[k] = props.data[k]
        }
      }
      nextTick(() => {
        formRef.value.clearValidate()
      })
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
<style scoped>
.date-box :deep(.el-input__wrapper) {
  width: 95%;
}
</style>
