import Vue from 'vue'
const base_url = "http://boards.4chan.org/"

export default {
  get_board_page: (board, page) => {
    return new Promise((resolve, reject) => {
      Vue.http.get(base_url + board + "/" + page + ".json").then(response => {
        console.log(response)
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  },
  get_thread: (board, id) => {
    return new Promise((resolve, reject) => {
      Vue.http.get(base_url + board + "/thread/" + id + ".json").then(response => {
        console.log(response)
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  }
}
