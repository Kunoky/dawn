<template>
  <el-dialog :model-value="modelValue" @close="handleClose" :title="title" width="60%" v-bind="$attrs">
    <el-form :model="form" ref="formRef" label-width="120" :rules="rules" v-loading="dataLoading">
      <h4 class="mgb-m">FSE信息</h4>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="fseName">
            <el-input v-model="form.fseName" placeholder="请输入FSE姓名" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="ID" prop="fseId">
            <el-input v-model="form.fseId" placeholder="请输入FSE ID" />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="Work Center" prop="fseWorkCenter">
            <el-input v-model="form.fseWorkCenter" placeholder="请输入FSE work center" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Storage Location" prop="fseStorageLocation">
            <el-input v-model="form.fseStorageLocation" placeholder="请输入FSE Storage Location" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="isCrc">
            <el-radio-group v-model="form.isCrc">
              <el-radio v-for="i in bool.options" :key="i.value" :label="i.value">
                {{ i.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Team" prop="team">
            <el-input v-model="form.team" placeholder="请输入team" />
          </el-form-item>
        </el-col>
      </el-row>
      <h4 class="mgb-m">基础信息</h4>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户昵称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织" prop="orgId">
            <el-tree-select
              v-model="form.orgId"
              :data="orgTree"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="id"
              placeholder="请选择组织"
              check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.userId == undefined">
        <el-col :span="12">
          <el-form-item label="登录名称" prop="loginName">
            <el-input v-model="form.loginName" placeholder="请输入登录名称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户密码" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入用户密码"
              type="password"
              maxlength="20"
              show-password
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户性别">
            <el-select v-model="form.sex" placeholder="请选择">
              <el-option v-for="i in gender.options" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio v-for="i in status.options" :key="i.value" :label="i.value">
                {{ i.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select v-model="form.roleIds" multiple placeholder="请选择">
              <el-option v-for="i in roleOptions" :key="i.roleId" :label="i.roleName" :value="i.roleId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
  orgTree: Array,
})

const title = computed(() => (props.data ? '编辑用户' : '新增用户'))

const rules = {
  loginName: [
    { required: true, message: '登录名称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '登录名称长度必须介于 2 和 20 之间', trigger: 'blur' },
  ],
  userName: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '用户密码不能为空', trigger: 'blur' },
    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  phoneNumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

const gender = useDict('gender')
const status = useDict('status')
const bool = useDict('bool')

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        fseName: '',
        // fseId: '',
        fseWorkCenter: '',
        fseStorageLocation: '',
        userId: undefined,
        orgId: undefined,
        loginName: '',
        userName: '',
        password: '',
        phoneNumber: '',
        email: '',
        sex: 1,
        status: 1,
        remark: '',
        roleIds: [],
        isCrc: 0,
        team: '',
      }
      nextTick(() => {
        formRef.value.clearValidate()
      })
      props.data?.userId && getUser()
    }
  },
  { immediate: true }
)
const { data: roleOptions } = useAsync(() => req('role/all').then(res => res.data), { manual: false })
const { run: getUser, loading: dataLoading } = useAsync(
  async () => {
    return req.get('user/' + props.data.userId)
  },
  {
    onSuccess(res) {
      form.value = res.data
      form.password = ''
      nextTick(() => {
        formRef.value.clearValidate()
      })
    },
  }
)
const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      req[form.value.userId ? 'put' : 'post']('user', form.value)
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
