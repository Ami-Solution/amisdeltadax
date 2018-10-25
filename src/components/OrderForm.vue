<template lang="pug">
.order-form.component
  .header
    span(:class="{'active': !orderForm.trade_order}") PLACE ORDER

  .body
    .buy-or-sell
      div.button.buy(@click="orderForm.order_type = 'buy'" :class="{'active': orderForm.order_type == 'buy'}")
        span BUY
      div.button.sell(@click="orderForm.order_type = 'sell'" :class="{'active': orderForm.order_type == 'sell'}")
        span SELL

    .price-container
      span.label Price
      .input-container
        input(placeholder="0.00" type="number" v-model="orderForm.price")
        span.info ETH

    .amount-container
      span.label Amount
      .input-container
        input(placeholder="0.00" type="number" v-model="orderForm.volume")
        span.info {{token.name}}


    .total-container
      span.info TOTAL
      span.eth (ETH)
      span.total {{total}}

    .expires-container
      span.label Expires
      .input-container
        input(placeholder="number of blocks" type="number" v-model="orderForm.expires")

    .place-order-container
      div.button.place-order(@click="submitOrder()" :class="{'sell': orderForm.order_type == 'sell', 'disabled': !validOrder}" v-if="!orderForm.trade_order")
        span PLACE {{orderForm.order_type.toUpperCase()}} ORDER
      div.button.trade(@click="submitTrade()" :class="{'sell': orderForm.order_type == 'sell', 'disabled': !validOrder}" v-else)
        span PLACE {{orderForm.order_type.toUpperCase()}} TRADE
</template>

<script>
import APIs from '@/store/apis'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'OrderForm',
  data(){
    return {

    }
  },
  props: {
    token: {
      default: null
    }
  },
  methods: {
    ...mapMutations({
      openModal: "components/OPEN_MODAL",
      updateOrderForm: 'orders/UPDATE_ORDER_FORM',
    }),
    ...mapActions({
      placeOrder: "orders/place_order",
    }),
    alertUser(){
      if(!this.orderForm.trade_order){
        alert("Select an order from the Order Book to trade with")
      }
    },
    submitOrder(){

      if(this.validOrder){
        this.openModal("OrderConfirmModal")
        // // Assume Eth
        // var tokenGive, tokenGet, amountGive, amountGet

        // // Convert amounts to Wei
        // if(this.orderForm.order_type == "buy"){
        //   tokenGive = '0x0000000000000000000000000000000000000000'
        //   tokenGet  = this.token.addr
        //   amountGive = APIs.EtherDelta.toWei(this.orderForm.volume * this.orderForm.price, 18)
        //   amountGet = APIs.EtherDelta.toWei(this.orderForm.volume, this.token.decimals)
        // } else {
        //   tokenGive = this.token.addr
        //   tokenGet  = '0x0000000000000000000000000000000000000000'
        //   amountGive = APIs.EtherDelta.toWei(this.orderForm.volume, this.token.decimals)
        //   amountGet = APIs.EtherDelta.toWei(this.orderForm.volume * this.orderForm.price, 18)
        // }

        // let data = {
        //   tokenGet,
        //   amountGet,
        //   tokenGive,
        //   amountGive,
        //   expires: this.orderForm.expires,
        //   nonce: parseInt(1000000000 * Math.random())
        // }
        // this.placeOrder(data)
      }
    },
  },
  computed: {
    ...mapGetters({
      orderForm: "orders/order_form",
    }),
    validOrder(){
      if(parseFloat(this.orderForm.price) <= 0){
        return false
      }
      if(parseFloat(this.orderForm.volume) <= 0){
        return false
      }
      if(parseInt(this.orderForm.expires) <= 0){
        return false
      }
      if(this.orderForm.order_type != "buy" && this.orderForm.order_type != "sell"){
        return false
      }
      return true
    },
    total(){
      let total = this.orderForm.price * this.orderForm.volume
      return total.toFixed(5)
      // return Math.round(total, -2)
    }
  },
  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

.order-form
  display flex
  flex-wrap wrap

  .body
    display flex
    flex-wrap wrap
    padding 1em

    .buy-or-sell
      display flex
      align-items center
      justify-content center
      flex-basis 100%
      margin-bottom 1em

      .button
        font-size 12px
        border none
        border-radius 1px
        background lighten($color-component-background, 5%)
        padding-top 1em
        padding-bottom 1em
        transition all .2s

        span
          color white

        &:hover
          background lighten($color-component-background, 15%)
        &.buy
          margin-right 2px
        &.active.buy
          background $color-green-dark
        &.sell
          margin-left 2px
        &.active.sell
          background $color-red

    .amount-container, .price-container, .expires-container
      flex-basis 100%
      display flex
      flex-wrap wrap
      margin-bottom 1em
      .label
        flex-basis 100%
        font-size 10px
        margin-bottom 5px
        font-weight bold
      .input-container
        display flex
        position relative
        flex-basis 100%
        .info
          line-height 1
          position absolute
          font-size 12px
          font-weight bold
          top 11px
          right 14px

    .total-container
      display flex
      flex-basis 100%
      align-items center
      margin-bottom 1em

      span
        font-weight bold
        font-size 12px

        &.eth
          font-size 10px
          font-weight 500
          margin-left 5px
        &.total
          margin-left auto

    .place-order-container
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

        &.disabled
          background lighten($color-green-dark, 25%)
          cursor not-allowed

        &.sell
          background $color-red
          &:hover
            background lighten($color-red, 15%)

          &.disabled
            background lighten($color-red, 25%)
            cursor not-allowed

</style>
