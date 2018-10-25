<template lang="pug">
.open-order-list
  .order-list-header
    span.Type Type
    span.volume Filled / Total
    span.price Price
    span.time Time
    span.cancel Cancel

  .order-list
    .order-container(v-for='order in orders' v-if="orders.length")
      .order(:class="{'buy': side(order) == 'buy', 'sell': side(order) == 'sell'}")
        .info.type-container
          span.type {{side(order)}}
        .info.volume-container
          span.volume {{order.amountFilled.toFixed(4)}} / {{order.amount.toFixed(4)}}
        .info.price-container
          span.price {{priceFormat(order.price)}}
        .info.time-container
          span.time {{timeFormat(order.updated)}}
        .info.cancel-container
          span.cancel(@click="cancel(order)") CANCEL

</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'OpenOrderList',
  props: {
    orders: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    ...mapActions({
      cancelOrder: "orders/cancel_order"
    }),
    ...mapMutations({
      toast: "components/OPEN_TOAST"
    }),
    priceFormat(price){
      return parseFloat(price).toFixed(9)
    },
    timeFormat(dateString){
      let d = new Date(dateString)
      return moment(d).fromNow()
    },
    side(order){
      if(order.tokenGet === '0x0000000000000000000000000000000000000000'){
        return 'sell'
      } else {
        return 'buy'
      }
    },
    cancel(order){
      let data = {
        tokenGet: order.tokenGet,
        amountGet: order.amountGet,
        tokenGive: order.tokenGive,
        amountGive: order.amountGive,
        expires: order.expires,
        nonce: order.nonce,
        v: order.v,
        r: order.r,
        s: order.s
      }
      this.cancelOrder(data).then(results => {
        log("results: ", results)
        this.toast("Successfully Created Transaction")
      }, error => {
        this.toast("Error Creating Transaction")
        log("error: ", error)
      })
    }
  },
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

.open-order-list
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
      flex-basis 20%
      text-align center
      align-items center
      font-size 13px
      font-weight 400

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
      // cursor pointer

      .order
        display flex
        flex-basis 100%
        align-items center
        justify-content space-around
        margin-bottom 2px

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

          .cancel
            padding 1px 4px
            border 1px solid white
            cursor pointer

            &:hover
              background lighten($color-background, 10%)

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

        // &:hover
        //   background lighten($color-component-background, 15%)

        &.sell
          span.type
              color $color-red
        &.buy
          span.type
            color $color-green

</style>
