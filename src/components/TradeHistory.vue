<template lang="pug">
.trade-history.component
  .header
    span TRADE HISTORY
  .body
    .trade-list-header
      span.volume Volume
      span.price Price
      span.time Time
    .trade-list
      .trade-container(v-for='trade in trades')
        .trade(:class="{'buy': trade.side == 'buy', 'sell': trade.side == 'sell' }" @click="goToTx(trade.txHash)")
          .info.volume-container(:style="tradeStyle(trade)")
            span.volume {{trade.amount.toFixed(4)}}
          .info.price-container
            span.price {{trade.price.toFixed(9)}}
          .info.time-container
            span.time {{trade.formatted_date}}

  overlay(:visible="tradeHistory.loading")
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Overlay from '@/components/Overlay'

export default {
  name: 'TradeHistory',
  components: {
    Overlay
  },
  props: {
    trades: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    goToTx(tx){
      window.open('https://etherscan.io/tx/' + tx)
    },
    tradeStyle(trade){
      let total = trade.amount * trade.price
      let percent = Math.ceil((total / this.maxAmount) * 100)
      let color = "rgba(132,247,102,.6) "
      if(trade.side == "sell"){
        color = "rgba(255,105,57,.55) "
      }
      let style = "background: linear-gradient(to right," + color + percent + "%, rgba(0, 0, 0, 0)" + percent + "%)"
      return style
    }
  },
  computed: {
    ...mapGetters({
      tradeHistory: "components/trade_history",
    }),
    maxAmount(){
      let max = 0
      this.trades.forEach(t => {
        if((t.amount * t.price) > max){
          max = t.amount * t.price
        }
      })
      return max
    }
  },

  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

.trade-history
  display flex
  flex-wrap wrap
  height 100%
  position relative

  .body
    display flex
    flex-wrap wrap
    overflow hidden
    height 100%

    .trade-list-header
      display flex
      flex-basis 100%
      padding 3px 0px
      align-items center
      border-bottom solid 1px lighten($color-component-background, 13%)
      box-shadow 0px 1px 1px 1px rgba(0, 0, 0, .2)
      margin-bottom 2px

      span
        text-align right
        font-size 13px
        font-weight 400
        flex-basis 33%
        &.volume
          flex-basis 40%
        &.price
          flex-basis 35%
          text-align center
        &.time
          flex-basis 25%
          text-align center
    .trade-list
      display block
      flex-basis 100%
      overflow scroll
      flex-wrap wrap
      height 100%

      .trade-container
        display flex
        flex-basis 100%
        cursor pointer

        .trade
          display flex
          flex-basis 100%
          align-items center
          justify-content space-around


          span
            font-size 11px
            font-weight 700
            line-height 1

          .info
            display flex
            flex-basis 33%
            line-height 1
            align-items center
            justify-content center

          .volume-container
            justify-content flex-end
            flex-basis 40%
            height 100%
          .price-container
            line-height 1
            flex-basis 35%
            justify-content center
            padding 2px 0px

          .time-container
            line-height 1
            flex-basis 25%

          &.sell
            span.price
              color $color-red
          &.buy
            span.price
              color $color-green

          &:hover
            background lighten($color-component-background, 15%)

</style>
