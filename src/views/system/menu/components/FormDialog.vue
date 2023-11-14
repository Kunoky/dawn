<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="(form.menuId ? '编辑' : '新增') + '菜单'"
    width="60%"
    v-bind="$attrs"
  >
    <el-form :model="form" ref="formRef" label-width="100" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parentId">
            <el-tree-select
              v-model="form.parentId"
              :data="menus"
              check-strictly
              node-key="menuId"
              :props="{ label: 'menuName' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="form.menuType">
              <el-radio :label="1">标准</el-radio>
              <el-radio :label="2">权限</el-radio>
              <el-radio :label="3">外链</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.menuType !== 2">
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="form.icon" placeholder="请输入图标名称如：ep:user">
              <template #prepend>
                <CIcon :icon="form.icon" />
              </template>
              <template #append>
                <el-tooltip content="前往icon市场挑选心仪的图标，复制名称回来粘贴" placement="top">
                  <a href="https://icones.netlify.app/" target="_blank">
                    <el-button><i-ep-search /></el-button>
                  </a>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="path">
            <template #label>
              <el-tooltip content="标准：路由地址如：/user, 权限：权限标识如：user:add，外链：外链地址" placement="top">
                <i-ep-question-filled class="cl-w" />
              </el-tooltip>
              菜单标识
            </template>
            <el-input v-model="form.path" placeholder="请输入菜单标识" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType === 1">
          <el-form-item prop="routeName">
            <template #label>
              <el-tooltip content="和route.name保持一致以便关联, 大驼峰如: User" placement="top">
                <i-ep-question-filled class="cl-w" />
              </el-tooltip>
              路由名称
            </template>
            <el-input v-model="form.routeName" placeholder="请输入路由名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType === 1">
          <el-form-item prop="isCache">
            <template #label>
              <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和路由名称" placement="top">
                <i-ep-question-filled class="cl-w" />
              </el-tooltip>
              是否缓存
            </template>
            <el-radio-group v-model="form.isCache">
              <el-radio v-for="i in bool.options" :label="i.value" :key="i.value">{{ i.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType === 1">
          <el-form-item prop="visible">
            <template #label>
              <el-tooltip content="选择否后菜单不显示，但仍然可以访问" placement="top">
                <i-ep-question-filled class="cl-w" />
              </el-tooltip>
              是否显示
            </template>
            <el-radio-group v-model="form.visible">
              <el-radio v-for="i in bool.options" :label="i.value" :key="i.value">{{ i.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="status">
            <template #label>
              <el-tooltip content="是否启用该数据" placement="top">
                <i-ep-question-filled class="cl-w" />
              </el-tooltip>
              状态
            </template>
            <el-radio-group v-model="form.status">
              <el-radio v-for="i in status.options" :label="i.value" :key="i.value">
                {{ i.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
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
  menus: Array,
  parentId: String,
})

const rules = {
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  path: [
    { required: true, message: '菜单标识不能为空', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: (_, v, cb) => {
        if (v === '*:*:*') return cb(new Error('非法数据'))
        cb()
      },
    },
  ],
  routeName: [{ required: true, message: '路由名称不能为空', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

const bool = useDict('bool')
const status = useDict('status')

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        menuId: undefined,
        parentId: props.parentId,
        menuType: 1,
        icon: '',
        menuName: '',
        orderNum: 0,
        path: '',
        routeName: '',
        isCache: true,
        visible: true,
        status: true,
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
      loading.value = true
      req[form.value.menuId ? 'put' : 'post']('menu', form.value)
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
