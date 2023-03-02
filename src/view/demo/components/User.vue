<template>
  <span>
    <b>{{ user.name }}</b>
    <span>{{ user.phone }}</span>
  </span>
</template>
<script>
import { useAppStore } from '@/store/app'
import { mapState } from 'pinia'

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

  computed: {
    ...mapState(useAppStore, ['getUserById']),
    user() {
      const u = this.getUserById(this.id)
      return u || {}
    },
  },
}
</script>
