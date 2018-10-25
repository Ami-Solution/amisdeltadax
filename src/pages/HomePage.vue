<template lang="pug">
#home-page
  .background
    depth-chart(:buys="buys", :sells="sells")

  .section
    h1.brand(:to="{name: 'home'}" tag="span")
      span.delta Delta
      span.dax DAX

    .box
      p DeltaDax is a new UI for EtherDelta, inspired by GDAX. All orders use EtherDelta's decenteralized contract and API
      p An attempt to Provide the Ethereum community with a more intuitive way to interact with the EtherDelta exchange
      p Currently only MetaMask compatible
      p Software is provided as is, WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
      p or FITNESS FOR A PARTICULAR PURPOSE. Use at your own risk.
      p Report an Issue or ask a Question - <a href="https://github.com/ami-solution/dexter/issues" target="_blank"> https://github.com/ami-solution/dexter/issues</a>

  .visit.section
    router-link.visit-button(:to="{name: 'exchange', params: {token: 'AMIS'}}" tag="span") View Exchange
</template>

<script>
import * as d3 from 'd3'
import moment from 'moment'
import DepthChart from '@/components/graphs/Depth'

export default {
  name: 'HomePage',
  data(){
    return {
      buys: [],
      sells: []
    }
  },
  components: {
    DepthChart
  },
  methods: {
    generateOrder(minPrice=.001, maxPrice=.01, minVolume=1, maxVolume=100000){
      return {
        price: d3.randomUniform(minPrice, maxPrice)(),
        volume: d3.randomUniform(minVolume, maxVolume)(),
      }
    },
    randomizeOrders(){
      let variance = 10
      let buy_remove_index = d3.randomUniform(0, this.buys.length - 1)()
      let sell_remove_index = d3.randomUniform(0, this.sells.length - 1)()
      let buy_remove_count = d3.randomUniform(1, variance)()
      let sell_remove_count = d3.randomUniform(1, variance)()
      let buy_add_count = d3.randomUniform(1, variance)()
      let sell_add_count = d3.randomUniform(1, variance)()

      this.buys.splice(buy_remove_index, buy_remove_count)
      this.sells.slice(sell_remove_index, sell_remove_count)

      while(buy_add_count > 0){
        this.buys.push(this.generateOrder(.001, .005))
        --buy_add_count
      }
      while(sell_add_count > 0){
        this.sells.push(this.generateOrder(.005))
        --sell_add_count
      }
    }
  },
  mounted(){
    let initial_order_count = 100
    while(initial_order_count > 0){
      this.buys.push(this.generateOrder(.001, .005))
      this.sells.push(this.generateOrder(.005))
      --initial_order_count
    }

    setInterval(()=>{
      this.randomizeOrders()
    }, 2000)
  }
}
</script>

<style lang="stylus">
@import "../styles/main.styl"

#home-page
  display flex
  flex-basis 100%
  flex-wrap wrap
  height 100%
  justify-content center
  height calc(100vh + 50px)
  padding 0em 6em
  position relative
  z-index 2
  background-color #feffff
  // background linear-gradient(to left, rgba(30, 43, 52, .5) 10%, white , rgba(30, 43, 52, .5) 90%);
  // background linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);

  .links {
    stroke: #000
    stroke-opacity: 0.1;
  }

  .polygons {
    fill: none;
    stroke: #000;
    stroke-opacity: 0.2;
  }

  .polygons :first-child {
    fill: $color-purple
    fill-opacity: 0.2;
  }

  .sites {
    fill: #000;
    stroke: #fff;
  }

  .sites :first-child {
    fill: #fff;
  }


  .background
    position absolute
    height 100vh
    width 100vw
    // opacity .5
    svg
      height 100%
      width 100%


  .brand
    flex-basis 100%
    font-weight bold
    align-items center
    cursor pointer
    padding-bottom .1em
    text-align center
    // border-bottom 5px solid #1E2B34
    margin-bottom 2em

    .delta
      color #0067CD
      font-size 2.1em
      font-family 'Open Sans', sans-serif
      font-weight 600

    .hyph
      color $color-text-invert
      margin-right .1em
      margin-left .1em
      font-size 2em

    .dax
      color rgba(30, 43, 52, 0.83)
      font-size 2em
      font-family 'Russo One', sans-serif
      height 1.0em

  .section
    font-size 18px
    flex-wrap wrap
    z-index 2
    justify-content center

    .box
      border-radius: 6px;
      background-color: rgba(255, 255, 255, .5)
      box-shadow: 0 2px 4px 0 rgba(60,72,88,.4);
      border: 1px solid #eceff9;

      margin-top 2em
      padding 2em 4em

      p
        font-size 18px
        color rgba(30, 43, 52, 0.83)

  .visit
    align-items baseline
    justify-content center
    flex-basis 100%
    display flex
    .visit-button
      z-index 3
      cursor pointer
      border-radius 4px
      border 2px solid rgba(0, 0, 0, .3)
      color rgba(0, 0, 0, .8)
      padding 1em 2em
      transition all .3s
      font-size 22px
      &:hover
        background rgba(0, 0, 0, .1)


</style>
