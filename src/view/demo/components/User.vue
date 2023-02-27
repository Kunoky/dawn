<template>
  <span v-if="user">
    <b>{{ user[id].name }}</b>
    <span>{{ user[id].phone }}</span>
  </span>
</template>
<script>
import { useAppStore } from '@/store/app'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'DemoUser',
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {}
  },
  created() {
    if (!this.user[this.id]) {
      this.getUser(this.id)
    }
  },
  computed: {
    ...mapState(useAppStore, ['user']),
  },
  methods: {
    ...mapActions(useAppStore, ['getUser']),
  },
}
</script>
