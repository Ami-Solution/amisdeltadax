// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import moment from 'moment'

// Sync the store with the router
sync(store, router)

// Install VueResource
import VueResource from 'vue-resource'
Vue.use(VueResource);

// Put these somewhere else?
window.log = console.log
window.moment = moment
Vue.config.productionTip = false

// Move to Service Worker?
// store.dispatch("users/load_user")
// window.onbeforeunload = function(event) {
//   // store.dispatch("users/save_user")
// };


// Helpers TODO - move
String.prototype.hexEncode = function(){
  var hex, i;

  var result = "";
  for (i=0; i<this.length; i++) {
    hex = this.charCodeAt(i).toString(16);
    result += ("000"+hex).slice(-4);
  }
  return result
}

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
