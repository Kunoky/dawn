<template>
  <div class="repairForm">
    <el-form :model="form" ref="formRef" label-width="155" :rules="rules">
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="维修任务号" prop="TaskID">
            <el-input v-model="form.TaskID" placeholder="请输入维修任务号" clearable />
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
          <el-form-item label="仪器物料号" prop="bbb">
            <el-select v-model="form.bbb" placeholder="请输入仪器物料号" style="width: 100%" clearable>
              <el-option label="A" value="shanghai" />
              <el-option label="B" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器SAP Equip编号" prop="ccc">
            <el-input disabled v-model="form.ccc" placeholder="自动填入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维修类型" prop="ddd">
            <el-select v-model="form.ddd" placeholder="请选择维修类型" style="width: 100%" clearable>
              <el-option label="SM01" value="SM01" />
              <el-option label="SM02" value="SM02" />
              <el-option label="SM03" value="SM03" />
              <el-option label="SM04" value="SM04" />
              <el-option label="SM05" value="SM05" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器地址" prop="eee">
            <el-input v-model="form.eee" placeholder="请输入仪器地址" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户单位名称" prop="fff">
            <el-select v-model="form.fff" placeholder="请输入客户单位名称" style="width: 100%" clearable>
              <el-option label="A" value="shanghai" />
              <el-option label="B" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户编号" prop="ggg">
            <el-input disabled v-model="form.ggg" placeholder="请输入客户编号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人" prop="hhh">
            <el-input v-model="form.hhh" placeholder="请输入客户联系人" clearable />
          </el-form-item>
        </el-col>
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
        <el-col :span="12">
          <el-form-item label="FSE工程师名称" prop="ppp">
            <el-input v-model="form.pp" placeholder="请输入FSE工程师名称">
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
        </el-col>
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
        <el-col :span="24">
          <el-form-item label="报修内容" prop="lll">
            <el-input type="textarea" v-model="form.lll" placeholder="请输入报修内容" clearable />
          </el-form-item>
        </el-col>
        <el-form-item>
          <!-- <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button> -->
          <el-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('common.confirm') }}</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
const rules = {
  TaskID: [{ required: true, message: '维修任务号不能为空', trigger: 'blur' }],
  aaa: [{ required: true, message: '仪器序列号不能为空', trigger: 'blur' }],
  bbb: [{ required: true, message: '仪器物料号不能为空', trigger: 'blur' }],
  ccc: [{ required: true, message: '仪器SAP Equip编号不能为空', trigger: 'blur' }],
  ddd: [{ required: true, message: '维修类型不能为空', trigger: 'change' }],
  eee: [{ required: true, message: '仪器地址不能为空', trigger: 'blur' }],
  fff: [{ required: true, message: '客户单位名称不能为空', trigger: 'blur' }],
  // ggg: [{ required: true, message: '客户编号不能为空', trigger: 'blur' }],
  hhh: [{ required: true, message: '客户联系人不能为空', trigger: 'blur' }],
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
}

const formRef = ref()
const form = ref({
  TaskID: '',
  aaa: '',
  bbb: '',
  ccc: '',
  ddd: '',
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
})
const loading = ref(false)

// const handleClose = () => {}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      // console.log(form.value)
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
.repairForm {
  background-color: #fff;
  padding: 20px 30px;
}

.date-box /deep/ .el-input__wrapper {
  width: 97%;
}
</style>
