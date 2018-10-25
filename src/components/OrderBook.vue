<template lang="pug">
.order-book.component
  .header
    span ORDER BOOK

    .left
      .option-container
        span Limit
        input(v-model="limit" type="number")
      // .option-container
      //   span Aggregate
      //   input(v-model="agg" type="number" step=".01" min="0")

  .body
    .order-list-header
      span.volume Volume
      span.price Price
      span.time Time
    .order-list
      .order-container(v-for='order in agg_sells')
        .order.sell(@click="onOrderSelected(order)")
          .info.volume-container(:style="volumePercentStyle(order, 'sell')")
            span.volume {{parseFloat(order.ethAvailableVolume).toFixed(4)}}
          .info.price-container
            span.price {{priceFormat(order.price)}}
          .info.time-container
            span.time {{order.formatted_date}}
      .order-container(v-for='order in agg_buys')
        .order.buy(@click="onOrderSelected(order)")
          .info.volume-container(:style="volumePercentStyle(order, 'buy')")
            span.volume {{parseFloat(order.ethAvailableVolume).toFixed(4)}}
          .info.price-container
            span.price {{priceFormat(order.price)}}
          .info.time-container
            span.time {{order.formatted_date}}
  overlay(:visible="orderBook.loading")
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Overlay from '@/components/Overlay'

export default {
  name: 'OrderBook',
  components: {
    Overlay
  },
  data(){
    return {
      orders: [],
      dateFormatter: new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }),
      agg: .01,
      limit: 30
    }
  },
  props: {
    buys: {
      type: Array,
      default: () => []
    },
    sells: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    ...mapMutations({
      updateTradeOrder: 'trades/UPDATE_TRADE_ORDER',
      openModal: "components/OPEN_MODAL",
    }),
    priceFormat(price){
      return parseFloat(price).toFixed(9)
    },
    timeFormat(dateString){
      let d = new Date(dateString)
      return this.dateFormatter.format(d)
    },
    onOrderSelected(order){
      this.updateTradeOrder(order)
      this.openModal("TradeConfirmModal")
    },
    aggregate(orders){
      // let agg_orders = []
      // orders.forEach(order => {
      //   agg_orders.filter(agg_order => {
      //     if(agg_order.price < order.price * (1/this.agg))
      //   })

      // })
    },
    volumePercentStyle(order, side){
      let total = order.amount * order.price
      let percent = Math.ceil((total / this.maxAmount) * 100)
      let color = "rgba(132,247,102,.6) "
      if(side == "sell"){
        color = "rgba(255,105,57,.55) "
      }
      let style = "background: linear-gradient(to right," + color + percent + "%, rgba(0, 0, 0, 0)" + percent + "%)"
      return style
    }

  },
  computed: {
    ...mapGetters({
      orderBook: "components/order_book",
    }),
    agg_buys(){
      return this.buys
        .slice(0, this.limit)
    },
    agg_sells(){
      return this.sells
        .slice(0, this.limit)
        .sort((a, b) => {
          if(a.price > b.price){
            return -1
          }
          if(a.price < b.price){
            return 1
          }
          return 0
        })
    },
    maxAmount(){
      let max = 0
      this.agg_sells.forEach(t => {
        if((t.amount * t.price) > max){
          max = t.amount * t.price
        }
      })
      this.agg_buys.forEach(t => {
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

.order-book
  display flex
  flex-wrap wrap
  height 100%
  overflow hidden
  position relative

  .header
    display flex

    .left
      display flex
      margin-left auto

      .option-container
        display flex
        align-items center
        margin-left 20px
        span
          font-size 11px
          font-weight 700
          color $color-text
          margin-right 10px

        input
          font-size 11px
          width 40px
          height 20px
          color $color-text

  .body
    display flex
    flex-wrap wrap
    height 100%
    width 100%
    overflow hidden
    position relative

    .order-list-header
      display flex
      flex-basis 100%
      padding 3px 0px
      align-items center
      border-bottom solid 1px lighten($color-component-background, 13%)
      box-shadow 0px 1px 1px 1px rgba(0, 0, 0, .2)
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
    .order-list
      display block
      flex-basis 100%
      overflow auto
      flex-wrap wrap
      height 100%

      .order-container
        display flex
        flex-basis 100%
        cursor pointer

        .order
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
