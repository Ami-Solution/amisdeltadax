import Vue from 'vue'
const base_url = "https://api.coinmarketcap.com/"

export default {
  fetch_currencies: (limit) => {
    return new Promise((resolve, reject) => {
      Vue.http.get(base_url + "v1/ticker/?limit=" + limit).then(response => {
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  },
  watch_currencies: (limit, rate, cb) => {
    return setInterval(()=>{
      this.a.fetch_currencies(limit).then(results => {
        cb(results)
      }).catch(error => {
        cb(error)
      })
    }, rate)
  }
}
