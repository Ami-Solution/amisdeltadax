<template lang="pug">
.order-confirm.modal.component
  .header
    span.trade-type CONFIRM {{orderForm.order_type.toUpperCase()}} ORDER
    i.material-icons(@click="close(null)") close
  .body
    .form(v-if="!response")
      .field
        .info
          span Amount to {{orderForm.order_type.toUpperCase()}} ({{token.name}})
        input(v-model="orderForm.volume" disabled)
      .field
        .info
          span Price ({{token.name}} / ETH)
        input(v-model="orderForm.price" disabled)
      .field.fee
        .info
          span(v-if="orderForm.order_type === 'sell'") Fee ({{token.name}})
          span(v-else) Fee (ETH)
          span.amount {{fee.toFixed(9)}}
      .field.order
        .info
          span Order (ETH)
          span.amount {{(orderForm.price * orderForm.volume).toFixed(9)}}
      .field
        .button(@click="submitOrder()" :class="{'sell': orderForm.order_type === 'sell'}")
          span {{orderForm.order_type.toUpperCase()}} {{orderForm.volume}} {{token.name}} @ {{orderForm.price}} ETH
    .confirm(v-else)
      span.title {{order_message}}
  overlay(:visible="orderConfirm.loading")
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import APIs from '@/store/apis'
import Overlay from '@/components/Overlay'

export default {
  name: 'OrderConfirmModal',
  data(){
    return {
      response: false,
      order_message: "Order Successfully Placed"
    }
  },
  components: {
    Overlay
  },
  methods: {
    ...mapMutations({
      close: "components/CLOSE_MODAL",
      updateOverlay: "components/UPDATE_ORDER_CONFIRM"
    }),
    ...mapActions({
      placeOrder: "orders/place_order",
    }),
    submitOrder(){
      this.updateOverlay({loading: true})
      let tokenGive, tokenGet, amountGive, amountGet

      // Convert amounts to Wei
      if(this.orderForm.order_type == "buy"){
        tokenGive = '0x0000000000000000000000000000000000000000'
        tokenGet  = this.token.addr
        amountGive = APIs.EtherDelta.toWei(this.orderForm.volume * this.orderForm.price, 18)
        amountGet = APIs.EtherDelta.toWei(this.orderForm.volume, this.token.decimals)
      } else {
        tokenGive = this.token.addr
        tokenGet  = '0x0000000000000000000000000000000000000000'
        amountGive = APIs.EtherDelta.toWei(this.orderForm.volume, this.token.decimals)
        amountGet = APIs.EtherDelta.toWei(this.orderForm.volume * this.orderForm.price, 18)
      }

      let data = {
        tokenGet,
        amountGet,
        tokenGive,
        amountGive,
        expires: this.orderForm.expires,
        nonce: parseInt(1000000000 * Math.random())
      }
      this.placeOrder(data).then(results => {
        this.response = true
        this.order_message = "Order Successfully Placed!"
        this.updateOverlay({loading: false})
      }, error => {
        this.response = true
        this.order_message = "Error Placing Order: "  + error
        this.updateOverlay({loading: false})
      })
    }
  },
  computed: {
    ...mapGetters({
      orderForm: "orders/order_form",
      token: 'tokens/current_token',
      wallet: 'users/current_wallet',
      ed_wallet: 'users/ed_wallet',
      orderConfirm: "components/order_confirm",
    }),
    fee(){
      if(this.orderForm.order_type === 'buy'){
        return parseFloat(this.orderForm.volume) * parseFloat(this.orderForm.price) * .003
      } else {
        return parseFloat(this.orderForm.volume) * .003
      }
    },

  },
  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../../styles/main.styl"

.order-confirm
  position relative
  flex-basis 20% !important

  .confirm
    display flex
    align-items center
    flex-basis 100%
    text-align center
    justify-content center

  .header
    text-transform uppercase

  .body
    display flex
    .form
      display flex
      flex-wrap wrap
      flex-basis 100%

      .field
        display flex
        flex-basis 100%
        flex-wrap wrap
        margin-bottom .5em

        &.total
          border-top 1px solid white
          padding-top .2em
        .info
          display flex
          align-items center
          flex-basis 100%
          font-size 14px
          font-weight 600
          margin-bottom 5px

          .max
            margin-left auto
            font-weight 800
            font-size 12px
            cursor pointer
          .amount
            color white
            margin-left auto
            font-weight 800
            font-size 14px
            cursor pointer

        input
          flex-basis 100%

        .button
          font-size 16px
          height 30px
          margin-top 1em
          margin-left auto
          flex-basis 100%
          background-color $color-green-dark
          border none
          text-transform uppercase
          &.sell
            background-color $color-red

</style>
