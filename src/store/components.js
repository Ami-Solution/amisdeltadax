// State
const state = {
  navbar: {
    brand: "AmisDeltaDax",
    searching: false,
    search: "",
  },
  balance: {
    loading: true
  },
  order_form: {
    loading: true
  },
  order_book: {
    loading: true
  },
  order_history: {
    loading: true
  },
  order_confirm: {
    loading: false
  },
  donate_modal: {
    loading: false
  },
  depth_chart: {
    loading: true
  },
  price_chart: {
    loading: true
  },
  trade_history: {
    loading: true
  },
  trade_confirm: {
    loading: false
  },
  modal_loader: {
    current_modal: null
  },
  toast: {
    message: "",
    duration: 2000,
    visible: false
  },
}

// Getters
var getters = {
  navbar: (state) => state.navbar,
  order_form: (state) => state.order_form,
  order_book: (state) => state.order_book,
  order_history: (state) => state.order_history,
  order_confirm: (state) => state.order_confirm,
  depth_chart: (state) => state.depth_chart,
  donate_modal: (state) => state.donate_modal,
  price_chart: (state) => state.price_chart,
  trade_history: (state) => state.trade_history,
  trade_confirm: (state) => state.trade_confirm,
  modal_loader: (state) => state.modal_loader,
  toast: (state) => state.toast,
}

// Mutations
var mutations = {
  ["UPDATE_NAVBAR"] (state, navbar) {
    state.navbar = navbar
  },
  ["UPDATE_ORDER_FORM"] (state, order_form) {
    state.order_form = order_form
  },
  ["UPDATE_ORDER_BOOK"] (state, order_book) {
    state.order_book = order_book
  },
  ["UPDATE_ORDER_CONFIRM"] (state, order_confirm) {
    state.order_confirm = order_confirm
  },
  ["UPDATE_TRADE_HISTORY"] (state, trade_history) {
    state.trade_history = trade_history
  },
  ["UPDATE_ORDER_HISTORY"] (state, order_history) {
    state.order_history = order_history
  },
  ["UPDATE_DEPTH_CHART"] (state, depth_chart) {
    state.depth_chart = depth_chart
  },
  ["UPDATE_PRICE_CHART"] (state, price_chart) {
    state.price_chart = price_chart
  },
  ["UPDATE_TRADE_CONFIRM"] (state, trade_confirm) {
    state.trade_confirm = trade_confirm
  },
  ["UPDATE_MODAL_LOADER"] (state, modal_loader) {
    state.modal_loader = modal_loader
  },
  ["SHOW_ALL_LOADING"] (state) {
    let loading = {loading: true}
    state.depth_chart = loading
    state.price_chart = loading
    state.order_history = loading
    state.trade_history = loading
    state.order_book = loading
    state.order_form = loading
  },
  ["OPEN_MODAL"] (state, modal) {
    state.modal_loader.current_modal = modal
  },
  ["CLOSE_MODAL"] (state) {
    state.modal_loader.current_modal = null
  },
  ["OPEN_TOAST"] (state, message) {
    state.toast.message = message
    state.toast.visible = true
    setTimeout(()=> {
      state.toast.visible = false
    }, state.toast.duration)
  },

}

// Actions
var actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
