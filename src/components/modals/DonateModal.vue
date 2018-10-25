<template lang="pug">
.donate-modal.modal.component
  .header
    span DONATE (THANK YOU!)
    i.material-icons(@click="close(null)") close

  .body
    .form(v-if="!donated && !error")
      .eth.balance-row
        .left
          span.currency ETH
          span.balance {{wallet.eth_balance}}
          input(placeholder="0.00" type="number" v-model="eth_amount")
        .right
          .button(@click="donateEth()")  DONATE!

    .donated(v-else)
      .success(v-if="donated")
        span Thank you so much!
      .error(v-else)
        p Error:
        p Donation not successful
        //- .alt.balance-row
      //-   .left
      //-     span.currency {{token.name}}
      //-     span.balance {{wallet.current_token_balance}}
      //-     input(placeholder="0.00" type="number" v-model="token_amount")
      //-   .right
      //-     .button(@click="donateToken()")  DONATE!
  overlay(:visible="loading")

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import APIs from '@/store/apis'
import Overlay from '@/components/Overlay'

export default {
  name: 'DonateModal',
  components: {
    Overlay
  },
  data(){
    return {
      eth_amount: 0.00,
      token_amount: 0.00,
      donated: false,
      loading: false,
      error: false,
      error_message: null
    }
  },
  methods: {
    ...mapMutations({
      close: "components/CLOSE_MODAL"
    }),
    donateEth(){
      this.loading = true
      APIs.EtherDelta.donateEth(this.eth_amount).then(result => {
        this.loading = false
        this.donated = true
        log("result: ", result)
      }).catch(error => {
        this.error = true
        this.error_message = error.message
        this.loading = false
        log("error: ", error)
      })
    },
  },
  computed: {
    ...mapGetters({
      token: 'tokens/current_token',
      wallet: 'users/current_wallet',
      ed_wallet: 'users/ed_wallet',
    }),
  },
  mounted(){

  }
}
</script>


<style lang="stylus">

.donate-modal
  flex-basis 30% !important
  .body
    display flex
    .form
      display flex
      flex-wrap wrap
      flex-basis 100%

      .balance-row
        display flex
        align-items center
        justify-content space-between
        margin-bottom 1em
        align-items center
        flex-basis 100%

        .left
          display flex
          flex-grow 1
          flex-wrap wrap
          padding-right 2em

          span.currency
            font-size 14px
            font-weight 700

          span.balance
            font-size 14px
            font-weight 700
            margin-left auto

          input
            margin-top 8px
            flex-basis 100%

        .right
          height 100%
          display flex
          align-items flex-end
          margin-left auto

          .button
            height 32px
            padding 0px


</style>
