import APIs from '../apis'
const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

// State
const state = {
  lang: "en-US",
  address: APIs.EtherDelta.w3.eth.defaultAccount,
  current_wallet: {
    address: APIs.EtherDelta.w3.eth.defaultAccount,
    eth_balance: 0.0,
    current_token_balance: 0.0,
  },
  ed_wallet: {
    address: APIs.EtherDelta.w3.eth.defaultAccount,
    eth_balance: 0.0,
    current_token_balance: 0.0
  },
  trades: [],
  orders: [],
  buy_orders: [],
  sell_orders: [],
  tokens: [],
  wallets: []
}

// Getters
var getters = {
  ed_wallet: state => state.ed_wallet,
  current_wallet: state => state.current_wallet,
  wallets: state =>  state.wallets,
  lang: state => state.lang,
  address: state => state.address,
  trades: state => state.trades,
  filled_buys: (state) => {
    return state.trades.filter(t => {
      if(t.side == 'buy'){
        return true
      } else {
        return false
      }
    })
  },
  filled_sells: (state) => {
    return state.trades.filter(t => {
      if(t.side == 'sell'){
        return true
      } else {
        return false
      }
    })
  },
  buy_orders: state => state.buy_orders,
  sell_orders: state => state.sell_orders,
  orders: (state) => {
    return state.buy_orders.concat(state.sell_orders)
  },
}

// Mutations
var mutations = {
  ["UPDATE_LANG"] (state, lang) {
    state.lang = lang
  },
  ["UPDATE_CURRENT_WALLET"] (state, wallet) {
    state.current_wallet = wallet
  },
  ["UPDATE_ED_WALLET"] (state, wallet) {
    state.ed_wallet = wallet
  },
  ["ADD_WALLET"] (state, account) {
    state.accounts.push(account)
  },
  ["UPDATE_WALLETS"] (state, wallets) {
    state.wallets = wallets
  },
  ["UPDATE_CURRENT_ADDRESS"] (state, wallet) {
    state.address = APIs.EtherDelta.w3.eth.defaultAccount
  },
  ["UPDATE_TRADES"] (state, trades) {
    state.trades = trades
  },
  ["ADD_TRADES"] (state, trades) {
    state.trades = trades.concat(state.trades)
  },
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
}

// Actions
var actions = {
  save_user: ({ commit, state }) => {
    let user = JSON.stringify(state)
    localStorage.setItem("user", user)
  },
  update_current_wallet: ({ commit, state, rootState }) => {
    if(state.address && rootState.tokens.current_token.addr){
      let wallet = Object.assign({}, state.current_wallet)
      let address = APIs.EtherDelta.w3.eth.defaultAccount
      // Get ETH Balance
      APIs.EtherDelta.getBalance(ETH_ADDRESS, address).then(results => {
        wallet.eth_balance = results
      })

      // Get Current Token Balance
      APIs.EtherDelta.getBalance(rootState.tokens.current_token.addr, address).then(results => {
        wallet.current_token_balance = results
      })

      commit("UPDATE_CURRENT_WALLET", wallet)
    }
  },
  watch_my_trades: ({dispatch, commit, state, rootState}) => {
    APIs.EtherDelta.socket.on('myTrades', (trades) => {
      log("NEW Trades: ", trades)
      trades = APIs.EtherDelta.parseTrades(trades, rootState.tokens.current_token)
      commit("ADD_TRADES", trades)
    })
  },
  watch_my_orders: ({dispatch, commit, state, rootState}) => {
    APIs.EtherDelta.socket.on('myOrders', (orders) => {
      log("NEW ORDER: ", orders)
      let sell_orders = APIs.EtherDelta.parseOrders(orders.sells, rootState.tokens.current_token)
      let buy_orders =  APIs.EtherDelta.parseOrders(orders.buys, rootState.tokens.current_token)
      commit("ADD_BUY_ORDERS", sell_orders)
      commit("ADD_SELL_ORDERS", buy_orders)
    })
  },
  update_ed_wallet: ({ commit, state, rootState }) => {
    if(state.address && rootState.tokens.current_token.addr){
      let wallet = Object.assign({}, state.ed_wallet)
      let address = APIs.EtherDelta.w3.eth.defaultAccount
      // Get ETH Balance in EtherDelta
      APIs.EtherDelta.getEtherDeltaBalance(ETH_ADDRESS, address).then(results => {
        wallet.eth_balance = results
      })

      // Get Current Token Balance in EtherDelta
      APIs.EtherDelta.getEtherDeltaBalance(rootState.tokens.current_token.addr, address).then(results => {
        wallet.current_token_balance = results
      })

      commit("UPDATE_ED_WALLET", wallet)
    }
  },

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
