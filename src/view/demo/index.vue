<template>
  <div class="ht-100">
    <section v-loading="loading.posts" class="ht-100 dp-f fd-c">
      <div class="bg">
        <h3>posts 列表</h3>
        <div>total: {{ total }}</div>
        <div class="ta-r">
          <b class="bottom-m pt-r">Permissions:</b>
          <div class="permission-group">
            <span><el-button v-permission type="primary">logged in</el-button></span>
            <span><el-button v-permission:demo type="primary">demo</el-button></span>
            <span><el-button v-permission:demo="0" type="primary">create</el-button></span>
            <span><el-button v-permission:demo="1" type="primary">update</el-button></span>
            <span><el-button v-permission:demo="2" type="primary">delete</el-button></span>
            <span><el-button v-if="hasP(3)" type="primary">custom 4</el-button></span>
            <span><el-button v-if="$hasPermission('demo', 4)" type="primary">custom 5</el-button></span>
          </div>
        </div>
      </div>
      <ul class="bg ls-n fl-1 of-a">
        <li v-for="i in posts" :key="i.id" class="bsd-4 pd-m mgb-m tc-8">
          <div>
            <span>ID:</span>
            &nbsp;
            <b>{{ i.id }}</b>
            &nbsp;&nbsp;
            <demo-user :id="i.userId" />
          </div>
          <b>{{ i.title }}</b>
          <p class="tc-7 mgb-0">{{ i.body }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { useAppStore } from '@/store/app'
import { mapState, mapActions } from 'pinia'
import DemoUser from './components/User.vue'

export default {
  name: 'DemoC',
  components: { DemoUser },
  data() {
    return {
      post: null,
    }
  },
  setup() {
    const hasP = usePermission('demo')
    return {
      hasP,
    }
  },
  created() {
    this.listPost()
  },
  computed: {
    ...mapState(useAppStore, ['posts', 'total', 'loading']),
  },
  methods: {
    ...mapActions(useAppStore, ['listPost']),
  },
}
</script>
<style lang="scss">
.permission-group {
  margin-left: var(--size-s);
  display: inline-block;
  border: 1px dashed var(--gray-5);
  height: 48px;
  & > span {
    width: 100px;
    height: 48px;
    line-height: 48px;
    vertical-align: bottom;
    display: inline-block;
    text-align: center;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='14' fill='%23a2a9b6' font-family='system-ui, sans-serif' text-anchor='middle' dominant-baseline='middle'%3Eaction%3C/text%3E%3C/svg%3E");
    & + span {
      border-left: 1px dashed var(--gray-5);
    }
  }
}
</style>
