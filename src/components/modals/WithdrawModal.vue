<template lang="pug">
.withdraw.modal.component
  .header
    span WITHDRAW
    i.material-icons(@click="close(null)") close

  .body
    .form(v-if="!withdrew && !error")
      .eth.balance-row
        .left
          span.currency ETH
          span.balance {{ed_wallet.eth_balance}}
          input(placeholder="0.00" step=".01" type="number" v-model="eth_amount")
        .right
          .button(@click="withdrawEth()")  WITHDRAW

      .alt.balance-row
        .left
          span.currency {{token.name}}
          span.balance {{ed_wallet.current_token_balance}}
          input(placeholder="0.00" step=".01" type="number" v-model="token_amount")
        .right
          .button(@click="withdrawToken()")  WITHDRAW

    .withdew(v-else)
      .success(v-if="!error")
        span.title Successfully created transaction!
        a.txn(:href="'https://etherscan.io/tx/' + txn" target="_blank") {{txn}}
      .error(v-else)
        p Error:
        p {{error_message}}

  overlay(:visible="loading")
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import APIs from '@/store/apis'
import Overlay from '@/components/Overlay'

export default {
  name: 'WithdrawModal',
  components: {
    Overlay
  },
  data(){
    return {
      eth_amount: 0.000,
      token_amount: 0.000,
      withdrew: false,
      txn: null,
      loading: false,
      error: false,
      error_message: null
    }
  },
  methods: {
    ...mapMutations({
      close: "components/CLOSE_MODAL"
    }),
    withdrawEth(){
      this.loading = true
      APIs.EtherDelta.withdrawEth(this.eth_amount).then(result => {
        this.loading = false
        this.withdrew = true
        this.txn = result
        log("result: ", result)
      }).catch(error => {
        this.loading = false
        this.error= true
        this.error_message = error.message
        log("error: ", error)
      })
    },
    withdrawToken(){
      this.true = false
      APIs.EtherDelta.withdrawToken(this.token.addr, this.token_amount).then(result => {
          this.loading = false
          this.withdrew = true
          this.txn = result
        log("withdrawToken result: ", result)
      }).catch(error => {
        this.loading = false
        this.error= true
        this.error_message = error.message
        log("error: ", error)
      })
    }
  },
  computed: {
    ...mapGetters({
      token: 'tokens/current_token',
      current_wallet: 'users/current_wallet',
      ed_wallet: 'users/ed_wallet',
    }),
  },
  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../../styles/main.styl"
.withdraw
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
        margin-bottom .5em
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
            margin-top 5px
            flex-basis 100%

        .right
          height 100%
          display flex
          align-items flex-end
          margin-left auto

          .button
            height 32px
            padding 0px

  .success
    display flex
    flex-wrap wrap
    flex-basis 100%
    .txn
      color $color-yellow
      font-family 'Open Sans', sans-serif

  .error
    display flex
    flex-wrap wrap
    flex-basis 100%

</style>
