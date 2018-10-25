<template lang="pug">
.balance.component
  .header
    span Amis Delta Dax Wallet Balance
  .body
    .balance-container
      .eth.balance-row
        span.currency ETH
        span.amount {{edEthBalance.toFixed(9)}}
      .alt.balance-row
        span.currency {{token.name}}
        span.amount {{edTokenBalance.toFixed(9)}}
    .action-container
      div.button.deposit(@click="openModal('DepositModal')")
        i.material-icons eject
        span DEPOSIT
      div.button.withdraw(@click="openModal('WithdrawModal')")
        i.material-icons eject
        span WITHDRAW


</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Balance',
  data(){
    return {

    }
  },
  props: {
    token: {
      default: () => {}
    },
    current_wallet: {
      default: () => {}
    },
    ed_wallet: {
      default: () => {}
    }
  },
  methods: {
    ...mapMutations({
      openModal: "components/OPEN_MODAL"
    })
  },
  computed: {
    ...mapGetters([

    ]),
    edEthBalance(){
      return parseFloat(this.ed_wallet.eth_balance)
    },
    edTokenBalance(){
      return parseFloat(this.ed_wallet.current_token_balance)
    }
  },
  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

.balance
  display flex
  flex-wrap wrap


  .body
    display flex
    flex-wrap wrap

    .balance-container
      padding .5em 1em
      flex-basis 100%

      .balance-header
        margin-bottom 10px
        span
          font-size 13px
          color white
          font-weight 700

      .balance-row
        display flex
        align-items center
        justify-content space-between
        margin-bottom .5em

        span.currency
          font-size 13px
          font-weight 400

        span.amount
          font-size 12px
          font-weight 700

    .action-container
      display flex
      flex-basis 100%
      align-items center
      justify-content space-around
      padding-bottom 1em

      .deposit
        i
          transform rotate(180deg)
          padding-left 5px


</style>
