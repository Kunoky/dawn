<template>
  <div>
    <section class="bgc-1 pd-m">
      <h4 class="">基本信息</h4>
      <div class="dp-f1 mgt-m cl-8">
        <div class="ta-c">
          <b>用户昵称：</b>
          <span>{{ user.nickName }}</span>
        </div>
        <div class="ta-c">
          <b>登录账号：</b>
          <span>{{ user.userName }}</span>
        </div>
      </div>
    </section>
    <section class="bgc-1 pd-m mgt-m">
      <h4>角色信息</h4>
      <el-table
        v-loading="loading"
        class="mgt-m"
        row-key="roleId"
        @row-click="clickRow"
        ref="tableRef"
        @selection-change="handleSelectionChange"
        :data="list"
      >
        <el-table-column label="序号" width="55" type="index">
          <template #default="scope">
            <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column label="角色编号" prop="roleId" />
        <el-table-column label="角色名称" prop="roleName" />
        <el-table-column label="权限字符" prop="roleKey" />
        <el-table-column label="创建时间" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mgv-s jc-r"
        layout="total, prev, pager, next, sizes, jumper"
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
      />

      <div class="ta-c">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </div>
    </section>
  </div>
</template>

<script setup name="SystemUserRole">
definePage({
  meta: {
    title: '分配角色',
    permission: ['system:user:edit'],
  },
})
const { parseTime } = utils

const user = ref({})
const total = ref(0)
const route = useRoute()
const { data, loading } = useAsync(
  () => {
    return req.get('system/user/authRole/' + route.query.id).then(res => {
      user.value = res.user
      total.value = res.roles.length
      return res.roles
    })
  },
  { manual: false }
)

const pageNum = ref(1)
const pageSize = ref(10)
const tableRef = ref()
const list = computed(() => {
  const l = data.value?.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
  if (!l) return []
  nextTick(() => {
    l.forEach(i => {
      if (i.flag) {
        tableRef.value.toggleRowSelection(i)
      }
    })
  })

  return l
})

/** 单击选中行数据 */
function clickRow(row) {
  tableRef.value.toggleRowSelection(row)
}

const ids = ref([])
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(i => i.roleId)
}

const router = useRouter()
/** 关闭按钮 */
function close() {
  router.push('/system/user')
}
/** 提交按钮 */
function submitForm() {
  const userId = user.value.userId
  const roleIds = ids.value.join(',')
  req.put('system/user/authRole', { userId, roleIds }).then(res => {
    if (res.code === 200) {
      close()
    }
  })
}
</script>
