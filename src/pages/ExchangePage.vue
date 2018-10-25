<template lang="pug">
#exchange-page
  .left-container
    balance(:token="token" :current_wallet="current_wallet" :ed_wallet="ed_wallet")
    order-form(:token="token")

  .orders-container
    order-book(:buys="buy_orders", :sells="sell_orders")

  .depth-chart-container
    depth-chart(:buys="buy_orders", :sells="sell_orders")

  .price-chart-container
    price-chart(:trades="trades")
    order-history(:open_buys="user_buy_orders", :open_sells="user_sell_orders", :trades="recent_trades")

  .trade-history-container
    trade-history(:trades="trades")


</template>

<script>
import Balance from "@/components/Balance"
import TradeHistory from "@/components/TradeHistory"
import OrderHistory from "@/components/OrderHistory"
import OrderBook from "@/components/OrderBook"
import OrderForm from "@/components/OrderForm"
import DepthChart from "@/components/graphs/DepthChart"
import PriceChart from "@/components/graphs/PriceChart"
import { mapGetters, mapActions, mapMutations } from 'vuex'

import APIs from '../store/apis'

export default {
  name: 'ExchangePage',
  components: {
    Balance,
    OrderForm,
    OrderHistory,
    OrderBook,
    DepthChart,
    PriceChart,
    TradeHistory,
  },
  computed: {
    ...mapGetters({
      trades: 'trades/current_token_trades',
      buy_orders: 'orders/buy_orders',
      sell_orders: 'orders/sell_orders',
      current_wallet: 'users/current_wallet',
      ed_wallet: 'users/ed_wallet',
      recent_trades: 'users/trades',
      user_sell_orders: 'users/sell_orders',
      user_buy_orders: 'users/buy_orders',
      tokens: 'tokens/tokens',
      token: 'tokens/current_token',
    })
  },
  methods: {
    ...mapActions({
      watchOrders: 'orders/watch_orders',
      watchTrades: 'trades/watch_trades',
      updateCurrentWallet: 'users/update_current_wallet',
      initCurrentMarket: 'markets/init_current_market',
      watchCurrentMarket: 'markets/watch_current_market',
      updateEdWallet: 'users/update_ed_wallet',
    }),
    ...mapMutations({
      openModal: "components/OPEN_MODAL",
      closeModal: "components/CLOSE_MODAL",
      updateCurrentToken: "tokens/UPDATE_CURRENT_TOKEN",
      updateTokenFilter: "tokens/UPDATE_TOKEN_FILTER",
      updateCurrentAddress: 'users/UPDATE_CURRENT_ADDRESS',
    }),
    initMarket(trys=0){
      // log("trys: ", trys)
      this.initCurrentMarket().then(market => {
        // this.closeModal()
        // this.watchMarket()
      }, error => {
        // back off, ED rate limit is 12 req/min
        if(trys > 12){
          trys = 0
        } else {
          trys++
        }
        setTimeout(()=>{
          this.initMarket(trys)
        }, trys * 1000)
      })
    },
    watchMarket(){
      this.watchCurrentMarket().then(market => {

      }, error => {
        // TODO back off, ED rate limit is 12 req/min
        // this.watchMarket()
      })
    },
    watchWallets(){
      this.updateCurrentWallet()
      this.updateEdWallet()
      setInterval(()=> {
        this.updateCurrentWallet()
        this.updateEdWallet()
      }, 1000)
    },
    watchCurrentAddress(){
      this.updateCurrentAddress()
      setInterval(()=> {
        this.updateCurrentAddress()
      }, 1000)
    },

  },
  watch: {
    trades: function(){
      if(this.trades.length){
        document.title = this.token.name + " " + this.trades[0].price
      }
    }
  },
  created(){
    // this.openModal("LoadingOverlay")
    let param_token = null
    if(this.$route.params.token){
      param_token = this.tokens.find(t => {
        return t.name.toLowerCase() == this.$route.params.token.toLowerCase()
      })

      if(param_token){
        this.updateCurrentToken(param_token)
        this.updateTokenFilter(param_token.name)
      }
    }

    // After the ED websocket has been initialized, init, and then watch the market
    APIs.EtherDelta.initSocket().then(() => {
      this.initMarket()
    })

    // Update wallets, and then update again every second
    this.watchWallets()

    // Update current MetaMask address
    this.watchCurrentAddress()

  },
  mounted(){

  }
}
</script>

<style lang="stylus" scoped>
#exchange-page
  display flex
  flex-basis 100%
  height 100%

  .left-container
    flex-basis 15%

  .order-form-container
    flex-basis 15%

  .orders-container
    flex-basis 17%

    // .order-book
    //   height 70% !important


  .depth-chart-container
    flex-basis 18%

  .price-chart-container
    flex-basis 35%
    .price-chart
      height 70% !important
    .order-history
      height 30% !important
  .trade-history-container
    margin-left auto
    flex-basis 15%


</style>
