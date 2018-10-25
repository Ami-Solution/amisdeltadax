<template lang="pug">
.recent-trades-list
  .order-list-header
    span.Type Type
    span.volume Volume
    span.price Price
    span.time Time

  .order-list
    .order-container(v-for='trade in trades' v-if="trades.length")
      .order(:class="{'buy': trade.side == 'buy', 'sell': trade.side == 'sell'}")
        .info.type-container
          span.type {{trade.side}}
        .info.volume-container
          span.volume {{parseFloat(trade.amount).toFixed(4)}}
        .info.price-container
          span.price {{priceFormat(trade.price)}}
        .info.time-container
          span.time {{timeFormat(trade.date)}}
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'RecentTradesList',
  props: {
    trades: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    priceFormat(price){
      return parseFloat(price).toFixed(9)
    },
    timeFormat(dateString){
      let d = new Date(dateString)
      return moment(d).fromNow()
    },
  },
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

.recent-trades-list
  flex-basis 100%

  .order-list-header
    display flex
    flex-basis 100%
    padding 3px 0px
    align-items center
    border-bottom solid 1px lighten($color-component-background, 13%)
    background $color-component-background
    box-shadow 0px 1px 1px 1px rgba(0, 0, 0, .2)
    justify-content space-around
    margin-bottom 2px

    span
      text-align right
      font-size 13px
      font-weight 400

      &.type
        text-align center
      &.volume
        text-align center
      &.price
        text-align center
      &.fee
        text-align center
      &.time
        text-align center
  .order-list
    display block
    flex-basis 100%
    overflow auto
    flex-wrap wrap
    height 100%

    .empty
      display flex
      flex-basis 100%
      align-items center
      justify-content center
      margin-top 2em
      span
        font-size 16px
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
          line-height 1
          align-items center
          justify-content center
          flex-basis 25%
          flex-grow 1
          text-align center

        .type-container
          text-transform uppercase
          height 100%


        .volume-container

          height 100%
        .price-container
          line-height 1
          justify-content center
          padding 2px 0px

        .time-container
          line-height 1

        &:hover
          background lighten($color-component-background, 15%)

        &.sell
          span.type
              color $color-red
        &.buy
          span.type
            color $color-green

</style>
