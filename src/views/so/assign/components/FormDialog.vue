<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="完善信息"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="155" :rules="rules">
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="维修任务号" prop="TaskID">
            <el-input disabled v-model="form.TaskID" placeholder="请输入维修任务号" clearable />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="仪器序列号" prop="aaa">
            <el-select v-model="form.aaa" placeholder="请输入仪器序列号" style="width: 100%" clearable>
              <el-option label="A" value="shanghai" />
              <el-option label="B" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="bbb">
            <el-select v-model="form.bbb" placeholder="请输入型号" style="width: 100%" clearable>
              <el-option label="A" value="shanghai" />
              <el-option label="B" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器SAP Equip编号" prop="ccc">
            <el-input v-model="form.ccc" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维修类型" prop="ddd">
            <el-cascader v-model="form.ddd" :options="options" filterable clearable style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器地址" prop="eee">
            <el-input v-model="form.eee" placeholder="请输入仪器地址" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户单位名称" prop="fff">
            <!-- <el-input v-model="form.fff" placeholder="请输入客户单位名称" clearable /> -->
            <el-select v-model="form.fff" placeholder="请输入客户单位名称" style="width: 100%" clearable>
              <el-option label="A" value="shanghai" />
              <el-option label="B" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="客户编号" prop="ggg">
            <el-input disabled v-model="form.ggg" placeholder="请输入客户编号" clearable />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="客户联系人" prop="hhh">
            <el-input v-model="form.hhh" placeholder="请输入客户联系人" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人拼音" prop="xxx" class="form_flex">
            <el-input style="width: 48%" v-model="form.xxx" placeholder="请输入客户联系人拼音(姓)" clearable />
            <el-input style="width: 50%" v-model="form.zzz" placeholder="请输入客户联系人拼音(名)" clearable />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="客户联系人拼音(名)" prop="zzz">
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="客户联系人电话" prop="iii">
            <el-input v-model="form.iii" placeholder="请输入客户联系人电话" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人邮箱" prop="jjj">
            <el-input v-model="form.jjj" placeholder="请输入客户联系人邮箱" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代理商" prop="kkk">
            <el-input v-model="form.kkk" placeholder="请输入代理商" clearable />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="FSE工程师名称" prop="ppp">
            <el-input v-model="form.ppp" placeholder="请输入FSE工程师名称">
              <template #append>
                <el-button><i-ep-Search /></el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="FSE work center" prop="qqq">
            <el-input v-model="form.qqq" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="FSE storage location" prop="rrr">
            <el-input v-model="form.rrr" disabled placeholder="自动填入" clearable />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="报修来源" prop="mmm">
            <el-select v-model="form.mmm" placeholder="请输入报修来源" style="width: 100%" clearable>
              <el-option label="FSE" value="fse" />
              <el-option label="其他" value="qt" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报修时间" prop="nnn" class="date-box">
            <el-date-picker
              v-model="form.nnn"
              style="width: 100%"
              type="datetime"
              placeholder="请选择报修时间"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保修期" prop="ooo" class="date-box">
            <el-date-picker v-model="form.ooo" type="date" placeholder="请选择保修期" style="width: 100%" clearabl />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联ID">
            <el-input v-model="form.rrr" placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属区域" prop="vvv">
            <el-input v-model="form.vvv" placeholder="请输入所属区域" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="报修内容" prop="lll">
            <el-input type="textarea" v-model="form.lll" placeholder="请输入报修内容" clearable />
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

// const title = computed(() => (props.data ? '完善信息' : '新建维修申请'))

const rules = {
  TaskID: [{ required: true, message: '维修任务号不能为空', trigger: 'blur' }],
  aaa: [{ required: true, message: '仪器序列号不能为空', trigger: 'blur' }],
  bbb: [{ required: true, message: '型号不能为空', trigger: 'blur' }],
  ccc: [{ required: true, message: '仪器SAP Equip编号不能为空', trigger: 'blur' }],
  ddd: [{ required: true, message: '维修类型不能为空', trigger: 'change' }],
  eee: [{ required: true, message: '仪器地址不能为空', trigger: 'blur' }],
  fff: [{ required: true, message: '客户单位名称不能为空', trigger: 'blur' }],
  // ggg: [{ required: true, message: '客户编号不能为空', trigger: 'blur' }],
  hhh: [{ required: true, message: '客户联系人不能为空', trigger: 'blur' }],
  xxx: [{ required: true, message: '客户联系人拼音不能为空', trigger: 'blur' }],
  // zzz: [{ required: true, message: '客户联系人拼音(名)不能为空', trigger: 'blur' }],
  iii: [{ required: true, message: '客户联系人电话不能为空', trigger: 'blur' }],
  jjj: [{ required: true, message: '客户联系人邮箱不能为空', trigger: 'blur' }],
  // kkk: [{ required: true, message: '代理商不能为空', trigger: 'blur' }],
  lll: [{ required: true, message: '报修内容不能为空', trigger: 'blur' }],
  // mmm: [{ required: true, message: '报修来源不能为空', trigger: 'blur' }],
  nnn: [{ required: true, message: '报修时间不能为空', trigger: 'blur' }],
  // ooo: [{ required: true, message: '保修期不能为空', trigger: 'blur' }],
  ppp: [{ required: true, message: 'FSE工程师名称不能为空', trigger: 'blur' }],
  // qqq: [{ required: true, message: 'FSE work cente不能为空', trigger: 'blur' }],
  // rrr: [{ required: true, message: 'FSE storage location不能为空', trigger: 'blur' }],
  vvv: [{ required: true, message: '所属区域不能为空', trigger: 'blur' }],
}
const options = [
  {
    value: 'SM01',
    label: 'SM01',
  },
  {
    value: 'SM02',
    label: 'SM02',
  },
  {
    value: 'SM03',
    label: 'SM03',
    children: [
      {
        value: 'xxx',
        label: '111',
      },
      {
        value: 'xxx',
        label: '222',
      },
      {
        value: 'xxx',
        label: '333',
      },
      {
        value: 'xxx',
        label: '444',
      },
    ],
  },
  {
    value: 'SM04',
    label: 'SM04',
    children: [
      {
        value: 'xxx',
        label: '111',
      },
      {
        value: 'xxx',
        label: '222',
      },
    ],
  },
  {
    value: 'SM05',
    label: 'SM05',
    children: [
      {
        value: 'xxx',
        label: '111',
      },
      {
        value: 'xxx',
        label: '222',
      },
      {
        value: 'xxx',
        label: '333',
      },
    ],
  },
]
const loading = ref(false)
const formRef = ref()
const form = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        TaskID: '',
        aaa: '',
        bbb: '',
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
        vvv: '',
        xxx: '',
        zzz: '',
        // label: '',
        // value: '',
        // category: '',
        // orderNum: 0,
        // valueType: 'string',
        // remark: '',
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
.form_flex :deep(.el-form-item__content) {
  display: flex;
  justify-content: space-between;
}
</style>
