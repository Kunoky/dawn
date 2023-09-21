<template>
  <el-row :gutter="16">
    <el-col :span="6">
      <el-card>
        <template #header>个人信息</template>
        <ul>
          <li class="dp-f lh-1 bdb">
            <span class="cl-7">
              <CIcon icon="ep:user" />
              用户名称
            </span>
            <span class="fx-1 ta-r">{{ user.userName }}</span>
          </li>
          <li class="dp-f lh-1 bdb">
            <span class="cl-7">
              <i-ep-cellphone />
              手机号码
            </span>
            <span class="fx-1 ta-r">{{ user.phoneNumber }}</span>
          </li>
          <li class="dp-f lh-1 bdb">
            <span class="cl-7">
              <CIcon icon="ep:message" />
              用户邮箱
            </span>
            <span class="fx-1 ta-r">{{ user.email }}</span>
          </li>
          <li class="dp-f lh-1 bdb">
            <span class="cl-7">
              <CIcon icon="ant-design:apartment-outlined" />
              所属部门
            </span>
            <span class="fx-1 ta-r">{{ user.orgName }}</span>
          </li>
          <li class="dp-f lh-1 bdb">
            <span class="cl-7">
              <CIcon icon="ant-design:idcard-outlined" />
              所属角色
            </span>
            <span class="fx-1 ta-r">{{ user.roles.join(',') }}</span>
          </li>
          <li class="dp-f lh-1 bdb">
            <span class="cl-7">
              <i-ep-calendar />
              创建日期
            </span>
            <span class="fx-1 ta-r">{{ user.createTime }}</span>
          </li>
        </ul>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card>
        <template #header>个人信息</template>
        <el-tabs v-model="tab">
          <el-tab-pane label="基本资料" name="1">
            <el-form :model="baseForm" ref="baseRef" label-width="80" :rules="baseRules">
              <el-form-item label="用户昵称" prop="userName">
                <el-input v-model="baseForm.userName" maxlength="30" />
              </el-form-item>
              <el-form-item label="手机号码" prop="phoneNumber">
                <el-input v-model="baseForm.phoneNumber" maxlength="11" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="baseForm.email" maxlength="50" />
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="baseForm.sex">
                  <el-radio v-for="i in gender.options" :key="i.value" :label="i.value">
                    {{ i.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitBase" :loading="baseLoading">{{ $t('common.save') }}</el-button>
                <el-button type="danger" @click="close">{{ $t('common.close') }}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="2">
            <el-form :model="pwdForm" ref="pwdRef" label-width="80" :rules="pwdRules">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="pwdForm.oldPassword" placeholder="请输入旧密码" type="password" show-password />
              </el-form-item>
              <el-form-item label="新密码" prop="password">
                <el-input v-model="pwdForm.password" placeholder="请输入新密码" type="password" show-password />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="pwdForm.confirmPassword" placeholder="请确认新密码" type="password" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitPwd" :loading="pwdLoading">{{ $t('common.save') }}</el-button>
                <el-button type="danger" @click="close">{{ $t('common.close') }}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup name="UserProfile">
definePage({
  meta: {
    title: '个人中心',
    public: true,
  },
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tab = ref('1')

const baseRef = ref()
const baseForm = reactive({
  userId: user.userId,
  userName: '',
  phoneNumber: '',
  email: '',
  sex: 1,
})
watch(
  user,
  v => {
    for (let k in baseForm) {
      baseForm[k] = v[k]
    }
  },
  { immediate: true }
)
const baseRules = ref({
  userName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  phoneNumber: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
})
const gender = useDict('gender')

const { run: editBase, loading: baseLoading } = useAsync(() => req.put('user', baseForm))
const submitBase = () => {
  baseRef.value.validate(valid => {
    if (valid) {
      editBase().then(() => userStore.getUser(true))
    }
  })
}

const pwdRef = ref()
const pwdForm = reactive({
  oldPassword: '',
  password: '',
  confirmPassword: '',
})
const pwdCheck = (_, value, callback) => {
  if (pwdForm.password !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const pwdRules = ref({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { required: true, validator: pwdCheck, trigger: 'blur' },
  ],
})
const { run: editPwd, loading: pwdLoading } = useAsync(() => {
  const { oldPassword, password } = pwdForm
  return req.put('user/updatePassword', { userId: user.userId, oldPassword, password })
})
const submitPwd = () => {
  pwdRef.value.validate(valid => {
    if (valid) {
      editPwd()
    }
  })
}

const router = useRouter()
const close = () => {
  router.back()
}
</script>
