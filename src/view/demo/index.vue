<template>
  <div class="dp-f fd-c ht-100">
    <h2>demo</h2>
    <section v-loading="loading.posts" class="fl-1 of-a">
      <h3>posts 列表</h3>
      <div>total: {{ total }}</div>
      <ul class="ls-n">
        <li v-for="i in posts" :key="i.id" class="bsd-4 pd-m mgb-m">
          <div>
            <span>ID:</span>
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
