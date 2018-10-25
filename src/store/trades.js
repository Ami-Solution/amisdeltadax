 import Vue from 'vue'
import APIs from './apis'

// State
const state = {
  trades: [],
  current_token_trades: [],
  trade_order: {}
}

// Getters
const getters = {
  trades: (state) => state.trades,
  trade_order: (state) => state.trade_order,
  current_token_trades: (state, commit, rootState) => {
    return state.trades.filter(trade => {
      if(trade.tokenAddr == rootState.tokens.current_token.addr){
        return true
      } else {
        return false
      }
    })
  },
}

// Mutations
const mutations = {
  ["ADD_TRADES"] (state, trades) {
    state.trades = trades.concat(state.trades)
  },
  ["UPDATE_TRADES"] (state, trades) {
    state.trades = trades
  },
  ["UPDATE_TRADE_ORDER"] (state, order) {
    state.trade_order = order
  },
}

// Actions
const actions = {
  watch_trades: ({commit, state, rootState}) => {
    APIs.EtherDelta.socket.on('trades', (trades) => {
      let parsed_trades = APIs.EtherDelta.parseTrades(trades, rootState.tokens.current_token)
      commit("ADD_TRADES", parsed_trades, )
    })
  },
  trade: ({commit, state}, {tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount}) => {
    return APIs.EtherDelta.trade(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount).then(result => {
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
