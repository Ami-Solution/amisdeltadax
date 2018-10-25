import Vue from 'vue'
const base_url = "https://min-api.cryptocompare.com/"

export default {
  fetch_currency_history_by_minute: (symbol) => {
    if(symbol == "MIOTA"){
      symbol = "IOT"
    }
    return new Promise((resolve, reject) => {
      Vue.http.get(base_url + "data/histominute?fsym=" + symbol + "&tsym=USD&limit=1440&aggregate=60&e=CCCAGG").then(response => {
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  },
  watch_currency_history_by_minute: (symbol, rate, cb) => {
    return setInterval(()=>{
      this.a.fetch_currency_history_by_minute(symbol).then(results => {
        cb(results)
      }).catch(error => {
        cb(error)
      })
    }, rate)
  }
}
