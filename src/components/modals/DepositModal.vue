<template lang="pug">
.deposit.modal.component
  .header
    span DEPOSIT
    i.material-icons(@click="close(null)") close

  .body
    .form(v-if="!deposited && !error")
      .eth.balance-row
        .left
          span.currency ETH
          span.balance {{wallet.eth_balance}}
          input(placeholder="0.00" step="0.01" type="number" v-model="eth_amount")
        .right
          .button(@click="depositEth()")  DEPOSIT

      .alt.balance-row
        .left
          span.currency {{token.name}}
          span.balance {{wallet.current_token_balance}}
          input(placeholder="0.00" step="0.01" type="number" v-model="token_amount")
        .right
          .button(@click="depositToken()")  DEPOSIT

    .deposited(v-else)
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
  name: 'DepositModal',
  components: {
    Overlay
  },
  data(){
    return {
      eth_amount: 0.000,
      token_amount: 0.000,
      deposited: false,
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
    depositEth(){
      this.loading = true
      APIs.EtherDelta.depositEth(this.eth_amount).then(result => {
        this.loading = false
        this.deposited = true
        this.txn = result
        log("result: ", result)
      }).catch(error => {
        this.loading = false
        this.error= true
        this.error_message = " Transaction canceled"
        log("error: ", error)
      })
    },
    depositToken(){
      this.loading = true
      APIs.EtherDelta.approve(this.token.addr, this.token_amount).then(result => {
        log("approve result: ", result)
        APIs.EtherDelta.depositToken(this.token.addr, this.token_amount).then(result => {
          this.loading = false
          this.deposited = true
          this.txn = result
          log("depositToken result: ", result)
        }).catch(error => {
          this.loading = false
          this.error= true
          this.error_message = " Transaction canceled"
          log("error: ", error)
        })
      }).catch(error => {
        this.loading = false
        this.error= true
        this.error_message = " Transaction canceled"
        log("error: ", error)
      })
    }
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
@import "../../styles/main.styl"
.deposit
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
