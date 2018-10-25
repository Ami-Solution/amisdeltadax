<template lang="pug">
.order-history.component
  .header
    span(@click="openOrders = true" :class="{'active': openOrders}") OPEN ORDERS
    span(@click="openOrders = false" :class="{'active': !openOrders}") RECENT TRADES

  .body
    open-order-list(:orders="orders" v-if="openOrders")
    recent-trades-list(:trades="trades" v-if="!openOrders")
  overlay(:visible="orderHistory.loading")
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import Overlay from '@/components/Overlay'
import OpenOrderList from '@/components/OpenOrderList'
import RecentTradesList from '@/components/RecentTradesList'

export default {
  name: 'OrderHistory',
  components: {
    Overlay,
    OpenOrderList,
    RecentTradesList,
  },
  data(){
    return {
      openOrders: false
    }
  },
  props: {
    open_buys: {
      type: Array,
      default: () => []
    },
    open_sells: {
      type: Array,
      default: () => []
    },
    trades: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    ...mapMutations({
      updateOrderForm: 'orders/UPDATE_ORDER_FORM'
    }),
  },
  computed: {
    ...mapGetters({
      orderHistory: "components/order_history",
    }),
    orders(){
      if(!this.openOrders){
        return this.filled_buys.concat(this.filled_sells).sort((a,b) => {
          if(a.date > b.date){
            return -1
          }
          if(a.date > b.date){
            return 1
          }
          return 0
        })
      } else {
        return this.open_buys.concat(this.open_sells).sort((a,b) => {
          if(a.date > b.date){
            return 1
          }
          if(a.date > b.date){
            return -1
          }
          return 0
        })
      }

    }
  },

  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

.order-history
  display flex
  flex-wrap wrap
  height 100%
  overflow hidden
  position relative

  .header
    display flex
    align-items center
    justify-content space-around
    span
      cursor pointer
      margin-right 10px
      color rgba(255, 255, 255, .5) !important
      transition all .2s

      &.active
        color #fff !important
        border-bottom 1px solid white

  .body
    display flex
    flex-wrap wrap
    height 100%


</style>
