<template>
  <el-dialog :model-value="modelValue" @close="handleClose" :title="title" width="60%" v-bind="$attrs">
    <el-form :model="form" ref="formRef" label-width="80" :rules="rules" v-loading="dataLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="deptId">
            <el-tree-select
              v-model="form.deptId"
              :data="deptTree"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="id"
              placeholder="请选择归属部门"
              check-strictly
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" name="x" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
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
              <el-option v-for="i in sys_user_sex.options" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio v-for="i in sys_normal_disable.options" :key="i.value" :label="i.value">
                {{ i.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select v-model="form.postIds" multiple placeholder="请选择">
              <el-option
                v-for="i in postOptions"
                :key="i.postId"
                :label="i.postName"
                :value="i.postId"
                :disabled="i.status == 1"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select v-model="form.roleIds" multiple placeholder="请选择">
              <el-option
                v-for="i in roleOptions"
                :key="i.roleId"
                :label="i.roleName"
                :value="i.roleId"
                :disabled="i.status == 1"
              ></el-option>
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
  deptTree: Array,
})

const title = computed(() => (props.data ? '编辑用户' : '新增用户'))

const rules = {
  userName: [
    { required: true, message: '用户名称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' },
  ],
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '用户密码不能为空', trigger: 'blur' },
    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
  phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

const sys_user_sex = useDict('sys_user_sex')
const sys_normal_disable = useDict('sys_normal_disable')

watch(
  () => props.modelValue,
  v => {
    if (v) {
      getUser()
    }
  },
  { immediate: true }
)
const postOptions = ref([])
const roleOptions = ref([])
const { run: getUser, loading: dataLoading } = useAsync(() => req.get('system/user/' + (props.data?.userId || '')), {
  onSuccess(res) {
    postOptions.value = res.posts
    roleOptions.value = res.roles
    if (props.data) {
      form.value = res.data
      form.value.postIds = res.postIds
      form.value.roleIds = res.roleIds
      form.password = ''
    } else {
      form.value = {
        userId: undefined,
        deptId: undefined,
        userName: '',
        nickName: '',
        password: '',
        phonenumber: '',
        email: '',
        sex: '0',
        status: '0',
        remark: '',
        postIds: [],
        roleIds: [],
      }
    }
    nextTick(() => {
      formRef.value.clearValidate()
    })
  },
})
const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      req[form.value.userId ? 'put' : 'post']('system/user', form.value)
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
