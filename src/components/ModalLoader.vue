<template lang="pug">
transition(name="fade" mode='out-in')
  .modal-loader(v-if="modalLoader.current_modal" @click="close" ref="modal_loader")
    .modal-container(ref="modal_container")
      DepositModal(v-if="modalLoader.current_modal === 'DepositModal'")
      WithdrawModal(v-if="modalLoader.current_modal === 'WithdrawModal'")
      OrderModal(v-if="modalLoader.current_modal === 'OrderModal'")
      LoadingOverlay(v-if="modalLoader.current_modal === 'LoadingOverlay'")
      TradeConfirmModal(v-if="modalLoader.current_modal === 'TradeConfirmModal'")
      OrderConfirmModal(v-if="modalLoader.current_modal === 'OrderConfirmModal'")
      DonateModal(v-if="modalLoader.current_modal === 'DonateModal'")

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import DepositModal from '@/components/modals/DepositModal'
import WithdrawModal from '@/components/modals/WithdrawModal'
import OrderModal from '@/components/modals/OrderModal'
import LoadingOverlay from '@/components/LoadingOverlay'
import TradeConfirmModal from '@/components/modals/TradeConfirmModal'
import OrderConfirmModal from '@/components/modals/OrderConfirmModal'
import DonateModal from '@/components/modals/DonateModal'

export default {
  name: 'ModalLoader',
  components: {
    DepositModal,
    WithdrawModal,
    OrderModal,
    LoadingOverlay,
    TradeConfirmModal,
    OrderConfirmModal,
    DonateModal,
  },
  data(){
    return {

    }
  },
  methods: {
    ...mapMutations({
      closeModal: 'components/CLOSE_MODAL'
    }),

    close(e){
      if(e.target == this.$refs.modal_loader || e.target == this.$refs.modal_container){
        this.closeModal()
      }
    }
  },
  computed: {
    ...mapGetters({
      modalLoader: 'components/modal_loader'
    }),
  },
  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

.modal-loader
  height 100vh
  width 100vw
  position absolute
  background rgba(0, 0, 0, .4)
  top 0px
  left 0px
  display flex
  align-items center
  justify-content center

  .modal-container
    flex-basis 100%
    display flex
    align-items center
    justify-content center




</style>
