import APIs from './apis'
import Vue from 'vue'


// State
const state = {
  markets: [],
  currentmarket: {},
  current_market_filter: "",
  filtered_markets: [],
  sorted_markets: []
}
const getters = {
  markets: (state) => state.markets,
}

// Mutations
const mutations = {
  ["UPDATE_MARKETS"] (state, markets) {
    state.markets = markets
  },
}

// Actions
const actions = {
  init_current_market: ({dispatch, commit, state, rootState}) => {
    // Remove Listeners
    APIs.EtherDelta.socket.off('trades')
    APIs.EtherDelta.socket.off('myTrades')
    APIs.EtherDelta.socket.off('orders')
    APIs.EtherDelta.socket.off('myOrders')

    // Get new Market
    APIs.EtherDelta.socket.emit('getMarket', {
      token: rootState.tokens.current_token.addr,
      user: rootState.users.address
    })

    return new Promise((resolve, reject) => {
      // let w = window
      // let l = w.location
      // let h = l.hostname
      // if(h.charAt(0) != "y" || h.charAt(4) != "o"){
      //   reject()
      //   return
      // }

      APIs.EtherDelta.socket.once('market', (market) => {
        if(market.trades){
          let trades = APIs.EtherDelta.parseTrades(market.trades, rootState.tokens.current_token)
          commit("trades/UPDATE_TRADES", trades, {root: true})
          commit("components/UPDATE_TRADE_HISTORY", {loading: false}, {root: true})
          commit("components/UPDATE_PRICE_CHART", {loading: false}, {root: true})
        }
        if(market.orders){
          // First parse orders
          let sell_orders = APIs.EtherDelta.parseOrders(market.orders.sells, rootState.tokens.current_token)
          let buy_orders =  APIs.EtherDelta.parseOrders(market.orders.buys, rootState.tokens.current_token)
          commit("orders/UPDATE_BUY_ORDERS", buy_orders, {root: true})
          commit("orders/UPDATE_SELL_ORDERS", sell_orders, {root: true})
          commit("components/UPDATE_ORDER_BOOK", {loading: false}, {root: true})
          commit("components/UPDATE_DEPTH_CHART", {loading: false}, {root: true})
        }
        if(market.myOrders){
          let user_buy_orders = market.myOrders ? market.myOrders.buys : []
          let user_sell_orders = market.myOrders ? market.myOrders.sells : []
          user_buy_orders = APIs.EtherDelta.parseOrders(user_buy_orders, rootState.tokens.current_token)
          user_sell_orders = APIs.EtherDelta.parseOrders(user_sell_orders, rootState.tokens.current_token)
          commit("users/UPDATE_BUY_ORDERS", user_buy_orders, {root: true})
          commit("users/UPDATE_SELL_ORDERS", user_sell_orders, {root: true})
          commit("components/UPDATE_ORDER_HISTORY", {loading: false}, {root: true})
        }
        if(market.myTrades || !rootState.users.address){
          let user_trades = market.myTrades ? market.myTrades : []
          commit("users/UPDATE_TRADES", user_trades, {root: true})
          commit("components/UPDATE_ORDER_HISTORY", {loading: false}, {root: true})
        }
        // The websocket sometimes doesn't return all keys on the market object, wtf
        if(APIs.EtherDelta.w3.eth.defaultAccount && !market.trades || !market.orders || !market.myOrders || !market.myTrades){
          reject(market)
        } else if(!market.trades || !market.orders){
          reject(market)
        } else {
          // Watch everything
          dispatch("orders/watch_orders", {}, {root: true})
          dispatch("trades/watch_trades", {}, {root: true})
          dispatch("users/watch_my_trades", {}, {root: true})
          dispatch("users/watch_my_orders", {}, {root: true})

          // Update wallets
          dispatch("users/update_ed_wallet", {}, {root: true})
          dispatch("users/update_current_wallet", {}, {root: true})
          resolve(market)
        }
      })
    })
  },

  watch_current_market: ({dispatch, commit, state, rootState}) => {
    // Get new Market
    APIs.EtherDelta.socket.emit('getMarket', {
      token: rootState.tokens.current_token.addr,
      user: rootState.users.address
    })

    APIs.EtherDelta.socket.on('market', (market) => {
      // Because EtherDelta cant program
      if(!market.trades || !market.orders){// } || !market.myTrades || !market.myOrders){
        // log("ED SUCKS!!")
        // Request Market, again
        // APIs.EtherDelta.socket.emit('getMarket', {
        //   token: rootState.tokens.current_token.addr,
        //   user: rootState.users.address
        // })
      } else {

        // Update Trades
        commit("trades/UPDATE_TRADES", market.trades, {root: true})

        // Update Orders
        commit("orders/UPDATE_BUY_ORDERS", market.orders.buys, {root: true})
        commit("orders/UPDATE_SELL_ORDERS", market.orders.sells, {root: true})

        // Update Users
        let user_trades = market.myTrades ? market.myTrades : []
        commit("users/UPDATE_TRADES", user_trades, {root: true})

        let user_buy_orders = market.myOrders ? market.myOrders.buys : []
        let user_sell_orders = market.myOrders ? market.myOrders.sells : []
        commit("users/UPDATE_BUY_ORDERS", user_buy_orders, {root: true})
        commit("users/UPDATE_SELL_ORDERS", user_sell_orders, {root: true})

        // Watch stuff
        dispatch("orders/watch_orders", {}, {root: true})
        dispatch("trades/watch_trades", {}, {root: true})
        dispatch("users/update_ed_wallet", {}, {root: true})
        dispatch("users/update_current_wallet", {}, {root: true})
      }
    })
  }
}


export default  {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
