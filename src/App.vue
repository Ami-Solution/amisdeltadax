<template lang="pug">
#app
  .navbar-container(v-if="$route.name == 'exchange'")
    navbar

  .router-view-container
    // transition(name="fade" mode='out-in')
    router-view


  modal-loader
  toast
</template>

<script>
import Navbar from '@/components/Navbar'
import ModalLoader from '@/components/ModalLoader'
import Toast from '@/components/Toast'
export default {
  components: {
    Navbar,
    ModalLoader,
    Toast,
  },
  name: 'app',
  created(){
    console.log("%cWelcome to the AmisDeltaDax Exchange", 'background: #222; color: #4dccff; font-size: 18px')
  },
}
</script>

<style lang="stylus">
@import "./styles/main.styl"

$navbar-height = 50px

#app
  height 100%

  .navbar-container
    flex-basis 100%
    height $navbar-height

  .router-view-container
    flex-basis 100%
    height calc(100vh - 50px)

</style>
