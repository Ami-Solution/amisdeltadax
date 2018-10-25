<template lang="pug">
.order.modal.component
  .header
    span Confirm Order
    i.material-icons(@click="close(null)") close

  .body
    .form
      .price.row
        span.label Price
        span.details (ETH / {{current_market.currency}})
        span.amount {{orderForm.price}}
      .volume.row
        span.label Volume
        span.details ({{current_market.currency}})
        span.amount {{orderForm.volume}}
      .total.row
        span.label Total
        span.amount {{total}}

      .place-order-container
        .button.place-order(@click="placeOrder()" :class="{'sell': orderForm.order_type == 'sell'}")
          span CONFIRM {{orderForm.order_type.toUpperCase()}} ORDER

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'OrderModal',
  data(){
    return {

    }
  },
  methods: {
    ...mapMutations({
      close: "components/CLOSE_MODAL"
    }),
    placeOrder(){
      log("PLACE ORDER")
    }
  },
  computed: {
    ...mapGetters({
      current_market: 'markets/current_market',
      current_wallet: 'users/current_wallet',
      ed_wallet: 'users/ed_wallet',
      orderForm: "orders/order_form",
    }),
    total(){
      let total = this.orderForm.price * this.orderForm.volume
      return total.toFixed(9)
    }
  },
  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../../styles/main.styl"
.order.modal
  flex-basis 20% !important
  .body
    display flex
    .form
      display flex
      flex-wrap wrap
      flex-basis 100%

      .row
        display flex
        flex-wrap wrap
        flex-basis 100%
        align-items center

        .label
          font-size 14px
          font-weight 700

        .details
          font-size 12px
          font-weight 400
          padding-left 5px

        .amount
          font-size 12px
          font-weight 700
          margin-left auto

      .total
        border-top 1px solid $color-text
        padding-top 5px
        margin-top 10px

    .place-order-container
      margin-top 20px
      flex-basis 100%
      display flex
      border none

      .button
        flex-basis 100%
        border none
        border-radius 3px
        background lighten($color-component-background, 5%)
        padding-top 1.2em
        padding-bottom 1.2em
        background $color-green-dark
        font-size 13px
        transition all .2s

        span
          color white

        &:hover
          background lighten($color-green-dark, 15%)

        &.sell
          background $color-red
          &:hover
            background lighten($color-red, 15%)



</style>
