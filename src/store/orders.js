import Vue from 'vue'
import APIs from './apis'

// State
const state = {
  orders: [],
  buy_orders: [],
  sell_orders: [],
  order_form: {
    order_type: "buy",
    price: 0.000,
    volume: 0.000,
    expires: 10000,
    trade_order: null
  },
}


// Getters
const getters = {
  order_form: (state) => state.order_form,
  orders: (state) => {
    return state.buy_orders.concat(state.sell_orders)
  },
  buy_orders: (state, commit, rootState) => {
    return state.buy_orders
      .filter(order => {
        if(order.tokenGet == rootState.tokens.current_token.addr){
          return true
        } else {
          return false
        }
      })
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
  sell_orders: (state, commit, rootState) => {
    return state.sell_orders
      .filter(order => {
        if(order.tokenGive == rootState.tokens.current_token.addr){
          return true
        } else {
          return false
        }
      })
      .sort((a, b) => {
        if(a.price > b.price){
          return 1
        }
        if(a.price < b.price){
          return -1
        }
        return 0
      })
  },
}

var formatOrders = function(orders, current_token){
  log("current_token", current_token)
}

// Mutations
const mutations = {
  ["UPDATE_BUY_ORDERS"] (state, orders) {
    state.buy_orders = orders
  },
  ["UPDATE_SELL_ORDERS"] (state, orders) {
    state.sell_orders = orders
  },
  ["ADD_BUY_ORDERS"] (state, orders) {
    state.buy_orders = orders.concat(state.buy_orders)
  },
  ["ADD_SELL_ORDERS"] (state, orders) {
    state.sell_orders = orders.concat(state.sell_orders)
  },
  ["UPDATE_ORDER_FORM"] (state, form) {
    state.order_form = Object.assign({}, state.order_form, form)
  },
}

// Actions
const actions = {
  watch_orders: ({dispatch, commit, state, rootState}) => {
    APIs.EtherDelta.socket.on('orders', (orders) => {
      let sell_orders = APIs.EtherDelta.parseOrders(orders.sells, rootState.tokens.current_token)
      let buy_orders =  APIs.EtherDelta.parseOrders(orders.buys, rootState.tokens.current_token)
      commit("ADD_BUY_ORDERS", sell_orders)
      commit("ADD_SELL_ORDERS", buy_orders)
    })
  },
  place_order: ({commit, state}, {tokenGet, amountGet, tokenGive, amountGive, expires, nonce}) => {
    return APIs.EtherDelta.placeOrder(tokenGet, amountGet, tokenGive, amountGive, expires, nonce).then(result => {
      log("result ", result)
      return result
    }, error => {
      log("error ", error)
      throw error
    })
  },
  cancel_order: ({commit, state}, {tokenGet, amountGet, tokenGive, amountGive, expires, nonce, v, r, s}) => {
    return APIs.EtherDelta.cancelOrder(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, v, r, s).then(result => {
      log("result ", result)
      return result
    }, error => {
      log("error ", error)
      throw error
    })
  },
}


export default  {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
