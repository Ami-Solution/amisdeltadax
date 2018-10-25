import Vue from 'vue'

const base_url = "https://shapeshift.io/"

export default {
  fetch_shapeshift_market_info: () => {
    return new Promise((resolve, reject) => {
      Vue.http.get(base_url + "marketinfo").then(response => {
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  }
}
