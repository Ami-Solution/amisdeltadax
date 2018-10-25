import Vue from 'vue'
const base_url = "https://api.fixer.io/"

export default {
  fetch_fiat_exchange_rates: (base) => {
    return new Promise((resolve, reject) => {
      Vue.http.get(base_url + "latest?base=" + "USD").then(response => {
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  },
  watch_fiat_exchange_rates: (base, rate, cb) => {
    return setInterval(()=>{
      this.a.fetch_fiat_exchange_rates(base).then(results => {
        cb(results)
      }).catch(error => {
        cb(error)
      })
    }, rate)
  }
}
