<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="(form.menuId ? '编辑' : '新增') + '菜单'"
    width="60%"
    v-bind="$attrs"
  >
    <el-form :model="form" ref="formRef" label-width="80" :show-message="false" :rules="rules">
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
              <el-radio label="M">目录</el-radio>
              <el-radio label="C">菜单</el-radio>
              <el-radio label="F">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.menuType != 'F'">
          <el-form-item label="菜单图标" prop="icon">
            <!-- <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
              <IconSelect ref="iconSelect" @selected="selected" :active-icon="form.icon" />
              <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" style="width: 25px" />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 'F'">
          <el-form-item prop="isFrame">
            <template #label>
              <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              是否外链
            </template>
            <el-radio-group v-model="form.isFrame">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 'F'">
          <el-form-item prop="path">
            <template #label>
              <el-tooltip
                content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
              路由地址
            </template>
            <el-input v-model="form.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 'C'">
          <el-form-item prop="component">
            <template #label>
              <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              组件路径
            </template>
            <el-input v-model="form.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 'M'">
          <el-form-item prop="perms">
            <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
            <template #label>
              <el-tooltip
                content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
              权限字符
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 'C'">
          <el-form-item prop="query">
            <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
            <template #label>
              <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              路由参数
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 'C'">
          <el-form-item prop="isCache">
            <template #label>
              <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              是否缓存
            </template>
            <el-radio-group v-model="form.isCache">
              <el-radio label="0">缓存</el-radio>
              <el-radio label="1">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 'F'">
          <el-form-item prop="visible">
            <template #label>
              <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              显示状态
            </template>
            <el-radio-group v-model="form.visible">
              <el-radio v-for="i in dict.options" :label="i.value" :key="i.value">
                {{ i.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 'F'">
          <el-form-item prop="status">
            <template #label>
              <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              菜单状态
            </template>
            <el-radio-group v-model="form.status">
              <el-radio v-for="i in dict.options" :label="i.value" :key="i.value">
                {{ i.label }}
              </el-radio>
            </el-radio-group>
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
  parentId: Number,
})

const rules = {
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

const dict = useDict('sys_show_hide')

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        menuId: undefined,
        parentId: props.parentId,
        menuType: 'M',
        icon: '',
        menuName: '',
        orderNum: 0,
        isFrame: '0',
        path: '',
        component: '',
        perms: '',
        query: '',
        isCache: '',
        visible: '0',
        status: '0',
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
      req[form.value.menuId ? 'put' : 'post']('system/menu', form.value)
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
