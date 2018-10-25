<template lang="pug">
transition(name="fade" mode="out-in")
  .toast(v-if="toast.visible")
    span {{toast.message}}
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'Toast',
  computed: {
    ...mapGetters({
      'toast': "components/toast",
    })
  },
}
</script>

<style lang="stylus">
@import "../styles/main.styl"
.toast
  position fixed
  padding .6em .8em
  background rgba(0, 0, 0, .85)
  color white
  top 22%
  right 6%
  width 120px
  text-align center
</style>
