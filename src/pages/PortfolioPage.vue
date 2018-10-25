<template lang="pug">
#protfolio-page


</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import APIs from '../store/apis'
import ABIEtherDelta from '../store/apis/EtherDelta/EtherDeltaABI.json'
import ABIToken from '../store/apis/EtherDelta/TokenABI.json'

export default {
  name: 'PortfolioPage',
  components: {

  },
  computed: {
    ...mapGetters({
      // current_market: 'markets/current_market',
      // trades: 'trades/current_market_trades',
      // buy_orders: 'orders/current_market_buy_orders',
      // sell_orders: 'orders/current_market_sell_orders',
      // current_wallet: 'users/current_wallet',
      // ed_wallet: 'users/ed_wallet',
    })
  },
  methods: {
    ...mapActions({
      // watchOrders: 'orders/watch_orders',
      // watchTrades: 'trades/watch_trades',
      // getMarkets: 'markets/get_markets',
      // updateCurrentWallet: 'users/update_current_wallet',
      // updateEdWallet: 'users/update_ed_wallet',
      // updateCurrentMarket: "markets/update_current_market",
    }),
    ...mapMutations({

    }),
  },
  created(){
    // APIs.EtherDelta.initSocket().then(socket => {

    // })
    // this.updateCurrentWallet()
    // this.updateEdWallet()

    // var contractAbi = eth.contract(AbiOfContract);
    // var myContract = contractAbi.at(contractAddress);
    // // suppose you want to call a function named myFunction of myContract
    // var getData = myContract.myFunction.getData(function parameters);
    // //finally paas this data parameter to send Transaction
    // web3.eth.sendTransaction({to:Contractaddress, from:Accountaddress, data: getData});
  },
  mounted(){
    log("#######################")
    let w3 = new Web3(web3.currentProvider);
    let user_addr = w3.eth.accounts[0]
    log('user_addr: ', user_addr)


    let contract = w3.eth.contract(ABIEtherDelta).at("0x8d12a197cb00d4747a1fe03395095ce2a5cc6819")

    // log(contract)
    // contract.deposit(result => {
    //   log("taco: ", result)
    // }).then(results => {
    //   log("result: ", results)
    // })

    let amount = w3.toWei('.001', 'ether')
    log(amount)

    // contract.deposit({value: amount}, result =>{
    //   log("taco: ", result)
    // }).then(results => {
    //   log("results: ", results)
    // }).catch(error => {
    //   log("error: ", error)
    // })

    // log(data)

    // web3.eth.sendTransaction({data: data}, function(err, transactionHash) {
    //   if (!err)
    //     console.log(transactionHash);
    //   else
    //     log(err)
    // });



  }
}
</script>

<style lang="stylus" scoped>
#portfolio-page
  display flex
  flex-basis 100%
  height 100%


</style>
